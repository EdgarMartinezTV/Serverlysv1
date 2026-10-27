import Link from "next/link";
import { Band } from "../hosting/_components/band";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbGraph, pageMetadata } from "@/lib/seo";
import { breadcrumbTrail, routeFor, sitemapRoutes } from "@/data/routes";
import { tldCatalog } from "@/data/tld-catalog";
import { industries, industryPath } from "@/data/industries";
import { articleCategories, articlesByCategory, categorySlug } from "@/data/articles";
import { tutorialCategories, tutorialPath, tutorials } from "@/data/tutorials";

const PATH = "/sitemap";

export const metadata = pageMetadata({
  title: "Sitemap: every Serverlys page in one place | Serverlys",
  description:
    "Every Serverlys page on one list: hosting, domains, web design, AI and automation, guides and tutorials, company and legal pages, grouped by what they do.",
  path: PATH,
});

/**
 * HTML sitemap, linked from the footer.
 *
 * Modelled on hostinger.com/sitemap: one page, titled columns, every
 * important URL one click from the footer of every page. Search Console
 * (2026-10-26) showed ~76 real pages sitting in "Discovered - currently not
 * indexed" — Google knew the URLs from sitemap.xml but never fetched them.
 * A crawlable HTML page that links them all is the internal-linking half of
 * that fix; sitemap.xml is the other half.
 *
 * Built from the same registry as sitemap.xml (data/routes.ts) and the same
 * article data as the blog, so it can never link a page that does not exist.
 * SECTIONS only decides grouping and order: a built, indexable route that no
 * section claims still appears, under "More pages", so adding a route to the
 * registry is enough to list it here.
 */
const SECTIONS: ReadonlyArray<{ heading: string; paths: readonly string[] }> = [
  {
    heading: "Hosting",
    paths: [
      "/hosting",
      "/cloud-hosting",
      "/wordpress-hosting",
      "/ecommerce-hosting",
      "/managed-hosting",
      "/shared-hosting",
      "/vps-hosting",
      "/dedicated-servers",
      "/migrations",
      "/site-management",
      "/pricing",
    ],
  },
  {
    heading: "Domains and email",
    paths: ["/domain-name", "/register-domain", "/transfer-domain", "/whois-lookup", "/business-email"],
  },
  {
    heading: "Websites and marketing",
    paths: [
      "/website-design",
      "/website-development",
      "/restaurant-websites",
      "/restaurant-websites/online-ordering",
      "/restaurant-websites/reservations",
      "/restaurant-websites/cost",
      "/cleaning-company-websites",
      "/seo",
      "/marketing",
      "/social-media",
      "/business-solutions",
    ],
  },
  { heading: "Domain extensions", paths: ["/tld", ...tldCatalog.map((t) => `/tld/${t.slug}`)] },
  {
    heading: "Websites by industry",
    paths: ["/website-design/industries", ...industries.map((i) => industryPath(i.slug, "en"))],
  },
  { heading: "AI and automation", paths: ["/ai-agents", "/automations", "/ai-tools"] },
  { heading: "Compare", paths: ["/hosting-alternatives", "/hostinger-alternative", "/bluehost-alternative", "/godaddy-alternative"] },
  {
    heading: "En español",
    paths: [
      "/es/restaurant-websites",
      "/es/cleaning-company-websites",
      "/es/website-design/industries",
      ...industries.map((i) => industryPath(i.slug, "es")),
    ],
  },
  {
    heading: "Help and resources",
    paths: ["/support", "/faq", "/resources", "/tutorials", "/blog", "/report-abuse"],
  },
  { heading: "Company", paths: ["/", "/about", "/our-process"] },
  {
    heading: "Legal",
    paths: [
      "/legal-information",
      "/terms-of-service",
      "/privacy-policy",
      "/refund-policy",
      "/cookie-policy",
      "/acceptable-use-policy",
      "/accessibility",
      "/customer-service-policy",
      "/domain-registration-agreement",
      "/data-processing-agreement",
      "/ai-services-terms",
      "/abuse-handling-policy",
      "/dmca-policy",
      "/law-enforcement-requests",
      "/information-security-policy",
      "/responsible-disclosure-policy",
    ],
  },
];

type Entry = { href: string; label: string };

/** Only what sitemap.xml lists is linked: built and indexable. */
const listable = new Set(sitemapRoutes().map((r) => r.path));

function entries(paths: readonly string[]): Entry[] {
  return paths
    .filter((p) => listable.has(p))
    .map((p) => ({ href: p, label: p === "/" ? "Serverlys home" : (routeFor(p)?.name ?? p) }));
}

const claimed = new Set(SECTIONS.flatMap((s) => s.paths));
const COLUMNS = [
  ...SECTIONS.map((s) => ({ heading: s.heading, links: entries(s.paths) })),
  {
    heading: "More pages",
    links: entries(
      sitemapRoutes()
        .map((r) => r.path)
        .filter((p) => !claimed.has(p) && p !== PATH),
    ),
  },
].filter((c) => c.links.length > 0);

const GUIDES = articleCategories.map((category) => ({
  category,
  href: `/blog/category/${categorySlug(category)}`,
  posts: articlesByCategory(category).map((a) => ({ href: `/blog/${a.slug}`, label: a.title })),
}));

const TUTORIALS = tutorialCategories.map((category) => ({
  category,
  links: tutorials
    .filter((t) => t.category === category)
    .map((t) => ({ href: tutorialPath(t), label: t.title })),
}));

/** Heading ids for aria-labelledby. */
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function LinkList({ links }: { links: readonly Entry[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-2.5">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="text-small text-primary hover:underline">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function SitemapPage() {
  return (
    <>
      <JsonLd data={breadcrumbGraph(breadcrumbTrail(PATH))} />

      <Band tone="dark" labelledBy="sitemap-heading">
        <div className="mx-auto max-w-[760px] text-center">
          <h1 id="sitemap-heading" className="display-lg text-white">
            Sitemap
          </h1>
          <p className="mx-auto mt-5 max-w-[60ch] text-body-lg text-fg-on-dark-secondary">
            Every Serverlys page in one place, grouped by what it does.
          </p>
        </div>
      </Band>

      <Band labelledBy="sitemap-pages-heading">
        <h2 id="sitemap-pages-heading" className="sr-only">
          Pages
        </h2>
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((c) => (
            <section key={c.heading} aria-labelledby={`sm-${slug(c.heading)}`}>
              <h3 id={`sm-${slug(c.heading)}`} className="text-body-lg font-semibold text-fg">
                {c.heading}
              </h3>
              <LinkList links={c.links} />
            </section>
          ))}
        </div>
      </Band>

      <Band tone="subtle" labelledBy="sitemap-guides-heading">
        <h2 id="sitemap-guides-heading" className="display-md text-fg">
          Guides and articles
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <section key={g.category} aria-labelledby={`sm-guides-${categorySlug(g.category)}`}>
              <h3 id={`sm-guides-${categorySlug(g.category)}`} className="text-body-lg font-semibold text-fg">
                <Link href={g.href} className="hover:underline">
                  {g.category}
                </Link>
              </h3>
              <LinkList links={g.posts} />
            </section>
          ))}
        </div>
      </Band>

      <Band labelledBy="sitemap-tutorials-heading">
        <h2 id="sitemap-tutorials-heading" className="display-md text-fg">
          <Link href="/tutorials" className="hover:underline">
            Tutorials
          </Link>
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {TUTORIALS.map((g) => (
            <section key={g.category} aria-labelledby={`sm-tutorials-${slug(g.category)}`}>
              <h3 id={`sm-tutorials-${slug(g.category)}`} className="text-body-lg font-semibold text-fg">
                {g.category}
              </h3>
              <LinkList links={g.links} />
            </section>
          ))}
        </div>
      </Band>

      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
