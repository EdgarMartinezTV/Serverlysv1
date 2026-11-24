import type { FaqItem } from "@/components/ref/faqs";
import { billing } from "@/data/company";

/**
 * /migrations — copy.
 *
 * LAYOUT is a 1:1 rebuild of hostinger.com/website-migration as it stands on
 * 2026-11-24 (captured at 1440 and 390, at Edgar's request: "exactly like
 * this"). Bands in the reference's order:
 *   black hero (offer headline, three ticks, price row, white CTA)
 *   → black pricing (trust row + three dark plan cards)
 *   → "two steps" cards → navy "see how it works" screen
 *   → "why migrate" (media left, accordion right) → savings table
 *   → navy AI tools → navy money-back band → FAQ.
 *
 * CONTENT is Serverlys' own. Removed from the reference, matching the standing
 * calls on every clone: the Trustpilot / WordPress.org row, the customer
 * review cards, the Google / HostAdvice / WPBeginner ratings strip, and the
 * "Business / Agency plans" switch (we sell no agency tier). No reference
 * imagery is used — every visual is coded.
 *
 * Deliberately NOT claimed: "24/7" support (not a promise the site makes
 * consistently), AI-run migrations (people do ours), and a summed "save $X a
 * year" figure — the savings rows are typical market ranges, not our research.
 *
 * The hero and pricing headline follow the Black Friday sale while it runs
 * (data/pricing.ts BLACK_FRIDAY) and fall back to the evergreen copy after.
 */

export const HERO = {
  /** While Black Friday runs: "Up to 37% off" + this line. */
  bfTitle: "Website migration this Black Friday",
  /** After the sale. */
  accent: "Free",
  title: "website migration for every site you bring",
  bullets: [
    "Migrate as many websites as your plan holds, for free",
    "Our team moves it for you, with no downtime",
    "Real people on support, on every plan",
  ],
  from: "From",
  cta: "Claim deal",
  ctaEvergreen: "Migrate for free",
  guarantee: "30-day money-back guarantee",
};

export const PRICING_HEAD = {
  bfTitle: "Secure your deal before it’s gone",
  title: "Pick the plan for your needs",
  trust: ["30-day money-back guarantee", "Cancel anytime", "Free migration on every plan"],
  cta: "Choose plan",
  compare: "Compare every plan and billing term on the",
  compareLink: "pricing page",
  upfront:
    "Plans paid for longer terms are charged upfront. The monthly rate shown is the total plan price divided by the number of months.",
};

export const STEPS = {
  title: "All it takes is two steps, and we’ll handle the rest",
  items: [
    {
      icon: "cursor" as const,
      title: "Choose your plan",
      body: "Pick the plan with the resources your site needs. Every one includes free migration.",
    },
    {
      icon: "form" as const,
      title: "Fill out the form",
      body: "Send us your website’s address and a login for your current host or WordPress admin, plus any backup files you have.",
    },
    {
      icon: "check" as const,
      title: "We do the rest while your site stays live",
      body: "We copy your WordPress or other site from your current provider, test it on our servers, and switch it over with no downtime.",
    },
  ],
};

export const HOW = {
  title: "See how site migration works",
};

export const WHY = {
  title: "Why migrate to Serverlys?",
  cta: "See plans",
  ctaHref: "#pricing",
  items: [
    {
      icon: "gauge" as const,
      title: "Built for speed",
      body: "Every plan runs on LiteSpeed servers with NVMe storage and server-level caching built in, so pages load fast without a stack of plugins.",
    },
    {
      icon: "spark" as const,
      title: "Your data, protected",
      body: "Free SSL, daily backups and malware scanning come with every plan, so the site you move arrives safer than it left.",
    },
    {
      icon: "trend" as const,
      title: "Set up for success",
      body: "WordPress in one click, cPanel you already know, and DNS you can actually edit. Everything you need to get online and keep growing.",
    },
    {
      icon: "chat" as const,
      title: "Support from real people",
      body: "Every plan gets the same support queue, and a person reads your whole ticket, not a summary. Step-by-step tutorials cover the rest.",
    },
    {
      icon: "check" as const,
      title: "Free migration",
      body: "Buy a hosting plan and we move your WordPress or other websites to Serverlys for free, as many as your plan allows.",
    },
  ],
};

/**
 * "With Serverlys, save every year". The market column is a typical range
 * charged elsewhere, not our research — so there is no headline total.
 */
export const SAVINGS = {
  title: "With Serverlys, save every year",
  description: "Compare what others charge for features included with our hosting.",
  brandNote: "Included with every plan",
  market: "Typical cost elsewhere",
  marketNote: "Added to your bill",
  included: "Included",
  rows: [
    { feature: "Free website migration", market: "$30–$100/site" },
    { feature: "ConvoAI AI website chat", market: "$20–$40/mo" },
    { feature: "SSL certificate", market: "$10–$70/yr" },
    { feature: "Daily automated backups", market: "$2–$10/mo" },
    { feature: "Control panel (cPanel)", market: "$10–$15/mo" },
    { feature: "Malware scanning", market: "$5–$15/mo" },
  ],
  more: "See all features",
  less: "Show fewer",
};

export const AI_TOOLS = {
  title: "AI tools that do more, so you do less",
  items: [
    {
      id: "chat",
      title: "ConvoAI website chat",
      body: "An AI chat agent trained on your own site. It answers visitors around the clock and hands anything it cannot handle to you, with the transcript. Essentials is included with hosting.",
      href: "https://convoai.cloud/",
    },
    {
      id: "channels",
      title: "ConvoAI on WhatsApp and email",
      body: "Put the same agent on WhatsApp and your inbox, so customers get one consistent answer wherever they ask.",
      href: "https://convoai.cloud/",
    },
    {
      id: "auto",
      title: "Automations",
      body: "Turn an enquiry into a record, a booking into a calendar entry and a form into a message to the right person, without anyone remembering to do it.",
      href: "/automations",
    },
  ],
};

export const BANNER = {
  title: "30-day money-back guarantee",
  body: "If you are not 100% satisfied, you can request a refund of your payment within 30 days of your purchase. The process is simple and risk-free. For more information, please check our",
  linkLabel: "refund policy",
  linkHref: "/refund-policy",
  bodyTail: "(exclusions may apply).",
  cta: "Get started",
};

/** Where the form in step 2 actually lives. */
export const REQUEST_HREF = billing.migrationRequest;

export const FAQ_HEAD = {
  title: "Website migration FAQs",
  description:
    "Find answers to frequently asked questions about moving a site to Serverlys.",
};

export const FAQS: FaqItem[] = [
  {
    q: "How do I request my free website migration?",
    a: [
      {
        type: "p",
        runs: [
          { text: "Choose a cloud hosting plan and complete checkout. Then " },
          { text: "open a migration request", href: billing.migrationRequest },
          {
            text: " from your client area with your website's address and a login for your current host or WordPress admin. Our team replies to confirm, copies the site, and agrees the switch time with you. Questions before you buy? ",
          },
          { text: "Ask the team", href: billing.sales },
          { text: "." },
        ],
      },
    ],
  },
  {
    q: "How much does a website migration service cost?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "At Serverlys it is free with every cloud hosting plan, for as many websites as your plan allows. Elsewhere, prices range from free with a new hosting plan to a paid project for a complex site. For what drives the price and what to check before accepting a free migration, read ",
          },
          { text: "how much a website migration service costs", href: "/blog/website-migration-cost" },
          { text: "." },
        ],
      },
    ],
  },
  {
    q: "What do I need for a successful website migration?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "The website's URL and either its WordPress admin login or its control-panel login, plus any backup files you already have. If the site is not on WordPress, tell us what it runs on — we can still move it.",
          },
        ],
      },
    ],
  },
  {
    q: "Is it possible to migrate emails and domains to Serverlys?",
    a: [
      {
        type: "p",
        runs: [
          { text: "Yes, and they are separate jobs from the site itself. Start with " },
          { text: "transferring your domain", href: "/transfer-domain" },
          { text: ", then move the email service." },
        ],
      },
    ],
  },
  {
    q: "When do I point my domain name to Serverlys?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Only after the new copy is built and tested — repointing before that is what causes avoidable downtime. When it is ready we agree a quiet time with you, lower your DNS TTL beforehand so the change spreads in minutes, and switch it. If your domain is managed somewhere else, we tell you exactly which records to change and when, or make the change for you with your login.",
          },
        ],
      },
    ],
  },
  {
    q: "What types of websites cannot be migrated to Serverlys?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Sites built on closed-code website builders cannot be migrated, because their platforms do not let the files out. Wix, Squarespace and Shopify all work this way.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          { text: "In that case, consider rebuilding with our " },
          { text: "website design service", href: "/website-design" },
          { text: " and copying the content across." },
        ],
      },
    ],
  },
  {
    q: "How many websites can I move?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "As many as your plan allows, at no extra cost — whether that is one or a hundred. Note that each website needs its own migration request.",
          },
        ],
      },
    ],
  },
  {
    q: "How long does it take to move a website to Serverlys?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "It depends on the platform. A simple automatic WordPress migration is typically done in under two hours. A control-panel migration of another open-source CMS — Laravel, PrestaShop, or similar — usually takes longer, sometimes more than 20 hours. We can still migrate them.",
          },
        ],
      },
    ],
  },
  {
    q: "Do I need to inform my current hosting provider about the migration?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Usually not. Do make sure you do not cancel your existing hosting until the migration is fully complete — cancelling early is the one thing that can lose data.",
          },
        ],
      },
    ],
  },
  {
    q: "What happens to orders or messages that arrive during the move?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "They are kept. Your site keeps taking orders, sign-ups and form entries on your old host while we work. Right before the switch we run a final sync that copies across anything that changed since the first copy, so nothing placed during the move is lost.",
          },
        ],
      },
    ],
  },
  {
    q: "Will my website be reachable during the migration process?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Yes, the whole time. Your site keeps serving from its current host while we copy and test the new one. At the switch we sync anything that changed during the move, such as new orders, and while the DNS change spreads both servers have your full site, so every visitor lands on a working page. That is why you must keep your old hosting until we tell you the move is finished.",
          },
        ],
      },
    ],
  },
];
