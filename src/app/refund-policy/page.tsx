import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

const PATH = "/refund-policy";

export const metadata = pageMetadata({
  title: "Refund Policy — 30 days on hosting | Serverlys",
  description:
    "30-day money-back guarantee on hosting plans, why domain registrations are not refundable, and exactly how to request a refund.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "hosting",
    heading: "Hosting plans: 30 days",
    blocks: [
      {
        type: "p",
        text: "Every Serverlys hosting plan carries a 30-day money-back guarantee from the date of your first payment. If the platform does not suit you, ask within 30 days and we refund what you paid for the hosting. You do not have to give a reason, and we will not put you through a retention script.",
      },
      {
        type: "p",
        text: "This applies to your first term on a plan. It is a guarantee that you can try the service, not a rolling right to a refund at any point in a multi-year term.",
      },
      {
        type: "note",
        text: "If you cancel after the 30 days, the service runs to the end of the term you paid for. It does not stop the day you cancel — you keep what you bought.",
      },
    ],
  },
  {
    id: "domains",
    heading: "Domains are different, and here is why",
    blocks: [
      {
        type: "p",
        text: "Domain registrations, renewals and transfers are not refundable once processed. This is not a policy we chose to be difficult — when you register a domain, the registry fee is paid immediately and is not returned to us. Refunding you would mean paying the registry fee ourselves for a name you now own.",
      },
      {
        type: "p",
        text: "Every registrar operates this way. Any that appears not to is either absorbing the loss or has not told you the whole story.",
      },
      {
        type: "ul",
        items: [
          "Check the spelling before you confirm. A typo in a domain is a purchase, not a mistake we can undo.",
          "Premium and aftermarket names are labelled as premium before checkout and are likewise final.",
          "If a registration genuinely fails at the registry and you were charged, that is our error and we refund it in full.",
        ],
      },
    ],
  },
  {
    id: "services",
    heading: "Design, development and AI work",
    blocks: [
      {
        type: "p",
        text: "Project work is billed against stages agreed in advance. Work already delivered is not refundable, because it exists and it is yours — but you are never billed for a stage that has not started.",
      },
      {
        type: "p",
        text: "If you stop a project partway, you pay for the stages completed and you keep what they produced: the scope document, the designs, the code. We do not withhold deliverables you have paid for.",
      },
    ],
  },
  {
    id: "how",
    heading: "How to request a refund",
    blocks: [
      {
        type: "ul",
        items: [
          "Open a ticket from your client area, or email us from the address on the account.",
          "Tell us which service. You do not need to explain why.",
          "We confirm and process it back to the original payment method.",
        ],
      },
      {
        type: "p",
        text: "The time it takes to appear depends on your bank or card issuer rather than on us — typically a few working days once processed.",
      },
    ],
  },
  {
    id: "exceptions",
    heading: "The exceptions, stated plainly",
    blocks: [
      {
        type: "p",
        text: "A refund policy that lists no exceptions is hiding them. Ours are these.",
      },
      {
        type: "ul",
        items: [
          "Accounts terminated for breaching the acceptable use terms are not refunded.",
          "Fees paid to third parties on your behalf — registry fees, premium domain costs, paid third-party licences — are not refundable, because we do not get them back either.",
          "Repeated sign-up and refund cycles on the same service are treated as abuse of the guarantee.",
        ],
      },
      {
        type: "p",
        text: "Outside those three, if you ask within 30 days on a hosting plan, you get your money back.",
      },
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <>
      <LegalPage
        title="Refund policy"
        intro="30 days on hosting, no questions. Domains are not refundable, and this page explains exactly why rather than burying it in a clause."
        path={PATH}
        trail={[{ name: "Home", href: "/" }, { name: "Refund policy" }]}
        sections={SECTIONS}
        contact="If you think a refund is due and something here says otherwise, write to us anyway. Policies have edge cases and people are better at those than documents."
      />
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Refund policy", path: PATH }]} />
    </>
  );
}
