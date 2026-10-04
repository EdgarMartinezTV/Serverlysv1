import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";
import { emailDisplay } from "@/data/company";

/**
 * Abuse handling policy.
 *
 * This is the DOCUMENT. `/report-abuse` is the FORM. Keep them distinct: a
 * reader mid-report wants the form and should not have to read a policy to
 * find it, and a reader deciding whether reporting is worth their time wants
 * this page. Each links to the other.
 *
 * ⚠ RESPONSE TIMES ARE WRITTEN AS AIMS, NOT GUARANTEES, and the wording is
 * load-bearing. "We aim to acknowledge within one business day" is a statement
 * of intent we can keep. "We will respond within 4 hours" is a service level,
 * and this company does not publish one it has not measured — the same
 * standing rule that keeps an uptime percentage off every other page on this
 * site. Do not tighten this language into commitments without Edgar's real
 * numbers behind them.
 *
 * ⚠ NO DESIGNATED DMCA AGENT IS NAMED, here or on /dmca-policy. §512(c)(2)
 * safe harbour requires an agent registered with the US Copyright Office — a
 * real launch task with a fee. Copyright notices route to the general abuse
 * address until that registration exists.
 */

const PATH = "/abuse-handling-policy";

export const metadata = pageMetadata({
  title: "Abuse Handling Policy | Serverlys",
  description:
    "What happens after you report abuse to Serverlys — who reads the report, how quickly, what action we can take, and what sits outside our reach.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "purpose",
    heading: "What this page is for",
    blocks: [
      {
        type: "p",
        text: "The acceptable use policy says what is not allowed on our platform. This one says what we actually do when somebody tells us it is happening — who reads the report, how fast, what we can act on, and where our reach ends.",
      },
      {
        type: "note",
        text: "To make a report, use the abuse form. You do not need to read this first, and nothing here is a precondition for us acting.",
      },
    ],
  },
  {
    id: "what-to-report",
    heading: "What we act on",
    blocks: [
      {
        type: "ul",
        items: [
          "Phishing pages and credential-harvesting sites.",
          "Malware hosting, exploit kits, and command-and-control endpoints.",
          "Spam originating from our network, and spam advertising a site we host.",
          "Copyright infringement — see the copyright and DMCA policy for the notice requirements, which are stricter and statutory.",
          "Child sexual abuse material, which is handled differently from everything else on this list. See below.",
          "Network attacks launched from our infrastructure, including scanning, brute force and denial of service.",
          "Fraudulent or impersonating sites.",
        ],
      },
    ],
  },
  {
    id: "csam",
    heading: "Child sexual abuse material",
    blocks: [
      {
        type: "p",
        text: "This is the one category with no assessment step and no waiting period. Content is removed immediately on credible report, the account is terminated, and the matter is referred to the appropriate authorities along with the material we are required to preserve.",
      },
      {
        type: "p",
        text: "There is no appeal queue for this and no customer-notification step that would give anyone an opportunity to destroy evidence. If you are reporting this, say so explicitly in the subject line so it is triaged correctly on arrival.",
      },
    ],
  },
  {
    id: "process",
    heading: "What happens to your report",
    blocks: [
      {
        type: "p",
        text: "In order, and with no stage that exists only to slow you down.",
      },
      {
        type: "ul",
        items: [
          "It reaches a person. Abuse reports are not answered by an automated triage bot that closes them for formatting.",
          "We verify. A report has to be reproducible against something we actually host before we can act on it, and the most common reason a report stalls is that the URL identifies a domain rather than the specific page.",
          "We assess severity. Active phishing and malware are dealt with ahead of everything else because every hour they stay up has victims in it.",
          "We act. Depending on what we find, that is a notice to the customer with a deadline, suspension of the specific content, or suspension of the account.",
          "We close the loop with you where you gave us a contact address and the matter is one we can discuss.",
        ],
      },
    ],
  },
  {
    id: "timing",
    heading: "How quickly",
    blocks: [
      {
        type: "p",
        text: "These are aims, and they are written as aims on purpose. We do not publish a response time as a guarantee unless there is a measured service level behind it, and for abuse handling there is not one yet.",
      },
      {
        type: "ul",
        items: [
          "Acknowledgement: we aim to confirm receipt within one business day.",
          "Active phishing or malware: we aim to assess the same day it is reported, including outside business hours where the report reaches us then.",
          "Everything else: we aim to reach a decision within a few business days, and to tell you if it is going to take longer than that.",
        ],
      },
      {
        type: "note",
        text: "If a report is urgent and has gone quiet, chase it and say it is urgent. We would rather be chased than have something live for a week because a message went astray.",
      },
    ],
  },
  {
    id: "customer",
    heading: "What we do with the customer",
    blocks: [
      {
        type: "p",
        text: "Most abuse we see is not malice. It is a compromised site — an out-of-date plugin, a stolen password, a contact form being used as a relay. The owner is usually the second victim, not the perpetrator, and treating them as a criminal on first contact gets the problem fixed more slowly rather than more quickly.",
      },
      {
        type: "ul",
        items: [
          "Where the content is live and dangerous, we suspend it first and explain afterwards. Nobody's clean-up window is worth somebody else's stolen credentials.",
          "Where it is a compromise, we tell the customer what we found, where it is, and what to do about it — then give them a deadline to act.",
          "Where the customer put it there deliberately, or ignores the deadline, the account is terminated. Accounts terminated for abuse are not refunded; that is stated in the refund policy too.",
          "A customer whose account is suspended is told why, and by a person.",
        ],
      },
    ],
  },
  {
    id: "limits",
    heading: "What we cannot do",
    blocks: [
      {
        type: "p",
        text: "Stated plainly, because the most frustrating abuse report is one that was never ours to action and nobody said so.",
      },
      {
        type: "ul",
        items: [
          "We cannot act on content we do not host. If a site merely uses our nameservers, sits behind a proxy in front of another host, or is hosted elsewhere entirely, the host of record is the one who can remove it. Tell us anyway and we will point you at the right party where we can identify them.",
          "We cannot adjudicate defamation, trademark disputes, contractual arguments, or who is telling the truth in a disagreement between two parties. Those need a court, and a hosting provider deciding them privately would be worse than useless.",
          "We cannot disclose a customer's identity or personal details to you. Requests of that kind go through the law enforcement and legal requests route, and that page sets out what we require first.",
          "We cannot give you a copy of our correspondence with the customer.",
        ],
      },
    ],
  },
  {
    id: "bad-faith",
    heading: "Reports made in bad faith",
    blocks: [
      {
        type: "p",
        text: "A takedown request is occasionally an attempt to silence a competitor or a critic rather than to stop abuse. We check, and a report that turns out to be a misuse of this process is closed with no action and recorded.",
      },
      {
        type: "p",
        text: "Where a copyright notice is involved, knowingly misrepresenting infringement carries liability for damages under 17 U.S.C. § 512(f). That is not a formality and we do not treat it as one.",
      },
    ],
  },
  {
    id: "contact",
    heading: "Reaching us",
    blocks: [
      {
        type: "p",
        text: `The abuse form is the fastest route and it reaches the same queue as ${emailDisplay}. Copyright notices have their own statutory requirements, which the copyright and DMCA policy sets out in full.`,
      },
    ],
  },
];

export default function AbuseHandlingPolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Abuse handling policy", path: PATH },
        ])}
      />
      <LegalPage
        path={PATH}
        title="Abuse handling policy"
        intro="What happens after you send us a report: who reads it, how fast we aim to move, what we do with the customer at the other end, and the things that are genuinely outside our reach."
        trail={[{ name: "Home", href: "/" }, { name: "Abuse handling policy" }]}
        sections={SECTIONS}
        contact="If you have reported something and it is still live, tell us again and say so. A second message about the same URL is not a nuisance — it is how we find out the first one went astray."
      />
    </>
  );
}
