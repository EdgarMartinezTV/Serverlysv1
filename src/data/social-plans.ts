import { billing } from "./company";

/**
 * Social media management plans — copied from the live WHMCS store
 * (pids 29, 36, 37, 38, "Social Media Management", verified 2026-10-13 through
 * feeds/productsinfo.php). WHMCS is the authority on price and contents; if
 * the store changes, change this file and every surface follows: the
 * /social-media cards, its Offer schema, /llms.txt and Sera.
 *
 * Each plan lists its OWN features in the store's words. The store does not
 * say a tier includes the one below it, so the page never claims
 * "everything in X, plus".
 */

export type SocialPlan = {
  id: "starter" | "growth" | "pro" | "enterprise";
  pid: number;
  name: string;
  /** Monthly price in USD. */
  price: number;
  platforms: number;
  posts: string;
  summary: string;
  features: readonly string[];
};

export const socialPlans: readonly SocialPlan[] = [
  {
    id: "starter",
    pid: 29,
    name: "Starter",
    price: 299.95,
    platforms: 1,
    posts: "8",
    summary:
      "One platform, posted for you every week, for a business getting consistent on social.",
    features: [
      "1 platform (Facebook or Instagram)",
      "8 custom posts per month",
      "Branded graphics design",
      "Professional caption writing",
      "Hashtag research & optimization",
      "Content scheduling & publishing",
      "Monthly performance report",
      "Account monitoring",
      "Profile optimization",
      "Email support",
    ],
  },
  {
    id: "growth",
    pid: 36,
    name: "Growth",
    price: 599.95,
    platforms: 2,
    posts: "12",
    summary:
      "Two platforms, carousels and comment management, with a strategy call every month.",
    features: [
      "2 platforms (Facebook, Instagram or LinkedIn)",
      "12 custom posts per month",
      "Custom graphics & carousel designs",
      "Professional caption writing",
      "Hashtag research & optimization",
      "Content scheduling & publishing",
      "Community engagement & comment monitoring",
      "Monthly strategy call",
      "Detailed monthly performance report",
      "Account monitoring",
      "Email & chat support",
    ],
  },
  {
    id: "pro",
    pid: 37,
    name: "Pro",
    price: 999.95,
    platforms: 3,
    posts: "16–20",
    summary:
      "Three platforms with short-form video, full brand design and paid ads set up.",
    features: [
      "3 platforms (Facebook, Instagram, LinkedIn or TikTok)",
      "16–20 custom posts per month",
      "Short-form video content creation",
      "Advanced branded graphics & carousels",
      "Full brand design (stories & highlight covers)",
      "Professional caption writing",
      "Hashtag research & optimization",
      "Content scheduling & publishing",
      "Competitor analysis",
      "Paid ads setup (Meta or Google, setup only)",
      "Community engagement & comment monitoring",
      "Bi-weekly strategy & analytics updates",
      "Detailed performance reporting",
      "Priority email & chat support",
    ],
  },
  {
    id: "enterprise",
    pid: 38,
    name: "Enterprise",
    price: 1799.95,
    platforms: 5,
    posts: "25+",
    summary:
      "Five platforms, daily community management and a dedicated account manager.",
    features: [
      "5 platforms (Facebook, Instagram, LinkedIn, TikTok, X)",
      "25+ custom posts per month",
      "Short-form video & Reels creation",
      "Advanced branded graphics & carousels",
      "Full brand design (stories, highlights & covers)",
      "Professional caption writing",
      "Hashtag research & trend optimization",
      "Content scheduling & publishing",
      "Daily community management & engagement",
      "Influencer outreach & collaboration strategy",
      "Advanced growth & scaling strategies",
      "Competitor & market analysis",
      "Weekly strategy calls",
      "In-depth performance & ROI reporting",
      "Dedicated account manager",
      "Priority support (email, chat & phone)",
    ],
  },
];

export const socialOrderUrl = (plan: SocialPlan) =>
  `${billing.root}/cart.php?a=add&pid=${plan.pid}&carttpl=Serverlys`;

export const formatSocialPrice = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const socialFromPrice = Math.min(...socialPlans.map((p) => p.price));
