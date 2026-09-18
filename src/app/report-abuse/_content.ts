/**
 * Report abuse page content.
 *
 * Measured from hostinger.com/report-abuse — which sits behind an interactive
 * Cloudflare challenge. A direct fetch (403), a headless browser (never
 * clears) and the Internet Archive (offline) all failed; a real Chrome window
 * cleared it instantly, and the page was then read over CDP. Everything below
 * is from that live read, not a guess.
 *
 * Geometry (measured): one section, 80px padding, max-width 1600. h1 48/56 at
 * -0.24px, CENTRED, capped 646px. Lede 16/24 at rgba(0,0,0,.75), centred,
 * capped 700px. Primary button radius 12px, padding 12px 40px, 16px/600.
 *
 * It is a TWO-STEP WIZARD, not a single form: pick the abuse type, Continue,
 * then the details. That order is deliberate on the reference's part — the
 * type determines which fields are required, because an IP/DMCA notice needs
 * statutory elements the others do not.
 *
 * There is no marketing on this page, no hero visual, and no FAQ. The previous
 * version of our page had "What happens next" and "What we will not do"
 * panels, which were good copy; they are gone because they are not on the
 * reference. They are recoverable from git if you want them back below the
 * form.
 */

export const HERO = {
  title: "Report abuse",
  /** The reference names its abuse mailbox inline; ours is in data/company. */
  lede: "If you believe any Serverlys service is being used for abuse, such as spam, phishing, malware, copyright infringement, illegal content, or other harmful activity, please report it using the form below or email us at",
};

/** The reference's ten categories, in its order. */
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
};
