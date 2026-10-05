import { FeatureGrid } from "@/components/sections/feature-grid";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FinalCta } from "@/components/sections/final-cta";
import { DashboardMock } from "@/components/product-ui/dashboard";
import { company } from "@/data/company";
import { pageMetadata } from "@/lib/seo";
import { formatPrice, groupById } from "@/data/pricing";
import { MockPhoto } from "@/components/ui/mock-photo";
import { Button } from "@/components/ui/button";
import { PageHero } from "../resources/_components/page-hero";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

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

      <PageHero
        trail={[{ name: "Home", href: "/" }, { name: "About" }]}
        label="About Serverlys"
        title={company.legalName}
        lede={
          <p>
            We host small business websites, register their domains, build the sites when
            asked, and run the AI that answers their customers. All of it on one bill, with
            the renewal price printed next to the first-year price.
          </p>
        }
        visual={<OneBill />}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/pricing" size="lg">See plans</Button>
          <Button href="/our-process" variant="outline" size="lg">How a project runs</Button>
        </div>
      </PageHero>

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

/**
 * "One bill" — the claim this page makes, drawn: a single account statement
 * carrying hosting, the domain and ConvoAI. Prices are read from
 * data/pricing.ts, both rates shown, so this cannot drift from the store.
 */
function OneBill() {
  const starter = groupById("cloud")?.plans.find((p) => p.tier === "starter");
  return (
    <div aria-hidden="true" className="relative mx-auto max-w-[460px]">
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
        <div className="flex items-center gap-3 border-b border-line-subtle p-4">
          <MockPhoto src="bread" className="size-11 rounded-lg" />
          <div className="min-w-0 flex-1">
            <p className="text-small font-semibold text-fg">Hearth Bakery</p>
            <p className="text-micro text-fg-muted">One account · one invoice</p>
          </div>
          <span className="rounded-md bg-success-soft px-2 py-0.5 text-micro font-semibold text-success">Paid</span>
        </div>
        <ul className="divide-y divide-line-subtle text-small">
          {starter && (
            <li className="flex items-center justify-between gap-4 px-4 py-3">
              <span>
                <span className="block font-medium text-fg">{starter.name} hosting</span>
                <span className="text-micro text-fg-muted">Renews at {formatPrice(starter.standard)}/mo</span>
              </span>
              <span className="font-semibold text-fg">{formatPrice(starter.monthly)}/mo</span>
            </li>
          )}
          <li className="flex items-center justify-between gap-4 px-4 py-3">
            <span>
              <span className="block font-medium text-fg">hearthbakery.com</span>
              <span className="text-micro text-fg-muted">Domain · DNS managed</span>
            </span>
            <span className="text-micro font-semibold text-primary">Registered</span>
          </li>
          <li className="flex items-center justify-between gap-4 px-4 py-3">
            <span>
              <span className="block font-medium text-fg">ConvoAI chat agent</span>
              <span className="text-micro text-fg-muted">Answering on the site</span>
            </span>
            <span className="text-micro font-semibold text-success">Included</span>
          </li>
          <li className="flex items-center justify-between gap-4 px-4 py-3">
            <span>
              <span className="block font-medium text-fg">Migration and daily backups</span>
              <span className="text-micro text-fg-muted">Every plan</span>
            </span>
            <span className="text-micro font-semibold text-success">Free</span>
          </li>
        </ul>
      </div>
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "About", path: PATH }]} />
    </div>
  );
}
