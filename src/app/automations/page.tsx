import { JsonLd } from "@/components/ui/json-ld";
import { Faqs } from "@/components/ref/faqs";
import { breadcrumbGraph, faqGraph, pageMetadata, serviceGraph } from "@/lib/seo";
import { FAQS, FAQ_HEAD } from "./_content";
import { Banner } from "./_components/banner";
import { Bento } from "./_components/bento";
import { Hero } from "./_components/hero";
import { Integrate } from "./_components/integrate";
import { Process } from "./_components/process";
import { Plans } from "./_components/plans";
import { Reliability } from "./_components/reliability";
import { SubNav } from "./_components/subnav";
import { Triggers } from "./_components/triggers";
import { Tutorials } from "./_components/tutorials";

/**
 * Automations.
 *
 * Serverlys builds and runs automations for businesses: the daily admin — an
 * enquiry that has to become a record, a booking that has to reach a calendar,
 * a form that has to reach the right person — handled by a workflow instead of
 * by someone remembering. Built on n8n, on infrastructure we manage, set up by
 * us and owned by the customer.
 *
 * HOW THIS PAGE GOT ITS SHAPE. It spent a day as a 1:1 clone of
 * hostinger.com/self-hosted-n8n, and the LAYOUT is still that reference's,
 * measured off the live page at 390 and 1440 rather than estimated —
 * components/ref/kit.tsx holds the grid, type steps and button shape, shared
 * with /cloud-hosting and /ecommerce-hosting.
 *
 * The PROPOSITION is not. That page sold VPS plans to people who wanted to
 * self-host n8n themselves; this one sells the work being done for you. Four
 * bands were rebuilt rather than retitled, because their subjects had no
 * meaning here:
 *
 *   · four KVM plan cards        → how an automation gets built (no price is
 *                                  quoted; every CTA goes to the mapping call)
 *   · a data-centre world map    → what the service actually promises
 *   · "Manage your VPS with AI"  → where a workflow is triggered from
 *   · a Hostinger review wall    → removed outright
 *
 * Also removed, all on the owner's instruction: seven named testimonials that
 * were real reviews of HOSTINGER, a Google/HostAdvice/WPBeginner strip rating
 * a competitor, and the hero's Trustpilot line. Nothing on this page is now a
 * claim about someone else's product or reputation, and nothing quotes a price
 * we do not charge. Do not reintroduce any of it.
 *
 * It is the only fully dark page on the site — every band sits on
 * `canvas-dark`, which is why `Headline`, `Faqs` and `CtaButton` carry
 * dark/on-dark variants rather than this page re-implementing them.
 *
 * THE BRAND RULE HERE, after a first pass came back reading violet:
 *
 *   · solid fills (buttons, glows) are `primary` — brand-600 #0000ff, the
 *     logo, the same blue as every button on the light pages. White on it is
 *     8.59:1, so the label carries the contrast;
 *   · hairlines and art strokes are brand-500, the lowest step still clearing
 *     the 3:1 WCAG asks of a non-text boundary here;
 *   · accent TEXT is brand-400 and nothing lighter — the lowest step clearing
 *     4.5:1 on all three dark surfaces (5.24–5.75:1).
 *
 * The ramp is hue 240 throughout, so every step is technically "the brand" —
 * but tinting hue 240 toward white gives periwinkle, and using the light steps
 * for large areas is what made the page look like Hostinger's purple instead
 * of ours. brand-300 is not used here at all.
 *
 * All product imagery is drawn in SVG in _components/visuals.tsx: the
 * originals are Hostinger's files and, on the tutorial cards, photographs of
 * their staff.
 */

const PATH = "/automations";

const TITLE = "Business automation | Daily admin, handled | Serverlys";
const DESCRIPTION =
  "We build and run the automations that handle your daily admin — enquiry to record, booking to calendar, form to the right person. Built on n8n, owned by you.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const BREADCRUMB = [
  { name: "Home", path: "/" },
  { name: "Automations", path: PATH },
];

/**
 * FAQPage needs plain-text answers, so the block structure the accordion
 * renders is flattened here rather than duplicated as a second copy of the
 * answers that could drift out of sync with the first.
 */
const FAQ_TEXT = FAQS.map((f) => ({
  question: f.q,
  answer: f.a
    .map((b) => (b.type === "ul" ? b.items.join(" ") : b.runs.map((r) => r.text).join("")))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim(),
  // `scopes` drives which pages a shared FAQ appears on. These answers live
  // with this page rather than in data/faqs.ts, so the scope is just this path.
  scopes: [PATH],
}));

export default function AutomationsPage() {
  return (
    /**
     * One wrapper around the rail AND every band it points at. `sticky` is
     * bounded by its scrolling ancestor, so splitting them would let the rail
     * follow the reader into the footer offering to scroll back to sections
     * they have finished with.
     *
     * globals.css sets `text-wrap: balance` on every heading and `pretty` on
     * every paragraph. Both are good defaults and both break the match — the
     * reference wraps normally, so a balanced heading breaks a word early and
     * changes every measured line. Reset for this page only, exactly as
     * /cloud-hosting does.
     */
    <div className="bg-canvas-dark [&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd
        data={serviceGraph({
          name: "Business process automation",
          serviceType: "Business process automation",
          description: DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd data={breadcrumbGraph(BREADCRUMB)} />
      <JsonLd data={faqGraph(FAQ_TEXT)} />

      <Hero />
      <SubNav />
      <Plans />
      <Process />
      <Bento />
      <Integrate />
      <Reliability />
      <Triggers />
      <Tutorials />
      <Banner />
      <Faqs
        id="faq"
        idPrefix="n8n"
        tone="dark"
        size="lg"
        title={FAQ_HEAD.title}
        description={FAQ_HEAD.description}
        items={FAQS}
      />
    </div>
  );
}
