import { hasConsent } from "@/lib/consent";

/**
 * The ONE place the site sends analytics events. Nothing else may touch
 * `dataLayer`, `gtag` or `clarity` directly — call `track()`.
 *
 * Guarantees, enforced here rather than trusted to every call site:
 *
 *  · CONSENT. Nothing is forwarded unless the visitor accepted analytics. An
 *    event before that is dropped, not queued — queuing would send it the
 *    moment they accept, about a time they had not agreed to.
 *  · NO PERSONAL DATA. Params pass through `sanitize()`: only scalar values,
 *    known-sensitive keys dropped outright, and any value that looks like an
 *    email address or a phone number redacted. Google's terms forbid PII in
 *    GA, and Clarity session data is just as sensitive.
 *  · ONE TRANSPORT. With GTM, events go to the dataLayer and GTM routes them
 *    to GA4. Without GTM but with a GA4 ID, they go to gtag directly. Never
 *    both, so nothing is double counted.
 *
 * Every event is also dispatched in-page as a `serverlys:analytics`
 * CustomEvent, consent or not. It never leaves the document; it exists so the
 * wiring can be watched in DevTools:
 *   addEventListener("serverlys:analytics", e => console.log(e.detail))
 */

export type AnalyticsEvent =
  | "page_view"
  | "domain_search"
  | "select_hosting_plan"
  | "click_get_started"
  | "click_contact"
  | "click_phone"
  | "click_whatsapp"
  | "generate_lead"
  | "sign_up"
  | "begin_checkout"
  | "purchase"
  | "web_development_lead"
  | "seo_service_lead"
  | "ai_agent_lead"
  | "web_vitals";

export type AnalyticsParams = Record<string, string | number | boolean | undefined | null>;

export const ANALYTICS_DOM_EVENT = "serverlys:analytics";

/** Which transport the loader installed. Set by components/analytics. */
export type Transport = "gtm" | "gtag" | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
    __serverlysAnalytics?: Transport;
  }
}

/** Keys that are never sent, whatever their value. Matched case-insensitively. */
const SENSITIVE_KEY =
  /(e-?mail|phone|tel|mobile|name|first|last|surname|address|street|zip|postal|password|pass|card|cvv|cvc|iban|account|ssn|tax|vat|dob|birth|message|note|comment|body|ip)/i;

const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
// Seven or more digits, allowing the usual separators — catches phone numbers
// typed into a domain search or pasted into a label.
const PHONE = /(?:\+?\d[\s().-]*){7,}/;

/** Keys that are safe even though they match SENSITIVE_KEY. */
const ALLOWED_KEYS = new Set([
  "page_title",
  "plan_name",
  "item_name",
  "link_text",
  "metric_name",
  "domain_name",
]);

// URLs and opaque ids legitimately carry long digit runs (gclid, web-vitals ids).
const URL_KEYS = new Set(["page_location", "page_path", "link_path", "page_referrer", "metric_id"]);

export function sanitize(params: AnalyticsParams = {}): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, raw] of Object.entries(params)) {
    if (raw === undefined || raw === null) continue;
    if (!ALLOWED_KEYS.has(key) && SENSITIVE_KEY.test(key)) continue;
    if (typeof raw === "string") {
      const value = raw.trim().slice(0, URL_KEYS.has(key) ? 500 : 100);
      if (!value) continue;
      // URLs legitimately carry long digit runs (gclid, ids), so they skip the
      // phone check; cleanLocation() has already stripped free-text params.
      const phoneLike = !URL_KEYS.has(key) && PHONE.test(value);
      out[key] = EMAIL.test(value) || phoneLike ? "[redacted]" : value;
    } else if (typeof raw === "number") {
      if (Number.isFinite(raw)) out[key] = raw;
    } else {
      out[key] = raw;
    }
  }
  return out;
}

let lastKeys: string[] = [];

export function track(event: AnalyticsEvent, params?: AnalyticsParams): void {
  if (typeof window === "undefined") return;
  const clean = sanitize(params);

  window.dispatchEvent(new CustomEvent(ANALYTICS_DOM_EVENT, { detail: { event, params: clean } }));

  if (!hasConsent("analytics")) return;
  try {
    const transport = window.__serverlysAnalytics;
    if (transport === "gtm") {
      // GTM's data model is persistent: a key pushed once stays set for every
      // later event until overwritten. Blank the previous event's keys so a
      // click_phone never inherits the plan_name of an earlier plan click.
      const reset: Record<string, undefined> = {};
      for (const key of lastKeys) if (!(key in clean)) reset[key] = undefined;
      lastKeys = Object.keys(clean);
      window.dataLayer?.push({ ...reset, event, ...clean });
    } else if (transport === "gtag") {
      window.gtag?.("event", event, clean);
    }
    // Clarity custom events tag the recorded session, so a session that
    // produced a lead can be filtered for. Name only — no params.
    if (event !== "page_view" && event !== "web_vitals") window.clarity?.("event", event);
  } catch {
    // Analytics must never be able to break the page.
  }
}
