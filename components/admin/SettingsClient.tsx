"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Notice = {
  id: string;
  textEn: string;
  textGu: string | null;
};

type Restaurant = {
  id: string;
  name: string;
  tagline: string | null;
  address: string | null;
  phone: string | null;
  mobile: string | null;
  banner: string | null;
  siteUrl: string | null;
  logoUrl: string | null;
  showBothLanguages?: boolean;
  notices: Notice[];
};

type Props = {
  restaurant: Restaurant | null;
};

export default function SettingsClient({ restaurant }: Props) {
  const [form, setForm] = useState({
    name: restaurant?.name || "JD Restaurant",
    tagline: restaurant?.tagline || "",
    address: restaurant?.address || "",
    phone: restaurant?.phone || "",
    mobile: restaurant?.mobile || "",
    banner: restaurant?.banner || "",
    siteUrl: restaurant?.siteUrl || "",
    showBothLanguages: restaurant?.showBothLanguages ?? false,
  });
  const [notices, setNotices] = useState<{ textEn: string; textGu: string }[]>(
    (restaurant?.notices || []).map((n) => ({ textEn: n.textEn, textGu: n.textGu || "" }))
  );
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, notices }),
    });
    setSaving(false);
    if (res.ok) showToast("Settings saved");
    else showToast("Failed to save", "error");
  };

  const updateNotice = (index: number, field: "textEn" | "textGu", value: string) => {
    const updated = [...notices];
    updated[index][field] = value;
    setNotices(updated);
  };

  const removeNotice = (index: number) => {
    setNotices(notices.filter((_, i) => i !== index));
  };

  const fields: { key: keyof typeof form; label: string; required?: boolean }[] = [
    { key: "name", label: "Restaurant Name", required: true },
    { key: "tagline", label: "Tagline" },
    { key: "address", label: "Address" },
    { key: "phone", label: "Phone (landline)" },
    { key: "mobile", label: "Mobile" },
    { key: "siteUrl", label: "Site URL (for QR code)" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-sm ${
            toast.type === "error" ? "bg-red-600 text-white" : "bg-brand-green text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header ribbon */}
      <div className="bg-brand-green text-white px-4 py-3 rounded-lg shadow-sm mb-6">
        <h1 className="font-serif text-lg font-bold">Restaurant Information & Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic info */}
        <section className="bg-white border border-brand-green/20 rounded-lg p-5 space-y-4">
          <h3 className="font-serif font-bold text-sm text-brand-green">Basic Details</h3>
          {fields.map(({ key, label, required }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-brand-muted mb-1">{label}</label>
              <input
                type="text"
                required={required}
                value={typeof form[key] === "string" ? (form[key] as string) : ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-brand-green/40 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green"
              />
            </div>
          ))}
        </section>

        {/* Display Settings */}
        <section className="bg-white border border-brand-green/20 rounded-lg p-5">
          <h3 className="font-serif font-bold text-sm text-brand-green mb-3">Display Settings</h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.showBothLanguages}
              onChange={(e) => setForm({ ...form, showBothLanguages: e.target.checked })}
              className="mt-1 w-4 h-4 text-brand-green border-brand-green/40 rounded focus:ring-brand-green"
            />
            <div>
              <span className="text-sm font-semibold text-brand-text">Show both languages on rows</span>
              <p className="text-xs text-brand-muted mt-0.5">
                Displays the alternate language name below each dish when no description is set (e.g. English name with Gujarati below, or Gujarati with English below). Off by default.
              </p>
            </div>
          </label>
        </section>

        {/* Notices */}
        <section className="bg-white border border-brand-green/20 rounded-lg p-5 space-y-3">
          <h3 className="font-serif font-bold text-sm text-brand-green">Notices</h3>
          {notices.map((notice, i) => (
            <div key={i} className="border border-brand-cream-dark rounded p-3 space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    placeholder="English"
                    value={notice.textEn}
                    onChange={(e) => updateNotice(i, "textEn", e.target.value)}
                    className="w-full border border-brand-green/40 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-brand-green"
                  />
                </div>
                <button type="button" onClick={() => removeNotice(i)} className="p-1 hover:bg-red-50 rounded">
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
              <input
                placeholder="Gujarati (optional)"
                value={notice.textGu}
                onChange={(e) => updateNotice(i, "textGu", e.target.value)}
                className="w-full border border-brand-green/40 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-brand-green"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setNotices([...notices, { textEn: "", textGu: "" }])}
            className="flex items-center gap-1.5 text-sm text-brand-green hover:underline"
          >
            <Plus size={14} />
            Add Notice
          </button>
        </section>

        {/* Banner */}
        <section className="bg-white border border-brand-green/20 rounded-lg p-5">
          <label className="block text-xs font-medium text-brand-muted mb-1">Info Banner</label>
          <textarea
            value={form.banner || ""}
            onChange={(e) => setForm({ ...form, banner: e.target.value })}
            rows={3}
            className="w-full border border-brand-green/40 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green"
            placeholder="e.g. We use pure milk paneer..."
          />
        </section>

        <button
          type="submit"
          disabled={saving}
          className="bg-brand-green text-white rounded px-6 py-2.5 text-sm font-medium hover:bg-brand-green-hover disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
