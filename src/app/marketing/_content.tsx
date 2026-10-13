import type { FeatureGroup } from "@/components/retell/features-scroller";
import type { BrandSlug } from "@/components/retell/brands";
import { formatSeoPrice, seoPlans } from "@/data/seo-plans";
import { ArticleMock, LocalPackMock, ReportPaperMock } from "../seo/_components/mocks";

/**
 * /marketing copy on the shared Retell-style kit, 2026-10-13. Marketing is
 * SOLD AS THE SEO PLANS (data/seo-plans.ts): every feature named here is one
 * a plan in that file includes. Email campaigns and paid ads are not in any
 * plan, so this page does not offer them.
 */

export const STEPS = [
  {
    title: "Start with what you want more of",
    body: "Calls, bookings, orders or quote requests. We set your marketing around the result that pays the bills, not around reach or impressions.",
  },
  {
    title: "Get found where customers search",
    body: "Google Search and Google Maps first: keyword research, on-page SEO and your Google Business Profile, on every plan.",
  },
  {
    title: "Publish and earn authority",
    body: "Optimized blog content every month on Growth and Elite, and links from directories, niche sites and the press, built white-hat.",
  },
  {
    title: "Measure what it brought in",
    body: "A monthly report in plain English: where you rank, what moved, and on Elite an ROI summary, so you can see what the spend returned.",
  },
] as const;

export const USES = [
  {
    title: "More calls from people nearby",
    body: "When someone near you searches for what you sell, the map pack decides who gets the call. Local SEO and Google Business Profile optimization come with every plan: one location on Starter, up to three on Growth, multi-location on Elite.",
    src: "/mock/mkt-bakery.jpg",
    alt: "A baker arranging fresh bread at her shop counter",
    position: "center 40%",
  },
  {
    title: "Content that keeps bringing people in",
    body: "An ad stops the day the budget does. A post that ranks keeps working. Growth publishes an optimized blog post every month and Elite up to four, from a full content strategy.",
    src: "/mock/mkt-garden.jpg",
    alt: "A garden centre worker in an apron helping a customer choose plants",
    position: "center 40%",
  },
  {
    title: "Pages built to turn visits into customers",
    body: "Traffic is only worth what it converts. Elite adds custom landing page optimization, a conversion rate audit with suggestions, and ongoing A/B tests on calls to action and titles.",
    src: "/mock/mkt-foodtruck.jpg",
    alt: "A customer ordering at a busy food truck",
    position: "center 45%",
  },
  {
    title: "A reputation search engines trust",
    body: "Links from trusted sites tell Google you are worth ranking. Starter starts with local directories, Growth adds manual outreach for niche links, and Elite adds guest posts and PR backlinks.",
    src: "/mock/mkt-bikes.jpg",
    alt: "A smiling bike shop owner sitting among the bikes in his shop",
    position: "center 40%",
  },
  {
    title: "Reports that say what it earned",
    body: "No vanity charts. Each monthly report says what moved, what did not and why. Growth adds keyword tracking; Elite adds a white-labeled ROI summary and a dedicated manager to walk you through it.",
    src: "/mock/mkt-salon.jpg",
    alt: "A salon owner smiling in her salon",
    position: "center 35%",
  },
];

export const PROMISES = [
  {
    title: "Judged on customers, not clicks",
    body: "Every report ties back to calls, bookings and orders. Impressions and reach are easy to buy and easy to report; they are not the point.",
  },
  {
    title: "White-hat only",
    body: "No paid link schemes, no private blog networks, nothing that could earn your site a penalty and undo everything else.",
  },
  {
    title: "No ranking guarantees",
    body: "Nobody outside Google controls rankings. We commit to the work, and report honestly on the months that did not move as well as the ones that did.",
  },
] as const;

export const GROUPS: FeatureGroup[] = [
  {
    tab: "Get found",
    visual: <LocalPackMock />,
    backdrop: "/mock/mkt-bakery.jpg",
    features: [
      [
        "Local SEO and Maps",
        "Your business in the map pack for nearby searches, with location signals across your site and listings.",
      ],
      [
        "Google Business Profile",
        "Your profile completed and optimized: hours, photos, services and categories that match how people search.",
      ],
      [
        "Keyword research",
        "Up to 10 keywords on Starter, 25 on Growth, unlimited on Elite, chosen for searches that end in a sale.",
      ],
    ],
  },
  {
    tab: "Win attention",
    visual: <ArticleMock />,
    backdrop: "/mock/mkt-garden.jpg",
    features: [
      [
        "Monthly content",
        "Optimized blog posts written around your keyword strategy: one a month on Growth, up to four on Elite.",
      ],
      [
        "Landing pages",
        "On Elite, custom optimization of the pages that sell your services and products.",
      ],
      [
        "Conversion testing",
        "On Elite, a CRO audit plus A/B tests on calls to action and titles, keeping what wins.",
      ],
    ],
  },
  {
    tab: "Measure",
    visual: <ReportPaperMock />,
    backdrop: "/mock/mkt-salon.jpg",
    features: [
      [
        "A monthly report",
        "Where you rank, what moved and what comes next, in plain English, on every plan.",
      ],
      [
        "Keyword tracking",
        "On Growth and Elite, rankings for every target keyword tracked month to month.",
      ],
      [
        "ROI summary",
        "On Elite, a white-labeled report with an ROI summary and a dedicated SEO manager.",
      ],
    ],
  },
];

export const TOOLS: readonly [BrandSlug[], BrandSlug[]] = [
  [
    "google",
    "googlemaps",
    "googlesearchconsole",
    "googleanalytics",
    "googletagmanager",
    "yelp",
  ],
  ["tripadvisor", "wordpress", "woocommerce", "pagespeedinsights", "lighthouse", "xml"],
];

export const FAQS = [
  {
    question: "What does your marketing service include?",
    answer:
      "Our marketing plans are our SEO plans: keyword research, local SEO and Google Business Profile optimization, on-page and technical SEO, content, link building and a monthly report. Higher plans add monthly blog posts, competitor analysis, landing page and conversion optimization, A/B testing and a dedicated SEO manager.",
  },
  {
    question: "How much does marketing cost?",
    answer: `Plans are billed monthly: ${seoPlans
      .map((p) => `${p.name} is ${formatSeoPrice(p.price)}/mo`)
      .join(", ")}. Each plan includes everything in the one before it.`,
  },
  {
    question: "Why focus on search instead of social media ads?",
    answer:
      "Someone searching for what you sell is already looking to buy, and a page that ranks keeps bringing them in after the work is done. Ads stop the day the budget does. For most small businesses, search is the steadiest source of new customers. If you want social media handled too, we run that as a separate service.",
  },
  {
    question: "How do you measure results?",
    answer:
      "Every plan includes a monthly report showing where you rank and what changed. Growth adds keyword tracking, and Elite adds a white-labeled report with an ROI summary, so the work is tied to visits, calls and orders.",
  },
  {
    question: "How long until I see results?",
    answer:
      "Technical fixes and Google Business Profile changes can show up within weeks. Content and links build over months. Your monthly report shows where things stand along the way, including the months that move slowly.",
  },
  {
    question: "Which plan is right for me?",
    answer:
      "SEO Starter suits a single-location business getting found locally. SEO Growth suits a business ready to compete, with monthly content and link outreach. SEO Elite suits national, e-commerce or multi-location businesses that want a dedicated manager and conversion work. Ask Sera if you are unsure.",
  },
] as const;

export const RELATED = [
  ["SEO services", "/seo"],
  ["Social media", "/social-media"],
  ["Website design", "/website-design"],
  ["Web development", "/website-development"],
  ["Automations", "/automations"],
  ["Business solutions", "/business-solutions"],
] as const;
