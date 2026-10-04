import "server-only";
import OpenAI from "openai";
import { LIMITS, openAiConfig } from "./config";
import { SYSTEM_PROMPT, contextBlock } from "./prompts";
import { definitionsFor, isKnownTool, permissionOf, runTool } from "./tools/registry";
import { decide, type Surface } from "./policy";
import { PhaseTracker } from "./phases";
import { errorCategory, log, newRequestId } from "./observability";
import { trimHistory, touch } from "./session";
import { actionOfferFor, mergeIntoWorkflow, missingRequired, toView, workflowForIntent } from "./workflows";
import type { NavTarget } from "./navigation";
import type { Conversation, PageContext, SeraStreamEvent } from "./types";

/**
 * Which registry Sera runs against.
 *
 * ⚠ A CONSTANT, NOT A PARAMETER, AND DELIBERATELY NOT CONFIGURABLE. Sera is
 * mounted in the root layout of a public marketing site and every caller is an
 * anonymous visitor. There is no code path that could legitimately pass
 * "CUSTOMER" or "ADMIN" here, because there is no signed-in identity in this
 * product to authorise one. Making it an argument would create the appearance
 * of one and invite a future caller to supply it from a request body.
 *
 * When customer authentication exists, the change is a new entry point with its
 * own session check — not a new value threaded through this function.
 */
const SURFACE: Surface = "PUBLIC";

/**
 * The orchestration loop: visitor message in, streamed answer out.
 *
 * SHAPE OF ONE TURN
 *
 *   history + context + message  →  Responses API (streaming)
 *                                       ↓
 *                          text deltas straight to the client
 *                                       ↓
 *                          any function_call items in the output
 *                                       ↓
 *                          executed server-side against the registry
 *                                       ↓
 *                          results appended, the model called again
 *                                       ↓
 *                          repeat, bounded, until it stops calling tools
 *
 * The browser never talks to OpenAI. It POSTs to our route, which holds the
 * key, holds the conversation, and decides what comes back.
 *
 * `store: false` on every call. OpenAI does not need to retain a transcript
 * containing a visitor's name, email and phone number, and the conversation
 * state that matters is ours (see `session.ts`). Retention we do not need is
 * retention we would have to account for.
 */

/** Visitor-safe failure copy. The only error text that ever reaches a browser. */
export const FALLBACK_MESSAGE =
  "I am having trouble connecting right now. You can still reach the Serverlys " +
  "team directly at support@serverlys.com or (305) 671-1272 and they will help " +
  "you from there.";

let client: OpenAI | null = null;

function openai(apiKey: string): OpenAI {
  // One client per process. It holds a connection pool; rebuilding it per
  // request throws that away and adds a TLS handshake to every message.
  if (!client) client = new OpenAI({ apiKey, maxRetries: 1 });
  return client;
}

export type TurnInput = {
  conversation: Conversation;
  page: PageContext;
  message: string;
  emit: (event: SeraStreamEvent) => void;
  /** Aborts when the visitor closes the tab mid-answer. */
  signal: AbortSignal;
};

/**
 * Run one turn to completion.
 *
 * Emits as it goes and resolves when the answer is finished. Never throws for
 * an expected failure — an unreachable provider, a bad key, a timeout — because
 * those are conversation states, not crashes: it emits `error` with copy the
 * visitor can act on and returns. The details go to the server log.
 */
export async function runTurn({
  conversation,
  page,
  message,
  emit,
  signal,
}: TurnInput): Promise<void> {
  const request = newRequestId();
  /*
   * Phases go out on the stream AND into the log from one place, so the two can
   * never tell different stories about the same turn. The widget treats them as
   * advisory; the log treats them as the record.
   */
  const phases = new PhaseTracker(
    { request, conversation: conversation.id },
    (phase) => {
      emit({ t: "phase", phase });
      log.info("phase", { request, conversation: conversation.id, phase });
    },
  );

  const config = openAiConfig();
  if (!config) {
    /*
     * No key on this deployment. This is a configuration state, not an outage,
     * and it is reported as such — loudly in the log, honestly on screen. The
     * visitor is given the contact routes rather than a spinner.
     */
    log.error("misconfigured", { request, conversation: conversation.id, error: "no_api_key" });
    phases.to("FAILED");
    emit({ t: "error", message: FALLBACK_MESSAGE });
    return;
  }

  const isFirstTurn = conversation.history.length === 0;

  conversation.history.push({ role: "user", content: message });
  conversation.turns += 1;
  touch(conversation);

  /*
   * ⚠ DETERMINISTIC CAPTURE OF A DIRECT ANSWER (2026-10-03).
   *
   * Saving used to depend entirely on the model calling `record_details`, and
   * it sometimes didn't ("I have your domain as …" with no call), so the
   * record — and the progress bar, the next question and the tappable answer
   * card built from it — ran one turn behind. When the message is a clean
   * answer to the field being asked, save it before the model runs.
   *
   * Only for shapes that cannot be mistaken for chat: an exact choice option,
   * or a value that validates as a domain, email, phone or URL. Free text
   * (names, descriptions) still goes through the model, because "what does
   * it cost?" would otherwise be saved as somebody's business name.
   */
  const pending = conversation.workflow;
  if (pending && pending.stage === "COLLECTING" && message.length <= 120) {
    const field = missingRequired(pending)[0];
    const answer = message.trim();
    const exactChoice =
      field?.kind === "choice" && field.options?.some((o) => o.toLowerCase() === answer.toLowerCase());
    const shaped = field && ["domain", "email", "phone", "url"].includes(field.kind) && !/\s/.test(answer);
    if (field && (exactChoice || shaped)) {
      const outcome = mergeIntoWorkflow(pending, { [field.key]: answer });
      if (outcome.accepted.length) log.info("direct_answer_captured", { request, conversation: conversation.id, workflow: pending.id });
    }
  }

  /*
   * The context block is sent but NOT stored. It describes the visitor's
   * current page and the live state of their request, all of which changes
   * every turn — persisting it would leave the model reading a stale snapshot
   * alongside a fresh one and having to guess which is current.
   */
  const input: unknown[] = [
    ...conversation.history,
    {
      role: "developer",
      content: contextBlock(page, conversation.workflow, isFirstTurn),
    },
  ];

  const emittedIntent = conversation.intent;
  let sawAnyText = false;
  /** Text already streamed this turn, one entry per model round. */
  const spokenThisTurn: string[] = [];
  /*
   * ONE TAPPABLE THING PER TURN — a navigation countdown OR an action button,
   * never both and never two of either.
   *
   * The flag has to live out here rather than inside the tool-round loop: the
   * model can call an offering tool on round one and another on round two,
   * which is exactly how a visitor ended up being promised both the hosting
   * plans and the pricing page in a single answer.
   *
   * `navigated` is tracked separately because the NAVIGATION path needs to know
   * it specifically — `offerAction` and `navigate` share one budget, but only
   * one of them moves a browser, and a future caller asking "did this turn
   * navigate?" must not be answered by "this turn offered something".
   */
  const offered = { fired: false };
  const navigated = { fired: false };
  /*
   * ⚠ THE NAVIGATION IS HELD, NOT EMITTED, UNTIL THE TURN ENDS — SO IT CAN BE
   * AMENDED. This is the fix for a bug that made the highlight feature a
   * coin flip, and the mechanism is worth understanding before changing it.
   *
   * `get_hosting_plans` queues a destination BY ITSELF (see the long note
   * there: the model reached for the navigation tool only two times in three,
   * so the application does it). That auto-queue knows a page; it cannot know
   * which TIER the model is about to recommend, so it carries no highlight.
   *
   * The model would then call `offer_to_show` for the SAME page WITH the
   * highlight — and be refused as "turn-full", because something was already
   * queued. Net effect: whenever the pricing tool fired first, the plan card
   * was never marked. Measured as intermittent; it was actually deterministic,
   * decided by which tool the model happened to call first.
   *
   * Holding the event lets the second call AMEND the first instead of
   * competing with it. Same destination plus more detail is not a second
   * offer, and treating it as one was the mistake.
   */
  const nav: { current: { target: NavTarget; highlight?: string } | null } = { current: null };
  const turnStarted = Date.now();
  let toolsRun = 0;

  try {
    phases.to("UNDERSTANDING");

    for (let round = 0; round <= LIMITS.maxToolRounds; round += 1) {
      const stream = await openai(config.apiKey).responses.create(
        {
          model: config.model,
          instructions: SYSTEM_PROMPT,
          /*
           * Cast rather than build as `ResponseInput` throughout: the union has
           * dozens of members, we construct exactly four shapes, and the items
           * echoed back from `response.output` are already valid input items by
           * construction. Typing the local array as the union would force a
           * discriminated narrow at every push for no added safety.
           */
          input: input as OpenAI.Responses.ResponseInput,
          /*
           * ⚠ FILTERED BY SURFACE, not the whole registry. On the public
           * surface this is the same eleven tools it always was — but the
           * filter is what makes that a fact about the policy table rather
           * than a fact about this line.
           */
          tools: definitionsFor(SURFACE) as unknown as never,
          stream: true,
          store: false,
          // With store:false a reasoning model's items cannot be looked up by
          // id on the next request, so they must carry their own content.
          include: ["reasoning.encrypted_content"],
          // Long enough for a tool round, short enough that a wedged upstream
          // does not hold a browser connection open indefinitely.
          max_output_tokens: 800,
        },
        { signal },
      );

      let text = "";
      let output: unknown[] = [];
      /*
       * ⚠ NO REPEATS ACROSS ROUNDS (2026-10-03). After a tool call the model
       * often restates the sentence it already streamed ("Who hosts the
       * site?Who hosts the site? …"). While this round's text is still a
       * prefix of something already said this turn, hold it; the moment it
       * diverges, emit only the new part.
       */
      let held = "";
      let echoing = spokenThisTurn.length > 0;

      for await (const event of stream) {
        if (event.type === "response.output_text.delta") {
          text += event.delta;
          if (echoing) {
            held += event.delta;
            const trimmed = held.trimStart();
            /* Still a restatement of something already shown (anywhere in
               it, not only its start)? Keep holding. */
            if (spokenThisTurn.some((said) => said.includes(trimmed))) continue;
            echoing = false;
            const before = trimmed.slice(0, trimmed.length - event.delta.length);
            const repeated = before.length > 0 && spokenThisTurn.some((said) => said.includes(before));
            /* New material: continue after the repeated part, or open a new
               paragraph instead of gluing on ("…Serverlys?Who hosts…"). */
            const fresh = repeated ? event.delta : `\n\n${trimmed}`;
            if (!fresh) continue;
            if (!sawAnyText) phases.to("RESPONDING");
            sawAnyText = true;
            emit({ t: "delta", v: fresh });
            continue;
          }
          if (!sawAnyText) phases.to("RESPONDING");
          sawAnyText = true;
          emit({ t: "delta", v: event.delta });
        } else if (event.type === "response.completed") {
          output = event.response.output ?? [];
        } else if (event.type === "response.failed" || event.type === "response.incomplete") {
          log.warn("response_incomplete", {
            request,
            conversation: conversation.id,
            error: event.type.replace("response.", ""),
          });
        }
      }

      if (text) spokenThisTurn.push(text);

      /*
       * Output items go back verbatim — assistant messages, reasoning items and
       * function calls alike. Reconstructing them by hand is how tool-call ids
       * get lost and the next request 400s on an orphaned output.
       */
      if (output.length > 0) {
        input.push(...output);
        conversation.history.push(...output);
      } else if (text) {
        // Defensive: the completed event is the only place output items appear,
        // so if it never arrived, keep at least the text the visitor just read.
        input.push({ role: "assistant", content: text });
        conversation.history.push({ role: "assistant", content: text });
      }

      const calls = output.filter(
        (item): item is { type: "function_call"; call_id: string; name: string; arguments: string } =>
          typeof item === "object" &&
          item !== null &&
          (item as { type?: string }).type === "function_call",
      );

      if (calls.length === 0) break;

      /*
       * The model has decided what to do. That decision IS the planning step —
       * there is no separate planning pass, and inventing one would be a second
       * model call billed to make a state name look better.
       */
      phases.to("PLANNING");

      for (const call of calls) {
        phases.to("EXECUTING_TOOL");
        toolsRun += 1;
        const result = await executeCall(
          call,
          conversation,
          page,
          emit,
          { offered, navigated, nav },
          { request, surface: SURFACE },
        );
        const outputItem = {
          type: "function_call_output",
          call_id: call.call_id,
          output: JSON.stringify(result),
        };
        input.push(outputItem);
        conversation.history.push(outputItem);
      }

      /*
       * ⚠ AN OFFER ENDS THE TURN. ENFORCED, NOT REQUESTED.
       *
       * Something tappable is now on screen and the visitor has been told why.
       * Ask the model for one more round and it will write something, because
       * that is what a round after a tool result is for — and every version of
       * that sentence was wrong on screen. Measured, both kinds:
       *
       *   after a navigation — "I've just taken you to the plans" while the
       *   page had not moved; "let me know if you want me to proceed" for a
       *   navigation nothing is waiting on; "you can check the plans page" to
       *   someone already being driven there.
       *
       *   after an action offer — a paragraph restating the button's own
       *   sub-line: "tapping the button will let me ask a few quick questions
       *   and then you can decide whether to send it", directly underneath a
       *   card already reading "8 quick questions, then I will put it in front
       *   of you to send".
       *
       * The prompt asks for silence and mostly gets it; this is what makes it
       * certain. It applies to BOTH kinds because the failure is the same one:
       * the card is the last word, and a model given another round will take it.
       *
       * `sawAnyText` is the guard that keeps it safe: if the offer was queued by
       * a tool that fired BEFORE anything was said — `get_hosting_plans` queues
       * a destination on its own — the turn must continue, or something would
       * appear under a visitor who was never told anything at all.
       */
      if (offered.fired && sawAnyText) break;

      /*
       * ⚠ A BOOKKEEPING TOOL DOES NOT BUY ANOTHER PARAGRAPH.
       *
       * `set_intent` records a classification. It returns nothing the visitor
       * could want and nothing that changes what should be said — but it is
       * still a tool call, so the API hands back another round, and a model
       * given a round will write. Measured, on turn one of a real conversation:
       *
       *   "What are you trying to get online today? Do you already have a site
       *    or are you starting from scratch?What type of website or online
       *    project are you planning? This will help me guide you to the right
       *    hosting or service."
       *
       * Two openers, concatenated without even a space, because the first was
       * written before the tool and the second after it. The visitor is asked
       * the same thing twice in one bubble.
       *
       * This became visible only once the prompt started requiring set_intent
       * on the first substantive reply — the fix for a different fault created
       * the round that exposed this one. Ending the turn is the honest response:
       * the answer was already written, and there is no new information in
       * "your classification has been recorded".
       *
       * ⚠ THE SET IS DELIBERATELY TINY. `get_request_status` is also silent to
       * the visitor but it genuinely changes the next sentence — it is what
       * stops Sera asking for a field it already has. Only tools that cannot
       * inform the answer belong here.
       */
      const BOOKKEEPING = new Set(["set_intent"]);
      if (sawAnyText && calls.every((call) => BOOKKEEPING.has(call.name))) break;

      /*
       * Round budget spent with the model still reaching for tools. Rather than
       * loop on, say something true and stop: an assistant that silently gives
       * up mid-thought is worse than one that admits it is stuck.
       */
      if (round === LIMITS.maxToolRounds) {
        log.warn("tool_rounds_exhausted", {
          request,
          conversation: conversation.id,
          count: toolsRun,
        });
        const stuck =
          "Let me stop there before I go in circles — could you tell me a little " +
          "more about what you need?";
        emit({ t: "delta", v: stuck });
        conversation.history.push({ role: "assistant", content: stuck });
        sawAnyText = true;
      }
    }

    /*
     * A turn that produced no text at all is a failed turn from the visitor's
     * side, whatever the API thought. Filling the silence beats an empty bubble.
     */
    if (!sawAnyText) {
      log.error("turn_empty", { request, conversation: conversation.id });
      phases.to("FAILED");
      emit({ t: "error", message: FALLBACK_MESSAGE });
      return;
    }

    /*
     * ⚠ THE HELD NAVIGATION GOES OUT HERE, AFTER EVERY TOOL HAS HAD ITS CHANCE
     * TO AMEND IT. Emitting inside the loop is what made the highlight a coin
     * flip; see the note on `pendingNav`. The client queues the card until the
     * text has finished revealing anyway, so nothing about the visitor's
     * experience depends on the event arriving mid-stream.
     */
    if (nav.current) {
      emit({
        t: "propose-navigation",
        ...nav.current.target,
        highlight: nav.current.highlight,
      });
      log.info("navigation_queued", {
        request,
        conversation: conversation.id,
        ok: true,
        count: nav.current.highlight ? 1 : 0,
      });
    }

    if (conversation.intent !== emittedIntent) {
      emit({ t: "intent", intent: conversation.intent });
    }

    /*
     * ⚠ THE DETERMINISTIC NEXT STEP, AND IT IS EVALUATED AFTER EVERY TOOL HAS
     * RUN — which is the whole reason it lives here and not inside a tool.
     *
     * The model reaches for `offer_to_start` when it thinks of it, which was
     * two probes in three. Same finding as the navigation offer, documented at
     * `get_hosting_plans`: a visitor who asks the same question twice gets a
     * button once, which reads as the widget being broken rather than as a
     * model being inconsistent. So the application offers it.
     *
     * WHY AT TURN SETTLE RATHER THAN IN `set_intent`. Because the safe version
     * of this needs to know something no tool can know while it is running:
     * whether a workflow was opened LATER IN THE SAME TURN. `set_intent` and
     * `start_workflow` are routinely called in one round — "I want to move my
     * site" produces both — and a button offering to start a migration that is
     * already collecting is worse than no button at all. Here, every tool has
     * finished and `conversation.workflow` is final.
     *
     * The four conditions are each load-bearing:
     *   · nothing tappable yet   — one offer per answer, same budget as nav
     *   · no workflow open       — never offer what is already under way
     *   · intent maps to one     — HOSTING and GENERAL_INFORMATION map to null
     *                              on purpose; a question must not sprout a form
     *   · something was said     — a button under silence is an ambush
     */
    const intentWorkflow = workflowForIntent(conversation.intent);
    if (!offered.fired && !conversation.workflow && intentWorkflow && sawAnyText) {
      const { label, detail } = actionOfferFor(intentWorkflow);
      offered.fired = true;
      emit({ t: "propose-action", workflow: intentWorkflow, label, detail });
      log.info("action_offered", {
        request,
        conversation: conversation.id,
        workflow: intentWorkflow,
      });
    }
    emit({
      t: "workflow",
      view: conversation.workflow ? toView(conversation.workflow) : null,
    });

    /*
     * ⚠ THE CLOSING PHASE IS READ OFF THE RECORD, not chosen for flavour.
     *
     *   HANDOFF                  — a HUMAN_CONTACT request exists. The
     *                              conversation is on its way to a person.
     *   WAITING_FOR_CONFIRMATION — the send button is on screen right now.
     *   COLLECTING_INFORMATION   — a request is open with required fields
     *                              still outstanding, so the next message is
     *                              expected to answer one.
     *   COMPLETED                — a question was answered and nothing is
     *                              pending. WAITING_FOR_USER is deliberately
     *                              NOT used here: every finished turn waits
     *                              for the visitor in some sense, so a phase
     *                              that fires on all of them says nothing.
     *                              It is reserved for the collecting case,
     *                              where the wait is for a specific answer.
     */
    const record = conversation.workflow;
    if (record && record.id === "HUMAN_CONTACT" && record.stage !== "COLLECTING") {
      phases.to("HANDOFF");
    } else if (record?.stage === "AWAITING_CONFIRMATION") {
      phases.to("WAITING_FOR_CONFIRMATION");
    } else if (record && record.stage === "COLLECTING" && missingRequired(record).length > 0) {
      phases.to("COLLECTING_INFORMATION");
      phases.to("WAITING_FOR_USER");
    } else {
      phases.to("COMPLETED");
    }

    emit({ t: "done" });

    log.info("turn_complete", {
      request,
      conversation: conversation.id,
      ms: Date.now() - turnStarted,
      count: toolsRun,
      turns: conversation.turns,
      workflow: conversation.workflow?.id,
      phase: phases.phase,
      ok: true,
    });
  } catch (error) {
    if (signal.aborted) {
      // Visitor navigated away or closed the tab. Not a failure, and not a
      // phase — the turn simply stops existing.
      log.info("turn_aborted", {
        request,
        conversation: conversation.id,
        ms: Date.now() - turnStarted,
      });
      return;
    }

    /*
     * Everything the provider can throw funnels here: a bad key, a rate limit,
     * a 500, a network reset, a malformed request. The visitor gets one
     * sentence and two working contact routes; the diagnosis stays in the log
     * as a COUNTABLE CATEGORY rather than a provider string — see
     * `errorCategory`, and the reason it throws the message away.
     */
    log.error("turn_failed", {
      request,
      conversation: conversation.id,
      ms: Date.now() - turnStarted,
      count: toolsRun,
      error: errorCategory(error),
      ok: false,
    });
    phases.to("FAILED");
    emit({ t: "error", message: FALLBACK_MESSAGE });
  } finally {
    trimHistory(conversation);
    touch(conversation);
  }
}

/**
 * Execute one tool call — behind the authorisation gate.
 *
 * THE ORDER OF THESE CHECKS IS THE SECURITY PROPERTY:
 *
 *   1. Is the name in the registry?           → `isKnownTool`
 *   2. Does the POLICY allow it here?         → `decide(name, surface)`
 *   3. Are the arguments parseable JSON?      → `JSON.parse`
 *   4. Only then does a handler see anything. → `runTool`
 *
 * Step 2 is new and it is the one that matters. Previously a registered name
 * went straight to its handler, and "nothing dangerous is registered" was the
 * whole defence — true today, and a property of a list rather than of the code.
 * Now the verdict is computed from `policy.ts`, which knows about capabilities
 * that do not exist yet, so a handler added without a classification is refused
 * rather than run.
 *
 * ⚠ THERE IS NO `if (modelSaysApproved)` ANYWHERE IN THIS PATH, and there is no
 * argument the model can pass to change a verdict. `decide()` sees a tool name
 * and a surface constant. Everything the model controls is downstream of it.
 *
 * Every failure is returned to the MODEL as a result rather than thrown. The
 * model can recover from "that is not something I can do" by saying so; it
 * cannot recover from an exception that ends the turn, and neither can the
 * visitor.
 */
async function executeCall(
  call: { call_id: string; name: string; arguments: string },
  conversation: Conversation,
  page: PageContext,
  emit: (event: SeraStreamEvent) => void,
  budget: {
    offered: { fired: boolean };
    navigated: { fired: boolean };
    nav: { current: { target: NavTarget; highlight?: string } | null };
  },
  meta: { request: string; surface: Surface },
) {
  const base = {
    request: meta.request,
    conversation: conversation.id,
    tool: call.name,
    permission: permissionOf(call.name),
  };

  if (!isKnownTool(call.name)) {
    /*
     * ⚠ LOGGED AT ERROR, because it should be impossible. The Responses API
     * only ever returns a name from the list it was given, so this firing means
     * either the definitions and the handler switch have drifted apart, or
     * something is talking to this function that is not the API. Both are worth
     * waking up for; neither is worth telling the visitor about.
     */
    log.error("tool_unregistered", base);
    return { error: `No such tool: ${call.name}` };
  }

  const verdict = decide(call.name, meta.surface);
  if (!verdict.allowed) {
    log.warn("tool_refused", { ...base, verdict: verdict.code, ok: false });
    /*
     * The note is written for the model, and it describes the SITUATION rather
     * than the mechanism — see the comment on `decide`. `error` is a stable
     * code so the model can tell "I am not able to" from "that failed", which
     * are different things to say to a person.
     */
    return { error: "not_permitted", reason: verdict.code, note: verdict.note };
  }

  let args: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(call.arguments || "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      args = parsed as Record<string, unknown>;
    }
  } catch {
    log.warn("tool_bad_arguments", { ...base, error: "malformed_json", ok: false });
    return { error: "Arguments were not valid JSON. Try again with a simpler call." };
  }

  const started = Date.now();
  try {
    const result = await runTool(call.name, args, {
      conversation,
      page,
      emit: (label) => emit({ t: "tool", label }),
      navigate: (target, highlight) => {
        const held = budget.nav.current;

        if (held) {
          /*
           * Same destination, and this call brings a highlight the held one
           * lacks. Amend and accept — see the note on `pendingNav`.
           */
          const sameDestination =
            held.target.path === target.path && held.target.section === target.section;
          if (sameDestination && highlight && !held.highlight) {
            held.highlight = highlight;
            return true;
          }
          /*
           * A genuinely different destination, or a duplicate with nothing new.
           * Refused: the client holds only the latest, so a second promise
           * would be a page that never opens.
           */
          return false;
        }

        if (budget.offered.fired) return false;
        budget.offered.fired = true;
        budget.navigated.fired = true;
        budget.nav.current = { target, highlight };
        return true;
      },
      offerAction: (workflow, label, detail) => {
        if (budget.offered.fired) return false;
        budget.offered.fired = true;
        emit({ t: "propose-action", workflow, label, detail });
        return true;
      },
      /*
       * ⚠ NO BUDGET CHECK. A mark is not an offer — see the note on
       * `ToolContext.mark`. The registry already refuses a target that is not
       * registered for the page, so the worst a repeated call does is re-ring
       * something already ringed.
       */
      mark: (target) => emit({ t: "highlight", target: target.name, label: target.label }),
    });

    /*
     * A tool that returns `{ error }` ran fine and refused — an unknown
     * destination, a field it could not validate, a workflow already open.
     * Counting those as successes would hide the most useful signal in here,
     * which is which tools the model keeps calling wrongly.
     */
    const refused = typeof (result as { error?: unknown }).error === "string";
    log.info("tool_executed", {
      ...base,
      ms: Date.now() - started,
      ok: !refused,
      error: refused ? String((result as { error: string }).error).slice(0, 40) : undefined,
    });
    return result;
  } catch (error) {
    log.error("tool_threw", {
      ...base,
      ms: Date.now() - started,
      error: errorCategory(error),
      ok: false,
    });
    return { error: "That lookup failed. Continue without it and do not guess the answer." };
  }
}
