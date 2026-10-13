import { billing } from "./company";

/**
 * ServerCare website maintenance plans — copied from the live WHMCS store
 * ("Web Maintance Plan" group, pids 17–19, verified 2026-10-13 through
 * feeds/productsinfo.php). WHMCS is the authority on price and contents; if
 * the store changes, change this file and every surface follows: the
 * /site-management cards, its Offer schema, /llms.txt and Sera.
 *
 * Each plan lists its own features in the store's words, condensed. The
 * store does not say a tier includes the one below it, so the page never
 * claims "everything in X, plus".
 */

export type CarePlan = {
  id: "essential" | "plus" | "premium";
  pid: number;
  name: string;
  /** Monthly price in USD. */
  price: number;
  hours: number;
  cadence: "Monthly" | "Bi-weekly" | "Weekly";
  summary: string;
  features: readonly string[];
};

export const carePlans: readonly CarePlan[] = [
  {
    id: "essential",
    pid: 17,
    name: "ServerCare Essential",
    price: 149.95,
    hours: 1,
    cadence: "Monthly",
    summary:
      "The essentials to keep a small site backed up, updated, secure and running well.",
    features: [
      "Daily backups",
      "Basic security monitoring",
      "Monthly updates",
      "Basic site speed optimization",
      "24/7 uptime monitoring with email alerts",
      "Email support",
      "Quarterly SEO audits",
      "1 hour of content updates per month",
      "Monthly malware scans",
      "Monthly broken-link checks",
      "Monthly performance report",
    ],
  },
  {
    id: "plus",
    pid: 18,
    name: "ServerCare Plus",
    price: 249.95,
    hours: 2,
    cadence: "Bi-weekly",
    summary:
      "More frequent updates, scans and reports, plus chat support, for a site that does real business.",
    features: [
      "Daily backups",
      "Advanced security monitoring",
      "Bi-weekly updates",
      "Enhanced speed optimization",
      "24/7 uptime monitoring with instant alerts",
      "Email & chat support",
      "Bi-monthly SEO audits",
      "2 hours of content updates per month",
      "Bi-weekly malware scans",
      "Bi-weekly broken-link checks",
      "Bi-weekly performance reports",
    ],
  },
  {
    id: "premium",
    pid: 19,
    name: "ServerCare Premium",
    price: 399.95,
    hours: 4,
    cadence: "Weekly",
    summary:
      "Weekly care with malware removal, CDN setup and priority phone support, for sites that can’t go down.",
    features: [
      "Daily backups",
      "Advanced monitoring plus malware removal",
      "Weekly updates",
      "Advanced speed optimization with CDN setup",
      "24/7 monitoring with alerts and an uptime SLA",
      "Priority support by email, chat & phone",
      "Monthly SEO audits with recommendations",
      "4 hours of content updates per month",
      "Weekly scans with automatic malware removal",
      "Weekly site integrity checks",
      "Weekly performance reports with in-depth analytics",
    ],
  },
];

export const careOrderUrl = (plan: CarePlan) =>
  `${billing.root}/cart.php?a=add&pid=${plan.pid}&carttpl=Serverlys`;

export const formatCarePrice = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const careFromPrice = Math.min(...carePlans.map((p) => p.price));
