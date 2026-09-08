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
