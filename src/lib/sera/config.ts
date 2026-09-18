import "server-only";

/**
 * Sera's server-side configuration.
 *
 * `import "server-only"` is the guard that matters: if any client component
 * ever imports this module — directly or through a barrel — the build FAILS
 * instead of quietly shipping `OPENAI_API_KEY` in a JavaScript chunk. That is
 * the single most important line in the Sera feature.
 *
 * Values are read inside functions rather than at module scope so a missing
 * optional variable never breaks `next build`. This matches `lib/env.ts`,
 * which does the same for the WHMCS credentials.
 */

/**
 * The model Sera runs on.
 *
 * `gpt-4.1-mini` is the default because it is the cheapest model that reliably
 * does multi-field extraction AND tool calling in one turn, which is the whole
 * job here. Override with OPENAI_MODEL — the code makes no assumption about
 * the family beyond "supports the Responses API with function tools".
 */
const DEFAULT_MODEL = "gpt-4.1-mini";

export type OpenAiConfig = {
  apiKey: string;
  model: string;
};

/** Null when the deployment has no key. Callers must degrade, not throw. */
export function openAiConfig(): OpenAiConfig | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  return { apiKey, model: process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL };
}

/**
 * Secret used to sign the session cookie.
 *
 * Falls back to a per-process random value. That is a real behaviour, not a
 * placeholder: sessions survive as long as the process does, which is exactly
 * as long as the in-memory conversation store survives anyway. Set
 * SERA_SESSION_SECRET once you run more than one instance, or sessions will
 * break on every request that lands on a different container.
 */
let ephemeralSecret: string | null = null;
export function sessionSecret(): string {
  const configured = process.env.SERA_SESSION_SECRET?.trim();
  if (configured) return configured;
  if (!ephemeralSecret) {
    ephemeralSecret = crypto.randomUUID() + crypto.randomUUID();
  }
  return ephemeralSecret;
}

/** Where team notifications go. Falls back to the published support address. */
export function teamEmail(): string {
  return process.env.SERA_TEAM_EMAIL?.trim() || "support@serverlys.com";
}

/** Envelope sender. Must be a domain the email provider has verified. */
export function emailFrom(): string {
  return process.env.SERA_EMAIL_FROM?.trim() || "sera@serverlys.com";
}

/**
 * Cost ceilings. These are not rate limits — they bound a SINGLE well-behaved
 * conversation so one open tab cannot run up an unbounded bill.
 */
export const LIMITS = {
  /** Model turns per conversation, across its whole lifetime. */
  maxTurnsPerConversation: 60,
  /** Characters accepted in one visitor message. */
  maxMessageChars: 2_000,
  /** History items kept before the oldest are dropped. */
  maxHistoryItems: 60,
  /** Tool-call rounds inside one turn, before the loop is cut off. */
  maxToolRounds: 4,
  /** Conversation idle TTL. */
  sessionTtlMs: 6 * 60 * 60 * 1000,
} as const;
