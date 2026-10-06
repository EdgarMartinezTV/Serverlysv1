import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { BuildLaptop } from "./build-laptop";
import { upcomingProducts } from "@/data/products";
import { StageRow } from "./stage-row";
import { stageById } from "./stages";

const stage = stageById("build");

const LINKS = [
  { label: "Cloud hosting", href: "/cloud-hosting" },
  { label: "WordPress hosting", href: "/wordpress-hosting" },
  { label: "Ecommerce hosting", href: "/ecommerce-hosting" },
] as const;

const PROOF = [
  "Free migration from any host",
  "NVMe + LiteSpeed on every tier",
  "30-day money-back guarantee",
] as const;

/*
 * 2026-10-03: the "01 · Build" header and the dark overlap panel are gone. The
 * section is one open row (live console left, argument right) and a pair of
 * pale cards, the same grammar as every other stage now uses via StageRow.
 */
export function StageBuild() {
  const hands = upcomingProducts.filter((product) =>
    ["/vps-hosting", "/dedicated-servers"].includes(product.href),
  );

  return (
    <Section
      id={stage.id}
      surface="light"
      spacing="tight"
      width="wide"
      labelledBy="build-heading"
      className="scroll-mt-16"
    >
      <Reveal>
        <StageRow
          id="build-heading"
          icon="server"
          title={stage.heading}
          body={stage.lede}
          links={LINKS}
          proof={PROOF}
          media={<BuildLaptop />}
        />
      </Reveal>

      {/* ── Hands-on control ─────────────────────────────────────────────── */}
      <div className="mt-20">
        <Reveal>
          <h3 className="text-h3 font-medium tracking-[-0.02em] text-fg">
            Want more hands-on control?
          </h3>
        </Reveal>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {hands.map((product, index) => (
            <Reveal as="li" key={product.href} delay={index * 80}>
              <Link
                href={product.href}
                className="group flex h-full flex-col rounded-2xl bg-brand-50 p-6 transition-colors duration-fast hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white text-primary shadow-e1">
                    {index === 0 ? (
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
                        <rect x="4" y="4" width="16" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
                        <rect x="4" y="13" width="16" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
                        <path d="M8 7.5h.01M8 16.5h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
                        <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
                        <path d="M9 7h6M9 11h6M9 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      </svg>
                    )}
                  </span>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-fg transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="mt-8 flex items-center gap-2">
                  <span className="text-body-lg font-medium text-fg">{product.name}</span>
                  <span className="rounded-md bg-white px-2 py-0.5 text-micro font-semibold text-warning">
                    Coming soon
                  </span>
                </span>
                <span className="mt-1 text-small text-fg-secondary">{product.summary}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
