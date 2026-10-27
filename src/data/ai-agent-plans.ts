import { billing } from "./company";

/**
 * AI agent plans: ConvoAI (chat) and CallFlow (voice). Rendered on
 * /ai-agents (plan cards, Offer schema, the pricing FAQ) and /llms.txt.
 *
 * SOURCES, as of 2026-10-26:
 *   · Prices: the live WHMCS store (Edgar, 2026-10-26). ConvoAI Essentials
 *     $0 (given to every hosting order by the WHMCS hook
 *     convoai_hosting_bundle.php), ConvoAI Pro $49/month or $468/year,
 *     ConvoAI Enterprise a hidden product, custom-priced.
 *   · Tier contents: https://convoai.cloud/pricing, in its own words, and
 *     https://convoai.cloud/faq ("Pro is $49 per month", WhatsApp "included
 *     from the Pro plan"). The pricing page and the store agree on $49.
 *   · CallFlow: https://callflow.serverlys.com/ publishes NO price. Its FAQ
 *     says "Pricing is usage-based and tailored to your needs", so it is
 *     shown as quoted and never given a figure or an Offer.
 *
 * ⚠ Never write "Free" for Essentials — Edgar's rule for the plan's name
 * (see the INCLUDES note in pricing.ts). Show "$0" and "included with
 * hosting" instead, even though convoai.cloud itself labels it Free.
 *
 * ⚠ Features are what the live product pages list, nothing more. If a page
 * drops a line, drop it here. In particular: the live pages describe training
 * as giving the agent your content (quick answers; documents via the Pro
 * knowledge base). They do not claim the agent crawls a website URL, so this
 * site does not either.
 */

export type AiAgentPlan = {
  id: "essentials" | "pro" | "enterprise" | "callflow";
  name: string;
  product: "ConvoAI" | "CallFlow";
  /** Monthly price in USD. `null` = quoted, never published. */
  monthly: number | null;
  /** Yearly price in USD, where the store sells one. */
  yearly?: number;
  /** Shown under the price. */
  priceNote: string;
  summary: string;
  /** Printed above `features`, e.g. "Everything in Essentials, plus". */
  listTitle: string;
  features: readonly string[];
  cta: { label: string; href: string };
};

export const aiAgentPlans: readonly AiAgentPlan[] = [
  {
    id: "essentials",
    name: "ConvoAI Essentials",
    product: "ConvoAI",
    monthly: 0,
    priceNote: "Included with every Serverlys hosting plan",
    summary: "An AI agent in the chat window on your website, answering visitors while you are busy.",
    listTitle: "What’s included",
    features: [
      "1 AI agent",
      "65 AI replies every 2 weeks",
      "AI agent in the messenger on your website",
      "AI auto-replies on your website",
      "Smart AI routing",
      "Hallucination prevention built in",
      "Quick answers",
      "Built-in CRM contacts",
      "Instant human handoff",
    ],
    cta: { label: "Get it with hosting", href: "/hosting" },
  },
  {
    id: "pro",
    name: "ConvoAI Pro",
    product: "ConvoAI",
    monthly: 49,
    yearly: 468,
    priceNote: "or $468 a year",
    summary: "Unlimited replies, and the same agent on WhatsApp and email, for a business that runs on conversations.",
    listTitle: "Everything in Essentials, plus",
    features: [
      "Unlimited AI replies",
      "WhatsApp and email channels for the same agent",
      "Knowledge base: your agent answers from your docs",
      "Advanced WhatsApp templates (rich media, buttons, lists)",
      "CRM pipeline with lead scoring and tags",
      "Smart agenda with automated appointment booking",
      "Product catalog and conversation funnels",
      "Automation workflows",
      "A/B prompt testing",
      "Custom AI training",
      "REST API and webhooks (Zapier, Make, n8n)",
      "Click-to-WhatsApp ads attribution",
      "Analytics and reports",
      "Priority support from real humans",
    ],
    cta: { label: "Start on Pro", href: "https://convoai.cloud/pricing" },
  },
  {
    id: "enterprise",
    name: "ConvoAI Enterprise",
    product: "ConvoAI",
    monthly: null,
    priceNote: "Custom pricing",
    summary: "More than one agent, for several locations or brands, with your brand on everything.",
    listTitle: "Everything in Pro, plus",
    features: [
      "Unlimited AI agents",
      "Unlimited conversations",
      "Custom fine-tuning on your playbook",
      "Dedicated account manager",
      "SSO / SAML for your organization",
      "Custom integrations and webhooks",
      "SLA guarantee and GDPR DPA",
      "Full white label, your brand everywhere",
      "Enterprise security and audit logs",
      "Training data export and ownership",
    ],
    cta: { label: "Talk to sales", href: billing.sales },
  },
  {
    id: "callflow",
    name: "CallFlow voice",
    product: "CallFlow",
    monthly: null,
    priceNote: "Usage-based, quoted for your setup",
    summary: "An AI receptionist that answers your business line, books, transfers and takes the message.",
    listTitle: "What it does",
    features: [
      "Answers inbound calls on your existing number or a new one",
      "Books appointments with calendar sync (Google, Outlook, Cal.com)",
      "Warm transfer to a person on your team",
      "Knowledge base built from your documents",
      "SMS follow-ups after the call",
      "Multi-language, with automatic language detection",
      "Recording and searchable transcripts",
      "Post-call analysis",
    ],
    cta: { label: "Get a quote", href: billing.sales },
  },
];

export const formatAgentPrice = (n: number) =>
  n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;

const plan = (id: AiAgentPlan["id"]) => {
  const p = aiAgentPlans.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown AI agent plan: ${id}`);
  return p;
};

export const convoEssentials = plan("essentials");
export const convoPro = plan("pro");
export const convoEnterprise = plan("enterprise");
export const callflowPlan = plan("callflow");
