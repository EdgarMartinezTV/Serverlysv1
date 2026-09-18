import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { ResponsibilityMock } from "@/components/product-ui/infra";
import { UptimePanel } from "@/components/product-ui/panels";
import { pageMetadata, breadcrumbGraph, faqGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";
import { billing } from "@/data/company";

const PATH = "/managed-hosting";

export const metadata = pageMetadata({
  title: "Managed Hosting — we run the server, you run the business",
  description:
    "Patching, hardening, monitoring, backups and restores handled for you on any Serverlys tier. What managed covers, what it does not, and who it is for.",
  path: PATH,
});

/**
 * Managed hosting.
 *
 * The critical idea, and the page's whole architecture: managed is an AXIS,
 * not a tier. You can have a managed shared plan or an unmanaged VPS. Almost
 * every hosting site presents managed as a rung on a ladder, which is why
 * customers arrive believing they must upgrade their hardware to get someone
 * to patch it. The page corrects that in the hero and then draws the
 * responsibility line explicitly.
 */
const FAQS: readonly Faq[] = [
  {
    question: "Is managed hosting a plan, or an option?",
    answer:
      "An option. Managed describes who administers the server, not how big it is. A small shared plan can be managed and a large VPS can be unmanaged. Choose the tier for the workload and the management for your team.",
    scopes: [PATH],
  },
  {
    question: "What is actually included?",
    answer:
      "Operating system and software patching, web server and PHP configuration, firewall and hardening, SSL issue and renewal, daily backups with free restores, and uptime monitoring. If something we manage breaks, fixing it is our job, not a support ticket you have to argue.",
    scopes: [PATH],
  },
  {
    question: "What is not included?",
    answer:
      "Your application code and your content. If your theme has a bug or a plugin update breaks a page, that is development work — we will tell you what we can see from the server side and quote the fix rather than quietly doing it and billing you.",
    scopes: [PATH],
  },
  {
    question: "Do I still get access?",
    answer:
      "Yes. Managed does not mean locked out. On a managed VPS or dedicated server you keep root; on shared plans you keep full control panel access. We are not holding your server hostage.",
    scopes: [PATH],
  },
];

export default function ManagedHostingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Hosting", path: "/hosting" },
          { name: "Managed hosting", path: PATH },
        ])}
      />
      <JsonLd data={faqGraph(FAQS)} />

      <ProductHero
        eyebrow="Managed hosting"
        title="Managed is not a tier. It is a decision about who does the work."
        lede="You can have a managed shared plan or an unmanaged dedicated server. Pick the hardware for the workload, and pick management for whether anyone on your side wants to patch a server at 2am."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Hosting", href: "/hosting" },
          { name: "Managed hosting" },
        ]}
        specs={[
          { label: "Available on", value: "Every tier" },
          { label: "Patching", value: "Ours" },
          { label: "Restores", value: "Free" },
          { label: "Your access", value: "Unchanged" },
        ]}
        primary={{ label: "See hosting plans", href: "/pricing" }}
        secondary={{ label: "Ask what you need", href: billing.sales }}
        visual={<ResponsibilityMock />}
      />

      {/* The axis, drawn as a matrix. This is the page's argument in one view. */}
      <Section>
        <SectionHeader
          eyebrow="The two axes"
          title="Size and management are separate choices"
          lede="Every square below is a real combination we sell. Most hosting sites only offer you the diagonal."
        />
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">
              Hosting tiers against management options
            </caption>
            <thead>
              <tr>
                <th scope="col" className="w-40 pb-3 pr-6 font-mono text-caption uppercase tracking-wider text-fg-muted">
                  Tier
                </th>
                <th scope="col" className="pb-3 pr-6 font-mono text-caption uppercase tracking-wider text-fg-muted">
                  Unmanaged
                </th>
                <th scope="col" className="pb-3 font-mono text-caption uppercase tracking-wider text-fg-muted">
                  Managed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line border-t border-line">
              {[
                ["Shared", "/shared-hosting", "Not offered — shared is managed by definition", "Included at no extra cost"],
                ["Cloud", "/cloud-hosting", "Not offered — the platform is managed", "Included at no extra cost"],
                ["VPS", "/vps-hosting", "You administer it. Cheaper, and a real job.", "We patch, harden and monitor. You keep root."],
                ["Dedicated", "/dedicated-servers", "The machine is yours from the OS up.", "We run the OS layer. You keep root."],
              ].map(([tier, href, un, man]) => (
                <tr key={tier}>
                  <th scope="row" className="py-5 pr-6 align-top">
                    <Link
                      href={href}
                      className="inline-flex min-h-6 items-center text-body font-semibold text-fg hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {tier}
                    </Link>
                  </th>
                  <td className="py-5 pr-6 align-top text-small text-fg-secondary">{un}</td>
                  <td className="py-5 align-top text-small text-fg">{man}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* What we do, on a schedule — the operational reality. */}
      <Section surface="dark">
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-center lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="The work"
              tone="dark"
              title="What actually happens, and how often"
              lede="Management is a set of recurring jobs. Here they are, rather than the word 'proactive'."
            />
            <ul className="mt-10 flex flex-col divide-y divide-white/10 border-y border-white/10">
              {[
                ["Continuously", "Uptime and service monitoring. If a service dies, it is restarted and investigated."],
                ["Daily", "Backups taken and verified. Restores are free and we do them for you."],
                ["As released", "Security patches applied to the operating system and server software."],
                ["Automatically", "SSL certificates issued and renewed before they expire."],
                ["On request", "PHP version changes, resource limit tuning, cache and firewall rule changes."],
                ["When it breaks", "Server-side diagnosis, with what we can see reported back to you in plain language."],
              ].map(([when, what]) => (
                <li key={when} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
                  <span className="w-36 shrink-0 font-mono text-caption uppercase tracking-wider text-accent-on-dark">
                    {when}
                  </span>
                  <span className="text-body text-fg-on-dark-secondary">{what}</span>
                </li>
              ))}
            </ul>
          </div>
          <UptimePanel />
        </div>
      </Section>

      {/* The boundary. Stated as clearly as the inclusions. */}
      <Section surface="subtle">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-h3 text-fg">Where our responsibility ends</h2>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              A managed plan that is vague about its boundary is how customers
              end up angry. Ours: we own the server and everything that runs it.
              You own what you built on top of it.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              When something in your application breaks, we will still look. You
              will get what the server logs show and an honest opinion on the
              cause — and if fixing it is development work, a quote rather than
              a surprise on your invoice.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/site-management">Site management plans</Button>
              <Button href="/website-development" variant="secondary">
                Development help
              </Button>
            </div>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-2">
            {[
              ["We own", "Operating system", true],
              ["We own", "Web server and PHP", true],
              ["We own", "Firewall and patching", true],
              ["We own", "Backups and restores", true],
              ["You own", "Application code", false],
              ["You own", "Themes and plugins", false],
              ["You own", "Content and media", false],
              ["You own", "Third-party services", false],
            ].map(([owner, item, ours]) => (
              <div key={item as string} className="bg-canvas p-5">
                <dt
                  className={`font-mono text-caption uppercase tracking-wider ${
                    ours ? "text-success" : "text-fg-muted"
                  }`}
                >
                  {owner}
                </dt>
                <dd className="mt-1 text-body font-medium text-fg">{item}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <FaqSection items={FAQS} />
      <FinalCta />
    </>
  );
}
