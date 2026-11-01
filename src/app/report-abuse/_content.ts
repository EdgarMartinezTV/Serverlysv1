import type { Faq } from "@/data/faqs";

/**
 * Report abuse page content.
 *
 * THE FORM is the original two-step wizard measured from
 * hostinger.com/report-abuse (abuse type, Continue, then details). Edgar,
 * 2026-10-31: "Keep the original form" — so ABUSE_TYPES / IP_TYPE / FORM
 * below are unchanged, and _components/abuse-form.tsx is the original.
 *
 * THE PAGE around it was upgraded the same day: a fuller header, a
 * "What happens next" panel beside the form, then bands for what you can
 * report, how to write a report we can act on, an FAQ and related policies.
 *
 * ⚠ Every timing here is an AIM, mirroring /abuse-handling-policy. Do not
 * tighten one into a guarantee without changing that policy first.
 */

export const HERO = {
  eyebrow: "Trust & safety",
  title: "Report abuse",
  /** The mailbox is appended inline from data/company. */
  lede: "If you believe any Serverlys service is being used for abuse, such as spam, phishing, malware, copyright infringement, illegal content, or other harmful activity, please report it using the form below or email us at",
  chips: ["No account needed", "Read by a person, not a bot", "We aim to reply within one business day"],
  emergency: "If someone is in immediate danger, contact your local emergency services first.",
};

export const NEXT = {
  title: "What happens next",
  steps: [
    { t: "A person reads it", d: "We aim to confirm receipt within one business day." },
    { t: "We verify it", d: "We check the content is on our network and reproduce what you saw." },
    { t: "We act", d: "Active phishing and malware come down first. Otherwise the customer gets a deadline, or the account is suspended." },
    { t: "We tell you", d: "Where we can, we let you know the outcome by email." },
  ],
};

export type AbuseIcon = "copyright" | "speech" | "privacy" | "shield" | "ban" | "card" | "hook" | "bug" | "box" | "dots";

/** Informational band. Same ten categories as the form, in plain words. */
export const CATEGORIES = {
  title: "What you can report",
  description: "Anything on a Serverlys website, server, domain or email account that breaks the law or our acceptable use policy.",
  items: [
    { t: "Phishing", d: "Fake login pages and emails built to steal passwords or card details.", icon: "hook" },
    { t: "Malware", d: "Malicious downloads, exploit kits, and command-and-control servers.", icon: "bug" },
    { t: "Scams and fraud", d: "Fake shops, investment scams, and sites impersonating a real business.", icon: "card" },
    { t: "Spam", d: "Unsolicited email sent from our network, or advertising a site we host.", icon: "dots" },
    { t: "Copyright and trademark", d: "Pirated or copied content. DMCA notices need a few extra statements.", icon: "copyright" },
    { t: "Privacy violations", d: "Doxxing, or personal data and images published without consent.", icon: "privacy" },
    { t: "Harmful speech", d: "Threats, harassment, and incitement to violence.", icon: "speech" },
    { t: "Prohibited products", d: "Weapons, drugs, counterfeits, and other banned goods.", icon: "box" },
    { t: "Adult sexual material", d: "Explicit content where it is not permitted or not consensual.", icon: "ban" },
    { t: "Child sexual abuse material", d: "Removed immediately and referred to the authorities. Also report it to the NCMEC CyberTipline.", icon: "shield" },
  ],
} satisfies { title: string; description: string; items: { t: string; d: string; icon: AbuseIcon }[] };

export const TIPS = {
  title: "How to send a report we can act on",
  description: "Most reports that stall are missing one of these. None of them needs technical knowledge.",
  items: [
    { t: "Give the exact URL", d: "The specific page, not just the domain. A domain alone often points at a site with hundreds of pages." },
    { t: "Show what you saw", d: "A screenshot, the email you received, or a PDF. Up to five files of 2 MB each." },
    { t: "Include email headers", d: "For spam and phishing, the full headers tell us which server sent it. Your mail app can show them." },
    { t: "Say when it happened", d: "A date and time helps us match your report against our logs, especially if the page has since changed." },
  ],
  limits: {
    title: "What we cannot do",
    items: [
      "Remove content we do not host. If a site only uses our nameservers, its host of record must act.",
      "Share a customer's identity or contact details without legal process.",
      "Settle private disputes, defamation or trademark arguments. Those need a court.",
    ],
  },
};

export const FAQ_HEAD = {
  title: "Questions about reporting",
  description: "Short answers. The abuse handling policy has the full detail.",
};

const scopes = ["/report-abuse"] as const;
export const FAQS: Faq[] = [
  {
    question: "Do I need a Serverlys account to report abuse?",
    answer: "No. Anyone can report abuse, and most people who do are not our customers. You only need an email address so we can ask for more detail if we need it.",
    scopes,
  },
  {
    question: "How quickly will you act?",
    answer: "We aim to confirm receipt within one business day. Active phishing and malware are assessed ahead of everything else, the same day where we can. Other reports usually take a few business days, and we will tell you if it is going to take longer.",
    scopes,
  },
  {
    question: "What if the site is not hosted by Serverlys?",
    answer: "We can only remove content on our own servers. If a domain is registered with us but hosted elsewhere, or only uses our nameservers, send the report anyway and we will point you to the right provider where we can identify it.",
    scopes,
  },
  {
    question: "Can I send a DMCA copyright notice through this form?",
    answer: "Yes. Choose \"Intellectual property infringements (incl. DMCA)\" as the abuse type and the form asks for the extra statements a valid notice needs: the work, the infringing material, your capacity and a signature.",
    scopes,
  },
  {
    question: "I reported something and it is still online. What should I do?",
    answer: "Send it again and say it is still live. A second report about the same URL is not a nuisance. It is how we find out the first one went astray.",
    scopes,
  },
];

export const RELATED = {
  title: "Related policies",
  items: [
    { label: "Abuse handling policy", d: "What we do after you report, step by step.", href: "/abuse-handling-policy" },
    { label: "Copyright & DMCA policy", d: "What a valid copyright notice must include.", href: "/dmca-policy" },
    { label: "Acceptable use policy", d: "What is and is not allowed on our platform.", href: "/acceptable-use-policy" },
    { label: "Law enforcement requests", d: "How authorities can request data or preservation.", href: "/law-enforcement-requests" },
    { label: "Report a security vulnerability", d: "Found a flaw in Serverlys itself? Tell us here.", href: "/responsible-disclosure-policy" },
  ],
};

/* ─── The original form's content, unchanged. ─── */

export const ABUSE_TYPES = [
  "Intellectual property infringements (incl. DMCA)",
  "Illegal or harmful speech",
  "Privacy violations",
  "Child sexual abuse material (CSAM)",
  "Adult sexual material",
  "Scams and/or fraud",
  "Phishing",
  "Malware",
  "Prohibited products",
  "Other illegal content",
] as const;

/** The category that unlocks the statutory copyright fields. */
export const IP_TYPE = ABUSE_TYPES[0];

export const FORM = {
  step1: { label: "Abuse type", placeholder: "Select an abuse type", next: "Continue" },
  fields: {
    name: "Your name",
    org: "Organisation name or role",
    email: "Your email address",
    country: "Country of residence",
    target: "Abuser website or service",
    targetPlaceholder: "Provide the URL(s), domain name(s), or IP address(es) involved",
    description: "Description of the issue",
  },
  upload: {
    title: "Upload evidence",
    hint: "PDF, JPG, PNG, WEBP, TXT, EML – max 2 MB per file",
    browse: "Browse files",
  },
  /** Shown only for the IP/DMCA category, as on the reference. */
  dmca: {
    work: "Identify the copyrighted work",
    infringing: "Identify the infringing material or content",
    capacity: "Your capacity",
    owner: "I am the copyright owner.",
    agent:
      "I am authorized to act on behalf of the copyright owner (e.g., legal representative, agent).",
    signature: "Electronic signature",
  },
  declaration:
    "I declare that I have a good faith belief that the information provided in this notice is accurate and complete, and that the reported content or activity is illegal or violates Serverlys’ Terms of Service.",
  back: "Back",
  send: "Send",
  sending: "Sending…",
  success: {
    title: "Thank you, your report was sent",
    body: "Our abuse team reviews every report and will reply by email if we need more information.",
    reference: "Your reference",
  },
  errors: {
    failed: "We could not send your report. Please try again, or email it to support@serverlys.com.",
    rateLimited: "Too many reports from this connection. Please wait a few minutes and try again.",
    files: "Evidence must be up to 5 files of 2 MB each (PDF, JPG, PNG, WEBP, TXT or EML).",
    invalid: "Some required fields are missing or invalid. Please check the form and try again.",
  },
};
