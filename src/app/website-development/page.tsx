import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, faqGraph, breadcrumbGraph, serviceGraph } from "@/lib/seo";
import { Hero, Expert, Ways, Plans, Tackle, Commitments, Chat } from "./_components/sections";
import { Faq } from "./_components/faq";
import { FAQS } from "./_content";

/**
 * /website-development — a 1:1 rebuild of
 * https://www.dreamhost.com/pro-services/development/ (2026-09-14).
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
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Web development", path: PATH },
        ])}
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
      <Plans />
      <Tackle />
      {/* Commitments stands in the testimonial slot. Serverlys has no collected
          customer reviews yet, and the band's job — give a stranger a reason to
          believe you — is better done by things that are checkable than by
          quotes nobody said. Swap back to <Reviews /> once real ones exist;
          `REVIEWS` and its `check:reviews` gate are still in place. */}
      <Commitments />
      <Chat />
      <Faq />
    </>
  );
}
