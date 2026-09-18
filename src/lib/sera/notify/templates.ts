import { WORKFLOWS } from "../workflows";
import type { WorkflowRecord } from "../types";

/**
 * The team notification body.
 *
 * WRITTEN FOR A PERSON WITH A QUEUE, not for a system. Whoever opens this is
 * deciding in about four seconds whether they can act on it now, so the shape
 * is: what it is, who it is, what they need, then everything else. Labels are
 * left-aligned and the values are not padded into columns — proportional fonts
 * in mail clients destroy column alignment, and a "tidy" table that arrives
 * ragged reads worse than plain lines.
 *
 * PLAIN TEXT, DELIBERATELY. HTML mail here would buy formatting and cost
 * escaping: every value in this body is visitor-supplied, and the one thing
 * that must never happen is a lead that renders as markup in someone's inbox.
 * Text has no such failure mode. `validation.ts` has already stripped the
 * control characters that would let a value forge an extra labelled line.
 */

const RULE = "─".repeat(58);

function block(label: string, value: string): string {
  // Multi-line values are indented as a block so they can never be mistaken
  // for further label lines.
  if (value.includes("\n")) {
    return `${label}:\n${value
      .split("\n")
      .map((line) => `    ${line}`)
      .join("\n")}`;
  }
  return `${label}: ${value}`;
}

export type NotificationBody = {
  subject: string;
  text: string;
};

export function renderNotification(
  record: WorkflowRecord,
  reference: string,
  conversationId: string,
): NotificationBody {
  const spec = WORKFLOWS[record.id];

  const lines: string[] = [
    `SERVERLYS — ${spec.subject.toUpperCase()}`,
    RULE,
    "",
    block("Reference", reference),
    block("Request type", spec.title),
    "",
  ];

  /*
   * Schema order, not insertion order. The schema is arranged the way the team
   * reads a request; insertion order is the arbitrary sequence the conversation
   * happened to take, which differs every time and makes two requests of the
   * same kind impossible to compare at a glance.
   */
  const present = spec.fields.filter((field) => record.data[field.key]);
  for (const field of present) {
    lines.push(block(field.label, record.data[field.key]));
  }

  const missing = spec.fields.filter((f) => !f.required && !record.data[f.key]);
  if (missing.length > 0) {
    lines.push(
      "",
      `Not asked: ${missing.map((f) => f.label).join(", ")}`,
    );
  }

  lines.push(
    "",
    RULE,
    block("Source page", record.sourcePage),
    block("Conversation ID", conversationId),
    block("Created", new Date().toISOString()),
    "",
    "Filed by Sera, the Serverlys AI assistant. The customer has been told",
    "the team will follow up — this request is a commitment, not a lead list",
    "entry.",
  );

  return {
    subject: `${spec.subject} — ${summaryLine(record)} [${reference}]`,
    text: lines.join("\n"),
  };
}

/**
 * The half-sentence after the subject stem.
 *
 * The inbox list view truncates hard, so the most identifying value goes
 * first: the domain for anything site-shaped, the person otherwise. "New
 * website migration request — example.com" is triageable from the list;
 * "New website migration request" is not.
 */
function summaryLine(record: WorkflowRecord): string {
  return (
    record.data.domain ??
    record.data.websiteUrl ??
    record.data.currentUrl ??
    record.data.businessName ??
    record.data.name ??
    "details inside"
  );
}
