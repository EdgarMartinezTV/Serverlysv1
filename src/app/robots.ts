import type { MetadataRoute } from "next";
import { canonical } from "@/lib/seo";
import { routes } from "@/data/routes";
import { publicEnv } from "@/lib/env";

/**
 * robots.txt.
 *
 * Staging must never be indexed: when NEXT_PUBLIC_SITE_URL is not the
 * production origin, everything is disallowed. A staging site competing with
 * production in the index is a real and common SEO incident, and it is
 * cheapest to prevent here.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = publicEnv.siteUrl === "https://serverlys.com";

  if (!isProduction) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  // Internal surfaces, sourced from the registry rather than hand-listed.
  const disallow = [
    "/api/",
    ...routes.filter((r) => r.built && !r.indexable).map((r) => r.path),
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: canonical("/sitemap.xml"),
    host: canonical("/"),
  };
}
