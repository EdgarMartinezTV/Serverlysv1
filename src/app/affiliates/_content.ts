import type { Faq } from "@/data/faqs";
import { planGroups } from "@/data/pricing";

/**
 * /affiliates — the program's terms in ONE place, so the page, the FAQ and the
 * worked example can never disagree.
 *
 * CONFIRMED by Edgar and LIVE in WHMCS 2026-10-25: module on, payout $50,
 * 30-day delay, hosting products 1,2,4,5,9-16 at 100% one-time, ConvoAI Pro
 * (#39) at 20% recurring. WHMCS cannot cap a recurring commission, so the
 * 12-payment limit (and the self-referral block) is the hook
 * billing/includes/hooks/serverlys_affiliates.php. The 90-day cookie is
 * WHMCS's own (WHMCSAffiliateID, Max-Age 7776000, path=/). Change a rate in
 * WHMCS and HERE together. The route stays noindex until the affiliate
 * agreement is published (see data/routes.ts).
 *
 * The rule for this file: every number must be one WHMCS actually enforces.
 * A rate printed here that WHMCS does not pay is a promise we break by default.
 */
export const TERMS = {
  /** Hosting: one-time, as a fraction of the referred customer's first payment. */
  hostingFirstPayment: 1,
  /** ConvoAI Pro: recurring, as a fraction of each payment, for `convoMonths`. */
  convoShare: 0.2,
  convoMonths: 12,
  /**
   * ConvoAI Pro's monthly price — WHMCS product #39 (store group #12). Not in
   * data/pricing.ts because that file is hosting only.
   */
  convoPrice: 49,
  /** Days a commission is held before it can be paid. Matches the 30-day refund window. */
  holdDays: 30,
  /** Minimum available balance before a payout can be requested. */
  minPayout: 50,
  /** How long a click is remembered. */
  cookieDays: 90,
} as const;

const usd = (n: number) => `$${n % 1 === 0 ? n : n.toFixed(2)}`;

/* WHMCS pays the percentage on the whole first invoice, setup fee included
   (verified by a live test order 2026-10-25: Starter Cloud paid $10.90). */
const firstPayments = planGroups.flatMap((g) =>
  g.plans.map((p) => p.monthly + (p.setupFee ?? 0)),
);
export const HOSTING_MIN = usd(Math.min(...firstPayments) * TERMS.hostingFirstPayment);
export const HOSTING_MAX = usd(Math.max(...firstPayments) * TERMS.hostingFirstPayment);
export const CONVO_MONTHLY = usd(TERMS.convoPrice * TERMS.convoShare);
export const CONVO_TOTAL = usd(TERMS.convoPrice * TERMS.convoShare * TERMS.convoMonths);
export const PCT = (f: number) => `${Math.round(f * 100)}%`;

export const STEPS = [
  {
    title: "Join with your Serverlys account",
    body: "Sign in to the client area, or create a free account, and switch on the affiliate program. There is nothing to pay and no target to hit.",
  },
  {
    title: "Share your link",
    body: `You get a personal link. Anyone who clicks it is remembered for ${TERMS.cookieDays} days, so they can come back and buy later and the sale is still yours.`,
  },
  {
    title: "They become a customer",
    body: `When they pay, the commission appears in your dashboard straight away and is held for ${TERMS.holdDays} days, the length of our money-back guarantee.`,
  },
  {
    title: "You get paid",
    body: `Once your balance passes ${usd(TERMS.minPayout)}, request a payout. We pay monthly, as Serverlys account credit or to your PayPal or bank.`,
  },
] as const;

export const USES = [
  {
    title: "Web designers and developers",
    body: "You build the site; somebody has to host it. Recommend hosting you trust, keep your client on a platform you know, and earn on the setup you were doing anyway.",
    src: "/mock/biz-designer.jpg",
    alt: "A designer on the phone at her laptop in her studio",
    position: "50% 35%",
  },
  {
    title: "Consultants and marketers",
    body: "When a client asks how to answer customers after hours, ConvoAI is a recommendation that keeps paying: a share of every month they stay, for a full year.",
    src: "/mock/biz-deal.jpg",
    alt: "Two people looking at a laptop together at a front desk",
    position: "50% 40%",
  },
  {
    title: "Happy customers",
    body: "Already on Serverlys? Your link is in your client area. Send it to the friend who keeps complaining about their host and take your commission as credit on your own bill.",
    src: "/mock/care-laptop.jpg",
    alt: "A man smiling at his laptop in an armchair",
    position: "50% 30%",
  },
] as const;

export const PROMISES = [
  {
    title: "Every number is on this page",
    body: "Rates, hold period, minimum payout and cookie length are written here and enforced by our billing system. No tier you have to unlock.",
  },
  {
    title: "Your dashboard is live",
    body: "Clicks, sign-ups, pending and available commission, and every payout, in your client area. Nothing to request by email.",
  },
  {
    title: "Refunds are the only clawback",
    body: `A commission is only reversed if the customer is refunded or charges back inside the ${TERMS.holdDays}-day hold. After that it is yours.`,
  },
] as const;

const QA: readonly Omit<Faq, "scopes">[] = [
  {
    question: "Who can join?",
    answer:
      "Anyone with a Serverlys client account, customer or not. We review new affiliates before the first payout, mainly to stop people referring themselves.",
  },
  {
    question: "How much do I earn?",
    answer: `${PCT(TERMS.hostingFirstPayment)} of the first payment on any hosting plan, which is ${HOSTING_MIN} to ${HOSTING_MAX} per customer. On ConvoAI Pro, ${PCT(TERMS.convoShare)} of every payment for the customer's first ${TERMS.convoMonths} months: ${CONVO_MONTHLY} a month, up to ${CONVO_TOTAL} per customer.`,
  },
  {
    question: "When and how do I get paid?",
    answer: `Commissions are held for ${TERMS.holdDays} days. Once your available balance is ${usd(TERMS.minPayout)} or more, request a payout from your dashboard and we pay it in the next monthly run, as account credit or to your PayPal or bank account.`,
  },
  {
    question: "How long does my link remember someone?",
    answer: `${TERMS.cookieDays} days on the same browser. If they clear their cookies or buy on another device, the click cannot be matched, which is true of every affiliate program.`,
  },
  {
    question: "Can I refer myself or my own business?",
    answer:
      "No. Orders where the affiliate and the customer are the same person or business do not earn commission.",
  },
  {
    question: "Can I run ads on the Serverlys name?",
    answer:
      "Not on search ads that bid on “Serverlys” or misspellings of it. Reviews, tutorials, newsletters, social posts and your own site are all fine, as long as you say it is an affiliate link.",
  },
  {
    question: "What about website design, development or voice agents?",
    answer:
      "Those are scoped projects rather than store products, so they are not in the automatic program. If you send us one, tell us before the scope is signed and we agree a referral fee in writing.",
  },
];

export const FAQS: readonly Faq[] = QA.map((f) => ({ ...f, scopes: ["/affiliates"] }));
