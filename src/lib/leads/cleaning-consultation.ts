import "server-only";
import { validateField } from "@/lib/sera/validation";
import type { FieldSpec } from "@/lib/sera/types";
import { newReference, recordRequest, type StoredRequest } from "@/lib/sera/notify/store";
import { sendLeadNotification } from "@/lib/sera/notify/provider";
import type { NotificationBody } from "@/lib/sera/notify/templates";
import { log, newRequestId } from "@/lib/sera/observability";

/**
 * The free-consultation form on /cleaning-company-websites.
 *
 * SAME PIPELINE AS EVERY OTHER LEAD (see restaurant-review.ts): the durable
 * request log first, then the team notification, one SER- reference, one
 * inbox. The visitor is told "with the team" only when delivery succeeded.
 */

export const WORKFLOW = "CLEANING_CONSULTATION";

export const BUSINESS_TYPES = {
  residential: "Residential / maid service",
  commercial: "Commercial / janitorial",
  both: "Residential and commercial",
  specialty: "Specialty (carpet, post-construction, Airbnb)",
  other: "Other",
} as const;

export const SERVICES = {
  website: "New website",
  redesign: "Redesign current site",
  quote: "Quote requests or estimator",
  booking: "Booking integration",
  seo: "Local SEO",
  bilingual: "English and Spanish",
  hosting: "Hosting and maintenance",
  ai: "ConvoAI chatbot",
} as const;

export const BUDGETS = {
  under1500: "Under $1,500",
  b1500: "$1,500 – $2,500",
  b2500: "$2,500 – $5,000",
  over5000: "$5,000+",
  unsure: "Not sure yet",
} as const;

type BusinessType = keyof typeof BUSINESS_TYPES;
type Service = keyof typeof SERVICES;
type Budget = keyof typeof BUDGETS;

const spec = (key: string, label: string, kind: FieldSpec["kind"]): FieldSpec => ({ key, label, kind, required: true, ask: "" });

const FIELDS = {
  name: spec("name", "Full name", "name"),
  company: spec("company", "Company", "text"),
  email: spec("email", "Email", "email"),
  phone: spec("phone", "Phone", "phone"),
  city: spec("city", "City", "text"),
  website: spec("website", "Website", "url"),
  notes: spec("notes", "Notes", "text"),
} as const;

export type FieldError = "required" | "invalid" | "too_long";

export type ParsedLead = {
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  website: string | null;
  type: BusinessType;
  services: Service[];
  budget: Budget;
  notes: string | null;
  locale: "en" | "es";
};

export type ParseOutcome = { ok: true; lead: ParsedLead } | { ok: false; errors: Record<string, FieldError> };

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** Validate the raw body. Every value is re-checked here; the client is a convenience. */
export function parseLead(body: Record<string, unknown>): ParseOutcome {
  const errors: Record<string, FieldError> = {};

  const field = (key: keyof typeof FIELDS, max: number, optional = false): string | null => {
    const raw = str(body[key]).trim();
    if (!raw) {
      if (!optional) errors[key] = "required";
      return null;
    }
    if (raw.length > max) {
      errors[key] = "too_long";
      return null;
    }
    const result = validateField(FIELDS[key], raw);
    if (!result.ok) {
      errors[key] = "invalid";
      return null;
    }
    // Single-line fields: a newline would forge an extra labelled line in the email.
    return key === "notes" ? result.value : result.value.replace(/\s+/g, " ");
  };

  const name = field("name", 80);
  const company = field("company", 120);
  const email = field("email", 200);
  const phone = field("phone", 40);
  const city = field("city", 80);
  const website = field("website", 300, true);
  const notes = field("notes", 1500, true);

  const type = str(body.type);
  if (!(type in BUSINESS_TYPES)) errors.type = "required";
  const budget = str(body.budget);
  if (!(budget in BUDGETS)) errors.budget = "required";

  const raw = Array.isArray(body.services) ? body.services : [];
  const services = [...new Set(raw.filter((s): s is Service => typeof s === "string" && s in SERVICES))];
  if (services.length === 0) errors.services = "required";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    lead: {
      name: name!,
      company: company!,
      email: email!,
      phone: phone!,
      city: city!,
      website,
      type: type as BusinessType,
      services,
      budget: budget as Budget,
      notes,
      locale: body.locale === "es" ? "es" : "en",
    },
  };
}

const RULE = "─".repeat(58);

function block(label: string, value: string): string {
  if (value.includes("\n")) return `${label}:\n${value.split("\n").map((l) => `    ${l}`).join("\n")}`;
  return `${label}: ${value}`;
}

function render(lead: ParsedLead, reference: string, sourcePage: string): NotificationBody {
  const lines = [
    "SERVERLYS — NEW CLEANING COMPANY WEBSITE CONSULTATION",
    RULE,
    "",
    block("Reference", reference),
    block("Name", lead.name),
    block("Company", lead.company),
    block("Email", lead.email),
    block("Phone", lead.phone),
    block("City", lead.city),
    block("Website", lead.website ?? "None yet"),
    block("Business type", BUSINESS_TYPES[lead.type]),
    block("Interested in", lead.services.map((s) => SERVICES[s]).join(", ")),
    block("Budget", BUDGETS[lead.budget]),
    block("Page language", lead.locale === "es" ? "Spanish" : "English"),
  ];
  if (lead.notes) lines.push(block("Notes", lead.notes));
  lines.push(
    "",
    RULE,
    block("Source page", sourcePage),
    block("Created", new Date().toISOString()),
    "",
    "Filed by the consultation form on the cleaning company websites page.",
    "The visitor has been told the team will contact them to schedule it.",
  );
  return { subject: `New cleaning website consultation — ${lead.company} [${reference}]`, text: lines.join("\n") };
}

export type FileOutcome = { ok: true; reference: string; notified: boolean } | { ok: false; reason: "failed" };

export async function fileLead(lead: ParsedLead): Promise<FileOutcome> {
  const request = newRequestId();
  const reference = newReference();
  const sourcePage = lead.locale === "es" ? "/es/cleaning-company-websites" : "/cleaning-company-websites";

  const entry: StoredRequest = {
    reference,
    workflow: WORKFLOW,
    conversationId: "form",
    sourcePage,
    createdAt: new Date().toISOString(),
    data: {
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      city: lead.city,
      website: lead.website ?? "",
      type: lead.type,
      services: lead.services.join(","),
      budget: lead.budget,
      ...(lead.notes ? { notes: lead.notes } : {}),
    },
  };

  const startedAt = Date.now();
  const recorded = await recordRequest(entry);
  const delivery = await sendLeadNotification(render(lead, reference, sourcePage), { reference, workflow: WORKFLOW, sourcePage });

  log.info("form_lead_verify", {
    request,
    workflow: WORKFLOW,
    reference,
    ms: Date.now() - startedAt,
    channel: delivery.channel,
    ok: recorded || delivery.delivered,
  });

  if (!recorded && !delivery.delivered) {
    log.error("form_lead_lost", { request, workflow: WORKFLOW, reference, channel: delivery.channel, ok: false });
    return { ok: false, reason: "failed" };
  }
  return { ok: true, reference, notified: delivery.delivered };
}
