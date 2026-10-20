import type { Metadata } from "next";
import { requireUser } from "@/lib/server/auth";
import { listPages } from "@/lib/server/pages";
import { parseDoc } from "@/lib/bio/schema";
import { env } from "@/lib/server/env";
import { MiniPreview } from "@/components/bio/mini-preview";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { PageCardActions } from "@/components/dashboard/page-card-actions";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/dashboard/icons";

export const metadata: Metadata = { title: "My Bio Pages" };

export default async function MyPages({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser("/dashboard/pages");
  const pages = await listPages(user.id);
  const { error } = await searchParams;
  return (
    <>
      <PageHeader
        title="My Bio Pages"
        description={`${pages.length} ${pages.length === 1 ? "page" : "pages"} · free forever, no plans or upgrades.`}
        actions={
          <ButtonLink href="/dashboard/new">
            <Icon name="plus" size={16} /> Create new
          </ButtonLink>
        }
      />
      <Body>
        {error ? <p className="mb-4 rounded-sm bg-error-soft px-4 py-3 text-small text-error">{error}</p> : null}
        {pages.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
            <p className="text-h4 font-semibold text-fg">No pages yet</p>
            <p className="max-w-sm text-body text-fg-muted">Pick a template and publish your first bio page in a few minutes.</p>
            <ButtonLink href="/dashboard/new" className="mt-2">
              Create your first page
            </ButtonLink>
          </div>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {pages.map((p) => {
              const live = p.username ? `${env.appUrl}/${p.username}` : null;
              return (
                <li key={p.id} className="card flex overflow-hidden" data-page-card={p.id}>
                  <div className="w-[140px] shrink-0 border-r border-line">
                    <MiniPreview doc={parseDoc(p.draft)} scale={0.36} height={260} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="truncate font-display text-[17px] font-semibold text-fg">{p.name}</h2>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="mt-0.5 truncate text-small text-fg-muted">{p.username ? `${env.appUrl.replace(/^https?:\/\//, "")}/${p.username}` : "No username yet"}</p>
                      <p className="text-[12px] text-fg-muted">Edited {p.updatedAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
                      {p.suspendedReason ? <p className="mt-1 text-[12px] text-error">Suspended: {p.suspendedReason}</p> : null}
                    </div>
                    <div className="mt-auto">
                      <PageCardActions id={p.id} name={p.name} status={p.status} username={p.username} liveUrl={live} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Body>
    </>
  );
}
