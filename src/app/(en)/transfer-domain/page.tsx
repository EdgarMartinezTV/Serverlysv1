import { JsonLd } from "@/components/ui/json-ld";
import { DomainHero, Explainers, Manage, Popular, Reasons, Steps, TldTable } from "../domain-name/_components/domain-ui";
import { Faqs } from "@/components/ref/faqs";
import { DomainSearchApp } from "@/components/domain/domain-search-app";
import { getTldPricing } from "@/lib/domains/pricing";
import { formatPrice } from "@/data/pricing";
import type { Tld } from "@/data/tlds";
import { faqGraph, pageMetadata } from "@/lib/seo";
import { FAQ_HEAD, HERO, REASONS, STEPS } from "./_content";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";
import { t as tx } from "@/i18n/t";

/**
 * Transfer a domain.
 *
 * Built from hostinger.com/domain-name-search at the owner's instruction,
 * sharing its bands via components/ref/domain/*.
 *
 * The tool is the same real <DomainSearchApp>, and that is the right one here:
 * it reports a name as `registered`, and every result row already offers the
 * transfer cart alongside the register cart. A registered name is a transfer
 * candidate, which is exactly what someone on this page has.
 *
 * No productGraph: a transfer is not priced per extension on our side — the
 * registry's transfer fee applies at checkout — so there is no honest offer
 * range to publish here. The TLD table's first-year column is registration.
 */

const PATH = "/transfer-domain";

const TITLE = "Domain Transfer: Move Your Domain, Keep Paid Time | Serverlys";
const DESCRIPTION =
  "Move a domain to Serverlys without downtime. Your remaining registration carries over, DNS keeps resolving, and the 60-day ICANN rule is explained up front.";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

/** Prices come from WHMCS (lib/domains/pricing); re-render at the same cadence. */
export const revalidate = 3600;

/** The cost answer reads the live WHMCS transfer price for .com when it has one. */
function costFaq(tlds: readonly Tld[]) {
  const com = tlds.find((t) => t.tld === ".com");
  const price = com?.transfer;
  return {
    question: "How much does it cost to transfer a domain to Serverlys?",
    answer: price
      ? `A .com transfer is ${formatPrice(price)}, and that payment adds a year to the registration, so you are not paying for nothing. Other extensions are priced the same way: one year at that extension's normal rate.`
      : "One year at the extension's normal rate, and that payment adds a year to the registration, so you are not paying for nothing.",
    scopes: [PATH],
  };
}

const FAQ_TEXT = [
  {
    question: "Will I lose the time left on my registration?",
    answer:
      "No. A transfer moves the registration rather than restarting it, so remaining years carry over, and most registries add a further year at transfer.",
    scopes: [PATH],
  },
  {
    question: "What do I need from my current registrar?",
    answer:
      "Two things: the domain unlocked, and the authorisation code (sometimes called an EPP or transfer code). No registrar can move a domain without both.",
    scopes: [PATH],
  },
  {
    question: "Why was my transfer refused?",
    answer:
      "The most common reason is the ICANN 60-day rule, which blocks transfers for 60 days after a registration or a previous transfer. A registrar lock still being on, or an expired authorisation code, will also stop it.",
    scopes: [PATH],
  },
  {
    question: "Will my website or email go down during the transfer?",
    answer:
      "Not by itself — DNS keeps resolving from wherever it is currently hosted while the transfer runs. Copy your existing DNS records to Serverlys before it completes so nothing changes at the moment it does.",
    scopes: [PATH],
  },
  {
    question: "How long does a transfer take?",
    answer:
      "Usually a few hours once you approve it, and up to five days if the approval email is not actioned. An unapproved transfer times out and has to be started again.",
    scopes: [PATH],
  },
  {
    question: "Do I need Serverlys hosting to transfer my domain here?",
    answer:
      "No. You can transfer just the domain and keep your website and email where they are: the DNS records decide where they live, not the registrar. If you want to move the website too, our free migration with every cloud plan handles that separately.",
    scopes: [PATH],
  },
  {
    question: "Can I transfer a domain that is about to expire?",
    answer:
      "Yes, as long as it is not inside the 60-day lock. Start at least a week before the expiry date so there is time to approve it, and remember the transfer adds a year. A domain that has already expired depends on your current registrar's grace-period rules, so renew it there first if you can.",
    scopes: [PATH],
  },
];

export default async function TransferDomainPage() {
  const { all, featured } = await getTldPricing();
  const faqs = [costFaq(all), ...FAQ_TEXT];

  return (
    /** globals.css balances headings; the reference wraps normally. */
    <div className="[&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd data={faqGraph(faqs, "/transfer-domain")} />

      <DomainHero copy={tx(HERO)} tlds={tx(featured)} tool={<DomainSearchApp tlds={tx(featured)} catalog={tx(all)} />} />
      <Reasons copy={tx(REASONS)} />
      <Popular tlds={tx(featured)} />
      <Manage />
      <Steps copy={tx(STEPS)} />
      <Explainers />
      <TldTable tlds={tx(all)} />

      <Faqs
        idPrefix="td"
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
