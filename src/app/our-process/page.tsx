import Image from "next/image";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, faqGraph } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import type { Faq } from "@/data/faqs";
import { Faqs, PhotoCta, Wrap } from "@/components/retell/kit";
import { ChatButton } from "@/components/retell/chat-button";
import { Reveal } from "@/components/animations/reveal";
import {
  ScopeMock,
  StagingMock,
  DeployMock,
} from "../website-development/_components/mocks";
import { StyleGuideMock } from "../website-design/_components/mocks";

/**
 * Our Process — 2026-10-13, rebuilt in the retellai.com/about-us style used
 * on /about: serif hero, intro + visual, serif manifesto, dark band, a
 * vertical stage timeline, principles, FAQ and photo CTA.
 *
 * CONTENT IS UNCHANGED from the previous version (stages, durations, what
 * you receive, what we need, principles, FAQs). The useful thing about a
 * process page is the two columns most agencies omit: what you RECEIVE at
 * the end of each stage, and what we NEED FROM YOU to start the next one.
 */

const serif = Instrument_Serif({ weight: "400", subsets: ["latin"], display: "swap" });
const INK = "text-[#1f2124]";
const BLUE = "text-[#3b5bdb]";

const PATH = "/our-process";
export const metadata = pageMetadata({
  title: "Our Process | How a Serverlys Project Runs",
  description:
    "The five stages of a website or AI project with Serverlys: what happens, what you get at the end of each, and what we need from you.",
  path: PATH,
});

function Eyebrow({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <p className={cn("text-[13px] font-medium", BLUE, center && "text-center")}>
      {children}
    </p>
  );
}

const STAGES = [
  {
    n: "01",
    name: "Scope",
    duration: "About a week",
    what: "We work out what the thing has to do and who for. Not a wishlist — a short document naming the outcome, the constraints, and what is explicitly out of scope.",
    deliver: [
      "A written scope with the outcome defined",
      "A fixed price, or a range with what moves it",
      "A date",
    ],
    need: [
      "Access to whoever makes the decision",
      "Your existing site, analytics and anything already written",
      "An honest answer about the deadline behind the deadline",
    ],
  },
  {
    n: "02",
    name: "Structure",
    duration: "One to two weeks",
    what: "Before anything is designed, we agree what pages exist, what each one is for, and what a visitor is supposed to do on it. This is where projects are won or lost, and it is the stage people want to skip.",
    deliver: [
      "A page map with the purpose of each page",
      "The content each page needs, listed",
      "Wireframes for anything unusual",
    ],
    need: [
      "One round of feedback, consolidated",
      "Content decisions — what you will supply and what we write",
    ],
  },
  {
    n: "03",
    name: "Design",
    duration: "Two to three weeks",
    what: "Real design on real content, at desktop and mobile. Not a template with your logo dropped in, and not a beautiful mockup that only works with the words we invented for it.",
    deliver: [
      "Designed pages at two breakpoints",
      "The component set the rest of the site is built from",
      "Everything reviewed against contrast and target-size rules",
    ],
    need: [
      "Logo files, brand colours and typefaces if you have them",
      "Photography, or a decision to commission it",
      "A consolidated round of feedback",
    ],
  },
  {
    n: "04",
    name: "Build",
    duration: "Two to four weeks",
    what: "Built on the design system, tested across the range of screen sizes people actually use, and checked for keyboard and screen-reader access as it goes rather than at the end.",
    deliver: [
      "A staging site you can use",
      "Forms wired to somewhere real",
      "Metadata, structured data, sitemap and redirects",
    ],
    need: [
      "Final content",
      "Any third-party accounts we need to connect",
      "Time to actually look at staging",
    ],
  },
  {
    n: "05",
    name: "Launch and after",
    duration: "A day, then ongoing",
    what: "DNS moves when you approve it, with the old site kept as the rollback. Then we watch the error log rather than the homepage, because that is where launch problems appear.",
    deliver: [
      "The site live, with redirects from old URLs",
      "Search Console and analytics connected",
      "A handover you can act on",
    ],
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

const PRINCIPLES = [
  [
    "We say no to work",
    "If a template would serve you better than a custom build, we will tell you and lose the project.",
  ],
  ["We quote changes before doing them", "Slower conversations, no surprise invoices."],
  [
    "We build accessibility in",
    "It takes longer than adding it at the end, and adding it at the end does not work.",
  ],
  [
    "We hand over properly",
    "You get what you need to leave. That is what makes staying a choice.",
  ],
] as const;

const VISUALS = [
  <ScopeMock key="s" />,
  null,
  <StyleGuideMock key="d" />,
  <StagingMock key="b" />,
  <DeployMock key="l" />,
];

export default function OurProcessPage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />

      {/* Hero */}
      <section
        aria-labelledby="process-heading"
        className="bg-white pt-20 pb-20 lg:pt-28 lg:pb-28"
      >
        <Wrap>
          <h1
            id="process-heading"
            className={cn(
              serif.className,
              "text-[64px] leading-none tracking-[-0.03em] sm:text-[88px] lg:text-[104px]",
              INK,
            )}
          >
            Our Process
          </h1>
          <div className="mt-20 grid items-start gap-12 lg:mt-28 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow>How a project runs</Eyebrow>
              <p
                className={cn(
                  "mt-6 max-w-[460px] text-[32px] leading-[1.15] tracking-[-0.02em] lg:text-[38px]",
                  INK,
                )}
              >
                Five stages, and what each one owes you.
              </p>
              <p className="mt-8 max-w-[440px] text-[16px] leading-[1.65] text-[#4a4f57]">
                Every agency has a process diagram. The useful columns are the two most
                of them leave out: what you actually receive at the end of a stage, and
                what we need from you to start the next one.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                <a
                  href={billing.sales}
                  className="inline-flex h-10 items-center rounded-[4px] bg-[#0b1530] px-4 text-[14px] font-semibold text-white hover:bg-[#1b2750]"
                >
                  Start with a scope
                </a>
                <ChatButton size="sm">Ask Sera</ChatButton>
              </div>
            </div>
            <div className="relative aspect-[4/3.1] overflow-hidden rounded-lg bg-[#f3f3f7]">
              <Image
                src="/mock/design-wireframe.jpg"
                alt="Hand-drawn wireframe sketches of website pages"
                fill
                sizes="(min-width:1024px) 540px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Wrap>
      </section>

      {/* Manifesto */}
      <section
        aria-labelledby="process-manifesto-heading"
        className="bg-white pb-24 lg:pb-32"
      >
        <Wrap>
          <Eyebrow center>What makes projects late</Eyebrow>
          <h2
            id="process-manifesto-heading"
            className={cn(
              serif.className,
              "mt-8 text-center text-[56px] leading-[1.02] tracking-[-0.035em] text-[#3a3a3a] sm:text-[88px] lg:text-[124px]",
            )}
          >
            It’s Almost
            <br />
            Never the Code.
          </h2>
          <p className="mx-auto mt-8 max-w-[520px] text-center text-[16px] leading-[1.55] text-[#2f3238]">
            It is the copy for six pages that has not arrived, or feedback from three
            people over two weeks. So the second column, what we need from you, is on
            the page.
          </p>
        </Wrap>
      </section>

      {/* Dark band: the five stages at a glance */}
      <section aria-labelledby="process-glance-heading" className="px-2">
        <div className="rounded-xl bg-black px-6 py-20 lg:py-28">
          <h2
            id="process-glance-heading"
            className="text-center text-[15px] font-medium tracking-[0.08em] text-white/60 uppercase"
          >
            The five stages
          </h2>
          <ol className="mx-auto mt-10 grid max-w-[1100px] gap-3 sm:grid-cols-5">
            {STAGES.map((s) => (
              <li
                key={s.n}
                className="rounded-lg bg-white/[0.06] p-5 ring-1 ring-white/10"
              >
                <p
                  className={cn(
                    serif.className,
                    "text-[44px] leading-none text-white/90",
                  )}
                >
                  {s.n}
                </p>
                <p className="mt-4 text-[17px] font-medium text-white">{s.name}</p>
                <p className="mt-1 text-[13px] text-white/60">{s.duration}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-8 max-w-[560px] text-center text-[14px] text-white/60">
            Durations are typical for a small business site. A store or an application
            is longer, and we say so at scope rather than discovering it in week six.
          </p>
        </div>
      </section>

      {/* Stage timeline */}
      <section aria-labelledby="process-stages-heading" className="px-2 pt-24 lg:pt-32">
        <div className="rounded-xl bg-[#f3f3f7] py-20 lg:py-24">
          <Wrap>
            <Eyebrow>The stages</Eyebrow>
            <h2
              id="process-stages-heading"
              className={cn("mt-5 text-[32px] tracking-[-0.02em] lg:text-[40px]", INK)}
            >
              What happens, in order
            </h2>
            <ol className="relative mt-16">
              <span
                aria-hidden="true"
                className="absolute top-0 bottom-0 left-4 w-px bg-[#d8dae3]"
              />
              {STAGES.map((s, i) => (
                <li key={s.n} className="relative min-w-0 pb-14 pl-10 sm:pl-14">
                  <span
                    aria-hidden="true"
                    className="absolute top-3 left-4 size-3.5 -translate-x-1/2 rounded-full bg-[#3b5bdb] ring-4 ring-[#dbe2ff]"
                  />
                  <Reveal className="grid gap-8 rounded-md bg-white p-5 sm:p-8 lg:grid-cols-[1fr_1fr] lg:gap-12 [&>*]:min-w-0">
                    <div>
                      <p className="flex items-baseline gap-4">
                        <span className={cn("text-[30px] tracking-[-0.02em]", BLUE)}>
                          {s.n}
                        </span>
                        <span className="rounded-full bg-[#eef1ff] px-2.5 py-0.5 text-[12px] font-semibold text-[#3b5bdb]">
                          {s.duration}
                        </span>
                      </p>
                      <h3
                        className={cn(
                          "mt-3 text-[26px] leading-tight tracking-[-0.01em]",
                          INK,
                        )}
                      >
                        {s.name}
                      </h3>
                      <p className="mt-4 text-[15px] leading-[1.65] text-[#4a4f57]">
                        {s.what}
                      </p>
                      <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <div>
                          <h4 className={cn("text-[13px] font-semibold", INK)}>
                            You receive
                          </h4>
                          <ul className="mt-3 flex flex-col gap-2">
                            {s.deliver.map((d) => (
                              <li
                                key={d}
                                className="flex gap-2 text-[14px] leading-snug text-[#2f3238]"
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#3b5bdb]"
                                />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className={cn("text-[13px] font-semibold", INK)}>
                            We need from you
                          </h4>
                          <ul className="mt-3 flex flex-col gap-2">
                            {s.need.map((d) => (
                              <li
                                key={d}
                                className="flex gap-2 text-[14px] leading-snug text-[#6b7079]"
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#c4c7cc]"
                                />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex min-w-0 items-center overflow-hidden rounded-md bg-[linear-gradient(135deg,#e8ecff,#f6f7fb)] p-3 sm:p-5">
                      {VISUALS[i] ?? <PageMap />}
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Wrap>
        </div>
      </section>

      {/* Principles (the reference's team list style) */}
      <section
        aria-labelledby="process-principles-heading"
        className="bg-white py-24 lg:py-32"
      >
        <Wrap>
          <Eyebrow center>How we work</Eyebrow>
          <h2
            id="process-principles-heading"
            className={cn(
              serif.className,
              "mt-8 text-[52px] leading-[1.02] tracking-[-0.035em] text-[#3a3a3a] sm:text-[80px] lg:text-[110px]",
            )}
          >
            <span className="block">Four Things</span>
            <span className="block text-right">That Cost Us</span>
            <span className="block">Money.</span>
          </h2>
          <ul className="mt-14 lg:ml-[30%]">
            {PRINCIPLES.map(([t, d]) => (
              <li
                key={t}
                className="grid gap-2 border-t border-[#e3e4e8] py-5 sm:grid-cols-[1fr_1.1fr] sm:gap-8"
              >
                <span
                  className={cn(
                    serif.className,
                    "text-[30px] leading-tight tracking-[-0.02em] sm:text-[38px]",
                    INK,
                  )}
                >
                  {t}
                </span>
                <span className="text-[15px] leading-[1.6] text-[#4a4f57] sm:pt-2">
                  {d}
                </span>
              </li>
            ))}
          </ul>
        </Wrap>
      </section>

      {/* Where it's used */}
      <section
        aria-labelledby="process-used-heading"
        className="bg-white pb-24 text-center lg:pb-28"
      >
        <Wrap>
          <Eyebrow center>Where this process gets used</Eyebrow>
          <h2
            id="process-used-heading"
            className={cn(
              "mx-auto mt-5 max-w-[620px] text-[30px] leading-[1.15] tracking-[-0.02em] lg:text-[34px]",
              INK,
            )}
          >
            The same five stages run every project we take on.
          </h2>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              ["Website design", "/website-design"],
              ["Web development", "/website-development"],
              ["AI agents", "/ai-agents"],
              ["Automations", "/automations"],
              ["About Serverlys", "/about"],
            ].map(([l, h]) => (
              <li key={h}>
                <Link
                  href={h}
                  className="inline-flex rounded-md bg-[#f1f2f5] px-3.5 py-2 text-[14px] font-medium text-[#0b1530] hover:bg-[#eef1ff] hover:text-[#3b5bdb]"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </Wrap>
      </section>

      <Faqs id="process-faq-heading" items={FAQS} />
      <PhotoCta
        id="process-cta-heading"
        photo={{
          src: "/mock/webdev-cta.jpg",
          alt: "A business owner on the phone while working at her laptop",
          position: "60% 40%",
        }}
        thumb="/mock/design-wireframe.jpg"
        title="Start with a scope"
        body="Tell us what it has to do. You get a written scope, a fixed price or an honest range, and a date."
        primary={{ label: "Start a project", href: billing.sales }}
      />
    </>
  );
}

/** Stage 02 visual: a page map, the deliverable of Structure. */
function PageMap() {
  const pages = [
    ["Home", "Book or call"],
    ["Services", "Pick a service"],
    ["Service areas", "Find us nearby"],
    ["About", "Trust the team"],
    ["Contact", "Send a request"],
  ];
  return (
    <div
      aria-hidden="true"
      className="w-full rounded-xl bg-white p-4 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.25)]"
    >
      <p className="text-[9.5px] font-semibold tracking-[0.14em] text-[#3b5bdb] uppercase">
        Page map · v1
      </p>
      <div className="mt-3 flex justify-center">
        <span className="rounded-md bg-[#0b1530] px-3 py-1.5 text-[11px] font-semibold text-white">
          Home
        </span>
      </div>
      <div className="mx-auto mt-2 h-3 w-px bg-[#c4c7cc]" />
      <div className="grid grid-cols-2 gap-2">
        {pages.slice(1).map(([p, goal]) => (
          <div
            key={p}
            className="rounded-lg bg-[#f6f7f9] p-2.5 ring-1 ring-black/[0.05]"
          >
            <p className="text-[11.5px] font-semibold text-[#202124]">{p}</p>
            <p className="text-[10px] text-[#5f6368]">Goal: {goal}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-lg bg-[#eef1ff] p-2 text-[10.5px] text-[#3b5bdb]">
        Every page has one job. Agreed before design starts.
      </p>
    </div>
  );
}
