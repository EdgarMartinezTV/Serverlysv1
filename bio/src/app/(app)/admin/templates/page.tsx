import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/server/db";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { ActionButton, Pill } from "@/components/admin/ui";
import { toggleTemplateAction } from "@/lib/actions/admin";
import { TEMPLATE_CATEGORIES } from "@/lib/bio/templates";

export const metadata: Metadata = { title: "Templates" };

export default async function AdminTemplates() {
  const templates = await db.template.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  const usage = await db.bioPage.groupBy({ by: ["templateId"], _count: { _all: true } });
  const used = new Map(usage.map((u) => [u.templateId, u._count._all]));
  return (
    <>
      <PageHeader title="Templates" description="Inactive templates are hidden from the gallery; pages already using them are unaffected." />
      <Body>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[820px] text-small" aria-label="Templates">
            <thead className="border-b border-line text-left text-fg-muted">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Template</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 text-right font-medium">Pages</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {templates.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 tabular-nums text-fg-muted">{t.sortOrder}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-fg">{t.name}</p>
                    <p className="text-[12px] text-fg-muted">{t.id}</p>
                  </td>
                  <td className="px-4 py-3">{TEMPLATE_CATEGORIES.find((c) => c.id === t.category)?.label ?? t.category}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{used.get(t.id) ?? 0}</td>
                  <td className="px-4 py-3">
                    <ActionButton action={toggleTemplateAction} fields={{ templateId: t.id, field: "active", value: t.active ? "0" : "1" }} label={t.active ? "Active ✓" : "Inactive"} tone={t.active ? "default" : "danger"} />
                  </td>
                  <td className="px-4 py-3">
                    <ActionButton action={toggleTemplateAction} fields={{ templateId: t.id, field: "featured", value: t.featured ? "0" : "1" }} label={t.featured ? "Featured ★" : "Not featured"} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Link href={`/admin/templates/${t.id}`} className="font-semibold text-primary hover:underline">
                      Edit
                    </Link>{" "}
                    ·{" "}
                    <a href={`/t/${t.id}`} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
                      Preview
                    </a>
                    {!t.active ? (
                      <span className="ml-2">
                        <Pill tone="muted">hidden</Pill>
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Body>
    </>
  );
}
