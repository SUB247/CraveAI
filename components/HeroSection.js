"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Shuffle, ArrowRight } from "lucide-react";
import { SAMPLE_RECIPES } from "@/data/recipes";

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_RECIPES.length);
    const chosen = SAMPLE_RECIPES[randomIndex];
    router.push(`/recipe/${chosen.id}`);
  };

  const trendingTags = [
    "Butter Chicken",
    "Tagliatelle Bolognese",
    "Shiitake Dumplings",
    "Chocolate Lava Cake",
    "Shakshuka",
    "Tofu Green Curry",
  ];

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#FDEEE9]/60 via-[#FAF7F2]/20 to-transparent -z-10 pointer-events-none rounded-full blur-3xl" />
      <div className="absolute -top-24 right-10 w-72 h-72 bg-[#D95338]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Magazine Issue Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCEEEA] border border-[#F3C5BA] text-[#D95338] text-xs font-semibold tracking-wider uppercase mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D95338]" />
          <span>The Next Generation Culinary Experience</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-[#221B1A] tracking-tight leading-[1.1] mb-6">
          What are we <br className="hidden sm:inline" />
          <span className="text-[#D95338] italic font-normal">craving</span> today?
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 font-sans leading-relaxed mb-10">
          Discover chef-perfected recipes with real AI food photography, dynamic servings recalculation, and a contextual AI sous-chef to guide every single stir.
        </p>

        {/* Large Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative max-w-2xl mx-auto bg-white rounded-full p-2 border-2 border-[#E8DEC8] shadow-lg shadow-stone-200/50 hover:border-[#D95338]/60 focus-within:border-[#D95338] focus-within:ring-4 focus-within:ring-[#D95338]/15 transition-all mb-5"
        >
          <div className="flex items-center gap-2 pl-3">
            <Search className="w-5 h-5 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search recipes, ingredients, or cuisines (e.g. 'pasta', 'makhani')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm sm:text-base text-stone-800 placeholder-stone-400 focus:outline-none py-1.5"
            />
            <button
              type="submit"
              className="shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#D95338] text-white text-xs sm:text-sm font-semibold hover:bg-[#C24329] active:scale-95 transition-all shadow-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Actions Row: Surprise Me + AI Generator button */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={handleSurpriseMe}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F3ECE2] text-stone-800 text-xs sm:text-sm font-medium hover:bg-[#EBE2D5] active:scale-95 transition-colors border border-[#E0D4C3]"
          >
            <Shuffle className="w-4 h-4 text-[#D95338]" />
            <span>Surprise Me</span>
          </button>

          <button
            onClick={() => router.push("/ai-chef")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF7F2] text-[#D95338] text-xs sm:text-sm font-semibold hover:bg-[#FCEEEA] active:scale-95 transition-colors border border-[#F3C5BA]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate with AI Pantry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Trending Search Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500">
          <span className="font-medium text-stone-400">Popular:</span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => router.push(`/explore?search=${encodeURIComponent(tag)}`)}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-[#F3ECE2] border border-[#EBE2D5] text-stone-700 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
