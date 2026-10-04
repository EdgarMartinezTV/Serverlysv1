import type { FaqItem } from "@/components/ref/faqs";

/**
 * Cloud hosting page content.
 *
 * This page is a deliberate 1:1 rebuild of hostinger.com/cloud-hosting —
 * section order, grid, type scale and copy. Every string here was lifted from
 * that page verbatim at the owner's instruction, with the brand noun swapped
 * (Hostinger → Serverlys, hPanel → the Serverlys panel) and outbound links
 * repointed at our own routes.
 *
 * Kept in one file rather than inlined so the whole page's copy can be reviewed
 * and re-pointed in one place, and so the section components stay layout-only.
 *
 * Plans are NOT here — the "Personalize your plan" slider reads
 * `src/data/pricing.ts`, which is the source of truth for what we charge.
 *
 * ⚠ The three reviewer names in REVIEWS are PLACEHOLDERS. The quotes are real
 * Trustpilot reviews of Hostinger; attributing them to named people as reviews
 * of Serverlys would be fabricated proof. Replace `name` and `quote` with real
 * Serverlys reviews before this page goes anywhere near production — and
 * REVIEWS_HEAD's "5M+" with a number that is ours.
 *
 * The reference's two Trustpilot lines and its "Recommended by WordPress.org"
 * badge have already been removed on request; the star blocks on the review
 * cards are all that is left of that styling.
 */

export const HERO = {
  /** The eyebrow is the h1 on the reference page; the big line is an h2. */
  eyebrowPrefix: "Up to ",
  eyebrowAccent: "71%",
  eyebrowSuffix: " off managed cloud hosting",
  title: "Power without the complexity",
  bullets: [
    "Free domain and website migration",
    "Get more resources as you grow",
    "Dedicated IP for stronger security",
    "24/7 customer support",
  ],
  cta: "Start now",
  guarantee: "30-day money-back guarantee",
};

export const PRICING_HEAD = {
  title: "Personalize your plan",
  description:
    "Get started in complete confidence. Our 30-day money-back guarantee means it’s risk-free.",
  cta: "Choose plan",
  compare: "View all features",
  disclaimer:
    "The price displayed is the monthly rate excluding applicable taxes. Applicable taxes, and any setup fee shown on the plan, are added at checkout.",
  /* The reference's wording described a term billed upfront and was dropped
     on 2026-09-16 along with the rest of the term framing. */
};

export const WHAT_IS = {
  title: "What is cloud hosting?",
  description:
    "Cloud hosting runs your website across a network of connected virtual servers instead of a single physical machine. If one server has an issue, another takes over — which means stronger uptime and scalability than shared hosting.",
  cta: "Get started",
  cards: [
    {
      icon: "bolt" as const,
      title: "More power and flexibility",
      description:
        "20x more resources than traditional web hosting. Add capacity when traffic grows — no rebuild, no new server.",
    },
    {
      icon: "shield" as const,
      title: "Stable and secure",
      description:
        "Daily backups, a firewall and malware scanning, so busy days stay online and client data stays put.",
    },
    {
      icon: "gear" as const,
      title: "Fully managed",
      description:
        "Instant setup, an intuitive panel, and 24/7 support. The power of a VPS without running a server yourself.",
    },
  ],
};

export const COMPARISON = {
  title: "Shared, cloud, or VPS: which one fits you?",
  description:
    "All three host your website. The difference is how much power and control you get.",
  cards: [
    {
      panel: "performance" as const,
      title: "Cloud hosting",
      description:
        "Best for growing sites and stores that need more speed and reliable performance. 4x speed, 20x resources, still fully managed, handles traffic spikes.",
      link: { label: "View plans", href: "#pricing" },
    },
    {
      panel: "status" as const,
      title: "Shared hosting",
      description:
        "Best for your first website, blogs, and small business sites with steady traffic. Most affordable, fully managed, and ready with no setup.",
      link: { label: "Explore shared hosting", href: "/shared-hosting" },
    },
    {
      panel: "resources" as const,
      title: "VPS hosting",
      description:
        "Best for projects that need full control and flexibility. Manage everything more easily with 1-click apps and an AI assistant.",
      link: { label: "Explore VPS hosting", href: "/vps-hosting" },
    },
  ],
};

export const BENTO = {
  title: "Everything you need to run a growing project",
  cta: "Get started",
  wordpress: {
    title: "WordPress tools, built in",
    description:
      "One-click WordPress and WooCommerce, smart auto-updates with pre-update backups, a compatibility checker, and AI tools to write and troubleshoot.",
  },
  data: {
    title: "Your data, protected",
    description:
      "Free SSL, WHOIS privacy, a malware scanner, and Cloudflare-protected nameservers — without extra plugins to babysit.",
  },
  fast: {
    title: "Fast under real traffic",
    description:
      "PHP workers, CDN, LiteSpeed, ObjectCache, and NVMe SSD so stores and busy sites stay quick — plus a dedicated IP for mail and security.",
  },
  migration: {
    title: "Free, done-for-you migration",
    description:
      "Send a request and we move as many sites as you need, usually in about 20 minutes. Your site stays online while we switch.",
  },
};

/* REVIEWS / REVIEWS_HEAD removed 2026-10-03: they were placeholder names on
   Hostinger's Trustpilot quotes under a "5M+" claim. The proof band now
   states commitments instead (see _components/proof.tsx). */

export const DASHBOARD = {
  title: "Multiple projects. One easy dashboard",
  description:
    "Monitor site security, performance, and everything else that matters to you and your clients. Access and manage client accounts, collaborate on exciting projects, and get notified immediately if something goes wrong, so you can get everything back on track. Create custom tags to organize, search, and filter your website portfolio, all in one place.",
};

export const BANNER = {
  title: "Hosting that grows with you",
  description:
    "Get the speed, security, and support your business needs to grow. Risk-free for 30 days.",
  cta: "View plans",
};

export const FAQ_HEAD = {
  title: "Cloud hosting FAQs",
  description:
    "Find answers to frequently asked questions about cloud web hosting services.",
};

export const FAQS: FaqItem[] = [
  {
    q: "What is cloud hosting?",
    a: [
      {
        type: "p",
        runs: [
          { text: "Cloud hosting is", href: "/tutorials" },
          {
            text: " a faster, stronger, and more reliable alternative to shared hosting.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "Serverlys managed cloud hosting runs on NVMe storage and LiteSpeed servers, with more memory and visits on every tier than an entry shared plan. It’s also fully managed, so we take care of the technical work and you can focus on the project.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "It’s the perfect solution for website owners looking for the power and stability of a virtual private server (VPS), without the complexity of managing one.",
          },
        ],
      },
    ],
  },
  {
    q: "Why should I get cloud hosting services?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Whether you’re running an ecommerce store that sells hundreds of products, or a business site handling hundreds of thousands of visitors each month, cloud server hosting has the computing power to maintain high performance and uptime, while still being easy to use.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "It’s also the right choice for web developers and agencies that manage multiple clients and projects simultaneously. In fact, cloud hosting plans are among those we offer in our ",
          },
          { text: "agency hosting", href: "/business-solutions" },
          { text: " services." },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "With the Serverlys panel, you can access your clients’ accounts from your own, organize websites with custom tags, invite your team to collaborate on projects, and monitor everything that matters to you: site security, performance, and more.",
          },
        ],
      },
    ],
  },
  {
    q: "How can I migrate my websites to Serverlys’ cloud plan?",
    a: [
      {
        type: "p",
        runs: [
          { text: "Migrating your website to Serverlys", href: "/migrations" },
          {
            text: " is free and easy. Simply secure your cloud hosting plan, submit a migration request, and move as many websites as you want. Your website will still be online during the migration process, and we’ll help you prepare for DNS propagation to minimize downtime. If you’d like to see how it works, ",
          },
          { text: "see how migration works", href: "/migrations" },
          { text: "." },
        ],
      },
    ],
  },
  {
    q: "How much does cloud hosting cost? How easy is it to upgrade to a cloud plan?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Depending on the size of your online project, you can buy one of the following cloud plans:",
          },
        ],
      },
      /* Re-pointed at our real plans, because these prices sit on the same
         page as the slider — leaving the reference's would have the page
         quoting two different price lists. Kept in sync by hand; the slider
         reads data/pricing.ts and this does not. */
      {
        type: "ul",
        items: [
          "Starter Cloud – $7.95/month",
          "Plus Cloud – $11.95/month",
          "Turbo Cloud – $17.95/month",
          "Business Cloud – $23.95/month",
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "Every cloud hosting package includes a free domain, free SSL certificates, free domain-based emails, and 24/7 priority support. Plus, we offer a 30-day money-back guarantee so you can explore our services without risk.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "If you already have a web hosting plan, upgrading to managed cloud hosting services only takes a few clicks via our user-friendly Serverlys panel. In case you get stuck, our Customer Success agents will be happy to help.",
          },
        ],
      },
    ],
  },
  {
    q: "What is the difference between cloud and traditional hosting?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "One notable difference is that cloud server hosting gives you 4x more speed and 20x more resources compared to ",
          },
          { text: "traditional web hosting", href: "/shared-hosting" },
          {
            text: ". As a result, your website will perform at its very best no matter how busy it gets.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "Cloud website hosting also comes with a dedicated IP address, ensuring better protection against security breaches and improved email deliverability. Unlike a shared IP address in traditional web hosting, spam activities performed by other users won’t negatively impact your domain name and branding.",
          },
        ],
      },
    ],
  },
  {
    q: "What is the difference between VPS and cloud server hosting?",
    a: [
      {
        type: "p",
        runs: [
          { text: "VPS hosting", href: "/vps-hosting" },
          {
            text: " provides dedicated resources and root access, ensuring rock-solid performance and allowing you to self-manage the server and customize your hosting environment to your specific needs. Since it’s a self-managed service, VPS hosting requires more technical skills.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "Meanwhile, cloud hosting combines the power of a VPS and the simplicity of managed web hosting. It features a pre-built environment and an easy-to-use control panel, so you can enjoy a fast and secure website without dealing with the complexity of VPS hosting.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "Our cloud hosting options also come with an integrated content delivery network (CDN). It automatically stores copies of your site’s content across a global network of servers, improving site performance by 40%.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "With VPS hosting, your website data will be stored on a single physical server.",
          },
        ],
      },
    ],
  },
  {
    q: "What’s the difference between a server and cloud hosting?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "A server is basically a physical machine or a computer that stores website files. When you buy a hosting service, you essentially rent space in a server to host your site.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "Now, you can rent the whole physical machine exclusively for your site. It’s called a dedicated server. However, it’s super expensive, and you need advanced technical knowledge to manage the server.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "An easier and more affordable solution is to host multiple websites in one server, which is called shared hosting. Here, server maintenance is handled by the hosting provider, and you’ll get a control panel to manage your account easily.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "But there’s also a downside to this: since you’re sharing server resources with other users, any issues experienced by other sites can directly affect your website too.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "If you want to get the power of a dedicated server and the ease of use of shared hosting, a managed cloud hosting solution is the perfect choice. It gives you a lot more server resources and power than shared hosting, while still providing an intuitive control panel.",
          },
        ],
      },
    ],
  },
  {
    q: "What does expert priority support mean?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "With priority support, your questions will go straight to our cloud hosting experts, instead of the general Customer Success specialists. These technical agents know the ins and outs of cloud hosting, which means you’ll get more accurate answers, faster.",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "Our priority support is available 24/7 via live chat, with a median response time of one minute for requests in English. Prefer to speak in your mother tongue? Don’t worry, ",
          },
          { text: "we support 10 other languages", href: "/support" },
          { text: ", including Spanish, French, Portuguese, Chinese, and Arabic." },
        ],
      },
    ],
  },
  {
    q: "What are the CPU, RAM, inode, and disk limits of Serverlys plans?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "To learn what resources our cloud hosting solutions provide, check out these ",
          },
          { text: "parameters and limits for hosting plans", href: "/support" },
          {
            text: ". You will find detailed information on the specific limits associated with each plan we offer, so you can make an informed choice based on your website’s needs.",
          },
        ],
      },
    ],
  },
  {
    q: "Are you using SSD as storage for managed cloud hosting plans?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "We use the NVMe SSD technology in all cloud hosting packages. It’s a storage protocol designed to read, write, and transfer data much faster than traditional solid-state drives (SSD).",
          },
        ],
      },
      {
        type: "p",
        runs: [
          {
            text: "NVMe SSD storage is suitable for projects that require high-speed data access and stable performance, such as eCommerce stores, online course platforms, community forums, travel aggregator sites, and others.",
          },
        ],
      },
    ],
  },
  {
    q: "Can I run Node.js on your cloud server?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Our Cloud and Shared Business Plan hosting plans support Node.js, so you can build and host Node.js applications directly on your existing plan. For advanced setups requiring full server access, check out ",
          },
          { text: "our VPS hosting plans", href: "/vps-hosting" },
          { text: "." },
        ],
      },
    ],
  },
];
