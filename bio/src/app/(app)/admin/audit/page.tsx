import type { Metadata } from "next";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/server/db";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { Pager, fmtDate } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Audit log" };
const PER = 50;

export default async function AdminAudit({ searchParams }: { searchParams: Promise<{ action?: string; p?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.p) || 1);
  const where: Prisma.AuditLogWhereInput = sp.action ? { action: { startsWith: sp.action } } : {};
  const [rows, total] = await Promise.all([
    db.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, take: PER, skip: (page - 1) * PER, include: { actor: { select: { email: true } } } }),
    db.auditLog.count({ where }),
  ]);
  return (
    <>
      <PageHeader title="Audit log" description="Append-only record of admin actions, account deletions and domain changes." />
      <Body>
        <form method="get" className="card mb-5 flex gap-3 p-4">
          <label className="sr-only" htmlFor="action">
            Action prefix
          </label>
          <input id="action" name="action" defaultValue={sp.action} placeholder="Filter by action prefix, e.g. admin.page or domain." className="field min-h-10 flex-1 text-small" />
          <button className="btn h-10 bg-fg px-4 text-small text-white">Filter</button>
        </form>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[860px] text-small" aria-label="Audit log">
            <thead className="border-b border-line text-left text-fg-muted">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Target</th>
                <th className="px-4 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id} data-audit={r.action}>
                  <td className="whitespace-nowrap px-4 py-3 text-fg-muted">{fmtDate(r.createdAt)}</td>
                  <td className="px-4 py-3">{r.actor?.email ?? (r.actorId ? "(deleted user)" : "system")}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-fg">{r.action}</td>
                  <td className="px-4 py-3 text-fg-secondary">
                    {r.targetType}
                    {r.targetId ? <span className="block font-mono text-[11px] text-fg-muted">{r.targetId}</span> : null}
                  </td>
                  <td className="max-w-[360px] px-4 py-3">
                    {r.meta ? <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-fg-secondary">{JSON.stringify(r.meta)}</pre> : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length ? <p className="p-8 text-center text-fg-muted">No entries.</p> : null}
        </div>
        <Pager page={page} per={PER} total={total} base={{ action: sp.action }} />
      </Body>
    </>
  );
}
