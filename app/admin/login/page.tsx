"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/menu");
    } else {
      const data = await res.json();
      setError(data.error || "Invalid password");
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm border border-brand-green/30 rounded-lg bg-white overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-brand-green text-white px-6 py-5 text-center">
          <h1 className="font-serif text-2xl font-bold">JD Restaurant</h1>
          <p className="text-sm opacity-80 mt-1">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-text mb-1">
              Admin Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-brand-green/40 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green text-white rounded py-2.5 text-sm font-medium hover:bg-brand-green-hover transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
