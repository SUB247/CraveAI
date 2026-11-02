import { getServerSupabase } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

/**
 * Clean and normalize a search query
 */
export function normalizeQuery(query) {
  if (!query) return "";
  return query
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Retrieve recent search queries for a user
 */
export async function getRecentSearches(userId, limit = 6) {
  if (!userId || !isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await getServerSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("search_history")
      .select("id, query, normalized_query, selected_recipe_id, category, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("Could not fetch search history:", error.message);
      return [];
    }

    // Deduplicate consecutive/identical normalized queries in results
    const seen = new Set();
    const unique = [];
    for (const item of data || []) {
      if (!seen.has(item.normalized_query)) {
        seen.add(item.normalized_query);
        unique.push(item);
      }
    }

    return unique;
  } catch (err) {
    console.error("Search history retrieval error:", err);
    return [];
  }
}

/**
 * Record a search query in Supabase
 */
export async function recordSearch({
  userId,
  query,
  selectedRecipeId = null,
  category = null,
  resultCount = 0,
}) {
  const clean = (query || "").trim();
  const normalized = normalizeQuery(clean);

  // Don't record trivial 1-letter or empty searches
  if (!userId || !clean || clean.length < 2 || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await getServerSupabase();
    if (!supabase) return null;

    // Check if the user recently performed this exact normalized query within 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: recent } = await supabase
      .from("search_history")
      .select("id")
      .eq("user_id", userId)
      .eq("normalized_query", normalized)
      .gte("created_at", tenMinutesAgo)
      .limit(1);

    if (recent && recent.length > 0) {
      // Refresh the timestamp instead of inserting duplicate row
      const { data, error } = await supabase
        .from("search_history")
        .update({
          created_at: new Date().toISOString(),
          selected_recipe_id: selectedRecipeId,
          result_count: resultCount,
        })
        .eq("id", recent[0].id)
        .select()
        .single();

      return data;
    }

    const { data, error } = await supabase
      .from("search_history")
      .insert({
        user_id: userId,
        query: clean,
        normalized_query: normalized,
        selected_recipe_id: selectedRecipeId,
        category,
        result_count: resultCount,
      })
      .select()
      .single();

    if (error) {
      console.warn("Could not record search history:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error recording search:", err);
    return null;
  }
}

/**
 * Delete a single search history entry
 */
export async function deleteSearchItem(userId, searchId) {
  if (!userId || !searchId || !isSupabaseConfigured()) {
    return false;
  }

  try {
    const supabase = await getServerSupabase();
    if (!supabase) return false;

    const { error } = await supabase
      .from("search_history")
      .delete()
      .eq("id", searchId)
      .eq("user_id", userId);

    return !error;
  } catch (err) {
    console.error("Error deleting search item:", err);
    return false;
  }
}

/**
 * Clear all search history for a user
 */
export async function clearAllSearchHistory(userId) {
  if (!userId || !isSupabaseConfigured()) {
    return false;
  }

  try {
    const supabase = await getServerSupabase();
    if (!supabase) return false;

    const { error } = await supabase
      .from("search_history")
      .delete()
      .eq("user_id", userId);

    return !error;
  } catch (err) {
    console.error("Error clearing search history:", err);
    return false;
  }
}
