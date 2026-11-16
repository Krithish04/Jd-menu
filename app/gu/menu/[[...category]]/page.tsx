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
      title: "જેડી રેસ્ટોરન્ટ મેનુ - શુદ્ધ શાકાહારી, વરાછા રોડ, સુરત",
      description:
        "પંજાબી, ચાઇનીઝ, સાઉથ ઇન્ડિયન અને ગુજરાતી થાળી, વાજબી ભાવ સાથે. શુદ્ધ શાકાહારી રેસ્ટોરન્ટ, મીની બઝાર, વરાછા રોડ, સુરત.",
      alternates: {
        canonical: `${baseUrl}/gu/menu`,
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
      title: "જેડી રેસ્ટોરન્ટ મેનુ",
    };
  }

  const catName = cat.nameGu || cat.nameEn;
  const first3 = cat.items.map((i) => i.nameGu || i.nameEn).join(", ");
  const description = `જેડી રેસ્ટોરન્ટ, વરાછા રોડ, સુરત ખાતે ${catName}: ${first3} અને વધુ, વાજબી ભાવે.`;

  return {
    title: `${catName} મેનુ અને ભાવ - જેડી રેસ્ટોરન્ટ સુરત`,
    description,
    alternates: {
      canonical: `${baseUrl}/gu/menu/${cat.slug}`,
      languages: {
        en: `${baseUrl}/menu/${cat.slug}`,
        gu: `${baseUrl}/gu/menu/${cat.slug}`,
        "x-default": `${baseUrl}/menu/${cat.slug}`,
      },
    },
  };
}

export default async function GujaratiMenuPage({ params }: PageProps) {
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

      {/* Semantic server-rendered HTML for search crawlers in Gujarati */}
      <main className="sr-only" aria-hidden="true" lang="gu">
        <h1>{currentCat?.nameGu || currentCat?.nameEn || "જેડી રેસ્ટોરન્ટ મેનુ"}</h1>
        <p>{currentCat?.noteGu || currentCat?.note || restaurant?.tagline}</p>
        <ul>
          {currentCat?.items.map((item) => (
            <li key={item.id}>
              <span>{item.nameGu || item.nameEn}</span>
              {item.nameEn && <span> ({item.nameEn})</span>}
              <span> - ₹{item.price}</span>
              {(item.descriptionGu || item.description) && (
                <p>{item.descriptionGu || item.description}</p>
              )}
            </li>
          ))}
        </ul>
      </main>

      {/* Client Interactive Menu */}
      <MenuClient
        restaurant={restaurant}
        categories={categories}
        initialLanguage="gu"
        initialCategorySlug={slug}
      />
    </>
  );
}
