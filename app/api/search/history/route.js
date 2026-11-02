import { NextResponse } from "next/server";
import { getVerifiedUser } from "@/lib/supabase/server";
import {
  getRecentSearches,
  recordSearch,
  deleteSearchItem,
  clearAllSearchHistory,
} from "@/lib/search-history-service";

export async function GET(request) {
  try {
    const user = await getVerifiedUser();
    if (!user) {
      return NextResponse.json({ history: [], authenticated: false });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(20, Math.max(1, Number(searchParams.get("limit") || 10)));

    const history = await getRecentSearches(user.id, limit);
    return NextResponse.json({ history, authenticated: true });
  } catch (error) {
    console.error("GET search history error:", error);
    return NextResponse.json({ error: "Failed to fetch search history" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getVerifiedUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to persist server search history" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { query, selectedRecipeId = null, category = null, resultCount = 0 } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const saved = await recordSearch({
      userId: user.id,
      query,
      selectedRecipeId,
      category,
      resultCount,
    });

    return NextResponse.json({ success: true, item: saved });
  } catch (error) {
    console.error("POST search history error:", error);
    return NextResponse.json({ error: "Failed to record search" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getVerifiedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("clearAll") === "true";

    if (clearAll) {
      const cleared = await clearAllSearchHistory(user.id);
      return NextResponse.json({ success: cleared, clearedAll: true });
    }

    if (!id) {
      return NextResponse.json({ error: "Search ID or clearAll=true required" }, { status: 400 });
    }

    const deleted = await deleteSearchItem(user.id, id);
    return NextResponse.json({ success: deleted, id });
  } catch (error) {
    console.error("DELETE search history error:", error);
    return NextResponse.json({ error: "Failed to delete search history" }, { status: 500 });
  }
}
