import type { RestaurantPlanId } from "@/data/restaurant-plans";

/**
 * Locales for the restaurant funnel.
 *
 * The rest of the site is English-only (see navigation/language-selector.tsx),
 * so this is page-level localisation rather than a site-wide i18n layer: the
 * English pages live at /restaurant-websites and the Spanish ones under /es,
 * each with its own canonical and hreflang alternates. The global header and
 * footer stay English on both.
 */
export type Locale = "en" | "es";

export const LOCALES: readonly Locale[] = ["en", "es"];

export const PATHS = {
  en: { landing: "/restaurant-websites", demo: "/restaurant-websites/demo" },
  es: { landing: "/es/restaurant-websites", demo: "/es/restaurant-websites/demo" },
} as const satisfies Record<Locale, { landing: string; demo: string }>;

export const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_US" };

export type ServiceId =
  | "website"
  | "menu"
  | "ordering"
  | "reservations"
  | "seo"
  | "ai"
  | "unsure";

export const SERVICE_IDS: readonly ServiceId[] = [
  "website",
  "menu",
  "ordering",
  "reservations",
  "seo",
  "ai",
  "unsure",
];

export type ExplorerTabId = "website" | "menu" | "ordering" | "reservations" | "seo" | "ai";

/** A cell in the comparison table: a tick, a dash, or a short value. */
export type CompareValue = boolean | string;

export type LandingCopy = {
  meta: { title: string; description: string };
  breadcrumb: { home: string; page: string };
  switchTo: { label: string; aria: string };
  hero: {
    kicker: string;
    title: string;
    lede: string;
    ctaReview: string;
    ctaDemo: string;
    points: readonly string[];
    chips: { order: string; orderDetail: string; booking: string; bookingDetail: string; ai: string };
    mock: {
      tagline: string;
      headline: string;
      order: string;
      reserve: string;
      menu: string;
      viewOrder: string;
      dishes: readonly string[];
    };
  };
  checks: {
    label: string;
    title: string;
    items: readonly { title: string; body: string }[];
  };
  explorer: {
    label: string;
    title: string;
    intro: string;
    tablistLabel: string;
    external: string;
    tabs: readonly {
      id: ExplorerTabId;
      label: string;
      title: string;
      body: string;
      bullets: readonly string[];
      note?: string;
      /** A deeper page on this service, linked under the panel. */
      more?: { label: string; href: string };
    }[];
    ui: {
      desktop: string;
      mobile: string;
      previewLabel: string;
      allDishes: string;
      vegetarian: string;
      glutenFree: string;
      scanToView: string;
      add: string;
      inCart: string;
      checkout: string;
      partySize: string;
      guests: string;
      pickTime: string;
      requested: string;
      openNow: string;
      directions: string;
      call: string;
      seoChecklist: readonly string[];
      chatPrompts: readonly { q: string; a: string }[];
      chatHint: string;
      sample: string;
      menuFilterLabel: string;
      hoursDiffer: string;
      fewer: string;
      more: string;
      previewAlt: string;
      typing: string;
      seoCategory: string;
    };
  };
  demoBand: {
    label: string;
    title: string;
    body: string;
    bullets: readonly string[];
    cta: string;
    disclaimer: string;
  };
  steps: { label: string; title: string; items: readonly { title: string; body: string }[] };
  pricing: {
    label: string;
    title: string;
    intro: string;
    setup: string;
    perMonth: string;
    then: string;
    cta: string;
    recommended: string;
    listTitle: string;
    summaries: Record<RestaurantPlanId, string>;
    highlights: Record<RestaurantPlanId, readonly string[]>;
    footnote: string;
  };
  compare: {
    title: string;
    caption: string;
    feature: string;
    included: string;
    notIncluded: string;
    externalLegend: string;
    groups: readonly {
      title: string;
      rows: readonly { label: string; values: readonly [CompareValue, CompareValue, CompareValue]; external?: boolean }[];
    }[];
  };
  doral: {
    kicker: string;
    title: string;
    body: string;
    points: readonly string[];
    aside: string;
    cta: string;
  };
  form: {
    label: string;
    title: string;
    intro: string;
    reviewTitle: string;
    reviewItems: readonly string[];
    contactLine: string;
    fields: {
      restaurant: string;
      contact: string;
      website: string;
      websiteHint: string;
      noWebsite: string;
      phone: string;
      email: string;
      location: string;
      locationHint: string;
      services: string;
      servicesHint: string;
      plan: string;
      planNone: string;
      language: string;
      message: string;
      messageHint: string;
      optional: string;
      required: string;
    };
    services: Record<ServiceId, string>;
    languages: { en: string; es: string };
    submit: string;
    sending: string;
    privacy: string;
    privacyLink: string;
    errors: {
      summary: string;
      required: string;
      email: string;
      phone: string;
      url: string;
      services: string;
      network: string;
      rateLimited: string;
    };
    success: { title: string; notified: string; saved: string; reference: string; again: string };
    failure: { title: string; body: string; ticket: string };
  };
  faq: { label: string; title: string; items: readonly { question: string; answer: string }[] };
  related: { label: string; items: readonly (readonly [string, string])[] };
};
