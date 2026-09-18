"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { GENERIC_ERROR, streamChat, submitRequest } from "@/lib/sera/client";
import { track } from "@/lib/sera/analytics";
import { CADENCE, CadenceGate, countWords, takeWords, wordsThisTick } from "@/lib/sera/cadence";
import { isBusy, NAV_OPEN_DELAY_MS } from "@/lib/sera/types";
import { clearMarks, markTarget } from "./sera-highlight";
import type {
  ActionOffer,
  AgentPhase,
  ChatMessage,
  Intent,
  NavProposal,
  SeraStatus,
  WorkflowId,
  WorkflowView,
} from "@/lib/sera/types";

/**
 * Sera's client state: one conversation, its transcript, and the request being
 * assembled.
 *
 * TWO THINGS THIS FILE OWNS THAT ARE EASY TO GET WRONG:
 *
 * 1. THE TURN STATE MACHINE. One `status` value, never a set of booleans. See
 *    the note on `SeraStatus`.
 *
 * 2. THE RESPONSE CADENCE. Incoming text is buffered and revealed on a paced
 *    loop behind a minimum-perceived-processing FLOOR, so an answer never
 *    appears instantly and never lands as one block. The timing rules and the
 *    reasoning live in `lib/sera/cadence.ts`; this file only drives them.
 *
 * ALL OF IT LIVES IN MEMORY. The transcript is never written to localStorage —
 * by the time a migration is half-collected it holds a name, an email address,
 * a phone number and a domain, and persisting that to disk on a shared or
 * public machine is a disclosure nobody agreed to. The server holds the
 * authoritative record, bound to an httpOnly cookie, and that is the copy that
 * matters.
 *
 * The ONE exception is the conversation id, kept in sessionStorage so a page
 * RELOAD does not silently start a second conversation and ask the visitor for
 * their domain again. The id is not a credential: without the signed cookie it
 * opens nothing (see `lib/sera/session.ts`), and sessionStorage dies with the
 * tab.
 *
 * Client-side navigation needs no such help — this provider is mounted in the
 * root layout, above the router's children, so it is not remounted when the
 * visitor moves between pages and the conversation simply continues.
 */

const CONVERSATION_KEY = "serverlys.sera.conversation";

/**
 * ⚠ THE PANEL CLOSES IMMEDIATELY. There is no exit delay and no exit animation.
 *
 * Measured on the reference: the panel is at full opacity with no transform on
 * the last frame it exists and simply gone on the next. This used to hold the
 * panel mounted for 160ms to play a fade; once the fade was removed to match,
 * the delay was a sixth of a second of nothing — a window that ignores you for
 * a beat after you dismiss it. `closing` is still carried through so the seam
 * exists if an animation is ever wanted back, but nothing sets it today.
 */

/**
 * Clearance for the sticky site header when scrolling to a section.
 *
 * The header is 72px (asserted by `scripts/test-nav.mjs`). Landing a section
 * heading exactly at scrollTop would tuck it underneath; 96px puts it just
 * below with a little air, which is where a person expects to find the thing
 * they were sent to.
 */
const HEADER_CLEARANCE = 96;

/** Below this width the panel is a full sheet — see `sera.module.css`. */
const SHEET_QUERY = "(max-width: 30rem)";

/**
 * Scroll a section into view, and KEEP it there while the page settles.
 *
 * Two problems, and the naive version solves neither.
 *
 * 1. THE ELEMENT DOES NOT EXIST YET. A client-side route change does not paint
 *    synchronously, so the target is absent for several frames after
 *    `router.push` resolves. This polls for it instead of scrolling once and
 *    hoping.
 *
 * 2. THE PAGE MOVES UNDER THE SCROLL. Fonts swap, images resolve their
 *    intrinsic height, scroll-reveal sections expand — every one of those
 *    changes the target's offset AFTER the first scroll has already committed.
 *    Measured on /wordpress-hosting: scrolling on the first frame the element
 *    appeared left the heading 457px below where it should have been, which
 *    for a visitor is "Sera said it opened the plans and I am looking at
 *    something else".
 *
 * So it re-measures over the following second and corrects until the target
 * actually sits where it was aimed, then stops. Correction ends early once the
 * position is good, so a page that settles immediately pays nothing.
 */
function scrollToSection(section: string, deadlineMs = 2_500) {
  if (!section) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  /** Within this many px of the target counts as landed. */
  const TOLERANCE = 24;
  /** Re-checks after the first scroll, in ms from the moment it lands. */
  const CORRECTIONS = [180, 420, 780, 1200];

  const aim = (element: HTMLElement, behavior: ScrollBehavior) => {
    const top = element.getBoundingClientRect().top + window.scrollY - HEADER_CLEARANCE;
    window.scrollTo({ top: Math.max(0, top), behavior });
  };

  const startedAt = performance.now();
  const findAndScroll = () => {
    const element = document.getElementById(section);
    if (!element) {
      if (performance.now() - startedAt < deadlineMs) requestAnimationFrame(findAndScroll);
      return;
    }

    aim(element, "smooth");

    for (const delay of CORRECTIONS) {
      setTimeout(() => {
        const current = document.getElementById(section);
        if (!current) return;
        const offBy = Math.abs(current.getBoundingClientRect().top - HEADER_CLEARANCE);
        /*
         * `auto` on corrections, not `smooth`. A second smooth scroll launched
         * while the first is still easing fights it, and the two together read
         * as the page wobbling.
         */
        if (offBy > TOLERANCE) aim(current, "auto");
      }, delay);
    }
  };

  requestAnimationFrame(findAndScroll);
}

type SeraState = {
  isOpen: boolean;
  /** The panel is playing its exit animation and is about to unmount. */
  closing: boolean;
  /** Pixels the cookie notice occupies at the bottom of the viewport. */
  lift: number;
  messages: ChatMessage[];
  status: SeraStatus;
  /** True for any state that should block sending and show the stop control. */
  busy: boolean;
  /** Visitor-safe failure copy, shown inline with a retry. */
  error: string | null;
  workflow: WorkflowView | null;
  intent: Intent;
  /** What a real server-side tool is doing right now. Null when none is. */
  activity: string | null;
  /**
   * The agent phase the server last reported, or null before the first one.
   *
   * ⚠ NOT FOR LAYOUT. Read it to describe what is happening — the panel uses it
   * for the aria-live region — never to decide what to render. `status` owns
   * that, and keeping the two separate is why a dropped phase event costs a
   * sharper announcement rather than a broken panel.
   */
  phase: AgentPhase | null;
  /** Assistant replies that landed while the panel was shut. */
  unread: number;
  hasConversation: boolean;
};

type SeraActions = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  send: (text: string, options?: { startWorkflow?: WorkflowId; label?: string }) => void;
  /** Stop the turn in flight. Whatever was revealed stays on screen. */
  cancel: () => void;
  /**
   * Accept an offered next step. Sends the message the visitor would have
   * typed, carrying the workflow id the server already validated.
   */
  acceptAction: (messageId: string) => void;
  /** Turn down an offered next step. Nothing starts; the card records it. */
  dismissAction: (messageId: string) => void;
  /** Accept an offered navigation. The only thing that moves the browser. */
  acceptProposal: (messageId: string) => void;
  /** Turn down an offered navigation. */
  declineProposal: (messageId: string) => void;
  /** Clear the transcript and start a fresh conversation. */
  reset: () => void;
  submit: () => void;
  retry: () => void;
  dismissError: () => void;
};

const SeraContext = createContext<(SeraState & SeraActions) | null>(null);

export function useSera() {
  const context = useContext(SeraContext);
  if (!context) throw new Error("useSera must be used inside <SeraProvider>");
  return context;
}

/**
 * Sera's context, or null when the provider is not mounted.
 *
 * For components that live in the SITE CHROME rather than inside the widget —
 * the header's "Ask Sera" button. Those render in places Sera may not be
 * mounted (a page outside the root layout, a test harness), and a throw there
 * would take the whole header down over a chat widget. They degrade instead.
 * Inside the widget, keep using `useSera`: there the provider is a guarantee,
 * and a missing one is a bug worth failing loudly for.
 */
export function useSeraOptional() {
  return useContext(SeraContext);
}

let messageCounter = 0;
const nextId = () => `m${(messageCounter += 1)}`;

/**
 * Last-resort handler for a turn that rejected outright.
 *
 * `runTurn` already catches everything it expects — a dead network, a refused
 * key, an aborted stream — and turns it into on-screen copy. This exists for
 * what it does NOT expect: a throw from the code that runs after its own
 * try/catch. Without it, `void runTurn(...)` would let such a throw become an
 * unhandled promise rejection, which in development is a full-screen Next.js
 * error overlay and in production is a silent dead widget.
 *
 * ⚠ The cost of NOT having this is easy to misread. Browser extensions patch
 * `window.fetch` — an ad blocker, an SEO toolbar, a wallet — and when one of
 * them throws, the overlay shows "Failed to fetch" with extension frames in
 * the stack. That is not this widget failing, but it is indistinguishable from
 * it at a glance, so the safest thing is for Sera to be provably incapable of
 * producing an unhandled rejection of its own.
 */
function reportTurnFailure(error: unknown) {
  console.error("[sera] turn rejected unexpectedly", error);
}

export function SeraProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  /*
   * Mirrors `messages` so callbacks can READ the transcript without taking it
   * as a dependency — `acceptProposal` needs to look up one message, and
   * depending on the whole array would rebuild the callback on every streamed
   * word.
   */
  const messagesRef = useRef<ChatMessage[]>(messages);
  const [status, setStatus] = useState<SeraStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowView | null>(null);
  const [intent, setIntent] = useState<Intent>("UNKNOWN");
  const [activity, setActivity] = useState<string | null>(null);
  /*
   * The agent phase the server last reported.
   *
   * ⚠ ADVISORY, AND NOTHING RENDERS BECAUSE OF IT. Every visual decision still
   * reads `status`; this only sharpens the screen-reader status line and feeds
   * telemetry. Wiring layout to it would make the widget depend on a stream
   * event arriving, and a dropped `phase` would then be a broken panel rather
   * than a slightly vaguer announcement.
   */
  const [phase, setPhase] = useState<AgentPhase | null>(null);
  const [unread, setUnread] = useState(0);

  const conversationId = useRef<string | null>(null);
  const abort = useRef<AbortController | null>(null);
  /** The last message sent, so `retry` does not need the composer's state. */
  const lastSent = useRef<{ text: string; startWorkflow?: WorkflowId } | null>(null);
  /** Answer to the most recent navigation offer, pending delivery to the model. */
  const navOutcome = useRef<{ label: string; accepted: boolean } | null>(null);
  /** An offer made this turn, waiting for the reply text to finish. */
  const pendingProposal = useRef<NavProposal | null>(null);
  /** Same, for an offered next step. At most one of the two per turn. */
  const pendingAction = useRef<ActionOffer | null>(null);
  /** A same-page mark, waiting for the reply text to finish. */
  const pendingMark = useRef<{ target: string; label: string } | null>(null);
  /*
   * The countdown between Sera saying it will open a page and the page opening.
   * Held in a ref so every exit — accepting early, pressing "Stay here", asking
   * another question, resetting the chat, unmounting — can cancel it. A timer
   * that survives any of those navigates someone who has moved on, which is the
   * exact surprise the announcement exists to prevent.
   */
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelOpenTimer = useCallback(() => {
    if (openTimer.current === null) return;
    clearTimeout(openTimer.current);
    openTimer.current = null;
  }, []);
  /*
   * `runTurn` arms the countdown, but `acceptProposal` is defined below it and
   * would have to be a dependency — and rebuilding `runTurn` mid-stream aborts
   * the turn. Same reason as `closePanelRef`.
   */
  const acceptProposalRef = useRef<((messageId: string) => void) | null>(null);

  /*
   * Called when something OTHER than the countdown ends it — a new question, a
   * reset. The card must not stay on screen counting down towards a navigation
   * that will never happen, so it settles to "stayed on this page" and the
   * model is told, exactly as if "Stay here" had been pressed. Asking a fresh
   * question is a person's way of saying they are no longer waiting.
   */
  const standDownPendingNav = useCallback(() => {
    cancelOpenTimer();
    const live = messagesRef.current.find((m) => m.proposal?.state === "pending");
    const proposal = live?.proposal;
    if (!live || !proposal) return;
    navOutcome.current = { label: proposal.label, accepted: false };
    setMessages((current) =>
      current.map((m) =>
        m.id === live.id && m.proposal?.state === "pending"
          ? { ...m, proposal: { ...m.proposal, state: "declined" as const } }
          : m,
      ),
    );
  }, [cancelOpenTimer]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  /*
   * Where the visitor has been, this page load.
   *
   * ⚠ IN MEMORY, CAPPED, AND NEVER PERSISTED — the same rule the transcript
   * follows, and for a weaker version of the same reason: a browsing trail
   * written to storage is a tracking record, and this provider is mounted on
   * every page of the site. It dies with the tab.
   *
   * ⚠ AND IT IS A REF, NOT STATE. The trail changes on every navigation, and a
   * state update here would re-render the provider — and therefore the whole
   * app under it — on every route change, for data that is only ever read when
   * a message is sent. `pathname` already comes from the router for the
   * rendering that needs it.
   *
   * Consecutive duplicates are collapsed: a visitor who reloads /pricing has
   * been to /pricing once as far as answering their question is concerned.
   */
  const trail = useRef<string[]>([]);
  useEffect(() => {
    const previous = trail.current[trail.current.length - 1];
    if (previous === pathname) return;
    trail.current = [...trail.current, pathname].slice(-8);
  }, [pathname]);

  /*
   * Lets `runTurn` collapse the panel without closing over `closePanel`, whose
   * identity would otherwise have to be a dependency — and rebuilding
   * `runTurn` mid-stream aborts the turn.
   */
  const closePanelRef = useRef<(() => void) | null>(null);

  /* ── Conversation continuity across reloads ───────────────────────────── */

  useEffect(() => {
    try {
      conversationId.current = sessionStorage.getItem(CONVERSATION_KEY);
    } catch {
      /* private mode — the conversation is simply per-page-load */
    }
  }, []);

  const rememberConversation = useCallback((id: string) => {
    conversationId.current = id;
    try {
      sessionStorage.setItem(CONVERSATION_KEY, id);
    } catch {
      /* private mode */
    }
  }, []);

  /* ── Keeping clear of the cookie notice ───────────────────────────────── */

  /**
   * The cookie banner is a full-width bar pinned to the bottom of the
   * viewport, so the launcher would land on top of it. Its height is MEASURED
   * rather than assumed: it changes with viewport width, with how the copy
   * wraps, and again when the settings panel opens.
   *
   * This observes the consent component and does not touch it. If it is absent
   * — already answered, or removed one day — the lift is zero and nothing here
   * needs to know.
   */
  /**
   * Reduced-motion preference, tracked live.
   *
   * ⚠ THE PACED REVEAL IS JAVASCRIPT, so the CSS media queries that gate every
   * other animation in this widget do not reach it. Someone who has asked their
   * system for less motion would still get text crawling in a word at a time —
   * the most sustained movement Sera produces. Under `reduce` the gate still
   * applies (the cadence floor is about rhythm, not motion, and a reply that
   * appears in 40ms reads as canned to everyone) but the answer then lands in
   * one piece instead of being animated into place.
   */
  const reducedMotion = useRef(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = query.matches;
    const onChange = (event: MediaQueryListEvent) => {
      reducedMotion.current = event.matches;
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const [lift, setLift] = useState(0);
  useEffect(() => {
    const root = document.documentElement;

    const measure = () => {
      const banner = document.querySelector<HTMLElement>("[data-cookie-consent]");
      /*
       * ⚠ `offsetHeight`, NOT `offsetParent !== null`. The banner is
       * `position: fixed`, and a fixed element's `offsetParent` is null in
       * every browser — so the usual visibility idiom reports "hidden" for a
       * banner that is plainly on screen, the lift stays 0, and the launcher
       * lands on top of the notice. `offsetHeight` is 0 exactly when the
       * element is `display: none`, which is how the consent CSS hides it.
       */
      setLift(banner && banner.offsetHeight > 0 ? banner.offsetHeight : 0);
    };

    measure();

    const observer = new ResizeObserver(measure);
    const banner = document.querySelector<HTMLElement>("[data-cookie-consent]");
    if (banner) observer.observe(banner);

    // The banner unmounts when answered, and `data-consent` lands on <html>.
    const mutations = new MutationObserver(measure);
    mutations.observe(root, { attributes: true, attributeFilter: ["data-consent"] });
    mutations.observe(document.body, { childList: true, subtree: false });

    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* ── The reveal loop ──────────────────────────────────────────────────── */

  /**
   * Text that has arrived from the server but has not yet been shown.
   *
   * The whole cadence mechanism is this buffer plus the interval below. The
   * network fills it; the loop drains it at a readable pace, and not before
   * the gate opens.
   */
  const pending = useRef("");
  const gate = useRef<CadenceGate | null>(null);
  const streamFinished = useRef(false);
  const revealTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Id reserved for this turn's assistant bubble, allocated before it exists. */
  const bubbleId = useRef<string | null>(null);
  /**
   * Whether that bubble is actually ON SCREEN yet.
   *
   * ⚠ THE BUBBLE IS CREATED BY THE REVEAL LOOP, ON THE FIRST WORD RELEASED —
   * never when the first token arrives. Creating it on arrival pops an empty
   * bubble under the typing indicator and leaves it blank for the whole
   * perceived-processing window: the widget shows both "thinking" and an empty
   * answer at the same time, which is the precise artefact the cadence layer
   * exists to prevent. Measured at 180ms in, blank until 1250ms, before this.
   */
  const bubbleExists = useRef(false);
  /** Resolves when the reveal has drained, so the turn can settle honestly. */
  const drained = useRef<(() => void) | null>(null);

  const stopRevealLoop = useCallback(() => {
    if (revealTimer.current !== null) {
      clearInterval(revealTimer.current);
      revealTimer.current = null;
    }
  }, []);

  const startRevealLoop = useCallback(() => {
    if (revealTimer.current !== null) return;

    revealTimer.current = setInterval(() => {
      const now = performance.now();

      // Still inside the minimum perceived-processing window. Hold everything.
      if (gate.current && !gate.current.mayReveal(now)) return;

      const words = countWords(pending.current);

      if (words === 0) {
        if (streamFinished.current) {
          stopRevealLoop();
          drained.current?.();
          drained.current = null;
        }
        return;
      }

      const id = bubbleId.current;
      if (!id) return;

      const take = reducedMotion.current
        ? words
        : wordsThisTick(words, streamFinished.current);
      const { taken, rest } = takeWords(pending.current, take);
      pending.current = rest;

      const isFirst = !bubbleExists.current;
      bubbleExists.current = true;

      setStatus("streaming");
      setActivity(null);
      setMessages((current) =>
        isFirst
          ? [...current, { id, role: "assistant", text: taken, at: Date.now() }]
          : current.map((message) =>
              message.id === id ? { ...message, text: message.text + taken } : message,
            ),
      );
    }, CADENCE.tickMs);
  }, [stopRevealLoop]);

  // Never leave an interval behind if the tree unmounts mid-answer.
  useEffect(() => () => stopRevealLoop(), [stopRevealLoop]);

  /* ── Sending ──────────────────────────────────────────────────────────── */

  const runTurn = useCallback(
    async (text: string, startWorkflow?: WorkflowId) => {
      abort.current?.abort();
      const controller = new AbortController();
      abort.current = controller;

      // Reset the cadence machinery for a fresh turn.
      stopRevealLoop();
      pending.current = "";
      streamFinished.current = false;
      bubbleExists.current = false;
      gate.current = new CadenceGate(performance.now());

      /*
       * ⚠ READ IT INTO A LOCAL, THEN CLEAR. Clearing the ref before the request
       * body is built — which is what this did first — meant the field was
       * always null by the time it was serialised, so the model never learned
       * how its offer was answered and would not re-offer a destination the
       * visitor had turned down and then asked for. Reported exactly once:
       * after this turn it is in the conversation history.
       */
      /*
       * ⚠ BEFORE `navOutcome` IS READ. A card still counting down when they
       * typed resolves here, and its outcome has to be in the ref by the time
       * the line below picks it up — otherwise the model is told nothing this
       * turn and learns about it a turn too late.
       */
      standDownPendingNav();
      setPhase(null);

      const outcome = navOutcome.current;
      navOutcome.current = null;
      pendingProposal.current = null;
      pendingAction.current = null;
      pendingMark.current = null;

      const assistantId = nextId();
      bubbleId.current = assistantId;

      setStatus("processing");
      setError(null);
      setActivity(null);

      let cancelled = false;

      try {
        for await (const event of streamChat(
          {
            conversationId: conversationId.current,
            message: text,
            pathname,
            trail: trail.current,
            title: typeof document === "undefined" ? undefined : document.title,
            startWorkflow,
            navigationOutcome: outcome ?? undefined,
          },
          controller.signal,
        )) {
          switch (event.t) {
            case "conversation":
              rememberConversation(event.id);
              if (event.view) setWorkflow(event.view);
              break;

            case "delta":
              /*
               * Buffered, not rendered. The reveal loop decides when — and
               * whether — any of this reaches the screen.
               */
              pending.current += event.v;
              startRevealLoop();
              break;

            case "propose-navigation":
              /*
               * ⚠ HELD UNTIL THE ANSWER HAS BEEN SAID. The tool call resolves
               * long before the cadence gate releases the first word, so
               * appending the card here put it ABOVE the explanation it belongs
               * under — the visitor was asked "shall I open this?" before being
               * told what "this" was. Queued now, appended when the turn
               * settles. Only the most recent offer survives; a turn has no
               * business proposing two destinations.
               */
              pendingProposal.current = {
                path: event.path,
                section: event.section,
                label: event.label,
                /*
                 * ⚠ CARRIED THROUGH THE COUNTDOWN. Omitted from this literal
                 * at first, which made the whole feature a silent no-op: the
                 * server resolved the plan card, the event carried it, and the
                 * client built a proposal without it — so `acceptProposal` had
                 * nothing to mark and reported nothing, because "no highlight"
                 * is indistinguishable from "highlight succeeded" if you only
                 * watch the page change.
                 */
                highlight: event.highlight,
                state: "pending",
              };
              track("sera_navigation_offered", {
                path: event.path,
                section: event.section,
              });
              break;

            case "tool":
              /*
               * A REAL tool is running, and the floor rises to match. This is
               * the one place perceived time is deliberately extended, and it
               * is extended only because actual server-side work is happening
               * and its label is on screen saying which.
               */
              gate.current?.toolRan();
              if (event.label) track("sera_tool_ran", { label: event.label });
              if (!bubbleExists.current) {
                setStatus("tool");
                setActivity(event.label);
              }
              break;

            case "highlight":
              /*
               * ⚠ HELD UNTIL THE WORDS HAVE BEEN SAID, for the same reason the
               * cards are. The tool resolves long before the cadence gate
               * releases the first syllable, so marking here would ring a card
               * several hundred milliseconds before the sentence explaining
               * why — a page flashing at someone who has not been told
               * anything yet. Queued, and fired when the turn settles.
               */
              pendingMark.current = { target: event.target, label: event.label };
              break;

            case "propose-action":
              /*
               * Queued for the same reason the navigation card is: the tool
               * call resolves long before the cadence gate releases the first
               * word, so appending here would put a button above the sentence
               * explaining it. Only the most recent survives — the server
               * already refuses a second, and this is the client half of the
               * same rule.
               */
              pendingAction.current = {
                workflow: event.workflow,
                label: event.label,
                detail: event.detail,
                state: "pending",
              };
              break;

            case "phase":
              setPhase(event.phase);
              track("sera_phase", { phase: event.phase });
              if (event.phase === "WAITING_FOR_CONFIRMATION") {
                track("sera_confirmation_requested");
              } else if (event.phase === "COMPLETED") {
                track("sera_conversation_completed");
              } else if (event.phase === "HANDOFF") {
                track("human_support_requested");
              }
              break;

            case "intent":
              setIntent(event.intent);
              if (event.intent !== "UNKNOWN") {
                track("sera_intent_detected", { intent: event.intent });
              }
              break;

            case "workflow":
              setWorkflow((previous) => {
                if (event.view && previous?.id !== event.view.id) {
                  track("sera_workflow_started", { workflow: event.view.id });
                  track("sera_lead_started", { workflow: event.view.id });
                  if (event.view.id === "WEBSITE_MIGRATION") track("migration_started");
                  if (event.view.id === "HUMAN_CONTACT") track("human_support_requested");
                }
                return event.view;
              });
              break;

            case "error":
              /*
               * If nothing has been revealed, the error IS the reply and
               * belongs in the transcript where the visitor is looking. If text
               * had already arrived, it is a mid-answer failure — keep what
               * they read and show the notice beneath it, so a half-answer is
               * never passed off as complete.
               */
              track("sera_error");
              if (!bubbleExists.current && pending.current.length === 0) {
                bubbleExists.current = true;
                setMessages((current) => [
                  ...current,
                  {
                    id: assistantId,
                    role: "assistant",
                    text: event.message,
                    at: Date.now(),
                    system: true,
                  },
                ]);
              } else {
                setError(event.message);
              }
              break;

            case "done":
              break;
          }
        }
      } catch {
        if (controller.signal.aborted) {
          cancelled = true;
        } else {
          setError(GENERIC_ERROR);
          track("sera_error");
        }
      }

      if (abort.current === controller) abort.current = null;

      if (cancelled || controller.signal.aborted) {
        /*
         * Stopped by the visitor. Drop what has not been shown rather than
         * flushing it: they asked it to stop, and dumping the rest of the
         * answer after they pressed stop is the opposite of stopping.
         */
        stopRevealLoop();
        pending.current = "";
        setActivity(null);
        setStatus("cancelled");
        return;
      }

      /*
       * The network is done, but the screen may not be. Wait for the reveal to
       * drain before settling the turn, or the composer would re-enable and the
       * status flip to complete while words were still appearing.
       */
      streamFinished.current = true;

      if (countWords(pending.current) > 0 || revealTimer.current !== null) {
        startRevealLoop();
        await new Promise<void>((resolve) => {
          drained.current = resolve;
          // Safety net: never hang the UI on a loop that somehow stalls.
          setTimeout(resolve, 8_000);
        });
      } else if (!bubbleExists.current) {
        /*
         * Nothing streamed and nothing errored — an empty turn. Say something
         * true rather than leaving the visitor with a typing dot that stopped.
         */
        setMessages((current) => [
          ...current,
          {
            id: assistantId,
            role: "assistant",
            text: GENERIC_ERROR,
            at: Date.now(),
            system: true,
          },
        ]);
      }

      stopRevealLoop();
      bubbleId.current = null;
      setActivity(null);

      /*
       * The card lands last, under the sentence that announced it — and only
       * now does the clock start. Arming it when the tool call resolved would
       * have burned the whole wait while the answer was still being revealed,
       * so the page would change on the same beat as the words explaining it,
       * or before them. The visitor gets the full window AFTER reading why.
       */
      /*
       * The mark lands first, under the sentence that named it and before any
       * card. A ring appearing after a button would read as belonging to the
       * button rather than to the recommendation.
       *
       * ⚠ AND IT IS NOT REPORTED IF IT FOUND NOTHING. `markTarget` polls the
       * DOM and says whether it landed; when it does not — a page that changed
       * shape, a card behind a closed tab — the transcript gets no line at all
       * rather than "I have highlighted it" about a page that did not change.
       */
      const mark = pendingMark.current;
      pendingMark.current = null;
      if (mark) {
        markTarget(mark.target, (found) => {
          if (!found) {
            track("sera_highlight_missed", { target: mark.target });
            return;
          }
          track("sera_highlighted", { target: mark.target });
        });
      }

      const offeredAction = pendingAction.current;
      pendingAction.current = null;
      if (offeredAction) {
        setMessages((current) => [
          ...current,
          { id: nextId(), role: "assistant", text: "", at: Date.now(), action: offeredAction },
        ]);
      }

      const offered = pendingProposal.current;
      pendingProposal.current = null;
      if (offered) {
        const cardId = nextId();
        setMessages((current) => [
          ...current,
          { id: cardId, role: "assistant", text: "", at: Date.now(), proposal: offered },
        ]);
        cancelOpenTimer();
        openTimer.current = setTimeout(() => {
          openTimer.current = null;
          acceptProposalRef.current?.(cardId);
        }, NAV_OPEN_DELAY_MS);
      }

      setStatus("complete");
      if (!openRef.current) setUnread((count) => count + 1);
    },
    [
      cancelOpenTimer,
      pathname,
      rememberConversation,
      standDownPendingNav,
      startRevealLoop,
      stopRevealLoop,
    ],
  );

  const send = useCallback(
    (text: string, options?: { startWorkflow?: WorkflowId; label?: string }) => {
      const trimmed = text.trim();
      if (!trimmed || isBusy(status)) return;

      lastSent.current = { text: trimmed, startWorkflow: options?.startWorkflow };
      // The visitor's own message lands at 0ms. Nothing is paced but Sera.
      setMessages((current) => [
        ...current,
        { id: nextId(), role: "user", text: trimmed, at: Date.now() },
      ]);
      track("sera_message_sent", {
        chars: trimmed.length,
        quickAction: options?.label ?? undefined,
      });
      void runTurn(trimmed, options?.startWorkflow).catch(reportTurnFailure);
    },
    [runTurn, status],
  );

  const cancel = useCallback(() => {
    abort.current?.abort();
    cancelOpenTimer();
  }, [cancelOpenTimer]);

  /**
   * THIS is the only thing that moves the browser — fired by the countdown, or
   * early if the visitor taps "Open it now".
   *
   * Everything up to here was an announcement. On open: route if the page
   * differs, scroll to the section, mark the card resolved so it cannot fire
   * twice, and post a line saying what happened — a page changing under someone
   * deserves a sentence in the transcript, and it doubles as the invitation to
   * keep asking questions about what they are now looking at.
   */
  const acceptProposal = useCallback(
    (messageId: string) => {
      /*
       * Whichever path got here, the clock is done. Tapping "Open it now" and
       * then letting the timer fire would otherwise run this twice and push two
       * history entries — the same double-navigation the note below guards.
       */
      cancelOpenTimer();

      /*
       * ⚠ THE SIDE EFFECTS HAPPEN OUTSIDE THE STATE UPDATER, and the lookup
       * uses a ref rather than the updater's draft.
       *
       * Routing and scrolling from inside `setMessages` looked tidier and was
       * wrong: React may invoke an updater more than once for a single update
       * (StrictMode does it deliberately), which would fire `router.push`
       * twice and push two entries onto the history stack — the visitor's back
       * button would then need two presses to leave. Updaters must be pure.
       */
      const proposal = messagesRef.current.find((m) => m.id === messageId)?.proposal;
      if (!proposal || proposal.state !== "pending") return;

      if (proposal.path !== window.location.pathname) router.push(proposal.path);
      scrollToSection(proposal.section);

      /*
       * ⚠ AFTER THE ROUTE, AND IT POLLS. The destination's DOM does not exist
       * on the line after `router.push` — `markTarget` retries for ~700ms,
       * which is the same problem and the same answer as `scrollToSection`.
       *
       * The mark also WINS over the section scroll when both are present, and
       * that ordering is deliberate: the section is where the answer lives, the
       * marked card IS the answer, and it is inside that section anyway. Two
       * scrolls would fight; the later one should be the more specific one.
       */
      if (proposal.highlight) markTarget(proposal.highlight);
      track("sera_navigated", { path: proposal.path, section: proposal.section });
      navOutcome.current = { label: proposal.label, accepted: true };

      /*
       * ⚠ ON A PHONE THE PANEL IS COVERING THE PAGE. Navigating underneath a
       * full-height sheet shows the visitor nothing — the one thing this
       * feature exists to do. Collapse it so they can actually see the
       * section; the conversation is untouched and the launcher brings it
       * straight back.
       */
      if (window.matchMedia(SHEET_QUERY).matches) closePanelRef.current?.();

      setMessages((current) => [
        ...current.map((m) =>
          m.id === messageId
            ? { ...m, proposal: { ...proposal, state: "accepted" as const } }
            : m,
        ),
        {
          id: nextId(),
          role: "assistant" as const,
          /*
           * ⚠ THE LABEL IS NOT REPEATED. The card directly above this line
           * already reads "Opened WordPress hosting — Plans and pricing", so
           * the old copy — "Opened WordPress hosting — Plans and pricing. Ask
           * me anything…" — printed the same eleven words twice, one under the
           * other. What this line is for is the invitation; the card is for
           * the fact.
           */
          text: proposal.highlight
            ? "I have marked the one I would pick. Ask me anything about it."
            : "Ask me anything about what you are looking at.",
          at: Date.now(),
          system: true,
        },
      ]);
    },
    [cancelOpenTimer, router],
  );

  /*
   * So `runTurn` can arm the countdown without taking `acceptProposal` as a
   * dependency — rebuilding `runTurn` mid-stream aborts the turn. Same shape as
   * `closePanelRef`, and in an effect rather than during render because a ref
   * written while rendering is a ref written twice under StrictMode.
   */
  useEffect(() => {
    acceptProposalRef.current = acceptProposal;
  }, [acceptProposal]);

  /**
   * "Stay here", pressed inside the countdown window. The clock stops, nothing
   * moves, and the card records that the page was left alone.
   */
  const declineProposal = useCallback(
    (messageId: string) => {
      cancelOpenTimer();
      const proposal = messagesRef.current.find((m) => m.id === messageId)?.proposal;
      if (!proposal || proposal.state !== "pending") return;
      navOutcome.current = { label: proposal.label, accepted: false };
      setMessages((current) =>
        current.map((m) =>
          m.id === messageId && m.proposal?.state === "pending"
            ? { ...m, proposal: { ...m.proposal, state: "declined" as const } }
            : m,
        ),
      );
      track("sera_navigation_declined");
    },
    [cancelOpenTimer],
  );

  /**
   * The visitor tapped "Start it".
   *
   * ⚠ IT GOES THROUGH `send`, NOT THROUGH A SIDE CHANNEL. The tap becomes an
   * ordinary visitor message carrying `startWorkflow` — the same path the
   * opening screen's quick actions have always used, and the same path the chat
   * route validates against the workflow registry before the model runs. There
   * is no second entry point to audit, and the transcript reads as a
   * conversation rather than as a conversation with a hole in it where a button
   * was pressed.
   *
   * The message text is written HERE and is first-person-visitor on purpose:
   * what lands in the transcript is "Yes — start the migration request", which
   * is what they meant, rather than a synthetic marker the model has to decode.
   */
  const acceptAction = useCallback(
    (messageId: string) => {
      const action = messagesRef.current.find((m) => m.id === messageId)?.action;
      if (!action || action.state !== "pending") return;
      if (isBusy(status)) return;

      setMessages((current) =>
        current.map((m) =>
          m.id === messageId && m.action?.state === "pending"
            ? { ...m, action: { ...m.action, state: "accepted" as const } }
            : m,
        ),
      );
      track("sera_workflow_started", { workflow: action.workflow, via: "action_card" });
      send(`Yes — start the ${action.label.toLowerCase()}.`, {
        startWorkflow: action.workflow,
        label: action.label,
      });
    },
    [send, status],
  );

  /** "Not now". Nothing starts; the card records that it was offered. */
  const dismissAction = useCallback((messageId: string) => {
    setMessages((current) =>
      current.map((m) =>
        m.id === messageId && m.action?.state === "pending"
          ? { ...m, action: { ...m.action, state: "dismissed" as const } }
          : m,
      ),
    );
  }, []);

  /**
   * Start over.
   *
   * Drops the conversation id as well as the transcript, so the NEXT message
   * opens a new server-side conversation rather than continuing the old one
   * behind a cleared screen. A "new chat" that silently keeps the old context
   * is worse than none: the visitor believes they have a blank slate while the
   * model still remembers the details they just wiped.
   */
  const reset = useCallback(() => {
    abort.current?.abort();
    stopRevealLoop();
    /*
     * The transcript is about to be wiped. A countdown outliving it would
     * navigate a blank chat seconds later, with nothing on screen to explain
     * why the page moved.
     */
    cancelOpenTimer();
    clearMarks();
    pending.current = "";
    bubbleId.current = null;
    bubbleExists.current = false;
    conversationId.current = null;
    lastSent.current = null;
    try {
      sessionStorage.removeItem(CONVERSATION_KEY);
    } catch {
      /* private mode */
    }
    setMessages([]);
    setWorkflow(null);
    setIntent("UNKNOWN");
    setActivity(null);
    setError(null);
    setStatus("idle");
  }, [cancelOpenTimer, stopRevealLoop]);

  const retry = useCallback(() => {
    const last = lastSent.current;
    if (!last || isBusy(status)) return;
    setError(null);
    void runTurn(last.text, last.startWorkflow).catch(reportTurnFailure);
  }, [runTurn, status]);

  /* ── Submitting ───────────────────────────────────────────────────────── */

  const submit = useCallback(async () => {
    const id = conversationId.current;
    if (!id || isBusy(status)) return;

    setStatus("submitting");
    setError(null);
    /*
     * ⚠ FIRED BEFORE THE REQUEST, NOT AFTER. This is the record that a PERSON
     * authorised the action, and that is true the moment they tap regardless of
     * whether the filing then succeeds. Moving it below the await would lose
     * exactly the cases worth auditing — the ones where someone consented and
     * the system failed them.
     */
    track("sera_confirmation_accepted");

    const outcome = await submitRequest(id);

    /*
     * The confirmation text comes from the SERVER, including the reference
     * number and including the case where nothing could be delivered. The model
     * never writes it, so there is no path by which a visitor is told their
     * request was sent when it was not.
     */
    setMessages((current) => [
      ...current,
      {
        id: nextId(),
        role: "assistant",
        text: outcome.message,
        at: Date.now(),
        system: true,
      },
    ]);

    if (outcome.ok) {
      setWorkflow(outcome.view);
      if (!outcome.duplicate) {
        track("sera_lead_completed", {
          workflow: outcome.view.id,
          notified: outcome.notified,
        });
        if (outcome.view.id === "WEBSITE_MIGRATION") track("migration_submitted");
      }
    } else if (outcome.view) {
      setWorkflow(outcome.view);
    }

    setStatus("complete");
  }, [status]);

  /* ── Panel ────────────────────────────────────────────────────────────── */

  const openPanel = useCallback(() => {
    setClosing(false);
    setOpen((wasOpen) => {
      if (!wasOpen) track("sera_opened", { pathname });
      return true;
    });
    setUnread(0);
  }, [pathname]);

  const closePanel = useCallback(() => {
    if (!openRef.current) return;
    track("sera_closed");
    setClosing(false);
    setOpen(false);
  }, []);

  useEffect(() => {
    closePanelRef.current = closePanel;
  }, [closePanel]);

  const toggle = useCallback(() => {
    if (openRef.current) closePanel();
    else openPanel();
  }, [closePanel, openPanel]);

  // Abandon any in-flight turn if the widget unmounts (route-level teardown).
  useEffect(
    () => () => {
      abort.current?.abort();
      if (openTimer.current !== null) clearTimeout(openTimer.current);
    },
    [],
  );

  const value = useMemo<SeraState & SeraActions>(
    () => ({
      isOpen: open,
      closing,
      lift,
      messages,
      status,
      busy: isBusy(status),
      error,
      workflow,
      intent,
      activity,
      phase,
      unread,
      hasConversation: messages.length > 0,
      open: openPanel,
      close: closePanel,
      toggle,
      send,
      cancel,
      acceptProposal,
      declineProposal,
      acceptAction,
      dismissAction,
      reset,
      submit: () => void submit(),
      retry,
      dismissError: () => setError(null),
    }),
    [
      open,
      closing,
      lift,
      messages,
      status,
      error,
      workflow,
      intent,
      activity,
      phase,
      unread,
      openPanel,
      closePanel,
      toggle,
      send,
      cancel,
      acceptProposal,
      declineProposal,
      acceptAction,
      dismissAction,
      reset,
      submit,
      retry,
    ],
  );

  /*
   * NOTHING IS RENDERED AROUND `children`. The provider adds no wrapper
   * element, because the root layout's <body> is a flex column whose direct
   * children are the header, <main> and the footer — an extra div between them
   * would collapse that layout on every page of the site. The measured `lift`
   * travels through context instead and is applied by the widget's own fixed
   * container, which is outside the document flow entirely.
   */
  return <SeraContext.Provider value={value}>{children}</SeraContext.Provider>;
}
