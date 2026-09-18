import { clientKey } from "@/lib/domains/provider";
import { LIMITS } from "@/lib/sera/config";
import { CHAT_BY_ADDRESS, CHAT_BY_CONVERSATION, check } from "@/lib/sera/rate-limit";
import {
  createConversation,
  getConversation,
  newSessionId,
  readSessionId,
  sessionCookie,
  setWorkflow,
} from "@/lib/sera/session";
import {
  safeNavigationOutcome,
  safePathname,
  safeTitle,
  safeTrail,
  validateMessage,
} from "@/lib/sera/validation";
import { FALLBACK_MESSAGE, runTurn } from "@/lib/sera/ai";
import { errorCategory, log } from "@/lib/sera/observability";
import { WORKFLOW_IDS, newWorkflow, toView } from "@/lib/sera/workflows";
import type { SeraStreamEvent, WorkflowId } from "@/lib/sera/types";

/**
 * POST /api/sera/chat
 *
 * Body: { conversationId?, message, pathname, title? }
 * Returns: NDJSON stream of `SeraStreamEvent`, one per line.
 *
 * This is the ONLY route the widget talks to for conversation, and the only
 * place the OpenAI key is used. The browser holds no credential and reaches no
 * third party — a request from the page can address our origin and nothing
 * else, which is also what the site's CSP (`connect-src 'self'`) enforces.
 *
 * NDJSON rather than SSE: the payload is already JSON, `text/event-stream`
 * would add a framing layer to strip again, and a plain stream of lines
 * survives proxy buffering more predictably behind Traefik.
 *
 * Always dynamic. It reads a cookie, mutates server state and streams — none of
 * which is cacheable, and a cached chat reply would be a different visitor's
 * answer.
 */
export const dynamic = "force-dynamic";

/** Terminal JSON error, for failures that happen before the stream opens. */
function fail(message: string, status: number, headers?: HeadersInit) {
  return new Response(JSON.stringify({ t: "error", message } satisfies SeraStreamEvent), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}

export async function POST(request: Request) {
  // ── Input ───────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return fail("Malformed request.", 400);
  }

  const message = validateMessage(body.message, LIMITS.maxMessageChars);
  if (!message.ok) return fail(message.reason, 400);

  const page = {
    pathname: safePathname(body.pathname),
    trail: safeTrail(body.trail),
    title: safeTitle(body.title),
    navigationOutcome: safeNavigationOutcome(body.navigationOutcome),
  };

  // ── Session ─────────────────────────────────────────────────────────────
  /*
   * The session cookie is issued here rather than anywhere earlier on purpose:
   * a visitor who never opens Sera never receives one. Setting an identifier on
   * every page view to support a widget most people will not use is tracking,
   * and the cookie banner does not cover it.
   */
  const existingSession = readSessionId(request);
  const sessionId = existingSession ?? newSessionId();
  const setCookie = existingSession ? undefined : sessionCookie(sessionId);

  // ── Rate limit ──────────────────────────────────────────────────────────
  const address = check(clientKey(request, "sera-chat"), CHAT_BY_ADDRESS);
  if (!address.ok) {
    /*
     * No address, no key, no fingerprint in the log line. The count of these
     * over time is the abuse signal; identifying who tripped it would mean
     * writing visitor IP addresses into the log, which is the one thing a rate
     * limiter must not require in order to be useful.
     */
    log.warn("rate_limited", { error: "chat_by_address" });
    return fail(
      "That is a lot of messages at once — give me a moment and try again.",
      429,
      { "Retry-After": String(address.retryAfterSeconds) },
    );
  }

  // ── Conversation ────────────────────────────────────────────────────────
  const requestedId = typeof body.conversationId === "string" ? body.conversationId : null;
  let conversation = requestedId ? getConversation(requestedId, sessionId) : null;

  /*
   * An unknown or foreign conversation id silently becomes a NEW conversation
   * rather than an error. Two reasons: after a server restart every client
   * holds a stale id and the alternative is a dead widget, and distinguishing
   * "expired" from "belongs to someone else" in the response would confirm that
   * a given id exists. The visitor loses the thread, not the ability to talk.
   */
  if (!conversation) {
    conversation = createConversation(sessionId, page.pathname);
  }

  /*
   * A quick action may name the workflow it opens, so tapping "Move my
   * website" genuinely STARTS the migration request rather than typing a
   * sentence and hoping the model classifies it the same way twice. Validated
   * against the registry, ignored if a workflow is already under way — a tap
   * must never discard details the visitor has already given.
   */
  const requestedWorkflow = typeof body.startWorkflow === "string" ? body.startWorkflow : null;
  if (
    requestedWorkflow &&
    (WORKFLOW_IDS as string[]).includes(requestedWorkflow) &&
    !conversation.workflow
  ) {
    setWorkflow(
      conversation,
      newWorkflow(requestedWorkflow as WorkflowId, conversation.sourcePage),
    );
  }

  const perConversation = check(`sera-conv:${conversation.id}`, CHAT_BY_CONVERSATION);
  if (!perConversation.ok) {
    log.warn("rate_limited", {
      conversation: conversation.id,
      error: "chat_by_conversation",
    });
    return fail("Give me a second to catch up — try that again shortly.", 429, {
      "Retry-After": String(perConversation.retryAfterSeconds),
    });
  }

  if (conversation.turns >= LIMITS.maxTurnsPerConversation) {
    log.warn("conversation_cap_reached", {
      conversation: conversation.id,
      turns: conversation.turns,
    });
    /*
     * A very long conversation is either someone who genuinely needs a person
     * or someone exercising the endpoint. Both are best served by a handover,
     * and neither by another model call.
     */
    return fail(
      "We have covered a lot here. At this point the Serverlys team can help you " +
        "faster than I can — support@serverlys.com or (305) 671-1272.",
      429,
    );
  }

  // ── Stream ──────────────────────────────────────────────────────────────
  const encoder = new TextEncoder();
  const active = conversation;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const emit = (event: SeraStreamEvent) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          // The client went away mid-answer. Stop writing; the abort signal
          // below unwinds the model call.
          closed = true;
        }
      };

      /*
       * The id goes out FIRST, before any model work. The server may have
       * issued a new conversation (restart, expiry, a stale id), and the client
       * must adopt it even if the turn that follows fails — otherwise the next
       * message starts a third conversation and the visitor repeats themselves.
       */
      emit({
        t: "conversation",
        id: active.id,
        view: active.workflow ? toView(active.workflow) : null,
      });

      try {
        await runTurn({
          conversation: active,
          page,
          message: message.value,
          emit,
          signal: request.signal,
        });
      } catch (error) {
        // `runTurn` handles its own expected failures; reaching here means
        // something unforeseen. Same visitor-facing copy, categorised in the log.
        log.error("route_unhandled", {
          conversation: active.id,
          error: errorCategory(error),
          ok: false,
        });
        emit({ t: "error", message: FALLBACK_MESSAGE });
      } finally {
        closed = true;
        try {
          controller.close();
        } catch {
          /* already closed by an aborted client */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      // Traefik and nginx both buffer proxied responses by default, which would
      // hold the whole answer back and defeat streaming entirely.
      "X-Accel-Buffering": "no",
      ...(setCookie ? { "Set-Cookie": setCookie } : {}),
    },
  });
}
