// CraveAI Master & Expanded Recipe Catalog
import { MASTER_RECIPES } from "./recipes/master.js";
import { EXPANDED_RECIPES } from "./recipes/expanded.js";

// Combine the original 14 master chef recipes with the expanded global collection
export const SAMPLE_RECIPES = [...MASTER_RECIPES, ...EXPANDED_RECIPES];

export const CATEGORIES = [
  { id: "all", label: "All Recipes", icon: "UtensilsCrossed" },
  { id: "Indian", label: "Indian", icon: "Flame" },
  { id: "Italian", label: "Italian", icon: "Pizza" },
  { id: "Japanese", label: "Japanese", icon: "Fish" },
  { id: "Asian", label: "Asian", icon: "Soup" },
  { id: "Mexican", label: "Mexican", icon: "Flame" },
  { id: "European", label: "European", icon: "Utensils" },
  { id: "American", label: "American", icon: "Utensils" },
  { id: "Middle Eastern", label: "Middle Eastern", icon: "Sparkles" },
  { id: "African", label: "African", icon: "Flame" },
  { id: "Desserts", label: "Desserts", icon: "Cake" },
  { id: "Breakfast", label: "Breakfast", icon: "Coffee" },
  { id: "Snacks", label: "Snacks", icon: "Sandwich" },
  { id: "Vegetarian", label: "Vegetarian", icon: "Leaf" },
  { id: "Vegan", label: "Vegan", icon: "Sprout" },
  { id: "Quick Meals", label: "Quick Meals", icon: "Timer" },
];

export const CUISINES = [
  "All Cuisines",
  "North Indian / Punjabi",
  "South Indian (Tamil & Karnataka)",
  "Kerala",
  "Hyderabadi",
  "Bengali",
  "Gujarati",
  "Rajasthani",
  "Maharashtrian",
  "Kashmiri",
  "Indian Street Food",
  "Italian",
  "Chinese",
  "Japanese",
  "Korean",
  "Thai",
  "Vietnamese",
  "French",
  "Spanish",
  "Greek",
  "Mexican",
  "American",
  "Middle Eastern",
  "Turkish",
  "African",
];
