import { JsonLd } from "@/components/ui/json-ld";
import { DomainHero, Explainers, Manage, Popular, Reasons, Steps, TldTable } from "../domain-name/_components/domain-ui";
import { Faqs } from "@/components/ref/faqs";
import { DomainSearchApp } from "@/components/domain/domain-search-app";
import { getTldPricing } from "@/lib/domains/pricing";
import { faqsFor } from "@/data/faqs";
import { faqGraph, pageMetadata, productGraph } from "@/lib/seo";
import { FAQ_HEAD, HERO, REASONS, STEPS } from "./_content";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";
import { t as tx } from "@/i18n/t";

/**
 * Register a domain.
 *
 * Built from hostinger.com/domain-name-search, the same reference as
 * /domain-name, sharing its bands via components/ref/domain/*. The copy is
 * registration-specific — see the note in _content.ts about why four pages on
 * one reference need four sets of words.
 *
 * THE SEARCH IS REAL: <DomainSearchApp> posts to /api/domains/check, which
 * resolves against the registry server-side and returns an honest `unknown`.
 * Results hand off to the Serverlys cart at
 * `billing/cart.php?a=add&domain=register&query=…`.
 *
 * FAQs come from data/faqs.ts, which already scopes items to this path — the
 * site's shared answers, not the reference's.
 */

const PATH = "/register-domain";

const DESCRIPTION =
  "Check domain availability against the registry and register at Serverlys. Free WHOIS privacy where allowed, and the renewal rate shown before you pay.";

/** The title quotes the cheapest live price, so it is built per render. */
export async function generateMetadata() {
  const { cheapest } = await getTldPricing();
  const title = `Register a domain name from $${cheapest.price.toFixed(2)} | Serverlys`;
  return pageMetadata({ title, description: DESCRIPTION, path: PATH });
}

/** Prices come from WHMCS (lib/domains/pricing); re-render at the same cadence. */
export const revalidate = 3600;

export default async function RegisterDomainPage() {
  const faqs = faqsFor(PATH);
  const { all, featured } = await getTldPricing();
  const PRICES = all.map((t) => t.price);

  return (
    /** globals.css balances headings; the reference wraps normally. */
    <div className="[&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd
        data={productGraph({
          name: "Serverlys Domain Registration",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...PRICES),
          highPrice: Math.max(...PRICES),
          offerCount: PRICES.length,
          category: "Domain Registration",
        })}
      />
      <JsonLd data={faqGraph(faqs, "/register-domain")} />

      <DomainHero copy={tx(HERO)} tlds={tx(featured)} tool={<DomainSearchApp tlds={tx(featured)} catalog={tx(all)} mode="hero" />} />
      <Reasons copy={tx(REASONS)} />
      <Popular tlds={tx(featured)} />
      <Manage />
      <Steps copy={tx(STEPS)} />
      <Explainers />
      <TldTable tlds={tx(all)} />

      <Faqs
        idPrefix="rd"
        title={tx(FAQ_HEAD.title)}
        description={tx(FAQ_HEAD.description)}
        items={faqs.map((f) => ({
          q: f.question,
          a: [{ type: "p" as const, runs: [{ text: f.answer }] }],
        }))}
      />
      <PageBreadcrumbs trail={tx(breadcrumbTrail(PATH))} />
    </div>
  );
}
