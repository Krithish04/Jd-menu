"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ItemRow from "./ItemRow";
import ComboCard from "./ComboCard";
import Watermark from "./Watermark";
import { CategoryIcon } from "../icons/CategoryIcons";
import { Category } from "@/types/menu";
import { calculatePagination } from "@/lib/paginate";

type Props = {
  category: Category;
  language: "en" | "gu";
  onNextCategory: () => void;
  onPrevCategory: () => void;
  isFirstCategory: boolean;
  isLastCategory: boolean;
  showBothLanguages?: boolean;
};

export default function ItemPages({
  category,
  language,
  onNextCategory,
  onPrevCategory,
  isFirstCategory,
  isLastCategory,
  showBothLanguages = false,
}: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageTurnDir, setPageTurnDir] = useState<"left" | "right" | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const isGu = language === "gu";

  // Measure free height using ResizeObserver (PRD 4.2)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.height > 0) {
          setContainerHeight(Math.round(entry.contentRect.height));
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Compute balanced pagination plan dynamically based on available height
  const hasPhotos = category.items.some((i) => !!i.imageUrl);
  const paginationPlan = useMemo(() => {
    return calculatePagination(category.items.length, containerHeight, {
      hasPhotoOrSecondLine: hasPhotos || showBothLanguages,
    });
  }, [category.items.length, containerHeight, hasPhotos, showBothLanguages]);

  const totalPages = category.kind === "combo" ? 1 : paginationPlan.pagesCount;

  // Reset page when category changes
  useEffect(() => {
    setPageIndex(0);
  }, [category.id]);

  const goNext = useCallback(() => {
    setPageTurnDir("left");
    setTimeout(() => {
      if (pageIndex < totalPages - 1) {
        setPageIndex(pageIndex + 1);
      } else {
        onNextCategory();
      }
      setPageTurnDir(null);
    }, 200);
  }, [pageIndex, totalPages, onNextCategory]);

  const goPrev = useCallback(() => {
    setPageTurnDir("right");
    setTimeout(() => {
      if (pageIndex > 0) {
        setPageIndex(pageIndex - 1);
      } else {
        onPrevCategory();
      }
      setPageTurnDir(null);
    }, 200);
  }, [pageIndex, onPrevCategory]);

  // Touch gesture handler
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Slice items for current page according to balanced plan
  const currentSlice = paginationPlan.pageItemSlices[pageIndex] || {
    start: 0,
    end: category.items.length,
    count: category.items.length,
  };

  const pageItems =
    category.kind === "combo"
      ? category.items
      : category.items.slice(currentSlice.start, currentSlice.end);

  const catName =
    isGu && category.nameGu ? category.nameGu : category.nameEn;
  const altCatName =
    isGu && category.nameGu ? category.nameEn : category.nameGu;

  // Note strip text: Category's own note if set, else default GST & Parcel charge
  const customNote = isGu ? category.noteGu || category.note : category.note;
  const noteStripText =
    customNote ||
    (isGu
      ? "૫% જીએસટી તથા પાર્સલ ચાર્જ અલગથી રહેશે."
      : "5% GST extra • Parcel charge extra");

  return (
    <div
      className="flex flex-col h-full select-none relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hand-built SVG line-art watermark at 6% opacity */}
      <Watermark kind={category.iconKey || category.slug} />

      {/* Ribbon Header with folded ends and category icon */}
      <div className="relative px-3 pt-2 pb-1 flex-shrink-0 z-10">
        <div className="relative flex items-center justify-between bg-brand-green text-white px-3 py-1.5 rounded shadow-sm border border-brand-green-dark">
          {/* Category Icon + Title in Ribbon */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex-shrink-0 bg-white/10 p-1 rounded">
              <CategoryIcon
                name={category.iconKey || category.slug}
                size={22}
                className="text-white"
              />
            </div>
            <div className="flex items-baseline gap-1.5 min-w-0">
              <h2 className="font-serif text-sm font-bold tracking-wider uppercase truncate">
                {catName}
              </h2>
              {altCatName && (
                <span className="text-[10px] text-white/80 font-normal truncate">
                  ({altCatName})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Items Container with simulated laminated page-turn 3D tilt */}
      <div
        ref={containerRef}
        className={`flex-1 overflow-hidden px-3 py-1 z-10 flex flex-col transition-all duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
          pageTurnDir === "left"
            ? "-translate-x-3 opacity-60 rotate-[-2deg]"
            : pageTurnDir === "right"
            ? "translate-x-3 opacity-60 rotate-[2deg]"
            : "translate-x-0 opacity-100 rotate-0"
        }`}
      >
        {category.kind === "combo" ? (
          <div className="h-full overflow-y-auto">
            {pageItems.map((item) => (
              <ComboCard key={item.id} item={item} language={language} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col border border-brand-green/30 rounded-lg overflow-hidden bg-white/95 shadow-xs">
            {pageItems.map((item, i) => (
              <ItemRow
                key={item.id}
                item={item}
                language={language}
                isEven={i % 2 === 1}
                isLast={i === pageItems.length - 1}
                rowHeight={paginationPlan.rowHeight}
                showBothLanguages={showBothLanguages}
              />
            ))}
            {pageItems.length === 0 && (
              <p className="text-center text-brand-muted py-8 text-xs">
                {isGu ? "આ કેટેગરીમાં કોઈ વાનગી નથી" : "No items in this category"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Note Strip pinned above pager (PRD 4.2 item 2 & AC 13) */}
      <div className="flex-shrink-0 z-10 px-3 py-1 bg-[#FAF3ED]/90 border-t border-brand-green/15 text-center">
        <p className="text-[10px] font-medium text-brand-maroon tracking-wide truncate">
          {noteStripText}
        </p>
      </div>

      {/* Bottom Pager Strip: dots + "2 / 5" indicator + Next/Prev */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-1.5 z-10 bg-brand-cream border-t border-brand-green/20">
        <button
          onClick={goPrev}
          disabled={isFirstCategory && pageIndex === 0}
          className="p-1 min-w-[44px] min-h-[32px] text-brand-green disabled:opacity-20 hover:bg-brand-green/10 rounded flex items-center gap-0.5 text-xs font-semibold"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          <span>{isGu ? "પાછળ" : "Prev"}</span>
        </button>

        {/* Page Dots & Count (e.g. 1 / 5) */}
        <div className="flex items-center gap-1.5">
          {totalPages > 1 &&
            Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPageIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === pageIndex ? "w-3 bg-brand-green" : "w-1.5 bg-brand-green/30"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          <span className="text-[11px] text-brand-muted ml-1.5 font-medium">
            {pageIndex + 1} / {totalPages}
          </span>
        </div>

        <button
          onClick={goNext}
          disabled={isLastCategory && pageIndex === totalPages - 1}
          className="p-1 min-w-[44px] min-h-[32px] text-brand-green disabled:opacity-20 hover:bg-brand-green/10 rounded flex items-center justify-end gap-0.5 text-xs font-semibold"
          aria-label="Next page"
        >
          <span>{isGu ? "આગળ" : "Next"}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
