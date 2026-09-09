import type { MetadataRoute } from "next";
import { sitemapRoutes } from "@/data/routes";
import { articles } from "@/data/articles";
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

  const pages = sitemapRoutes().map((route) => ({
    url: canonical(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Articles are not in the registry — they are content, enumerated from
  // data/articles, and their lastModified is the real publication date rather
  // than build time because that date is known and does not change on redeploy.
  const posts = articles.map((article) => ({
    url: canonical(`/blog/${article.slug}`),
    lastModified: new Date(`${article.published}T00:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...pages, ...posts];
}
