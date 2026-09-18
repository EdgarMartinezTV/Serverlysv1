"use client";

import { useEffect } from "react";

/**
 * Root-layout error boundary — the last line before the browser's own screen.
 *
 * ⚠ IT REPLACES THE ROOT LAYOUT, SO IT MUST RENDER ITS OWN `<html>` AND
 * `<body>`. That is a hard requirement of the App Router, not a stylistic
 * choice: `global-error.tsx` catches errors thrown BY the root layout, so the
 * layout's own html/body never rendered and there is no document to attach to.
 * Returning a fragment here produces a blank page.
 *
 * ⚠ AND THAT IS WHY IT CANNOT USE THE DESIGN SYSTEM. No `Container`, no
 * `Button`, no tokens, no fonts — the layout that loads `globals.css` and the
 * font files is precisely the thing that failed. Every style here is inline and
 * self-contained, using system fonts, because anything imported is a dependency
 * on the broken layer. It is deliberately the plainest page on the site.
 *
 * The colours are the brand's hex values written literally, for the same
 * reason: `var(--color-primary)` resolves to nothing without the stylesheet.
 * If globals.css is edited, this file does not follow automatically — that is
 * an accepted cost of being independent of it, and it is why the palette here
 * is three values rather than a scheme.
 *
 * ⚠ DISTINCT FROM `error.tsx`. That one handles a failed ROUTE inside a working
 * shell and can therefore look like the site. This one means the shell failed.
 * In practice it should be close to unreachable; it exists so that the case it
 * covers degrades to a readable sentence and a working link rather than to
 * Next's unstyled default.
 *
 * `lang="en"` is set here too — the root layout normally supplies it, and a
 * document with no language is an accessibility failure even on an error page.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest, never the message. See the note in `error.tsx`.
    console.error("[serverlys] root layout error", { digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#ffffff",
          color: "#18181a",
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <main style={{ maxWidth: "34rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#0000ff",
            }}
          >
            Error
          </p>

          <h1
            style={{
              margin: "16px 0 0",
              fontSize: "clamp(28px, 6vw, 40px)",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              fontWeight: 600,
            }}
          >
            Serverlys could not load this page
          </h1>

          <p
            style={{
              margin: "20px 0 0",
              fontSize: "17px",
              lineHeight: 1.6,
              color: "#4a4a52",
            }}
          >
            This is a fault on our side, not with your site, your account or anything
            you did. Your services are unaffected.
          </p>

          <div
            style={{
              margin: "32px 0 0",
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                appearance: "none",
                border: 0,
                cursor: "pointer",
                background: "#0000ff",
                color: "#ffffff",
                font: "inherit",
                fontSize: "16px",
                fontWeight: 500,
                padding: "13px 24px",
                borderRadius: "8px",
              }}
            >
              Try again
            </button>
            {/*
              ⚠ A PLAIN `<a>`, NOT next/link, AND THE LINT RULE IS DISABLED ON
              PURPOSE. `no-html-link-for-pages` is right on every other page:
              client-side navigation is faster and it is what you want. Here it
              is exactly wrong. This boundary fires when the ROOT LAYOUT failed,
              which means the router that `next/link` depends on is inside the
              blast radius — using it would risk the escape hatch failing for
              the same reason the page did. A full document request cannot.
            */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "13px 24px",
                borderRadius: "8px",
                border: "1px solid #dcdce3",
                color: "#18181a",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              Back to home
            </a>
          </div>

          <p style={{ margin: "28px 0 0", fontSize: "14px", color: "#4a4a52" }}>
            If it keeps happening, email{" "}
            <a href="mailto:support@serverlys.com" style={{ color: "#0000ff" }}>
              support@serverlys.com
            </a>{" "}
            or call{" "}
            <a href="tel:+13056711272" style={{ color: "#0000ff" }}>
              (305) 671-1272
            </a>
            .
          </p>
        </main>
      </body>
    </html>
  );
}
