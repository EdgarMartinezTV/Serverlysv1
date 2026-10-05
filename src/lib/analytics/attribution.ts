import { hasConsent } from "@/lib/consent";
import { publicEnv } from "@/lib/env";

/**
 * Campaign attribution carried from serverlys.com into WHMCS.
 *
 * A visitor lands on /cloud-hosting?utm_source=google&gclid=…, reads three
 * pages, then clicks "Choose plan". Without this, the WHMCS URL they arrive at
 * carries none of it, and whatever measures the purchase over there has no
 * idea the sale came from a campaign.
 *
 * Storage, and why it is split:
 *  · IN MEMORY, always. App Router navigation never reloads the page, so a
 *    module variable survives every client-side page change. Nothing is
 *    written to the device, so it needs no consent — it is the URL the
 *    visitor arrived on, handed along to the next page of the same journey.
 *  · sessionStorage, ONLY with analytics or marketing consent. That survives a
 *    full reload or a new tab within the session, and because it IS storage on
 *    the device it is listed in the cookie panel and gated like one.
 *
 * Last touch wins: a later campaign URL in the same session replaces the
 * earlier one wholesale, so a utm_source is never paired with another
 * campaign's gclid.
 */

export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
] as const;

type Attribution = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>>;

const STORAGE_KEY = "serverlys.attribution";
let current: Attribution | null = null;

function fromSearch(search: string): Attribution | null {
  const params = new URLSearchParams(search);
  const found: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key)?.trim();
    // Bounded: these go into a URL and nothing legitimate is longer.
    if (value) found[key] = value.slice(0, 200);
  }
  return Object.keys(found).length ? found : null;
}

function mayPersist(): boolean {
  return hasConsent("analytics") || hasConsent("marketing");
}

/** Read the landing URL (and any earlier consented copy). Call on every navigation. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const fresh = fromSearch(window.location.search);
  if (fresh) current = fresh;
  if (!current) {
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (saved) current = JSON.parse(saved) as Attribution;
    } catch {
      /* private mode or malformed — memory only */
    }
  }
  persistAttribution();
}

/** Write or clear the sessionStorage copy to match the current consent. */
export function persistAttribution(): void {
  try {
    if (current && mayPersist()) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } else if (!mayPersist()) {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* storage unavailable — memory still works for this tab */
  }
}

/** Whether a URL points into WHMCS (billingOrigin, e.g. https://serverlys.com/billing). */
export function isBillingUrl(url: URL): boolean {
  const billing = new URL(publicEnv.billingOrigin);
  return (
    url.origin === billing.origin &&
    (url.pathname === billing.pathname || url.pathname.startsWith(`${billing.pathname}/`))
  );
}

/**
 * Add the stored attribution to a WHMCS URL. Parameters already on the URL
 * win — a link that deliberately sets its own utm_* is not overwritten.
 */
export function withAttribution(href: string): string {
  if (!current) return href;
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return href;
  }
  if (!isBillingUrl(url)) return href;
  let changed = false;
  for (const [key, value] of Object.entries(current)) {
    if (value && !url.searchParams.has(key)) {
      url.searchParams.set(key, value);
      changed = true;
    }
  }
  return changed ? url.toString() : href;
}

/** For tests and the setup doc. */
export function currentAttribution(): Attribution | null {
  return current;
}
