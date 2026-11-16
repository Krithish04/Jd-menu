import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { invalidateMenuCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const log = await prisma.auditLog.findUnique({ where: { id } });
    if (!log || !log.before) {
      return NextResponse.json({ error: "Audit entry cannot be reverted" }, { status: 400 });
    }

    const beforeData = JSON.parse(log.before);

    if (log.entity === "Item") {
      if (log.action === "UPDATE") {
        await prisma.item.update({
          where: { id: log.entityId },
          data: beforeData,
        });
      } else if (log.action === "DELETE") {
        await prisma.item.create({
          data: beforeData,
        });
      } else if (log.action === "CREATE") {
        await prisma.item.delete({
          where: { id: log.entityId },
        });
      }
    } else if (log.entity === "Category") {
      if (log.action === "UPDATE") {
        await prisma.category.update({
          where: { id: log.entityId },
          data: beforeData,
        });
      } else if (log.action === "DELETE") {
        await prisma.category.create({
          data: beforeData,
        });
      } else if (log.action === "CREATE") {
        await prisma.category.delete({
          where: { id: log.entityId },
        });
      }
    }

    // Write a revert log
    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: log.entity,
        entityId: log.entityId,
        before: log.after,
        after: log.before,
      },
    });

    await invalidateMenuCache();

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[Audit Revert] Error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Revert failed", details: message }, { status: 500 });
  }
}
