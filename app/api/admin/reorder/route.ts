import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { reorderSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = reorderSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { type, ids } = result.data;

  if (type === "category") {
    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.category.update({ where: { id }, data: { sort: index } })
      )
    );
  } else if (type === "item") {
    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.item.update({ where: { id }, data: { sort: index } })
      )
    );
  }

  revalidateTag("menu");
  return NextResponse.json({ success: true });
}
