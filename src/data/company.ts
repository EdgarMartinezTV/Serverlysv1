import { publicEnv } from "@/lib/env";

/**
 * Serverlys identity and the external systems this site links out to.
 *
 * Every fact here is taken from the live site (~/Desktop/Archive). Nothing is
 * invented. If a value is not verified it is not in this file — notably
 * foundingDate and founder, which are deliberately absent from the schema
 * graph until confirmed.
 */
export const company = {
  legalName: "Serverlys, LLC",
  name: "Serverlys",
  domain: "serverlys.com",
  /**
   * The SEO identity of THIS deployment — canonicals, og:url, JSON-LD, sitemap.
   * Set by NEXT_PUBLIC_SITE_URL (see lib/env.ts); never hard-code a host.
   */
  url: publicEnv.siteUrl,
  tagline: "Premium web hosting, domains and cloud solutions",
  description:
    "Managed cloud, WordPress and ecommerce hosting with free migration, free SSL and daily backups. Renewal pricing shown up front.",
  email: "support@serverlys.com",
  phone: "(305) 671-1272",
  phoneHref: "tel:+13056711272",
} as const;

/**
 * The support address as it is SHOWN to a reader — capitalised local part.
 *
 * Derived from `company.email` rather than written out a second time, so the
 * two can never disagree about the domain or the mailbox.
 *
 * ⚠ Display only. `company.email` stays canonical lowercase and is what every
 * `mailto:` href and the Organization schema use: the local part of an address
 * is case-sensitive by RFC 5321 even though effectively every provider folds
 * it, and a machine-readable identifier should never carry presentation
 * styling. Render `emailDisplay`; link and publish `company.email`.
 */
export const emailDisplay =
  company.email.charAt(0).toUpperCase() + company.email.slice(1);

/**
 * WHMCS. Load-bearing: this is the entire checkout path, and it is NOT served
 * by this Next.js app. It runs on the existing cPanel host under the same
 * origin. Easypanel must reverse-proxy /billing/* there. See DEPLOY.md.
 */
const BILLING = publicEnv.billingOrigin;

export const billing = {
  root: BILLING,
  login: `${BILLING}/login`,
  /** Sales department ticket — used by every "talk to an expert" CTA. */
  sales: `${BILLING}/submitticket.php?step=2&deptid=1`,
  registerDomain: `${BILLING}/cart.php?a=add&domain=register`,
  /**
   * The domain cart with the search prefilled — the handoff for every result
   * row and for any name we cannot answer for ourselves.
   *
   * WHMCS is the authority on what is actually sellable and at what price: it
   * knows the TLDs configured on this install, premium/aftermarket flags and
   * the registry's own answer. Our RDAP check is a fast first opinion, never
   * the last word, so anything uncertain goes here rather than to a dead end.
   */
  searchDomain: (domain: string) =>
    `${BILLING}/cart.php?a=add&domain=register&query=${encodeURIComponent(domain)}`,
  /**
   * The transfer cart, prefilled. Same `query` contract as `searchDomain`, and
   * verified the same way: the transfer page fills `#inputTransferDomain` from
   * it. A name that came back registered is not a dead end — it is a transfer
   * candidate, and this is where that intent goes.
   */
  transferDomainSearch: (domain: string) =>
    `${BILLING}/cart.php?a=add&domain=transfer&query=${encodeURIComponent(domain)}`,
  transferDomain: `${BILLING}/cart.php?a=add&domain=transfer`,
  /** Product group index, e.g. store("cloud-hosting"). */
  store: (group: string) => `${BILLING}/store/${group}`,
  /** Specific plan, e.g. order("cloud-hosting", "turbo-cloud"). */
  order: (group: string, plan: string) => `${BILLING}/store/${group}/${plan}`,
} as const;

/** Sister products, cross-linked from the current site. */
export const sisterProducts = [
  {
    name: "ConvoAI",
    href: "https://convoai.cloud/",
    description: "Answers your customers, day and night.",
  },
  {
    name: "CallFlow",
    href: "https://callflow.serverlys.com/",
    description: "Picks up the phone when you cannot.",
  },
] as const;
