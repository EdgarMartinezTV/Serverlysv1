import { withUser } from "@/lib/server/api";
import { db } from "@/lib/server/db";
import { parseRange } from "@/lib/server/range";
import { pageStats } from "@/lib/server/stats";

const csv = (v: unknown) => {
  const s = String(v ?? "");
  // Neutralise spreadsheet formula injection as well as quoting.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

/** Daily series + top links + breakdowns for the selected page(s) and period. */
export const GET = withUser<unknown>(async (req, user) => {
  const sp = Object.fromEntries(new URL(req.url).searchParams) as Record<string, string>;
  const pages = await db.bioPage.findMany({ where: { ownerId: user.id }, select: { id: true } });
  const ids = sp.page && pages.some((p) => p.id === sp.page) ? [sp.page] : pages.map((p) => p.id);
  const range = parseRange(sp);
  const s = await pageStats(ids, range.from, range.to);
  const lines = [["date", "views", "unique_visitors", "clicks"].join(",")];
  for (const d of s.series) lines.push([d.date, d.views, d.uniques, d.clicks].join(","));
  lines.push("", ["link", "type", "clicks", "unique_clicks"].join(","));
  for (const l of s.topLinks) lines.push([csv(l.label), csv(l.type), l.clicks, l.uniques].join(","));
  for (const [name, rows] of [["source", s.sources], ["device", s.devices], ["country", s.countries]] as const) {
    lines.push("", [name, "views"].join(","));
    for (const r of rows) lines.push([csv(r.key), r.count].join(","));
  }
  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="serverlys-bio-analytics-${range.from.toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" },
  });
});
