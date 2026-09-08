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
