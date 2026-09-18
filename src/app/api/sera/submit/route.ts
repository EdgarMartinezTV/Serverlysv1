import { NextResponse } from "next/server";
import { clientKey } from "@/lib/domains/provider";
import { readJsonObject } from "@/lib/request";
import { SUBMIT_BY_ADDRESS, check } from "@/lib/sera/rate-limit";
import { getConversation, readSessionId } from "@/lib/sera/session";
import { submitWorkflow } from "@/lib/sera/submit";
import { contactChannels } from "@/lib/sera/knowledge";
import { log } from "@/lib/sera/observability";

/**
 * POST /api/sera/submit
 *
 * Body: { conversationId }
 * Files the conversation's collected request with the Serverlys team.
 *
 * ⚠ THE BODY CARRIES NO REQUEST DATA, AND THAT IS THE DESIGN. The only thing
 * the client sends is which conversation to file; every field comes from the
 * server's own record, built one validated value at a time as the conversation
 * went along. A browser therefore cannot submit a request containing anything
 * it was not walked through, and a tampered payload has nothing to tamper with.
 *
 * It is also the reason this is a separate route from `/chat` rather than a
 * tool. The model can prepare a request; only a deliberate act by the visitor
 * sends one. "Requires explicit confirmation" is enforced by there being no
 * code path from the model to this handler at all — not by an instruction the
 * model is asked to respect.
 *
 * Always dynamic: it reads a cookie and mutates state.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = await readJsonObject(request);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, message: parsed.reason }, { status: parsed.status });
  }
  const conversationId: unknown = parsed.value.conversationId;

  if (typeof conversationId !== "string" || conversationId.length > 64) {
    return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 });
  }

  const limit = check(clientKey(request, "sera-submit"), SUBMIT_BY_ADDRESS);
  if (!limit.ok) {
    /*
     * The email-abuse ceiling. Five filings per address per ten minutes, and
     * every one of those five still has to be a separately completed
     * conversation with a distinct workflow record — `submitWorkflow` is
     * idempotent per record, so re-tapping send cannot consume the budget.
     * Reaching this means something is driving the endpoint.
     */
    log.warn("rate_limited", { error: "submit_by_address" });
    return NextResponse.json(
      { ok: false, message: "Too many submissions in a row. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  /*
   * No cookie, no submission. The session id is the proof that this browser is
   * the one that had the conversation — without it, a conversation id lifted
   * from a notification email would be enough to re-file someone else's
   * request. See the note in `session.ts`.
   */
  const sessionId = readSessionId(request);
  const conversation = sessionId ? getConversation(conversationId, sessionId) : null;

  if (!conversation) {
    const contact = contactChannels();
    log.warn("submit_no_session", { error: sessionId ? "unknown_conversation" : "no_cookie" });
    /*
     * Expired, unknown and foreign are answered identically — distinguishing
     * them would confirm which conversation ids exist. The copy assumes the
     * common cause (a restart or a long-idle tab) and gives a route that works.
     */
    return NextResponse.json(
      {
        ok: false,
        message:
          `I have lost the thread of that conversation, so I cannot send it from ` +
          `here. Email ${contact.email} or call ${contact.phone} and the team will ` +
          `pick it up.`,
      },
      { status: 404 },
    );
  }

  const outcome = await submitWorkflow(conversation);

  return NextResponse.json(outcome, {
    status: outcome.ok ? 200 : outcome.reason === "failed" ? 502 : 400,
    headers: { "Cache-Control": "no-store" },
  });
}
