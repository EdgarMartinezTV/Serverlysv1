import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { company, emailDisplay } from "@/data/company";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

/**
 * Law enforcement and legal requests policy.
 *
 * A hosting company holds other people's data, so it will eventually receive a
 * subpoena, a preservation request or an emergency disclosure request. Saying
 * in advance what we require and when we tell the customer is the difference
 * between a considered process and an improvised one.
 *
 * The notice-to-customer commitment is the load-bearing part. It is qualified
 * — a gag order or a genuine emergency overrides it — but it is a real default
 * and should not be watered down into "we may notify you", which promises
 * nothing.
 *
 * ⚠ Needs counsel review before launch, and the qualifications here are
 * jurisdiction-specific.
 */

const PATH = "/law-enforcement-requests";

export const metadata = pageMetadata({
  title: "Law Enforcement and Legal Requests | Serverlys",
  description:
    "How Serverlys handles subpoenas, court orders, preservation and emergency requests: what we require, what data we hold, and when we tell the customer.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "principles",
    heading: "How we approach these",
    blocks: [
      {
        type: "p",
        text: "We hold data that belongs to our customers. We disclose it when we are legally required to, and not because a request is forceful, urgent-sounding or on letterhead.",
      },
      {
        type: "p",
        text: "Every request is reviewed for validity and scope. We narrow requests that ask for more than the stated purpose supports, and we push back on ones that are overbroad or improperly served.",
      },
    ],
  },
  {
    id: "requirements",
    heading: "What we require",
    blocks: [
      {
        type: "ul",
        items: [
          "Valid legal process issued under the law of a jurisdiction that applies to us, and properly served.",
          "The identity of the requesting agency and a named, contactable officer or official.",
          "A specific identifier — a domain, an account email, an IP address with a timestamp and time zone. “All data relating to” a person is not an identifier we can act on.",
          "The date range being requested, and the statutory basis being relied on.",
        ],
      },
      {
        type: "p",
        text: "Requests from outside the jurisdiction in which we operate generally need to come through the relevant mutual legal assistance process or an equivalent recognised mechanism.",
      },
      {
        type: "note",
        text: "An email asking us to hand over customer data, without legal process behind it, is not a request we can act on however serious the underlying matter is. That protection is the reason it exists.",
      },
    ],
  },
  {
    id: "what-we-hold",
    heading: "What we actually hold",
    blocks: [
      {
        type: "p",
        text: "It is worth knowing before you ask. We typically hold:",
      },
      {
        type: "ul",
        items: [
          "Account and billing records — the name, contact details and payment history associated with an account. Card numbers are held by the payment processor, not by us.",
          "Server logs, including connection records, for the retention period applicable to the service.",
          "Customer content stored on the service — website files and databases — where the account is live.",
          "Backups, until they age out on the retention schedule for the plan.",
        ],
      },
      {
        type: "p",
        text: "We do not hold registrant data for a domain as the registry's record of it, and we do not hold the contents of encrypted data for which we have no key.",
      },
    ],
  },
  {
    id: "preservation",
    heading: "Preservation requests",
    blocks: [
      {
        type: "p",
        text: "We accept requests to preserve existing records pending legal process. Preservation freezes what already exists at the moment we act; it does not create data that was never collected, and it does not recover data that had already aged out.",
      },
      {
        type: "p",
        text: "Preservation is not disclosure. Preserved records are released only on valid legal process.",
      },
    ],
  },
  {
    id: "emergency",
    heading: "Emergency requests",
    blocks: [
      {
        type: "p",
        text: "Where there is a credible risk of death or serious physical harm to a person, we can act on an emergency request faster than normal process allows, and we will. Mark it clearly as an emergency, describe the nature of the risk, and give us a way to call you back.",
      },
      {
        type: "p",
        text: "We verify that requests of this kind come from the agency they claim to, because the emergency route is an obvious target for social engineering.",
      },
    ],
  },
  {
    id: "notice",
    heading: "Telling the customer",
    blocks: [
      {
        type: "p",
        text: "Our default is to notify the customer whose data has been requested, with enough detail and enough time for them to seek legal advice before we produce anything.",
      },
      {
        type: "p",
        text: "We will not give notice where a court order or statute forbids it, where there is a genuine risk to someone's life or safety, or where notice would be self-defeating because the account itself appears to be the source of ongoing harm. Where a non-disclosure obligation expires, we will notify the customer then.",
      },
      {
        type: "note",
        text: "This is a default we intend to keep, not a formality. A host that quietly hands over customer data and never mentions it is not one anyone should trust with theirs.",
      },
    ],
  },
  {
    id: "costs",
    heading: "Costs",
    blocks: [
      {
        type: "p",
        text: "Where the law permits, we may recover the reasonable cost of responding to a request that requires substantial work. We do not charge for routine preservation or for emergency requests.",
      },
    ],
  },
  {
    id: "how",
    heading: "How to send one",
    blocks: [
      {
        type: "p",
        text: "Send legal process to " + emailDisplay + " with “Legal request” in the subject line, addressed to " + company.legalName + ". Include a return email address and a direct telephone number — we frequently need to clarify scope before we can respond properly.",
      },
      {
        type: "p",
        text: "Abuse reports, phishing and malware complaints are not legal requests and are handled faster through the abuse report process. Copyright complaints follow the separate DMCA process.",
      },
    ],
  },
];

export default function LawEnforcementRequestsPage() {
  return (
    <>
      <LegalPage
        title="Law Enforcement and Legal Requests"
        intro="What we require before disclosing customer data, what records we actually hold, and when we tell the customer that someone has asked."
        path={PATH}
        sections={SECTIONS}
        trail={[{ name: "Home", href: "/" }, { name: "Law enforcement and legal requests" }]}
        contact="Legal process should be sent to the address above, marked “Legal request”. Abuse and copyright complaints have their own faster routes."
      />
      <PageBreadcrumbs trail={[
          { name: "Home", path: "/" },
          { name: "Law enforcement and legal requests", path: PATH },
        ]} />
    </>
  );
}
