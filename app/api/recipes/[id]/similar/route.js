import { NextResponse } from "next/server";
import { getSimilarRecipes } from "@/lib/recommendation-engine";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Recipe ID required" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(10, Math.max(1, Number(searchParams.get("limit") || 4)));

    const similar = await getSimilarRecipes(id, limit);
    return NextResponse.json({ recipeId: id, similar });
  } catch (error) {
    console.error("GET similar recipes error:", error);
    return NextResponse.json({ error: "Failed to fetch similar recipes" }, { status: 500 });
  }
}
