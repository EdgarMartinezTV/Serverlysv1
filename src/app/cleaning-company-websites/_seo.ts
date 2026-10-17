import type { Metadata } from "next";
import { canonical, faqGraph, pageMetadata, serviceGraph } from "@/lib/seo";
import { designOrderUrl, designPlans } from "@/data/design-plans";
import { DEMO_PATH, OG_LOCALE, PATHS, type CleaningCopy, type Locale } from "./_i18n";

/**
 * Metadata and structured data for the cleaning pages.
 *
 * Truthful by construction: a Service provided by the site's single
 * Organization (no LocalBusiness, no address, no ratings — Serverlys has no
 * public storefront and no review data), areaServed = Miami-Dade County plus
 * the United States (the page says both), and offers that are the real
 * WHMCS website-design plans at their real one-time prices. FAQPage mirrors
 * the visible FAQ exactly; Google shows FAQ rich results only for a few site
 * types, so this is for understanding, not a rich-result promise.
 */

function languages() {
  return {
    "en-US": canonical(PATHS.en.landing),
    "es-US": canonical(PATHS.es.landing),
    "x-default": canonical(PATHS.en.landing),
  };
}

export function landingMetadata(copy: CleaningCopy, locale: Locale): Metadata {
  const meta = pageMetadata({ title: copy.meta.title, description: copy.meta.description, path: PATHS[locale].landing });
  return {
    ...meta,
    alternates: { ...meta.alternates, languages: languages() },
    openGraph: {
      ...meta.openGraph,
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[locale === "en" ? "es" : "en"]],
    },
  };
}

export function demoMetadata(): Metadata {
  return pageMetadata({
    title: "Cleaning Company Website Demo | Serverlys",
    description:
      "Try a cleaning company website built by Serverlys: instant quote estimator, appointment request, gallery and English/Spanish. Fictional company, no real bookings.",
    path: DEMO_PATH,
    index: false,
  });
}

export function landingGraphs(copy: CleaningCopy, locale: Locale) {
  const path = PATHS[locale].landing;
  const service = {
    ...serviceGraph({
      name: copy.breadcrumb.page,
      serviceType: locale === "es" ? "Diseño de sitios web para empresas de limpieza" : "Cleaning company website design",
      description: copy.meta.description,
      path,
    }),
    inLanguage: locale,
    areaServed: [
      { "@type": "AdministrativeArea", name: "Miami-Dade County, Florida" },
      { "@type": "Country", name: "United States" },
    ],
    audience: { "@type": "BusinessAudience", audienceType: locale === "es" ? "Empresas de limpieza" : "Cleaning companies" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: copy.pricing.title,
      itemListElement: designPlans.map((p) => ({
        "@type": "Offer",
        name: `Website design — ${p.name}`,
        url: designOrderUrl(p),
        price: p.price.toFixed(2),
        priceCurrency: "USD",
        description: copy.pricing.fit[p.id],
      })),
    },
  };
  const faq = faqGraph(
    copy.faq.items.map((f) => ({ ...f, scopes: [path] })),
    path,
  );
  return [service, faq];
}
