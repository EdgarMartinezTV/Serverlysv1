import type { Metadata } from "next";
import Link from "next/link";
import { platformOverview, formatBytes } from "@/lib/server/admin";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { TrafficChart } from "@/components/dashboard/charts";
import { Stat } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverview() {
  const o = await platformOverview();
  return (
    <>
      <PageHeader title="Platform overview" description="Live numbers from the database — nothing here is estimated." />
      <Body>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Users" value={o.users.toLocaleString()} sub={`+${o.users7} in 7 days · +${o.users30} in 30`} testId="admin-users" />
          <Stat label="Published pages" value={o.pages.PUBLISHED.toLocaleString()} sub={`${o.pages.DRAFT} draft · ${o.pages.UNPUBLISHED} unpublished · ${o.pages.SUSPENDED} suspended`} />
          <Stat label="Views (30 days)" value={o.views30.toLocaleString()} sub={`${o.clicks30.toLocaleString()} clicks`} />
          <Stat label="Leads (30 days)" value={o.leads30.toLocaleString()} />
          <Stat label="Open reports" value={<Link href="/admin/reports" className={o.openReports ? "text-error" : ""}>{o.openReports}</Link>} />
          <Stat label="Storage" value={formatBytes(o.storageBytes)} sub={`${o.assetCount.toLocaleString()} files`} />
          <Stat label="Emails (7 days)" value={(o.emails7.SENT + o.emails7.LOGGED + o.emails7.FAILED).toLocaleString()} sub={`${o.emails7.SENT} sent · ${o.emails7.LOGGED} logged · ${o.emails7.FAILED} failed`} />
          <Stat label="Click-through (30 days)" value={o.views30 ? `${((o.clicks30 / o.views30) * 100).toFixed(1)}%` : "—"} />
        </div>
        <section className="card mt-6 p-5">
          <h2 className="text-h4 font-semibold">Platform traffic, last 30 days</h2>
          <p className="text-small text-fg-muted">All published pages, daily UTC. Bots excluded at collection.</p>
          <div className="mt-4">
            <TrafficChart data={o.series} />
          </div>
        </section>
      </Body>
    </>
  );
}
