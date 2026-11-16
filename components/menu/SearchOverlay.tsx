"use client";

import { useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import ItemRow from "./ItemRow";
import { Item, Category } from "@/types/menu";

type Props = {
  categories: Category[];
  language: "en" | "gu";
  onClose: () => void;
};

const RESULTS_PER_PAGE = 8;

export default function SearchOverlay({
  categories,
  language,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);

  const allItems = categories.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, categoryName: cat.nameEn }))
  );

  const results = query.trim()
    ? allItems.filter(
        (item) =>
          item.nameEn.toLowerCase().includes(query.toLowerCase()) ||
          (item.nameGu && item.nameGu.includes(query))
      )
    : [];

  const totalPages = Math.max(1, Math.ceil(results.length / RESULTS_PER_PAGE));
  const pageResults = results.slice(
    pageIndex * RESULTS_PER_PAGE,
    (pageIndex + 1) * RESULTS_PER_PAGE
  );

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setPageIndex(0);
    },
    []
  );

  return (
    <div className="absolute inset-0 z-50 bg-brand-cream flex flex-col select-none overflow-hidden animate-fadeIn">
      {/* Search Header Bar */}
      <div className="flex-shrink-0 bg-brand-green text-white px-3 py-2.5 flex items-center gap-2 border-b border-brand-green-dark shadow-xs">
        <Search size={18} className="text-brand-gold flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder={
            language === "gu"
              ? "વાનગી શોધો (દા.ત. પનીર, ઢોસા)..."
              : "Search dishes (e.g. Paneer, Dosa)..."
          }
          className="flex-1 bg-white/15 text-white placeholder-white/60 px-3 py-1.5 rounded-lg text-xs outline-none focus:bg-white/25 border border-white/20 transition-colors"
          autoFocus
        />
        <button
          onClick={onClose}
          className="p-1 min-w-[36px] min-h-[36px] flex items-center justify-center text-white/90 hover:text-white"
          aria-label="Close search"
        >
          <X size={20} />
        </button>
      </div>

      {/* Results Content */}
      <div className="flex-1 overflow-hidden px-3 py-2">
        {query.trim() === "" && (
          <p className="text-center text-brand-muted text-xs mt-10">
            {language === "gu" ? "શોધવા માટે લખો…" : "Type dish name to search…"}
          </p>
        )}
        {query.trim() !== "" && results.length === 0 && (
          <p className="text-center text-brand-muted text-xs mt-10">
            {language === "gu"
              ? `"${query}" માટે કોઈ વાનગી મળી નથી`
              : `No items found for "${query}"`}
          </p>
        )}
        {pageResults.length > 0 && (
          <div className="border border-brand-green/30 rounded-lg overflow-hidden bg-white shadow-xs">
            {pageResults.map((item, i) => (
              <ItemRow
                key={item.id}
                item={item}
                language={language}
                isEven={i % 2 === 1}
                isLast={i === pageResults.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {results.length > RESULTS_PER_PAGE && (
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-t border-brand-green/15 bg-brand-cream">
          <button
            onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
            disabled={pageIndex === 0}
            className="p-1 min-w-[44px] min-h-[36px] text-brand-green disabled:opacity-20 flex items-center gap-0.5 text-xs font-semibold"
          >
            <ChevronLeft size={16} />
            <span>{language === "gu" ? "પાછળ" : "Prev"}</span>
          </button>
          <span className="text-[11px] text-brand-muted font-medium">
            {pageIndex + 1} / {totalPages} ({results.length}{" "}
            {language === "gu" ? "વાનગીઓ" : "results"})
          </span>
          <button
            onClick={() => setPageIndex(Math.min(totalPages - 1, pageIndex + 1))}
            disabled={pageIndex === totalPages - 1}
            className="p-1 min-w-[44px] min-h-[36px] text-brand-green disabled:opacity-20 flex items-center justify-end gap-0.5 text-xs font-semibold"
          >
            <span>{language === "gu" ? "આગળ" : "Next"}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
