"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/sera/analytics";
import { SeraIcon, SeraMark } from "./sera-mark";
import styles from "./sera.module.css";
import type { ChatMessage } from "@/lib/sera/types";

/**
 * One turn in the transcript.
 *
 * RENDERED AS TEXT, NEVER AS MARKUP. No markdown parser, no
 * `dangerouslySetInnerHTML`. Model output is untrusted by definition — it can
 * be steered by anything the visitor types — and the moment it is allowed to
 * produce elements, a prompt injection becomes a rendering vulnerability in a
 * widget that is on every page of the site. Paragraph breaks are honoured;
 * nothing else is interpreted.
 *
 * NO PER-MESSAGE AVATAR. Attribution lives in the meta line under the bubble
 * instead — "Sera · AI assistant · Just now". A repeated avatar down the left
 * gutter costs horizontal room on a narrow panel and says nothing the meta line
 * does not; and the meta line can say the one thing an avatar cannot, which is
 * that the thing talking is not a person. The mark stays in the header, where
 * it identifies the assistant once.
 *
 * Bare URLs are linkified because Sera is expected to point at real pages and
 * an unclickable link is a worse answer. The href is rebuilt from a matched
 * http(s) URL rather than taken from arbitrary text, so `javascript:` and
 * friends cannot appear, and external links carry the same rel as the rest of
 * the site's outbound links.
 */

/*
 * Two patterns, not one with a `/g` flag reused for both jobs. A global regex
 * carries `lastIndex` between calls, so alternating `split` and `test` on the
 * same object makes the second call's result depend on the first — which
 * produced a linkifier that silently skipped every other URL.
 */
const URL_SPLIT = /(https?:\/\/[^\s<>()"']+[^\s<>()"'.,;:!?])/g;
const IS_URL = /^https?:\/\/[^\s<>()"']+$/;

function Linkified({ text }: { text: string }) {
  const parts = text.split(URL_SPLIT);
  return (
    <>
      {parts.map((part, index) => {
        if (!IS_URL.test(part)) {
          return <span key={index}>{part}</span>;
        }

        let href: string;
        try {
          const url = new URL(part);
          if (url.protocol !== "http:" && url.protocol !== "https:") {
            return <span key={index}>{part}</span>;
          }
          href = url.toString();
        } catch {
          return <span key={index}>{part}</span>;
        }

        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2"
          >
            {part}
          </a>
        );
      })}
    </>
  );
}

/**
 * Relative time, the way a chat transcript reads it.
 *
 * "Just now" for the first minute, then minutes, then a clock time. An absolute
 * timestamp on a message sent eight seconds ago is technically correct and
 * nearly useless — what a reader wants to know is whether this is part of the
 * conversation they are having or something from earlier.
 */
function clockTime(at: number): string {
  return new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** 👍 / 👎 and copy, under a finished reply (2026-10-03, Kodee-style). */
function ReplyTools({ message }: { message: ChatMessage }) {
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);
  const rate = (r: "up" | "down") => {
    const nextRating = rating === r ? null : r;
    setRating(nextRating);
    if (nextRating) track("sera_feedback", { rating: nextRating, message: message.id });
  };
  return (
    <div className={styles.tools}>
      <button type="button" aria-pressed={rating === "up"} onClick={() => rate("up")} className={styles.tool}>
        <SeraIcon name="thumbUp" className="h-3.5 w-3.5" />
        <span className="sr-only">Helpful</span>
      </button>
      <button type="button" aria-pressed={rating === "down"} onClick={() => rate("down")} className={styles.tool}>
        <SeraIcon name="thumbDown" className="h-3.5 w-3.5" />
        <span className="sr-only">Not helpful</span>
      </button>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(message.text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
        className={styles.tool}
      >
        <SeraIcon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
        <span className="sr-only">{copied ? "Copied" : "Copy reply"}</span>
      </button>
      <span className={styles.toolTime}>{clockTime(message.at)}</span>
      {rating === "down" && <span className={styles.toolThanks}>Thanks — noted.</span>}
    </div>
  );
}

export function SeraMessage({
  message,
  streaming,
  showMeta,
  animate,
  avatar = true,
}: {
  message: ChatMessage;
  streaming?: boolean;
  showMeta?: boolean;
  animate?: boolean;
  /** Show Sera's mark beside the first bubble of an assistant run. */
  avatar?: boolean;
}) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className={cn(styles.row, animate && styles.message, styles.rowUser)}>
        <div className={cn(styles.bubble, styles.bubbleUser)}>
          <Linkified text={message.text} />
        </div>
        {showMeta && <p className={styles.meta}>{clockTime(message.at)}</p>}
      </div>
    );
  }

  return (
    <div className={cn(styles.assistantRow, animate && styles.message)}>
      <span className={styles.avatar} data-hidden={!avatar || undefined} aria-hidden="true">
        <SeraMark className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className={cn(styles.bubble, message.system && styles.bubbleSystem)}>
          <Linkified text={message.text} />
          {streaming && (
            <span
              className={`${styles.caret} ml-0.5 inline-block h-3.5 w-px translate-y-0.5 align-middle`}
              style={{ background: "currentColor", opacity: 0.6 }}
              aria-hidden="true"
            />
          )}
        </div>
        {showMeta && !streaming && <ReplyTools message={message} />}
      </div>
    </div>
  );
}
