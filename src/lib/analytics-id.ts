/**
 * Which Google Analytics 4 property this deployment reports to, if any.
 *
 * Dependency-free on purpose: next.config.ts imports it to decide whether the
 * CSP must allow Google's origins, and lib/env.ts imports it for the browser.
 * The two must never disagree — a tag the CSP blocks fails silently, and a CSP
 * that allows Google with no tag installed is a hole for nothing.
 *
 * Resolution, mirroring how indexing is decided:
 *   NEXT_PUBLIC_ANALYTICS_ID=G-…    that property, on any origin
 *   NEXT_PUBLIC_ANALYTICS_ID=off    disabled, even on production
 *   unset                          the Serverlys property ONLY for a production
 *                                  build whose site URL is serverlys.com — so
 *                                  staging and `next dev` never pollute the
 *                                  real reports, and the live site needs no
 *                                  extra Easypanel variable to be measured.
 *
 * Inlined at BUILD time like every NEXT_PUBLIC_ value.
 */
export const SERVERLYS_GA4_ID = "G-2E9P7H997E";

const GA4_ID = /^G-[A-Z0-9]{4,}$/;

export function resolveAnalyticsId(env: {
  NEXT_PUBLIC_ANALYTICS_ID?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  NODE_ENV?: string;
}): string | undefined {
  const explicit = env.NEXT_PUBLIC_ANALYTICS_ID?.trim();
  if (explicit) {
    if (explicit.toLowerCase() === "off") return undefined;
    // A malformed ID would load gtag.js and report nowhere. Fail closed.
    return GA4_ID.test(explicit) ? explicit : undefined;
  }
  const site = (env.NEXT_PUBLIC_SITE_URL?.trim() || "https://serverlys.com").replace(/\/+$/, "");
  return env.NODE_ENV === "production" && site === "https://serverlys.com"
    ? SERVERLYS_GA4_ID
    : undefined;
}
