"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  Flame,
  ChefHat,
  Heart,
  Compass,
  CheckCircle2,
  Bot,
  Sliders,
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import CategoryPills from "@/components/CategoryPills";
import RecipeCard from "@/components/RecipeCard";
import { SAMPLE_RECIPES, CATEGORIES } from "@/data/recipes";
import { filterRecipes } from "@/lib/recipe-helpers";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredRecipes = filterRecipes(SAMPLE_RECIPES, {
    category: selectedCategory,
  });

  const featuredRecipe = SAMPLE_RECIPES[0]; // Butter Chicken
  const quickMeals = SAMPLE_RECIPES.filter(
    (r) => r.cookTimeMinutes <= 25 || r.category === "Quick Meals"
  ).slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Category Navigation Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221B1A]">
              Explore by Cravings
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-sans mt-0.5">
              Hand-picked recipes tested by culinary experts
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#D95338] hover:text-[#C24329] group"
          >
            <span>View All Recipes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <CategoryPills
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => setSelectedCategory(id)}
        />
      </section>

      {/* 3. Filtered / Trending Recipes Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D95338]">
              {selectedCategory === "all" ? "Trending Today" : `${selectedCategory} Collection`}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#221B1A] mt-1">
              {selectedCategory === "all"
                ? "Culinary Masterpieces"
                : `Top-Rated ${selectedCategory} Recipes`}
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Showing {filteredRecipes.length} recipes
          </span>
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredRecipes.slice(0, 6).map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} priority={index < 3} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DEC8] p-8">
            <p className="text-stone-600 font-serif text-lg mb-2">No recipes found in this category.</p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-4 py-2 bg-[#D95338] text-white rounded-full text-xs font-semibold"
            >
              Reset Category
            </button>
          </div>
        )}

        {filteredRecipes.length > 6 && (
          <div className="mt-12 text-center">
            <Link
              href={`/explore?category=${encodeURIComponent(selectedCategory)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#E0D4C3] text-stone-800 text-sm font-semibold hover:bg-[#F3ECE2] transition-colors shadow-xs"
            >
              <span>Explore more {selectedCategory === "all" ? "" : selectedCategory} recipes</span>
              <ArrowRight className="w-4 h-4 text-[#D95338]" />
            </Link>
          </div>
        )}
      </section>

      {/* 4. Featured Dish of the Week (Editorial Spotlight) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl sm:rounded-[36px] bg-[#221B1A] text-white overflow-hidden shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D95338]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
            {/* Image Side */}
            <div
              className="lg:col-span-6 relative aspect-[4/3] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-white/10 group"
              style={{ position: "relative" }}
            >
              <Image
                src={featuredRecipe.image}
                alt={featuredRecipe.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 bg-[#D95338] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Featured Spotlight
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-white/10 text-stone-300 text-xs font-medium border border-white/10">
                  {featuredRecipe.cuisine}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{featuredRecipe.rating}</span>
                  <span className="text-stone-400">({featuredRecipe.reviewCount} reviews)</span>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  {featuredRecipe.title}
                </h3>
                <p className="mt-3 text-stone-300 text-sm sm:text-base leading-relaxed font-sans line-clamp-3">
                  {featuredRecipe.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/10 text-xs text-stone-300">
                <div>
                  <span className="block text-stone-400 text-[10px] uppercase font-semibold">Prep Time</span>
                  <span className="font-semibold text-white">{featuredRecipe.prepTime}</span>
                </div>
                <div>
                  <span className="block text-stone-400 text-[10px] uppercase font-semibold">Cook Time</span>
                  <span className="font-semibold text-white">{featuredRecipe.cookTime}</span>
                </div>
                <div>
                  <span className="block text-stone-400 text-[10px] uppercase font-semibold">Difficulty</span>
                  <span className="font-semibold text-white">{featuredRecipe.difficulty}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={`/recipe/${featuredRecipe.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#D95338] text-white text-sm font-semibold hover:bg-[#C24329] active:scale-95 transition-all shadow-md shadow-[#D95338]/30"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Start Cooking This Dish</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  href="/ai-chef"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors border border-white/15"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Variations</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why CraveAI Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D95338]">
            Culinary Precision Meets Intelligence
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#221B1A] mt-1.5">
            Designed for the Passionate Home Cook
          </h3>
          <p className="mt-2 text-stone-600 text-sm">
            Not just another recipe blog with endless life stories — just pure culinary craft, sensory cues, and smart tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-3xl border border-[#E8DEC8] shadow-xs hover:border-[#D95338]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#FCEEEA] text-[#D95338] flex items-center justify-center mb-5">
              <Sliders className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#221B1A] mb-2">
              Dynamic Servings Recalculation
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Cooking for 2 or hosting 8? Toggle the servings counter and every gram, cup, and teaspoon dynamically adjusts with smart fractions.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-[#E8DEC8] shadow-xs hover:border-[#D95338]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#FCEEEA] text-[#D95338] flex items-center justify-center mb-5">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#221B1A] mb-2">
              Contextual AI Sous-Chef
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Stuck on a step or missing an ingredient? Ask your AI chef right on the recipe page for instant, recipe-tailored substitutions and temperature advice.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-[#E8DEC8] shadow-xs hover:border-[#D95338]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#FCEEEA] text-[#D95338] flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#221B1A] mb-2">
              Pantry AI Recipe Creation
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              List what is in your fridge, select your desired cuisine, and receive a complete chef-level recipe with authentic food photography.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Quick Meals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D95338]">
              Weeknight Heroes
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#221B1A] mt-1">
              Ready in 25 Minutes or Less
            </h3>
          </div>
          <Link
            href="/explore?category=Quick%20Meals"
            className="text-xs sm:text-sm font-semibold text-[#D95338] hover:underline"
          >
            See all quick meals &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {quickMeals.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* 7. Bottom Call-To-Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl sm:rounded-[36px] bg-gradient-to-br from-[#FAF2E8] via-[#F6EBE0] to-[#EFE1D3] border border-[#E3D4C1] p-8 sm:p-14 text-center overflow-hidden shadow-sm">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#E3D4C1] text-[#D95338] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Pantry Engine</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#221B1A]">
              Have ingredients you need to use up tonight?
            </h3>
            <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
              Tell CraveAI what you have in your fridge and pantry. Our culinary intelligence will formulate an extraordinary recipe tailored to your exact tastes.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/ai-chef"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D95338] text-white text-sm font-semibold hover:bg-[#C24329] active:scale-95 transition-all shadow-md shadow-[#D95338]/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open AI Chef Studio</span>
              </Link>
              <Link
                href="/cookbook"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-stone-800 text-sm font-medium hover:bg-stone-50 border border-[#D5C6B3] transition-colors"
              >
                <span>View My Saved Recipes</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
