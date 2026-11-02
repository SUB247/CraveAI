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
  User,
  LogOut,
  Sliders,
  Check,
} from "lucide-react";
import { getFavorites } from "@/lib/storage";
import SearchBar from "./SearchBar";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [showNavSearch, setShowNavSearch] = useState(false);

  // Auth State
  const [user, setUser] = useState(null);
  const [authConfigured, setAuthConfigured] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Check user session
  const checkUserSession = async () => {
    try {
      const res = await fetch("/api/auth/user");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setAuthConfigured(Boolean(data.configured));
      }
    } catch (e) {
      console.warn("Could not check auth session:", e);
    }
  };

  useEffect(() => {
    checkUserSession();
    const updateCount = () => {
      setFavCount(getFavorites().length);
    };
    updateCount();
    window.addEventListener("craveai_favorites_updated", updateCount);
    return () => window.removeEventListener("craveai_favorites_updated", updateCount);
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      setUser(null);
      setUserMenuOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Utensils },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "AI Chef", href: "/ai-chef", icon: Sparkles },
    { name: "My Cookbook", href: "/cookbook", icon: BookMarked, badge: favCount },
  ];

  return (
    <>
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
              {/* Intelligent Search Input */}
              {showNavSearch ? (
                <div className="w-64 lg:w-80">
                  <SearchBar variant="compact" placeholder="Search dish, ingredients..." />
                </div>
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
                <span>Create Recipe</span>
              </Link>

              {/* User Account / Sign In Button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E0D4C3] text-xs font-semibold text-stone-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#D95338] text-white flex items-center justify-center font-bold text-xs uppercase">
                      {user.email?.[0] || "C"}
                    </div>
                    <span className="max-w-[100px] truncate">{user.email?.split("@")[0]}</span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E8DEC8] shadow-xl p-2 z-50 text-xs text-stone-700 animate-in fade-in">
                      <div className="p-3 border-b border-[#F2ECE4]">
                        <div className="font-bold text-stone-900 truncate">{user.email}</div>
                        <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          <Check className="w-3 h-3" /> Cloud Synced
                        </div>
                      </div>
                      <Link
                        href="/explore?tab=preferences"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors"
                      >
                        <Sliders className="w-4 h-4 text-stone-500" />
                        <span>Dietary Preferences</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#D5C6B3] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-stone-800 transition-colors shadow-xs"
                >
                  <User className="w-3.5 h-3.5 text-[#D95338]" />
                  <span>Sign In</span>
                </button>
              )}
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
          <div className="sm:hidden border-t border-[#EBE2D5] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
            <div className="mb-3">
              <SearchBar variant="compact" placeholder="Search dish, ingredients..." />
            </div>

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

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/ai-chef"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#D95338] text-white font-medium shadow-md shadow-[#D95338]/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create a Recipe with AI</span>
              </Link>

              {user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-stone-500" />
                  <span>Sign Out ({user.email})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl border border-[#D5C6B3] bg-white text-stone-800 font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-[#D95338]" />
                  <span>Sign In / Create Account</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(authUser) => {
          setUser(authUser);
          checkUserSession();
        }}
      />
    </>
  );
}
