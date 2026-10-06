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
    detail: "From $7.95/mo. Free migration, free SSL, daily backups.",
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
  "/automations": {
    eyebrow: "Automations",
    title: "The daily work, done without anyone remembering.",
    detail: "Enquiry to record, booking to calendar, form to the right person.",
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

  // Hosting tiers.
  "/shared-hosting": {
    eyebrow: "Shared hosting",
    title: "The entry tier, described honestly.",
    detail: "What it suits, where it stops, and how to tell you have outgrown it.",
  },
  "/vps-hosting": {
    eyebrow: "VPS hosting",
    title: "Root access, and a slice that is yours.",
    detail: "Install what the application needs. Managed or unmanaged.",
  },
  "/dedicated-servers": {
    eyebrow: "Dedicated servers",
    title: "One tenant. The whole machine.",
    detail: "Specified to the workload, quoted, then built.",
  },
  "/managed-hosting": {
    eyebrow: "Managed hosting",
    title: "Managed is not a tier.",
    detail: "It is a decision about who patches the server at 2am.",
  },

  // Domains.
  "/transfer-domain": {
    eyebrow: "Transfer a domain",
    title: "Move it without taking anything offline.",
    detail: "Your remaining term carries over, and a year goes on top.",
  },
  "/whois-lookup": {
    eyebrow: "Free tool",
    title: "Look up any domain.",
    detail: "Registrar, expiry, nameservers and lock — live from the registry.",
  },

  // Services.
  "/migrations": {
    eyebrow: "WordPress migration",
    title: "We move it. You approve the moment it goes live.",
    detail: "Staged first, DNS last. Free on every hosting plan.",
  },
  "/site-management": {
    eyebrow: "Site management",
    title: "A website is not finished when it launches.",
    detail: "Updates, backups, uptime and the small changes, handled.",
  },

  // Resources.
  "/tutorials": {
    eyebrow: "Tutorials",
    title: "Get the job done.",
    detail: "Real procedures with the actual records, settings and commands.",
  },
  "/hosting-alternatives": {
    eyebrow: "Comparison",
    title: "How the tiers differ, and how to judge a host.",
    detail: "No scores out of ten. Six questions that work on anyone.",
  },
  "/ai-tools": {
    eyebrow: "AI tools",
    title: "Start with the symptom, not the technology.",
    detail: "Three tools, three problems — and when the answer is none of them.",
  },

  // Company.
  "/our-process": {
    eyebrow: "Our process",
    title: "Five stages, and what each one owes you.",
    detail: "What you receive, and what we need from you to start the next.",
  },

  // Legal.
  "/report-abuse": {
    eyebrow: "Report abuse",
    title: "Report abuse on our platform.",
    detail: "What we need, what we do, and what we will not do.",
  },
  "/acceptable-use-policy": {
    eyebrow: "Acceptable use",
    title: "What you may run on our infrastructure.",
    detail: "Prohibited content, anti-spam rules, fair use, and how suspensions work.",
  },
  "/dmca-policy": {
    eyebrow: "Copyright",
    title: "Reporting infringement, and answering back.",
    detail: "What a valid DMCA notice contains, and how a counter-notice works.",
  },
  "/cookie-policy": {
    eyebrow: "Cookies",
    title: "What we store in your browser.",
    detail: "Strictly necessary only by default. No ad cookies, no cross-site tracking.",
  },
  "/data-processing-agreement": {
    eyebrow: "Data processing",
    title: "The Article 28 terms, in force by default.",
    detail: "Roles, security, sub-processors, transfers and deletion.",
  },
  "/domain-registration-agreement": {
    eyebrow: "Domains",
    title: "You are the registrant. The domain is yours.",
    detail: "WHOIS privacy free and on by default, plus how registrant data requests work.",
  },
  "/law-enforcement-requests": {
    eyebrow: "Legal requests",
    title: "What we require before we disclose anything.",
    detail: "Valid process, narrow scope, and we tell the customer unless forbidden.",
  },
  "/privacy-policy": {
    eyebrow: "Privacy",
    title: "What we hold, and what you can ask us to do about it.",
    detail: "Written to be read rather than to be defensible.",
  },
  "/terms-of-service": {
    eyebrow: "Terms",
    title: "The agreement, in plain language.",
    detail: "Terms nobody can read are terms nobody agreed to.",
  },
  "/refund-policy": {
    eyebrow: "Refunds",
    title: "30 days on hosting, no questions.",
    detail: "And an honest explanation of why domains are different.",
  },
  "/legal-information": {
    eyebrow: "Legal",
    title: "Which document governs what.",
    detail: "Company details, DMCA procedure and law-enforcement requests.",
  },
  "/accessibility": {
    eyebrow: "Accessibility",
    title: "What we target, and what is not done yet.",
    detail: "WCAG 2.2 AA, with the known limitations stated.",
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
