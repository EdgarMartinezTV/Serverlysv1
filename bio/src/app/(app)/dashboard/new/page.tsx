import type { Metadata } from "next";
import { activeTemplates } from "@/lib/server/templates";
import { TemplateGallery } from "@/components/dashboard/template-gallery";
import { MiniPreview } from "@/components/bio/mini-preview";
import { Body } from "@/components/dashboard/page-header";
import { WizardSteps } from "@/components/dashboard/wizard-steps";
import { createPageAction } from "@/lib/actions/pages";

export const metadata: Metadata = { title: "Create a new bio page" };

/** Onboarding step 1 of 3 — choose a template (or start blank). */
export default async function NewPageStep1({ searchParams }: { searchParams: Promise<{ template?: string; username?: string }> }) {
  const { template, username } = await searchParams;
  // Arriving from serverlys.com/bio with a template already picked: skip ahead.
  if (template) await createPageAction(template, username);
  const templates = await activeTemplates();
  return (
    <>
      <div className="px-5 pt-8 sm:px-8">
        <WizardSteps current={1} />
        <h1 className="mt-6 text-h3 font-semibold">Choose a template</h1>
        <p className="mt-1 text-body text-fg-muted">Start from a design made for your kind of business. You can switch later without losing your content.</p>
      </div>
      <Body>
        <div className="mt-6">
          <TemplateGallery
            items={templates.map((t) => ({ ...t, thumb: <MiniPreview doc={t.doc} height={452} scale={0.559} /> }))}
            onChoose={async (id) => {
              "use server";
              await createPageAction(id, username);
            }}
          />
          <form
            className="mt-10 text-center"
            action={async () => {
              "use server";
              await createPageAction(null, username);
            }}
          >
            <button className="text-small font-semibold text-primary hover:underline">Or start from a blank page</button>
          </form>
        </div>
      </Body>
    </>
  );
}
