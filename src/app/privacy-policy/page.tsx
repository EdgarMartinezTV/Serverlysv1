import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";

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
      { type: "p", text: "We collect four categories of data, and no more than we need for each." },
      {
        type: "ul",
        items: [
          "Account data — your name, email address, billing address, phone number and the services you hold. You give us this when you sign up.",
          "Payment data — handled by our payment processors. Card numbers are entered directly with the processor and are not stored on our systems.",
          "Domain registration data — the registrant details a registry requires. This is passed to the registry because registration cannot happen without it.",
          "Technical data — server logs containing IP addresses, request paths and timestamps, kept for security, abuse handling and diagnosing faults.",
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
          "Infrastructure and email providers that operate parts of our platform under contract.",
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
          "Server access logs: a short rolling window, sufficient for security investigation and fault diagnosis.",
          "Support tickets: while they remain useful context on your account.",
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
        text: "Depending on where you live, you may have the right to ask for a copy of your data, to have it corrected, to have it deleted, to object to certain processing, or to receive it in a portable form. You can exercise any of these by writing to us.",
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
        text: "This website uses local storage in your browser for three things you control: remembering that you dismissed the announcement bar, holding the shortlist in the domain search, and recording your answer to the cookie notice. All three stay on your device and are not sent to us.",
      },
      {
        type: "p",
        text: "The billing area sets a session cookie so you can stay signed in. That cookie is necessary for the service to function.",
      },
      {
        type: "p",
        text: "This site sets no advertising or analytics cookies and loads no third-party trackers. The cookie panel lists every category with exactly what it covers, and two of the three are empty — we would rather show you that than pad the list. You can reopen it any time from Cookie settings in the footer.",
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
      <JsonLd
        data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Privacy policy", path: PATH }])}
      />
      <LegalPage
        title="Privacy policy"
        intro="What we collect, why we have it, who else sees it and what you can ask us to do about it. Written to be read rather than to be defensible."
        path={PATH}
        trail={[{ name: "Home", href: "/" }, { name: "Privacy policy" }]}
        sections={SECTIONS}
        contact="If something here is unclear, or you want to exercise one of the rights in section seven, ask us directly."
      />
    </>
  );
}
