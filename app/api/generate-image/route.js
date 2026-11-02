import { NextResponse } from "next/server";

// In-memory cache for generated images during runtime
const imageCache = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, dishName = "Gourmet Dish", cuisine = "International" } = body;

    if (!prompt && !dishName) {
      return NextResponse.json({ error: "Prompt or dishName is required" }, { status: 400 });
    }

    const cacheKey = (prompt || dishName).trim().toLowerCase();
    if (imageCache.has(cacheKey)) {
      return NextResponse.json({
        imageUrl: imageCache.get(cacheKey),
        isAiGenerated: true,
        cached: true,
      });
    }

    // Curated high quality food photography fallbacks mapped by culinary themes
    const getCuratedFoodImage = (dish, style) => {
      const text = `${dish} ${style}`.toLowerCase();
      if (text.includes("curry") || text.includes("indian") || text.includes("paneer") || text.includes("tikka")) {
        return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80";
      }
      if (text.includes("pasta") || text.includes("italian") || text.includes("spaghetti") || text.includes("linguine")) {
        return "https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&w=1200&q=80";
      }
      if (text.includes("dumpling") || text.includes("asian") || text.includes("noodle") || text.includes("wok")) {
        return "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1200&q=80";
      }
      if (text.includes("dessert") || text.includes("cake") || text.includes("tart") || text.includes("chocolate")) {
        return "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80";
      }
      if (text.includes("pancake") || text.includes("breakfast") || text.includes("egg") || text.includes("shakshuka")) {
        return "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1200&q=80";
      }
      if (text.includes("salad") || text.includes("vegan") || text.includes("bowl") || text.includes("cauliflower")) {
        return "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80";
      }
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";
    };

    // 1. Check for dedicated OpenAI / Together / Stability / Replicate Image API key
    const imageApiKey = process.env.IMAGE_API_KEY || process.env.OPENAI_API_KEY;

    if (imageApiKey && process.env.OPENAI_API_KEY) {
      try {
        const aiPrompt = prompt || `Professional food photography of ${dishName}, ${cuisine} cuisine, styled for Bon Appétit magazine, shallow depth of field, warm natural restaurant lighting, high resolution, 8k.`;
        
        const openAiRes = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${imageApiKey}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: aiPrompt,
            n: 1,
            size: "1024x1024",
          }),
        });

        if (openAiRes.ok) {
          const data = await openAiRes.json();
          const generatedUrl = data.data?.[0]?.url;
          if (generatedUrl) {
            imageCache.set(cacheKey, generatedUrl);
            return NextResponse.json({
              imageUrl: generatedUrl,
              isAiGenerated: true,
              source: "dall-e-3",
            });
          }
        }
      } catch (err) {
        console.error("OpenAI DALL-E generation failed, falling back:", err);
      }
    }

    // 2. Real AI Food Image Generation using Flux AI endpoint
    try {
      const cleanPrompt = encodeURIComponent(
        (prompt || `gourmet ${dishName} ${cuisine} delicious food photography professional lighting magazine style`)
          .slice(0, 300)
      );
      // High-performance Flux food model endpoint
      const aiImageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=768&nologo=true&model=flux`;

      // Quick head check or verification that endpoint is reachable
      const checkRes = await fetch(aiImageUrl, { method: "HEAD", signal: AbortSignal.timeout(2500) });
      if (checkRes.ok) {
        imageCache.set(cacheKey, aiImageUrl);
        return NextResponse.json({
          imageUrl: aiImageUrl,
          isAiGenerated: true,
          source: "flux-ai",
        });
      }
    } catch (fluxErr) {
      console.log("Flux image endpoint timed out or unavailable, using curated culinary photography:", fluxErr.message);
    }

    // 3. Fallback: Curated high resolution culinary photography
    // Note: We explicitly mark isAiGenerated: false as required by user guidelines
    const curatedImage = getCuratedFoodImage(dishName, cuisine);
    return NextResponse.json({
      imageUrl: curatedImage,
      isAiGenerated: false,
      source: "curated-culinary-photography",
      notice: "Using curated food photography fallback. To enable custom AI image generation, configure IMAGE_API_KEY in .env.local.",
    });
  } catch (error) {
    console.error("Image generation API error:", error);
    return NextResponse.json(
      {
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
        isAiGenerated: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
