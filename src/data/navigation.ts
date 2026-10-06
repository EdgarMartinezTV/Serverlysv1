import { billing } from "./company";
import { legalDoc } from "./legal";

/**
 * Site navigation.
 *
 * Data-driven so the mega menu can grow without touching components: a
 * category, group, item, badge or promo is added here and the UI follows.
 *
 * `status: "soon"` marks a product that is not SELF-SERVE PURCHASABLE — Shared,
 * VPS and Dedicated are quoted rather than bought from a cart. It does not mean
 * the page is unfinished: all three have full product pages, and their CTAs are
 * contact-led on purpose. The badge therefore reads "By request", not "Soon" —
 * a "Soon" badge beside a complete page tells the visitor the page is broken.
 *
 * Such items must never render a purchase CTA. Whether an entry renders as a
 * link at all is decided by `resolveNavTarget` in `data/routes.ts`, which
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

export type NavBadge = {
  text: string;
  tone: "brand" | "success" | "warning" | "neutral";
};

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
  /**
   * A sister product with its own logo. When set, the promo shows that mark in
   * place of the eyebrow text — the panel is the first place someone meets the
   * product, and its own lockup says more there than its name set in our type.
   * `eyebrow` stays required as the accessible fallback.
   */
  brand?: "convoai";
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
            description: "Picks up the phone when nobody can.",
          },
          {
            label: "Automations",
            href: "/automations",
            icon: "bolt",
            description: "The admin nobody wants to do, done for you.",
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
      brand: "convoai",
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
            href: "/ecommerce-hosting",
            icon: "cart",
            description: "WooCommerce-ready, fast at checkout.",
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
            badge: { text: "By request", tone: "neutral" },
            description: "Brochure sites and blogs.",
          },
          {
            label: "VPS hosting",
            href: "/vps-hosting",
            icon: "server",
            status: "soon",
            badge: { text: "By request", tone: "neutral" },
            description: "Root access, dedicated resources.",
          },
          {
            label: "Dedicated servers",
            href: "/dedicated-servers",
            icon: "server",
            status: "soon",
            badge: { text: "By request", tone: "neutral" },
            description: "Single-tenant hardware.",
          },
        ],
      },
    ],
    promo: {
      eyebrow: "Renewal pricing",
      title: "Year two, before you buy",
      body: "Every tier shows what it renews at next to today's price. The real number is on the page.",
      cta: { label: "Compare plans", href: "/pricing" },
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
            label: "Domain names",
            href: "/domain-name",
            icon: "globe",
            description: "How domains work, and what they renew at.",
          },
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
            href: "/website-design",
            icon: "layout",
            description: "Sites built to convert.",
          },
          {
            label: "Custom development",
            href: "/website-development",
            icon: "wrench",
            description: "Applications and integrations.",
          },
          {
            label: "Migrations",
            href: "/migrations",
            icon: "compass",
            description: "Site, database and email. Free.",
          },
        ],
      },
      {
        heading: "Grow it",
        items: [
          {
            label: "SEO",
            href: "/seo",
            icon: "chart",
            description: "Rankings you can trace to revenue.",
          },
          {
            label: "Marketing",
            href: "/marketing",
            icon: "gauge",
            description: "Spend measured against booked work.",
          },
          {
            label: "Site management",
            href: "/site-management",
            icon: "wrench",
            description: "Maintenance and monitoring.",
          },
          {
            label: "Social media",
            href: "/social-media",
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
            href: "/migrations",
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
            label: "Business solutions",
            href: "/business-solutions",
            icon: "layout",
            description: "The whole setup from one supplier.",
          },
          {
            label: "Blogs and brochure sites",
            href: "/pricing",
            icon: "book",
            description: "One site, steady traffic.",
          },
          {
            label: "Online stores",
            href: "/ecommerce-hosting",
            icon: "cart",
            description: "Checkout that stays fast under load.",
          },
          {
            label: "Agencies",
            href: "/pricing",
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
      cta: { label: "Find my plan", href: "/pricing" },
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
            href: "/pricing",
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
            label: "All resources",
            href: "/resources",
            icon: "compass",
            description: "Guides, answers and tools in one place.",
          },
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
          {
            label: "FAQ",
            href: "/faq",
            icon: "book",
            description: "Pricing, renewals, refunds and domains.",
          },
        ],
      },
    ],
    promo: {
      eyebrow: "Read first",
      title: "What renewal really costs",
      body: "The number that decides the price of hosting is year two, not year one. We publish both.",
      cta: { label: "See pricing", href: "/pricing" },
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
            label: "Support",
            href: "/support",
            icon: "lifebuoy",
            description: "What is included, and how to reach us.",
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
  { label: "Pricing", href: "/pricing" },
  { label: "Products", railLabel: "Products", categories: PRODUCT_CATEGORIES },
  { label: "Solutions", railLabel: "Solutions", categories: SOLUTION_CATEGORIES },
  { label: "Resources", railLabel: "Resources", categories: RESOURCE_CATEGORIES },
];

/* ── Footer, social, announcement (unchanged consumers) ─────────────────── */

export const footerNav: readonly NavColumn[] = [
  {
    heading: "Hosting",
    links: [
      { label: "All hosting", href: "/hosting" },
      { label: "Cloud hosting", href: "/cloud-hosting" },
      { label: "WordPress hosting", href: "/wordpress-hosting" },
      { label: "Ecommerce hosting", href: "/ecommerce-hosting" },
      { label: "Managed hosting", href: "/managed-hosting" },
      { label: "Shared hosting", href: "/shared-hosting", status: "soon" },
      { label: "VPS hosting", href: "/vps-hosting", status: "soon" },
      { label: "Dedicated servers", href: "/dedicated-servers", status: "soon" },
    ],
  },
  {
    heading: "Domains",
    links: [
      { label: "Domain names", href: "/domain-name" },
      { label: "Register a domain", href: "/register-domain" },
      { label: "Transfer a domain", href: "/transfer-domain" },
      { label: "WHOIS lookup", href: "/whois-lookup" },
    ],
  },
  {
    heading: "AI and automation",
    links: [
      { label: "ConvoAI", href: "https://convoai.cloud/", external: true },
      { label: "CallFlow AI", href: "https://callflow.serverlys.com/", external: true },
      { label: "Automations", href: "/automations" },
      { label: "AI tools", href: "/ai-tools" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Web design", href: "/website-design" },
      { label: "Custom development", href: "/website-development" },
      { label: "SEO", href: "/seo" },
      { label: "Marketing", href: "/marketing" },
      { label: "Social media", href: "/social-media" },
      { label: "Site management", href: "/site-management" },
      { label: "Migrations", href: "/migrations" },
      { label: "Business solutions", href: "/business-solutions" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our process", href: "/our-process" },
      { label: "Blog", href: "/blog" },
      /* "Legal information" was here until 2026-09-19. It moved to the legal
         row below as the "All legal documents" gateway — having it in both
         places meant the hub was linked twice from one footer, which is part
         of what made that footer read as clutter. */
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "All resources", href: "/resources" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Hosting comparison", href: "/hosting-alternatives" },
      { label: "FAQ", href: "/faq" },
      { label: "Support", href: "/support" },
      { label: "Report abuse", href: "/report-abuse" },
    ],
  },
];

/**
 * Guarantees shown in the footer trust strip.
 *
 * EVERY ONE IS A REAL, PUBLISHED SERVERLYS COMMITMENT — the same four that
 * appear on the pricing page and in the refund policy. Nothing here is an
 * uptime percentage, an award, a certification or a customer count, because
 * none of those are verified. A trust strip built from unverifiable claims is
 * the fastest way to lose the trust it is trying to build.
 */
export const footerGuarantees = [
  {
    icon: "shield" as NavIconName,
    label: "30-day money back",
    detail: "On every hosting plan, no reason required.",
  },
  {
    icon: "compass" as NavIconName,
    label: "Free migration",
    detail: "Staged first. DNS moves when you approve it.",
  },
  {
    icon: "wrench" as NavIconName,
    label: "Free SSL and backups",
    detail: "Daily restore points, and restores cost nothing.",
  },
  {
    icon: "lifebuoy" as NavIconName,
    label: "One support queue",
    detail: "Every plan, every tier. No priority to buy.",
  },
] as const;

/**
 * The footer legal strip.
 *
 * A hosting company is asked for more of these than a typical business,
 * because it holds other people's data and serves other people's content.
 * Ordered by how often a reader actually needs one rather than alphabetically:
 * the three everyone looks for first, then the operational policies, then the
 * ones aimed at a third party rather than a customer.
 *
 * Every entry here must be a built, indexable route in data/routes.ts. The
 * footer is the one place a legal document is reliably reachable from, so a
 * policy that exists but is not listed here is, in practice, unpublished.
 */
/**
 * The footer's legal row — FOUR documents and a gateway, not the whole set.
 *
 * ⚠ THIS IS DELIBERATELY NOT `legalDocuments`. Mapping the full registry into
 * the footer was tried on 2026-09-19 and immediately reverted: seventeen
 * documents plus the cookie link wrapped to THREE dense lines of near-identical
 * grey text under the wordmark, which is not an index — it is a wall. It also
 * put "Report abuse" and "Legal information" in the footer twice, since both
 * already appear in the columns above.
 *
 * The hub at `/legal-information` is the index. It groups all seventeen by
 * what they do and carries the order of precedence, which a flat footer row
 * can never convey. The footer's job is the handful a visitor actually reaches
 * for, plus one obvious way through to the rest.
 *
 * These four earn the slot on different grounds and each is load-bearing:
 *   · terms + privacy — the two every visitor and every app store, payment
 *     provider and ad platform expects to find in a footer.
 *   · refund — this company's commercial position. Burying it would be odd
 *     given the homepage leads on honest pricing.
 *   · accessibility — conventionally footer-linked, and the statement is how
 *     someone reports a barrier.
 *
 * Titles are still READ from the registry, so a renamed document cannot show a
 * stale label here. Only the selection is hand-held; `legalDoc()` throws at
 * build time if one of these paths stops existing.
 *
 * The gateway link to the hub is rendered by the footer itself, not listed
 * here, because it is styled differently — see site-footer.tsx.
 */
const FOOTER_LEGAL: readonly string[] = [
  "/terms-of-service",
  "/privacy-policy",
  "/refund-policy",
  "/accessibility",
];

export const legalNav: readonly NavLink[] = FOOTER_LEGAL.map((path) => {
  const doc = legalDoc(path);
  return { label: doc.title, href: doc.path };
});

export const socialLinks = [
  { label: "X", href: "https://x.com/serverlys" },
  { label: "Instagram", href: "https://www.instagram.com/getserverlys/" },
  { label: "TikTok", href: "https://www.tiktok.com/@serverlys" },
] as const;

/**
 * The bar above the header.
 *
 * ⚠ Bump `version` whenever the CONTENT changes. Dismissal is stored under a
 * key built from it, so anyone who closed the previous message would otherwise
 * never see this one — the old bar would stay dismissed forever.
 *
 * No countdown and no "ends tonight". CallFlow is simply available; inventing a
 * deadline to create urgency is a dark pattern, and this company's whole
 * pricing position is that it does not do that.
 */
export const announcement = {
  enabled: false,
  version: "2026-09-callflow",
  badge: "New",
  title: "A voice agent that answers your phone",
  /**
   * Swapped in below sm. The bar must hold ONE line at 320px: the full title
   * plus the full link label wraps at 390px, and a two-line promo pushes the
   * hero down on exactly the devices with the least vertical room.
   */
  titleShort: "Your phone, answered by AI",
  /** Dropped below md, where there is no room for a second clause. */
  detail: "CallFlow books the job and sends you the transcript.",
  href: "https://callflow.serverlys.com/",
  linkLabel: "Hear it answer",
  linkLabelShort: "Hear it",
} as const;

/* ── Path helpers ───────────────────────────────────────────────────────── */

export function isActivePath(href: string, pathname: string): boolean {
  if (href.startsWith("http") || href.startsWith("#")) return false;
  const path = href.split("#")[0] || "/";
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(path + "/");
}

/**
 * The ONE top-level entry that owns the current page, so the header never
 * highlights two at once.
 *
 * Menus cross-link on purpose (Solutions points at /pricing, /cloud-hosting
 * and /#migration), so "any child matches" lit Solutions on the homepage and
 * next to Pricing on /pricing. Ownership is now: a direct link wins, then the
 * first menu in header order that lists the page. Anchor links never count,
 * since `/#migration` is a section of the homepage, not a page in a menu.
 */
function owningItem(pathname: string): NavItem | undefined {
  const direct = primaryNav.find((i) => !i.categories && isActivePath(i.href, pathname));
  if (direct) return direct;
  return primaryNav.find((item) =>
    item.categories?.some((c) =>
      c.groups.some((g) =>
        g.items.some(
          (i) => !i.external && !i.href.includes("#") && isActivePath(i.href, pathname),
        ),
      ),
    ),
  );
}

/** True when this nav entry is the one that owns the current page. */
export function isActiveItem(item: NavItem, pathname: string): boolean {
  return owningItem(pathname) === item;
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
