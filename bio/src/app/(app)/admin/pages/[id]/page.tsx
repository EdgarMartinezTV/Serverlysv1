import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/server/db";
import { env } from "@/lib/server/env";
import { parseDoc } from "@/lib/bio/schema";
import { BioPage } from "@/components/bio/renderer";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ActionButton, Flash, Pill, fmtDate } from "@/components/admin/ui";
import { restorePageAction, suspendPageAction } from "@/lib/actions/admin";

export const metadata: Metadata = { title: "Inspect page" };

/** Read-only moderation view: the published version (or the draft if never published). */
export default async function AdminPageInspect({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ msg?: string }> }) {
  const { id } = await params;
  const { msg } = await searchParams;
  const p = await db.bioPage.findUnique({
    where: { id },
    include: { owner: { select: { email: true, status: true } }, reports: { orderBy: { createdAt: "desc" }, take: 20 }, domains: { select: { hostname: true, status: true } } },
  });
  if (!p) notFound();
  const doc = parseDoc(p.published ?? p.draft);
  const back = `/admin/pages/${p.id}`;
  return (
    <>
      <PageHeader title={p.name} description={<>{p.username ? `/${p.username}` : "No username"} · owner {p.owner.email}</>} />
      <Body>
        <Flash msg={msg} />
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="card overflow-hidden">
            <p className="border-b border-line px-4 py-2 text-[12px] text-fg-muted">Showing the {p.published ? "published" : "draft (never published)"} version · read-only</p>
            <div className="flex h-[720px] overflow-y-auto" inert>
              <BioPage doc={doc} ctx={{ mode: "preview", pageId: p.id, pageUrl: p.username ? `${env.appUrl}/${p.username}` : env.appUrl }} />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <section className="card p-5 text-small">
              <h2 className="text-h4 font-semibold">Status</h2>
              <dl className="mt-3 grid grid-cols-[140px_1fr] gap-y-2">
                <dt className="text-fg-muted">Status</dt>
                <dd>
                  <StatusBadge status={p.status} />
                </dd>
                {p.suspendedReason ? (
                  <>
                    <dt className="text-fg-muted">Reason</dt>
                    <dd className="text-error">{p.suspendedReason}</dd>
                  </>
                ) : null}
                <dt className="text-fg-muted">Published</dt>
                <dd>{fmtDate(p.publishedAt)}</dd>
                <dt className="text-fg-muted">Owner account</dt>
                <dd>{p.owner.status === "SUSPENDED" ? <Pill tone="bad">Suspended</Pill> : <Pill tone="ok">Active</Pill>}</dd>
                <dt className="text-fg-muted">Domains</dt>
                <dd>{p.domains.length ? p.domains.map((d) => `${d.hostname} (${d.status.toLowerCase()})`).join(", ") : "—"}</dd>
              </dl>
              <div className="mt-4">
                {p.status === "SUSPENDED" ? (
                  <ActionButton action={restorePageAction} fields={{ pageId: p.id, back }} label="Restore page" tone="primary" />
                ) : (
                  <form action={suspendPageAction} className="flex flex-wrap gap-2">
                    <input type="hidden" name="pageId" value={p.id} />
                    <input type="hidden" name="back" value={back} />
                    <label className="sr-only" htmlFor="reason">
                      Suspension reason
                    </label>
                    <input id="reason" name="reason" placeholder="Reason shown to the owner" maxLength={300} className="field min-h-9 flex-1 text-small" />
                    <button className="btn h-9 bg-error-fill px-3 text-small text-white hover:bg-error">Suspend page</button>
                  </form>
                )}
              </div>
            </section>
            <section className="card p-5 text-small">
              <h2 className="text-h4 font-semibold">Reports</h2>
              {p.reports.length ? (
                <ul className="mt-3 divide-y divide-line">
                  {p.reports.map((r) => (
                    <li key={r.id} className="py-2">
                      <p className="font-semibold text-fg">
                        {r.reason} <Pill tone={r.status === "OPEN" ? "bad" : "muted"}>{r.status.toLowerCase()}</Pill>
                      </p>
                      {r.details ? <p className="whitespace-pre-line text-fg-secondary">{r.details}</p> : null}
                      <p className="text-[12px] text-fg-muted">{fmtDate(r.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-fg-muted">No reports.</p>
              )}
              <Link href="/admin/reports" className="mt-3 inline-block font-semibold text-primary hover:underline">
                All reports →
              </Link>
            </section>
          </div>
        </div>
      </Body>
    </>
  );
}
