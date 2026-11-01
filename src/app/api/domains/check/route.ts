import { NextResponse } from "next/server";
import { parseDomainInput } from "@/lib/domains/normalize";
import { checkDomains, clientKey, rateLimit, resolveProvider } from "@/lib/domains/provider";
import { domainProviderName } from "@/lib/env";
import { readJsonObject } from "@/lib/request";
import { getTldPricing } from "@/lib/domains/pricing";
import type { CheckOutcome, DomainResult } from "@/lib/domains/types";

/**
 * POST /api/domains/check
 *
 * Body: { query: string, tlds?: string[] }
 * Without `tlds`: availability for the searched name, then its name on every
 * extension in the WHMCS "Popular" category (the default tab on
 * /domain-name-results; falls back to the `suggest` set without categories).
 * With `tlds`: exactly those extensions for the searched name, no primary row —
 * how a category tab loads the extensions it has not checked yet. Unknown or
 * unsold extensions in `tlds` are ignored, so a client cannot widen the check.
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

/** Exact match + the Popular category (14 in WHMCS today), with headroom. */
const MAX_DOMAINS = 16;
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
  // Size-capped read: a plain request.json() buffers and parses any body,
  // however large, before a single check runs.
  const body = await readJsonObject(request);
  if (!body.ok) {
    return fail(
      {
        ok: false,
        error: {
          kind: "invalid",
          message: body.status === 413 ? body.reason : "Malformed request.",
        },
      },
      body.status,
    );
  }
  const query = body.value.query;
  const requestedTlds = body.value.tlds;
  if (
    requestedTlds !== undefined &&
    (!Array.isArray(requestedTlds) || requestedTlds.length > MAX_DOMAINS || requestedTlds.some((t) => typeof t !== "string"))
  ) {
    return fail({ ok: false, error: { kind: "invalid", message: "Malformed request." } }, 400);
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
  // Live WHMCS pricing (cached, data/tlds fallback): which TLDs are on sale,
  // which are suggested, and what each costs.
  const pricing = await getTldPricing();
  const tldSet = new Set(pricing.all.map((t) => t.tld));
  const livePrice = new Map(pricing.all.map((t) => [t.tld, t.price]));
  const popular = pricing.all.filter((t) => t.categories?.includes("Popular"));
  const suggestionTlds = (exclude: string) =>
    (popular.length ? popular : pricing.all.filter((t) => t.suggest)).filter((t) => t.tld !== exclude);

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
  const domains = Array.isArray(requestedTlds)
    ? parsed.sld.includes(".")
      ? []
      : [...new Set(requestedTlds.map((t) => t.toLowerCase()))]
          .filter((t) => tldSet.has(t))
          .map((t) => `${parsed.sld}${t}`)
          .slice(0, MAX_DOMAINS)
    : [primary, ...alternates].slice(0, MAX_DOMAINS);

  // ── Check ───────────────────────────────────────────────────────────────
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OVERALL_TIMEOUT_MS);
  // Abort upstream work if the client goes away mid-request.
  request.signal.addEventListener("abort", () => controller.abort(), { once: true });

  try {
    const checked = await checkDomains(provider, domains, controller.signal);
    // WHMCS rows carry the price WHMCS quoted for that lookup. RDAP-fallback
    // rows only know the static list, so re-price them from live pricing — and
    // a TLD WHMCS no longer sells is "unsupported", whatever the registry says.
    const results = checked.map((r): DomainResult => {
      if (r.source !== "rdap" || !r.tld) return r;
      const price = livePrice.get(r.tld);
      if (price === undefined) return { ...r, status: "unsupported", price: null };
      return { ...r, price };
    });
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
