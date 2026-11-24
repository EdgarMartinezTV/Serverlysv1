import { JsonLd } from "@/components/ui/json-ld";
import { Faqs } from "@/components/ref/faqs";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";
import { canonical, faqGraph, pageMetadata, serviceGraph } from "@/lib/seo";
import { FAQS, FAQ_HEAD } from "./_content";
import { AiTools, Banner, Hero, How, Pricing, Savings, Steps, Why } from "./_components/sections";

/**
 * /migrations — rebuilt 2026-11-24 on the hostinger.com/website-migration
 * layout at Edgar's request ("exactly like this"). The Retell-kit version
 * (2026-10-13 to 2026-11-24) is in git history. Copy, facts and every visual
 * are Serverlys' own; what was dropped from the reference and why is in the
 * header of _content.ts.
 *
 * Migration is free with a cloud hosting plan, so the plan cards are the cloud
 * group from data/pricing.ts: the same prices, renewal lines and order links
 * as /cloud-hosting.
 */

const PATH = "/migrations";
const DESCRIPTION =
  "Free website migration service with every cloud plan: we move WordPress or any site, its database and email, test it and switch with no downtime.";

export const metadata = pageMetadata({
  title: "Website Migration Service, Free with Hosting | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

const FAQ_TEXT = FAQS.map((f) => ({
  question: f.q,
  answer: f.a
    .map((b) => (b.type === "ul" ? b.items.join(" ") : b.runs.map((r) => r.text).join("")))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim(),
  scopes: [PATH],
}));

const SERVICE = {
  ...serviceGraph({
    name: "Free website migration",
    serviceType: "Website migration",
    description: DESCRIPTION,
    path: PATH,
  }),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free with any Serverlys cloud hosting plan",
    url: canonical(PATH),
  },
};

export default function MigrationsPage() {
  return (
    /** DM Sans like the reference; globals.css balance/pretty undone so lines break where its do. */
    <div className="font-display [&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd data={SERVICE} />
      <JsonLd data={faqGraph(FAQ_TEXT, PATH)} />

      <Hero />
      <Pricing />
      <Steps />
      <How />
      <Why />
      <Savings />
      <AiTools />
      <Banner />
      <Faqs idPrefix="wm" title={FAQ_HEAD.title} description={FAQ_HEAD.description} items={FAQS} size="lg" defaultOpen={0} />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </div>
  );
}
