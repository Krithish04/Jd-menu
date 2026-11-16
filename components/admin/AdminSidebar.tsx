"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, QrCode, Settings, LogOut, Eye } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", exact: true, label: "Overview", icon: LayoutDashboard },
  { href: "/admin/menu", exact: false, label: "Menu Editor", icon: UtensilsCrossed },
  { href: "/admin/qr", exact: false, label: "QR Generator", icon: QrCode },
  { href: "/admin/settings", exact: false, label: "Restaurant Info", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside
      className="flex-shrink-0 bg-brand-maroon-binder border-r-2 border-brand-gold/40 flex flex-col shadow-xl z-20 text-white"
      style={{ width: "240px" }}
    >
      {/* Brand Header */}
      <div className="bg-[#480B12] px-5 py-4 border-b border-brand-gold/30">
        <h1 className="font-serif text-lg font-bold text-brand-gold flex items-center gap-1.5">
          <span>JD Restaurant</span>
        </h1>
        <p className="text-[11px] text-white/70 mt-0.5">Admin Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ href, exact, label, icon: Icon }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
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
    </aside>
  );
}
