import prisma from "@/lib/db";
import AdminHomeClient from "@/components/admin/AdminHomeClient";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [categories, items] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { items: true } } },
      orderBy: { sort: "asc" },
    }),
    prisma.item.findMany({
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const totalCategories = categories.length;
  const totalItems = items.length;
  const soldOutItems = items.filter((i) => !i.available);
  const hiddenItems = items.filter((i) => !i.visible);
  const lastUpdated = items[0]?.updatedAt || new Date();

  // "Needs attention" list:
  // 1. Price is 0
  const zeroPriceItems = items.filter((i) => i.price <= 0);
  // 2. Missing Gujarati name
  const missingGuItems = items.filter((i) => !i.nameGu || i.nameGu.trim() === "");
  // 3. Duplicate names
  const nameCounts: Record<string, number> = {};
  items.forEach((i) => {
    const norm = i.nameEn.trim().toLowerCase();
    nameCounts[norm] = (nameCounts[norm] || 0) + 1;
  });
  const duplicateItems = items.filter((i) => (nameCounts[i.nameEn.trim().toLowerCase()] || 0) > 1);

  return (
    <AdminHomeClient
      totalCategories={totalCategories}
      totalItems={totalItems}
      soldOutCount={soldOutItems.length}
      hiddenCount={hiddenItems.length}
      lastUpdated={lastUpdated.toISOString()}
      zeroPriceCount={zeroPriceItems.length}
      missingGuCount={missingGuItems.length}
      duplicateCount={duplicateItems.length}
      soldOutList={soldOutItems.slice(0, 5)}
      missingGuList={missingGuItems.slice(0, 5)}
      duplicateList={duplicateItems.slice(0, 5)}
    />
  );
}
