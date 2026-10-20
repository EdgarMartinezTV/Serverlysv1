import type { Metadata, Viewport } from "next";
import { DM_Sans, Noto_Sans } from "next/font/google";
import "../globals.css";
import "@/components/bio/bio.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap" });
const notoSans = Noto_Sans({ variable: "--font-noto-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3200"),
  title: { default: "Serverlys Bio — free link in bio", template: "%s · Serverlys Bio" },
  description: "Build a free link-in-bio page with Serverlys Bio. Templates, a visual editor, analytics and lead forms — no credit card, no paid plans.",
  // The app (dashboard, auth) is not for search engines; public pages opt in themselves.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function AppRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${notoSans.variable} h-full`}>
      <body className="min-h-full bg-canvas text-fg-secondary">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
