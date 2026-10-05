import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Band, Heading, Pill, Tick } from "../hosting/_components/band";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { ResponsibilityMock } from "@/components/product-ui/infra";
import { UptimePanel } from "@/components/product-ui/panels";
import { pageMetadata, faqGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";
import { billing } from "@/data/company";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";

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

      {/* The axis: four tiers, each with its unmanaged and managed answer. */}
      <Band labelledBy="mh-axes-heading">
        <Heading
          id="mh-axes-heading"
          title="Size and management are separate choices"
          lede="Every combination below is one we sell. Most hosts only offer you the diagonal."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(
            [
              ["Shared", "/shared-hosting", "Soon", "Not offered: shared is managed by definition", "Included at no extra cost"],
              ["Cloud", "/cloud-hosting", "Available now", "Not offered: the platform is managed", "Included at no extra cost"],
              ["VPS", "/vps-hosting", "Soon", "You administer it. Cheaper, and a real job.", "We patch, harden and monitor. You keep root."],
              ["Dedicated", "/dedicated-servers", "Soon", "The machine is yours from the OS up.", "We run the OS layer. You keep root."],
            ] as const
          ).map(([tier, href, status, un, man]) => (
            <li key={tier}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-2xl bg-canvas-secondary p-6 transition-colors duration-fast hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-body-lg font-semibold text-fg">{tier}</span>
                  <Pill tone={status === "Available now" ? "success" : "warning"}>{status}</Pill>
                </span>
                <span className="mt-6 text-small font-semibold text-fg-secondary">Unmanaged</span>
                <span className="mt-1 text-small text-fg-secondary">{un}</span>
                <span className="mt-4 text-small font-semibold text-primary">Managed</span>
                <span className="mt-1 text-small text-fg">{man}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      {/* What we do, on a schedule. */}
      <Band tone="dark" labelledBy="mh-work-heading">
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-center lg:gap-20">
          <div>
            <Heading
              id="mh-work-heading"
              dark
              align="left"
              title="What actually happens, and how often"
              lede="Management is a set of recurring jobs. Here they are."
            />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                ["Continuously", "Uptime and service monitoring. If a service dies, it is restarted and investigated."],
                ["Daily", "Backups taken and verified. Restores are free and we do them for you."],
                ["As released", "Security patches applied to the operating system and server software."],
                ["Automatically", "SSL certificates issued and renewed before they expire."],
                ["On request", "PHP version changes, resource limits, cache and firewall rule changes."],
                ["When it breaks", "Server-side diagnosis, reported back to you in plain language."],
              ].map(([when, what]) => (
                <li key={when} className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
                  <Pill tone="on-dark">{when}</Pill>
                  <p className="mt-3 text-small text-fg-on-dark-secondary">{what}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 sm:p-8">
            <UptimePanel />
          </div>
        </div>
      </Band>

      {/* The boundary. Stated as clearly as the inclusions. */}
      <Band tone="subtle" labelledBy="mh-boundary-heading">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="mh-boundary-heading" align="left" title="Where our responsibility ends" />
            <p className="mt-5 max-w-[60ch] text-body text-fg-secondary">
              We own the server and everything that runs it. You own what you built on top of it.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              When something in your application breaks, we still look. You get what the server
              logs show and an honest opinion on the cause, and if fixing it is development work,
              a quote rather than a surprise on your invoice.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/site-management">Site management plans</Button>
              <Button href="/website-development" variant="outline">
                Development help
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["We own", ["Operating system", "Web server and PHP", "Firewall and patching", "Backups and restores"], true],
                ["You own", ["Application code", "Themes and plugins", "Content and media", "Third-party services"], false],
              ] as const
            ).map(([owner, items, ours]) => (
              <div key={owner} className={ours ? "rounded-2xl bg-canvas p-6 ring-1 ring-line" : "rounded-2xl bg-brand-50 p-6"}>
                <Pill tone={ours ? "success" : "brand"}>{owner}</Pill>
                <ul className="mt-4 flex flex-col gap-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-body text-fg">
                      {ours ? <Tick /> : <span className="size-5 shrink-0 rounded-full border-2 border-primary/40" aria-hidden="true" />}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Band>

      <FaqSection items={FAQS} />
      <FinalCta />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
