import { createClient } from "@supabase/supabase-js";
import { SAMPLE_RECIPES } from "../data/recipes.js";
import fs from "fs";
import path from "path";

// Load .env.local if present
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...vals] = trimmed.split("=");
      if (key && vals.length > 0) {
        process.env[key.trim()] = vals.join("=").trim();
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Supabase credentials not found in .env.local.");
  console.log("Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local to seed.");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log(`Connecting to Supabase at ${supabaseUrl}...`);

  for (const r of SAMPLE_RECIPES) {
    const payload = {
      id: r.id,
      slug: r.id,
      title: r.title,
      tagline: r.tagline || "",
      description: r.description || "",
      category: r.category,
      cuisine: r.cuisine,
      prep_time: r.prepTime,
      prep_time_minutes: r.prepTimeMinutes || 0,
      cook_time: r.cookTime,
      cook_time_minutes: r.cookTimeMinutes || 0,
      total_time: r.totalTime || "",
      servings: r.servings || 4,
      difficulty: r.difficulty || "Medium",
      rating: r.rating || 4.9,
      review_count: r.reviewCount || 100,
      calories: r.calories || 450,
      tags: r.tags || [],
      equipment: r.equipment || [],
      ingredients: r.ingredients || [],
      steps: r.steps || [],
      chef_tips: r.chefTips || [],
      substitutions: r.substitutions || [],
      common_mistakes: r.commonMistakes || [],
      allergens: r.allergens || [],
      safety: r.safety || "",
      storage: r.storage || "",
      image_url: r.image || "",
      is_ai_generated: Boolean(r.isAiGenerated),
      nutrition: r.nutrition || {},
    };

    const { error } = await supabase.from("recipes").upsert(payload, { onConflict: "id" });
    if (error) {
      console.error(`Failed to upsert ${r.id}:`, error.message);
    } else {
      console.log(`Upserted: ${r.title}`);
    }
  }

  console.log("Seeding process finished!");
}

seed();
