import { JsonLd } from "@/components/ui/json-ld";
import { canonical, pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import {
  designFeatures,
  designFromPrice,
  designOrderUrl,
  designPlans,
  formatDesignPrice,
} from "@/data/design-plans";
import {
  Faqs,
  Features,
  Hero,
  HowItWorks,
  INK,
  MUTED,
  NavyBand,
  PanelCard,
  PhotoCta,
  PricingPanel,
  Promises,
  Related,
  ToolsMarquee,
  UseCases,
} from "@/components/retell/kit";
import { FAQS, GROUPS, PROMISES, RELATED, STEPS, TOOLS, USES } from "./_content";

/**
 * /website-design — rebuilt 2026-10-13 on the shared Retell-style kit
 * (components/retell/kit.tsx), the same layout as /seo and
 * /website-development. Plans: data/design-plans.ts. Copy: ./_content.tsx.
 *
 * The FAQ schema uses THIS page's questions, because `faqGraph` may only be
 * emitted for Q&As the page visibly renders.
 */

const PATH = "/website-design";
const DESCRIPTION = `Custom website design for small businesses: a custom homepage, WordPress build, style guide, SEO-friendly blog and analytics. From ${formatDesignPrice(designFromPrice)}.`;

export const metadata = pageMetadata({
  title: `Custom Website Design | From ${formatDesignPrice(designFromPrice)} | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

const PLAN_ICON = { starter: "layout", plus: "growth", pro: "building" } as const;

/** Service schema with the three plan prices as an OfferCatalog. */
function designServiceGraph() {
  return {
    ...serviceGraph({
      name: "Custom website design for small businesses",
      serviceType: "Website design",
      description: DESCRIPTION,
      path: PATH,
    }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Website design plans",
      itemListElement: designPlans.map((p) => ({
        "@type": "Offer",
        name: `${p.name} website design`,
        description: p.summary,
        price: p.price.toFixed(2),
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: p.price.toFixed(2),
          priceCurrency: "USD",
        },
        itemOffered: {
          "@type": "Service",
          name: `${p.name} website design`,
          url: canonical(PATH),
        },
      })),
    },
  };
}

export default function WebsiteDesignPage() {
  const from = formatDesignPrice(designFromPrice);
  return (
    <>
      <JsonLd data={designServiceGraph()} />
      <JsonLd
        data={faqGraph(
          FAQS.map((f) => ({ ...f, scopes: [PATH] })),
          PATH,
        )}
      />

      <Hero
        id="design-hero-heading"
        title="Custom Website Design That Brings In the Work"
        photo={{
          src: "/mock/design-hero.jpg",
          alt: "A contractor in a hard hat taking a call on site beside his truck",
        }}
        photoClassName="object-[50%_35%] lg:object-[45%_35%]"
        kicker={[`From ${from}`, "One-time project price"]}
        lede="A website designed around the call, the booking or the quote that pays your bills. Custom homepage, built on WordPress, measured from the day it launches."
        cta={{ label: "See design plans", href: "#plans" }}
        badgeCaption="Every plan"
        badges={[
          { label: "Custom design", icon: "pen" },
          { label: "Mobile-first", icon: "phone" },
          { label: "SEO-ready blog", icon: "doc" },
          { label: "Analytics", icon: "report" },
        ]}
      />
      <HowItWorks
        id="design-how-heading"
        title="From a blank page to a site that works, in four steps."
        steps={STEPS}
      />
      <UseCases
        id="design-uses-heading"
        label="What we design for"
        title="A website that does a job, not just a brochure"
        items={USES}
      />
      <NavyBand
        id="design-navy-heading"
        kicker="Designed, built and hosted by one team"
        title="The people who design it also build and host it"
        body="No hand-off from a designer to a developer to a host who never met. One team takes your site from the first sketch to the server it runs on."
        aside={`[One-time] project price from [${from}]. [Scoped in writing] before any work starts.`}
        cta={{ label: "See design plans", href: "#plans" }}
      />
      <Promises
        id="design-promise-heading"
        intro="Three things you can hold us to on every website, whichever plan you choose."
        items={PROMISES}
      />
      <Features
        id="design-features-heading"
        title="How your website comes together"
        groups={GROUPS}
      />
      <ToolsMarquee
        id="design-tools-heading"
        title="Built on WordPress, connected to the tools you use"
        cta={{ label: "See design plans", href: "#plans" }}
        rows={TOOLS}
      />
      <PricingPanel
        id="design-plans-heading"
        title="Website design plans and pricing"
        footnote="Starting prices, one-time, plus tax. Every project is scoped in writing before any of it starts."
      >
        {designPlans.map((p, i) => {
          const blue = p.id === "plus";
          return (
            <PanelCard
              key={p.id}
              delay={i * 80}
              blue={blue}
              icon={PLAN_ICON[p.id]}
              name={p.name}
              summary={p.summary}
              price={
                <div>
                  <p
                    className={cn(
                      "text-[13px] font-semibold",
                      blue ? "text-white/85" : MUTED,
                    )}
                  >
                    Starting at
                  </p>
                  <p
                    className={cn(
                      "tabular mt-1 text-[40px] leading-none font-semibold tracking-[-0.03em]",
                      blue ? "text-white" : INK,
                    )}
                  >
                    {formatDesignPrice(p.price)}
                  </p>
                </div>
              }
              cta={{ label: `Start with ${p.name}`, href: designOrderUrl(p) }}
              listTitle="What’s included"
              list={designFeatures(p)}
            />
          );
        })}
      </PricingPanel>
      <Faqs id="design-faq-heading" items={FAQS} />
      <Related id="design-related-heading" items={RELATED} />
      <PhotoCta
        id="design-cta-heading"
        photo={{
          src: "/mock/design-cta.jpg",
          alt: "A carpenter at his miter saw in a bright workshop",
          position: "50% 40%",
        }}
        thumb="/mock/design-wireframe.jpg"
        title="Ready for a website that brings in the work?"
        body={`Tell us about your business and we will come back with a written scope and price. Plans from ${from}.`}
        primary={{ label: "Start a project", href: billing.sales }}
      />
    </>
  );
}
