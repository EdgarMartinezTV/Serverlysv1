/**
 * Pages published in Spanish. "/x" here means /es/x exists (home: "/" ↔ "/es").
 * Single source for: hreflang alternates (lib/seo pageMetadata), the language
 * selector, the sitemap, and link localisation on /es pages (i18n/href.ts).
 */
export const ES_PATHS: ReadonlySet<string> = new Set([
  "/",
  "/hosting",
  "/cloud-hosting",
  "/wordpress-hosting",
  "/ecommerce-hosting",
  "/business-email",
  "/domain-name",
  "/domain-name-results",
  "/register-domain",
  "/transfer-domain",
  "/whois-lookup",
  "/pricing",
  "/ai-agents",
  "/automations",
  "/about",
  "/support",
  "/faq",
  "/migrations",
  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",
  "/acceptable-use-policy",
  "/cookie-policy",
  "/dmca-policy",
  "/data-processing-agreement",
  "/domain-registration-agreement",
  "/legal-information",
  "/report-abuse",
  "/accessibility",
  "/law-enforcement-requests",
  "/information-security-policy",
  "/responsible-disclosure-policy",
  "/abuse-handling-policy",
  "/ai-services-terms",
  "/customer-service-policy",
  "/snaply",
  "/snaply/privacy",
  // Spanish twins that predate the site-wide translation (own copy files).
  "/restaurant-websites",
  "/cleaning-company-websites",
  "/website-design/industries",
]);

/** Legal pages: Spanish is a courtesy translation, English governs. */
export const LEGAL_PATHS: ReadonlySet<string> = new Set([
  "/privacy-policy", "/terms-of-service", "/refund-policy", "/acceptable-use-policy",
  "/cookie-policy", "/dmca-policy", "/data-processing-agreement", "/domain-registration-agreement",
  "/legal-information", "/report-abuse", "/accessibility", "/law-enforcement-requests",
  "/information-security-policy", "/responsible-disclosure-policy", "/abuse-handling-policy",
  "/ai-services-terms", "/customer-service-policy", "/snaply/privacy",
]);

export const esPath = (path: string) => (path === "/" ? "/es" : `/es${path}`);

/** English path of a URL path ("/es/x" → "/x", "/es" → "/"), or null if not Spanish. */
export function enPathOf(path: string): string | null {
  if (path === "/es" || path === "/es/") return "/";
  return path.startsWith("/es/") ? path.slice(3) : null;
}

/** The other-language twin of a path, or null when none exists. */
export function twinOf(path: string): { en: string; es: string } | null {
  const p = path.length > 1 ? path.replace(/\/+$/, "") : path;
  const en = enPathOf(p) ?? p;
  if (ES_PATHS.has(en)) return { en, es: esPath(en) };
  return null;
}
