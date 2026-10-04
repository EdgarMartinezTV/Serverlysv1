import Link from "next/link";
import { PageHero } from "../resources/_components/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { SitePreviewMock } from "@/components/product-ui/mocks";
import { pageMetadata, breadcrumbGraph, faqGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";
import { billing } from "@/data/company";

const PATH = "/our-process";

export const metadata = pageMetadata({
  title: "Our Process — how a Serverlys project actually runs",
  description:
    "The five stages of a website or AI project with Serverlys: what happens, what you get at the end of each, and what we need from you.",
  path: PATH,
});

/**
 * Process.
 *
 * The useful thing about a process page is not the stage names — every agency
 * has five of those. It is the two columns most of them omit: what you
 * RECEIVE at the end of each stage, and what we NEED FROM YOU to start the
 * next one. Projects run late because of the second column far more often than
 * the first, so it is on the page.
 */
const STAGES = [
  {
    n: "01",
    name: "Scope",
    duration: "About a week",
    what: "We work out what the thing has to do and who for. Not a wishlist — a short document naming the outcome, the constraints, and what is explicitly out of scope.",
    deliver: ["A written scope with the outcome defined", "A fixed price, or a range with what moves it", "A date"],
    need: ["Access to whoever makes the decision", "Your existing site, analytics and anything already written", "An honest answer about the deadline behind the deadline"],
  },
  {
    n: "02",
    name: "Structure",
    duration: "One to two weeks",
    what: "Before anything is designed, we agree what pages exist, what each one is for, and what a visitor is supposed to do on it. This is where projects are won or lost, and it is the stage people want to skip.",
    deliver: ["A page map with the purpose of each page", "The content each page needs, listed", "Wireframes for anything unusual"],
    need: ["One round of feedback, consolidated", "Content decisions — what you will supply and what we write"],
  },
  {
    n: "03",
    name: "Design",
    duration: "Two to three weeks",
    what: "Real design on real content, at desktop and mobile. Not a template with your logo dropped in, and not a beautiful mockup that only works with the words we invented for it.",
    deliver: ["Designed pages at two breakpoints", "The component set the rest of the site is built from", "Everything reviewed against contrast and target-size rules"],
    need: ["Logo files, brand colours and typefaces if you have them", "Photography, or a decision to commission it", "A consolidated round of feedback"],
  },
  {
    n: "04",
    name: "Build",
    duration: "Two to four weeks",
    what: "Built on the design system, tested across the range of screen sizes people actually use, and checked for keyboard and screen-reader access as it goes rather than at the end.",
    deliver: ["A staging site you can use", "Forms wired to somewhere real", "Metadata, structured data, sitemap and redirects"],
    need: ["Final content", "Any third-party accounts we need to connect", "Time to actually look at staging"],
  },
  {
    n: "05",
    name: "Launch and after",
    duration: "A day, then ongoing",
    what: "DNS moves when you approve it, with the old site kept as the rollback. Then we watch the error log rather than the homepage, because that is where launch problems appear.",
    deliver: ["The site live, with redirects from old URLs", "Search Console and analytics connected", "A handover you can act on"],
    need: ["A decision on who maintains it afterwards"],
  },
] as const;

const FAQS: readonly Faq[] = [
  {
    question: "Why is there a scope stage before you quote?",
    answer:
      "Because a price given before anyone knows what the thing does is a guess, and guesses get corrected in one direction. A short paid scope produces a fixed price you can rely on, and if you take that document elsewhere afterwards it is still yours.",
    scopes: [PATH],
  },
  {
    question: "What makes a project run late?",
    answer:
      "Content, almost every time. Design and build have a schedule; waiting for the copy for six pages does not. The second most common is feedback arriving in pieces from different people over two weeks rather than consolidated once.",
    scopes: [PATH],
  },
  {
    question: "Can you work with our existing designer or developer?",
    answer:
      "Yes, and it works best when the boundary is written down at scope: who owns which files, who deploys, and who is accountable when something breaks at 6pm. Ambiguity there is the problem, not the collaboration.",
    scopes: [PATH],
  },
  {
    question: "What happens if we change our minds halfway?",
    answer:
      "You tell us, and we tell you what it costs in time and money before we do it. Changes are normal. Changes absorbed silently and then discovered at the end as a delay are not.",
    scopes: [PATH],
  },
];

export default function OurProcessPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "Our process", path: PATH },
        ])}
      />
      <JsonLd data={faqGraph(FAQS)} />

      <PageHero
        trail={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
          { name: "Our process" },
        ]}
        label="Our process"
        title="Five stages, and what each one owes you"
        lede={
          <p>
            Every agency has a process diagram. The useful columns are the two most of them
            leave out: what you actually receive at the end of a stage, and what we need from
            you to start the next one.
          </p>
        }
        visual={<SitePreviewMock />}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={billing.sales} size="lg">
            Start with a scope
          </Button>
          <Button href="/website-design" variant="outline" size="lg">
            See design work
          </Button>
        </div>
      </PageHero>

      {/* The stages. Three columns per stage: what / you get / we need. */}
      <Section>
        <SectionHeader
          eyebrow="The stages"
          title="What happens, in order"
          lede="Durations are typical for a small business site. A store or an application is longer, and we say so at scope rather than discovering it in week six."
        />
        <ol className="mt-12 flex flex-col gap-4">
          {STAGES.map((s) => (
            <li key={s.n} className="rounded-3xl bg-canvas-secondary p-6 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
                <div>
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-small font-semibold text-white">
                      {Number(s.n)}
                    </span>
                    <h3 className="text-h3 font-medium tracking-[-0.02em] text-fg">{s.name}</h3>
                  </div>
                  <p className="mt-4 inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-micro font-semibold text-primary">
                    {s.duration}
                  </p>
                  <p className="mt-4 max-w-[52ch] text-body text-fg-secondary">
                    {s.what}
                  </p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <h4 className="text-small font-semibold text-fg">
                      You receive
                    </h4>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {s.deliver.map((d) => (
                        <li key={d} className="flex gap-2.5 text-small text-fg">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-small font-semibold text-fg">
                      We need from you
                    </h4>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {s.need.map((d) => (
                        <li key={d} className="flex gap-2.5 text-small text-fg-secondary">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Principles — short, and each one has a cost to us. */}
      <Section surface="dark" spacing="tight">
        <SectionHeader
          eyebrow="How we work"
          tone="dark"
          title="Four things we do that cost us money"
          lede="Anyone can list values. These are the ones with a price attached."
        />
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["We say no to work", "If a template would serve you better than a custom build, we will tell you and lose the project."],
            ["We quote changes before doing them", "Slower conversations, no surprise invoices."],
            ["We build accessibility in", "It takes longer than adding it at the end, and adding it at the end does not work."],
            ["We hand over properly", "You get what you need to leave. That is what makes staying a choice."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <dt className="text-body font-semibold text-white">{t}</dt>
              <dd className="mt-2 text-small text-fg-on-dark-secondary">{d}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section surface="light" spacing="tight">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-50 p-7 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-h4 text-fg">Where this process gets used</h2>
            <p className="mt-2 max-w-2xl text-body text-fg-secondary">
              The same five stages run a{" "}
              <Link href="/website-design" className="font-medium text-primary hover:text-primary-hover">
                website design
              </Link>{" "}
              project, a{" "}
              <Link href="/website-development" className="font-medium text-primary hover:text-primary-hover">
                custom build
              </Link>
              , and an{" "}
              <Link href="/ai-agents" className="font-medium text-primary hover:text-primary-hover">
                AI agent
              </Link>{" "}
              setup. Hosting migrations have their own,{" "}
              <Link href="/migrations" className="font-medium text-primary hover:text-primary-hover">
                shorter runbook
              </Link>
              .
            </p>
          </div>
          <Button href={billing.sales}>Talk about a project</Button>
        </div>
      </Section>

      <FaqSection items={FAQS} />
      <FinalCta />
    </>
  );
}
