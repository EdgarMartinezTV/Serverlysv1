/**
 * Which analytics vendors this BUILD has, resolved once from the environment.
 *
 * Dependency-free on purpose: next.config.ts imports it to build the CSP and
 * the root layout imports it to decide what to mount. The two must agree — a
 * tag the CSP blocks fails silently, and a CSP that allows a vendor with no
 * tag installed is a hole for nothing.
 *
 * IDs come ONLY from the environment. Nothing is hardcoded: an absent or
 * malformed ID means that vendor is off, never a fallback to some default.
 *
 * Whether anything loads at all:
 *   NEXT_PUBLIC_ANALYTICS_ENABLED=true   on, wherever this build runs
 *   NEXT_PUBLIC_ANALYTICS_ENABLED=false  off, even on production
 *   unset                                on ONLY for a production build whose
 *                                        site URL is https://serverlys.com — so
 *                                        `next dev` and staging never pollute
 *                                        the real reports.
 *
 * And even when on, NOTHING loads in a visitor's browser until they accept the
 * analytics category in the cookie banner (components/analytics).
 *
 * All values are NEXT_PUBLIC_, so they are inlined at BUILD time: on Easypanel
 * they must be present when the image is built (see Dockerfile ARGs).
 */

type Env = Record<string, string | undefined>;

export type AnalyticsConfig = {
  /** GTM container. When set, GA4 is configured INSIDE GTM, not loaded here. */
  gtmId?: string;
  /**
   * GA4 measurement ID. With GTM, it is only handed to GTM through the
   * dataLayer (`ga_measurement_id`) so the GTM tag can reference it. Without
   * GTM, gtag.js is loaded directly with it — never both, or every hit counts
   * twice.
   */
  gaId?: string;
  clarityId?: string;
};

const PATTERNS = {
  gtm: /^GTM-[A-Z0-9]{4,}$/,
  ga: /^G-[A-Z0-9]{4,}$/,
  clarity: /^[a-z0-9]{6,20}$/,
};

const PRODUCTION_ORIGIN = "https://serverlys.com";

function pick(value: string | undefined, pattern: RegExp): string | undefined {
  const v = value?.trim();
  // A malformed ID would load a vendor script that reports nowhere. Fail closed.
  return v && pattern.test(v) ? v : undefined;
}

export function analyticsEnabled(env: Env): boolean {
  const flag = env.NEXT_PUBLIC_ANALYTICS_ENABLED?.trim().toLowerCase();
  if (flag === "true") return true;
  if (flag === "false") return false;
  const site = (env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_ORIGIN).replace(/\/+$/, "");
  return env.NODE_ENV === "production" && site === PRODUCTION_ORIGIN;
}

export function resolveAnalytics(env: Env): AnalyticsConfig {
  if (!analyticsEnabled(env)) return {};
  return {
    gtmId: pick(env.NEXT_PUBLIC_GTM_ID, PATTERNS.gtm),
    gaId: pick(env.NEXT_PUBLIC_GA_MEASUREMENT_ID, PATTERNS.ga),
    clarityId: pick(env.NEXT_PUBLIC_CLARITY_PROJECT_ID, PATTERNS.clarity),
  };
}

/** True when any vendor will load — used to word the cookie banner honestly. */
export function hasAnyVendor(config: AnalyticsConfig): boolean {
  return Boolean(config.gtmId || config.gaId || config.clarityId);
}

/**
 * CSP source lists each vendor needs. Only the vendors this build actually
 * loads are added, and next.config.ts appends them to its directives.
 */
export function analyticsCspSources(config: AnalyticsConfig) {
  const script: string[] = [];
  const connect: string[] = [];
  const img: string[] = [];
  const style: string[] = [];
  const font: string[] = [];

  const google = config.gtmId || config.gaId;
  if (google) {
    script.push("https://www.googletagmanager.com");
    // GA4 beacons go to region-specific hosts, hence the wildcards.
    connect.push(
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://*.googletagmanager.com",
    );
    img.push("https://*.google-analytics.com", "https://*.googletagmanager.com");
  }
  if (config.gtmId) {
    // GTM's Preview/debug mode (Tag Assistant) injects its own UI.
    script.push("https://tagmanager.google.com");
    style.push("https://tagmanager.google.com", "https://fonts.googleapis.com");
    img.push("https://ssl.gstatic.com", "https://www.gstatic.com");
    font.push("https://fonts.gstatic.com");
  }
  if (config.clarityId) {
    script.push("https://www.clarity.ms", "https://*.clarity.ms");
    connect.push("https://*.clarity.ms");
    img.push("https://*.clarity.ms", "https://c.bing.com");
  }
  return { script, connect, img, style, font };
}

/** Vendor names for the banner and policies, from what this build loads. */
export function vendorNames(config: AnalyticsConfig): string[] {
  const names: string[] = [];
  // With GTM, GA4 is the tag it carries (docs/SEO-ANALYTICS-SETUP.md).
  if (config.gtmId || config.gaId) names.push("Google Analytics");
  if (config.clarityId) names.push("Microsoft Clarity");
  return names;
}

/** What the cookie panel lists under Analytics. Never leave a vendor out. */
export function analyticsDisclosures(config: AnalyticsConfig): string[] {
  const items: string[] = [];
  if (config.gtmId) items.push("Google Tag Manager (loads the analytics below; sets no cookies of its own)");
  if (config.gtmId || config.gaId) items.push("Google Analytics 4 (_ga and _ga_* cookies, which expire after 2 years)");
  if (config.clarityId) {
    items.push(
      "Microsoft Clarity — heatmaps and session recordings, with what you type masked (_clck cookie for 1 year, _clsk for 1 day)",
    );
  }
  if (items.length) {
    items.push("The campaign link you arrived from, kept for this tab so a purchase can be credited to it (sessionStorage)");
  }
  return items;
}
