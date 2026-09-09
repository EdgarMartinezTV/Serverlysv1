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
      { source: "/contact-us", destination: "/contact", permanent: true },
    ];
  },

  async headers() {
    return [
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
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
