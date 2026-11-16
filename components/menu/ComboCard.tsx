"use client";

import React from "react";
import { Check } from "lucide-react";
import { VegSymbol } from "./Badges";
import { Item } from "@/types/menu";

type Props = {
  item: Item;
  language: "en" | "gu";
};

export default function ComboCard({ item, language }: Props) {
  const isGujarati =
    item.nameEn.toLowerCase().includes("gujarati") ||
    (item.nameGu && item.nameGu.includes("ગુજરાતી"));
  const name = language === "gu" && item.nameGu ? item.nameGu : item.nameEn;
  const descriptionText =
    language === "gu" && item.descriptionGu ? item.descriptionGu : item.description;
  const dishes = descriptionText
    ? descriptionText
        .split(/[,/]/)
        .map((d) => d.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="relative border-2 border-brand-green/40 rounded-xl bg-white overflow-hidden shadow-sm my-2 select-none">
      {/* Ticket header ribbon */}
      <div className="bg-brand-green text-white px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <VegSymbol />
          <h3 className="font-serif font-bold text-xs tracking-wide">{name}</h3>
        </div>
        <span className="font-bold text-xs bg-white text-brand-maroon px-2 py-0.5 rounded shadow-xs">
          ₹ {item.price}
        </span>
      </div>

      {/* Perforated ticket edge line */}
      <div className="relative border-b-2 border-dashed border-brand-green/30 my-0.5">
        <div className="absolute -left-2 -top-1.5 w-3 h-3 bg-brand-cream rounded-full border-r border-brand-green/40" />
        <div className="absolute -right-2 -top-1.5 w-3 h-3 bg-brand-cream rounded-full border-l border-brand-green/40" />
      </div>

      {/* Dishes content */}
      <div className="p-3 bg-gradient-to-b from-white to-brand-cream/30">
        {isGujarati && (
          <div className="flex items-center justify-center my-1 opacity-80">
            {/* Thali plate illustration */}
            <svg width="46" height="46" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#1B6B3A" strokeWidth="1.5" />
              <circle
                cx="11"
                cy="11"
                r="2.5"
                stroke="#8E1B22"
                strokeWidth="1"
                fill="#8E1B22"
                fillOpacity="0.2"
              />
              <circle
                cx="21"
                cy="11"
                r="2.5"
                stroke="#8E1B22"
                strokeWidth="1"
                fill="#8E1B22"
                fillOpacity="0.2"
              />
              <circle
                cx="8.5"
                cy="18"
                r="2.5"
                stroke="#8E1B22"
                strokeWidth="1"
                fill="#8E1B22"
                fillOpacity="0.2"
              />
              <circle
                cx="23.5"
                cy="18"
                r="2.5"
                stroke="#8E1B22"
                strokeWidth="1"
                fill="#8E1B22"
                fillOpacity="0.2"
              />
              <circle
                cx="16"
                cy="22"
                r="2.5"
                stroke="#8E1B22"
                strokeWidth="1"
                fill="#8E1B22"
                fillOpacity="0.2"
              />
              <circle
                cx="16"
                cy="15"
                r="3"
                stroke="#1B6B3A"
                strokeWidth="1"
                fill="#1B6B3A"
                fillOpacity="0.1"
              />
            </svg>
          </div>
        )}

        <div className="grid grid-cols-1 gap-1 text-[11px] text-brand-text">
          {dishes.map((dish, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-brand-green mt-0.5">
                <Check size={11} strokeWidth={2.5} />
              </span>
              <span className="leading-tight">{dish}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
