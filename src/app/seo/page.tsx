import { JsonLd } from "@/components/ui/json-ld";
import { faqsFor } from "@/data/faqs";
import { formatSeoPrice, seoFromPrice, seoOrderUrl, seoPlans } from "@/data/seo-plans";
import { canonical, pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import {
  Faqs,
  Features,
  Hero,
  HowItWorks,
  NavyBand,
  PanelCard,
  PhotoCta,
  PricingPanel,
  Promises,
  Related,
  ToolsMarquee,
  UseCases,
  INK,
  MUTED,
} from "@/components/retell/kit";
import { billing } from "@/data/company";
import { cn } from "@/lib/utils";
import { GROUPS, PROMISES, RELATED, STEPS, TOOLS, USES } from "./_content";

const PLAN_ICON = { starter: "pin", growth: "growth", elite: "building" } as const;

const PATH = "/seo";
const DESCRIPTION = `SEO services for small businesses: keyword research, local SEO, Google Business Profile, technical fixes, link building and monthly reports. From ${formatSeoPrice(seoFromPrice)}/mo.`;

export const metadata = pageMetadata({
  title: `SEO Services for Small Business | From ${formatSeoPrice(seoFromPrice)}/mo | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

/**
 * Service schema with the real plan prices as an OfferCatalog, so the page
 * can surface as a priced service. Prices come from data/seo-plans.ts (the
 * WHMCS store) — the same array the plan cards render.
 */
function seoServiceGraph() {
  const base = serviceGraph({
    name: "SEO services for small businesses",
    serviceType: "Search engine optimization",
    description: DESCRIPTION,
    path: PATH,
  });
  return {
    ...base,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "SEO plans",
      itemListElement: seoPlans.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        description: plan.summary,
        url: seoOrderUrl(plan),
        price: plan.price.toFixed(2),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: plan.price.toFixed(2),
          priceCurrency: "USD",
          unitCode: "MON",
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: 1,
            unitCode: "MON",
          },
        },
        itemOffered: { "@type": "Service", name: plan.name, url: canonical(PATH) },
      })),
    },
  };
}

/** Layout: components/retell/kit.tsx. Copy: ./_content.tsx. */
export default function SeoPage() {
  const faqs = faqsFor(PATH);
  return (
    <>
      <JsonLd data={seoServiceGraph()} />
      <JsonLd data={faqGraph(faqs, PATH)} />
      <Hero
        id="seo-hero-heading"
        title="SEO Services That Get You Found on Google"
        photo={{
          src: "/mock/seo-hero.jpg",
          alt: "A small business owner in an apron smiling at his phone behind his shop counter",
        }}
        photoClassName="object-[58%_30%] lg:object-[40%_30%]"
        kicker={[`From ${formatSeoPrice(seoFromPrice)}/mo`, "Billed monthly"]}
        lede="Rank for the searches your customers already make. We fix your site, optimize your Google Business Profile, publish content and build links, then report what it earned every month."
        cta={{ label: "See SEO plans", href: "#plans" }}
        badgeCaption="Every plan"
        badges={[
          { label: "Local SEO", icon: "pin" },
          { label: "Technical SEO", icon: "scan" },
          { label: "Link building", icon: "link" },
          { label: "Reporting", icon: "report" },
        ]}
      />
      <HowItWorks
        id="seo-how-heading"
        title="From audit to rankings, on the site you already have."
        steps={STEPS}
      />
      <UseCases
        id="seo-uses-heading"
        label="What we handle"
        title="What your SEO plan handles from month one"
        items={USES}
      />
      <NavyBand
        id="seo-navy-heading"
        kicker="Built for small businesses, not agency dashboards"
        title="SEO, hosting and your website, under one roof"
        body="Serverlys hosts websites, builds them and ranks them, so the team doing your SEO can fix the server, the code and the content without a three-way handoff."
        aside={`[White-hat only] and [billed monthly]. Plans start at [${formatSeoPrice(seoFromPrice)}/mo].`}
        cta={{ label: "See SEO plans", href: "#plans" }}
      />
      <Promises
        id="seo-promise-heading"
        intro="SEO is full of promises nobody can keep. These are the ones we can keep, on every plan."
        items={PROMISES}
      />
      <Features
        id="seo-features-heading"
        title="Why small businesses choose Serverlys for SEO"
        groups={GROUPS}
        tabPrefix="SEO"
      />
      <ToolsMarquee
        id="seo-tools-heading"
        title="The tools and platforms we work in"
        cta={{ label: "See what’s included", href: "#plans" }}
        rows={TOOLS}
      />
      <PricingPanel
        id="seo-plans-heading"
        title="SEO packages and pricing, billed monthly"
        footnote={
          <>
            Not sure which plan fits?{" "}
            <a
              href={billing.sales}
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Ask the team for a recommendation
            </a>
            .
          </>
        }
      >
        {seoPlans.map((p, i) => {
          const blue = Boolean(p.popular);
          const prev = seoPlans[i - 1];
          return (
            <PanelCard
              key={p.id}
              delay={i * 80}
              blue={blue}
              icon={PLAN_ICON[p.id]}
              name={p.name}
              badge={blue ? "Most popular" : undefined}
              summary={p.summary}
              price={
                <p className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      "tabular text-[40px] leading-none font-semibold tracking-[-0.03em]",
                      blue ? "text-white" : INK,
                    )}
                  >
                    {formatSeoPrice(p.price)}
                  </span>
                  <span className={blue ? "text-white/80" : MUTED}>/mo</span>
                </p>
              }
              cta={{ label: `Get ${p.name}`, href: seoOrderUrl(p) }}
              listTitle={prev ? `Everything in ${prev.name}, plus` : "What’s included"}
              list={p.features}
            />
          );
        })}
      </PricingPanel>
      <Faqs id="seo-faq-heading" items={faqs} />
      <Related id="seo-related-heading" items={RELATED} />
      <PhotoCta
        id="seo-cta-heading"
        photo={{
          src: "/mock/seo-cta.jpg",
          alt: "A café owner checking orders on a tablet at her counter",
          position: "70% 40%",
        }}
        thumb="/mock/seo-local.jpg"
        title="Get found by the customers already searching for you"
        body={`Start with an audit of where you stand. Plans from ${formatSeoPrice(seoFromPrice)}/mo.`}
        primary={{ label: "See SEO plans", href: "#plans" }}
      />
    </>
  );
}
