import { NextResponse } from "next/server";
import { checkPropagation, parseHostname } from "@/lib/dns/propagation";
import { RECORD_TYPES, type RecordType } from "@/lib/dns/wire";
import { clientKey, rateLimit } from "@/lib/domains/provider";

/**
 * DNS propagation check: GET /api/dns/propagation?domain=example.com&type=A
 *
 * Always dynamic and never cached — the answer is only worth anything if it
 * is from now. Rate limited on its own scope: one check sends ~50 queries to
 * resolvers that are not ours, and leaving that open would make this server a
 * free way to point traffic at them (and get our IP blocked by them, which
 * breaks the tool for everyone). The page's auto-refresh asks every 15s,
 * well inside the per-client budget.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const parsed = parseHostname(params.get("domain") ?? "");
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: "invalid", reason: parsed.message }, { status: 400 });
  }
  const type = (params.get("type") ?? "A").toUpperCase();
  if (!(RECORD_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json({ ok: false, error: "invalid", reason: "Pick a record type from the list." }, { status: 400 });
  }

  const limit = rateLimit(clientKey(request, "dns-propagation"));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "rateLimited", retryAfter: limit.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  try {
    const result = await checkPropagation(parsed.name, type as RecordType);
    return NextResponse.json({ ok: true, result }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
