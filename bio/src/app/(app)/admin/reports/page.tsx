import type { Metadata } from "next";
import Link from "next/link";
import type { ReportStatus } from "@/generated/prisma/client";
import { db } from "@/lib/server/db";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Flash, Pager, Pill, fmtDate } from "@/components/admin/ui";
import { resolveReportAction } from "@/lib/actions/admin";

export const metadata: Metadata = { title: "Reports" };
const PER = 30;

export default async function AdminReports({ searchParams }: { searchParams: Promise<{ status?: string; p?: string; msg?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.p) || 1);
  const status = (["OPEN", "RESOLVED", "DISMISSED"] as ReportStatus[]).includes(sp.status as ReportStatus) ? (sp.status as ReportStatus) : undefined;
  const where = status ? { status } : {};
  const include = { page: { select: { id: true, name: true, username: true, status: true } } } as const;
  // "Open first" view: every open report (oldest first — they've waited longest), then closed ones paged.
  const [primary, closed, total] = await Promise.all([
    db.report.findMany({ where: { status: status ?? "OPEN" }, orderBy: { createdAt: status && status !== "OPEN" ? "desc" : "asc" }, include, ...(status && status !== "OPEN" ? { take: PER, skip: (page - 1) * PER } : {}) }),
    status ? Promise.resolve([]) : db.report.findMany({ where: { status: { not: "OPEN" } }, orderBy: { resolvedAt: "desc" }, take: PER, skip: (page - 1) * PER, include }),
    db.report.count({ where: status ? where : { status: { not: "OPEN" } } }),
  ]);
  const rows = status ? primary : [...primary, ...closed];
  const backTo = `/admin/reports${status ? `?status=${status}` : ""}`;
  return (
    <>
      <PageHeader title="Reports" description={`${primary.filter((r) => r.status === "OPEN").length} open`} />
      <Body>
        <Flash msg={sp.msg} />
        <div className="mb-5 flex gap-2 text-small">
          {[undefined, "OPEN", "RESOLVED", "DISMISSED"].map((s) => (
            <Link key={s ?? "all"} href={s ? `?status=${s}` : "?"} aria-current={status === s ? "true" : undefined} className={`rounded-full px-3 py-1.5 font-semibold ${status === s ? "bg-fg text-white" : "bg-surface text-fg-secondary ring-1 ring-line"}`}>
              {s ? s[0] + s.slice(1).toLowerCase() : "Open first"}
            </Link>
          ))}
        </div>
        <ul className="flex flex-col gap-4">
          {rows.map((r) => (
            <li key={r.id} className="card p-5" data-report={r.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-fg">
                    {r.reason} <Pill tone={r.status === "OPEN" ? "bad" : r.status === "RESOLVED" ? "ok" : "muted"}>{r.status.toLowerCase()}</Pill>
                  </p>
                  <p className="text-small text-fg-muted">
                    <Link className="text-primary hover:underline" href={`/admin/pages/${r.page.id}`}>
                      {r.page.username ? `/${r.page.username}` : r.page.name}
                    </Link>{" "}
                    · <StatusBadge status={r.page.status} /> · reported {fmtDate(r.createdAt)}
                    {r.reporterEmail ? ` by ${r.reporterEmail}` : " anonymously"}
                  </p>
                </div>
              </div>
              {r.details ? <p className="mt-3 whitespace-pre-line text-small text-fg-secondary">{r.details}</p> : null}
              {r.status === "OPEN" ? (
                <form action={resolveReportAction} className="mt-4 flex flex-col gap-3">
                  <input type="hidden" name="reportId" value={r.id} />
                  <input type="hidden" name="back" value={backTo} />
                  <label className="text-small font-medium text-fg" htmlFor={`res-${r.id}`}>
                    Resolution note
                  </label>
                  <textarea id={`res-${r.id}`} name="resolution" rows={2} maxLength={1000} className="field min-h-0 text-small" placeholder="What did you find and do?" />
                  <label className="flex items-center gap-2 text-small">
                    <input type="checkbox" name="suspend" className="size-4 accent-primary" /> Also suspend the page
                  </label>
                  <div className="flex gap-2">
                    <button name="outcome" value="RESOLVED" className="btn h-9 bg-primary px-3 text-small text-white hover:bg-primary-hover">
                      Resolve
                    </button>
                    <button name="outcome" value="DISMISSED" className="btn h-9 px-3 text-small text-fg ring-1 ring-line hover:bg-canvas-secondary">
                      Dismiss
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-3 rounded-sm bg-canvas-secondary px-3 py-2 text-small text-fg-secondary">
                  {r.status === "RESOLVED" ? "Resolved" : "Dismissed"} {fmtDate(r.resolvedAt)}
                  {r.resolution ? ` — ${r.resolution}` : ""}
                </p>
              )}
            </li>
          ))}
        </ul>
        {!rows.length ? <p className="card p-10 text-center text-fg-muted">No reports.</p> : null}
        <Pager page={page} per={PER} total={total} base={{ status }} />
      </Body>
    </>
  );
}
