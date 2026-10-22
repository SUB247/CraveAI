"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Sparkles,
  BookMarked,
  Compass,
  Utensils,
  Menu,
  X,
  ChefHat,
  Search,
} from "lucide-react";
import { getFavorites } from "@/lib/storage";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [navSearch, setNavSearch] = useState("");
  const [showNavSearch, setShowNavSearch] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      setFavCount(getFavorites().length);
    };
    updateCount();
    window.addEventListener("craveai_favorites_updated", updateCount);
    return () => window.removeEventListener("craveai_favorites_updated", updateCount);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: Utensils },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "AI Chef", href: "/ai-chef", icon: Sparkles },
    { name: "My Cookbook", href: "/cookbook", icon: BookMarked, badge: favCount },
  ];

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/explore?search=${encodeURIComponent(navSearch.trim())}`);
      setShowNavSearch(false);
      setNavSearch("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EBE2D5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D95338] text-white flex items-center justify-center shadow-md shadow-[#D95338]/20 group-hover:scale-105 transition-transform duration-300">
                <ChefHat className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#221B1A] group-hover:text-[#D95338] transition-colors">
                  Crave<span className="text-[#D95338]">AI</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-500 -mt-1">
                  The Digital Cookbook
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? "text-[#D95338] bg-[#FCEEEA] font-semibold"
                        : "text-stone-700 hover:text-[#221B1A] hover:bg-[#F3ECE2]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#D95338]" : "text-stone-500"}`} />
                    <span>{link.name}</span>
                    {typeof link.badge === "number" && link.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-[#D95338] text-white rounded-full min-w-5 text-center leading-none">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick search toggle */}
            {showNavSearch ? (
              <form onSubmit={handleNavSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search recipes, ingredients..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  autoFocus
                  onBlur={() => !navSearch && setShowNavSearch(false)}
                  className="w-56 lg:w-64 pl-9 pr-3 py-2 text-xs rounded-full border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D95338]/30 focus:border-[#D95338]"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>
            ) : (
              <button
                onClick={() => setShowNavSearch(true)}
                className="p-2 text-stone-600 hover:text-[#221B1A] hover:bg-[#F3ECE2] rounded-full transition-colors"
                title="Search recipes"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* AI Chef CTA */}
            <Link
              href="/ai-chef"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium bg-[#D95338] text-white hover:bg-[#C24329] shadow-sm shadow-[#D95338]/30 hover:shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Create a Recipe</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-stone-700 hover:text-stone-900 rounded-xl hover:bg-[#F3ECE2] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#EBE2D5] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {/* Quick search input */}
          <form onSubmit={handleNavSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search recipes, ingredients..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D95338]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-[#FCEEEA] text-[#D95338] font-semibold"
                    : "text-stone-800 hover:bg-[#F3ECE2]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-stone-500" />
                  <span>{link.name}</span>
                </div>
                {typeof link.badge === "number" && link.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-[#D95338] text-white rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              href="/ai-chef"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#D95338] text-white font-medium shadow-md shadow-[#D95338]/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create a Recipe with AI</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
