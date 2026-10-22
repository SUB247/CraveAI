"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ChefHat,
  Flame,
  Clock,
  Check,
  RotateCcw,
  BookMarked,
  Sliders,
  Utensils,
  Lightbulb,
  ArrowRight,
  Heart,
  AlertCircle,
} from "lucide-react";
import { saveCustomRecipe, isFavorite, toggleFavorite } from "@/lib/storage";
import { formatQuantity } from "@/lib/recipe-helpers";

const CUISINE_OPTIONS = [
  "Any Cuisine",
  "Indian",
  "Italian",
  "Asian / Thai / Chinese",
  "French",
  "Mexican / Latin",
  "Mediterranean",
  "American Comfort",
  "Japanese",
];

const MEAL_TYPES = ["Dinner", "Lunch", "Breakfast / Brunch", "Quick Meal", "Dessert"];

const DIETARY_OPTIONS = [
  "None",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto / Low-Carb",
];

const ALLERGY_OPTIONS = ["None", "Tree Nuts & Peanuts", "Dairy / Lactose", "Shellfish", "Soy", "Eggs"];

const TIME_OPTIONS = ["15 mins", "25 mins", "35 mins", "45 mins", "60+ mins"];

export default function AiChefPage() {
  const router = useRouter();

  // Form State
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("Any Cuisine");
  const [mealType, setMealType] = useState("Dinner");
  const [dietary, setDietary] = useState("None");
  const [allergies, setAllergies] = useState("None");
  const [servings, setServings] = useState(4);
  const [cookingTime, setCookingTime] = useState("35 mins");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [notes, setNotes] = useState("");

  // Generation status
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Servings adjustment for generated recipe preview
  const [previewServings, setPreviewServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const progressMessages = [
    "Analyzing your pantry ingredients...",
    "Harmonizing flavor profiles and culinary traditions...",
    "Drafting precise measurements and sensory cues...",
    "Consulting image generation engine for food photography...",
    "Plating your chef creation...",
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setGeneratedRecipe(null);
    setSavedSuccess(false);
    setProgressStep(0);

    // Progress interval animation
    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < progressMessages.length - 1) return prev + 1;
        return prev;
      });
    }, 1800);

    try {
      // 1. Generate recipe structure
      const recipeRes = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          cuisine,
          mealType,
          dietary,
          allergies,
          servings,
          cookingTime,
          skillLevel,
          notes,
        }),
      });

      if (!recipeRes.ok) {
        throw new Error("Recipe generation failed");
      }

      const recipeData = await recipeRes.json();
      const rawRecipe = recipeData.recipe;

      // 2. Generate Real AI Food Photography
      let dishImage = rawRecipe.image;
      let isAiGeneratedImg = false;

      try {
        const imageRes = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: rawRecipe.imagePrompt,
            dishName: rawRecipe.title,
            cuisine: rawRecipe.cuisine || cuisine,
          }),
        });

        if (imageRes.ok) {
          const imgData = await imageRes.json();
          if (imgData.imageUrl) {
            dishImage = imgData.imageUrl;
            isAiGeneratedImg = Boolean(imgData.isAiGenerated);
          }
        }
      } catch (imgErr) {
        console.warn("Image generation fallback applied:", imgErr);
      }

      const finalRecipe = {
        ...rawRecipe,
        image: dishImage,
        isAiGeneratedImage: isAiGeneratedImg,
      };

      setGeneratedRecipe(finalRecipe);
      setPreviewServings(finalRecipe.servings || servings);

      // Automatically persist to Custom Recipes in localStorage so user never loses it
      saveCustomRecipe(finalRecipe);
      setSavedSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("We hit an unexpected snag while crafting your recipe. Please check your connection and try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const quickPantrySuggestions = [
    "Garlic, Olive Oil, Canned Tomatoes, Basil, Pasta",
    "Chicken Breast, Greek Yogurt, Ginger, Garam Masala",
    "Tofu, Soy Sauce, Broccoli, Sesame Oil, Rice",
    "Eggs, Bell Peppers, Onions, Feta Cheese, Sourdough",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCEEEA] text-[#D95338] text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Kitchen Innovation</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#221B1A] tracking-tight">
          AI Chef Recipe Studio
        </h1>
        <p className="mt-2 text-stone-600 text-sm sm:text-base leading-relaxed">
          Tell us what is in your fridge or what you are craving. Our culinary engine will formulate an authentic, step-by-step masterwork with tailored ingredient measurements and genuine food photography.
        </p>
      </div>

      {/* Main Grid: Form on Left / Generator Output or Guidance on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E8DEC8] p-6 sm:p-8 shadow-xs space-y-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Ingredients Input */}
            <div className="space-y-2">
              <label className="block font-serif text-base font-bold text-[#221B1A]">
                What ingredients do you have? <span className="text-[#D95338]">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. 2 chicken thighs, Greek yogurt, canned tomatoes, garlic, onion, cumin..."
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full bg-[#FAF7F2] text-sm text-stone-800 rounded-2xl p-4 border border-[#E0D4C3] focus:outline-none focus:ring-2 focus:ring-[#D95338]/30 focus:border-[#D95338]"
              />
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold text-stone-400 block">Or try a pantry starter:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPantrySuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setIngredients(item)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#F3ECE2] text-stone-700 border border-[#E8DEC8] transition-colors text-left"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cuisine & Meal Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Cuisine Style
                </label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-xs sm:text-sm font-medium text-stone-800 rounded-xl px-3.5 py-2.5 border border-[#E0D4C3] focus:outline-none focus:border-[#D95338]"
                >
                  {CUISINE_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Meal Course
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-xs sm:text-sm font-medium text-stone-800 rounded-xl px-3.5 py-2.5 border border-[#E0D4C3] focus:outline-none focus:border-[#D95338]"
                >
                  {MEAL_TYPES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dietary & Allergies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Dietary Preference
                </label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-xs sm:text-sm font-medium text-stone-800 rounded-xl px-3.5 py-2.5 border border-[#E0D4C3] focus:outline-none focus:border-[#D95338]"
                >
                  {DIETARY_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Allergies / Avoid
                </label>
                <select
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-xs sm:text-sm font-medium text-stone-800 rounded-xl px-3.5 py-2.5 border border-[#E0D4C3] focus:outline-none focus:border-[#D95338]"
                >
                  {ALLERGY_OPTIONS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Servings, Cook Time, Skill Level */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  Servings
                </label>
                <div className="flex items-center justify-between bg-[#FAF7F2] border border-[#E0D4C3] rounded-xl px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => setServings((s) => Math.max(1, s - 1))}
                    className="w-6 h-6 rounded-md bg-white text-stone-800 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-stone-800">{servings}</span>
                  <button
                    type="button"
                    onClick={() => setServings((s) => Math.min(12, s + 1))}
                    className="w-6 h-6 rounded-md bg-white text-stone-800 font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  Time
                </label>
                <select
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-xs font-medium text-stone-800 rounded-xl px-2 py-2 border border-[#E0D4C3] focus:outline-none"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  Skill Level
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-xs font-medium text-stone-800 rounded-xl px-2 py-2 border border-[#E0D4C3] focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Master">Master Chef</option>
                </select>
              </div>
            </div>

            {/* Extra Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                Craving or Mood Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Extra crispy edges, comforting rainy evening, lightly spicy..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs sm:text-sm text-stone-800 rounded-xl px-3.5 py-2.5 border border-[#E0D4C3] focus:outline-none focus:border-[#D95338]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !ingredients.trim()}
              className="w-full py-4 rounded-full bg-[#D95338] text-white font-semibold text-sm hover:bg-[#C24329] active:scale-98 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md shadow-[#D95338]/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>{loading ? "Formulating Recipe..." : "Create My Custom Recipe"}</span>
            </button>
          </form>

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* While Loading */}
          {loading && (
            <div className="bg-white rounded-3xl border border-[#E8DEC8] p-8 sm:p-12 text-center space-y-6 shadow-xs animate-in fade-in">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#FCEEEA] text-[#D95338] flex items-center justify-center shadow-inner relative">
                <ChefHat className="w-10 h-10 animate-bounce" />
                <div className="absolute inset-0 rounded-full border-2 border-[#D95338] border-t-transparent animate-spin" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#221B1A]">
                  Consulting the AI Kitchen
                </h3>
                <p className="mt-2 text-sm text-[#D95338] font-medium transition-all duration-300">
                  {progressMessages[progressStep]}
                </p>
              </div>

              <div className="w-full bg-[#FAF7F2] rounded-full h-2 overflow-hidden border border-[#E0D4C3]">
                <div
                  className="bg-[#D95338] h-full transition-all duration-700 ease-out"
                  style={{ width: `${((progressStep + 1) / progressMessages.length) * 100}%` }}
                />
              </div>

              <p className="text-xs text-stone-500 italic">
                Crafting authentic flavor pairings and real food photography...
              </p>
            </div>
          )}

          {/* If Recipe Generated Successfully */}
          {!loading && generatedRecipe && (
            <div className="bg-white rounded-3xl border border-[#E8DEC8] overflow-hidden shadow-md space-y-6 pb-6">
              {/* Image & Header */}
              <div className="relative aspect-[16/9] w-full bg-stone-100">
                <Image
                  src={generatedRecipe.image}
                  alt={generatedRecipe.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-stone-900/85 backdrop-blur-md text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-stone-700/50">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {generatedRecipe.isAiGeneratedImage
                      ? "AI Generated Food Photography"
                      : "Curated Culinary Photography"}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
                    {generatedRecipe.cuisine} &bull; {generatedRecipe.category}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight drop-shadow-sm">
                    {generatedRecipe.title}
                  </h2>
                </div>
              </div>

              <div className="px-6 space-y-6">
                {/* Save Confirmation Banner */}
                {savedSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Saved automatically to your <strong>My Cookbook</strong>!</span>
                    </div>
                    <Link
                      href="/cookbook"
                      className="font-bold underline text-emerald-900 hover:text-emerald-700"
                    >
                      View Cookbook &rarr;
                    </Link>
                  </div>
                )}

                {/* Description */}
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {generatedRecipe.description}
                </p>

                {/* Meta stats */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E8DEC8] text-center text-xs">
                  <div>
                    <span className="block text-stone-400 text-[10px] uppercase font-bold">Cook Time</span>
                    <span className="font-bold text-stone-800">{generatedRecipe.cookTime}</span>
                  </div>
                  <div>
                    <span className="block text-stone-400 text-[10px] uppercase font-bold">Difficulty</span>
                    <span className="font-bold text-stone-800">{generatedRecipe.difficulty}</span>
                  </div>
                  <div>
                    <span className="block text-stone-400 text-[10px] uppercase font-bold">Servings</span>
                    <span className="font-bold text-stone-800">{previewServings}</span>
                  </div>
                </div>

                {/* Ingredients with Dynamic Scaler */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-serif text-lg font-bold text-[#221B1A]">Ingredients</h4>
                    <div className="flex items-center gap-2 bg-[#FAF7F2] px-2 py-1 rounded-full border border-[#E0D4C3] text-xs">
                      <button
                        onClick={() => setPreviewServings((s) => Math.max(1, s - 1))}
                        className="w-5 h-5 rounded-full bg-white text-stone-800 font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold">{previewServings} servings</span>
                      <button
                        onClick={() => setPreviewServings((s) => Math.min(24, s + 1))}
                        className="w-5 h-5 rounded-full bg-white text-stone-800 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs">
                    {generatedRecipe.ingredients.map((ing, idx) => {
                      const isChecked = checkedIngredients[idx];
                      const formattedAmount = formatQuantity(
                        ing.amount,
                        generatedRecipe.servings || 4,
                        previewServings
                      );

                      return (
                        <li
                          key={idx}
                          onClick={() =>
                            setCheckedIngredients((prev) => ({
                              ...prev,
                              [idx]: !prev[idx],
                            }))
                          }
                          className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer ${
                            isChecked ? "opacity-50 line-through bg-stone-50" : "hover:bg-[#FAF7F2]"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                              isChecked ? "bg-[#D95338] border-[#D95338] text-white" : "border-stone-300 bg-white"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="font-semibold text-stone-900">
                              {formattedAmount} {ing.unit}
                            </span>{" "}
                            <span className="text-stone-700">{ing.name}</span>
                            {ing.notes && (
                              <span className="block text-[11px] text-stone-400 italic">
                                ({ing.notes})
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Numbered Steps */}
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#221B1A] mb-3">
                    Cooking Instructions
                  </h4>
                  <div className="space-y-4">
                    {generatedRecipe.steps.map((st) => (
                      <div key={st.step} className="p-3.5 bg-[#FAF7F2] rounded-2xl text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-stone-900 text-sm">
                            Step {st.step}: {st.title}
                          </span>
                          {st.time && (
                            <span className="text-[10px] font-semibold text-[#D95338] bg-[#FCEEEA] px-2 py-0.5 rounded-full">
                              {st.time}
                            </span>
                          )}
                        </div>
                        <p className="text-stone-700 leading-relaxed">{st.instruction}</p>
                        {st.visualCue && (
                          <div className="text-[11px] text-stone-500 italic pt-1 border-t border-[#E8DEC8]">
                            <strong>Sensory cue:</strong> {st.visualCue}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#E8DEC8] flex flex-wrap gap-3">
                  <Link
                    href={`/recipe/${generatedRecipe.id}`}
                    className="flex-1 py-3 bg-[#D95338] hover:bg-[#C24329] text-white text-xs font-semibold rounded-full text-center shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <ChefHat className="w-4 h-4" />
                    <span>Open Full Cooking Mode & Assistant</span>
                  </Link>

                  <button
                    onClick={() => {
                      setGeneratedRecipe(null);
                      setIngredients("");
                    }}
                    className="px-4 py-3 bg-[#FAF7F2] hover:bg-[#F3ECE2] border border-[#E0D4C3] text-stone-700 text-xs font-semibold rounded-full flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Generate Another</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Initial State when no recipe generated yet */}
          {!loading && !generatedRecipe && (
            <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DEC8] p-8 sm:p-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FCEEEA] text-[#D95338] flex items-center justify-center">
                <ChefHat className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#221B1A]">
                  How the AI Chef works
                </h3>
                <p className="mt-2 text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Unlike simple recipe scrapers, CraveAI formulates unique dishes based on the fundamental chemistry of culinary pairing.
                </p>
              </div>

              <div className="space-y-3 text-xs text-stone-700">
                <div className="p-3 bg-white rounded-2xl border border-[#E8DEC8] flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#D95338] shrink-0 mt-0.5" />
                  <span>
                    <strong>Pantry Matching:</strong> Uses ingredients you have on hand to reduce food waste and grocery runs.
                  </span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-[#E8DEC8] flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#D95338] shrink-0 mt-0.5" />
                  <span>
                    <strong>Real AI Imagery:</strong> Produces professional, food-magazine photography matching the generated dish.
                  </span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-[#E8DEC8] flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#D95338] shrink-0 mt-0.5" />
                  <span>
                    <strong>Saved Automatically:</strong> Every generated recipe is instantly stored in your browser's local cookbook.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
