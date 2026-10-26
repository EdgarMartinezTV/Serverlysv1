import type { Industry, Locale } from "./types";
import { salon } from "./salon";
import { lawyer } from "./lawyer";
import { accounting } from "./accounting";
import { mortgage } from "./mortgage";
import { consulting } from "./consulting";
import { coaching } from "./coaching";
import { lifeCoach } from "./life-coach";
import { architect } from "./architect";
import { contractor } from "./contractor";
import { construction } from "./construction";
import { roofing } from "./roofing";
import { electrician } from "./electrician";
import { handyman } from "./handyman";
import { landscaping } from "./landscaping";
import { dental } from "./dental";
import { medical } from "./medical";
import { chiropractic } from "./chiropractic";
import { therapist } from "./therapist";
import { artist } from "./artist";
import { serviceBusiness } from "./service-business";

/**
 * Industry website pages, in display order. Each lives in its own file so the
 * copy for one trade can be reviewed (and corrected) without touching another.
 * Adding a file here is enough: routes, sitemaps, hubs and OG cards read this.
 */
export const industries: readonly Industry[] = [
  salon,
  lawyer,
  accounting,
  mortgage,
  consulting,
  coaching,
  lifeCoach,
  architect,
  contractor,
  construction,
  roofing,
  electrician,
  handyman,
  landscaping,
  dental,
  medical,
  chiropractic,
  therapist,
  artist,
  serviceBusiness,
];

const bySlug = new Map(industries.map((i) => [i.slug, i]));

export function industryBySlug(slug: string): Industry | undefined {
  return bySlug.get(slug);
}

export function industryPath(slug: string, locale: Locale): string {
  return locale === "es" ? `/es/website-design/${slug}` : `/website-design/${slug}`;
}

export const INDUSTRY_HUB = { en: "/website-design/industries", es: "/es/website-design/industries" } as const;
