import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";
import { emailDisplay } from "@/data/company";

/**
 * Data Processing Agreement.
 *
 * The document business customers ask for the moment they have any European or
 * UK users: hosting a site means we process personal data on the customer's
 * behalf, which makes them the controller and us the processor, and GDPR
 * Article 28 requires that relationship to be in writing.
 *
 * ⚠ NO SUB-PROCESSOR IS NAMED HERE. Article 28(2) allows general written
 * authorisation with notice of changes, which is what this document uses, and
 * naming vendors we have not verified in the repo would be inventing facts
 * about who holds customer data. The categories are real and derived from what
 * the site demonstrably does (WHMCS billing, a payment processor, registrar
 * partners, infrastructure). Publish the actual list at the address given, and
 * keep it current — that is an operational task, not a code one.
 *
 * ⚠ Needs counsel review before launch. An executed DPA is a contract.
 */

const PATH = "/data-processing-agreement";
const EFFECTIVE = "2026-09-14";

export const metadata = pageMetadata({
  title: "Data Processing Agreement | Serverlys",
  description:
    "The GDPR Article 28 terms for when Serverlys processes personal data on your behalf: roles, security, sub-processors, international transfers and deletion.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "roles",
    heading: "Who is who",
    blocks: [
      {
        type: "p",
        text: "When you host a site with us, the personal data that flows through it — your customers' enquiries, orders, accounts — is yours. You decide why it is collected and what happens to it, which makes you the controller. We hold and process it to provide the hosting, which makes us the processor.",
      },
      {
        type: "p",
        text: "For your own account with us — your billing details, your support history, your contact information — we are the controller, and the privacy policy governs that instead of this agreement.",
      },
      {
        type: "note",
        text: "This agreement is incorporated into the terms of service and applies automatically where we process personal data on your behalf. You do not need to sign a separate copy for it to be in force, though we will countersign one on request.",
      },
    ],
  },
  {
    id: "scope",
    heading: "What we process, and why",
    blocks: [
      {
        type: "p",
        text: "The subject matter is the provision of hosting and related services. The duration is the term of your agreement with us, plus the retention periods described below.",
      },
      {
        type: "ul",
        items: [
          "Types of data: whatever your site or application stores. We do not determine it and, in normal operation, we do not inspect it.",
          "Categories of people: your users, customers, employees and contacts — again, determined by you.",
          "Purpose: hosting, storing, backing up, transmitting and securing that data so the service works.",
        ],
      },
      {
        type: "p",
        text: "We act only on your documented instructions. Using the service is itself an instruction to process the data it handles. Where the law requires us to process data for another reason, we will tell you before doing so unless that law forbids telling you.",
      },
      {
        type: "note",
        text: "Do not store special category data — health, biometric, political or similar — or payment card numbers on standard hosting without telling us first. Those carry obligations that need the right plan and the right configuration.",
      },
    ],
  },
  {
    id: "security",
    heading: "Security measures",
    blocks: [
      {
        type: "p",
        text: "We maintain technical and organisational measures appropriate to the risk, and they include:",
      },
      {
        type: "ul",
        items: [
          "Encryption in transit, with TLS certificates issued and renewed automatically on every site at no cost.",
          "Isolation between customer accounts on shared infrastructure.",
          "Access control on our side limited to staff who need it to do their job, with authentication on administrative systems.",
          "Daily backups with restore points, so data can be recovered after an incident rather than just after a mistake.",
          "Patching of the platform we operate, and monitoring for unauthorised access.",
        ],
      },
      {
        type: "p",
        text: "Security of what you install on top of the platform — your application, its plugins, its credentials — stays with you. The acceptable use policy sets out that division.",
      },
    ],
  },
  {
    id: "confidentiality",
    heading: "Confidentiality and staff",
    blocks: [
      {
        type: "p",
        text: "Anyone with access to data processed on your behalf is bound by confidentiality obligations that survive the end of their engagement with us, and access is granted on the basis of need rather than seniority.",
      },
    ],
  },
  {
    id: "sub-processors",
    heading: "Sub-processors",
    blocks: [
      {
        type: "p",
        text: "Providing hosting means using other providers. You give general authorisation for us to engage sub-processors, on the condition that each is bound by data protection terms no less protective than these, and that we remain responsible to you for what they do.",
      },
      {
        type: "p",
        text: "The categories we use are:",
      },
      {
        type: "ul",
        items: [
          "Infrastructure and data centre providers, which host the servers your site runs on.",
          "Payment processing, for billing. Card details are entered directly with the processor and are not stored on our systems.",
          "Email delivery, for transactional and notification mail.",
          "Domain registries and registrar partners, where a domain is registered or transferred.",
          "Support and business tooling used to run the account relationship.",
        ],
      },
      {
        type: "p",
        text: "We maintain a current list of the specific sub-processors behind those categories and will provide it on request to " + emailDisplay + ". We give reasonable notice before adding or replacing one, and if you object on reasonable data protection grounds we will work with you on an alternative or you may terminate the affected service.",
      },
    ],
  },
  {
    id: "transfers",
    heading: "International transfers",
    blocks: [
      {
        type: "p",
        text: "Where personal data moves outside the UK or the European Economic Area, we rely on a lawful transfer mechanism — an adequacy decision where one applies, and otherwise the relevant Standard Contractual Clauses, which are incorporated into this agreement by reference.",
      },
      {
        type: "p",
        text: "Where a server location is offered at purchase, choosing one determines where the data primarily resides. Backups and administration may still involve access from elsewhere, under the same safeguards.",
      },
    ],
  },
  {
    id: "assistance",
    heading: "Helping you meet your own obligations",
    blocks: [
      {
        type: "ul",
        items: [
          "Data subject requests: if one reaches us and is really about your data, we forward it to you rather than answering it, and we assist you in responding to the extent you cannot do so through your own administration tools.",
          "Breach notification: we notify you without undue delay after becoming aware of a personal data breach affecting data we process for you, with what we know at the time rather than waiting for a complete picture.",
          "Impact assessments: we provide the information reasonably available to us to support a DPIA or a consultation with a supervisory authority.",
          "Audits: we make available the information needed to demonstrate compliance with Article 28 and will respond to reasonable audit requests.",
        ],
      },
    ],
  },
  {
    id: "deletion",
    heading: "Return and deletion",
    blocks: [
      {
        type: "p",
        text: "On the end of the service you can export your data. After that, we delete or return it, except where we are required to keep a copy by law — billing records being the usual case.",
      },
      {
        type: "p",
        text: "Backups age out on the retention schedule for your plan rather than being erased the moment an account closes. Until they do, data may persist in a backup that is not accessible as a live service.",
      },
      {
        type: "note",
        text: "Registrant data held by a domain registry is not ours to delete. That is a registry record governed by ICANN policy, and requests about it go through the process in our domain registration agreement.",
      },
    ],
  },
  {
    id: "precedence",
    heading: "Conflicts",
    blocks: [
      {
        type: "p",
        text: "Where this agreement conflicts with the terms of service on the processing of personal data on your behalf, this agreement governs. On everything else, the terms of service govern.",
      },
    ],
  },
];

export default function DataProcessingAgreementPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Data processing agreement", path: PATH },
        ])}
      />
      <LegalPage
        title="Data Processing Agreement"
        intro="The Article 28 terms that apply whenever we process personal data on your behalf — roles, security, sub-processors, transfers and what happens at the end."
        effective={EFFECTIVE}
        sections={SECTIONS}
        trail={[{ name: "Home", href: "/" }, { name: "Data processing agreement" }]}
        contact="Need a countersigned copy, the current sub-processor list, or the Standard Contractual Clauses for your file? Ask and we will send them."
      />
    </>
  );
}
