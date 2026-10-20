import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/server/db";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { Flash } from "@/components/admin/ui";
import { updateTemplateAction } from "@/lib/actions/admin";
import { TEMPLATE_CATEGORIES } from "@/lib/bio/templates";

export const metadata: Metadata = { title: "Edit template" };

export default async function AdminTemplateEdit({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ msg?: string }> }) {
  const { id } = await params;
  const { msg } = await searchParams;
  const t = await db.template.findUnique({ where: { id } });
  if (!t) notFound();
  return (
    <>
      <PageHeader title={t.name} description={<>Template id {t.id} · <a className="text-primary hover:underline" href={`/t/${t.id}`} target="_blank" rel="noreferrer">live preview</a></>} />
      <Body>
        <Flash msg={msg} />
        <form action={updateTemplateAction} className="card flex max-w-3xl flex-col gap-4 p-6">
          <input type="hidden" name="templateId" value={t.id} />
          <label className="flex flex-col gap-1 text-small font-medium text-fg">
            Name
            <input name="name" defaultValue={t.name} maxLength={80} className="field text-small" required />
          </label>
          <label className="flex flex-col gap-1 text-small font-medium text-fg">
            Category
            <select name="category" defaultValue={t.category} className="field text-small">
              {TEMPLATE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-small font-medium text-fg">
            Description
            <textarea name="description" defaultValue={t.description} maxLength={400} rows={3} className="field min-h-0 text-small" />
          </label>
          <label className="flex flex-col gap-1 text-small font-medium text-fg">
            Sort order
            <input name="sortOrder" type="number" defaultValue={t.sortOrder} className="field w-32 text-small" />
          </label>
          <label className="flex flex-col gap-1 text-small font-medium text-fg">
            Content (page document JSON)
            <textarea name="content" defaultValue={JSON.stringify(t.content, null, 2)} rows={24} spellCheck={false} className="field min-h-0 font-mono text-[12px]" />
            <span className="font-normal text-fg-muted">Validated against the page schema before saving; invalid JSON is rejected and nothing changes. Re-running the seed overwrites content edits.</span>
          </label>
          <div className="flex gap-3">
            <button className="btn h-10 bg-primary px-4 text-small text-white hover:bg-primary-hover">Save template</button>
            <Link href="/admin/templates" className="btn h-10 px-4 text-small text-fg ring-1 ring-line hover:bg-canvas-secondary">
              Back
            </Link>
          </div>
        </form>
      </Body>
    </>
  );
}
