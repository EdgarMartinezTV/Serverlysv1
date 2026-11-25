import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { publicEnv } from "@/lib/env";
import { marketingVendorNames, vendorNames } from "@/lib/analytics/config";

const VENDORS = vendorNames(publicEnv.analytics);
const MARKETING = marketingVendorNames(publicEnv.analytics);
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { t as tx } from "@/i18n/t";

const PATH = "/privacy-policy";

export const metadata = pageMetadata({
  title: "Privacy Policy | Serverlys",
  description:
    "What personal data Serverlys collects, why, how long it is kept, who it is shared with, and the rights you have over it.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    blocks: [
      {
        type: "p",
        text: "Serverlys, LLC provides web hosting, domain registration, website services and AI products. When you buy a service from us or use this website, we are the controller of the personal data described below.",
      },
    ],
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    blocks: [
      { type: "p", text: "We collect the categories of data below, and no more than we need for each." },
      {
        type: "ul",
        items: [
          "Account data — your name, email address, billing address, phone number and the services you hold. You give us this when you sign up.",
          "Payment data — handled by our payment processors. Card numbers are entered directly with the processor and are not stored on our systems.",
          "Domain registration data — the registrant details a registry requires. This is passed to the registry because registration cannot happen without it.",
          "Technical data — server logs containing IP addresses, request paths and timestamps, kept for security, abuse handling and diagnosing faults.",
          "Chat data — what you write to ConvoAI, the assistant on this website and in the client area, and its replies. If you are signed in, the conversation is linked to your account so the assistant can answer questions about your services, invoices and domains.",
          "Form data — what you enter in a form on this website, such as an abuse report or a request for a consultation.",
          "Usage data — only if you accept analytics or marketing in the cookie panel: the pages you visit, how you move through them, and the campaign link that brought you here. The cookies section below explains exactly what loads.",
        ],
      },
      {
        type: "p",
        text: "If you open a support ticket, we hold what you write in it, including anything you choose to attach. Please do not send passwords by email or ticket; we will ask for credentials through a secure route when they are needed.",
      },
    ],
  },
  {
    id: "why",
    heading: "Why we process it",
    blocks: [
      {
        type: "ul",
        items: [
          "To provide the service you bought — hosting your site, registering your domain, running your agent. This is performance of our contract with you.",
          "To bill you and keep accounting records. Some of this we are legally required to retain.",
          "To keep the platform secure and to investigate abuse. This is our legitimate interest and, for abuse, our legal obligation.",
          "To answer your support requests.",
          "To send service messages about outages, renewals and changes to these terms. These are not marketing and you cannot unsubscribe from them while you hold a service.",
          "To send news and offers by email, only if you opted in. Every marketing email has an unsubscribe link, and you can also change this in your client area at any time.",
          "To understand how this website is used and which of our adverts work, only if you accept analytics or marketing in the cookie panel. This is based on your consent, which you can withdraw from Cookie settings in the footer.",
        ],
      },
      {
        type: "p",
        text: "We do not sell personal data, and we do not share it with third parties for their own marketing.",
      },
    ],
  },
  {
    id: "domain-privacy",
    heading: "Domain registrations and WHOIS",
    blocks: [
      {
        type: "p",
        text: "Registering a domain requires us to pass registrant details to the registry operating that extension. This is a condition of registration set by ICANN and the registries, not a choice we make.",
      },
      {
        type: "p",
        text: "WHOIS privacy is included at no charge on the extensions that support it, and it is on by default. With privacy enabled, public records show a proxy contact rather than your details. Registries, registrars and law enforcement can still access the underlying data through the processes that govern it.",
      },
      {
        type: "note",
        text: "Some country-code extensions do not permit privacy, and a few require published contact details. Where that applies, it is stated before you complete the registration.",
      },
    ],
  },
  {
    id: "sharing",
    heading: "Who we share it with",
    blocks: [
      {
        type: "ul",
        items: [
          "Domain registries and registrar partners, where required to register or transfer a domain.",
          "Payment processors, to take payment.",
          "Infrastructure and email providers that operate parts of our platform under contract, including the hosting servers and the service that delivers our email.",
          "The AI model provider that generates ConvoAI’s replies. It receives the text of the conversation needed to answer, under a contract that does not allow it to train its models on that data.",
          "Analytics and advertising providers, only if you accept them in the cookie panel. They are named in the cookies section below.",
          "Certificate authorities, to issue SSL certificates for your domains.",
          "Law enforcement or a regulator, where we are legally required to and after satisfying ourselves the request is valid.",
        ],
      },
      {
        type: "p",
        text: "Each of these receives the minimum needed to do its job, and is bound to use it only for that purpose.",
      },
    ],
  },
  {
    id: "retention",
    heading: "How long we keep it",
    blocks: [
      {
        type: "ul",
        items: [
          "Account and billing records: for as long as you hold a service, and afterwards for the period tax and company law requires.",
          "Server access logs: up to 12 months, for security investigation, abuse handling and fault diagnosis.",
          "Support tickets and chat conversations: while they remain useful context on your account, or until you ask us to delete them.",
          "Form submissions: as long as needed to handle the request you made.",
          "Marketing consent: until you unsubscribe. We keep a record that you opted out so we do not email you again.",
          "Backups: on the retention cycle of your plan. Deleted data can persist in backups until that cycle completes.",
        ],
      },
    ],
  },
  {
    id: "your-rights",
    heading: "Your rights",
    blocks: [
      {
        type: "p",
        text: "Depending on where you live, you may have the right to ask for a copy of your data, to have it corrected, to have it deleted, to object to certain processing, to withdraw consent you gave, or to receive it in a portable form. You can exercise any of these by writing to us, or through someone you authorise to act for you. We reply within 30 days, and we will not treat you differently for using these rights.",
      },
      {
        type: "p",
        text: "We will verify who you are before acting, because acting on an unverified deletion request would itself be a breach. Some data we cannot delete on request — billing records we are required to keep, and registrant data held by a registry rather than by us.",
      },
      {
        type: "p",
        text: "If you are unhappy with how we have handled a request, you can complain to your local data protection authority.",
      },
    ],
  },
  {
    id: "cookies",
    heading: "Cookies and this website",
    blocks: [
      {
        type: "p",
        text: "This website keeps a few small items in your browser’s storage: your answer to the cookie notice, that you dismissed the announcement bar, the domains in your search cart, and the language you chose for the billing area. These stay on your device. The ConvoAI chat also keeps a visitor id and conversation id there so your conversation is still there when you come back; those ids are sent to ConvoAI with your messages. The cookie policy lists every item.",
      },
      {
        type: "p",
        text: "The billing area sets a session cookie so you can stay signed in. That cookie is necessary for the service to function.",
      },
      {
        type: "p",
        text:
          VENDORS.length || MARKETING.length
            ? [
                VENDORS.length &&
                  `If you accept analytics, this site loads ${VENDORS.join(" and ")} so we can see which pages people use and where they get stuck. None of it is loaded unless you accept, and its advertising features are switched off.`,
                MARKETING.length
                  ? `If you accept marketing, this site loads ${MARKETING.join(" and ")} so we can measure which of our adverts on Facebook and Instagram lead to a visit, a sign-up or a checkout. It is never loaded unless you accept marketing.`
                  : "We set no advertising cookies.",
                "We never send your name, email, phone number or billing details to these services. The cookie panel lists every category with exactly what it covers, and you can reopen it any time from Cookie settings in the footer.",
              ]
                .filter(Boolean)
                .join(" ")
            : "This site sets no advertising or analytics cookies and loads no third-party trackers. The cookie panel lists every category with exactly what it covers, and two of the three are empty — we would rather show you that than pad the list. You can reopen it any time from Cookie settings in the footer.",
      },
    ],
  },
  {
    id: "security",
    heading: "Security",
    blocks: [
      {
        type: "p",
        text: "We use encryption in transit, restrict access to personal data to staff who need it, and log administrative access. No system is perfectly secure, and anyone claiming otherwise is selling something. If a breach affects your personal data and presents a real risk to you, we will tell you and the relevant authority within the time the law requires.",
      },
    ],
  },
  {
    id: "transfers",
    heading: "Where your data is processed",
    blocks: [
      {
        type: "p",
        text: "Serverlys is based in the United States, and our servers and providers process data in the United States. If you use our services from another country, your data is transferred to and processed in the United States, where data protection law may differ from yours. Where the law requires it, we rely on contractual safeguards with our providers for those transfers.",
      },
    ],
  },
  {
    id: "children",
    heading: "Children",
    blocks: [
      {
        type: "p",
        text: "Our services are for adults running a website or a business. They are not directed at children under 13, or under 16 in the European Union, and we do not knowingly collect their personal data. If you believe a child has given us personal data, write to us and we will delete it.",
      },
    ],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    blocks: [
      {
        type: "p",
        text: "When we change this policy we update the effective date at the top. If a change materially affects your rights we will tell you by email rather than relying on you noticing.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <LegalPage
        title={tx("Privacy policy")}
        intro={tx("What we collect, why we have it, who else sees it and what you can ask us to do about it. Written to be read rather than to be defensible.")}
        path={PATH}
        trail={[{ name: "Home", href: "/" }, { name: "Privacy policy" }]}
        sections={tx(SECTIONS)}
        contact={tx("If something here is unclear, or you want to exercise one of the rights in section seven, ask us directly.")}
      />
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Privacy policy", path: PATH }]} />
    </>
  );
}
