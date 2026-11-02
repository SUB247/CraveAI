import fs from "fs";
import path from "path";
import { SAMPLE_RECIPES } from "../data/recipes.js";

function escapeSql(str) {
  if (str === null || str === undefined) return "NULL";
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escapeJson(obj) {
  if (obj === null || obj === undefined) return "'[]'::jsonb";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function escapeArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "'{}'";
  const escapedElements = arr.map((item) => `"${String(item).replace(/"/g, '\\"')}"`);
  return `'${escapedElements.join(",")}'`;
}

let sql = `-- CraveAI Recipe Catalog Seed Migration
-- 002_seed_recipes.sql
-- Seeds all recipes into public.recipes with verified images and nutrition data

INSERT INTO public.recipes (
  id, slug, title, tagline, description, category, cuisine,
  prep_time, prep_time_minutes, cook_time, cook_time_minutes, total_time,
  servings, difficulty, rating, review_count, calories,
  tags, equipment, ingredients, steps, chef_tips, substitutions,
  common_mistakes, allergens, safety, storage, image_url, is_ai_generated, nutrition
) VALUES
`;

const rows = SAMPLE_RECIPES.map((r) => {
  return `(
  ${escapeSql(r.id)},
  ${escapeSql(r.id)},
  ${escapeSql(r.title)},
  ${escapeSql(r.tagline || "")},
  ${escapeSql(r.description || "")},
  ${escapeSql(r.category)},
  ${escapeSql(r.cuisine)},
  ${escapeSql(r.prepTime)},
  ${r.prepTimeMinutes || 0},
  ${escapeSql(r.cookTime)},
  ${r.cookTimeMinutes || 0},
  ${escapeSql(r.totalTime || "")},
  ${r.servings || 4},
  ${escapeSql(r.difficulty || "Medium")},
  ${r.rating || 4.9},
  ${r.reviewCount || 100},
  ${r.calories || 450},
  ${escapeArray(r.tags || [])},
  ${escapeArray(r.equipment || [])},
  ${escapeJson(r.ingredients || [])},
  ${escapeJson(r.steps || [])},
  ${escapeArray(r.chefTips || [])},
  ${escapeJson(r.substitutions || [])},
  ${escapeJson(r.commonMistakes || [])},
  ${escapeArray(r.allergens || [])},
  ${escapeSql(r.safety || "")},
  ${escapeSql(r.storage || "")},
  ${escapeSql(r.image || "")},
  ${Boolean(r.isAiGenerated)},
  ${escapeJson(r.nutrition || {})}
)`;
});

sql += rows.join(",\n") + `\nON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  cuisine = EXCLUDED.cuisine,
  prep_time = EXCLUDED.prep_time,
  prep_time_minutes = EXCLUDED.prep_time_minutes,
  cook_time = EXCLUDED.cook_time,
  cook_time_minutes = EXCLUDED.cook_time_minutes,
  total_time = EXCLUDED.total_time,
  servings = EXCLUDED.servings,
  difficulty = EXCLUDED.difficulty,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  calories = EXCLUDED.calories,
  tags = EXCLUDED.tags,
  equipment = EXCLUDED.equipment,
  ingredients = EXCLUDED.ingredients,
  steps = EXCLUDED.steps,
  chef_tips = EXCLUDED.chef_tips,
  substitutions = EXCLUDED.substitutions,
  common_mistakes = EXCLUDED.common_mistakes,
  allergens = EXCLUDED.allergens,
  safety = EXCLUDED.safety,
  storage = EXCLUDED.storage,
  image_url = EXCLUDED.image_url,
  nutrition = EXCLUDED.nutrition,
  updated_at = now();\n`;

const outPath = path.join(process.cwd(), "supabase", "migrations", "20261023000002_seed_recipes.sql");
fs.writeFileSync(outPath, sql, "utf-8");
console.log(`Generated ${outPath} successfully.`);
