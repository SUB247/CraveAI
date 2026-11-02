"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  Users,
  ChefHat,
  Heart,
  Printer,
  Share2,
  Check,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Flame,
  ArrowLeft,
  Timer,
  UtensilsCrossed,
  CheckCircle2,
  BookOpen,
  Info,
  ArrowUp,
} from "lucide-react";
import { SAMPLE_RECIPES } from "@/data/recipes";
import { formatQuantity, getRelatedRecipes } from "@/lib/recipe-helpers";
import { isFavorite, toggleFavorite, getCustomRecipes } from "@/lib/storage";
import RecipeCard from "@/components/RecipeCard";
import CookingAssistant from "@/components/CookingAssistant";
import NutritionFacts from "@/components/NutritionFacts";

export default function RecipeDetailPage({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { id } = unwrappedParams;

  const initialRecipe = SAMPLE_RECIPES.find((r) => r.id === id) || null;
  const [recipe, setRecipe] = useState(initialRecipe);
  const [imgSrc, setImgSrc] = useState(initialRecipe?.image || "");
  const [loading, setLoading] = useState(!initialRecipe);
  const [servings, setServings] = useState(initialRecipe ? initialRecipe.servings || 4 : 4);
  const [favorite, setFavorite] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [shareToast, setShareToast] = useState(false);
  const [allRecipes, setAllRecipes] = useState(SAMPLE_RECIPES);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (recipe?.image) {
      setImgSrc(recipe.image);
    }
  }, [recipe?.image]);

  // Load recipe
  useEffect(() => {
    // Ensure viewport starts at the top of the recipe page
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    const customList = getCustomRecipes();
    const merged = [...SAMPLE_RECIPES, ...customList];
    setAllRecipes(merged);

    const found = merged.find((r) => r.id === id);
    if (found) {
      setRecipe(found);
      setServings((prev) => (prev ? prev : found.servings || 4));
      setFavorite(isFavorite(found.id));

      // Log view interaction for personalized recommendations
      fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: found.id, interactionType: "view" }),
      }).catch(() => {});
    }
    setLoading(false);
  }, [id]);

  // Ensure scroll position is pinned at the top once recipe DOM is rendered
  useEffect(() => {
    if (!loading && recipe && typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [loading, recipe]);

  const handleFavoriteClick = () => {
    if (!recipe) return;
    const updated = toggleFavorite(recipe.id);
    setFavorite(updated);

    if (updated) {
      fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: recipe.id, interactionType: "save" }),
      }).catch(() => {});
    }
  };

  const handleShareClick = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handlePrintClick = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleStepComplete = (stepNum) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-[#D95338] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-lg text-stone-600">Retrieving culinary recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#221B1A] mb-2">Recipe Not Found</h1>
        <p className="text-stone-600 text-sm mb-6">
          The dish you are looking for may have been moved or does not exist in our catalog.
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#D95338] text-white rounded-full text-sm font-semibold hover:bg-[#C24329]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore All Recipes</span>
        </Link>
      </div>
    );
  }

  const related = getRelatedRecipes(recipe, allRecipes, 3);
  const baseServings = recipe.servings || 4;

  return (
    <div className="pb-24">
      {/* Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#221B1A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20 animate-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">Recipe link copied to clipboard!</span>
        </div>
      )}

      {/* Back button & Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#D95338] transition-colors py-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-800">Home</Link>
            <span>/</span>
            <Link href={`/explore?category=${recipe.category}`} className="hover:text-stone-800">
              {recipe.category}
            </Link>
            <span>/</span>
            <span className="text-stone-800 font-medium truncate max-w-[200px]">{recipe.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Recipe Container */}
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="max-w-4xl mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#FCEEEA] text-[#D95338] text-xs font-bold uppercase tracking-wider">
              {recipe.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium">
              {recipe.cuisine}
            </span>
            {recipe.isAiGenerated && (
              <span className="px-3 py-1 rounded-full bg-stone-900 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>AI Crafted Recipe</span>
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#221B1A] tracking-tight leading-tight">
            {recipe.title}
          </h1>

          <p className="text-stone-600 text-base sm:text-lg font-sans leading-relaxed">
            {recipe.tagline || recipe.description}
          </p>
        </div>

        {/* Large Appetising Dish Image */}
        <div
          className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl sm:rounded-[36px] overflow-hidden shadow-xl border border-[#E8DEC8] mb-8 bg-stone-100"
          style={{ position: "relative" }}
        >
          <Image
            src={imgSrc || recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"}
            alt={recipe.title}
            fill
            priority
            sizes="100vw"
            onError={() => {
              setImgSrc("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80");
            }}
            className="object-cover object-center"
          />

          {/* Photography Badge */}
          <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-2 border border-white/20">
            {recipe.isAiGenerated ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Generated Food Photography</span>
              </>
            ) : (
              <>
                <ChefHat className="w-3.5 h-3.5 text-white" />
                <span>Culinary Photography</span>
              </>
            )}
          </div>

          {/* Top-right action bar overlay */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              aria-label="Save to favourites"
              className={`p-3 rounded-full backdrop-blur-md shadow-md transition-all active:scale-90 ${
                favorite
                  ? "bg-[#D95338] text-white"
                  : "bg-white/90 text-stone-800 hover:bg-white hover:text-[#D95338]"
              }`}
            >
              <Heart className={`w-5 h-5 ${favorite ? "fill-white" : ""}`} />
            </button>
            <button
              onClick={handleShareClick}
              aria-label="Share recipe"
              className="p-3 rounded-full bg-white/90 text-stone-800 hover:bg-white hover:text-[#D95338] backdrop-blur-md shadow-md transition-all active:scale-90"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrintClick}
              aria-label="Print recipe"
              className="p-3 rounded-full bg-white/90 text-stone-800 hover:bg-white hover:text-[#D95338] backdrop-blur-md shadow-md transition-all active:scale-90 hidden sm:block"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Meta Stats Ribbon */}
        <div className="bg-white rounded-3xl border border-[#E8DEC8] shadow-xs p-6 mb-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Prep Time</span>
            <div className="flex items-center justify-center gap-1.5 text-sm sm:text-base font-bold text-stone-800">
              <Clock className="w-4 h-4 text-[#D95338]" />
              <span>{recipe.prepTime}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Cook Time</span>
            <div className="flex items-center justify-center gap-1.5 text-sm sm:text-base font-bold text-stone-800">
              <Flame className="w-4 h-4 text-[#D95338]" />
              <span>{recipe.cookTime}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Total Time</span>
            <div className="flex items-center justify-center gap-1.5 text-sm sm:text-base font-bold text-stone-800">
              <Timer className="w-4 h-4 text-[#D95338]" />
              <span>{recipe.totalTime || "40 mins"}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Difficulty</span>
            <div className="text-sm sm:text-base font-bold text-stone-800">
              {recipe.difficulty || "Medium"}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Rating</span>
            <div className="flex items-center justify-center gap-1 text-sm sm:text-base font-bold text-stone-800">
              <span className="text-amber-500">★</span>
              <span>{recipe.rating || "4.9"}</span>
              <span className="text-xs text-stone-400 font-normal">({recipe.reviewCount || 150})</span>
            </div>
          </div>

          <a
            href="#nutrition-facts"
            className="space-y-1 block hover:bg-[#FAF7F2] p-1 -m-1 rounded-xl transition-colors cursor-pointer group"
            title="Jump to comprehensive Nutritional Information"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-[#D95338] transition-colors flex items-center justify-center gap-0.5">
              Estimated Cal <span className="text-[10px] text-[#D95338]">&darr;</span>
            </span>
            <div className="text-sm sm:text-base font-bold text-stone-800">
              {(recipe.nutrition?.calories || recipe.calories)
                ? `${Math.round(((recipe.nutrition?.calories || recipe.calories) / baseServings) * servings)} kcal`
                : "N/A"}
            </div>
          </a>
        </div>

        {/* Main Content Layout: 2 Columns (Ingredients & Tools / Instructions & Assistant) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Ingredients, Servings Adjuster, Kitchen Equipment */}
          <div className="lg:col-span-5 space-y-8">
            {/* Ingredients Card with Servings Adjuster */}
            <div className="bg-white rounded-3xl border border-[#E8DEC8] p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DEC8]">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#221B1A]">Ingredients</h2>
                  <p className="text-xs text-stone-500 mt-0.5">Check items as you prep mise-en-place</p>
                </div>

                {/* Servings Counter Stepper */}
                <div className="flex items-center gap-3 bg-[#FAF7F2] p-1.5 rounded-full border border-[#E0D4C3]">
                  <button
                    onClick={() => setServings((s) => Math.max(1, s - 1))}
                    disabled={servings <= 1}
                    className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-800 flex items-center justify-center font-bold text-sm shadow-xs transition-colors"
                    aria-label="Decrease servings"
                  >
                    -
                  </button>
                  <div className="px-2 text-center min-w-16">
                    <span className="block text-sm font-bold text-stone-900 leading-none">{servings}</span>
                    <span className="text-[10px] text-stone-500 uppercase font-semibold">servings</span>
                  </div>
                  <button
                    onClick={() => setServings((s) => Math.min(24, s + 1))}
                    disabled={servings >= 24}
                    className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-800 flex items-center justify-center font-bold text-sm shadow-xs transition-colors"
                    aria-label="Increase servings"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Ingredients Interactive List */}
              <ul className="divide-y divide-[#F4ECE1] pt-3">
                {recipe.ingredients.map((ing, idx) => {
                  const isChecked = checkedIngredients[idx];
                  const formattedAmount = formatQuantity(ing.amount, baseServings, servings);

                  return (
                    <li
                      key={idx}
                      onClick={() => toggleIngredientCheck(idx)}
                      className={`py-3.5 flex items-start gap-3.5 cursor-pointer group transition-colors ${
                        isChecked ? "opacity-45" : "hover:bg-[#FAF7F2]/60 -mx-2 px-2 rounded-xl"
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 transition-colors border ${
                          isChecked
                            ? "bg-[#D95338] border-[#D95338] text-white"
                            : "border-stone-300 bg-white group-hover:border-[#D95338]"
                        }`}
                        aria-label="Check ingredient"
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="flex-1 text-sm leading-snug">
                        <span className={`font-semibold text-stone-900 ${isChecked ? "line-through" : ""}`}>
                          {formattedAmount} {ing.unit}
                        </span>{" "}
                        <span className={`text-stone-800 ${isChecked ? "line-through text-stone-500" : ""}`}>
                          {ing.name}
                        </span>
                        {ing.notes && (
                          <span className="block text-xs text-stone-500 italic mt-0.5">
                            ({ing.notes})
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Quick helper tip */}
              <div className="mt-6 pt-4 border-t border-[#E8DEC8] text-xs text-stone-500 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#D95338] shrink-0" />
                <span>Quantities automatically scale when servings are adjusted.</span>
              </div>
            </div>

            {/* Kitchen Equipment Card */}
            {recipe.equipment && recipe.equipment.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#E8DEC8] p-6 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <UtensilsCrossed className="w-5 h-5 text-[#D95338]" />
                  <h3 className="font-serif text-lg font-bold text-[#221B1A]">Kitchen Equipment</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipe.equipment.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E0D4C3] text-stone-700 text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens & Dietary Notice */}
            {recipe.allergens && recipe.allergens.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-5 text-amber-900">
                <div className="flex items-center gap-2 font-serif font-bold text-sm mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Allergen Notice</span>
                </div>
                <p className="text-xs text-amber-800 mb-2">Contains:</p>
                <div className="flex flex-wrap gap-1.5">
                  {recipe.allergens.map((alg, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-white text-amber-900 border border-amber-300 text-xs font-semibold"
                    >
                      {alg}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sticky/Embedded AI Sous Chef Assistant for Desktop */}
            <div className="hidden lg:block sticky top-28">
              <CookingAssistant recipe={recipe} />
            </div>
          </div>

          {/* Right Column: Step-by-Step Instructions & Chef Tips */}
          <div className="lg:col-span-7 space-y-10">
            {/* Numbered Step-by-Step Instructions */}
            <section className="bg-white rounded-3xl border border-[#E8DEC8] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-6 border-b border-[#E8DEC8] mb-8">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#221B1A]">
                    Step-by-Step Instructions
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Follow times, temperatures, and sensory cues for perfection
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#D95338] bg-[#FCEEEA] px-3 py-1 rounded-full">
                  {recipe.steps.length} Steps
                </span>
              </div>

              <div className="space-y-8">
                {recipe.steps.map((st) => {
                  const isDone = completedSteps[st.step];

                  return (
                    <div
                      key={st.step}
                      className={`relative pl-8 sm:pl-10 pb-8 border-l-2 last:border-l-transparent transition-colors ${
                        isDone ? "border-emerald-400 opacity-60" : "border-[#E8DEC8]"
                      }`}
                    >
                      {/* Step Number Dot */}
                      <button
                        onClick={() => toggleStepComplete(st.step)}
                        className={`absolute -left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm font-bold shadow-xs transition-colors ${
                          isDone
                            ? "bg-emerald-500 text-white"
                            : "bg-[#221B1A] text-white hover:bg-[#D95338]"
                        }`}
                        title={isDone ? "Mark incomplete" : "Mark step complete"}
                      >
                        {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : st.step}
                      </button>

                      <div className="space-y-3">
                        {/* Step Title & Meta Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className={`font-serif text-lg font-bold text-[#221B1A] ${isDone ? "line-through text-stone-500" : ""}`}>
                            {st.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {st.time && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 bg-[#FAF7F2] border border-[#E0D4C3] px-2.5 py-0.5 rounded-full">
                                <Clock className="w-3 h-3 text-[#D95338]" />
                                {st.time}
                              </span>
                            )}
                            {st.temp && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 bg-[#FAF7F2] border border-[#E0D4C3] px-2.5 py-0.5 rounded-full">
                                <Flame className="w-3 h-3 text-orange-600" />
                                {st.temp}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Instruction text */}
                        <p className={`text-stone-700 text-sm sm:text-base leading-relaxed ${isDone ? "text-stone-400" : ""}`}>
                          {st.instruction}
                        </p>

                        {/* Sensory & Visual Cue Callout */}
                        {st.visualCue && (
                          <div className="bg-[#FAF7F2] border-l-4 border-[#D95338] p-3 rounded-r-2xl text-xs text-stone-700 space-y-1">
                            <span className="font-bold text-[#D95338] uppercase tracking-wider text-[10px] block">
                              Sensory Visual Cue:
                            </span>
                            <p className="italic leading-relaxed">{st.visualCue}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Mobile / Tablet AI Sous-Chef Assistant (shown on smaller screens) */}
            <div className="block lg:hidden">
              <CookingAssistant recipe={recipe} />
            </div>

            {/* Chef Pro Tips */}
            {recipe.chefTips && recipe.chefTips.length > 0 && (
              <section className="bg-gradient-to-br from-[#FFFBF5] to-[#FBF6EE] rounded-3xl border border-[#E8DEC8] p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#FCEEEA] text-[#D95338] flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#221B1A]">Chef's Secrets & Pro Tips</h3>
                </div>
                <ul className="space-y-3">
                  {recipe.chefTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                      <span className="text-[#D95338] font-bold text-base leading-none">&bull;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Substitutions & Common Mistakes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Substitutions */}
              {recipe.substitutions && recipe.substitutions.length > 0 && (
                <div className="bg-white rounded-3xl border border-[#E8DEC8] p-6 shadow-xs">
                  <h4 className="font-serif text-base font-bold text-[#221B1A] mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D95338]" />
                    <span>Ingredient Swaps</span>
                  </h4>
                  <div className="space-y-3">
                    {recipe.substitutions.map((sub, idx) => (
                      <div key={idx} className="p-3 bg-[#FAF7F2] rounded-2xl text-xs space-y-1">
                        <div className="font-semibold text-stone-800">
                          Instead of <span className="text-[#D95338]">{sub.original}</span>:
                        </div>
                        <div className="text-stone-700">Use {sub.alternative}</div>
                        {sub.notes && <div className="text-stone-500 italic text-[11px]">{sub.notes}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Mistakes */}
              {recipe.commonMistakes && recipe.commonMistakes.length > 0 && (
                <div className="bg-white rounded-3xl border border-[#E8DEC8] p-6 shadow-xs">
                  <h4 className="font-serif text-base font-bold text-[#221B1A] mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Avoid Common Pitfalls</span>
                  </h4>
                  <div className="space-y-3">
                    {recipe.commonMistakes.map((cm, idx) => (
                      <div key={idx} className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100 text-xs space-y-1">
                        <div className="font-semibold text-rose-900">
                          {cm.mistake}
                        </div>
                        <div className="text-stone-700 leading-relaxed">
                          <span className="font-semibold text-emerald-700">Fix:</span> {cm.remedy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Food Safety & Storage */}
            {(recipe.safety || recipe.storage) && (
              <div className="bg-[#FAF7F2] rounded-3xl border border-[#E0D4C3] p-6 text-xs text-stone-700 space-y-3">
                {recipe.safety && (
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900 block">Culinary Food Safety:</span>
                      <p className="leading-relaxed">{recipe.safety}</p>
                    </div>
                  </div>
                )}
                {recipe.storage && (
                  <div className="flex items-start gap-2.5 pt-2 border-t border-[#E8DEC8]">
                    <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900 block">Storage & Reheating:</span>
                      <p className="leading-relaxed">{recipe.storage}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Nutritional Information Dossier */}
        <div id="nutrition-facts" className="mt-12 sm:mt-16 scroll-mt-24">
          <NutritionFacts
            nutrition={recipe.nutrition}
            baseServings={baseServings}
            currentServings={servings}
          />
        </div>

        {/* Related Recipes Section */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#E8DEC8]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D95338]">
                  More Inspiration
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#221B1A] mt-1">
                  You May Also Love
                </h3>
              </div>
              <Link
                href="/explore"
                className="text-xs sm:text-sm font-semibold text-[#D95338] hover:underline"
              >
                Browse all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {related.map((relRecipe) => (
                <RecipeCard key={relRecipe.id} recipe={relRecipe} />
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#221B1A]/90 hover:bg-[#D95338] text-white shadow-xl backdrop-blur-md transition-all duration-300 transform hover:scale-105"
          aria-label="Scroll back to top"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
