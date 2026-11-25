import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { t as tx } from "@/i18n/t";

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
        text: "You must be at least 18 years old and able to enter a binding contract to open an account or buy a service.",
      },
      {
        type: "p",
        text: "Some services carry additional terms. Domain registrations are also governed by the domain registration agreement and by the policies of ICANN and the registry for that extension, which we are required to pass on to you. ConvoAI and CallFlow are also governed by the AI services terms. Those documents add to these terms; the legal information page sets out which one wins if two of them appear to disagree.",
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
          "Keep your credentials secure, and tell us promptly if you believe they have been compromised. You are responsible for what happens under your account.",
          "Keep your own copy of anything you cannot afford to lose. Our backups are a service, not a substitute for your own.",
          "Keep the software you install — WordPress, plugins, themes and scripts — patched and up to date. Unless your plan states that we manage updates for you, that responsibility is yours.",
          "Make sure you have the right to use the content you publish.",
          "If you resell our services or build sites for clients on them, you are responsible for what your clients do on your account, and for their compliance with these terms.",
        ],
      },
    ],
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    blocks: [
      { type: "p", text: "You may not use our services to do any of the following. The acceptable use policy sets out the full rules." },
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
          "Renewals are automatic unless you cancel before the renewal date. We issue the renewal invoice 7 days before it is due. Domain renewal reminders go out 30, 15, 7, 3 and 1 days before expiry.",
          "Upgrades and downgrades are prorated to your billing cycle.",
          "If a payment fails we will retry and contact you. A service with an invoice more than 5 days overdue may be suspended. A service that remains unpaid for 30 days after suspension may be terminated and its data removed.",
          "Domain renewals are set by the registries and can change. Where a registry increases its fee we pass it on rather than absorbing it, and we tell you before the renewal.",
          "Prices do not include taxes unless stated. Where we are required to collect a tax, it is shown at checkout and on your invoice.",
          "If you dispute a payment or file a chargeback with your bank, card issuer or PayPal instead of contacting us, we may suspend the services it covers while the dispute is open. A dispute decided in our favour leaves the amount owed, together with any fee the payment provider charged us.",
        ],
      },
      {
        type: "p",
        text: "We may change the price of a service on renewal. We will give you at least 30 days’ notice by email before the renewal so you can decide whether to continue.",
      },
    ],
  },
  {
    id: "domains",
    heading: "Domain registrations",
    blocks: [
      {
        type: "p",
        text: "When we register a domain for you, you become the registrant and we act as your registrar or through a registrar partner. The domain registration agreement covers this in full. Registry and ICANN policies apply, and they take precedence over these terms where they conflict.",
      },
      {
        type: "ul",
        items: [
          "You are responsible for keeping the registrant contact details accurate. ICANN requires this, and inaccurate details can result in suspension.",
          "A domain registered with us stays locked for 30 days after registration, and its transfer code is not released during that time. Registries and ICANN can also apply their own lock period after a registration, transfer or change of registrant, and we cannot waive those.",
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
        text: "You can cancel at any time. Where you cancel within a refund window, the refunds section applies. If you ask within 14 days of termination, we will provide a copy of the files and databases we still hold for you, and there is no fee for handing over your own data. After that, data from a terminated service may be permanently deleted.",
      },
    ],
  },
  {
    id: "refunds",
    heading: "Refunds",
    blocks: [
      {
        type: "p",
        text: "Hosting plans carry a 30-day money-back guarantee. Domain registrations, renewals and transfers are not refundable once made, except where a registration fails at the registry and you were charged for it. The full detail, including what is and is not covered, is on the refund policy page.",
      },
    ],
  },
  {
    id: "warranties",
    heading: "Disclaimer of warranties",
    blocks: [
      {
        type: "p",
        text: "We stand behind the commitments these terms make. Beyond them, we cannot promise that a service will meet every need you have, or that it will run without errors or interruption.",
      },
      {
        type: "note",
        text: "EXCEPT AS EXPRESSLY STATED IN THESE TERMS, AND TO THE FULLEST EXTENT THE LAW ALLOWS, OUR SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE”. SERVERLYS DISCLAIMS ALL OTHER WARRANTIES, WHETHER EXPRESS, IMPLIED OR STATUTORY, INCLUDING ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT.",
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
        type: "note",
        text: "SUBJECT TO THAT, NEITHER SERVERLYS NOR ITS OFFICERS, EMPLOYEES OR SUPPLIERS ARE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR FOR LOSS OF PROFIT, REVENUE, BUSINESS, GOODWILL OR DATA, EVEN IF WE WERE TOLD SUCH LOSS WAS POSSIBLE. OUR TOTAL LIABILITY ARISING OUT OF OR RELATING TO A SERVICE IN ANY TWELVE-MONTH PERIOD IS LIMITED TO THE AMOUNT YOU PAID US FOR THAT SERVICE IN THAT PERIOD.",
      },
    ],
  },
  {
    id: "indemnity",
    heading: "Indemnity",
    blocks: [
      {
        type: "p",
        text: "You agree to defend, indemnify and hold harmless Serverlys, LLC and its officers and employees from any claim, loss, damage, fine or cost, including reasonable attorneys’ fees, brought by a third party and arising from the content you or your clients host, your use of the services, or your breach of these terms or the law. We will tell you promptly about any claim we receive and let you take part in its defence.",
      },
    ],
  },
  {
    id: "force-majeure",
    heading: "Events outside our control",
    blocks: [
      {
        type: "p",
        text: "Neither of us is responsible for a delay or failure caused by events beyond reasonable control — natural disasters, power or network failures at a provider we depend on, attacks on infrastructure, actions by a government or registry, war, strikes or epidemics. The affected side will tell the other as soon as it reasonably can and resume performance as soon as possible. This does not excuse paying for a service already provided.",
      },
    ],
  },
  {
    id: "governing-law",
    heading: "Governing law and disputes",
    blocks: [
      {
        type: "p",
        text: "These terms are governed by the laws of the State of Florida and applicable United States federal law, without regard to conflict-of-law rules.",
      },
      {
        type: "p",
        text: "If something goes wrong, contact us first. Most problems are solved by a ticket, and we will try in good faith to resolve any dispute informally before either side goes to court.",
      },
      {
        type: "p",
        text: "Any dispute that cannot be resolved that way will be heard exclusively in the state or federal courts located in Miami-Dade County, Florida, and both of us consent to the jurisdiction of those courts. Either side may still bring a claim in small claims court where it qualifies. Nothing in this section removes a right the law of your country or state gives you that cannot be removed by contract.",
      },
    ],
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    blocks: [
      {
        type: "p",
        text: "We may update these terms. The effective date at the top changes when we do. For material changes affecting your rights or the price you pay, we will give you at least 30 days’ notice by email before they take effect, so that you can decide whether to continue. Continuing to use a service after a change takes effect means you accept it.",
      },
    ],
  },
  {
    id: "general",
    heading: "General",
    blocks: [
      {
        type: "ul",
        items: [
          "Entire agreement. These terms, together with the documents they name and your order, are the whole agreement between us about the services, and replace any earlier understanding.",
          "Severability. If a court finds part of these terms unenforceable, that part is limited to the minimum extent necessary and the rest stays in effect.",
          "No waiver. Not enforcing a term straight away does not mean we have given up the right to enforce it later.",
          "Assignment. You may not transfer your account or these terms to someone else without our written consent. We may transfer them as part of a merger, acquisition or sale of the business, and will tell you if we do.",
          "Notices. We send notices to the email address on your account. You send notices to us at the support address below, or through a ticket in your client area.",
          "Survival. The sections on billing amounts owed, disclaimer of warranties, liability, indemnity and governing law continue to apply after a service ends.",
          "Language. If these terms are shown in another language, the English version governs.",
        ],
      },
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <LegalPage
        title={tx("Terms of service")}
        intro={tx("The agreement between you and Serverlys. Written in plain language on purpose — terms nobody can read are terms nobody agreed to.")}
        path={PATH}
        trail={[{ name: "Home", href: "/" }, { name: "Terms of service" }]}
        sections={tx(SECTIONS)}
        contact={tx("If a clause here does not make sense, ask. We would rather explain it now than argue about it later.")}
      />
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Terms of service", path: PATH }]} />
    </>
  );
}
