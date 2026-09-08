import { Container } from "@/components/ui/container";

/**
 * Guarantee strip, directly under the hero.
 *
 * Purpose: remove purchase risk at the moment interest is highest. Every claim
 * here is one Serverlys already makes and is contractually backed — refund
 * policy, free migration, free SSL and backups.
 *
 * Deliberately NOT a logo wall or a metrics row: no customer logos exist to
 * show, and inventing an uptime figure or a customer count to fill the space
 * would undermine the exact thing this section is for.
 *
 * Treatment: a spec strip with rules between items rather than four floating
 * cards — it reads as a specification, which suits infrastructure.
 */
const GUARANTEES = [
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
      aria-labelledby="guarantees-heading"
      className="border-b border-line bg-canvas"
    >
      <Container>
        <h2 id="guarantees-heading" className="sr-only">
          What is included with every plan
        </h2>
        <dl className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {GUARANTEES.map((g, i) => (
            <div
              key={g.label}
              className={[
                "flex flex-col gap-1.5 py-8 lg:py-10",
                // Vertical rules between columns, never on the first in a row.
                i > 0 && "sm:border-line lg:border-l lg:pl-8",
                i % 2 === 1 && "sm:border-l sm:pl-8",
                i === 2 && "sm:border-t sm:border-line lg:border-t-0",
                i === 3 && "sm:border-t sm:border-line lg:border-t-0",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <dt className="flex items-baseline gap-2">
                <span className="tabular text-h3 text-fg">{g.stat}</span>
                <span className="font-mono text-caption uppercase text-primary">
                  {g.label}
                </span>
              </dt>
              <dd className="max-w-[26ch] text-small text-fg-secondary">{g.detail}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
