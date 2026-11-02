import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await getServerSupabase();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sign-out error:", error);
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
}
