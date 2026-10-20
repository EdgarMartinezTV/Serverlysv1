import type { NextConfig } from "next";

/**
 * Serverlys Bio — Next.js configuration.
 *
 * Deploy target matches the marketing site: Node runtime on Easypanel,
 * `output: "standalone"`. Customer pages render on request from Postgres
 * (cached per page, invalidated on publish), so this is NOT a static build.
 */

const embedFrames = [
  "https://www.youtube-nocookie.com",
  "https://www.youtube.com",
  "https://www.tiktok.com",
  "https://player.vimeo.com",
  "https://www.google.com",
  "https://maps.google.com",
  "https://open.spotify.com",
  "https://w.soundcloud.com",
  "https://embed.music.apple.com",
  "https://calendly.com",
  "https://docs.google.com",
  "https://*.typeform.com",
  "https://bandcamp.com",
].join(" ");

const marketingOrigins = (process.env.MARKETING_ORIGINS ?? "https://serverlys.com https://www.serverlys.com http://localhost:3000").trim();

function csp(frameAncestors: string) {
  return [
    "default-src 'self'",
    // Next inlines its RSC payload as <script> content; see the marketing site's
    // layout.tsx for why a nonce (which forces dynamic rendering) is not used.
    "script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
    "style-src 'self' 'unsafe-inline'",
    // Customer pages show images from uploads and from https URLs they paste.
    "img-src 'self' data: blob: https:",
    "media-src 'self' https:",
    "font-src 'self'",
    "connect-src 'self'",
    `frame-src 'self' ${embedFrames}`,
    `frame-ancestors ${frameAncestors}`,
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join("; ");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  // This app lives inside the marketing site's folder; without this Turbopack
  // infers the PARENT as the workspace root (it has a lockfile too).
  turbopack: { root: process.cwd() },
  experimental: {
    globalNotFound: true,
    serverActions: { bodySizeLimit: "1mb" },
  },
  // sharp and argon2 are native; keep them out of the bundle.
  serverExternalPackages: ["sharp", "@node-rs/argon2", "ioredis"],
  async headers() {
    return [
      { source: "/:path*", headers: [...securityHeaders, { key: "Content-Security-Policy", value: csp("'none'") }] },
      // Template previews are embedded by serverlys.com/bio. Later entries win
      // for the same header key, so this overrides frame-ancestors 'none'.
      { source: "/t/:path*", headers: [...securityHeaders, { key: "Content-Security-Policy", value: csp(`'self' ${marketingOrigins}`) }] },
    ];
  },
};

export default nextConfig;
