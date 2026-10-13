import { billing } from "./company";

/**
 * All-in-one business plans — the WHMCS "Contractor Website Plans" group
 * (pids 23–24, verified 2026-10-13 through feeds/productsinfo.php): a free
 * website built for you, with hosting, management and lead tools in one
 * monthly fee. Contents are the store's own list, lightly reworded. If the
 * store changes, change this file; /business-solutions and /llms.txt follow.
 *
 * The store does not say Pro includes everything in Growth, so each plan
 * lists only its own features.
 */

export type BusinessPlan = {
  id: "growth" | "pro";
  pid: number;
  name: string;
  /** Monthly price in USD. */
  price: number;
  pages: number;
  summary: string;
  features: readonly string[];
};

export const businessPlans: readonly BusinessPlan[] = [
  {
    id: "growth",
    pid: 23,
    name: "Growth Plan",
    price: 89.95,
    pages: 4,
    summary:
      "A professional website built for you free, hosted and looked after for one monthly fee.",
    features: [
      "Free website built for you (up to 4 pages)",
      "Mobile-optimized professional design",
      "Contact forms and click-to-call buttons",
      "Fast LiteSpeed hosting included",
      "Free SSL security certificate",
      "Daily automated backups",
      "Google Analytics integration",
      "Basic local SEO setup",
      "Google Maps integration",
      "Website speed optimization",
      "Free website migration",
      "30-day satisfaction guarantee",
    ],
  },
  {
    id: "pro",
    pid: 24,
    name: "Pro Contractor Plan",
    price: 249.95,
    pages: 7,
    summary:
      "A bigger site that brings in leads: AI chat, booking, review requests and reporting.",
    features: [
      "Free website built for you (up to 7 pages)",
      "Advanced AI chat assistant",
      "Email and SMS lead notifications",
      "Service-area SEO pages",
      "Review generation automation",
      "Conversion-optimized landing pages",
      "Appointment booking integration",
      "CRM-ready lead tracking",
      "Priority support",
      "Monthly performance report",
      "Speed and uptime monitoring",
      "Quarterly website improvements",
    ],
  },
];

export const businessOrderUrl = (plan: BusinessPlan) =>
  `${billing.root}/cart.php?a=add&pid=${plan.pid}&carttpl=Serverlys`;

export const formatBusinessPrice = (n: number) => `$${n.toFixed(2)}`;

export const businessFromPrice = Math.min(...businessPlans.map((p) => p.price));
