/**
 * Site navigation — mirrors the live information architecture.
 *
 * `status: "soon"` items are real: Shared, VPS, Dedicated and CallFlow are
 * marked "Coming Soon" on the live site. They stay in the nav because they
 * carry SEO and demand signal, but they must never render as a buyable CTA.
 * The UI is responsible for making unavailability obvious.
 */

export type NavStatus = "live" | "soon";

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  status?: NavStatus;
  /** Renders with an external-link affordance and rel attributes. */
  external?: boolean;
};

export type NavColumn = {
  heading: string;
  links: readonly NavLink[];
};

/**
 * Optional highlighted panel at the end of a mega menu. Points at a real page
 * that already exists — it is a shortcut, not a promo slot to fill with copy.
 */
export type NavFeature = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

export type NavItem =
  | {
      label: string;
      href: string;
      external?: boolean;
      columns?: never;
      feature?: never;
    }
  | {
      label: string;
      href?: string;
      columns: readonly NavColumn[];
      feature?: NavFeature;
      external?: never;
    };

export const primaryNav: readonly NavItem[] = [
  {
    label: "Hosting",
    columns: [
      {
        heading: "Web hosting",
        links: [
          {
            label: "Shared hosting",
            href: "/shared-hosting",
            description: "Fast, reliable hosting for brochure sites and blogs",
            status: "soon",
          },
          {
            label: "VPS hosting",
            href: "/vps-hosting",
            description: "Scalable virtual private servers with root access",
            status: "soon",
          },
          {
            label: "Dedicated servers",
            href: "/dedicated-servers",
            description: "Maximum performance and full hardware control",
            status: "soon",
          },
        ],
      },
      {
        heading: "Cloud",
        links: [
          {
            label: "Cloud hosting",
            href: "/cloud-hosting",
            description: "Auto-scaling infrastructure that grows with traffic",
          },
          {
            label: "Managed hosting",
            href: "/managed-hosting",
            description: "We handle security, updates and monitoring",
          },
          {
            label: "CallFlow",
            href: "https://callflow.serverlys.com/",
            description: "AI voice reception for your business line",
            status: "soon",
            external: true,
          },
        ],
      },
    ],
    feature: {
      eyebrow: "Compare",
      title: "Every plan, with renewal prices",
      description: "See what each tier costs in year one and year two, side by side.",
      href: "/pricing",
      linkLabel: "View pricing",
    },
  },
  {
    label: "WordPress",
    columns: [
      {
        heading: "Hosting",
        links: [
          {
            label: "WordPress hosting",
            href: "/wordpress-hosting",
            description: "LiteSpeed caching and automatic core updates",
          },
          {
            label: "Ecommerce hosting",
            href: "/store-hosting",
            description: "WooCommerce-ready stores built for checkout speed",
          },
        ],
      },
      {
        heading: "Moving in",
        links: [
          {
            label: "WP migrations",
            href: "/wp-migrations",
            description: "We move the site, database and email. Free.",
          },
        ],
      },
    ],
    feature: {
      eyebrow: "Switching host",
      title: "Free migration, no downtime",
      description:
        "We move everything to staging first. DNS changes only when you say so.",
      href: "/wp-migrations",
      linkLabel: "How migration works",
    },
  },
  {
    label: "Domains",
    columns: [
      {
        heading: "Domains",
        links: [
          {
            label: "Register a domain",
            href: "/register-domain",
            description: "Find and secure your name, with free WHOIS privacy",
          },
          {
            label: "Transfer a domain",
            href: "/transfer-domain",
            description: "Move an existing domain to Serverlys",
          },
          {
            label: "WHOIS lookup",
            href: "/whois-lookup",
            description: "Check who owns a domain",
          },
        ],
      },
    ],
  },
  {
    label: "Services",
    columns: [
      {
        heading: "Design & build",
        links: [
          {
            label: "Web design",
            href: "/web-design",
            description: "Custom sites built to convert, not just to look good",
          },
          {
            label: "Custom development",
            href: "/custom-development",
            description: "Applications and integrations for your business",
          },
        ],
      },
      {
        heading: "Grow & maintain",
        links: [
          {
            label: "Site management",
            href: "/site-management",
            description: "Ongoing maintenance, updates and monitoring",
          },
          {
            label: "SEO & marketing",
            href: "/seo-marketing",
            description: "Drive qualified traffic and grow your brand",
          },
          {
            label: "ConvoAI",
            href: "https://convoai.cloud/",
            description: "AI chat agents that answer around the clock",
            external: true,
          },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
];

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

/**
 * Social accounts. These three are the ONLY accounts referenced by the live
 * site — verified in ~/Desktop/Archive. Do not add a network without an
 * account that actually exists; a dead social icon costs trust.
 */
export const socialLinks = [
  { label: "X", href: "https://x.com/serverlys" },
  { label: "Instagram", href: "https://www.instagram.com/getserverlys/" },
  { label: "TikTok", href: "https://www.tiktok.com/@serverlys" },
] as const;

/**
 * Announcement bar.
 *
 * `version` is part of the dismissal storage key: bumping it re-shows the bar
 * to everyone who dismissed the previous one. Change the copy AND the version
 * together, or returning visitors never see the new message.
 *
 * Set `enabled: false` to remove the bar entirely — no code change needed.
 */
export const announcement = {
  enabled: true,
  version: "2026-09-cloud",
  /** Filled from real pricing data at render time — never hard-code a price. */
  href: "/pricing",
  linkLabel: "See plans",
} as const;

/**
 * Is `href` the current section?
 *
 * Exact match for "/", prefix match otherwise, so /blog/some-post correctly
 * marks /blog as current. Prefix matching guards on a "/" boundary so
 * /cloud-hosting does not light up for /cloud-hosting-alternatives.
 */
export function isActivePath(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** True when any link inside a nav item points at the current section. */
export function isActiveItem(item: NavItem, pathname: string): boolean {
  if (!("columns" in item) || !item.columns) {
    return "href" in item && typeof item.href === "string"
      ? isActivePath(item.href, pathname)
      : false;
  }
  return item.columns.some((col) =>
    col.links.some((l) => !l.external && isActivePath(l.href, pathname)),
  );
}
