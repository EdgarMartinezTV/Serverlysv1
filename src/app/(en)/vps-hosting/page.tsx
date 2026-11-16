import { JsonLd } from "@/components/ui/json-ld";
import { Faqs } from "@/components/ref/faqs";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";
import { faqGraph, pageMetadata, serviceGraph } from "@/lib/seo";
import { FAQS, FAQ_HEAD } from "./_content";
import { Banner } from "./_components/banner";
import { Hero } from "./_components/hero";
import { Manage } from "./_components/manage";
import { Place } from "./_components/place";
import { Plans } from "./_components/plans";
import { Promises } from "./_components/promises";
import { Stack } from "./_components/stack";
import { Tools } from "./_components/tools";
import { Uses } from "./_components/uses";

const PATH = "/vps-hosting";

export const metadata = pageMetadata({
  /* "Coming soon" in the title and description: the tier is not orderable,
     so neither the SERP snippet nor a share card may read as if it were. */
  title: "VPS Hosting (coming soon) | Full root access | Serverlys",
  description:
    "Serverlys VPS hosting is coming soon: reserved CPU and memory, NVMe storage and full root access, managed or unmanaged. See the planned sizes and get launch updates.",
  path: PATH,
});

/**
 * VPS hosting — COMING SOON.
 *
 * LAYOUT is a 1:1 rebuild of hostinger.com/vps-hosting, measured at 1440 on
 * 2026-11-16, at Edgar's request. Ten bands in the reference's order: hero
 * with three art cards → four plan cards → expanding use-case row → stack
 * picker → globe → tabbed "manage" plate → six-tool grid → card rail →
 * banner → FAQ. The whole page sits on black, like the reference.
 *
 * CONTENT is Serverlys' own (Edgar, same day: "same layout, our words"):
 *   · not on sale — no price, no Offer in the structured data, every CTA to
 *     the sales desk; plan sizes are PLANNED and labelled so;
 *   · no Trustpilot row and no review wall — the rail carries commitments;
 *   · none of the reference's infrastructure facts (CPU vendor, data-centre
 *     count, latency, clean energy, DDoS vendor, AI agent);
 *   · glows and buttons in the logo blue, never Hostinger purple.
 * All of it is documented again at the top of _content.ts.
 *
 * `font-display` puts the whole page in DM Sans, as the reference sets it;
 * the site's body face elsewhere is Noto Sans. The text-wrap resets undo
 * globals.css's balance/pretty so headings break where the reference's do.
 */
const FAQ_TEXT = FAQS.map((f) => ({
  question: f.q,
  answer: f.a
    .map((b) => (b.type === "ul" ? b.items.join(". ") : b.runs.map((r) => r.text).join("")))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim(),
  scopes: [PATH],
}));

export default function VpsHostingPage() {
  return (
    <div className="bg-black font-display [&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd data={faqGraph(FAQ_TEXT, PATH)} />
      {/* Service only — no Offer, no price: the product is not on sale. */}
      <JsonLd
        data={serviceGraph({
          name: "Serverlys VPS Hosting (coming soon)",
          serviceType: "Virtual private server hosting",
          description: String(metadata.description ?? ""),
          path: PATH,
        })}
      />

      <Hero />
      <Plans />
      <Uses />
      <Stack />
      <Place />
      <Manage />
      <Tools />
      <Promises />
      <Banner />
      <div className="[&>section]:bg-black">
        <Faqs idPrefix="vps" title={FAQ_HEAD.title} description="" items={FAQS} tone="dark" size="lg" defaultOpen={0} />
      </div>
      <div className="bg-black text-white [&_a]:text-white/80">
        <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
      </div>
    </div>
  );
}
