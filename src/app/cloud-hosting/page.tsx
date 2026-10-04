import { JsonLd } from "@/components/ui/json-ld";
import { breadcrumbGraph, faqGraph, pageMetadata, productGraph } from "@/lib/seo";
import { groupById } from "@/data/pricing";
import { FAQS, FAQ_HEAD } from "./_content";
import { Banner } from "./_components/banner";
import { Dashboard } from "./_components/dashboard";
import { Faqs } from "@/components/ref/faqs";
import { Hero } from "./_components/hero";
import { Pricing } from "./_components/pricing";
import { PillNav } from "@/components/sections/pill-nav";
import { Launch } from "./_components/launch";
import { Performance } from "./_components/performance";
import { Security } from "./_components/security";
import { Proof } from "./_components/proof";

/**
 * Cloud hosting.
 *
 * A deliberate 1:1 rebuild of hostinger.com/cloud-hosting: the same sections
 * in the same order, same grid, same type scale, same copy. The page owner
 * asked for a match rather than an interpretation, so the reference's
 * measurements are the spec — see _components/kit.tsx for the numbers and
 * _content.ts for the copy, including what still needs replacing before this
 * is shipped.
 *
 * Removed from the reference on request: the hero's Trustpilot +
 * WordPress.org proof row, the reviews band's Trustpilot line, the connector
 * band, and the "Data centers worldwide" band. The dot-matrix region map that
 * band rendered went with it (_components/world-map.tsx) — it has no other
 * caller, so restoring the band means restoring that file too.
 *
 * Two things are ours rather than theirs, and both are noted where they occur:
 * the accent colour (Serverlys blue, not Hostinger purple) and the product
 * imagery (rebuilt in SVG in _components/visuals.tsx, since the originals are
 * Hostinger's files).
 */

const PATH = "/cloud-hosting";

const TITLE = "Managed cloud hosting | NVMe, LiteSpeed and free migration";
const DESCRIPTION =
  "Managed cloud hosting on NVMe and LiteSpeed, with free migration, daily backups and the renewal price shown on every plan. 30-day money-back guarantee.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

/**
 * Offer range for the Product schema. Derived, not typed — a hardcoded pair
 * here would silently disagree with the slider the first time a rate moves.
 */
const CLOUD_RATES = (groupById("cloud")?.plans ?? []).map((p) => p.monthly);

const BREADCRUMB = [
  { name: "Home", path: "/" },
  { name: "Cloud hosting", path: PATH },
];

/**
 * FAQPage needs plain-text answers, so the block structure the accordion
 * renders is flattened here rather than duplicated as a second copy of the
 * answers that could drift out of sync with the first.
 */
const FAQ_TEXT = FAQS.map((f) => ({
  question: f.q,
  answer: f.a
    .map((b) =>
      b.type === "ul" ? b.items.join(" ") : b.runs.map((r) => r.text).join(""),
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim(),
  // `scopes` drives which pages a shared FAQ appears on. These answers live
  // with this page rather than in data/faqs.ts, so the scope is just this path.
  scopes: [PATH],
}));

const NAV = [
  { id: "pricing", label: "Pricing" },
  { id: "build", label: "Build" },
  { id: "performance", label: "Performance" },
  { id: "security", label: "Security" },
  { id: "ai-agent", label: "AI agent" },
  { id: "cloud-faq", label: "FAQ" },
] as const;

export default function CloudHostingPage() {
  return (
    /**
     * globals.css sets `text-wrap: balance` on every heading and `pretty` on
     * every paragraph. Both are good defaults and both break the match: the
     * reference wraps normally, so "WordPress tools, built / in" becomes
     * "WordPress / tools, built in" under balance. Reset for this page only.
     */
    <div className="[&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd data={breadcrumbGraph(BREADCRUMB)} />
      <JsonLd
        data={productGraph({
          name: "Serverlys Cloud Hosting",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...CLOUD_RATES),
          highPrice: Math.max(...CLOUD_RATES),
          offerCount: CLOUD_RATES.length,
        })}
      />
      <JsonLd data={faqGraph(FAQ_TEXT)} />

      <Hero />
      {/* The wrapper bounds the sticky on-page nav: it stops after the FAQ. */}
      <div>
        <PillNav items={NAV} />
        <Pricing />
        <Launch />
        <Performance />
        <Security />
        <Dashboard />
        <Proof />
        <Faqs
          idPrefix="cloud"
          id="cloud-faq"
          title={FAQ_HEAD.title}
          description={FAQ_HEAD.description}
          items={FAQS}
        />
      </div>
      <Banner />
    </div>
  );
}
