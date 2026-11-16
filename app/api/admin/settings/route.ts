import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { settingsSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function GET() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: "default" },
    include: { notices: { orderBy: { sort: "asc" } } },
  });
  return NextResponse.json(restaurant);
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const result = settingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { notices, ...restData } = result.data;

    const updated = await prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.update({
        where: { id: "default" },
        data: restData,
      });

      if (notices !== undefined) {
        await tx.notice.deleteMany({ where: { restaurantId: "default" } });
        for (let i = 0; i < notices.length; i++) {
          await tx.notice.create({
            data: {
              restaurantId: "default",
              textEn: notices[i].textEn,
              textGu: notices[i].textGu || null,
              sort: i,
            },
          });
        }
      }

      return restaurant;
    });

    revalidateTag("menu");
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("PATCH /api/admin/settings error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
