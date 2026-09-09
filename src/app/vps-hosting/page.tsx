import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Section, SectionHeader } from "@/components/ui/section";
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
        eyebrow="VPS hosting"
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
        primary={{ label: "Talk to us about sizing", href: "/contact" }}
        secondary={{ label: "Compare the tiers", href: "/hosting-alternatives" }}
        visual={<TerminalMock />}
      />

      {/* Capability strip — what root actually buys you, in plain terms. */}
      <Section spacing="tight">
        <SectionHeader
          eyebrow="What changes"
          title="The things shared hosting will not let you do"
          lede="This is the whole reason the tier exists. If none of it applies to you, save the money and stay where you are."
        />
        <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Choose your runtime", "A specific Node, Python, Ruby or PHP version — and keep it there while the rest of the world moves."],
            ["Install system packages", "Image libraries, a headless browser, a search engine, a message broker. apt is yours."],
            ["Run background work", "Queues, workers, schedulers and anything long-lived, rather than praying a web request finishes in time."],
            ["Tune the web server", "Your own nginx or Apache configuration, your own cache rules, your own limits."],
            ["Guaranteed resources", "The allocation is reserved. A neighbour having a spike is not your problem any more."],
            ["Your own firewall", "Ports, rules and access policy set the way your security review wants them."],
          ].map(([t, d]) => (
            <li key={t} className="border-t border-line pt-5">
              <h3 className="text-body font-semibold text-fg">{t}</h3>
              <p className="mt-2 text-small text-fg-secondary">{d}</p>
            </li>
          ))}
        </ul>
      </Section>

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
        cta={{ label: "Ask which one fits", href: "/contact" }}
        visual={<ResponsibilityMock />}
        side="left"
        surface="subtle"
        bleed
      />

      {/* Sizing guidance — a genuinely useful table, not a spec dump. */}
      <Section surface="dark">
        <SectionHeader
          eyebrow="Sizing"
          tone="dark"
          title="Start smaller than you think"
          lede="Resizing is prorated and takes minutes. Over-buying on day one is the expensive mistake, not under-buying."
        />
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left">
            <caption className="sr-only">
              Guidance on VPS sizing by workload
            </caption>
            <thead>
              <tr className="border-b border-white/15">
                {["If you are running", "Start around", "Watch"].map((h) => (
                  <th key={h} scope="col" className="pb-3 pr-6 font-mono text-caption uppercase tracking-wider text-fg-on-dark-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                ["One busy WordPress site with a cache", "2 vCPU · 4 GB", "PHP worker count before CPU"],
                ["A Node or Python application", "2 vCPU · 4 GB", "Memory, first and always"],
                ["App plus its own database", "4 vCPU · 8 GB", "Disk I/O and connection limits"],
                ["Several client sites on one box", "4 vCPU · 8 GB", "Memory, then storage"],
                ["Anything with queues or media processing", "4 vCPU · 16 GB", "CPU during the burst, not the average"],
              ].map(([a, b, c]) => (
                <tr key={a}>
                  <td className="py-4 pr-6 text-body text-white">{a}</td>
                  <td className="py-4 pr-6 font-mono text-small text-accent-on-dark">{b}</td>
                  <td className="py-4 text-small text-fg-on-dark-secondary">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 max-w-2xl text-small text-fg-on-dark-muted">
          These are starting points for a conversation, not a quote. Sizing
          depends on what your code does per request, and the only honest way to
          set it is to measure for a couple of weeks after you move.
        </p>
      </Section>

      <Section surface="subtle" spacing="tight">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-h4 text-fg">Do you actually need root?</h2>
            <p className="mt-2 max-w-2xl text-body text-fg-secondary">
              If the honest answer is no,{" "}
              <Link href="/cloud-hosting" className="font-medium text-primary hover:text-primary-hover">
                cloud hosting
              </Link>{" "}
              gives you the headroom without the administration. If the answer
              is yes and the load is sustained,{" "}
              <Link href="/dedicated-servers" className="font-medium text-primary hover:text-primary-hover">
                a dedicated server
              </Link>{" "}
              may be cheaper per unit of work.
            </p>
          </div>
          <Button href={billing.sales} variant="secondary" external>
            Talk it through
          </Button>
        </div>
      </Section>

      <FaqSection items={FAQS} />
      <FinalCta />
    </>
  );
}
