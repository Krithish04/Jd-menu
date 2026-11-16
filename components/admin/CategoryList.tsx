"use client";

import { useState } from "react";
import { Eye, EyeOff, Plus, Trash2, Edit2, Check, X } from "lucide-react";

type Category = {
  id: string;
  slug: string;
  nameEn: string;
  nameGu: string | null;
  shortNameEn?: string | null;
  shortNameGu?: string | null;
  groupEn?: string | null;
  groupGu?: string | null;
  kind: string;
  sort: number;
  visible: boolean;
  _count: { items: number };
};

type Props = {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRefresh: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
};

export default function CategoryList({
  categories,
  selectedId,
  onSelect,
  onRefresh,
  showToast,
}: Props) {
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNameGu, setNewNameGu] = useState("");
  const [newShort, setNewShort] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editNameEn, setEditNameEn] = useState("");
  const [editNameGu, setEditNameGu] = useState("");
  const [editShortEn, setEditShortEn] = useState("");
  const [editGroupEn, setEditGroupEn] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editNoteGu, setEditNoteGu] = useState("");

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const slug =
      newSlug.trim() ||
      newName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        nameEn: newName.trim(),
        nameGu: newNameGu.trim() || null,
        shortNameEn: newShort.trim() || newName.trim(),
        groupEn: newGroup.trim() || "Main Course",
        visible: true,
      }),
    });

    if (res.ok) {
      showToast("Category added");
      setAddingNew(false);
      setNewName("");
      setNewNameGu("");
      setNewShort("");
      setNewGroup("");
      setNewSlug("");
      onRefresh();
    } else {
      const data = await res.json();
      showToast(data.error?.fieldErrors?.slug?.[0] || "Failed to add category", "error");
    }
  };

  const startEdit = (cat: Category & { note?: string | null; noteGu?: string | null }) => {
    setEditingCatId(cat.id);
    setEditNameEn(cat.nameEn);
    setEditNameGu(cat.nameGu || "");
    setEditShortEn(cat.shortNameEn || "");
    setEditGroupEn(cat.groupEn || "");
    setEditNote(cat.note || "");
    setEditNoteGu(cat.noteGu || "");
  };

  const saveEdit = async (id: string) => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameEn: editNameEn.trim(),
        nameGu: editNameGu.trim() || null,
        shortNameEn: editShortEn.trim() || null,
        groupEn: editGroupEn.trim() || null,
        note: editNote.trim() || null,
        noteGu: editNoteGu.trim() || null,
      }),
    });

    if (res.ok) {
      showToast("Category updated");
      setEditingCatId(null);
      onRefresh();
    } else {
      showToast("Failed to update category", "error");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}" and all its items?`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Category deleted");
      onRefresh();
    } else {
      showToast("Failed to delete category", "error");
    }
  };

  const toggleVisible = async (cat: Category) => {
    const res = await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !cat.visible }),
    });
    if (res.ok) {
      showToast(`Category ${cat.visible ? "hidden" : "shown"}`);
      onRefresh();
    } else {
      const err = await res.json().catch(() => ({}));
      showToast(typeof err.error === "string" ? err.error : "Failed to update", "error");
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {categories.map((cat) => {
        const isEditing = editingCatId === cat.id;

        return (
          <div
            key={cat.id}
            className={`border-b border-brand-cream-dark group ${
              cat.id === selectedId
                ? "bg-brand-green/10 border-l-2 border-l-brand-green"
                : "hover:bg-brand-cream"
            }`}
          >
            {isEditing ? (
              <div className="p-2 space-y-1.5 bg-brand-cream/80">
                <input
                  className="w-full border border-brand-green/40 rounded px-2 py-1 text-xs"
                  placeholder="Full name (EN)"
                  value={editNameEn}
                  onChange={(e) => setEditNameEn(e.target.value)}
                />
                <input
                  className="w-full border border-brand-green/40 rounded px-2 py-1 text-xs"
                  placeholder="Full name (GU)"
                  value={editNameGu}
                  onChange={(e) => setEditNameGu(e.target.value)}
                />
                <div className="flex gap-1.5">
                  <input
                    className="flex-1 border border-brand-green/40 rounded px-2 py-1 text-xs"
                    placeholder="Short tab name"
                    value={editShortEn}
                    onChange={(e) => setEditShortEn(e.target.value)}
                  />
                  <input
                    className="flex-1 border border-brand-green/40 rounded px-2 py-1 text-xs"
                    placeholder="Group"
                    value={editGroupEn}
                    onChange={(e) => setEditGroupEn(e.target.value)}
                  />
                </div>
                <div className="flex gap-1.5">
                  <input
                    className="flex-1 border border-brand-green/40 rounded px-2 py-1 text-xs"
                    placeholder="Page note (EN, e.g. Extra butter Rs. 5/-)"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                  />
                  <input
                    className="flex-1 border border-brand-green/40 rounded px-2 py-1 text-xs"
                    placeholder="Page note (GU)"
                    value={editNoteGu}
                    onChange={(e) => setEditNoteGu(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    onClick={() => saveEdit(cat.id)}
                    className="flex items-center gap-1 bg-brand-green text-white px-2 py-0.5 rounded text-xs"
                  >
                    <Check size={12} /> Save
                  </button>
                  <button
                    onClick={() => setEditingCatId(null)}
                    className="flex items-center gap-1 border border-brand-green/40 px-2 py-0.5 rounded text-xs"
                  >
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 px-3 py-2.5 cursor-pointer"
                onClick={() => onSelect(cat.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`text-sm font-medium truncate ${
                        !cat.visible ? "text-brand-muted" : "text-brand-text"
                      }`}
                    >
                      {cat.nameEn}
                    </p>
                    {cat.shortNameEn && cat.shortNameEn !== cat.nameEn && (
                      <span className="text-[10px] bg-brand-green/10 text-brand-green px-1 py-0.2 rounded font-sans">
                        Tab: {cat.shortNameEn}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-brand-muted">
                    <span>{cat._count.items} items</span>
                    {cat.groupEn && <span>• {cat.groupEn}</span>}
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(cat);
                    }}
                    className="p-1 hover:bg-brand-green/10 rounded"
                    title="Edit category details"
                  >
                    <Edit2 size={13} className="text-brand-green" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisible(cat);
                    }}
                    className="p-1 hover:bg-brand-green/10 rounded"
                    title={cat.visible ? "Hide" : "Show"}
                  >
                    {cat.visible ? (
                      <Eye size={14} className="text-brand-green" />
                    ) : (
                      <EyeOff size={14} className="text-brand-muted" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(cat.id, cat.nameEn);
                    }}
                    className="p-1 hover:bg-red-50 rounded"
                    title="Delete category"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add Category Form */}
      {addingNew ? (
        <div className="p-3 space-y-2 border-b border-brand-cream-dark bg-brand-cream/50">
          <input
            autoFocus
            className="w-full border border-brand-green/40 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-brand-green"
            placeholder="Full category name (EN)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="w-full border border-brand-green/40 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-brand-green"
            placeholder="Full category name (GU)"
            value={newNameGu}
            onChange={(e) => setNewNameGu(e.target.value)}
          />
          <div className="flex gap-1.5">
            <input
              className="flex-1 border border-brand-green/40 rounded px-2 py-1 text-xs"
              placeholder="Short tab name (e.g. Chinese)"
              value={newShort}
              onChange={(e) => setNewShort(e.target.value)}
            />
            <input
              className="flex-1 border border-brand-green/40 rounded px-2 py-1 text-xs"
              placeholder="Group (e.g. Main Course)"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
            />
          </div>
          <input
            className="w-full border border-brand-green/40 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-brand-green"
            placeholder="Slug (e.g. starters)"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAdd}
              className="flex-1 bg-brand-green text-white rounded py-1 text-xs font-bold"
            >
              Add Category
            </button>
            <button
              onClick={() => setAddingNew(false)}
              className="flex-1 border border-brand-green/40 rounded py-1 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingNew(true)}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-brand-green hover:bg-brand-green/5 transition-colors"
        >
          <Plus size={16} />
          Add Category
        </button>
      )}
    </div>
  );
}
