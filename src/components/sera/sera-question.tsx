"use client";

import { useId, useState } from "react";
import styles from "./sera.module.css";
import { SeraIcon } from "./sera-mark";
import { useSera } from "./sera-provider";

/**
 * Inline question card (2026-10-03).
 *
 * When the field Sera is collecting next is a `choice`, its options render
 * under the latest reply as a radio card with an "Or, type your own answer"
 * row and a Send button, instead of the visitor having to type a value the
 * workflow already knows the shape of. Choosing sends the option text as the
 * visitor's answer through the normal `send`, so the server validates it the
 * same way as anything typed.
 *
 * The options come from the workflow spec via `WorkflowView.next`, never from
 * the model, so the card can only ever offer values the workflow accepts.
 */
export function SeraQuestion() {
  const { workflow, send, busy } = useSera();
  const [picked, setPicked] = useState<string | null>(null);
  const [own, setOwn] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const name = useId();

  const next = workflow?.next;
  if (!next || !next.options || next.options.length === 0) return null;

  const answer = own.trim() || picked;
  const submit = () => {
    if (!answer || busy) return;
    send(answer);
    setPicked(null);
    setOwn("");
  };

  const done = workflow ? workflow.requiredCount - workflow.missing.length : 0;
  const total = workflow?.requiredCount ?? 0;

  return (
    <div className={styles.question} data-collapsed={collapsed || undefined}>
      <button
        type="button"
        className={styles.questionHead}
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((c) => !c)}
      >
        <span className={styles.questionTitle}>{next.label}</span>
        <SeraIcon name="chevronDown" className={`${styles.questionChevron} h-4 w-4`} />
      </button>

      {!collapsed && (
        <>
          <fieldset className={styles.questionOptions} disabled={busy}>
            <legend className="sr-only">{next.label}</legend>
            {next.options.map((option) => (
              <label key={option} className={styles.questionOption} data-checked={picked === option && !own || undefined}>
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={picked === option && !own}
                  onChange={() => {
                    setPicked(option);
                    setOwn("");
                  }}
                  className="sr-only"
                />
                <span className={styles.questionRadio} aria-hidden="true" />
                <span>{option}</span>
              </label>
            ))}
            <label className={styles.questionOption} data-checked={own.trim() ? true : undefined}>
              <span className={styles.questionRadio} aria-hidden="true" />
              <input
                type="text"
                value={own}
                onChange={(e) => setOwn(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder="Or, type your own answer…"
                className={styles.questionOwn}
                aria-label={`${next.label}: type your own answer`}
              />
            </label>
          </fieldset>

          <div className={styles.questionFoot}>
            <span className={styles.questionStep}>
              Question {Math.min(done + 1, total)} of {total}
            </span>
            <button type="button" className={styles.questionSend} onClick={submit} disabled={!answer || busy}>
              Send
              <SeraIcon name="arrowRight" className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
