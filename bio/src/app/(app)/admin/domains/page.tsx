import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/server/db";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { ActionButton, Flash, Pill, fmtDate } from "@/components/admin/ui";
import { recheckDomainAction } from "@/lib/actions/admin";

export const metadata: Metadata = { title: "Domains" };

export default async function AdminDomains({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const { msg } = await searchParams;
  const domains = await db.domain.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }], take: 500, include: { page: { select: { id: true, name: true, username: true, owner: { select: { email: true } } } } } });
  const counts = domains.reduce<Record<string, number>>((a, d) => ((a[d.status] = (a[d.status] ?? 0) + 1), a), {});
  return (
    <>
      <PageHeader title="Custom domains" description={`${counts.VERIFIED ?? 0} verified · ${counts.PENDING ?? 0} pending · ${counts.FAILED ?? 0} failed`} />
      <Body>
        <Flash msg={msg} />
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[900px] text-small" aria-label="Custom domains">
            <thead className="border-b border-line text-left text-fg-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Domain</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Page</th>
                <th className="px-4 py-3 font-medium">Last check</th>
                <th className="px-4 py-3 font-medium">Last error</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {domains.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-3 font-semibold text-fg">{d.hostname}</td>
                  <td className="px-4 py-3">
                    <Pill tone={d.status === "VERIFIED" ? "ok" : d.status === "FAILED" ? "bad" : "warn"}>{d.status.toLowerCase()}</Pill>
                  </td>
                  <td className="px-4 py-3">
                    <Link className="text-primary hover:underline" href={`/admin/pages/${d.page.id}`}>
                      {d.page.username ? `/${d.page.username}` : d.page.name}
                    </Link>
                    <p className="text-[12px] text-fg-muted">{d.page.owner.email}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-fg-muted">{fmtDate(d.lastCheckedAt)}</td>
                  <td className="max-w-[280px] px-4 py-3 text-[12px] text-fg-secondary">{d.lastError ?? "—"}</td>
                  <td className="px-4 py-3">
                    <ActionButton action={recheckDomainAction} fields={{ domainId: d.id, back: "/admin/domains" }} label="Re-check now" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!domains.length ? <p className="p-8 text-center text-fg-muted">No custom domains yet.</p> : null}
        </div>
      </Body>
    </>
  );
}
