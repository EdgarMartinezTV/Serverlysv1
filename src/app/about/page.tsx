import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { DashboardMock } from "@/components/product-ui/dashboard";
import { company } from "@/data/company";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";

const PATH = "/about";

export const metadata = pageMetadata({
  title: "About Serverlys — what we do and how we price it",
  description:
    "Serverlys provides managed hosting, domains, websites and AI agents for small businesses, with renewal pricing published up front.",
  path: PATH,
});

/**
 * About.
 *
 * Deliberately free of unverifiable claims: no founding date, no customer
 * count, no team photos. Those facts have not been supplied, and inventing
 * entity data is worse than omitting it.
 */
export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "About", path: PATH }])} />

      <section className="relative isolate overflow-hidden bg-canvas-abyss">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_25%_-5%,rgb(34_126_255/0.3)_0%,transparent_68%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />
        <Container className="relative pb-16 pt-8 sm:pb-20 sm:pt-10">
          <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "About" }]} tone="dark" />
          <div className="mt-10 max-w-2xl">
            <span className="font-mono text-caption uppercase text-accent-on-dark">About</span>
            <h1 className="mt-4 text-h1 text-white">
              {company.legalName}
            </h1>
            <p className="mt-5 text-body-lg text-fg-on-dark-secondary">
              We host small business websites, register their domains, build the
              sites when asked, and run the AI that answers their customers. All
              of it on one bill, with the renewal price printed next to the
              first-year price.
            </p>
          </div>
        </Container>
      </section>

      <FeatureGrid
        eyebrow="How we work"
        title="Three commitments, and what they cost us"
        lede="These are positions, not slogans — each one is something we could make more money by abandoning."
        surface="light"
        columns={3}
        items={[
          { label: "Renewal pricing published", detail: "Year two sits beside year one on every plan. It costs us sign-ups and keeps customers.", icon: "chart" },
          { label: "Migration is free", detail: "We move site, database and email to staging first. You approve before DNS moves.", icon: "compass" },
          { label: "Restores are free", detail: "A backup you have to pay to use is not really a backup.", icon: "shield" },
        ]}
      />

      <ShowcaseSplit
        id="platform"
        eyebrow="One platform"
        title="Hosting, domains and AI in one place"
        body="Most small businesses end up with four suppliers who have never spoken to each other. Everything we sell sits in the same panel, on the same invoice, supported by the same people."
        cta={{ label: "See what that covers", href: "/business-solutions" }}
        visual={<DashboardMock />}
        side="right"
        surface="subtle"
        bleed
      />

      <FinalCta />
    </>
  );
}
