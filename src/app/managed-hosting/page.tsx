import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Band, Heading, Pill, Tick } from "../hosting/_components/band";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { PricingBand } from "@/components/home/pricing-band";
import { JsonLd } from "@/components/ui/json-ld";
import { ResponsibilityMock } from "@/components/product-ui/infra";
import { UptimePanel } from "@/components/product-ui/panels";
import { pageMetadata, faqGraph, productGraph, serviceGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";
import { billing } from "@/data/company";
import { formatPrice, groupById } from "@/data/pricing";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";

const PATH = "/managed-hosting";

/**
 * Rates come from the same cloud plans the pricing band renders: cloud is the
 * managed product on sale today, so its rates ARE the managed-hosting price.
 * The standard rate travels with the advertised one everywhere it is quoted.
 */
const CLOUD = groupById("cloud")?.plans ?? [];
const ENTRY = CLOUD[0];
const FROM = ENTRY ? formatPrice(ENTRY.monthly) : "";
const STANDARD = ENTRY ? formatPrice(ENTRY.standard) : "";
const TOP = CLOUD.at(-1);

export const metadata = pageMetadata({
  title: `Managed Hosting Services from ${FROM}/mo | Serverlys`,
  description: `Fully managed hosting from ${FROM}/mo (standard rate ${STANDARD}): patching, security, daily backups, free restores and free migration, handled for you.`,
  path: PATH,
});

/**
 * Managed hosting.
 *
 * Search Console (Oct 2026) shows this is the site's largest query cluster —
 * "managed hosting", "managed hosting services", "managed web hosting",
 * "managed hosting pricing", "what is managed hosting", "managed hosting
 * benefits" — and that Google was answering it with the blog guide, because
 * this page never said "managed hosting" in its H1 and quoted no price. The
 * page now answers those queries in order: what it is (hero), what it costs
 * (plans), what it includes, managed vs unmanaged, benefits, who it is for.
 *
 * The page's original idea stays: managed is an AXIS, not a tier. You can
 * have a managed shared plan or an unmanaged VPS.
 */
const FAQS: readonly Faq[] = [
  {
    question: "What is managed hosting?",
    answer:
      "Managed hosting is web hosting where the provider runs the server for you: operating system and software patching, security hardening, monitoring, backups and restores. You keep control of your website; the hosting company keeps the server healthy and secure.",
    scopes: [PATH],
  },
  {
    question: "How much does managed hosting cost?",
    answer: `Serverlys managed cloud hosting starts at ${FROM} a month, with a standard rate of ${STANDARD} shown beside it${TOP ? `, up to ${formatPrice(TOP.monthly)} a month for the largest plan` : ""}. Management, daily backups, restores and migration are included rather than sold as add-ons.`,
    scopes: [PATH],
  },
  {
    question: "What is the difference between managed and unmanaged hosting?",
    answer:
      "With unmanaged hosting you get a server and do the administration yourself: updates, security, backups and fixing what breaks. With managed hosting the provider does that work. Unmanaged is cheaper in money and more expensive in time; managed is for teams who would rather run their business than a server.",
    scopes: [PATH],
  },
  {
    question: "Is managed hosting worth it for a small business?",
    answer:
      "Usually, yes. Most small businesses have no one whose job is server security, and an unpatched or unbacked-up site is the expensive kind of cheap. If you have a developer who enjoys administering Linux, unmanaged can make sense; otherwise managed costs less than the hours it replaces.",
    scopes: [PATH],
  },
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
    question: "Can you move my site to managed hosting for free?",
    answer:
      "Yes. Migration is free with every cloud plan: we copy the site, database and email, stage it so you can check it, and switch when you say, without taking the old site down first.",
    scopes: [PATH],
  },
  {
    question: "Do I still get access?",
    answer:
      "Yes. Managed does not mean locked out. On a managed VPS or dedicated server you keep root; on shared plans you keep full control panel access. We are not holding your server hostage.",
    scopes: [PATH],
  },
];

/** Managed vs unmanaged, row by row. Who does each job. */
const COMPARISON: ReadonlyArray<readonly [string, string, string]> = [
  ["Operating system and security patches", "We apply them as released", "You apply them"],
  ["Firewall and server hardening", "Configured and maintained", "Your job"],
  ["Daily backups", "Taken and verified daily", "You set them up"],
  ["Restores", "Free, and we do them", "You do them, if a backup exists"],
  ["SSL certificates", "Issued and renewed automatically", "You install and renew"],
  ["Monitoring and incident response", "Around the clock, investigated", "You notice when visitors do"],
  ["Website migration", "Free, staged, switched when you say", "You move it"],
  ["Root or control panel access", "Kept", "Kept"],
];

const BENEFITS: ReadonlyArray<readonly [string, string]> = [
  ["Security you do not have to remember", "Patches land as they are released, not when someone finds a free afternoon. Outdated software is one of the most common ways small sites get hacked."],
  ["Backups that have been tested", "A backup you have never restored is a hope. Ours are verified daily and restores are free, so recovering from a bad update is a request, not a project."],
  ["Speed that stays fast", "NVMe storage, LiteSpeed and server-level caching are configured and kept tuned, so performance does not quietly decay as software ages."],
  ["Time back", "Server work moves off your list. The hours an owner or developer spent on updates and fixes go back to customers and product."],
  ["One accountable party", "When something on the server breaks, it is our problem to fix. No forum threads, no arguing about whose fault it is."],
  ["Predictable cost", "Management, backups, restores and migration are in the plan price, and the standard rate is published beside the advertised one."],
];

export default function ManagedHostingPage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />
      <JsonLd
        data={serviceGraph({
          name: "Serverlys Managed Hosting",
          serviceType: "Managed web hosting",
          description: String(metadata.description ?? ""),
          path: PATH,
        })}
      />
      {CLOUD.length > 0 && (
        <JsonLd
          data={productGraph({
            name: "Serverlys Managed Cloud Hosting",
            description: String(metadata.description ?? ""),
            path: PATH,
            lowPrice: Math.min(...CLOUD.map((p) => p.monthly)),
            highPrice: Math.max(...CLOUD.map((p) => p.monthly)),
            offerCount: CLOUD.length,
          })}
        />
      )}

      <ProductHero
        eyebrow="Managed hosting"
        title="Managed hosting: we run the server, you run the business"
        lede={`Managed hosting means we patch, secure, monitor and back up the server your website runs on, and restore it for free when something goes wrong. Fully managed plans start at ${FROM}/mo, standard rate ${STANDARD}, with free migration.`}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Hosting", href: "/hosting" },
          { name: "Managed hosting" },
        ]}
        specs={[
          { label: "Plans from", value: `${FROM}/mo` },
          { label: "Patching", value: "Ours" },
          { label: "Restores", value: "Free" },
          { label: "Migration", value: "Free" },
        ]}
        primary={{ label: "See managed plans", href: "#plans" }}
        secondary={{ label: "Ask what you need", href: billing.sales }}
        visual={<ResponsibilityMock />}
      />

      {/* The axis: four tiers, each with its unmanaged and managed answer. */}
      <Band labelledBy="mh-axes-heading">
        <Heading
          id="mh-axes-heading"
          title="Size and management are separate choices"
          lede="Managed is not a tier. Every combination below is one we sell. Most hosts only offer you the diagonal."
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

      {/* What it costs: the managed cloud plans, rendered from the pricing data. */}
      <PricingBand />

      {/* What we do, on a schedule. */}
      <Band tone="dark" labelledBy="mh-work-heading">
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-center lg:gap-20">
          <div>
            <Heading
              id="mh-work-heading"
              dark
              align="left"
              title="What fully managed hosting includes"
              lede="Management is a set of recurring jobs. Here they are, and how often each one happens."
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

      {/* Managed vs unmanaged: a real table, because that is the format the query wants. */}
      <Band labelledBy="mh-vs-heading">
        <Heading
          id="mh-vs-heading"
          title="Managed vs unmanaged hosting"
          lede="The difference is not the hardware. It is who does each of these jobs."
        />
        <div className="mx-auto mt-12 max-w-[960px] overflow-x-auto rounded-2xl ring-1 ring-line">
          <table className="w-full min-w-[560px] border-collapse text-left text-small">
            <caption className="sr-only">Who handles each server task on managed and unmanaged hosting</caption>
            <thead className="bg-canvas-secondary text-fg">
              <tr>
                <th scope="col" className="p-4 font-semibold">Task</th>
                <th scope="col" className="p-4 font-semibold text-primary">Managed hosting</th>
                <th scope="col" className="p-4 font-semibold">Unmanaged hosting</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(([task, managed, unmanaged]) => (
                <tr key={task} className="border-t border-line">
                  <th scope="row" className="p-4 font-medium text-fg">{task}</th>
                  <td className="p-4 text-fg">
                    <span className="flex items-center gap-2"><Tick />{managed}</span>
                  </td>
                  <td className="p-4 text-fg-secondary">{unmanaged}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-6 max-w-[70ch] text-center text-small text-fg-secondary">
          Comparing in more depth? Read{" "}
          <Link href="/blog/managed-hosting-guide" className="text-primary underline underline-offset-4">
            what managed hosting is, what it costs and who needs it
          </Link>{" "}
          or{" "}
          <Link href="/blog/cloud-vs-shared-hosting" className="text-primary underline underline-offset-4">
            cloud vs shared hosting
          </Link>
          .
        </p>
      </Band>

      {/* Benefits. */}
      <Band tone="subtle" labelledBy="mh-benefits-heading">
        <Heading
          id="mh-benefits-heading"
          title="Benefits of managed hosting"
          lede="What changes for a business when someone else owns the server."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {BENEFITS.map(([title, text]) => (
            <li key={title} className="rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <h3 className="text-body-lg font-semibold text-fg">{title}</h3>
              <p className="mt-3 text-small text-fg-secondary">{text}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* The boundary. Stated as clearly as the inclusions. */}
      <Band labelledBy="mh-boundary-heading">
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

      {/* Who it is for: the routes into the specific managed products. */}
      <Band tone="subtle" labelledBy="mh-for-heading">
        <Heading
          id="mh-for-heading"
          title="Managed hosting for what you run"
          lede="The same management on every plan, tuned for the workload."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(
            [
              ["Managed WordPress hosting", "/wordpress-hosting", "Core, theme and plugin updates handled, with LiteSpeed caching tuned for WordPress."],
              ["Managed cloud hosting", "/cloud-hosting", "NVMe cloud resources that scale with traffic, managed at no extra cost."],
              ["Managed ecommerce hosting", "/ecommerce-hosting", "WooCommerce stores kept fast and patched, where downtime is lost sales."],
              ["Free website migration", "/migrations", "We move your site, database and email to managed hosting, staged and checked first."],
            ] as const
          ).map(([title, href, text]) => (
            <li key={href}>
              <Link
                href={href}
                className="flex h-full flex-col rounded-2xl bg-canvas p-6 ring-1 ring-line transition-colors duration-fast hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="text-body-lg font-semibold text-fg">{title}</span>
                <span className="mt-3 text-small text-fg-secondary">{text}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-[70ch] text-center text-small text-fg-secondary">
          Starting a company? See{" "}
          <Link href="/blog/best-hosting-startups" className="text-primary underline underline-offset-4">
            web hosting for startups
          </Link>{" "}
          and{" "}
          <Link href="/blog/web-hosting-cost-2026" className="text-primary underline underline-offset-4">
            what web hosting costs in 2026
          </Link>
          .
        </p>
      </Band>

      <FaqSection items={FAQS} />
      <FinalCta />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
