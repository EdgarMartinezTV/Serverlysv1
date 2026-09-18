import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { LIMITS, sessionSecret } from "./config";
import type { Conversation, Intent, WorkflowRecord } from "./types";

/**
 * Session binding and the conversation store.
 *
 * TWO IDENTIFIERS, AND THE DIFFERENCE IS THE SECURITY BOUNDARY:
 *
 *  · `sessionId` lives in a SIGNED, httpOnly cookie. The browser cannot read
 *    it from JavaScript and cannot forge it without the secret.
 *  · `conversationId` is sent in the request body and appears in team emails,
 *    so it is effectively public.
 *
 * Every read of a conversation requires BOTH, and the stored `sessionId` must
 * match. Without that check, knowing someone's conversation id — which is
 * printed in a notification email — would be enough to read the name, email
 * and phone number they gave Sera. The id alone is therefore never sufficient.
 *
 * ⚠ The store is a process-local Map. It is deliberately not a database: this
 * project has no persistence layer, and adding one for chat transcripts is
 * infrastructure nobody asked for. The consequences are real and accepted —
 * conversations do not survive a restart and do not follow a visitor across
 * instances. SUBMITTED REQUESTS DO NOT LIVE HERE; they are written to a
 * durable sink by `notify/store.ts` before the visitor is told anything.
 * Replacing this Map with Redis is a change to this file alone.
 */

const COOKIE_NAME = "sera_sid";

/* ── Signed session id ───────────────────────────────────────────────────── */

function sign(id: string): string {
  return createHmac("sha256", sessionSecret()).update(id).digest("base64url");
}

/** Constant-time compare that cannot throw on a length mismatch. */
function signatureMatches(expected: string, got: string): boolean {
  const a = Buffer.from(expected);
  const b = Buffer.from(got);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** A fresh session id, unsigned. Pair with `sessionCookie` to set it. */
export function newSessionId(): string {
  return randomBytes(18).toString("base64url");
}

/** Returns the session id from the request, or null if absent or tampered. */
export function readSessionId(request: Request): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;

  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() !== COOKIE_NAME) continue;

    const raw = decodeURIComponent(part.slice(eq + 1).trim());
    const dot = raw.lastIndexOf(".");
    if (dot <= 0) return null;

    const id = raw.slice(0, dot);
    const mac = raw.slice(dot + 1);
    return signatureMatches(sign(id), mac) ? id : null;
  }
  return null;
}

/**
 * The Set-Cookie value for a session id.
 *
 * httpOnly so no script can read it, SameSite=Lax so it survives ordinary
 * navigation but is not sent on cross-site POSTs, and Secure everywhere except
 * local development (where there is no TLS and a Secure cookie is dropped).
 */
export function sessionCookie(id: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const maxAge = Math.floor(LIMITS.sessionTtlMs / 1000);
  return (
    `${COOKIE_NAME}=${encodeURIComponent(`${id}.${sign(id)}`)}` +
    `; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`
  );
}

/* ── Conversation store ──────────────────────────────────────────────────── */

const conversations = new Map<string, Conversation>();

function sweep(now: number) {
  if (conversations.size < 500) return;
  for (const [id, c] of conversations) {
    if (now - c.updatedAt > LIMITS.sessionTtlMs) conversations.delete(id);
  }
}

export function createConversation(sessionId: string, sourcePage: string): Conversation {
  const now = Date.now();
  sweep(now);
  const conversation: Conversation = {
    id: `c_${randomBytes(9).toString("base64url")}`,
    sessionId,
    createdAt: now,
    updatedAt: now,
    sourcePage,
    intent: "UNKNOWN",
    history: [],
    workflow: null,
    submitted: [],
    offered: [],
    turns: 0,
  };
  conversations.set(conversation.id, conversation);
  return conversation;
}

/**
 * Fetch a conversation the caller is entitled to read.
 *
 * Returns null for unknown, expired, or foreign conversations alike. The
 * caller must not distinguish between those cases in anything it says to the
 * visitor — "that conversation belongs to someone else" is itself a leak.
 */
export function getConversation(id: string, sessionId: string): Conversation | null {
  const found = conversations.get(id);
  if (!found) return null;
  if (found.sessionId !== sessionId) return null;
  if (Date.now() - found.updatedAt > LIMITS.sessionTtlMs) {
    conversations.delete(id);
    return null;
  }
  return found;
}

export function touch(conversation: Conversation) {
  conversation.updatedAt = Date.now();
}

export function setIntent(conversation: Conversation, intent: Intent) {
  conversation.intent = intent;
  touch(conversation);
}

export function setWorkflow(conversation: Conversation, workflow: WorkflowRecord | null) {
  conversation.workflow = workflow;
  touch(conversation);
}

/**
 * Trim history to the most recent window.
 *
 * Bounded because the Responses API is billed on input tokens and a long-lived
 * tab would otherwise resend an ever-growing transcript on every keystroke-sized
 * turn. Trimming from the FRONT keeps the recent, load-bearing context — which
 * is also where the visitor's already-stated details are — while the workflow
 * record holds the extracted facts permanently, so dropping an old turn never
 * loses a collected field.
 */
export function trimHistory(conversation: Conversation) {
  const excess = conversation.history.length - LIMITS.maxHistoryItems;
  if (excess > 0) conversation.history.splice(0, excess);
}

/** Test/diagnostic surface. Never exposed through a route. */
export function storeSize(): number {
  return conversations.size;
}
