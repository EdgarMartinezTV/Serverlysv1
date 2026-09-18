import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/section";
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

      <section className="relative isolate overflow-hidden bg-canvas-abyss">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_25%_-5%,rgb(34_126_255/0.3)_0%,transparent_68%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />
        <Container className="relative pb-16 pt-8 sm:pb-20 sm:pt-10">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Resources", href: "/resources" },
              { name: "Hosting comparison" },
            ]}
            tone="dark"
          />
          <div className="mt-10 max-w-2xl">
            <span className="font-mono text-caption uppercase text-accent-on-dark">
              Comparison
            </span>
            <h1 className="mt-4 text-h1 text-white">
              How the tiers differ, and how to judge a host
            </h1>
            <p className="mt-5 text-body-lg text-fg-on-dark-secondary">
              No scores out of ten and no rivals named. Just the axes that
              decide which kind of hosting you need, and the six questions that
              tell you what any provider is really selling.
            </p>
          </div>
        </Container>
      </section>

      {/* The matrix. A real table, scrollable inside its own container. */}
      <Section>
        <SectionHeader
          eyebrow="The four types"
          title="Compared on what actually matters"
          lede="Not on storage numbers. On isolation, access, and what happens when things get busy."
        />
        <div className="mt-12 overflow-x-auto rounded-xl ring-1 ring-inset ring-line">
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <caption className="sr-only">
              Shared, cloud, VPS and dedicated hosting compared across six axes
            </caption>
            <thead>
              <tr className="bg-canvas-secondary">
                <th scope="col" className="px-6 py-4 font-mono text-caption uppercase tracking-wider text-fg-muted">
                  &nbsp;
                </th>
                {[
                  ["Shared", "/shared-hosting"],
                  ["Cloud", "/cloud-hosting"],
                  ["VPS", "/vps-hosting"],
                  ["Dedicated", "/dedicated-servers"],
                ].map(([label, href]) => (
                  <th key={label} scope="col" className="px-6 py-4">
                    <Link
                      href={href}
                      className="inline-flex min-h-6 items-center text-body font-semibold text-fg hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {label}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {AXES.map((row) => (
                <tr key={row.axis}>
                  <th scope="row" className="bg-canvas-secondary px-6 py-4 align-top text-small font-semibold text-fg">
                    {row.axis}
                  </th>
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.shared}</td>
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.cloud}</td>
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.vps}</td>
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.dedicated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-small text-fg-muted">
          Managed and unmanaged is a separate axis from all of this — see{" "}
          <Link href="/managed-hosting" className="font-medium text-primary hover:text-primary-hover">
            managed hosting
          </Link>
          .
        </p>
      </Section>

      {/* The questions. The genuinely portable part of the page. */}
      <Section surface="dark">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          <SectionHeader
            eyebrow="Evaluate anyone"
            tone="dark"
            title="Six questions worth asking before you pay"
            lede="Ask us these too. A provider that cannot answer all six in one reply has told you something."
          />
          <ol className="flex flex-col divide-y divide-white/10 border-t border-white/10">
            {QUESTIONS.map((item, i) => (
              <li key={item.q} className="flex gap-5 py-6">
                <span aria-hidden="true" className="font-mono text-small text-fg-on-dark-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-body-lg font-semibold text-white">{item.q}</h3>
                  <p className="mt-2 max-w-[60ch] text-small text-fg-on-dark-secondary">
                    {item.why}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Our own answers, since we just told you to ask. */}
      <Section surface="subtle">
        <SectionHeader
          eyebrow="Our answers"
          title="Since we told you to ask"
          lede="It would be poor form to publish that list and not answer it ourselves."
        />
        <dl className="mt-12 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Renewal rate", "Published next to the introductory rate on every plan, before checkout."],
            ["Backup restores", "Free. Any daily restore point, and we do it for you."],
            ["Migration", "Free, and we do it — staged first, DNS only when you approve."],
            ["Resource limits", "Shown in your control panel so you can see headroom rather than discover a ceiling."],
            ["Getting your data out", "Your files and database are yours. Ask and you get them."],
            ["Support", "One queue, one team, every plan. There is no priority tier to buy."],
          ].map(([t, d]) => (
            <div key={t} className="bg-canvas p-7">
              <dt className="text-body-lg font-semibold text-fg">{t}</dt>
              <dd className="mt-2 text-small text-fg-secondary">{d}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/pricing">See the prices and renewals</Button>
          <Button href={billing.sales} variant="secondary">
            Ask us anything on that list
          </Button>
        </div>
      </Section>

      <FaqSection items={FAQS} />
      <FinalCta />
    </>
  );
}
