import { createClient } from "@supabase/supabase-js";
import { isSupabaseAdminConfigured, getSupabaseUrl, getSupabaseServiceKey } from "./config";

export function getAdminSupabase() {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  return createClient(
    getSupabaseUrl(),
    getSupabaseServiceKey(),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
