import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { pageStats } from "@/lib/server/stats";
import { parseRange } from "@/lib/server/range";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { BreakdownBars, TrafficChart } from "@/components/dashboard/charts";

export const metadata: Metadata = { title: "Analytics" };

type SP = { page?: string; range?: string; from?: string; to?: string };

const COUNTRY = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["en"], { type: "region" }) : null;

function pct(cur: number, prev: number) {
  if (!prev) return cur ? "New" : "—";
  const d = ((cur - prev) / prev) * 100;
  return `${d >= 0 ? "▲" : "▼"} ${Math.abs(d).toFixed(0)}%`;
}

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const user = await requireUser("/dashboard/analytics");
  const sp = await searchParams;
  const pages = await db.bioPage.findMany({ where: { ownerId: user.id }, select: { id: true, name: true, username: true }, orderBy: { updatedAt: "desc" } });
  const selected = sp.page && pages.some((p) => p.id === sp.page) ? sp.page : "all";
  const ids = selected === "all" ? pages.map((p) => p.id) : [selected];
  const range = parseRange(sp);
  const s = await pageStats(ids, range.from, range.to);
  const qs = (patch: Partial<SP>) => {
    const next = new URLSearchParams();
    const merged = { page: selected === "all" ? undefined : selected, range: range.key === "custom" ? undefined : range.key, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, v);
    return `?${next.toString()}`;
  };
  const exportHref = `/api/analytics/export${qs({ from: range.from.toISOString().slice(0, 10), to: new Date(range.to.getTime() - 864e5).toISOString().slice(0, 10), range: undefined })}`;

  const kpis = [
    { id: "views", label: "Profile views", value: s.views.toLocaleString(), cmp: pct(s.views, s.previous.views) },
    { id: "uniques", label: "Unique visitors", value: s.uniques.toLocaleString(), cmp: pct(s.uniques, s.previous.uniques) },
    { id: "clicks", label: "Link clicks", value: s.clicks.toLocaleString(), cmp: pct(s.clicks, s.previous.clicks) },
    { id: "ctr", label: "Click-through rate", value: `${(s.ctr * 100).toFixed(1)}%`, cmp: "clicks ÷ views" },
  ];

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Real visits and clicks from your published pages. Bots are excluded; no cookies are used."
        actions={
          <a href={exportHref} className="btn h-10 px-4 text-small text-fg ring-1 ring-line hover:bg-surface" download>
            Export CSV
          </a>
        }
      />
      <Body>
        <form className="card mb-6 flex flex-wrap items-end gap-3 p-4" method="get">
          <label className="flex flex-col gap-1 text-small font-medium text-fg">
            Page
            <select name="page" defaultValue={selected} className="field min-h-10 w-56 text-small">
              <option value="all">All pages</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.username ? ` (/${p.username})` : ""}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-col gap-1">
            <span className="text-small font-medium text-fg">Period</span>
            <div className="flex gap-1 rounded-sm bg-canvas-inset p-1">
              {(["7d", "30d", "90d"] as const).map((r) => (
                <Link key={r} href={qs({ range: r })} aria-current={range.key === r ? "true" : undefined} className={`rounded-[6px] px-3 py-1.5 text-[13px] font-semibold ${range.key === r ? "bg-surface text-fg shadow-e1" : "text-fg-muted hover:text-fg"}`}>
                  {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "90 days"}
                </Link>
              ))}
            </div>
          </div>
          <label className="flex flex-col gap-1 text-small font-medium text-fg">
            From
            <input type="date" name="from" defaultValue={range.from.toISOString().slice(0, 10)} className="field min-h-10 text-small" />
          </label>
          <label className="flex flex-col gap-1 text-small font-medium text-fg">
            To
            <input type="date" name="to" defaultValue={new Date(range.to.getTime() - 864e5).toISOString().slice(0, 10)} className="field min-h-10 text-small" />
          </label>
          <button className="btn h-10 bg-fg px-4 text-small text-white">Apply</button>
        </form>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.id} className="card p-5">
              <p className="text-small text-fg-muted">{k.label}</p>
              <p className="mt-1 font-display text-[30px] font-semibold text-fg tabular-nums" data-testid={`kpi-${k.id}`}>
                {k.value}
              </p>
              <p className="text-[12px] text-fg-muted">{k.cmp === "clicks ÷ views" ? k.cmp : `${k.cmp} vs previous period`}</p>
            </div>
          ))}
        </div>

        <section className="card mt-6 p-5">
          <h2 className="text-h4 font-semibold">Over time</h2>
          <p className="text-small text-fg-muted">Daily, UTC.</p>
          <div className="mt-4">
            <TrafficChart data={s.series} />
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="card p-5">
            <h2 className="text-h4 font-semibold">Top links</h2>
            {s.topLinks.length ? (
              <table className="mt-3 w-full text-small" aria-label="Top links">
                <thead>
                  <tr className="text-left text-fg-muted">
                    <th className="py-2 font-medium">Link</th>
                    <th className="py-2 text-right font-medium">Clicks</th>
                    <th className="py-2 text-right font-medium">Unique</th>
                    <th className="py-2 text-right font-medium">CTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {s.topLinks.map((l) => (
                    <tr key={l.blockId}>
                      <td className="max-w-[220px] py-2">
                        <span className="block truncate font-medium text-fg">{l.label}</span>
                        <span className="text-[12px] text-fg-muted">{l.type}</span>
                      </td>
                      <td className="py-2 text-right tabular-nums">{l.clicks}</td>
                      <td className="py-2 text-right tabular-nums">{l.uniques}</td>
                      <td className="py-2 text-right tabular-nums">{s.views ? `${((l.clicks / s.views) * 100).toFixed(1)}%` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="py-6 text-center text-small text-fg-muted">No clicks in this period.</p>
            )}
          </section>
          <section className="card p-5">
            <h2 className="text-h4 font-semibold">Traffic sources</h2>
            <div className="mt-3">
              <BreakdownBars data={s.sources} label="Traffic sources" />
            </div>
            {s.referrers.length ? (
              <>
                <h3 className="mt-4 text-small font-semibold text-fg">Referring sites</h3>
                <ul className="mt-1 text-small">
                  {s.referrers.slice(0, 6).map((r) => (
                    <li key={r.key} className="flex justify-between py-1">
                      <span>{r.key}</span>
                      <span className="tabular-nums text-fg-muted">{r.count}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </section>
          <section className="card p-5">
            <h2 className="text-h4 font-semibold">Devices</h2>
            <div className="mt-3">
              <BreakdownBars data={s.devices} label="Devices" />
            </div>
          </section>
          <section className="card p-5">
            <h2 className="text-h4 font-semibold">Countries</h2>
            <p className="text-small text-fg-muted">From the edge network&apos;s country header when available. IP addresses are never stored.</p>
            <div className="mt-3">
              <BreakdownBars data={s.countries.map((c) => ({ key: c.key === "Unknown" ? "Unknown" : (COUNTRY?.of(c.key) ?? c.key), count: c.count }))} label="Countries" />
            </div>
          </section>
        </div>
      </Body>
    </>
  );
}
