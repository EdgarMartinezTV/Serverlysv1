import { JsonLd } from "@/components/ui/json-ld";
import { canonical, pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import { formatSeoPrice, seoFromPrice, seoOrderUrl, seoPlans } from "@/data/seo-plans";
import {
  Faqs,
  Features,
  Hero,
  HowItWorks,
  NavyBand,
  PhotoCta,
  Promises,
  Related,
  ToolsMarquee,
  UseCases,
} from "@/components/retell/kit";
import { SeoPlansPanel } from "@/components/retell/seo-plans-panel";
import { FAQS, GROUPS, PROMISES, RELATED, STEPS, TOOLS, USES } from "./_content";

/**
 * /marketing — rebuilt 2026-10-13 on the shared Retell-style kit, the same
 * layout as /seo, /website-design and /website-development. Marketing is
 * sold as the SEO plans: the pricing panel is the shared SeoPlansPanel, so
 * prices and "Get" links are the WHMCS SEO products. Copy: ./_content.tsx.
 */

const PATH = "/marketing";
const DESCRIPTION = `Digital marketing for small businesses, judged on customers: local SEO, Google Business Profile, content, links and monthly reports. From ${formatSeoPrice(seoFromPrice)}/mo.`;

export const metadata = pageMetadata({
  title: `Small Business Marketing | From ${formatSeoPrice(seoFromPrice)}/mo | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

function marketingServiceGraph() {
  return {
    ...serviceGraph({
      name: "Digital marketing for small businesses",
      serviceType: "Digital marketing",
      description: DESCRIPTION,
      path: PATH,
    }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Marketing plans",
      itemListElement: seoPlans.map((p) => ({
        "@type": "Offer",
        name: p.name,
        description: p.summary,
        url: seoOrderUrl(p),
        price: p.price.toFixed(2),
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: p.price.toFixed(2),
          priceCurrency: "USD",
          unitCode: "MON",
        },
        itemOffered: { "@type": "Service", name: p.name, url: canonical("/seo") },
      })),
    },
  };
}

export default function MarketingPage() {
  const from = formatSeoPrice(seoFromPrice);
  return (
    <>
      <JsonLd data={marketingServiceGraph()} />
      <JsonLd
        data={faqGraph(
          FAQS.map((f) => ({ ...f, scopes: [PATH] })),
          PATH,
        )}
      />

      <Hero
        id="mkt-hero-heading"
        title="Marketing Judged on Customers, Not Clicks"
        photo={{
          src: "/mock/mkt-hero.jpg",
          alt: "A smiling café owner in a mustard beanie behind her counter",
        }}
        photoClassName="object-[60%_35%] lg:object-[45%_35%]"
        kicker={[`From ${from}/mo`, "Billed monthly"]}
        lede="Get found by the people already searching for what you sell. Local SEO, content and links that bring in calls and orders, with a monthly report that shows what it earned."
        cta={{ label: "See marketing plans", href: "#plans" }}
        badgeCaption="Every plan"
        badges={[
          { label: "Local SEO", icon: "pin" },
          { label: "Google Profile", icon: "building" },
          { label: "Link building", icon: "link" },
          { label: "Reporting", icon: "report" },
        ]}
      />
      <HowItWorks
        id="mkt-how-heading"
        title="Marketing that starts with the customers you want more of."
        steps={STEPS}
      />
      <UseCases
        id="mkt-uses-heading"
        label="What it does for you"
        title="What your marketing plan does from month one"
        items={USES}
      />
      <NavyBand
        id="mkt-navy-heading"
        kicker="Fewer channels, done properly"
        title="Search first, because that is where buyers are"
        body="Most small businesses do better with one channel run well than six run thinly. Someone searching for what you sell is already looking to buy, so that is where your plan starts."
        aside={`[White-hat only] and [billed monthly]. Plans start at [${from}/mo].`}
        cta={{ label: "Compare on the SEO page", href: "/seo#plans" }}
      />
      <Promises
        id="mkt-promise-heading"
        intro="Marketing is full of numbers that look good and mean nothing. These are the things you can hold us to."
        items={PROMISES}
      />
      <Features
        id="mkt-features-heading"
        title="How your marketing works, month to month"
        groups={GROUPS}
      />
      <ToolsMarquee
        id="mkt-tools-heading"
        title="Where your customers find you, and the tools we measure it in"
        cta={{ label: "See marketing plans", href: "#plans" }}
        rows={TOOLS}
      />
      <SeoPlansPanel
        id="mkt-plans-heading"
        title="Marketing plans, powered by our SEO plans"
      />
      <Faqs id="mkt-faq-heading" items={FAQS} />
      <Related id="mkt-related-heading" items={RELATED} />
      <PhotoCta
        id="mkt-cta-heading"
        photo={{
          src: "/mock/mkt-cta.jpg",
          alt: "A customer paying at the counter of a plant-filled shop",
          position: "50% 40%",
        }}
        thumb="/mock/mkt-bakery.jpg"
        title="Ready to be the business they find first?"
        body={`Pick a plan and we start with an audit of where you stand. Plans from ${from}/mo.`}
        primary={{ label: "See marketing plans", href: "#plans" }}
      />
    </>
  );
}
