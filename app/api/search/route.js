import { NextResponse } from "next/server";
import { searchRecipes } from "@/lib/recipes-repository";
import { recordSearch } from "@/lib/search-history-service";
import { getVerifiedUser } from "@/lib/supabase/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").slice(0, 100);
    const category = searchParams.get("category") || "all";
    const cuisine = searchParams.get("cuisine") || "All Cuisines";
    const difficulty = searchParams.get("difficulty") || "all";
    const maxTime = searchParams.get("maxTime") ? Number(searchParams.get("maxTime")) : null;
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(24, Math.max(1, Number(searchParams.get("limit") || 12)));
    const sortBy = searchParams.get("sortBy") || "relevance";
    const rawDietary = searchParams.get("dietary") || searchParams.get("dietaryPreferences") || "";
    const dietaryPreferences = rawDietary ? rawDietary.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const dessertSubcategory = searchParams.get("dessertSubcategory") || "all";

    const user = await getVerifiedUser();
    const userId = user?.id || null;

    // Search through repository (Supabase full-text with catalog fallback)
    const results = await searchRecipes({
      query: q,
      category,
      cuisine,
      difficulty,
      maxCookTime: maxTime,
      dietaryPreferences,
      dessertSubcategory,
      page,
      limit,
      sortBy,
    });

    // If query is meaningful and user is authenticated, record into search history
    if (userId && q.trim().length >= 2) {
      // Fire and forget recording so search latency isn't delayed
      recordSearch({
        userId,
        query: q,
        category: category !== "all" ? category : null,
        resultCount: results.totalCount,
      }).catch((e) => console.warn("Failed recording search:", e));
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search request failed. Please try again." },
      { status: 500 }
    );
  }
}
