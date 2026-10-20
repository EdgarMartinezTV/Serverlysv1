import type { Metadata } from "next";
import { activeTemplates } from "@/lib/server/templates";
import { TemplateGallery } from "@/components/dashboard/template-gallery";
import { MiniPreview } from "@/components/bio/mini-preview";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { createPageAction } from "@/lib/actions/pages";

export const metadata: Metadata = { title: "Templates" };

export default async function TemplatesPage() {
  const templates = await activeTemplates();
  return (
    <>
      <PageHeader title="Templates" description={`${templates.length} free templates. Pick one to start a new page — everything is editable.`} />
      <Body>
        <TemplateGallery
          items={templates.map((t) => ({ ...t, thumb: <MiniPreview doc={t.doc} height={452} scale={0.559} /> }))}
          onChoose={async (id) => {
            "use server";
            await createPageAction(id);
          }}
        />
      </Body>
    </>
  );
}
