import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { emailDisplay } from "@/data/company";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

/**
 * Domain registration agreement.
 *
 * This is the document that closes the gap Hostinger fills with an "NPRD
 * request policy" — the published route for a third party to ask for registrant
 * data that WHOIS privacy has redacted.
 *
 * ⚠ WE DO NOT PUBLISH AN NPRD POLICY OF OUR OWN, DELIBERATELY. The obligation
 * to operate one under ICANN policy sits with the REGISTRAR OF RECORD. The
 * terms of service already state our position — "we act as your registrar or
 * through a registrar partner" — and publishing our own disclosure policy
 * would assert we are the accredited registrar and can release registrant
 * data. If Serverlys is a reseller that is not true, and it would misdirect
 * statutory requests away from the party that must answer them.
 *
 * So this page does the honest version: it says privacy is on, says who holds
 * the underlying record, and routes requests to the registrar of record via us.
 *
 * ⚠ NAME THE REGISTRAR PARTNER HERE ONCE IT IS CONFIRMED. The "requests" section
 * is written to work either way, but a reader with a legitimate legal request
 * is better served by being sent straight to the right party. That is the one
 * outstanding fact on this page.
 */

const PATH = "/domain-registration-agreement";

export const metadata = pageMetadata({
  title: "Domain Registration Agreement | Serverlys",
  description:
    "Terms for domains registered, renewed or transferred through Serverlys: registrant obligations, free WHOIS privacy, disputes, expiry and data requests.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "parties",
    heading: "Who holds the domain",
    blocks: [
      {
        type: "p",
        text: "When we register a domain for you, you become the registrant. You own it — not us. We act as your registrar or through a registrar partner, and the registry that operates the extension holds the authoritative record.",
      },
      {
        type: "p",
        text: "ICANN policy and the rules of the relevant registry apply to every registration, and they take precedence over these terms wherever the two conflict. That is not a disclaimer we chose; it is a condition of the domain existing at all.",
      },
    ],
  },
  {
    id: "obligations",
    heading: "Your obligations as registrant",
    blocks: [
      {
        type: "ul",
        items: [
          "Keep your registrant contact details accurate and current. ICANN requires this, and inaccurate or unresponsive contact details can result in suspension of the domain.",
          "Respond to verification emails. Some registries require the registrant email to be verified, and an unverified address can take the domain offline regardless of what you paid.",
          "Do not register a name you know infringes someone else's trademark or other rights.",
          "Do not use a domain for phishing, malware distribution or fraud. That breaches the acceptable use policy as well as these terms.",
        ],
      },
      {
        type: "note",
        text: "The single most common way people lose a domain is an unmonitored registrant email address. If you change it, change it here too.",
      },
    ],
  },
  {
    id: "privacy",
    heading: "WHOIS privacy",
    blocks: [
      {
        type: "p",
        text: "WHOIS privacy is included free on every domain we register, and it is on by default. It is not an upsell and there is no tier where you have to pay to keep your home address out of a public database.",
      },
      {
        type: "p",
        text: "With privacy enabled, public WHOIS and RDAP records show a proxy contact instead of your details. The underlying registrant data still exists — it is held by the registrar of record and the registry, because registration is not possible without it.",
      },
      {
        type: "p",
        text: "Privacy is not anonymity. The sections below set out who can still reach the underlying data and how.",
      },
    ],
  },
  {
    id: "data-requests",
    heading: "Requests for non-public registrant data",
    blocks: [
      {
        type: "p",
        text: "Third parties with a legitimate interest — rights holders, law enforcement, and parties to a domain dispute — can request access to registrant data that has been redacted from the public record. That request is decided by the registrar of record under ICANN policy and applicable data protection law, balancing the requester's interest against the registrant's privacy rights.",
      },
      {
        type: "p",
        text: "Send such a request to " + emailDisplay + ", marked “Registrant data request”. Tell us the domain, who you are, the legal basis you are relying on, and what you intend to use the data for. We will route it to the registrar of record for that domain and tell you where it went.",
      },
      {
        type: "ul",
        items: [
          "A request without a stated legal basis is not actionable and will not be forwarded.",
          "We do not disclose registrant data ourselves in response to an informal request. Disclosure is the registrar of record's decision.",
          "Where the law allows it, we notify the registrant that a request concerning their domain has been made.",
        ],
      },
      {
        type: "note",
        text: "Requests from law enforcement follow the process in our law enforcement and legal requests policy, which sets out what we require and when we notify the customer.",
      },
    ],
  },
  {
    id: "disputes",
    heading: "Disputes over a name",
    blocks: [
      {
        type: "p",
        text: "Domain disputes are decided under the Uniform Domain-Name Dispute-Resolution Policy (UDRP) and, for some extensions, the Uniform Rapid Suspension system. By registering a domain you agree to be bound by those procedures.",
      },
      {
        type: "p",
        text: "We are not the decision-maker in a dispute and we do not take sides. We comply with the outcome of a properly conducted proceeding, and we will lock a domain where the procedure requires it.",
      },
    ],
  },
  {
    id: "renewal",
    heading: "Renewal, expiry and recovery",
    blocks: [
      {
        type: "p",
        text: "Domains renew on their expiry date, not on your hosting cycle. We send renewal reminders to the account email before expiry.",
      },
      {
        type: "ul",
        items: [
          "After expiry a domain normally enters a grace period during which you can still renew at the standard price.",
          "After the grace period it may enter a redemption period, where recovery is possible but the registry charges a substantial redemption fee that we pass on at cost.",
          "After redemption the name is released and anyone can register it. At that point it is gone, and no amount of escalation brings it back.",
        ],
      },
      {
        type: "note",
        text: "These periods are set by the registry for each extension, not by us, and they differ between extensions. Do not rely on a grace period you have not checked.",
      },
    ],
  },
  {
    id: "transfers",
    heading: "Transferring away",
    blocks: [
      {
        type: "p",
        text: "You can transfer a domain to another provider. We will not obstruct it, charge an exit fee, or make you ask twice.",
      },
      {
        type: "ul",
        items: [
          "You will need the authorisation code, which we provide on request to the registrant.",
          "The domain must be unlocked, and must not have been registered or transferred within the previous sixty days — that lock is an ICANN rule, not ours.",
          "A transfer normally adds a year to the registration.",
        ],
      },
    ],
  },
  {
    id: "fees",
    heading: "Fees and refunds",
    blocks: [
      {
        type: "p",
        text: "Domain registrations, renewals and transfers are not refundable once processed. The registry fee is paid the moment a name is registered and is not returned to us, so refunding it would mean paying for a name you now own.",
      },
      {
        type: "p",
        text: "The 30-day money-back guarantee covers hosting plans. It has never covered domains, and the refund policy says so in the same words.",
      },
    ],
  },
];

export default function DomainRegistrationAgreementPage() {
  return (
    <>
      <LegalPage
        title="Domain Registration Agreement"
        intro="The terms that apply to every domain registered, renewed or transferred through Serverlys — including WHOIS privacy and how requests for registrant data are handled."
        path={PATH}
        sections={SECTIONS}
        trail={[{ name: "Home", href: "/" }, { name: "Domain registration agreement" }]}
        contact="Questions about a domain you hold with us, or a registrant data request? Write to the address above and mark it clearly so it reaches the right team."
      />
      <PageBreadcrumbs trail={[
          { name: "Home", path: "/" },
          { name: "Domain registration agreement", path: PATH },
        ]} />
    </>
  );
}
