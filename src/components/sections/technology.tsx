import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { billing } from "@/data/company";

/**
 * Infrastructure section.
 *
 * Purpose: substantiate the performance and security claims with concrete,
 * checkable specifics. A hosting buyer is choosing something they cannot see,
 * so the section's job is to make the stack legible.
 *
 * Treatment: a DATASHEET, not another card grid. Rows of label/value on the
 * dark band read as a specification and are visually distinct from the product
 * cards above — repeating the card pattern here would flatten the page.
 *
 * Every row is a real capability taken from the live site. There is no uptime
 * percentage or customer count here: those numbers are not verified, and an
 * invented figure in a section whose entire purpose is credibility would be
 * self-defeating.
 */
const SPEC = [
  {
    label: "Storage",
    value: "NVMe SSD",
    detail: "Unlimited on every plan, not a tiered allowance.",
  },
  {
    label: "Cache",
    value: "LiteSpeed",
    detail: "Server-level caching, configured before you arrive.",
  },
  {
    label: "Scaling",
    value: "Automatic",
    detail: "Cloud plans absorb traffic spikes without a migration.",
  },
  {
    label: "Backups",
    value: "Daily",
    detail: "Retained and restorable at no cost, on every tier.",
  },
  {
    label: "Certificates",
    value: "Free SSL",
    detail: "Issued and renewed automatically. Nothing to configure.",
  },
  {
    label: "Updates",
    value: "Managed",
    detail: "WordPress core patched for you on managed plans.",
  },
] as const;

export function Technology() {
  return (
    <Section
      surface="dark"
      labelledBy="tech-heading"
      className="relative isolate overflow-hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />

      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
        {/* justify-between anchors the CTAs to the bottom on desktop so the
            column balances the datasheet instead of leaving a void beneath. */}
        <div className="flex flex-col items-start lg:justify-between">
          <div className="flex flex-col items-start">
            <span className="font-mono text-caption uppercase text-primary-on-dark">
              Infrastructure
            </span>
            <h2 id="tech-heading" className="mt-4 text-h2 text-white">
              The same stack under every plan
            </h2>
            <p className="mt-5 max-w-md text-body-lg text-fg-on-dark-secondary">
              Tiers differ by resources and who maintains them — not by whether you get
              the fast disks or the working cache. Nothing here is an upsell.
            </p>
          </div>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:mt-0 lg:pt-12">
            <Button href="/cloud-hosting" variant="inverse" size="lg" block>
              How it is built
            </Button>
            <Button href={billing.sales} variant="inverseOutline" size="lg" block>
              Ask an engineer
            </Button>
          </div>
        </div>

        {/* Datasheet */}
        <dl className="divide-y divide-line-on-dark border-y border-line-on-dark">
          {SPEC.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[6.5rem_1fr] items-baseline gap-x-5 gap-y-1 py-4 sm:grid-cols-[8rem_1fr]"
            >
              <dt className="font-mono text-caption uppercase text-fg-on-dark-muted">
                {row.label}
              </dt>
              <dd className="text-body-lg font-semibold text-white">{row.value}</dd>
              <p className="col-start-2 text-small text-fg-on-dark-muted">
                {row.detail}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
