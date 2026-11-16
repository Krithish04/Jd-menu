import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
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
    return NextResponse.json({ restaurant, categories });
  } catch (err: unknown) {
    console.error("GET /api/menu error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Failed to load menu", details: message }, { status: 500 });
  }
}
