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

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = await getServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Failed to initialize Supabase client" },
        { status: 500 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/explore?reset_password=true`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Password reset instructions have been sent to your email.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
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

    return NextResponse.json({ error: error.message || "Failed to request password reset" }, { status: 500 });
  }
}
