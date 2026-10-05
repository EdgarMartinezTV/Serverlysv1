import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FinalCta } from "@/components/sections/final-cta";
import { NavIcon, ArrowUpRight } from "@/components/navigation/nav-icons";
import { billing, company, emailDisplay } from "@/data/company";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "../resources/_components/page-hero";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

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
    action: { label: emailDisplay, href: `mailto:${company.email}` },
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

      <PageHero
        trail={[{ name: "Home", href: "/" }, { name: "Support" }]}
        label="Support"
        title="How can we help?"
        lede={
          <p>
            Support is included on every plan at every tier. There is no priority queue to
            buy: there is one queue, and one team.
          </p>
        }
        visual={<TicketMock />}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={billing.sales} size="lg">
            Open a ticket
          </Button>
          <Button href={billing.login} variant="outline" size="lg">
            Client area
          </Button>
        </div>
      </PageHero>

      <Section>
        <SectionHeader
          eyebrow="Ways to reach us"
          title="Three routes, same team"
          lede="Pick whichever fits the problem. Nothing here routes to a bot."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {CHANNELS.map((c) => (
            <li key={c.title} className="flex flex-col gap-4 rounded-2xl bg-canvas-secondary p-7">
              <span aria-hidden="true" className="inline-flex size-10 items-center justify-center rounded-lg bg-primary text-white">
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
                <span aria-hidden="true" className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-micro font-semibold text-primary">
                  {i + 1}
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

      <Section surface="light" spacing="tight">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-50 p-7 sm:flex-row sm:items-center sm:p-8">
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

/**
 * A support ticket as it looks in the client area: attached to the service,
 * so the team sees the server without asking for screenshots (the claim the
 * first channel card makes). Sample content, decorative only.
 */
function TicketMock() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-[460px] overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
      <div className="flex items-center justify-between border-b border-line-subtle px-4 py-3">
        <span className="text-small font-semibold text-fg">Ticket #48213</span>
        <span className="rounded-md bg-success-soft px-2 py-0.5 text-micro font-semibold text-success">Answered</span>
      </div>
      <div className="flex items-center gap-2 border-b border-line-subtle bg-canvas-secondary px-4 py-2 text-micro text-fg-secondary">
        <span className="size-1.5 rounded-full bg-success-fill" />
        Attached: hearthbakery.com · Starter Cloud
      </div>
      <div className="flex flex-col gap-3 p-4 text-small">
        <p className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-canvas-secondary px-3 py-2 text-fg">
          Checkout shows a 502 since this morning. Nothing changed on our side.
        </p>
        <div className="max-w-[90%] rounded-xl rounded-bl-sm bg-brand-50 px-3 py-2 text-fg">
          <p className="text-micro font-semibold text-primary">Serverlys support</p>
          <p className="mt-1">
            A plugin update hit the PHP memory limit. We raised it and restored the cache;
            checkout is taking orders again.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-line-subtle px-4 py-3">
        <span className="flex-1 rounded-md bg-canvas-secondary px-3 py-2 text-micro text-fg-muted">Write a reply…</span>
        <span className="rounded-md bg-primary px-3 py-2 text-micro font-semibold text-white">Send</span>
      </div>
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Support", path: PATH }]} />
    </div>
  );
}
