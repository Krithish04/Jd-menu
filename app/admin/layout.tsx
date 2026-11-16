import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Mobile guard */}
      <div className="lg:hidden flex items-center justify-center min-h-screen p-8 text-center">
        <div className="max-w-sm">
          <div className="bg-brand-green text-white rounded-lg px-6 py-5 mb-4">
            <h1 className="font-serif text-xl font-bold">JD Restaurant Admin</h1>
          </div>
          <p className="text-brand-text text-sm">
            Please open the admin on a <strong>desktop or laptop</strong>. The admin dashboard is
            designed for screens wider than 1024px.
          </p>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
