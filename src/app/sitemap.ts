import type { MetadataRoute } from "next";
import { sitemapRoutes } from "@/data/routes";
import { canonical } from "@/lib/seo";

/**
 * XML sitemap, generated from the route registry.
 *
 * Only routes that are BUILT and INDEXABLE appear. Pages linked from the
 * navigation but not yet shipped are deliberately excluded: a visitor finding a
 * 404 is a bug, but submitting one to Google is a crawl-budget and trust
 * problem. `data/routes.ts` is the single place that decides.
 *
 * `lastModified` uses build time. That is honest — the deployment is genuinely
 * when this content last changed — and avoids the anti-pattern of stamping
 * "now" on every crawl, which teaches crawlers to distrust the field.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return sitemapRoutes().map((route) => ({
    url: canonical(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
