"use client";

import styles from "./sera.module.css";
import { SeraIcon, type SeraIconName } from "./sera-mark";
import { useSera } from "./sera-provider";
import type { WorkflowId } from "@/lib/sera/types";

/**
 * The opening screen: one headline action, then three quieter ones.
 *
 * THE SHAPE IS THE REFERENCE'S, MEASURED — a 78px primary card with a 44px icon
 * tile, a ruled "or explore", and a three-up grid of 129×92 tiles with 34px
 * badges. What goes IN those slots is Serverlys': the headline action is the
 * migration, because free migration handled by the team is this company's
 * strongest differentiator and its most common inbound request.
 *
 * THESE START WORKFLOWS, THEY DO NOT SEND CANNED TEXT. Each carries a
 * `workflow` id the chat route acts on server-side before the model runs, so
 * tapping "Move my website" deterministically opens the migration request.
 * Sending a sentence and hoping the model classifies it the same way every time
 * is the version of this that works in a demo and drifts in production.
 *
 * "Explore hosting" and "Find a domain" open NO workflow, on purpose. They are
 * questions, and a question must never open a form — the same rule
 * `workflowForIntent` enforces on the server.
 */

type Option = {
  label: string;
  message: string;
  icon: SeraIconName;
  workflow?: WorkflowId;
};

const PRIMARY: Option & { sub: string } = {
  label: "Move my website",
  sub: "Free migration, handled for you",
  message: "I want to move my website to Serverlys.",
  icon: "spark",
  workflow: "WEBSITE_MIGRATION",
};

const EXPLORE: readonly Option[] = [
  {
    label: "Explore hosting",
    message: "What hosting plans do you have?",
    icon: "bolt",
  },
  {
    label: "Find a domain",
    message: "I want to find and register a domain name.",
    icon: "search",
  },
  {
    label: "Talk to the team",
    message: "I would like someone from Serverlys to get in touch with me.",
    icon: "mail",
    workflow: "HUMAN_CONTACT",
  },
];

export function SeraQuickActions() {
  const { send, busy } = useSera();

  const choose = (option: Option) =>
    send(option.message, { startWorkflow: option.workflow, label: option.label });

  return (
    <div className={styles.options} data-disabled={busy}>
      <button type="button" className={styles.primary} onClick={() => choose(PRIMARY)}>
        <span className={styles.primaryTile}>
          <SeraIcon name={PRIMARY.icon} className="h-5 w-5" />
        </span>
        <span className={styles.primaryText}>
          <span className={styles.primaryTitle}>{PRIMARY.label}</span>
          <span className={styles.primarySub}>{PRIMARY.sub}</span>
        </span>
        <SeraIcon name="chevronRight" className={`${styles.primaryChevron} h-4 w-4`} />
      </button>

      <p className={styles.divider}>or explore</p>

      <div className={styles.tiles}>
        {EXPLORE.map((option) => (
          <button
            key={option.label}
            type="button"
            className={styles.tile}
            onClick={() => choose(option)}
          >
            <span className={styles.tileBadge}>
              <SeraIcon name={option.icon} className="h-4 w-4" />
            </span>
            <span className={styles.tileLabel}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
