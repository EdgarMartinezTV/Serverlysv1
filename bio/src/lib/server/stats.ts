import "server-only";
import { db } from "./db";
import { parseDoc } from "@/lib/bio/schema";
import { summary, CATALOG } from "@/lib/bio/catalog";

/**
 * Analytics aggregation — computed from AnalyticsEvent rows only, never
 * estimated. Days are UTC calendar days. "Unique" = distinct daily visitor
 * hash, so a person visiting on two days counts once per day (the hash
 * rotates daily by design — see lib/server/crypto.ts).
 */

export type Stats = {
  views: number;
  uniques: number;
  clicks: number;
  uniqueClicks: number;
  ctr: number;
  previous: { views: number; uniques: number; clicks: number };
  series: Array<{ date: string; views: number; uniques: number; clicks: number }>;
  topLinks: Array<{ blockId: string; label: string; type: string; clicks: number; uniques: number }>;
  sources: Array<{ key: string; count: number }>;
  devices: Array<{ key: string; count: number }>;
  countries: Array<{ key: string; count: number }>;
  referrers: Array<{ key: string; count: number }>;
};

type Totals = { views: bigint; uniques: bigint; clicks: bigint; uclicks: bigint };

async function totals(pageIds: string[], from: Date, to: Date) {
  const [row] = await db.$queryRaw<Totals[]>`
    SELECT
      COUNT(*) FILTER (WHERE type = 'VIEW') AS views,
      COUNT(DISTINCT (date_trunc('day', "createdAt"), "visitorHash")) FILTER (WHERE type = 'VIEW') AS uniques,
      COUNT(*) FILTER (WHERE type = 'CLICK') AS clicks,
      COUNT(DISTINCT (date_trunc('day', "createdAt"), "visitorHash", "blockId")) FILTER (WHERE type = 'CLICK') AS uclicks
    FROM "AnalyticsEvent"
    WHERE "pageId" = ANY(${pageIds}) AND "createdAt" >= ${from} AND "createdAt" < ${to}`;
  return { views: Number(row.views), uniques: Number(row.uniques), clicks: Number(row.clicks), uniqueClicks: Number(row.uclicks) };
}

async function breakdown(pageIds: string[], from: Date, to: Date, column: "source" | "device" | "country" | "referrer") {
  // Column name is from a fixed union above, never user input.
  const rows = await db.$queryRawUnsafe<Array<{ key: string; count: bigint }>>(
    `SELECT "${column}" AS key, COUNT(*) AS count FROM "AnalyticsEvent"
     WHERE "pageId" = ANY($1) AND type = 'VIEW' AND "createdAt" >= $2 AND "createdAt" < $3
     GROUP BY 1 ORDER BY 2 DESC LIMIT 12`,
    pageIds,
    from,
    to,
  );
  return rows.map((r) => ({ key: r.key || "Unknown", count: Number(r.count) }));
}

export async function pageStats(pageIds: string[], from: Date, to: Date): Promise<Stats> {
  if (!pageIds.length) {
    return { views: 0, uniques: 0, clicks: 0, uniqueClicks: 0, ctr: 0, previous: { views: 0, uniques: 0, clicks: 0 }, series: [], topLinks: [], sources: [], devices: [], countries: [], referrers: [] };
  }
  const span = to.getTime() - from.getTime();
  const prevFrom = new Date(from.getTime() - span);

  const [cur, prev, seriesRows, linkRows, sources, devices, countries, referrers, pages] = await Promise.all([
    totals(pageIds, from, to),
    totals(pageIds, prevFrom, from),
    db.$queryRaw<Array<{ day: Date; views: bigint; uniques: bigint; clicks: bigint }>>`
      SELECT date_trunc('day', "createdAt" AT TIME ZONE 'UTC') AS day,
        COUNT(*) FILTER (WHERE type = 'VIEW') AS views,
        COUNT(DISTINCT "visitorHash") FILTER (WHERE type = 'VIEW') AS uniques,
        COUNT(*) FILTER (WHERE type = 'CLICK') AS clicks
      FROM "AnalyticsEvent"
      WHERE "pageId" = ANY(${pageIds}) AND "createdAt" >= ${from} AND "createdAt" < ${to}
      GROUP BY 1 ORDER BY 1`,
    db.$queryRaw<Array<{ pageId: string; blockId: string; clicks: bigint; uniques: bigint }>>`
      SELECT "pageId", "blockId", COUNT(*) AS clicks, COUNT(DISTINCT (date_trunc('day', "createdAt"), "visitorHash")) AS uniques
      FROM "AnalyticsEvent"
      WHERE "pageId" = ANY(${pageIds}) AND type = 'CLICK' AND "blockId" IS NOT NULL AND "createdAt" >= ${from} AND "createdAt" < ${to}
      GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 20`,
    breakdown(pageIds, from, to, "source"),
    breakdown(pageIds, from, to, "device"),
    breakdown(pageIds, from, to, "country"),
    breakdown(pageIds, from, to, "referrer"),
    db.bioPage.findMany({ where: { id: { in: pageIds } }, select: { id: true, draft: true, published: true } }),
  ]);

  // Label clicks with the block's current title (published first, then draft, then trash).
  const labels = new Map<string, { label: string; type: string }>();
  for (const p of pages) {
    for (const raw of [p.draft, p.published]) {
      if (!raw) continue;
      try {
        const d = parseDoc(raw);
        for (const b of [...d.trash, ...d.blocks]) labels.set(`${p.id}:${b.id}`, { label: summary(b), type: CATALOG[b.type].label });
      } catch {
        /* an unparsable historic doc just means unlabeled rows */
      }
    }
  }

  // Fill missing days with zeros so charts don't skip.
  const byDay = new Map(seriesRows.map((r) => [r.day.toISOString().slice(0, 10), r]));
  const series: Stats["series"] = [];
  for (let t = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()); t < to.getTime(); t += 864e5) {
    const key = new Date(t).toISOString().slice(0, 10);
    const r = byDay.get(key);
    series.push({ date: key, views: Number(r?.views ?? 0), uniques: Number(r?.uniques ?? 0), clicks: Number(r?.clicks ?? 0) });
  }

  return {
    ...cur,
    ctr: cur.views ? cur.clicks / cur.views : 0,
    previous: { views: prev.views, uniques: prev.uniques, clicks: prev.clicks },
    series,
    topLinks: linkRows.map((r) => {
      const social = r.blockId.startsWith("social:");
      const meta = labels.get(`${r.pageId}:${r.blockId}`);
      return {
        blockId: r.blockId,
        label: social ? r.blockId.slice(7) : (meta?.label ?? "Deleted block"),
        type: social ? "Social icon" : (meta?.type ?? ""),
        clicks: Number(r.clicks),
        uniques: Number(r.uniques),
      };
    }),
    sources,
    devices,
    countries,
    referrers: referrers.filter((r) => r.key !== "Unknown"),
  };
}
