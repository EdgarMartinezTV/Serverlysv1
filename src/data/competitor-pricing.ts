/**
 * Competitor hosting prices, read off each company's own pages on
 * COMPETITOR_SOURCE_DATE. One source for the /*-alternative pages and
 * /web-hosting-renewal-prices.
 *
 * ⚠ Every figure was read on the date below and is printed with that date and
 * its source URL. A figure we could not read there is left out, not estimated.
 * Re-verify before changing a number, and change the date in the same edit
 * (the alternative pages also carry SOURCE_DATE / SOURCE_LABEL constants that
 * must match).
 */
export const COMPETITOR_SOURCE_DATE = "2026-10-26";
export const COMPETITOR_SOURCE_LABEL = "26 October 2026";

/**
 * Read off hostinger.com/web-hosting and /wordpress-hosting on SOURCE_DATE.
 * Both pages showed the same three plans with identical text, e.g.
 * "$2.49 /mo … Get 48 months for $119.52 (regular price $585.12). Renews at
 * $10.99/mo." and "All plans are paid upfront."
 */
export const HOSTINGER = [
  { name: "Premium", intro: 2.49, renews: 10.99, months: 48, upfront: 119.52, backups: "Free weekly backups" },
  { name: "Unlimited", intro: 3.49, renews: 16.99, months: 48, upfront: 167.52, backups: "Daily backups + easy data restore" },
  { name: "Cloud Startup", intro: 7.99, renews: 25.99, months: 48, upfront: 383.52, backups: "Daily and on demand backups" },
] as const;

export const HOSTINGER_WEB = "https://www.hostinger.com/web-hosting";

/**
 * Read off bluehost.com/hosting/shared and /wordpress/wordpress-hosting on
 * SOURCE_DATE. Both pages showed the same three priced plans, each card
 * reading e.g. "$3.99/mo … For 36 month term … Renews at $9.99/mo".
 */
export const BLUEHOST = [
  { name: "Starter", intro: 3.99, renews: 9.99, sites: "10 websites", storage: "10 GB NVMe SSD storage", phone: false },
  { name: "Business", intro: 6.99, renews: 13.99, sites: "50 websites", storage: "50 GB NVMe SSD storage", phone: true },
  { name: "eCommerce Essentials", intro: 14.99, renews: 21.99, sites: "100 websites", storage: "100 GB NVMe SSD storage", phone: true },
] as const;

export const BLUEHOST_TERM = "36 month term";

export const BLUEHOST_SHARED = "https://www.bluehost.com/hosting/shared";

/**
 * Read off godaddy.com/hosting/web-hosting on SOURCE_DATE. Each card showed a
 * struck-through price, the price, "/mo" and "For first 3-yr term". The page's
 * disclaimer: "Special introductory pricing valid for the initial purchase
 * term only. Product renewal pricing subject to change." No renewal figure was
 * printed, so none is stated here.
 */
export const GD_HOSTING = [
  { name: "Economy", price: 5.99, struck: 11.99, sites: "1 website" },
  { name: "Deluxe", price: 7.99, struck: 16.99, sites: "10 websites" },
  { name: "Ultimate", price: 12.99, struck: 21.99, sites: "25 websites" },
] as const;

export const GD_HOSTING_TERM = "first 3-yr term";

export const GD_WEB = "https://www.godaddy.com/hosting/web-hosting";

/**
 * Read off namecheap.com/hosting/shared on SOURCE_DATE, US data center, with
 * each billing toggle selected in turn. Yearly is the default view. Each card
 * read "Free trial $0.00 for 30 days, Then $X/mo".
 */
export const NC_HOSTING = [
  { name: "Stellar", monthly: 5.88, yearly: 2.28, biyearly: 1.88, sites: "3 websites", mail: "30 mailboxes", backups: "twice a week" },
  { name: "Stellar Plus", monthly: 7.88, yearly: 2.98, biyearly: 2.28, sites: "Unlimited websites", mail: "unlimited mailboxes", backups: "twice a week plus AutoBackup" },
  { name: "Stellar Business", monthly: 11.88, yearly: 4.98, biyearly: 4.48, sites: "Unlimited websites", mail: "unlimited mailboxes", backups: "twice a week plus AutoBackup" },
] as const;

export const NC_RENEWAL_NOTE =
  "Our advertised discount offer only applies to purchases of annual and biennial plans. This discount offer does not apply to renewals.";

export const NC_SHARED = "https://www.namecheap.com/hosting/shared/";

/**
 * Read off siteground.com/web-hosting.htm on SOURCE_DATE (the WordPress
 * hosting page showed the same three prices). Each card read e.g. "$2.99 /mo.
 * … Renews at $17.99 /mo. Prepaid for 12 months."
 */
export const SG_HOSTING = [
  { name: "StartUp", intro: 2.99, renews: 17.99, sites: "1 website", storage: "10 GB" },
  { name: "GrowBig", intro: 4.99, renews: 29.99, sites: "Unlimited websites", storage: "50 GB" },
  { name: "GoGeek", intro: 7.99, renews: 44.99, sites: "Unlimited websites", storage: "100 GB" },
] as const;

export const SG_TERM_MONTHS = 12;

export const SG_WEB = "https://www.siteground.com/web-hosting.htm";
