import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { articles, articleCategories, readingMinutes } from "@/data/articles";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";

const PATH = "/blog";

export const metadata = pageMetadata({
  title: "Serverlys blog — hosting, domains, performance and AI",
  description:
    "Practical guides on hosting costs, migrations, Core Web Vitals and AI agents, written for people running a small business website.",
  path: PATH,
});

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Blog index.
 *
 * The category row is a set of labels, not filters: with five articles a
 * filter UI would be pure decoration. It becomes a real control when the
 * archive is large enough to need one.
 */
export default function BlogIndexPage() {
  const [lead, ...rest] = articles;

  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Blog", path: PATH }])} />

      <section className="relative isolate overflow-hidden bg-canvas-abyss">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_25%_-5%,rgb(34_126_255/0.3)_0%,transparent_68%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />
        <Container className="relative pb-16 pt-8 sm:pb-20 sm:pt-10">
          <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Blog" }]} tone="dark" />
          <div className="mt-10 max-w-2xl">
            <span className="font-mono text-caption uppercase text-accent-on-dark">Blog</span>
            <h1 className="mt-4 text-h1 text-white">Things worth knowing before you buy</h1>
            <p className="mt-5 text-body-lg text-fg-on-dark-secondary">
              Guides on what hosting really costs, moving a site without
              breaking it, making pages fast, and where AI agents earn their
              keep. No listicles.
            </p>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {articleCategories.map((c) => (
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
        {/* Lead article, given real hierarchy rather than an identical card. */}
        <Link
          href={`/blog/${lead.slug}`}
          className="group grid gap-8 rounded-2xl bg-canvas-secondary p-8 ring-1 ring-inset ring-line transition-colors hover:bg-canvas-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{lead.category}</Badge>
              <span className="text-caption text-fg-muted">
                {formatDate(lead.published)} · {readingMinutes(lead)} min read
              </span>
            </div>
            <h2 className="mt-4 text-h3 text-fg group-hover:text-primary">{lead.title}</h2>
            <p className="mt-4 max-w-[58ch] text-body text-fg-secondary">{lead.description}</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-small font-semibold text-primary">
              Read the guide
              <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-normal ease-hover group-hover:translate-x-0.5" aria-hidden="true">
                <path d="M3 8h9m0 0-3.5-3.5M12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
          </div>
          <div aria-hidden="true" className="hidden rounded-xl bg-canvas-abyss p-8 lg:block">
            <div className="flex flex-col gap-3">
              <div className="h-2 w-1/3 rounded-full bg-primary/60" />
              <div className="h-2 w-full rounded-full bg-white/12" />
              <div className="h-2 w-5/6 rounded-full bg-white/12" />
              <div className="h-2 w-11/12 rounded-full bg-white/12" />
              <div className="mt-3 h-2 w-1/4 rounded-full bg-accent-on-dark/60" />
              <div className="h-2 w-4/5 rounded-full bg-white/12" />
              <div className="h-2 w-2/3 rounded-full bg-white/12" />
            </div>
          </div>
        </Link>

        <ul className="mt-8 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-2">
          {rest.map((a) => (
            <li key={a.slug} className="bg-canvas">
              <Link
                href={`/blog/${a.slug}`}
                className="group flex h-full flex-col gap-3 p-7 transition-colors hover:bg-canvas-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>{a.category}</Badge>
                  <span className="text-caption text-fg-muted">{readingMinutes(a)} min read</span>
                </div>
                <h3 className="text-body-lg font-semibold text-fg group-hover:text-primary">{a.title}</h3>
                <p className="text-small text-fg-secondary">{a.description}</p>
                <span className="mt-auto pt-3 text-caption text-fg-muted">{formatDate(a.published)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
