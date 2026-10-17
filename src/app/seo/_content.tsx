import type { FeatureGroup } from "@/components/retell/features-scroller";
import type { BrandSlug } from "@/components/retell/brands";
import { ArticleMock, AuditMock, RankTrackerMock } from "./_components/mocks";

/**
 * /seo copy, on the shared Retell-style kit (components/retell/kit.tsx).
 * Every feature named is one a plan in data/seo-plans.ts sells.
 */

export const STEPS = [
  {
    title: "Audit the site",
    body: "We crawl every page and check what Google can and can't read: broken links, missing titles, slow images, crawl and sitemap problems. You get the list, ranked by what to fix first.",
  },
  {
    title: "Research the searches that sell",
    body: "Keyword research built around your services and your area, up to 10 keywords on Starter, 25 on Growth and unlimited on Elite, chosen for the searches that end in a call or an order.",
  },
  {
    title: "Fix, optimize and publish",
    body: "Titles, meta descriptions, headings and images fixed; your Google Business Profile optimized; and on Growth and Elite, new blog content and backlink outreach every month.",
  },
  {
    title: "Report what it earned",
    body: "A monthly SEO report shows where you rank and what changed. Growth adds keyword tracking and Elite adds a white-labeled report with an ROI summary.",
  },
];

export const USES = [
  {
    title: "Show up first on Google Maps",
    body: "When someone nearby searches for what you sell, the map pack decides who gets the call. We optimize your Google Business Profile, your location signals and your local listings so you are in it: one location on Starter, up to three on Growth, multi-location on Elite.",
    src: "/mock/seo-local.jpg",
    alt: "A barber trimming a customer’s hair in his shop",
    position: "center 35%",
  },
  {
    title: "Fix what stops Google reading your site",
    body: "Broken links, missing titles, slow pages and crawl errors quietly cost you rankings. Every plan starts with a technical audit and the fixes; Growth adds 404s, redirects, Core Web Vitals and speed optimization.",
    src: "/mock/seo-technical.jpg",
    alt: "A smiling restaurant owner working on a laptop at a table in his restaurant",
    position: "center 40%",
  },
  {
    title: "Publish content that ranks",
    body: "Pages and posts written around what your customers actually search for. Growth publishes an optimized blog post every month with schema and internal linking; Elite publishes up to four, from a full content strategy.",
    src: "/mock/seo-content.jpg",
    alt: "A florist arranging a bouquet of fresh flowers",
    position: "center 45%",
  },
  {
    title: "Earn links that build authority",
    body: "Links from trusted sites tell Google you are worth ranking. Starter builds them from local directories, Growth adds manual outreach for niche links, and Elite adds guest posts and PR backlinks. White-hat only.",
    src: "/mock/seo-links.jpg",
    alt: "A café owner working on a laptop at her counter",
    position: "center 40%",
  },
  {
    title: "See exactly what it earned",
    body: "Every month you get a report in plain English: where you rank, what moved, what did not and what comes next. On Elite, a dedicated SEO manager walks you through it, with optional bi-weekly strategy meetings.",
    src: "/mock/seo-reports.jpg",
    alt: "A woman smiling at her laptop in a café",
    position: "center 40%",
  },
];

export const PROMISES = [
  {
    title: "No ranking guarantees",
    body: "Nobody outside Google controls rankings, and anyone promising position one is guessing or gaming it. We commit to the work and report honestly on the result.",
  },
  {
    title: "White-hat only",
    body: "No paid link schemes, no private blog networks, nothing that could earn your site a penalty. Links come from real directories, real outreach and real press.",
  },
  {
    title: "Reports in plain English",
    body: "Every monthly report says what moved, what did not and why, tied to visits, calls and orders rather than vanity charts.",
  },
];

export const GROUPS: FeatureGroup[] = [
  {
    tab: "Starter",
    visual: <AuditMock />,
    backdrop: "/mock/seo-technical.jpg",
    features: [
      [
        "Technical audit and fixes",
        "A full audit of your site with the technical SEO basics fixed: titles, headings, meta descriptions, sitemap and robots.txt.",
      ],
      [
        "Google Business Profile",
        "Your profile completed and optimized, with local SEO for one location so you show up in the map pack.",
      ],
      [
        "Image optimization",
        "Alt tags and compression on your images: faster pages, better accessibility and a chance to rank in image search.",
      ],
    ],
  },
  {
    tab: "Growth",
    visual: <ArticleMock />,
    backdrop: "/mock/seo-content.jpg",
    features: [
      [
        "A blog post every month",
        "One optimized post a month, written around your keyword strategy and linked into the pages that sell.",
      ],
      [
        "Schema and content silos",
        "Advanced on-page SEO: structured data, internal linking and content silos that tell Google what each page is about.",
      ],
      [
        "Backlink outreach",
        "Manual outreach for high-quality niche links, plus competitor analysis to find the gaps worth taking.",
      ],
    ],
  },
  {
    tab: "Elite",
    visual: <RankTrackerMock />,
    backdrop: "/mock/seo-reports.jpg",
    features: [
      [
        "A dedicated SEO manager",
        "One person who owns your account, with optional bi-weekly strategy meetings and a white-labeled ROI report.",
      ],
      [
        "Conversion rate optimization",
        "A CRO audit with suggestions and ongoing A/B tests on calls to action and titles, so more visitors become customers.",
      ],
      [
        "High-authority links",
        "Guest posts, PR backlinks and manual outreach, plus a full technical audit every three months.",
      ],
    ],
  },
];

export const TOOLS: readonly [BrandSlug[], BrandSlug[]] = [
  [
    "wordpress",
    "woocommerce",
    "googlesearchconsole",
    "googleanalytics",
    "google",
    "googlemaps",
  ],
  ["pagespeedinsights", "lighthouse", "googletagmanager", "xml", "yelp", "tripadvisor"],
];

export const RELATED = [
  ["Website design", "/website-design"],
  ["Restaurant websites", "/restaurant-websites"],
  ["Free site migration", "/migrations"],
  ["WordPress hosting", "/wordpress-hosting"],
  ["Cloud hosting", "/cloud-hosting"],
  ["Ecommerce hosting", "/ecommerce-hosting"],
  ["Social media", "/social-media"],
] as const;
