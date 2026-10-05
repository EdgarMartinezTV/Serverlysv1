"use client";

import { useEffect, useSyncExternalStore } from "react";
import { readConsent, readConsentRaw, subscribeConsent } from "@/lib/consent";

/**
 * Google Analytics 4, loaded ONLY after the visitor accepts analytics.
 *
 * The cookie policy promises "rejecting means it is never loaded at all — not
 * loaded-and-told-not-to-record". So this is not Consent Mode with denied
 * defaults (which still loads gtag.js and pings Google cookielessly): before
 * an Accept, not one byte is requested from Google.
 *
 * Withdrawal: gtag.js cannot be unloaded from a page, so rejecting later sets
 * Google's documented `ga-disable-<ID>` kill switch, which stops every further
 * hit, and deletes the _ga cookies. On the next page load nothing is fetched.
 *
 * Page views: GA4's enhanced measurement counts history-API navigations, which
 * is how App Router moves between pages, so no route listener is needed here.
 *
 * Advertising signals stay denied regardless — the site does not run ads, and
 * the policy says so.
 *
 * CSP: next.config.ts allows Google's origins only when an ID resolves, from
 * the same lib/analytics-id.ts this ID comes from.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loadedId: string | null = null;

function load(id: string) {
  (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = false;
  if (loadedId === id) return;
  loadedId = id;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js reads the `arguments` object itself, not an array — this exact
    // shape is what Google's snippet pushes.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", id);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  // Sera's events were built to land here — lib/sera/analytics.ts already
  // gates the sink on the same consent.
  window.seraAnalytics = (event, props) => window.gtag?.("event", event, props);
}

function disable(id: string) {
  (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true;
  window.seraAnalytics = undefined;

  // GA writes its cookies on the widest domain it can (".serverlys.com"), so
  // try every suffix of the hostname plus host-only.
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => n === "_ga" || n.startsWith("_ga_"));
  if (names.length === 0) return;
  const parts = location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) {
    domains.push(`; domain=.${parts.slice(i).join(".")}`);
  }
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

export function GoogleAnalytics({ id }: { id: string }) {
  // Re-render on any consent change, in this tab or another one.
  const raw = useSyncExternalStore(subscribeConsent, readConsentRaw, () => null);

  useEffect(() => {
    // Not only after an in-page load: someone who accepted last week and
    // rejects today on a fresh page still has _ga cookies to clear.
    if (readConsent()?.analytics) load(id);
    else disable(id);
  }, [id, raw]);

  return null;
}
