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

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const supabase = await getServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Failed to initialize Supabase client" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    const isNetworkError =
      error?.message?.includes("fetch failed") ||
      error?.cause?.code === "ENOTFOUND" ||
      error?.code === "ENOTFOUND";

    if (isNetworkError) {
      const url = getSupabaseUrl();
      return NextResponse.json(
        {
          error: `Unable to connect to Supabase (${url}). If your free-tier Supabase project was paused due to inactivity, please open your Supabase Dashboard and click 'Restore project'.`,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: error.message || "Failed to sign in" }, { status: 500 });
  }
}
