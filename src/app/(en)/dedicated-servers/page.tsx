import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Band, Heading, Pill } from "../hosting/_components/band";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { RackMock } from "@/components/product-ui/infra";
import { billing } from "@/data/company";
import { pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";

const PATH = "/dedicated-servers";

export const metadata = pageMetadata({
  title: "Dedicated Servers — the whole machine | Serverlys",
  description:
    "Single-tenant hardware for sustained load, predictable I/O and compliance rules that forbid shared tenancy. Specified to your workload, quoted, then built.",
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
      <JsonLd data={faqGraph(FAQS, "/dedicated-servers")} />
      <JsonLd
        data={serviceGraph({
          name: "Serverlys Dedicated Servers",
          serviceType: "Dedicated server hosting",
          description: String(metadata.description ?? ""),
          path: PATH,
        })}
      />

      <ProductHero
        eyebrow="Dedicated servers · by request"
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
        primary={{ label: "Request a specification", href: billing.sales }}
        secondary={{ label: "Compare the tiers", href: "/hosting-alternatives" }}
        visual={<RackMock />}
      />

      {/* Qualify hard and early. This tier is wrong for most visitors. */}
      <Band labelledBy="ded-who-heading">
        <Heading
          id="ded-who-heading"
          title="Three reasons to take a whole machine"
          lede="If none of these describe you, a VPS or cloud plan will do the same job for less. We will tell you that on the call."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {(
            [
              ["The load is heavy and constant", "Not spiky, constant. When you pay for peak capacity around the clock anyway, owning the peak is cheaper than renting it.", "CPU · 30 days", [72, 78, 74, 81, 77, 83, 79, 85, 80, 84]],
              ["I/O has to be predictable", "Database-heavy workloads feel virtualised storage. On single-tenant hardware the disk and network are yours, and the numbers stop moving.", "Disk latency", [22, 21, 23, 22, 22, 21, 22, 23, 22, 21]],
              ["Shared tenancy is not permitted", "Some contracts, audits and regulatory regimes require it. That is a requirement, not a preference.", "Tenants on host", [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]],
            ] as const
          ).map(([t, d, metric, bars]) => (
            <li key={t} className="flex flex-col overflow-hidden rounded-3xl bg-canvas-secondary">
              <div aria-hidden="true" className="relative bg-brand-50 p-5">
                <div className="rounded-xl bg-white p-4 shadow-e2">
                  <p className="flex items-center justify-between text-micro">
                    <span className="text-fg-secondary">{metric}</span>
                    <span className="font-semibold text-fg">
                      {metric === "Tenants on host" ? "1" : metric === "Disk latency" ? "0.22 ms" : "81%"}
                    </span>
                  </p>
                  <div className="mt-3 flex h-14 items-end gap-1">
                    {bars.map((h, i) => (
                      <span key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-sm ${i === bars.length - 1 ? "bg-primary" : "bg-brand-200"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-body-lg font-semibold text-fg">{t}</h3>
                <p className="mt-2 text-small text-fg-secondary">{d}</p>
              </div>
            </li>
          ))}
        </ul>
      </Band>

      {/* What gets decided: a spec sheet, because that is the artefact. */}
      <Band tone="dark" labelledBy="ded-spec-heading">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Heading
              id="ded-spec-heading"
              dark
              align="left"
              title="What we agree before anything is built"
              lede="Every line is a decision with a cost and a consequence. We go through them with you rather than publishing a configurator that guesses."
            />
            <ul className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {[
                ["Processor", "Core count against clock speed."],
                ["Memory", "Sized to the working set, with headroom."],
                ["Storage", "NVMe capacity and the RAID level."],
                ["Network", "Port speed and transfer, sized to real peaks."],
                ["Operating system", "Distribution, version, and who patches it."],
                ["Management", "Managed or not, decided in writing."],
                ["Backups", "Destination, retention, tested restores."],
                ["Access", "Who holds root, and what happens when they leave."],
              ].map(([t, d]) => (
                <li key={t} className="border-t border-white/15 pt-3">
                  <p className="text-body font-medium text-white">{t}</p>
                  <p className="mt-1 text-small text-fg-on-dark-secondary">{d}</p>
                </li>
              ))}
            </ul>
          </div>
          {/* An example specification sheet, as it would be sent. */}
          <div aria-hidden="true" className="rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 sm:p-8">
            <div className="rounded-2xl bg-white p-6 shadow-e5">
              <div className="flex items-center justify-between border-b border-line-subtle pb-4">
                <span>
                  <span className="block text-small font-semibold text-fg">Specification · draft 2</span>
                  <span className="text-micro text-fg-muted">Harbor Goods · order database</span>
                </span>
                <Pill tone="warning">Awaiting approval</Pill>
              </div>
              <dl className="mt-4 divide-y divide-line-subtle text-small">
                {[
                  ["Processor", "16 cores · 3.4 GHz"],
                  ["Memory", "128 GB ECC"],
                  ["Storage", "2 × 3.84 TB NVMe · RAID 1"],
                  ["Network", "1 Gbps · 20 TB transfer"],
                  ["Operating system", "Ubuntu 24.04 LTS"],
                  ["Management", "Managed · you keep root"],
                  ["Backups", "Nightly · 30-day retention"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-fg-secondary">{k}</dt>
                    <dd className="text-right font-medium text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-micro text-primary">
                Example only. Every specification is quoted for the workload in front of us.
              </p>
            </div>
          </div>
        </div>
      </Band>

      {/* Procurement: a real sequence, so it keeps its numbers. */}
      <Band tone="subtle" labelledBy="ded-buy-heading">
        <Heading
          id="ded-buy-heading"
          title="No checkout button, on purpose"
          lede="Dedicated hardware is specified, quoted and built. A one-click order for a machine nobody has sized is how people end up with the wrong one."
        />
        <ol className="relative mt-12 grid gap-4 md:grid-cols-4">
          <span aria-hidden="true" className="absolute top-9 right-[12%] left-[12%] hidden h-px bg-brand-200 md:block" />
          {[
            ["Tell us the workload", "What it runs, how heavy, and what the constraint is."],
            ["We specify it", "A written configuration with the reasoning for each choice."],
            ["You get a quote", "Monthly cost, provisioning date, and what is included."],
            ["We build and migrate", "Hardware allocated, OS built, your site moved and checked."],
          ].map(([t, d], i) => (
            <li key={t} className="relative flex flex-col rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary text-micro font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 text-body-lg font-semibold text-fg">{t}</h3>
              <p className="mt-2 text-small text-fg-secondary">{d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-2xl bg-[linear-gradient(90deg,var(--color-brand-950)_0%,var(--color-brand-700)_55%,var(--color-brand-500)_100%)] p-8 sm:flex-row sm:items-center sm:px-10">
          <div>
            <h3 className="text-h4 text-white">Start with the workload, not the hardware</h3>
            <p className="mt-2 max-w-2xl text-body text-fg-on-brand-muted">
              Tell us what it does and where it hurts today. If a{" "}
              <Link href="/vps-hosting" className="font-semibold text-white underline underline-offset-2">
                VPS
              </Link>{" "}
              or{" "}
              <Link href="/cloud-hosting" className="font-semibold text-white underline underline-offset-2">
                cloud plan
              </Link>{" "}
              would do the same job, we will say so.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href={billing.sales} variant="inverse">Request a specification</Button>
            <Button href={billing.sales} variant="onBrand" external>
              Open a sales ticket
            </Button>
          </div>
        </div>
      </Band>

      <FaqSection items={FAQS} />
      <FinalCta />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
