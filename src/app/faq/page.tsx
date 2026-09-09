import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section } from "@/components/ui/section";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { faqs, type Faq } from "@/data/faqs";
import { pageMetadata, breadcrumbGraph, faqGraph } from "@/lib/seo";

const PATH = "/faq";

export const metadata = pageMetadata({
  title: "Frequently asked questions | Serverlys",
  description:
    "Pricing and renewals, migrations, refunds, domains, hosting plans, AI agents and automations — every question we get asked, answered in one place.",
  path: PATH,
});

/**
 * The complete FAQ.
 *
 * Grouped by topic rather than by page. The grouping is DERIVED from each
 * answer's `scopes` so there is exactly one copy of every answer in the
 * codebase — the page FAQs and this page cannot drift apart, and the
 * FAQPage structured data below is generated from the same array.
 *
 * First match wins, so the order of TOPICS is the routing table.
 */
const TOPICS: ReadonlyArray<{ id: string; label: string; scopes: readonly string[] }> = [
  { id: "pricing", label: "Pricing, billing and refunds", scopes: ["/pricing"] },
  { id: "hosting", label: "Choosing and running hosting", scopes: ["/hosting", "/cloud-hosting"] },
  { id: "wordpress", label: "WordPress", scopes: ["/wordpress-hosting"] },
  { id: "ecommerce", label: "Ecommerce", scopes: ["/ecommerce-hosting"] },
  { id: "domains", label: "Domains", scopes: ["/register-domain"] },
  { id: "ai", label: "AI agents and automations", scopes: ["/ai-agents", "/convoai", "/callflow-ai", "/automations"] },
];

function group(): ReadonlyArray<{ id: string; label: string; items: Faq[] }> {
  const claimed = new Set<Faq>();
  return TOPICS.map((topic) => {
    const items = faqs.filter(
      (f) => !claimed.has(f) && f.scopes.some((s) => topic.scopes.includes(s)),
    );
    items.forEach((f) => claimed.add(f));
    return { ...topic, items };
  }).filter((t) => t.items.length > 0);
}

export default function FaqPage() {
  const groups = group();

  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "FAQ", path: PATH }])} />
      <JsonLd data={faqGraph(faqs)} />

      <section className="relative isolate overflow-hidden bg-canvas-abyss">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_25%_-5%,rgb(34_126_255/0.3)_0%,transparent_68%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />
        <Container className="relative pb-16 pt-8 sm:pb-20 sm:pt-10">
          <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "FAQ" }]} tone="dark" />
          <div className="mt-10 max-w-2xl">
            <span className="font-mono text-caption uppercase text-accent-on-dark">FAQ</span>
            <h1 className="mt-4 text-h1 text-white">Questions, answered</h1>
            <p className="mt-5 text-body-lg text-fg-on-dark-secondary">
              {faqs.length} answers covering price, renewals, migration, domains
              and the AI products. If yours is not here,{" "}
              <Link href="/contact" className="text-white underline underline-offset-4 hover:text-accent-on-dark">
                ask us directly
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-16">
          {/* Topic index. Plain in-page anchors — no scroll-spy theatre. */}
          <nav aria-label="FAQ topics" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-caption font-semibold uppercase tracking-wider text-fg-muted">
              Topics
            </p>
            <ul className="mt-4 flex flex-col gap-1">
              {groups.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    className="flex min-h-[2.75rem] items-center rounded-md px-3 text-small text-fg-secondary transition-colors hover:bg-canvas-secondary hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {g.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-14">
            {groups.map((g) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-heading`} className="scroll-mt-28">
                <h2 id={`${g.id}-heading`} className="text-h4 text-fg">
                  {g.label}
                </h2>
                <ul className="mt-5 divide-y divide-line border-t border-line">
                  {g.items.map((faq) => (
                    <li key={faq.question}>
                      <details className="group py-5">
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                          <span className="text-body-lg font-semibold text-fg">{faq.question}</span>
                          <span
                            aria-hidden="true"
                            className="mt-1 shrink-0 text-fg-muted transition-transform duration-normal ease-hover group-open:rotate-45"
                          >
                            <svg viewBox="0 0 16 16" className="h-4 w-4">
                              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                            </svg>
                          </span>
                        </summary>
                        <p className="mt-3 max-w-[62ch] text-body text-fg-secondary">{faq.answer}</p>
                      </details>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
