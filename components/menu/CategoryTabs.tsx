"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Category } from "@/types/menu";

type Props = {
  categories: Category[];
  activeCategoryIndex: number;
  onCategoryChange: (index: number) => void;
  language: "en" | "gu";
  onOpenAll: () => void;
};

export default function CategoryTabs({
  categories,
  activeCategoryIndex,
  onCategoryChange,
  language,
  onOpenAll,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const isGu = language === "gu";

  // Update underline and auto-scroll active tab into center
  useEffect(() => {
    const currentTab = tabRefs.current[activeCategoryIndex];
    if (currentTab && scrollRef.current) {
      setUnderlineStyle({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth,
      });

      // Smooth scroll active tab to center of scroll container
      const containerWidth = scrollRef.current.clientWidth;
      const scrollTarget =
        currentTab.offsetLeft - containerWidth / 2 + currentTab.offsetWidth / 2;

      scrollRef.current.scrollTo({
        left: scrollTarget,
        behavior: "smooth",
      });
    }
  }, [activeCategoryIndex, language, categories]);

  return (
    <div className="relative w-full h-[44px] bg-[#FAF3ED] border-b border-brand-green/20 flex items-center select-none overflow-hidden">
      {/* Soft cream fade on left edge */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#FAF3ED] to-transparent z-10" />

      {/* Tabs scroll container */}
      <div
        ref={scrollRef}
        className="flex-1 flex items-center h-full overflow-x-auto pl-3 pr-2 gap-4 no-scrollbar relative"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat, idx) => {
          const isActive = idx === activeCategoryIndex;
          const label = isGu
            ? cat.shortNameGu || cat.nameGu || cat.shortNameEn || cat.nameEn
            : cat.shortNameEn || cat.nameEn;
          const href = isGu ? `/gu/menu/${cat.slug}` : `/menu/${cat.slug}`;

          return (
            <Link
              key={cat.id}
              href={href}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, "", href);
                onCategoryChange(idx);
              }}
              aria-current={isActive ? "page" : undefined}
              className={`flex-shrink-0 text-xs py-2 whitespace-nowrap transition-colors min-h-[44px] flex items-center ${
                isActive
                  ? "text-brand-green font-bold"
                  : "text-brand-text hover:text-brand-green font-medium"
              }`}
            >
              {label}
            </Link>
          );
        })}

        {/* Sliding 2px Green Underline */}
        <div
          className="absolute bottom-0 h-[2px] bg-brand-green transition-all duration-250 ease-out"
          style={{
            left: `${underlineStyle.left}px`,
            width: `${underlineStyle.width}px`,
          }}
        />
      </div>

      {/* Pinned "All" Button at right end (does not scroll with tabs) */}
      <div className="flex-shrink-0 relative z-20 flex items-center h-full bg-[#FAF3ED] border-l border-brand-green/20 pl-1 pr-2 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)]">
        <button
          onClick={onOpenAll}
          className="flex items-center gap-0.5 px-2 py-1 text-xs font-bold text-brand-green hover:bg-brand-green/10 rounded active:scale-95 transition-all"
          aria-label="View all categories"
          style={{ minHeight: "36px" }}
        >
          <span>{isGu ? "બધા" : "All"}</span>
          <ChevronDown size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
