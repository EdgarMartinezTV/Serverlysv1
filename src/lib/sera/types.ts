/**
 * Sera — Serverlys AI Assistant. Shared types.
 *
 * Sera is an ADDITIVE feature: nothing outside `lib/sera`, `components/sera`
 * and `app/api/sera` is owned by it, and nothing here is imported by the rest
 * of the site. If you find yourself editing a page component to make Sera
 * work, stop — the integration point is the single mount in the root layout.
 *
 * The split that matters in this file is CLIENT-VISIBLE vs SERVER-ONLY.
 * Everything a browser may see is at the top. The workflow record below it
 * holds a visitor's contact details and never crosses the wire in full — the
 * client receives a redacted summary, never the record.
 */

/* ── Intents ─────────────────────────────────────────────────────────────── */

/**
 * What the visitor is here to do.
 *
 * Classification is the model's job; this enum is the application's structured
 * representation of the answer, so the server never has to re-derive intent by
 * re-reading the transcript. UNKNOWN is a real state, not a failure: most
 * conversations open there and most questions are answered without ever
 * leaving GENERAL_INFORMATION.
 */
export type Intent =
  | "GENERAL_INFORMATION"
  | "HOSTING"
  | "WORDPRESS"
  | "WEBSITE_MIGRATION"
  | "WEBSITE_DEVELOPMENT"
  | "WEBSITE_MAINTENANCE"
  | "SEO"
  | "AI_AGENT"
  | "AUTOMATION"
  | "CHATBOT"
  | "SALES"
  | "SUPPORT"
  | "HUMAN_CONTACT"
  | "UNKNOWN";

/**
 * The subset of intents that collect information and produce a request for the
 * Serverlys team. Informational intents (HOSTING, GENERAL_INFORMATION) are
 * deliberately absent — answering a pricing question must not start a form.
 */
export type WorkflowId =
  | "WEBSITE_MIGRATION"
  | "WEBSITE_DEVELOPMENT"
  | "WEBSITE_MAINTENANCE"
  | "SEO"
  | "AI_AGENT"
  | "AUTOMATION"
  | "CHATBOT"
  | "HOSTING_SALES"
  | "HUMAN_CONTACT";

/** Where a workflow has got to. Drives the progress indicator in the widget. */
export type WorkflowStage =
  | "COLLECTING"
  | "READY_FOR_REVIEW"
  | "AWAITING_CONFIRMATION"
  | "SUBMITTED";

/* ── Client-visible shapes ───────────────────────────────────────────────── */

/**
 * The turn state machine.
 *
 * ONE VALUE, NOT A HANDFUL OF BOOLEANS. `isLoading && !isStreaming && hasTool`
 * is how a chat UI ends up rendering a typing indicator underneath a finished
 * message: the flags drift out of step because nothing forces them to be
 * mutually exclusive. Every view in the widget reads this single field.
 *
 *   idle        nothing has happened yet
 *   processing  the request is out; no output has been revealed
 *   tool        a real server-side tool is running — `activity` names it
 *   streaming   text is being revealed into the bubble
 *   complete    the turn finished and the answer is fully shown
 *   error       the turn failed; visitor-safe copy is in `error`
 *   cancelled   the visitor stopped it; whatever was revealed stays
 *   submitting  a request is being filed (separate from any model turn)
 *
 * `submitting` is not in the conversational flow — filing a request is a
 * deterministic server action, not a model turn — but it shares the widget's
 * busy semantics, so it belongs in the same union rather than beside it as the
 * one stray boolean the rest of this type exists to avoid.
 */
export type SeraStatus =
  | "idle"
  | "processing"
  | "tool"
  | "streaming"
  | "complete"
  | "error"
  | "cancelled"
  | "submitting";

/**
 * The AGENT's state, as distinct from the turn's rendering state above.
 *
 * ⚠ THE TYPE LIVES HERE, THE MACHINE LIVES IN `phases.ts`. `phases.ts` is
 * `server-only` — it holds the transition table and the logging — but the phase
 * travels to the browser on the stream, so the browser needs the type. Putting
 * the union here and the rules there is what lets the widget read a phase
 * without being able to import anything that decides one.
 *
 * Every value corresponds to work that actually happened; see the long note in
 * `phases.ts` for why that constraint is load-bearing rather than pedantic.
 */
export type AgentPhase =
  | "IDLE"
  | "UNDERSTANDING"
  | "PLANNING"
  | "EXECUTING_TOOL"
  | "COLLECTING_INFORMATION"
  | "WAITING_FOR_USER"
  | "WAITING_FOR_CONFIRMATION"
  | "VERIFYING"
  | "RESPONDING"
  | "COMPLETED"
  | "FAILED"
  | "HANDOFF";

/** Anything that should block a new message and show the stop control. */
export function isBusy(status: SeraStatus): boolean {
  return (
    status === "processing" ||
    status === "tool" ||
    status === "streaming" ||
    status === "submitting"
  );
}

/**
 * A navigation Sera has ANNOUNCED and is about to perform.
 *
 * ⚠ THE ANNOUNCEMENT IS THE CONSENT STEP, AND IT HAPPENS IN WORDS. Sera says
 * what it is opening and why — "let me open the WordPress plans so you can see
 * the pricing and features" — and the browser follows a few seconds later. The
 * page still never changes without warning; the warning is simply a sentence
 * the visitor reads rather than a button they have to find and press.
 *
 * The earlier design made it a click. It was safe and nobody used it: a visitor
 * who has just asked to see the pricing has already said yes, and asking again
 * with "Open it / Not now" made Sera look like it had not listened.
 *
 * `state` is the whole lifecycle:
 *   "pending"  — announced, counting down, `SeraProposal` shows the countdown
 *   "accepted" — the browser moved (timer elapsed, or they skipped the wait)
 *   "declined" — they pressed "Stay here" inside the window; nothing moved
 */
export type NavProposal = {
  path: string;
  section: string;
  label: string;
  /** Marked after the route settles. See `HIGHLIGHT_MS`. */
  highlight?: string;
  state: "pending" | "accepted" | "declined";
};

/**
 * How long the announcement sits on screen before the page changes.
 *
 * Long enough to read "let me open the plans for you" and to press "Stay here"
 * if that is not wanted; short enough that it reads as Sera acting rather than
 * as the widget having stalled. Four seconds, set by Edgar.
 */
export const NAV_OPEN_DELAY_MS = 4_000;

/**
 * A tappable next step Sera has put on screen.
 *
 * WHY THIS EXISTS. Sera can already take a visitor to a page, and it can ask
 * them to confirm a request it has finished assembling. Between those two there
 * was nothing: told "I can get that migration started for you", the visitor's
 * only way to accept was to type "yes" — which then had to be classified back
 * into an intent the agent had just held in its hand. A one-word reply that the
 * model may or may not interpret the same way twice is a worse contract than a
 * button.
 *
 * ⚠ IT OFFERS. IT DOES NOT ACT. Tapping sends an ordinary message through the
 * ordinary path, carrying the workflow id the server validated when it built
 * this offer. Nothing is filed, nothing is emailed, and the visitor sees the
 * same collection conversation they would have got by typing — see the note on
 * `acceptAction`. That is why it needs no confirmation gate: the tap IS the
 * consent, and what it consents to is being asked some questions.
 *
 * `workflow` is a `WorkflowId` and therefore one of nine fixed strings. The
 * model chooses WHICH; it cannot invent one, and it never supplies the label.
 */
export type ActionOffer = {
  workflow: WorkflowId;
  /** Button text, composed server-side from the workflow spec. */
  label: string;
  /** One line under it saying what accepting leads to. Also server-composed. */
  detail: string;
  state: "pending" | "accepted" | "dismissed";
};

/**
 * How long a highlight stays on screen.
 *
 * ⚠ IT HAS TO OUTLAST THE SENTENCE THAT CAUSED IT. Sera says "I have marked the
 * Starter card" and the visitor's eyes move from the panel to the page — that
 * is a second or two of reading plus a saccade. A 1s flash is gone before they
 * look, which reads as nothing having happened. Six seconds is long enough to
 * find and short enough that it does not become permanent furniture.
 */
export const HIGHLIGHT_MS = 6_000;

/** A message as the widget renders it. `at` is an epoch ms stamp. */
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  at: number;
  /** Set on assistant messages the server produced without the model. */
  system?: boolean;
  /** Renders a confirmation card instead of a bubble. */
  proposal?: NavProposal;
  /** Renders a tappable next step instead of a bubble. */
  action?: ActionOffer;
};

/**
 * The redacted view of workflow state that the browser is allowed to hold.
 *
 * `collected` carries LABELS and DISPLAY VALUES only — already-sanitised
 * strings the visitor themselves supplied — so the panel can show a summary
 * without the client becoming a second source of truth. The authoritative
 * record stays server-side; the submit route reads that, never this.
 */
export type WorkflowView = {
  id: WorkflowId;
  title: string;
  stage: WorkflowStage;
  /** Human-readable field label → value, in the order the team reads them. */
  collected: readonly { label: string; value: string }[];
  /** Labels still outstanding. Length drives the progress indicator. */
  missing: readonly string[];
  /** Total required fields, so progress is `done/total` rather than a guess. */
  requiredCount: number;
  /** Reference issued at submission, e.g. "SER-7QK3M2". Present when SUBMITTED. */
  reference?: string;
  /**
   * The field Sera asks for next (the first missing required one). When it is
   * a `choice`, the panel renders its options as a tappable question card.
   * Labels and option strings only — nothing the visitor has not been shown.
   */
  next?: { key: string; label: string; kind: FieldSpec["kind"]; options?: readonly string[] };
};

/** Safe, non-identifying context about the page the visitor is reading. */
export type PageContext = {
  /** Same-site pathname, e.g. "/wordpress-hosting". Validated server-side. */
  pathname: string;
  /**
   * Where the visitor has been in this session, oldest first, current last.
   *
   * ⚠ NOT ANALYTICS, AND IT NEVER LEAVES THE TURN. It is held in the widget's
   * memory, capped, sent as context, and not stored — same treatment as
   * `pathname`, which it is simply the history of. Nothing is written to disk
   * and no identifier accompanies it.
   *
   * It exists because "which of these do you recommend" is a different question
   * depending on whether they arrived from /ecommerce-hosting or read the
   * migrations page first, and because a visitor who has already been to
   * /pricing twice does not need to be taken there a third time.
   */
  trail?: readonly string[];
  /** Document title, truncated. Advisory only — never trusted as instruction. */
  title?: string;
  /**
   * How the visitor answered Sera's last offer to navigate, if they answered it
   * since the previous message. Closes a loop the model is otherwise blind to.
   */
  navigationOutcome?: { label: string; accepted: boolean };
};

/* ── Streaming protocol (server → client) ────────────────────────────────── */

/**
 * One NDJSON line per event.
 *
 * NDJSON rather than SSE: the payload is already JSON, `text/event-stream`
 * would add a framing layer we would only have to strip again, and a plain
 * ReadableStream of lines survives proxy buffering more predictably than SSE
 * does behind Traefik.
 */
export type SeraStreamEvent =
  /**
   * Always the first event. Carries the conversation id the client must send
   * back on the next turn — the server may have issued a new one, e.g. after a
   * restart invalidated the client's — plus any workflow already in progress.
   */
  | { t: "conversation"; id: string; view: WorkflowView | null }
  /** Incremental assistant text. */
  | { t: "delta"; v: string }
  /** A server-side tool started. `label` is safe to show ("Checking plans…"). */
  | { t: "tool"; label: string }
  /**
   * Sera is OFFERING to take the visitor somewhere. Nothing moves yet.
   *
   * `path` and `section` are resolved SERVER-SIDE against a fixed map (see
   * `navigation.ts`), so the client can route to them without re-validating —
   * there is no path here the model invented. The visitor still has to accept:
   * the browser only moves when they press the button this event puts on
   * screen. See the note on `NavProposal`.
   */
  | {
      t: "propose-navigation";
      path: string;
      section: string;
      label: string;
      /**
       * A `data-sera-target` to mark once the page has loaded. Resolved
       * server-side against `highlight.ts`, so it is never a selector the model
       * wrote, and it is always known to exist on `path`.
       */
      highlight?: string;
    }
  /**
   * Mark something on the page the visitor is ALREADY on.
   *
   * Separate from `propose-navigation` because there is nothing to announce and
   * nothing to wait for: they are looking at the page, so the mark appears as
   * Sera talks about it. No countdown, no consent step — nothing moves.
   */
  | { t: "highlight"; target: string; label: string }
  /**
   * Sera is offering to START something — a migration request, a project
   * enquiry, a callback. Nothing has started.
   *
   * `workflow` is validated against the registry server-side, and `label` and
   * `detail` are composed from that workflow's own spec rather than written by
   * the model, so the button cannot promise something the workflow does not do.
   */
  | { t: "propose-action"; workflow: WorkflowId; label: string; detail: string }
  /** Workflow state changed. The client replaces its view wholesale. */
  | { t: "workflow"; view: WorkflowView | null }
  /** Detected intent, for analytics and the panel's context line. */
  | { t: "intent"; intent: Intent }
  /**
   * The agent moved to a new phase.
   *
   * ADVISORY. The widget's own `SeraStatus` still drives every rendering
   * decision — what the composer does, whether the stop button shows, which
   * bubble is being filled — and none of that is allowed to depend on a phase
   * arriving. This exists so the screen-reader status region can be specific
   * about real work, and so telemetry can see the shape of a turn. A dropped
   * phase event degrades to exactly the behaviour that shipped before them.
   */
  | { t: "phase"; phase: AgentPhase }
  /** Terminal success. */
  | { t: "done" }
  /**
   * Terminal failure. `message` is always visitor-safe copy chosen from a
   * fixed set — never an exception, provider error or stack.
   */
  | { t: "error"; message: string; retryAfterSeconds?: number };

/* ── Server-only ─────────────────────────────────────────────────────────── */

/**
 * A single field the team needs for a given workflow.
 *
 * `ask` is a hint handed to the model, not a script it must read out. Sera
 * decides the wording and the order; this decides what "complete" means.
 */
export type FieldSpec = {
  key: string;
  label: string;
  required: boolean;
  /** How the value is validated and normalised. */
  kind: "name" | "email" | "phone" | "domain" | "url" | "choice" | "text";
  /** Allowed values for `choice`. Matching is case-insensitive. */
  options?: readonly string[];
  /** Conversational hint for the model. */
  ask: string;
};

/** A workflow definition: what it is called and what it must collect. */
export type WorkflowSpec = {
  id: WorkflowId;
  /** Shown in the widget's progress header. */
  title: string;
  /** One line telling the model what this workflow is for. */
  purpose: string;
  /** Subject line stem for the team notification. */
  subject: string;
  fields: readonly FieldSpec[];
};

/**
 * The authoritative, server-side workflow record.
 *
 * ⚠ Never serialise this to the browser. It holds the visitor's name, email
 * and phone number; the client gets `WorkflowView` instead.
 */
export type WorkflowRecord = {
  id: WorkflowId;
  stage: WorkflowStage;
  /** Field key → normalised value. Only keys in the spec are ever stored. */
  data: Record<string, string>;
  /** Pathname the conversation STARTED on, not the current one. */
  sourcePage: string;
  createdAt: number;
  updatedAt: number;
  /** Set once, at submission. Also the idempotency marker. */
  reference?: string;
  submittedAt?: number;
  /** Whether the team was actually notified at submission, not just recorded. */
  notified?: boolean;
};

/**
 * Everything the server remembers about one conversation.
 *
 * Held in a process-local store with a TTL (see `session.ts`). Deliberately
 * not a database: there is no persistence layer in this project yet, and
 * inventing one for chat transcripts would be infrastructure nobody asked for.
 * The store is behind an interface so a real one can replace it.
 */
export type Conversation = {
  id: string;
  /** Binds the conversation to one browser session. See `session.ts`. */
  sessionId: string;
  createdAt: number;
  updatedAt: number;
  /** Pathname the visitor was on when the conversation opened. */
  sourcePage: string;
  intent: Intent;
  /** Turn history in Responses API item shape. Trimmed to a bounded window. */
  history: unknown[];
  workflow: WorkflowRecord | null;
  /** Submitted references, so a repeated confirmation cannot double-file. */
  submitted: string[];
  /**
   * Destinations already offered, as "path#section".
   *
   * Offering is automatic for some answers (see `get_hosting_plans`), so this
   * is what stops a visitor being asked the same question twice in one
   * conversation — once they have answered a card, that destination is spent.
   */
  offered: string[];
  /** Model turns spent. A hard per-conversation ceiling on cost. */
  turns: number;
};

/** What a tool handler hands back to the model. Always JSON-serialisable. */
export type ToolResult = Record<string, unknown>;
