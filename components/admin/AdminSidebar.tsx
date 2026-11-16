"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  Settings,
  LogOut,
  Eye,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", exact: true, label: "Overview", icon: LayoutDashboard },
  { href: "/admin/menu", exact: false, label: "Menu Editor", icon: UtensilsCrossed },
  { href: "/admin/qr", exact: false, label: "QR Generator", icon: QrCode },
  { href: "/admin/settings", exact: false, label: "Restaurant Info", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Do not render admin sidebar or mobile header on the login page
  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const navContent = (
    <>
      {/* Brand Header */}
      <div className="bg-[#480B12] px-5 py-4 border-b border-brand-gold/30 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-lg font-bold text-brand-gold flex items-center gap-1.5">
            <span>JD Restaurant</span>
          </h1>
          <p className="text-[11px] text-white/70 mt-0.5">Admin Management</p>
        </div>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, exact, label, icon: Icon }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? "bg-brand-gold text-brand-maroon-binder shadow-sm font-bold"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}

        {/* Live Customer Menu Preview Link */}
        <a
          href="/menu"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-brand-gold hover:bg-brand-gold/10 transition-all border border-brand-gold/30 mt-3"
        >
          <Eye size={16} />
          View Live Menu
        </a>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-brand-gold/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-white/70 hover:bg-red-900/40 hover:text-red-300 transition-colors w-full text-left"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top App Bar (visible on < lg screens) */}
      <header className="lg:hidden sticky top-0 z-30 bg-brand-maroon-binder border-b-2 border-brand-gold/40 px-4 py-2.5 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-md hover:bg-white/10 text-brand-gold transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
          <div>
            <span className="font-serif font-bold text-sm text-brand-gold block leading-tight">
              JD Restaurant
            </span>
            <span className="text-[10px] text-white/60 block leading-tight">
              Admin Dashboard
            </span>
          </div>
        </div>

        <a
          href="/menu"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-2.5 py-1 rounded text-xs font-semibold hover:bg-brand-gold/30 transition-colors"
        >
          <Eye size={13} />
          <span>Menu</span>
        </a>
      </header>

      {/* Mobile Slide-over Drawer (visible on < lg when open) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[80vw] bg-brand-maroon-binder text-white border-r-2 border-brand-gold/40 flex flex-col shadow-2xl z-10 h-full">
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar (visible on >= lg screens) */}
      <aside
        className="hidden lg:flex flex-shrink-0 bg-brand-maroon-binder border-r-2 border-brand-gold/40 flex-col shadow-xl z-20 text-white min-h-screen sticky top-0"
        style={{ width: "240px" }}
      >
        {navContent}
      </aside>
    </>
  );
}
