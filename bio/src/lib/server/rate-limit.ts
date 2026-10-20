import "server-only";
import Redis from "ioredis";
import { env } from "./env";

/**
 * Fixed-window rate limiter. Redis when REDIS_URL is set (shared across
 * replicas); otherwise an in-process map, which is correct for the single
 * replica this app runs as today and is documented as such in DEPLOY.md.
 */

type Result = { ok: boolean; remaining: number; retryAfter: number };

// Process-wide (see public-pages.ts): each route bundle has its own module copy.
const gl = globalThis as unknown as { __sbioRate?: Map<string, { count: number; resetAt: number }> };
const memory = (gl.__sbioRate ??= new Map<string, { count: number; resetAt: number }>());
let redis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  redis = env.redisUrl ? new Redis(env.redisUrl, { maxRetriesPerRequest: 1, enableOfflineQueue: false, lazyConnect: false }) : null;
  redis?.on("error", () => {
    /* A Redis outage degrades to "allow" below rather than taking the site down. */
  });
  return redis;
}

export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<Result> {
  if (process.env.RATE_LIMIT_DISABLED === "1" && !env.isProd) return { ok: true, remaining: limit, retryAfter: 0 };
  const r = getRedis();
  if (r) {
    try {
      const k = `rl:${key}`;
      const count = await r.incr(k);
      if (count === 1) await r.expire(k, windowSeconds);
      const ttl = await r.ttl(k);
      return { ok: count <= limit, remaining: Math.max(0, limit - count), retryAfter: Math.max(ttl, 0) };
    } catch {
      return { ok: true, remaining: limit, retryAfter: 0 };
    }
  }
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    if (memory.size > 50_000) for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  entry.count += 1;
  return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count), retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
}
