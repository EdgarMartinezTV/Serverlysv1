import "server-only";
import type { Conversation } from "./types";
import { WORKFLOWS, missingRequired, toView } from "./workflows";
import { renderNotification } from "./notify/templates";
import {
  sendHumanSupportNotification,
  sendLeadNotification,
  sendMigrationNotification,
} from "./notify/provider";
import { newReference, recordRequest, toStoredRequest } from "./notify/store";
import { log, newRequestId } from "./observability";
import { contactChannels } from "./knowledge";
import type { WorkflowView } from "./types";

/**
 * Filing a request with the Serverlys team.
 *
 * THIS IS THE ONLY PLACE A REQUEST IS SUBMITTED, and the model cannot reach it.
 * The chat route's tools can read, collect and summarise; they cannot file.
 * Submission happens when the visitor taps a button, which POSTs to
 * `/api/sera/submit`, which calls this. That separation is what makes "do not
 * submit without explicit confirmation" a property of the SYSTEM rather than a
 * sentence in a prompt that a determined message can talk its way around.
 *
 * It also means the submitted payload is the SERVER'S record — the fields it
 * validated as they were collected — not a body the client sent. A browser
 * cannot file a request containing anything it was not walked through.
 */

export type SubmitOutcome =
  | {
      ok: true;
      reference: string;
      /** True only when a human was actually notified. Never assumed. */
      notified: boolean;
      view: WorkflowView;
      /** Visitor-facing confirmation. Composed here, not by the model. */
      message: string;
      /** Repeat of an earlier submission rather than a new filing. */
      duplicate: boolean;
    }
  | {
      ok: false;
      reason: "incomplete" | "not_ready" | "failed";
      message: string;
      view: WorkflowView | null;
    };

function notifierFor(workflowId: string) {
  switch (workflowId) {
    case "WEBSITE_MIGRATION":
      return sendMigrationNotification;
    case "HUMAN_CONTACT":
      return sendHumanSupportNotification;
    default:
      return sendLeadNotification;
  }
}

/**
 * Confirmation copy.
 *
 * Two versions, and the difference is not cosmetic. When a notification was
 * delivered, a person has it and the visitor is told so. When it was not, the
 * visitor is told the request is SAVED and given the address and phone number
 * that actually work — because claiming "the team has been notified" when no
 * transport is configured is exactly the lie this whole feature must not tell.
 */
function confirmation(reference: string, notified: boolean): string {
  const contact = contactChannels();
  if (notified) {
    return (
      `Done — your request is with the Serverlys team, reference ${reference}. ` +
      `They will reply to the email address you gave me. If anything changes ` +
      `in the meantime, quote that reference to ${contact.email}.`
    );
  }
  return (
    `I have saved your request under reference ${reference}, but I could not ` +
    `confirm it reached the team's inbox from here. So that nothing is left to ` +
    `chance, please send a quick note to ${contact.email} quoting ${reference} — ` +
    `or call ${contact.phone}. Everything you told me is already recorded against ` +
    `that reference.`
  );
}

/**
 * File the conversation's current workflow.
 *
 * Idempotent by construction: once a record carries a `reference` it is
 * SUBMITTED, and a second call returns the original reference instead of
 * filing again. A double tap, a retried request after a flaky connection, or a
 * visitor who reopens the widget and presses the button again all land on the
 * same request rather than three copies in the team's inbox.
 */
export function submitWorkflow(conversation: Conversation): Promise<SubmitOutcome> {
  /*
   * ONE SUBMISSION AT A TIME PER CONVERSATION. The idempotency check below
   * reads `stage`, but the stage only flips after two awaited writes, so a
   * double tap used to pass the check twice and file two requests under two
   * references. A second call while the first is in flight now shares its
   * outcome — same reference, one email.
   */
  const pending = inProgress.get(conversation.id);
  if (pending) return pending;
  const run = fileWorkflow(conversation).finally(() => inProgress.delete(conversation.id));
  inProgress.set(conversation.id, run);
  return run;
}

const inProgress = new Map<string, Promise<SubmitOutcome>>();

async function fileWorkflow(conversation: Conversation): Promise<SubmitOutcome> {
  const request = newRequestId();
  const record = conversation.workflow;

  if (!record) {
    log.warn("submit_rejected", { request, conversation: conversation.id, error: "no_workflow" });
    return {
      ok: false,
      reason: "not_ready",
      message: "There is nothing to send yet.",
      view: null,
    };
  }

  // ── Idempotency ─────────────────────────────────────────────────────────
  if (record.stage === "SUBMITTED" && record.reference) {
    log.info("submit_duplicate", {
      request,
      conversation: conversation.id,
      workflow: record.id,
      reference: record.reference,
    });
    return {
      ok: true,
      reference: record.reference,
      notified: record.notified ?? true,
      view: toView(record),
      duplicate: true,
      message:
        `That one is already with the team under reference ${record.reference} — ` +
        `I have not sent it twice.`,
    };
  }

  // ── Completeness ────────────────────────────────────────────────────────
  const missing = missingRequired(record);
  if (missing.length > 0) {
    /*
     * The COUNT of missing fields, never their names or the values around them.
     * "Still needs 2" is the operational fact; which two is the visitor's
     * business and the team's, not the log aggregator's.
     */
    log.warn("submit_incomplete", {
      request,
      conversation: conversation.id,
      workflow: record.id,
      count: missing.length,
    });
    return {
      ok: false,
      reason: "incomplete",
      message: `I still need: ${missing.map((f) => f.label.toLowerCase()).join(", ")}.`,
      view: toView(record),
    };
  }

  // ── File it ─────────────────────────────────────────────────────────────
  const reference = newReference();
  const entry = toStoredRequest(record, reference, conversation.id);
  const body = renderNotification(record, reference, conversation.id);

  /*
   * Durable write FIRST, then the notification. If the order were reversed, a
   * crash between the two would leave a request a human has been told about but
   * which exists nowhere. This way the worst case is a recorded request that
   * has not been emailed — recoverable by reading the log.
   */
  const startedAt = Date.now();
  const recorded = await recordRequest(entry);
  const delivery = await notifierFor(record.id)(body, {
    reference,
    workflow: record.id,
    conversationId: conversation.id,
    sourcePage: record.sourcePage,
  });

  /*
   * ⚠ EVERYTHING BELOW IS THE VERIFICATION STEP, and it is the reason this
   * function returns `notified` separately from `ok`. The two writes above
   * both report whether they actually worked, and what the visitor is told is
   * derived from those booleans rather than from having reached this line.
   * "The request was sent" is a claim about the world; it needs evidence.
   */
  log.info("submit_verify", {
    request,
    conversation: conversation.id,
    workflow: record.id,
    reference,
    ms: Date.now() - startedAt,
    channel: delivery.channel,
    ok: recorded || delivery.delivered,
  });

  /*
   * Neither channel worked: nothing durable, nobody notified. Saying anything
   * reassuring here would be a fabricated success, so the request is explicitly
   * NOT marked submitted and the visitor is handed the real contact routes. The
   * data they gave is still in the conversation, so they can try again without
   * repeating themselves.
   */
  if (!recorded && !delivery.delivered) {
    const contact = contactChannels();
    log.error("submit_lost", {
      request,
      conversation: conversation.id,
      workflow: record.id,
      reference,
      channel: delivery.channel,
      error: "no_sink_no_delivery",
      ok: false,
    });
    return {
      ok: false,
      reason: "failed",
      message:
        `I could not file that from here, and I am not going to pretend ` +
        `otherwise. Please email ${contact.email} or call ${contact.phone} — ` +
        `everything you told me is still on screen, so you can copy it across.`,
      view: toView(record),
    };
  }

  record.reference = reference;
  record.submittedAt = Date.now();
  record.notified = delivery.delivered;
  record.stage = "SUBMITTED";
  record.updatedAt = Date.now();
  conversation.submitted.push(reference);

  log.info("submit_filed", {
    request,
    conversation: conversation.id,
    workflow: record.id,
    reference,
    channel: delivery.channel,
    ok: delivery.delivered,
  });

  return {
    ok: true,
    reference,
    notified: delivery.delivered,
    view: toView(record),
    duplicate: false,
    message: confirmation(reference, delivery.delivered),
  };
}

/** The workflow's own title, for the confirmation card. */
export function workflowTitle(id: keyof typeof WORKFLOWS): string {
  return WORKFLOWS[id].title;
}
