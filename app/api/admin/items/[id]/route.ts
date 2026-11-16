import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { itemSchema } from "@/lib/schemas";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const result = itemSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  try {
    const beforeItem = await prisma.item.findUnique({ where: { id } });
    const item = await prisma.item.update({
      where: { id },
      data: result.data,
    });

    if (beforeItem) {
      await prisma.auditLog.create({
        data: {
          action: "UPDATE",
          entity: "Item",
          entityId: id,
          before: JSON.stringify(beforeItem),
          after: JSON.stringify(item),
        },
      });
    }

    revalidateTag("menu");
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const beforeItem = await prisma.item.findUnique({ where: { id } });
    await prisma.item.delete({ where: { id } });

    if (beforeItem) {
      await prisma.auditLog.create({
        data: {
          action: "DELETE",
          entity: "Item",
          entityId: id,
          before: JSON.stringify(beforeItem),
          after: null,
        },
      });
    }

    revalidateTag("menu");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
}
