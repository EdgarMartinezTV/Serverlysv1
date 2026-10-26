import type { Industry, Locale } from "./types";
import { salon } from "./salon";
import { lawyer } from "./lawyer";

/**
 * Industry website pages, in display order. Each lives in its own file so the
 * copy for one trade can be reviewed (and corrected) without touching another.
 * Adding a file here is enough: routes, sitemaps, hubs and OG cards read this.
 */
export const industries: readonly Industry[] = [salon, lawyer];

const bySlug = new Map(industries.map((i) => [i.slug, i]));

export function industryBySlug(slug: string): Industry | undefined {
  return bySlug.get(slug);
}

export function industryPath(slug: string, locale: Locale): string {
  return locale === "es" ? `/es/website-design/${slug}` : `/website-design/${slug}`;
}

export const INDUSTRY_HUB = { en: "/website-design/industries", es: "/es/website-design/industries" } as const;
