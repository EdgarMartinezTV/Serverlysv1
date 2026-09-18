import type {
  FieldSpec,
  Intent,
  WorkflowId,
  WorkflowRecord,
  WorkflowSpec,
  WorkflowView,
} from "./types";
import { validateField } from "./validation";

/**
 * What each request type must collect before a human can act on it.
 *
 * ONE SCHEMA PER WORKFLOW, never one generic form. A migration and an SEO
 * enquiry need almost nothing in common past the contact details, and a single
 * union of every field would mean either asking everyone about DNS access or
 * letting half the record go unvalidated. The cost of a schema each is a few
 * lines; the cost of the generic form is a team member chasing missing
 * information on every request.
 *
 * `required` is the ONLY thing that decides whether a request can be
 * submitted, so keep the required set to what genuinely blocks the first reply.
 * Everything else is optional and is collected only if it comes up naturally —
 * Sera is not a form, and the fastest way to make it feel like one is to mark
 * twelve fields required.
 *
 * `ask` is a HINT for the model, not a script. The model rewrites it to fit
 * the conversation; it exists so that the phrasing starts from something a
 * person would actually say rather than from the field name.
 *
 * `options` steer extraction and are matched case-insensitively, but a short
 * free-text answer is still accepted (see `validateChoice`). "Bluehost, but
 * DNS is at Cloudflare" is more useful to the team than a forced pick.
 */

/* ── Reusable field groups ───────────────────────────────────────────────── */

const NAME: FieldSpec = {
  key: "name",
  label: "Name",
  required: true,
  kind: "name",
  ask: "Ask who you are speaking with — first name is enough to start.",
};

const EMAIL: FieldSpec = {
  key: "email",
  label: "Email",
  required: true,
  kind: "email",
  ask: "Ask for the best email address for the team to reply to.",
};

/**
 * Phone is required ONLY where the work genuinely needs coordination — a
 * migration has a cutover window, and a callback request is a request for a
 * call. Everywhere else it is optional and should not be asked for until the
 * visitor has shown they want to be contacted.
 */
const PHONE = (required: boolean): FieldSpec => ({
  key: "phone",
  label: "Phone",
  required,
  kind: "phone",
  ask: required
    ? "Ask for a phone number, explaining it is so the team can coordinate."
    : "Only ask for a phone number if they would prefer a call.",
});

const NOTES: FieldSpec = {
  key: "notes",
  label: "Additional notes",
  required: false,
  kind: "text",
  ask: "Ask if there is anything else the team should know. Never insist.",
};

const URGENCY: FieldSpec = {
  key: "urgency",
  label: "Urgency",
  required: false,
  kind: "choice",
  options: ["Emergency — site is down", "High", "Normal", "Just planning"],
  ask: "Ask how urgent this is, in plain words.",
};

/* ── Workflow definitions ────────────────────────────────────────────────── */

const MIGRATION: WorkflowSpec = {
  id: "WEBSITE_MIGRATION",
  title: "Website migration",
  purpose:
    "Move an existing website to Serverlys from another hosting provider.",
  subject: "New website migration request",
  fields: [
    {
      key: "domain",
      label: "Domain",
      required: true,
      kind: "domain",
      ask: "Ask which domain is moving. This is the best first question — it is concrete and it anchors everything else.",
    },
    {
      key: "currentHost",
      label: "Current host",
      required: true,
      kind: "choice",
      options: [
        "GoDaddy",
        "Bluehost",
        "HostGator",
        "Hostinger",
        "SiteGround",
        "Namecheap",
        "WP Engine",
        "Wix",
        "Squarespace",
        "Shopify",
        "AWS",
        "Other",
      ],
      ask: "Ask who currently hosts the site.",
    },
    {
      key: "websiteType",
      label: "Platform",
      required: true,
      kind: "choice",
      options: [
        "WordPress",
        "WooCommerce",
        "Custom application",
        "Static site",
        "Other",
      ],
      ask: "Ask what the site is built on — WordPress, WooCommerce, something custom.",
    },
    NAME,
    EMAIL,
    PHONE(true),
    {
      key: "hostingAccess",
      label: "Has hosting account access",
      required: true,
      kind: "choice",
      options: ["Yes", "No", "Not sure"],
      ask: "Ask whether they can log in to the current hosting account. This decides whether the migration can start at all, so it is required.",
    },
    {
      key: "dnsAccess",
      label: "Has domain/DNS access",
      required: true,
      kind: "choice",
      options: ["Yes", "No", "Not sure"],
      ask: "Ask whether they control the domain or its DNS — often a different account from the hosting.",
    },
    {
      key: "websiteUrl",
      label: "Website URL",
      required: false,
      kind: "url",
      ask: "Only ask if the live site is at a different address from the domain given.",
    },
    {
      key: "websiteSize",
      label: "Approximate size",
      required: false,
      kind: "choice",
      options: ["Under 1 GB", "1–5 GB", "5–20 GB", "Over 20 GB", "Not sure"],
      ask: "Ask roughly how large the site is, making clear that 'not sure' is a fine answer.",
    },
    {
      key: "emailAccounts",
      label: "Email accounts to move",
      required: false,
      kind: "choice",
      options: ["None", "1–5", "6–20", "More than 20", "Not sure"],
      ask: "Ask whether any mailboxes need to move with the site.",
    },
    {
      key: "preferredMigrationTime",
      label: "Preferred timing",
      required: false,
      kind: "choice",
      options: [
        "As soon as possible",
        "This week",
        "This month",
        "A specific date",
        "Flexible",
      ],
      ask: "Ask when they would like the move to happen.",
    },
    URGENCY,
    NOTES,
  ],
};

const DEVELOPMENT: WorkflowSpec = {
  id: "WEBSITE_DEVELOPMENT",
  title: "Website project",
  purpose: "Design and build a new website, store or web application.",
  subject: "New website development enquiry",
  fields: [
    {
      key: "projectType",
      label: "Project type",
      required: true,
      kind: "choice",
      options: [
        "New website",
        "Redesign",
        "Ecommerce store",
        "Web application",
        "Landing page",
      ],
      ask: "Ask what kind of project this is.",
    },
    {
      key: "goals",
      label: "What it needs to do",
      required: true,
      kind: "text",
      ask: "Ask what the site needs to achieve — this matters more than page counts.",
    },
    NAME,
    EMAIL,
    PHONE(false),
    {
      key: "businessName",
      label: "Business",
      required: false,
      kind: "choice",
      options: [],
      ask: "Ask what the business is called.",
    },
    {
      key: "currentUrl",
      label: "Current website",
      required: false,
      kind: "url",
      ask: "Ask whether there is an existing site, if a redesign is implied.",
    },
    {
      key: "timeline",
      label: "Timeline",
      required: false,
      kind: "choice",
      options: ["ASAP", "Within a month", "1–3 months", "No fixed date"],
      ask: "Ask when they would like it live.",
    },
    {
      key: "budgetRange",
      label: "Budget range",
      required: false,
      kind: "choice",
      options: ["Not sure yet", "Under $2,000", "$2,000–$5,000", "$5,000+"],
      ask: "Ask about budget only once the project is understood, and never twice. Make clear that 'not sure yet' is fine — Serverlys does not publish development pricing, so this is for routing, not a quote.",
    },
    NOTES,
  ],
};

const MAINTENANCE: WorkflowSpec = {
  id: "WEBSITE_MAINTENANCE",
  title: "Website care",
  purpose:
    "Ongoing maintenance, updates, security and performance work on an existing site.",
  subject: "New website maintenance enquiry",
  fields: [
    {
      key: "domain",
      label: "Domain",
      required: true,
      kind: "domain",
      ask: "Ask which site needs looking after.",
    },
    {
      key: "currentIssues",
      label: "What is happening",
      required: true,
      kind: "text",
      ask: "Ask what is going wrong or what they want kept on top of.",
    },
    NAME,
    EMAIL,
    PHONE(false),
    {
      key: "platform",
      label: "Platform",
      required: false,
      kind: "choice",
      options: ["WordPress", "WooCommerce", "Custom application", "Not sure"],
      ask: "Ask what the site is built on.",
    },
    {
      key: "supportLevel",
      label: "Type of help",
      required: false,
      kind: "choice",
      options: ["Ongoing monthly care", "A one-off fix", "Not sure"],
      ask: "Ask whether this is a one-off or ongoing.",
    },
    URGENCY,
    NOTES,
  ],
};

const SEO: WorkflowSpec = {
  id: "SEO",
  title: "SEO enquiry",
  purpose: "Improve how a site ranks and what it earns from search.",
  subject: "New SEO enquiry",
  fields: [
    {
      key: "domain",
      label: "Domain",
      required: true,
      kind: "domain",
      ask: "Ask which site the SEO work is for.",
    },
    {
      key: "goals",
      label: "Goal",
      required: true,
      kind: "text",
      ask: "Ask what they want search to do for the business — more calls, more orders, a specific market.",
    },
    NAME,
    EMAIL,
    PHONE(false),
    {
      key: "targetMarket",
      label: "Target market",
      required: false,
      kind: "choice",
      options: [],
      ask: "Ask who and where they are trying to reach.",
    },
    {
      key: "competitors",
      label: "Competitors",
      required: false,
      kind: "choice",
      options: [],
      ask: "Ask who currently outranks them, if they know.",
    },
    NOTES,
  ],
};

const AI_AGENT: WorkflowSpec = {
  id: "AI_AGENT",
  title: "AI agent enquiry",
  purpose: "An AI agent that answers customers by chat or phone.",
  subject: "New AI agent enquiry",
  fields: [
    {
      key: "useCase",
      label: "What it should handle",
      required: true,
      kind: "text",
      ask: "Ask what they want the agent to handle — the questions it should answer or the calls it should take.",
    },
    NAME,
    EMAIL,
    PHONE(false),
    {
      key: "businessName",
      label: "Business",
      required: false,
      kind: "choice",
      options: [],
      ask: "Ask what the business is called.",
    },
    {
      key: "channels",
      label: "Channels",
      required: false,
      kind: "choice",
      options: ["Website chat", "Phone calls", "WhatsApp", "More than one"],
      ask: "Ask where it needs to work — website, phone, messaging.",
    },
    {
      key: "volume",
      label: "Volume",
      required: false,
      kind: "choice",
      options: [
        "A few a day",
        "Tens a day",
        "Hundreds a day",
        "Not sure",
      ],
      ask: "Ask roughly how many conversations or calls a day.",
    },
    NOTES,
  ],
};

const AUTOMATION: WorkflowSpec = {
  id: "AUTOMATION",
  title: "Automation enquiry",
  purpose: "Automate a repetitive business process.",
  subject: "New business automation enquiry",
  fields: [
    {
      key: "process",
      label: "Process to automate",
      required: true,
      kind: "text",
      ask: "Ask what they are doing by hand today that they would rather not be.",
    },
    NAME,
    EMAIL,
    PHONE(false),
    {
      key: "businessName",
      label: "Business",
      required: false,
      kind: "choice",
      options: [],
      ask: "Ask what the business is called.",
    },
    {
      key: "tools",
      label: "Tools in use",
      required: false,
      kind: "choice",
      options: [],
      ask: "Ask which tools the process touches — CRM, spreadsheets, email, a booking system.",
    },
    NOTES,
  ],
};

const CHATBOT: WorkflowSpec = {
  id: "CHATBOT",
  title: "Chatbot enquiry",
  purpose: "A chatbot for the visitor's own website.",
  subject: "New chatbot enquiry",
  fields: [
    {
      key: "purpose",
      label: "What it should do",
      required: true,
      kind: "text",
      ask: "Ask what the chatbot should do for their visitors.",
    },
    NAME,
    EMAIL,
    PHONE(false),
    {
      key: "websiteUrl",
      label: "Website",
      required: false,
      kind: "url",
      ask: "Ask which site it would go on.",
    },
    {
      key: "languages",
      label: "Languages",
      required: false,
      kind: "choice",
      options: [],
      ask: "Ask which languages it needs to speak.",
    },
    NOTES,
  ],
};

const HOSTING_SALES: WorkflowSpec = {
  id: "HOSTING_SALES",
  title: "Hosting enquiry",
  purpose:
    "Help choosing a hosting plan, for someone who wants a person to confirm the fit.",
  subject: "New hosting enquiry",
  fields: [
    NAME,
    EMAIL,
    {
      key: "requirement",
      label: "What they need",
      required: true,
      kind: "text",
      ask: "Ask what they are hosting and what has to hold up.",
    },
    PHONE(false),
    {
      key: "interestedPlan",
      label: "Plan of interest",
      required: false,
      kind: "choice",
      options: ["Starter", "Plus", "Turbo", "Business", "Not sure"],
      ask: "Ask which plan they were looking at, if any.",
    },
    {
      key: "currentHost",
      label: "Current host",
      required: false,
      kind: "choice",
      options: [],
      ask: "Ask who hosts them today, if anyone.",
    },
    {
      key: "monthlyVisits",
      label: "Monthly visits",
      required: false,
      kind: "choice",
      options: [
        "Under 10,000",
        "10,000–25,000",
        "25,000–50,000",
        "Over 50,000",
        "Not sure",
      ],
      ask: "Ask roughly how much traffic the site gets — this is what actually decides the tier.",
    },
    NOTES,
  ],
};

const HUMAN_CONTACT: WorkflowSpec = {
  id: "HUMAN_CONTACT",
  title: "Talk to the team",
  purpose: "Put the visitor in front of a person at Serverlys.",
  subject: "New request to speak with the team",
  fields: [
    {
      key: "topic",
      label: "Topic",
      required: true,
      kind: "choice",
      options: [
        "Sales",
        "Billing",
        "Technical support",
        "Migration",
        "Something else",
      ],
      ask: "Ask what it is about, so it reaches the right person.",
    },
    {
      key: "summary",
      label: "What they need",
      required: true,
      kind: "text",
      ask: "Ask them to describe the situation in their own words. Do not paraphrase it away — this is what the person reading it will act on.",
    },
    NAME,
    EMAIL,
    PHONE(true),
    {
      key: "preferredContact",
      label: "Preferred contact",
      required: false,
      kind: "choice",
      options: ["Email", "Phone call", "Either"],
      ask: "Ask how they would rather be reached.",
    },
    {
      key: "bestTime",
      label: "Best time to reach",
      required: false,
      kind: "choice",
      options: [],
      ask: "Ask when suits them, and in which time zone.",
    },
    URGENCY,
  ],
};

export const WORKFLOWS: Record<WorkflowId, WorkflowSpec> = {
  WEBSITE_MIGRATION: MIGRATION,
  WEBSITE_DEVELOPMENT: DEVELOPMENT,
  WEBSITE_MAINTENANCE: MAINTENANCE,
  SEO,
  AI_AGENT,
  AUTOMATION,
  CHATBOT,
  HOSTING_SALES,
  HUMAN_CONTACT,
};

export const WORKFLOW_IDS = Object.keys(WORKFLOWS) as WorkflowId[];

/**
 * Button text and sub-line for an offer to start a workflow.
 *
 * ⚠ COMPOSED HERE, NOT BY THE MODEL, and that is the point of the function
 * existing at all. A label the model wrote could promise anything — "Start your
 * free migration, done today" — and it would appear on a button in the
 * company's own widget, indistinguishable from copy someone approved. These
 * strings are derived from the workflow's own title and its required-field
 * count, so the most a compromised conversation can do is pick WHICH of nine
 * honest buttons appears.
 *
 * The sub-line says how many questions accepting costs. That is the thing a
 * visitor actually wants to know before tapping, and it is a fact about the
 * spec rather than a sales line.
 */
export function actionOfferFor(id: WorkflowId): { label: string; detail: string } {
  const spec = WORKFLOWS[id];
  const required = spec.fields.filter((f) => f.required).length;
  return {
    label: spec.title,
    detail:
      `${required} quick question${required === 1 ? "" : "s"}, then I will put it ` +
      `in front of you to send. Nothing goes to the team until you say so.`,
  };
}

/**
 * Which workflow an intent opens, if any.
 *
 * HOSTING, WORDPRESS and GENERAL_INFORMATION map to nothing on purpose:
 * answering "how much is hosting?" must not start a form. A workflow begins
 * when the visitor wants something DONE, not when they want something known.
 */
export function workflowForIntent(intent: Intent): WorkflowId | null {
  switch (intent) {
    case "WEBSITE_MIGRATION":
      return "WEBSITE_MIGRATION";
    case "WEBSITE_DEVELOPMENT":
      return "WEBSITE_DEVELOPMENT";
    case "WEBSITE_MAINTENANCE":
      return "WEBSITE_MAINTENANCE";
    case "SEO":
      return "SEO";
    case "AI_AGENT":
      return "AI_AGENT";
    case "AUTOMATION":
      return "AUTOMATION";
    case "CHATBOT":
      return "CHATBOT";
    case "SALES":
      return "HOSTING_SALES";
    case "HUMAN_CONTACT":
    case "SUPPORT":
      return "HUMAN_CONTACT";
    default:
      return null;
  }
}

/* ── Record operations ───────────────────────────────────────────────────── */

export function newWorkflow(id: WorkflowId, sourcePage: string): WorkflowRecord {
  const now = Date.now();
  return {
    id,
    stage: "COLLECTING",
    data: {},
    sourcePage,
    createdAt: now,
    updatedAt: now,
  };
}

export type MergeOutcome = {
  /** Field labels accepted on this call. */
  accepted: string[];
  /** Field label → why it was rejected. Fed back to the model to re-ask. */
  rejected: Record<string, string>;
  /** Keys that were not in this workflow's schema at all. */
  unknown: string[];
};

/**
 * Merge model-extracted values into a workflow record.
 *
 * Three rules, all load-bearing:
 *
 *  1. Keys outside the schema are DROPPED, not stored. The model does not get
 *     to invent a field that later prints in a team email.
 *  2. Every value is validated. See `validation.ts` — tool arguments are
 *     untrusted input.
 *  3. A rejected value leaves the previous value intact. A bad re-extraction
 *     must never erase something the visitor already told us correctly.
 *
 * Nothing is merged once the record is SUBMITTED. After that point the record
 * is what the team received, and it must keep matching the email they read.
 */
export function mergeIntoWorkflow(
  record: WorkflowRecord,
  values: Record<string, unknown>,
): MergeOutcome {
  const spec = WORKFLOWS[record.id];
  const outcome: MergeOutcome = { accepted: [], rejected: {}, unknown: [] };
  if (record.stage === "SUBMITTED") return outcome;

  for (const [key, raw] of Object.entries(values)) {
    const field = spec.fields.find((f) => f.key === key);
    if (!field) {
      outcome.unknown.push(key);
      continue;
    }
    // An explicit empty string is "the visitor declined", not a value.
    if (typeof raw === "string" && raw.trim() === "") continue;

    const result = validateField(field, raw);
    if (result.ok) {
      record.data[key] = result.value;
      outcome.accepted.push(field.label);
    } else {
      outcome.rejected[field.label] = result.reason;
    }
  }

  record.stage = missingRequired(record).length === 0 ? "READY_FOR_REVIEW" : "COLLECTING";
  record.updatedAt = Date.now();
  return outcome;
}

/** Required fields still without a value, as schema keys. */
export function missingRequired(record: WorkflowRecord): FieldSpec[] {
  return WORKFLOWS[record.id].fields.filter((f) => f.required && !record.data[f.key]);
}

/** Optional fields still worth asking about, in schema order. */
export function missingOptional(record: WorkflowRecord): FieldSpec[] {
  return WORKFLOWS[record.id].fields.filter((f) => !f.required && !record.data[f.key]);
}

/**
 * The redacted projection the browser is allowed to hold.
 *
 * This is the ONLY function that turns a `WorkflowRecord` into something
 * client-bound. Everything it emits is a value the visitor typed themselves,
 * so showing it back to them discloses nothing new — but it is also not the
 * record, and the submit route reads the record, never this.
 */
export function toView(record: WorkflowRecord): WorkflowView {
  const spec = WORKFLOWS[record.id];
  const collected = spec.fields
    .filter((f) => record.data[f.key])
    .map((f) => ({ label: f.label, value: record.data[f.key] }));

  return {
    id: record.id,
    title: spec.title,
    stage: record.stage,
    collected,
    missing: missingRequired(record).map((f) => f.label),
    requiredCount: spec.fields.filter((f) => f.required).length,
    reference: record.reference,
  };
}
