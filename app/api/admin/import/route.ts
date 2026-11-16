import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { invalidateMenuCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const isPreview = searchParams.get("preview") === "true";

    const body = await req.json();
    const categories = body.categories || body;

    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { error: "Invalid format: Expected a categories array" },
        { status: 400 }
      );
    }

    const categoriesCount = categories.length;
    let itemsCount = 0;
    for (const cat of categories) {
      if (Array.isArray(cat.items)) {
        itemsCount += cat.items.length;
      }
    }

    if (isPreview) {
      return NextResponse.json({
        preview: true,
        categoriesCount,
        itemsCount,
        sampleCategories: categories.slice(0, 3).map((c) => ({
          nameEn: c.nameEn,
          itemsCount: c.items?.length || 0,
        })),
      });
    }

    // Apply import in transaction
    await prisma.$transaction(async (tx) => {
      // Create audit log before clearing
      await tx.auditLog.create({
        data: {
          action: "UPDATE",
          entity: "Menu",
          entityId: "all",
          before: JSON.stringify({ action: "Pre-import backup" }),
          after: JSON.stringify({ importedCategories: categoriesCount, importedItems: itemsCount }),
        },
      });

      // Clear existing menu
      await tx.item.deleteMany({});
      await tx.category.deleteMany({});

      // Insert new
      for (let cIdx = 0; cIdx < categories.length; cIdx++) {
        const cat = categories[cIdx];
        const newCat = await tx.category.create({
          data: {
            slug: cat.slug || `category-${cIdx}`,
            nameEn: cat.nameEn || "Unnamed Category",
            nameGu: cat.nameGu || null,
            shortNameEn: cat.shortNameEn || cat.nameEn || null,
            shortNameGu: cat.shortNameGu || cat.nameGu || null,
            groupEn: cat.groupEn || "Main Course",
            groupGu: cat.groupGu || null,
            note: cat.note || null,
            noteGu: cat.noteGu || null,
            kind: cat.kind || "list",
            iconKey: cat.iconKey || null,
            sort: cat.sort ?? cIdx,
            visible: cat.visible ?? true,
          },
        });

        if (Array.isArray(cat.items)) {
          for (let iIdx = 0; iIdx < cat.items.length; iIdx++) {
            const item = cat.items[iIdx];
            await tx.item.create({
              data: {
                categoryId: newCat.id,
                nameEn: item.nameEn || "Unnamed Dish",
                nameGu: item.nameGu || null,
                description: item.description || null,
                descriptionGu: item.descriptionGu || null,
                price: Number(item.price) || 0,
                badge: item.badge || null,
                imageUrl: item.imageUrl || null,
                isVeg: item.isVeg ?? true,
                sort: item.sort ?? iIdx,
                available: item.available ?? true,
                visible: item.visible ?? true,
              },
            });
          }
        }
      }
    });

    await invalidateMenuCache();

    return NextResponse.json({
      success: true,
      importedCategories: categoriesCount,
      importedItems: itemsCount,
    });
  } catch (err: unknown) {
    console.error("[Import] Error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Import failed", details: message }, { status: 500 });
  }
}
