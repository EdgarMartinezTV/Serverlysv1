import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";

const PATH = "/terms-of-service";

export const metadata = pageMetadata({
  title: "Terms of Service | Serverlys",
  description:
    "The agreement between you and Serverlys: what we provide, what you agree to, billing and renewals, acceptable use, suspension and how either side ends it.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "agreement",
    heading: "The agreement",
    blocks: [
      {
        type: "p",
        text: "These terms are the agreement between you and Serverlys, LLC for the services you buy from us. By placing an order or using a service, you accept them. If you are agreeing on behalf of a company, you confirm you are authorised to bind it.",
      },
      {
        type: "p",
        text: "Some services carry additional terms — domain registrations are also governed by the policies of ICANN and the registry for that extension, and we are required to pass those obligations on to you.",
      },
    ],
  },
  {
    id: "what-we-provide",
    heading: "What we provide",
    blocks: [
      {
        type: "p",
        text: "The service described on your order: hosting resources, domain registration, or the professional and AI services you have contracted for. We provide these with reasonable skill and care.",
      },
      {
        type: "p",
        text: "We do not guarantee uninterrupted service. Hardware fails, networks have incidents, and maintenance sometimes has to happen. We will give notice of planned maintenance where we reasonably can, and we will not publish an availability figure we cannot substantiate.",
      },
      {
        type: "note",
        text: "Migration, SSL certificates, daily backups and backup restores are included on hosting plans at no additional charge. WHOIS privacy is included on domain extensions that support it.",
      },
    ],
  },
  {
    id: "your-responsibilities",
    heading: "Your responsibilities",
    blocks: [
      {
        type: "ul",
        items: [
          "Keep your account contact details current. We use them for renewal notices, security alerts and registry confirmations — a stale address is how people lose domains.",
          "Keep your credentials secure, and tell us promptly if you believe they have been compromised.",
          "Keep your own copy of anything you cannot afford to lose. Our backups are a service, not a substitute for your own.",
          "Keep the software you install patched. On unmanaged plans that responsibility is entirely yours.",
          "Make sure you have the right to use the content you publish.",
        ],
      },
    ],
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    blocks: [
      { type: "p", text: "You may not use our services to do any of the following." },
      {
        type: "ul",
        items: [
          "Send unsolicited bulk email, or host a site advertised by it.",
          "Host phishing pages, malware, or material designed to compromise other systems.",
          "Distribute child sexual abuse material. Accounts are terminated immediately and reported.",
          "Infringe copyright or trademark rights.",
          "Attack, scan or attempt to gain unauthorised access to any network or system.",
          "Consume resources in a way that materially degrades service for other customers on shared infrastructure.",
          "Break the law of a jurisdiction that applies to you or to us.",
        ],
      },
      {
        type: "p",
        text: "Anyone can report a violation through our abuse page. We assess reports against these terms rather than against whether we agree with the content.",
      },
    ],
  },
  {
    id: "billing",
    heading: "Billing, renewals and price changes",
    blocks: [
      {
        type: "p",
        text: "Services are billed in advance for the term you choose. Introductory pricing applies to the first term only; the renewal rate is shown alongside it before you buy and is what you pay from the second term onward.",
      },
      {
        type: "ul",
        items: [
          "Renewals are automatic unless you cancel before the renewal date. We send notice in advance.",
          "Upgrades and downgrades are prorated to your billing cycle.",
          "If a payment fails we will retry and contact you. Services may be suspended after non-payment, and eventually terminated with data removed.",
          "Domain renewals are set by the registries and can change. Where a registry increases its fee we pass it on rather than absorbing it, and we tell you before the renewal.",
        ],
      },
      {
        type: "p",
        text: "We may change the price of a service on renewal. We will give you notice before the renewal so you can decide whether to continue.",
      },
    ],
  },
  {
    id: "domains",
    heading: "Domain registrations",
    blocks: [
      {
        type: "p",
        text: "When we register a domain for you, you become the registrant and we act as your registrar or through a registrar partner. Registry and ICANN policies apply, and they take precedence over these terms where they conflict.",
      },
      {
        type: "ul",
        items: [
          "You are responsible for keeping the registrant contact details accurate. ICANN requires this, and inaccurate details can result in suspension.",
          "A domain registered or transferred within the last 60 days cannot be transferred again. This is registry policy and cannot be waived.",
          "If a registration lapses it enters a grace period and then redemption, where recovery costs a registry-set fee far above a renewal. Renew before expiry.",
          "Registrations are generally non-refundable once made, because the registry fee is paid immediately and is not returned to us.",
        ],
      },
    ],
  },
  {
    id: "suspension",
    heading: "Suspension and termination",
    blocks: [
      {
        type: "p",
        text: "We may suspend a service where there is a clear and immediate risk — an active phishing page, a compromised account sending spam, or content that is unlawful on its face. In those cases we act first and tell you immediately afterwards.",
      },
      {
        type: "p",
        text: "For anything contested or less clear-cut, we give you notice and an opportunity to respond before suspending. We would rather have a conversation than an outage.",
      },
      {
        type: "p",
        text: "You can cancel at any time. Where you cancel within a refund window, section eight applies. After termination we will provide a copy of your files and databases on request for a reasonable period, and there is no fee for handing over your own data.",
      },
    ],
  },
  {
    id: "refunds",
    heading: "Refunds",
    blocks: [
      {
        type: "p",
        text: "Hosting plans carry a 30-day money-back guarantee. Domain registrations, renewals and transfers are not refundable once made. The full detail, including what is and is not covered, is on the refund policy page.",
      },
    ],
  },
  {
    id: "liability",
    heading: "Liability",
    blocks: [
      {
        type: "p",
        text: "Nothing in these terms limits liability where the law does not permit it to be limited, including for death or personal injury caused by negligence, or for fraud.",
      },
      {
        type: "p",
        text: "Subject to that, our total liability arising out of the service in any twelve-month period is limited to the amount you paid us for that service in that period. We are not liable for loss of profit, loss of business, or loss of data to the extent that loss results from your own failure to keep your own backups.",
      },
    ],
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    blocks: [
      {
        type: "p",
        text: "We may update these terms. The effective date at the top changes when we do. For material changes affecting your rights or the price you pay, we will give you notice by email before they take effect, so that you can decide whether to continue.",
      },
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Terms of service", path: PATH }])}
      />
      <LegalPage
        title="Terms of service"
        intro="The agreement between you and Serverlys. Written in plain language on purpose — terms nobody can read are terms nobody agreed to."
        path={PATH}
        trail={[{ name: "Home", href: "/" }, { name: "Terms of service" }]}
        sections={SECTIONS}
        contact="If a clause here does not make sense, ask. We would rather explain it now than argue about it later."
      />
    </>
  );
}
