import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const health: {
    status: "ok" | "degraded" | "error";
    database: "connected" | "error";
    redis: "connected" | "in-memory-fallback";
    timestamp: string;
  } = {
    status: "ok",
    database: "connected",
    redis: "in-memory-fallback",
    timestamp: new Date().toISOString(),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    console.error("[Health] Database error:", err);
    health.database = "error";
    health.status = "error";
  }

  if (redis) {
    try {
      await redis.ping();
      health.redis = "connected";
    } catch (err) {
      console.warn("[Health] Redis ping failed, fallback active:", err);
      health.redis = "in-memory-fallback";
    }
  }

  const statusCode = health.database === "error" ? 503 : 200;
  return NextResponse.json(health, { status: statusCode });
}
