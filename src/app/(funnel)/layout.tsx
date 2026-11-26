import { CookieConsent } from "@/components/consent/cookie-consent";
import {
  analyticsDisclosures,
  marketingDisclosures,
  marketingVendorNames,
  vendorNames,
} from "@/lib/analytics/config";
import { publicEnv } from "@/lib/env";

/**
 * Funnel pages (ad / search landing pages, e.g. /start).
 *
 * Deliberately WITHOUT the site header, mega-menu, promo ticker and footer:
 * a landing page converts on one action, and every nav link is an exit. The
 * cookie notice stays — ad traffic must be able to consent, or the pixel and
 * analytics never fire on the page the ads are paying for.
 */
export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable absolute left-4 top-4 z-[100] rounded-md bg-primary px-4 py-2 text-small font-medium text-white shadow-e3"
      >
        Skip to main content
      </a>
      <CookieConsent
        analyticsVendors={vendorNames(publicEnv.analytics)}
        analyticsItems={analyticsDisclosures(publicEnv.analytics)}
        marketingVendors={marketingVendorNames(publicEnv.analytics)}
        marketingItems={marketingDisclosures(publicEnv.analytics)}
      />
      <main id="main" className="flex-1">
        {children}
      </main>
    </>
  );
}
