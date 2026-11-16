import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/schemas";
import { createSession } from "@/lib/auth";
import { redisGet, redisSet, redisIncr, redisDel } from "@/lib/redis";
import bcrypt from "bcryptjs";

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 10 * 60; // 10 minutes
const LOCKOUT_SECONDS = 15 * 60; // 15 minutes initial lockout

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const lockKey = `lock:login:${ip}`;
  const isLocked = await redisGet<boolean>(lockKey);
  if (isLocked) {
    return NextResponse.json(
      { error: "Too many failed attempts. Account temporarily locked." },
      { status: 429 }
    );
  }

  const rateKey = `rl:login:${ip}`;
  const attempts = (await redisGet<number>(rateKey)) ?? 0;
  if (attempts >= MAX_ATTEMPTS) {
    await redisSet(lockKey, true, LOCKOUT_SECONDS);
    return NextResponse.json(
      { error: "Too many failed attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { password } = result.data;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const rawPassword = process.env.ADMIN_PASSWORD || "jd_restaurant";

  let isValid = false;
  if (hash) {
    isValid = await bcrypt.compare(password, hash);
  } else {
    isValid = password === rawPassword;
  }

  if (!isValid) {
    const newCount = await redisIncr(rateKey);
    if (newCount === 1) {
      await redisSet(rateKey, 1, WINDOW_SECONDS);
    }
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Clear rate limit counters on success
  await redisDel(rateKey);
  await redisDel(lockKey);

  await createSession();
  return NextResponse.json({ success: true });
}
