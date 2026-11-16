import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const format = searchParams.get("format") || "json";

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: "default" },
      include: { notices: { orderBy: { sort: "asc" } } },
    });

    const categories = await prisma.category.findMany({
      orderBy: { sort: "asc" },
      include: {
        items: { orderBy: { sort: "asc" } },
      },
    });

    if (format === "csv") {
      const rows: string[] = [];
      rows.push("Category,Item Name (EN),Item Name (GU),Price,Badge,Available,Visible");
      for (const cat of categories) {
        for (const item of cat.items) {
          rows.push(
            `"${cat.nameEn}","${item.nameEn.replace(/"/g, '""')}","${(item.nameGu || "").replace(/"/g, '""')}",${item.price},"${item.badge || ""}",${item.available},${item.visible}`
          );
        }
      }
      return new NextResponse(rows.join("\n"), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="jd-restaurant-menu-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      restaurant,
      categories,
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="jd-restaurant-menu-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (err) {
    console.error("[Export] Error:", err);
    return NextResponse.json({ error: "Failed to export menu" }, { status: 500 });
  }
}
