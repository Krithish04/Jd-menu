"use client";

import React from "react";
import { Search, Info, Menu as MenuIcon } from "lucide-react";
import LangSwitch from "./LangSwitch";
import CategoryTabs from "./CategoryTabs";
import { Category } from "@/types/menu";

type Props = {
  categories: Category[];
  activeCategoryIndex: number;
  onCategoryChange: (index: number) => void;
  language: "en" | "gu";
  onLanguageChange: (lang: "en" | "gu") => void;
  onOpenSearch: () => void;
  onOpenInfo: () => void;
  onOpenDrawer: () => void;
  onOpenAll: () => void;
  restaurantName?: string;
};

export default function Header({
  categories,
  activeCategoryIndex,
  onCategoryChange,
  language,
  onLanguageChange,
  onOpenSearch,
  onOpenInfo,
  onOpenDrawer,
  onOpenAll,
  restaurantName = "JD Restaurant",
}: Props) {
  return (
    <header className="flex-shrink-0 flex flex-col z-20 shadow-xs border-b border-brand-green/20 select-none">
      {/* Row 1 - Top Bar (~52px) */}
      <div className="h-[52px] bg-brand-green text-white px-2.5 flex items-center justify-between border-b border-brand-green-dark">
        {/* Left: Menu Drawer Hamburger + JD Round Badge + JD Restaurant Wordmark */}
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Menu button (three lines) */}
          <button
            onClick={onOpenDrawer}
            className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition-transform rounded"
            aria-label="Open navigation drawer"
          >
            <MenuIcon size={20} strokeWidth={2.2} />
          </button>

          {/* JD Badge */}
          <div className="w-8 h-8 rounded-full border border-brand-gold bg-[#4A0A12] flex items-center justify-center shadow-xs flex-shrink-0">
            <span className="font-serif text-[11px] font-bold text-brand-gold tracking-tight">
              J.D.
            </span>
          </div>

          {/* Wordmark */}
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-sm sm:text-base font-bold leading-tight tracking-wide text-white truncate">
              {restaurantName}
            </span>
            <span className="text-[9px] text-brand-gold font-sans uppercase tracking-wider -mt-0.5">
              {language === "gu" ? "શુદ્ધ શાકાહારી" : "Pure Veg."}
            </span>
          </div>
        </div>

        {/* Right: Language switch + Search icon + Info "i" icon */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {/* Accessible EN / ગુજ Switch */}
          <LangSwitch language={language} onChange={onLanguageChange} />

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="w-9 h-9 flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition-transform"
            aria-label="Search Menu"
          >
            <Search size={18} />
          </button>

          {/* Info Button */}
          <button
            onClick={onOpenInfo}
            className="w-9 h-9 flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition-transform"
            aria-label="Restaurant Notices and Information"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Row 2 - Category Tabs (~44px) with Pinned "All" Button */}
      <CategoryTabs
        categories={categories}
        activeCategoryIndex={activeCategoryIndex}
        onCategoryChange={onCategoryChange}
        language={language}
        onOpenAll={onOpenAll}
      />
    </header>
  );
}
