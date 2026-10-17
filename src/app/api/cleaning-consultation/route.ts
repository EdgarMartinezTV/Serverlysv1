import { NextResponse } from "next/server";
import { clientKey } from "@/lib/domains/provider";
import { readJsonObject } from "@/lib/request";
import { check, type Window } from "@/lib/sera/rate-limit";
import { log } from "@/lib/sera/observability";
import { fileLead, parseLead, WORKFLOW } from "@/lib/leads/cleaning-consultation";

/**
 * POST /api/cleaning-consultation
 *
 * The consultation form on /cleaning-company-websites (and /es). Same abuse
 * controls as /api/restaurant-review, cheapest first: JSON only (forces a
 * CORS preflight, so other sites cannot post in a visitor's name), a body
 * cap, a honeypot and a minimum fill time (answered with a quiet 200), then
 * per-address and instance-wide rate limits.
 */
export const dynamic = "force-dynamic";

const BY_ADDRESS: Window = { limit: 5, windowMs: 10 * 60_000 };
const GLOBAL: Window = { limit: 60, windowMs: 10 * 60_000 };
/** Measured from when the form appeared, not the first keystroke (autofill). */
const MIN_FILL_MS = 3_000;

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ ok: false, reason: "malformed" }, { status: 415 });
  }
  const parsed = await readJsonObject(request);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, reason: "malformed" }, { status: parsed.status });
  }
  const body = parsed.value;

  const honeypot = typeof body.fax_number === "string" && body.fax_number.trim() !== "";
  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 0;
  if (honeypot || elapsed < MIN_FILL_MS) {
    log.warn("form_lead_dropped", { workflow: WORKFLOW, error: honeypot ? "honeypot" : "too_fast" });
    return NextResponse.json({ ok: true, reference: null, notified: true });
  }

  const own = check(clientKey(request, "cleaning-consultation"), BY_ADDRESS);
  const all = check("cleaning-consultation:global", GLOBAL);
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
  if (!filed.ok) return NextResponse.json({ ok: false, reason: "failed" }, { status: 502 });
  return NextResponse.json(filed, { headers: { "Cache-Control": "no-store" } });
}
