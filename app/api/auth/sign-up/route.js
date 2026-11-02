import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured, getSupabaseUrl } from "@/lib/supabase/config";

export async function POST(request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase database credentials are not yet configured in .env.local" },
        { status: 503 }
      );
    }

    const { email, password, fullName = "" } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const supabase = await getServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Failed to initialize Supabase client" },
        { status: 500 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Initialize user_preferences record if user and session were created
    if (data?.user?.id) {
      try {
        await supabase.from("user_preferences").upsert({
          user_id: data.user.id,
          preferred_cuisines: [],
          dietary_preferences: [],
          excluded_ingredients: [],
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      } catch (prefErr) {
        console.warn("Could not pre-initialize preferences table:", prefErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        confirmationSent: !data.session,
      },
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    const isNetworkError =
      error?.message?.includes("fetch failed") ||
      error?.cause?.code === "ENOTFOUND" ||
      error?.code === "ENOTFOUND";

    if (isNetworkError) {
      const url = getSupabaseUrl();
      return NextResponse.json(
        {
          error: `Unable to connect to Supabase (${url}). If your free-tier Supabase project was paused due to 7 days of inactivity, please open your Supabase Dashboard and click 'Restore project'.`,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: error.message || "Failed to sign up" }, { status: 500 });
  }
}
