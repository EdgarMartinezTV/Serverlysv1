import { billing } from "./company";

/**
 * Site navigation.
 *
 * Data-driven so the mega menu can grow without touching components: a
 * category, group, item, badge or promo is added here and the UI follows.
 *
 * `status: "soon"` items are real — the live site marks Shared, VPS, Dedicated
 * and CallFlow as Coming Soon. They stay listed because they carry demand
 * signal, but they must never render a purchase CTA. Whether an entry renders
 * as a link at all is decided by `resolveNavTarget` in `data/routes.ts`, which
 * refuses to link to a page that does not exist yet.
 */

export type NavStatus = "live" | "soon";

/** Names in the shared icon set — see components/navigation/nav-icons.tsx. */
export type NavIconName =
  | "sparkles"
  | "server"
  | "globe"
  | "layout"
  | "cart"
  | "mail"
  | "phone"
  | "chat"
  | "shield"
  | "gauge"
  | "wrench"
  | "chart"
  | "book"
  | "lifebuoy"
  | "compass"
  | "bolt";

export type NavBadge = { text: string; tone: "brand" | "success" | "warning" };

export type MegaItem = {
  label: string;
  href: string;
  description: string;
  icon: NavIconName;
  badge?: NavBadge;
  external?: boolean;
  status?: NavStatus;
};

export type MegaGroup = {
  heading: string;
  items: readonly MegaItem[];
};

/** Right-hand promotional panel. One per category. */
export type MegaPromo = {
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string; external?: boolean };
  /** Selects the code-built visual composition. */
  visual: "ai" | "hosting" | "domains" | "growth";
};

export type MegaCategory = {
  id: string;
  label: string;
  icon: NavIconName;
  groups: readonly MegaGroup[];
  promo: MegaPromo;
};

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  status?: NavStatus;
  external?: boolean;
};

export type NavColumn = { heading: string; links: readonly NavLink[] };

export type NavItem =
  | { label: string; href: string; categories?: never; railLabel?: never }
  | {
      label: string;
      href?: never;
      /** Heading above the category rail. */
      railLabel: string;
      categories: readonly MegaCategory[];
    };

/* ────────────────────────────────────────────────────────────────────────
   PRODUCTS
   ──────────────────────────────────────────────────────────────────────── */
const PRODUCT_CATEGORIES: readonly MegaCategory[] = [
  {
    id: "ai",
    label: "AI and automation",
    icon: "sparkles",
    groups: [
      {
        heading: "Answer and automate",
        items: [
          {
            label: "ConvoAI",
            href: "https://convoai.cloud/",
            external: true,
            icon: "chat",
            badge: { text: "Live", tone: "success" },
            description: "Answers your customers around the clock.",
          },
          {
            label: "CallFlow",
            href: "https://callflow.serverlys.com/",
            external: true,
            icon: "phone",
            badge: { text: "Soon", tone: "warning" },
            status: "soon",
            description: "Picks up the phone when nobody can.",
          },
          {
            label: "Automations",
            href: "/#migration",
            icon: "bolt",
            description: "Backups, scaling and SSL, running unattended.",
          },
        ],
      },
      {
        heading: "Running on every plan",
        items: [
          {
            label: "Daily backups",
            href: "/cloud-hosting",
            icon: "shield",
            description: "Taken nightly. Restores are free.",
          },
          {
            label: "Auto-scaling",
            href: "/cloud-hosting",
            icon: "gauge",
            description: "Spikes absorbed, never throttled.",
          },
          {
            label: "Free SSL",
            href: "/cloud-hosting",
            icon: "shield",
            description: "Issued and renewed automatically.",
          },
        ],
      },
    ],
    promo: {
      eyebrow: "ConvoAI",
      title: "An agent that answers at 2am",
      body: "Hours, bookings and pricing answered the moment they are asked — and handed over when they are not routine.",
      cta: { label: "Explore ConvoAI", href: "https://convoai.cloud/", external: true },
      visual: "ai",
    },
  },
  {
    id: "hosting",
    label: "Hosting",
    icon: "server",
    groups: [
      {
        heading: "Available now",
        items: [
          {
            label: "Cloud hosting",
            href: "/cloud-hosting",
            icon: "server",
            description: "For traffic that moves.",
          },
          {
            label: "WordPress hosting",
            href: "/wordpress-hosting",
            icon: "layout",
            description: "LiteSpeed cache, automatic updates.",
          },
          {
            label: "Ecommerce hosting",
            href: "/store-hosting",
            icon: "cart",
            description: "WooCommerce-ready, fast at checkout.",
          },
          {
            label: "Managed hosting",
            href: "/managed-hosting",
            icon: "wrench",
            description: "We handle security and updates.",
          },
        ],
      },
      {
        heading: "In development",
        items: [
          {
            label: "Shared hosting",
            href: "/shared-hosting",
            icon: "server",
            status: "soon",
            badge: { text: "Soon", tone: "warning" },
            description: "Brochure sites and blogs.",
          },
          {
            label: "VPS hosting",
            href: "/vps-hosting",
            icon: "server",
            status: "soon",
            badge: { text: "Soon", tone: "warning" },
            description: "Root access, dedicated resources.",
          },
          {
            label: "Dedicated servers",
            href: "/dedicated-servers",
            icon: "server",
            status: "soon",
            badge: { text: "Soon", tone: "warning" },
            description: "Single-tenant hardware.",
          },
        ],
      },
    ],
    promo: {
      eyebrow: "Renewal pricing",
      title: "Year two, before you buy",
      body: "Every tier shows what it renews at next to today's price. The real number is on the page.",
      cta: { label: "Compare plans", href: "/#plans" },
      visual: "hosting",
    },
  },
  {
    id: "domains",
    label: "Domains",
    icon: "globe",
    groups: [
      {
        heading: "Get a name",
        items: [
          {
            label: "Register a domain",
            href: "/register-domain",
            icon: "globe",
            description: "Live registry availability, from $9.95/yr.",
          },
          {
            label: "Transfer a domain",
            href: "/transfer-domain",
            icon: "compass",
            description: "Move a name you already own.",
          },
          {
            label: "WHOIS lookup",
            href: "/whois-lookup",
            icon: "book",
            description: "See who holds a name.",
          },
        ],
      },
      {
        heading: "Included with every domain",
        items: [
          {
            label: "WHOIS privacy",
            href: "/register-domain",
            icon: "shield",
            description: "Your details stay private, free.",
          },
          {
            label: "DNS management",
            href: "/register-domain",
            icon: "wrench",
            description: "Records and redirects, no extra cost.",
          },
        ],
      },
    ],
    promo: {
      eyebrow: "Domain search",
      title: "Find the name first",
      body: "Live registry availability, with the first-year price beside every extension.",
      cta: { label: "Search domains", href: "/register-domain" },
      visual: "domains",
    },
  },
  {
    id: "websites",
    label: "Websites and growth",
    icon: "layout",
    groups: [
      {
        heading: "Build it",
        items: [
          {
            label: "Web design",
            href: "/web-design",
            icon: "layout",
            description: "Sites built to convert.",
          },
          {
            label: "Custom development",
            href: "/custom-development",
            icon: "wrench",
            description: "Applications and integrations.",
          },
          {
            label: "WP migrations",
            href: "/wp-migrations",
            icon: "compass",
            description: "Site, database and email. Free.",
          },
        ],
      },
      {
        heading: "Grow it",
        items: [
          {
            label: "SEO and marketing",
            href: "/seo-marketing",
            icon: "chart",
            description: "Drive qualified traffic.",
          },
          {
            label: "Site management",
            href: "/site-management",
            icon: "wrench",
            description: "Maintenance and monitoring.",
          },
          {
            label: "Social media",
            href: "/socialmedia-management",
            icon: "chat",
            description: "Content and scheduling, handled.",
          },
        ],
      },
    ],
    promo: {
      eyebrow: "Free migration",
      title: "Move in without downtime",
      body: "Site, database and email copied to staging first. DNS changes only when you say so.",
      cta: { label: "How migration works", href: "/#migration" },
      visual: "growth",
    },
  },
  {
    id: "email",
    label: "Email",
    icon: "mail",
    groups: [
      {
        heading: "Business email",
        items: [
          {
            label: "Email at your domain",
            href: "/managed-hosting",
            icon: "mail",
            description: "Mailboxes on your own domain.",
          },
          {
            label: "Email migration",
            href: "/wp-migrations",
            icon: "compass",
            description: "Moved with the rest of the site.",
          },
        ],
      },
    ],
    promo: {
      eyebrow: "Included",
      title: "Email moves with the site",
      body: "Mailboxes are part of the migration, not an afterthought you discover on cutover day.",
      cta: { label: "See what is included", href: "/cloud-hosting" },
      visual: "growth",
    },
  },
];

/* ────────────────────────────────────────────────────────────────────────
   SOLUTIONS
   ──────────────────────────────────────────────────────────────────────── */
const SOLUTION_CATEGORIES: readonly MegaCategory[] = [
  {
    id: "workload",
    label: "By workload",
    icon: "gauge",
    groups: [
      {
        heading: "What are you running?",
        items: [
          {
            label: "Blogs and brochure sites",
            href: "/#plans",
            icon: "book",
            description: "One site, steady traffic.",
          },
          {
            label: "Online stores",
            href: "/store-hosting",
            icon: "cart",
            description: "Checkout that stays fast under load.",
          },
          {
            label: "Agencies",
            href: "/#plans",
            icon: "layout",
            description: "Unlimited sites, one bill.",
          },
          {
            label: "High-traffic sites",
            href: "/cloud-hosting",
            icon: "gauge",
            description: "Spikes absorbed, not surcharged.",
          },
        ],
      },
    ],
    promo: {
      eyebrow: "Not sure?",
      title: "Tell us what you run",
      body: "Pick the closest description and we will name the tier that fits — with what it renews at.",
      cta: { label: "Find my plan", href: "/#plans" },
      visual: "hosting",
    },
  },
  {
    id: "situation",
    label: "By situation",
    icon: "compass",
    groups: [
      {
        heading: "Where are you now?",
        items: [
          {
            label: "Switching host",
            href: "/#migration",
            icon: "compass",
            description: "Staged first, DNS last. No gap.",
          },
          {
            label: "Renewal shock",
            href: "/#plans",
            icon: "chart",
            description: "See year two before you commit.",
          },
          {
            label: "Outgrowing shared",
            href: "/cloud-hosting",
            icon: "gauge",
            description: "Move up a tier in place.",
          },
        ],
      },
    ],
    promo: {
      eyebrow: "Switching",
      title: "We move it for you",
      body: "Our team copies the site, database and email to a staging URL. You approve it before anything changes.",
      cta: { label: "How migration works", href: "/#migration" },
      visual: "growth",
    },
  },
];

/* ────────────────────────────────────────────────────────────────────────
   RESOURCES
   ──────────────────────────────────────────────────────────────────────── */
const RESOURCE_CATEGORIES: readonly MegaCategory[] = [
  {
    id: "learn",
    label: "Learn",
    icon: "book",
    groups: [
      {
        heading: "Guides and comparisons",
        items: [
          {
            label: "Blog",
            href: "/blog",
            icon: "book",
            description: "Hosting and performance guides.",
          },
          {
            label: "Tutorials",
            href: "/tutorials",
            icon: "compass",
            description: "Step-by-step help.",
          },
          {
            label: "Hosting comparison",
            href: "/hosting-alternatives",
            icon: "chart",
            description: "How the tiers differ.",
          },
        ],
      },
    ],
    promo: {
      eyebrow: "Read first",
      title: "What renewal really costs",
      body: "The number that decides the price of hosting is year two, not year one. We publish both.",
      cta: { label: "See pricing", href: "/#plans" },
      visual: "hosting",
    },
  },
  {
    id: "support",
    label: "Support",
    icon: "lifebuoy",
    groups: [
      {
        heading: "Get help",
        items: [
          {
            label: "Contact support",
            href: billing.sales,
            external: true,
            icon: "lifebuoy",
            description: "Reach a person, not a queue.",
          },
          {
            label: "Client login",
            href: billing.login,
            external: true,
            icon: "shield",
            description: "Billing, invoices and services.",
          },
          {
            label: "Report abuse",
            href: "/report-abuse",
            icon: "shield",
            description: "Report a site hosted with us.",
          },
        ],
      },
    ],
    promo: {
      eyebrow: "Support",
      title: "A person, not a queue",
      body: "Migration questions, DNS problems and billing all reach the same team.",
      cta: { label: "Talk to us", href: billing.sales, external: true },
      visual: "ai",
    },
  },
];

export const primaryNav: readonly NavItem[] = [
  { label: "Pricing", href: "/#plans" },
  { label: "Products", railLabel: "Products", categories: PRODUCT_CATEGORIES },
  { label: "Solutions", railLabel: "Solutions", categories: SOLUTION_CATEGORIES },
  { label: "Resources", railLabel: "Resources", categories: RESOURCE_CATEGORIES },
];

/* ── Footer, social, announcement (unchanged consumers) ─────────────────── */

export const footerNav: readonly NavColumn[] = [
  {
    heading: "Hosting",
    links: [
      { label: "Cloud hosting", href: "/cloud-hosting" },
      { label: "WordPress hosting", href: "/wordpress-hosting" },
      { label: "Ecommerce hosting", href: "/store-hosting" },
      { label: "Managed hosting", href: "/managed-hosting" },
      { label: "Shared hosting", href: "/shared-hosting", status: "soon" },
      { label: "VPS hosting", href: "/vps-hosting", status: "soon" },
      { label: "Dedicated servers", href: "/dedicated-servers", status: "soon" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Web design", href: "/web-design" },
      { label: "Custom development", href: "/custom-development" },
      { label: "Site management", href: "/site-management" },
      { label: "SEO & marketing", href: "/seo-marketing" },
      { label: "Social media management", href: "/socialmedia-management" },
      { label: "WP migrations", href: "/wp-migrations" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our process", href: "/our-process" },
      { label: "Case studies", href: "/case-studies" },
      { label: "Success stories", href: "/success-stories" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "WHOIS lookup", href: "/whois-lookup" },
      { label: "Hosting comparison", href: "/hosting-alternatives" },
      { label: "AI tools", href: "/ai-tools" },
    ],
  },
];

export const legalNav: readonly NavLink[] = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of service", href: "/terms-of-service" },
  { label: "Refund policy", href: "/refund-policy" },
  { label: "Legal information", href: "/legal-information" },
  { label: "Report abuse", href: "/report-abuse" },
  { label: "Accessibility", href: "/accessibility" },
];

export const socialLinks = [
  { label: "X", href: "https://x.com/serverlys" },
  { label: "Instagram", href: "https://www.instagram.com/getserverlys/" },
  { label: "TikTok", href: "https://www.tiktok.com/@serverlys" },
] as const;

export const announcement = {
  enabled: true,
  version: "2026-09-cloud",
  href: "/#plans",
  linkLabel: "See plans",
} as const;

/* ── Path helpers ───────────────────────────────────────────────────────── */

export function isActivePath(href: string, pathname: string): boolean {
  if (href.startsWith("http") || href.startsWith("#")) return false;
  const path = href.split("#")[0] || "/";
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(path + "/");
}

/** True when any item inside a nav entry points at the current section. */
export function isActiveItem(item: NavItem, pathname: string): boolean {
  if (!item.categories) return isActivePath(item.href, pathname);
  return item.categories.some((c) =>
    c.groups.some((g) =>
      g.items.some((i) => !i.external && isActivePath(i.href, pathname)),
    ),
  );
}

/** Flattened view for the mobile drawer. */
export function mobileSections(): ReadonlyArray<{
  label: string;
  groups: ReadonlyArray<{ heading: string; items: readonly MegaItem[] }>;
}> {
  return primaryNav
    .filter((i): i is Extract<NavItem, { categories: readonly MegaCategory[] }> =>
      Boolean(i.categories),
    )
    .map((item) => ({
      label: item.label,
      groups: item.categories.map((c) => ({
        heading: c.label,
        items: c.groups.flatMap((g) => g.items),
      })),
    }));
}
