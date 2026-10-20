import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { parseDoc } from "@/lib/bio/schema";
import { EditorApp } from "@/components/editor/editor-app";
import { env } from "@/lib/server/env";

export const metadata: Metadata = { title: "Editor" };

export default async function EditorPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ wizard?: string; username?: string }> }) {
  const { id } = await params;
  const { wizard, username } = await searchParams;
  const user = await requireUser(`/editor/${id}`);
  const page = await db.bioPage.findFirst({ where: { id, ownerId: user.id } });
  if (!page) notFound();
  const templates = await db.template.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true, category: true } });
  const doc = parseDoc(page.draft);
  return (
    <EditorApp
      page={{
        id: page.id,
        name: page.name,
        username: page.username,
        status: page.status,
        draftVersion: page.draftVersion,
        hasPublished: Boolean(page.published),
        notifyLeads: page.notifyLeads,
        templateId: page.templateId,
        draftDiffers: Boolean(page.published) && JSON.stringify(page.published) !== JSON.stringify(page.draft),
      }}
      initialDoc={doc}
      templates={templates}
      verified={Boolean(user.emailVerifiedAt)}
      appUrl={env.appUrl}
      wizard={wizard === "1"}
      claim={page.username ? undefined : username?.slice(0, 30)}
    />
  );
}
