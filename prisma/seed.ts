import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const CATEGORY_ICONS: Record<string, string> = {
  starters: "starter",
  soups: "soup",
  "salad-raita": "salad",
  chinese: "chinese",
  "sp-punjabi": "curry",
  special: "special",
  tandoor: "roti",
  rice: "rice",
  "south-indian": "dosa",
  "fancy-dosa": "dosa-fancy",
  "fries-sandwiches": "fries",
  "grilled-pizza-brownie": "pizza",
  beverages: "beverage",
  "milk-shakes": "shake",
  "ice-cream": "icecream",
  "party-menu": "thali",
};

const POPULAR_ITEMS = [
  "Paneer Tikka - Tandoori (8 Pcs)",
  "Veg. Manchurian (Dry/Gravy)",
  "Cream of Tomato",
  "J.D. Pasanda",
  "Cheese Butter Masala",
  "Garlic Naan",
  "Dum Biryani",
  "Masala Dosa",
  "J.D. Sp. Dosa",
  "Peri Peri French Fries",
  "J.D. Special Grill Sandwich",
  "Hot Sizzling Brownie",
  "Cold Coco",
  "Classic Cassatta",
  "Sp. Gujarati Thali",
];

const SPECIAL_ITEMS = [
  "Special of the Day",
  "Cheese Kofta",
  "Kaju Kofta",
  "Cheese Angori",
  "Sp. Punjabi Dishes",
];

async function main() {
  console.log("Starting menu seed v2...");

  const seedFilePath = path.join(process.cwd(), "menu-seed.json");
  const rawData = fs.readFileSync(seedFilePath, "utf-8");
  const seedData = JSON.parse(rawData);

  // Clear existing
  await prisma.item.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.notice.deleteMany({});
  await prisma.restaurant.deleteMany({});

  // 1. Restaurant & Notices
  const restInfo = seedData.restaurant;
  const restaurant = await prisma.restaurant.create({
    data: {
      id: "default",
      name: restInfo.name || "JD Restaurant",
      tagline: restInfo.tagline || "Enjoy the Taste",
      address: restInfo.address || "Mini Bazar, Varachha Road, Surat, Gujarat - 395006",
      phone: restInfo.phone || "0261-2556649",
      mobile: restInfo.mobile || "94291 65549",
      banner: restInfo.banner || "",
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
  });

  if (Array.isArray(restInfo.notices)) {
    for (let i = 0; i < restInfo.notices.length; i++) {
      const textEn = restInfo.notices[i];
      const textGu = restInfo.notices_gu?.[i] || null;
      await prisma.notice.create({
        data: {
          restaurantId: restaurant.id,
          textEn,
          textGu,
          sort: i,
        },
      });
    }
  }

  // 2. Categories & Items
  let catIndex = 0;
  for (const cat of seedData.categories) {
    const category = await prisma.category.create({
      data: {
        slug: cat.slug,
        nameEn: cat.name,
        nameGu: cat.name_gu || null,
        shortNameEn: cat.short || cat.name,
        shortNameGu: cat.short_gu || cat.name_gu || null,
        groupEn: cat.group || "Other",
        groupGu: cat.group_gu || "અન્ય",
        note: cat.note || null,
        kind: cat.kind === "combo" ? "combo" : "list",
        iconKey: CATEGORY_ICONS[cat.slug] || "bowl",
        sort: catIndex++,
        visible: true,
      },
    });

    if (Array.isArray(cat.items)) {
      let itemIndex = 0;
      for (const item of cat.items) {
        let badge: string | null = null;
        if (SPECIAL_ITEMS.includes(item.name)) badge = "SPECIAL";
        else if (POPULAR_ITEMS.includes(item.name)) badge = "POPULAR";

        await prisma.item.create({
          data: {
            categoryId: category.id,
            nameEn: item.name,
            nameGu: item.name_gu || null,
            description: item.description || null,
            descriptionGu: null,
            price: Math.round(Number(item.price) || 0),
            sort: itemIndex++,
            badge,
            isVeg: true,
            available: true,
            visible: true,
          },
        });
      }
    }
  }

  const categoryCount = await prisma.category.count();
  const itemCount = await prisma.item.count();
  console.log(`Seeding v2 complete: ${categoryCount} categories and ${itemCount} items created.`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
