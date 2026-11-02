"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  Sliders,
  X,
  Clock,
  Sparkles,
  RotateCcw,
  History,
  TrendingUp,
  Trash2,
  ChefHat,
  ArrowRight,
  ShieldAlert,
  Check,
} from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import CategoryPills from "@/components/CategoryPills";
import SearchBar from "@/components/SearchBar";
import { CATEGORIES, CUISINES } from "@/data/recipes";
import { DIETARY_OPTIONS, DESSERT_SUBCATEGORIES } from "@/lib/recipe-helpers";

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameters
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialCuisine = searchParams.get("cuisine") || "All Cuisines";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [selectedDessertSubcategory, setSelectedDessertSubcategory] = useState("all");
  const [activeDietaryFilters, setActiveDietaryFilters] = useState([]);
  const [difficulty, setDifficulty] = useState("all");
  const [maxCookTime, setMaxCookTime] = useState(150);
  const [sortBy, setSortBy] = useState("relevance");

  // Search Results State
  const [searchResults, setSearchResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);

  // Recommendations State
  const [recommendations, setRecommendations] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // User Preferences State
  const [preferences, setPreferences] = useState({
    preferred_cuisines: [],
    dietary_preferences: [],
    excluded_ingredients: [],
  });
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savedPrefsToast, setSavedPrefsToast] = useState(false);

  // Sync params with URL changes
  useEffect(() => {
    const s = searchParams.get("search") || "";
    const c = searchParams.get("category") || "all";
    const cu = searchParams.get("cuisine") || "All Cuisines";
    setSearch(s);
    setSelectedCategory(c);
    setSelectedCuisine(cu);
    setPage(1);
  }, [searchParams]);

  // Fetch search results from backend API
  const fetchSearchResults = async (currentPage = 1, append = false) => {
    setSearchLoading(true);
    try {
      const isDessert = selectedCategory.toLowerCase() === "desserts";
      const params = new URLSearchParams({
        q: search,
        category: selectedCategory,
        cuisine: selectedCuisine,
        difficulty,
        maxTime: maxCookTime < 150 ? String(maxCookTime) : "",
        sortBy,
        dessertSubcategory: isDessert ? selectedDessertSubcategory : "all",
        dietary: activeDietaryFilters.join(","),
        page: String(currentPage),
        limit: "12",
      });

      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (append) {
          setSearchResults((prev) => {
            const existingIds = new Set(prev.map((r) => r.id));
            const newItems = (data.items || []).filter((r) => !existingIds.has(r.id));
            return [...prev, ...newItems];
          });
        } else {
          setSearchResults(data.items || []);
        }
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
        setPage(data.page || 1);
      }
    } catch (err) {
      console.error("Search query error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(1, false);
  }, [
    search,
    selectedCategory,
    selectedCuisine,
    selectedDessertSubcategory,
    activeDietaryFilters,
    difficulty,
    maxCookTime,
    sortBy,
  ]);

  // Fetch recommendations and search history
  const loadRecommendationsAndHistory = async () => {
    try {
      const [recRes, histRes, prefRes] = await Promise.all([
        fetch("/api/recommendations"),
        fetch("/api/search/history?limit=10"),
        fetch("/api/user/preferences"),
      ]);

      if (recRes.ok) {
        const recData = await recRes.json();
        setRecommendations(recData);
      }
      if (histRes.ok) {
        const histData = await histRes.json();
        setRecentSearches(histData.history || []);
      }
      if (prefRes.ok) {
        const prefData = await prefRes.json();
        if (prefData.preferences) {
          setPreferences(prefData.preferences);
          if (
            Array.isArray(prefData.preferences.dietary_preferences) &&
            prefData.preferences.dietary_preferences.length > 0
          ) {
            setActiveDietaryFilters((prev) =>
              prev.length === 0 ? prefData.preferences.dietary_preferences : prev
            );
          }
        }
      }
    } catch (e) {
      console.warn("Could not load recommendations:", e);
    }
  };

  useEffect(() => {
    loadRecommendationsAndHistory();
  }, []);

  // Delete search item
  const handleDeleteHistory = async (id) => {
    try {
      await fetch(`/api/search/history?id=${id}`, { method: "DELETE" });
      setRecentSearches((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting search history:", err);
    }
  };

  // Clear all history
  const handleClearAllHistory = async () => {
    try {
      await fetch("/api/search/history?clearAll=true", { method: "DELETE" });
      setRecentSearches([]);
    } catch (err) {
      console.error("Error clearing search history:", err);
    }
  };

  // Save Preferences
  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
      if (res.ok) {
        setSavedPrefsToast(true);
        setTimeout(() => setSavedPrefsToast(false), 2000);
        if (Array.isArray(preferences.dietary_preferences)) {
          setActiveDietaryFilters(preferences.dietary_preferences);
        }
        // Reload recommendations with newly saved preferences
        loadRecommendationsAndHistory();
      }
    } catch (err) {
      console.error("Failed to save preferences:", err);
    } finally {
      setSavingPrefs(false);
    }
  };

  const hasActiveFilters =
    search !== "" ||
    selectedCategory !== "all" ||
    selectedCuisine !== "All Cuisines" ||
    selectedDessertSubcategory !== "all" ||
    activeDietaryFilters.length > 0 ||
    difficulty !== "all" ||
    maxCookTime < 150;

  const resetAllFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedCuisine("All Cuisines");
    setSelectedDessertSubcategory("all");
    setActiveDietaryFilters([]);
    setDifficulty("all");
    setMaxCookTime(150);
    setSortBy("relevance");
    router.replace("/explore");
  };

  const isSearchActive = search.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Toast Notification */}
      {savedPrefsToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#221B1A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20 animate-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">Dietary preferences updated!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DEC8] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D95338]">
            Culinary Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#221B1A] mt-1">
            Explore All Recipes
          </h1>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80 relative">
          <SearchBar
            variant="compact"
            placeholder="Search dish or ingredients..."
            initialValue={search}
            onSearch={(newQuery) => {
              setSearch(newQuery);
              router.push(`/explore?search=${encodeURIComponent(newQuery)}`);
            }}
          />
        </div>
      </div>

      {/* Recent Searches Bar (if user has searches) */}
      {recentSearches.length > 0 && (
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="font-bold text-stone-500 flex items-center gap-1 shrink-0 uppercase tracking-wider text-[10px]">
              <History className="w-3.5 h-3.5 text-[#D95338]" /> Recent:
            </span>
            {recentSearches.map((item) => (
              <div
                key={item.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-stone-50 border border-[#E0D4C3] text-stone-700 transition-colors shrink-0 group"
              >
                <button
                  type="button"
                  onClick={() => {
                    setSearch(item.query);
                    router.push(`/explore?search=${encodeURIComponent(item.query)}`);
                  }}
                  className="font-medium hover:text-[#D95338]"
                >
                  {item.query}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteHistory(item.id)}
                  className="text-stone-400 hover:text-rose-600 ml-0.5"
                  title="Remove search"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleClearAllHistory}
            className="text-[11px] font-semibold text-stone-400 hover:text-rose-600 transition-colors"
          >
            Clear history
          </button>
        </div>
      )}

      {/* Category Pills Navigation */}
      <div>
        <CategoryPills
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => {
            setSelectedCategory(id);
            if (id.toLowerCase() !== "desserts") {
              setSelectedDessertSubcategory("all");
            }
            setPage(1);
            const params = new URLSearchParams(window.location.search);
            if (id === "all") {
              params.delete("category");
            } else {
              params.set("category", id);
            }
            const queryStr = params.toString();
            router.push(queryStr ? `/explore?${queryStr}` : "/explore");
          }}
        />
      </div>

      {/* Dessert Subcategory Filter Bar (Visible when browsing Desserts) */}
      {selectedCategory.toLowerCase() === "desserts" && (
        <div className="bg-[#FAF7F2] p-3 sm:p-4 rounded-2xl border border-[#E8DEC8] flex items-center gap-2 overflow-x-auto scrollbar-none animate-in fade-in">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D95338]" />
            Dessert Style:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {DESSERT_SUBCATEGORIES.map((sub) => {
              const active = selectedDessertSubcategory === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    setSelectedDessertSubcategory(sub.id);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-[#D95338] text-white shadow-xs"
                      : "bg-white text-stone-700 hover:bg-stone-50 border border-[#E0D4C3]"
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DEC8] shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Cuisine Select */}
          <div className="relative">
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="appearance-none bg-[#FAF7F2] text-xs font-medium text-stone-700 border border-[#E0D4C3] rounded-full px-3.5 py-2 pr-8 focus:outline-none focus:border-[#D95338] cursor-pointer"
            >
              {CUISINES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* Difficulty Select */}
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="appearance-none bg-[#FAF7F2] text-xs font-medium text-stone-700 border border-[#E0D4C3] rounded-full px-3.5 py-2 pr-8 focus:outline-none focus:border-[#D95338] cursor-pointer"
            >
              <option value="all">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* Max Cook Time */}
          <div className="relative">
            <select
              value={maxCookTime}
              onChange={(e) => setMaxCookTime(Number(e.target.value))}
              className="appearance-none bg-[#FAF7F2] text-xs font-medium text-stone-700 border border-[#E0D4C3] rounded-full px-3.5 py-2 pr-8 focus:outline-none focus:border-[#D95338] cursor-pointer"
            >
              <option value={150}>Any Cook Time</option>
              <option value={20}>&le; 20 mins</option>
              <option value={30}>&le; 30 mins</option>
              <option value={45}>&le; 45 mins</option>
              <option value={60}>&le; 60 mins</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* Dietary Preferences Button */}
          <button
            type="button"
            onClick={() => setPreferencesOpen(!preferencesOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#E0D4C3] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-stone-700 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-[#D95338]" />
            <span>Preferences</span>
          </button>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#D95338] hover:bg-[#FCEEEA] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right Sort controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 hidden sm:inline">Sort:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[#FAF7F2] font-semibold text-stone-800 border border-[#E0D4C3] rounded-full px-3.5 py-2 pr-8 focus:outline-none focus:border-[#D95338] cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Highest Rated</option>
              <option value="time">Fastest Cook Time</option>
              <option value="popular">Most Reviewed</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* Dietary Quick Filter Pills */}
        <div className="w-full flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#F2ECE4]">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1">
            Dietary:
          </span>
          {DIETARY_OPTIONS.map((opt) => {
            const isSelected = activeDietaryFilters.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setActiveDietaryFilters((prev) =>
                    isSelected ? prev.filter((x) => x !== opt.id) : [...prev, opt.id]
                  );
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-[#221B1A] text-white shadow-xs font-semibold"
                    : "bg-[#FAF7F2] text-stone-600 hover:bg-[#F2ECE4] border border-[#E8DEC8]"
                }`}
                title={opt.desc}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dietary Preferences Drawer / Panel */}
      {preferencesOpen && (
        <div className="p-6 bg-white rounded-3xl border border-[#E8DEC8] shadow-sm space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE4]">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#221B1A]">
              <Sliders className="w-5 h-5 text-[#D95338]" />
              <span>Personalized Recommendation & Allergy Settings</span>
            </div>
            <button
              onClick={() => setPreferencesOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Preferred Cuisines */}
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-stone-500 block">
                Favorite Cuisines
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["Indian", "Italian", "Asian", "French", "Thai", "Mexican", "Japanese"].map((c) => {
                  const active = preferences.preferred_cuisines?.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        const cur = preferences.preferred_cuisines || [];
                        setPreferences({
                          ...preferences,
                          preferred_cuisines: active
                            ? cur.filter((item) => item !== c)
                            : [...cur, c],
                        });
                      }}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                        active
                          ? "bg-[#D95338] text-white border-[#D95338]"
                          : "bg-[#FAF7F2] text-stone-700 border-[#E8DEC8]"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-stone-500 block">
                Dietary Preferences (10 Options)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_OPTIONS.map((opt) => {
                  const active = preferences.dietary_preferences?.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        const cur = preferences.dietary_preferences || [];
                        setPreferences({
                          ...preferences,
                          dietary_preferences: active
                            ? cur.filter((item) => item !== opt.id)
                            : [...cur, opt.id],
                        });
                      }}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                        active
                          ? "bg-[#D95338] text-white border-[#D95338]"
                          : "bg-[#FAF7F2] text-stone-700 border-[#E8DEC8]"
                      }`}
                      title={opt.desc}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Excluded Allergens */}
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-stone-500 block flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Must-Avoid Allergens
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["Peanuts", "Tree Nuts", "Shellfish", "Dairy", "Soy", "Eggs"].map((a) => {
                  const active = preferences.excluded_ingredients?.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        const cur = preferences.excluded_ingredients || [];
                        setPreferences({
                          ...preferences,
                          excluded_ingredients: active
                            ? cur.filter((item) => item !== a)
                            : [...cur, a],
                        });
                      }}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                        active
                          ? "bg-rose-600 text-white border-rose-600"
                          : "bg-[#FAF7F2] text-stone-700 border-[#E8DEC8]"
                      }`}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              disabled={savingPrefs}
              onClick={handleSavePreferences}
              className="px-5 py-2 rounded-full bg-[#D95338] text-white text-xs font-semibold hover:bg-[#C24329] transition-colors"
            >
              {savingPrefs ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      )}

      {/* Curated Recommendations highlight when browsing All Recipes with no search */}
      {!isSearchActive && selectedCategory === "all" && selectedCuisine === "All Cuisines" && recommendations?.sections?.[0] && (
        <section className="space-y-4 bg-[#FAF7F2] p-6 rounded-3xl border border-[#E8DEC8]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D95338]">Personalized Discovery</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221B1A]">
                {recommendations.sections[0].title}
              </h2>
            </div>
            <span className="text-xs text-stone-500 hidden sm:inline">{recommendations.sections[0].subtitle}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.sections[0].recipes?.slice(0, 4).map((recipe) => (
              <RecipeCard key={`rec-${recipe.id}`} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {/* Main Recipe Catalog Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500 font-medium px-1">
          <div>
            {search ? (
              <span>
                Found <strong className="text-stone-800">{totalCount}</strong> {totalCount === 1 ? "recipe" : "recipes"} matching "
                <span className="text-[#D95338] font-bold">{search}</span>"
              </span>
            ) : selectedCategory !== "all" ? (
              <span>
                Showing <strong className="text-stone-800">{searchResults.length}</strong> of <strong className="text-stone-800">{totalCount}</strong>{" "}
                <span className="text-[#D95338] font-bold">{selectedCategory}</span> {totalCount === 1 ? "recipe" : "recipes"}
              </span>
            ) : selectedCuisine !== "All Cuisines" ? (
              <span>
                Showing <strong className="text-stone-800">{searchResults.length}</strong> of <strong className="text-stone-800">{totalCount}</strong>{" "}
                <span className="text-[#D95338] font-bold">{selectedCuisine}</span> {totalCount === 1 ? "recipe" : "recipes"}
              </span>
            ) : (
              <span>
                Showing <strong className="text-stone-800">{searchResults.length}</strong> of <strong className="text-stone-800">{totalCount}</strong> recipes
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Filters applied</span>
              <button
                onClick={resetAllFilters}
                className="text-[#D95338] font-semibold hover:underline cursor-pointer"
              >
                Reset all
              </button>
            </div>
          )}
        </div>

        {searchLoading && searchResults.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <span className="inline-block w-8 h-8 border-3 border-[#D95338] border-t-transparent rounded-full animate-spin" />
            <p className="font-serif text-sm text-stone-600">Discovering recipes...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {searchResults.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {/* Load More / Pagination */}
            {searchResults.length < totalCount && (
              <div className="pt-8 text-center space-y-2">
                <button
                  onClick={() => fetchSearchResults(page + 1, true)}
                  disabled={searchLoading}
                  className="px-8 py-3.5 rounded-full bg-white border border-[#E0D4C3] text-stone-800 text-xs sm:text-sm font-semibold hover:bg-[#FAF7F2] shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  {searchLoading ? "Loading recipes..." : `Load More Recipes (${searchResults.length} of ${totalCount})`}
                </button>
                <p className="text-[11px] text-stone-400">
                  Showing {searchResults.length} of {totalCount} recipes
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E8DEC8] p-8 max-w-lg mx-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF2E8] text-[#D95338] flex items-center justify-center mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#221B1A] mb-2">
              No matching recipes found
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mb-6">
              {search
                ? `No recipes match "${search}". Try searching for another ingredient, dish, or cuisine.`
                : "No recipes found matching your selected category and filters."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 bg-[#D95338] text-white rounded-full text-xs font-semibold hover:bg-[#C24329] cursor-pointer"
              >
                Reset All Filters
              </button>
              <Link
                href="/ai-chef"
                className="px-5 py-2.5 bg-[#FAF7F2] text-[#D95338] border border-[#F3C5BA] rounded-full text-xs font-semibold hover:bg-[#FCEEEA] flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create with AI</span>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-500 font-serif">
          Loading culinary recommendations & catalog...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
