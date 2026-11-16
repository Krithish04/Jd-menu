import { NextResponse } from "next/server";
import { redisGet, redisHGetAll } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const days: string[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    let totalViews7d = 0;
    let totalScans7d = 0;
    const categoryTotals: Record<string, number> = {};
    const viewsByDay: { date: string; views: number; scans: number }[] = [];

    for (const day of days) {
      const views = (await redisGet<number>(`stats:views:${day}`)) ?? 0;
      const scans = (await redisGet<number>(`stats:scans:${day}`)) ?? 0;
      totalViews7d += views;
      totalScans7d += scans;
      viewsByDay.push({ date: day, views, scans });

      const catCounts = await redisHGetAll(`stats:cat:${day}`);
      for (const [slug, count] of Object.entries(catCounts)) {
        categoryTotals[slug] = (categoryTotals[slug] ?? 0) + Number(count);
      }
    }

    const topCategories = Object.entries(categoryTotals)
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      totalViews7d,
      totalScans7d,
      viewsByDay,
      topCategories,
    });
  } catch (err) {
    console.error("[Admin Stats] Error:", err);
    return NextResponse.json({
      totalViews7d: 0,
      totalScans7d: 0,
      viewsByDay: [],
      topCategories: [],
    });
  }
}
