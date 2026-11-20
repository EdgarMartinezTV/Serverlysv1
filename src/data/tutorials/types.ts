/**
 * Task tutorials.
 *
 * Distinct from `articles.ts` by intent: an article explains a subject, a
 * tutorial gets one job done. Everything here is a procedure someone can
 * follow start to finish, and every step is real — the DNS record types, the
 * SPF syntax and the WordPress settings are what they actually are.
 *
 * Rule: no step may say "contact support" as its substance. If the only
 * honest answer to a step is that it varies by provider, say what varies.
 *
 * AUDIENCE (2026-11-20): someone who has never touched a website, a domain or
 * a control panel. Every tutorial must be followable by them alone: plain
 * words, one action per step, the exact buttons to click (`where`), what they
 * should see afterwards (`check`), and every technical word defined in the
 * glossary (`terms`). Accuracy rules above still apply: simpler, never vaguer
 * or wrong.
 */

import type { GlossaryKey } from "./glossary";

export type Step = {
  title: string;
  /**
   * What to do and why, in plain words for someone who has never run a
   * website. Short sentences, second person, no unexplained jargon (any
   * technical word must be in the tutorial's `terms`).
   */
  detail: string;
  /**
   * The exact click path, one screen or button per item, in the order the
   * reader meets them, using the labels exactly as they appear on screen.
   * e.g. ["cPanel", "Domains", "Zone Editor", "Manage"]. Omit for steps that
   * happen away from a screen (deciding, waiting).
   */
  where?: readonly string[];
  /** Optional literal to copy — a record value, a config line, a command. */
  code?: string;
  /** Optional screenshot of the Serverlys cPanel screen this step happens in. */
  shot?: { id: ScreenId; caption: string };
  /** What the reader should see once this step worked, so they know to move on. */
  check?: string;
};

/**
 * Real screenshots of Serverlys cPanel, taken 2026-11-17 from one of our own
 * accounts. Identifying and security details are replaced before capture:
 * the domain reads yourdomain.com, the account username, the server
 * hostname server.serverlys.com, IPs use the documentation ranges
 * (192.0.2.x, 198.51.100.x), and no server name, software version,
 * private key or customer data is in frame. Files: public/tutorials/cpanel/.
 */
export const SCREENS = {
  "zone-records": { w: 1024, h: 620, alt: "cPanel Zone Editor listing the DNS records of yourdomain.com with their TTL, type and value, and the nameservers ns1.serverlys.com and ns2.serverlys.com" },
  "zone-add-record": { w: 1024, h: 560, alt: "cPanel Zone Editor with a new record row open: name, TTL, type and value fields and a Save Record button" },
  "email-deliverability-dkim": { w: 1024, h: 836, alt: "cPanel Email Deliverability, Manage the Domain: DKIM status and the suggested default._domainkey TXT record with its value" },
  "email-routing": { w: 1024, h: 520, alt: "cPanel Email Routing with the options Automatically Detect, Local, Backup and Remote Mail Exchanger" },
  forwarders: { w: 1024, h: 760, alt: "cPanel Forwarders page with the Add Forwarder and Add Domain Forwarder buttons" },
  "default-address": { w: 1024, h: 520, alt: "cPanel Default Address page set to discard unrouted mail with an error message" },
  "mysql-databases": { w: 1024, h: 720, alt: "cPanel Manage My Databases: Create New Database with the account prefix, Check and Repair Database, and the list of current databases" },
  "cron-jobs": { w: 1024, h: 900, alt: "cPanel Cron Jobs page with the cron email setting and the Add New Cron Job form" },
  domains: { w: 1024, h: 440, alt: "cPanel Domains list with the Create A New Domain button and the Force HTTPS Redirect switch" },
  "ssl-tls-status": { w: 1024, h: 640, alt: "cPanel SSL/TLS Certificates, Status tab, showing a self-signed certificate and the AutoSSL error for a domain that does not point at this server yet" },
  jetbackup: { w: 1024, h: 900, alt: "JetBackup 5 in cPanel with Restore and Download options for full backups, home directory, cron jobs, databases, domains, certificates and email accounts" },
} as const;

export type ScreenId = keyof typeof SCREENS;
export const screenSrc = (id: ScreenId) => `/tutorials/cpanel/${id}.webp`;

export type Tutorial = {
  slug: string;
  title: string;
  summary: string;
  category: "Getting started" | "Domains & DNS" | "Email" | "WordPress" | "Security" | "Recovery";
  minutes: number;
  /** First published on serverlys.com (ISO date), from the repo history. */
  published: string;
  /**
   * "What this does, in plain words": why someone would do this and what
   * changes once it is done, with an everyday comparison where it helps.
   * Two to four sentences, no jargon.
   */
  intro: string;
  /** Glossary keys for every technical word the page uses; shown before step one. */
  terms: readonly GlossaryKey[];
  /** One or two sentences: how the reader can tell the whole job worked. */
  done: string;
  /** Stated before step one, so nobody gets halfway and stops. */
  before: readonly string[];
  steps: readonly Step[];
  /** The mistake people actually make. */
  gotcha: string;
  /**
   * Site pages that sell what this tutorial is about, as registry paths. The
   * page resolves each through data/routes.ts and drops anything not built,
   * so a tutorial can never link a 404.
   */
  products?: readonly string[];
  /** Tutorials to recommend first, by slug, before the same-category fallback. */
  related?: readonly string[];
};
