import Image from "next/image";
import Link from "next/link";
import { categorySlug, readingMinutes, type Article, type ArticleCategory } from "@/data/articles";
import { cn } from "@/lib/utils";
import { ArticleThumb } from "./article-thumb";
import { BlogSearch } from "./blog-search";

/**
 * Shared pieces of the blog, laid out after Hostinger's blog: a coloured
 * category bar under the header, a featured story, category sections of three
 * cards with "View all", and a paginated "All stories" list.
 */

export const AUTHOR = "Serverlys team";

/** "05 Oct, 2026" — the reference's card date. */
export function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${day} ${month}, ${d.getUTCFullYear()}`;
}

/** "Sep 30, 2026" — the reference's list date. */
export function listDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** The category bar. `active` is "all" on the index, else the category. */
export function BlogNav({
  categories,
  active,
  searchIndex,
}: {
  categories: readonly ArticleCategory[];
  active: "all" | ArticleCategory;
  searchIndex: ReadonlyArray<{ slug: string; title: string; category: string }>;
}) {
  const items = [{ label: "All Blogs", href: "/blog", key: "all" as const }, ...categories.map((c) => ({ label: c, href: `/blog/category/${categorySlug(c)}`, key: c }))];
  return (
    <nav aria-label="Blog categories" className="relative bg-primary">
      <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-5 sm:px-8 lg:px-10">
        <ul className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((it) => {
            const on = it.key === active;
            return (
              <li key={it.key} className="shrink-0">
                <Link
                  href={it.href}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center rounded-md px-3 text-small font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                    on ? "bg-white/20" : "hover:bg-white/10",
                  )}
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <BlogSearch index={searchIndex} />
      </div>
    </nav>
  );
}

/** One article card: thumbnail, "date • CATEGORY • n min", title, excerpt. */
export function PostCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <ArticleThumb category={article.category} className="aspect-[16/10.5] rounded-lg transition-transform duration-normal ease-hover group-hover:-translate-y-0.5" />
      <p className="mt-5 text-caption uppercase tracking-[0.02em] text-fg-secondary">
        {shortDate(article.published)} <span aria-hidden="true">•</span> {article.category}{" "}
        <span aria-hidden="true">•</span> <span className="normal-case">{readingMinutes(article)}min</span>
      </p>
      <h3 className="mt-2 font-display text-[19px] font-normal leading-[1.35] tracking-[-0.01em] text-fg transition-colors group-hover:text-primary">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-small text-fg-secondary">{article.description}</p>
    </Link>
  );
}

/** "Serverlys team" byline with the brand mark as the avatar. */
export function Byline({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-line">
        <Image src="/brand/logo-square.png" alt="" fill sizes="40px" className="object-contain p-1" />
      </span>
      <span className="text-small leading-tight">
        <span className="block font-medium text-fg">{AUTHOR}</span>
        <span className="block text-fg-muted">{listDate(date)}</span>
      </span>
    </div>
  );
}

/** "View all" with the reference's plain link treatment. */
export function ViewAll({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      View all
    </Link>
  );
}
