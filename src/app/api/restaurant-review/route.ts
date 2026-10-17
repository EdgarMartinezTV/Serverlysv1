import { NextResponse } from "next/server";
import { clientKey } from "@/lib/domains/provider";
import { readJsonObject } from "@/lib/request";
import { check, type Window } from "@/lib/sera/rate-limit";
import { log } from "@/lib/sera/observability";
import { fileLead, parseLead, WORKFLOW } from "@/lib/leads/restaurant-review";

/**
 * POST /api/restaurant-review
 *
 * The free-review form on /restaurant-websites and /es/restaurant-websites.
 * Validates server-side, then files the lead through the same store and
 * notifier Sera uses (see lib/leads/restaurant-review.ts).
 *
 * Abuse controls, cheapest first: a body-size cap (readJsonObject), a honeypot
 * field and a minimum fill time (answered with a quiet 200 so a bot learns
 * nothing), then per-address and instance-wide rate limits — every accepted
 * request is an email in someone's inbox.
 */
export const dynamic = "force-dynamic";

const BY_ADDRESS: Window = { limit: 5, windowMs: 10 * 60_000 };
const GLOBAL: Window = { limit: 60, windowMs: 10 * 60_000 };
/** A person cannot fill seven fields in under this. */
const MIN_FILL_MS = 2_500;

export async function POST(request: Request) {
  const parsed = await readJsonObject(request);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, reason: "malformed" }, { status: parsed.status });
  }
  const body = parsed.value;

  const honeypot = typeof body.company_site === "string" && body.company_site.trim() !== "";
  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 0;
  if (honeypot || elapsed < MIN_FILL_MS) {
    log.warn("form_lead_dropped", { workflow: WORKFLOW, error: honeypot ? "honeypot" : "too_fast" });
    return NextResponse.json({ ok: true, reference: null, notified: true });
  }

  const own = check(clientKey(request, "restaurant-review"), BY_ADDRESS);
  const all = check("restaurant-review:global", GLOBAL);
  const limited = !own.ok ? own : !all.ok ? all : null;
  if (limited) {
    log.warn("rate_limited", { workflow: WORKFLOW, error: own.ok ? "form_global" : "form_by_address" });
    return NextResponse.json(
      { ok: false, reason: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } },
    );
  }

  const outcome = parseLead(body);
  if (!outcome.ok) {
    return NextResponse.json({ ok: false, reason: "invalid", errors: outcome.errors }, { status: 400 });
  }

  const filed = await fileLead(outcome.lead);
  if (!filed.ok) {
    return NextResponse.json({ ok: false, reason: "failed" }, { status: 502 });
  }
  return NextResponse.json(filed, { headers: { "Cache-Control": "no-store" } });
}
