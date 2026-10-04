import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";
import { company, emailDisplay } from "@/data/company";

/**
 * Customer service policy.
 *
 * ⚠ THIS IS NOT AN SLA AND MUST NOT BECOME ONE BY ACCIDENT.
 *
 * There is a standing decision, recorded in data/navigation.ts and in the
 * project notes, that Serverlys publishes NO uptime percentage and NO
 * guaranteed response time until there are measured figures and a credit
 * schedule behind them. An SLA needs both. Every timing statement on this page
 * is therefore an AIM in the grammatical sense — "we aim to", "typically" —
 * and none of them carries a remedy.
 *
 * The difference is not stylistic. A published response time with a credit
 * attached is a contractual commitment; the same sentence without one is a
 * statement of intent. Turning the first into the second is a one-word edit,
 * which is exactly why this comment is here. Do not tighten the language
 * without Edgar's real numbers and a decision about credits.
 *
 * The "what we will not do" section is the substance of the page and is drawn
 * from commitments the site already makes elsewhere — the refund policy
 * already promises no retention script. This states it as policy.
 */

const PATH = "/customer-service-policy";

export const metadata = pageMetadata({
  title: "Customer Service Policy | Serverlys",
  description:
    "How to reach Serverlys support, what we aim to respond in, how we handle complaints, and the things we will not do — including the retention scripts we do not run.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "channels",
    heading: "How to reach us",
    blocks: [
      {
        type: "ul",
        items: [
          "A ticket from your client area. This is the fastest route for anything account-specific, because it arrives already tied to your account and nobody has to verify who you are first.",
          `Email to ${emailDisplay} from the address on the account.`,
          `Telephone on ${company.phone}.`,
        ],
      },
      {
        type: "p",
        text: "Use whichever suits you. A ticket is not a lesser channel that exists to keep you away from a person — it is simply the one that carries the most context into the conversation.",
      },
    ],
  },
  {
    id: "response",
    heading: "What we aim to respond in",
    blocks: [
      {
        type: "p",
        text: "These are aims. They are not guarantees, and this page deliberately does not dress them up as one.",
      },
      {
        type: "ul",
        items: [
          "A site that is down, or an account you cannot get into: we aim to be looking at it within hours, including outside business hours.",
          "General support — configuration, billing, how something works: we aim to reply within one business day.",
          "Migrations and project work: we agree timings with you in advance, in writing, and we tell you when one is going to slip.",
        ],
      },
      {
        type: "note",
        text: "There is no service level agreement behind these figures and no credit attached to them. When there is one it will be published as its own document with the measurements and the credit schedule in it, not as a number in a marketing sentence. We would rather have no SLA than one we made up.",
      },
    ],
  },
  {
    id: "what-you-get",
    heading: "What you can expect from us",
    blocks: [
      {
        type: "ul",
        items: [
          "A person, not a script. If the first reply does not answer the question, say so and it escalates rather than repeating.",
          "A plain answer about what is wrong, including when the cause is ours. An outage we caused is described as an outage we caused.",
          "An honest estimate, or an admission that we do not have one yet. An invented deadline is worse than no deadline.",
          "No charge for a backup restore. Your worst day is not a sales opportunity.",
          "Free migration of an existing site onto our platform, as advertised, without a bait-and-switch when we see the size of it.",
        ],
      },
    ],
  },
  {
    id: "what-we-wont-do",
    heading: "What we will not do",
    blocks: [
      {
        type: "p",
        text: "The useful half of a service policy is the part that constrains the company, so here is ours.",
      },
      {
        type: "ul",
        items: [
          "We will not run a retention script. Ask to cancel and you get cancelled — no four-screen exit flow, no offer you have to decline three times, no requirement to call during office hours to close an account you opened in two clicks.",
          "We will not make you ask twice for a refund you are entitled to under the refund policy, and we will not ask you to justify it.",
          "We will not upsell you during an outage. When your site is down the conversation is about your site.",
          "We will not quote a renewal price only after you have bought. The renewal price is shown beside the promotional one before checkout, everywhere on this site, on purpose.",
          "We will not hold your data hostage. You can export it and you can leave, including mid-term.",
          "We will not tell you a limitation is a feature. If something cannot do what you need, you will be told that it cannot.",
        ],
      },
    ],
  },
  {
    id: "scope",
    heading: "What support covers, and what it does not",
    blocks: [
      {
        type: "p",
        text: "Support covers our platform: the hosting environment, the control panel, DNS and domains held with us, billing, and the services you bought from us.",
      },
      {
        type: "p",
        text: "It does not extend to writing or debugging your application code, rebuilding a site broken by a change you made, or supporting third-party software we did not sell you. We will usually take a look and point you in the right direction anyway — but that is a courtesy rather than an entitlement, and it is honest to say so rather than have you find the boundary during an emergency.",
      },
      {
        type: "note",
        text: "Design, development and AI configuration are available as paid project work. If what you need is that rather than support, we will tell you and quote for it instead of doing it badly for free.",
      },
    ],
  },
  {
    id: "conduct",
    heading: "What we ask of you",
    blocks: [
      {
        type: "ul",
        items: [
          "Contact us from the address on the account, or through the client area. We cannot make account changes for someone we cannot verify, and that protects you.",
          "Tell us what changed. "
            + "Almost every sudden fault follows something — an update, a new plugin, a DNS edit — and knowing what it was often turns an afternoon into ten minutes.",
          "Keep one thread per issue. Three tickets about the same problem get three partial answers.",
          "Treat the person you are speaking to as a person. We will end a conversation that becomes abusive, and we will say why.",
        ],
      },
    ],
  },
  {
    id: "complaints",
    heading: "If we get it wrong",
    blocks: [
      {
        type: "p",
        text: "Say so in the same thread and ask for it to be escalated. It goes to someone who was not part of the original handling.",
      },
      {
        type: "ul",
        items: [
          "We aim to acknowledge a complaint within one business day.",
          "We tell you what we found, including when the finding is that we were wrong.",
          "Where a refund or a credit is the right outcome, we offer it rather than waiting to be asked.",
          "Where we disagree with you, we say so plainly and explain why, instead of going quiet and hoping it goes away.",
        ],
      },
      {
        type: "p",
        text: "If a complaint cannot be resolved between us, the dispute resolution provisions in the terms of service apply.",
      },
    ],
  },
];

export default function CustomerServicePolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Customer service policy", path: PATH },
        ])}
      />
      <LegalPage
        path={PATH}
        title="Customer service policy"
        intro="How to reach us, what we aim to respond in, and — the more useful half — the specific things we will not do to you. These are aims rather than a service level agreement, and the page says which is which."
        trail={[{ name: "Home", href: "/" }, { name: "Customer service policy" }]}
        sections={SECTIONS}
        contact="If your experience of us has not matched what this page says, that is worth telling us directly. A policy nobody is held to is just decoration."
      />
    </>
  );
}
