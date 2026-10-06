import type { FaqItem } from "@/components/ref/faqs";
import type { SwitchCopy } from "@/components/ref/content-switch";

/**
 * Website migration page content.
 *
 * A 1:1 rebuild of hostinger.com/website-migration, on the same terms as the
 * other reference pages: section order, grid, type scale and copy, brand noun
 * swapped, links repointed at our routes. Measurements in ref/kit.tsx.
 *
 * Measured, not guessed — the reference was screenshotted and its computed
 * styles dumped before any of this was written. Notable numbers: the hero h1
 * is 36/44 (smaller than the hosting pages' 48/56), the two dark bands are
 * #110c29, and the compare table sits in a 48px band rather than 80px.
 *
 * ⚠ ONE THING NEEDS REPLACING: `AI_TOOLS` describes "Serverlys Agent", which
 * does not exist — same problem flagged on /ecommerce-hosting. Either build
 * it, repoint it at ConvoAI as that page's agent band was repointed, or cut
 * the band.
 *
 * Removed from the reference, matching the standing calls on the other clones:
 * the hero's Trustpilot + WordPress.org row, the customer review carousel, and
 * the Google/HostAdvice/WPBeginner ratings strip.
 */

export const HERO = {
  title: "The last website migration you’ll ever need",
  bullets: [
    "Migrate an unlimited number of websites for free",
    "Automated migration without hassle or downtime",
    "24/7 customer support",
  ],
  cta: "Migrate for free",
  guarantee: "30-day money-back guarantee",
};

export const STEPS = {
  title: "All it takes is two steps, and we’ll handle the rest",
  items: [
    {
      icon: "cursor" as const,
      title: "Choose your plan",
      body: "We have a range of options. Simply choose a plan with the features and resources your site needs.",
    },
    {
      icon: "form" as const,
      title: "Fill out form",
      body: "Enter your website's details including the URL, logins, and any backup files – and we'll do the rest.",
    },
    {
      icon: "check" as const,
      title: "We do the rest while your site stays live",
      body: "We'll migrate your WordPress or other site from another provider quickly and securely, keeping it up and running throughout.",
    },
  ],
};

export const HOW = {
  title: "See how site migration works",
};

/** The reference's `h-content-switch`. */
export const WHY: SwitchCopy = {
  title: "Why migrate to Serverlys?",
  cta: "See plans",
  ctaHref: "#pricing",
  items: [
    {
      icon: "spark",
      title: "Built for speed",
      body: "Every plan runs on LiteSpeed servers with NVMe storage and server-level caching built in, so pages are served fast without a stack of plugins.",
    },
    {
      icon: "shield",
      title: "Your data, protected",
      body: "Free SSL, daily backups and a malware scanner come with the plan, so the site you move arrives safer than it left.",
    },
    {
      icon: "store",
      title: "Set up for success",
      body: "Get everything you need to not only get online but succeed — WordPress in one click, staging, and DNS you can actually edit.",
    },
    {
      icon: "megaphone",
      title: "24/7 expert support",
      body: "Fast, helpful support via live chat, plus a library of step-by-step tutorials. A person reads the whole ticket, not a summary.",
    },
    {
      icon: "gift",
      title: "Free migration",
      body: "All you need to do is purchase a hosting plan, and you can then enjoy unlimited free WordPress and other website migrations to Serverlys.",
    },
  ],
};

/**
 * "With Serverlys, save every year".
 *
 * ⚠ The reference prices each row against a "market cost" range and totals a
 * headline saving. Those competitor figures are Hostinger's research, not
 * ours, so the market column here says what it is — a typical range — and
 * there is no invented total. Replace `market` with your own sourced figures
 * (and cite them) before leaning on this band commercially.
 */
export const SAVINGS = {
  title: "With Serverlys, save every year",
  description: "Compare what others charge for features included with our hosting.",
  columns: { feature: "Feature", serverlys: "With Serverlys", market: "Typically charged elsewhere" },
  included: "Included",
  rows: [
    { feature: "Website migration", market: "$30–$100 per site" },
    { feature: "Free SSL certificate", market: "$10–$70 per year" },
    { feature: "Control panel (cPanel)", market: "$10–$15/mo" },
    { feature: "Daily automated backups", market: "$2–$10/mo" },
    { feature: "WHOIS privacy", market: "$5–$15 per year" },
  ],
  cta: { label: "See all features", href: "/pricing" },
};

/** ⚠ Describes a product that does not exist. See the file header. */
export const AI_TOOLS = {
  title: "AI tools that do more, so you do less",
  items: [
    {
      title: "ConvoAI",
      body: "A chat agent trained on your own site. It answers the questions that make up most of your volume and hands the rest to a person with the transcript.",
      href: "https://convoai.cloud/",
    },
    {
      title: "CallFlow",
      body: "A voice agent that answers your phone, books the job, and sends you the transcript.",
      href: "https://callflow.serverlys.com/",
    },
    {
      title: "Automations",
      body: "Turn a conversation into a workflow — a booking, a ticket, a follow-up — without wiring it yourself.",
      href: "/automations",
    },
  ],
};

export const PRICING_HEAD = {
  title: "Pick the plan for your needs",
  description:
    "Choose the plan that works best for you – each comes with unlimited free website migrations and a 30-day money-back guarantee.",
};

export const BANNER = {
  title: "30-day money-back guarantee",
  body: "If you are not 100% satisfied, you can request a refund of your payment within 30 days of your purchase. The process is seamless and risk-free. For more information, please check our",
  linkLabel: "refund policy",
  linkHref: "/refund-policy",
  bodyTail: "(exclusions may apply).",
  cta: "Get started",
};

export const FAQ_HEAD = {
  title: "Website migration FAQs",
  description: "Find answers to frequently asked questions about moving a site to Serverlys.",
};

export const FAQS: FaqItem[] = [
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
            text: "After the website migration completes. We email you as soon as the transfer is successful — repointing before that is what causes avoidable downtime.",
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
    q: "Will my website be reachable during the migration process?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Yes. Your site keeps serving from its current host throughout, so you will not lose visitors or sales. You may see brief inconsistency after the migration while DNS propagates.",
          },
        ],
      },
    ],
  },
];
