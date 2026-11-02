import { NextResponse } from "next/server";
import { getVerifiedUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET() {
  try {
    const configured = isSupabaseConfigured();
    if (!configured) {
      return NextResponse.json({
        user: null,
        authenticated: false,
        configured: false,
      });
    }

    const user = await getVerifiedUser();
    return NextResponse.json({
      user: user
        ? {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
          }
        : null,
      authenticated: Boolean(user),
      configured: true,
    });
  } catch (error) {
    console.error("Auth status error:", error);
    return NextResponse.json({ user: null, authenticated: false, configured: false }, { status: 500 });
  }
}
