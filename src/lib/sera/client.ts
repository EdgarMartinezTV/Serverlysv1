import type { SeraStreamEvent, WorkflowId, WorkflowView } from "./types";

/**
 * The browser side of the wire.
 *
 * Deliberately free of React: parsing a stream and posting a form are not
 * rendering concerns, and keeping them out of the components means the
 * protocol can be tested, changed or reused without touching the UI.
 *
 * ⚠ NO SECRETS AND NO THIRD PARTY. Everything here addresses our own origin.
 * The OpenAI key lives in `config.ts`, which is `server-only`, and the site's
 * CSP allows `connect-src 'self'` — a build that tried to call a provider from
 * the browser would fail at the module boundary and again at the browser.
 */

/* ── Chat ────────────────────────────────────────────────────────────────── */

export type ChatRequest = {
  conversationId: string | null;
  message: string;
  pathname: string;
  /** Recent pathnames this page load, oldest first. Capped by the caller. */
  trail?: readonly string[];
  title?: string;
  /** Starts this workflow server-side before the turn. Used by quick actions. */
  startWorkflow?: WorkflowId;
  /**
   * Whether the last navigation Sera announced actually happened, reported once
   * it has settled.
   *
   * ⚠ WITHOUT THIS THE MODEL IS BLIND TO ITS OWN ANNOUNCEMENT. It sees that it
   * called `offer_to_show` and nothing after — and since it speaks in future
   * tense ("let me open the plans"), it cannot tell whether the page opened or
   * whether they pressed "Stay here". A visitor who stopped it and then said
   * "actually, show me" got nothing, because from the model's side it had
   * already done the only thing it could do.
   */
  navigationOutcome?: { label: string; accepted: boolean };
};

/**
 * POST a message and yield events as they arrive.
 *
 * An async generator rather than a callback bag: the consumer drives, so
 * cancelling is `break`, and back-pressure and error propagation come for free
 * from the language instead of from a hand-rolled subscription.
 */
export async function* streamChat(
  request: ChatRequest,
  signal: AbortSignal,
): AsyncGenerator<SeraStreamEvent> {
  const response = await fetch("/api/sera/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    // The session cookie is httpOnly and same-origin; this is what sends it.
    credentials: "same-origin",
    signal,
  });

  /*
   * A non-streaming failure (400, 429, 503) comes back as a single JSON object
   * with the same `error` shape, so both paths converge on one event type and
   * the UI needs no separate branch for "the request failed before it started".
   */
  if (!response.ok || !response.body) {
    try {
      const body = (await response.json()) as SeraStreamEvent;
      if (body && typeof body === "object" && "t" in body) {
        yield body;
        return;
      }
    } catch {
      /* fall through to the generic message */
    }
    yield { t: "error", message: GENERIC_ERROR };
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      /*
       * Split on newline, keep the remainder. A chunk boundary can fall inside
       * a JSON object — which it reliably does once an answer is long enough —
       * and parsing the fragment would drop text the visitor already saw
       * streaming in.
       */
      let newline = buffer.indexOf("\n");
      while (newline !== -1) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (line) {
          const event = parseEvent(line);
          if (event) yield event;
        }
        newline = buffer.indexOf("\n");
      }
    }

    const tail = buffer.trim();
    if (tail) {
      const event = parseEvent(tail);
      if (event) yield event;
    }
  } finally {
    // Releasing matters on abort: an unreleased reader holds the connection.
    reader.releaseLock();
  }
}

function parseEvent(line: string): SeraStreamEvent | null {
  try {
    const parsed = JSON.parse(line);
    return parsed && typeof parsed === "object" && "t" in parsed
      ? (parsed as SeraStreamEvent)
      : null;
  } catch {
    // A malformed line is a bug on our side, not something to show a visitor.
    return null;
  }
}

/* ── Submission ──────────────────────────────────────────────────────────── */

export type SubmitResponse =
  | {
      ok: true;
      reference: string;
      notified: boolean;
      view: WorkflowView;
      message: string;
      duplicate: boolean;
    }
  | { ok: false; message: string; view: WorkflowView | null };

export const GENERIC_ERROR =
  "I am having trouble connecting right now. You can still reach the Serverlys " +
  "team at support@serverlys.com or (305) 671-1272.";

/**
 * File the request the server has been collecting.
 *
 * Note what is NOT sent: any of the collected data. The server files its own
 * validated record — see the header of `app/api/sera/submit/route.ts`.
 */
export async function submitRequest(conversationId: string): Promise<SubmitResponse> {
  try {
    const response = await fetch("/api/sera/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId }),
      credentials: "same-origin",
    });
    const body = (await response.json()) as SubmitResponse;
    if (body && typeof body === "object" && "ok" in body) return body;
    return { ok: false, message: GENERIC_ERROR, view: null };
  } catch {
    return { ok: false, message: GENERIC_ERROR, view: null };
  }
}
