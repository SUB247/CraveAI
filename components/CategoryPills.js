"use client";

import {
  UtensilsCrossed,
  Flame,
  Pizza,
  Soup,
  Cake,
  Coffee,
  Leaf,
  Sprout,
  Timer,
  Fish,
  Sandwich,
  Sparkles,
  Globe,
} from "lucide-react";

const ICON_MAP = {
  all: UtensilsCrossed,
  Indian: Flame,
  Italian: Pizza,
  Japanese: Fish,
  Asian: Soup,
  Mexican: Flame,
  European: Globe,
  American: UtensilsCrossed,
  "Middle Eastern": Sparkles,
  African: Flame,
  Desserts: Cake,
  Breakfast: Coffee,
  Snacks: Sandwich,
  Vegetarian: Leaf,
  Vegan: Sprout,
  "Quick Meals": Timer,
};

export default function CategoryPills({
  categories = [],
  selectedCategory = "all",
  onSelectCategory,
}) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 -my-2">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-max pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const IconComponent = ICON_MAP[cat.id] || UtensilsCrossed;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
                isSelected
                  ? "bg-[#D95338] text-white shadow-md shadow-[#D95338]/30 font-semibold"
                  : "bg-white text-stone-700 hover:bg-[#F3ECE2] hover:text-[#221B1A] border border-[#E8DEC8]"
              }`}
            >
              <IconComponent
                className={`w-4 h-4 ${isSelected ? "text-white" : "text-[#D95338]"}`}
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
