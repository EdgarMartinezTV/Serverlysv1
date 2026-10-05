import { JsonLd } from "@/components/ui/json-ld";
import { Faqs } from "@/components/ref/faqs";
import { ContentSwitch } from "@/components/ref/content-switch";
import { PlanCard } from "@/components/ref/plan-card";
import { groupById } from "@/data/pricing";
import { Grid, Headline } from "@/components/ref/kit";
import { faqGraph, pageMetadata, serviceGraph } from "@/lib/seo";
import { FAQS, FAQ_HEAD, PRICING_HEAD, WHY } from "./_content";
import { AiTools, Banner, Hero, How, Savings, Steps } from "./_components/sections";
import { WhyPanel } from "./_components/visuals";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

/**
 * Website migration.
 *
 * A 1:1 rebuild of hostinger.com/website-migration, on the same terms as the
 * other reference pages. This one was measured FIRST — the reference was
 * screenshotted and its computed styles dumped before a line was written,
 * which is the step that was skipped on the domain pages and cost a rebuild.
 *
 * Section order is the reference's:
 *   header → h-content-cards → h-video-section (dark) → h-content-switch
 *   → h-market-compare-table → hw-section-wrapper (dark) → h-pricing-table
 *   → h-text-button-section (dark) → hw-faq-section
 *
 * Pricing uses the site's existing <PricingTable>, which reads data/pricing.ts
 * — the reference's plan cards are its own products at its own prices, and we
 * already have a component that renders ours correctly with the renewal rate
 * beside the monthly rate.
 *
 * Removed from the reference, matching the standing calls on the other clones:
 * the hero's Trustpilot + WordPress.org row, the customer review carousel, and
 * the Google/HostAdvice/WPBeginner ratings strip.
 */

const PATH = "/migrations";

const TITLE = "Free website migration | Transfer a site to Serverlys";
const DESCRIPTION =
  "Serverlys offers free website migration whether you have one website or a hundred. Your site stays online throughout, and the move is handled for you.";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const BREADCRUMB = [
  { name: "Home", path: "/" },
  { name: "Migrations", path: PATH },
];

const FAQ_TEXT = FAQS.map((f) => ({
  question: f.q,
  answer: f.a
    .map((b) => (b.type === "ul" ? b.items.join(" ") : b.runs.map((r) => r.text).join("")))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim(),
  scopes: [PATH],
}));

const CLOUD = groupById("cloud");

export default function WpMigrationsPage() {
  return (
    /** globals.css balances headings; the reference wraps normally. */
    <div className="[&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd
        data={serviceGraph({
          name: "Free website migration",
          serviceType: "Website migration",
          description: DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd data={faqGraph(FAQ_TEXT)} />

      <Hero />
      <Steps />
      <How />

      <ContentSwitch
        id="wm-why"
        copy={WHY}
        media={<WhyPanel className="aspect-[600/560] w-full" />}
      />

      <Savings />
      <AiTools />

      <section
        id="pricing"
        aria-labelledby="wm-pricing-heading"
        className="scroll-mt-24 bg-canvas-secondary py-16 lg:py-24"
      >
        <Grid>
          <Headline
            id="wm-pricing-heading"
            title={PRICING_HEAD.title}
            description={PRICING_HEAD.description}
            className="mb-8 xl:mb-12"
          />
          {/* Shared PlanCard grid (2026-10-03), same card as /pricing and the
              product pages: both prices on every card, no rate toggle. */}
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {CLOUD?.plans.map((plan) => (
              <li key={plan.tier}>
                <PlanCard plan={plan} group={CLOUD} cta="Choose plan" />
              </li>
            ))}
          </ul>
        </Grid>
      </section>

      <Banner />

      <Faqs
        idPrefix="wm"
        title={FAQ_HEAD.title}
        description={FAQ_HEAD.description}
        items={FAQS}
      />
      <PageBreadcrumbs trail={BREADCRUMB} />
    </div>
  );
}
