import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import {
  articles,
  articleCategories,
  articlesByCategory,
  categoryBySlug,
  categoryDescriptions,
  categorySlug,
} from "@/data/articles";
import { collectionGraph, pageMetadata } from "@/lib/seo";
import { AUTHOR, BlogNav, PostCard, listDate } from "../../_components/blog-ui";
import { StoryList } from "../../_components/story-list";

/**
 * A category archive — where each "View all" on the blog index leads. The
 * three newest as cards, then every article in the category as a list.
 */

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return articleCategories.map((c) => ({ category: categorySlug(c) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categoryBySlug((await params).category);
  if (!category) return {};
  return pageMetadata({
    title: `${category} articles | Serverlys blog`,
    description: categoryDescriptions[category],
    path: `/blog/category/${categorySlug(category)}`,
  });
}

export default async function BlogCategoryPage({ params }: Props) {
  const category = categoryBySlug((await params).category);
  if (!category) notFound();

  const path = `/blog/category/${categorySlug(category)}`;
  const posts = articlesByCategory(category);
  const searchIndex = articles.map((a) => ({ slug: a.slug, title: a.title, category: a.category }));

  return (
    <>
      <JsonLd
        data={collectionGraph({
          name: `${category} articles`,
          description: categoryDescriptions[category],
          path,
          items: posts.map((a) => ({ name: a.title, path: `/blog/${a.slug}` })),
        })}
      />

      <BlogNav categories={articleCategories} active={category} searchIndex={searchIndex} />

      <section aria-labelledby="category-title" className="bg-canvas">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <h1 id="category-title" className="font-display text-[40px] font-normal tracking-[-0.02em] text-fg sm:text-[52px]">
            {category}
          </h1>
          <p className="mt-3 max-w-[70ch] text-body text-fg-secondary">{categoryDescriptions[category]}</p>
          <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((a) => (
              <li key={a.slug}>
                <PostCard article={a} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="category-all" className="bg-canvas-secondary">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <h2 id="category-all" className="font-display text-[34px] font-normal tracking-[-0.02em] text-fg">
            All {category} stories
          </h2>
          <p className="mt-3 text-small text-fg-secondary">
            {posts.length} {posts.length === 1 ? "article" : "articles"}, newest first.
          </p>
          <StoryList
            stories={posts.map((a) => ({
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
      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: category, path },
        ]}
      />
    </>
  );
}
