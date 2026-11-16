import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { itemSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = itemSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const maxSort = await prisma.item.aggregate({
    where: { categoryId: result.data.categoryId },
    _max: { sort: true },
  });
  const sort = (maxSort._max.sort ?? -1) + 1;

  const item = await prisma.item.create({
    data: { ...result.data, sort },
  });

  await prisma.auditLog.create({
    data: {
      action: "CREATE",
      entity: "Item",
      entityId: item.id,
      before: null,
      after: JSON.stringify(item),
    },
  });

  revalidateTag("menu");
  return NextResponse.json(item, { status: 201 });
}
