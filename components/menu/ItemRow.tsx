"use client";

import React, { useState } from "react";
import { VegSymbol, StampBadge } from "./Badges";
import { Item } from "@/types/menu";
import { X } from "lucide-react";

type Props = {
  item: Item;
  language: "en" | "gu";
  isEven: boolean;
  isLast: boolean;
  rowHeight?: number;
  showBothLanguages?: boolean;
};

export default function ItemRow({
  item,
  language,
  isEven,
  isLast,
  rowHeight,
  showBothLanguages = false,
}: Props) {
  const [photoEnlarged, setPhotoEnlarged] = useState(false);

  const name = language === "gu" && item.nameGu ? item.nameGu : item.nameEn;
  const altName = language === "gu" && item.nameGu ? item.nameEn : item.nameGu;
  const isSoldOut = !item.available;

  // Second line logic:
  // 1. One-line description if item has one
  // 2. Otherwise other-language name if showBothLanguages is ON
  const secondLine =
    (language === "gu" && item.descriptionGu ? item.descriptionGu : item.description) ||
    (showBothLanguages ? altName : null);

  const isTall = rowHeight && rowHeight >= 54;

  return (
    <>
      <div
        className={`flex items-center gap-2 px-3 transition-colors ${
          isEven ? "bg-[#FAF7F2]" : "bg-white"
        } ${!isLast ? "border-b border-brand-cream-dark/70" : ""} ${
          isSoldOut ? "opacity-50" : ""
        }`}
        style={rowHeight ? { height: `${rowHeight}px`, minHeight: `${rowHeight}px` } : undefined}
      >
        {/* Veg Symbol */}
        <VegSymbol />

        {/* Optional Dish Photo Thumbnail (56px) */}
        {item.imageUrl && (
          <button
            type="button"
            onClick={() => setPhotoEnlarged(true)}
            className="w-11 h-11 rounded-lg overflow-hidden border border-brand-green/30 flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
            aria-label={`Enlarge photo of ${name}`}
          >
            <img
              src={item.imageUrl}
              alt={item.nameEn}
              className="w-full h-full object-cover"
            />
          </button>
        )}

        {/* Item Names & Stamp Badge */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`font-semibold leading-snug text-brand-text ${
                isTall ? "text-[14px]" : "text-xs"
              } ${isSoldOut ? "line-through text-brand-muted" : ""}`}
            >
              {name}
            </span>
            {item.badge && <StampBadge type={item.badge} />}
          </div>

          {secondLine && (
            <p className="text-[10px] text-brand-muted/90 leading-tight mt-0.5 truncate">
              {secondLine}
            </p>
          )}
        </div>

        {/* Dotted leader */}
        <div
          className="flex-1 min-w-[12px] max-w-[48px] border-b border-dotted border-brand-muted/40 mb-1"
          aria-hidden="true"
        />

        {/* Price */}
        <span
          className={`font-bold font-sans flex-shrink-0 text-right min-w-[44px] ${
            isTall ? "text-sm" : "text-xs"
          } ${isSoldOut ? "line-through text-brand-muted" : "text-brand-maroon"}`}
        >
          ₹ {item.price}
        </span>

        {isSoldOut && (
          <span className="text-[9px] bg-red-100 text-red-700 px-1 py-0.5 rounded font-medium ml-0.5">
            Sold
          </span>
        )}
      </div>

      {/* Photo Enlarge Modal Dialog */}
      {photoEnlarged && item.imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPhotoEnlarged(false)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-xs w-full overflow-hidden shadow-2xl p-3 border-2 border-brand-green"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPhotoEnlarged(false)}
              className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
              aria-label="Close photo"
            >
              <X size={16} />
            </button>
            <img
              src={item.imageUrl}
              alt={item.nameEn}
              className="w-full h-48 object-cover rounded-xl"
            />
            <div className="mt-2 text-center">
              <h4 className="font-serif font-bold text-sm text-brand-green">
                {name}
              </h4>
              <p className="text-xs text-brand-maroon font-bold mt-0.5">
                ₹ {item.price}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
