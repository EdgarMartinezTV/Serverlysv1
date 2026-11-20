/**
 * Every tutorial, assembled from one file per category so each can be edited
 * on its own. Types and the screenshot list live in ./types, plain-English
 * definitions in ./glossary.
 */
import type { Tutorial } from "./types";
import { gettingStartedTutorials } from "./getting-started";
import { domainsTutorials } from "./domains";
import { emailTutorials } from "./email";
import { wordpressTutorials } from "./wordpress";
import { securityTutorials } from "./security";
import { recoveryTutorials } from "./recovery";

export * from "./types";
export { GLOSSARY, type GlossaryKey } from "./glossary";

/**
 * Display order. Getting started first, then the order the archive was
 * published in. Order is load-bearing: relatedTutorials() rotates through it.
 */
const ORDER = [
  "log-in-to-cpanel",
  "point-your-domain",
  "email-deliverability",
  "wordpress-fast-on-day-one",
  "force-https",
  "restore-a-backup",
  "lower-ttl-before-migration",
  "change-nameservers",
  "add-a-or-cname-record",
  "set-up-dmarc",
  "set-up-dkim",
  "connect-google-workspace-or-microsoft-365",
  "install-ssl-certificate-wordpress",
  "move-wordpress-to-a-new-host",
  "change-wordpress-site-url",
  "reset-wordpress-password-phpmyadmin",
  "wordpress-automatic-backups",
  "harden-wordpress-login",
  "fix-error-establishing-database-connection",
  "set-up-subdomain",
  "set-up-email-forwarding",
  "transfer-a-domain",
];

const all = [
  ...gettingStartedTutorials,
  ...domainsTutorials,
  ...emailTutorials,
  ...wordpressTutorials,
  ...securityTutorials,
  ...recoveryTutorials,
];

export const tutorials: readonly Tutorial[] = [...all].sort(
  (a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug),
);

export const tutorialCategories = [
  ...new Set(tutorials.map((t) => t.category)),
] as const;

const bySlug = new Map(tutorials.map((t) => [t.slug, t]));

export function tutorialBySlug(slug: string): Tutorial | undefined {
  return bySlug.get(slug);
}

export function tutorialPath(t: Pick<Tutorial, "slug">): string {
  return `/tutorials/${t.slug}`;
}

/**
 * Tutorials to recommend after this one: the curated `related` slugs first,
 * then same-category neighbours by ROTATION from this tutorial's position (not
 * the first N in array order, which starves everything after them of inbound
 * links — the bug seo-audit.mjs once caught in relatedArticles), then other
 * categories the same way.
 */
export function relatedTutorials(tutorial: Tutorial, limit = 3): readonly Tutorial[] {
  const picked: Tutorial[] = [];
  const take = (t: Tutorial | undefined) => {
    if (t && t.slug !== tutorial.slug && !picked.includes(t) && picked.length < limit) {
      picked.push(t);
    }
  };

  for (const slug of tutorial.related ?? []) take(bySlug.get(slug));

  const index = tutorials.indexOf(tutorial);
  const rotated = tutorials.map((_, i) => tutorials[(index + 1 + i) % tutorials.length]);
  for (const t of rotated) if (t.category === tutorial.category) take(t);
  for (const t of rotated) take(t);

  return picked;
}
