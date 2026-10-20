import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { pageStats } from "@/lib/server/stats";
import { env } from "@/lib/server/env";
import { parseDoc } from "@/lib/bio/schema";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Icon } from "@/components/dashboard/icons";

export const metadata: Metadata = { title: "Overview" };

function delta(cur: number, prev: number) {
  if (!prev) return cur ? "new" : "—";
  const d = ((cur - prev) / prev) * 100;
  return `${d >= 0 ? "+" : ""}${d.toFixed(0)}%`;
}

export default async function Overview({ searchParams }: { searchParams: Promise<{ verified?: string }> }) {
  const user = await requireUser("/dashboard");
  const { verified } = await searchParams;
  const pages = await db.bioPage.findMany({ where: { ownerId: user.id }, orderBy: { updatedAt: "desc" }, select: { id: true, name: true, username: true, status: true, draft: true } });
  const to = new Date();
  const from = new Date(to.getTime() - 7 * 864e5);
  const [stats, newLeads] = await Promise.all([pageStats(pages.map((p) => p.id), from, to), db.lead.count({ where: { page: { ownerId: user.id }, readAt: null } })]);
  const first = pages[0];
  const firstDoc = first ? parseDoc(first.draft) : null;

  const checklist = [
    { done: Boolean(user.emailVerifiedAt), label: "Confirm your email", href: "/verify-email" },
    { done: pages.length > 0, label: "Create a page from a template", href: "/dashboard/new" },
    { done: Boolean(firstDoc?.profile.avatar), label: "Add a profile photo", href: first ? `/editor/${first.id}` : "/dashboard/new" },
    { done: (firstDoc?.blocks.filter((b) => b.type === "link").length ?? 0) >= 3, label: "Add three links", href: first ? `/editor/${first.id}` : "/dashboard/new" },
    { done: pages.some((p) => p.status === "PUBLISHED"), label: "Publish your page", href: first ? `/editor/${first.id}` : "/dashboard/new" },
  ];

  return (
    <>
      <PageHeader title={`Hi${user.name ? `, ${user.name.split(" ")[0]}` : ""} 👋`} description="Here's how your bio pages did in the last 7 days." actions={<ButtonLink href="/dashboard/new"><Icon name="plus" size={16} /> Create new</ButtonLink>} />
      <Body>
        {verified ? <p className="mb-5 rounded-sm bg-success-soft px-4 py-3 text-small text-success">Email confirmed — you can publish now.</p> : null}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Views", value: stats.views, d: delta(stats.views, stats.previous.views) },
            { label: "Unique visitors", value: stats.uniques, d: delta(stats.uniques, stats.previous.uniques) },
            { label: "Link clicks", value: stats.clicks, d: delta(stats.clicks, stats.previous.clicks) },
            { label: "New leads", value: newLeads, d: null },
          ].map((k) => (
            <div key={k.label} className="card p-5">
              <p className="text-small text-fg-muted">{k.label}</p>
              <p className="mt-1 font-display text-[30px] font-semibold text-fg tabular-nums">{k.value.toLocaleString()}</p>
              {k.d ? <p className="text-[12px] text-fg-muted">{k.d} vs previous 7 days</p> : <Link href="/dashboard/leads" className="text-[12px] text-primary hover:underline">Open leads</Link>}
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-h4 font-semibold">Your pages</h2>
              <Link href="/dashboard/pages" className="text-small font-semibold text-primary hover:underline">
                Manage all
              </Link>
            </div>
            {pages.length ? (
              <ul className="mt-4 divide-y divide-line">
                {pages.slice(0, 6).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 truncate font-semibold text-fg">
                        {p.name} <StatusBadge status={p.status} />
                      </p>
                      <p className="truncate text-small text-fg-muted">{p.username ? `${env.appUrl.replace(/^https?:\/\//, "")}/${p.username}` : "Not published yet"}</p>
                    </div>
                    <Link href={`/editor/${p.id}`} className="btn h-9 shrink-0 px-3 text-[13px] text-fg ring-1 ring-line hover:bg-canvas-secondary">
                      Edit
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-body text-fg-muted">
                No pages yet.{" "}
                <Link href="/dashboard/new" className="font-semibold text-primary hover:underline">
                  Create your first one
                </Link>
                .
              </p>
            )}
          </section>
          <section className="card p-5">
            <h2 className="text-h4 font-semibold">Get set up</h2>
            <ol className="mt-4 flex flex-col gap-3">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-3">
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full text-[12px] ${c.done ? "bg-success-fill text-white" : "ring-1 ring-line-strong"}`}>{c.done ? "✓" : ""}</span>
                  {c.done ? <span className="text-small text-fg-muted line-through">{c.label}</span> : <Link href={c.href} className="text-small font-semibold text-fg hover:text-primary">{c.label}</Link>}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </Body>
    </>
  );
}
