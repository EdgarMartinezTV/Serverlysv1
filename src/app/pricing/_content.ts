import type { FaqItem } from "@/components/ref/faqs";

/**
 * Pricing page content.
 *
 * A 1:1 rebuild of hostinger.com/pricing — screenshotted and measured before
 * a line was written. Geometry: dark hero band 652px tall, h1 56/64 at
 * -0.28px centred and capped to 646px, category pills in two centred rows;
 * plan bands on #f5f5f6 with 48px padding, the segmented control left and the
 * term control right of a 1280 grid; compare table 48px padding with a centred
 * 48/56 h2; FAQ band 80px padding.
 *
 * TWO CONTROLS FROM THE REFERENCE ARE DELIBERATELY NOT HERE, because ours
 * would be theatre:
 *  · the "48 months plan" term dropdown — we advertise one monthly rate with
 *    no term attached, so a select with a single option has nothing to select;
 *  · the "Individuals & business / Agency" toggle — we publish no separate
 *    agency price list, so a toggle that changes nothing would mislead.
 * Both come back the moment there is a second term or an agency rate.
 *
 * Prices are `data/pricing.ts` and `data/tlds.ts`. Nothing here is hardcoded.
 */

export const HERO = {
  title: "Plans & pricing",
  trust: [
    { icon: "shield" as const, label: "30-day money-back guarantee" },
    { icon: "support" as const, label: "24/7 support" },
    { icon: "cancel" as const, label: "Cancel anytime" },
  ],
};

/** The category pills. Each maps to something we actually price. */
export const TABS = [
  { id: "cloud", label: "Cloud hosting", icon: "cloud" as const },
  { id: "wordpress", label: "WordPress hosting", icon: "wordpress" as const },
  { id: "ecommerce", label: "Ecommerce hosting", icon: "store" as const },
  { id: "domains", label: "Domains", icon: "globe" as const },
] as const;

export const BANDS: Record<string, { title: string; includes: string[] }> = {
  cloud: {
    title: "Cloud hosting",
    includes: ["Unlimited NVMe storage", "Free domain", "Free SSL", "Daily backups"],
  },
  wordpress: {
    title: "WordPress hosting",
    includes: ["One-click WordPress", "Free domain", "Free SSL", "Auto updates"],
  },
  ecommerce: {
    title: "Ecommerce hosting",
    includes: ["WooCommerce ready", "Free domain", "Free SSL", "Store migrator"],
  },
  domains: {
    title: "Domains",
    includes: ["Registry-checked availability", "WHOIS privacy where permitted", "Free DNS"],
  },
};

export const INCLUDES_LABEL = "All plans include:";
export const TERM_NOTE =
  "All prices are a monthly rate, shown beside the standard rate they discount.";
export const CTA = "Choose plan";

/** Per-tier rationale. Ours — the store publishes no equivalent line. */
export const WHY: Record<string, string> = {
  starter: "One site on unlimited NVMe, with the domain and SSL already in the price.",
  plus: "Seven sites and ~25,000 monthly visits — room to grow into.",
  turbo: "Unlimited sites and 6 GB RAM. The tier most projects settle on.",
  business: "8 GB RAM and ~100,000 monthly visits, for peak-season traffic.",
};

export const COMPARE = {
  title: "Compare our plans",
  description: "See at a glance what each plan costs and what it includes.",
  rows: [
    { label: "Monthly rate", key: "monthly" as const },
    { label: "Standard rate", key: "standard" as const },
    { label: "Websites", key: "sites" as const },
    { label: "Monthly visits", key: "visits" as const },
    { label: "RAM", key: "memory" as const },
    { label: "Storage", key: "storage" as const },
    { label: "Bandwidth", key: "transfer" as const },
    { label: "Setup fee", key: "setupFee" as const },
  ],
};

export const FAQ_HEAD = {
  title: "Serverlys pricing FAQs",
  description: "What the prices include, what they renew at, and how to change plan.",
};

export const FAQS: FaqItem[] = [
  {
    q: "How do I register the free domain included with annual hosting plans?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "You claim it during checkout, or afterwards from the billing panel. It is free for the first year and renews at the published rate for that extension — which is listed on the ",
          },
          { text: "domain pages", href: "/domain-name" },
          { text: "." },
        ],
      },
    ],
  },
  {
    q: "How do I activate the free SSL certificate?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "It is issued automatically once the domain points at us, and renews on its own. There is nothing to buy and nothing to install.",
          },
        ],
      },
    ],
  },
  {
    q: "Can I change my plan if my circumstances change?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Yes. Upgrades apply immediately and are prorated against what you have already paid. Downgrades take effect at the end of the current term.",
          },
        ],
      },
    ],
  },
  {
    q: "Why do different plans cost different amounts?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "They differ in how many sites they carry, how much traffic they absorb and how much memory they get. The compare table above puts those side by side — the price tracks the resources, not the feature list, which is near-identical across tiers.",
          },
        ],
      },
    ],
  },
  {
    q: "Why is the renewal price higher than the price I pay today?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Because the advertised rate is a promotional rate and the renewal is the standard rate. We show both on every card and in the compare table, because a promotional price on its own tells you very little about what hosting will actually cost you — and quoting only that figure is the practice we position against.",
          },
        ],
      },
    ],
  },
  {
    q: "Can I migrate existing websites to Serverlys?",
    a: [
      {
        type: "p",
        runs: [
          { text: "Yes, and it is free on every plan, for as many sites as the plan carries. See " },
          { text: "website migration", href: "/migrations" },
          { text: " for what we need from you and how long it takes." },
        ],
      },
    ],
  },
  {
    q: "I have a domain at another company. Can I transfer it?",
    a: [
      {
        type: "p",
        runs: [
          { text: "Yes — your remaining registration comes with it. See " },
          { text: "domain transfer", href: "/transfer-domain" },
          { text: " for the auth code and the 60-day ICANN rule." },
        ],
      },
    ],
  },
  {
    q: "Which should I choose — cloud, WordPress or ecommerce hosting?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "They run on the same infrastructure at the same prices; the difference is what is tuned and preinstalled. Pick WordPress for a WordPress site, ecommerce for a store, and cloud for anything else or for mixed workloads.",
          },
        ],
      },
    ],
  },
  {
    q: "Do you offer VPS or dedicated servers?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "By request rather than from a published price list, because those are specified per project. ",
          },
          { text: "Tell us what you need", href: "/vps-hosting" },
          { text: " and we will quote it." },
        ],
      },
    ],
  },
];
