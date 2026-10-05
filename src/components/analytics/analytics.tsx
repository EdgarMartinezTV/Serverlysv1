"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { readConsent, readConsentRaw, subscribeConsent } from "@/lib/consent";
import { track } from "@/lib/analytics";
import { captureAttribution, persistAttribution } from "@/lib/analytics/attribution";
import { installClickTracking } from "@/lib/analytics/clicks";
import { hasAnyVendor, type AnalyticsConfig } from "@/lib/analytics/config";
import { cleanLocation, disableVendors, loadVendors } from "@/lib/analytics/vendors";

/**
 * The single analytics mount point, in the root layout. Renders nothing.
 *
 *  · Loads GTM (or gtag.js when there is no GTM) and Clarity — only after the
 *    visitor accepts analytics, and stops them if that is withdrawn.
 *  · Sends one `page_view` per route, including App Router navigations that
 *    never reload the page.
 *  · Reports Core Web Vitals (LCP, INP, CLS, FCP, TTFB) as `web_vitals`, so
 *    real-visitor performance lands next to the traffic it affects.
 *  · Installs the delegated click tracker and carries campaign attribution
 *    into WHMCS links. Those two run even when no vendor is configured: the
 *    attribution handoff is useful to WHMCS on its own, and track() is a
 *    no-op without a transport.
 *
 * `config` is resolved on the server from the build's environment
 * (lib/analytics/config.ts) and passed in, so this file holds no IDs.
 */
export function Analytics({ config }: { config: AnalyticsConfig }) {
  const pathname = usePathname();
  const raw = useSyncExternalStore(subscribeConsent, readConsentRaw, () => null);
  const lastPageView = useRef<string | null>(null);
  const enabled = hasAnyVendor(config);

  useEffect(() => installClickTracking(), []);

  // Consent changes: load, update or shut down the vendors.
  useEffect(() => {
    persistAttribution();
    if (!enabled) return;
    const consent = readConsent();
    if (consent?.analytics) {
      loadVendors(config, consent);
    } else {
      disableVendors(config);
      lastPageView.current = null;
    }
  }, [config, enabled, raw]);

  // One page_view per route, and one for the current page the moment consent
  // arrives. The key includes the query string so ?tab=… views stay distinct.
  useEffect(() => {
    captureAttribution();
    if (!enabled || !readConsent()?.analytics) return;
    const key = `${pathname}${window.location.search}`;
    if (lastPageView.current === key) return;
    // Next sets document.title for the new route just after commit. The key is
    // recorded only when the event actually goes: hydration re-runs this
    // effect (the consent snapshot goes from the server's null to the stored
    // value), and marking it sent before the timer fired lost the page_view of
    // every page loaded by someone who had already accepted.
    const timer = window.setTimeout(() => {
      lastPageView.current = key;
      track("page_view", {
        page_location: cleanLocation(),
        page_path: pathname,
        page_title: document.title,
      });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [pathname, enabled, raw]);

  // A STABLE callback: Next re-subscribes whenever its identity changes, and
  // web-vitals then replays every buffered metric — each re-render would
  // re-send FCP, LCP and the rest.
  useReportWebVitals(enabled ? reportVital : noop);

  return null;
}

function noop() {}

const sentVitals = new Set<string>();

function reportVital(metric: { id: string; name: string; value: number; rating?: string }) {
  // FID is retired in favour of INP; Next still reports it.
  if (metric.name === "FID") return;
  // Each distinct value once. A replay of an identical value is dropped; a
  // CLS or INP that grows reports again with its new value.
  const key = `${metric.id}:${metric.value}`;
  if (sentVitals.has(key)) return;
  sentVitals.add(key);
  track("web_vitals", {
    metric_name: metric.name,
    // CLS is a unitless score; GA wants integers for averaging.
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    metric_rating: metric.rating,
    metric_id: metric.id,
    page_path: window.location.pathname,
  });
}
