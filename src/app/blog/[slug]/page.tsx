import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { RichText } from "@/components/ui/rich-text";
import { ArticleThumb } from "../_components/article-thumb";
import {
  articles,
  articleBySlug,
  readingMinutes,
  relatedArticles,
  type Block,
} from "@/data/articles";
import { company, billing } from "@/data/company";
import { pageMetadata, articleGraph, ogImageFor } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

/**
 * Article.
 *
 * Statically generated from data/articles — generateStaticParams enumerates
 * every slug, so there is no dynamic rendering and no runtime fetch. An
 * unknown slug 404s rather than rendering an empty shell.
 */
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const article = articleBySlug(slug);
  if (!article) return {};

  // No " | Serverlys" suffix on articles. Headlines are already 50-55
  // characters, and the brand suffix pushes them past the ~60 the SERP shows —
  // truncating the part that earns the click. Google appends the site name to
  // article results anyway.
  const base = pageMetadata({
    title: article.title,
    description: article.description,
    path: `/blog/${article.slug}`,
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: article.published,
      section: article.category,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * One block.
 *
 * h2s carry ids so the contents list can link to them; h3s deliberately do not
 * (see the Block type). Every text surface goes through RichText so the inline
 * markers render rather than showing as literal asterisks and brackets.
 */
function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={block.id} className="mt-14 scroll-mt-28 text-h3 font-medium tracking-[-0.02em] text-fg first:mt-0">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-10 text-body-lg font-semibold text-fg">{block.text}</h3>
      );
    case "p":
      return (
        <p className="mt-5 text-body text-fg-secondary">
          <RichText text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul className="mt-5 flex flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-body text-fg-secondary">
              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-5 flex flex-col gap-4">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-4 text-body text-fg-secondary">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-micro font-semibold text-primary"
              >
                {i + 1}
              </span>
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <aside className="mt-8 rounded-2xl bg-brand-50 p-6">
          <p className="text-body font-semibold text-fg">{block.title}</p>
          <p className="mt-2 text-small text-fg-secondary">
            <RichText text={block.text} />
          </p>
        </aside>
      );
    case "quote":
      return (
        <blockquote className="mt-8 rounded-2xl bg-canvas-secondary px-6 py-5 text-body-lg text-fg">
          <RichText text={block.text} />
        </blockquote>
      );
    case "code":
      return (
        /*
         * The article column is 68ch; a config snippet is routinely wider. The
         * scroll container is on the <pre> so the PAGE never scrolls
         * horizontally — a body-level overflow on mobile is the failure mode
         * this layout is most prone to.
         */
        <pre className="mt-6 min-w-0 overflow-x-auto rounded-xl bg-canvas-abyss p-5 text-small">
          <code className="font-mono text-fg-on-dark-secondary">{block.code}</code>
        </pre>
      );
    case "table":
      return (
        <div className="mt-6 min-w-0 overflow-x-auto rounded-xl ring-1 ring-inset ring-line">
          <table className="w-full border-collapse text-left text-small">
            {block.head.length > 0 && (
              <thead className="bg-canvas-secondary">
                <tr>
                  {block.head.map((cell) => (
                    <th
                      key={cell}
                      scope="col"
                      className="border-b border-line px-4 py-3 font-semibold text-fg"
                    >
                      <RichText text={cell} />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-b border-line last:border-0">
                  {/*
                    Rows are padded to the header width rather than trusted to
                    match it: the source markup these were ported from has
                    ragged rows, and a short row would otherwise silently drop
                    the columns after it.
                  */}
                  {Array.from({ length: Math.max(block.head.length, row.length) }).map(
                    (_, c) => (
                      <td key={c} className="px-4 py-3 align-top text-fg-secondary">
                        <RichText text={row[c] ?? ""} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function ArticlePage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  const path = `/blog/${article.slug}`;
  const headings = article.body.filter((b) => b.type === "h2");
  const related = relatedArticles(article);

  return (
    <>
      <JsonLd
        data={articleGraph({
          headline: article.title,
          description: article.description,
          path,
          published: article.published,
          image: ogImageFor(path),
          section: article.category,
        })}
      />

      {/* 2026-10-03: light article header with the category thumbnail,
          in place of the dark band and its mono category label. */}
      <section className="relative isolate overflow-hidden bg-canvas">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]" />
        <Container className="pb-12 pt-6 sm:pb-16 lg:pt-10">
          <Breadcrumbs
            trail={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: article.category }]}
            tone="light"
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
            <div>
              <span className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-small font-medium text-primary">
                {article.category}
              </span>
              <h1 className="display-lg mt-5 text-fg">{article.title}</h1>
              <p className="mt-5 max-w-[60ch] text-body-lg text-fg-secondary">{article.description}</p>
              <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-fg-secondary">
                <span className="font-medium text-fg">{company.name}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={article.published}>{formatDate(article.published)}</time>
                <span aria-hidden="true">·</span>
                {readingMinutes(article)} min read
              </p>
            </div>
            <ArticleThumb category={article.category} size="lg" className="aspect-[4/3] rounded-3xl" />
          </div>
        </Container>
      </section>

      <Section spacing="tight">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
          {/*
            min-w-0 is required, not cosmetic. A grid item defaults to
            `min-width: auto`, which means it refuses to shrink below its
            content's min-content width — so a wide table or code block inside
            pushes the article column past the viewport and the whole PAGE
            scrolls sideways on a phone, `overflow-x-auto` on the inner
            container notwithstanding. That inner scroll only works once the
            column itself is allowed to be narrower than its contents.
          */}
          {/* `overflow-wrap: break-word` on the whole column, not just on
              <code>. Article prose quotes raw strings in places that are not
              code spans — `/blog/mysql-database-guide` puts a PHP DSN
              (`mysql:host=localhost;dbname=…`) inside a <blockquote>, which has
              no spaces to break at and pushed the layout viewport to 608px on
              every phone width up to 430. `break-word` rather than `anywhere`
              because this applies to ordinary sentences too: it breaks a word
              only when that word cannot otherwise fit, and leaves intrinsic
              sizing alone. Inline <code> keeps the stricter `anywhere` — see
              components/ui/rich-text.tsx. */}
          <article className="min-w-0 max-w-[68ch] [overflow-wrap:break-word]">
            {article.body.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}

            <div className="mt-14 rounded-2xl bg-canvas-secondary p-7">
              <p className="text-body text-fg-secondary">
                Questions about anything above? We answer them without a sales
                script.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href={billing.sales}>Talk to us</Button>
                <Button href="/pricing" variant="secondary">
                  See pricing
                </Button>
              </div>
            </div>
          </article>

          {/* Contents. Native anchors, sticky on desktop only. */}
          {headings.length > 1 && (
            <nav aria-label="On this page" className="order-first lg:order-none lg:sticky lg:top-24 lg:self-start">
              <p className="text-small font-semibold text-fg">On this page</p>
              <ul className="mt-4 flex flex-col gap-1">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="flex min-h-[2.5rem] items-center rounded-md px-3 text-small text-fg-secondary transition-colors hover:bg-brand-50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </Section>

      <Section surface="subtle">
        <h2 className="display-md text-fg">Keep reading</h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {related.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/blog/${a.slug}`}
                className="group flex h-full flex-col gap-3 rounded-2xl bg-canvas p-3 pb-6 ring-1 ring-line transition-shadow hover:shadow-e3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <ArticleThumb category={a.category} className="aspect-[16/9]" />
                <span className="px-3 pt-2"><Badge>{a.category}</Badge></span>
                <h3 className="px-3 text-body font-semibold text-fg group-hover:text-primary">{a.title}</h3>
                <p className="px-3 text-small text-fg-secondary">{a.description}</p>
                <span className="mt-auto px-3 pt-3 text-caption text-fg-muted">
                  {readingMinutes(a)} min read
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />
      <PageBreadcrumbs trail={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: article.title, path },
        ]} />
    </>
  );
}
