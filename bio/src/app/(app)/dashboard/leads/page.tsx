import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import type { LeadKind, Prisma } from "@/generated/prisma/client";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { deleteLead, markLeadsRead } from "@/lib/actions/leads";

export const metadata: Metadata = { title: "Leads" };

type SP = { page?: string; kind?: string; q?: string; p?: string };
const PER = 50;

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const user = await requireUser("/dashboard/leads");
  const sp = await searchParams;
  const pages = await db.bioPage.findMany({ where: { ownerId: user.id }, select: { id: true, name: true } });
  const kind: LeadKind | undefined = sp.kind === "NEWSLETTER" || sp.kind === "CONTACT" ? sp.kind : undefined;
  const pageNo = Math.max(1, Number(sp.p) || 1);
  const where: Prisma.LeadWhereInput = {
    page: { ownerId: user.id },
    ...(sp.page && pages.some((p) => p.id === sp.page) ? { pageId: sp.page } : {}),
    ...(kind ? { kind } : {}),
    ...(sp.q ? { OR: [{ email: { contains: sp.q, mode: "insensitive" as const } }, { name: { contains: sp.q, mode: "insensitive" as const } }, { message: { contains: sp.q, mode: "insensitive" as const } }] } : {}),
  };
  const [leads, total] = await Promise.all([
    db.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: PER, skip: (pageNo - 1) * PER, include: { page: { select: { name: true } } } }),
    db.lead.count({ where }),
  ]);
  const unread = leads.filter((l) => !l.readAt).map((l) => l.id);
  const exportQs = new URLSearchParams(Object.entries({ page: sp.page, kind, q: sp.q }).filter(([, v]) => v) as [string, string][]).toString();

  return (
    <>
      <PageHeader
        title="Leads"
        description="Signups and messages from forms on your pages. Only you can see these."
        actions={
          <a href={`/api/leads/export?${exportQs}`} download className="btn h-10 px-4 text-small text-fg ring-1 ring-line hover:bg-surface">
            Export CSV
          </a>
        }
      />
      <Body>
        <form method="get" className="card mb-5 flex flex-wrap items-end gap-3 p-4">
          <label className="flex flex-col gap-1 text-small font-medium text-fg">
            Page
            <select name="page" defaultValue={sp.page ?? ""} className="field min-h-10 w-48 text-small">
              <option value="">All pages</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-small font-medium text-fg">
            Type
            <select name="kind" defaultValue={kind ?? ""} className="field min-h-10 w-44 text-small">
              <option value="">All</option>
              <option value="NEWSLETTER">Email signups</option>
              <option value="CONTACT">Contact messages</option>
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1 text-small font-medium text-fg">
            Search
            <input name="q" defaultValue={sp.q} placeholder="Name, email or message" className="field min-h-10 text-small" />
          </label>
          <button className="btn h-10 bg-fg px-4 text-small text-white">Filter</button>
        </form>

        {unread.length ? (
          <form
            action={async () => {
              "use server";
              await markLeadsRead(unread);
            }}
            className="mb-3"
          >
            <button className="text-small font-semibold text-primary hover:underline">Mark {unread.length} as read</button>
          </form>
        ) : null}

        {leads.length === 0 ? (
          <div className="card px-6 py-14 text-center">
            <p className="text-h4 font-semibold text-fg">No leads yet</p>
            <p className="mx-auto mt-2 max-w-sm text-body text-fg-muted">Add an “Email signup” or “Contact form” block to a page and publish it. Submissions appear here.</p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] text-small" aria-label="Leads">
              <thead className="border-b border-line text-left text-fg-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Received</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Message</th>
                  <th className="px-4 py-3 font-medium">Page</th>
                  <th className="px-4 py-3 font-medium">Consent</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {leads.map((l) => (
                  <tr key={l.id} className={l.readAt ? "" : "bg-primary-soft/40"}>
                    <td className="whitespace-nowrap px-4 py-3 align-top text-fg-muted">
                      {!l.readAt ? <span className="mr-1.5 inline-block size-2 rounded-full bg-primary" aria-label="Unread" /> : null}
                      {l.createdAt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {l.name ? <p className="font-semibold text-fg">{l.name}</p> : null}
                      <a href={`mailto:${l.email}`} className="text-primary hover:underline">
                        {l.email}
                      </a>
                      {l.phone ? <p className="text-fg-muted">{l.phone}</p> : null}
                      <p className="text-[12px] text-fg-muted">{l.kind === "NEWSLETTER" ? "Email signup" : "Contact form"}</p>
                    </td>
                    <td className="max-w-[320px] whitespace-pre-line px-4 py-3 align-top">{l.message || <span className="text-fg-muted">—</span>}</td>
                    <td className="px-4 py-3 align-top">{l.page.name}</td>
                    <td className="px-4 py-3 align-top" title={l.consentText}>
                      {l.consentGiven ? "Given" : l.consentText ? "No" : "Not asked"}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <form
                        action={async () => {
                          "use server";
                          await deleteLead(l.id);
                        }}
                      >
                        <button className="text-fg-muted hover:text-error" aria-label={`Delete lead from ${l.email}`}>
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > PER ? (
          <nav className="mt-4 flex items-center justify-between text-small" aria-label="Pagination">
            <span className="text-fg-muted">
              {(pageNo - 1) * PER + 1}–{Math.min(total, pageNo * PER)} of {total}
            </span>
            <span className="flex gap-2">
              {pageNo > 1 ? <Link href={`?${new URLSearchParams({ ...sp, p: String(pageNo - 1) } as Record<string, string>)}`}>Previous</Link> : null}
              {pageNo * PER < total ? <Link href={`?${new URLSearchParams({ ...sp, p: String(pageNo + 1) } as Record<string, string>)}`}>Next</Link> : null}
            </span>
          </nav>
        ) : null}
      </Body>
    </>
  );
}
