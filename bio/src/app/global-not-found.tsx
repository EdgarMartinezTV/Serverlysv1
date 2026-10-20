import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = { title: "Page not found · Serverlys Bio", robots: { index: false } };

/** Unmatched URLs on either root layout (app or public pages). */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-canvas-secondary px-5 text-center" style={{ fontFamily: "system-ui, sans-serif" }}>
        <main className="max-w-md">
          <p className="text-caption uppercase text-primary">404</p>
          <h1 className="mt-2 text-h3 font-semibold text-fg">This page doesn&apos;t exist</h1>
          <p className="mt-3 text-body text-fg-muted">The link may be mistyped, or the owner may have unpublished or renamed their page.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn h-11 bg-primary px-5 text-white hover:bg-primary-hover">
              Create your free bio
            </Link>
            <a href="https://serverlys.com/bio" className="btn h-11 px-5 text-fg ring-1 ring-line hover:bg-surface">
              About Serverlys Bio
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
