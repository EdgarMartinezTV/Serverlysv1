import type { MetadataRoute } from "next";
import { db } from "@/lib/server/db";
import { env } from "@/lib/server/env";

/** Every published, indexable page. Pages with noindex or sensitive content are left out. */
// Rendered per request: it reads Postgres, which isn't reachable while the Docker image builds.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await db.bioPage.findMany({
    where: { status: "PUBLISHED", username: { not: null }, owner: { status: "ACTIVE" } },
    select: { username: true, publishedAt: true, published: true, domains: { where: { status: "VERIFIED" }, select: { hostname: true }, take: 1 } },
    take: 45000,
  });
  return rows
    .filter((r) => {
      const p = r.published as { seo?: { noindex?: boolean }; settings?: { sensitive?: boolean } } | null;
      // Pages on a custom domain are canonical THERE, so they aren't listed here.
      return !p?.seo?.noindex && !p?.settings?.sensitive && r.domains.length === 0;
    })
    .map((r) => ({ url: `${env.appUrl}/${r.username}`, lastModified: r.publishedAt ?? undefined, changeFrequency: "weekly" as const }));
}
