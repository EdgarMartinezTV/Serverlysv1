import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Band, Heading, Pill, Stage, Tick } from "../hosting/_components/band";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, breadcrumbGraph, faqGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";
import { billing } from "@/data/company";

const PATH = "/hosting-alternatives";

export const metadata = pageMetadata({
  title: "Hosting Comparison — how the four tiers differ",
  description:
    "Shared, cloud, VPS and dedicated compared on the things that decide the choice, plus the questions to ask any hosting company before you pay.",
  path: PATH,
});

/**
 * Hosting comparison.
 *
 * DELIBERATELY NOT a competitor teardown. Pages that name rivals and score
 * them out of ten are marketing dressed as research: the author picks the
 * criteria, and the author always wins. It would also require us to publish
 * claims about other companies' current products that we cannot verify and
 * that go stale within a quarter.
 *
 * What is useful and honest is comparing the TYPES of hosting on the axes that
 * actually decide the purchase, and then handing over the questions that let
 * someone evaluate any provider — including us — for themselves.
 */
const AXES = [
  {
    axis: "What you share",
    shared: "CPU and memory with other sites",
    cloud: "A resource pool, allocated dynamically",
    vps: "Nothing — a guaranteed slice",
    dedicated: "Nothing — the whole machine",
  },
  {
    axis: "System access",
    shared: "Control panel only",
    cloud: "Control panel only",
    vps: "Full root",
    dedicated: "Full root",
  },
  {
    axis: "Behaviour under a spike",
    shared: "Slows, and can hit a limit",
    cloud: "Absorbs it from the pool",
    vps: "Fixed ceiling — resize to change it",
    dedicated: "Fixed ceiling — add hardware",
  },
  {
    axis: "Who patches it",
    shared: "Us, always",
    cloud: "Us, always",
    vps: "You, or us if managed",
    dedicated: "You, or us if managed",
  },
  {
    axis: "Scaling",
    shared: "Upgrade the plan",
    cloud: "Elastic within the tier",
    vps: "Resize, prorated",
    dedicated: "Provision another machine",
  },
  {
    axis: "Best when",
    shared: "Traffic is modest and predictable",
    cloud: "Downtime costs money",
    vps: "The app needs system control",
    dedicated: "Load is heavy and constant",
  },
] as const;

const QUESTIONS = [
  {
    q: "What is the renewal rate for this exact plan?",
    why: "The introductory price is promotional. The renewal rate is what you pay from then on, and it is the number that decides the comparison.",
  },
  {
    q: "What does it cost to restore a backup?",
    why: "A backup you must pay to use is an insurance policy with an excess, sold at the worst possible moment.",
  },
  {
    q: "Is migration included, and who does it?",
    why: "'Free migration tool' and 'we migrate it for you' are very different products with the same label.",
  },
  {
    q: "What happens when I hit a resource limit?",
    why: "Ask specifically: throttled, suspended, or billed. All three exist in this industry and only one is survivable mid-campaign.",
  },
  {
    q: "Can I get my files and database out?",
    why: "Ask before you need it. The answer tells you how the relationship ends, which tells you how it will be conducted.",
  },
  {
    q: "Is support a person, and is it included at my tier?",
    why: "Priority queues mean there is a slow queue. Find out which one you bought.",
  },
] as const;

const FAQS: readonly Faq[] = [
  {
    question: "Why does this page not compare Serverlys to named competitors?",
    answer:
      "Because we would be choosing the criteria and grading ourselves, which is advertising rather than comparison. It would also mean publishing claims about other companies' current pricing and features that we cannot verify and that go out of date quickly. The questions further down this page let you compare anyone, including us, on facts you can check yourself.",
    scopes: [PATH],
  },
  {
    question: "Is more expensive hosting faster?",
    answer:
      "Not reliably. Beyond a certain point the bottleneck moves to your site — oversized images, uncached database queries, too much JavaScript — and no amount of extra CPU fixes that. Measure where the time actually goes before you buy a bigger plan.",
    scopes: [PATH],
  },
  {
    question: "How do I know when I have outgrown my plan?",
    answer:
      "Response times climbing at your daily traffic peak, resource limits you have started checking, or the point where an hour of downtime costs more than a year of the upgrade. That last one is the real test — the others are symptoms.",
    scopes: [PATH],
  },
];

export default function HostingAlternativesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Hosting comparison", path: PATH },
        ])}
      />
      <JsonLd data={faqGraph(FAQS)} />

      {/* Hero: light, copy left, a coded tier picker right (2026-10-03). */}
      <section className="relative isolate overflow-hidden bg-canvas">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]" />
        <Container width="wide" className="pb-16 pt-6 sm:pb-20 lg:pb-24 lg:pt-10">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Resources", href: "/resources" },
              { name: "Hosting comparison" },
            ]}
            tone="light"
          />
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div>
              <Pill>Hosting comparison</Pill>
              <h1 className="display-lg mt-5 text-fg">How the tiers differ, and how to judge a host</h1>
              <p className="mt-5 max-w-xl text-body-lg text-fg-secondary">
                No scores out of ten and no rivals named. Just the axes that decide which kind of
                hosting you need, and the six questions that tell you what any provider is selling.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="#ha-matrix-heading" size="lg">Compare the four types</Button>
                <Button href="#ha-questions-heading" variant="outline" size="lg">See the six questions</Button>
              </div>
            </div>
            <Stage>
              <div aria-hidden="true" className="rounded-2xl bg-white p-5 sm:p-6">
                <p className="text-small font-semibold text-fg">Which tier fits harbourgoods.com?</p>
                <p className="mt-1 text-micro text-fg-muted">WooCommerce · ~40,000 visits a month · traffic spikes on launches</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {(
                    [
                      ["Shared", "Throttles during spikes", 38, false],
                      ["Cloud", "Absorbs the launch-day spike", 92, true],
                      ["VPS", "Works, but someone has to run it", 64, false],
                      ["Dedicated", "More machine than this needs", 41, false],
                    ] as const
                  ).map(([tier, why, fit, best]) => (
                    <li key={tier} className={`rounded-xl p-3.5 ${best ? "bg-brand-50 ring-2 ring-primary" : "bg-canvas-secondary"}`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-small font-semibold text-fg">{tier}</span>
                        {best ? <Pill>Best fit</Pill> : <span className="text-micro text-fg-muted">{fit}% fit</span>}
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                        <span style={{ width: `${fit}%` }} className={`block h-full rounded-full ${best ? "bg-primary" : "bg-brand-200"}`} />
                      </div>
                      <p className="mt-1.5 text-micro text-fg-secondary">{why}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Stage>
          </div>
        </Container>
      </section>

      {/* The matrix. A real table, scrollable inside its own container. */}
      <Band tone="subtle" labelledBy="ha-matrix-heading">
        <Heading
          id="ha-matrix-heading"
          title="Compared on what actually matters"
          lede="Not on storage numbers. On isolation, access, and what happens when things get busy."
        />
        <div className="mt-12 overflow-x-auto rounded-3xl bg-canvas ring-1 ring-line">
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <caption className="sr-only">
              Shared, cloud, VPS and dedicated hosting compared across six axes
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-6 py-5">
                  <span className="sr-only">Axis</span>
                </th>
                {(
                  [
                    ["Shared", "/shared-hosting", false],
                    ["Cloud", "/cloud-hosting", true],
                    ["VPS", "/vps-hosting", false],
                    ["Dedicated", "/dedicated-servers", false],
                  ] as const
                ).map(([label, href, live]) => (
                  <th key={label} scope="col" className={`px-6 py-5 ${live ? "bg-brand-50" : ""}`}>
                    <Link
                      href={href}
                      className="inline-flex min-h-6 items-center text-body-lg font-semibold text-fg hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {label}
                    </Link>
                    <span className="mt-1 block">
                      <Pill tone={live ? "success" : "warning"}>{live ? "Available now" : "Soon"}</Pill>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle">
              {AXES.map((row) => (
                <tr key={row.axis}>
                  <th scope="row" className="px-6 py-4 align-top text-small font-semibold text-fg">
                    {row.axis}
                  </th>
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.shared}</td>
                  <td className="bg-brand-50/60 px-6 py-4 align-top text-small text-fg">{row.cloud}</td>
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.vps}</td>
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.dedicated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-center text-small text-fg-secondary">
          Managed and unmanaged is a separate axis from all of this. See{" "}
          <Link href="/managed-hosting" className="font-semibold text-primary hover:text-primary-hover">
            managed hosting
          </Link>
          .
        </p>
      </Band>

      {/* The questions. The portable part of the page. */}
      <Band tone="dark" labelledBy="ha-questions-heading">
        <Heading
          id="ha-questions-heading"
          dark
          title="Six questions worth asking before you pay"
          lede="Ask us these too. A provider that cannot answer all six in one reply has told you something."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {QUESTIONS.map((item, i) => (
            <li key={item.q} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-small font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 text-body-lg font-medium text-white">{item.q}</h3>
              <p className="mt-2 text-small text-fg-on-dark-secondary">{item.why}</p>
            </li>
          ))}
        </ol>
      </Band>

      {/* Our own answers, since we just told you to ask. */}
      <Band labelledBy="ha-answers-heading">
        <Heading
          id="ha-answers-heading"
          title="Since we told you to ask"
          lede="It would be poor form to publish that list and not answer it ourselves."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Renewal rate", "Published next to the introductory rate on every plan, before checkout."],
            ["Backup restores", "Free. Any daily restore point, and we do it for you."],
            ["Migration", "Free, and we do it: staged first, DNS only when you approve."],
            ["Resource limits", "Shown in your control panel, so you see headroom rather than discover a ceiling."],
            ["Getting your data out", "Your files and database are yours. Ask and you get them."],
            ["Support", "One queue, one team, every plan. There is no priority tier to buy."],
          ].map(([t, d]) => (
            <li key={t} className="rounded-2xl bg-canvas-secondary p-6">
              <span className="flex items-center gap-2.5">
                <Tick />
                <span className="text-body-lg font-semibold text-fg">{t}</span>
              </span>
              <p className="mt-3 text-small text-fg-secondary">{d}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/pricing">See the prices and renewals</Button>
          <Button href={billing.sales} variant="outline">
            Ask us anything on that list
          </Button>
        </div>
      </Band>

      <FaqSection items={FAQS} />
      <FinalCta />
    </>
  );
}
