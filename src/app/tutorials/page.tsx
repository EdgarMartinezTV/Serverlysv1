import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { tutorials, tutorialCategories } from "@/data/tutorials";
import { canonical, pageMetadata, breadcrumbGraph } from "@/lib/seo";
import { company } from "@/data/company";

const PATH = "/tutorials";

export const metadata = pageMetadata({
  title: "Tutorials — step-by-step guides for your site and domain",
  description:
    "Point a domain, fix email deliverability, force HTTPS, restore a backup. Complete procedures with the exact records and settings, not vague advice.",
  path: PATH,
});

/**
 * Tutorials.
 *
 * Every guide is rendered IN FULL on this page rather than teased behind a
 * detail route. These are procedures — someone arrives mid-problem, and
 * making them click through to find out whether the guide even covers their
 * case is hostile. A sticky index handles navigation.
 *
 * Each tutorial emits HowTo structured data, which is what these actually are.
 */
function howToGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": tutorials.map((t) => ({
      "@type": "HowTo",
      "@id": `${canonical(PATH)}#${t.slug}`,
      name: t.title,
      description: t.summary,
      totalTime: `PT${t.minutes}M`,
      publisher: { "@id": `${company.url}/#organization` },
      step: t.steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.title,
        text: s.detail,
      })),
    })),
  };
}

export default function TutorialsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Tutorials", path: PATH },
        ])}
      />
      <JsonLd data={howToGraph()} />

      <section className="relative isolate overflow-hidden bg-canvas-abyss">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_25%_-5%,rgb(34_126_255/0.3)_0%,transparent_68%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />
        <Container className="relative pb-16 pt-8 sm:pb-20 sm:pt-10">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Resources", href: "/resources" },
              { name: "Tutorials" },
            ]}
            tone="dark"
          />
          <div className="mt-10 max-w-2xl">
            <span className="font-mono text-caption uppercase text-accent-on-dark">
              Tutorials
            </span>
            <h1 className="mt-4 text-h1 text-white">Get the job done</h1>
            <p className="mt-5 text-body-lg text-fg-on-dark-secondary">
              Complete procedures with the actual record values, settings and
              commands. Each one names the mistake people make, because that is
              usually why you are here.
            </p>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {tutorialCategories.map((c) => (
              <li key={c}>
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-caption font-medium text-fg-on-dark-secondary ring-1 ring-inset ring-white/15">
                  {c}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
          <nav aria-label="Tutorials" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-caption font-semibold uppercase tracking-wider text-fg-muted">
              All guides
            </p>
            <ul className="mt-4 flex flex-col gap-1">
              {tutorials.map((t) => (
                <li key={t.slug}>
                  <a
                    href={`#${t.slug}`}
                    className="flex min-h-[2.75rem] items-center rounded-md px-3 text-small text-fg-secondary transition-colors hover:bg-canvas-secondary hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {t.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-col gap-20">
            {tutorials.map((t) => (
              <article key={t.slug} id={t.slug} className="min-w-0 scroll-mt-28">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>{t.category}</Badge>
                  <span className="text-caption text-fg-muted">
                    About {t.minutes} minutes
                  </span>
                </div>
                <h2 className="mt-4 text-h3 text-fg">{t.title}</h2>
                <p className="mt-3 max-w-[62ch] text-body-lg text-fg-secondary">
                  {t.summary}
                </p>

                <div className="mt-6 rounded-xl bg-canvas-secondary p-5 ring-1 ring-inset ring-line">
                  <h3 className="font-mono text-caption uppercase tracking-wider text-fg-muted">
                    Before you start
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {t.before.map((b) => (
                      <li key={b} className="flex gap-2.5 text-small text-fg-secondary">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <ol className="mt-8 flex flex-col divide-y divide-line border-t border-line">
                  {t.steps.map((s, i) => (
                    <li key={s.title} className="flex gap-5 py-6">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-canvas-inset font-mono text-caption font-semibold text-fg"
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-body font-semibold text-fg">{s.title}</h3>
                        <p className="mt-2 max-w-[62ch] text-body text-fg-secondary">
                          {s.detail}
                        </p>
                        {s.code && (
                          <pre className="mt-3 overflow-x-auto rounded-lg bg-canvas-abyss p-4">
                            <code className="font-mono text-small text-fg-on-dark-secondary">
                              {s.code}
                            </code>
                          </pre>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 rounded-xl border-l-2 border-warning-fill bg-warning-soft p-5">
                  <h3 className="text-body font-semibold text-fg">
                    The mistake people make
                  </h3>
                  <p className="mt-2 max-w-[62ch] text-small text-fg-secondary">
                    {t.gotcha}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section surface="subtle" spacing="tight">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-h4 text-fg">Stuck on something not covered here?</h2>
            <p className="mt-2 max-w-2xl text-body text-fg-secondary">
              Support is included on every plan, and it reaches a person. There
              is also the{" "}
              <Link href="/blog" className="font-medium text-primary hover:text-primary-hover">
                blog
              </Link>{" "}
              for the why behind these, and the{" "}
              <Link href="/faq" className="font-medium text-primary hover:text-primary-hover">
                FAQ
              </Link>{" "}
              for questions about buying.
            </p>
          </div>
          <Link
            href="/support"
            className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-small font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Get help
          </Link>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
