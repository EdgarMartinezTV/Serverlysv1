import { JsonLd } from "@/components/ui/json-ld";
import { canonical, pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import {
  businessFromPrice,
  businessOrderUrl,
  businessPlans,
  formatBusinessPrice,
} from "@/data/business-plans";
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
import { Services } from "./_components/services";
import { FAQS, GROUPS, PROMISES, RELATED, STEPS, TOOLS, USES } from "./_content";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";

/**
 * /business-solutions — rebuilt 2026-10-13 on the shared Retell-style kit,
 * the same layout as the other service pages, plus a services grid. The
 * all-in-one plans are the WHMCS Contractor Website Plans
 * (data/business-plans.ts, pids 23–24). Copy: ./_content.tsx.
 */

const PATH = "/business-solutions";
const DESCRIPTION = `Everything a small business needs online from one supplier: a website built free, hosting, SEO, email and AI, on one bill. All-in-one plans from ${formatBusinessPrice(businessFromPrice)}/mo.`;

export const metadata = pageMetadata({
  title: `Small Business Website Plans | From ${formatBusinessPrice(businessFromPrice)}/mo | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

const PLAN_ICON = { growth: "growth", pro: "building" } as const;

function businessServiceGraph() {
  return {
    ...serviceGraph({
      name: "Small business website and hosting plans",
      serviceType: "Website design, hosting and management",
      description: DESCRIPTION,
      path: PATH,
    }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "All-in-one business plans",
      itemListElement: businessPlans.map((p) => ({
        "@type": "Offer",
        name: p.name,
        description: p.summary,
        url: businessOrderUrl(p),
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

export default function BusinessSolutionsPage() {
  const from = formatBusinessPrice(businessFromPrice);
  return (
    <>
      <JsonLd data={businessServiceGraph()} />
      <JsonLd data={faqGraph(FAQS, PATH)} />

      <Hero
        id="biz-hero-heading"
        title="Everything Your Business Needs Online, From One Team"
        photo={{
          src: "/mock/biz-hero.jpg",
          alt: "Two contractors in hard hats shaking hands on a job site",
        }}
        photoClassName="object-[55%_35%] lg:object-[40%_35%]"
        kicker={[`All-in-one from ${from}/mo`, "Website built free"]}
        lede="Your website built for you, plus hosting, local SEO and the tools that bring in leads, on one bill with one team to call. No more four suppliers pointing at each other."
        cta={{ label: "See all-in-one plans", href: "#plans" }}
        badgeCaption="Every plan"
        badges={[
          { label: "Website built", icon: "layout" },
          { label: "Hosting", icon: "server" },
          { label: "Local SEO", icon: "pin" },
          { label: "One bill", icon: "doc" },
        ]}
      />
      <HowItWorks
        id="biz-how-heading"
        title="From scattered suppliers to one team, in four steps."
        steps={STEPS}
      />
      <UseCases
        id="biz-uses-heading"
        label="What you get"
        title="The whole online side of your business, handled"
        items={USES}
      />
      <NavyBand
        id="biz-navy-heading"
        kicker="One supplier, one bill"
        title="When something breaks, there is one number to call"
        body="Host, registrar, web designer, marketing agency: each with its own login, its own invoice and its own excuse. Serverlys does all of it, so the answer is never somebody else’s job."
        aside={`All-in-one plans from [${from}/mo]. The [website is built free] on every plan.`}
        cta={{ label: "See all-in-one plans", href: "#plans" }}
      />
      <Promises
        id="biz-promise-heading"
        intro="Three things that stay true whichever plan or services you choose."
        items={PROMISES}
      />
      <Features
        id="biz-features-heading"
        title="How one supplier works for you"
        groups={GROUPS}
      />
      <PricingPanel
        id="biz-plans-heading"
        title="All-in-one plans: website, hosting and growth tools"
        columns={2}
        footnote={
          <>
            Billed monthly, plus tax. The website build is included.{" "}
            <a
              href={billing.sales}
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Ask the team which plan fits
            </a>
            .
          </>
        }
      >
        {businessPlans.map((p, i) => {
          const blue = p.id === "pro";
          return (
            <PanelCard
              key={p.id}
              delay={i * 80}
              blue={blue}
              icon={PLAN_ICON[p.id]}
              name={p.name}
              badge={blue ? "Adds AI chat" : undefined}
              summary={p.summary}
              price={
                <p className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      "tabular text-[40px] leading-none font-semibold tracking-[-0.03em]",
                      blue ? "text-white" : INK,
                    )}
                  >
                    {formatBusinessPrice(p.price)}
                  </span>
                  <span className={blue ? "text-white/80" : MUTED}>/mo</span>
                </p>
              }
              cta={{
                label: `Get ${p.name.replace(" Plan", "")}`,
                href: businessOrderUrl(p),
              }}
              listTitle="What’s included"
              list={p.features}
            />
          );
        })}
      </PricingPanel>
      <Services />
      <ToolsMarquee
        id="biz-tools-heading"
        title="Connected to the tools your business already uses"
        cta={{ label: "See all-in-one plans", href: "#plans" }}
        rows={TOOLS}
      />
      <Faqs id="biz-faq-heading" items={FAQS} />
      <Related id="biz-related-heading" items={RELATED} />
      <PhotoCta
        id="biz-cta-heading"
        photo={{
          src: "/mock/biz-cta.jpg",
          alt: "Three smiling bartenders standing behind their bar",
          position: "50% 35%",
        }}
        thumb="/mock/biz-contractors.jpg"
        title="Ready to hand the online side to one team?"
        body={`Pick an all-in-one plan and we start building your website. Plans from ${from}/mo.`}
        primary={{ label: "See all-in-one plans", href: "#plans" }}
      />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
