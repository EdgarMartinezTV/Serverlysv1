import { ProductHero } from "@/components/sections/product-hero";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Section, SectionHeader } from "@/components/ui/section";
import { PricingTable } from "@/components/pricing/pricing-table";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { Reveal } from "@/components/animations/reveal";
import { planGroups, formatPrice, lowestAnnualRate } from "@/data/pricing";
import { tlds } from "@/data/tlds";
import { billing } from "@/data/company";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph, productGraph } from "@/lib/seo";

const PATH = "/pricing";
const DESCRIPTION =
  "Every Serverlys plan with its renewal price beside its introductory price. Cloud, WordPress and ecommerce hosting, plus domain pricing, on one page.";

export const metadata = pageMetadata({
  title: `Pricing — every plan and every renewal rate | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

/**
 * Full pricing. Data-driven from `data/pricing.ts` — no page hard-codes a
 * price, so a change moves every surface at once.
 */
export default function PricingPage() {
  const faqs = faqsFor("/pricing");
  const all = planGroups.flatMap((g) => g.plans.map((p) => p.annual));

  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Pricing", path: PATH }])} />
      <JsonLd
        data={productGraph({
          name: "Serverlys Hosting Plans",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...all),
          highPrice: Math.max(...all),
        })}
      />
      <JsonLd data={faqGraph(faqs)} />

      <ProductHero
        eyebrow="Pricing"
        title="Both numbers, on the same page"
        lede="Introductory pricing is normal in this industry. Hiding what happens next is the part we do differently — every tier below shows what it renews at."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Pricing" }]}
        specs={[
          { label: "From", value: `${formatPrice(lowestAnnualRate)}/mo` },
          { label: "Setup fees", value: "None" },
          { label: "Money back", value: "30 days" },
          { label: "Migration", value: "Free" },
        ]}
        primary={{ label: "See the plans", href: "#plans" }}
        secondary={{ label: "Ask which fits", href: billing.sales }}
      />

      <Section id="plans" labelledBy="plans-heading" spacing="base">
        <SectionHeader
          id="plans-heading"
          eyebrow="Hosting"
          title="Every tier, every term"
          lede="Switch between annual and monthly, and between products. The renewal rate never leaves the card."
          align="center"
        />
        <div className="mt-12">
          <PricingTable />
        </div>
      </Section>

      {/* Domains, priced on the same page rather than hidden behind a search */}
      <section className="border-y border-line bg-canvas-secondary">
        <Container className="py-20 sm:py-24">
          <Reveal className="max-w-2xl">
            <span className="font-mono text-caption uppercase text-primary">Domains</span>
            <h2 className="mt-4 text-h2 text-fg">Extensions and first-year prices</h2>
            <p className="mt-5 text-body-lg text-fg-secondary">
              Standard registration. Premium names are priced by the registry and
              labelled as premium before checkout.
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tlds.map((t) => (
              <li
                key={t.tld}
                className="flex items-baseline justify-between gap-4 rounded-lg bg-surface p-4 ring-1 ring-inset ring-line"
              >
                <span>
                  <span className="block font-mono text-body font-medium text-fg">{t.tld}</span>
                  {t.note && <span className="mt-0.5 block text-small text-fg-muted">{t.note}</span>}
                </span>
                <span className="tabular shrink-0 text-body font-semibold text-fg">
                  ${t.price.toFixed(2)}
                  <span className="block text-right text-small font-normal text-fg-muted">/yr</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <FeatureGrid
        eyebrow="On every plan"
        title="What the price already includes"
        lede="These are not add-ons and they are not tier-gated."
        surface="light"
        columns={4}
        items={[
          { label: "Free migration", detail: "Site, database and email, staged before DNS.", icon: "compass" },
          { label: "Daily backups", detail: "Restores cost nothing and need no ticket.", icon: "shield" },
          { label: "Free SSL", detail: "Issued and renewed automatically.", icon: "shield" },
          { label: "30-day money back", detail: "On every hosting plan, no questions.", icon: "book" },
        ]}
      />

      <FaqSection items={faqs} />
      <FinalCta />
    </>
  );
}
