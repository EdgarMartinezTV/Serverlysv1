"use client";

import { useEffect, useState } from "react";
import styles from "./sera.module.css";
import { SeraIcon } from "./sera-mark";
import { useSera } from "./sera-provider";
import { NAV_OPEN_DELAY_MS } from "@/lib/sera/types";
import type { ChatMessage } from "@/lib/sera/types";

/**
 * "Opening the plans for you…" — the few seconds between Sera saying it will
 * move the browser and the browser moving.
 *
 * ⚠ THE CONSENT ALREADY HAPPENED, IN WORDS, IN THE BUBBLE ABOVE THIS. Sera
 * announces the destination and why it is worth seeing; this card is the
 * countdown on that promise, not a second request for permission. It used to be
 * an "Open it / Not now" gate and it made Sera look deaf — someone who has just
 * asked to see the pricing has already answered that question.
 *
 * What the gate was protecting is still protected: nobody's screen changes
 * without warning, and the wait is long enough to stop it. "Stay here" is
 * always there, and always the quiet option — the visitor who does nothing gets
 * the thing they asked for.
 *
 * Both outcomes leave a mark. Scrolling back shows either "Opened …" or
 * "Stayed on this page", so the transcript records what actually happened
 * rather than leaving a promise that appears to have gone nowhere.
 */
export function SeraProposal({ message }: { message: ChatMessage }) {
  const { acceptProposal, declineProposal } = useSera();
  const proposal = message.proposal;
  const pending = proposal?.state === "pending";

  /*
   * Drives the bar only. THE CLOCK THAT NAVIGATES LIVES IN THE PROVIDER, and
   * deliberately not here: this component unmounts the moment the route changes
   * under it, and a timer that owned the navigation would be killed by the very
   * thing it was waiting to do. This is decoration over a decision made
   * elsewhere, which is why the two can never disagree about whether it fired.
   */
  const [elapsed, setElapsed] = useState(false);
  useEffect(() => {
    if (!pending) return;
    // Next frame, so the transition has a "from" value to animate away from.
    const raf = requestAnimationFrame(() => setElapsed(true));
    return () => cancelAnimationFrame(raf);
  }, [pending]);

  if (!proposal) return null;

  if (proposal.state === "accepted") {
    return (
      <p className={styles.proposalResolved}>
        <SeraIcon name="check" className="h-3.5 w-3.5 shrink-0" />
        Opened {proposal.label}
      </p>
    );
  }

  if (proposal.state === "declined") {
    return (
      <p className={styles.proposalResolved}>
        <SeraIcon name="close" className="h-3.5 w-3.5 shrink-0" />
        Stayed on this page
      </p>
    );
  }

  return (
    <div className={styles.proposal}>
      {/*
        Announced to screen readers the moment it appears. A sighted visitor
        sees the bar draining; without this, someone using a reader would simply
        find themselves on another page.
      */}
      <p className={styles.proposalTitle} role="status">
        Opening {proposal.label}…
      </p>
      <p className={styles.proposalBody}>
        Taking you there now — press Stay here if you would rather not move.
      </p>

      <div className={styles.proposalCountdown} aria-hidden="true">
        <span
          className={`${styles.proposalCountdownFill} ${
            elapsed ? styles.proposalCountdownRunning : ""
          }`}
          style={{ transitionDuration: `${NAV_OPEN_DELAY_MS}ms` }}
        />
      </div>

      <div className={styles.proposalActions}>
        <button
          type="button"
          className={styles.proposalPrimary}
          onClick={() => acceptProposal(message.id)}
        >
          Open it now
          <SeraIcon name="arrowRight" className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className={styles.proposalGhost}
          onClick={() => declineProposal(message.id)}
        >
          Stay here
        </button>
      </div>
    </div>
  );
}
