import { getAllRecipes } from "./recipes-repository";
import { getServerSupabase } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

/**
 * Calculates exponential decay factor for events based on days elapsed
 * Half-life of 7 days: an interaction from 7 days ago has 50% weight.
 */
function calculateRecencyWeight(createdAt, halfLifeDays = 7) {
  if (!createdAt) return 0.5;
  const ageMs = Date.now() - new Date(createdAt).getTime();
  const ageDays = Math.max(0, ageMs / (1000 * 60 * 60 * 24));
  return Math.pow(0.5, ageDays / halfLifeDays);
}

/**
 * Deterministic rule-based personalized recommendation engine
 */
export async function getPersonalizedRecommendations({
  userId = null,
  limit = 10,
}) {
  const allRecipes = await getAllRecipes();

  // If unauthenticated or Supabase not configured, provide curated, popular & diverse recipes
  if (!userId || !isSupabaseConfigured()) {
    return generateColdStartRecommendations(allRecipes);
  }

  try {
    const supabase = await getServerSupabase();
    if (!supabase) {
      return generateColdStartRecommendations(allRecipes);
    }

    // 1. Fetch user search history
    const { data: searchHistory } = await supabase
      .from("search_history")
      .select("query, normalized_query, category, selected_recipe_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);

    // 2. Fetch user interactions (views, saves, clicks)
    const { data: interactions } = await supabase
      .from("recipe_interactions")
      .select("recipe_id, interaction_type, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    // 3. Fetch user favorites
    const { data: favorites } = await supabase
      .from("user_favorites")
      .select("recipe_id, created_at")
      .eq("user_id", userId);

    // 4. Fetch user preferences (dietary restrictions, excluded allergens)
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    const excludedAllergens = preferences?.excluded_ingredients || [];
    const preferredCuisines = preferences?.preferred_cuisines || [];
    const dietaryPrefs = preferences?.dietary_preferences || [];

    // If user has zero recorded history or interactions, return diverse cold start
    const hasHistory =
      (searchHistory && searchHistory.length > 0) ||
      (interactions && interactions.length > 0) ||
      (favorites && favorites.length > 0) ||
      preferredCuisines.length > 0;

    if (!hasHistory) {
      return generateColdStartRecommendations(allRecipes, excludedAllergens);
    }

    // --- STEP A: Build User Affinity Profiles ---
    const cuisineScores = {};
    const categoryScores = {};
    const ingredientKeywords = {};
    const interactedRecipeIds = new Set();
    const savedRecipeIds = new Set((favorites || []).map((f) => f.recipe_id));

    // A1. Explicit cuisine preferences from profile
    preferredCuisines.forEach((c) => {
      cuisineScores[c] = (cuisineScores[c] || 0) + 4.0;
    });

    // A2. Extract affinities from search history
    (searchHistory || []).forEach((sh) => {
      const recency = calculateRecencyWeight(sh.created_at, 7);
      const queryWords = sh.normalized_query.split(" ").filter((w) => w.length > 2);

      queryWords.forEach((word) => {
        ingredientKeywords[word] = (ingredientKeywords[word] || 0) + 1.5 * recency;
      });

      if (sh.category) {
        categoryScores[sh.category] = (categoryScores[sh.category] || 0) + 2.0 * recency;
      }

      if (sh.selected_recipe_id) {
        interactedRecipeIds.add(sh.selected_recipe_id);
      }
    });

    // A3. Extract affinities from interactions
    (interactions || []).forEach((inter) => {
      const recency = calculateRecencyWeight(inter.created_at, 10);
      interactedRecipeIds.add(inter.recipe_id);

      const recipe = allRecipes.find((r) => r.id === inter.recipe_id);
      if (recipe) {
        let weight = 1.0; // view
        if (inter.interaction_type === "save") weight = 4.0;
        else if (inter.interaction_type === "cook") weight = 5.0;
        else if (inter.interaction_type === "search_select") weight = 2.5;

        cuisineScores[recipe.cuisine] = (cuisineScores[recipe.cuisine] || 0) + weight * recency;
        categoryScores[recipe.category] = (categoryScores[recipe.category] || 0) + (weight * 0.8) * recency;
      }
    });

    // Find the top favorite cuisine
    const topCuisine = Object.entries(cuisineScores).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    // --- STEP B: Score Every Candidate Recipe ---
    const scoredRecipes = [];

    for (const recipe of allRecipes) {
      // 1. Hard filter: allergen exclusion
      if (excludedAllergens.length > 0) {
        const containsAllergen = recipe.allergens.some((alg) =>
          excludedAllergens.some((exc) => alg.toLowerCase().includes(exc.toLowerCase()))
        );
        if (containsAllergen) continue;
      }

      // 2. Hard filter: dietary restrictions (e.g. Vegan, Vegetarian)
      if (dietaryPrefs.includes("Vegan") && recipe.category !== "Vegan") continue;
      if (
        dietaryPrefs.includes("Vegetarian") &&
        recipe.category !== "Vegetarian" &&
        recipe.category !== "Vegan"
      ) {
        continue;
      }

      let score = 0;
      const reasons = [];

      // Cuisine affinity match
      if (cuisineScores[recipe.cuisine]) {
        const cScore = Math.min(cuisineScores[recipe.cuisine] * 2.5, 12);
        score += cScore;
        reasons.push(`Matches your interest in ${recipe.cuisine} dishes`);
      }

      // Category affinity match
      if (categoryScores[recipe.category]) {
        score += Math.min(categoryScores[recipe.category] * 1.5, 6);
      }

      // Ingredient keyword matches from recent searches
      let matchedIngredients = 0;
      for (const [kw, kwWeight] of Object.entries(ingredientKeywords)) {
        const matchesIng = recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(kw));
        const matchesTitle = recipe.title.toLowerCase().includes(kw);
        if (matchesIng || matchesTitle) {
          score += kwWeight * 2.0;
          matchedIngredients++;
          if (reasons.length < 2) {
            reasons.push(`Contains '${kw}', which you recently searched for`);
          }
        }
      }

      // Base quality score (ratings)
      score += (recipe.rating || 4.5) * 1.2;

      // Slight diversity adjustment: already saved dishes get slightly lower recommendation score to promote discovery
      if (savedRecipeIds.has(recipe.id)) {
        score -= 2.0;
      }

      scoredRecipes.push({
        recipe,
        score,
        reason: reasons[0] || "Highly rated in the CraveAI culinary catalog",
      });
    }

    // Sort by final weighted score descending
    scoredRecipes.sort((a, b) => b.score - a.score);

    // --- STEP C: Assemble Categorized Sections ---

    // 1. Recommended for you (top scored)
    const recommendedForYou = scoredRecipes.slice(0, 6).map((item) => ({
      ...item.recipe,
      recommendationReason: item.reason,
    }));

    // 2. Based on Recent Searches
    const searchTerms = (searchHistory || []).map((s) => s.normalized_query).slice(0, 3);
    const basedOnRecentSearches = allRecipes
      .filter((r) =>
        searchTerms.some(
          (t) =>
            r.title.toLowerCase().includes(t) ||
            r.cuisine.toLowerCase().includes(t) ||
            r.ingredients.some((ing) => ing.name.toLowerCase().includes(t))
        )
      )
      .slice(0, 4)
      .map((r) => ({
        ...r,
        recommendationReason: `Based on your recent search for "${searchTerms[0]}"`,
      }));

    // 3. Because You Like [Top Cuisine]
    let becauseYouLikeCuisine = [];
    if (topCuisine) {
      becauseYouLikeCuisine = allRecipes
        .filter((r) => r.cuisine === topCuisine)
        .slice(0, 4)
        .map((r) => ({
          ...r,
          recommendationReason: `Because you enjoy ${topCuisine} cooking`,
        }));
    }

    // 4. Popular Right Now
    const popularRightNow = [...allRecipes]
      .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
      .slice(0, 4)
      .map((r) => ({
        ...r,
        recommendationReason: "Trending favorite among home chefs",
      }));

    // 5. Explore Something New (Cuisines outside top scored)
    const knownCuisines = new Set(Object.keys(cuisineScores));
    const exploreSomethingNew = allRecipes
      .filter((r) => !knownCuisines.has(r.cuisine))
      .slice(0, 4)
      .map((r) => ({
        ...r,
        recommendationReason: `Expand your culinary palate with ${r.cuisine}`,
      }));

    return {
      personalized: true,
      sections: [
        {
          id: "recommended-for-you",
          title: "Recommended for You",
          subtitle: "Tailored to your taste profile, recent searches, and favored cuisines",
          recipes: recommendedForYou,
        },
        ...(basedOnRecentSearches.length > 0
          ? [
              {
                id: "based-on-searches",
                title: "Based on Your Recent Searches",
                subtitle: `Inspired by "${searchTerms[0]}" and recent pantry queries`,
                recipes: basedOnRecentSearches,
              },
            ]
          : []),
        ...(becauseYouLikeCuisine.length > 0
          ? [
              {
                id: "top-cuisine",
                title: `Because You Love ${topCuisine}`,
                subtitle: `Signature masteries from ${topCuisine} culinary traditions`,
                recipes: becauseYouLikeCuisine,
              },
            ]
          : []),
        {
          id: "popular-right-now",
          title: "Popular Right Now",
          subtitle: "The most cooked and highest-rated dishes this week",
          recipes: popularRightNow,
        },
        ...(exploreSomethingNew.length > 0
          ? [
              {
                id: "explore-new",
                title: "Explore Something New",
                subtitle: "Venture outside your usual routine with unexpected flavors",
                recipes: exploreSomethingNew,
              },
            ]
          : []),
      ],
    };
  } catch (err) {
    console.error("Recommendation computation error:", err);
    return generateColdStartRecommendations(allRecipes);
  }
}

/**
 * Clean cold-start recommendation sets for guests or new accounts
 */
function generateColdStartRecommendations(allRecipes, excludedAllergens = []) {
  let list = allRecipes;
  if (excludedAllergens.length > 0) {
    list = list.filter(
      (r) =>
        !r.allergens.some((alg) =>
          excludedAllergens.some((exc) => alg.toLowerCase().includes(exc.toLowerCase()))
        )
    );
  }

  const trending = [...list]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6)
    .map((r) => ({ ...r, recommendationReason: "Chef-tested community favorite" }));

  const quickMeals = list
    .filter((r) => r.cookTimeMinutes <= 25)
    .slice(0, 4)
    .map((r) => ({ ...r, recommendationReason: "Ready in 25 minutes or less" }));

  const vegetarianHighlights = list
    .filter((r) => r.category === "Vegetarian" || r.category === "Vegan")
    .slice(0, 4)
    .map((r) => ({ ...r, recommendationReason: "Vibrant plant-forward masterwork" }));

  return {
    personalized: false,
    sections: [
      {
        id: "trending",
        title: "Popular Right Now",
        subtitle: "The highest rated dishes across all cuisines",
        recipes: trending,
      },
      {
        id: "quick-meals",
        title: "20-Minute Weeknight Heroes",
        subtitle: "Fast, flavorful dinners with minimal cleanup",
        recipes: quickMeals,
      },
      {
        id: "vegetarian",
        title: "Plant-Forward Specialties",
        subtitle: "Rich, satisfying vegetarian and vegan recipes",
        recipes: vegetarianHighlights,
      },
    ],
  };
}

/**
 * Content-based similarity between a specific recipe and the rest of the catalog
 */
export async function getSimilarRecipes(recipeId, limit = 4) {
  const allRecipes = await getAllRecipes();
  const current = allRecipes.find((r) => r.id === recipeId);
  if (!current) return [];

  const candidates = allRecipes.filter((r) => r.id !== recipeId);

  const scored = candidates.map((target) => {
    let score = 0;
    const commonIngredients = [];

    // Shared cuisine
    if (target.cuisine === current.cuisine) score += 4;
    // Shared category
    if (target.category === current.category) score += 3;
    // Shared difficulty
    if (target.difficulty === current.difficulty) score += 1;

    // Check shared ingredients
    const currentIngNames = current.ingredients.map((i) => i.name.toLowerCase());
    target.ingredients.forEach((ing) => {
      const ingName = ing.name.toLowerCase();
      if (currentIngNames.some((c) => c.includes(ingName) || ingName.includes(c))) {
        score += 1.5;
        if (commonIngredients.length < 3) {
          commonIngredients.push(ing.name);
        }
      }
    });

    return {
      ...target,
      similarityScore: score,
      recommendationReason:
        target.cuisine === current.cuisine
          ? `Also in ${current.cuisine}`
          : commonIngredients.length > 0
          ? `Shares ingredients: ${commonIngredients.slice(0, 2).join(", ")}`
          : `Similar ${current.category} dish`,
    };
  });

  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  return scored.slice(0, limit);
}
