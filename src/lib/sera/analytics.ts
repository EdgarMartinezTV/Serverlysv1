import { hasConsent } from "@/lib/consent";

/**
 * Sera's analytics seam.
 *
 * NO ANALYTICS PLATFORM IS INSTALLED ON THIS SITE, and this does not install
 * one. `data/../cookie-policy` states plainly that nothing in the analytics
 * category is running, and `lib/consent` exists to keep that promise. Shipping
 * a vendor script alongside an assistant would quietly make that page wrong.
 *
 * What this does instead is define the EVENTS, so that the day a platform is
 * connected it is a single `forward` implementation rather than thirty call
 * sites sprinkled through the widget. Until then:
 *
 *  · every event is dispatched as a DOM CustomEvent on `window`, which stays
 *    in the page and touches no network — useful for debugging and for a
 *    first-party listener someone may add later;
 *  · nothing is forwarded to a sink unless the visitor has accepted the
 *    analytics category. The consent check lives HERE, once, rather than being
 *    something each future integration is trusted to remember.
 */

/**
 * ⚠ THESE ARE THE CLIENT-OBSERVABLE EVENTS ONLY, and the boundary is worth
 * stating because the obvious mistake is to add every event in the system here.
 *
 * The browser knows what the visitor did and what arrived on the stream. It
 * does NOT know which tool the model asked for, whether the authorisation gate
 * refused it, how long the handler took, or why a delivery failed — all of
 * which happen server-side and are recorded there by `observability.ts` as
 * structured log lines (`tool_executed`, `tool_refused`, `tool_threw`,
 * `submit_verify`). Mirroring those names into a browser analytics sink would
 * mean either shipping them to the client, which tells an attacker which tools
 * exist and which are gated, or emitting them from the client as guesses.
 *
 * So: what the visitor did lives here. What the agent did lives in the server
 * log. `sera_phase` is the one seam between them, and it carries a phase name
 * the server had already decided to send to the browser anyway.
 */
export type SeraEventName =
  | "sera_opened"
  | "sera_closed"
  | "sera_message_sent"
  | "sera_intent_detected"
  | "sera_workflow_started"
  | "sera_lead_started"
  | "sera_lead_completed"
  | "sera_quick_action"
  | "sera_navigation_offered"
  | "sera_navigated"
  | "sera_navigation_declined"
  /** An agent phase change arrived on the stream. `props.phase` names it. */
  | "sera_phase"
  /** A real server-side tool ran. `props.label` is the visitor-facing label. */
  | "sera_tool_ran"
  /** Sera marked an element and the element was there. */
  | "sera_highlighted"
  /**
   * Sera tried to mark something and found nothing.
   *
   * ⚠ WORTH ITS OWN EVENT. The server resolves every target against a list
   * derived from the same data that renders the cards, so a miss means the DOM
   * and the data have diverged — a card that stopped carrying its attribute, a
   * page that stopped rendering a group. It is silent to the visitor and it
   * makes Sera's pointing useless, which is exactly the kind of fault that
   * survives for months without a counter on it.
   */
  | "sera_highlight_missed"
  /** The send button appeared — a consequential action is waiting on a person. */
  | "sera_confirmation_requested"
  /** The visitor tapped it. The only event that precedes a real filing. */
  | "sera_confirmation_accepted"
  /** The turn ended with nothing outstanding. */
  | "sera_conversation_completed"
  | "migration_started"
  | "migration_submitted"
  | "human_support_requested"
  | "sera_error";

export type SeraEventProps = Record<string, string | number | boolean | undefined>;

/** The DOM event Sera dispatches. Listen for it to build your own pipeline. */
export const SERA_EVENT = "sera:analytics";

/**
 * A sink a host page may register.
 *
 * Typed as a global rather than imported so that connecting an analytics
 * vendor never requires editing — or rebuilding — the widget.
 */
declare global {
  interface Window {
    seraAnalytics?: (event: SeraEventName, props?: SeraEventProps) => void;
  }
}

export function track(event: SeraEventName, props?: SeraEventProps): void {
  if (typeof window === "undefined") return;

  /*
   * In-page only. A CustomEvent cannot leave the document, so it carries no
   * consent implications and fires regardless of what the visitor chose.
   */
  window.dispatchEvent(new CustomEvent(SERA_EVENT, { detail: { event, props } }));

  /*
   * A registered sink is assumed to be a real analytics integration — i.e. it
   * may send data somewhere — so it is gated on consent. `hasConsent` reads
   * the stored choice and returns false when no choice has been made, which is
   * the correct default: silence until asked.
   */
  if (!hasConsent("analytics")) return;
  try {
    window.seraAnalytics?.(event, props);
  } catch {
    // An analytics sink must never be able to break the conversation.
  }
}
