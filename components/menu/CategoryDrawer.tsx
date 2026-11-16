"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronRight, Phone, MapPin, ShieldCheck } from "lucide-react";
import { Category, Restaurant } from "@/types/menu";

type Props = {
  categories: Category[];
  activeCategoryIndex: number;
  restaurant: Restaurant | null;
  language: "en" | "gu";
  onSelectCategory: (index: number) => void;
  onClose: () => void;
};

export default function CategoryDrawer({
  categories,
  activeCategoryIndex,
  restaurant,
  language,
  onSelectCategory,
  onClose,
}: Props) {
  const isGu = language === "gu";
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Group categories in order of appearance
  const groups: { name: string; items: { category: Category; globalIndex: number }[] }[] = [];
  categories.forEach((cat, idx) => {
    const groupName = isGu ? cat.groupGu || cat.groupEn || "અન્ય" : cat.groupEn || "Other";
    let grp = groups.find((g) => g.name === groupName);
    if (!grp) {
      grp = { name: groupName, items: [] };
      groups.push(grp);
    }
    grp.items.push({ category: cat, globalIndex: idx });
  });

  // Default open group is the one containing active category
  const activeCat = categories[activeCategoryIndex];
  const activeGroupName = isGu
    ? activeCat?.groupGu || activeCat?.groupEn || "અન્ય"
    : activeCat?.groupEn || "Other";

  const [openGroupName, setOpenGroupName] = useState<string>(
    groups.some((g) => g.name === activeGroupName) ? activeGroupName : groups[0]?.name || ""
  );

  // Swipe left to close
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 50) {
      onClose();
    }
    touchStartX.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isGu ? "મેનુ નેવિગેશન" : "Menu Navigation"}
      className="absolute inset-0 z-50 bg-black/60 flex select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-[82%] max-w-[340px] h-full bg-[#FAF3ED] flex flex-col shadow-2xl border-r-2 border-brand-green overflow-hidden animate-slideInLeft"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drawer Header Ribbon */}
        <div className="bg-brand-green text-white px-4 py-3 flex items-center justify-between border-b border-brand-green-dark shadow-xs flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border border-brand-gold bg-[#4A0A12] flex items-center justify-center">
              <span className="font-serif text-[10px] font-bold text-brand-gold">JD</span>
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm leading-tight text-white">
                {restaurant?.name || "JD Restaurant"}
              </h2>
              <p className="text-[9px] text-brand-gold font-sans uppercase tracking-widest">
                {isGu ? "શુદ્ધ શાકાહારી" : "Pure Veg."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-white/10 rounded-full"
            aria-label="Close menu drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Collapsible Groups List (Accordion - Only 1 group open at a time) */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5" style={{ scrollbarWidth: "thin" }}>
          {groups.map((group) => {
            const isOpen = openGroupName === group.name;

            return (
              <div
                key={group.name}
                className="rounded-lg border border-brand-green/20 overflow-hidden bg-white shadow-xs"
              >
                {/* Group Accordion Header */}
                <button
                  type="button"
                  onClick={() => setOpenGroupName(isOpen ? "" : group.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-colors ${
                    isOpen
                      ? "bg-brand-green/10 text-brand-green border-b border-brand-green/20"
                      : "bg-white text-brand-text hover:bg-brand-cream/50"
                  }`}
                  style={{ minHeight: "38px" }}
                >
                  <span className="truncate">{group.name}</span>
                  <div className="flex items-center gap-1.5 text-brand-green">
                    <span className="text-[10px] font-sans font-medium text-brand-muted">
                      ({group.items.length})
                    </span>
                    {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </div>
                </button>

                {/* Sub-items (Full Category Names) */}
                {isOpen && (
                  <div className="divide-y divide-brand-cream-dark/50 bg-[#FAF7F2]">
                    {group.items.map(({ category, globalIndex }) => {
                      const isActive = globalIndex === activeCategoryIndex;
                      const fullName = isGu && category.nameGu ? category.nameGu : category.nameEn;
                      const count = category.items?.length ?? category._count?.items ?? 0;
                      const href = isGu ? `/gu/menu/${category.slug}` : `/menu/${category.slug}`;

                      return (
                        <Link
                          key={category.id}
                          href={href}
                          onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState(null, "", href);
                            onSelectCategory(globalIndex);
                            onClose();
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                            isActive
                              ? "bg-brand-green text-white font-bold"
                              : "text-brand-text hover:bg-brand-green/5 font-medium"
                          }`}
                          style={{ minHeight: "36px" }}
                        >
                          <span className="truncate mr-2">{fullName}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans flex-shrink-0 ${
                              isActive
                                ? "bg-white/20 text-brand-gold"
                                : "bg-brand-cream text-brand-muted"
                            }`}
                          >
                            {count}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer: Pure Milk Banner, Address & Tap-to-Call */}
        <div className="flex-shrink-0 bg-white border-t border-brand-green/20 p-2.5 text-[11px] text-brand-text space-y-2">
          {/* Pure Milk Paneer / FSSAI line */}
          <div className="flex items-start gap-1.5 bg-emerald-50 p-2 rounded border border-emerald-200">
            <ShieldCheck size={14} className="text-brand-green flex-shrink-0 mt-0.5" />
            <span className="text-[10px] text-emerald-900 leading-snug">
              {isGu
                ? "અમે શુદ્ધ દૂધનું પનીર અને FSSAI માન્ય સામગ્રી વાપરીએ છીએ."
                : "We use pure milk paneer and FSSAI approved ingredients."}
            </span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 text-brand-muted">
            <MapPin size={13} className="text-brand-green flex-shrink-0 mt-0.5" />
            <span className="text-[10px] leading-tight">
              {restaurant?.address || "Mini Bazar, Varachha Road, Surat"}
            </span>
          </div>

          {/* Tap-to-call Phone Numbers */}
          <div className="flex items-center gap-2 pt-0.5">
            <a
              href="tel:02612556649"
              className="flex-1 flex items-center justify-center gap-1 bg-brand-green text-white py-1.5 px-2 rounded text-[11px] font-bold hover:bg-brand-green-dark active:scale-95 transition-all"
            >
              <Phone size={12} />
              <span>0261-2556649</span>
            </a>
            <a
              href="tel:9429165549"
              className="flex-1 flex items-center justify-center gap-1 bg-brand-green text-white py-1.5 px-2 rounded text-[11px] font-bold hover:bg-brand-green-dark active:scale-95 transition-all"
            >
              <Phone size={12} />
              <span>94291 65549</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
