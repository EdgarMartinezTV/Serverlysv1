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
  url: "https://serverlys.com",
  tagline: "Premium web hosting, domains and cloud solutions",
  description:
    "Managed cloud, WordPress and ecommerce hosting with free migration, free SSL and daily backups. Renewal pricing shown up front.",
  email: "support@serverlys.com",
  phone: "(305) 671-1272",
  phoneHref: "tel:+13056711272",
} as const;

/**
 * WHMCS. Load-bearing: this is the entire checkout path, and it is NOT served
 * by this Next.js app. It runs on the existing cPanel host under the same
 * origin. Easypanel must reverse-proxy /billing/* there. See DEPLOY.md.
 */
const BILLING = "https://serverlys.com/billing";

export const billing = {
  root: BILLING,
  login: `${BILLING}/login`,
  /** Sales department ticket — used by every "talk to an expert" CTA. */
  sales: `${BILLING}/submitticket.php?step=2&deptid=1`,
  registerDomain: `${BILLING}/cart.php?a=add&domain=register`,
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
    description: "AI chat agents that answer for your business around the clock.",
  },
  {
    name: "CallFlow",
    href: "https://callflow.serverlys.com/",
    description: "AI voice reception that picks up when you cannot.",
  },
] as const;
