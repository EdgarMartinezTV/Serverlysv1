import { parseDomainInput } from "@/lib/domains/normalize";
import type { FieldSpec } from "./types";

/**
 * Field validation and normalisation.
 *
 * EVERY value that reaches a workflow record passes through here, including —
 * especially — values the MODEL extracted. A tool call is untrusted input: the
 * model can hallucinate a field, echo an injected instruction into one, or hand
 * back 40KB of text. Treating its arguments as pre-validated would put
 * attacker-controlled strings straight into a team member's inbox.
 *
 * Hand-rolled rather than pulling in a schema library, matching the reasoning
 * in `lib/env.ts`: a handful of field kinds, all strings, and the check is a
 * few lines each. Domain parsing is the exception and reuses the site's
 * existing parser rather than growing a second, subtly different one.
 */

/** Longest value any single field accepts. Notes get their own, larger cap. */
const MAX_VALUE = 400;
const MAX_NOTES = 1_500;

export type FieldOutcome =
  | { ok: true; value: string }
  | { ok: false; reason: string };

/** C0 controls and DEL, minus tab and newline. */
const CONTROLS_KEEP_BREAKS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
/** C0 controls and DEL, including tab and newline. */
const CONTROLS_ALL = /[\u0000-\u001F\u007F]/g;

/**
 * Collapse whitespace and strip control characters.
 *
 * The control-character strip is not cosmetic. These values are rendered into
 * a plain-text email; a bare CR or LF in a value the model produced would let
 * injected content forge extra labelled lines ("Urgency: emergency") in the
 * team notification. Newlines survive only in `text` fields, which the template
 * renders as an indented block rather than as label lines.
 */
function clean(raw: string, keepNewlines = false): string {
  if (keepNewlines) {
    return raw
      .replace(/\r\n?/g, "\n")
      .replace(CONTROLS_KEEP_BREAKS, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  return raw.replace(CONTROLS_ALL, " ").replace(/\s+/g, " ").trim();
}

/**
 * Deliberately permissive: one @, a dot in the domain, no spaces.
 *
 * Tightening this past RFC-plausible shapes rejects real addresses, and the
 * only thing that actually proves an address works is sending to it. A wrong
 * address that looks right is a follow-up the team makes and fails at; a right
 * address this rejects is a lead lost at the door. Prefer the former.
 */
const EMAIL =
  /^[^\s@,;:<>"'()[\]\\]+@[^\s@.,;:<>"'()[\]\\]+(\.[^\s@.,;:<>"'()[\]\\]+)+$/;

/**
 * Digits, with the punctuation people actually type.
 *
 * No country-specific formatting: Serverlys sells globally, and a
 * North-America-shaped regex silently rejects most of the world. The check is
 * "enough digits to be a phone number", which is what a human triaging the
 * request needs.
 */
function validatePhone(raw: string): FieldOutcome {
  const value = clean(raw);
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 16) {
    return { ok: false, reason: "That does not look like a complete phone number." };
  }
  if (!/^[+(\d][\d\s().+-]*$/.test(value)) {
    return {
      ok: false,
      reason: "Phone numbers may only contain digits and + ( ) - spaces.",
    };
  }
  return { ok: true, value };
}

function validateUrl(raw: string): FieldOutcome {
  const value = clean(raw);
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return { ok: false, reason: "That is not a valid website address." };
  }
  /*
   * http(s) only. A `javascript:` or `data:` value here would be printed into
   * a team email and, later, into whatever admin UI reads these records.
   */
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, reason: "Only http and https addresses are accepted." };
  }
  if (!url.hostname.includes(".")) {
    return { ok: false, reason: "That is not a valid website address." };
  }
  return { ok: true, value: url.toString() };
}

function validateDomain(raw: string): FieldOutcome {
  const parsed = parseDomainInput(clean(raw));
  if (!parsed.ok) return { ok: false, reason: parsed.message };
  /*
   * `parseDomainInput` accepts a bare label ("example"). A migration needs the
   * real name, so require the extension rather than guessing .com on the
   * visitor's behalf and migrating the wrong site.
   */
  if (!parsed.tld) {
    return { ok: false, reason: "Include the extension too, like example.com." };
  }
  return { ok: true, value: `${parsed.sld}${parsed.tld}` };
}

function validateChoice(raw: string, options: readonly string[]): FieldOutcome {
  const value = clean(raw);
  const match = options.find((o) => o.toLowerCase() === value.toLowerCase());
  if (match) return { ok: true, value: match };
  /*
   * Free text is kept rather than rejected when it is short and plausible.
   * "Bluehost, but the DNS is at Cloudflare" is a better answer for the team
   * than a forced pick from a list — the options exist to steer the model's
   * phrasing, not to constrain what a human is allowed to say. Empty or
   * essay-length answers still fail.
   */
  if (value.length >= 2 && value.length <= 120) return { ok: true, value };
  return { ok: false, reason: `Choose one of: ${options.join(", ")}.` };
}

function validateName(raw: string): FieldOutcome {
  const value = clean(raw);
  if (value.length < 2) return { ok: false, reason: "That name looks too short." };
  if (value.length > 80) return { ok: false, reason: "That name is too long." };
  /*
   * Reject anything that reads as an address or a URL — a strong signal the
   * model mapped the wrong span of the visitor's message onto `name`, which is
   * the single most common extraction error and the most visible one in an
   * email that opens "Name: https://example.com".
   */
  if (/[@<>]|https?:\/\//i.test(value)) {
    return { ok: false, reason: "That does not look like a person's name." };
  }
  return { ok: true, value };
}

/** Validate and normalise one value against its field specification. */
export function validateField(spec: FieldSpec, raw: unknown): FieldOutcome {
  if (typeof raw !== "string") return { ok: false, reason: "Expected text." };

  const limit = spec.kind === "text" ? MAX_NOTES : MAX_VALUE;
  if (raw.length > limit) {
    return {
      ok: false,
      reason: `That is longer than we can record (${limit} characters).`,
    };
  }

  switch (spec.kind) {
    case "name":
      return validateName(raw);
    case "email": {
      const value = clean(raw).toLowerCase();
      return EMAIL.test(value)
        ? { ok: true, value }
        : { ok: false, reason: "That does not look like an email address." };
    }
    case "phone":
      return validatePhone(raw);
    case "domain":
      return validateDomain(raw);
    case "url":
      return validateUrl(raw);
    case "choice":
      return validateChoice(raw, spec.options ?? []);
    case "text": {
      const value = clean(raw, true);
      return value.length > 0
        ? { ok: true, value }
        : { ok: false, reason: "That value is empty." };
    }
  }
}

/**
 * The visitor's own message.
 *
 * Length is capped before anything else happens, so an oversized body never
 * reaches the model or the store. Control characters go for the same reason as
 * above: this text is replayed into the conversation history on every turn.
 */
export function validateMessage(raw: unknown, maxChars: number): FieldOutcome {
  if (typeof raw !== "string") return { ok: false, reason: "Malformed request." };
  if (raw.length > maxChars) {
    return { ok: false, reason: "That message is too long. Try shortening it." };
  }
  const value = clean(raw, true);
  if (!value) return { ok: false, reason: "Type a message first." };
  return { ok: true, value };
}

/**
 * A same-site pathname supplied by the client.
 *
 * Only a path is accepted — never a full URL. An absolute value would let a
 * page on another origin claim to be a Serverlys page in the model's context
 * and, worse, be printed as `sourcePage` in a team email as though it were
 * ours. Anything unrecognised degrades to "/" rather than failing the request:
 * page context is an enhancement, and losing it must never cost a conversation.
 */
export function safePathname(raw: unknown): string {
  if (typeof raw !== "string") return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  const path = raw.split(/[?#]/)[0];
  if (path.length > 120) return "/";
  return /^[/A-Za-z0-9\-._~]*$/.test(path) ? path || "/" : "/";
}

/**
 * The pages the client says the visitor has been through.
 *
 * Client-supplied, so it gets the same treatment as `pathname` and for the same
 * reason: an absolute URL here would let another origin claim to be a Serverlys
 * page inside the model's context. Each entry goes through `safePathname`,
 * which degrades anything unrecognised to "/" — so the worst a hostile client
 * achieves is a trail of slashes.
 *
 * Capped at 8 independently of the client's own cap. The client is not a
 * trusted source of its own limits, and a 10,000-entry trail is a cheap way to
 * fill the model's context with junk.
 */
export function safeTrail(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const paths = raw
    .slice(-8)
    .filter((entry): entry is string => typeof entry === "string")
    .map(safePathname);
  /*
   * A trail of nothing but "/" carries no information — it is either a visitor
   * who has only seen the homepage or a client sending rubbish, and in both
   * cases the model is better off without the line.
   */
  return paths.some((p) => p !== "/") ? paths : undefined;
}

/**
 * The visitor's answer to a navigation offer, as reported by the client.
 *
 * Client-supplied, so treated like everything else from a browser: the label is
 * cleaned and truncated, `accepted` must be a real boolean, and anything
 * malformed becomes `undefined` rather than reaching the model's context as
 * half a fact. It only ever becomes one sentence of context, so degrading is
 * free — the worst case is Sera not knowing the answer, which is exactly where
 * it was before.
 */
export function safeNavigationOutcome(
  raw: unknown,
): { label: string; accepted: boolean } | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const value = raw as { label?: unknown; accepted?: unknown };
  if (typeof value.accepted !== "boolean") return undefined;
  // Quotes are stripped because the label is quoted inside the developer
  // context block; one that carried its own `"` could close that quote early
  // and continue as text the model reads at developer authority.
  const label =
    typeof value.label === "string" ? clean(value.label.replace(/["“”`]/g, "")).slice(0, 120) : "";
  if (!label) return undefined;
  return { label, accepted: value.accepted };
}

/** The document title, for context only. Truncated hard; never an instruction. */
export function safeTitle(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const value = clean(raw).slice(0, 120);
  return value || undefined;
}
