import "server-only";
import { log } from "./observability";
import type { AgentPhase } from "./types";

/**
 * The agent state machine.
 *
 * ⚠ EVERY PHASE CORRESPONDS TO SOMETHING THAT ACTUALLY HAPPENED. That is the
 * design constraint and it is what makes this worth having rather than
 * decoration. `EXECUTING_TOOL` is entered by the code that runs a tool, from
 * inside the call. `VERIFYING` is entered when a delivery result is being
 * checked, and only submission has one to check. `HANDOFF` is entered when a
 * HUMAN_CONTACT record exists. There is no phase this machine can be in
 * because it would look good on screen.
 *
 * The rule the widget inherits from `sera-typing.tsx` is the same rule here: a
 * status that claims work nobody did is worse than no status, because a visitor
 * who is told "analysing your request" and then gets a one-line answer learns
 * that the status line is theatre — and stops believing the honest ones.
 *
 * WHY THIS IS SEPARATE FROM `SeraStatus`. They answer different questions and
 * conflating them is how a UI ends up with nine booleans.
 *
 *   `SeraStatus` (types.ts) is the TURN's state as the WIDGET needs it:
 *   is the composer disabled, is the stop button showing, is there a bubble
 *   being filled. Eight values, all of them about rendering.
 *
 *   `AgentPhase` is the AGENT's state as the SERVER knows it: what stage of
 *   understanding → acting → verifying this request has reached. It is richer
 *   than the widget needs and is driven by server-side facts the widget has no
 *   access to — which tools ran, whether a record is complete, whether a
 *   delivery was confirmed.
 *
 * The widget maps phases onto the EXISTING typing indicator and the existing
 * screen-reader status region. No new visual component was added for it, and
 * no new visible label: the labels a visitor sees still come from the tool that
 * is running, exactly as before.
 */

/*
 * The union itself is declared in `types.ts`, because the phase travels to the
 * browser on the stream and `types.ts` is the client-visible half of Sera. The
 * RULES are here, and here only — this module is `server-only`, so nothing in a
 * browser bundle can decide a phase, only read one.
 */
export type { AgentPhase };

/**
 * Legal transitions.
 *
 * ⚠ THIS IS A CHECK, NOT A ROUTER. Nothing consults the table to decide what
 * to do next — the code does what the work requires and then declares the
 * phase. The table catches the case where those two disagree, which is the
 * interesting bug: a turn that reaches `COMPLETED` and then runs a tool means
 * the loop has a path somebody did not intend, and it shows up here as a
 * logged illegal transition rather than as a phase field nobody trusts.
 *
 * Terminal phases have no outgoing edges. A turn is over when it is over; the
 * next turn starts from IDLE.
 */
const LEGAL: Record<AgentPhase, readonly AgentPhase[]> = {
  IDLE: ["UNDERSTANDING", "FAILED"],
  UNDERSTANDING: ["PLANNING", "RESPONDING", "VERIFYING", "COMPLETED", "FAILED"],
  PLANNING: ["EXECUTING_TOOL", "RESPONDING", "COMPLETED", "FAILED"],
  EXECUTING_TOOL: [
    "EXECUTING_TOOL",
    "PLANNING",
    "COLLECTING_INFORMATION",
    "WAITING_FOR_CONFIRMATION",
    "RESPONDING",
    "VERIFYING",
    "HANDOFF",
    "COMPLETED",
    "FAILED",
  ],
  COLLECTING_INFORMATION: [
    "EXECUTING_TOOL",
    "RESPONDING",
    "WAITING_FOR_USER",
    "WAITING_FOR_CONFIRMATION",
    "HANDOFF",
    "COMPLETED",
    "FAILED",
  ],
  RESPONDING: [
    "PLANNING",
    "EXECUTING_TOOL",
    "COLLECTING_INFORMATION",
    "WAITING_FOR_USER",
    "WAITING_FOR_CONFIRMATION",
    "HANDOFF",
    "COMPLETED",
    "FAILED",
  ],
  VERIFYING: ["COMPLETED", "FAILED", "HANDOFF"],
  WAITING_FOR_USER: [],
  WAITING_FOR_CONFIRMATION: [],
  HANDOFF: [],
  COMPLETED: [],
  FAILED: [],
};

/** True for phases that end a turn. Used to stop emitting after the fact. */
export function isTerminal(phase: AgentPhase): boolean {
  return LEGAL[phase].length === 0;
}

/**
 * One turn's phase tracker.
 *
 * Created per turn, not per conversation: phases describe the handling of one
 * request, and a tracker that outlived the turn would have to carry rules for
 * "back to IDLE" that nothing needs.
 */
export class PhaseTracker {
  private current: AgentPhase = "IDLE";
  private readonly seen: AgentPhase[] = ["IDLE"];

  constructor(
    private readonly context: { request: string; conversation: string },
    /** Called on every accepted change, so the stream and telemetry stay in step. */
    private readonly onChange: (phase: AgentPhase) => void,
  ) {}

  get phase(): AgentPhase {
    return this.current;
  }

  /** Every phase this turn passed through, in order. For the completion log. */
  get trail(): readonly AgentPhase[] {
    return this.seen;
  }

  /**
   * Declare the phase.
   *
   * Idempotent — re-declaring the current phase is a no-op rather than a
   * duplicate event, because the honest call sites do it: the tool loop
   * declares `EXECUTING_TOOL` per call and three tools in one round is one
   * phase, not three.
   *
   * An ILLEGAL transition is LOGGED AND THEN APPLIED. Refusing it would leave
   * the tracker describing a state the turn is no longer in, which is worse
   * than a truthful record of a transition nobody planned — and the log line is
   * what gets the code fixed.
   */
  to(phase: AgentPhase): void {
    if (phase === this.current) return;

    if (!LEGAL[this.current].includes(phase)) {
      log.warn("phase_illegal_transition", {
        ...this.context,
        phase: `${this.current}->${phase}`,
      });
    }

    this.current = phase;
    this.seen.push(phase);
    this.onChange(phase);
  }
}
