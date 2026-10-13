import { JsonLd } from "@/components/ui/json-ld";
import { canonical, pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import {
  formatSocialPrice,
  socialFromPrice,
  socialOrderUrl,
  socialPlans,
} from "@/data/social-plans";
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
 * /social-media — rebuilt 2026-10-13 on the shared Retell-style kit, the
 * same layout as /seo, /marketing, /website-design and /website-development.
 * Plans: data/social-plans.ts (WHMCS pids 29–32). Copy: ./_content.tsx.
 */

const PATH = "/social-media";
const DESCRIPTION = `Social media management for small businesses: posts planned, designed, written and published for you, comments answered and monthly reports. From ${formatSocialPrice(socialFromPrice)}/mo.`;

export const metadata = pageMetadata({
  title: `Social Media Management | From ${formatSocialPrice(socialFromPrice)}/mo | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

const PLAN_ICON = {
  starter: "pin",
  growth: "growth",
  pro: "eye",
  enterprise: "building",
} as const;

function socialServiceGraph() {
  return {
    ...serviceGraph({
      name: "Social media management for small businesses",
      serviceType: "Social media management",
      description: DESCRIPTION,
      path: PATH,
    }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Social media management plans",
      itemListElement: socialPlans.map((p) => ({
        "@type": "Offer",
        name: `${p.name} social media plan`,
        description: p.summary,
        url: socialOrderUrl(p),
        price: p.price.toFixed(2),
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: p.price.toFixed(2),
          priceCurrency: "USD",
          unitCode: "MON",
        },
        itemOffered: {
          "@type": "Service",
          name: `${p.name} social media plan`,
          url: canonical(PATH),
        },
      })),
    },
  };
}

export default function SocialMediaPage() {
  const from = formatSocialPrice(socialFromPrice);
  return (
    <>
      <JsonLd data={socialServiceGraph()} />
      <JsonLd
        data={faqGraph(
          FAQS.map((f) => ({ ...f, scopes: [PATH] })),
          PATH,
        )}
      />

      <Hero
        id="social-hero-heading"
        title="Social Media Management, Done For You"
        photo={{
          src: "/mock/social-hero.jpg",
          alt: "A fashion designer photographing her latest piece with her phone",
        }}
        photoClassName="object-[50%_35%] lg:object-[40%_35%]"
        kicker={[`From ${from}/mo`, "Billed monthly"]}
        lede="Show up every week without it eating your week. We plan, design, write and publish your posts, answer the comments, and report what it did."
        cta={{ label: "See social plans", href: "#plans" }}
        badgeCaption="Every plan"
        badges={[
          { label: "Custom posts", icon: "pen" },
          { label: "Captions", icon: "doc" },
          { label: "Scheduling", icon: "calendar" },
          { label: "Reporting", icon: "report" },
        ]}
      />
      <HowItWorks
        id="social-how-heading"
        title="From a quiet feed to a planned month, in four steps."
        steps={STEPS}
      />
      <UseCases
        id="social-uses-heading"
        label="What we handle"
        title="What your social media plan handles every month"
        items={USES}
      />
      <NavyBand
        id="social-navy-heading"
        kicker="Built for small businesses, not influencers"
        title="Social media that sounds like you, posted on schedule"
        body="Most small businesses know they should post more and never have the time. We take the whole job: the plan, the graphics, the captions, the posting and the replies."
        aside={`From [${from}/mo], [billed monthly]. Up to [5 platforms] and [25+ posts] a month.`}
        cta={{ label: "See social plans", href: "#plans" }}
      />
      <Promises
        id="social-promise-heading"
        intro="Social media is full of numbers that look good and mean nothing. These are the things you can hold us to."
        items={PROMISES}
      />
      <Features
        id="social-features-heading"
        title="How your social media runs, month to month"
        groups={GROUPS}
      />
      <ToolsMarquee
        id="social-tools-heading"
        title="The platforms we post on for you"
        cta={{ label: "See social plans", href: "#plans" }}
        rows={TOOLS}
      />
      <PricingPanel
        id="social-plans-heading"
        title="Social media management plans and pricing"
        columns={4}
        footnote={
          <>
            Billed monthly, plus tax. Ad spend is paid to the platform directly. Not
            sure which plan fits?{" "}
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
        {socialPlans.map((p, i) => {
          const blue = p.id === "growth";
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
                      "tabular text-[34px] leading-none font-semibold tracking-[-0.03em]",
                      blue ? "text-white" : INK,
                    )}
                  >
                    {formatSocialPrice(p.price)}
                  </span>
                  <span className={blue ? "text-white/80" : MUTED}>/mo</span>
                </p>
              }
              cta={{ label: `Get ${p.name}`, href: socialOrderUrl(p) }}
              listTitle="What’s included"
              list={p.features}
            />
          );
        })}
      </PricingPanel>
      <Faqs id="social-faq-heading" items={FAQS} />
      <Related id="social-related-heading" items={RELATED} />
      <PhotoCta
        id="social-cta-heading"
        photo={{
          src: "/mock/social-cta.jpg",
          alt: "A smiling woman in headphones looking at her phone",
          position: "55% 35%",
        }}
        thumb="/mock/social-latte.jpg"
        title="Ready for a feed that runs itself?"
        body={`Pick a plan and we start with your profiles and next month’s calendar. Plans from ${from}/mo.`}
        primary={{ label: "See social plans", href: "#plans" }}
      />
    </>
  );
}
