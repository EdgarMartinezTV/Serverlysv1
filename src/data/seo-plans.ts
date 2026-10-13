import { billing } from "./company";

/**
 * SEO plans — copied from the live WHMCS store, `store/digital-services`
 * (verified 2026-10-13). WHMCS is the authority on price and contents; if the
 * store changes, change this file and every surface follows: the /seo plan
 * cards and comparison, its Service/Offer schema, /llms.txt and Sera.
 *
 * Plans are cumulative: Growth is "everything in Starter, plus", Elite is
 * "everything in Growth, plus". `features` lists only what a tier ADDS, in the
 * store's own words, so nothing here claims more than the cart sells.
 */

export type SeoPlan = {
  id: "starter" | "growth" | "elite";
  name: string;
  /** Monthly price in USD. */
  price: number;
  summary: string;
  popular?: boolean;
  /** WHMCS product slug under store/digital-services. */
  slug: string;
  features: readonly string[];
};

export const seoPlans: readonly SeoPlan[] = [
  {
    id: "starter",
    name: "SEO Starter",
    price: 249,
    slug: "seo-starter",
    summary: "Local visibility for a single-location business getting found on Google for the first time.",
    features: [
      "Keyword research (up to 10 target keywords)",
      "Basic on-page optimization (titles, meta descriptions, headings)",
      "Google Business Profile optimization",
      "Local SEO (1 location)",
      "Website SEO audit & fixes (technical SEO basics)",
      "Image optimization (alt tags & compression)",
      "Sitemap & robots.txt optimization",
      "Basic backlink strategy (local directories)",
      "Monthly SEO report",
    ],
  },
  {
    id: "growth",
    name: "SEO Growth",
    price: 499,
    slug: "seo-growth",
    popular: true,
    summary: "More keywords, more locations and fresh content every month for businesses ready to compete.",
    features: [
      "Keyword research (up to 25 target keywords)",
      "Advanced on-page SEO (internal linking, content silos, schema markup)",
      "Local SEO (up to 3 locations)",
      "1 optimized blog post every month",
      "Competitor SEO analysis",
      "Technical SEO fixes (404s, redirects, Core Web Vitals)",
      "Manual backlink outreach (high-quality niche links)",
      "Speed optimization (plugin setup & recommendations)",
      "Monthly performance report with keyword tracking",
    ],
  },
  {
    id: "elite",
    name: "SEO Elite",
    price: 1190,
    slug: "seo-elite",
    summary: "A dedicated SEO manager, full content strategy and high-authority links for national reach.",
    features: [
      "Keyword research (unlimited strategic focus)",
      "Full website content strategy",
      "Up to 4 blog posts every month",
      "Custom landing page optimization",
      "Conversion rate optimization (CRO audit & suggestions)",
      "High-authority link building (outreach, guest posts, PR backlinks)",
      "E-commerce or multi-location SEO",
      "Ongoing A/B testing for CTAs and titles",
      "Full technical SEO audit every 3 months",
      "Bi-weekly strategy meetings (optional)",
      "Dedicated SEO manager",
      "White-labeled monthly report with ROI summary",
    ],
  },
];

/** Side-by-side rows for the comparison table. */
export const seoCompare: readonly { label: string; values: readonly [string, string, string] }[] = [
  { label: "Target keywords", values: ["Up to 10", "Up to 25", "Unlimited"] },
  { label: "Locations", values: ["1", "Up to 3", "Multi-location"] },
  { label: "Blog posts", values: ["—", "1 / month", "Up to 4 / month"] },
  { label: "Link building", values: ["Local directories", "Niche outreach", "Guest posts & PR"] },
  { label: "Technical SEO", values: ["Audit & fixes", "+ Core Web Vitals", "+ Quarterly full audit"] },
  { label: "Reporting", values: ["Monthly", "+ Keyword tracking", "+ ROI summary"] },
  { label: "Dedicated SEO manager", values: ["—", "—", "✓"] },
];

export const seoOrderUrl = (plan: SeoPlan) => `${billing.store("digital-services")}/${plan.slug}`;

export const formatSeoPrice = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;

export const seoFromPrice = Math.min(...seoPlans.map((p) => p.price));
