import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { company, emailDisplay } from "@/data/company";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

/**
 * Copyright and DMCA policy.
 *
 * ⚠ SAFE HARBOUR IS NOT COMPLETE UNTIL AN AGENT IS REGISTERED. 17 U.S.C.
 * §512(c)(2) conditions the hosting safe harbour on designating an agent with
 * the US Copyright Office AND publishing that agent's details. This page
 * publishes the process and routes notices to the real, monitored abuse
 * address; the Copyright Office registration is a launch task that cannot be
 * done from code, and it costs a small fee.
 *
 * NO AGENT NAME OR POSTAL ADDRESS IS INVENTED HERE. A fabricated designated
 * agent would be worse than none: it would misdirect statutory notices and
 * would not establish the safe harbour it appears to claim. When the agent is
 * registered, add their name and address to the "where to send" section.
 *
 * The counter-notice section is deliberately as prominent as the notice
 * section. A host that documents only how to take material down, and not how
 * its customer answers back, is not running a fair process.
 */

const PATH = "/dmca-policy";

export const metadata = pageMetadata({
  title: "Copyright and DMCA Policy | Serverlys",
  description:
    "How to report copyright infringement on content hosted by Serverlys, what a valid notice must contain, how counter-notices work and our repeat infringer policy.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "position",
    heading: "Our position",
    blocks: [
      {
        type: "p",
        text: "Serverlys hosts content that our customers create and upload. We do not review it in advance and we are not in a position to judge who owns what. What we can do is act on properly made complaints, tell the customer what has been alleged, and give them a way to respond.",
      },
      {
        type: "p",
        text: "We take copyright seriously in both directions. A complaint that meets the requirements below gets acted on. A complaint sent to silence lawful material does not, and misuse of this process has consequences under US law.",
      },
    ],
  },
  {
    id: "notice",
    heading: "Reporting infringement: what a notice must contain",
    blocks: [
      {
        type: "p",
        text: "To be actionable, a notice must include all of the following. These are the statutory elements, not our preferences — a notice missing any of them may not be valid, and we may not be able to act on it.",
      },
      {
        type: "ul",
        items: [
          "A physical or electronic signature of the copyright owner, or someone authorised to act for them.",
          "Identification of the copyrighted work you say has been infringed. If several works on one site are covered, a representative list is enough.",
          "The specific URL or location of the material you say is infringing — precise enough for us to find it without guessing.",
          "Your name, postal address, telephone number and email address.",
          "A statement that you believe in good faith that the use is not authorised by the copyright owner, its agent, or the law.",
          "A statement that the information in the notice is accurate, and — under penalty of perjury — that you are the copyright owner or authorised to act for them.",
        ],
      },
      {
        type: "note",
        text: "Send notices to " + emailDisplay + " with “DMCA notice” in the subject line. Using that subject routes it to the people who handle it rather than general support.",
      },
    ],
  },
  {
    id: "what-we-do",
    heading: "What we do when we receive one",
    blocks: [
      {
        type: "p",
        text: "We act expeditiously on valid notices. In practice that means:",
      },
      {
        type: "ul",
        items: [
          "We remove or disable access to the identified material, or ask the customer to do so within a short, stated deadline where that is the faster route.",
          "We forward the notice to the customer who hosts the material, including your name and contact details, because they are entitled to know who has complained and what was alleged.",
          "We tell the customer how to file a counter-notice if they believe the claim is mistaken.",
        ],
      },
      {
        type: "p",
        text: "Because we are the host rather than the author, our action is usually limited to the specific material identified. We will not take an entire site offline over one file unless the site cannot be separated from it.",
      },
    ],
  },
  {
    id: "counter-notice",
    heading: "If you are the customer: filing a counter-notice",
    blocks: [
      {
        type: "p",
        text: "If material of yours was removed and you believe that was a mistake or a misidentification, you can file a counter-notice. It must include:",
      },
      {
        type: "ul",
        items: [
          "Your physical or electronic signature.",
          "Identification of the material that was removed and the location where it appeared before removal.",
          "A statement, under penalty of perjury, that you believe in good faith the material was removed as a result of mistake or misidentification.",
          "Your name, address and telephone number.",
          "A statement that you consent to the jurisdiction of the federal court for the district where you live — or, if you are outside the United States, of any district where Serverlys may be found — and that you will accept service of process from the person who filed the notice.",
        ],
      },
      {
        type: "p",
        text: "We forward valid counter-notices to the complainant. If they do not tell us within ten to fourteen business days that they have sought a court order restraining the activity, we may restore the material.",
      },
      {
        type: "note",
        text: "Both a notice and a counter-notice are made under penalty of perjury, and knowingly misrepresenting either can make you liable for damages and legal costs under 17 U.S.C. §512(f). Neither is a form to fill in casually.",
      },
    ],
  },
  {
    id: "repeat",
    heading: "Repeat infringers",
    blocks: [
      {
        type: "p",
        text: "We maintain and act on a repeat infringer policy. Accounts that attract repeated valid notices have their services terminated in appropriate circumstances, and we take into account whether notices were contested and how they were resolved.",
      },
      {
        type: "p",
        text: "One disputed notice does not make someone a repeat infringer. A pattern does.",
      },
    ],
  },
  {
    id: "trademark",
    heading: "Trademark and other complaints",
    blocks: [
      {
        type: "p",
        text: "The process above is specific to copyright. Trademark complaints, defamation claims, and content that breaches our acceptable use policy are handled through our general abuse process instead. Tell us what the content is, where it is, and what right you say it breaches.",
      },
    ],
  },
  {
    id: "where",
    heading: "Where to send notices",
    blocks: [
      {
        type: "p",
        text: "Copyright notices and counter-notices should be sent to " + emailDisplay + ", marked “DMCA notice” or “DMCA counter-notice”. We monitor that address and route these to the team that handles them.",
      },
      {
        type: "p",
        text: "Notices about anything else — abuse, phishing, malware, spam originating from our network — should go through the abuse report process rather than here, so they reach the right people faster.",
      },
      {
        type: "note",
        text: "Postal notices can be addressed to " + company.legalName + " at the contact details published in our legal information.",
      },
    ],
  },
];

export default function DmcaPolicyPage() {
  return (
    <>
      <LegalPage
        title="Copyright and DMCA Policy"
        intro="How to report copyright infringement on material we host, what a valid notice has to contain, and how the customer answers back."
        path={PATH}
        sections={SECTIONS}
        trail={[{ name: "Home", href: "/" }, { name: "Copyright and DMCA policy" }]}
        contact="Copyright notices and counter-notices go to the address above, marked “DMCA notice”. Anything else reaches us faster through the abuse report form."
      />
      <PageBreadcrumbs trail={[
          { name: "Home", path: "/" },
          { name: "Copyright and DMCA policy", path: PATH },
        ]} />
    </>
  );
}
