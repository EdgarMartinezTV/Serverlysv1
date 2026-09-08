import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { billing } from "@/data/company";

/**
 * Migration explainer.
 *
 * Purpose: this is the single largest objection to changing host — fear of
 * downtime. The section exists to answer it concretely (staging first, you
 * approve, DNS last), not to decorate the page with a process graphic.
 */
const STEPS = [
  {
    title: "Tell us where it lives now",
    body: "Send us the current host login, or just the domain. No sales call required.",
  },
  {
    title: "We move it to staging",
    body: "Site, database and email are copied to a temporary URL, usually within a business day.",
  },
  {
    title: "You check it properly",
    body: "Click through it on the staging URL. We fix anything that looks wrong before go-live.",
  },
  {
    title: "We switch DNS when you say",
    body: "Your old host keeps serving until propagation finishes, so there is no gap in service.",
  },
] as const;

export function Migration() {
  return (
    <Section surface="subtle" labelledBy="migration-heading">
      <SectionHeader
        id="migration-heading"
        eyebrow="Switching host"
        title="Move an existing site without downtime"
        lede="Migration is free and handled by our team. Nothing points at Serverlys until you have seen the site working."
      />

      <ol className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="relative flex flex-col gap-3 rounded-xl bg-white p-6 shadow-e1 ring-1 ring-ink-200"
          >
            <span
              className="tabular inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-body-sm font-semibold text-brand-700"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <h3 className="text-heading-3 text-ink-950">{step.title}</h3>
            <p className="text-body-sm text-ink-600">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <Button href={billing.sales} variant="secondary" size="lg">
          Ask about migrating your site
        </Button>
      </div>
    </Section>
  );
}
