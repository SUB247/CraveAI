import { NextResponse } from "next/server";
import { getServerSupabase, getVerifiedUser } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const user = await getVerifiedUser();
    if (!user) {
      // Guests don't fail, we just return status 200 with anonymous acknowledgment
      return NextResponse.json({ success: true, recorded: false, reason: "anonymous" });
    }

    const supabase = await getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ success: true, recorded: false, reason: "unconfigured" });
    }

    const body = await request.json();
    const { recipeId, interactionType = "view" } = body;

    const validTypes = ["view", "save", "search_select", "cook"];
    if (!recipeId || !validTypes.includes(interactionType)) {
      return NextResponse.json({ error: "Invalid recipeId or interactionType" }, { status: 400 });
    }

    // Insert interaction
    const { error } = await supabase.from("recipe_interactions").insert({
      user_id: user.id,
      recipe_id: recipeId,
      interaction_type: interactionType,
    });

    if (error) {
      console.warn("Could not log interaction:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, recorded: true });
  } catch (error) {
    console.error("Interaction logging error:", error);
    return NextResponse.json({ error: "Failed to log interaction" }, { status: 500 });
  }
}
