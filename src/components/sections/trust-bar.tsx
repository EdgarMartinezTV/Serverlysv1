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
    <section
      aria-labelledby="trust-heading"
      className="border-b border-line-subtle bg-canvas-secondary py-12 sm:py-14"
    >
      <Container>
        <h2 id="trust-heading" className="sr-only-focusable">
          What is included with every plan
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {POINTS.map((p) => (
            <div key={p.label} className="flex flex-col gap-1">
              <dt className="flex items-baseline gap-2">
                <span className="tabular text-h3 font-semibold text-fg">{p.stat}</span>
                <span className="text-small font-medium text-fg-secondary">
                  {p.label}
                </span>
              </dt>
              <dd className="text-small text-fg-muted">{p.detail}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
