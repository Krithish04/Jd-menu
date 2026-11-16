import prisma from "@/lib/db";
import QrPageClient from "@/components/admin/QrPageClient";

export const dynamic = "force-dynamic";

export default async function QrPage() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: "default" },
    select: { siteUrl: true },
  });
  const siteUrl = restaurant?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return <QrPageClient siteUrl={siteUrl} />;
}
