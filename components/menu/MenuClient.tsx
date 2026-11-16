"use client";

import { useState, useCallback, useEffect } from "react";
import Header from "./Header";
import ItemPages from "./ItemPages";
import CoverScreen from "./CoverScreen";
import SearchOverlay from "./SearchOverlay";
import InfoSheet from "./InfoSheet";
import CategorySheet from "./CategorySheet";
import CategoryDrawer from "./CategoryDrawer";
import { Category, Restaurant } from "@/types/menu";

type Props = {
  restaurant: Restaurant | null;
  categories: Category[];
  initialLanguage?: "en" | "gu";
  initialCategorySlug?: string;
};

export default function MenuClient({
  restaurant,
  categories,
  initialLanguage = "en",
  initialCategorySlug,
}: Props) {
  const [hasOpenedCover, setHasOpenedCover] = useState(false);
  const initialIdx = initialCategorySlug
    ? categories.findIndex((c) => c.slug === initialCategorySlug)
    : 0;
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(
    initialIdx !== -1 ? initialIdx : 0
  );
  const [language, setLanguage] = useState<"en" | "gu">(initialLanguage);
  const [searchOpen, setSearchOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sync language with localStorage and cookie
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("jd_lang");
      if (savedLang === "en" || savedLang === "gu") {
        setLanguage(savedLang);
      }
    } catch {}
  }, []);

  const activeCategory = categories[activeCategoryIndex];

  // Client beacon for views, QR scans, and category views (Section 10.5)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const src = urlParams.get("src") || undefined;
      fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src, category: activeCategory?.slug }),
      }).catch(() => {});
    } catch {}
  }, [activeCategory?.slug]);

  const handleLanguageChange = useCallback((nextLang: "en" | "gu") => {
    setLanguage(nextLang);
    try {
      localStorage.setItem("jd_lang", nextLang);
      document.cookie = `lang=${nextLang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}

    const slug = categories[activeCategoryIndex]?.slug || "";
    const targetUrl = nextLang === "gu" ? `/gu/menu/${slug}` : `/menu/${slug}`;
    window.location.href = targetUrl;
  }, [categories, activeCategoryIndex]);

  const handleSelectCategory = useCallback((idx: number) => {
    setActiveCategoryIndex(idx);
  }, []);

  return (
    <div className="min-h-screen bg-[#2A060A] flex items-center justify-center sm:p-4 select-none">
      {/* Centered Mobile Column - Max 430px, Fixed-Height 100dvh */}
      <div
        className="relative w-full max-w-[430px] overflow-hidden flex flex-col bg-brand-maroon-binder shadow-2xl rounded-none sm:rounded-2xl"
        style={{
          height: "100dvh",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        {/* Leather Binder Frame with 4 Gold Metal Corner Caps */}
        <div className="absolute inset-0 pointer-events-none z-30 border-[6px] border-brand-maroon-binder sm:rounded-2xl">
          {/* Stitched seam line inside frame */}
          <div className="absolute inset-0.5 border border-dashed border-brand-gold/30 rounded-lg pointer-events-none" />

          {/* Antique Gold Metal Corner Caps */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-gold bg-brand-gold/20 rounded-tl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-gold bg-brand-gold/20 rounded-tr" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-gold bg-brand-gold/20 rounded-bl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-gold bg-brand-gold/20 rounded-br" />
        </div>

        {/* Cover Screen */}
        {!hasOpenedCover && (
          <CoverScreen
            restaurantName={restaurant?.name}
            tagline={restaurant?.tagline || undefined}
            address={restaurant?.address || undefined}
            phone={restaurant?.phone || restaurant?.mobile || undefined}
            onOpen={() => setHasOpenedCover(true)}
          />
        )}

        {/* Laminated Menu Content Sheet */}
        <div className="relative flex-1 flex flex-col m-1.5 sm:m-2 bg-brand-cream rounded-lg overflow-hidden border border-brand-green/30">
          {/* Two-Row Header (Row 1: Menu Drawer, Brand, Top-Right Lang Switch/Search/Info; Row 2: Short Tabs & Pinned "All") */}
          <Header
            categories={categories}
            activeCategoryIndex={activeCategoryIndex}
            onCategoryChange={handleSelectCategory}
            language={language}
            onLanguageChange={handleLanguageChange}
            onOpenSearch={() => setSearchOpen(true)}
            onOpenInfo={() => setInfoOpen(true)}
            onOpenDrawer={() => setDrawerOpen(true)}
            onOpenAll={() => setCategorySheetOpen(true)}
            restaurantName={restaurant?.name}
          />

          {/* Main Content Area: Item Pages (1 category at a time, swipeable pages, zero vertical scroll) */}
          <main className="flex-1 overflow-hidden relative">
            {activeCategory && (
              <ItemPages
                category={activeCategory}
                language={language}
                onNextCategory={() => {
                  if (activeCategoryIndex < categories.length - 1) {
                    setActiveCategoryIndex(activeCategoryIndex + 1);
                  }
                }}
                onPrevCategory={() => {
                  if (activeCategoryIndex > 0) {
                    setActiveCategoryIndex(activeCategoryIndex - 1);
                  }
                }}
                isFirstCategory={activeCategoryIndex === 0}
                isLastCategory={activeCategoryIndex === categories.length - 1}
                showBothLanguages={restaurant?.showBothLanguages}
              />
            )}
          </main>
        </div>

        {/* Modal Overlays & Drawers */}
        {drawerOpen && (
          <CategoryDrawer
            categories={categories}
            activeCategoryIndex={activeCategoryIndex}
            restaurant={restaurant}
            language={language}
            onSelectCategory={handleSelectCategory}
            onClose={() => setDrawerOpen(false)}
          />
        )}

        {categorySheetOpen && (
          <CategorySheet
            categories={categories}
            activeCategoryIndex={activeCategoryIndex}
            language={language}
            onSelectCategory={handleSelectCategory}
            onClose={() => setCategorySheetOpen(false)}
          />
        )}

        {searchOpen && (
          <SearchOverlay
            categories={categories}
            language={language}
            onClose={() => setSearchOpen(false)}
          />
        )}

        {infoOpen && (
          <InfoSheet
            restaurant={restaurant}
            language={language}
            onClose={() => setInfoOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
