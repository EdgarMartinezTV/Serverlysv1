"use client";

import { Button } from "@/components/ui/button";
import styles from "./sera.module.css";
import { useSera } from "./sera-provider";
import { SeraIcon } from "./sera-mark";

/**
 * The request card: progress while collecting, a summary to confirm, a
 * reference once filed.
 *
 * THE CONFIRM BUTTON IS THE SUBMISSION BOUNDARY. Sera can assemble a request
 * and can ask for it to be sent; only this button sends one. That is not a
 * convention — there is no code path from the model to the submit route at all
 * (see `app/api/sera/submit/route.ts`), so "never submit without explicit
 * confirmation" holds even if the model is talked into believing otherwise.
 *
 * The summary shows the visitor exactly what the team will receive, before it
 * goes. A request filed on someone's behalf that they never got to read is the
 * thing that turns a helpful assistant into a lead-harvesting form.
 */

export function SeraWorkflow() {
  const { workflow, submit, status } = useSera();
  if (!workflow) return null;

  const done = workflow.requiredCount - workflow.missing.length;
  const percent = workflow.requiredCount === 0 ? 100 : (done / workflow.requiredCount) * 100;

  /* ── Filed ────────────────────────────────────────────────────────────── */
  if (workflow.stage === "SUBMITTED" && workflow.reference) {
    return (
      <div className={styles.strip}>
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 text-success-fill">
            <SeraIcon name="check" className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-small font-semibold">{workflow.title} sent</p>
            <p className={styles.meta} style={{ marginTop: 2 }}>
              Reference <span className="tabular font-medium">{workflow.reference}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Ready to send ────────────────────────────────────────────────────── */
  if (workflow.stage === "AWAITING_CONFIRMATION" || workflow.missing.length === 0) {
    return (
      <div className={styles.strip}>
        <p className="text-small font-semibold">{workflow.title} — ready to send</p>

        <dl className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          {workflow.collected.map((item) => (
            <div key={item.label} className="contents">
              <dt className={styles.meta} style={{ marginTop: 0 }}>{item.label}</dt>
              <dd className="min-w-0 truncate text-caption font-medium" title={item.value}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" onClick={submit} loading={status === "submitting"}>
            Send to the Serverlys team
          </Button>
          <p className={styles.meta} style={{ marginTop: 0 }}>
            Nothing is sent until you tap this.
          </p>
        </div>
      </div>
    );
  }

  /* ── Still collecting ─────────────────────────────────────────────────── */
  return (
    <div className={styles.stripQuiet}>
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-caption font-medium">{workflow.title}</p>
        <p className={`${styles.meta} shrink-0 tabular`} style={{ marginTop: 0 }}>
          {done} of {workflow.requiredCount}
        </p>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={workflow.requiredCount}
        aria-valuenow={done}
        aria-label={`${workflow.title} details collected`}
      >
        <div
          className={styles.trackFill}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
