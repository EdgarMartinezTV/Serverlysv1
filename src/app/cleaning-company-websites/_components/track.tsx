"use client";

import { track, type AnalyticsEvent, type AnalyticsParams } from "@/lib/analytics";

/**
 * Fires an analytics event when anything inside is clicked, without turning
 * the children into client components. `display: contents` keeps it out of
 * layout. track() itself respects consent (lib/analytics).
 */
export function Track({ event, params, children }: { event: AnalyticsEvent; params?: AnalyticsParams; children: React.ReactNode }) {
  return (
    <span className="contents" onClickCapture={() => track(event, params)}>
      {children}
    </span>
  );
}
