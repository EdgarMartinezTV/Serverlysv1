import { JsonLd } from "@/components/ui/json-ld";
import { DomainHero, Explainers, Manage, Popular, Reasons, Steps, TldTable } from "./_components/domain-ui";
import { Faqs } from "@/components/ref/faqs";
import { getTldPricing } from "@/lib/domains/pricing";
import { faqGraph, pageMetadata, productGraph } from "@/lib/seo";
import { FAQS, FAQ_HEAD, HERO, REASONS, STEPS } from "./_content";
import { DomainSearchApp } from "@/components/domain/domain-search-app";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

/**
 * Domain name search.
 *
 * A 1:1 rebuild of hostinger.com/domain-name-search, on the same terms as
 * /cloud-hosting and /ecommerce-hosting: the reference's section order, grid
 * and type scale, our palette, our prices. Measurements live in
 * components/ref/kit.tsx; copy in _content.ts.
 *
 * THE SEARCH IS REAL. The hero renders the site's existing <DomainSearchApp>,
 * which posts to /api/domains/check — a server route that resolves
 * availability against the registry (RDAP by default, WHMCS when credentialed,
 * never client-side invention) and returns an honest `unknown` instead of
 * rounding uncertainty up to "available". Every result and every TLD card
 * hands off to the real WHMCS cart at
 * `serverlys.com/cart.php?a=add&domain=register&query=…`, so a name
 * the visitor picks arrives in checkout prefilled.
 *
 * Every price on this page comes from WHMCS via lib/domains/pricing (falling
 * back to `data/tlds.ts`). Nothing is hardcoded.
 *
 * Removed from the reference: the "Trusted by 4+ million website owners"
 * review carousel (their customers, not ours) and the promo strip offering a
 * free month of a plan we do not run — matching the calls already made on the
 * other two clones.
 */

const PATH = "/domain-name";

const TITLE = "Domain Name Search — Check & Register | Serverlys";
const DESCRIPTION =
  "Check domain availability against the registry, then register at Serverlys. Free WHOIS privacy where the registry allows it.";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

/** Prices come from WHMCS (lib/domains/pricing); re-render at the same cadence. */
export const revalidate = 3600;

const BREADCRUMB = [
  { name: "Home", path: "/" },
  { name: "Domain names", path: PATH },
];

const FAQ_TEXT = FAQS.map((f) => ({
  question: f.q,
  answer: f.a
    .map((b) => (b.type === "ul" ? b.items.join(" ") : b.runs.map((r) => r.text).join("")))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim(),
  scopes: [PATH],
}));

export default async function DomainNamePage() {
  const { all, featured, cheapest } = await getTldPricing();
  /** Derived from the TLD list, so the schema cannot disagree with the table. */
  const PRICES = all.map((t) => t.price);

  return (
    /**
     * globals.css balances every heading and prettifies every paragraph; the
     * reference wraps normally. Reset for this page only, as on the other two.
     */
    <div className="[&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd
        data={productGraph({
          name: "Serverlys Domain Registration",
          description: `Domain registration from ${cheapest.tld} at $${cheapest.price.toFixed(2)} for the first year.`,
          path: PATH,
          lowPrice: Math.min(...PRICES),
          highPrice: Math.max(...PRICES),
          offerCount: PRICES.length,
          category: "Domain Registration",
        })}
      />
      <JsonLd data={faqGraph(FAQ_TEXT, "/domain-name")} />

      <DomainHero copy={HERO} tlds={featured} tool={<DomainSearchApp tlds={featured} catalog={all} mode="hero" />} />
      <Reasons copy={REASONS} />
      <Popular tlds={featured} />
      <Manage />
      <Steps copy={STEPS} />
      <Explainers />
      <TldTable tlds={all} />

      <Faqs
        idPrefix="dn"
        title={FAQ_HEAD.title}
        description={FAQ_HEAD.description}
        items={FAQS}
      />
      <PageBreadcrumbs trail={BREADCRUMB} />
    </div>
  );
}
