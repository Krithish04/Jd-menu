"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-maroon-binder flex items-center justify-center p-4">
      <div className="bg-brand-cream border-4 border-red-700 rounded-xl p-8 max-w-sm w-full text-center shadow-2xl relative">
        <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-700 flex items-center justify-center mx-auto mb-4 text-red-700">
          <AlertTriangle size={28} />
        </div>
        <h1 className="font-serif text-2xl font-bold text-red-800 mb-2">
          Something went wrong
        </h1>
        <p className="text-xs text-brand-muted mb-6 leading-relaxed">
          We encountered an unexpected error loading the menu. Please tap below to try again.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-brand-green text-white font-bold text-xs px-6 py-2.5 rounded-full hover:bg-brand-green-hover transition-colors shadow-xs"
        >
          <RefreshCw size={14} />
          Reload Page
        </button>
      </div>
    </div>
  );
}
