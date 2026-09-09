import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { RackMock } from "@/components/product-ui/infra";
import { billing } from "@/data/company";
import { pageMetadata, breadcrumbGraph, faqGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";

const PATH = "/dedicated-servers";

export const metadata = pageMetadata({
  title: "Dedicated Servers — the whole machine | Serverlys",
  description:
    "Single-tenant hardware for sustained load, predictable I/O and compliance requirements that forbid shared tenancy. Specified to your workload, quoted, then built.",
  path: PATH,
});

/**
 * Dedicated servers.
 *
 * Architecture is a QUOTE page, because that is how dedicated hardware is
 * actually bought. There is no self-serve checkout: the specification depends
 * on the workload, so the page's job is to establish who this is for, what
 * gets decided, and what the procurement looks like — then hand over to a
 * conversation. Anything else would be a fake buy button.
 */
const FAQS: readonly Faq[] = [
  {
    question: "Why choose dedicated over a large VPS?",
    answer:
      "Three reasons, and if none apply a VPS is the better buy. Sustained heavy load, where you are paying for the peak anyway. Predictable disk and network I/O, which virtualisation cannot guarantee. And compliance or contractual requirements that forbid shared tenancy outright.",
    scopes: [PATH],
  },
  {
    question: "How long does provisioning take?",
    answer:
      "Longer than a VPS, because it is physical. The specification has to be agreed, the hardware allocated and the operating system built. We give you a date when we quote rather than an estimate on a marketing page.",
    scopes: [PATH],
  },
  {
    question: "Is it managed?",
    answer:
      "It can be. Managed means we handle the operating system, patching, hardening, monitoring and backups on your hardware, and you keep root. Unmanaged means the machine is yours from the operating system up. Decide this before you order, not after.",
    scopes: [PATH],
  },
  {
    question: "What happens when I need more capacity?",
    answer:
      "Dedicated hardware does not scale elastically — that is its honest limitation. Growing means adding another machine or moving the workload. If your load varies a lot rather than being consistently heavy, cloud hosting is a better shape for it.",
    scopes: [PATH],
  },
];

export default function DedicatedServersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Hosting", path: "/hosting" },
          { name: "Dedicated servers", path: PATH },
        ])}
      />
      <JsonLd data={faqGraph(FAQS)} />

      <ProductHero
        eyebrow="Dedicated servers"
        title="One tenant. The whole machine."
        lede="Single-tenant hardware for workloads that are heavy all the time, need predictable I/O, or sit under a compliance rule that forbids sharing a box."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Hosting", href: "/hosting" },
          { name: "Dedicated servers" },
        ]}
        specs={[
          { label: "Tenancy", value: "Single" },
          { label: "Hardware", value: "Specified" },
          { label: "Storage", value: "NVMe RAID" },
          { label: "Pricing", value: "Quoted" },
        ]}
        primary={{ label: "Request a specification", href: "/contact" }}
        secondary={{ label: "Compare the tiers", href: "/hosting-alternatives" }}
        visual={<RackMock />}
      />

      {/* Qualify hard and early. This tier is wrong for most visitors. */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          <SectionHeader
            eyebrow="Who this is for"
            title="Three reasons to take a whole machine"
            lede="If none of these describe you, a VPS or cloud plan will do the same job for less. We will tell you that on the call."
          />
          <ol className="flex flex-col divide-y divide-line border-t border-line">
            {[
              [
                "The load is heavy and constant",
                "Not spiky — constant. When you are paying for peak capacity around the clock anyway, owning the peak is cheaper than renting it.",
              ],
              [
                "I/O has to be predictable",
                "Database-heavy workloads feel virtualised storage. On single-tenant hardware the disk and the network belong to you, and the numbers stop moving.",
              ],
              [
                "Shared tenancy is not permitted",
                "Some contracts, audits and regulatory regimes require it. That is a requirement, not a preference, and no amount of isolation on a shared host satisfies it.",
              ],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-5 py-6">
                <span aria-hidden="true" className="font-mono text-small text-fg-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-body-lg font-semibold text-fg">{t}</h3>
                  <p className="mt-2 max-w-[62ch] text-body text-fg-secondary">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* What gets decided — a spec sheet, because that is the artefact. */}
      <Section surface="dark">
        <SectionHeader
          eyebrow="The specification"
          tone="dark"
          title="What we agree before anything is built"
          lede="Every line here is a decision with a cost and a consequence. We go through them with you rather than publishing a configurator that guesses."
        />
        <dl className="mt-12 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Processor", "Core count against clock speed. Databases and PHP want different answers."],
            ["Memory", "Sized to the working set, with headroom for the cache you will add later."],
            ["Storage", "NVMe capacity and the RAID level. Redundancy is a choice, not a default."],
            ["Network", "Port speed and monthly transfer, sized to real peaks rather than averages."],
            ["Operating system", "Distribution and version, and who patches it."],
            ["Management", "Managed or unmanaged, decided in writing before provisioning."],
            ["Backups", "Destination, retention and how a restore is tested."],
            ["Monitoring", "What is watched, what pages someone, and at what threshold."],
            ["Access", "Who holds root, how they authenticate, and what happens when they leave."],
          ].map(([t, d]) => (
            <div key={t} className="bg-canvas-dark p-6">
              <dt className="text-body font-semibold text-white">{t}</dt>
              <dd className="mt-2 text-small text-fg-on-dark-secondary">{d}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Procurement timeline. Honest about the fact that this is not instant. */}
      <Section surface="subtle">
        <SectionHeader
          eyebrow="How it is bought"
          title="No checkout button, on purpose"
          lede="Dedicated hardware is specified, quoted and built. A one-click order for a machine nobody has sized is how people end up with the wrong one."
        />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl bg-line md:grid-cols-4">
          {[
            ["Tell us the workload", "What it runs, how heavy, and what the constraint is."],
            ["We specify it", "A written configuration with the reasoning for each choice."],
            ["You get a quote", "Monthly cost, provisioning date, and what is included."],
            ["We build and migrate", "Hardware allocated, OS built, your site moved and checked."],
          ].map(([t, d], i) => (
            <li key={t} className="flex flex-col gap-2 bg-canvas p-6">
              <span className="font-mono text-caption text-fg-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-body-lg font-semibold text-fg">{t}</h3>
              <p className="text-small text-fg-secondary">{d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-2xl bg-canvas p-8 ring-1 ring-inset ring-line sm:flex-row sm:items-center">
          <div>
            <h3 className="text-h4 text-fg">Start with the workload, not the hardware</h3>
            <p className="mt-2 max-w-2xl text-body text-fg-secondary">
              Tell us what it does and where it hurts today. If a{" "}
              <Link href="/vps-hosting" className="font-medium text-primary hover:text-primary-hover">
                VPS
              </Link>{" "}
              or{" "}
              <Link href="/cloud-hosting" className="font-medium text-primary hover:text-primary-hover">
                cloud plan
              </Link>{" "}
              would do the same job, we will say so.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href="/contact">Request a specification</Button>
            <Button href={billing.sales} variant="secondary" external>
              Open a sales ticket
            </Button>
          </div>
        </div>
      </Section>

      <FaqSection items={FAQS} />
      <FinalCta />
    </>
  );
}
