import type { NextConfig } from "next";

/**
 * Serverlys — Next.js configuration.
 *
 * Deploy target is a Node runtime on Easypanel (Docker), so `standalone`
 * output is required: it emits a self-contained server bundle with only the
 * production dependencies, which keeps the image small and the boot fast.
 *
 * NOTE — /billing is NOT served by this app. WHMCS runs on the existing cPanel
 * host and owns the entire checkout path. Easypanel's reverse proxy must route
 * /billing/* to that host before DNS cuts over, or checkout 404s. See DEPLOY.md.
 */
const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    // AVIF first, WebP fallback — meaningful bytes saved on the hero and
    // product imagery, which is where this site's LCP lives.
    formats: ["image/avif", "image/webp"],
    // Only widths we actually render, so we don't generate dead variants.
    deviceSizes: [375, 430, 640, 768, 834, 1024, 1280, 1440, 1920],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    // Optimized variants of /public images. Next 16's default is 4h, which
    // re-encodes the same AVIF all day; these sources change only on deploy.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  /**
   * Permanent redirects.
   *
   * Two groups, and the distinction matters:
   *
   *   1. LEGACY URLS from the previous serverlys.com. These have inbound links
   *      and search history. Dropping them would throw away that equity and
   *      404 real visitors, so each one points at its closest successor.
   *   2. ALIASES for names used in briefs and campaigns that are not the
   *      canonical route, so only one URL is indexable per page.
   *
   * All 308 (permanent). If a destination is ever renamed, the redirect must
   * be updated in the same commit — a redirect chain is a ranking cost.
   */
  async redirects() {
    return [
      /*
       * Renamed route. /wp-migrations was the canonical path until the page
       * was renamed "Migrations" — the old name described only WordPress,
       * while the page has always moved any site. It is redirected rather
       * than dropped because it was already built, indexable and linked from
       * the nav, so real URLs point at it.
       */
      { source: "/wp-migrations", destination: "/migrations", permanent: true },

      // Legacy paths from the previous site.
      { source: "/store-hosting", destination: "/ecommerce-hosting", permanent: true },
      { source: "/web-design", destination: "/website-design", permanent: true },
      {
        source: "/custom-development",
        destination: "/website-development",
        permanent: true,
      },
      { source: "/seo-marketing", destination: "/seo", permanent: true },
      {
        source: "/socialmedia-management",
        destination: "/social-media",
        permanent: true,
      },
      { source: "/web-hosting", destination: "/hosting", permanent: true },
      { source: "/domains", destination: "/domain-name", permanent: true },

      // Aliases. ChatRep is the campaign name; ConvoAI is the product name
      // used by the live application at convoai.cloud, so /convoai is canonical.
      { source: "/chatrep", destination: "/convoai", permanent: true },
      { source: "/n8n-automations", destination: "/automations", permanent: true },
      {
        source: "/domain-name-search",
        destination: "/register-domain",
        permanent: true,
      },
      { source: "/domain-search", destination: "/register-domain", permanent: true },
      { source: "/ai", destination: "/ai-agents", permanent: true },
      { source: "/help", destination: "/support", permanent: true },
      /*
       * /contact-us pointed at /contact, and /contact was deleted. A permanent
       * redirect into a 404 is worse than no redirect: the crawler follows it,
       * finds nothing, and the equity on the old URL is discarded rather than
       * passed on. /support is where contacting Serverlys actually happens.
       */
      { source: "/contact-us", destination: "/support", permanent: true },
      { source: "/contact", destination: "/support", permanent: true },

      /*
       * Live pages on the current serverlys.com that this rebuild does not
       * reproduce. They are indexed TODAY, so without these the cutover turns
       * real search results into 404s.
       *
       *   /features            → the hosting page carries the same feature set.
       *   /callflow + children → the voice product now lives at /callflow-ai.
       *   /case-studies,
       *   /success-stories     → deliberately NOT rebuilt: the originals were
       *                          invented results ("300% traffic growth") and
       *                          this site does not publish unverified claims.
       *                          /our-process is the honest successor — it is
       *                          the page that answers "how do you work".
       */
      { source: "/features", destination: "/hosting", permanent: true },
      { source: "/callflow", destination: "/callflow-ai", permanent: true },
      { source: "/callflow/:slug", destination: "/callflow-ai", permanent: true },
      { source: "/case-studies", destination: "/our-process", permanent: true },
      { source: "/success-stories", destination: "/our-process", permanent: true },
    ];
  },

  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    /*
     * /public files are NOT content-hashed, so they cannot be `immutable` like
     * /_next/static. They were served `max-age=0` — revalidated on every page
     * view. A day fresh plus a week stale-while-revalidate means a replaced
     * logo still propagates within a day, without a round trip per visit.
     */
    const publicAssetCache = {
      key: "Cache-Control",
      value: "public, max-age=86400, stale-while-revalidate=604800",
    };
    return [
      { source: "/brand/:path*", headers: [publicAssetCache] },
      { source: "/mock/:path*", headers: [publicAssetCache] },
      { source: "/Hosting-images/:path*", headers: [publicAssetCache] },
      {
        source:
          "/:file(favicon\\.ico|favicon\\.svg|favicon-96x96\\.png|icon\\.png|apple-icon\\.png|apple-touch-icon\\.png)",
        headers: [publicAssetCache],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          /*
           * HSTS — PRODUCTION ONLY, and the guard is not cosmetic.
           *
           * `next dev` serves plain HTTP on localhost. Chrome and Firefox both
           * special-case localhost and ignore an HSTS header from it; Safari
           * does not. It records the policy and force-upgrades
           * http://localhost:3000 to https:// for the full max-age — two years
           * — and because the dev server has no TLS, every request then fails
           * with "A TLS error caused the secure connection to fail". The page
           * loads with no CSS at all.
           *
           * `includeSubDomains` makes it worse: the policy is keyed on the host
           * `localhost`, so it poisons EVERY localhost port, taking every other
           * local project down with it. Clearing it means wiping Safari's HSTS
           * store by hand.
           *
           * Sending HSTS over a non-secure transport is meaningless anyway — a
           * UA that respects the spec ignores it — so nothing is lost by
           * gating it here, and a working Safari is gained.
           */
          ...(isDev
            ? []
            : [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]),
          {
            /*
             * Content-Security-Policy.
             *
             * ⚠ `script-src` carries 'unsafe-inline' DELIBERATELY, and that is
             * a trade, not an oversight. The App Router inlines the RSC payload
             * as `self.__next_f.push(...)` in <script> tags whose contents
             * differ per page and per build, so they cannot be hashed. The only
             * alternative is a per-request nonce, which requires middleware and
             * forces every route to render dynamically — this site is fully
             * prerendered and measures LCP 176–532ms because of it. Trading
             * that for a directive that XSS in a React app largely routes
             * around anyway is a bad deal. Revisit if a nonce ever becomes
             * compatible with static prerendering.
             *
             * The directives below cost nothing and are the ones that actually
             * stop things:
             *   object-src 'none'     — no Flash/applet/plugin execution
             *   base-uri 'self'       — blocks <base> injection, which silently
             *                           repoints every relative URL on the page
             *   form-action 'self'    — an injected <form> cannot post a
             *                           visitor's input to another origin
             *   frame-ancestors       — clickjacking; the real replacement for
             *                           X-Frame-Options, which is kept above
             *                           only for ancient browsers
             *
             * connect-src is 'self': the domain search calls our own /api and
             * nothing else. Fonts are self-hosted by next/font, so no external
             * font origin is needed. Analytics is not wired (see cookie-policy)
             * — if it ever is, it needs an entry here or it will silently fail.
             */
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              /*
               * 'unsafe-eval' is DEVELOPMENT ONLY. React's dev build uses
               * eval() for debugging features (reconstructing callstacks across
               * environments) and Turbopack's HMR uses it too, so without this
               * the dev server throws on every page and `test:home`'s console
               * assertion fails. React never uses eval() in production — the
               * production bundle was verified to raise zero CSP violations —
               * so the shipped policy must not carry it.
               */
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
              // Tailwind and next/font emit inline <style>; no external sheets.
              "style-src 'self' 'unsafe-inline'",
              // data: for inlined SVG/blur placeholders, blob: for canvas work.
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "frame-src 'none'",
              /*
               * upgrade-insecure-requests — PRODUCTION ONLY.
               *
               * This directive rewrites every SUBRESOURCE request to https,
               * while leaving the top-level navigation alone. Chrome and
               * Firefox treat http://localhost as a potentially-trustworthy
               * origin and skip the upgrade; Safari/WebKit applies it
               * literally. The result in Safari on `next dev` is that the
               * document loads over http and then every stylesheet, font,
               * script and image is fetched over https against a server with
               * no TLS — "A TLS error caused the secure connection to fail"
               * for all of them. The page renders as unstyled HTML, which
               * looks like a catastrophic CSS bug rather than a header.
               *
               * It is pure upside in production (every asset is same-origin
               * over https already) and pure breakage in development, so it is
               * gated rather than dropped.
               */
              ...(isDev ? [] : ["upgrade-insecure-requests"]),
            ].join("; "),
          },
          {
            // Opt out of Chrome's cross-origin preload cache leaking timing.
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
