import { Redis } from "@upstash/redis";

// Check if Upstash Redis credentials exist in environment
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis =
  url && token
    ? new Redis({
        url,
        token,
      })
    : null;

// In-memory fallback stores when Redis is not configured or unavailable
const inMemoryStore = new Map<string, { value: unknown; expiresAt?: number }>();
const inMemoryCounters = new Map<string, number>();

export async function redisGet<T>(key: string): Promise<T | null> {
  if (redis) {
    try {
      return await redis.get<T>(key);
    } catch (err) {
      console.warn("[Redis] GET failed, falling back to in-memory:", err);
    }
  }

  const record = inMemoryStore.get(key);
  if (!record) return null;
  if (record.expiresAt && Date.now() > record.expiresAt) {
    inMemoryStore.delete(key);
    return null;
  }
  return record.value as T;
}

export async function redisSet(
  key: string,
  value: unknown,
  ttlSeconds?: number
): Promise<void> {
  if (redis) {
    try {
      if (ttlSeconds) {
        await redis.set(key, value, { ex: ttlSeconds });
      } else {
        await redis.set(key, value);
      }
      return;
    } catch (err) {
      console.warn("[Redis] SET failed, falling back to in-memory:", err);
    }
  }

  inMemoryStore.set(key, {
    value,
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
  });
}

export async function redisIncr(key: string): Promise<number> {
  if (redis) {
    try {
      return await redis.incr(key);
    } catch (err) {
      console.warn("[Redis] INCR failed, falling back to in-memory:", err);
    }
  }

  const current = inMemoryCounters.get(key) ?? 0;
  const next = current + 1;
  inMemoryCounters.set(key, next);
  return next;
}

export async function redisDel(key: string): Promise<void> {
  if (redis) {
    try {
      await redis.del(key);
      return;
    } catch (err) {
      console.warn("[Redis] DEL failed, falling back to in-memory:", err);
    }
  }
  inMemoryStore.delete(key);
  inMemoryCounters.delete(key);
}

export async function redisHIncrBy(
  key: string,
  field: string,
  increment = 1
): Promise<number> {
  if (redis) {
    try {
      return await redis.hincrby(key, field, increment);
    } catch (err) {
      console.warn("[Redis] HINCRBY failed, falling back to in-memory:", err);
    }
  }

  const subKey = `${key}:${field}`;
  const current = inMemoryCounters.get(subKey) ?? 0;
  const next = current + increment;
  inMemoryCounters.set(subKey, next);
  return next;
}

export async function redisHGetAll(
  key: string
): Promise<Record<string, number>> {
  if (redis) {
    try {
      const res = await redis.hgetall(key);
      if (res) return res as Record<string, number>;
    } catch (err) {
      console.warn("[Redis] HGETALL failed, falling back to in-memory:", err);
    }
  }

  const prefix = `${key}:`;
  const result: Record<string, number> = {};
  for (const [k, v] of inMemoryCounters.entries()) {
    if (k.startsWith(prefix)) {
      result[k.slice(prefix.length)] = v;
    }
  }
  return result;
}
