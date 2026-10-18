import { LIMITS } from "@/lib/sera/config";
import {
  CHAT_BY_CONVERSATION,
  GLOBAL_CHAT,
  GLOBAL_CHAT_KEY,
  PORTAL_BY_CLIENT,
  check,
  checkAll,
} from "@/lib/sera/rate-limit";
import {
  createConversation,
  getConversation,
  newSessionId,
  readSessionId,
  sessionCookie,
} from "@/lib/sera/session";
import { validateMessage } from "@/lib/sera/validation";
import { readBodyText } from "@/lib/request";
import { verifyPortalRequest } from "@/lib/sera/customer";
import { FALLBACK_MESSAGE, runTurn } from "@/lib/sera/ai";
import { errorCategory, log } from "@/lib/sera/observability";
import type { SeraStreamEvent } from "@/lib/sera/types";

/**
 * POST /api/sera/portal — Sera inside the signed-in client area.
 *
 * Called ONLY by the WHMCS hook (`serverlys_portal.php`), server to server,
 * never by a browser. The hook has already checked the WHMCS session and CSRF
 * token; it sends the question plus a snapshot of that client's own account and
 * signs the request with SERA_PORTAL_SECRET (see `lib/sera/customer.ts`).
 *
 * Header: X-Sera-Portal: t=<unix seconds>,s=<hex HMAC-SHA256 of "<t>.<raw body>">
 * Body:   { message, conversationId?, account: { clientId, firstName, asOf,
 *           invoices: { unpaid, recent, unpaidTotal } | null,
 *           domains: [...] | null, services: [...] | null } }
 * Returns: the same NDJSON stream as /api/sera/chat, plus `portal-action`
 * events (an id the portal turns into its own Pay / Renew button).
 *
 * Separate from /api/sera/chat on purpose: the public route has no way to
 * become this one. Its turns never carry a customer, so the account tools are
 * neither described to the model nor runnable there.
 */
export const dynamic = "force-dynamic";

/** Room for a snapshot of 50 invoices, domains and services each. */
const MAX_PORTAL_BODY_BYTES = 128 * 1024;

function fail(message: string, status: number, headers?: HeadersInit) {
  return new Response(
    JSON.stringify({ t: "error", message } satisfies SeraStreamEvent),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        ...headers,
      },
    },
  );
}

export async function POST(request: Request) {
  // ── Who is asking ───────────────────────────────────────────────────────
  const raw = await readBodyText(request, MAX_PORTAL_BODY_BYTES);
  if (!raw.ok) return fail(raw.reason, raw.status);

  const verdict = verifyPortalRequest(request.headers.get("x-sera-portal"), raw.value);
  if (!verdict.ok) {
    // No detail on why: "bad signature" vs "stale" helps nobody legitimate.
    log.warn("portal_refused", { error: `portal_${verdict.status}` });
    return fail(verdict.reason, verdict.status);
  }
  const { customer, body } = verdict;

  const message = validateMessage(body.message, LIMITS.maxMessageChars);
  if (!message.ok) return fail(message.reason, 400);

  // ── Rate limit ──────────────────────────────────────────────────────────
  /*
   * Keyed on the CLIENT, not the address: every portal request arrives from the
   * WHMCS server's one IP, so a per-address bucket would be shared by every
   * customer at once. The global ceiling still bounds the OpenAI bill.
   */
  const limited = checkAll([
    [GLOBAL_CHAT_KEY, GLOBAL_CHAT],
    [`sera-portal:${customer.clientId}`, PORTAL_BY_CLIENT],
  ]);
  if (!limited.ok) {
    log.warn("rate_limited", {
      error: limited.failed === 0 ? "chat_global_ceiling" : "portal_by_client",
    });
    return fail(
      "That is a lot of questions at once. Give me a moment and try again.",
      429,
      { "Retry-After": String(limited.retryAfterSeconds) },
    );
  }

  // ── Conversation ────────────────────────────────────────────────────────
  const existingSession = readSessionId(request);
  const sessionId = existingSession ?? newSessionId();
  const setCookie = existingSession ? undefined : sessionCookie(sessionId);

  const requestedId =
    typeof body.conversationId === "string" ? body.conversationId : null;
  let conversation = requestedId ? getConversation(requestedId, sessionId) : null;
  /*
   * A conversation belongs to ONE client. If the WHMCS session switched
   * accounts (a user linked to two clients), the old thread — which holds the
   * other client's invoices in its history — is not continued.
   */
  if (conversation && conversation.customerId !== customer.clientId)
    conversation = null;
  if (!conversation) {
    conversation = createConversation(sessionId, "/clientarea.php");
    conversation.customerId = customer.clientId;
  }

  const perConversation = check(`sera-conv:${conversation.id}`, CHAT_BY_CONVERSATION);
  if (!perConversation.ok) {
    return fail("Give me a second to catch up — try that again shortly.", 429, {
      "Retry-After": String(perConversation.retryAfterSeconds),
    });
  }
  if (conversation.turns >= LIMITS.maxTurnsPerConversation) {
    return fail(
      "We have covered a lot here. Start a new chat, or open a ticket and the team will take it from here.",
      429,
    );
  }

  // ── Stream ──────────────────────────────────────────────────────────────
  const encoder = new TextEncoder();
  const active = conversation;
  const page = { pathname: "/clientarea.php", title: "Serverlys client area" };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const emit = (event: SeraStreamEvent) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          closed = true;
        }
      };

      emit({ t: "conversation", id: active.id, view: null });

      try {
        await runTurn({
          conversation: active,
          page,
          message: message.value,
          emit,
          signal: request.signal,
          customer,
        });
      } catch (error) {
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
          /* already closed */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
      ...(setCookie ? { "Set-Cookie": setCookie } : {}),
    },
  });
}
