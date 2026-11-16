"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import CategoryList from "./CategoryList";
import ItemTable from "./ItemTable";
import { Smartphone, RefreshCw, Search, X } from "lucide-react";

type Item = {
  id: string;
  nameEn: string;
  nameGu: string | null;
  description: string | null;
  descriptionGu?: string | null;
  price: number;
  imageUrl?: string | null;
  badge?: string | null;
  isVeg?: boolean;
  sort: number;
  available: boolean;
  visible: boolean;
  categoryId: string;
};

type Category = {
  id: string;
  slug: string;
  nameEn: string;
  nameGu: string | null;
  shortNameEn?: string | null;
  shortNameGu?: string | null;
  groupEn?: string | null;
  groupGu?: string | null;
  note: string | null;
  kind: string;
  iconKey?: string | null;
  sort: number;
  visible: boolean;
  items: Item[];
  _count: { items: number };
};

type Props = {
  initialCategories: Category[];
};

export default function AdminMenuClient({ initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategories[0]?.id ?? null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "k") || (e.key === "/" && document.activeElement?.tagName !== "INPUT")) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        setSearchQuery("");
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const refreshCategories = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
      setPreviewKey((k) => k + 1); // Refresh iframe
    }
  }, []);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) ?? null;

  return (
    <div className="flex h-screen relative bg-brand-cream overflow-hidden">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-4 py-2.5 rounded-lg text-xs font-semibold text-white shadow-xl ${
            toast.type === "success" ? "bg-brand-green" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Left pane - Categories */}
      <div className="w-64 border-r border-brand-green/20 flex flex-col bg-white overflow-hidden shadow-xs flex-shrink-0">
        <div className="bg-brand-green text-white px-4 py-3 flex items-center justify-between">
          <h2 className="font-serif font-bold text-xs tracking-wider uppercase">
            Categories ({categories.length})
          </h2>
        </div>
        <CategoryList
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={(id) => {
            setSelectedCategoryId(id);
          }}
          onRefresh={refreshCategories}
          showToast={showToast}
        />
      </div>

      {/* Middle pane - Item Table */}
      <div className="flex-1 flex flex-col overflow-hidden bg-brand-cream/40">
        {/* Top Control Bar with Global Item Search */}
        <div className="bg-white border-b border-brand-green/20 px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="text-xs text-brand-muted flex items-center gap-2 flex-shrink-0">
            <span>Managing:</span>
            <span className="font-bold text-brand-text">
              {selectedCategory?.nameEn || "Select category"}
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes by name (EN/GU), price, or category... (Ctrl+K)"
              className="w-full bg-brand-cream/40 border border-brand-green/20 rounded-full pl-8 pr-8 py-1.5 text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-green focus:bg-white transition-all shadow-2xs"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-black/10 text-brand-muted transition-colors"
                title="Clear search (Esc)"
              >
                <X size={12} />
              </button>
            ) : (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-brand-muted/60 font-mono border border-brand-muted/20 rounded px-1">
                /
              </span>
            )}
          </div>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all border flex-shrink-0 ${
              showPreview
                ? "bg-brand-green text-white border-brand-green"
                : "bg-white text-brand-green border-brand-green/40 hover:bg-brand-green/10"
            }`}
          >
            <Smartphone size={14} />
            <span>{showPreview ? "Hide Phone Preview" : "Live Phone Preview"}</span>
          </button>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-auto">
          {selectedCategory ? (
            <ItemTable
              category={selectedCategory}
              allCategories={categories}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectCategory={setSelectedCategoryId}
              onRefresh={refreshCategories}
              showToast={showToast}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-brand-muted text-sm">
              Select a category from the left panel
            </div>
          )}
        </div>
      </div>

      {/* Right pane - Phone Live Preview Frame */}
      {showPreview && (
        <div className="w-[430px] border-l-2 border-brand-gold/40 bg-brand-maroon-binder p-4 flex flex-col items-center justify-between flex-shrink-0 shadow-2xl">
          <div className="flex items-center justify-between w-full text-brand-gold text-xs pb-2 border-b border-brand-gold/20">
            <span className="font-serif font-bold">Live Customer View</span>
            <button
              onClick={() => setPreviewKey((k) => k + 1)}
              className="p-1 hover:text-white rounded"
              title="Reload preview"
            >
              <RefreshCw size={13} />
            </button>
          </div>

          {/* Phone Frame */}
          <div className="w-full flex-1 mt-2 rounded-xl overflow-hidden border-2 border-brand-gold/50 shadow-inner bg-black">
            <iframe
              key={previewKey}
              src="/menu"
              className="w-full h-full border-0"
              title="Customer Menu Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
