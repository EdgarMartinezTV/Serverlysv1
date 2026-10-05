import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import {
  articles,
  articleCategories,
  articlesByCategory,
  categorySlug,
  readingMinutes,
} from "@/data/articles";
import { pageMetadata, collectionGraph } from "@/lib/seo";
import { ArticleThumb } from "./_components/article-thumb";
import { PageHero } from "../resources/_components/page-hero";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

const PATH = "/blog";

export const metadata = pageMetadata({
  title: "Serverlys blog — hosting, domains, performance and AI",
  description:
    "Practical guides on hosting, WordPress, performance, security and domains — written for people running a small business website, not for other agencies.",
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
 * The category row used to be a set of inert labels, on the reasoning that a
 * filter over five articles would be decoration. The archive is 76 now, so
 * they jump to the matching section of the grouped archive below.
 *
 * The page shows the newest article with real hierarchy, then the rest of the
 * recent ones, then the whole archive grouped by subject. That last part
 * matters for more than browsing: it is the only place every article is linked
 * from a single page, which is what stops a post 60 items down the list being
 * effectively orphaned.
 */
const RECENT_COUNT = 12;

export default function BlogIndexPage() {
  const [lead, ...rest] = articles;
  const recent = rest.slice(0, RECENT_COUNT);

  return (
    <>
      <JsonLd
        data={collectionGraph({
          name: "Serverlys blog",
          description:
            "Practical guides on hosting, WordPress, performance, security and domains for small business websites.",
          path: PATH,
          // The lead and the recent list — not all 76. An ItemList claiming to
          // be the page's main entity should describe what the page actually
          // leads with, and a 76-item list is not that.
          items: [lead, ...recent].map((a) => ({ name: a.title, path: `/blog/${a.slug}` })),
        })}
      />

      <PageHero
        center
        trail={[{ name: "Home", href: "/" }, { name: "Blog" }]}
        label="Blog"
        title="Things worth knowing before you buy"
        lede={
          <p>
            Guides on what hosting really costs, moving a site without breaking it, making
            pages fast, and where AI agents earn their keep. No listicles.
          </p>
        }
      >
        {/* In-page anchors to the grouped archive below; there are no
            category routes (see the note on the archive). */}
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {articleCategories.map((c) => (
            <li key={c}>
              <a
                href={`#${categorySlug(c)}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-canvas-secondary px-4 text-small font-medium text-fg ring-1 ring-line transition-colors hover:bg-brand-50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {c}
                <span className="text-fg-muted">{articlesByCategory(c).length}</span>
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      <Section>
        {/* Lead article, given real hierarchy rather than an identical card. */}
        <Link
          href={`/blog/${lead.slug}`}
          className="group grid gap-8 rounded-3xl bg-canvas-secondary p-4 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-5 lg:grid-cols-[1.1fr_1fr] lg:items-center"
        >
          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{lead.category}</Badge>
              <span className="text-caption text-fg-muted">
                {formatDate(lead.published)} · {readingMinutes(lead)} min read
              </span>
            </div>
            <h2 className="display-md mt-4 text-fg group-hover:text-primary">{lead.title}</h2>
            <p className="mt-4 max-w-[58ch] text-body text-fg-secondary">{lead.description}</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-small font-semibold text-primary">
              Read the guide
              <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-normal ease-hover group-hover:translate-x-0.5" aria-hidden="true">
                <path d="M3 8h9m0 0-3.5-3.5M12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
          </div>
          <ArticleThumb category={lead.category} size="lg" className="aspect-[16/10] rounded-2xl lg:order-first" />
        </Link>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/blog/${a.slug}`}
                className="group flex h-full flex-col gap-3 rounded-2xl bg-canvas p-3 pb-6 ring-1 ring-line transition-shadow hover:shadow-e3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <ArticleThumb category={a.category} className="aspect-[16/9]" />
                <div className="flex flex-wrap items-center gap-3 px-3 pt-2">
                  <Badge>{a.category}</Badge>
                  <span className="text-caption text-fg-muted">{readingMinutes(a)} min read</span>
                </div>
                <h3 className="px-3 text-body-lg font-medium text-fg group-hover:text-primary">{a.title}</h3>
                <p className="px-3 text-small text-fg-secondary">{a.description}</p>
                <span className="mt-auto px-3 pt-3 text-caption text-fg-muted">{formatDate(a.published)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* The full archive, grouped. Every article is linked from here. */}
      <Section surface="subtle">
        <h2 className="display-md text-fg">Everything, by subject</h2>
        <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
          {articles.length} articles across {articleCategories.length} subjects.
        </p>

        <div className="mt-12 flex flex-col gap-12">
          {articleCategories.map((category) => {
            const posts = articlesByCategory(category);
            return (
              <div key={category} id={categorySlug(category)} className="scroll-mt-24">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
                  <h3 className="text-h4 font-medium text-fg">{category}</h3>
                  <span className="text-small text-fg-muted">
                    {posts.length} {posts.length === 1 ? "article" : "articles"}
                  </span>
                </div>
                <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/blog/${a.slug}`}
                        className="block py-1 text-small text-fg-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      <FinalCta />
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Blog", path: PATH }]} />
    </>
  );
}
