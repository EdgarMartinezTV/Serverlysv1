import type { Metadata, Viewport } from "next";
import "@/components/bio/bio.css";

/**
 * Root layout for CUSTOMER PAGES (bio.serverlys.com/{username}, custom
 * domains, template previews). Separate from the app's root layout so a
 * visitor downloads the renderer's CSS and nothing from the dashboard.
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3200"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function PublicRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100dvh", display: "flex", flexDirection: "column" }}>{children}</body>
    </html>
  );
}
