import { JsonLd } from "@/components/ui/json-ld";
import { DomainHero, Explainers, Manage, Popular, Reasons, Steps, TldTable } from "../domain-name/_components/domain-ui";
import { Faqs } from "@/components/ref/faqs";
import { DomainSearchApp } from "@/components/domain/domain-search-app";
import { cheapestTld, tlds } from "@/data/tlds";
import { faqsFor } from "@/data/faqs";
import { breadcrumbGraph, faqGraph, pageMetadata, productGraph } from "@/lib/seo";
import { FAQ_HEAD, HERO, REASONS, STEPS } from "./_content";

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

const TITLE = `Register a domain name from $${cheapestTld.price.toFixed(2)} | Serverlys`;
const DESCRIPTION =
  "Check domain availability against the registry and register at Serverlys. Free WHOIS privacy where allowed, and the renewal rate shown before you pay.";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const BREADCRUMB = [
  { name: "Home", path: "/" },
  { name: "Register a domain", path: PATH },
];

const PRICES = tlds.map((t) => t.price);

export default function RegisterDomainPage() {
  const faqs = faqsFor(PATH);

  return (
    /** globals.css balances headings; the reference wraps normally. */
    <div className="[&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd data={breadcrumbGraph(BREADCRUMB)} />
      <JsonLd
        data={productGraph({
          name: "Serverlys Domain Registration",
          description: DESCRIPTION,
          path: PATH,
          lowPrice: Math.min(...PRICES),
          highPrice: Math.max(...PRICES),
          offerCount: PRICES.length,
        })}
      />
      <JsonLd data={faqGraph(faqs)} />

      <DomainHero copy={HERO} tool={<DomainSearchApp />} />
      <Reasons copy={REASONS} />
      <Popular />
      <Manage />
      <Steps copy={STEPS} />
      <Explainers />
      <TldTable />

      <Faqs
        idPrefix="rd"
        title={FAQ_HEAD.title}
        description={FAQ_HEAD.description}
        items={faqs.map((f) => ({
          q: f.question,
          a: [{ type: "p" as const, runs: [{ text: f.answer }] }],
        }))}
      />
    </div>
  );
}
