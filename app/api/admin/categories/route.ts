import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { categorySchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sort: "asc" },
    include: {
      items: { orderBy: { sort: "asc" } },
      _count: { select: { items: true } },
    },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = categorySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const maxSort = await prisma.category.aggregate({ _max: { sort: true } });
  const sort = (maxSort._max.sort ?? -1) + 1;

  const category = await prisma.category.create({
    data: { ...result.data, sort },
    include: {
      items: { orderBy: { sort: "asc" } },
      _count: { select: { items: true } },
    },
  });

  revalidateTag("menu");
  return NextResponse.json(category, { status: 201 });
}
