"use client";

import { useState } from "react";
import { X, Lock, Mail, User, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (mode === "forgot") {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Password reset request failed");
        setSuccessMsg(data.message || "Password reset email sent! Check your inbox.");
        setTimeout(() => {
          setMode("signin");
          setSuccessMsg("");
        }, 3000);
        return;
      }

      const endpoint = mode === "signup" ? "/api/auth/sign-up" : "/api/auth/sign-in";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName: mode === "signup" ? fullName : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (mode === "signup") {
        setSuccessMsg("Account created! Check your email to verify or sign in.");
        setTimeout(() => {
          setMode("signin");
          setSuccessMsg("");
        }, 2000);
      } else {
        setSuccessMsg("Signed in successfully!");
        if (onAuthSuccess) onAuthSuccess(data.user);
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8DEC8]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FCEEEA] text-[#D95338] flex items-center justify-center mb-3 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#221B1A]">
            {mode === "signup"
              ? "Create Your Chef Account"
              : mode === "forgot"
              ? "Reset Your Password"
              : "Sign in to CraveAI"}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {mode === "signup"
              ? "Sync search history, saved recipes, and personalized AI recommendations"
              : mode === "forgot"
              ? "Enter your email address and we'll send you a password recovery link"
              : "Access your cloud-synced cookbook, history, and dietary preferences"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Chef Julia"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E0D4C3] rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#D95338]"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="chef@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E0D4C3] rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#D95338]"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {mode !== "forgot" && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700">Password</label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-[11px] text-[#D95338] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E0D4C3] rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#D95338]"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#D95338] text-white font-semibold text-xs sm:text-sm hover:bg-[#C24329] active:scale-98 transition-all disabled:opacity-50 shadow-md shadow-[#D95338]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>
                {mode === "signup"
                  ? "Create Account"
                  : mode === "forgot"
                  ? "Send Reset Link"
                  : "Sign In"}
              </span>
            )}
          </button>
        </form>

        {/* Toggle sign in / sign up / forgot */}
        <div className="mt-5 text-center text-xs text-stone-600 space-y-1">
          {mode === "forgot" ? (
            <div>
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="font-bold text-[#D95338] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div>
              {mode === "signup" ? "Already have an account?" : "Don't have an account yet?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signup" ? "signin" : "signup");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="font-bold text-[#D95338] hover:underline cursor-pointer"
              >
                {mode === "signup" ? "Sign In" : "Sign Up"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
