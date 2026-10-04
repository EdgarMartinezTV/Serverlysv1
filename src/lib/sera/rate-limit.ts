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

/**
 * THE BILL CEILING. Instance-wide, keyed on nothing.
 *
 * Every other limit in this file asks "who is calling", and every answer to
 * that question ultimately rests on a header. `clientKey` now reads only the
 * position our own proxy writes, which closes the forgery path THROUGH the
 * proxy — but an origin that is ever reachable directly has no proxy to write
 * it, and then identity is whatever the caller says it is. A limiter that can
 * be made to see a new visitor on every request does not limit anything.
 *
 * So this one does not ask. It counts model calls leaving this process and
 * stops at the ceiling no matter who is asking, which makes it the only limit
 * here whose guarantee does not depend on the deployment being wired correctly.
 * The failure mode it prevents is not an outage, it is an invoice.
 *
 * 240/minute is roughly twenty simultaneous real conversations — far above
 * anything this site will see organically, and far below a number that could
 * run up a bill unnoticed. Tripping it means something is driving the endpoint,
 * and the visitor-facing copy hands over to a human rather than pretending.
 *
 * ⚠ PER INSTANCE, like everything else here. N replicas means N ceilings, so
 * the real cap is N × 240. Sized with that in mind rather than forgotten.
 */
export const GLOBAL_CHAT: Window = { limit: 240, windowMs: 60_000 };

/** The fixed key for `GLOBAL_CHAT`. Constant on purpose — one shared bucket. */
export const GLOBAL_CHAT_KEY = "sera-chat:global";

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

/**
 * Several limits as one decision: every bucket is checked before ANY is
 * charged, and nothing is charged unless all of them have room.
 *
 * Charging them one after another lets a refusal by a later bucket still spend
 * the earlier ones. With the instance ceiling first and the per-address limit
 * second, one client sending past its own 429s would drain the shared ceiling
 * and lock out every other visitor — the opposite of what the ceiling is for.
 *
 * `failed` is the index of the first limit without room, so the caller can
 * word its response for the limit that actually tripped.
 */
export function checkAll(
  limits: ReadonlyArray<readonly [key: string, window: Window]>,
): LimitResult & { failed?: number } {
  const now = Date.now();
  for (let i = 0; i < limits.length; i++) {
    const [key, window] = limits[i];
    const bucket = buckets.get(key);
    if (bucket && bucket.resetAt > now && bucket.count >= window.limit) {
      return {
        ok: false,
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
        failed: i,
      };
    }
  }
  for (const [key, window] of limits) check(key, window);
  return { ok: true, retryAfterSeconds: 0 };
}
