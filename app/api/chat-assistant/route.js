import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const body = await request.json();
    const { recipe, messages = [], prompt = "" } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `You are Chef Antigravity, an elite executive chef and gentle cooking instructor at CraveAI.
You are currently helping the user cook: "${recipe?.title || "a signature recipe"}".
Cuisine: ${recipe?.cuisine || "Culinary"}
Known ingredients: ${JSON.stringify(recipe?.ingredients?.map((i) => `${i.amount} ${i.unit} ${i.name}`) || [])}
Known steps: ${JSON.stringify(recipe?.steps?.map((s) => `${s.step}. ${s.title}: ${s.instruction}`) || [])}
Chef Tips: ${JSON.stringify(recipe?.chefTips || [])}
Allergens: ${JSON.stringify(recipe?.allergens || [])}

Rules:
1. Keep responses concise, warm, practical, and directly applicable to THIS recipe.
2. Emphasize sensory cues (smell, color, sound, texture) over rigid timers.
3. If the user asks for a substitution, give 1-2 realistic household alternatives with exact ratios.
4. If they made a mistake (burned garlic, seized sauce), provide an immediate culinary rescue technique.
5. Do not write markdown walls of text; keep it conversational (2-4 paragraphs max).`;

        // Compose prompt
        const fullPrompt = `${systemInstruction}\n\nUser Question: ${prompt}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: fullPrompt,
        });

        const reply = response.text || "Keep your heat gentle, taste for salt, and cook with joy!";

        return NextResponse.json({ reply, source: "gemini" });
      } catch (geminiError) {
        console.error("Gemini assistant error, falling back to smart sous-chef:", geminiError);
      }
    }

    // Smart Fallback Culinary Assistant when GEMINI_API_KEY is not configured
    const fallbackReply = generateSmartChefReply(prompt, recipe);
    return NextResponse.json({
      reply: fallbackReply,
      source: "craveai-smart-chef",
      notice: !apiKey
        ? "AI Sous-Chef running in CraveAI culinary mode. Add GEMINI_API_KEY to .env.local to activate Gemini 2.5 Flash."
        : undefined,
    });
  } catch (error) {
    console.error("Chat assistant route error:", error);
    return NextResponse.json(
      { error: "Assistant could not process your cooking question." },
      { status: 500 }
    );
  }
}

/**
 * Intelligent culinary responder for cooking questions
 */
function generateSmartChefReply(prompt, recipe) {
  const query = prompt.toLowerCase();
  const dishName = recipe?.title || "this dish";

  // Substitution queries
  if (query.includes("substitute") || query.includes("swap") || query.includes("replace") || query.includes("instead of")) {
    if (query.includes("cream") || query.includes("milk") || query.includes("dairy")) {
      return `For dairy swaps in **${dishName}**: full-fat coconut cream or cashew cream (soaked cashews blended 1:1 with warm water) provides the same rich mouthfeel and fat emulsion without splitting under heat. Use an exact 1:1 ratio.`;
    }
    if (query.includes("butter")) {
      return `You can swap butter 1:1 with extra virgin olive oil, ghee, or neutral avocado oil. If you need it for a velvety sauce finish ('mantecatura'), make sure the oil or plant butter is very cold to form a stable emulsion!`;
    }
    if (query.includes("wine")) {
      return `No wine on hand? Substitute with equal parts rich vegetable broth plus 1 tablespoon of fresh lemon juice or white wine vinegar. This preserves the bright acidity required to balance the rich sauce.`;
    }
    return `For ${dishName}, you can safely substitute similar ingredients within the same family (e.g., swapping shallots for red onions, or vegetable broth for chicken stock). Keep the moisture ratio balanced and adjust salt to taste!`;
  }

  // Done / Readiness / Doneness
  if (query.includes("done") || query.includes("how do i know") || query.includes("ready") || query.includes("cooked")) {
    return `Look for sensory cues rather than watching the clock! In **${dishName}**, your sauce is properly reduced when it coats the back of a wooden spoon and leaves a clear path when you draw your finger across ('nappe'). Any seared elements should smell sweet and nutty with deep golden amber color.`;
  }

  // Ahead / Prep / Reheat
  if (query.includes("ahead") || query.includes("advance") || query.includes("day before") || query.includes("leftover")) {
    return `Yes! **${dishName}** is fantastic when made ahead because the complex aromatics have time to infuse deeper into the sauce. Cool it completely to room temperature, store in an airtight glass container, and refrigerate for up to 3 days. When reheating, splash in 2 tablespoons of water or broth over medium-low heat to restore the glossy emulsion.`;
  }

  // Heat / Burn / Seized
  if (query.includes("burn") || query.includes("too salty") || query.includes("curdle") || query.includes("seize")) {
    if (query.includes("salty")) {
      return `Don't panic! To rescue a sauce that is too salty: stir in a splash of unsalted cream, a squeeze of lemon juice, or simmer a peeled quartered potato in the sauce for 10 minutes to absorb excess sodium, then discard the potato.`;
    }
    return `If your sauce begins to separate or cook too aggressively, immediately pull the pan off the heat and whisk in 1 tablespoon of ice-cold water or cream. The sudden drop in temperature and moisture helps the emulsion bind back together.`;
  }

  // Wine / Beverage Pairing
  if (query.includes("wine") || query.includes("drink") || query.includes("pair")) {
    return `To complement the rich flavor profile of **${dishName}**: a crisp, high-acidity dry white (like an Italian Pinot Grigio or Sauvignon Blanc) cuts through rich fats beautifully. For non-alcoholic pairings, sparkling water with crushed mint and a wedge of Meyer lemon is refreshing perfection!`;
  }

  // General culinary encouragement
  return `Great question for **${dishName}**! In culinary mastery, balance is everything: keep your heat moderate, taste the sauce at each stage, and remember to salt in layers rather than all at once. Let me know if you need specific step guidance or timing checks!`;
}
