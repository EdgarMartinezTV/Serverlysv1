/**
 * Report abuse page content.
 *
 * The flow is still the two-step wizard first measured from
 * hostinger.com/report-abuse: pick the abuse type, then the details. The type
 * decides which fields are required, because an IP/DMCA notice needs
 * statutory elements the others do not.
 *
 * 2026-10-31 upgrade: the type is chosen from labelled cards instead of a
 * bare <select> (ten options with no explanation made people guess), and the
 * "What happens next" / "What we cannot do" panels are back beside the form.
 * Their wording mirrors /abuse-handling-policy — timings are AIMS, never
 * guarantees. Do not tighten them into commitments here without changing that
 * policy first.
 *
 * ⚠ ABUSE_TYPES[].value strings are emailed verbatim by /api/report-abuse and
 * IP_TYPE gates the DMCA fields. Changing a value changes the email subject.
 */

export const HERO = {
  eyebrow: "Trust & safety",
  title: "Report abuse",
  /** The mailbox is appended inline from data/company. */
  lede: "If you believe a Serverlys service is being used for spam, phishing, malware, copyright infringement, illegal content or other harmful activity, tell us with the form below or email",
  chips: ["No account needed", "Read by a person, not a bot", "We aim to reply within one business day"],
  emergency:
    "If someone is in immediate danger, contact your local emergency services first.",
};

export type AbuseIcon =
  | "copyright"
  | "speech"
  | "privacy"
  | "shield"
  | "ban"
  | "card"
  | "hook"
  | "bug"
  | "box"
  | "dots";

/** The ten categories, in the reference's order. */
export const ABUSE_TYPES = [
  { value: "Intellectual property infringements (incl. DMCA)", short: "Copyright & trademark", hint: "DMCA notices, pirated or copied content", icon: "copyright" },
  { value: "Illegal or harmful speech", short: "Harmful speech", hint: "Threats, harassment, incitement to violence", icon: "speech" },
  { value: "Privacy violations", short: "Privacy violation", hint: "Doxxing, personal data or images shared without consent", icon: "privacy" },
  { value: "Child sexual abuse material (CSAM)", short: "Child sexual abuse material", hint: "Handled first and referred to the authorities", icon: "shield" },
  { value: "Adult sexual material", short: "Adult sexual material", hint: "Explicit content where it is not permitted", icon: "ban" },
  { value: "Scams and/or fraud", short: "Scam or fraud", hint: "Fake shops, investment scams, impersonation", icon: "card" },
  { value: "Phishing", short: "Phishing", hint: "Fake login pages, credential-harvesting email", icon: "hook" },
  { value: "Malware", short: "Malware", hint: "Malicious downloads, exploit kits, C2 servers", icon: "bug" },
  { value: "Prohibited products", short: "Prohibited products", hint: "Weapons, drugs, counterfeits, banned goods", icon: "box" },
  { value: "Other illegal content", short: "Something else", hint: "Spam, network attacks, anything not listed", icon: "dots" },
] as const satisfies readonly { value: string; short: string; hint: string; icon: AbuseIcon }[];

/** The category that unlocks the statutory copyright fields. */
export const IP_TYPE = ABUSE_TYPES[0].value;
export const CSAM_TYPE = ABUSE_TYPES[3].value;

export const FORM = {
  steps: ["What happened", "Your report"],
  step1: {
    title: "What are you reporting?",
    lede: "Choose the closest match. It decides which details we need from you.",
    next: "Continue",
  },
  step2: {
    title: "Tell us what you found",
    lede: "A report we can reproduce gets acted on fastest. The exact URL matters more than anything else.",
    change: "Change",
  },
  sections: { you: "About you", abuse: "The abuse", dmca: "Copyright notice details" },
  fields: {
    name: "Your name",
    org: "Organisation or role",
    email: "Your email address",
    emailHint: "We reply here, and only about this report.",
    country: "Country of residence",
    target: "Website, URL or IP address involved",
    targetHint: "The specific page, not just the domain. One per line if there are several.",
    targetPlaceholder: "https://example.com/the-exact-page",
    description: "What is happening",
    descriptionHint: "What you saw, when, and how you came across it. Paste email headers for spam or phishing.",
  },
  upload: {
    title: "Evidence",
    optional: "Optional",
    hint: "Screenshots, emails or documents. PDF, JPG, PNG, WEBP, TXT or EML, up to 5 files of 2 MB each.",
    browse: "Add files",
    remove: "Remove",
  },
  /** Shown only for the IP/DMCA category. */
  dmca: {
    note: "Copyright notices need the statements required by 17 U.S.C. § 512(c)(3). Knowingly false notices carry liability under § 512(f).",
    work: "Identify the copyrighted work",
    infringing: "Identify the infringing material or content",
    capacity: "Your capacity",
    owner: "I am the copyright owner.",
    agent: "I am authorized to act on behalf of the copyright owner (e.g., legal representative, agent).",
    signature: "Electronic signature",
    signatureHint: "Type your full legal name.",
  },
  csam: {
    title: "Please also report this to the authorities",
    body: "We remove this material immediately on a credible report and preserve evidence for law enforcement. In the United States, also report it to the NCMEC CyberTipline. Do not download or forward the material, even as evidence. A URL is enough.",
    link: { label: "NCMEC CyberTipline", href: "https://report.cybertip.org/" },
  },
  declaration:
    "I declare that I have a good faith belief that the information provided in this notice is accurate and complete, and that the reported content or activity is illegal or violates Serverlys’ Terms of Service.",
  back: "Back",
  send: "Send report",
  sending: "Sending…",
  success: {
    title: "Thank you. Your report was sent",
    body: "It is in our abuse queue and a person will review it. We aim to confirm receipt within one business day, and we will email you if we need more detail.",
    reference: "Your reference",
    keep: "Quote this reference if you follow up.",
    another: "Report something else",
  },
  errors: {
    failed: "We could not send your report. Please try again, or email it to support@serverlys.com.",
    rateLimited: "Too many reports from this connection. Please wait a few minutes and try again.",
    files: "Evidence must be up to 5 files of 2 MB each (PDF, JPG, PNG, WEBP, TXT or EML).",
    invalid: "Some required fields are missing or invalid. Please check the form and try again.",
  },
};

export const ASIDE = {
  next: {
    title: "What happens next",
    steps: [
      { t: "A person reads it", d: "We aim to confirm receipt within one business day." },
      { t: "We verify it", d: "We check the content is actually on our network and reproduce what you saw." },
      { t: "We act", d: "Active phishing and malware come down first. Otherwise the customer gets a deadline, or the account is suspended." },
      { t: "We tell you", d: "Where we can, we let you know the outcome by email." },
    ],
  },
  limits: {
    title: "What we cannot do",
    items: [
      "Remove content we do not host. If a site only uses our nameservers, its host of record must act.",
      "Share a customer's identity or contact details without legal process.",
      "Settle private disputes, defamation or trademark arguments. Those need a court.",
    ],
  },
  links: {
    title: "Related policies",
    items: [
      { label: "Abuse handling policy", href: "/abuse-handling-policy" },
      { label: "Copyright & DMCA policy", href: "/dmca-policy" },
      { label: "Acceptable use policy", href: "/acceptable-use-policy" },
      { label: "Law enforcement requests", href: "/law-enforcement-requests" },
      { label: "Report a security vulnerability", href: "/responsible-disclosure-policy" },
    ],
  },
};
