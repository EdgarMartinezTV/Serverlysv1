import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { company } from "@/data/company";
import { verification } from "@/lib/env";
import { organizationGraph } from "@/lib/seo";
import { JsonLd } from "@/components/ui/json-ld";
import { SiteHeader } from "@/components/navigation/site-header";
import { AnnouncementBar } from "@/components/navigation/announcement-bar";
import { CookieConsent } from "@/components/consent/cookie-consent";
import { SeraRoot } from "@/components/sera/sera-root";
import { SiteFooter } from "@/components/layout/site-footer";
import { announcement } from "@/data/navigation";
import { CONSENT_KEY } from "@/lib/consent";
import "./globals.css";

/** Must match ANNOUNCEMENT_KEY in dismiss-announcement.tsx. */
const ANNOUNCEMENT_STORAGE_KEY = `serverlys.announcement.${announcement.version}`;

/**
 * Fonts are self-hosted by next/font — no network request to Google at runtime,
 * and `display: swap` with an adjusted fallback keeps CLS at zero.
 * Only the weights actually used are requested.
 */
/**
 * DM Sans carries BOTH body and headings.
 *
 * The reference sets its whole page in it — headings included — at regular
 * weight rather than semibold, which is most of why its large type reads as
 * open rather than heavy. Two families (Inter + Inter Tight) were doing a job
 * one family does here, so the second request is gone.
 *
 * Loaded as the VARIABLE face (no `weight` array), not static 400/500 cuts.
 * Both reasons are measured, not stylistic:
 *
 *  · 143 `font-semibold` utilities across 64 files ask for 600. With only
 *    400/500 loaded, every one of them was SYNTHETIC bold — the browser
 *    smearing the 500 cut — which is both heavier and wider than the real
 *    600 cut.
 *  · The static cuts also carry no `opsz` axis, so large headings rendered
 *    ~10% wider than the variable face does (548px vs 494px for "grows with
 *    you" at 80px). That is a lot of line-break drift at display sizes.
 *
 * One variable file per family also beats two static files on the critical
 * path, so the cost the old comment was avoiding does not exist.
 */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: `${company.name} — ${company.tagline}`,
    template: `%s | ${company.name}`,
  },
  description: company.description,
  applicationName: company.name,
  authors: [{ name: company.legalName }],
  creator: company.legalName,
  publisher: company.legalName,
  formatDetection: { telephone: false, address: false, email: false },
  /*
   * Search Console / Bing Webmaster ownership. Both tokens are absent by
   * default; `undefined` makes Next omit the tag entirely, which is what we
   * want — a verification meta with an empty content attribute reads as a
   * FAILED verification rather than an absent one. See lib/env.ts.
   */
  verification: {
    google: verification.google,
    other: verification.bing ? { "msvalidate.01": verification.bing } : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      /*
        Two pre-paint scripts mutate attributes on this element before React
        hydrates — `data-js` (scroll-reveal fail-safe) and `data-announcement`
        (dismissed state). The server markup cannot contain either without
        defeating their purpose, so the attributes legitimately differ at
        hydration. This suppresses the warning for THIS element's attributes
        only; children are still checked.
      */
      suppressHydrationWarning
      /*
        We set `scroll-behavior: smooth` in globals.css so in-page anchors —
        the FAQ topic index, an article's contents list — glide instead of
        jumping. Next 16 needs to be told that is deliberate: without this
        attribute it warns, and it also applies the smooth scroll to ROUTE
        TRANSITIONS, so navigating to a new page animates a scroll to the top
        instead of arriving there. This scopes the smoothness to anchors.
      */
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        {/*
          Runs before first paint so neither a dismissed announcement bar nor
          an already-answered cookie notice flashes. Kept tiny and self-contained.

          CSP: the policy in next.config.ts allows 'unsafe-inline' for script-src, so this needs no hash
          entry. That is not laziness — the App Router inlines the RSC payload as per-page, per-build
          <script> content that cannot be hashed, and the only alternative (a per-request nonce) requires
          middleware and forces every route to render dynamically, which would cost the static prerender
          this site's LCP depends on. If a nonce ever becomes compatible with prerendering, hash or nonce
          this block and drop 'unsafe-inline'.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.js="true";try{if(localStorage.getItem(${JSON.stringify(ANNOUNCEMENT_STORAGE_KEY)})==="dismissed"){document.documentElement.dataset.announcement="dismissed"}if(localStorage.getItem(${JSON.stringify(CONSENT_KEY)})){document.documentElement.dataset.consent="set"}}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-canvas">
        {/* Keyboard users must be able to bypass the nav. Visible on focus. */}
        <a
          href="#main"
          className="sr-only-focusable absolute left-4 top-4 z-[100] rounded-md bg-primary px-4 py-2 text-small font-medium text-white shadow-e3"
        >
          Skip to main content
        </a>

        <JsonLd data={organizationGraph()} />

        {/*
          Sera, the site-wide AI assistant. SeraRoot renders NO element of its
          own — it is a context provider plus a fixed-position widget — so the
          flex children of <body> below are exactly what they were before it
          was added, and <main class="flex-1"> still pushes the footer down.
          See components/sera/sera-root.tsx.

          The chat panel itself is code-split and is not downloaded until
          someone opens it; what ships on every page is the launcher.
        */}
        <SeraRoot>
          <AnnouncementBar />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CookieConsent />
        </SeraRoot>
      </body>
    </html>
  );
}
