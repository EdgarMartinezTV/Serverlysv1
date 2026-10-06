import Link from "next/link";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import {
  articles,
  articleCategories,
  articlesByCategory,
  categoryDescriptions,
  categorySlug,
} from "@/data/articles";
import { collectionGraph, pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { ArticleThumb } from "./_components/article-thumb";
import { AUTHOR, BlogNav, Byline, PostCard, ViewAll, listDate } from "./_components/blog-ui";
import { StoryList } from "./_components/story-list";

const PATH = "/blog";

export const metadata = pageMetadata({
  title: "Serverlys blog — hosting, domains, performance and AI",
  description:
    "Practical guides on hosting, WordPress, performance, security and domains — written for people running a small business website, not for other agencies.",
  path: PATH,
});

/**
 * Blog index, laid out after Hostinger's blog (2026-10-05): a category bar,
 * a featured story, one section per category with its three newest posts and
 * "View all", then every article in a paginated "All stories" list.
 *
 * Every article stays linked from this page (the All stories list renders all
 * of them; pagination only hides), and each category has its own archive at
 * /blog/category/<slug>.
 */
export default function BlogIndexPage() {
  const [lead] = articles;
  const searchIndex = articles.map((a) => ({ slug: a.slug, title: a.title, category: a.category }));

  return (
    <>
      <JsonLd
        data={collectionGraph({
          name: "Serverlys blog",
          description:
            "Practical guides on hosting, WordPress, performance, security and domains for small business websites.",
          path: PATH,
          items: articles.slice(0, 13).map((a) => ({ name: a.title, path: `/blog/${a.slug}` })),
        })}
      />

      <BlogNav categories={articleCategories} active="all" searchIndex={searchIndex} />
      <h1 className="sr-only">Serverlys blog</h1>

      {/* ── Featured story ─────────────────────────────────────────────── */}
      <section aria-labelledby="featured-title" className="bg-canvas">
        <div className="mx-auto max-w-[1280px] px-5 pb-16 pt-12 sm:px-8 lg:px-10 lg:pb-20 lg:pt-16">
          <Link
            href={`/blog/${lead.slug}`}
            className="group grid items-center gap-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:grid-cols-[1.05fr_1fr] lg:gap-12"
          >
            <ArticleThumb category={lead.category} size="lg" className="aspect-[16/10] rounded-xl" />
            <div>
              <p className="text-caption font-semibold uppercase tracking-[0.08em] text-fg-secondary">Featured story</p>
              <h2
                id="featured-title"
                className="mt-3 font-display text-[26px] font-normal leading-[1.3] tracking-[-0.015em] text-fg transition-colors group-hover:text-primary sm:text-[30px]"
              >
                {lead.title}
              </h2>
              <p className="mt-4 line-clamp-3 max-w-[56ch] text-body text-fg-secondary">{lead.description}</p>
              <div className="mt-6">
                <Byline date={lead.published} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── One section per category, alternating grounds ───────────────── */}
      {articleCategories.map((category, i) => {
        const posts = articlesByCategory(category).slice(0, 3);
        const slug = categorySlug(category);
        return (
          <section
            key={category}
            id={slug}
            aria-labelledby={`${slug}-title`}
            className={cn("scroll-mt-24", i % 2 === 0 ? "bg-canvas-secondary" : "bg-canvas")}
          >
            <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
              <h2 id={`${slug}-title`} className="font-display text-[34px] font-normal tracking-[-0.02em] text-fg sm:text-[40px]">
                {category}
              </h2>
              <p className="mt-3 max-w-[70ch] text-small text-fg-secondary">{categoryDescriptions[category]}</p>
              <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((a) => (
                  <li key={a.slug}>
                    <PostCard article={a} />
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <ViewAll href={`/blog/category/${slug}`} label={`View all ${category} articles`} />
              </div>
            </div>
          </section>
        );
      })}

      {/* ── All stories ──────────────────────────────────────────────────── */}
      <section aria-labelledby="all-stories-title" className={articleCategories.length % 2 === 0 ? "bg-canvas-secondary" : "bg-canvas"}>
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <h2 id="all-stories-title" className="font-display text-[34px] font-normal tracking-[-0.02em] text-fg sm:text-[40px]">
            All stories
          </h2>
          <p className="mt-3 text-small text-fg-secondary">
            Every guide we have published on hosting, domains, performance, security and AI — newest first.
          </p>
          <StoryList
            stories={articles.map((a) => ({
              slug: a.slug,
              title: a.title,
              description: a.description,
              category: a.category,
              date: listDate(a.published),
              author: AUTHOR,
            }))}
          />
        </div>
      </section>

      <FinalCta />
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Blog", path: PATH }]} />
    </>
  );
}
