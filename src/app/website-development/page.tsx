import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import { FinalCta } from "@/components/sections/final-cta";
import {
  Chat,
  Commitments,
  Expert,
  Faq,
  Hero,
  Plans,
  Process,
  Tackle,
  Ways,
} from "./_components/sections";
import { FAQS } from "./_copy";

/**
 * /website-development — rebuilt 2026-10-03 in the site-wide Hostinger-layout
 * style (see _components/sections.tsx). Earlier history below.
 *
 * Previously a 1:1 layout rebuild of a DreamHost page (2026-09-14).
 *
 * LAYOUT ONLY. Edgar asked for this page to look exactly like that one, so the
 * section order, grid, type scale and measurements are the reference's — all in
 * `_components/kit.tsx`. THE COPY IS NOT: every sentence was rewritten for
 * Serverlys on 2026-09-14 so the page does not trade on someone else's writing.
 * `_content.ts` carries the rules that rewrite was done under, including why
 * this page publishes no hourly rate and no turnaround promise.
 *
 * REPLACES the previous page, which was built from the site's own section kit
 * (ProductHero / ShowcaseSplit / FeatureGrid / FinalCta). That version is in
 * git history if the clone is ever reverted.
 *
 * ⚠ The FAQ schema below intentionally uses THIS page's questions rather than
 * the shared `faqsFor()` set. `faqGraph` may only be emitted on a page that
 * visibly renders the same Q&As, and these are what render here.
 */

const PATH = "/website-development";
const DESCRIPTION =
  "Custom web development for applications, integrations and the things an off-the-shelf plugin cannot do — built on the infrastructure that will run them.";

export const metadata = pageMetadata({
  title: "Web Development — applications and integrations | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

export default function WebsiteDevelopmentPage() {
  return (
    <>
      <JsonLd
        data={serviceGraph({
          name: "Website development",
          serviceType: "Web application development",
          description: DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd
        /* `scopes` is what decides which pages a SHARED faq appears on. These
           are page-local, so the scope is this path and nothing else. */
        data={faqGraph(
          FAQS.items.map((f) => ({ question: f.q, answer: f.a, scopes: [PATH] })),
        )}
      />

      <Hero />
      <Expert />
      <Ways />
      <Process />
      <Plans />
      <Tackle />
      <Commitments />
      <Chat />
      <Faq />
      <FinalCta plansHref="#plans" />
      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Web development", path: PATH },
        ]}
      />
    </>
  );
}
