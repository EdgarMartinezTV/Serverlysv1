/**
 * Route registry — the single source of truth for what exists on this site.
 *
 * Feeds the sitemap, breadcrumb trails, and indexability decisions. Keeping
 * these in one place is the whole point: a sitemap maintained separately from
 * the navigation drifts, and a sitemap that disagrees with the site is worse
 * than none.
 *
 * ⚠ `built` is load-bearing. Only built routes enter the sitemap. The header
 * and footer link to pages that are not built yet (they carry demand signal and
 * ship soon), and those links 404 today — but ADVERTISING a 404 to Google is a
 * different and worse thing than a visitor finding one. Flip `built` to true in
 * the same commit that adds the page.
 */

export type RouteGroup = "marketing" | "commercial" | "legal" | "tool" | "internal";

export type RouteMeta = {
  path: string;
  /** Short label used in breadcrumb trails. */
  name: string;
  group: RouteGroup;
  /** Does a page component exist for this path today? */
  built: boolean;
  /** Excluded from the sitemap and marked noindex when false. */
  indexable: boolean;
  /**
   * Relative importance within THIS site (0–1). Google largely ignores it, but
   * it costs nothing and helps other crawlers prioritise.
   */
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  /** Ancestors, nearest last. Used to build breadcrumbs and their schema. */
  parents?: readonly string[];
  /**
   * Where to send someone while this page does not exist yet.
   *
   * Only set this when the destination genuinely serves the intent — the
   * homepage plans section really does list WordPress and ecommerce pricing,
   * so pointing there is useful rather than a fudge. Routes with no honest
   * interim destination get no link at all.
   */
  interim?: string;
};

export const routes: readonly RouteMeta[] = [
  // ── Built ────────────────────────────────────────────────────────────────
  {
    path: "/",
    name: "Home",
    group: "marketing",
    built: true,
    indexable: true,
    priority: 1.0,
    changeFrequency: "weekly",
  },

  // Hosting.
  {
    path: "/hosting",
    name: "Hosting",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.9,
    changeFrequency: "weekly",
    parents: ["/"],
  },
  {
    path: "/cloud-hosting",
    name: "Cloud hosting",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.9,
    changeFrequency: "weekly",
    parents: ["/", "/hosting"],
  },
  {
    path: "/wordpress-hosting",
    name: "WordPress hosting",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.9,
    changeFrequency: "weekly",
    parents: ["/", "/hosting"],
  },
  {
    path: "/ecommerce-hosting",
    name: "Ecommerce hosting",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.9,
    changeFrequency: "weekly",
    parents: ["/", "/hosting"],
  },

  // Domains.
  {
    path: "/domain-name",
    name: "Domain names",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.8,
    changeFrequency: "weekly",
    parents: ["/"],
  },
  {
    path: "/register-domain",
    name: "Register a domain",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.9,
    changeFrequency: "weekly",
    parents: ["/", "/domain-name"],
  },

  // AI products.
  {
    path: "/ai-agents",
    name: "AI agents",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.9,
    changeFrequency: "weekly",
    parents: ["/"],
  },
  {
    path: "/automations",
    name: "Automations",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.8,
    changeFrequency: "weekly",
    parents: ["/", "/ai-agents"],
  },

  // Services.
  {
    path: "/website-design",
    name: "Website design",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.8,
    changeFrequency: "monthly",
    parents: ["/"],
  },
  {
    path: "/website-development",
    name: "Website development",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.8,
    changeFrequency: "monthly",
    parents: ["/"],
  },
  {
    path: "/seo",
    name: "SEO",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.8,
    changeFrequency: "monthly",
    parents: ["/"],
  },
  {
    path: "/marketing",
    name: "Marketing",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.7,
    changeFrequency: "monthly",
    parents: ["/"],
  },
  {
    path: "/social-media",
    name: "Social media",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.7,
    changeFrequency: "monthly",
    parents: ["/"],
  },
  {
    path: "/business-solutions",
    name: "Business solutions",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.7,
    changeFrequency: "monthly",
    parents: ["/"],
  },

  // Company and resources.
  {
    path: "/pricing",
    name: "Pricing",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.9,
    changeFrequency: "weekly",
    parents: ["/"],
  },
  {
    path: "/about",
    name: "About",
    group: "marketing",
    built: true,
    indexable: true,
    priority: 0.6,
    changeFrequency: "monthly",
    parents: ["/"],
  },
  {
    path: "/resources",
    name: "Resources",
    group: "marketing",
    built: true,
    indexable: true,
    priority: 0.6,
    changeFrequency: "weekly",
    parents: ["/"],
  },
  {
    path: "/blog",
    name: "Blog",
    group: "marketing",
    built: true,
    indexable: true,
    priority: 0.7,
    changeFrequency: "weekly",
    parents: ["/"],
  },
  {
    path: "/faq",
    name: "FAQ",
    group: "marketing",
    built: true,
    indexable: true,
    priority: 0.7,
    changeFrequency: "monthly",
    parents: ["/"],
  },
  {
    path: "/support",
    name: "Support",
    group: "marketing",
    built: true,
    indexable: true,
    priority: 0.7,
    changeFrequency: "monthly",
    parents: ["/"],
  },

  // Internal tooling — must never be indexed.
  {
    path: "/design-system",
    name: "Design system",
    group: "internal",
    built: true,
    indexable: false,
    priority: 0,
    changeFrequency: "monthly",
  },

  // ── Not built yet ────────────────────────────────────────────────────────
  // Linked from the navigation or the footer, deliberately absent from the
  // sitemap. Each one either carries an honest interim destination or renders
  // as plain text — see resolveNavTarget below.
  {
    path: "/managed-hosting",
    name: "Managed hosting",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.7,
    changeFrequency: "monthly",
    parents: ["/", "/hosting"],
  },
  {
    path: "/shared-hosting",
    name: "Shared hosting",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.7,
    changeFrequency: "monthly",
    parents: ["/", "/hosting"],
  },
  {
    path: "/vps-hosting",
    name: "VPS hosting",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.7,
    changeFrequency: "monthly",
    parents: ["/", "/hosting"],
  },
  {
    path: "/dedicated-servers",
    name: "Dedicated servers",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.7,
    changeFrequency: "monthly",
    parents: ["/", "/hosting"],
  },
  {
    path: "/transfer-domain",
    name: "Transfer a domain",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.7,
    changeFrequency: "monthly",
    parents: ["/", "/domain-name"],
  },
  {
    path: "/whois-lookup",
    name: "WHOIS lookup",
    group: "tool",
    built: true,
    indexable: true,
    priority: 0.4,
    changeFrequency: "monthly",
    parents: ["/", "/domain-name"],
  },
  {
    path: "/migrations",
    name: "Migrations",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.6,
    changeFrequency: "monthly",
    parents: ["/"],
  },
  {
    path: "/site-management",
    name: "Site management",
    group: "commercial",
    built: true,
    indexable: true,
    priority: 0.6,
    changeFrequency: "monthly",
    parents: ["/"],
  },
  {
    path: "/our-process",
    name: "Our process",
    group: "marketing",
    built: true,
    indexable: true,
    priority: 0.4,
    changeFrequency: "monthly",
    parents: ["/"],
  },
  {
    path: "/tutorials",
    name: "Tutorials",
    group: "marketing",
    built: true,
    indexable: true,
    priority: 0.4,
    changeFrequency: "weekly",
    parents: ["/"],
  },
  {
    path: "/hosting-alternatives",
    name: "Hosting alternatives",
    group: "marketing",
    built: true,
    indexable: true,
    priority: 0.4,
    changeFrequency: "monthly",
    parents: ["/"],
  },
  {
    path: "/ai-tools",
    name: "AI tools",
    group: "marketing",
    built: true,
    indexable: true,
    priority: 0.4,
    changeFrequency: "monthly",
    parents: ["/"],
  },

  // Legal. Real documents, not yet written — never given an interim.
  {
    path: "/acceptable-use-policy",
    name: "Acceptable use policy",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/dmca-policy",
    name: "Copyright and DMCA policy",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/cookie-policy",
    name: "Cookie policy",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/data-processing-agreement",
    name: "Data processing agreement",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/domain-registration-agreement",
    name: "Domain registration agreement",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/law-enforcement-requests",
    name: "Law enforcement and legal requests",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/privacy-policy",
    name: "Privacy policy",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/terms-of-service",
    name: "Terms of service",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/refund-policy",
    name: "Refund policy",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/legal-information",
    name: "Legal information",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/report-abuse",
    name: "Report abuse",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/accessibility",
    name: "Accessibility",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },

  /* Added 2026-09-19. Coverage gap closed against a registrar-grade document
     set, limited to documents that are TRUE OF THIS BUSINESS — no affiliate,
     referral or reseller agreement, because those programmes do not exist, and
     none of the registrar-only policies (NPRD, expired-registration recovery,
     change of registrant), because that obligation sits with the registrar of
     record. See the note on /domain-registration-agreement. */
  {
    path: "/information-security-policy",
    name: "Information security policy",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/responsible-disclosure-policy",
    name: "Responsible disclosure policy",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/abuse-handling-policy",
    name: "Abuse handling policy",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/ai-services-terms",
    name: "AI services terms",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
  {
    path: "/customer-service-policy",
    name: "Customer service policy",
    group: "legal",
    built: true,
    indexable: true,
    priority: 0.3,
    changeFrequency: "yearly",
    parents: ["/"],
  },
];

const byPath = new Map(routes.map((r) => [r.path, r]));

export function routeFor(path: string): RouteMeta | undefined {
  return byPath.get(path);
}

/** Routes that exist AND may be indexed — the sitemap's source. */
export function sitemapRoutes(): readonly RouteMeta[] {
  return routes.filter((r) => r.built && r.indexable);
}

/** Paths linked in navigation that have no page yet. */
export function unbuiltRoutes(): readonly RouteMeta[] {
  return routes.filter((r) => !r.built);
}

/**
 * Breadcrumb trail for a path, derived from `parents`. Returns entries in
 * order, current page last.
 */
/**
 * How a navigation entry should render.
 *
 * `link`   → a real <a>/<Link> to `href`
 * `text`   → not a link: the page does not exist and has no honest interim
 *            destination, and linking to a 404 wastes crawl budget on every
 *            page of the site while sending visitors nowhere.
 */
export function resolveNavTarget(path: string): {
  mode: "link" | "text";
  href: string;
} {
  // External URLs and in-page anchors are never registry-managed.
  if (/^https?:\/\//.test(path) || path.startsWith("#")) {
    return { mode: "link", href: path };
  }
  const route = byPath.get(path);
  // Unknown paths are assumed real — the registry describes the site, it does
  // not gate it, and a missing entry should not silently break a link.
  if (!route || route.built) return { mode: "link", href: path };
  if (route.interim) return { mode: "link", href: route.interim };
  return { mode: "text", href: path };
}

export function breadcrumbTrail(path: string): Array<{ name: string; path: string }> {
  const route = byPath.get(path);
  if (!route) return [];
  const trail = (route.parents ?? [])
    .map((p) => byPath.get(p))
    .filter((r): r is RouteMeta => Boolean(r))
    // Never build a trail through a page that does not exist — a breadcrumb
    // link to a 404 is worse than a shorter trail.
    .filter((r) => r.built)
    .map((r) => ({ name: r.name, path: r.path }));
  return [...trail, { name: route.name, path: route.path }];
}
