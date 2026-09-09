import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { NavIcon } from "@/components/navigation/nav-icons";
import { articles, readingMinutes } from "@/data/articles";
import { billing } from "@/data/company";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";

const PATH = "/resources";

export const metadata = pageMetadata({
  title: "Resources — guides, answers and tools | Serverlys",
  description:
    "Everything Serverlys publishes to help you decide: buying guides, the full FAQ, support routes and the domain search tool.",
  path: PATH,
});

/**
 * Resources hub.
 *
 * A router, not a content page. Every destination is a page that exists —
 * there are no "coming soon" tiles, because a hub that links to nothing is
 * worse than a shorter hub.
 */
const DESTINATIONS = [
  {
    icon: "book" as const,
    title: "Guides",
    detail:
      "Practical write-ups on hosting cost, migrations, page speed and AI agents.",
    href: "/blog",
    action: `${articles.length} articles`,
  },
  {
    icon: "chat" as const,
    title: "Frequently asked questions",
    detail:
      "Pricing, renewals, refunds, domains and plan choice, answered in one place.",
    href: "/faq",
    action: "Read the FAQ",
  },
  {
    icon: "lifebuoy" as const,
    title: "Support",
    detail:
      "How to reach us, what is included at no cost, and what to send so it gets fixed first time.",
    href: "/support",
    action: "Get help",
  },
  {
    icon: "globe" as const,
    title: "Domain search",
    detail:
      "Check availability against the live registries and see the renewal price before you buy.",
    href: "/register-domain",
    action: "Search domains",
  },
  {
    icon: "chart" as const,
    title: "Pricing",
    detail: "Every plan, with the renewal rate printed next to the introductory rate.",
    href: "/pricing",
    action: "Compare plans",
  },
  {
    icon: "shield" as const,
    title: "Client area",
    detail: "Invoices, services, domains and tickets for existing customers.",
    href: billing.login,
    action: "Sign in",
  },
];

export default function ResourcesPage() {
  const latest = articles.slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Resources", path: PATH },
        ])}
      />

      <section className="relative isolate overflow-hidden bg-canvas-abyss">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_55%_at_25%_-5%,rgb(34_126_255/0.3)_0%,transparent_68%)]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />
        <Container className="relative pb-16 pt-8 sm:pb-20 sm:pt-10">
          <Breadcrumbs
            trail={[{ name: "Home", href: "/" }, { name: "Resources" }]}
            tone="dark"
          />
          <div className="mt-10 max-w-2xl">
            <span className="font-mono text-caption uppercase text-accent-on-dark">
              Resources
            </span>
            <h1 className="mt-4 text-h1 text-white">Work out what you need</h1>
            <p className="mt-5 text-body-lg text-fg-on-dark-secondary">
              Guides, answers and tools — written to help you decide, including when the
              answer is that you do not need to buy anything yet.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <ul className="grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d) => {
            const external = d.href.startsWith("http");
            const inner = (
              <>
                <span aria-hidden="true" className="text-primary">
                  <NavIcon name={d.icon} />
                </span>
                <h2 className="text-body-lg font-semibold text-fg group-hover:text-primary">
                  {d.title}
                </h2>
                <p className="flex-1 text-small text-fg-secondary">{d.detail}</p>
                <span className="mt-2 text-small font-semibold text-primary">
                  {d.action}
                </span>
              </>
            );
            const className =
              "group flex h-full flex-col gap-3 bg-canvas p-7 transition-colors hover:bg-canvas-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary";
            return (
              <li key={d.title} className="bg-canvas">
                {external ? (
                  <a href={d.href} className={className}>
                    {inner}
                  </a>
                ) : (
                  <Link href={d.href} className={className}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      <Section surface="subtle">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="Latest"
            title="Recently published"
            lede="The most recent guides from the Serverlys blog."
          />
          <Link
            href="/blog"
            className="inline-flex min-h-6 items-center text-small font-semibold text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            All articles
          </Link>
        </div>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-3">
          {latest.map((a) => (
            <li key={a.slug} className="bg-canvas">
              <Link
                href={`/blog/${a.slug}`}
                className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-canvas-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              >
                <Badge>{a.category}</Badge>
                <h3 className="text-body font-semibold text-fg group-hover:text-primary">
                  {a.title}
                </h3>
                <p className="text-small text-fg-secondary">{a.description}</p>
                <span className="mt-auto pt-3 text-caption text-fg-muted">
                  {readingMinutes(a)} min read
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
