import { NextResponse } from "next/server";
import { lookupWhois } from "@/lib/domains/whois";
import { clientKey, rateLimit } from "@/lib/domains/provider";

/**
 * Registration lookup endpoint.
 *
 * Always dynamic: registry records change, and a cached WHOIS answer is a
 * wrong WHOIS answer. GET rather than POST because the lookup is a read with
 * no side effects, which also makes it trivially testable with curl.
 */
export const dynamic = "force-dynamic";

const MAX_LENGTH = 253; // RFC 1035 maximum domain name length.

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("domain")?.trim() ?? "";

  if (!query) {
    return NextResponse.json(
      { ok: false, reason: "Enter a domain name to look up." },
      { status: 400 },
    );
  }
  if (query.length > MAX_LENGTH) {
    return NextResponse.json(
      { ok: false, reason: "That is longer than a domain name can be." },
      { status: 400 },
    );
  }

  /*
   * Rate limit. This endpoint had none, while /api/domains/check next door did
   * — and this is the one that is trivially abusable: unauthenticated, GET, and
   * every call makes an outbound request to rdap.org on our behalf. Left open
   * it is free amplification, and the realistic damage is not our bandwidth but
   * rdap.org blocking this server's IP, which takes the WHOIS feature down for
   * everyone.
   *
   * Scoped to "whois" so it has its own budget rather than sharing one with the
   * domain search — a visitor doing a lot of searching should not be locked out
   * of a lookup, and vice versa.
   */
  const limit = rateLimit(clientKey(request, "whois"));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, reason: "Too many lookups. Try again in a moment." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const record = await lookupWhois(query);
  return NextResponse.json(
    { ok: true, record },
    { headers: { "Cache-Control": "no-store" } },
  );
}
