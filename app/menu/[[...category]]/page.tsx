import prisma from "@/lib/db";
import MenuClient from "@/components/menu/MenuClient";
import { generateRestaurantJsonLd, generateCategoryJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ category?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const slug = category?.[0];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://menu.jdrestaurant.in";

  if (!slug) {
    return {
      title: "JD Restaurant Menu - Pure Veg, Varachha Road, Surat",
      description:
        "Punjabi, Chinese, South Indian and Gujarati thali, with prices. Pure veg restaurant at Mini Bazar, Varachha Road, Surat.",
      alternates: {
        canonical: `${baseUrl}/menu`,
        languages: {
          en: `${baseUrl}/menu`,
          gu: `${baseUrl}/gu/menu`,
          "x-default": `${baseUrl}/menu`,
        },
      },
    };
  }

  const cat = await prisma.category.findUnique({
    where: { slug },
    include: { items: { where: { visible: true }, take: 3 } },
  });

  if (!cat) {
    return {
      title: "JD Restaurant Menu",
    };
  }

  const first3 = cat.items.map((i) => i.nameEn).join(", ");
  const description = `${cat.nameEn} at JD Restaurant, Varachha Road, Surat: ${first3} and more, with prices.`;

  return {
    title: `${cat.nameEn} Menu and Prices - JD Restaurant Surat`,
    description,
    alternates: {
      canonical: `${baseUrl}/menu/${cat.slug}`,
      languages: {
        en: `${baseUrl}/menu/${cat.slug}`,
        gu: `${baseUrl}/gu/menu/${cat.slug}`,
        "x-default": `${baseUrl}/menu/${cat.slug}`,
      },
    },
  };
}

export default async function EnglishMenuPage({ params }: PageProps) {
  const { category } = await params;
  const slug = category?.[0];

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

  const currentCat = slug
    ? categories.find((c) => c.slug === slug) || categories[0]
    : categories[0];

  const restaurantJsonLd = generateRestaurantJsonLd(restaurant);
  const categoryJsonLd = generateCategoryJsonLd(restaurant, currentCat);

  return (
    <>
      {/* Structured Data (JSON-LD) for SEO */}
      {restaurantJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: restaurantJsonLd }}
        />
      )}
      {categoryJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: categoryJsonLd }}
        />
      )}

      {/* Semantic server-rendered HTML for search crawlers (Section 11.1 & 14.16) */}
      <main className="sr-only" aria-hidden="true">
        <h1>{currentCat?.nameEn || "JD Restaurant Menu"}</h1>
        <p>{currentCat?.note || restaurant?.tagline}</p>
        <ul>
          {currentCat?.items.map((item) => (
            <li key={item.id}>
              <span>{item.nameEn}</span>
              {item.nameGu && <span> ({item.nameGu})</span>}
              <span> - ₹{item.price}</span>
              {item.description && <p>{item.description}</p>}
            </li>
          ))}
        </ul>
      </main>

      {/* Client Interactive Menu */}
      <MenuClient
        restaurant={restaurant}
        categories={categories}
        initialLanguage="en"
        initialCategorySlug={slug}
      />
    </>
  );
}
