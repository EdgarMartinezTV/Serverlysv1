/**
 * Typed environment access.
 *
 * Hand-rolled rather than pulling in a validation library: there are a handful
 * of variables, all strings, and the check is a few lines. Server-only values
 * are read lazily so a missing optional variable never breaks the build.
 */

/**
 * The brand's permanent public origin. The ONLY place this literal is allowed
 * outside of copy: everything SEO-shaped (canonicals, og:url, JSON-LD @ids,
 * sitemap, robots) derives from `publicEnv.siteUrl`, which defaults to it.
 */
export const PRODUCTION_ORIGIN = "https://serverlys.com";

/** No trailing slash, ever — `canonical()` appends paths to this verbatim. */
const normalizeOrigin = (value: string | undefined) =>
  (value?.trim() || PRODUCTION_ORIGIN).replace(/\/+$/, "");

const siteUrl = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);

/** Values that are safe to expose to the browser. */
export const publicEnv = {
  siteUrl,
  /**
   * WHMCS — a TRANSACTIONAL origin, deliberately independent of `siteUrl`.
   * Staging still checks out on the live store; rewriting this to the staging
   * hostname would 404 every cart and login.
   */
  billingOrigin: normalizeOrigin(
    process.env.NEXT_PUBLIC_BILLING_ORIGIN ?? `${PRODUCTION_ORIGIN}/billing`,
  ),
  /**
   * Whether search engines may index this deployment.
   *
   * Default: only when `siteUrl` IS the production origin. A staging copy that
   * is indexable competes with production for the same queries.
   *
   * `NEXT_PUBLIC_ALLOW_INDEXING=true` opts a non-production origin in — e.g. a
   * staging host that is temporarily the public face. Its canonicals then
   * point at ITSELF (they derive from `siteUrl`), so there is never a
   * cross-host canonical conflict; when the brand domain goes live, 301 the
   * old host to it. `=false` forces noindex even on production.
   */
  allowIndexing:
    process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" ||
    (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false" &&
      siteUrl === PRODUCTION_ORIGIN),
} as const;

/**
 * Search-engine ownership verification tokens.
 *
 * Without one of these there is no Search Console property, and without a
 * Search Console property there is no way to submit the sitemap, see which
 * queries the site already surfaces for, request indexing after a change, or
 * find out that Google has stopped crawling something. That makes this the one
 * piece of SEO plumbing that is not optional — every other signal on the site
 * is invisible until it exists.
 *
 * Read at module scope (not lazily) because Next needs them while building the
 * static <head>. Both are absent by default, and an absent token emits no tag
 * at all rather than an empty one — an empty verification meta is a failed
 * verification, not a neutral one.
 *
 * These are NOT secrets: the whole point is that they are published in the
 * page. They live here instead of being hardcoded so staging never claims
 * ownership of the production property.
 */
export const verification = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
} as const;

/**
 * How the deployment learns a visitor's address.
 *
 * ⚠ EVERY FORWARDING HEADER IS ATTACKER-CONTROLLED UNTIL A PROXY OVERWRITES IT.
 * A header is not evidence of anything on its own — `curl -H "X-Real-IP: …"`
 * sets it as easily as Traefik does. What makes a value trustworthy is knowing
 * exactly WHO wrote it, and that is a fact about the deployment topology that
 * only the operator can supply. Hence configuration rather than a guess.
 *
 * `TRUSTED_CLIENT_IP_HEADER` — set this when a CDN terminates the connection
 * and stamps a single authoritative address. Cloudflare writes
 * `cf-connecting-ip` at its edge and strips any inbound copy, so it cannot be
 * forged THROUGH Cloudflare. It can still be forged by anyone who reaches the
 * origin directly, which is why locking the origin to the CDN's ranges is part
 * of using this, not an optional extra.
 *
 * `TRUSTED_PROXY_HOPS` — how many proxies sit in front of the app. Used to
 * index `X-Forwarded-For` FROM THE RIGHT. Each proxy APPENDS the address it
 * observed, so with one proxy the rightmost entry was written by our own
 * Traefik and everything to its left is caller-supplied noise. Default 1,
 * matching the Easypanel/Traefik deployment. Raise it if a hop is ever added —
 * counting wrong silently reopens a bypass.
 *
 * Deliberately NOT supported: `x-real-ip` as a trusted source. It carries a
 * single value with no append semantics, so there is no position in it that is
 * known to have been written by our proxy rather than by the caller. It is
 * indistinguishable from a request that simply set it, which is exactly the
 * bypass this configuration exists to close.
 */
export function clientIpSource() {
  const header = process.env.TRUSTED_CLIENT_IP_HEADER?.trim().toLowerCase();
  const parsed = Number.parseInt(process.env.TRUSTED_PROXY_HOPS ?? "", 10);
  return {
    /** A single authoritative header (CDN), or null to use X-Forwarded-For. */
    header: header || null,
    /** Clamped: 0 would read caller-supplied data, and no sane chain is > 8. */
    hops: Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 8) : 1,
  } as const;
}

/**
 * WHMCS admin API credentials. Server-only — these must never reach the client
 * bundle, which is why they are read inside a function and have no
 * NEXT_PUBLIC_ prefix.
 */
export function whmcsConfig() {
  const url = process.env.WHMCS_API_URL;
  const identifier = process.env.WHMCS_API_IDENTIFIER;
  const secret = process.env.WHMCS_API_SECRET;
  if (!url || !identifier || !secret) return null;
  return { url, identifier, secret } as const;
}

/** Which availability provider the deployment is configured to use. */
export function domainProviderName(): "whmcs" | "rdap" | "none" {
  const forced = process.env.DOMAIN_PROVIDER;
  if (forced === "whmcs" || forced === "rdap" || forced === "none") return forced;
  if (whmcsConfig()) return "whmcs";
  // RDAP needs no credentials and returns real registration status, so it is
  // the default rather than a fake provider. See lib/domains/rdap.ts.
  return "rdap";
}
