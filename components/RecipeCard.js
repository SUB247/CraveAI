"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Clock, Star, Heart, Flame, Sparkles, ChefHat } from "lucide-react";
import { isFavorite, toggleFavorite } from "@/lib/storage";

export default function RecipeCard({ recipe, priority = false }) {
  const [favorite, setFavorite] = useState(false);
  const [imgSrc, setImgSrc] = useState(recipe.image);

  useEffect(() => {
    setImgSrc(recipe.image);
  }, [recipe.image]);

  useEffect(() => {
    setFavorite(isFavorite(recipe.id));
    const handleFavChange = () => setFavorite(isFavorite(recipe.id));
    window.addEventListener("craveai_favorites_updated", handleFavChange);
    return () => window.removeEventListener("craveai_favorites_updated", handleFavChange);
  }, [recipe.id]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleFavorite(recipe.id);
    setFavorite(updated);
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "hard":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-stone-50 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-[#EBE2D5] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Clickable Image Container */}
      <Link
        href={`/recipe/${recipe.id}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 block"
        style={{ position: "relative" }}
      >
        <Image
          src={imgSrc || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80"}
          alt={recipe.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          onError={() => {
            // Fallback image if remote url fails
            setImgSrc("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80");
          }}
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-70 group-hover:opacity-60 transition-opacity" />

        {/* AI Generated Badge (if applicable) */}
        {recipe.isAiGenerated && (
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md text-amber-300 text-[11px] font-semibold shadow-sm border border-stone-700/50">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>AI Crafted</span>
          </div>
        )}

        {/* Cuisine / Category Pill */}
        {!recipe.isAiGenerated && recipe.category && (
          <div className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-stone-800 text-xs font-semibold shadow-sm border border-white/60">
            {recipe.category}
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorite ? "Remove from cookbook" : "Save to cookbook"}
          className={`absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-md ${
            favorite
              ? "bg-[#D95338] text-white shadow-[#D95338]/40"
              : "bg-white/90 text-stone-700 hover:bg-white hover:text-[#D95338]"
          }`}
        >
          <Heart className={`w-4 h-4 ${favorite ? "fill-white" : ""}`} />
        </button>

        {/* Bottom Metadata inside Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs drop-shadow-sm font-medium">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-stone-200" />
            <span>{recipe.totalTime || `${recipe.cookTimeMinutes || 30} mins`}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-stone-100">{recipe.rating || "4.9"}</span>
            {recipe.reviewCount && (
              <span className="text-stone-300 text-[10px]">({recipe.reviewCount})</span>
            )}
          </div>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Difficulty & Cuisine line */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider truncate">
              {recipe.cuisine || recipe.category}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyColor(
                recipe.difficulty
              )}`}
            >
              {recipe.difficulty || "Medium"}
            </span>
          </div>

          {/* Title */}
          <Link href={`/recipe/${recipe.id}`} className="block group-hover:text-[#D95338] transition-colors">
            <h3 className="font-serif text-lg font-bold text-[#221B1A] leading-snug line-clamp-2">
              {recipe.title}
            </h3>
          </Link>

          {/* Description / Tagline */}
          <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed font-sans">
            {recipe.tagline || recipe.description}
          </p>
        </div>

        {/* Footer info: Servings & Tags */}
        <div className="mt-4 pt-3 border-t border-[#F2ECE4] flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1 font-medium">
            <ChefHat className="w-3.5 h-3.5 text-[#D95338]" />
            <span>{recipe.servings} Servings</span>
          </div>
          <Link
            href={`/recipe/${recipe.id}`}
            className="text-xs font-semibold text-[#D95338] hover:text-[#C24329] flex items-center gap-1 group-hover:underline"
          >
            <span>Cook Recipe</span>
            <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
