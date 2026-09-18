import type { FaqItem } from "@/components/ref/faqs";

/**
 * Ecommerce hosting page content.
 *
 * A deliberate 1:1 rebuild of hostinger.com/woocommerce-hosting, on the same
 * terms as /cloud-hosting: section order, grid, type scale and copy lifted
 * verbatim at the owner's instruction, brand noun swapped, links repointed at
 * our own routes. See `src/components/ref/kit.tsx` for the measurements.
 *
 * Plans are NOT here — the pricing band reads `src/data/pricing.ts`, which is
 * the source of truth for what we charge.
 *
 * ⚠ ONE THING IN HERE STILL NEEDS REPLACING before this reaches production:
 * `EMAIL` is the reference's section for "Hostinger Reach", their email
 * marketing tool, swapped to "Serverlys Reach" — which is not a product that
 * exists. Either build it, repoint it, or cut the section, the way `AGENT` was
 * repointed at ConvoAI and the customer-story carousel was cut.
 *
 * `AGENT` and `SUPPORT` are no longer the reference's copy at all: both now
 * describe ConvoAI, which we do ship. See the note above AGENT.
 *
 * Removed from the reference, matching the calls already made on
 * /cloud-hosting: the hero's Trustpilot + WordPress.org proof row, the
 * Hostinger Connector band, and the Google/HostAdvice/WPBeginner ratings strip
 * (third-party ratings of them, not of us).
 */

export const HERO = {
  eyebrowPrefix: "Up to ",
  eyebrowAccent: "79%",
  eyebrowSuffix: " off WooCommerce hosting",
  title: "Start selling with confidence",
  bullets: [
    "Free domain and website migration",
    "Quick setup, easy to scale",
    "Fully managed maintenance for WooCommerce",
    "24/7 customer support",
  ],
  cta: "Start now",
  guarantee: "30-day money-back guarantee",
};

export const PRICING_HEAD = {
  title: "Choose your managed WooCommerce plan",
  description:
    "Every Managed WooCommerce plan comes with a free domain name, unlimited free SSL certificates, 100 free email addresses, and a free CDN.",
  cta: "Choose plan",
  compare: "View all features",
  /** The reference's two footnotes, kept in its order. */
  fairUsage: { lead: "Unlimited features are subject to our ", link: "Fair Usage Policy", href: "/terms-of-service" },
  upfront:
    "All plans are paid upfront. The monthly rate reflects the total plan price divided by the number of months in your plan.",
  why: "Why this plan?",
};

/**
 * The reference's "Why this plan?" panel carries copy distinct from the card's
 * own description. The WHMCS store publishes no equivalent line, so these are
 * ours — each one restates the tier's real differentiator from
 * `data/pricing.ts` rather than repeating `summary`, which is what the card
 * already shows two lines above.
 */
export const WHY: Record<string, string> = {
  starter: "One store on unlimited NVMe, with the domain and SSL already in the price.",
  plus: "Seven sites and ~25,000 monthly visits — room for the catalogue to grow.",
  turbo: "Unlimited sites and 6 GB RAM. The tier most stores settle on.",
  business: "8 GB RAM and ~100,000 monthly visits, for peak-season traffic.",
};

/**
 * A checklist item. `runs` keeps the reference's inline bolding, which is
 * load-bearing — it is how each line puts its claim first.
 */
export type Run = { text: string; bold?: boolean };

export const LAUNCH = {
  title: "Launch quickly, scale effortlessly",
  description: "Skip the complex setup process and get straight to business.",
  items: [
    [{ text: "Secure a " }, { text: "free domain", bold: true }, { text: " for your brand." }],
    [
      { text: "Install " },
      { text: "WooCommerce in one click", bold: true },
      { text: " and start building your store." },
    ],
    [
      { text: "Boost conversions with " },
      { text: "AI-generated product descriptions.", bold: true },
    ],
    [
      { text: "Enjoy " },
      { text: "high uptime and performance", bold: true },
      { text: ", thanks to stable and secure cloud servers." },
    ],
    [{ text: "Sell hundreds of products " }, { text: "globally.", bold: true }],
  ] satisfies Run[][],
};

/**
 * The reference sells "Hostinger Agent", their AI agent for WordPress. This
 * slot is ConvoAI instead — a product we actually ship — so the copy here is
 * NOT the reference's. It is drawn from `/convoai`'s own page and
 * `sisterProducts` in data/company.ts, turned toward what a store gets.
 *
 * The card shape is still the reference's: a label pill, a 24/32 semibold
 * heading, a lede, a CTA and a three-up row beneath.
 */
export const AGENT = {
  label: "CONVOAI",
  title: "Meet ConvoAI — a chat agent trained on your own store",
  description:
    "It answers the questions that make up most of a store’s volume — shipping, returns, sizing, stock — captures the customer’s name and intent, and hands anything it should not attempt to a person with the full transcript.",
  cta: "Explore ConvoAI",
  ctaHref: "/convoai",
  cards: [
    {
      icon: "spark" as const,
      title: "Answers before you wake up",
      description:
        "Most store questions arrive outside business hours. ConvoAI answers them continuously — and tells customers they are talking to an assistant, not staff.",
    },
    {
      icon: "store" as const,
      title: "Grounded in your own catalogue",
      description:
        "It reads the pages you publish, so shipping, returns and stock answers match your store instead of guessing.",
    },
    {
      icon: "shield" as const,
      title: "Hands over cleanly",
      description:
        "When a question needs a person, it passes on the whole conversation rather than a summary. No invented policies, no guessed prices.",
    },
  ],
};

export const SPEED = {
  title: "Maximum speed, maximum profits",
  description: "Fast performance keeps users engaged and your profits up.",
  items: [
    [
      { text: "Deliver a flawless shopping experience with " },
      { text: "LiteSpeed web servers", bold: true },
      { text: " and the " },
      { text: "LSCWP plugin", bold: true },
      { text: "." },
    ],
    [
      { text: "Never lose sales – our well-maintained infrastructure ensures " },
      { text: "99.9% uptime", bold: true },
      { text: "." },
    ],
    [
      { text: "Object Cache eliminates repeated database queries, reducing your store response times by up to " },
      { text: "3x", bold: true },
      { text: "." },
    ],
    [
      { text: "Our " },
      { text: "global CDN", bold: true },
      { text: " distributes content from servers closer to your audience, ensuring faster load times." },
    ],
    [
      { text: "Benefit from low latency and speedy internet connectivity, thanks to " },
      { text: "IPv6", bold: true },
      { text: " and " },
      { text: "HTTP/3", bold: true },
      { text: "." },
    ],
  ] satisfies Run[][],
};

/** ⚠ Describes a product that does not exist yet. See the file header. */
export const EMAIL = {
  title: "Turn WordPress visitors into customers with AI Email Marketing",
  description:
    "Sync your WordPress subscribers to Serverlys Reach in seconds – the AI-powered, beginner-friendly email marketing tool that lets you create and send stunning campaigns to grow your audience and boost conversions.",
  cta: "Get started",
  items: [
    {
      icon: "cursor" as const,
      title: "From WordPress to inbox in minutes",
      body: "Capture subscribers directly through Gutenberg, Contact Form 7, or WPForms, and sync them instantly to Serverlys Reach.",
    },
    {
      icon: "spark" as const,
      title: "AI-crafted campaigns",
      body: "Generate professional, branded email layouts and content from a single prompt.",
    },
    {
      icon: "megaphone" as const,
      title: "Always on-brand",
      body: "Keep your site loading in seconds with LightSpeed servers, smart caching, and code minification.",
    },
    {
      icon: "trend" as const,
      title: "Track performance in real time",
      body: "Keep your site loading in seconds with LightSpeed servers, smart caching, and code minification.",
    },
    {
      icon: "gift" as const,
      title: "Free with your plan",
      body: "Included in all plans at no extra cost - send up to 200 emails per month to 100 subscribers, upgrade anytime.",
    },
  ],
};

export const SECURITY = {
  title: "Top-notch security for your online business",
  description: "Build a secure ecommerce store that wins customer trust.",
  items: [
    [
      { text: "Get a " },
      { text: "free SSL certificate", bold: true },
      { text: " to protect your client’s sensitive information." },
    ],
    [
      { text: "Prevent data loss with " },
      { text: "automatic backups", bold: true },
      { text: " and save progress with an on-demand backup." },
    ],
    [
      { text: "Keep your online store safe with " },
      { text: "automatic updates and a vulnerabilities", bold: true },
      { text: " scanner." },
    ],
    [
      { text: "Get rid of unwanted traffic with an " },
      { text: "advanced firewall", bold: true },
      { text: " and " },
      { text: "DDoS protection", bold: true },
      { text: "." },
    ],
  ] satisfies Run[][],
};

export const MIGRATION = {
  title: "Free online store migration",
  description: "Hosting a WooCommerce store elsewhere? It’s time for an upgrade.",
  items: [
    [{ text: "One quick form – that’s all it takes to submit a migration request." }],
    [
      { text: "Our dedicated team will move your website data " },
      { text: "within 24 hours", bold: true },
      { text: "." },
    ],
    [
      {
        text: "Your ecommerce store will be accessible during the transfer process – you won’t lose any sales or customers.",
      },
    ],
  ] satisfies Run[][],
};

/** Retitled with the AGENT section — same product, so the same name. */
export const SUPPORT = {
  title: "ConvoAI is here to:",
  items: [
    [
      { text: "Facing unexpected errors? " },
      { text: "Get help via live chat", bold: true, href: "/support" },
      { text: " in under three minutes." },
    ],
    [{ text: "Fix common issues and guide you through technical steps instantly" }],
    [{ text: "Help you launch your website faster, without technical expertise" }],
    [{ text: "Connect you with our customer support if you need additional help" }],
  ] satisfies (Run & { href?: string })[][],
};

export const BANNER = {
  title: "Drive more sales with fast WooCommerce hosting",
  cta: "Get started",
};

export const FAQ_HEAD = {
  title: "WooCommerce hosting FAQs",
  description:
    "Get answers to frequently asked questions about managed WooCommerce hosting plans.",
};

export const FAQS: FaqItem[] = [
  {
    q: "What is WooCommerce?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "WooCommerce is an open-source eCommerce plugin designed for WordPress. It allows you to upload products, integrate secure payment gateways, and manage orders conveniently in one place.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "With hundreds of free and paid WooCommerce extensions, you can easily customize the store’s look and add new features as needed. For instance, if you run a consultation business, install WooCommerce Bookings to let customers make reservations.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          { text: "For more information on how to set up the plugin, refer to our step-by-step " },
          { text: "WooCommerce tutorial", href: "/tutorials" },
          { text: "." },
        ],
      },
    ],
  },
  {
    q: "What is managed WooCommerce hosting?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Managed WooCommerce hosting servers are optimized for WordPress and WooCommerce. This ensures high uptime and fast load times for your online store, even during peak traffic.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "At Serverlys, you will also get automatic updates for both WordPress and WooCommerce. Besides fixing known vulnerabilities, updates usually come with performance improvements.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "In addition, we offer a malware scanner, automatic backups, and a vulnerabilities scanner for maximum security of your online store.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "When it comes to features built for WooCommerce and WordPress, we offer object cache for faster loading time, a staging tool to test website changes before publishing them, and AI tools for easier launch.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "Our WooCommerce hosting costs from $7.95/mo for a plan with unlimited NVMe storage, a free domain, and free unlimited SSL.",
          },
        ],
      },
    ],
  },
  {
    q: "What is the difference between WordPress and WooCommerce hosting?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "WordPress hosting is suitable for a wide range of projects, including blogs, portfolios, and small business sites.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "However, if you are creating an online store with hundreds of products and monthly orders, WooCommerce hosting will be a better choice. As it runs on more powerful cloud plans, you will get more server resources. This means your online store will be able to handle even peak traffic.",
          },
        ],
      },
    ],
  },
  {
    q: "How does managed WooCommerce hosting improve website speed and performance?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Our managed WooCommerce hosting takes advantage of our cloud infrastructure, providing up to 20 times more resources than traditional web hosting. Our packages also include LiteSpeed Cache for WordPress (LSCWP) and in-house Content Delivery Network (CDN) for increasing your e-shop speed.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "For even better performance, we offer object cache, which eliminates repeated database queries. Since your ecommerce store will deal with a lot of user information and product data, optimizing your database is crucial for faster load times.",
          },
        ],
      },
    ],
  },
  {
    q: "What kind of security features are included in managed WooCommerce hosting?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Our managed WooCommerce hosting plans provide unlimited free ssl certificates to prevent sensitive user data from falling into the wrong hands.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "You will also get daily backups to avoid data loss, automatic updates, advanced ddos mitigation that filters out malicious traffic, automatic malware scanning that monitors your hosting environment, and a vulnerabilities scanner that checks your WordPress core, plugins, and themes.",
          },
        ],
      },
    ],
  },
  {
    q: "Will I get a business email account?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Yes, you can create up to 100 domain-based email accounts in any of our managed WooCommerce hosting plans. This makes your business look more trustworthy and professional.",
          },
        ],
      },
    ],
  },
];
