"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  X,
  Clock,
  Star,
  Sparkles,
  Flame,
  Trash2,
  TrendingUp,
  History,
  ChefHat,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";

export default function SearchBar({
  placeholder = "Search recipes, ingredients, or cuisines (e.g. 'pasta', 'makhani')...",
  initialValue = "",
  variant = "hero", // 'hero' | 'compact'
  onSearch,
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sync initial value changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Fetch autocomplete suggestions
  const fetchSuggestions = useCallback(async (searchQuery) => {
    // Cancel any ongoing fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);

    try {
      const res = await fetch(
        `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`,
        { signal: abortControllerRef.current.signal }
      );

      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.warn("Autocomplete fetch error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle typing with debouncing (~250ms)
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(-1);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 250);
  };

  // Focus handler: fetch suggestions if not already loaded
  const handleFocus = () => {
    setIsOpen(true);
    if (!suggestions) {
      fetchSuggestions(query);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Submit search query
  const executeSearch = (targetQuery, selectedRecipeId = null) => {
    setIsOpen(false);
    const clean = (targetQuery || query).trim();

    if (onSearch) {
      onSearch(clean);
    } else {
      if (clean) {
        router.push(`/explore?search=${encodeURIComponent(clean)}`);
      } else {
        router.push("/explore");
      }
    }
  };

  // Delete a single search history item
  const handleDeleteHistory = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`/api/search/history?id=${id}`, { method: "DELETE" });
      setSuggestions((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          recentSearches: prev.recentSearches.filter((item) => item.id !== id),
        };
      });
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  // Clear all search history
  const handleClearAllHistory = async (e) => {
    e.stopPropagation();
    try {
      await fetch("/api/search/history?clearAll=true", { method: "DELETE" });
      setSuggestions((prev) => {
        if (!prev) return prev;
        return { ...prev, recentSearches: [] };
      });
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  // Collect all navigable items for arrow key navigation
  const flatItems = [];
  if (suggestions) {
    (suggestions.recentSearches || []).forEach((item) =>
      flatItems.push({ type: "history", data: item })
    );
    (suggestions.recipes || []).forEach((item) =>
      flatItems.push({ type: "recipe", data: item })
    );
    (suggestions.ingredients || []).forEach((item) =>
      flatItems.push({ type: "ingredient", data: item })
    );
    (suggestions.cuisines || []).forEach((item) =>
      flatItems.push({ type: "cuisine", data: item })
    );
    (suggestions.personalized || []).forEach((item) =>
      flatItems.push({ type: "recipe", data: item })
    );
  }

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        fetchSuggestions(query);
      }
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < flatItems.length) {
        const item = flatItems[selectedIndex];
        if (item.type === "recipe") {
          router.push(`/recipe/${item.data.id}`);
          setIsOpen(false);
        } else if (item.type === "history") {
          setQuery(item.data.query);
          executeSearch(item.data.query);
        } else {
          setQuery(item.data);
          executeSearch(item.data);
        }
      } else {
        executeSearch(query);
      }
    }
  };

  // Substring highlight helper
  const renderHighlightedText = (text, highlight) => {
    if (!highlight || !text) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-[#D95338] font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const isCompact = variant === "compact";

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeSearch(query);
        }}
        className={`relative flex items-center bg-white transition-all ${
          isCompact
            ? "border border-[#E0D4C3] rounded-full py-2 px-3 focus-within:ring-2 focus-within:ring-[#D95338]/30 focus-within:border-[#D95338] shadow-xs"
            : "p-2 border-2 border-[#E8DEC8] rounded-full shadow-lg shadow-stone-200/50 hover:border-[#D95338]/60 focus-within:border-[#D95338] focus-within:ring-4 focus-within:ring-[#D95338]/15"
        }`}
      >
        <Search
          className={`shrink-0 text-stone-400 ${
            isCompact ? "w-4 h-4 ml-1" : "w-5 h-5 ml-2"
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-transparent text-stone-800 placeholder-stone-400 focus:outline-none px-3 font-sans ${
            isCompact ? "text-xs sm:text-sm py-0.5" : "text-sm sm:text-base py-1.5"
          }`}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
              fetchSuggestions("");
            }}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors mr-1"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="mr-2">
            <span className="block w-4 h-4 border-2 border-[#D95338] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Submit Button (Only on Hero / Large search bar) */}
        {!isCompact && (
          <button
            type="submit"
            className="shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#D95338] text-white text-xs sm:text-sm font-semibold hover:bg-[#C24329] active:scale-95 transition-all shadow-sm"
          >
            Search
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-3xl border border-[#E8DEC8] shadow-2xl overflow-hidden max-h-[520px] overflow-y-auto animate-in fade-in slide-in-from-top-2">
          {/* 1. Recent Searches */}
          {suggestions.recentSearches && suggestions.recentSearches.length > 0 && (
            <div className="p-3 sm:p-4 border-b border-[#F2ECE4]">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#D95338]" />
                  <span>Recent Searches</span>
                </span>
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  className="text-[11px] text-stone-400 hover:text-rose-600 transition-colors lowercase"
                >
                  clear all
                </button>
              </div>

              <div className="space-y-1">
                {suggestions.recentSearches.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setQuery(item.query);
                      executeSearch(item.query);
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#FAF7F2] text-xs sm:text-sm text-stone-700 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#D95338] shrink-0" />
                      <span className="truncate">{item.query}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteHistory(e, item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-500 rounded-md transition-all"
                      title="Remove from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Recipe Matches or Popular Dishes */}
          {suggestions.recipes && suggestions.recipes.length > 0 && (
            <div className="p-3 sm:p-4 border-b border-[#F2ECE4]">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5 px-2 flex items-center gap-1.5">
                {query ? (
                  <>
                    <ChefHat className="w-3.5 h-3.5 text-[#D95338]" />
                    <span>Matching Recipes</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-[#D95338]" />
                    <span>Popular Right Now</span>
                  </>
                )}
              </div>

              <div className="space-y-1.5">
                {suggestions.recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => {
                      router.push(`/recipe/${recipe.id}`);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#FAF7F2] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200" style={{ position: "relative" }}>
                        <Image
                          src={recipe.image}
                          alt={recipe.title}
                          fill
                          sizes="48px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <div className="font-serif text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#D95338] transition-colors line-clamp-1">
                          {renderHighlightedText(recipe.title, query)}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                          <span>{recipe.cuisine}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {recipe.cookTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0 mr-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{recipe.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Ingredients, Cuisines & Categories */}
          {((suggestions.ingredients && suggestions.ingredients.length > 0) ||
            (suggestions.cuisines && suggestions.cuisines.length > 0) ||
            (suggestions.categories && suggestions.categories.length > 0)) && (
            <div className="p-3 sm:p-4 border-b border-[#F2ECE4] space-y-3">
              {suggestions.ingredients?.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5 px-2">
                    Ingredients
                  </span>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {suggestions.ingredients.map((ing, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setQuery(ing);
                          executeSearch(ing);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#FCEEEA] hover:text-[#D95338] text-stone-700 text-xs font-medium border border-[#E8DEC8] transition-colors"
                      >
                        {renderHighlightedText(ing, query)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.cuisines?.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5 px-2">
                    Cuisines & Traditions
                  </span>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {suggestions.cuisines.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          router.push(`/explore?cuisine=${encodeURIComponent(c)}`);
                          setIsOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF7F2] text-stone-800 text-xs font-medium border border-stone-200 transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Personalized Suggestions */}
          {suggestions.personalized && suggestions.personalized.length > 0 && (
            <div className="p-3 sm:p-4 bg-gradient-to-br from-[#FAF7F2] to-[#FFFBF5]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#D95338] mb-2 px-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalized Suggestions</span>
              </div>
              <div className="space-y-1.5">
                {suggestions.personalized.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      router.push(`/recipe/${p.id}`);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-white cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-serif text-xs sm:text-sm font-bold text-stone-900">
                        {p.title}
                      </div>
                      <span className="text-[10px] text-stone-500">{p.reason}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty Results State */}
          {query &&
            (!suggestions.recipes || suggestions.recipes.length === 0) &&
            (!suggestions.ingredients || suggestions.ingredients.length === 0) &&
            (!suggestions.cuisines || suggestions.cuisines.length === 0) && (
              <div className="p-8 text-center space-y-2">
                <UtensilsCrossed className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="font-serif text-sm font-semibold text-stone-800">
                  No direct matches for "{query}"
                </p>
                <p className="text-xs text-stone-500">
                  Press Enter to perform a full pantry search, or browse our culinary catalog.
                </p>
                <button
                  type="button"
                  onClick={() => executeSearch(query)}
                  className="mt-2 px-4 py-2 rounded-full bg-[#D95338] text-white text-xs font-semibold hover:bg-[#C24329]"
                >
                  Search all recipes &rarr;
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
