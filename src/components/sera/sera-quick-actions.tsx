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
  label: "Help me find what I need",
  sub: "Tell me what you're trying to do and I'll point you to the right plan.",
  message: "Help me work out which Serverlys plan or service fits what I'm trying to do.",
  icon: "spark",
};

const EXPLORE: readonly Option[] = [
  { label: "Compare hosting plans", message: "Compare your hosting plans for me, with the renewal prices.", icon: "tag" },
  { label: "Move my website", message: "I want to move my website to Serverlys.", icon: "arrowRight", workflow: "WEBSITE_MIGRATION" },
  { label: "Find a domain", message: "I want to find and register a domain name.", icon: "globe" },
  { label: "Understand the pricing", message: "How does your pricing work, including renewals and setup fees?", icon: "wallet" },
  { label: "Talk to the team", message: "I would like someone from Serverlys to get in touch with me.", icon: "mail", workflow: "HUMAN_CONTACT" },
];

export function SeraQuickActions() {
  const { send, busy } = useSera();

  const choose = (option: Option) =>
    send(option.message, { startWorkflow: option.workflow, label: option.label });

  return (
    <div className={styles.options} data-disabled={busy}>
      <button type="button" className={styles.primary} onClick={() => choose(PRIMARY)}>
        <span className={styles.primaryText}>
          <span className={styles.primaryTitle}>{PRIMARY.label}</span>
          <span className={styles.primarySub}>{PRIMARY.sub}</span>
        </span>
        <span className={styles.primaryGo}>
          <SeraIcon name="chevronRight" className="h-4 w-4" />
        </span>
      </button>

      <p className={styles.divider}>or explore</p>

      <ul className={styles.rows}>
        {EXPLORE.map((option) => (
          <li key={option.label}>
            <button type="button" className={styles.rowButton} onClick={() => choose(option)}>
              <span className={styles.rowIcon}>
                <SeraIcon name={option.icon} className="h-4 w-4" />
              </span>
              <span className={styles.rowLabel}>{option.label}</span>
              <SeraIcon name="chevronRight" className="h-4 w-4 text-[var(--sera-muted)]" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
