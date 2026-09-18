"use client";

import styles from "./sera.module.css";
import { SeraIcon } from "./sera-mark";
import { useSera } from "./sera-provider";
import type { ChatMessage } from "@/lib/sera/types";

/**
 * "Start the migration request?" — a tappable next step, mid-conversation.
 *
 * ⚠ THIS REUSES THE NAVIGATION CARD'S STYLES VERBATIM. Not similar ones — the
 * same `proposal*` classes, the same tinted panel, the same pill buttons. Sera
 * has exactly one visual language for "an action is prepared and waiting on
 * you", and it was already defined for the countdown card and the request
 * strip. A third variant, however tasteful, would make the widget read as three
 * features stapled together rather than one assistant.
 *
 * WHAT ACCEPTING DOES, precisely: sends an ordinary message carrying the
 * workflow id, which is the same path the opening screen's quick actions use.
 * No request is filed and nothing is emailed — the visitor lands in the
 * collection conversation they would have reached by typing "yes", except the
 * agent no longer has to guess that "yes" meant this. See `ActionOffer`.
 *
 * Both outcomes leave a mark, for the same reason the countdown card records
 * "Stayed on this page": an offer that vanishes without trace reads, on scroll
 * back, like something Sera promised and dropped.
 */
export function SeraAction({ message }: { message: ChatMessage }) {
  const { acceptAction, dismissAction, busy } = useSera();
  const action = message.action;
  if (!action) return null;

  if (action.state === "accepted") {
    return (
      <p className={styles.proposalResolved}>
        <SeraIcon name="check" className="h-3.5 w-3.5 shrink-0" />
        Started {action.label}
      </p>
    );
  }

  if (action.state === "dismissed") {
    return (
      <p className={styles.proposalResolved}>
        <SeraIcon name="close" className="h-3.5 w-3.5 shrink-0" />
        Not started
      </p>
    );
  }

  return (
    <div className={styles.proposal}>
      <p className={styles.proposalTitle}>{action.label}</p>
      <p className={styles.proposalBody}>{action.detail}</p>
      <div className={styles.proposalActions}>
        <button
          type="button"
          className={styles.proposalPrimary}
          disabled={busy}
          onClick={() => acceptAction(message.id)}
        >
          Start it
          <SeraIcon name="arrowRight" className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className={styles.proposalGhost}
          disabled={busy}
          onClick={() => dismissAction(message.id)}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
