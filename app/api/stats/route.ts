import { NextRequest, NextResponse } from "next/server";
import { redisIncr, redisHIncrBy, redisGet, redisSet } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";
    // Filter obvious bots/crawlers
    if (
      userAgent.includes("bot") ||
      userAgent.includes("spider") ||
      userAgent.includes("crawler") ||
      userAgent.includes("lighthouse")
    ) {
      return NextResponse.json({ ok: true });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate limit beacon: 30 requests per minute per IP
    const rateKey = `rl:stats:${ip}`;
    const count = (await redisGet<number>(rateKey)) ?? 0;
    if (count > 30) {
      return NextResponse.json({ ok: true }); // Silently drop
    }
    const newCount = await redisIncr(rateKey);
    if (newCount === 1) {
      await redisSet(rateKey, 1, 60);
    }

    const body = await req.json().catch(() => ({}));
    const { src, category } = body;

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // 1. Increment daily page views
    await redisIncr(`stats:views:${today}`);

    // 2. Increment QR scans if src=qr
    if (src === "qr") {
      await redisIncr(`stats:scans:${today}`);
    }

    // 3. Increment category views if present
    if (category && typeof category === "string") {
      await redisHIncrBy(`stats:cat:${today}`, category, 1);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Stats] Error recording beacon:", err);
    return NextResponse.json({ ok: true });
  }
}
