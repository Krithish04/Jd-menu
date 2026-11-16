import prisma from "@/lib/db";
import SettingsClient from "@/components/admin/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: "default" },
    include: { notices: { orderBy: { sort: "asc" } } },
  });

  return <SettingsClient restaurant={restaurant} />;
}
