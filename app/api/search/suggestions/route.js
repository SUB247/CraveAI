import { NextResponse } from "next/server";
import { getAllRecipes } from "@/lib/recipes-repository";
import { getRecentSearches, normalizeQuery } from "@/lib/search-history-service";
import { getVerifiedUser } from "@/lib/supabase/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const normalizedQ = normalizeQuery(q);

    const user = await getVerifiedUser();
    const userId = user?.id || null;

    // 1. Get recent searches for authenticated user (or empty for guest)
    let recentSearches = [];
    if (userId) {
      const history = await getRecentSearches(userId, 8);
      recentSearches = history
        .filter((h) => !normalizedQ || h.normalized_query.includes(normalizedQ))
        .map((h) => ({ id: h.id, query: h.query }));
    }

    const allRecipes = await getAllRecipes();

    // 2. If query is empty: return popular recipes and recent searches
    if (!normalizedQ) {
      const popular = [...allRecipes]
        .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        .slice(0, 5)
        .map((r) => ({
          id: r.id,
          title: r.title,
          cuisine: r.cuisine,
          category: r.category,
          cookTime: r.cookTime,
          rating: r.rating,
          image: r.image,
        }));

      return NextResponse.json({
        query: "",
        recentSearches: recentSearches.slice(0, 5),
        recipes: popular,
        ingredients: [],
        categories: [],
        cuisines: [],
        personalized: [],
      });
    }

    // 3. Matching recipes (title match)
    const matchingRecipes = allRecipes
      .filter((r) => r.title.toLowerCase().includes(normalizedQ))
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        title: r.title,
        cuisine: r.cuisine,
        category: r.category,
        cookTime: r.cookTime,
        rating: r.rating,
        image: r.image,
      }));

    // 4. Matching cuisines
    const uniqueCuisines = Array.from(new Set(allRecipes.map((r) => r.cuisine)));
    const matchingCuisines = uniqueCuisines
      .filter((c) => c.toLowerCase().includes(normalizedQ))
      .slice(0, 3);

    // 5. Matching categories
    const uniqueCategories = Array.from(new Set(allRecipes.map((r) => r.category)));
    const matchingCategories = uniqueCategories
      .filter((c) => c.toLowerCase().includes(normalizedQ))
      .slice(0, 3);

    // 6. Matching ingredients
    const ingredientMatches = new Map();
    for (const recipe of allRecipes) {
      for (const ing of recipe.ingredients || []) {
        const name = ing.name.toLowerCase();
        if (name.includes(normalizedQ)) {
          // Extract short cleanly recognizable ingredient name
          const cleanName = ing.name.split(",")[0].trim();
          if (!ingredientMatches.has(cleanName.toLowerCase())) {
            ingredientMatches.set(cleanName.toLowerCase(), cleanName);
          }
        }
        if (ingredientMatches.size >= 4) break;
      }
      if (ingredientMatches.size >= 4) break;
    }

    // 7. Personalized suggestions if user has recent searches
    let personalized = [];
    if (recentSearches.length > 0 && matchingRecipes.length < 5) {
      const topSearchQuery = recentSearches[0].query.toLowerCase();
      personalized = allRecipes
        .filter(
          (r) =>
            !matchingRecipes.some((m) => m.id === r.id) &&
            (r.cuisine.toLowerCase().includes(topSearchQuery) ||
              r.category.toLowerCase().includes(topSearchQuery))
        )
        .slice(0, 2)
        .map((r) => ({
          id: r.id,
          title: r.title,
          cuisine: r.cuisine,
          category: r.category,
          cookTime: r.cookTime,
          rating: r.rating,
          image: r.image,
          reason: `Recommended based on "${recentSearches[0].query}"`,
        }));
    }

    return NextResponse.json({
      query: q,
      recentSearches: recentSearches.slice(0, 4),
      recipes: matchingRecipes,
      ingredients: Array.from(ingredientMatches.values()),
      categories: matchingCategories,
      cuisines: matchingCuisines,
      personalized,
    });
  } catch (error) {
    console.error("Autocomplete suggestions error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
