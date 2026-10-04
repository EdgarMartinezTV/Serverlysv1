/**
 * The map of where Sera may take a visitor. PURE DATA, ZERO IMPORTS.
 *
 * Split from `navigation.ts` so it can be loaded by a plain Node process —
 * `scripts/test-sera.mjs` imports it directly to check every anchor against
 * the live pages, and it cannot resolve the `@/` alias that the resolver needs
 * for `routes.ts`. The split is not just a test convenience: this file is the
 * inventory, `navigation.ts` is the logic that validates against it, and those
 * are different things with different reasons to change.
 *
 * ⚠ EVERY ANCHOR HERE WAS READ OFF THE RENDERED HTML, not from a component or
 * from memory. The test suite re-checks them on every run, so a section that
 * gets renamed or removed fails there instead of quietly becoming a dead
 * scroll for a visitor Sera just promised to show something to.
 */

export type SectionSpec = {
  /** The element id on the page. Must exist in the rendered HTML. */
  id: string;
  /** How the model refers to it, and what the visitor is told. */
  label: string;
};

export type PageNav = {
  path: string;
  /** Human name, used in the confirmation line the visitor sees. */
  label: string;
  sections: readonly SectionSpec[];
};

export const NAVIGABLE: readonly PageNav[] = [
  {
    path: "/",
    label: "Home",
    sections: [
      { id: "plans", label: "Plans" },
      { id: "migration", label: "Free migration" },
      { id: "pricing-heading", label: "Pricing" },
      { id: "faq-heading", label: "FAQ" },
    ],
  },
  {
    path: "/hosting",
    label: "Hosting",
    sections: [
      { id: "plans", label: "Plans" },
      { id: "pricing-heading", label: "Pricing" },
      { id: "fit-heading", label: "Which tier fits" },
      { id: "migration", label: "Free migration" },
      { id: "domains", label: "Domains" },
      { id: "faq-heading", label: "FAQ" },
    ],
  },
  {
    path: "/wordpress-hosting",
    label: "WordPress hosting",
    sections: [
      { id: "plans", label: "Plans and pricing" },
      { id: "agent", label: "The chat agent" },
      { id: "performance", label: "Performance" },
      { id: "features", label: "Protection" },
      { id: "wp-move-heading", label: "Free migration" },
      { id: "faq-heading", label: "FAQ" },
    ],
  },
  {
    path: "/cloud-hosting",
    label: "Cloud hosting",
    sections: [
      { id: "pricing", label: "Plans and pricing" },
      { id: "build", label: "Start fresh or move a site" },
      { id: "performance", label: "Performance" },
      { id: "security", label: "Security" },
      { id: "cloud-faq-heading", label: "FAQ" },
    ],
  },
  {
    path: "/ecommerce-hosting",
    label: "Ecommerce hosting",
    sections: [
      { id: "pricing", label: "Plans and pricing" },
      { id: "agent", label: "The store chat agent" },
      { id: "ecom-speed-heading", label: "Store speed" },
      { id: "ecom-security-heading", label: "Security" },
      { id: "ecom-migration-heading", label: "Moving an existing store" },
      { id: "ecom-faq-heading", label: "FAQ" },
    ],
  },
  {
    path: "/pricing",
    label: "Pricing",
    sections: [
      { id: "pricing-heading", label: "All plans" },
      { id: "compare-heading", label: "Full comparison" },
      { id: "pr-faq-heading", label: "Pricing FAQ" },
    ],
  },
  {
    path: "/migrations",
    label: "Migrations",
    sections: [
      { id: "wm-how-heading", label: "How the migration works" },
      { id: "wm-steps-heading", label: "The steps" },
      { id: "wm-why-heading", label: "Why move to Serverlys" },
      { id: "pricing", label: "What it costs" },
      { id: "wm-faq-heading", label: "FAQ" },
    ],
  },
  {
    path: "/domain-name",
    label: "Domains",
    sections: [
      { id: "search", label: "Domain search" },
      { id: "tld-prices", label: "Extension prices" },
      { id: "dn-popular-heading", label: "Popular extensions" },
      { id: "dn-faq-heading", label: "FAQ" },
    ],
  },
  {
    path: "/seo",
    label: "SEO",
    sections: [
      { id: "pages", label: "Pages and content" },
      { id: "speed", label: "Speed and Core Web Vitals" },
      { id: "faq-heading", label: "FAQ" },
    ],
  },
  {
    path: "/website-development",
    label: "Website development",
    sections: [
      { id: "wd-plans", label: "Plans" },
      { id: "wd-ways", label: "Ways we work" },
      { id: "wd-tackle", label: "What we take on" },
      { id: "wd-faq", label: "FAQ" },
    ],
  },
  {
    path: "/automations",
    label: "Automations",
    sections: [
      { id: "how-it-works", label: "How it works" },
      { id: "workflows", label: "Example workflows" },
      { id: "integrations", label: "Integrations" },
      { id: "faq", label: "FAQ" },
    ],
  },
  {
    path: "/ai-agents",
    label: "AI agents",
    sections: [
      { id: "chat", label: "Chat agents" },
      { id: "voice", label: "Voice agents" },
      { id: "automation", label: "Automation" },
      { id: "faq-heading", label: "FAQ" },
    ],
  },
  {
    path: "/faq",
    label: "FAQ",
    sections: [
      { id: "pricing", label: "Pricing" },
      { id: "hosting", label: "Hosting" },
      { id: "wordpress", label: "WordPress" },
      { id: "ecommerce", label: "Ecommerce" },
      { id: "domains", label: "Domains" },
      { id: "ai", label: "AI" },
    ],
  },
] as const;
