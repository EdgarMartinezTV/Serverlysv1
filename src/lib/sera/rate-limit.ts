import "server-only";

/**
 * Rate limiting for Sera's endpoints.
 *
 * WHY SERA NEEDS ITS OWN. The domain-search limiter in `lib/domains/provider`
 * protects a free RDAP lookup; this protects a metered model call. The costs
 * differ by orders of magnitude, so the windows do too, and stretching one set
 * of constants across both would mean either paying for abuse or throttling a
 * search that costs nothing. `clientKey` IS shared — deriving the caller's
 * address correctly is subtle, already solved there, and must not be reasoned
 * about twice.
 *
 * TWO BUCKETS, AND BOTH ARE NECESSARY:
 *
 *  · BY ADDRESS, so one machine cannot open fifty conversations and run them
 *    all at once. This is the bill-protection limit.
 *  · BY CONVERSATION, so a single session cannot hammer one thread. This is
 *    the one that catches a runaway client retry loop, which looks like a
 *    normal visitor to an address-based limiter.
 *
 * ⚠ IN-MEMORY, AND THEREFORE PER-INSTANCE. Behind N replicas the effective
 * limit is N times what is written below. Acceptable at this scale and stated
 * rather than hidden. `check()` is the only surface, so swapping in Redis is a
 * change to this file.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type Window = { limit: number; windowMs: number };

/**
 * Chat is the expensive one, so it is the tightest. 12 messages a minute is
 * roughly four times faster than a person types a real question, which leaves
 * ordinary use untouched while capping a scripted client hard.
 */
export const CHAT_BY_ADDRESS: Window = { limit: 12, windowMs: 60_000 };
export const CHAT_BY_CONVERSATION: Window = { limit: 20, windowMs: 60_000 };

/**
 * Submission is cheap to serve but expensive to get wrong — every success is an
 * email in someone's inbox. The real duplicate defence is idempotency in
 * `submit.ts`; this stops the volume.
 */
export const SUBMIT_BY_ADDRESS: Window = { limit: 5, windowMs: 10 * 60_000 };

export type LimitResult = { ok: boolean; retryAfterSeconds: number };

export function check(key: string, window: Window): LimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + window.windowMs });
    // Opportunistic sweep so the map cannot grow without bound. Same approach
    // as the domain limiter — cheap, and only pays the cost when it matters.
    if (buckets.size > 10_000) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= window.limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}
