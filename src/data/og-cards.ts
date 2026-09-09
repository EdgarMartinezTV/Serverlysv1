import { articles } from "@/data/articles";

/**
 * OpenGraph card copy, keyed by route path.
 *
 * Why a registry rather than one `opengraph-image.tsx` per route:
 *
 *   1. Next's file-based image did not cascade to sibling top-level segments
 *      here, so 26 pages shipped with no og:image at all. A registry cannot
 *      silently miss a page — `pageMetadata` reads from it, and the audit
 *      fails if a page has no card.
 *   2. The image route accepts a KEY, never free text. A card renderer that
 *      takes `?title=` from the query string lets anyone render arbitrary words
 *      onto a Serverlys-branded image and share it as ours.
 *
 * The copy here is not the page's <title>. A social card is read at a glance
 * in a feed, so it carries the claim rather than the keyword.
 */
export type OgCard = {
  eyebrow: string;
  title: string;
  detail?: string;
};

const PAGES: Record<string, OgCard> = {
  "/": {
    eyebrow: "Web hosting",
    title: "Hosting priced honestly. Including year two.",
    detail: "Free migration, free SSL and daily backups on every plan.",
  },
  "/hosting": {
    eyebrow: "Hosting",
    title: "Every kind of hosting, one stack.",
    detail: "Cloud, WordPress and ecommerce — with the renewal rate printed up front.",
  },
  "/cloud-hosting": {
    eyebrow: "Cloud hosting",
    title: "Resources that flex when traffic does.",
    detail: "From $2.19/mo. Free migration, free SSL, daily backups.",
  },
  "/wordpress-hosting": {
    eyebrow: "WordPress hosting",
    title: "WordPress, tuned before you arrive.",
    detail: "LiteSpeed caching configured, core updates applied for you.",
  },
  "/ecommerce-hosting": {
    eyebrow: "Ecommerce hosting",
    title: "Built for the checkout that has to work.",
    detail: "Free SSL, daily backups and headroom for a busy day.",
  },
  "/domain-name": {
    eyebrow: "Domains",
    title: "Your name, with the renewal price shown.",
    detail: "Free WHOIS privacy. No surprise second-year invoice.",
  },
  "/register-domain": {
    eyebrow: "Domain search",
    title: "Check it against the live registries.",
    detail: "Real availability, real prices, before you commit.",
  },
  "/ai-agents": {
    eyebrow: "AI agents",
    title: "Nobody should reach a ringing phone.",
    detail: "Chat and voice agents that capture the lead instead of losing it.",
  },
  "/convoai": {
    eyebrow: "ConvoAI",
    title: "Answers your customers, day and night.",
    detail: "Trained on your business. Escalates when it should.",
  },
  "/callflow-ai": {
    eyebrow: "CallFlow AI",
    title: "Picks up the phone when you cannot.",
    detail: "Books the job, takes the details, sends you the summary.",
  },
  "/automations": {
    eyebrow: "Automations",
    title: "The admin nobody wants to do.",
    detail: "Workflows that move data between the tools you already pay for.",
  },
  "/website-design": {
    eyebrow: "Website design",
    title: "A site built to be found and to convert.",
    detail: "Designed around what your customers actually came to do.",
  },
  "/website-development": {
    eyebrow: "Development",
    title: "When a template will not do it.",
    detail: "Custom builds, integrations and the things off-the-shelf cannot.",
  },
  "/seo": {
    eyebrow: "SEO",
    title: "Rankings you can trace to revenue.",
    detail: "Technical fixes first, then the content that earns the click.",
  },
  "/marketing": {
    eyebrow: "Marketing",
    title: "Spend that you can actually account for.",
    detail: "Campaigns measured against booked work, not impressions.",
  },
  "/social-media": {
    eyebrow: "Social media",
    title: "Show up consistently, without the scramble.",
    detail: "Planned, produced and posted for you.",
  },
  "/business-solutions": {
    eyebrow: "Business solutions",
    title: "One supplier, one bill, one team.",
    detail: "Hosting, domains, website and AI on a single invoice.",
  },
  "/pricing": {
    eyebrow: "Pricing",
    title: "The renewal rate, next to the first-year rate.",
    detail: "Every plan. No footnote, no surprise at month thirteen.",
  },
  "/about": {
    eyebrow: "About",
    title: "Three commitments we could profit by dropping.",
    detail: "Published renewals, free migration, free restores.",
  },
  "/contact": {
    eyebrow: "Contact",
    title: "Talk to a person.",
    detail: "Sales, migrations and technical questions reach the same team.",
  },
  "/resources": {
    eyebrow: "Resources",
    title: "Work out what you need.",
    detail: "Guides, answers and tools — including when not to buy.",
  },
  "/blog": {
    eyebrow: "Blog",
    title: "Things worth knowing before you buy.",
    detail: "Hosting costs, migrations, page speed and AI agents.",
  },
  "/faq": {
    eyebrow: "FAQ",
    title: "The questions people actually ask.",
    detail: "Pricing, renewals, refunds, domains and plan choice.",
  },
  "/support": {
    eyebrow: "Support",
    title: "One queue, one team, every plan.",
    detail: "Migration, restores and DNS included at no extra cost.",
  },
};

/** Articles get a card generated from their own title and category. */
const ARTICLE_CARDS: Record<string, OgCard> = Object.fromEntries(
  articles.map((a) => [
    `/blog/${a.slug}`,
    { eyebrow: a.category, title: a.title, detail: a.description },
  ]),
);

export const ogCards: Readonly<Record<string, OgCard>> = { ...PAGES, ...ARTICLE_CARDS };

/**
 * Route path → image route key, and back.
 *
 * "/" is "home"; everything else is the path with slashes replaced, so
 * "/blog/core-web-vitals-for-small-sites" becomes
 * "blog__core-web-vitals-for-small-sites". Reversible and URL-safe.
 */
export function ogKeyFor(path: string): string {
  return path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "__");
}

const byKey = new Map(Object.keys(ogCards).map((p) => [ogKeyFor(p), ogCards[p]]));

export function ogCardByKey(key: string): OgCard | undefined {
  return byKey.get(key);
}

export function ogKeys(): string[] {
  return [...byKey.keys()];
}
