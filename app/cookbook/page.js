"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookMarked,
  Heart,
  Sparkles,
  Search,
  Trash2,
  ChefHat,
  ArrowRight,
  Utensils,
  Plus,
} from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import { SAMPLE_RECIPES } from "@/data/recipes";
import { getFavorites, getCustomRecipes, deleteCustomRecipe } from "@/lib/storage";

export default function MyCookbookPage() {
  const [activeTab, setActiveTab] = useState("favorites"); // 'favorites' | 'created'
  const [favoritesList, setFavoritesList] = useState([]);
  const [customList, setCustomList] = useState([]);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  const loadData = () => {
    const favIds = getFavorites();
    const custom = getCustomRecipes();
    const all = [...SAMPLE_RECIPES, ...custom];

    const favRecipes = all.filter((r) => favIds.includes(r.id));
    setFavoritesList(favRecipes);
    setCustomList(custom);
  };

  useEffect(() => {
    setMounted(true);
    loadData();

    const handleFavUpdate = () => loadData();
    const handleCustomUpdate = () => loadData();

    window.addEventListener("craveai_favorites_updated", handleFavUpdate);
    window.addEventListener("craveai_custom_recipes_updated", handleCustomUpdate);

    return () => {
      window.removeEventListener("craveai_favorites_updated", handleFavUpdate);
      window.removeEventListener("craveai_custom_recipes_updated", handleCustomUpdate);
    };
  }, []);

  const handleDeleteCustom = (id) => {
    if (confirm("Are you sure you want to remove this custom recipe from your cookbook?")) {
      deleteCustomRecipe(id);
    }
  };

  const currentList = activeTab === "favorites" ? favoritesList : customList;

  const filtered = currentList.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.cuisine?.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q)
    );
  });

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-serif text-stone-500">
        Opening your personal cookbook...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DEC8] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCEEEA] text-[#D95338] text-xs font-bold uppercase tracking-wider mb-2">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Personal Culinary Archive</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#221B1A]">
            My Cookbook
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Revisit your favorite culinary dishes and AI creations anytime (saved locally in your browser)
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <Link
            href="/ai-chef"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D95338] text-white text-xs sm:text-sm font-semibold hover:bg-[#C24329] transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create New Recipe</span>
          </Link>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-[#F3ECE2] p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "favorites"
                ? "bg-white text-[#D95338] shadow-xs"
                : "text-stone-600 hover:text-[#221B1A]"
            }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === "favorites" ? "fill-[#D95338]" : ""}`} />
            <span>Favorited ({favoritesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("created")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "created"
                ? "bg-white text-[#D95338] shadow-xs"
                : "text-stone-600 hover:text-[#221B1A]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Creations ({customList.length})</span>
          </button>
        </div>

        {/* Search inside saved */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search saved recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#E0D4C3] rounded-full text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D95338]/30 focus:border-[#D95338]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Grid of recipes */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((recipe) => (
            <div key={recipe.id} className="relative">
              <RecipeCard recipe={recipe} />

              {/* Extra delete button if this recipe was user-created */}
              {activeTab === "created" && (
                <button
                  onClick={() => handleDeleteCustom(recipe.id)}
                  title="Delete created recipe"
                  className="absolute bottom-4 right-28 p-2 rounded-full bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-600 transition-colors z-20 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Remove</span>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E8DEC8] p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF2E8] text-[#D95338] flex items-center justify-center mb-4">
            {activeTab === "favorites" ? (
              <Heart className="w-8 h-8 stroke-1" />
            ) : (
              <Sparkles className="w-8 h-8 stroke-1" />
            )}
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#221B1A] mb-2">
            {activeTab === "favorites"
              ? "Your cookbook is waiting for its first dish"
              : "No AI creations generated yet"}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
            {activeTab === "favorites"
              ? "Whenever you find a recipe you adore, tap the heart icon on any recipe card to save it here for quick access."
              : "Use our AI Chef to turn what is currently in your fridge into a brand-new gourmet recipe."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {activeTab === "favorites" ? (
              <Link
                href="/explore"
                className="px-6 py-2.5 bg-[#D95338] text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-[#C24329] transition-colors flex items-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Explore Recipes</span>
              </Link>
            ) : (
              <Link
                href="/ai-chef"
                className="px-6 py-2.5 bg-[#D95338] text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-[#C24329] transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate a Recipe</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
