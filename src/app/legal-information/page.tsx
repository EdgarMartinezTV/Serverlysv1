import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";
import { company } from "@/data/company";

const PATH = "/legal-information";
const EFFECTIVE = "2026-09-09";

export const metadata = pageMetadata({
  title: "Legal Information | Serverlys",
  description:
    "Company details, the documents that govern Serverlys services, DMCA notice procedure, law enforcement requests and trademark use.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "company",
    heading: "Company details",
    blocks: [
      {
        type: "p",
        text: `${company.legalName} operates this website and the services described on it. Correspondence about any of the documents listed below reaches us at ${company.email} or on ${company.phone}.`,
      },
      {
        type: "note",
        text: "For anything requiring formal service of process, write to us first and we will confirm the correct address for service. Do not rely on an address scraped from a directory.",
      },
    ],
  },
  {
    id: "documents",
    heading: "The documents that govern our services",
    blocks: [
      {
        type: "p",
        text: "Four documents apply, and they apply in this order where they conflict: registry and ICANN policy first for domain matters, then the terms of service, then the specific policy, then anything written on a product page.",
      },
      {
        type: "ul",
        items: [
          "Terms of service — the agreement covering every service you buy from us.",
          "Privacy policy — what personal data we hold and what you can ask us to do about it.",
          "Refund policy — the 30-day hosting guarantee and why domains sit outside it.",
          "Accessibility statement — the conformance target for this website and how to report a barrier.",
        ],
      },
    ],
  },
  {
    id: "dmca",
    heading: "Copyright and DMCA notices",
    blocks: [
      {
        type: "p",
        text: "If material hosted on our platform infringes your copyright, send us a notice. To be actionable under 17 U.S.C. § 512(c)(3) it must contain all of the following, and a notice missing any of them will come back to you for completion rather than being actioned.",
      },
      {
        type: "ul",
        items: [
          "Your physical or electronic signature.",
          "Identification of the copyrighted work you say has been infringed.",
          "The URL of the specific material — the page, not the domain.",
          "Your address, telephone number and email address.",
          "A statement that you have a good-faith belief the use is not authorised by the copyright owner, its agent, or the law.",
          "A statement, under penalty of perjury, that the information is accurate and that you are the owner or authorised to act for the owner.",
        ],
      },
      {
        type: "p",
        text: "Our customer may file a counter-notice. Where they do, and it meets the statutory requirements, we are permitted to restore the material after the statutory period unless you notify us that you have filed an action seeking a court order.",
      },
      {
        type: "p",
        text: "Knowingly making a material misrepresentation in a notice or counter-notice carries liability for damages under § 512(f). This is not a formality and we do not treat it as one.",
      },
    ],
  },
  {
    id: "law-enforcement",
    heading: "Law enforcement and legal requests",
    blocks: [
      {
        type: "p",
        text: "We respond to valid legal process from authorities with jurisdiction over us. We check that a request is valid and properly scoped before acting on it, and we produce only what the request actually compels.",
      },
      {
        type: "p",
        text: "Where we are permitted to tell a customer their data has been requested, we do. Where a court order forbids it, we do not. We will not disclose customer data to a private party on request — that requires legal process, and asking politely is not it.",
      },
      {
        type: "p",
        text: "Preservation requests are honoured for the period the law provides while process is obtained.",
      },
    ],
  },
  {
    id: "abuse",
    heading: "Abuse reports",
    blocks: [
      {
        type: "p",
        text: "Phishing, malware, spam and network abuse are reported through the abuse page, which routes to the queue that handles them. Reports need the exact URL to be actionable. What we do with a report, and what we will not do, is set out on that page.",
      },
    ],
  },
  {
    id: "trademarks",
    heading: "Trademarks and brand use",
    blocks: [
      {
        type: "p",
        text: "Serverlys, ConvoAI and CallFlow, together with our logos, are our marks. You may refer to us by name in factual statements — that you are a customer, or that your site is hosted with us — without asking.",
      },
      {
        type: "p",
        text: "You may not use our marks in a way that suggests we endorse, sponsor or are affiliated with your product, nor register a domain or social account that would be confused with ours. Other names appearing on this site belong to their respective owners and are used only to identify what they are.",
      },
    ],
  },
  {
    id: "third-party",
    heading: "Third-party services",
    blocks: [
      {
        type: "p",
        text: "Parts of what we sell depend on third parties: domain registries, certificate authorities, payment processors and infrastructure providers. Their terms apply to their part of the service, and we cannot waive them on your behalf. Where one of them changes a fee or a policy in a way that affects you, we pass on the change and tell you rather than absorbing it silently.",
      },
    ],
  },
];

export default function LegalInformationPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Legal information", path: PATH }])}
      />
      <LegalPage
        title="Legal information"
        intro="Company details, which document governs what, and the procedures for copyright notices, law-enforcement requests and abuse reports."
        effective={EFFECTIVE}
        trail={[{ name: "Home", href: "/" }, { name: "Legal information" }]}
        sections={SECTIONS}
        contact="For notices under section three, use the requirements listed there — a complete notice is actioned far faster than one we have to send back."
      />
    </>
  );
}
