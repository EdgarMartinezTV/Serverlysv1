import Image from "next/image";
import { JsonLd } from "@/components/ui/json-ld";
import { Faqs } from "@/components/ref/faqs";
import { Split } from "@/components/ref/split";
import { groupById } from "@/data/pricing";
import { breadcrumbGraph, faqGraph, pageMetadata, productGraph } from "@/lib/seo";
import { FAQS, FAQ_HEAD, LAUNCH, MIGRATION, SECURITY, SPEED, SUPPORT } from "./_content";
import { Agent } from "./_components/agent";
import { Banner } from "./_components/banner";
import { Email } from "./_components/email";
import { Hero } from "./_components/hero";
import { Pricing } from "./_components/pricing";
import { ChatPanel } from "./_components/visuals";

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
      <Pricing />

      <Split
        id="ecom-launch-heading"
        title={LAUNCH.title}
        description={LAUNCH.description}
        items={LAUNCH.items}
        media={
          <Image
            src="/Hosting-images/ecommerce-launch-quickly.png"
            alt="The Serverlys panel adding a product, with AI generating the description, beside a WordPress site and the hosting behind it"
            width={1536}
            height={1024}
            sizes="(min-width: 1280px) 600px, (min-width: 768px) 688px, 100vw"
            className="h-auto w-full rounded-2xl"
          />
        }
        reverse
      />

      <Agent />

      <Split
        id="ecom-speed-heading"
        title={SPEED.title}
        description={SPEED.description}
        items={SPEED.items}
        media={
          <Image
            src="/Hosting-images/Woocommerce-checkout-section.png"
            alt="A WooCommerce order summary totalling $92 beside a sales overview, top products and store performance readout"
            width={1403}
            height={1121}
            sizes="(min-width: 1280px) 600px, (min-width: 768px) 688px, 100vw"
            className="h-auto w-full rounded-2xl"
          />
        }
        reverse
      />

      <Email />

      <Split
        id="ecom-security-heading"
        tone="dark"
        title={SECURITY.title}
        description={SECURITY.description}
        items={SECURITY.items}
        media={
          <Image
            src="/Hosting-images/Top-notch-security.png"
            alt="A site in the Serverlys panel with SSL protection, cloud infrastructure and daily backups shown active"
            width={1254}
            height={1254}
            sizes="(min-width: 1280px) 600px, (min-width: 768px) 688px, 100vw"
            className="h-auto w-full rounded-2xl"
          />
        }
        reverse
      />

      <Split
        id="ecom-migration-heading"
        tone="dark"
        title={MIGRATION.title}
        description={MIGRATION.description}
        items={MIGRATION.items}
        cta={{ label: "Request a migration", href: "/migrations" }}
        /* Our own migration artwork rather than a second ChatPanel — the
           support band below already uses that, and two identical panels two
           sections apart reads as a mistake. */
        media={
          <Image
            src="/Hosting-images/Migration.png"
            alt="A store migration in progress, with products, orders, media and customers transferred"
            width={1536}
            height={1024}
            sizes="(min-width: 1280px) 600px, (min-width: 768px) 688px, 100vw"
            className="h-auto w-full rounded-2xl"
          />
        }
      />

      <Split
        id="ecom-support-heading"
        title={SUPPORT.title}
        items={SUPPORT.items}
        media={<ChatPanel className="aspect-[600/435] w-full" />}
      />

      <Banner />

      <Faqs
        idPrefix="ecom"
        title={FAQ_HEAD.title}
        description={FAQ_HEAD.description}
        items={FAQS}
      />
    </div>
  );
}
