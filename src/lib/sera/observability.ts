import "server-only";
import { randomBytes } from "node:crypto";

/**
 * Structured server-side logging for Sera.
 *
 * WHY NOT JUST `console.error`. Because the questions worth asking after the
 * fact are aggregate questions — which tool fails most, how long a turn really
 * takes, whether one conversation is being driven by a script — and none of
 * them can be answered by grepping prose. Every line this emits is one JSON
 * object on one line with a stable set of keys, so `jq` answers them.
 *
 * ⚠ REDACTION IS STRUCTURAL, NOT A HABIT. `log()` accepts only a fixed set of
 * fields, all of them scalars chosen to be non-identifying, and there is no
 * escape hatch for "just this one extra object". The reason is the obvious one:
 * Sera's conversations contain names, email addresses, phone numbers and domain
 * names, and the easiest way for those to end up in a log aggregator forever is
 * for someone to add `{ ...record.data }` to a debug line during an incident.
 * There is nowhere here to put it.
 *
 * What is deliberately ABSENT from every field below: message text, field
 * values, tool arguments, tool results, the visitor's address, the session id,
 * provider error bodies, and anything read from the environment. `conversation`
 * is a server-issued opaque handle and is the join key; it identifies a thread,
 * not a person.
 */

/** One line's worth of structured context. All optional, all non-identifying. */
export type LogFields = {
  /** Per-HTTP-request id. Ties every line from one turn together. */
  request?: string;
  /** Server-issued conversation handle. The join key across turns. */
  conversation?: string;
  /** Tool name from the closed registry. Never a model-supplied string. */
  tool?: string;
  /** Registry classification, so a log reader sees the risk tier. */
  permission?: string;
  /** Policy verdict code on a refusal. */
  verdict?: string;
  /** Workflow id from the fixed set. */
  workflow?: string;
  /** Agent phase. See `phases.ts`. */
  phase?: string;
  /** Wall-clock milliseconds the operation took. */
  ms?: number;
  /** Whether the operation did what it set out to do. */
  ok?: boolean;
  /**
   * A CATEGORY, not a message. `provider_http`, `timeout`, `invalid_arguments`
   * — a fixed vocabulary that can be counted. Provider strings and exception
   * messages carry account ids, model names and occasionally request bodies,
   * and none of that belongs in a log line that may be shipped off-host.
   */
  error?: string;
  /** Model turns spent on this conversation so far. Cost signal. */
  turns?: number;
  /** Delivery channel actually used, e.g. "resend". Never its credentials. */
  channel?: string;
  /** Reference issued at submission. Already printed in team email; not secret. */
  reference?: string;
  /** Count, where an event is about a quantity (tool rounds, fields saved). */
  count?: number;
};

type Level = "info" | "warn" | "error";

/**
 * A per-request id.
 *
 * Short and random rather than a UUID: it is read by a human correlating lines
 * during an incident, it never leaves the logs, and nine base64url characters
 * is more than enough to be unique among the lines of one day.
 */
export function newRequestId(): string {
  return `r_${randomBytes(6).toString("base64url")}`;
}

function emit(level: Level, event: string, fields: LogFields) {
  /*
   * Built key by key rather than spread, so a caller who passes an unexpected
   * property — a whole record, a raw error — has it dropped here instead of
   * serialised. The type already forbids it; this is what happens when someone
   * casts around the type at 3am.
   */
  const line: Record<string, unknown> = {
    at: new Date().toISOString(),
    lvl: level,
    src: "sera",
    event,
  };
  const keys: (keyof LogFields)[] = [
    "request", "conversation", "tool", "permission", "verdict", "workflow",
    "phase", "ms", "ok", "error", "turns", "channel", "reference", "count",
  ];
  for (const key of keys) {
    const value = fields[key];
    if (value !== undefined) line[key] = value;
  }

  const serialised = JSON.stringify(line);
  if (level === "error") console.error(serialised);
  else if (level === "warn") console.warn(serialised);
  else console.info(serialised);
}

export const log = {
  info: (event: string, fields: LogFields = {}) => emit("info", event, fields),
  warn: (event: string, fields: LogFields = {}) => emit("warn", event, fields),
  error: (event: string, fields: LogFields = {}) => emit("error", event, fields),
};

/**
 * Reduce an unknown thrown value to a countable category.
 *
 * ⚠ THE MESSAGE IS DISCARDED ON PURPOSE. An OpenAI error message can contain
 * the organisation id, the model name and a fragment of the request; a `fetch`
 * failure can contain an internal hostname. What a log needs is which KIND of
 * failure this was, which is what can be counted and alerted on. The full
 * error is still visible in a stack trace during local development, where it
 * is being read by the person who caused it.
 */
export function errorCategory(error: unknown): string {
  if (error instanceof Error) {
    const name = error.name;
    if (name === "AbortError") return "aborted";
    if (name === "TimeoutError") return "timeout";
    if (name === "SyntaxError") return "malformed_json";
    /*
     * The OpenAI SDK exposes `status` on its errors. The number is a category
     * already — 401 is a bad key, 429 is a rate limit, 5xx is theirs — and it
     * is the single most useful thing to be able to count.
     */
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number") return `provider_http_${status}`;
    return `error_${name.toLowerCase()}`;
  }
  return "unknown";
}

/** Time an async operation and hand back both the value and the duration. */
export async function timed<T>(run: () => Promise<T>): Promise<{ value: T; ms: number }> {
  const started = Date.now();
  const value = await run();
  return { value, ms: Date.now() - started };
}
