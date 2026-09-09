import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import {
  articles,
  articleBySlug,
  readingMinutes,
  relatedArticles,
  type Block,
} from "@/data/articles";
import { company } from "@/data/company";
import { pageMetadata, breadcrumbGraph, articleGraph } from "@/lib/seo";

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

/** One block. Headings carry ids so the contents list can link to them. */
function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={block.id} className="mt-14 scroll-mt-28 text-h4 text-fg first:mt-0">
          {block.text}
        </h2>
      );
    case "p":
      return <p className="mt-5 text-body text-fg-secondary">{block.text}</p>;
    case "ul":
      return (
        <ul className="mt-5 flex flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-body text-fg-secondary">
              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
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
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-canvas-inset font-mono text-caption text-fg"
              >
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <aside className="mt-8 rounded-xl border-l-2 border-primary bg-canvas-secondary p-6">
          <p className="text-body font-semibold text-fg">{block.title}</p>
          <p className="mt-2 text-small text-fg-secondary">{block.text}</p>
        </aside>
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
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: article.title, path },
        ])}
      />
      <JsonLd
        data={articleGraph({
          headline: article.title,
          description: article.description,
          path,
          published: article.published,
          section: article.category,
        })}
      />

      <section className="relative isolate overflow-hidden bg-canvas-abyss">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_25%_-5%,rgb(34_126_255/0.28)_0%,transparent_68%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />
        <Container className="relative pb-14 pt-8 sm:pb-16 sm:pt-10">
          <Breadcrumbs
            trail={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: article.category }]}
            tone="dark"
          />
          <div className="mt-10 max-w-3xl">
            <span className="font-mono text-caption uppercase text-accent-on-dark">
              {article.category}
            </span>
            <h1 className="mt-4 text-h2 text-white">{article.title}</h1>
            <p className="mt-5 text-body-lg text-fg-on-dark-secondary">{article.description}</p>
            <p className="mt-6 text-small text-fg-on-dark-muted">
              {company.name} ·{" "}
              <time dateTime={article.published}>{formatDate(article.published)}</time> ·{" "}
              {readingMinutes(article)} min read
            </p>
          </div>
        </Container>
      </section>

      <Section spacing="tight">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
          <article className="max-w-[68ch]">
            {article.body.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}

            <div className="mt-14 border-t border-line pt-8">
              <p className="text-body text-fg-secondary">
                Questions about anything above? We answer them without a sales
                script.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/contact">Talk to us</Button>
                <Button href="/pricing" variant="secondary">
                  See pricing
                </Button>
              </div>
            </div>
          </article>

          {/* Contents. Native anchors, sticky on desktop only. */}
          {headings.length > 1 && (
            <nav aria-label="On this page" className="order-first lg:order-none lg:sticky lg:top-24 lg:self-start">
              <p className="text-caption font-semibold uppercase tracking-wider text-fg-muted">
                On this page
              </p>
              <ul className="mt-4 flex flex-col gap-1 border-l border-line">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="flex min-h-[2.5rem] items-center border-l-2 border-transparent px-3 text-small text-fg-secondary transition-colors hover:border-primary hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
        <h2 className="text-h4 text-fg">Keep reading</h2>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-3">
          {related.map((a) => (
            <li key={a.slug} className="bg-canvas">
              <Link
                href={`/blog/${a.slug}`}
                className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-canvas-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              >
                <Badge>{a.category}</Badge>
                <h3 className="text-body font-semibold text-fg group-hover:text-primary">{a.title}</h3>
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
