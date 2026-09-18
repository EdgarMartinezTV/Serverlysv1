import { HIGHLIGHT_MS } from "@/lib/sera/types";

/**
 * Drawing the visitor's eye to one element on the page.
 *
 * ⚠ THE TARGET IS LOOKED UP BY DATA ATTRIBUTE, NEVER BY A SELECTOR FROM THE
 * SERVER. `document.querySelector(fromServer)` would be a model choosing what
 * part of the page to manipulate — and while the server resolves every name
 * against an allowlist before it gets here (`lib/sera/highlight.ts`), this
 * function is the last place that could go wrong, so it does not accept a
 * selector at all. It accepts a NAME and builds the lookup itself, with the
 * name escaped via `CSS.escape`. There is no input that makes it read
 * something other than `[data-sera-target="…"]`.
 *
 * WHY A CLASS AND A TIMER RATHER THAN INLINE STYLES. The ring has to disappear,
 * and an element that Sera marked twice must not end up with two overlapping
 * lifetimes — the first timer clearing the second one's ring. The module keeps
 * one timer per element and resets it, so marking something already marked
 * extends the ring instead of breaking it.
 */

const CLASS = "sera-marked";

/** One live timer per element, so a re-mark extends rather than conflicts. */
const timers = new WeakMap<Element, ReturnType<typeof setTimeout>>();

/**
 * Where to put the element on screen.
 *
 * The site's header is 72px (asserted by `scripts/test-nav.mjs`) and on a phone
 * Sera's panel is a full-height sheet — so `scrollIntoView({ block: "center" })`
 * is the only placement that is right in both cases. "nearest" leaves a card
 * tucked under the header; "start" puts it behind it.
 */
function reveal(element: Element) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "center",
    inline: "nearest",
  });
}

/**
 * Mark the element carrying `data-sera-target="<name>"`.
 *
 * Returns whether anything was found. The caller uses that to decide what to
 * put in the transcript: a mark that landed on nothing must not be reported as
 * a mark, or Sera says "I have highlighted it" about a page that did not change.
 *
 * ⚠ IT POLLS, AND THE WINDOW MATTERS. Called straight after `router.push`, the
 * destination's DOM does not exist yet — the same reason `scrollToSection`
 * polls, and it uses 2.5s for it.
 *
 * This was written with a 700ms window first and it silently failed: the
 * navigation landed on /wordpress-hosting, the route took longer than that to
 * mount, and the mark gave up before the card existed. Nothing was on screen
 * and nothing was reported, because giving up IS the no-op path. 2.5s matches
 * the scroll helper — the two are polling for the same page to appear, so a
 * different deadline would mean one of them could succeed while the other did
 * not, for no reason a reader could work out.
 */
const DEADLINE_MS = 2_500;
const INTERVAL_MS = 100;

export function markTarget(name: string, onResolved?: (found: boolean) => void): void {
  if (typeof document === "undefined") return;

  const selector = `[data-sera-target="${CSS.escape(name)}"]`;
  const startedAt = performance.now();

  const attempt = () => {
    const element = document.querySelector(selector);

    if (!element) {
      if (performance.now() - startedAt < DEADLINE_MS) {
        setTimeout(attempt, INTERVAL_MS);
        return;
      }
      onResolved?.(false);
      return;
    }

    reveal(element);
    element.classList.add(CLASS);

    const existing = timers.get(element);
    if (existing) clearTimeout(existing);
    timers.set(
      element,
      setTimeout(() => {
        element.classList.remove(CLASS);
        timers.delete(element);
      }, HIGHLIGHT_MS),
    );

    onResolved?.(true);
  };

  attempt();
}

/**
 * Clear every mark immediately.
 *
 * Used when the conversation is reset: a ring left over from a transcript the
 * visitor has just cleared is a pointer to advice that is no longer on screen.
 */
export function clearMarks(): void {
  if (typeof document === "undefined") return;
  for (const element of document.querySelectorAll(`.${CLASS}`)) {
    const existing = timers.get(element);
    if (existing) clearTimeout(existing);
    timers.delete(element);
    element.classList.remove(CLASS);
  }
}
