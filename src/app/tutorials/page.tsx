import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { tutorials, tutorialCategories } from "@/data/tutorials";
import { canonical, pageMetadata, breadcrumbGraph } from "@/lib/seo";
import { company } from "@/data/company";
import { PageHero } from "../resources/_components/page-hero";

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

      <PageHero
        trail={[
          { name: "Home", href: "/" },
          { name: "Resources", href: "/resources" },
          { name: "Tutorials" },
        ]}
        label="Tutorials"
        title="Get the job done"
        lede={
          <p>
            Complete procedures with the actual record values, settings and commands. Each
            one names the mistake people make, because that is usually why you are here.
          </p>
        }
        visual={<DnsMock />}
      >
        <ul className="mt-8 flex flex-wrap gap-2">
          {tutorialCategories.map((c) => (
            <li key={c}>
              <span className="inline-flex min-h-9 items-center rounded-full bg-canvas-secondary px-3.5 text-small font-medium text-fg ring-1 ring-line">
                {c}
              </span>
            </li>
          ))}
        </ul>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
          <nav aria-label="Tutorials" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-small font-semibold text-fg">All guides</p>
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
                <h2 className="display-md mt-4 text-fg">{t.title}</h2>
                <p className="mt-3 max-w-[62ch] text-body-lg text-fg-secondary">
                  {t.summary}
                </p>

                <div className="mt-6 rounded-2xl bg-brand-50 p-5">
                  <h3 className="text-small font-semibold text-fg">
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
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-micro font-semibold text-white"
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

                {/* Full tinted card with a leading icon; the old left-stripe
                    border was a flagged pattern (2026-10-03). */}
                <div className="mt-8 flex gap-4 rounded-2xl bg-warning-soft p-5">
                  <span aria-hidden="true" className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-warning-fill text-small font-bold text-white">!</span>
                  <div>
                  <h3 className="text-body font-semibold text-fg">
                    The mistake people make
                  </h3>
                  <p className="mt-2 max-w-[62ch] text-small text-fg-secondary">
                    {t.gotcha}
                  </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section surface="light" spacing="tight">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-50 p-7 sm:flex-row sm:items-center sm:p-8">
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

/**
 * The first tutorial's subject, drawn: a DNS zone with the records a site
 * and its mail need. Values are documentation addresses (RFC 5737) and
 * placeholders, so nothing here points anywhere real.
 */
function DnsMock() {
  const rows = [
    ["A", "@", "192.0.2.10"],
    ["CNAME", "www", "yourbrand.com"],
    ["MX", "@", "mail.yourbrand.com"],
    ["TXT", "@", "v=spf1 include:_spf… ~all"],
  ];
  return (
    <div aria-hidden="true" className="mx-auto max-w-[480px] overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
      <div className="flex items-center justify-between border-b border-line-subtle px-4 py-3">
        <span className="text-small font-semibold text-fg">DNS zone · yourbrand.com</span>
        <span className="rounded-md bg-primary px-2.5 py-1 text-micro font-semibold text-white">Add record</span>
      </div>
      <table className="w-full text-left text-micro">
        <thead className="bg-canvas-secondary text-fg-muted">
          <tr>
            <th className="px-4 py-2 font-medium">Type</th>
            <th className="px-4 py-2 font-medium">Name</th>
            <th className="px-4 py-2 font-medium">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-subtle">
          {rows.map(([t, n, v]) => (
            <tr key={t + n}>
              <td className="px-4 py-2.5"><span className="rounded bg-brand-50 px-1.5 py-0.5 font-semibold text-primary">{t}</span></td>
              <td className="px-4 py-2.5 text-fg">{n}</td>
              <td className="max-w-0 truncate px-4 py-2.5 text-fg-secondary">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="flex items-center gap-2 border-t border-line-subtle px-4 py-3 text-micro text-success">
        <span className="size-1.5 rounded-full bg-success-fill" />
        Propagated · HTTPS certificate issued
      </p>
    </div>
  );
}
