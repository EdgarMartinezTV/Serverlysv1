"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";
import styles from "./sera.module.css";
import { SeraIcon, SeraMark } from "./sera-mark";
import { SeraMessage } from "./sera-message";
import { SeraComposer } from "./sera-composer";
import { SeraQuickActions } from "./sera-quick-actions";
import { SeraAction } from "./sera-action";
import { SeraProposal } from "./sera-proposal";
import { SeraTyping } from "./sera-typing";
import { SeraWorkflow } from "./sera-workflow";
import { useSera } from "./sera-provider";

/**
 * The chat window.
 *
 * NOT A MODAL, and that is deliberate. `aria-modal` is absent, focus is not
 * trapped, and the page behind stays scrollable and operable on desktop. Same
 * reasoning as the cookie notice in this codebase: a panel that seizes the
 * document turns "I have a question about this page" into "I can no longer read
 * this page". (The phone SHEET is different — it covers the viewport, so
 * background scrolling is locked while it is open. That lock lives in
 * `sera-widget.tsx`.)
 *
 * Escape closes, and focus returns to the launcher — the two things a
 * non-modal disclosure still owes a keyboard user.
 *
 * ANNOUNCEMENT STRATEGY. The transcript itself is `aria-live="off"`. A live
 * region over streaming text makes a screen reader read a reply one fragment at
 * a time as it arrives, which is unusable. Instead a single visually-hidden
 * status region announces what is happening and then the finished message once.
 */

/** Distance from the bottom, in px, still counted as "following along". */
const PINNED_THRESHOLD = 72;

export function SeraPanel({ onClose, closing }: { onClose: () => void; closing?: boolean }) {
  const { messages, status, busy, activity, phase, error, retry, dismissError, workflow } =
    useSera();

  const scroller = useRef<HTMLDivElement>(null);

  /**
   * Mount time, captured once.
   *
   * Everything already in the transcript when the panel opens is HISTORY and
   * must appear instantly. Only messages stamped after this animate. Without
   * it, reopening the widget replays the whole conversation as if it were being
   * said again, which is the single most obviously artificial thing a chat
   * panel can do.
   *
   * Lazy state rather than a ref: this value is READ DURING RENDER to decide a
   * class name, and a ref read in the render body is a value React is entitled
   * to discard.
   */
  const [openedAt] = useState(() => Date.now());

  const streaming = status === "streaming";
  const lastMessage = messages[messages.length - 1];
  const streamingInto = streaming && lastMessage?.role === "assistant" ? lastMessage.id : null;

  /* ── Escape to close ──────────────────────────────────────────────────── */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  /* ── Scroll ownership ─────────────────────────────────────────────────── */

  /**
   * Who is driving the scroll position: the conversation, or the reader.
   *
   * `pinned` starts true and stays true while the visitor is at the bottom. The
   * moment they scroll UP — to re-read an earlier answer, or to copy a price out
   * of one — it goes false and the panel STOPS moving the viewport, even
   * mid-stream. Dragging someone back down while they are reading is the
   * defining failure of cheap chat UIs, and a streaming reply makes it happen
   * thirty times a second.
   *
   * The way back is explicit: a "Jump to latest" control, not a hijack.
   */
  const [pinned, setPinned] = useState(true);

  const handleScroll = useCallback(() => {
    const element = scroller.current;
    if (!element) return;
    const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
    setPinned(distance < PINNED_THRESHOLD);
  }, []);

  const scrollToLatest = useCallback((behavior: ScrollBehavior = "smooth") => {
    const element = scroller.current;
    if (!element) return;
    element.scrollTo({ top: element.scrollHeight, behavior });
    setPinned(true);
  }, []);

  /**
   * Open at the bottom of an EXISTING conversation, and at the top of a new one.
   *
   * ⚠ Scrolling to the bottom unconditionally scrolled the greeting and the
   * openers off the top of a first-time panel — the visitor's first sight of
   * Sera was an empty middle of a transcript. There is only something to scroll
   * past when there is history.
   */
  const hasHistory = messages.length > 0;
  useEffect(() => {
    if (hasHistory) scrollToLatest("auto");
    // Deliberately mount-only: later scrolling is the `pinned` effect's job.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pinned) return;
    /*
     * ⚠ NOTHING TO FOLLOW MEANS NOTHING TO SCROLL. Without this guard the
     * effect fires once on mount with `pinned` true and pins an EMPTY
     * conversation to its bottom — which, because the greeting and the six
     * openers are taller than the panel, hid the greeting behind the header on
     * first open. Auto-follow is for content arriving, not for arriving at
     * content.
     */
    if (messages.length === 0) return;
    const element = scroller.current;
    if (!element) return;
    /*
     * `auto`, not `smooth`. Smooth scrolling re-targets on every word released
     * during a stream, and the easing curves never resolve — the transcript
     * ends up permanently gliding a few pixels behind the text.
     */
    element.scrollTop = element.scrollHeight;
  }, [messages, activity, workflow, pinned]);

  /* ── Screen-reader status ─────────────────────────────────────────────── */
  /*
   * ⚠ THE ONLY PLACE THE AGENT PHASE IS USED IN THE UI, and it is used to say
   * something a sighted visitor can already see for themselves.
   *
   * The countdown card, the progress strip and the send button are all visible
   * state changes; to a screen-reader user they are silent DOM. `status` alone
   * cannot tell them apart — a turn that ended with the send button appearing
   * and one that ended with a plain answer are both `complete` — so the phase
   * supplies the distinction and nothing else.
   *
   * Every branch below describes real state: WAITING_FOR_CONFIRMATION means the
   * button is rendered right now, HANDOFF means a HUMAN_CONTACT record exists.
   * No phase is announced as an activity ("analysing", "planning") — the same
   * rule `sera-typing.tsx` holds to, for the same reason.
   */
  const announcement = useMemo(() => {
    if (status === "submitting") return "Sending your request to the Serverlys team.";
    if (status === "tool") return activity ?? "Sera is working on that.";
    if (status === "processing") return "Sera is working on that.";
    if (status === "cancelled") return "Stopped.";
    if (status === "complete" && lastMessage?.role === "assistant") {
      const suffix =
        phase === "WAITING_FOR_CONFIRMATION"
          ? " Your request is ready to send. The send button is below the conversation."
          : phase === "HANDOFF"
            ? " This is on its way to a person at Serverlys."
            : "";
      return `${lastMessage.text}${suffix}`;
    }
    return "";
  }, [status, activity, phase, lastMessage]);

  /*
   * The indicator belongs on screen from "sent" until the first word is
   * actually revealed — which, because of the cadence floor, is later than the
   * first token arriving. Keying it off the bubble's existence rather than off
   * the network is what makes the handover from indicator to text seamless
   * instead of a flicker.
   */
  const showIndicator = (status === "processing" || status === "tool") && streamingInto === null;

  return (
    <div
      id="sera-panel"
      role="dialog"
      aria-label={`Sera — ${company.name} AI assistant`}
      className={cn(styles.panel, closing && styles.panelClosing)}
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-primary">
          <SeraMark className="h-6 w-6" />
        </span>

        <p className={cn(styles.headerTitle, "truncate")}>Sera</p>

        {/* The reference's collapse control: a chevron, not an ×. */}
        <button
          type="button"
          onClick={onClose}
          className={styles.headerButton}
          aria-label="Collapse Sera"
        >
          <SeraIcon name="chevronDown" className="h-4 w-4" />
        </button>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          ref={scroller}
          onScroll={handleScroll}
          className={styles.body}
          data-mode={messages.length > 0 ? "thread" : "intro"}
          role="log"
          aria-live="off"
          aria-label="Conversation with Sera"
        >
          {messages.length === 0 && (
            <>
              <div className={styles.intro}>
                <h2 className={styles.introTitle}>What are you looking to do?</h2>
                <p className={styles.introBody}>
                  I&rsquo;m Sera. I can answer questions about {company.name} hosting,
                  domains and websites, or get a request started for you.
                </p>
              </div>
              <SeraQuickActions />
            </>
          )}

          {messages.length > 0 && (
            <div className={styles.thread}>
              {messages.map((message, index) =>
                message.proposal ? (
                  <SeraProposal key={message.id} message={message} />
                ) : message.action ? (
                  <SeraAction key={message.id} message={message} />
                ) : (
                  <SeraMessage
                  key={message.id}
                  message={message}
                  streaming={message.id === streamingInto}
                  animate={message.at > openedAt}
                  /* One attribution per run rather than per bubble. Repeating
                     "Sera • AI Agent" under every consecutive message is noise;
                     what a reader needs is to know where a turn ends. */
                    showMeta={
                      index === messages.length - 1 ||
                      messages[index + 1]?.role !== message.role
                    }
                  />
                ),
              )}

              {showIndicator && <SeraTyping label={activity} />}

              {error && (
                <div role="alert" className={styles.notice}>
                  <span className="mt-0.5 shrink-0 text-error">
                    <SeraIcon name="alert" className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p>{error}</p>
                    <div className="mt-2 flex gap-4">
                      <button
                        type="button"
                        onClick={retry}
                        disabled={busy}
                        className="inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline disabled:opacity-50"
                      >
                        <SeraIcon name="refresh" className="h-3.5 w-3.5" />
                        Try again
                      </button>
                      <button
                        type="button"
                        onClick={dismissError}
                        className="font-medium underline-offset-2 opacity-70 hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {status === "cancelled" && (
                <p className={styles.meta}>
                  Stopped. Ask me something else whenever you are ready.
                </p>
              )}
            </div>
          )}
        </div>

        {/*
          The way back down, offered rather than forced. Only appears once the
          reader has actually scrolled away, and only when there is something
          below to go to.
        */}
        {!pinned && messages.length > 0 && (
          <button type="button" onClick={() => scrollToLatest()} className={styles.jump}>
            <SeraIcon name="down" className="h-3.5 w-3.5" />
            Jump to latest
          </button>
        )}
      </div>

      {/* One region, one announcement. See the note at the top of this file. */}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      <SeraWorkflow />
      <SeraComposer autoFocus />
    </div>
  );
}
