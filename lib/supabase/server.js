import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured, getSupabaseUrl, getSupabaseAnonKey } from "./config";

export async function getServerSupabase() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can be ignored if called from a Server Component
          }
        },
      },
    }
  );
}

/**
 * Verified authentication helper.
 * Uses `supabase.auth.getUser()`, which validates the token with the Supabase Auth server.
 * Never trust raw request headers or client-provided user IDs.
 */
export async function getVerifiedUser() {
  try {
    const cookieStore = await cookies();
    const all = cookieStore.getAll();
    const hasAuthCookie = all.some(
      (c) => c.name.includes("sb-") && (c.name.includes("auth-token") || c.name.includes("token"))
    );

    // If request contains no Supabase auth cookies, return null without remote network calls
    if (!hasAuthCookie) {
      return null;
    }

    const supabase = await getServerSupabase();
    if (!supabase) return null;

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error("Error verifying user session:", err);
    return null;
  }
}
