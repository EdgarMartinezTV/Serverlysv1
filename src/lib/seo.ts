import type { Metadata } from "next";
import { company } from "@/data/company";
import { ogCards, ogKeyFor } from "@/data/og-cards";
import type { Faq } from "@/data/faqs";

/**
 * SEO / structured data.
 *
 * POSITIONING (decided 2026-09-08): global brand, no local targeting. Do not
 * reintroduce city keywords, areaServed, or Miami-specific titles.
 *
 * ENTITY RULES — these are hard constraints, not preferences:
 *   - ONE canonical Organization node at #organization. Every publisher /
 *     provider / author field references it by @id rather than repeating an
 *     anonymous {"@type":"Organization"} stub. Duplicate anonymous nodes
 *     actively prevent Google resolving a site name or knowledge panel.
 *   - NO physical address, geo, openingHours, priceRange, or LocalBusiness
 *     typing. It is a plain Organization.
 *   - NO foundingDate or founder. Those facts have not been verified, and
 *     inventing entity data is worse than omitting it.
 */

const ORG_ID = `${company.url}/#organization`;
const SITE_ID = `${company.url}/#website`;
const LOGO_ID = `${company.url}/#logo`;

export function canonical(path: string): string {
  return path === "/" ? company.url : `${company.url}${path}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Set false for thin or duplicate pages. Defaults to indexable. */
  index?: boolean;
};

/**
 * Builds page metadata with a canonical URL and OG/Twitter cards.
 * `title` is used verbatim — the template in the root layout is bypassed so
 * each page controls its full SERP title.
 */
export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: PageMetaInput): Metadata {
  const url = canonical(path);

  // Every page declares openGraph explicitly, which suppresses Next's
  // file-based opengraph-image for that route. So the card is resolved here,
  // from the registry, and a page with no registered card falls back to the
  // site card rather than shipping with none.
  const card = ogCards[path] ? `/og/${ogKeyFor(path)}` : "/opengraph-image";
  const images = [{ url: canonical(card), width: 1200, height: 630, alt: title }];

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "website",
      siteName: company.name,
      title,
      description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

/** The canonical Organization + WebSite graph. Rendered once, in the root layout. */
export function organizationGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: company.name,
        legalName: company.legalName,
        url: company.url,
        description: company.description,
        logo: { "@id": LOGO_ID },
        image: { "@id": LOGO_ID },
        email: company.email,
        telephone: company.phone,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: company.email,
            telephone: company.phone,
            availableLanguage: ["en"],
          },
        ],
      },
      {
        "@type": "ImageObject",
        "@id": LOGO_ID,
        url: `${company.url}/brand/logo.webp`,
        contentUrl: `${company.url}/brand/logo.webp`,
        caption: company.name,
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: company.url,
        name: company.name,
        description: company.description,
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

/** FAQPage graph. Only emit on pages that visibly render these same Q&As. */
export function faqGraph(items: readonly Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${company.url}/#faq`,
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * Product + offer graph for a hosting product page.
 *
 * `AggregateOffer` with lowPrice/highPrice is the honest shape here: the page
 * lists several tiers, so a single `Offer` would misstate what is available.
 *
 * Deliberately NO `aggregateRating` and NO `review`: no genuine ratings exist,
 * and fabricating them is both dishonest and a documented cause of manual
 * action. Add them only when real, collected reviews exist.
 */
export function productGraph({
  name,
  description,
  path,
  lowPrice,
  highPrice,
  currency = "USD",
}: {
  name: string;
  description: string;
  path: string;
  lowPrice: number;
  highPrice: number;
  currency?: string;
}) {
  const url = canonical(path);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name,
    description,
    url,
    brand: { "@id": ORG_ID },
    category: "Web Hosting",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: currency,
      lowPrice: lowPrice.toFixed(2),
      highPrice: highPrice.toFixed(2),
      offerCount: 4,
      availability: "https://schema.org/InStock",
      url,
      seller: { "@id": ORG_ID },
    },
  };
}

/** Breadcrumbs. Pass the trail excluding the current page's own trailing slash. */
export function breadcrumbGraph(trail: ReadonlyArray<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}

/**
 * Article graph for a blog post.
 *
 * `author` is the Organization, not an invented person — Serverlys has no
 * named bylines and fabricating one would misrepresent the entity. `publisher`
 * points at the same @id emitted once by the root layout, so the whole site
 * resolves to a single Organization node.
 */
export function articleGraph({
  headline,
  description,
  path,
  published,
  section,
}: {
  headline: string;
  description: string;
  path: string;
  published: string;
  section: string;
}) {
  const url = canonical(path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline,
    description,
    articleSection: section,
    datePublished: published,
    dateModified: published,
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}
