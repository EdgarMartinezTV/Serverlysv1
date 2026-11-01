import type { CleaningCopy } from "./_content/en";

/**
 * Page-level localisation for the cleaning funnel, the same model as
 * /restaurant-websites: English at /cleaning-company-websites, Spanish at
 * /es/cleaning-company-websites, each its own canonical with reciprocal
 * hreflang. The demo is one URL with an in-page language switch (it shows off
 * a bilingual client site) and is noindex, so it carries no hreflang.
 */
export type Locale = "en" | "es";

export const PATHS = {
  en: { landing: "/cleaning-company-websites" },
  es: { landing: "/es/cleaning-company-websites" },
} as const satisfies Record<Locale, { landing: string }>;

export const DEMO_PATH = "/cleaning-company-websites/demo";

export const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_US" };

export type { CleaningCopy };
