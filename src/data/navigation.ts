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

export type NavItem =
  | { label: string; href: string; external?: boolean; columns?: never }
  | { label: string; href?: string; columns: readonly NavColumn[]; external?: never };

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
