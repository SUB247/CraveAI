import Link from "next/link";
import { ChefHat, Heart, Sparkles, UtensilsCrossed, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[#E8DEC8] bg-[#F4ECE1] text-[#221B1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D95338] text-white flex items-center justify-center shadow-md">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#221B1A]">
                Crave<span className="text-[#D95338]">AI</span>
              </span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              An interactive digital cookbook where culinary craftsmanship meets intelligent AI. Discover recipes, adjust servings, and cook alongside your personal AI sous-chef.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#D95338]" />
              <span>Powered by Gemini & Smart Culinary Intelligence</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold text-stone-900 mb-4 tracking-wide">
              Culinary Catalog
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li>
                <Link href="/explore?category=Indian" className="hover:text-[#D95338] transition-colors flex items-center gap-1">
                  Indian Classics
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Italian" className="hover:text-[#D95338] transition-colors flex items-center gap-1">
                  Italian Trattoria
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Asian" className="hover:text-[#D95338] transition-colors flex items-center gap-1">
                  Asian Specialties
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Vegetarian" className="hover:text-[#D95338] transition-colors flex items-center gap-1">
                  Plant-Forward & Vegan
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Quick%20Meals" className="hover:text-[#D95338] transition-colors flex items-center gap-1">
                  20-Minute Weeknight Heroes
                </Link>
              </li>
            </ul>
          </div>

          {/* Interactive Tools */}
          <div>
            <h4 className="font-serif text-base font-semibold text-stone-900 mb-4 tracking-wide">
              AI Kitchen Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li>
                <Link href="/ai-chef" className="hover:text-[#D95338] transition-colors flex items-center gap-1">
                  Pantry-to-Recipe Generator
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/cookbook" className="hover:text-[#D95338] transition-colors flex items-center gap-1">
                  My Saved Cookbook
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-[#D95338] transition-colors flex items-center gap-1">
                  Advanced Recipe Filter
                </Link>
              </li>
              <li>
                <Link href="/recipe/butter-chicken-murgh-makhani" className="hover:text-[#D95338] transition-colors flex items-center gap-1">
                  Interactive Cooking Mode
                </Link>
              </li>
            </ul>
          </div>

          {/* Culinary Philosophy */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8DEC8] space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-serif font-medium text-sm">
              <UtensilsCrossed className="w-4 h-4 text-[#D95338]" />
              <span>The CraveAI Promise</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every recipe is designed with precise measurements, authentic culinary techniques, sensory visual cues, and pro chef tips so you never have to second-guess dinner.
            </p>
            <div className="pt-2 border-t border-[#E8DEC8]/60 text-[11px] text-stone-500">
              Local Storage Persisted &bull; Zero Clutter &bull; Chef-Tested
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#E8DEC8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} CraveAI Digital Cookbook. All culinary masteries preserved.</p>
          <p className="flex items-center gap-1.5">
            Designed with <Heart className="w-3.5 h-3.5 text-[#D95338] fill-[#D95338]" /> for home cooks & food lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
