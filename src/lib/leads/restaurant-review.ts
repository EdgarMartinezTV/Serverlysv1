import "server-only";
import { validateField } from "@/lib/sera/validation";
import type { FieldSpec } from "@/lib/sera/types";
import { newReference, recordRequest, type StoredRequest } from "@/lib/sera/notify/store";
import { sendLeadNotification } from "@/lib/sera/notify/provider";
import type { NotificationBody } from "@/lib/sera/notify/templates";
import { log, newRequestId } from "@/lib/sera/observability";
import { restaurantPlans, restaurantPlanIds } from "@/data/restaurant-plans";

/**
 * The "free restaurant website review" form on /restaurant-websites.
 *
 * IT USES THE SITE'S EXISTING LEAD PIPELINE, NOT A NEW ONE. Sera already
 * owns the only two lead sinks this project has: the durable request log
 * (`notify/store.ts`, JSONL on the `sera` volume in production) and the team
 * notification (`notify/provider.ts`, SERA_WEBHOOK_URL → n8n, or Resend). A
 * form lead is filed through exactly those two calls, gets the same SER-
 * reference format, and lands in the same inbox and the same log, so the team
 * works one queue.
 *
 * Same honesty contract as `sera/submit.ts`: durable write first, then the
 * notification, and the visitor is told "with the team" only when delivery
 * actually succeeded.
 */

export const WORKFLOW = "RESTAURANT_REVIEW";

const SERVICES = {
  website: "New website or redesign",
  menu: "Digital menu and QR code",
  ordering: "Online ordering",
  reservations: "Reservations",
  seo: "Google and local SEO",
  ai: "AI assistant (ConvoAI)",
  unsure: "Not sure — wants a recommendation",
} as const;

type ServiceKey = keyof typeof SERVICES;

const spec = (key: string, label: string, kind: FieldSpec["kind"]): FieldSpec => ({
  key,
  label,
  kind,
  required: true,
  ask: "",
});

const FIELDS = {
  restaurant: spec("restaurant", "Restaurant", "text"),
  contact: spec("contact", "Contact name", "name"),
  website: spec("website", "Website", "url"),
  phone: spec("phone", "Phone", "phone"),
  email: spec("email", "Email", "email"),
  location: spec("location", "Location", "text"),
  message: spec("message", "Notes", "text"),
} as const;

/** Field error codes; the client maps them to localised messages. */
export type FieldError = "required" | "invalid" | "too_long";

export type ParsedLead = {
  restaurant: string;
  contact: string;
  website: string | null;
  phone: string;
  email: string;
  location: string;
  services: ServiceKey[];
  plan: string | null;
  language: "en" | "es";
  message: string | null;
  locale: "en" | "es";
};

export type ParseOutcome =
  | { ok: true; lead: ParsedLead }
  | { ok: false; errors: Record<string, FieldError> };

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** Validate the raw body. Every value is re-checked here; the client is a convenience. */
export function parseLead(body: Record<string, unknown>): ParseOutcome {
  const errors: Record<string, FieldError> = {};
  const out: Partial<ParsedLead> = {};

  const required = (key: keyof typeof FIELDS, max: number) => {
    const raw = str(body[key]).trim();
    if (!raw) {
      errors[key] = "required";
      return "";
    }
    if (raw.length > max) {
      errors[key] = "too_long";
      return "";
    }
    const result = validateField(FIELDS[key], raw);
    if (!result.ok) {
      errors[key] = "invalid";
      return "";
    }
    // Single-line fields: a newline in a restaurant name would forge an extra
    // labelled line in the team email.
    return key === "message" ? result.value : result.value.replace(/\s+/g, " ");
  };

  out.restaurant = required("restaurant", 120);
  out.contact = required("contact", 80);
  out.phone = required("phone", 40);
  out.email = required("email", 200);
  out.location = required("location", 120);

  const noWebsite = body.noWebsite === true;
  if (noWebsite) {
    out.website = null;
  } else {
    const site = required("website", 300);
    out.website = site || null;
  }

  const services = Array.isArray(body.services) ? body.services : [];
  const picked = [...new Set(services.filter((s): s is ServiceKey => typeof s === "string" && s in SERVICES))];
  if (picked.length === 0) errors.services = "required";
  out.services = picked;

  const plan = str(body.plan);
  out.plan = (restaurantPlanIds as readonly string[]).includes(plan) ? plan : null;

  out.language = body.language === "es" ? "es" : "en";
  out.locale = body.locale === "es" ? "es" : "en";

  const message = str(body.message).trim();
  if (message) {
    if (message.length > 1500) errors.message = "too_long";
    else {
      const m = validateField(FIELDS.message, message);
      out.message = m.ok ? m.value : null;
    }
  } else out.message = null;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, lead: out as ParsedLead };
}

const RULE = "─".repeat(58);

function block(label: string, value: string): string {
  if (value.includes("\n")) {
    return `${label}:\n${value
      .split("\n")
      .map((line) => `    ${line}`)
      .join("\n")}`;
  }
  return `${label}: ${value}`;
}

function render(lead: ParsedLead, reference: string, sourcePage: string): NotificationBody {
  const plan = restaurantPlans.find((p) => p.id === lead.plan);
  const lines = [
    "SERVERLYS — NEW RESTAURANT WEBSITE REVIEW REQUEST",
    RULE,
    "",
    block("Reference", reference),
    block("Restaurant", lead.restaurant),
    block("Contact", lead.contact),
    block("Phone", lead.phone),
    block("Email", lead.email),
    block("Location", lead.location),
    block("Website", lead.website ?? "None yet"),
    block("Needs", lead.services.map((s) => SERVICES[s]).join(", ")),
    block("Plan interest", plan ? plan.name : "Not sure yet"),
    block("Preferred language", lead.language === "es" ? "Spanish" : "English"),
  ];
  if (lead.message) lines.push(block("Notes", lead.message));
  lines.push(
    "",
    RULE,
    block("Source page", sourcePage),
    block("Created", new Date().toISOString()),
    "",
    "Filed by the free-review form on the restaurant websites page. The",
    "visitor has been told the team will contact them to set up the review.",
  );
  return {
    subject: `New restaurant website review request — ${lead.restaurant} [${reference}]`,
    text: lines.join("\n"),
  };
}

export type FileOutcome =
  | { ok: true; reference: string; notified: boolean }
  | { ok: false; reason: "failed" };

export async function fileLead(lead: ParsedLead): Promise<FileOutcome> {
  const request = newRequestId();
  const reference = newReference();
  const sourcePage = lead.locale === "es" ? "/es/restaurant-websites" : "/restaurant-websites";

  const entry: StoredRequest = {
    reference,
    workflow: WORKFLOW,
    conversationId: "form",
    sourcePage,
    createdAt: new Date().toISOString(),
    data: {
      restaurant: lead.restaurant,
      contact: lead.contact,
      phone: lead.phone,
      email: lead.email,
      location: lead.location,
      website: lead.website ?? "",
      services: lead.services.join(","),
      plan: lead.plan ?? "",
      language: lead.language,
      ...(lead.message ? { message: lead.message } : {}),
    },
  };

  const startedAt = Date.now();
  const recorded = await recordRequest(entry);
  const delivery = await sendLeadNotification(render(lead, reference, sourcePage), {
    reference,
    workflow: WORKFLOW,
    sourcePage,
  });

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
