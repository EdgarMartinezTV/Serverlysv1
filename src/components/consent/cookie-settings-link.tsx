"use client";

/**
 * Reopens the cookie settings panel.
 *
 * A button, not a link: it opens a panel on this page rather than navigating,
 * and a link that goes nowhere is a lie to anyone using a screen reader or
 * middle-clicking it.
 *
 * Dispatches an event rather than lifting consent state into a provider. The
 * banner is mounted once in the root layout and this is the only thing that
 * ever needs to talk to it, so a context that wraps the entire tree would be
 * machinery for one message.
 */
export function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("consent:open"))}
      className="inline-block rounded-sm py-1.5 text-small text-fg-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      Cookie settings
    </button>
  );
}
