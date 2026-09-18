"use client";

import styles from "./sera.module.css";

/**
 * What Sera shows between "sent" and "the first word appears".
 *
 * TWO STATES, AND THE DIFFERENCE IS HONESTY.
 *
 *   With a `label` — a real server-side tool is running, and the label names
 *   what it is doing: "Checking current plans…", "Preparing your request…".
 *   These are emitted by the tool registry at the moment the tool actually
 *   executes, so the text always corresponds to work that happened.
 *
 *   Without one — three dots. It is thinking, and anything more specific would
 *   be decoration dressed as status.
 *
 * ⚠ NOTHING HERE EVER SAYS "Thinking deeply", "Analysing" or "Reasoning". That
 * vocabulary claims an interior process the UI cannot see and the product has
 * no business narrating, and at worst it edges toward exposing reasoning the
 * visitor was never meant to read. A dot animation makes the same point —
 * something is happening, wait a moment — and promises nothing it cannot keep.
 *
 * Shaped and coloured as an assistant bubble so that when the first word is
 * released the indicator does not jump — the text simply replaces the dots in
 * a container that was already the right size and the right colour.
 */
export function SeraTyping({ label }: { label?: string | null }) {
  return (
    <div className={styles.row}>
      <div className={styles.bubble} style={{ paddingBlock: 14 }}>
        {label ? (
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1" aria-hidden="true">
              <span className={`${styles.dot} h-1 w-1 rounded-full bg-current opacity-60`} />
              <span className={`${styles.dot} h-1 w-1 rounded-full bg-current opacity-60`} />
              <span className={`${styles.dot} h-1 w-1 rounded-full bg-current opacity-60`} />
            </span>
            <span style={{ fontSize: 14 }}>{label}</span>
          </span>
        ) : (
          <span className="flex items-center gap-1" aria-hidden="true">
            <span className={`${styles.dot} h-1.5 w-1.5 rounded-full bg-current opacity-60`} />
            <span className={`${styles.dot} h-1.5 w-1.5 rounded-full bg-current opacity-60`} />
            <span className={`${styles.dot} h-1.5 w-1.5 rounded-full bg-current opacity-60`} />
          </span>
        )}
      </div>
    </div>
  );
}
