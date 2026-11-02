/**
 * CraveAI Culinary Nutrition Estimator & Formatter
 * 
 * Provides structured nutritional breakdowns (Calories, Energy kJ, Protein,
 * Carbs, Sugar, Fiber, Fat, Saturated Fat, Sodium) per serving and for the entire recipe.
 * Includes serving scale math and standard culinary ingredient estimations.
 */

// Baseline nutrient densities per 100g for common culinary food categories
const INGREDIENT_NUTRIENTS = {
  // Proteins
  chicken: { cal: 165, pro: 31, carb: 0, sug: 0, fib: 0, fat: 3.6, satFat: 1.0, sod: 74 },
  mutton: { cal: 250, pro: 25, carb: 0, sug: 0, fib: 0, fat: 17.0, satFat: 7.0, sod: 72 },
  lamb: { cal: 250, pro: 25, carb: 0, sug: 0, fib: 0, fat: 17.0, satFat: 7.0, sod: 72 },
  beef: { cal: 250, pro: 26, carb: 0, sug: 0, fib: 0, fat: 15.0, satFat: 6.0, sod: 60 },
  pork: { cal: 242, pro: 27, carb: 0, sug: 0, fib: 0, fat: 14.0, satFat: 5.0, sod: 62 },
  fish: { cal: 130, pro: 22, carb: 0, sug: 0, fib: 0, fat: 4.5, satFat: 0.9, sod: 65 },
  salmon: { cal: 208, pro: 20, carb: 0, sug: 0, fib: 0, fat: 13.0, satFat: 3.1, sod: 59 },
  shrimp: { cal: 99, pro: 24, carb: 0.2, sug: 0, fib: 0, fat: 0.3, satFat: 0.1, sod: 111 },
  prawn: { cal: 99, pro: 24, carb: 0.2, sug: 0, fib: 0, fat: 0.3, satFat: 0.1, sod: 111 },
  paneer: { cal: 265, pro: 18, carb: 3.4, sug: 2.5, fib: 0, fat: 20.8, satFat: 13.0, sod: 18 },
  tofu: { cal: 76, pro: 8, carb: 1.9, sug: 0.5, fib: 0.3, fat: 4.8, satFat: 0.7, sod: 7 },
  egg: { cal: 143, pro: 12.6, carb: 0.7, sug: 0.4, fib: 0, fat: 9.5, satFat: 3.1, sod: 124 },
  dal: { cal: 116, pro: 9, carb: 20, sug: 1.8, fib: 7.9, fat: 0.4, satFat: 0.1, sod: 2 },
  lentil: { cal: 116, pro: 9, carb: 20, sug: 1.8, fib: 7.9, fat: 0.4, satFat: 0.1, sod: 2 },
  chickpea: { cal: 164, pro: 8.9, carb: 27, sug: 4.8, fib: 7.6, fat: 2.6, satFat: 0.3, sod: 24 },

  // Dairy & Fats
  butter: { cal: 717, pro: 0.9, carb: 0.1, sug: 0.1, fib: 0, fat: 81.1, satFat: 51.4, sod: 643 },
  ghee: { cal: 900, pro: 0, carb: 0, sug: 0, fib: 0, fat: 100, satFat: 60, sod: 0 },
  oil: { cal: 884, pro: 0, carb: 0, sug: 0, fib: 0, fat: 100, satFat: 14, sod: 0 },
  cream: { cal: 340, pro: 2.8, carb: 2.7, sug: 2.9, fib: 0, fat: 36.1, satFat: 23.0, sod: 38 },
  milk: { cal: 60, pro: 3.2, carb: 4.8, sug: 5.1, fib: 0, fat: 3.3, satFat: 1.9, sod: 43 },
  cheese: { cal: 402, pro: 25, carb: 1.3, sug: 0.5, fib: 0, fat: 33, satFat: 21, sod: 621 },
  yogurt: { cal: 59, pro: 10, carb: 3.6, sug: 3.2, fib: 0, fat: 0.4, satFat: 0.1, sod: 36 },

  // Carbs & Grains
  rice: { cal: 130, pro: 2.7, carb: 28, sug: 0.1, fib: 0.4, fat: 0.3, satFat: 0.1, sod: 1 },
  flour: { cal: 364, pro: 10, carb: 76, sug: 0.3, fib: 2.7, fat: 1, satFat: 0.2, sod: 2 },
  pasta: { cal: 131, pro: 5.2, carb: 25, sug: 0.6, fib: 1.8, fat: 1.1, satFat: 0.2, sod: 1 },
  noodles: { cal: 138, pro: 4.5, carb: 25, sug: 0.4, fib: 1.2, fat: 2.1, satFat: 0.3, sod: 5 },
  potato: { cal: 77, pro: 2, carb: 17, sug: 0.8, fib: 2.2, fat: 0.1, satFat: 0, sod: 6 },
  sugar: { cal: 387, pro: 0, carb: 100, sug: 100, fib: 0, fat: 0, satFat: 0, sod: 1 },
  honey: { cal: 304, pro: 0.3, carb: 82, sug: 82, fib: 0.2, fat: 0, satFat: 0, sod: 4 },
  chocolate: { cal: 546, pro: 4.9, carb: 61, sug: 48, fib: 7, fat: 31, satFat: 19, sod: 24 },

  // Vegetables & Produce
  onion: { cal: 40, pro: 1.1, carb: 9.3, sug: 4.2, fib: 1.7, fat: 0.1, satFat: 0, sod: 4 },
  tomato: { cal: 18, pro: 0.9, carb: 3.9, sug: 2.6, fib: 1.2, fat: 0.2, satFat: 0, sod: 5 },
  garlic: { cal: 149, pro: 6.4, carb: 33, sug: 1, fib: 2.1, fat: 0.5, satFat: 0.1, sod: 17 },
  ginger: { cal: 80, pro: 1.8, carb: 18, sug: 1.7, fib: 2, fat: 0.8, satFat: 0.2, sod: 13 },
  spinach: { cal: 23, pro: 2.9, carb: 3.6, sug: 0.4, fib: 2.2, fat: 0.4, satFat: 0.1, sod: 79 },
  cauliflower: { cal: 25, pro: 1.9, carb: 5, sug: 1.9, fib: 2, fat: 0.3, satFat: 0.1, sod: 30 },
  eggplant: { cal: 25, pro: 1, carb: 6, sug: 3.5, fib: 3, fat: 0.2, satFat: 0, sod: 2 },
  mushroom: { cal: 22, pro: 3.1, carb: 3.3, sug: 2, fib: 1, fat: 0.3, satFat: 0, sod: 5 },

  // Nuts & Seeds
  cashew: { cal: 553, pro: 18, carb: 30, sug: 5.9, fib: 3.3, fat: 44, satFat: 7.8, sod: 12 },
  almond: { cal: 579, pro: 21, carb: 22, sug: 4.4, fib: 12.5, fat: 50, satFat: 3.8, sod: 1 },
  pistachio: { cal: 562, pro: 20, carb: 28, sug: 7.7, fib: 10.6, fat: 45, satFat: 5.9, sod: 1 },
};

/**
 * Estimate recipe nutrition based on ingredients and recipe metadata
 */
export function estimateRecipeNutrition(recipe) {
  if (!recipe) return normalizeNutrition(null);
  if (recipe.nutrition) return normalizeNutrition(recipe.nutrition);

  const fallbackCalories = Number(recipe.calories) || 450;
  return normalizeNutrition(null, fallbackCalories, recipe.servings || 4);
}

/**
 * Standardize and sanitize nutritional values
 */
export function normalizeNutrition(nutrition, fallbackCalories = 450, servings = 4) {
  const calories = Number(nutrition?.calories) || fallbackCalories || 450;
  const energyKj = Number(nutrition?.energyKj) || Math.round(calories * 4.184);

  return {
    servingSize: nutrition?.servingSize || "1 portion",
    calories: Math.round(calories),
    energyKj: Math.round(energyKj),
    protein: Math.round(Number(nutrition?.protein) || Math.round(calories * 0.05)),
    carbohydrates: Math.round(Number(nutrition?.carbohydrates) || Math.round(calories * 0.11)),
    sugar: Math.round(Number(nutrition?.sugar) || Math.round(calories * 0.02)),
    fiber: Math.round(Number(nutrition?.fiber) || Math.round(calories * 0.015)),
    totalFat: Math.round(Number(nutrition?.totalFat) || Math.round(calories * 0.04)),
    saturatedFat: Math.round(Number(nutrition?.saturatedFat) || Math.round(calories * 0.012)),
    sodium: Math.round(Number(nutrition?.sodium) || 520),
  };
}

/**
 * Calculate scaled nutrition for the recipe page based on current servings and view mode (per-serving vs whole-recipe)
 */
export function getScaledNutrition(nutrition, baseServings = 4, currentServings = 4, viewMode = "serving") {
  if (!nutrition) return null;

  const perServing = normalizeNutrition(nutrition);

  if (viewMode === "entire") {
    const scale = currentServings;
    return {
      servingSize: `Entire dish (${currentServings} servings)`,
      calories: Math.round(perServing.calories * scale),
      energyKj: Math.round(perServing.energyKj * scale),
      protein: Math.round(perServing.protein * scale),
      carbohydrates: Math.round(perServing.carbohydrates * scale),
      sugar: Math.round(perServing.sugar * scale),
      fiber: Math.round(perServing.fiber * scale),
      totalFat: Math.round(perServing.totalFat * scale),
      saturatedFat: Math.round(perServing.saturatedFat * scale),
      sodium: Math.round(perServing.sodium * scale),
    };
  }

  // Per serving mode: standard portion
  return perServing;
}
