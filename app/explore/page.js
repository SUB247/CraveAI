"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Clock,
  Sparkles,
  ArrowUpDown,
  ChefHat,
  RotateCcw,
} from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import CategoryPills from "@/components/CategoryPills";
import { SAMPLE_RECIPES, CATEGORIES, CUISINES } from "@/data/recipes";
import { filterRecipes } from "@/lib/recipe-helpers";
import { getCustomRecipes } from "@/lib/storage";

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial params
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialCuisine = searchParams.get("cuisine") || "All Cuisines";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [difficulty, setDifficulty] = useState("all");
  const [maxCookTime, setMaxCookTime] = useState(150);
  const [sortBy, setSortBy] = useState("rating"); // 'rating' | 'time' | 'reviews'
  const [allRecipes, setAllRecipes] = useState(SAMPLE_RECIPES);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Sync with searchParams on navigation
  useEffect(() => {
    if (searchParams.get("search") !== null) {
      setSearch(searchParams.get("search") || "");
    }
    if (searchParams.get("category") !== null) {
      setSelectedCategory(searchParams.get("category") || "all");
    }
  }, [searchParams]);

  // Load custom/AI-generated recipes from localStorage so they appear in Explore too!
  useEffect(() => {
    const custom = getCustomRecipes();
    if (custom.length > 0) {
      setAllRecipes([...SAMPLE_RECIPES, ...custom]);
    } else {
      setAllRecipes(SAMPLE_RECIPES);
    }

    const handleUpdate = () => {
      const updatedCustom = getCustomRecipes();
      setAllRecipes([...SAMPLE_RECIPES, ...updatedCustom]);
    };

    window.addEventListener("craveai_custom_recipes_updated", handleUpdate);
    return () => window.removeEventListener("craveai_custom_recipes_updated", handleUpdate);
  }, []);

  // Filter recipes
  const filtered = useMemo(() => {
    let result = filterRecipes(allRecipes, {
      search,
      category: selectedCategory,
      cuisine: selectedCuisine,
      difficulty,
      maxTime: maxCookTime,
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "time") {
        return (a.cookTimeMinutes || 30) - (b.cookTimeMinutes || 30);
      }
      if (sortBy === "reviews") {
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      return 0;
    });

    return result;
  }, [allRecipes, search, selectedCategory, selectedCuisine, difficulty, maxCookTime, sortBy]);

  const hasActiveFilters =
    search !== "" ||
    selectedCategory !== "all" ||
    selectedCuisine !== "All Cuisines" ||
    difficulty !== "all" ||
    maxCookTime < 150;

  const resetAllFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedCuisine("All Cuisines");
    setDifficulty("all");
    setMaxCookTime(150);
    setSortBy("rating");
    router.replace("/explore");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DEC8] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D95338]">
            Culinary Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#221B1A] mt-1">
            Explore All Recipes
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Browse through {allRecipes.length} chef-crafted dishes and community AI creations
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Search dish or ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-[#E0D4C3] rounded-full text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D95338]/30 focus:border-[#D95338]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div>
        <CategoryPills
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => setSelectedCategory(id)}
        />
      </div>

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

          {/* Max Cook Time dropdown */}
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

          {/* Clear Filters Button if any active */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#D95338] hover:bg-[#FCEEEA] transition-colors"
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
              <option value="rating">Highest Rated</option>
              <option value="time">Fastest Cook Time</option>
              <option value="reviews">Most Reviewed</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 text-[10px]">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
        <span>
          Showing {filtered.length} {filtered.length === 1 ? "recipe" : "recipes"}
        </span>
        {hasActiveFilters && (
          <span className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Filtered view
          </span>
        )}
      </div>

      {/* Recipes Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((recipe, index) => (
            <RecipeCard key={recipe.id} recipe={recipe} priority={index < 6} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E8DEC8] p-8 max-w-lg mx-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF2E8] text-[#D95338] flex items-center justify-center mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#221B1A] mb-2">
            No recipes matched your search
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mb-6">
            We couldn't find any dish matching your current filter criteria. Try broadening your terms or reset the filters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={resetAllFilters}
              className="px-5 py-2.5 bg-[#D95338] text-white rounded-full text-xs font-semibold hover:bg-[#C24329] transition-colors"
            >
              Reset All Filters
            </button>
            <button
              onClick={() => router.push("/ai-chef")}
              className="px-5 py-2.5 bg-[#FAF7F2] text-[#D95338] border border-[#F3C5BA] rounded-full text-xs font-semibold hover:bg-[#FCEEEA] transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create this with AI</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-500 font-serif">
          Loading culinary catalog...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
