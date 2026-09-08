import type { Metadata } from "next";
import { company } from "@/data/company";
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
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      siteName: company.name,
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
        url: `${company.url}/brand/serverlys-logo.webp`,
        contentUrl: `${company.url}/brand/serverlys-logo.webp`,
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
