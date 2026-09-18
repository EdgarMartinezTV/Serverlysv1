import type { Metadata } from "next";
import { company } from "@/data/company";
import { ogCards, ogKeyFor } from "@/data/og-cards";
import type { Faq } from "@/data/faqs";
import { socialLinks } from "@/data/navigation";

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
/**
 * The services the offer catalogue advertises. Each `path` is a real, indexable
 * page that sells the thing — a catalogue entry pointing at a page that does
 * not sell it is a misrepresentation, not an optimisation.
 */
const SERVICES = [
  { name: "Web hosting", path: "/hosting" },
  { name: "WordPress hosting", path: "/wordpress-hosting" },
  { name: "Ecommerce hosting", path: "/ecommerce-hosting" },
  { name: "Domain registration", path: "/register-domain" },
  { name: "AI chatbot", path: "/convoai" },
  { name: "AI voice agent", path: "/callflow-ai" },
  { name: "Web development", path: "/website-development" },
  { name: "Business automations", path: "/automations" },
] as const;

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
        /*
         * The profiles this company actually controls, read from the same list
         * the footer renders so the two can never drift apart.
         *
         * `sameAs` is the primary entity-disambiguation signal: it is how a
         * search engine confirms that the Serverlys on this domain, the
         * Serverlys on X and the Serverlys on Instagram are ONE entity rather
         * than three unrelated strings. Without it the Organization node is an
         * unverifiable assertion about a name, which is why a site can carry
         * perfect Organization markup and still never resolve to a knowledge
         * panel. Only add profiles that genuinely belong to the company.
         */
        sameAs: socialLinks.map((link) => link.href),
        /*
         * What Serverlys sells, enumerated.
         *
         * The Organization described who this company is and never said what it
         * does, so a model summarising the brand had to infer the service list
         * from prose. This is the structured answer to that question — the same
         * thing behind a "Core Services" breakdown in an AI Overview.
         *
         * Every entry MUST point at a page that visibly sells that service, and
         * the names deliberately use the CATEGORY term customers search rather
         * than the internal product name — "AI chatbot", not "chat agent".
         */
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${company.name} services`,
          itemListElement: SERVICES.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.name,
              url: canonical(service.path),
              provider: { "@id": ORG_ID },
            },
          })),
        },
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
  offerCount,
  currency = "USD",
}: {
  name: string;
  description: string;
  path: string;
  lowPrice: number;
  highPrice: number;
  /**
   * How many tiers the offer actually covers. Was hardcoded to 4, which is a
   * claim about the catalogue made in a file that cannot see it — the pricing
   * band renders `cloud.plans` whole and promises a fifth tier would appear
   * automatically, and this would have gone on saying 4. Pass it from the same
   * array the page renders.
   */
  offerCount: number;
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
      offerCount,
      availability: "https://schema.org/InStock",
      url,
      seller: { "@id": ORG_ID },
    },
  };
}

/**
 * CollectionPage + ItemList for an archive page.
 *
 * WHY ItemList AND NOT just CollectionPage. CollectionPage alone says "this
 * page is a collection" and stops there — it names no members, so it adds
 * nothing a crawler could not already see. The ItemList is the part that
 * carries information: it states, in order, which articles this hub covers,
 * which is exactly the relationship that makes a category read as a topic
 * cluster rather than a pagination artifact.
 *
 * `url` on each ListItem rather than a nested Article node: the article's own
 * page already emits its full Article graph, and repeating a partial copy here
 * creates a second, thinner node competing to describe the same URL.
 */
export function collectionGraph({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: ReadonlyArray<{ name: string; path: string }>;
}) {
  const url = canonical(path);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name,
    description,
    url,
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: canonical(item.path),
      })),
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

/**
 * Service graph for a page that sells a service rather than a plan.
 *
 * WHY THIS EXISTS SEPARATELY FROM `productGraph`. `productGraph` describes a
 * thing with tiers and a price range — a hosting plan. Most of what Serverlys
 * sells is not that: website design, SEO, automations and the AI agents are
 * scoped and quoted. Typing them as `Product` with no `offers` produces an
 * invalid node; typing them as `Service` with an `@id`-linked provider is what
 * actually resolves them to the Serverlys entity.
 *
 * That resolution is the whole point for answer engines. "Who builds AI phone
 * agents for small businesses" is matched against the SERVICE, and the answer
 * names the PROVIDER — so the provider must be the one canonical Organization
 * node, not an anonymous stub that resolves to nothing.
 *
 * DELIBERATELY ABSENT, all for reasons recorded at the top of this file:
 *   · `areaServed` — the positioning is global brand, no local targeting.
 *   · `offers` / `priceRange` — prices are quoted, not published, on these
 *     pages. An empty or invented Offer is worse than none.
 *   · `aggregateRating` / `review` — no genuine ratings exist.
 */
export function serviceGraph({
  name,
  serviceType,
  description,
  path,
}: {
  /** The service as a customer would name it. */
  name: string;
  /** The category. Free text in schema.org; keep it a plain noun phrase. */
  serviceType: string;
  description: string;
  path: string;
}) {
  const url = canonical(path);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType,
    description,
    url,
    provider: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
    mainEntityOfPage: url,
  };
}
