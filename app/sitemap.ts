import { MetadataRoute } from "next";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://menu.jdrestaurant.in";

  const categories = await prisma.category.findMany({
    where: { visible: true },
    select: { slug: true, updatedAt: true },
  });

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/menu`,
          gu: `${baseUrl}/gu/menu`,
        },
      },
    },
    {
      url: `${baseUrl}/gu/menu`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/menu`,
          gu: `${baseUrl}/gu/menu`,
        },
      },
    },
  ];

  for (const cat of categories) {
    routes.push({
      url: `${baseUrl}/menu/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/menu/${cat.slug}`,
          gu: `${baseUrl}/gu/menu/${cat.slug}`,
        },
      },
    });

    routes.push({
      url: `${baseUrl}/gu/menu/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/menu/${cat.slug}`,
          gu: `${baseUrl}/gu/menu/${cat.slug}`,
        },
      },
    });
  }

  return routes;
}
