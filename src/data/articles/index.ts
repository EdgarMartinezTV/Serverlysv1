import type { Article, ArticleCategory, Block } from "./types";
import { originalArticles } from "./original";
import { legacyArticles } from "./legacy";

export type { Article, ArticleCategory, Block };

/**
 * Every article on the site.
 *
 * Two sources, deliberately kept apart on disk:
 *
 *   · `original` — written for this rebuild, by hand.
 *   · `legacy`   — the 71 posts that were live and indexed on the previous
 *                  serverlys.com. They were ported rather than dropped because
 *                  they are the archive Google already ranks; deleting them at
 *                  cutover would have turned 71 ranking URLs into 404s and
 *                  thrown away the topical authority that makes the commercial
 *                  pages rank at all.
 *
 * They merge into one list here because nothing downstream should care which
 * is which — same type, same rules, same rendering.
 *
 * SORTED NEWEST FIRST, and that sort is load-bearing: the blog index takes the
 * head of this list as its lead article, and "whatever happened to be first in
 * the file" is not an editorial decision.
 */
export const articles: readonly Article[] = [...originalArticles, ...legacyArticles].sort(
  (a, b) => b.published.localeCompare(a.published),
);

const bySlug = new Map(articles.map((a) => [a.slug, a]));

export function articleBySlug(slug: string): Article | undefined {
  return bySlug.get(slug);
}

/** Words per minute for reading time. Deliberately conservative. */
const WPM = 220;

function blockText(block: Block): string {
  switch (block.type) {
    case "ul":
    case "ol":
      return block.items.join(" ");
    case "callout":
      return `${block.title} ${block.text}`;
    case "table":
      return [...block.head, ...block.rows.flat()].join(" ");
    /*
     * Code is excluded from the word count, not counted at 220wpm. Nobody
     * reads an nginx block at prose speed, and counting it inflated the
     * estimate on the technical posts to the point of being useless.
     */
    case "code":
      return "";
    default:
      return block.text;
  }
}

export function readingMinutes(article: Article): number {
  return Math.max(1, Math.round(wordCount(article) / WPM));
}

/** Total prose words. Used by reading time and the editorial audit script. */
export function wordCount(article: Article): number {
  return article.body.reduce((n, block) => {
    const text = blockText(block).trim();
    return n + (text ? text.split(/\s+/).length : 0);
  }, 0);
}

export function articlesByCategory(category: ArticleCategory): readonly Article[] {
  return articles.filter((a) => a.category === category);
}

/**
 * A stable offset in [0, span) derived from a slug.
 *
 * ⚠ DETERMINISTIC BY REQUIREMENT, NOT BY PREFERENCE. These pages are statically
 * generated, so the same slug must produce the same neighbours on every build —
 * otherwise the internal link graph reshuffles on each deploy, which churns
 * crawl signals for no editorial reason. `Math.random()` would be a bug here,
 * not a shortcut.
 */
function stableOffset(slug: string, span: number): number {
  if (span <= 0) return 0;
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) h = (h * 31 + slug.charCodeAt(i)) % 1_000_003;
  return h % span;
}

/**
 * Related reading.
 *
 * ⚠ THIS WALKS A CYCLE RATHER THAN TAKING THE FIRST THREE, AND THE DIFFERENCE
 * IS AN INTERNAL-LINKING BUG WORTH SPELLING OUT.
 *
 * It used to be `[...sameCategory, ...rest].slice(0, limit)`. That returns the
 * first three articles in ARRAY ORDER, which means every article in a category
 * points at the same three — so in Hosting, all 18 articles linked to the same
 * 3 and the remaining 15 received no inbound link from any related module at
 * all. Measured on the built site: 18 articles had exactly ONE inbound internal
 * link, which was the blog index. Whatever internal authority these clusters
 * pass was landing on 3 posts per category and starving the rest.
 *
 * Walking forward cyclically from the article's own position fixes the
 * distribution exactly: in a category of k > limit articles, every article
 * links to the `limit` that follow it and therefore RECEIVES exactly `limit`
 * inbound links. No article is starved and none is over-weighted.
 *
 * ⚠ THE PADDING IS ALSO ROTATED. AI and Ecommerce hold two articles each, so
 * the same-category walk cannot fill three slots and the remainder comes from
 * other categories. Taking those from the top of the array would recreate the
 * original fault in miniature — every small-category article padding onto the
 * same first few posts — so the padding starts at a slug-derived offset.
 *
 * Still same-category first: these links are topical signals, not filler.
 */
export function relatedArticles(article: Article, limit = 3): readonly Article[] {
  const pool = articlesByCategory(article.category);
  const index = pool.findIndex((a) => a.slug === article.slug);
  const picked: Article[] = [];

  /*
   * `step` starts at 1 so the article never selects itself, and stops before a
   * full lap so it cannot select itself on the wrap either.
   */
  if (index >= 0) {
    for (let step = 1; step < pool.length && picked.length < limit; step += 1) {
      picked.push(pool[(index + step) % pool.length]);
    }
  }

  if (picked.length < limit) {
    const rest = articles.filter((a) => a.category !== article.category);
    const offset = stableOffset(article.slug, rest.length);
    for (let step = 0; step < rest.length && picked.length < limit; step += 1) {
      picked.push(rest[(offset + step) % rest.length]);
    }
  }

  return picked;
}

/**
 * Categories that actually have articles, in a fixed editorial order rather
 * than whatever order the archive happens to be sorted in — the order is the
 * navigation, and it should not change when someone publishes a post.
 */
const CATEGORY_ORDER: readonly ArticleCategory[] = [
  "Hosting",
  "WordPress",
  "Performance",
  "Security",
  "Domains",
  "Ecommerce",
  "AI",
  "Getting started",
];

export const articleCategories: readonly ArticleCategory[] = CATEGORY_ORDER.filter((c) =>
  articles.some((a) => a.category === c),
);

/**
 * Stable id for a category. Used as the in-page anchor target on the blog
 * index — there are no category routes, so this never appears in a URL path.
 */
export function categorySlug(category: ArticleCategory): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}
