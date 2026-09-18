import { ProductHero } from "@/components/sections/product-hero";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { ProductFit } from "@/components/sections/product-fit";
import { Migration } from "@/components/sections/migration";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { PricingBand } from "@/components/home/pricing-band";
import { JsonLd } from "@/components/ui/json-ld";
import { HostingConsole } from "@/components/product-ui/live/hosting-console";
import { HostingMock, DomainMock } from "@/components/product-ui/mocks";
import { billing } from "@/data/company";
import { groupById, formatPrice } from "@/data/pricing";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph, productGraph } from "@/lib/seo";

const PATH = "/hosting";
const DESCRIPTION =
  "Cloud, WordPress and ecommerce hosting on one stack, with free migration, daily backups and the renewal price published beside the first-year price.";

const cloud = groupById("cloud");
const prices = cloud?.plans.map((p) => p.monthly) ?? [0];

export const metadata = pageMetadata({
  title: `Web Hosting — managed plans from ${formatPrice(Math.min(...prices))}/mo | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

/** Hosting hub. Routes to the specific product, and sells the shared stack. */
export default function HostingPage() {
  const faqs = [...faqsFor(PATH), ...faqsFor("/cloud-hosting")];

  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Hosting", path: PATH }])} />
      <JsonLd
        data={productGraph({
          name: "Serverlys Web Hosting",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: prices.length,
        })}
      />
      <JsonLd data={faqGraph(faqs)} />

      <ProductHero
        eyebrow="Web hosting"
        title="Web hosting on one stack, three ways to run on it."
        lede="Cloud, WordPress and ecommerce hosting share the same infrastructure. What differs is how it is tuned and who maintains it — not whether you get the fast disks."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Hosting" }]}
        specs={[
          { label: "From", value: `${formatPrice(Math.min(...prices))}/mo` },
          { label: "Storage", value: "Unlimited NVMe" },
          { label: "Migration", value: "Free" },
          { label: "Backups", value: "Daily" },
        ]}
        primary={{ label: "Compare plans", href: "#plans" }}
        secondary={{ label: "Talk to an expert", href: billing.sales }}
        visual={<HostingConsole />}
      />

      <ProductFit />

      <ShowcaseSplit
        id="panel"
        eyebrow="The panel"
        title="Everything for a site, in one place"
        body="Sites, domains, mailboxes, agents and automations sit in the same control panel. No separate logins, no reconciling two billing accounts."
        points={[
          { label: "cPanel underneath", detail: "The control panel you already know, not a bespoke one to learn.", icon: "wrench" },
          { label: "One bill", detail: "Hosting, domains and AI on a single invoice.", icon: "book" },
          { label: "Restores without a ticket", detail: "Roll a site back yourself, at no cost.", icon: "shield" },
        ]}
        cta={{ label: "See cloud hosting", href: "/cloud-hosting" }}
        visual={<HostingMock />}
        side="right"
        surface="subtle"
        bleed
      />

      <FeatureGrid
        eyebrow="Included"
        title="The things some hosts charge extra for"
        lede="Tiers differ by resources, not by whether the cache works."
        surface="light"
        columns={3}
        items={[
          { label: "Free migration", detail: "Site, database and email moved to staging before DNS changes.", icon: "compass" },
          { label: "Daily backups", detail: "Taken nightly and kept ready. Restores cost nothing.", icon: "shield" },
          { label: "Free SSL", detail: "Issued and renewed automatically, on every domain.", icon: "shield" },
          { label: "LiteSpeed cache", detail: "Configured at server level before you arrive.", icon: "bolt" },
          { label: "NVMe storage", detail: "Unlimited, not a tiered allowance.", icon: "server" },
          { label: "Unmetered transfer", detail: "No per-gigabyte overage when traffic spikes.", icon: "gauge" },
        ]}
      />

      <ShowcaseSplit
        id="domains"
        eyebrow="Domains"
        title="The name is part of the plan"
        body="Annual plans include a free domain for the first year, and WHOIS privacy is free on everything we register. DNS management is included rather than sold separately."
        cta={{ label: "Search domains", href: "/register-domain" }}
        visual={<DomainMock />}
        side="left"
        surface="light"
      />

      <PricingBand />
      <Migration />
      <FaqSection items={faqs} />
      {/* This page owns an id="plans" section, so the closing CTA scrolls
          there rather than leaving for the homepage. */}
      <FinalCta plansHref="#plans" />
    </>
  );
}
