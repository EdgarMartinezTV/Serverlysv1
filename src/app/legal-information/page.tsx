import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { company, emailDisplay } from "@/data/company";

/**
 * The legal hub.
 *
 * REBUILT 2026-09-19 as an INDEX. It previously restated the copyright/DMCA
 * procedure, the law-enforcement procedure and the abuse route in full — all
 * three of which have had their own pages since 2026-09-14. That duplication
 * was the worst kind: two documents describing the same statutory process in
 * different words, either of which a reader might find first, and no way to
 * tell which was authoritative when they drifted apart.
 *
 * Those three sections are now ROUTING — one line each, pointing at the
 * document that governs. The full procedures live on those pages and nowhere
 * else. If you are about to restate a procedure here, link to it instead.
 *
 * What stays here is what has no other home: the company identity, the
 * grouped index of the whole set, the ORDER OF PRECEDENCE (the one question
 * a reader can only answer from a hub), trademark use, and the third-party
 * position.
 *
 * ⚠ Still no address for service of process, and still no DMCA agent name.
 * Neither is invented; both are launch tasks. See the notes on
 * /dmca-policy and in data/legal.ts.
 */

const PATH = "/legal-information";

export const metadata = pageMetadata({
  title: "Legal Information | Serverlys",
  description:
    "Company details, an index of every Serverlys legal document grouped by what it does, the order they take precedence in, and where to send a formal notice.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "company",
    heading: "Company details",
    blocks: [
      {
        type: "p",
        text: `${company.legalName} operates this website and the services described on it. Correspondence about any of the documents listed below reaches us at ${emailDisplay} or on ${company.phone}.`,
      },
      {
        type: "note",
        text: "For anything requiring formal service of process, write to us first and we will confirm the correct address for service. Do not rely on an address scraped from a directory.",
      },
    ],
  },
  {
    id: "index",
    heading: "Every document, grouped",
    blocks: [
      {
        type: "p",
        text: "Agreements bind both of us. Policies bind us. Each entry says what that document decides and when its current version took effect, so you can tell which one answers your question without opening four of them.",
      },
      { type: "index" },
    ],
  },
  {
    id: "precedence",
    heading: "Which document wins",
    blocks: [
      {
        type: "p",
        text: "Where two of these appear to say different things, they apply in this order. This is the one question a reader can only answer from a page like this, which is why it is stated here rather than left to be inferred.",
      },
      { type: "precedence" },
      {
        type: "note",
        text: "Marketing copy is last for a reason. A sentence on a product page describing what a plan does is a description; it is not a term, and it cannot quietly grant you something an agreement withholds or take away something an agreement gives you.",
      },
    ],
  },
  {
    id: "notices",
    heading: "Where to send a formal notice",
    blocks: [
      {
        type: "p",
        text: "Each of these has its own document setting out exactly what a notice must contain. They are not restated here — a statutory procedure described in two places is a procedure that will eventually be described two different ways.",
      },
      {
        type: "ul",
        items: [
          "Copyright infringement — the copyright and DMCA policy lists the six elements a notice needs under 17 U.S.C. § 512(c)(3), and the counter-notice route.",
          "Law enforcement, subpoenas and court orders — the law enforcement and legal requests page sets out what we require before we disclose anything, and when we tell the customer.",
          "Phishing, malware, spam and other abuse — use the abuse report form. The abuse handling policy explains what happens to it afterwards.",
          "Security vulnerabilities — the responsible disclosure policy, which also carries our undertaking not to pursue researchers who follow it.",
        ],
      },
    ],
  },
  {
    id: "trademarks",
    heading: "Trademarks and brand use",
    blocks: [
      {
        type: "p",
        text: "The Serverlys name, wordmark and the ConvoAI and CallFlow product names are ours. You may use them factually — to say that you host with us, that you are comparing us, or that you are writing about us — without asking.",
      },
      {
        type: "p",
        text: "You may not use them in a way that suggests we endorse, partner with, or supply something we do not, and you may not use them in your own product name, domain or company name.",
      },
      {
        type: "p",
        text: "Third-party names elsewhere on this site — hosting platforms we migrate from, software we support, providers we compare against — belong to their owners and appear for identification only. Their appearance is not a claim of affiliation in either direction.",
      },
    ],
  },
  {
    id: "third-party",
    heading: "Third-party services",
    blocks: [
      {
        type: "p",
        text: "Parts of what we sell depend on third parties: domain registries, certificate authorities, payment processors, infrastructure providers and the model vendors behind our AI services. Their terms apply to their part of the service, and we cannot waive them on your behalf. Where one of them changes a fee or a policy in a way that affects you, we pass on the change and tell you rather than absorbing it silently.",
      },
    ],
  },
  {
    id: "changes",
    heading: "Changes to these documents",
    blocks: [
      {
        type: "p",
        text: "Each document carries the date its current version took effect, shown at the top of the document and beside it in the index above.",
      },
      {
        type: "p",
        text: "Where we make a change that materially affects your rights or what you owe, we tell account holders rather than relying on you to notice a changed date. Corrections that do not change the substance — a typo, a clearer sentence, a fixed link — are made without notice.",
      },
    ],
  },
];

export default function LegalInformationPage() {
  return (
    <>
      <LegalPage
        path={PATH}
        title="Legal information"
        intro="Company details, an index of every document that governs a Serverlys service, and the order they take precedence in when two of them appear to disagree."
        trail={[{ name: "Home", href: "/" }, { name: "Legal information" }]}
        sections={SECTIONS}
        contact="If you cannot tell which document covers your question, ask us rather than reading all of them. Pointing you at the right clause is faster for both of us."
      />
      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Legal information", path: PATH },
        ]}
      />
    </>
  );
}
