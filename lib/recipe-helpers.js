// Utility functions for recipe rendering, math, and servings recalculations

/**
 * Format a scaled number cleanly (e.g., 1.5 -> "1 1/2", 0.33 -> "1/3", 2.0 -> "2")
 */
export function formatQuantity(baseAmount, baseServings, currentServings) {
  if (!baseAmount || isNaN(baseAmount)) return "";
  
  const scaled = (baseAmount / baseServings) * currentServings;
  
  // If whole number or very close
  if (Math.abs(scaled - Math.round(scaled)) < 0.05) {
    return Math.round(scaled).toString();
  }

  // Common culinary fractions
  const whole = Math.floor(scaled);
  const remainder = scaled - whole;

  let fraction = "";
  if (remainder >= 0.12 && remainder < 0.2) fraction = "1/8";
  else if (remainder >= 0.2 && remainder < 0.3) fraction = "1/4";
  else if (remainder >= 0.3 && remainder < 0.42) fraction = "1/3";
  else if (remainder >= 0.42 && remainder < 0.6) fraction = "1/2";
  else if (remainder >= 0.6 && remainder < 0.7) fraction = "2/3";
  else if (remainder >= 0.7 && remainder < 0.88) fraction = "3/4";
  else if (remainder >= 0.88) return (whole + 1).toString();

  if (fraction) {
    return whole > 0 ? `${whole} ${fraction}` : fraction;
  }

  // Fallback to 1 decimal place
  return scaled.toFixed(1).replace(/\.0$/, "");
}

/**
 * Find related recipes based on shared category, cuisine, or tags
 */
export function getRelatedRecipes(currentRecipe, allRecipes, limit = 3) {
  if (!currentRecipe || !allRecipes) return [];

  const candidates = allRecipes.filter((r) => r.id !== currentRecipe.id);

  const scored = candidates.map((recipe) => {
    let score = 0;
    if (recipe.category === currentRecipe.category) score += 3;
    if (recipe.cuisine === currentRecipe.cuisine) score += 2;
    if (recipe.difficulty === currentRecipe.difficulty) score += 1;
    
    // Shared tags
    if (Array.isArray(recipe.tags) && Array.isArray(currentRecipe.tags)) {
      const commonTags = recipe.tags.filter((t) => currentRecipe.tags.includes(t));
      score += commonTags.length;
    }

    return { recipe, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.recipe);
}

/**
 * Filter recipes based on criteria
 */
export function filterRecipes(recipes, { search = "", category = "all", cuisine = "All Cuisines", difficulty = "all", maxTime = 180 }) {
  if (!Array.isArray(recipes)) return [];

  const query = search.trim().toLowerCase();

  return recipes.filter((recipe) => {
    // Search query matches title, description, cuisine, or ingredients
    if (query) {
      const matchTitle = recipe.title.toLowerCase().includes(query);
      const matchDesc = recipe.description?.toLowerCase().includes(query);
      const matchCuisine = recipe.cuisine?.toLowerCase().includes(query);
      const matchCategory = recipe.category?.toLowerCase().includes(query);
      const matchIngredients = recipe.ingredients?.some((ing) =>
        ing.name.toLowerCase().includes(query)
      );

      if (!matchTitle && !matchDesc && !matchCuisine && !matchCategory && !matchIngredients) {
        return false;
      }
    }

    // Category filter
    if (category && category !== "all") {
      if (category === "Vegetarian") {
        const isVeg =
          recipe.category === "Vegetarian" ||
          recipe.category === "Vegan" ||
          recipe.tags?.some((t) => /vegetarian|vegan/i.test(t));
        if (!isVeg) return false;
      } else if (category === "Vegan") {
        const isVegan =
          recipe.category === "Vegan" ||
          recipe.tags?.some((t) => /vegan/i.test(t));
        if (!isVegan) return false;
      } else if (category === "Quick Meals") {
        const isQuick =
          recipe.category === "Quick Meals" ||
          (recipe.cookTimeMinutes && recipe.cookTimeMinutes <= 25) ||
          (recipe.totalTime && parseInt(recipe.totalTime) <= 30) ||
          recipe.tags?.includes("Quick Meals");
        if (!isQuick) return false;
      } else {
        if (recipe.category !== category) return false;
      }
    }

    // Cuisine filter
    if (cuisine && cuisine !== "All Cuisines") {
      if (recipe.cuisine !== cuisine) return false;
    }

    // Difficulty filter
    if (difficulty && difficulty !== "all") {
      if (recipe.difficulty?.toLowerCase() !== difficulty.toLowerCase()) return false;
    }

    // Max Cook Time
    if (maxTime && recipe.cookTimeMinutes && recipe.cookTimeMinutes > maxTime) {
      return false;
    }

    return true;
  });
}
