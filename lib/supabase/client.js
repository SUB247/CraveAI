import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, getSupabaseUrl, getSupabaseAnonKey } from "./config";

let browserClient = null;

export function getBrowserSupabase() {
  if (typeof window === "undefined") return null;
  if (!isSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createBrowserClient(
      getSupabaseUrl(),
      getSupabaseAnonKey()
    );
  }

  return browserClient;
}
