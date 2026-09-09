import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { DomainMock } from "@/components/product-ui/mocks";
import { billing } from "@/data/company";
import { pageMetadata, breadcrumbGraph, faqGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";

const PATH = "/transfer-domain";

export const metadata = pageMetadata({
  title: "Transfer a Domain — keep the years you already paid for",
  description:
    "Move a domain to Serverlys without downtime. The five steps, the ICANN rules that catch people out, and free WHOIS privacy when it lands.",
  path: PATH,
});

/**
 * Domain transfer.
 *
 * Architecture is a PROCEDURE, because that is what a transfer is. The two
 * things that actually go wrong — a 60-day lock nobody mentioned, and a
 * transfer started days before expiry — are stated before the CTA rather than
 * discovered at the point of failure.
 */
const FAQS: readonly Faq[] = [
  {
    question: "Will my website or email go down during a transfer?",
    answer:
      "No, provided you do not change nameservers at the same time. A transfer moves who bills you and who manages the registration; it does not touch DNS. Your site keeps resolving to wherever it currently points throughout.",
    scopes: [PATH],
  },
  {
    question: "Do I lose the time left on my registration?",
    answer:
      "No. A gTLD transfer adds a year to whatever you already have, so the remaining term carries over and one more year goes on top. You are buying a year, not restarting the clock.",
    scopes: [PATH],
  },
  {
    question: "Why is my domain refusing to transfer?",
    answer:
      "Almost always one of four things: it is still locked at the current registrar, the authorisation code is wrong or expired, the domain was registered or transferred within the last 60 days, or the admin contact email on the record no longer reaches you. The first three are stated by ICANN policy and no registrar can waive them.",
    scopes: [PATH],
  },
  {
    question: "How long does a transfer take?",
    answer:
      "Typically five to seven days for a gTLD. The losing registrar has up to five days to release it, and can be asked to approve it sooner. Some ccTLDs are faster and some have their own process entirely.",
    scopes: [PATH],
  },
  {
    question: "My domain expires in a week. Should I transfer now?",
    answer:
      "Renew it first, at your current registrar, today. A transfer takes days and an expired domain enters a grace period and then redemption, where recovery costs many times a renewal. Renew, let it settle, then move it.",
    scopes: [PATH],
  },
];

const STEPS = [
  {
    n: "01",
    t: "Unlock it where it lives now",
    d: "Sign in to your current registrar and turn off the transfer lock. In a WHOIS record this is the status code reading 'client transfer prohibited'.",
    check: "Check the lock",
    href: "/whois-lookup",
  },
  {
    n: "02",
    t: "Get the authorisation code",
    d: "Also called an EPP code or auth code. Your current registrar must give it to you — that is an ICANN requirement, not a courtesy. It is usually emailed to the admin contact.",
  },
  {
    n: "03",
    t: "Start the transfer here",
    d: "Enter the domain and the code. You pay for one year at our published rate, and that year is added to the time you already have.",
    check: "Start a transfer",
    href: billing.transferDomain,
    external: true,
  },
  {
    n: "04",
    t: "Approve the confirmation email",
    d: "The registry emails the admin contact on the record. If that address is stale, fix it before you begin — this is the step that silently fails.",
  },
  {
    n: "05",
    t: "It lands, with privacy on",
    d: "Five to seven days for most extensions. WHOIS privacy is switched on at no charge when it arrives, and DNS is untouched throughout.",
  },
] as const;

export default function TransferDomainPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Domains", path: "/domain-name" },
          { name: "Transfer a domain", path: PATH },
        ])}
      />
      <JsonLd data={faqGraph(FAQS)} />

      <ProductHero
        eyebrow="Transfer a domain"
        title="Move it without taking anything offline"
        lede="A transfer changes who bills you, not where your website points. Do it in the right order and nobody visiting your site notices a thing."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Domains", href: "/domain-name" },
          { name: "Transfer a domain" },
        ]}
        specs={[
          { label: "Downtime", value: "None" },
          { label: "Your term", value: "Carried over" },
          { label: "Adds", value: "+1 year" },
          { label: "WHOIS privacy", value: "Free" },
        ]}
        primary={{ label: "Start a transfer", href: billing.transferDomain }}
        secondary={{ label: "Check the lock first", href: "/whois-lookup" }}
        visual={<DomainMock />}
      />

      {/* Blockers first. These are the reason transfers fail. */}
      <Section surface="dark" spacing="tight">
        <SectionHeader
          eyebrow="Read this first"
          tone="dark"
          title="Three rules that catch everyone out"
          lede="None of these are ours. They are ICANN policy, and no registrar can waive them — so it is better to know now than on day four."
        />
        <ol className="mt-10 grid gap-px overflow-hidden rounded-xl bg-white/10 md:grid-cols-3">
          {[
            [
              "The 60-day rule",
              "A domain registered or transferred in the last 60 days cannot be transferred again. If you just bought it, you are waiting. Nothing unlocks this.",
            ],
            [
              "Do not transfer near expiry",
              "Transfers take days. Renew at your current registrar first, then move it. Redemption recovery costs many times a renewal.",
            ],
            [
              "The admin email must work",
              "The registry emails the address on the record to confirm. If that mailbox is gone, update it before you start or the transfer stalls in silence.",
            ],
          ].map(([t, d]) => (
            <li key={t} className="bg-canvas-dark p-7">
              <h3 className="text-body-lg font-semibold text-white">{t}</h3>
              <p className="mt-2 text-small text-fg-on-dark-secondary">{d}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* The procedure, as a numbered vertical run with inline actions. */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <SectionHeader
            eyebrow="The procedure"
            title="Five steps, in this order"
            lede="Doing them out of order is what turns a routine transfer into a support ticket."
          />
          <ol className="flex flex-col divide-y divide-line border-t border-line">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-5 py-7">
                <span aria-hidden="true" className="font-mono text-small text-fg-muted">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-body-lg font-semibold text-fg">{s.t}</h3>
                  <p className="mt-2 max-w-[62ch] text-body text-fg-secondary">{s.d}</p>
                  {"check" in s && s.check && (
                    <Button
                      href={s.href}
                      variant="secondary"
                      size="sm"
                      className="mt-4"
                      external={"external" in s ? Boolean(s.external) : undefined}
                    >
                      {s.check}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section surface="subtle" spacing="tight">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-h4 text-fg">Not sure it is ready to move?</h2>
            <p className="mt-2 max-w-2xl text-body text-fg-secondary">
              Run it through the{" "}
              <Link href="/whois-lookup" className="font-medium text-primary hover:text-primary-hover">
                WHOIS lookup
              </Link>{" "}
              first. It shows the lock status, the expiry date and the
              registrar — the three things that decide whether a transfer will
              go through today.
            </p>
          </div>
          <Button href="/whois-lookup" variant="secondary">
            Check the domain
          </Button>
        </div>
      </Section>

      <FaqSection items={FAQS} />
      <FinalCta />
    </>
  );
}
