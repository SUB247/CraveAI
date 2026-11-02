import { NextResponse } from "next/server";
import { getServerSupabase, getVerifiedUser } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await getVerifiedUser();
    if (!user) {
      return NextResponse.json({ preferences: null, authenticated: false });
    }

    const supabase = await getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ preferences: null, authenticated: true });
    }

    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.warn("Could not fetch user preferences:", error.message);
    }

    return NextResponse.json({
      preferences: data || {
        preferred_cuisines: [],
        dietary_preferences: [],
        excluded_ingredients: [],
        preferred_categories: [],
        maximum_cooking_time: null,
      },
      authenticated: true,
    });
  } catch (error) {
    console.error("GET user preferences error:", error);
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getVerifiedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await request.json();
    const {
      preferred_cuisines,
      dietary_preferences,
      excluded_ingredients,
      preferred_categories,
      maximum_cooking_time,
    } = body;

    const payload = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    if (Array.isArray(preferred_cuisines)) payload.preferred_cuisines = preferred_cuisines;
    if (Array.isArray(dietary_preferences)) payload.dietary_preferences = dietary_preferences;
    if (Array.isArray(excluded_ingredients)) payload.excluded_ingredients = excluded_ingredients;
    if (Array.isArray(preferred_categories)) payload.preferred_categories = preferred_categories;
    if (maximum_cooking_time !== undefined) payload.maximum_cooking_time = maximum_cooking_time;

    const { data, error } = await supabase
      .from("user_preferences")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      console.error("Failed to update user preferences:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, preferences: data });
  } catch (error) {
    console.error("PATCH user preferences error:", error);
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
