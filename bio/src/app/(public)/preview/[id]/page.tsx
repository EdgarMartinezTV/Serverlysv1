import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { parseDoc } from "@/lib/bio/schema";
import { BioPage } from "@/components/bio/renderer";
import { env } from "@/lib/server/env";

export const metadata: Metadata = { title: "Draft preview", robots: { index: false, follow: false } };

/** The owner's DRAFT, rendered exactly as it will publish. Private to the owner. */
export default async function DraftPreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect(`/login?next=/preview/${id}`);
  const page = await db.bioPage.findFirst({ where: { id, ownerId: user.id } });
  if (!page) notFound();
  const url = page.username ? `${env.appUrl}/${page.username}` : env.appUrl;
  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 60, background: "#101011", color: "#fff", font: "600 13px/1.4 system-ui, sans-serif", padding: "10px 16px", display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
        <span>Draft preview — visitors {page.status === "PUBLISHED" ? "see the last published version" : "can't see this page yet"}</span>
        <a href={`/editor/${page.id}`} style={{ color: "#fff" }}>
          Back to editor
        </a>
      </div>
      <BioPage doc={parseDoc(page.draft)} fixedBackground ctx={{ mode: "preview", pageId: page.id, pageUrl: url }} />
    </>
  );
}
