import { Container } from "@/components/ui/container";

/**
 * Proof strip directly under the hero.
 *
 * Every claim here is one Serverlys already makes on the live site and is
 * contractually backed (refund policy, free migration, free SSL/backups).
 * Do not add a metric here that cannot be substantiated — this block exists
 * to reduce purchase risk, and an unverifiable number does the opposite.
 */
const POINTS = [
  {
    stat: "Free",
    label: "Migration",
    detail: "Site, database and email moved to staging before DNS changes.",
  },
  {
    stat: "30-day",
    label: "Money back",
    detail: "On every hosting plan, no questions asked.",
  },
  {
    stat: "Daily",
    label: "Backups",
    detail: "Included on all plans, and restores are free.",
  },
  {
    stat: "$0",
    label: "Setup fees",
    detail: "Free SSL and free WHOIS privacy included too.",
  },
] as const;

export function TrustBar() {
  return (
    <section aria-labelledby="trust-heading" className="border-b border-ink-100 bg-canvas-subtle py-12 sm:py-14">
      <Container>
        <h2 id="trust-heading" className="sr-only-focusable">
          What is included with every plan
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {POINTS.map((p) => (
            <div key={p.label} className="flex flex-col gap-1">
              <dt className="flex items-baseline gap-2">
                <span className="tabular text-heading-1 font-semibold text-ink-950">
                  {p.stat}
                </span>
                <span className="text-body-sm font-medium text-ink-700">{p.label}</span>
              </dt>
              <dd className="text-body-sm text-ink-500">{p.detail}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
