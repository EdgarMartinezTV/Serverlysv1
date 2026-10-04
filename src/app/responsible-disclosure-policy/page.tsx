import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";
import { company, emailDisplay } from "@/data/company";

/**
 * Responsible disclosure policy.
 *
 * ⚠ NO BUG BOUNTY IS ADVERTISED, and that omission is deliberate.
 *
 * The reference pairs its disclosure policy with a paid reward program. Ours
 * says in plain words that there is no cash reward, because a researcher who
 * spends a weekend on our infrastructure expecting a payout that does not
 * exist has been misled by the omission just as effectively as by a false
 * promise. If a reward program is funded later, say so here — do not imply one
 * in the meantime with phrases like "we may offer a token of appreciation".
 *
 * The safe-harbour undertaking in `safe-harbour` is a real commitment not to
 * pursue civil or criminal action against a researcher who stays inside the
 * stated scope. It is the reason a policy like this works at all, and it
 * should not be weakened into "we will consider" language without counsel
 * actually asking for that.
 *
 * Scope deliberately EXCLUDES customer sites. We do not have standing to
 * authorise testing against property that belongs to a customer, so we cannot
 * grant permission we do not hold.
 */

const PATH = "/responsible-disclosure-policy";

export const metadata = pageMetadata({
  title: "Responsible Disclosure Policy | Serverlys",
  description:
    "How to report a security vulnerability to Serverlys: what is in scope, what is not, how we respond, and our undertaking not to pursue researchers who follow this policy.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "principle",
    heading: "The short version",
    blocks: [
      {
        type: "p",
        text: "If you have found a security flaw in something Serverlys runs, tell us and we will fix it. We will not threaten you for looking, provided you stayed inside the scope below and did not use what you found against anyone.",
      },
      {
        type: "note",
        text: "There is no cash reward programme. We would rather say that up front than let you spend a weekend on our infrastructure expecting a payout that does not exist. We credit researchers who ask to be credited, and that is what we currently have to offer.",
      },
    ],
  },
  {
    id: "how",
    heading: "How to report",
    blocks: [
      {
        type: "p",
        text: `Email ${emailDisplay} with "Security" in the subject line. It reaches a person, not an autoresponder queue.`,
      },
      {
        type: "p",
        text: "A report we can act on quickly contains all of the following. A report missing them is not rejected, but it will take longer while we ask.",
      },
      {
        type: "ul",
        items: [
          "The affected host, URL or endpoint — specific enough for us to reproduce it.",
          "What the flaw is, and what an attacker could actually do with it.",
          "The steps to reproduce, in order. A proof-of-concept request or short script is ideal.",
          "Anything about the conditions that matter: an account role, a browser, a timing window.",
          "How you would like to be credited, or that you would prefer not to be.",
        ],
      },
      {
        type: "p",
        text: "Send it in plain text or as an attachment. Do not post it publicly, and do not file it as a normal support ticket — a support agent is not the right first reader for an unpatched vulnerability.",
      },
    ],
  },
  {
    id: "scope",
    heading: "What is in scope",
    blocks: [
      {
        type: "ul",
        items: [
          `${company.domain} and its subdomains operated by us.`,
          "The client area and billing system.",
          "The hosting control panel and the APIs this site calls.",
          "The ConvoAI and CallFlow services as we operate them.",
        ],
      },
      {
        type: "p",
        text: "In scope means we are asking you to look, and the undertaking below applies to what you find there.",
      },
    ],
  },
  {
    id: "out-of-scope",
    heading: "What is out of scope",
    blocks: [
      {
        type: "p",
        text: "Two of these are exclusions of substance rather than housekeeping, so they come first.",
      },
      {
        type: "ul",
        items: [
          "WEBSITES BELONGING TO OUR CUSTOMERS, including anything hosted on our platform that is not ours. We cannot authorise testing against property we do not own, so we do not. Testing a customer's site without their permission is unlawful and nothing on this page changes that.",
          "THIRD-PARTY SERVICES we merely use — the payment provider, the registry, the model vendors behind ConvoAI. Report those to their own programmes; we will help you find the right contact if you ask.",
          "Denial of service, load testing, and anything else whose method is to degrade the service for other people.",
          "Social engineering of our staff, customers or suppliers, and physical access attempts.",
          "Automated scanner output submitted without a demonstrated impact. A report that a header is missing, with no exploitation path, is a finding we already have.",
          "Issues that require an already-compromised device, a rooted browser, or physical possession of a logged-in machine.",
          "Missing best-practice hardening with no exploitable consequence — SPF or DMARC opinions, TLS cipher preferences, version banners.",
        ],
      },
    ],
  },
  {
    id: "rules",
    heading: "What we ask of you",
    blocks: [
      {
        type: "ul",
        items: [
          "Use only your own test accounts and your own data. If a flaw exposes someone else's, stop immediately and tell us what you saw.",
          "Access the minimum needed to demonstrate the issue. Proving you can read one record is a proof of concept; downloading the table is not.",
          "Do not modify, delete or exfiltrate data that is not yours, and do not pivot further into our systems once you have shown the way in.",
          "Do not degrade the service for anyone else.",
          "Give us a reasonable opportunity to fix the issue before you publish. Ninety days is our normal expectation, and we will tell you if something genuinely needs longer.",
        ],
      },
    ],
  },
  {
    id: "response",
    heading: "What we will do",
    blocks: [
      {
        type: "ul",
        items: [
          "Acknowledge your report, to a person rather than an automated reply.",
          "Tell you whether we have reproduced it, and if not, exactly where we got stuck.",
          "Give you our assessment of severity and a realistic sense of the fix timeline — including when that timeline is longer than you would like, and why.",
          "Tell you when it is fixed, and credit you if you asked to be credited.",
        ],
      },
      {
        type: "p",
        text: "We will not argue you down on severity to avoid acting, and we will not go quiet on you. If a report goes more than a fortnight without a substantive update from us, chase it and treat the silence as our failure, not yours.",
      },
    ],
  },
  {
    id: "safe-harbour",
    heading: "Our undertaking to you",
    blocks: [
      {
        type: "p",
        text: "Where you have made a good-faith effort to follow this policy and stayed inside the scope above, Serverlys will not initiate or support civil or criminal action against you in connection with your research, and will not ask your employer or your hosting provider to act against you.",
      },
      {
        type: "p",
        text: "We will treat your activity as authorised for the purposes of any computer-misuse law that turns on authorisation, and we will say so in writing if a third party asks us.",
      },
      {
        type: "note",
        text: "This undertaking is ours to give and it stops at our own property. It cannot protect you in respect of a customer's site, a third-party service, or anything in the out-of-scope list — no undertaking from us can, because those are not ours to authorise.",
      },
      {
        type: "p",
        text: "If you are unsure whether something is in scope, ask before you test. We would far rather answer that question than have a conversation about it afterwards.",
      },
    ],
  },
];

export default function ResponsibleDisclosurePolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Responsible disclosure policy", path: PATH },
        ])}
      />
      <LegalPage
        path={PATH}
        title="Responsible disclosure policy"
        intro="How to report a vulnerability, what we are asking you to look at, and our written undertaking not to come after you for looking. There is no cash reward programme, and this page says so rather than leaving you to find out."
        trail={[{ name: "Home", href: "/" }, { name: "Responsible disclosure policy" }]}
        sections={SECTIONS}
        contact="If you are partway through a test and something looks like it is heading out of scope, stop and write to us. Asking is always the right call and it has never gone badly for anyone who did."
      />
    </>
  );
}
