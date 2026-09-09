import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { NavIcon, ArrowUpRight } from "@/components/navigation/nav-icons";
import { billing, company } from "@/data/company";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";

const PATH = "/support";

export const metadata = pageMetadata({
  title: "Support — get help with your Serverlys account",
  description:
    "Open a ticket, request a free migration, or reach the Serverlys team by email or phone. What we handle, and how to give us what we need to fix it fast.",
  path: PATH,
});

/**
 * Support.
 *
 * Every destination here is a real WHMCS endpoint or a real contact route.
 * There is no live-chat widget and no ticket-status lookup, because neither
 * exists yet — a button that opens nothing is worse than no button.
 */
const CHANNELS = [
  {
    icon: "lifebuoy" as const,
    title: "Open a ticket",
    detail:
      "The fastest route for anything account-specific. Tickets are attached to your services, so we can see the server without asking you for screenshots.",
    action: { label: "Open a ticket", href: billing.sales },
  },
  {
    icon: "mail" as const,
    title: "Email",
    detail:
      "Write to us if you cannot sign in. Use the address on your invoice so we can match you to an account.",
    action: { label: company.email, href: `mailto:${company.email}` },
  },
  {
    icon: "phone" as const,
    title: "Phone",
    detail:
      "For urgent problems on a live site — an outage, a failed migration, a checkout that has stopped taking orders.",
    action: { label: company.phone, href: company.phoneHref },
  },
];

export default function SupportPage() {
  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Support", path: PATH }])} />

      <section className="relative isolate overflow-hidden bg-canvas-abyss">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_25%_-5%,rgb(34_126_255/0.3)_0%,transparent_68%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />
        <Container className="relative pb-16 pt-8 sm:pb-20 sm:pt-10">
          <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Support" }]} tone="dark" />
          <div className="mt-10 max-w-2xl">
            <span className="font-mono text-caption uppercase text-accent-on-dark">Support</span>
            <h1 className="mt-4 text-h1 text-white">Get it fixed</h1>
            <p className="mt-5 text-body-lg text-fg-on-dark-secondary">
              Support is included on every plan at every tier. There is no
              priority queue to buy — there is one queue, and one team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={billing.sales} size="lg">
                Open a ticket
              </Button>
              <Button href={billing.login} variant="inverse" size="lg">
                Client area
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <SectionHeader
          eyebrow="Ways to reach us"
          title="Three routes, same team"
          lede="Pick whichever fits the problem. Nothing here routes to a bot."
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-3">
          {CHANNELS.map((c) => (
            <li key={c.title} className="flex flex-col gap-4 bg-canvas p-7">
              <span aria-hidden="true" className="text-primary">
                <NavIcon name={c.icon} />
              </span>
              <h3 className="text-body-lg font-semibold text-fg">{c.title}</h3>
              <p className="flex-1 text-small text-fg-secondary">{c.detail}</p>
              <a
                href={c.action.href}
                className="inline-flex min-h-[2.75rem] items-center gap-1.5 text-small font-semibold text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {c.action.label}
                <ArrowUpRight />
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <FeatureGrid
        eyebrow="What we handle"
        title="Included, at no extra cost"
        lede="These are the jobs people expect to be billed for. They are not."
        surface="subtle"
        columns={3}
        items={[
          { label: "Migrating your site in", detail: "Files, database and email moved to staging, checked, then cut over when you say so.", icon: "compass" },
          { label: "Restoring a backup", detail: "Any daily restore point, restored for you. No restore fee.", icon: "shield" },
          { label: "SSL and DNS", detail: "Certificates, records, nameserver changes and the propagation wait explained.", icon: "globe" },
          { label: "Server-side performance", detail: "Caching, PHP version and resource limits tuned for what your site actually does.", icon: "bolt" },
          { label: "Email deliverability", detail: "SPF, DKIM and DMARC records set up so your mail arrives.", icon: "mail" },
          { label: "Malware cleanup", detail: "If a site on our platform is compromised, we help you clean it and close the hole.", icon: "wrench" },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
          <SectionHeader
            eyebrow="Before you write"
            title="What gets it solved fastest"
            lede="None of this is required. All of it saves a round trip."
          />
          <ol className="flex flex-col divide-y divide-line border-t border-line">
            {[
              ["The exact URL", "The page where it goes wrong, not just the domain. If it is behind a login, say so."],
              ["What you expected, and what happened", "The error text verbatim if there is one. A screenshot beats a description."],
              ["When it started", "And whether anything changed just before — a plugin update, a DNS change, a new theme."],
              ["Who else sees it", "One browser, one device, or everyone. That single fact rules out half the causes."],
            ].map(([title, detail], i) => (
              <li key={title} className="flex gap-5 py-6">
                <span aria-hidden="true" className="font-mono text-small text-fg-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-body font-semibold text-fg">{title}</h3>
                  <p className="mt-1.5 max-w-[58ch] text-small text-fg-secondary">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section surface="subtle" spacing="tight">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-h4 text-fg">Question about buying rather than fixing?</h2>
            <p className="mt-2 text-body text-fg-secondary">
              Pricing, renewals, refunds and plan choice are answered on the FAQ.
            </p>
          </div>
          <Button href="/faq" variant="secondary">
            Read the FAQ
          </Button>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
