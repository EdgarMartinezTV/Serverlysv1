import { NextResponse } from "next/server";
import { lookupWhois } from "@/lib/domains/whois";

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

  const record = await lookupWhois(query);
  return NextResponse.json(
    { ok: true, record },
    { headers: { "Cache-Control": "no-store" } },
  );
}
