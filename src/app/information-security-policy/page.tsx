import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";
import { emailDisplay } from "@/data/company";

/**
 * Information security policy.
 *
 * ⚠ THE HARD RULE ON THIS PAGE: it states CONTROLS, never CERTIFICATIONS.
 *
 * Serverlys holds no ISO 27001 certificate, no SOC 2 report and no PCI
 * attestation of its own, and the page says so in as many words. Every
 * competitor policy this was structured against leads with a certification
 * badge, and the temptation to match that shape by implying one is exactly
 * the failure mode to avoid — an unearned security claim is the one kind of
 * marketing copy that is also a misrepresentation to an enterprise buyer and
 * a regulator.
 *
 * Same standing rule as everywhere else on this site: NO UPTIME PERCENTAGE is
 * published as a commitment. See data/navigation.ts. "Continuously monitored"
 * is a true description of a practice; "99.9%" would be a contractual number
 * nobody has verified.
 *
 * Where a control is aspirational rather than in place, it is written as an
 * undertaking with a date or not written at all.
 */

const PATH = "/information-security-policy";

export const metadata = pageMetadata({
  title: "Information Security Policy | Serverlys",
  description:
    "Serverlys security controls — access, encryption, backups, logging, patching — what we commit to when one fails, and the certifications we do not hold.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "scope",
    heading: "What this policy covers",
    blocks: [
      {
        type: "p",
        text: "This describes how Serverlys protects the infrastructure we run and the data it holds: hosting accounts, domain records, the billing system, and the AI services sold as ConvoAI and CallFlow. It applies to our staff and to any contractor with access to those systems.",
      },
      {
        type: "p",
        text: "It does not cover the security of what you build. A hosting account is a shared responsibility: we secure the platform, you secure the application running on it. An out-of-date plugin on your own site is not something this policy can protect you from, and no hosting provider's policy can honestly claim otherwise.",
      },
    ],
  },
  {
    id: "certifications",
    heading: "What we are not certified for",
    blocks: [
      {
        type: "p",
        text: "Stated first, because a security policy that buries this is doing something with it. Serverlys does not hold an ISO 27001 certificate, a SOC 2 Type I or Type II report, or a PCI DSS attestation of compliance in its own name.",
      },
      {
        type: "note",
        text: "If you need a provider with one of those in hand — because your own auditor requires it, or because your sector mandates it — you should ask us before you buy rather than after. We will tell you plainly where we stand and, if we are not the right fit, say so.",
      },
      {
        type: "p",
        text: "Card payments are processed by a PCI-compliant payment provider and card numbers are never stored on our systems or transmitted through them. That is a statement about the payment path, not a claim of certification for Serverlys.",
      },
    ],
  },
  {
    id: "access",
    heading: "Access control",
    blocks: [
      {
        type: "ul",
        items: [
          "Access to production systems is limited to staff whose role requires it, and is removed when the role changes or ends rather than at some later review.",
          "Administrative access requires multi-factor authentication. This is not optional for staff and there is no exemption for convenience.",
          "Credentials are individual. Shared logins to production are not used, because an action nobody can be tied to is an action nobody is accountable for.",
          "Customer data is accessed by support staff only where it is necessary to act on a request you have made, or to respond to an incident.",
        ],
      },
      {
        type: "p",
        text: "You control access to your own account. We strongly recommend enabling two-factor authentication on it, and we will never ask you for your password — not by email, not on a call, not to speed up a support ticket.",
      },
    ],
  },
  {
    id: "encryption",
    heading: "Encryption",
    blocks: [
      {
        type: "ul",
        items: [
          "Traffic between you and our services is encrypted in transit using TLS. Every hosting plan includes a certificate at no charge, and we do not sell HTTPS as an upgrade.",
          "Account passwords are stored as salted hashes, never in a form that can be reversed to the original. We cannot tell you your password because we do not have it.",
          "Backups are encrypted at rest.",
        ],
      },
    ],
  },
  {
    id: "backups",
    heading: "Backups and restoration",
    blocks: [
      {
        type: "p",
        text: "Hosting plans are backed up daily, and a restore is free. Charging for a restore turns your worst day into a sales opportunity, which is not a business we want to be in.",
      },
      {
        type: "p",
        text: "Backups are a recovery mechanism, not an archive. Keep your own copy of anything you cannot afford to lose — that is true of every provider, and a provider who implies otherwise is setting you up.",
      },
    ],
  },
  {
    id: "monitoring",
    heading: "Monitoring, logging and patching",
    blocks: [
      {
        type: "ul",
        items: [
          "Infrastructure is monitored continuously, with alerting to staff on failure rather than on a scheduled check.",
          "Administrative and authentication events are logged, and logs are retained for a period sufficient to investigate an incident after it is reported rather than only while it is happening.",
          "Security updates to operating systems and platform software are applied on a regular cycle, and out of cycle where a vulnerability is being actively exploited.",
        ],
      },
      {
        type: "note",
        text: "We publish no uptime percentage here or anywhere else on this site. A figure like that is a contractual commitment with a credit schedule behind it, and we will not print one before we can stand behind it with our own measurements.",
      },
    ],
  },
  {
    id: "incidents",
    heading: "When something goes wrong",
    blocks: [
      {
        type: "p",
        text: "Every provider has incidents. What distinguishes them is what happens next, so here is what we commit to.",
      },
      {
        type: "ul",
        items: [
          "We investigate, contain, and fix — in that order. Understanding the scope comes before restoring the service where restoring it first would destroy the evidence of what happened.",
          "Where a personal data breach affects you, we notify you without undue delay, with what we know at the time rather than waiting for a complete picture.",
          "Where we act as your processor, our notification obligations to you are set out in the data processing agreement, and that document governs.",
          "We do not quietly close an incident. If it affected you, you hear about it from us.",
        ],
      },
    ],
  },
  {
    id: "reporting",
    heading: "Reporting a vulnerability",
    blocks: [
      {
        type: "p",
        text: `If you have found a security flaw in our systems, the responsible disclosure policy sets out how to report it, what is in scope, and our undertaking not to pursue researchers who follow it. Reports reach us at ${emailDisplay}.`,
      },
      {
        type: "p",
        text: "Please do not test against another customer's site or data. Ours is the only environment you have our permission to look at, and that permission has limits worth reading before you start.",
      },
    ],
  },
  {
    id: "review",
    heading: "Review",
    blocks: [
      {
        type: "p",
        text: "This policy is reviewed at least annually, and after any incident that shows one of its controls to be inadequate. The date at the top of this page is when the current version took effect.",
      },
    ],
  },
];

export default function InformationSecurityPolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Information security policy", path: PATH },
        ])}
      />
      <LegalPage
        path={PATH}
        title="Information security policy"
        intro="The controls we actually operate, written without the certification badges we have not earned. It says what we do, what we commit to when something fails, and what remains yours to secure."
        trail={[{ name: "Home", href: "/" }, { name: "Information security policy" }]}
        sections={SECTIONS}
        contact="If you are evaluating us against a security questionnaire and something here does not answer it, send us the question rather than guessing at the answer. We would rather tell you we do not meet a requirement than have you find out later."
      />
    </>
  );
}
