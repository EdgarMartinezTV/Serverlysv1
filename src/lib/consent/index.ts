/**
 * Cookie consent — state, storage and the gate that enforces it.
 *
 * ⚠ READ THIS BEFORE CHANGING THE COPY.
 *
 * Update 2026-10-05: GTM / GA4 / Microsoft Clarity can be installed
 * (components/analytics, lib/analytics), each behind hasConsent("analytics")
 * — none loads before an Accept, and only the ones the build configures. Everything
 * below about the ORIGINAL state still explains why the copy is worded as it is.
 *
 * As of 2026-09-11 this site sets NO cookies and loads NO third-party
 * trackers. Verified: no Set-Cookie header on any response, and no GA, GTM,
 * Meta pixel, Hotjar, Segment or similar anywhere in the source. The only
 * browser storage is localStorage for the announcement dismissal, the domain
 * shortlist, and the consent record below — all strictly functional, and
 * localStorage is not a cookie.
 *
 * So the banner does NOT say "we use cookies for ad targeting, personalization
 * and analytics". Saying that would be a false statement about this company's
 * data processing on its own website. Under GDPR/ePrivacy, misdescribing what
 * you process is itself the violation — claiming MORE than you do is not the
 * safe direction, it is just a different inaccuracy.
 *
 * What this is instead: the real mechanism, built and working, so the day
 * analytics or a pixel is added it is already gated. `hasConsent("analytics")`
 * must be true before any such script loads. Add the vendor to TRACKERS below
 * in the same commit that adds the script, and the copy stops being
 * hypothetical on its own.
 */

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type ConsentState = Record<ConsentCategory, boolean>;

/**
 * What is actually installed, per category.
 *
 * Marketing is EMPTY. Analytics is empty here too, because whether it is in
 * use depends on the build (lib/analytics/config.ts): `trackersFor()` adds
 * each configured vendor via analyticsDisclosures(). The settings panel reads the result and
 * says "nothing in this category is in use" rather than implying otherwise.
 * Never leave a vendor out of this list — it is what the user is shown.
 */
export const TRACKERS: Record<ConsentCategory, readonly string[]> = {
  necessary: [
    "Announcement bar dismissal (localStorage)",
    "Domain search shortlist (localStorage)",
    "Your choice on this panel (localStorage)",
    "Billing sign-in session (cookie, set by WHMCS on the billing area)",
  ],
  analytics: [],
  marketing: [],
};

export function trackersFor(
  analytics: readonly string[],
): Record<ConsentCategory, readonly string[]> {
  return analytics.length ? { ...TRACKERS, analytics } : TRACKERS;
}

/**
 * Bump when the CATEGORIES or what they cover materially change — consent to
 * an old description is not consent to a new one, and a stored "accept all"
 * must not silently carry over to a vendor added later.
 */
// 2026-10-05: analytics vendors (GTM, GA4, Clarity) added to the analytics category.
export const CONSENT_VERSION = "2026-10-05";
export const CONSENT_KEY = `serverlys.consent.${CONSENT_VERSION}`;

/** Necessary is always on: without it the site cannot function, so it is not a choice. */
export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export const ACCEPT_ALL: ConsentState = {
  necessary: true,
  analytics: true,
  marketing: true,
};

/**
 * Raw stored value, for `useSyncExternalStore`. Returns the string rather than
 * a parsed object on purpose: the snapshot must be referentially stable
 * between renders or React re-renders forever, and a fresh object every call
 * is exactly that bug.
 */
export function readConsentRaw(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

/** Subscribe to changes made in this tab or another one. */
export function subscribeConsent(onChange: () => void): () => void {
  window.addEventListener("consentchange", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("consentchange", onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function readConsent(): ConsentState | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      necessary: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    };
  } catch {
    // Safari private mode throws on read as well as write. An unreadable
    // choice is treated as no choice, which fails closed: nothing optional
    // loads and the banner asks again.
    return null;
  }
}

export function writeConsent(state: ConsentState): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  } catch {
    /* private mode — the choice still applies for this page view */
  }
  document.documentElement.dataset.consent = "set";
  window.dispatchEvent(new CustomEvent<ConsentState>("consentchange", { detail: state }));
}

/**
 * The gate. Any optional script must be behind this — it is the whole point of
 * the mechanism, and a banner whose answer nothing reads is decoration.
 */
export function hasConsent(category: ConsentCategory): boolean {
  if (category === "necessary") return true;
  if (typeof window === "undefined") return false;
  return readConsent()?.[category] === true;
}
