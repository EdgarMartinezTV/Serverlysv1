import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import { billing } from "@/data/company";
import { cn } from "@/lib/utils";
import {
  Faqs,
  Features,
  Hero,
  HowItWorks,
  INK,
  MUTED,
  NavyBand,
  PanelCard,
  PhotoCta,
  PricingPanel,
  Promises,
  Related,
  ToolsMarquee,
  UseCases,
} from "@/components/retell/kit";
import { COMMITMENTS, FAQS, PLANS } from "./_copy";
import { GROUPS, RELATED, STEPS, TOOLS, USES } from "./_content";

/**
 * /website-development — rebuilt 2026-10-13 on the shared Retell-style kit
 * (components/retell/kit.tsx), the same layout as /seo. Earlier versions
 * (Hostinger-style 2026-10-03, DreamHost-style 2026-09-14) are in git history.
 *
 * The rate card, commitments and FAQs are unchanged from ./_copy.ts — Edgar's
 * own published rates, no turnaround promise, no invented reviews.
 *
 * ⚠ The FAQ schema uses THIS page's questions rather than the shared
 * `faqsFor()` set. `faqGraph` may only be emitted on a page that visibly
 * renders the same Q&As, and these are what render here.
 */

const PATH = "/website-development";
const DESCRIPTION =
  "Custom web development for small businesses: features, bookings, payments and integrations, scoped in writing first. $129/hr, or from $99/hr on retainer.";

export const metadata = pageMetadata({
  title: "Custom Web Development Services | Serverlys",
  description: DESCRIPTION,
  path: PATH,
});

const [HOURS, RETAINER] = PLANS.cards;

function Rate({ blue, price, unit }: { blue: boolean; price: string; unit: string }) {
  return (
    <span className="flex items-baseline gap-1">
      <span
        className={cn(
          "tabular text-[40px] leading-none font-semibold tracking-[-0.03em]",
          blue ? "text-white" : INK,
        )}
      >
        {price}
      </span>
      <span className={blue ? "text-white/80" : MUTED}>{unit}</span>
    </span>
  );
}

export default function WebsiteDevelopmentPage() {
  const faqs = FAQS.items.map((f) => ({ question: f.q, answer: f.a }));
  const hourly = HOURS.rows[0];
  const lowest = RETAINER.rows[RETAINER.rows.length - 1];

  return (
    <>
      <JsonLd
        data={serviceGraph({
          name: "Custom web development",
          serviceType: "Web application development",
          description: DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd
        /* `scopes` decides which pages a SHARED faq appears on. These are
           page-local, so the scope is this path and nothing else. */
        data={faqGraph(
          faqs.map((f) => ({ ...f, scopes: [PATH] })),
          PATH,
        )}
      />

      <Hero
        id="webdev-hero-heading"
        title="Web Development Built Around How You Work"
        photo={{
          src: "/mock/webdev-hero.jpg",
          alt: "A developer at his desk working across two monitors of code",
        }}
        photoClassName="object-[60%_40%] lg:object-[45%_40%]"
        kicker={[
          `${hourly.price}${hourly.unit}`,
          `From ${lowest.price}${lowest.unit} on retainer`,
        ]}
        lede="The parts of your business that never come in a box. Tell us what it has to do; we scope it in writing, build it on a staged copy and run it on our own servers."
        cta={{ label: "Start a project", href: billing.sales }}
        badgeCaption="Every project"
        badges={[
          { label: "Written scope", icon: "report" },
          { label: "Staged copy", icon: "eye" },
          { label: "Custom code", icon: "code" },
          { label: "We host it", icon: "server" },
        ]}
      />
      <HowItWorks
        id="webdev-how-heading"
        title="From your idea to a live feature, on the site you already have."
        steps={STEPS}
      />
      <UseCases
        id="webdev-uses-heading"
        label="What we build"
        title="What we get asked to build"
        items={USES}
      />
      <NavyBand
        id="webdev-navy-heading"
        kicker="Built and hosted by one team"
        title="The people who build it also run it"
        body="Most web work is handed to a developer, then handed again to a host who did not write it. Here it is one team, which is why nothing gets lost at the boundary."
        aside={`[${hourly.price}${hourly.unit}] by the hour, or from [${lowest.price}${lowest.unit}] on retainer. [Scoped in writing] before any work starts.`}
        cta={{ label: "See rates", href: "#plans" }}
      />
      <Promises
        id="webdev-promise-heading"
        intro="Six things you can hold us to on every project, whether it is a one-hour fix or a full build."
        items={COMMITMENTS.items}
      />
      <Features
        id="webdev-features-heading"
        title="How a project runs with Serverlys"
        groups={GROUPS}
      />
      <ToolsMarquee
        id="webdev-tools-heading"
        title="The platforms we build on and the tools we connect"
        cta={{ label: "Start a project", href: billing.sales }}
        rows={TOOLS}
      />
      <PricingPanel
        id="webdev-plans-heading"
        title={PLANS.title}
        columns={2}
        footnote={PLANS.footnote}
      >
        <PanelCard
          icon="clock"
          name={HOURS.name}
          summary={HOURS.body}
          price={<Rate blue={false} price={hourly.price} unit={hourly.unit} />}
          cta={{ label: "Book hours", href: billing.sales }}
          listTitle="Good for"
          list={[
            "A fix or a single feature",
            "Something that has been blocking you",
            "Work with a clear finish line",
          ]}
        />
        <PanelCard
          blue
          delay={80}
          icon="calendar"
          name={RETAINER.name}
          badge="Lower rate"
          summary={RETAINER.body}
          price={
            <ul className="flex flex-col">
              {RETAINER.rows.map((r) => (
                <li
                  key={r.label}
                  className="flex items-baseline justify-between gap-3 border-t border-white/15 py-2.5 first:border-t-0 first:pt-0"
                >
                  <span className="text-[14px] text-white/85">
                    {r.label.replace(" •", "").toLowerCase()} a month
                  </span>
                  <span className="flex items-baseline gap-2">
                    {r.off && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">
                        {r.off} off
                      </span>
                    )}
                    <span className="tabular text-[26px] leading-none font-semibold tracking-[-0.02em]">
                      {r.price}
                    </span>
                    <span className="text-white/80">{r.unit}</span>
                  </span>
                </li>
              ))}
            </ul>
          }
          cta={{ label: "Set up a retainer", href: billing.sales }}
        />
      </PricingPanel>
      <Faqs id="webdev-faq-heading" items={faqs} />
      <Related id="webdev-related-heading" items={RELATED} />
      <PhotoCta
        id="webdev-cta-heading"
        photo={{
          src: "/mock/webdev-cta.jpg",
          alt: "A boutique owner on the phone while working on her laptop",
          position: "60% 40%",
        }}
        thumb="/mock/webdev-build.jpg"
        title="Tell us what it has to do"
        body="Describe the outcome rather than the feature list. We will come back with what it takes, what it costs and how long it runs."
        primary={{ label: "Get a scope and a price", href: billing.sales }}
      />
    </>
  );
}
