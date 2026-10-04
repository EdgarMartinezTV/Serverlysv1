import { PillNav } from "@/components/sections/pill-nav";
import { FaqSection } from "@/components/sections/faq";
import { JsonLd } from "@/components/ui/json-ld";
import { groupById, formatPrice } from "@/data/pricing";
import { faqsFor } from "@/data/faqs";
import { pageMetadata, faqGraph, breadcrumbGraph, productGraph } from "@/lib/seo";
import { Proof } from "../cloud-hosting/_components/proof";
import { Banner } from "../cloud-hosting/_components/banner";
import { Hero } from "./_components/hero";
import { Plans } from "./_components/plans";
import {
  Answering,
  FreeMigration,
  HandsOff,
  Protection,
  SaveHours,
  Speed,
} from "./_components/sections";

const PATH = "/wordpress-hosting";
const DESCRIPTION =
  "Managed WordPress hosting with server-level LiteSpeed caching, automatic core updates and free migration. Renewal pricing published beside the first-year price.";

const group = groupById("wordpress");
const prices = group?.plans.map((p) => p.monthly) ?? [0];

export const metadata = pageMetadata({
  title: `WordPress Hosting — managed plans from ${formatPrice(Math.min(...prices))}/mo | Serverlys`,
  description: DESCRIPTION,
  path: PATH,
});

/**
 * WordPress hosting — rebuilt 2026-10-03 on the reference's section order:
 * hero · pill nav · plans · AI on the site · save hours · performance ·
 * protection (dark) · hands-off · migration (dark) · commitments + Sera ·
 * FAQ · closing banner. All imagery is code; see sections.tsx for which
 * reference claims were swapped for ones Serverlys can make.
 */
const NAV = [
  { id: "plans", label: "Pricing" },
  { id: "agent", label: "AI agent" },
  { id: "performance", label: "Performance" },
  { id: "features", label: "Features" },
  { id: "faq", label: "FAQ" },
] as const;

export default function WordPressHostingPage() {
  const faqs = faqsFor(PATH);

  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "WordPress hosting", path: PATH },
        ])}
      />
      <JsonLd
        data={productGraph({
          name: "Serverlys WordPress Hosting",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: prices.length,
        })}
      />
      <JsonLd data={faqGraph(faqs)} />

      <Hero />
      {/* The wrapper bounds the sticky pill nav: it stops after the FAQ. */}
      <div>
        <PillNav items={NAV} />
        <Plans />
        <Answering />
        <SaveHours />
        <Speed />
        <Protection />
        <HandsOff />
        <FreeMigration />
        <Proof />
        <div id="faq" className="scroll-mt-14">
          <FaqSection items={faqs} />
        </div>
      </div>
      <Banner
        title="Launch WordPress today"
        body="Try Serverlys WordPress hosting risk-free. If it is not right, tell us within 30 days for a full refund."
        href="#plans"
      />
    </>
  );
}
