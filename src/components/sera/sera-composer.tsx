"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./sera.module.css";
import { useSera } from "./sera-provider";
import { SeraIcon } from "./sera-mark";

/**
 * The composer.
 *
 * ONE FIELD AND ONE BUTTON, which is exactly what the reference has. An earlier
 * pass carried a paperclip / emoji / GIF / microphone row taken from a
 * different assistant; the widget being matched here has none of them, so they
 * are gone. That also retires the one control that could not be made honest —
 * a GIF picker with no provider behind it.
 *
 * A TEXTAREA, NOT AN INPUT, despite the reference using an input: people paste
 * error logs and multi-line questions into assistants, and a single-line field
 * turns all of that into a scrolling slit. It renders as one line at rest, so
 * it is visually identical until there is a reason not to be, and grows to a
 * ceiling before scrolling.
 *
 * IT STAYS ENABLED WHILE SERA IS ANSWERING. Disabling the field is the reflex
 * and it is wrong — people type their next question while reading the current
 * answer. Only SENDING is gated, and while a turn is in flight the send button
 * becomes a STOP button, because the visitor should be able to call off an
 * answer that is clearly going the wrong way.
 */

/** Matches `LIMITS.maxMessageChars`. The server rejects anything longer. */
const MAX_CHARS = 2_000;
const MAX_HEIGHT_PX = 96;

export function SeraComposer({ autoFocus }: { autoFocus?: boolean }) {
  const { send, cancel, status, busy } = useSera();
  const [value, setValue] = useState("");
  const field = useRef<HTMLTextAreaElement>(null);

  /** Grow to fit, up to the ceiling. Reset first or it can only ever grow. */
  useEffect(() => {
    const element = field.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [value]);

  useEffect(() => {
    if (autoFocus) field.current?.focus();
  }, [autoFocus]);

  /*
   * Return focus to the field when a turn settles. Without this, anyone driving
   * the widget from the keyboard has to tab back after every reply, which makes
   * a five-message conversation a chore.
   */
  useEffect(() => {
    if (!busy) field.current?.focus({ preventScroll: true });
  }, [busy]);

  function submit() {
    const text = value.trim();
    if (!text || busy) return;
    send(text);
    setValue("");
  }

  const canSend = value.trim().length > 0 && !busy;

  return (
    <div className={styles.composerArea}>
      <form
        className={styles.composer}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label htmlFor="sera-composer" className="sr-only">
          Message Sera
        </label>
        <textarea
          id="sera-composer"
          ref={field}
          rows={1}
          value={value}
          maxLength={MAX_CHARS}
          placeholder={busy ? "Sera is answering…" : "Message Sera…"}
          /* Off for all three: an assistant is where people type domains and
             product names, and a browser correcting "WooCommerce" or
             capitalising a domain creates errors they then have to notice. */
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          className={styles.input}
        />

        {busy ? (
          <button
            type="button"
            onClick={cancel}
            /* Stop is meaningless during submission — the request is already
               with the server and half-filing it would be worse than waiting. */
            disabled={status === "submitting"}
            className={styles.send}
            aria-label="Stop Sera"
            title="Stop"
          >
            <SeraIcon name="stop" className="h-3 w-3" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            className={cn(styles.send, canSend && styles.sendReady)}
            aria-label="Send message"
          >
            <SeraIcon name="arrowUp" className="h-4 w-4" />
          </button>
        )}
      </form>

      {/*
        The reference's own disclaimer, and it is true of Sera for exactly the
        same reason: this is a language model answering, and a visitor about to
        act on a price or a policy should know to confirm it.
      */}
      <p className={styles.footer}>Sera can make mistakes. Double-check replies.</p>
    </div>
  );
}
