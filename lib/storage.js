// Safe localStorage helpers for client-side state persistence

const FAVORITES_KEY = "craveai_favorites";
const CUSTOM_RECIPES_KEY = "craveai_custom_recipes";

export function getFavorites() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read favorites from localStorage", e);
    return [];
  }
}

export function isFavorite(recipeId) {
  if (typeof window === "undefined" || !recipeId) return false;
  const list = getFavorites();
  return list.includes(recipeId);
}

export function toggleFavorite(recipeId) {
  if (typeof window === "undefined" || !recipeId) return false;
  try {
    const list = getFavorites();
    const index = list.indexOf(recipeId);
    let updated;
    if (index >= 0) {
      updated = list.filter((id) => id !== recipeId);
    } else {
      updated = [...list, recipeId];
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    // Dispatch custom event so other components update synchronously
    window.dispatchEvent(new Event("craveai_favorites_updated"));
    return index < 0; // true if added, false if removed
  } catch (e) {
    console.error("Failed to toggle favorite", e);
    return false;
  }
}

export function getCustomRecipes() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_RECIPES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read custom recipes", e);
    return [];
  }
}

export function saveCustomRecipe(recipe) {
  if (typeof window === "undefined" || !recipe) return false;
  try {
    const current = getCustomRecipes();
    // Prepend new recipe or update existing
    const existingIndex = current.findIndex((r) => r.id === recipe.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = recipe;
    } else {
      updated = [recipe, ...current];
    }
    localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("craveai_custom_recipes_updated"));
    return true;
  } catch (e) {
    console.error("Failed to save custom recipe", e);
    return false;
  }
}

export function deleteCustomRecipe(recipeId) {
  if (typeof window === "undefined" || !recipeId) return false;
  try {
    const current = getCustomRecipes();
    const updated = current.filter((r) => r.id !== recipeId);
    localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("craveai_custom_recipes_updated"));
    return true;
  } catch (e) {
    console.error("Failed to delete custom recipe", e);
    return false;
  }
}
