"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Category } from "@/types/menu";

type Props = {
  categories: Category[];
  activeCategoryIndex: number;
  language: "en" | "gu";
  onSelectCategory: (index: number) => void;
  onClose: () => void;
};

export default function CategorySheet({
  categories,
  activeCategoryIndex,
  language,
  onSelectCategory,
  onClose,
}: Props) {
  const isGu = language === "gu";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isGu ? "કેટેગરી મેનુ" : "Category Selection"}
      className="absolute inset-0 z-50 bg-black/60 flex items-end select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full bg-[#FAF3ED] rounded-t-2xl overflow-hidden flex flex-col shadow-2xl border-t-2 border-brand-green"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-brand-green text-white px-4 py-2.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-sm tracking-wider uppercase">
              {isGu ? "કેટેગરી" : "Categories"}
            </h2>
            <span className="text-[10px] bg-black/20 text-brand-gold px-1.5 py-0.5 rounded font-sans">
              {categories.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-white/10 rounded-full"
            aria-label="Close category sheet"
          >
            <X size={18} />
          </button>
        </div>

        {/* Two-Column Grid (8 rows x 2 cols = 16 categories, fits 360x640 phone without scrolling) */}
        <div className="p-3 grid grid-cols-2 gap-2 bg-[#FAF3ED]">
          {categories.map((cat, idx) => {
            const isActive = idx === activeCategoryIndex;
            const shortName = isGu
              ? cat.shortNameGu || cat.nameGu || cat.shortNameEn || cat.nameEn
              : cat.shortNameEn || cat.nameEn;
            const itemCount = cat.items?.length ?? cat._count?.items ?? 0;
            const href = isGu ? `/gu/menu/${cat.slug}` : `/menu/${cat.slug}`;

            return (
              <Link
                key={cat.id}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, "", href);
                  onSelectCategory(idx);
                  onClose();
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all border ${
                  isActive
                    ? "bg-brand-green text-white border-brand-green shadow-xs font-bold"
                    : "bg-white text-brand-text border-brand-green/20 hover:border-brand-green/50 active:scale-98 font-medium"
                }`}
                style={{ minHeight: "40px" }}
              >
                <span className="text-xs truncate mr-1.5">{shortName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans flex-shrink-0 ${
                    isActive
                      ? "bg-white/20 text-brand-gold"
                      : "bg-brand-cream-dark/60 text-brand-muted"
                  }`}
                >
                  {itemCount}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
