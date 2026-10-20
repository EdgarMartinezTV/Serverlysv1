/**
 * Username rules for bio.serverlys.com/{username}.
 *
 * Reserved names cover every route the app serves at the root plus words that
 * invite impersonation of Serverlys itself. They are checked case-insensitively
 * against the normalised (lowercase) form, which is the only form stored.
 */

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;

export const RESERVED = new Set([
  // app routes
  "admin", "api", "app", "dashboard", "login", "logout", "signup", "register", "verify-email", "reset-password",
  "forgot-password", "settings", "templates", "template", "media", "go", "r", "qr", "new", "edit", "editor",
  "help", "support", "domains", "domain", "analytics", "leads", "sitemap.xml", "robots.txt", "favicon.ico",
  "_next", "_domain", "cd", "p", "u", "static", "assets", "public", "report", "abuse", "health", "auth", "oauth", "sso",
  "account", "accounts", "billing", "pricing", "about", "terms", "privacy", "legal", "blog", "docs", "status",
  "explore", "discover", "search", "home", "index", "www", "mail", "email", "ftp", "cdn", "bio", "link", "links",
  // brand / impersonation
  "serverlys", "serverly", "official", "staff", "team", "security", "root", "system", "moderator", "mod",
  "convoai", "callflow", "hostinger", "linktree", "null", "undefined",
]);

export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase().replace(/^@/, "");
}

/** Returns a human-readable problem, or null when the shape is valid. */
export function usernameProblem(raw: string): string | null {
  const u = normalizeUsername(raw);
  if (u.length < USERNAME_MIN) return `At least ${USERNAME_MIN} characters`;
  if (u.length > USERNAME_MAX) return `At most ${USERNAME_MAX} characters`;
  if (!/^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/.test(u)) return "Letters, numbers, dots, dashes and underscores; start and end with a letter or number";
  if (/[._-]{2,}/.test(u)) return "No repeated punctuation";
  if (RESERVED.has(u)) return "That name is reserved";
  return null;
}

/** Suggestions when a name is taken. */
export function suggestUsernames(raw: string): string[] {
  const u = normalizeUsername(raw).replace(/[^a-z0-9]/g, "").slice(0, 24) || "mybio";
  const year = new Date().getFullYear() % 100;
  return [`${u}.bio`, `${u}${year}`, `${u}hq`, `the${u}`, `${u}.official`.replace(".official", "_official")].filter((s) => !usernameProblem(s));
}
