import type { Metadata } from "next";
import Link from "next/link";
import type { PageStatus, Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/server/db";
import { env } from "@/lib/server/env";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ActionButton, Flash, Pager, fmtDate } from "@/components/admin/ui";
import { restorePageAction, suspendPageAction } from "@/lib/actions/admin";

export const metadata: Metadata = { title: "Bio pages" };
const PER = 50;
const STATUSES: PageStatus[] = ["DRAFT", "PUBLISHED", "UNPUBLISHED", "SUSPENDED"];

export default async function AdminPages({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; p?: string; msg?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.p) || 1);
  const status = STATUSES.includes(sp.status as PageStatus) ? (sp.status as PageStatus) : undefined;
  const where: Prisma.BioPageWhereInput = {
    ...(status ? { status } : {}),
    ...(sp.q ? { OR: [{ username: { contains: sp.q.toLowerCase() } }, { name: { contains: sp.q, mode: "insensitive" } }, { owner: { email: { contains: sp.q, mode: "insensitive" } } }] } : {}),
  };
  const [pages, total, openReports] = await Promise.all([
    db.bioPage.findMany({ where, orderBy: { updatedAt: "desc" }, take: PER, skip: (page - 1) * PER, select: { id: true, name: true, username: true, status: true, publishedAt: true, updatedAt: true, suspendedReason: true, owner: { select: { email: true } }, _count: { select: { reports: true } } } }),
    db.bioPage.count({ where }),
    db.report.groupBy({ by: ["pageId"], where: { status: "OPEN" }, _count: { _all: true } }),
  ]);
  const open = new Map(openReports.map((r) => [r.pageId, r._count._all]));
  const backTo = `/admin/pages?${new URLSearchParams(Object.entries({ q: sp.q, status, p: sp.p }).filter(([, v]) => v) as [string, string][])}`;
  return (
    <>
      <PageHeader title="Bio pages" description={`${total.toLocaleString()} page${total === 1 ? "" : "s"}`} />
      <Body>
        <Flash msg={sp.msg} />
        <form method="get" className="card mb-5 flex flex-wrap gap-3 p-4">
          <label className="sr-only" htmlFor="q">
            Search pages
          </label>
          <input id="q" name="q" defaultValue={sp.q} placeholder="Username, page name or owner email" className="field min-h-10 min-w-[220px] flex-1 text-small" />
          <label className="sr-only" htmlFor="status">
            Status
          </label>
          <select id="status" name="status" defaultValue={status ?? ""} className="field min-h-10 w-44 text-small">
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s[0] + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <button className="btn h-10 bg-fg px-4 text-small text-white">Filter</button>
        </form>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[960px] text-small" aria-label="Bio pages">
            <thead className="border-b border-line text-left text-fg-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Page</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Reports</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pages.map((p) => (
                <tr key={p.id} data-admin-page={p.username ?? p.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-fg">{p.name}</p>
                    <p className="text-fg-muted">{p.username ? `/${p.username}` : "No username"}</p>
                    <div className="mt-1 flex gap-3 text-[12px]">
                      <Link className="font-semibold text-primary hover:underline" href={`/admin/pages/${p.id}`}>
                        Inspect
                      </Link>
                      {p.username && p.status === "PUBLISHED" ? (
                        <a className="font-semibold text-primary hover:underline" href={`${env.appUrl}/${p.username}`} target="_blank" rel="noreferrer">
                          Live
                        </a>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{p.owner.email}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                    {p.suspendedReason ? <p className="mt-1 max-w-[220px] text-[12px] text-error">{p.suspendedReason}</p> : null}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {open.get(p.id) ? <span className="font-semibold text-error">{open.get(p.id)} open</span> : null} <span className="text-fg-muted">{p._count.reports} total</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-fg-muted">{fmtDate(p.updatedAt)}</td>
                  <td className="px-4 py-3">
                    {p.status === "SUSPENDED" ? (
                      <ActionButton action={restorePageAction} fields={{ pageId: p.id, back: backTo }} label="Restore" />
                    ) : (
                      <form action={suspendPageAction} className="flex gap-1.5">
                        <input type="hidden" name="pageId" value={p.id} />
                        <input type="hidden" name="back" value={backTo} />
                        <label className="sr-only" htmlFor={`reason-${p.id}`}>
                          Suspension reason
                        </label>
                        <input id={`reason-${p.id}`} name="reason" placeholder="Reason" maxLength={300} className="field min-h-8 w-40 py-1 text-[12px]" />
                        <button className="btn h-8 px-2.5 text-[12px] text-error hover:bg-error-soft">Suspend</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!pages.length ? <p className="p-8 text-center text-fg-muted">No pages match.</p> : null}
        </div>
        <Pager page={page} per={PER} total={total} base={{ q: sp.q, status }} />
      </Body>
    </>
  );
}
