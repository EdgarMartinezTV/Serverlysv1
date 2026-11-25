import { JsonLd } from "@/components/ui/json-ld";
import { Faqs } from "@/components/ref/faqs";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";
import { faqGraph, pageMetadata } from "@/lib/seo";
import { getTldPricing } from "@/lib/domains/pricing";
import { t as tx } from "@/i18n/t";
import { FAQS, FAQ_HEAD, HERO } from "./_content";
import { Features, WhatIs } from "./_components/sections";
import { WhoisTool } from "./_components/whois-tool";

/**
 * WHOIS lookup.
 *
 * Rebuilt from hostinger.com/whois at the owner's instruction (2026-11-24),
 * from the page as it renders a real lookup in a real browser: lavender hero
 * with the pill search, results block at ?domain=x#domain-results, three
 * feature columns, the "What is the Whois lookup tool?" split and "Whois
 * FAQs". The record is real: /api/domains/whois reads RDAP from the registry
 * and follows its link to the registrar's RDAP server for contacts.
 */

const PATH = "/whois-lookup";

export const metadata = pageMetadata({
  title: "Whois Lookup Tool – Find Out Who Owns a Domain | Serverlys",
  description:
    "Free WHOIS domain lookup. See any domain's registrar, registration and expiry dates, status, nameservers and published contacts, read live from the registry. No account needed.",
  path: PATH,
});

/** Prices for the "Want similar domain name?" card come from WHMCS; hourly. */
export const revalidate = 3600;

const FAQ_TEXT = FAQS.map((f) => ({
  question: f.q,
  answer: f.a
    .map((b) =>
      b.type === "ul" ? b.items.join(" ") : b.runs.map((r) => r.text).join(""),
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim(),
  scopes: [PATH],
}));

export default async function WhoisLookupPage() {
  const { all } = await getTldPricing();
  return (
    <div className="bg-white font-display [&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd data={faqGraph(FAQ_TEXT, PATH)} />
      <WhoisTool hero={HERO} pricing={all} />
      <Features />
      <WhatIs />
      <div className="[&>section]:bg-white [&>section]:py-14 xl:[&>section]:py-20">
        <Faqs
          idPrefix="wl"
          title={FAQ_HEAD.title}
          description={FAQ_HEAD.description}
          items={FAQS}
          size="lg"
          defaultOpen={0}
        />
      </div>
      <PageBreadcrumbs trail={tx(breadcrumbTrail(PATH))} />
    </div>
  );
}
