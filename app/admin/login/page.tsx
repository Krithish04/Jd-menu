"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, ArrowLeft, UtensilsCrossed } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Use full page reload to ensure cookies are attached across mobile browsers
        window.location.href = "/admin/menu";
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid password");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4 selection:bg-brand-gold/30">
      {/* Return to Menu Link */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between">
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-green font-semibold transition-colors py-1 px-2 rounded-md hover:bg-black/5"
        >
          <ArrowLeft size={14} />
          <span>Back to Menu</span>
        </Link>
        <span className="text-[11px] text-brand-muted font-mono">Mobile & Desktop</span>
      </div>

      <div className="w-full max-w-sm border-2 border-brand-green/30 rounded-2xl bg-white overflow-hidden shadow-xl">
        {/* Header Ribbon */}
        <div className="bg-brand-maroon-binder text-white px-6 py-5 text-center relative border-b-2 border-brand-gold/40">
          <div className="inline-flex p-2.5 rounded-full bg-brand-gold/20 text-brand-gold mb-2 border border-brand-gold/40">
            <UtensilsCrossed size={22} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-gold tracking-wide">
            JD Restaurant
          </h1>
          <p className="text-xs text-white/80 mt-0.5 tracking-wider uppercase font-medium">
            Admin Management Portal
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-brand-text mb-1.5 tracking-wide"
            >
              Admin Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoFocus
                className="w-full border-2 border-brand-green/30 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-brand-text focus:outline-none focus:border-brand-green bg-white shadow-2xs transition-colors"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-muted hover:text-brand-text transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green text-white rounded-lg py-3 text-sm font-bold hover:bg-brand-green-hover active:scale-[0.99] transition-all disabled:opacity-60 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock size={16} />
            <span>{loading ? "Verifying..." : "Sign In to Admin"}</span>
          </button>
        </form>
      </div>

      <p className="text-[11px] text-brand-muted mt-6 text-center">
        Works on any device: iPhone, Android, iPad, Tablet, or PC
      </p>
    </div>
  );
}
