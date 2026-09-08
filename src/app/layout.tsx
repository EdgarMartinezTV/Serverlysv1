import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { company } from "@/data/company";
import { organizationGraph } from "@/lib/seo";
import { JsonLd } from "@/components/ui/json-ld";
import { SiteHeader } from "@/components/navigation/site-header";
import { AnnouncementBar } from "@/components/navigation/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { announcement } from "@/data/navigation";
import "./globals.css";

/** Must match ANNOUNCEMENT_KEY in dismiss-announcement.tsx. */
const ANNOUNCEMENT_STORAGE_KEY = `serverlys.announcement.${announcement.version}`;

/**
 * Fonts are self-hosted by next/font — no network request to Google at runtime,
 * and `display: swap` with an adjusted fallback keeps CLS at zero.
 * Only the weights actually used are requested.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
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
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        {/*
          Runs before first paint so a dismissed announcement bar never
          flashes. Kept tiny and self-contained; when a Content-Security-Policy
          is added this needs a hash entry (see ARCHITECTURE.md §17).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem(${JSON.stringify(ANNOUNCEMENT_STORAGE_KEY)})==="dismissed"){document.documentElement.dataset.announcement="dismissed"}}catch(e){}`,
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

        <AnnouncementBar />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
