import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { RichText } from "@/components/ui/rich-text";
import { ArticleCover } from "../_components/article-cover";
import { AUTHOR, BlogNav, PostCard } from "../_components/blog-ui";
import { ShareBar } from "../_components/share-bar";
import {
  articles,
  articleBySlug,
  articleCategories,
  categorySlug,
  readingMinutes,
  relatedArticles,
  type Block,
} from "@/data/articles";
import { pageMetadata, articleGraph, ogImageFor, canonical } from "@/lib/seo";
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

/** "Friday September 18, 2026" — the reference's article date. */
function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`)
    .toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
    .replace(",", "");
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
        <h2 id={block.id} className="mt-14 scroll-mt-28 font-display text-[28px] font-normal leading-[1.25] tracking-[-0.02em] text-fg first:mt-0 sm:text-[34px]">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-10 font-display text-[21px] font-medium leading-snug text-fg sm:text-[23px]">{block.text}</h3>
      );
    case "p":
      return (
        <p className="mt-6 text-[17px] leading-[1.75] text-fg sm:text-[19px]">
          <RichText text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul className="mt-5 flex flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[17px] leading-[1.7] text-fg sm:text-[19px]">
              <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
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
            <li key={item} className="flex gap-4 text-[17px] leading-[1.7] text-fg sm:text-[19px]">
              <span
                aria-hidden="true"
                className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-micro font-semibold text-primary"
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
        <blockquote className="mt-8 border-l-4 border-primary py-1 pl-6 font-display text-[20px] leading-[1.6] text-fg sm:text-[22px]">
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

      <BlogNav
        categories={articleCategories}
        active={article.category}
        searchIndex={articles.map((a) => ({ slug: a.slug, title: a.title, category: a.category }))}
      />

      {/* One centred reading column, as on the reference: meta row, headline,
          full-width cover, summarize/share, then the body. */}
      <article className="mx-auto w-full max-w-[760px] px-5 pb-20 pt-10 sm:px-8 sm:pt-14 [overflow-wrap:break-word]">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-caption font-semibold text-fg">
          <Link
            href={`/blog/category/${categorySlug(article.category)}`}
            className="rounded-full bg-brand-50 px-2.5 py-1 font-medium text-primary transition-colors hover:bg-brand-100"
          >
            {article.category}
          </Link>
          <time dateTime={article.published}>{formatDate(article.published)}</time>
          <span>{AUTHOR}</span>
          <span className="font-normal text-fg-muted">{readingMinutes(article)} min read</span>
        </p>
        <h1 className="mt-5 font-display text-[34px] font-normal leading-[1.15] tracking-[-0.025em] text-fg sm:text-[46px] lg:text-[52px]">
          {article.title}
        </h1>
        <ArticleCover
          slug={article.slug}
          category={article.category}
          size="lg"
          priority
          sizes="(min-width: 800px) 704px, 100vw"
          className="mt-8 aspect-[16/9.5] rounded-xl"
        />
        <ShareBar url={canonical(path)} title={article.title} />

        <div className="mt-10 border-t border-line pt-2">
          <p className="mt-6 text-[19px] leading-[1.7] text-fg-secondary sm:text-[21px]">{article.description}</p>
          {article.body.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </div>

        {/* Author box */}
        <div className="mt-16 flex gap-5 rounded-2xl bg-canvas-secondary p-6 sm:p-7">
          <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-line">
            <Image src="/brand/logo-square.png" alt="" fill sizes="56px" className="object-contain p-1.5" />
          </span>
          <div>
            <p className="text-caption font-semibold uppercase tracking-[0.06em] text-fg-muted">The author</p>
            <p className="mt-1 text-body-lg font-medium text-fg">{AUTHOR}</p>
            <p className="mt-2 text-small leading-relaxed text-fg-secondary">
              The people who run Serverlys hosting, domains and support. We write about what we see every
              day helping small businesses keep their websites fast, safe and online.
            </p>
            <Link href="/blog" className="mt-3 inline-block text-small font-semibold text-primary hover:text-primary-hover">
              More from {AUTHOR}
            </Link>
          </div>
        </div>
      </article>

      <section aria-labelledby="related-title" className="bg-canvas-secondary">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <h2 id="related-title" className="text-center font-display text-[34px] font-normal tracking-[-0.02em] text-fg sm:text-[40px]">
            Related posts
          </h2>
          <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <li key={a.slug}>
                <PostCard article={a} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta />
      <PageBreadcrumbs trail={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: article.title, path },
        ]} />
    </>
  );
}
