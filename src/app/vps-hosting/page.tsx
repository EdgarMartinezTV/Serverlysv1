import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Band, Heading, Pill } from "../hosting/_components/band";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { JsonLd } from "@/components/ui/json-ld";
import { TerminalMock, ResponsibilityMock } from "@/components/product-ui/infra";
import { billing } from "@/data/company";
import { pageMetadata, breadcrumbGraph, faqGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";

const PATH = "/vps-hosting";

export const metadata = pageMetadata({
  title: "VPS Hosting — root access and a guaranteed slice | Serverlys",
  description:
    "A virtual private server with root, guaranteed CPU and memory, and your own system packages. Managed or unmanaged, with the difference stated plainly.",
  path: PATH,
});

/**
 * VPS.
 *
 * Architecture is a CAPABILITY page: the reason to buy a VPS is that you can
 * do things the shared tier forbids, so the page leads with a shell and then
 * answers the question that actually decides the purchase — who administers
 * it. An unmanaged VPS sold to someone who cannot run one is the most common
 * bad sale in this industry.
 */
const FAQS: readonly Faq[] = [
  {
    question: "What is the difference between a VPS and shared hosting?",
    answer:
      "On shared hosting you get a slice of a server's resources that flexes with what your neighbours are doing, and no system-level access. On a VPS the slice is guaranteed and you get root, so you can install packages, choose runtime versions and run background processes. You are also responsible for keeping it patched unless you buy it managed.",
    scopes: [PATH],
  },
  {
    question: "Managed or unmanaged — which do I need?",
    answer:
      "If nobody in your organisation is going to apply security updates, read a system log or restart a service at an inconvenient hour, buy it managed. Unmanaged is genuinely cheaper and genuinely a server administration job. There is no shame in either answer; there is real risk in choosing wrong.",
    scopes: [PATH],
  },
  {
    question: "Can I run Node, Python or a background worker?",
    answer:
      "Yes. That is most of the reason to move to a VPS. You choose the runtime and version, you can run queues, cron jobs and long-lived processes, and you can install whatever the application needs.",
    scopes: [PATH],
  },
  {
    question: "What happens if I get the sizing wrong?",
    answer:
      "You resize. Moving between VPS sizes is a resource change rather than a migration, and billing is prorated to your cycle. Start smaller than you think and watch the numbers for a fortnight.",
    scopes: [PATH],
  },
];

export default function VpsHostingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Hosting", path: "/hosting" },
          { name: "VPS hosting", path: PATH },
        ])}
      />
      <JsonLd data={faqGraph(FAQS)} />

      <ProductHero
        eyebrow="VPS hosting · coming soon"
        title="Root access, and a slice that is actually yours"
        lede="A guaranteed allocation of CPU, memory and NVMe, with full system access. Install what the application needs instead of asking whether you are allowed to."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Hosting", href: "/hosting" },
          { name: "VPS hosting" },
        ]}
        specs={[
          { label: "Access", value: "Full root" },
          { label: "Resources", value: "Guaranteed" },
          { label: "Storage", value: "NVMe" },
          { label: "Admin", value: "Managed or not" },
        ]}
        primary={{ label: "Talk to us about sizing", href: billing.sales }}
        secondary={{ label: "Compare the tiers", href: "/hosting-alternatives" }}
        visual={<TerminalMock />}
      />

      {/* What root buys you, in plain terms. */}
      <Band labelledBy="vps-cap-heading">
        <Heading
          id="vps-cap-heading"
          title="The things shared hosting will not let you do"
          lede="This is the whole reason the tier exists. If none of it applies to you, save the money and stay where you are."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Choose your runtime", "A specific Node, Python, Ruby or PHP version, held there while the rest of the world moves.", "$ nvm use 20.11"],
              ["Install system packages", "Image libraries, a headless browser, a search engine, a message broker.", "$ apt install imagemagick"],
              ["Run background work", "Queues, workers and schedulers, instead of hoping a web request finishes in time.", "$ systemctl start worker"],
              ["Tune the web server", "Your own nginx or Apache config, cache rules and limits.", "$ nginx -t && reload"],
              ["Guaranteed resources", "The allocation is reserved. A neighbour's spike is not your problem.", "4 vCPU · 8 GB reserved"],
              ["Your own firewall", "Ports, rules and access policy set the way your security review wants.", "$ ufw allow 443/tcp"],
            ] as const
          ).map(([t, d, cmd]) => (
            <li key={t} className="flex flex-col rounded-2xl bg-canvas-secondary p-6">
              <h3 className="text-body-lg font-medium text-fg">{t}</h3>
              <p className="mt-2 flex-1 text-small text-fg-secondary">{d}</p>
              <code aria-hidden="true" className="mt-5 block truncate rounded-lg bg-[#0d1117] px-3 py-2 font-mono text-[12px] text-[#7ee787]">
                {cmd}
              </code>
            </li>
          ))}
        </ul>
      </Band>

      <ShowcaseSplit
        id="managed"
        eyebrow="The question that decides it"
        title="Managed or unmanaged"
        body="Unmanaged is cheaper and it is a job. You own patching, hardening, monitoring and the 2am restart. Managed means we do all of that on your server and you keep root anyway. Most businesses buying their first VPS want managed and do not know it is an option."
        points={[
          { label: "Unmanaged", detail: "You administer it. Right if you have someone who wants to.", icon: "wrench" },
          { label: "Managed", detail: "We patch, harden, monitor and back up. You still get root.", icon: "shield" },
          { label: "Either way", detail: "Free migration in, daily backups, free restores.", icon: "compass" },
        ]}
        cta={{ label: "Ask which one fits", href: billing.sales }}
        visual={<ResponsibilityMock />}
        side="left"
        surface="subtle"
        bleed
      />

      {/* Sizing guidance. */}
      <Band tone="dark" labelledBy="vps-size-heading">
        <Heading
          id="vps-size-heading"
          dark
          title="Start smaller than you think"
          lede="Resizing will be prorated and quick. Over-buying on day one is the expensive mistake, not under-buying."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["One busy WordPress site with a cache", "2 vCPU · 4 GB", "PHP worker count before CPU"],
            ["A Node or Python application", "2 vCPU · 4 GB", "Memory, first and always"],
            ["App plus its own database", "4 vCPU · 8 GB", "Disk I/O and connection limits"],
            ["Several client sites on one box", "4 vCPU · 8 GB", "Memory, then storage"],
            ["Queues or media processing", "4 vCPU · 16 GB", "CPU during the burst, not the average"],
          ].map(([a, b, c]) => (
            <li key={a} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <p className="text-body-lg font-medium text-white">{a}</p>
              <p className="mt-4 flex items-center gap-2">
                <Pill tone="on-dark">Start around</Pill>
                <span className="text-body font-semibold text-white">{b}</span>
              </p>
              <p className="mt-3 text-small text-fg-on-dark-secondary">Watch: {c}</p>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-2xl text-center text-small text-fg-on-dark-secondary">
          Starting points for a conversation, not a quote. The honest way to size is to measure
          for a couple of weeks after you move.
        </p>
      </Band>

      <Band tone="subtle" labelledBy="vps-root-heading">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-canvas p-8 ring-1 ring-line sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 id="vps-root-heading" className="text-h3 font-medium tracking-[-0.02em] text-fg">Do you actually need root?</h2>
            <p className="mt-3 max-w-2xl text-body text-fg-secondary">
              If the honest answer is no,{" "}
              <Link href="/cloud-hosting" className="font-semibold text-primary hover:text-primary-hover">
                cloud hosting
              </Link>{" "}
              gives you the headroom without the administration, and it is available today. If
              the answer is yes and the load is sustained,{" "}
              <Link href="/dedicated-servers" className="font-semibold text-primary hover:text-primary-hover">
                a dedicated server
              </Link>{" "}
              may be cheaper per unit of work.
            </p>
          </div>
          <Button href={billing.sales} external>
            Talk it through
          </Button>
        </div>
      </Band>

      <FaqSection items={FAQS} />
      <FinalCta />
    </>
  );
}
