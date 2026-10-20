import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/server/db";
import { parseDoc } from "@/lib/bio/schema";
import { BioPage } from "@/components/bio/renderer";
import { env } from "@/lib/server/env";

/**
 * Live, interactive template preview. Embedded in an iframe by
 * serverlys.com/bio (see next.config.ts frame-ancestors) and opened from the
 * template gallery. Forms render but don't submit (preview mode).
 */
type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  const row = await db.template.findFirst({ where: { id, active: true } });
  return row ? { ...row, doc: parseDoc(row.content) } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await load((await params).id);
  return { title: t ? `${t.name} template · Serverlys Bio` : "Template not found", robots: { index: false } };
}

export default async function TemplatePreview({ params }: Props) {
  const t = await load((await params).id);
  if (!t) notFound();
  return <BioPage doc={t.doc} fixedBackground ctx={{ mode: "preview", pageId: `template-${t.id}`, pageUrl: `${env.appUrl}/signup?template=${t.id}` }} />;
}
