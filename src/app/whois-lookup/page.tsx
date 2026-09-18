import { JsonLd } from "@/components/ui/json-ld";
import { Faqs } from "@/components/ref/faqs";
import { DomainHero } from "@/components/ref/domain/hero";
import { Popular } from "@/components/ref/domain/popular";
import { Reasons } from "@/components/ref/domain/reasons";
import { Steps } from "@/components/ref/domain/steps";
import { TldTable } from "@/components/ref/domain/tld-table";
import { WhoisLookup } from "@/components/whois/whois-lookup";
import type { Faq } from "@/data/faqs";
import { breadcrumbGraph, faqGraph, pageMetadata } from "@/lib/seo";
import { FAQ_HEAD, HERO, REASONS, STEPS } from "./_content";

/**
 * WHOIS lookup.
 *
 * Rebuilt on hostinger.com/domain-name-search at the owner's instruction,
 * sharing that reference's bands via components/ref/domain/*.
 *
 * THE TOOL IS REAL and unchanged: <WhoisLookup> posts to /api/domains/whois,
 * which queries RDAP server-side. It goes into the hero's tool slot in place
 * of the availability search — which is the whole reason that slot exists.
 *
 * The metadata and FAQ block below are this page's ORIGINAL hand-written copy,
 * kept rather than replaced with the reference's. They are accurate about RDAP
 * redaction, status codes and grace periods, which generic domain FAQs are not.
 */

const PATH = "/whois-lookup";

export const metadata = pageMetadata({
  title: "WHOIS Lookup — who owns a domain, and when it expires",
  description:
    "Look up any domain's registrar, registration and expiry dates, nameservers and transfer lock, live from the registry over RDAP. Free, no account.",
  path: PATH,
});

const FAQS: readonly Faq[] = [
  {
    question: "Why can I not see the owner's name and address?",
    answer:
      "Because the registries no longer publish them. Since GDPR, registrant contact details are redacted in public records for most domains, and ICANN policy formalised it. Anyone showing you a full contact record for a modern domain is showing you a cached copy from before the change, or making it up.",
    scopes: [PATH],
  },
  {
    question: "What is RDAP, and why not WHOIS?",
    answer:
      "RDAP is the IETF's structured replacement for WHOIS, defined in RFC 7482 and 9083. Classic WHOIS returns free text in a different format per registry, so reading it reliably means maintaining dozens of fragile parsers. RDAP returns JSON. We query it directly, so what you see is the registry's answer, not ours.",
    scopes: [PATH],
  },
  {
    question: "What does 'client transfer prohibited' mean?",
    answer:
      "It means the domain is locked, which is the normal and correct state for a domain you are not currently moving. It is a theft protection. To transfer the domain you sign in to the current registrar, unlock it, and request the authorisation code.",
    scopes: [PATH],
  },
  {
    question: "The lookup says a domain is available. Can I definitely buy it?",
    answer:
      "Usually, but not always. RDAP answers whether a registry record exists. It does not know about premium pricing, registry-reserved names or trademark holds. The cart is the authority on whether a name is for sale and at what price.",
    scopes: [PATH],
  },
  {
    question: "My domain expires soon. What should I do?",
    answer:
      "Renew it at your current registrar today — do not wait for the transfer. A domain in redemption costs far more to recover than it does to renew, and the recovery fee is set by the registry, not the registrar. Move it afterwards, once it is safe.",
    scopes: [PATH],
  },
];

const BREADCRUMB = [
  { name: "Home", path: "/" },
  { name: "WHOIS lookup", path: PATH },
];

export default function WhoisLookupPage() {
  return (
    /** globals.css balances headings; the reference wraps normally. */
    <div className="[&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd data={breadcrumbGraph(BREADCRUMB)} />
      <JsonLd data={faqGraph(FAQS)} />

      <DomainHero copy={HERO} tool={<WhoisLookup />} />
      <Reasons copy={REASONS} />
      <Popular />
      <Steps copy={STEPS} />
      <TldTable />

      <Faqs
        idPrefix="wl"
        title={FAQ_HEAD.title}
        description={FAQ_HEAD.description}
        items={FAQS.map((f) => ({
          q: f.question,
          a: [{ type: "p" as const, runs: [{ text: f.answer }] }],
        }))}
      />
    </div>
  );
}
