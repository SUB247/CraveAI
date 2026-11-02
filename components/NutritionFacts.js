"use client";

import { useState } from "react";
import { Activity, Info, Flame, Zap } from "lucide-react";
import { getScaledNutrition } from "@/lib/nutrition";

export default function NutritionFacts({ nutrition, baseServings = 4, currentServings = 4 }) {
  const [viewMode, setViewMode] = useState("serving"); // "serving" | "entire"

  if (!nutrition) {
    return (
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DEC8] p-6 text-center text-xs text-stone-500">
        <Info className="w-5 h-5 mx-auto mb-2 text-stone-400" />
        <p>Nutritional estimation is being generated for this recipe.</p>
      </div>
    );
  }

  const scaled = getScaledNutrition(nutrition, baseServings, currentServings, viewMode);

  return (
    <div className="bg-white rounded-3xl border border-[#E8DEC8] p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header with Title & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2ECE4]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#FCEEEA] text-[#D95338] flex items-center justify-center shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#221B1A]">
              Nutritional Information
            </h3>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Serving size: <strong className="text-stone-800">{scaled.servingSize}</strong>
            </p>
          </div>
        </div>

        {/* Toggle per serving / entire recipe */}
        <div className="inline-flex p-1 rounded-full bg-[#FAF7F2] border border-[#E0D4C3] text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("serving")}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              viewMode === "serving"
                ? "bg-[#D95338] text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Per Serving
          </button>
          <button
            type="button"
            onClick={() => setViewMode("entire")}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              viewMode === "entire"
                ? "bg-[#D95338] text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Entire Dish ({currentServings} servings)
          </button>
        </div>
      </div>

      {/* Hero Macro Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Calories */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8] text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            <Flame className="w-3.5 h-3.5 text-[#D95338]" /> Calories
          </div>
          <div className="font-serif text-3xl font-bold text-[#221B1A]">
            {scaled.calories}
          </div>
          <div className="text-[10px] text-stone-400 font-medium">kcal</div>
        </div>

        {/* Energy */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8] text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Energy
          </div>
          <div className="font-serif text-3xl font-bold text-[#221B1A]">
            {scaled.energyKj}
          </div>
          <div className="text-[10px] text-stone-400 font-medium">kJ</div>
        </div>

        {/* Protein */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8] text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Protein
          </div>
          <div className="font-serif text-3xl font-bold text-emerald-700">
            {scaled.protein}g
          </div>
          <div className="text-[10px] text-stone-400 font-medium">per {viewMode === "serving" ? "portion" : "batch"}</div>
        </div>

        {/* Carbohydrates */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8] text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Carbs
          </div>
          <div className="font-serif text-3xl font-bold text-amber-700">
            {scaled.carbohydrates}g
          </div>
          <div className="text-[10px] text-stone-400 font-medium">per {viewMode === "serving" ? "portion" : "batch"}</div>
        </div>
      </div>

      {/* Detailed Macro Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
        <div className="p-3 bg-white rounded-xl border border-[#E8DEC8] flex items-center justify-between">
          <span className="text-xs text-stone-600 font-medium">Total Fat:</span>
          <span className="text-xs font-bold text-stone-900">{scaled.totalFat}g</span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-[#E8DEC8] flex items-center justify-between">
          <span className="text-xs text-stone-600 font-medium">Saturated Fat:</span>
          <span className="text-xs font-bold text-stone-900">{scaled.saturatedFat}g</span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-[#E8DEC8] flex items-center justify-between">
          <span className="text-xs text-stone-600 font-medium">Dietary Fibre:</span>
          <span className="text-xs font-bold text-stone-900">{scaled.fiber}g</span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-[#E8DEC8] flex items-center justify-between">
          <span className="text-xs text-stone-600 font-medium">Total Sugars:</span>
          <span className="text-xs font-bold text-stone-900">{scaled.sugar}g</span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-[#E8DEC8] flex items-center justify-between col-span-2 sm:col-span-1">
          <span className="text-xs text-stone-600 font-medium">Sodium:</span>
          <span className="text-xs font-bold text-stone-900">{scaled.sodium}mg</span>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] flex items-start gap-2.5 text-[11px] text-stone-500 leading-relaxed">
        <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
        <span>
          <strong>Nutritional Disclaimer:</strong> Values are culinary estimates calculated from ingredient quantities and standard USDA food composition references. Exact numbers may vary based on ingredient brands, cooking methods, portioning, and liquid evaporation. Provided for general food awareness, not as medical or dietary advice.
        </span>
      </div>
    </div>
  );
}
