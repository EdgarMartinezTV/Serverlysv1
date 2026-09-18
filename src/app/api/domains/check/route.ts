import { NextResponse } from "next/server";
import { parseDomainInput } from "@/lib/domains/normalize";
import { checkDomains, clientKey, rateLimit, resolveProvider } from "@/lib/domains/provider";
import { domainProviderName } from "@/lib/env";
import { suggestionTlds, tldSet } from "@/data/tlds";
import type { CheckOutcome } from "@/lib/domains/types";

/**
 * POST /api/domains/check
 *
 * Body: { query: string }
 * Returns availability for the searched name plus alternate TLDs.
 *
 * This route exists because an in-page search cannot be done from the browser:
 * WHMCS admin credentials must stay server-side, and calling RDAP from the
 * client would leak per-user rate limits and hit CORS. It is the ONLY route
 * handler on the site besides /api/health, and it reads no user data.
 *
 * Always dynamic: results are time-sensitive and must never be cached at the
 * route level. The provider layer does its own short-TTL caching.
 */
export const dynamic = "force-dynamic";

const MAX_DOMAINS = 8;
/** Whole-request budget. Individual provider calls time out sooner. */
const OVERALL_TIMEOUT_MS = 12_000;

function fail(
  error: CheckOutcome & { ok: false },
  status: number,
  headers?: HeadersInit,
) {
  return NextResponse.json(error, { status, headers });
}

export async function POST(request: Request) {
  // ── Input ───────────────────────────────────────────────────────────────
  let query: unknown;
  try {
    const body = await request.json();
    query = (body as { query?: unknown })?.query;
  } catch {
    return fail(
      { ok: false, error: { kind: "invalid", message: "Malformed request." } },
      400,
    );
  }

  if (typeof query !== "string" || query.length > 255) {
    return fail(
      {
        ok: false,
        error: { kind: "invalid", message: "Enter a domain name to search." },
      },
      400,
    );
  }

  const parsed = parseDomainInput(query);
  if (!parsed.ok) {
    return fail(
      { ok: false, error: { kind: "invalid", message: parsed.message } },
      400,
    );
  }

  // ── Rate limit ──────────────────────────────────────────────────────────
  const limit = rateLimit(clientKey(request, "check"));
  if (!limit.ok) {
    return fail(
      {
        ok: false,
        error: {
          kind: "rate_limited",
          message: "Too many searches. Try again in a moment.",
          retryAfterSeconds: limit.retryAfterSeconds,
        },
      },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  // ── Provider ────────────────────────────────────────────────────────────
  const provider = resolveProvider();
  if (!provider) {
    // Deliberate: no mock fallback. A fabricated "available" would send someone
    // to checkout for a name they cannot buy.
    return fail(
      {
        ok: false,
        error: {
          kind: "unconfigured",
          message:
            "Domain search is not configured on this deployment. Set WHMCS_API_URL, WHMCS_API_IDENTIFIER and WHMCS_API_SECRET, or DOMAIN_PROVIDER=rdap.",
        },
      },
      503,
    );
  }

  // ── Build the candidate list ────────────────────────────────────────────
  // The exact match first, so the primary answer is always row one.
  const primaryTld = parsed.tld && tldSet.has(parsed.tld) ? parsed.tld : ".com";
  const primary = `${parsed.sld}${parsed.tld ?? primaryTld}`;

  // Alternates are only meaningful for a single-label name. For "example.co.uk"
  // the parser hands back sld "example.co" (we do not sell .co.uk, so the
  // longest-suffix match cannot fire), and appending our TLDs to that produced
  // "example.co.com" — a name nobody searched for and nobody wants. When the
  // SLD carries a dot, answer the exact question and suggest nothing.
  const alternates = parsed.sld.includes(".")
    ? []
    : suggestionTlds(parsed.tld ?? primaryTld).map((t) => `${parsed.sld}${t.tld}`);
  const domains = [primary, ...alternates].slice(0, MAX_DOMAINS);

  // ── Check ───────────────────────────────────────────────────────────────
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OVERALL_TIMEOUT_MS);
  // Abort upstream work if the client goes away mid-request.
  request.signal.addEventListener("abort", () => controller.abort(), { once: true });

  try {
    const results = await checkDomains(provider, domains, controller.signal);
    const outcome: CheckOutcome = { ok: true, results, source: provider.name };
    return NextResponse.json(outcome, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    return fail(
      {
        ok: false,
        error: aborted
          ? { kind: "timeout", message: "The lookup took too long. Try again." }
          : { kind: "provider", message: "The lookup failed. Try again." },
      },
      aborted ? 504 : 502,
    );
  } finally {
    clearTimeout(timeout);
  }
}

/** Surfaced for diagnostics; never exposes credentials. */
export async function GET() {
  return NextResponse.json({
    provider: domainProviderName(),
    configured: resolveProvider() !== null,
  });
}
