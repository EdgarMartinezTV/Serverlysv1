import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import {
  CONVO_MONTHLY,
  HOSTING_MAX,
  HOSTING_MIN,
  PCT,
  TERMS,
} from "../affiliates/_content";

/**
 * Affiliate agreement — drafted 2026-10-25 for the program that went live in
 * WHMCS the same day.
 *
 * Every number comes from TERMS in app/affiliates/_content.ts, the same
 * source as the /affiliates page, and each one is enforced by WHMCS or by
 * billing/includes/hooks/serverlys_affiliates.php. A term here that WHMCS
 * does not enforce is a promise broken by default — change both together.
 *
 * Needs counsel review like every other document in the set (see the note in
 * components/legal/legal-page.tsx).
 */

const PATH = "/affiliate-agreement";

export const metadata = pageMetadata({
  title: "Affiliate Agreement | Serverlys",
  description:
    "The terms of the Serverlys affiliate program: how referrals are credited, what each product pays, when commissions are reversed, and how you may promote us.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "about",
    heading: "About this agreement",
    blocks: [
      {
        type: "p",
        text: "This agreement is between Serverlys, LLC (“Serverlys”, “we”) and you, the affiliate. You accept it when you switch on the affiliate program in your client area. It sits under our terms of service, which also apply to you as an account holder.",
      },
      {
        type: "p",
        text: "The /affiliates page summarises the program. Where that page and this agreement differ, this agreement wins.",
      },
    ],
  },
  {
    id: "joining",
    heading: "Joining",
    blocks: [
      {
        type: "ul",
        items: [
          "You need a Serverlys client account in good standing, with accurate contact and payment details.",
          "You must be at least 18 and able to enter into a contract where you live.",
          "Joining is free. We review new affiliates before the first payout and may decline or close an affiliate account that does not meet this agreement.",
        ],
      },
    ],
  },
  {
    id: "referrals",
    heading: "How a referral is credited",
    blocks: [
      {
        type: "p",
        text: `When someone clicks your affiliate link, our billing system stores a cookie in their browser for ${TERMS.cookieDays} days. If they order a service that pays commission within that time, using the same browser, the order is credited to you.`,
      },
      {
        type: "ul",
        items: [
          "The most recent affiliate link clicked wins. If the customer later clicks another affiliate's link, the order is credited to that affiliate.",
          "A click cannot be matched if the customer clears their cookies, blocks them, or orders on a different device or browser.",
          "You cannot earn commission on your own account, an account you control, or a business you own.",
          "Our billing records decide whether an order is credited. We will look into any order you believe was missed, but we cannot credit a click we have no record of.",
        ],
      },
    ],
  },
  {
    id: "commissions",
    heading: "What each product pays",
    blocks: [
      {
        type: "ul",
        items: [
          `Hosting (cloud, WordPress and ecommerce plans): ${PCT(TERMS.hostingFirstPayment)} of the customer's first invoice for the plan, including any setup fee. Paid once per new service. Today that is ${HOSTING_MIN} to ${HOSTING_MAX}, depending on the plan.`,
          `ConvoAI Pro: ${PCT(TERMS.convoShare)} of each payment for the service, for the first ${TERMS.convoMonths} payments. At today's price that is ${CONVO_MONTHLY} per payment.`,
          "Every other product and service pays no commission through the program.",
        ],
      },
      {
        type: "p",
        text: "Commission is calculated on what the customer actually pays for the service, after any discount or promotional code, and not on taxes. A service that is never paid earns nothing.",
      },
      {
        type: "note",
        text: "Website design, development and voice agent projects are outside the program. If you introduce one, tell us before the scope is signed; any referral fee is agreed in writing for that project alone.",
      },
    ],
  },
  {
    id: "hold",
    heading: "The hold period and reversals",
    blocks: [
      {
        type: "p",
        text: `Every commission is held for ${TERMS.holdDays} days from the payment it was earned on, to match our 30-day money-back guarantee. It then becomes available in your balance.`,
      },
      {
        type: "p",
        text: "During the hold, a commission is cancelled if the payment is refunded, charged back, cancelled, or found to be fraudulent. After the hold it is yours, unless we later find it was obtained in breach of this agreement, in which case we may reverse it or deduct it from future commissions.",
      },
    ],
  },
  {
    id: "payment",
    heading: "Getting paid",
    blocks: [
      {
        type: "ul",
        items: [
          `Once your available balance reaches $${TERMS.minPayout}, request a payout from your affiliate dashboard.`,
          "We pay requests once a month, either as credit on your Serverlys account or in money to your PayPal or bank account. You choose; credit is applied immediately.",
          `A balance under $${TERMS.minPayout} carries over. It does not expire while your affiliate account is open.`,
          "Fees your bank or PayPal charge to receive the money are yours.",
        ],
      },
    ],
  },
  {
    id: "taxes",
    heading: "Taxes",
    blocks: [
      {
        type: "p",
        text: "Commissions are income to you, and you are responsible for any tax on them. Before your first payout in money, we will ask US affiliates for a Form W-9 and affiliates elsewhere for a Form W-8BEN, and we file the information returns US law requires. We do not pay out in money until we have the form.",
      },
    ],
  },
  {
    id: "promotion",
    heading: "How you may promote us",
    blocks: [
      {
        type: "p",
        text: "Recommend us the way you would want to be recommended to. In particular:",
      },
      {
        type: "ul",
        items: [
          "Say that it is an affiliate link, clearly and close to the link, every time. US law (the FTC's endorsement rules) requires this, and so do we.",
          "Describe Serverlys accurately. Use the prices, features and guarantees we publish, and do not promise anything we do not offer.",
          "Do not bid on “Serverlys”, ConvoAI, CallFlow or misspellings of them in search or social ads, or use them in domain names, app names or social account names.",
          "Do not present yourself as Serverlys or as speaking for us.",
          "No spam: no unsolicited email, texts or messages, and follow the anti-spam laws where you and your audience are.",
          "No cookie stuffing, forced or hidden clicks, pop-unders, or paying or rewarding people to click your link.",
          "Do not promote us on sites or channels that our acceptable use policy would not allow us to host.",
        ],
      },
    ],
  },
  {
    id: "brand",
    heading: "Using our name and logo",
    blocks: [
      {
        type: "p",
        text: "While your affiliate account is open, you may use the Serverlys name and the logos and banners we provide to promote the program, without changing them. This permission ends when the account closes, and we may withdraw it for a particular use at any time.",
      },
    ],
  },
  {
    id: "relationship",
    heading: "Our relationship",
    blocks: [
      {
        type: "p",
        text: "You are an independent affiliate, not our employee, agent or partner. You cannot make commitments on our behalf, and nothing in this agreement gives you exclusivity.",
      },
    ],
  },
  {
    id: "changes",
    heading: "Changes and ending",
    blocks: [
      {
        type: "ul",
        items: [
          "We may change this agreement or the commission rates. We email you at least 30 days before a change takes effect, and a change never reduces a commission already earned.",
          "You may leave at any time by closing your affiliate account. We pay any available balance at or above the minimum in the next monthly run.",
          "We may close an affiliate account on notice. If we close it because you breached this agreement, commissions still in their hold and commissions linked to the breach are forfeited.",
          "If we end the program, we give at least 30 days' notice and pay every commission that clears.",
        ],
      },
    ],
  },
  {
    id: "law",
    heading: "Liability and governing law",
    blocks: [
      {
        type: "p",
        text: "The limits of liability, governing law and dispute terms in our terms of service apply to this agreement. Our total liability to you under this agreement will not exceed the commissions paid or owed to you in the 12 months before the claim.",
      },
    ],
  },
];

export default function AffiliateAgreementPage() {
  return (
    <>
      <LegalPage
        title="Affiliate agreement"
        intro="The terms of the Serverlys affiliate program: how referrals are credited, what each product pays, when commissions are reversed, and how you may promote us."
        path={PATH}
        trail={[{ name: "Home", href: "/" }, { name: "Affiliate agreement" }]}
        sections={SECTIONS}
        contact="Questions about a commission or a payout? Open a ticket with the billing team from your client area and include the order or invoice number."
      />
      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Affiliate agreement", path: PATH },
        ]}
      />
    </>
  );
}
