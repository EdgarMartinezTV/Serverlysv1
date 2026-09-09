import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/section";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { WhoisLookup } from "@/components/whois/whois-lookup";
import { pageMetadata, breadcrumbGraph, faqGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";

const PATH = "/whois-lookup";

export const metadata = pageMetadata({
  title: "WHOIS Lookup — who owns a domain, and when it expires",
  description:
    "Look up any domain's registrar, registration and expiry dates, nameservers and transfer lock, live from the registry over RDAP. Free, no account.",
  path: PATH,
});

/**
 * WHOIS lookup.
 *
 * A tool page: the tool is the hero. Everything below it exists to help
 * someone read the result they just got, which is the part every other WHOIS
 * site leaves out — status codes and expiry dates are meaningless until
 * somebody explains what to do about them.
 */
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

export default function WhoisLookupPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Domains", path: "/domain-name" },
          { name: "WHOIS lookup", path: PATH },
        ])}
      />
      <JsonLd data={faqGraph(FAQS)} />

      {/* Tool-first hero: the input is above the fold and focusable at once. */}
      <section className="relative isolate overflow-hidden bg-canvas-abyss">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_25%_-5%,rgb(34_126_255/0.3)_0%,transparent_68%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />
        <Container className="relative pb-24 pt-8 sm:pb-28 sm:pt-10">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Domains", href: "/domain-name" },
              { name: "WHOIS lookup" },
            ]}
            tone="dark"
          />
          <div className="mt-10 max-w-2xl">
            <span className="font-mono text-caption uppercase text-accent-on-dark">
              Free tool
            </span>
            <h1 className="mt-4 text-h1 text-white">Look up any domain</h1>
            <p className="mt-5 text-body-lg text-fg-on-dark-secondary">
              Registrar, registration and expiry dates, nameservers and transfer
              lock — read live from the registry. No account, no rate limit
              games, no upsell before the answer.
            </p>
          </div>
        </Container>
      </section>

      <Container className="-mt-16 pb-16 sm:pb-20">
        <div className="rounded-2xl bg-canvas p-6 shadow-e4 ring-1 ring-inset ring-line sm:p-10">
          <WhoisLookup />
        </div>
      </Container>

      {/* How to read the result — the genuinely useful part. */}
      <Section surface="subtle">
        <SectionHeader
          eyebrow="Reading the record"
          title="What the fields actually mean"
          lede="Most lookup tools hand you a record and leave. These are the four fields people write to us about."
        />
        <dl className="mt-12 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-2">
          {[
            [
              "Expiry date",
              "The date the registration lapses if nobody renews it. After that comes a grace period, then redemption — where recovery costs many times a renewal. Renew before you transfer, never after.",
            ],
            [
              "Status codes",
              "EPP codes describing what the domain may and may not do. Anything reading 'transfer prohibited' is a lock, and a lock is normal — it is theft protection, not a problem.",
            ],
            [
              "Nameservers",
              "Where the domain's DNS is answered, which is what decides where the website and email actually go. Changing registrar does not change these; changing these is what moves the site.",
            ],
            [
              "Last changed",
              "When the registry record was last modified. A very recent change on a domain you are buying is worth asking about before money moves.",
            ],
          ].map(([t, d]) => (
            <div key={t} className="bg-canvas p-7">
              <dt className="text-body-lg font-semibold text-fg">{t}</dt>
              <dd className="mt-2 text-small text-fg-secondary">{d}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section spacing="tight">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { t: "Register a name", d: "Check availability across extensions with prices and renewals shown.", href: "/register-domain" },
            { t: "Transfer one in", d: "Move a domain you already own, keeping the years you have paid for.", href: "/transfer-domain" },
            { t: "How domains work", d: "Registrars, registries, DNS and what you are actually buying.", href: "/domain-name" },
          ].map((c) => (
            <Link
              key={c.t}
              href={c.href}
              className="group flex flex-col gap-2 rounded-xl bg-canvas-secondary p-6 ring-1 ring-inset ring-line transition-colors hover:bg-canvas-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <h2 className="text-body-lg font-semibold text-fg group-hover:text-primary">
                {c.t}
              </h2>
              <p className="text-small text-fg-secondary">{c.d}</p>
            </Link>
          ))}
        </div>
      </Section>

      <FaqSection items={FAQS} />
      <FinalCta />
    </>
  );
}
