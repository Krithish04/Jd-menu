import prisma from "@/lib/db";
import AdminMenuClient from "@/components/admin/AdminMenuClient";

export default async function AdminMenuPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sort: "asc" },
    include: {
      items: { orderBy: { sort: "asc" } },
      _count: { select: { items: true } },
    },
  });

  return <AdminMenuClient initialCategories={categories} />;
}
