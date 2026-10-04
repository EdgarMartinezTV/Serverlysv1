import { JsonLd } from "@/components/ui/json-ld";
import { Faqs } from "@/components/ref/faqs";
import { groupById } from "@/data/pricing";
import { breadcrumbGraph, faqGraph, pageMetadata, productGraph } from "@/lib/seo";
import { FAQS, FAQ_HEAD } from "./_content";
import { PillNav } from "@/components/sections/pill-nav";
import { Proof } from "../cloud-hosting/_components/proof";
import { Banner } from "../cloud-hosting/_components/banner";
import {
  DarkBand,
  Hero,
  LaunchQuickly,
  StoreAgent,
  StoreSpeed,
} from "./_components/sections";
import { Pricing } from "./_components/pricing";

/**
 * Ecommerce hosting.
 *
 * A deliberate 1:1 rebuild of hostinger.com/woocommerce-hosting, on the same
 * terms as /cloud-hosting: the reference's section order, grid, type scale and
 * copy, with our palette, our plans and our own product imagery. Measurements
 * live in components/ref/kit.tsx; copy — and what still needs replacing before
 * this ships — lives in _content.ts.
 *
 * Four of the reference's bands are one component (`ref/split`): launch,
 * speed, security, migration and support differ only in which side the media
 * sits on and whether the surface is light or the deep brand band.
 *
 * Removed from the reference on request: the hero's Trustpilot +
 * WordPress.org row, the Hostinger Connector band, the
 * Google/HostAdvice/WPBeginner ratings strip, the "Managed WooCommerce
 * hosting" band, and the customer-story carousel — which had placeholder
 * attributions anyway, since the reference quotes real named Hostinger
 * customers.
 */

const PATH = "/ecommerce-hosting";

const TITLE = "Managed WooCommerce hosting for your eCommerce store";
const DESCRIPTION =
  "Quick setup, AI tools, and 24/7 support – our Managed WooCommerce hosting has everything for eCommerce.";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const BREADCRUMB = [
  { name: "Home", path: "/" },
  { name: "Ecommerce hosting", path: PATH },
];

/** Derived, so the schema cannot disagree with the cards. */
const RATES = (groupById("ecommerce")?.plans ?? []).map((p) => p.monthly);

/** FAQPage wants plain text, so the rendered block structure is flattened. */
const FAQ_TEXT = FAQS.map((f) => ({
  question: f.q,
  answer: f.a
    .map((b) => (b.type === "ul" ? b.items.join(" ") : b.runs.map((r) => r.text).join("")))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim(),
  scopes: [PATH],
}));

const NAV = [
  { id: "pricing", label: "Pricing" },
  { id: "agent", label: "AI agent" },
  { id: "performance", label: "Performance" },
  { id: "features", label: "Security" },
  { id: "ecom-faq", label: "FAQ" },
] as const;

export default function EcommerceHostingPage() {
  return (
    /**
     * globals.css balances every heading and prettifies every paragraph. Both
     * are good defaults and both break the match — the reference wraps
     * normally. Reset for this page only, as on /cloud-hosting.
     */
    <div className="[&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd data={breadcrumbGraph(BREADCRUMB)} />
      <JsonLd
        data={productGraph({
          name: "Serverlys Ecommerce Hosting",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...RATES),
          highPrice: Math.max(...RATES),
          offerCount: RATES.length,
        })}
      />
      <JsonLd data={faqGraph(FAQ_TEXT)} />

      <Hero />
      {/* The wrapper bounds the sticky pill nav: it stops after the FAQ. */}
      <div>
        <PillNav items={NAV} />
        <Pricing />
        <LaunchQuickly />
        <StoreAgent />
        <StoreSpeed />
        <DarkBand />
        <Proof />
      <Faqs
        idPrefix="ecom"
        id="ecom-faq"
        title={FAQ_HEAD.title}
        description={FAQ_HEAD.description}
        items={FAQS}
      />
      </div>
      <Banner
        title="Your store is one step away"
        body="Try Serverlys ecommerce hosting risk-free. If it is not right, tell us within 30 days for a full refund."
        href="#pricing"
      />
    </div>
  );
}
