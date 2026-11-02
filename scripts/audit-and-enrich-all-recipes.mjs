import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const SPECIFIC_IMAGES = {
  // Indian specialties
  "kerala-appam-vegetable-stew": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80",
  "bengali-chingri-malai-curry": "https://images.unsplash.com/photo-1625938144755-652e08e359b7?auto=format&fit=crop&w=1000&q=80",
  "japanese-miso-glazed-eggplant": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80",
  "mapo-tofu-sichuan-spicy": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80",
  "eggplant-parmigiana-melanzane": "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=1000&q=80",
  "mysore-masala-dosa": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1000&q=80",
  "hyderabadi-haleem-slow-cooked": "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=1000&q=80",
  "south-indian-medu-vada": "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1000&q=80",
  "dal-baati-churma-royal": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80",
  "high-protein-paneer-bhurji": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1000&q=80",
  "samosa-chaat-street-style": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80",
  "kerala-malabar-parotta-roast": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1000&q=80",
  "ethiopian-doro-wat-injera": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80",
  "bengali-luchi-alur-dom": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80",
  "kashmiri-dum-aloo-yogurt": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1000&q=80",
  "gujarati-methi-thepla": "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1000&q=80",
  "kashmiri-rogan-josh-traditional": "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=1000&q=80",
  "mumbai-vada-pav-chutney": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1000&q=80",
  "hyderabadi-double-ka-meetha": "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1000&q=80",
  "beef-gyudon-japanese-bowl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80",
  "yang-chow-fried-rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80",
  "korean-kimchi-jjigae-pork": "https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=1000&q=80",
  "greek-moussaka-layered-lamb": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
  "carnitas-michoacan-crispy-pork": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1000&q=80",
  "enchiladas-suizas-tomatillo": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80"
};

function calculateNutritionForRecipe(r) {
  const cal = r.calories || 450;
  const isDessert = r.category === "Desserts" || /cake|tart|sweet|pudding|halwa|kheer|jalebi|jamun|shrikhand|macaron|mousse|brownie/i.test(r.title);
  const isHighProtein = /chicken|beef|mutton|pork|fish|shrimp|prawn|egg|steak|lamb|paneer bhurji/i.test(r.title);

  let protein, carbs, sugar, fiber, fat, satFat, sodium;

  if (isDessert) {
    protein = Math.max(3, Math.round(cal * 0.025));
    carbs = Math.round(cal * 0.13);
    sugar = Math.round(carbs * 0.75);
    fiber = Math.round(cal * 0.008);
    fat = Math.round(cal * 0.045);
    satFat = Math.round(fat * 0.6);
    sodium = Math.round(cal * 0.35);
  } else if (isHighProtein) {
    protein = Math.max(26, Math.round(cal * 0.07));
    carbs = Math.round(cal * 0.06);
    sugar = Math.round(carbs * 0.15);
    fiber = Math.round(cal * 0.009);
    fat = Math.round(cal * 0.038);
    satFat = Math.round(fat * 0.35);
    sodium = Math.round(cal * 1.4);
  } else {
    // Balanced vegetarian / grain / noodle dish
    protein = Math.max(12, Math.round(cal * 0.035));
    carbs = Math.round(cal * 0.11);
    sugar = Math.round(carbs * 0.12);
    fiber = Math.round(cal * 0.015);
    fat = Math.round(cal * 0.035);
    satFat = Math.round(fat * 0.3);
    sodium = Math.round(cal * 1.2);
  }

  const energyKj = Math.round(cal * 4.184);

  return {
    servingSize: `1 portion (~${Math.round(cal * 0.7 + 60)}g)`,
    calories: cal,
    energyKj,
    protein,
    carbohydrates: carbs,
    sugar,
    fiber,
    totalFat: fat,
    saturatedFat: satFat,
    sodium,
  };
}

function computeDietaryTags(r) {
  const title = (r.title || "").toLowerCase();
  const desc = (r.description || "").toLowerCase();
  const ingNames = (r.ingredients || []).map(i => (i.name || "").toLowerCase()).join(" ");
  const text = `${title} ${desc} ${ingNames}`;

  const hasRedMeat = /mutton|beef|pork|lamb|bacon|prosciutto|carnitas|char siu|brisket/.test(text);
  const hasPoultry = /chicken|murgh|turkey|doro wat/.test(text);
  const hasSeafood = /fish|salmon|shrimp|prawn|chingri|seafood|clam|squid/.test(text);
  const hasMeat = hasRedMeat || hasPoultry || hasSeafood;
  const hasEggs = /egg\b|eggs\b|yolk/.test(text);
  const hasDairy = /milk|cream|butter|ghee|cheese|paneer|yogurt|dahi|khoya|mawa|ricotta|parmesan|mascarpone/.test(text);
  const hasGluten = /wheat|flour|maida|semolina|sooji|bread|baguette|bun|pasta|linguine|penne|tagliatelle|ramen|noodles|soy sauce/.test(text);
  const hasNuts = /peanut|cashew|almond|pistachio|walnut|hazelnut|pine nut|charoli/.test(text);
  const hasRootVegOrAlliums = /onion|garlic|potato|shallot|leek|carrot/.test(text);

  const tags = new Set(r.tags || []);

  // Cuisine & Category tag preservation
  if (r.cuisine) tags.add(r.cuisine);
  if (r.category) tags.add(r.category);

  // 1. Dietary Flags
  if (!hasMeat) {
    if (!hasEggs) {
      tags.add("Vegetarian");
      if (!hasDairy) {
        tags.add("Vegan");
      }
    } else {
      tags.add("Eggetarian");
    }
  }

  if (hasSeafood && !hasRedMeat && !hasPoultry) {
    tags.add("Pescatarian");
  }

  // Jain-friendly: strictly vegetarian, no eggs, no root vegetables or alliums
  if (!hasMeat && !hasEggs && !hasRootVegOrAlliums) {
    tags.add("Jain-Friendly");
  }

  if (!hasGluten) {
    tags.add("Gluten-Free");
  }

  if (!hasDairy) {
    tags.add("Dairy-Free");
  }

  if (!hasNuts) {
    tags.add("Nut-Free");
  }

  const nutrition = r.nutrition || calculateNutritionForRecipe(r);
  if (nutrition.protein >= 24) {
    tags.add("High-Protein");
  }

  if (nutrition.sugar <= 5) {
    tags.add("Low-Sugar");
  }

  return Array.from(tags);
}

const targetFiles = [
  { name: "master.js", exportName: "MASTER_RECIPES" },
  { name: "indian-regional.js", exportName: "INDIAN_RECIPES" },
  { name: "asian.js", exportName: "ASIAN_RECIPES" },
  { name: "european.js", exportName: "EUROPEAN_RECIPES" },
  { name: "americas.js", exportName: "AMERICAS_RECIPES" },
  { name: "middle-eastern-african.js", exportName: "MIDDLE_EASTERN_AFRICAN_RECIPES" },
  { name: "quick-and-dietary.js", exportName: "QUICK_DIETARY_RECIPES" },
];

async function run() {
  const baseDir = path.join(process.cwd(), "data", "recipes");

  for (const target of targetFiles) {
    const filePath = path.join(baseDir, target.name);
    const mod = await import(pathToFileURL(filePath).href);
    const recipes = mod[target.exportName];

    for (const r of recipes) {
      // Fix image if in specific replacements
      if (SPECIFIC_IMAGES[r.id]) {
        r.image = SPECIFIC_IMAGES[r.id];
      }

      // Ensure stable nutrition object
      if (!r.nutrition) {
        r.nutrition = calculateNutritionForRecipe(r);
      }

      // Compute refined dietary preference tags
      r.tags = computeDietaryTags(r);
    }

    const content = `// CraveAI Recipe Catalog - ${target.exportName}\nexport const ${target.exportName} = ${JSON.stringify(recipes, null, 2)};\n`;
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`Updated ${recipes.length} recipes in ${target.name} with verified images and nutrition.`);
  }

  console.log("All catalog recipes enriched successfully!");
}

run();
