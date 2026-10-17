import type { Metadata } from "next";
import { canonical, faqGraph, pageMetadata, serviceGraph } from "@/lib/seo";
import { restaurantPlans } from "@/data/restaurant-plans";
import { OG_LOCALE, PATHS, type LandingCopy, type Locale } from "./_i18n";
import { DEMO_COPY } from "./_demo/copy";

/**
 * Metadata and structured data for the restaurant pages.
 *
 * Each locale is its own canonical URL with reciprocal hreflang alternates
 * (en, es, x-default → en). The demo is noindex: it describes a restaurant
 * that does not exist, and an indexed fake menu is an invitation for a search
 * engine to believe in it. It still carries the alternates so the two demo
 * URLs are understood as one page in two languages.
 */

function languages(key: "landing" | "demo") {
  return {
    "en-US": canonical(PATHS.en[key]),
    "es-US": canonical(PATHS.es[key]),
    "x-default": canonical(PATHS.en[key]),
  };
}

function withLocale(meta: Metadata, locale: Locale, key: "landing" | "demo"): Metadata {
  return {
    ...meta,
    alternates: { ...meta.alternates, languages: languages(key) },
    openGraph: {
      ...meta.openGraph,
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[locale === "en" ? "es" : "en"]],
    },
  };
}

export function landingMetadata(copy: LandingCopy, locale: Locale): Metadata {
  return withLocale(
    pageMetadata({ title: copy.meta.title, description: copy.meta.description, path: PATHS[locale].landing }),
    locale,
    "landing",
  );
}

export function demoMetadata(locale: Locale): Metadata {
  const c = DEMO_COPY[locale].meta;
  return withLocale(
    pageMetadata({ title: c.title, description: c.description, path: PATHS[locale].demo, index: false }),
    locale,
    "demo",
  );
}

/**
 * Service + OfferCatalog. Each plan is an Offer with TWO price components —
 * the one-time setup and the monthly plan — because quoting either alone
 * would misstate the price.
 */
export function landingGraphs(copy: LandingCopy, locale: Locale) {
  const path = PATHS[locale].landing;
  const service = {
    ...serviceGraph({
      name: copy.breadcrumb.page,
      serviceType: locale === "es" ? "Diseño de sitios web para restaurantes" : "Restaurant website design",
      description: copy.meta.description,
      path,
    }),
    inLanguage: locale,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: copy.pricing.title,
      itemListElement: restaurantPlans.map((p) => ({
        "@type": "Offer",
        name: p.name,
        description: copy.pricing.summaries[p.id],
        url: `${canonical(path)}#plans`,
        priceCurrency: "USD",
        price: p.setup.toFixed(2),
        priceSpecification: [
          {
            "@type": "UnitPriceSpecification",
            name: locale === "es" ? "Pago único de inicio" : "One-time setup",
            price: p.setup.toFixed(2),
            priceCurrency: "USD",
          },
          {
            "@type": "UnitPriceSpecification",
            name: locale === "es" ? "Plan mensual" : "Monthly plan",
            price: p.monthly.toFixed(2),
            priceCurrency: "USD",
            unitCode: "MON",
            referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
          },
        ],
      })),
    },
  };
  const faq = faqGraph(
    copy.faq.items.map((f) => ({ ...f, scopes: [path] })),
    path,
  );
  return [service, faq];
}
