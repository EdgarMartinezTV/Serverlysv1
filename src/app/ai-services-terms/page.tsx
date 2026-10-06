import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { pageMetadata } from "@/lib/seo";

/**
 * AI services terms — ConvoAI and CallFlow.
 *
 * Grounded in what those two products ALREADY DO on their own pages, not in
 * generic AI boilerplate. Both ConvoAI and CallFlow (now on their own sites) publish that the
 * customer is told they are speaking to an assistant; this document turns that
 * published behaviour into a term, which is the right direction of travel. Do
 * not add a clause describing a capability neither page claims.
 *
 * ⚠ THE RECORDING CLAUSE IS THE ONE THAT MATTERS COMMERCIALLY.
 * CallFlow answers telephone calls, and Serverlys is a Florida company selling
 * to Florida businesses. Florida requires the consent of ALL parties to record
 * a communication (Fla. Stat. § 934.03) — it is not a one-party state — and
 * several other states are the same. A customer who switches on recording
 * without an announcement is committing a crime in those states, and a voice
 * platform that stays quiet about it is selling them the rope. The obligation
 * is therefore stated as the customer's, explicitly, with the mechanism we
 * provide to meet it.
 *
 * This page states the position; it is NOT legal advice to the customer and
 * says so. Counsel review before launch applies here as to every document in
 * this set.
 *
 * ⚠ DO NOT add a model-training permission. We do not train shared models on
 * customer conversations, and that is a commercial commitment worth keeping.
 */

const PATH = "/ai-services-terms";

export const metadata = pageMetadata({
  title: "AI Services Terms — ConvoAI and CallFlow | Serverlys",
  description:
    "Serverlys AI services terms: who owns conversations, what models are not trained on, call recording consent, and what an AI agent must never be relied on for.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "scope",
    heading: "What these terms cover",
    blocks: [
      {
        type: "p",
        text: "These terms apply to the Serverlys AI services — ConvoAI, the chat agent that sits on your website, and CallFlow, the voice agent that answers your phone. They sit under the terms of service and add to them; where the two genuinely conflict on an AI-specific point, this document governs.",
      },
      {
        type: "p",
        text: "Everything else about your account — billing, refunds, acceptable use, termination — is governed by the terms of service and the policies it names.",
      },
    ],
  },
  {
    id: "disclosure",
    heading: "Your customers are told it is an assistant",
    blocks: [
      {
        type: "p",
        text: "Both services disclose that the person is speaking or writing to an automated assistant. On CallFlow this is announced at the start of the call; on ConvoAI it is stated in the chat interface.",
      },
      {
        type: "p",
        text: "This is a term, not a setting. It cannot be switched off, and we will not build an option to switch it off. An agent that lets your customers believe they reached a person is a deception we are not willing to operate on your behalf, and in a growing number of jurisdictions it is also unlawful.",
      },
      {
        type: "note",
        text: "You may change the wording to match your brand. You may not change it into something that implies a human is on the line.",
      },
    ],
  },
  {
    id: "recording",
    heading: "Call recording and consent",
    blocks: [
      {
        type: "p",
        text: "Read this one before you enable recording. It is the clause most likely to cost you if you skip it.",
      },
      {
        type: "p",
        text: "Recording a telephone call is regulated by state law, and the states do not agree. Some permit a recording where one party consents. Others — Florida among them, under section 934.03 of the Florida Statutes — require the consent of every party to the call. Recording someone in an all-party state without telling them is a criminal offence and a civil one, and it does not stop being either because a vendor's dashboard made it a toggle.",
      },
      {
        type: "ul",
        items: [
          "You decide whether calls to your CallFlow agent are recorded, and you are responsible for that decision.",
          "Where you enable recording, you are responsible for ensuring callers are told, at the start of the call and before anything is captured. The service provides a configurable announcement for exactly this purpose — use it.",
          "You are responsible for knowing which rule applies to you and to the people who call you, including callers in other states.",
          "Serverlys is not your lawyer and this page is not legal advice. If you are unsure, take advice before you turn recording on rather than after.",
        ],
      },
      {
        type: "note",
        text: "Transcripts are recordings for this purpose. A written record of what somebody said on a call is captured content, and the same consent rules apply to producing it.",
      },
    ],
  },
  {
    id: "ownership",
    heading: "Who owns the conversations",
    blocks: [
      {
        type: "ul",
        items: [
          "You own the conversations, transcripts, recordings and the content you supply to configure the agent. They are yours and they remain yours.",
          "We hold them to run the service for you, and we act as your processor in doing so. The data processing agreement sets out that relationship and governs it.",
          "You can export your conversation data, and you can ask us to delete it. Ending your subscription does not mean we keep it as leverage.",
          "Serverlys owns the platform, the models we license, and the software that runs them. Nothing here transfers any of that to you.",
        ],
      },
    ],
  },
  {
    id: "training",
    heading: "What we do not train on",
    blocks: [
      {
        type: "p",
        text: "We do not use your conversations, transcripts, recordings or configuration content to train shared or general-purpose models — not ours, and not a vendor's.",
      },
      {
        type: "p",
        text: "Your agent is grounded in your own material: ConvoAI reads the pages you point it at, so its answers match what you publish. That grounding is scoped to your account. Another customer's agent cannot reach it, and it does not become part of a model anyone else's agent uses.",
      },
      {
        type: "p",
        text: "Where we use a third-party model provider to deliver the service, we contract with them on terms that prohibit training on the content we send. If that ever ceases to be true of a provider we use, we will change provider or tell you before it applies to you.",
      },
    ],
  },
  {
    id: "limits",
    heading: "What an agent must not be relied on for",
    blocks: [
      {
        type: "p",
        text: "These services answer routine questions, capture details, book appointments and hand the rest to a person. They are good at that. There are things they are not for, and deploying one as though they were is a misuse of the service rather than a defect in it.",
      },
      {
        type: "ul",
        items: [
          "EMERGENCIES. Neither service is an emergency line and neither can summon help. If your callers may be in distress, your announcement and your routing must send them to an emergency number or a human, immediately and unconditionally.",
          "Medical, legal, financial or other regulated advice. Do not configure an agent to give it, and do not present its output as though a professional gave it.",
          "Decisions with a legal or similarly significant effect on a person, taken without a human in the loop.",
          "Anything where being confidently wrong is unacceptable. The agent is built to say it will fetch a person rather than bluff, and that behaviour is the point — do not configure it out.",
        ],
      },
      {
        type: "p",
        text: "AI output can be wrong, and occasionally it will be wrong fluently. You are responsible for what your agent says on your behalf, for reviewing the material you ground it in, and for the human handoff being real rather than decorative.",
      },
    ],
  },
  {
    id: "your-obligations",
    heading: "Your obligations",
    blocks: [
      {
        type: "ul",
        items: [
          "Configure the agent only with content you have the right to use.",
          "Do not use the services to impersonate a real person or organisation, or to generate content designed to deceive.",
          "Do not use them for unsolicited outbound calling or messaging. The acceptable use policy already prohibits it and these services are no exception — a voice agent that dials strangers is a robocall regardless of how it is described.",
          "Comply with the law that applies to your own sector and your own customers, including consumer, privacy and recording rules.",
          "Tell us if you intend to process special-category personal data through an agent, so the data processing agreement can be set up properly before you start rather than after.",
        ],
      },
    ],
  },
  {
    id: "availability",
    heading: "Availability, limits and changes",
    blocks: [
      {
        type: "p",
        text: "AI services depend on model providers we do not control, and their capabilities and pricing change. Where we change the underlying model, our aim is that your agent continues to behave as configured; where a change is material to how yours behaves, we will tell you.",
      },
      {
        type: "p",
        text: "Usage limits attach to your plan and are shown before you buy. If you exceed them we will tell you rather than silently degrade the service.",
      },
      {
        type: "note",
        text: "We publish no uptime percentage for these services, here or anywhere else on this site. When there is a measured service level with a credit schedule behind it, it will appear as its own document and not as a number in a marketing sentence.",
      },
    ],
  },
  {
    id: "termination",
    heading: "Suspension and ending the service",
    blocks: [
      {
        type: "p",
        text: "We may suspend an agent that is being used in breach of these terms or the acceptable use policy — outbound spam, impersonation, or a deployment that is putting callers at risk. Where we can reach you first we will.",
      },
      {
        type: "p",
        text: "When your subscription ends you can export your conversation data. We retain it only for the period set out in the data processing agreement, and then we delete it.",
      },
    ],
  },
];

export default function AiServicesTermsPage() {
  return (
    <>
      <LegalPage
        path={PATH}
        title="AI services terms"
        intro="The terms specific to ConvoAI and CallFlow — who owns the conversations, what the models are never trained on, what the law requires before you record a call, and the things an automated agent must not be relied on to do."
        trail={[{ name: "Home", href: "/" }, { name: "AI services terms" }]}
        sections={SECTIONS}
        contact="If you are planning a deployment and are not sure whether it sits inside these terms — an unusual sector, a regulated one, or callers in several states — ask us before you launch it. That conversation is much easier before the agent is live."
      />
      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "AI services terms", path: PATH },
        ]}
      />
    </>
  );
}
