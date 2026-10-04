import { Hero } from "@/components/home/hero";
import { StageDeck } from "@/components/home/stage-deck";
import { StageBuild } from "@/components/home/stage-build";
import { StageLaunch } from "@/components/home/stage-launch";
import { StageGrow } from "@/components/home/stage-grow";
import { StageManage } from "@/components/home/stage-manage";
import { ServicesRail } from "@/components/home/services-rail";
import { SetupsGrid } from "@/components/home/setups-grid";
import { PricingBand } from "@/components/home/pricing-band";
import { BriefBand } from "@/components/home/brief-band";
import { PromoBento } from "@/components/home/promo-bento";
import { CoworkerBand } from "@/components/home/coworker-band";
import { ImaginedCta } from "@/components/home/imagined-cta";
import { Migration } from "@/components/sections/migration";
import { FaqSection } from "@/components/sections/faq";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { JsonLd } from "@/components/ui/json-ld";
import { faqsFor } from "@/data/faqs";
import { groupById } from "@/data/pricing";
import { pageMetadata, faqGraph, productGraph } from "@/lib/seo";
import { company } from "@/data/company";

/**
 * ⚠ Load-bearing. `pageMetadata` is what emits the canonical URL and the
 * og:url / og:type / og:site_name tags; without it the homepage — the most
 * important page on the site — ships with none of them. A rewrite of this file
 * dropped it once and only the SEO audit caught it.
 */
export const metadata = pageMetadata({
  title: `${company.name} — ${company.tagline}`,
  description: company.description,
  path: "/",
});

/**
 * Homepage.
 *
 * Structured as four stages — Build, Launch, Grow, Manage — rather than as a
 * list of products. Somebody arriving here has a job in mind, not a SKU, and
 * the previous ordering made them infer which of thirteen sections applied to
 * them. The stage rail names the four jobs in the hero, repeats them in a
 * sticky sub-nav, and each band answers exactly one of them.
 *
 * SURFACE RHYTHM
 *   abyss · white · subtle · white · [rail] subtle · white · subtle ·
 *   white · subtle · white · subtle · white · subtle · white · brand ·
 *   dark(footer)
 *
 * ⚠ CORRECTION TO AN EARLIER NOTE HERE. When the hue-240 grounds were deleted
 * (see globals.css) `BriefBand` moved from lavender to `subtle`, and a comment
 * was added claiming that collided with `PromoBento`. It does not:
 * `PromoBento` renders `bg-canvas`, so the run is abyss · white · subtle ·
 * white and the rule still holds. The claim was made from the rhythm string
 * above rather than from the component, and the component is the authority.
 *
 * No two adjacent bands share a surface. The dark beats inside Build, Grow and
 * Manage come from the panels within those sections, not from the bands — a
 * full dark band in the middle of the stage sequence cut the sequence in half
 * and made the rail look like it belonged to only the top group.
 *
 * THE STICKY RAIL IS SCOPED ON PURPOSE. StageDeck — the rail and the four stage sections
 * share one wrapper div, because a `sticky` element is bounded by its scrolling
 * ancestor. Left as a sibling of everything, the rail followed the reader down
 * through pricing, the FAQ and into the footer, still offering to scroll them
 * back to sections they had finished with.
 *
 * WHAT IS OPERABLE, NOT DEPICTED
 *   · the hosting console in Build
 *   · both agents in Grow — the chat replies, the call console runs
 *   · the automation canvas in Manage
 * Those four are the argument of the page. Replacing any of them with a
 * screenshot removes the only proof on it.
 *
 * PricingBand keeps id="plans"; the hero, the promo block and the header all
 * link to it.
 */
/**
 * The plans the homepage actually renders, read from the same source the
 * pricing band renders — not a second hand-kept list. `PricingBand` shows
 * `cloud.plans` whole, so the schema has to describe that same set or it is
 * describing a page that does not exist.
 */
const CLOUD_RATES = (groupById("cloud")?.plans ?? []).map((plan) => plan.monthly);

export default function HomePage() {
  const faqs = faqsFor("/");

  return (
    <>
      <JsonLd data={faqGraph(faqs)} />
      {/*
        Product + AggregateOffer for the tiers the pricing band sells.
        The homepage showed four real prices and described none of them, so it
        was ineligible for the price rich result that every competitor on this
        SERP carries — the one gap against Hostinger that was both real and
        legitimately closable.

        AggregateOffer, not Offer: four tiers are on the page and a single
        Offer would misstate the range. Still deliberately NO aggregateRating —
        see the note in seo.ts. `check-reviews.mjs` proves the testimonials on
        this site are still placeholders, so there is nothing genuine to
        aggregate, and inventing one is what earns a manual action.
      */}
      <JsonLd
        data={productGraph({
          name: "Serverlys Cloud Hosting",
          description: company.description,
          path: "/",
          lowPrice: Math.min(...CLOUD_RATES),
          highPrice: Math.max(...CLOUD_RATES),
          offerCount: CLOUD_RATES.length,
        })}
      />

      <Hero />
      {/* Reference order: hero → idea prompt → promo bento → tools tabs →
          essentials → AI co-worker → pricing → closing CTA.
          BriefBand IS the reference's prompt band — read its header: it was
          built for this slot deliberately, with a real input, real chips and a
          send that goes somewhere. It briefly got replaced here with a
          chips-only version, which was strictly worse and broke the coverage
          in test-home. */}
      <PromoBento />
      <BriefBand />

      <Section spacing="tight" labelledBy="stages-heading">
        <Reveal>
          <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
            <h2
              id="stages-heading"
              className="display-lg text-fg"
            >
              Tools for every stage of a project
            </h2>
            <p className="mt-5 text-body-lg text-fg-secondary">
              Four jobs, and what handles each one. Start at whichever is yours.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Scopes the sticky rail to the stage sequence. See note above.
          The deck owns the rail AND the four bands now, because below `sm` the
          rail selects which band is in flow rather than pointing at it. The
          bands are still authored as four independent server components and
          are handed in whole — the deck decides visibility, never content. */}
      <div>
        <StageDeck
          panels={{
            build: <StageBuild />,
            launch: <StageLaunch />,
            grow: <StageGrow />,
            manage: <StageManage />,
          }}
        />
      </div>

      <ServicesRail />
      <SetupsGrid />
      <CoworkerBand />
      <PricingBand />
      <Migration />
      <FaqSection items={faqs} />
      <ImaginedCta />
    </>
  );
}
