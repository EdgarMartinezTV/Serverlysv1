/**
 * Industry website pages — /website-design/<slug> and /es/website-design/<slug>.
 *
 * Modelled on hostinger.com/website-builder/<niche> (same 21 industries), but
 * built to Google's scaled-content rules: every field below is written for
 * that trade, in both languages, and the page renders nothing generic beyond
 * headings and the design-plan prices. If an industry has nothing specific to
 * say in a field, leave the optional field out rather than filling it.
 *
 * Serverlys sells done-for-you website design (data/design-plans.ts), not a
 * site builder. Copy must describe what WE build for them, never imply a
 * drag-and-drop tool, and never claim results (rankings, leads, revenue).
 */
export type Locale = "en" | "es";

export type IndustryCopy = {
  /** Plural trade name used in headings, e.g. "Salons and barbershops". */
  name: string;
  /** ≤60 chars incl. " | Serverlys". */
  metaTitle: string;
  /** ≤155 chars. */
  metaDescription: string;
  h1: string;
  /** Answer-first, 40–60 words: what we build for this trade and from what price. */
  lede: string;
  /** 5–6 features this trade's site needs, each specific to the trade. */
  needs: ReadonlyArray<{ title: string; text: string }>;
  /** The pages a typical site for this trade has (6–9). */
  pages: readonly string[];
  /** Tools this trade commonly connects (booking, CRM, payments…). Real product categories or well-known names only. */
  integrations: readonly string[];
  /** Rules that shape this trade's website (advertising, privacy, licensing). Only real, general rules. */
  rules?: { title: string; text: string };
  /** 4–5 questions this trade asks before hiring a web designer. */
  faq: ReadonlyArray<{ question: string; answer: string }>;
};

export type Industry = {
  slug: string;
  en: IndustryCopy;
  es: IndustryCopy;
  /** Other industry slugs to cross-link (3). */
  related: readonly string[];
};
