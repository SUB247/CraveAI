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
 * Smart matching for category / cuisine / meal type / dietary preference
 */
export function matchesCategory(recipe, category) {
  if (!category || category === "all" || category.toLowerCase() === "all recipes") {
    return true;
  }

  const c = category.trim().toLowerCase();
  const rCat = (recipe.category || "").trim().toLowerCase();
  const rCuisine = (recipe.cuisine || "").trim().toLowerCase();
  const rTitle = (recipe.title || "").trim().toLowerCase();
  const rTags = Array.isArray(recipe.tags)
    ? recipe.tags.map((t) => t.toLowerCase())
    : [];

  // 1. Dietary Preferences
  if (c === "vegetarian") {
    return (
      rCat === "vegetarian" ||
      rCat === "vegan" ||
      rTags.some((t) => t === "vegetarian" || t === "vegan")
    );
  }

  if (c === "vegan") {
    return (
      rCat === "vegan" ||
      rTags.includes("vegan")
    );
  }

  // 2. Meal Types
  if (c === "breakfast") {
    return (
      rCat === "breakfast" ||
      rTags.includes("breakfast") ||
      rTags.includes("brunch") ||
      /pancake|dosa|idli|appam|parotta|oat|menemen|shakshuka/i.test(rTitle)
    );
  }

  if (c === "desserts" || c === "dessert") {
    return (
      rCat === "desserts" ||
      rCat === "dessert" ||
      rTags.includes("dessert") ||
      rTags.includes("sweet") ||
      /cake|tart|tiramisu|baklava|churros|pudding|sweet|double ka meetha/i.test(rTitle)
    );
  }

  if (c === "snacks" || c === "snack") {
    return (
      rCat === "snacks" ||
      rCat === "snack" ||
      rTags.some((t) => /snack|street food|appetizer|tapas|finger food/i.test(t)) ||
      /chaat|puri|vada|samosa|falafel|dumpling|patatas|guacamole|roll/i.test(rTitle)
    );
  }

  if (c === "quick meals" || c === "quick") {
    return (
      rCat === "quick meals" ||
      (recipe.cookTimeMinutes && recipe.cookTimeMinutes <= 25) ||
      rTags.some((t) => /quick|10-minute|15-minute|20-minute/i.test(t))
    );
  }

  // 3. Cuisines
  if (c === "indian") {
    return (
      rCat === "indian" ||
      /indian|punjabi|kerala|hyderabadi|bengali|gujarati|rajasthani|maharashtrian|kashmiri|chettinad/i.test(rCuisine) ||
      rTags.includes("indian")
    );
  }

  if (c === "italian") {
    return (
      rCat === "italian" ||
      /italian/i.test(rCuisine) ||
      rTags.includes("italian")
    );
  }

  if (c === "japanese") {
    return (
      rCat === "japanese" ||
      /japanese/i.test(rCuisine) ||
      rTags.includes("japanese")
    );
  }

  if (c === "asian") {
    return (
      rCat === "asian" ||
      /asian|chinese|japanese|korean|thai|vietnamese/i.test(rCuisine) ||
      rTags.some((t) => ["asian", "chinese", "japanese", "korean", "thai", "vietnamese"].includes(t))
    );
  }

  if (c === "mexican") {
    return (
      rCat === "mexican" ||
      /mexican/i.test(rCuisine) ||
      rTags.includes("mexican")
    );
  }

  if (c === "european") {
    return (
      rCat === "european" ||
      /european|italian|french|spanish|greek/i.test(rCuisine) ||
      rTags.some((t) => ["european", "italian", "french", "spanish", "greek"].includes(t))
    );
  }

  if (c === "american") {
    return (
      rCat === "american" ||
      /american/i.test(rCuisine) ||
      rTags.includes("american")
    );
  }

  if (c === "middle eastern" || c === "middle-eastern") {
    return (
      rCat === "middle eastern" ||
      /middle eastern|levantine|turkish/i.test(rCuisine) ||
      rTags.some((t) => ["middle eastern", "turkish", "levantine"].includes(t))
    );
  }

  if (c === "african") {
    return (
      rCat === "african" ||
      /african|moroccan|ethiopian|nigerian/i.test(rCuisine) ||
      rTags.some((t) => ["african", "moroccan", "ethiopian"].includes(t))
    );
  }

  // 4. Direct Fallback match
  return (
    rCat === c ||
    rCuisine.includes(c) ||
    rTags.includes(c)
  );
}

// Common culinary terms for dietary classification
const MEAT_WORDS = /\b(chicken|beef|pork|lamb|bacon|prosciutto|mutton|pancetta|duck|turkey|meat|ham)\b/i;
const SEAFOOD_WORDS = /\b(fish|salmon|tuna|prawn|prawns|shrimp|shrimps|clam|clams|crab|lobster|anchovy|anchovies|seafood|squid|calamari)\b/i;
const DAIRY_WORDS = /\b(milk|cream|butter|ghee|cheese|parmesan|mozzarella|cheddar|ricotta|paneer|yogurt|curd|mascarpone|heavy cream)\b/i;
const EGG_WORDS = /\b(egg|eggs|egg yolk|egg white)\b/i;
const NUT_WORDS = /\b(peanut|peanuts|almond|almonds|cashew|cashews|walnut|walnuts|pistachio|pistachios|hazelnut|hazelnuts|pecan|pecans|macadamia|pine nut)\b/i;
const ROOT_VEG_WORDS = /\b(onion|garlic|potato|potatoes|ginger|radish|carrot|carrots|beetroot|turnip)\b/i;
const GLUTEN_WORDS = /\b(flour|all-purpose flour|wheat|maida|bread|breadcrumbs|pasta|spaghetti|semolina|sooji|rava|couscous|barley|rye)\b/i;

export const DIETARY_OPTIONS = [
  { id: "Vegetarian", label: "Vegetarian", desc: "No meat, poultry, or seafood" },
  { id: "Vegan", label: "Vegan", desc: "100% plant-based, no animal products" },
  { id: "Eggetarian", label: "Eggetarian", desc: "Vegetarian diet inclusive of eggs" },
  { id: "High-Protein", label: "High-Protein", desc: "20g+ protein per serving" },
  { id: "Gluten-Free", label: "Gluten-Free", desc: "Free from wheat, flour & gluten" },
  { id: "Dairy-Free", label: "Dairy-Free", desc: "Free from milk, butter & cheese" },
  { id: "Low-Sugar", label: "Low-Sugar", desc: "Under 6g sugar per serving" },
  { id: "Nut-Free", label: "Nut-Free", desc: "Completely tree-nut and peanut free" },
  { id: "Jain-Friendly", label: "Jain-Friendly", desc: "No root vegetables, meat or eggs" },
  { id: "Pescatarian", label: "Pescatarian", desc: "Plant and seafood-focused, no meat" },
];

export const DESSERT_SUBCATEGORIES = [
  { id: "all", label: "All Desserts" },
  { id: "indian sweets", label: "Indian Sweets (Mithai)" },
  { id: "baked", label: "Baked" },
  { id: "no-bake", label: "No-Bake" },
  { id: "chocolate", label: "Chocolate" },
  { id: "fruit-based", label: "Fruit-Based" },
  { id: "frozen", label: "Frozen & Chilled" },
  { id: "quick", label: "Quick Desserts" },
];

/**
 * Check if a recipe satisfies a single dietary preference
 */
export function matchesDietaryPreference(recipe, preference) {
  if (!recipe || !preference) return true;
  const pref = preference.toLowerCase().trim();
  const tags = Array.isArray(recipe.tags) ? recipe.tags.map((t) => t.toLowerCase()) : [];
  const allergens = Array.isArray(recipe.allergens) ? recipe.allergens.map((a) => a.toLowerCase()) : [];
  const ingNames = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map((i) => i.name.toLowerCase()).join(" ")
    : "";
  const title = (recipe.title || "").toLowerCase();

  const hasMeat = MEAT_WORDS.test(title) || MEAT_WORDS.test(ingNames);
  const hasSeafood = SEAFOOD_WORDS.test(title) || SEAFOOD_WORDS.test(ingNames);
  const hasDairy =
    DAIRY_WORDS.test(title) ||
    DAIRY_WORDS.test(ingNames) ||
    allergens.some((a) => a.includes("dairy") || a.includes("milk"));
  const hasEggs =
    EGG_WORDS.test(title) ||
    EGG_WORDS.test(ingNames) ||
    allergens.some((a) => a.includes("egg"));
  const hasNuts =
    NUT_WORDS.test(title) ||
    NUT_WORDS.test(ingNames) ||
    allergens.some((a) => a.includes("nut"));
  const hasGluten =
    GLUTEN_WORDS.test(title) ||
    GLUTEN_WORDS.test(ingNames) ||
    allergens.some((a) => a.includes("gluten") || a.includes("wheat"));
  const hasRootVeg = ROOT_VEG_WORDS.test(title) || ROOT_VEG_WORDS.test(ingNames);

  switch (pref) {
    case "vegetarian":
      return !hasMeat && !hasSeafood && (
        tags.includes("vegetarian") ||
        tags.includes("vegan") ||
        recipe.category?.toLowerCase() === "vegetarian" ||
        recipe.category?.toLowerCase() === "vegan" ||
        !hasMeat
      );
    case "vegan":
      return !hasMeat && !hasSeafood && !hasDairy && !hasEggs && (
        tags.includes("vegan") ||
        recipe.category?.toLowerCase() === "vegan"
      );
    case "eggetarian":
      return !hasMeat && !hasSeafood;
    case "high-protein":
      return (recipe.nutrition?.protein >= 20) || tags.includes("high-protein");
    case "gluten-free":
      return tags.includes("gluten-free") || (!hasGluten && !allergens.some((a) => a.includes("gluten") || a.includes("wheat")));
    case "dairy-free":
      return tags.includes("dairy-free") || tags.includes("vegan") || !hasDairy;
    case "low-sugar":
      return tags.includes("low-sugar") || (recipe.nutrition?.sugar !== undefined ? recipe.nutrition.sugar <= 6 : true);
    case "nut-free":
      return tags.includes("nut-free") || !hasNuts;
    case "jain-friendly":
      return !hasMeat && !hasSeafood && !hasEggs && !hasRootVeg && (tags.includes("jain") || tags.includes("jain-friendly") || !hasRootVeg);
    case "pescatarian":
      return !hasMeat;
    default:
      return tags.includes(pref);
  }
}

/**
 * Check if a recipe satisfies all requested dietary preferences
 */
export function matchesAllDietaryPreferences(recipe, preferences = []) {
  if (!Array.isArray(preferences) || preferences.length === 0) return true;
  return preferences.every((pref) => matchesDietaryPreference(recipe, pref));
}

/**
 * Check if a dessert recipe matches a dessert subcategory
 */
export function matchesDessertSubcategory(recipe, subcategory) {
  if (!subcategory || subcategory === "all") return true;
  const sub = subcategory.toLowerCase().trim();
  const title = (recipe.title || "").toLowerCase();
  const tags = Array.isArray(recipe.tags) ? recipe.tags.map((t) => t.toLowerCase()) : [];
  const cuisine = (recipe.cuisine || "").toLowerCase();
  const ingNames = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map((i) => i.name.toLowerCase()).join(" ")
    : "";

  if (sub === "indian sweets" || sub === "mithai") {
    return (
      cuisine.includes("indian") ||
      tags.some((t) => t.includes("indian sweet") || t.includes("mithai") || t.includes("halwa") || t.includes("kheer"))
    );
  }
  if (sub === "baked") {
    return tags.includes("baked") || tags.includes("baking") || /cake|pie|brownie|macaron|bake/i.test(title);
  }
  if (sub === "no-bake") {
    return (
      tags.includes("no-bake") ||
      /kheer|panna cotta|mochi|rasmalai|shrikhand|kulfi|ice cream|tiramisu/i.test(title) ||
      (!tags.includes("baked") && !/cake|pie|brownie/i.test(title))
    );
  }
  if (sub === "chocolate") {
    return tags.includes("chocolate") || /chocolate|cocoa|brownie|fudge/i.test(title) || /chocolate|cocoa/i.test(ingNames);
  }
  if (sub === "fruit-based") {
    return (
      tags.includes("fruit-based") ||
      tags.includes("fruit") ||
      /apple|strawberry|mango|lemon|berry|peach|orange|banana/i.test(title) ||
      /apple|strawberry|mango|lemon|berries/i.test(ingNames)
    );
  }
  if (sub === "frozen") {
    return tags.includes("frozen") || /kulfi|ice cream|sorbet|gelato|granita|frozen/i.test(title);
  }
  if (sub === "quick") {
    return (recipe.cookTimeMinutes && recipe.cookTimeMinutes <= 25) || tags.includes("quick");
  }
  return true;
}

/**
 * Filter recipes based on criteria
 */
export function filterRecipes(recipes, {
  search = "",
  category = "all",
  cuisine = "All Cuisines",
  difficulty = "all",
  maxTime = 180,
  dietaryPreferences = [],
  dessertSubcategory = "all",
}) {
  if (!Array.isArray(recipes)) return [];

  const query = search.trim().toLowerCase();

  return recipes.filter((recipe) => {
    // Search query matches title, description, cuisine, or ingredients
    if (query) {
      const matchTitle = recipe.title?.toLowerCase().includes(query);
      const matchDesc = recipe.description?.toLowerCase().includes(query);
      const matchCuisine = recipe.cuisine?.toLowerCase().includes(query);
      const matchCategory = recipe.category?.toLowerCase().includes(query);
      const matchTags = recipe.tags?.some((t) => t.toLowerCase().includes(query));
      const matchIngredients = recipe.ingredients?.some((ing) =>
        ing.name?.toLowerCase().includes(query)
      );

      if (!matchTitle && !matchDesc && !matchCuisine && !matchCategory && !matchTags && !matchIngredients) {
        return false;
      }
    }

    // Category filter using smart matching
    if (!matchesCategory(recipe, category)) {
      return false;
    }

    // Dessert subcategory filter when viewing desserts
    if (
      (category === "Desserts" || category === "dessert") &&
      dessertSubcategory &&
      dessertSubcategory !== "all"
    ) {
      if (!matchesDessertSubcategory(recipe, dessertSubcategory)) {
        return false;
      }
    }

    // Dietary preferences filter
    if (Array.isArray(dietaryPreferences) && dietaryPreferences.length > 0) {
      if (!matchesAllDietaryPreferences(recipe, dietaryPreferences)) {
        return false;
      }
    }

    // Cuisine filter
    if (cuisine && cuisine !== "All Cuisines") {
      const cuLower = cuisine.toLowerCase();
      const matchCuisine =
        recipe.cuisine?.toLowerCase() === cuLower ||
        recipe.cuisine?.toLowerCase().includes(cuLower) ||
        recipe.tags?.some((t) => t.toLowerCase() === cuLower);
      if (!matchCuisine) return false;
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
