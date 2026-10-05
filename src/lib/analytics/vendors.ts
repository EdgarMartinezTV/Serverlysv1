import type { AnalyticsConfig } from "./config";
import type { ConsentState } from "@/lib/consent";

/**
 * Vendor loaders. Called ONLY by components/analytics after the visitor has
 * accepted analytics — never at import time, never before consent.
 *
 * Each loader is idempotent (module flag + a DOM check), so React Strict Mode,
 * Fast Refresh, a second consent event or a remount cannot inject a script
 * twice.
 *
 * GTM's <noscript> iframe is deliberately NOT rendered. It loads for every
 * visitor without JavaScript, before — and regardless of — any consent
 * answer, which is exactly what the cookie policy promises does not happen.
 */

const loaded = { gtm: false, gtag: false, clarity: false };

function inject(src: string): void {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

/** gtag() is only a dataLayer queue; GTM and gtag.js both read it. */
function ensureGtag(): (...args: unknown[]) => void {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // Google's libraries read the `arguments` object itself, not an array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  return window.gtag;
}

function consentSignals(consent: ConsentState) {
  const ads = consent.marketing ? "granted" : "denied";
  return {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  };
}

/** The page URL without query values that could identify someone. */
export function cleanLocation(): string {
  const url = new URL(window.location.href);
  for (const key of [...url.searchParams.keys()]) {
    // `domain` is the domain-search box, `query` the WHOIS box: free text.
    if (key === "domain" || key === "query" || key === "email" || key === "q") {
      url.searchParams.delete(key);
    }
  }
  return url.toString();
}

export function loadVendors(config: AnalyticsConfig, consent: ConsentState): void {
  if (config.gtmId) {
    const gtag = ensureGtag();
    if (!loaded.gtm) {
      loaded.gtm = true;
      gtag("consent", "default", consentSignals(consent));
      // Handed to GTM so its Google tag can use {{DLV - ga_measurement_id}}
      // rather than a second copy of the ID typed into the GTM UI.
      window.dataLayer!.push({
        ga_measurement_id: config.gaId,
        page_location_clean: cleanLocation(),
      });
      window.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });
      inject(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmId)}`);
    } else {
      gtag("consent", "update", consentSignals(consent));
    }
    window.__serverlysAnalytics = "gtm";
  } else if (config.gaId) {
    // Fallback ONLY when there is no GTM container — never both.
    const gtag = ensureGtag();
    (window as unknown as Record<string, unknown>)[`ga-disable-${config.gaId}`] = false;
    if (!loaded.gtag) {
      loaded.gtag = true;
      gtag("consent", "default", consentSignals(consent));
      gtag("js", new Date());
      // page_view is sent by the route tracker so client navigations count
      // exactly once; GA's own automatic one would double the first page.
      gtag("config", config.gaId, { send_page_view: false, page_location: cleanLocation() });
      inject(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.gaId)}`);
    } else {
      gtag("consent", "update", consentSignals(consent));
    }
    window.__serverlysAnalytics = "gtag";
  }

  if (config.clarityId && !loaded.clarity) {
    loaded.clarity = true;
    const c = function clarity(...args: unknown[]) {
      (c.q = c.q || []).push(args);
    } as NonNullable<Window["clarity"]>;
    window.clarity = window.clarity || c;
    inject(`https://www.clarity.ms/tag/${encodeURIComponent(config.clarityId)}`);
  }
  // Clarity consent API v2: cookies only with analytics consent, no ads use.
  window.clarity?.("consentv2", {
    ad_Storage: consent.marketing ? "granted" : "denied",
    analytics_Storage: "granted",
  });
}

const GOOGLE_COOKIES = (name: string) => name === "_ga" || name.startsWith("_ga_") || name === "_gid";
const CLARITY_COOKIES = new Set(["_clck", "_clsk", "CLID", "ANONCHK", "MR", "MUID", "SM"]);

function deleteCookies(match: (name: string) => boolean): void {
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => n && match(n));
  if (names.length === 0) return;
  // Vendors write on the widest domain they can (".serverlys.com"), so try
  // every suffix of the hostname plus host-only.
  const parts = location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; domain=.${parts.slice(i).join(".")}`);
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

/**
 * Consent withdrawn (or never given). Loaded scripts cannot be unloaded from
 * a page, so: tell every vendor consent is denied, flip GA's documented
 * kill switch, stop routing events, and delete their cookies. On the next
 * page load nothing is fetched at all.
 *
 * Also runs for a visitor who never loaded anything this page view — someone
 * who accepted last week and rejects today still has cookies to clear.
 */
export function disableVendors(config: AnalyticsConfig): void {
  window.__serverlysAnalytics = null;
  if (config.gaId) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${config.gaId}`] = true;
  }
  if (loaded.gtm || loaded.gtag) {
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
  if (loaded.clarity) {
    window.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
  }
  deleteCookies(GOOGLE_COOKIES);
  if (config.clarityId) deleteCookies((n) => CLARITY_COOKIES.has(n));
}
