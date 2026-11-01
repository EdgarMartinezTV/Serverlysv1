import { SiteHeader } from "@/components/navigation/site-header";
import { AnnouncementBar } from "@/components/navigation/announcement-bar";
import { PromoTicker } from "@/components/navigation/promo-ticker";
import { CookieConsent } from "@/components/consent/cookie-consent";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  analyticsDisclosures,
  marketingDisclosures,
  marketingVendorNames,
  vendorNames,
} from "@/lib/analytics/config";
import { publicEnv } from "@/lib/env";
import { t } from "@/i18n/t";

/**
 * Everything around a page that speaks a language: skip link, cookie notice,
 * promo ticker, announcement bar, header, <main>, footer. Rendered by the
 * language layouts (app/(en)/layout.tsx, app/es/layout.tsx) — moved out of the
 * root layout on 2026-11-01 so /es pages get Spanish chrome. Its text goes
 * through t(), which is a no-op on English pages.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Keyboard users must be able to bypass the nav. Visible on focus. */}
      <a
        href="#main"
        className="sr-only-focusable absolute left-4 top-4 z-[100] rounded-md bg-primary px-4 py-2 text-small font-medium text-white shadow-e3"
      >
        {t("Skip to main content")}
      </a>

      {/*
        * Cookie notice FIRST in the body (2026-11-01). It is position:fixed, so
        * DOM order does not move it on screen — but it does decide WHEN it
        * paints. At the end of a ~240KB page it arrived last on slow mobile
        * connections and, being the largest text block in the viewport (the
        * Black Friday H1 is two short words), it became the mobile LCP at the
        * very end of the load: Lighthouse mobile 83, LCP 3.7s, 83% "render
        * delay". Here it paints with the first chunk of HTML. Returning
        * visitors are unaffected: the blocking consent script still hides it
        * before first paint.
        */}
      <CookieConsent
        analyticsVendors={vendorNames(publicEnv.analytics)}
        analyticsItems={analyticsDisclosures(publicEnv.analytics)}
        marketingVendors={marketingVendorNames(publicEnv.analytics)}
        marketingItems={marketingDisclosures(publicEnv.analytics)}
      />

      <PromoTicker />
      <AnnouncementBar />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
