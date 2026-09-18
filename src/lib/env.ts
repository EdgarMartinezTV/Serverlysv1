/**
 * Typed environment access.
 *
 * Hand-rolled rather than pulling in a validation library: there are a handful
 * of variables, all strings, and the check is a few lines. Server-only values
 * are read lazily so a missing optional variable never breaks the build.
 */

/** Values that are safe to expose to the browser. */
export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://serverlys.com",
  billingOrigin:
    process.env.NEXT_PUBLIC_BILLING_ORIGIN ?? "https://serverlys.com/billing",
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
