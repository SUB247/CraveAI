import { NextResponse } from "next/server";
import { getVerifiedUser } from "@/lib/supabase/server";
import { getPersonalizedRecommendations } from "@/lib/recommendation-engine";

export async function GET() {
  try {
    const user = await getVerifiedUser();
    const userId = user?.id || null;

    const data = await getPersonalizedRecommendations({ userId, limit: 12 });
    return NextResponse.json({
      ...data,
      authenticated: Boolean(userId),
    });
  } catch (error) {
    console.error("GET recommendations error:", error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
