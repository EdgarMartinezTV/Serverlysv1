"use client";

import { cn } from "@/lib/utils";
import styles from "./assistant.module.css";
import { AssistantMark } from "./assistant-mark";
import { ASSISTANT_NAME, openAssistant } from "./assistant";

/**
 * The gradient-ring "Ask ConvoAI" pill used in the header, the mobile drawer and a few page CTAs.
 * Opens the ConvoAI messenger; with `prompt`, the composer is pre-filled.
 */
export function AssistantOpenButton({
  onDark = false,
  block = false,
  label = `Ask ${ASSISTANT_NAME}`,
  prompt,
  onOpen,
}: {
  /** Over a dark band: white label. */
  onDark?: boolean;
  /** Full width, for the mobile drawer. */
  block?: boolean;
  label?: string;
  /** Text to pre-fill in the composer. */
  prompt?: string;
  /** Runs before the messenger opens — the mobile drawer uses it to close itself. */
  onOpen?: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(styles.headerCta, onDark ? styles.headerCtaOnDark : styles.headerCtaOnLight, block && styles.headerCtaBlock)}
      aria-haspopup="dialog"
      onClick={() => {
        onOpen?.();
        openAssistant(prompt);
      }}
    >
      <AssistantMark className="h-6 w-6 shrink-0" />
      {label}
    </button>
  );
}
