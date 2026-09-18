"use client";

import { cn } from "@/lib/utils";
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
function relativeTime(at: number): string {
  const seconds = Math.max(0, Math.round((Date.now() - at) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  return new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function SeraMessage({
  message,
  streaming,
  showMeta,
  animate,
}: {
  message: ChatMessage;
  /** Text is still arriving into this bubble. */
  streaming?: boolean;
  /** Show the attribution line. Suppressed on all but the last of a run. */
  showMeta?: boolean;
  /**
   * Whether this message is NEW. History must appear instantly — animating a
   * transcript the visitor has already read makes reopening the panel look
   * like the conversation is happening again. The panel decides by comparing
   * the message's timestamp to its own mount time.
   */
  animate?: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(styles.row, animate && styles.message, isUser && styles.rowUser)}
    >
      <div
        className={cn(
          styles.bubble,
          isUser && styles.bubbleUser,
          message.system && styles.bubbleSystem,
        )}
      >
        <Linkified text={message.text} />
        {streaming && (
          <span
            className={`${styles.caret} ml-0.5 inline-block h-3.5 w-px translate-y-0.5 align-middle`}
            style={{ background: "currentColor", opacity: 0.6 }}
            aria-hidden="true"
          />
        )}
      </div>

      {showMeta && !streaming && (
        <p className={styles.meta}>
          {isUser ? (
            relativeTime(message.at)
          ) : (
            <>
              Sera<span className={styles.metaDot}>•</span>AI Agent
              <span className={styles.metaDot}>•</span>
              {relativeTime(message.at)}
            </>
          )}
        </p>
      )}
    </div>
  );
}
