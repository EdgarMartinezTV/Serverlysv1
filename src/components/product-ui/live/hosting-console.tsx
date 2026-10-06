"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { ConsoleShell, Metric, Segmented, Sparkline } from "./shell";
import { compactCount, demoSites, trend, type DemoSite } from "./demo-data";

/**
 * The Serverlys hosting console.
 *
 * A working interface, not a picture of one: selecting a site re-renders every
 * panel from that site's data, and the view switcher changes which panels are
 * shown. Three views, because that is the honest split of what the product
 * actually reports — traffic and resources, speed, and what was blocked.
 *
 * Layout follows the console's OWN width (container queries, `@lg` = 32rem),
 * not the viewport: inside the homepage laptop it is laid out at a fixed
 * width and scaled, so viewport breakpoints would pick the phone layout.
 *
 * The site list is a `tablist`: sites and views are both single-choice, so both
 * get roving focus and arrow-key movement rather than a row of tab stops.
 */

type View = "overview" | "performance" | "security";

const VIEWS = [
  { value: "overview" as const, label: "Overview" },
  { value: "performance" as const, label: "Speed" },
  { value: "security" as const, label: "Security" },
];

const STATUS: Record<DemoSite["status"], { label: string; dot: string; text: string }> =
  {
    online: { label: "Online", dot: "bg-success-fill", text: "text-success" },
    building: { label: "Deploying", dot: "bg-primary", text: "text-primary" },
    attention: {
      label: "Needs attention",
      dot: "bg-warning-fill",
      text: "text-warning",
    },
  };

export function HostingConsole({
  className,
  frameless,
}: {
  className?: string;
  /** Inside a device frame that supplies its own chrome. See ConsoleShell. */
  frameless?: boolean;
}) {
  const [siteId, setSiteId] = useState(demoSites[0].id);
  const [view, setView] = useState<View>("overview");
  const listId = useId();

  const site = demoSites.find((s) => s.id === siteId) ?? demoSites[0];
  const growth = trend(site.visits);
  const storagePct = Math.round((site.storageUsedGb / site.storageTotalGb) * 100);

  function onListKeyDown(event: React.KeyboardEvent) {
    const index = demoSites.findIndex((s) => s.id === siteId);
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = index + 1;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = demoSites.length - 1;
    else return;
    event.preventDefault();
    setSiteId(demoSites[(next + demoSites.length) % demoSites.length].id);
  }

  return (
    <ConsoleShell
      label="Serverlys hosting console demonstration"
      title="Sites"
      frameless={frameless}
      toolbar={
        <Segmented
          label="Console view"
          options={VIEWS}
          value={view}
          onChange={setView}
        />
      }
      className={className}
    >
      <div className="grid @lg:grid-cols-[minmax(0,11.5rem)_minmax(0,1fr)]">
        {/* ── Site list ─────────────────────────────────────────────────── */}
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Choose a site"
          onKeyDown={onListKeyDown}
          className="flex gap-1 overflow-x-auto border-b border-line-subtle p-2 @lg:flex-col @lg:overflow-visible @lg:border-b-0 @lg:border-r"
        >
          {demoSites.map((entry) => {
            const active = entry.id === siteId;
            const status = STATUS[entry.status];
            return (
              <button
                key={entry.id}
                type="button"
                role="tab"
                id={`${listId}-${entry.id}`}
                aria-selected={active}
                aria-controls={`${listId}-panel`}
                tabIndex={active ? 0 : -1}
                onClick={() => setSiteId(entry.id)}
                className={cn(
                  "min-w-[9.5rem] shrink-0 rounded-lg px-2.5 py-2 text-left transition-colors duration-fast ease-hover @lg:min-w-0",
                  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
                  active
                    ? "bg-primary-soft ring-1 ring-inset ring-primary/25"
                    : "hover:bg-canvas-secondary",
                )}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={cn("h-1.5 w-1.5 shrink-0 rounded-full", status.dot)}
                  />
                  <span
                    className={cn(
                      "truncate text-ui font-medium",
                      active ? "text-primary" : "text-fg",
                    )}
                  >
                    {entry.domain}
                  </span>
                </span>
                <span className="mt-0.5 block truncate pl-3 text-ui text-fg-muted">
                  {entry.stack} · {entry.plan}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Detail ───────────────────────────────────────────────────── */}
        <div
          role="tabpanel"
          id={`${listId}-panel`}
          aria-labelledby={`${listId}-${site.id}`}
          tabIndex={-1}
          className="min-w-0 p-3 @lg:p-4"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="truncate font-mono text-small font-medium text-fg">
              {site.domain}
            </p>
            <p
              className={cn(
                "flex items-center gap-1.5 text-ui font-medium",
                STATUS[site.status].text,
              )}
            >
              <span
                aria-hidden="true"
                className={cn("h-1.5 w-1.5 rounded-full", STATUS[site.status].dot)}
              />
              {STATUS[site.status].label}
            </p>
          </div>

          {view === "overview" && (
            <>
              <div className="mt-3 rounded-lg bg-canvas-secondary p-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-ui text-fg-muted font-semibold">
                    Visits · 12 months
                  </span>
                  <span className="tabular text-ui font-semibold text-success">
                    {growth >= 0 ? "+" : ""}
                    {growth.toFixed(1)}%
                  </span>
                </div>
                <p className="tabular mt-1 text-h4 font-semibold text-fg">
                  {compactCount(site.visits[site.visits.length - 1])}
                  <span className="ml-1.5 text-small font-normal text-fg-muted">
                    this month
                  </span>
                </p>
                <div className="mt-2 h-12">
                  <Sparkline series={site.visits} />
                </div>
              </div>

              <dl className="mt-2 grid grid-cols-2 gap-2">
                <Metric
                  label="Storage"
                  value={`${site.storageUsedGb} GB`}
                  sub={`${storagePct}% of ${site.storageTotalGb} GB NVMe`}
                />
                <Metric
                  label="Uptime"
                  value={`${site.uptimePct}%`}
                  sub="Rolling 30 days"
                />
              </dl>

              <div className="mt-2 rounded-lg bg-canvas-secondary p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-ui text-fg-muted font-semibold">
                    Disk usage
                  </span>
                  <span className="tabular text-ui font-medium text-fg">
                    {storagePct}%
                  </span>
                </div>
                <div
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
                  role="img"
                  aria-label={`${storagePct} percent of ${site.storageTotalGb} gigabytes used`}
                >
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-slow ease-entrance"
                    style={{ width: `${storagePct}%` }}
                  />
                </div>
              </div>
            </>
          )}

          {view === "performance" && (
            <>
              <dl className="mt-3 grid grid-cols-2 gap-2">
                <Metric
                  label="Response"
                  value={`${site.responseMs} ms`}
                  sub="Median, origin"
                />
                <Metric label="PHP" value={site.phpVersion} sub="LiteSpeed + OPcache" />
              </dl>
              <div className="mt-2 rounded-lg bg-canvas-secondary p-3">
                <span className="text-ui text-fg-muted font-semibold">
                  Response time · 12 months
                </span>
                <div className="mt-2 h-14">
                  <Sparkline
                    series={site.visits.map((v, i) =>
                      Math.round(site.responseMs + (i % 3) * 9 - v / 2400),
                    )}
                    stroke="text-cyan-500"
                    fill="text-cyan-500/12"
                  />
                </div>
                <p className="mt-2 text-ui text-fg-muted">
                  Cached at the edge; origin only sees a miss.
                </p>
              </div>
            </>
          )}

          {view === "security" && (
            <>
              <dl className="mt-3 grid grid-cols-2 gap-2">
                <Metric
                  label="Blocked"
                  value={site.threatsBlocked.toLocaleString("en-US")}
                  sub="Requests, last 24h"
                />
                <Metric
                  label="Certificate"
                  value={`${site.ssl.renewsInDays}d`}
                  sub={`${site.ssl.issuer}, auto-renews`}
                />
              </dl>
              <ul className="mt-2 flex flex-col gap-1.5">
                {[
                  {
                    label: "Daily backup",
                    value: `${site.backup.lastAt} · ${site.backup.sizeMb} MB`,
                    ok: true,
                  },
                  { label: "TLS 1.3 enforced", value: "Active", ok: true },
                  {
                    label: "PHP version",
                    value: site.phpVersion,
                    ok: site.phpVersion !== "8.1",
                  },
                ].map((row) => (
                  <li
                    key={row.label}
                    className="flex items-center justify-between gap-3 rounded-lg bg-canvas-secondary px-3 py-2"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                          row.ok ? "bg-success-soft" : "bg-warning-soft",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            row.ok ? "bg-success-fill" : "bg-warning-fill",
                          )}
                        />
                      </span>
                      <span className="truncate text-ui text-fg">
                        {row.label}
                      </span>
                    </span>
                    <span className="tabular shrink-0 text-ui text-fg-muted">
                      {row.value}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </ConsoleShell>
  );
}
