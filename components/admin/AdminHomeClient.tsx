"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Layers,
  AlertTriangle,
  EyeOff,
  Clock,
  QrCode,
  ExternalLink,
  PlusCircle,
  CheckCircle,
  Download,
  Upload,
  History,
  RotateCcw,
  BarChart2,
  TrendingUp,
} from "lucide-react";

type ItemBrief = {
  id: string;
  nameEn: string;
  price: number;
  category: { nameEn: string };
};

type Props = {
  totalCategories: number;
  totalItems: number;
  soldOutCount: number;
  hiddenCount: number;
  lastUpdated: string;
  zeroPriceCount: number;
  missingGuCount: number;
  duplicateCount: number;
  soldOutList: ItemBrief[];
  missingGuList: ItemBrief[];
  duplicateList: ItemBrief[];
};

type AuditEntry = {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  before: string | null;
  after: string | null;
  createdAt: string;
};

type StatsData = {
  totalViews7d: number;
  totalScans7d: number;
  topCategories: { slug: string; count: number }[];
};

export default function AdminHomeClient({
  totalCategories,
  totalItems,
  soldOutCount,
  hiddenCount,
  lastUpdated,
  zeroPriceCount,
  missingGuCount,
  duplicateCount,
  soldOutList,
  missingGuList,
  duplicateList,
}: Props) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  const formattedDate = new Date(lastUpdated).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  const openAuditLogs = async () => {
    setShowAuditModal(true);
    const res = await fetch("/api/admin/audit");
    if (res.ok) {
      const data = await res.json();
      setAuditLogs(data);
    }
  };

  const handleRevert = async (logId: string) => {
    if (!confirm("Are you sure you want to revert this change?")) return;
    const res = await fetch(`/api/admin/audit/${logId}/revert`, { method: "POST" });
    if (res.ok) {
      showToastMsg("Change reverted successfully");
      openAuditLogs();
    } else {
      showToastMsg("Failed to revert change");
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Check preview
      const res = await fetch("/api/admin/import?preview=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });

      if (res.ok) {
        const preview = await res.json();
        setImportPreview({ data: json, preview });
      } else {
        showToastMsg("Invalid JSON file for menu import");
      }
    } catch {
      showToastMsg("Failed to parse JSON file");
    }
  };

  const applyImport = async () => {
    if (!importPreview?.data) return;
    setImporting(true);
    const res = await fetch("/api/admin/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(importPreview.data),
    });
    setImporting(false);
    if (res.ok) {
      showToastMsg("Menu imported successfully! Reloading...");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showToastMsg("Failed to import menu");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl space-y-6 sm:space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-brand-green text-white text-xs font-semibold rounded-lg shadow-xl">
          {toast}
        </div>
      )}

      {/* Page Header Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-green/20 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-green">
            Dashboard Overview
          </h1>
          <p className="text-xs text-brand-muted mt-0.5 flex items-center gap-1.5">
            <Clock size={13} />
            Last menu update: <span className="font-medium text-brand-text">{formattedDate}</span>
          </p>
        </div>

        {/* Quick Actions Header */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/admin/menu"
            className="flex items-center gap-1.5 bg-brand-green text-white px-3.5 py-2 rounded-md text-xs font-medium hover:bg-brand-green-hover transition-colors shadow-xs"
          >
            <PlusCircle size={14} />
            Manage Menu
          </Link>
          <Link
            href="/admin/qr"
            className="flex items-center gap-1.5 border border-brand-green text-brand-green bg-white px-3.5 py-2 rounded-md text-xs font-medium hover:bg-brand-green/5 transition-colors"
          >
            <QrCode size={14} />
            QR Generator
          </Link>
          <a
            href="/menu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-brand-gold text-brand-maroon-binder bg-brand-gold/10 px-3.5 py-2 rounded-md text-xs font-bold hover:bg-brand-gold/20 transition-colors"
          >
            <ExternalLink size={14} />
            Live Customer Menu
          </a>
        </div>
      </div>

      {/* Summary KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Categories */}
        <div className="bg-white border-2 border-brand-green/30 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-green" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                Categories
              </p>
              <p className="font-serif text-3xl font-bold text-brand-green mt-1">
                {totalCategories}
              </p>
            </div>
            <div className="p-3 bg-brand-green/10 text-brand-green rounded-lg">
              <Layers size={24} />
            </div>
          </div>
          <p className="text-[11px] text-brand-muted mt-3">Active sections in menu</p>
        </div>

        {/* Items */}
        <div className="bg-white border-2 border-brand-green/30 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-green" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                Total Dishes
              </p>
              <p className="font-serif text-3xl font-bold text-brand-text mt-1">
                {totalItems}
              </p>
            </div>
            <div className="p-3 bg-brand-green/10 text-brand-green rounded-lg">
              <UtensilsCrossed size={24} />
            </div>
          </div>
          <p className="text-[11px] text-brand-muted mt-3">Dishes across all categories</p>
        </div>

        {/* Sold Out */}
        <div className="bg-white border-2 border-brand-maroon/30 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-maroon" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                Sold Out
              </p>
              <p className="font-serif text-3xl font-bold text-brand-maroon mt-1">
                {soldOutCount}
              </p>
            </div>
            <div className="p-3 bg-brand-maroon/10 text-brand-maroon rounded-lg">
              <AlertTriangle size={24} />
            </div>
          </div>
          <p className="text-[11px] text-brand-muted mt-3">Temporarily unavailable items</p>
        </div>

        {/* Hidden Items */}
        <div className="bg-white border-2 border-brand-cream-dark rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-muted" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                Hidden Items
              </p>
              <p className="font-serif text-3xl font-bold text-brand-muted mt-1">
                {hiddenCount}
              </p>
            </div>
            <div className="p-3 bg-brand-cream-dark/60 text-brand-muted rounded-lg">
              <EyeOff size={24} />
            </div>
          </div>
          <p className="text-[11px] text-brand-muted mt-3">Hidden from customer view</p>
        </div>
      </div>

      {/* Traffic & QR Stats (Section 5.8 & 10.5) */}
      <div className="bg-white border border-brand-green/20 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-brand-cream-dark pb-3">
          <div className="flex items-center gap-2 text-brand-green">
            <BarChart2 size={18} />
            <h2 className="font-serif font-bold text-sm tracking-wide">
              Customer Views & QR Analytics (Last 7 Days)
            </h2>
          </div>
          <span className="text-[11px] text-brand-muted">Privacy-safe counters (Redis)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-brand-cream/50 border border-brand-green/20 rounded-lg p-4">
            <p className="text-xs text-brand-muted font-medium">Total Menu Page Views</p>
            <p className="font-serif text-2xl font-bold text-brand-green mt-1">
              {stats?.totalViews7d ?? 0}
            </p>
            <p className="text-[10px] text-brand-muted mt-1 flex items-center gap-1">
              <TrendingUp size={11} className="text-brand-green" /> Total traffic 7d
            </p>
          </div>

          <div className="bg-brand-cream/50 border border-brand-green/20 rounded-lg p-4">
            <p className="text-xs text-brand-muted font-medium">QR Scans from Tables</p>
            <p className="font-serif text-2xl font-bold text-brand-maroon mt-1">
              {stats?.totalScans7d ?? 0}
            </p>
            <p className="text-[10px] text-brand-muted mt-1">Visits with ?src=qr</p>
          </div>

          <div className="bg-brand-cream/50 border border-brand-green/20 rounded-lg p-4">
            <p className="text-xs text-brand-muted font-medium">Top Viewed Categories</p>
            <div className="mt-1 space-y-1">
              {stats?.topCategories && stats.topCategories.length > 0 ? (
                stats.topCategories.map((c) => (
                  <div key={c.slug} className="flex justify-between text-xs">
                    <span className="capitalize truncate font-medium">{c.slug.replace("-", " ")}</span>
                    <span className="text-brand-green font-bold">{c.count} views</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-brand-muted">No category views recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Backup & Change History (Section 5.8) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export / Import Box */}
        <div className="bg-white border border-brand-green/20 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-brand-green font-serif font-bold text-sm">
            <Download size={16} />
            <span>Menu Backup & Restore</span>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            Download your full menu data as JSON (compatible with seed) or CSV. Or import a menu backup anytime.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <a
              href="/api/admin/export?format=json"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-green text-white text-xs font-semibold hover:bg-brand-green-hover transition-colors shadow-2xs"
            >
              <Download size={13} />
              Export JSON
            </a>
            <a
              href="/api/admin/export?format=csv"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-brand-green/40 text-brand-green text-xs font-semibold hover:bg-brand-green/10 transition-colors"
            >
              <Download size={13} />
              Export CSV
            </a>

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-brand-green/40 text-brand-green text-xs font-semibold hover:bg-brand-green/10 transition-colors cursor-pointer">
              <Upload size={13} />
              Import JSON
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileImport}
              />
            </label>
          </div>
        </div>

        {/* Change History Box */}
        <div className="bg-white border border-brand-green/20 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-brand-green font-serif font-bold text-sm">
            <History size={16} />
            <span>Audit Log & Change History</span>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            Every menu edit, deletion, and price adjustment is logged. Review recent changes and revert accidental modifications with one click.
          </p>

          <div className="pt-2">
            <button
              onClick={openAuditLogs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-cream-dark text-brand-text text-xs font-semibold hover:bg-brand-green/20 transition-colors"
            >
              <History size={13} />
              View Recent Changes
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Modal */}
      {showAuditModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden border border-brand-green/30">
            <div className="bg-brand-green text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm">Recent Audit Log & Revert</h3>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-brand-muted text-center py-8">
                  No recent changes recorded yet.
                </p>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-brand-cream-dark rounded-lg p-3 text-xs flex items-center justify-between gap-3 bg-brand-cream/30"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-green">{log.action}</span>
                        <span className="font-medium text-brand-text">{log.entity}</span>
                        <span className="text-[10px] text-brand-muted">
                          {new Date(log.createdAt).toLocaleString("en-IN")}
                        </span>
                      </div>
                      {log.before && (
                        <p className="text-[11px] text-brand-muted mt-1 truncate max-w-md">
                          Before: {log.before}
                        </p>
                      )}
                    </div>

                    {log.before && (
                      <button
                        onClick={() => handleRevert(log.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-100 text-red-700 font-semibold text-[11px] hover:bg-red-200 transition-colors flex-shrink-0"
                      >
                        <RotateCcw size={11} />
                        Revert
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Import Preview Modal */}
      {importPreview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-brand-green/30">
            <h3 className="font-serif font-bold text-base text-brand-green">
              Confirm Menu Import
            </h3>
            <p className="text-xs text-brand-muted">
              Importing will replace the current menu with the uploaded file. An automatic backup will be created in the audit log.
            </p>

            <div className="bg-brand-cream/60 rounded-lg p-3 text-xs space-y-1">
              <p>
                <span className="font-bold">Categories to import:</span>{" "}
                {importPreview.preview.categoriesCount}
              </p>
              <p>
                <span className="font-bold">Dishes to import:</span>{" "}
                {importPreview.preview.itemsCount}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setImportPreview(null)}
                className="px-3 py-1.5 text-xs rounded border border-brand-cream-dark text-brand-muted font-medium"
              >
                Cancel
              </button>
              <button
                disabled={importing}
                onClick={applyImport}
                className="px-4 py-1.5 text-xs rounded bg-brand-green text-white font-bold hover:bg-brand-green-hover"
              >
                {importing ? "Importing..." : "Apply Import"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Needs Attention Panel */}
      <div className="bg-white border border-brand-green/20 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-brand-cream-dark pb-3">
          <div className="flex items-center gap-2 text-brand-maroon">
            <AlertTriangle size={18} />
            <h2 className="font-serif font-bold text-sm tracking-wide">
              Needs Attention
            </h2>
          </div>
          <span className="text-[11px] text-brand-muted">
            Auto-audited from menu items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Missing Gujarati */}
          <div className="border border-brand-cream-dark rounded-lg p-4 bg-brand-cream/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-text">
                Missing Gujarati Names
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {missingGuCount}
              </span>
            </div>
            <p className="text-[11px] text-brand-muted">
              Add Gujarati translations so bilingual customers can toggle language.
            </p>
            {missingGuList.length > 0 && (
              <ul className="text-xs text-brand-text space-y-1 divide-y divide-brand-cream-dark">
                {missingGuList.map((item) => (
                  <li key={item.id} className="pt-1 flex justify-between items-center">
                    <span className="truncate pr-2">{item.nameEn}</span>
                    <span className="text-[10px] text-brand-muted">{item.category.nameEn}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/admin/menu"
              className="inline-block text-xs text-brand-green font-semibold hover:underline"
            >
              Add translations in Menu Editor &rarr;
            </Link>
          </div>

          {/* Sold Out Tracker */}
          <div className="border border-brand-cream-dark rounded-lg p-4 bg-brand-cream/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-text">
                Sold Out Dishes
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                {soldOutCount}
              </span>
            </div>
            <p className="text-[11px] text-brand-muted">
              Mark back as available once ingredients are replenished.
            </p>
            {soldOutList.length > 0 ? (
              <ul className="text-xs text-brand-text space-y-1 divide-y divide-brand-cream-dark">
                {soldOutList.map((item) => (
                  <li key={item.id} className="pt-1 flex justify-between items-center text-red-600">
                    <span className="truncate pr-2 line-through">{item.nameEn}</span>
                    <span className="text-[10px]">₹ {item.price}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 py-2">
                <CheckCircle size={14} />
                <span>All items currently available!</span>
              </div>
            )}
            <Link
              href="/admin/menu"
              className="inline-block text-xs text-brand-green font-semibold hover:underline"
            >
              Review availability &rarr;
            </Link>
          </div>

          {/* Duplicates / Price 0 Check */}
          <div className="border border-brand-cream-dark rounded-lg p-4 bg-brand-cream/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-text">
                Duplicate Name Checks
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {duplicateCount}
              </span>
            </div>
            <p className="text-[11px] text-brand-muted">
              E.g. Butter Scotch appears twice in Ice Cream seed (verify sizes/flavors).
            </p>
            {duplicateList.length > 0 ? (
              <ul className="text-xs text-brand-text space-y-1 divide-y divide-brand-cream-dark">
                {duplicateList.map((item) => (
                  <li key={item.id} className="pt-1 flex justify-between items-center">
                    <span className="truncate pr-2">{item.nameEn}</span>
                    <span className="text-[10px] text-brand-maroon font-bold">₹ {item.price}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 py-2">
                <CheckCircle size={14} />
                <span>No duplicate dishes found.</span>
              </div>
            )}
            <Link
              href="/admin/menu"
              className="inline-block text-xs text-brand-green font-semibold hover:underline"
            >
              Resolve in Menu Editor &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
