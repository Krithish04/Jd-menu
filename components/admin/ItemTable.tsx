"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Eye, EyeOff, AlertCircle, Search, X } from "lucide-react";
import { VegSymbol } from "../menu/Badges";

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
  nameEn: string;
  nameGu: string | null;
  items: Item[];
};

type ItemWithCategory = Item & { categoryNameEn?: string };

type Props = {
  category: Category;
  allCategories?: Category[];
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onSelectCategory?: (id: string) => void;
  onRefresh: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
};

type InlineEdit = { id: string; field: "nameEn" | "price" | "nameGu"; value: string } | null;

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-amber-200 text-brand-text rounded-xs px-0.5 font-bold"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function ItemTable({
  category,
  allCategories,
  searchQuery = "",
  onSearchChange,
  onSelectCategory,
  onRefresh,
  showToast,
}: Props) {
  const [inlineEdit, setInlineEdit] = useState<InlineEdit>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [searchScope, setSearchScope] = useState<"all" | "category">("all");
  const [newItem, setNewItem] = useState({
    nameEn: "",
    nameGu: "",
    price: "",
    badge: "",
    imageUrl: "",
  });
  const [deletedItem, setDeletedItem] = useState<Item | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSearching = searchQuery.trim().length > 0;
  const q = searchQuery.toLowerCase().trim();

  const itemsInCurrentCategory: ItemWithCategory[] = (category?.items ?? []).map((i) => ({
    ...i,
    categoryNameEn: category.nameEn,
  }));

  const itemsInAllCategories: ItemWithCategory[] = (allCategories ?? [category]).flatMap((c) =>
    (c.items ?? []).map((i) => ({
      ...i,
      categoryNameEn: c.nameEn,
    }))
  );

  const matchItem = (item: ItemWithCategory) =>
    item.nameEn.toLowerCase().includes(q) ||
    (item.nameGu && item.nameGu.toLowerCase().includes(q)) ||
    (item.description && item.description.toLowerCase().includes(q)) ||
    String(item.price).includes(q) ||
    (item.categoryNameEn && item.categoryNameEn.toLowerCase().includes(q));

  const matchesCurrent = itemsInCurrentCategory.filter(matchItem);
  const matchesAll = itemsInAllCategories.filter(matchItem);

  const displayItems = isSearching
    ? (searchScope === "all" ? matchesAll : matchesCurrent).filter(
        (i) => i.id !== deletedItem?.id
      )
    : itemsInCurrentCategory.filter((i) => i.id !== deletedItem?.id);

  const saveInlineEdit = async () => {
    if (!inlineEdit) return;
    const patch: Record<string, string | number> = {};
    if (inlineEdit.field === "price") {
      const p = parseInt(inlineEdit.value);
      if (isNaN(p)) return setInlineEdit(null);
      patch.price = p;
    } else {
      patch[inlineEdit.field] = inlineEdit.value;
    }
    const res = await fetch(`/api/admin/items/${inlineEdit.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      showToast("Saved");
      onRefresh();
    } else {
      showToast("Failed to save", "error");
    }
    setInlineEdit(null);
  };

  const handleAddItem = async () => {
    if (!newItem.nameEn.trim() || !newItem.price) return;
    const res = await fetch("/api/admin/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: category.id,
        nameEn: newItem.nameEn.trim(),
        nameGu: newItem.nameGu.trim() || null,
        price: parseInt(newItem.price),
        badge: newItem.badge || null,
        imageUrl: newItem.imageUrl.trim() || null,
        available: true,
        visible: true,
      }),
    });
    if (res.ok) {
      showToast("Item added");
      setNewItem({ nameEn: "", nameGu: "", price: "", badge: "", imageUrl: "" });
      setAddingNew(false);
      onRefresh();
    } else {
      showToast("Failed to add item", "error");
    }
  };

  const updateBadge = async (item: Item, newBadge: string | null) => {
    const res = await fetch(`/api/admin/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ badge: newBadge }),
    });
    if (res.ok) {
      showToast("Badge updated");
      onRefresh();
    } else {
      showToast("Failed to update badge", "error");
    }
  };

  const handleDelete = async (item: Item) => {
    setDeletedItem(item);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(async () => {
      await fetch(`/api/admin/items/${item.id}`, { method: "DELETE" });
      showToast("Item deleted");
      setDeletedItem(null);
      onRefresh();
    }, 10000);
  };

  const handleUndo = () => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setDeletedItem(null);
    showToast("Delete undone");
  };

  const toggleAvailable = async (item: Item) => {
    const res = await fetch(`/api/admin/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !item.available }),
    });
    if (res.ok) {
      showToast(`Item marked ${item.available ? "sold out" : "available"}`);
      onRefresh();
    } else showToast("Failed", "error");
  };

  const toggleVisible = async (item: Item) => {
    const res = await fetch(`/api/admin/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !item.visible }),
    });
    if (res.ok) {
      showToast(`Item ${item.visible ? "hidden" : "shown"}`);
      onRefresh();
    } else showToast("Failed", "error");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Category / Search Sub-header */}
      <div className="bg-brand-green/10 border-b border-brand-green/20 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
        {isSearching ? (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-brand-green font-bold text-xs">
              <Search size={14} />
              <span>Search results for &ldquo;{searchQuery}&rdquo;</span>
              <span className="bg-brand-green text-white text-[10px] px-1.5 py-0.2 rounded-full font-sans">
                {displayItems.length}
              </span>
            </div>

            {/* Scope tabs */}
            <div className="flex items-center bg-white rounded-md p-0.5 border border-brand-green/30 text-xs">
              <button
                onClick={() => setSearchScope("all")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  searchScope === "all"
                    ? "bg-brand-green text-white shadow-2xs font-semibold"
                    : "text-brand-muted hover:text-brand-text"
                }`}
              >
                All Menu ({matchesAll.length})
              </button>
              <button
                onClick={() => setSearchScope("category")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  searchScope === "category"
                    ? "bg-brand-green text-white shadow-2xs font-semibold"
                    : "text-brand-muted hover:text-brand-text"
                }`}
              >
                In {category.nameEn} ({matchesCurrent.length})
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="font-serif font-bold text-sm text-brand-green">
              {category.nameEn} ({displayItems.length} dishes)
            </h2>
            {category.nameGu && (
              <p className="text-xs text-brand-muted">{category.nameGu}</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          {isSearching ? (
            <button
              onClick={() => onSearchChange?.("")}
              className="flex items-center gap-1 text-xs text-brand-maroon hover:underline font-semibold"
            >
              <X size={13} />
              Clear search
            </button>
          ) : (
            <button
              onClick={() => setAddingNew(true)}
              className="flex items-center gap-1.5 bg-brand-green text-white rounded px-3 py-1.5 text-xs font-semibold hover:bg-brand-green-hover shadow-xs"
            >
              <Plus size={14} />
              Add Dish
            </button>
          )}
        </div>
      </div>

      {/* Undo banner */}
      {deletedItem && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between text-xs">
          <span className="text-amber-800">
            <AlertCircle size={14} className="inline mr-1" />
            Deleting &ldquo;{deletedItem.nameEn}&rdquo;...
          </span>
          <button
            onClick={handleUndo}
            className="text-brand-green font-bold hover:underline"
          >
            Undo (10s)
          </button>
        </div>
      )}

      {/* Table Area */}
      <div className="flex-1 overflow-auto">
        {displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-brand-cream flex items-center justify-center text-brand-muted mb-3">
              <Search size={22} />
            </div>
            <p className="text-sm font-semibold text-brand-text">
              {isSearching
                ? `No dishes match "${searchQuery}"`
                : "No dishes in this category yet"}
            </p>
            <p className="text-xs text-brand-muted mt-1 max-w-sm">
              {isSearching
                ? searchScope === "category"
                  ? `None found in ${category.nameEn}. Try searching across "All Menu" or try different keywords.`
                  : "Try searching by English name, Gujarati name, or dish price."
                : "Click 'Add Dish' above to create the first dish."}
            </p>
            {isSearching && (
              <div className="flex gap-2 mt-4">
                {searchScope === "category" && matchesAll.length > 0 && (
                  <button
                    onClick={() => setSearchScope("all")}
                    className="px-3 py-1 rounded bg-brand-green text-white text-xs font-semibold"
                  >
                    Search All Menu ({matchesAll.length})
                  </button>
                )}
                <button
                  onClick={() => onSearchChange?.("")}
                  className="px-3 py-1 rounded border border-brand-green/30 text-brand-green text-xs font-semibold hover:bg-brand-green/10"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto min-w-full">
            <table className="w-full min-w-[700px] text-xs border-collapse">
            <thead className="sticky top-0 bg-white border-b-2 border-brand-cream-dark shadow-2xs z-10">
              <tr>
                <th className="text-left px-5 py-2.5 font-bold text-brand-muted uppercase">
                  Dish Name (EN)
                </th>
                {isSearching && searchScope === "all" && (
                  <th className="text-left px-3 py-2.5 font-bold text-brand-muted uppercase">
                    Category
                  </th>
                )}
                <th className="text-left px-3 py-2.5 font-bold text-brand-muted uppercase">
                  Gujarati Name (GU)
                </th>
                <th className="text-right px-3 py-2.5 font-bold text-brand-muted uppercase">
                  Price (₹)
                </th>
                <th className="text-center px-3 py-2.5 font-bold text-brand-muted uppercase">
                  Badge
                </th>
                <th className="text-center px-3 py-2.5 font-bold text-brand-muted uppercase">
                  Available
                </th>
                <th className="text-center px-3 py-2.5 font-bold text-brand-muted uppercase">
                  Visible
                </th>
                <th className="text-center px-5 py-2.5 font-bold text-brand-muted uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Add new row (only when in category mode) */}
              {!isSearching && addingNew && (
                <tr className="bg-brand-green/10 border-b border-brand-green/30">
                  <td className="px-5 py-2">
                    <input
                      autoFocus
                      className="w-full border border-brand-green/40 rounded px-2 py-1 text-xs focus:outline-none focus:border-brand-green bg-white"
                      placeholder="Dish name (English)"
                      value={newItem.nameEn}
                      onChange={(e) =>
                        setNewItem({ ...newItem, nameEn: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="w-full border border-brand-green/40 rounded px-2 py-1 text-xs focus:outline-none focus:border-brand-green bg-white"
                      placeholder="ગુજરાતી નામ"
                      value={newItem.nameGu}
                      onChange={(e) =>
                        setNewItem({ ...newItem, nameGu: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-20 border border-brand-green/40 rounded px-2 py-1 text-xs text-right focus:outline-none focus:border-brand-green bg-white"
                      placeholder="₹ Price"
                      value={newItem.price}
                      onChange={(e) =>
                        setNewItem({ ...newItem, price: e.target.value })
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <select
                      className="border border-brand-green/40 rounded px-1.5 py-1 text-[11px] bg-white"
                      value={newItem.badge}
                      onChange={(e) =>
                        setNewItem({ ...newItem, badge: e.target.value })
                      }
                    >
                      <option value="">None</option>
                      <option value="SPECIAL">Chef Special</option>
                      <option value="POPULAR">Popular</option>
                      <option value="NEW">New</option>
                    </select>
                  </td>
                  <td colSpan={3} className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddItem}
                        className="bg-brand-green text-white rounded px-3 py-1 font-bold text-xs shadow-xs"
                      >
                        Save Dish
                      </button>
                      <button
                        onClick={() => setAddingNew(false)}
                        className="border border-brand-green/40 rounded px-3 py-1 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {displayItems.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-brand-cream-dark hover:bg-brand-cream/60 group ${
                    !item.visible ? "opacity-40" : ""
                  }`}
                >
                  {/* Name EN */}
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <VegSymbol />
                      {inlineEdit?.id === item.id && inlineEdit.field === "nameEn" ? (
                        <input
                          autoFocus
                          className="w-full border border-brand-green/40 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-brand-green bg-white"
                          value={inlineEdit.value}
                          onChange={(e) =>
                            setInlineEdit({ ...inlineEdit, value: e.target.value })
                          }
                          onBlur={saveInlineEdit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveInlineEdit();
                            if (e.key === "Escape") setInlineEdit(null);
                          }}
                        />
                      ) : (
                        <span
                          className="cursor-pointer font-medium hover:text-brand-green truncate"
                          onClick={() =>
                            setInlineEdit({
                              id: item.id,
                              field: "nameEn",
                              value: item.nameEn,
                            })
                          }
                          title="Click to edit name"
                        >
                          {isSearching
                            ? highlightMatch(item.nameEn, searchQuery)
                            : item.nameEn}
                          {!item.available && (
                            <span className="ml-1.5 text-[10px] text-red-600 font-normal">
                              (sold out)
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Category Pill (when searching across all categories) */}
                  {isSearching && searchScope === "all" && (
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => {
                          onSelectCategory?.(item.categoryId);
                          setSearchScope("category");
                        }}
                        className="text-[10px] font-semibold bg-brand-green/10 text-brand-green hover:bg-brand-green/20 px-2 py-0.5 rounded-full transition-colors whitespace-nowrap"
                        title="Jump to this category"
                      >
                        {item.categoryNameEn}
                      </button>
                    </td>
                  )}

                  {/* Name GU */}
                  <td className="px-3 py-2.5">
                    {inlineEdit?.id === item.id && inlineEdit.field === "nameGu" ? (
                      <input
                        autoFocus
                        className="w-full border border-brand-green/40 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-brand-green bg-white"
                        value={inlineEdit.value}
                        onChange={(e) =>
                          setInlineEdit({ ...inlineEdit, value: e.target.value })
                        }
                        onBlur={saveInlineEdit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveInlineEdit();
                          if (e.key === "Escape") setInlineEdit(null);
                        }}
                      />
                    ) : (
                      <span
                        className="cursor-pointer text-brand-muted hover:text-brand-green"
                        onClick={() =>
                          setInlineEdit({
                            id: item.id,
                            field: "nameGu",
                            value: item.nameGu || "",
                          })
                        }
                        title="Click to edit Gujarati name"
                      >
                        {item.nameGu || (
                          <span className="opacity-40">+ Add GU</span>
                        )}
                      </span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="px-3 py-2.5 text-right font-medium">
                    {inlineEdit?.id === item.id && inlineEdit.field === "price" ? (
                      <input
                        autoFocus
                        type="number"
                        className="w-20 border border-brand-green/40 rounded px-2 py-0.5 text-xs text-right focus:outline-none focus:border-brand-green bg-white"
                        value={inlineEdit.value}
                        onChange={(e) =>
                          setInlineEdit({ ...inlineEdit, value: e.target.value })
                        }
                        onBlur={saveInlineEdit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveInlineEdit();
                          if (e.key === "Escape") setInlineEdit(null);
                        }}
                      />
                    ) : (
                      <span
                        className="text-brand-maroon font-bold cursor-pointer hover:underline"
                        onClick={() =>
                          setInlineEdit({
                            id: item.id,
                            field: "price",
                            value: String(item.price),
                          })
                        }
                        title="Click to edit price"
                      >
                        ₹ {item.price}
                      </span>
                    )}
                  </td>

                  {/* Stamp Badge */}
                  <td className="px-3 py-2.5 text-center">
                    <select
                      className="border border-brand-cream-dark text-[10px] rounded px-1 py-0.5 bg-white text-brand-text"
                      value={item.badge || ""}
                      onChange={(e) => updateBadge(item, e.target.value || null)}
                    >
                      <option value="">None</option>
                      <option value="SPECIAL">Chef's Special</option>
                      <option value="POPULAR">Popular</option>
                      <option value="NEW">New</option>
                    </select>
                  </td>

                  {/* Available Toggle */}
                  <td className="px-3 py-2.5 text-center">
                    <button
                      onClick={() => toggleAvailable(item)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                        item.available
                          ? "border-emerald-600/40 text-emerald-700 bg-emerald-50"
                          : "border-red-400 text-red-700 bg-red-50"
                      }`}
                    >
                      {item.available ? "Available" : "Sold out"}
                    </button>
                  </td>

                  {/* Visible Toggle */}
                  <td className="px-3 py-2.5 text-center">
                    <button
                      onClick={() => toggleVisible(item)}
                      className="p-1 hover:bg-brand-green/10 rounded"
                      title={item.visible ? "Hide dish" : "Show dish"}
                    >
                      {item.visible ? (
                        <Eye size={14} className="text-brand-green" />
                      ) : (
                        <EyeOff size={14} className="text-brand-muted" />
                      )}
                    </button>
                  </td>

                  {/* Delete */}
                  <td className="px-5 py-2.5 text-center">
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete dish"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
