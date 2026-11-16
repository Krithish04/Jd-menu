import prisma from "@/lib/db";
import { redisGet, redisSet, redisIncr, redisDel } from "@/lib/redis";
import { revalidateTag, revalidatePath } from "next/cache";

export type CachedMenuData = {
  restaurant: any;
  categories: any[];
  version: number;
};

export async function getCachedMenu(): Promise<CachedMenuData> {
  const version = (await redisGet<number>("menu:version")) ?? 1;
  const cacheKey = `menu:v${version}:json`;

  const cached = await redisGet<CachedMenuData>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: "default" },
      include: { notices: { orderBy: { sort: "asc" } } },
    });

    const categories = await prisma.category.findMany({
      where: { visible: true },
      include: {
        items: {
          where: { visible: true },
          orderBy: { sort: "asc" },
        },
      },
      orderBy: { sort: "asc" },
    });

    const menuData: CachedMenuData = {
      restaurant,
      categories,
      version,
    };

    // Cache for 24h
    await redisSet(cacheKey, menuData, 24 * 60 * 60);
    // Keep stale copy in case DB fails
    await redisSet("menu:stale", menuData);

    return menuData;
  } catch (err) {
    console.error("[Cache] Failed to fetch menu from DB, trying stale copy:", err);
    const stale = await redisGet<CachedMenuData>("menu:stale");
    if (stale) return stale;
    throw err;
  }
}

export async function invalidateMenuCache() {
  try {
    const nextVersion = await redisIncr("menu:version");
    console.log(`[Cache] Incremented menu:version to ${nextVersion}`);

    // Revalidate Next.js static tags and paths
    revalidateTag("menu");
    revalidatePath("/menu");
    revalidatePath("/gu/menu");
    revalidatePath("/sitemap.xml");
  } catch (err) {
    console.error("[Cache] Invalidation error:", err);
  }
}
