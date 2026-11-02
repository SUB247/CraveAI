import { SAMPLE_RECIPES } from "@/data/recipes";
import { getServerSupabase } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import {
  matchesCategory,
  matchesAllDietaryPreferences,
  matchesDessertSubcategory,
} from "./recipe-helpers";
import { estimateRecipeNutrition } from "./nutrition";

// Circuit breaker for unreachable / paused remote Supabase instances
let isSupabaseHealthy = true;
let lastSupabaseHealthCheck = 0;
const CIRCUIT_BREAKER_COOLDOWN = 30000; // 30s cooldown before retrying Supabase

function shouldTrySupabase() {
  if (!isSupabaseConfigured()) return false;
  if (!isSupabaseHealthy && Date.now() - lastSupabaseHealthCheck < CIRCUIT_BREAKER_COOLDOWN) {
    return false;
  }
  return true;
}

function markSupabaseFailed() {
  isSupabaseHealthy = false;
  lastSupabaseHealthCheck = Date.now();
}

function markSupabaseSuccess() {
  isSupabaseHealthy = true;
}

/**
 * Normalizes a recipe database row into the standard CraveAI recipe object format
 */
export function normalizeRecipeFromDb(row) {
  if (!row) return null;
  const rawNutrition = row.nutrition || row.nutritional_info || null;
  const nutrition = rawNutrition || estimateRecipeNutrition(row);

  return {
    id: row.id,
    title: row.title,
    tagline: row.tagline || "",
    description: row.description || "",
    image: row.image_url || "",
    isAiGeneratedImage: Boolean(row.is_ai_generated),
    category: row.category,
    cuisine: row.cuisine,
    prepTime: row.prep_time || `${row.prep_time_minutes || 15} mins`,
    prepTimeMinutes: row.prep_time_minutes || 15,
    cookTime: row.cook_time || `${row.cook_time_minutes || 30} mins`,
    cookTimeMinutes: row.cook_time_minutes || 30,
    totalTime: row.total_time || `${(row.prep_time_minutes || 15) + (row.cook_time_minutes || 30)} mins`,
    servings: row.servings || 4,
    difficulty: row.difficulty || "Medium",
    rating: Number(row.rating) || 4.9,
    reviewCount: row.review_count || 100,
    calories: row.calories || nutrition?.calories || 450,
    nutrition,
    tags: Array.isArray(row.tags) ? row.tags : [],
    equipment: Array.isArray(row.equipment) ? row.equipment : [],
    ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    steps: Array.isArray(row.steps) ? row.steps : [],
    chefTips: Array.isArray(row.chef_tips) ? row.chef_tips : [],
    substitutions: Array.isArray(row.substitutions) ? row.substitutions : [],
    commonMistakes: Array.isArray(row.common_mistakes) ? row.common_mistakes : [],
    allergens: Array.isArray(row.allergens) ? row.allergens : [],
    safety: row.safety || "",
    storage: row.storage || "",
  };
}

/**
 * Fetch all available recipes (Supabase with fallback to SAMPLE_RECIPES)
 */
export async function getAllRecipes() {
  if (shouldTrySupabase()) {
    try {
      const supabase = await getServerSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("recipes")
          .select("*")
          .order("rating", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          markSupabaseSuccess();
          return data.map(normalizeRecipeFromDb);
        }
      }
    } catch (err) {
      markSupabaseFailed();
      console.warn("Could not retrieve recipes from Supabase, using catalog fallback:", err.message);
    }
  }

  return SAMPLE_RECIPES;
}

/**
 * Fetch a single recipe by its ID/slug
 */
export async function getRecipeById(id) {
  if (!id) return null;

  if (shouldTrySupabase()) {
    try {
      const supabase = await getServerSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data) {
          markSupabaseSuccess();
          return normalizeRecipeFromDb(data);
        }
      }
    } catch (err) {
      markSupabaseFailed();
      console.warn(`Could not retrieve recipe ${id} from Supabase:`, err.message);
    }
  }

  return SAMPLE_RECIPES.find((r) => r.id === id) || null;
}

/**
 * Full-text search with filters, pagination, and ranking
 */
export async function searchRecipes({
  query = "",
  category = "all",
  cuisine = "All Cuisines",
  difficulty = "all",
  maxCookTime = null,
  dietaryExclusions = [],
  dietaryPreferences = [],
  dessertSubcategory = "all",
  page = 1,
  limit = 12,
  sortBy = "relevance",
}) {
  const cleanQuery = (query || "").trim();
  const offset = (page - 1) * limit;

  // Supabase PostgreSQL Search Branch
  if (shouldTrySupabase()) {
    try {
      const supabase = await getServerSupabase();
      if (supabase) {
        let qb = supabase.from("recipes").select("*", { count: "exact" });

        // Full-Text Search or Trigram Title match
        if (cleanQuery) {
          // Use PostgreSQL websearch syntax for natural language queries
          qb = qb.or(
            `title.ilike.%${cleanQuery}%,cuisine.ilike.%${cleanQuery}%,category.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%`
          );
        }

        if (category && category !== "all") {
          qb = qb.ilike("category", `%${category}%`);
        }

        if (cuisine && cuisine !== "All Cuisines") {
          qb = qb.eq("cuisine", cuisine);
        }

        if (difficulty && difficulty !== "all") {
          qb = qb.ilike("difficulty", difficulty);
        }

        if (maxCookTime && !isNaN(maxCookTime) && maxCookTime > 0) {
          qb = qb.lte("cook_time_minutes", Number(maxCookTime));
        }

        // Sorting
        if (sortBy === "rating") {
          qb = qb.order("rating", { ascending: false });
        } else if (sortBy === "time") {
          qb = qb.order("cook_time_minutes", { ascending: true });
        } else if (sortBy === "popular") {
          qb = qb.order("review_count", { ascending: false });
        } else {
          qb = qb.order("rating", { ascending: false });
        }

        qb = qb.range(offset, offset + limit - 1);

        const { data, count, error } = await qb;

        if (!error && Array.isArray(data) && data.length > 0) {
          markSupabaseSuccess();
          let items = data.map(normalizeRecipeFromDb);

          // Apply dessert subcategory filter
          if (
            (category === "Desserts" || category === "dessert") &&
            dessertSubcategory &&
            dessertSubcategory !== "all"
          ) {
            items = items.filter((r) => matchesDessertSubcategory(r, dessertSubcategory));
          }

          // Apply dietary preferences filter
          if (Array.isArray(dietaryPreferences) && dietaryPreferences.length > 0) {
            items = items.filter((r) => matchesAllDietaryPreferences(r, dietaryPreferences));
          }

          // Apply dietary / allergen exclusion filter if requested
          if (Array.isArray(dietaryExclusions) && dietaryExclusions.length > 0) {
            items = items.filter((recipe) => {
              const allergenMatch = recipe.allergens.some((alg) =>
                dietaryExclusions.some((exc) => alg.toLowerCase().includes(exc.toLowerCase()))
              );
              return !allergenMatch;
            });
          }

          return {
            items,
            totalCount: count || items.length,
            page,
            limit,
            totalPages: Math.ceil((count || items.length) / limit),
            source: "supabase",
          };
        }
      }
    } catch (err) {
      markSupabaseFailed();
      console.warn("Supabase search encountered error, falling back to catalog search:", err.message);
    }
  }

  // Fallback In-Memory Deterministic Catalog Search
  let results = [...SAMPLE_RECIPES];

  if (cleanQuery) {
    const qLower = cleanQuery.toLowerCase();
    results = results.filter((recipe) => {
      const titleMatch = recipe.title.toLowerCase().includes(qLower);
      const descMatch = recipe.description?.toLowerCase().includes(qLower);
      const cuisineMatch = recipe.cuisine?.toLowerCase().includes(qLower);
      const categoryMatch = recipe.category?.toLowerCase().includes(qLower);
      const tagMatch = recipe.tags?.some((t) => t.toLowerCase().includes(qLower));
      const ingMatch = recipe.ingredients?.some((ing) => ing.name.toLowerCase().includes(qLower));
      return titleMatch || descMatch || cuisineMatch || categoryMatch || tagMatch || ingMatch;
    });
  }

  if (category && category !== "all") {
    results = results.filter((r) => matchesCategory(r, category));
  }

  if (
    (category === "Desserts" || category === "dessert") &&
    dessertSubcategory &&
    dessertSubcategory !== "all"
  ) {
    results = results.filter((r) => matchesDessertSubcategory(r, dessertSubcategory));
  }

  if (Array.isArray(dietaryPreferences) && dietaryPreferences.length > 0) {
    results = results.filter((r) => matchesAllDietaryPreferences(r, dietaryPreferences));
  }

  if (cuisine && cuisine !== "All Cuisines") {
    const cuLower = cuisine.toLowerCase();
    results = results.filter((r) =>
      r.cuisine?.toLowerCase() === cuLower ||
      r.cuisine?.toLowerCase().includes(cuLower) ||
      r.tags?.some((t) => t.toLowerCase() === cuLower)
    );
  }

  if (difficulty && difficulty !== "all") {
    results = results.filter((r) => r.difficulty?.toLowerCase() === difficulty.toLowerCase());
  }

  if (maxCookTime && !isNaN(maxCookTime) && maxCookTime > 0) {
    results = results.filter((r) => r.cookTimeMinutes <= Number(maxCookTime));
  }

  // Dietary and allergen exclusions
  if (Array.isArray(dietaryExclusions) && dietaryExclusions.length > 0) {
    results = results.filter((recipe) => {
      const allergenMatch = recipe.allergens?.some((alg) =>
        dietaryExclusions.some((exc) => alg.toLowerCase().includes(exc.toLowerCase()))
      );
      return !allergenMatch;
    });
  }

  // Sorting
  if (sortBy === "rating") {
    results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === "time") {
    results.sort((a, b) => (a.cookTimeMinutes || 30) - (b.cookTimeMinutes || 30));
  } else if (sortBy === "popular") {
    results.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  } else {
    // Relevance: matches in title rank highest
    if (cleanQuery) {
      const qLower = cleanQuery.toLowerCase();
      results.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(qLower) ? 2 : 0;
        const bTitle = b.title.toLowerCase().includes(qLower) ? 2 : 0;
        return bTitle - aTitle;
      });
    }
  }

  const totalCount = results.length;
  const paginated = results.slice(offset, offset + limit);

  return {
    items: paginated,
    totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    source: "catalog",
  };
}
