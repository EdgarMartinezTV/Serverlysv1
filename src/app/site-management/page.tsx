import { JsonLd } from "@/components/ui/json-ld";
import { canonical, pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import {
  careFromPrice,
  careOrderUrl,
  carePlans,
  formatCarePrice,
} from "@/data/care-plans";
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
 * /site-management — rebuilt 2026-10-13 on the shared Retell-style kit, the
 * same layout as the other service pages. Plans: data/care-plans.ts (WHMCS
 * ServerCare, pids 17–19). Copy: ./_content.tsx.
 *
 * Still distinct from /managed-hosting: that page is the SERVER, this one is
 * the SITE. The navy band says so in one line.
 */

const PATH = "/site-management";
const DESCRIPTION = `Website maintenance for small businesses: daily backups, updates, security scans, uptime monitoring, content changes and reports. ServerCare from ${formatCarePrice(careFromPrice)}/mo.`;

export const metadata = pageMetadata({
  title: `Website Maintenance Plans | From ${formatCarePrice(careFromPrice)}/mo | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

const PLAN_ICON = { essential: "shield", plus: "growth", premium: "building" } as const;

function careServiceGraph() {
  return {
    ...serviceGraph({
      name: "Website maintenance and management",
      serviceType: "Website maintenance",
      description: DESCRIPTION,
      path: PATH,
    }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "ServerCare website maintenance plans",
      itemListElement: carePlans.map((p) => ({
        "@type": "Offer",
        name: p.name,
        description: p.summary,
        url: careOrderUrl(p),
        price: p.price.toFixed(2),
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: p.price.toFixed(2),
          priceCurrency: "USD",
          unitCode: "MON",
        },
        itemOffered: { "@type": "Service", name: p.name, url: canonical(PATH) },
      })),
    },
  };
}

export default function SiteManagementPage() {
  const from = formatCarePrice(careFromPrice);
  return (
    <>
      <JsonLd data={careServiceGraph()} />
      <JsonLd data={faqGraph(FAQS, PATH)} />

      <Hero
        id="care-hero-heading"
        title="Website Maintenance, So You Never Have to Think About It"
        photo={{
          src: "/mock/care-hero.jpg",
          alt: "A relaxed business owner leaning back at her desk with her hands behind her head",
        }}
        photoClassName="object-[55%_35%] lg:object-[45%_35%]"
        kicker={[`ServerCare from ${from}/mo`, "Billed monthly"]}
        lede="Plugins go out of date, forms quietly stop sending, and a year passes. ServerCare is someone whose job is noticing: backups, updates, security, speed and changes, handled."
        cta={{ label: "See ServerCare plans", href: "#plans" }}
        badgeCaption="Every plan"
        badges={[
          { label: "Daily backups", icon: "server" },
          { label: "Updates", icon: "loop" },
          { label: "24/7 monitoring", icon: "eye" },
          { label: "Content hours", icon: "pen" },
        ]}
      />
      <HowItWorks
        id="care-how-heading"
        title="Your website, looked after from the day you sign up."
        steps={STEPS}
      />
      <UseCases
        id="care-uses-heading"
        label="What we handle"
        title="What ServerCare handles, so you don’t have to"
        items={USES}
      />
      <NavyBand
        id="care-navy-heading"
        kicker="Hosting runs the server. ServerCare runs the site."
        title="A website is not finished when it launches"
        body="Managed hosting keeps the machine underneath patched and secure. ServerCare looks after what you built on top of it: the plugins, the content, the links, the speed, the things nobody has looked at in eight months."
        aside={`From [${from}/mo], [billed monthly]. [1 to 4 hours] of content changes every month.`}
        cta={{ label: "See ServerCare plans", href: "#plans" }}
      />
      <Promises
        id="care-promise-heading"
        intro="Three things you can hold us to on every ServerCare plan."
        items={PROMISES}
      />
      <Features
        id="care-features-heading"
        title="How ServerCare looks after your site"
        groups={GROUPS}
      />
      <ToolsMarquee
        id="care-tools-heading"
        title="The platforms and tools we maintain and measure"
        cta={{ label: "See ServerCare plans", href: "#plans" }}
        rows={TOOLS}
      />
      <PricingPanel
        id="care-plans-heading"
        title="Website maintenance plans and pricing"
        footnote={
          <>
            Billed monthly, plus tax. Not sure which plan fits?{" "}
            <a
              href={billing.sales}
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Ask the team
            </a>
            .
          </>
        }
      >
        {carePlans.map((p, i) => {
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
                <p className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      "tabular text-[40px] leading-none font-semibold tracking-[-0.03em]",
                      blue ? "text-white" : INK,
                    )}
                  >
                    {formatCarePrice(p.price)}
                  </span>
                  <span className={blue ? "text-white/80" : MUTED}>/mo</span>
                </p>
              }
              cta={{
                label: `Get ${p.name.replace("ServerCare ", "")}`,
                href: careOrderUrl(p),
              }}
              listTitle="What’s included"
              list={p.features}
            />
          );
        })}
      </PricingPanel>
      <Faqs id="care-faq-heading" items={FAQS} />
      <Related id="care-related-heading" items={RELATED} />
      <PhotoCta
        id="care-cta-heading"
        photo={{
          src: "/mock/care-cta.jpg",
          alt: "A workshop owner standing among the tools and parts in his shop",
          position: "55% 35%",
        }}
        thumb="/mock/care-mechanic.jpg"
        title="Hand the website over and get back to work"
        body={`Pick a ServerCare plan and we take a backup and start on day one. From ${from}/mo.`}
        primary={{ label: "See ServerCare plans", href: "#plans" }}
      />
    </>
  );
}
