import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { t as tx } from "@/i18n/t";

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
    heading: "Hosting, email and ConvoAI Pro: 30 days",
    blocks: [
      {
        type: "p",
        text: "Every Serverlys hosting plan — Cloud, WordPress, WooCommerce and Contractor Website plans — and every Email Solutions plan carries a 30-day money-back guarantee from the date of your first payment. So does a ConvoAI Pro subscription. If the service does not suit you, ask within 30 days and we refund what you paid for it. You do not have to give a reason, and we will not put you through a retention script.",
      },
      {
        type: "p",
        text: "This applies to your first term on a plan. It is a guarantee that you can try the service, not a rolling right to a refund at any point in a multi-year term. Renewal payments are not covered.",
      },
      {
        type: "p",
        text: "If your plan came with a free domain, the domain’s regular registration price is deducted from the refund, because the registry fee for it has already been paid. The domain stays registered in your name and is yours to keep, renew or transfer.",
      },
      {
        type: "note",
        text: "If you cancel after the 30 days, the service runs to the end of the term you paid for, and the unused part of the term is not refunded. It does not stop the day you cancel — you keep what you bought.",
      },
    ],
  },
  {
    id: "domains",
    heading: "Domains are different, and here is why",
    blocks: [
      {
        type: "p",
        text: "Domain registrations, renewals and transfers are not refundable once processed. This is not a policy we chose to be difficult — the registration fee goes to the registry that runs the extension the moment the name is registered. Refunding you would mean paying that fee ourselves for a name you now own.",
      },
      {
        type: "ul",
        items: [
          "Check the spelling before you confirm. A typo in a domain is a purchase, not a mistake we can undo.",
          "Premium and aftermarket names are labelled as premium before checkout and are likewise final.",
          "If a registration fails at the registry and you were charged, that is our error. We refund it in full or, if you prefer, register an alternative domain of equal or lower price for you instead. The choice is yours.",
        ],
      },
    ],
  },
  {
    id: "monthly-services",
    heading: "SEO, social media and ServerCare plans",
    blocks: [
      {
        type: "p",
        text: "SEO Services, Social Media Management and ServerCare maintenance plans are services we carry out for you each billing period. If you cancel before we start work on your first period, we refund that payment in full.",
      },
      {
        type: "p",
        text: "Once work on a billing period has started, that period is not refundable, because the time has already been spent on your account. You can cancel at any time, and cancelling stops the next charge.",
      },
    ],
  },
  {
    id: "services",
    heading: "Website design and project work",
    blocks: [
      {
        type: "p",
        text: "Website Design packages: if you cancel before we deliver the first design draft, we refund the package in full. Once the first draft has been delivered, the package is not refundable, and everything delivered up to that point is yours to keep.",
      },
      {
        type: "p",
        text: "Custom projects quoted separately are billed against stages agreed in advance. Work already delivered is not refundable, because it exists and it is yours — but you are never billed for a stage that has not started.",
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
          "We confirm and process it back to the original payment method within 5 business days.",
        ],
      },
      {
        type: "p",
        text: "The time it takes to appear after that depends on your bank, card issuer or PayPal rather than on us — typically a few working days.",
      },
      {
        type: "p",
        text: "Please ask us before disputing a payment with your bank. A refund through us is faster, and a chargeback can lead to the service being suspended while it is open, as the terms of service explain.",
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
        text: "Outside those three, if you ask within 30 days on a plan the guarantee covers, you get your money back.",
      },
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <>
      <LegalPage
        title={tx("Refund policy")}
        intro={tx("30 days on hosting, email and ConvoAI Pro, no questions. Domains are not refundable, and this page explains exactly why rather than burying it in a clause.")}
        path={PATH}
        trail={[{ name: "Home", href: "/" }, { name: "Refund policy" }]}
        sections={tx(SECTIONS)}
        contact={tx("If you think a refund is due and something here says otherwise, write to us anyway. Policies have edge cases and people are better at those than documents.")}
      />
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Refund policy", path: PATH }]} />
    </>
  );
}
