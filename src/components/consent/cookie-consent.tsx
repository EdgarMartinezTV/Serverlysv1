"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ACCEPT_ALL,
  DEFAULT_CONSENT,
  TRACKERS,
  readConsent,
  readConsentRaw,
  subscribeConsent,
  writeConsent,
  type ConsentCategory,
  type ConsentState,
} from "@/lib/consent";
import { cn } from "@/lib/utils";

/**
 * Cookie consent banner and settings panel.
 *
 * Shape follows the reference: bottom-anchored notice, a heading, one
 * paragraph, then Accept all / Reject all / Cookie settings. The wording is
 * ours and is accurate — see the note at the top of lib/consent.
 *
 * NOT a modal. The banner is a `region`, so the site stays usable while it is
 * open. A cookie notice that traps focus and blocks the page is a dark pattern:
 * it converts "I have not decided" into "I cannot read anything", which is
 * coercion rather than consent. The SETTINGS panel is a real dialog, because
 * there the user has deliberately entered a task.
 *
 * ACCEPT AND REJECT CARRY EQUAL WEIGHT. Both are the same size and the same
 * variant. Styling "Accept all" as the prominent action and "Reject all" as a
 * faint link is the pattern regulators have repeatedly ruled invalid, and it is
 * the opposite of how this company talks about pricing.
 *
 * No flash: a blocking script in the root layout stamps data-consent="set" on
 * <html> before first paint, and CSS hides the banner. Rendering it and hiding
 * it after hydration would show the banner on every load to people who already
 * answered.
 */

const CATEGORY_COPY: Record<
  ConsentCategory,
  { label: string; detail: string; locked?: boolean }
> = {
  necessary: {
    label: "Strictly necessary",
    detail:
      "Needed for the site and your account area to work. These cannot be switched off, so they are not presented as a choice.",
    locked: true,
  },
  analytics: {
    label: "Analytics",
    detail:
      "Would measure which pages people use so we can improve them. Nothing in this category is installed today.",
  },
  marketing: {
    label: "Marketing",
    detail:
      "Would measure which adverts lead to a sign-up. Nothing in this category is installed today.",
  },
};

export function CookieConsent() {
  /**
   * Whether a choice exists is EXTERNAL state (localStorage), so it is read
   * through useSyncExternalStore rather than copied into state inside an
   * effect. The effect version triggered a cascading re-render on every mount
   * and lint rejected it.
   *
   * `getServerSnapshot` returns null, so the server renders the banner and
   * hydration matches. Anyone who already answered never sees it: the blocking
   * script stamps data-consent="set" and CSS hides it before first paint.
   */
  const stored = useSyncExternalStore(subscribeConsent, readConsentRaw, () => null);
  const [reopened, setReopened] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(DEFAULT_CONSENT);
  const panelRef = useRef<HTMLDivElement>(null);

  const open = reopened || stored === null;

  // The footer link reopens the panel for someone who already answered —
  // withdrawing consent has to be as easy as giving it. Setting state from an
  // event listener is fine; it is the synchronous-on-mount case that is not.
  useEffect(() => {
    const reopen = () => {
      setDraft(readConsent() ?? DEFAULT_CONSENT);
      setReopened(true);
      setSettingsOpen(true);
    };
    window.addEventListener("consent:open", reopen);
    return () => window.removeEventListener("consent:open", reopen);
  }, []);

  const decide = useCallback((state: ConsentState) => {
    writeConsent(state);
    setSettingsOpen(false);
    setReopened(false);
  }, []);

  // Dialog behaviour for the settings panel only.
  useEffect(() => {
    if (!settingsOpen) return;
    const node = panelRef.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSettingsOpen(false);
        document
          .querySelector<HTMLElement>("[data-consent-settings-trigger]")
          ?.focus();
        return;
      }
      if (event.key !== "Tab" || !node) return;
      const focusable = Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    node?.querySelector<HTMLElement>("button, input")?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [settingsOpen]);

  if (!open) return null;

  return (
    <div
      data-cookie-consent=""
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
      role="region"
      aria-label="Cookie notice"
    >
      <div className="mx-auto w-full max-w-desktop overflow-hidden rounded-2xl bg-canvas shadow-e5 ring-1 ring-line">
        {!settingsOpen ? (
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:gap-8">
            <div className="min-w-0">
              <h2 className="text-h4 text-fg">We care about your privacy</h2>
              <p className="mt-2 text-small text-fg-secondary">
                This site stores only what it needs to work — remembering that you
                closed a notice, and holding your domain shortlist. It sets no
                advertising or analytics cookies, and there are no third-party
                trackers on it. If that ever changes, this panel is where you decide.{" "}
                <Link
                  href="/privacy-policy#cookies"
                  className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
                >
                  Privacy policy
                </Link>
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:items-center">
              {/* Equal weight — see the note above. */}
              <Button onClick={() => decide(ACCEPT_ALL)} variant="primary">
                Accept all
              </Button>
              <Button onClick={() => decide(DEFAULT_CONSENT)} variant="outline">
                Reject all
              </Button>
              {/* `Button` is a plain function component and forwards no ref,
                  so focus is restored by attribute lookup rather than by
                  widening the shared primitive for one call site. */}
              <Button
                data-consent-settings-trigger=""
                onClick={() => setSettingsOpen(true)}
                variant="ghost"
              >
                Cookie settings
              </Button>
            </div>
          </div>
        ) : (
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-heading"
            className="max-h-[75vh] overflow-auto p-5 sm:p-6"
          >
            <h2 id="cookie-settings-heading" className="text-h4 text-fg">
              Cookie settings
            </h2>
            <p className="mt-2 text-small text-fg-secondary">
              Every category is listed with exactly what it currently covers. Two of
              the three are empty, and we would rather show you that than pad the
              list.
            </p>

            <ul className="mt-5 flex flex-col gap-3">
              {(Object.keys(CATEGORY_COPY) as ConsentCategory[]).map((key) => {
                const copy = CATEGORY_COPY[key];
                const items = TRACKERS[key];
                const checked = copy.locked ? true : draft[key];
                return (
                  <li
                    key={key}
                    className="rounded-xl bg-canvas-secondary p-4 ring-1 ring-inset ring-line-subtle"
                  >
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={copy.locked}
                        onChange={(event) =>
                          setDraft((prev) => ({ ...prev, [key]: event.target.checked }))
                        }
                        className="mt-0.5 h-4 w-4 shrink-0 accent-primary disabled:opacity-60"
                      />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-body font-semibold text-fg">
                            {copy.label}
                          </span>
                          {copy.locked && (
                            <span className="rounded-full bg-canvas-inset px-2 py-0.5 font-mono text-caption uppercase text-fg-secondary">
                              Always on
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-small text-fg-secondary">
                          {copy.detail}
                        </span>
                        <span
                          className={cn(
                            "mt-2 block text-small",
                            items.length ? "text-fg-muted" : "text-fg-muted italic",
                          )}
                        >
                          {items.length
                            ? items.join(" · ")
                            : "Nothing in this category is in use."}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Button onClick={() => decide(draft)} variant="primary">
                Save choices
              </Button>
              <Button onClick={() => decide(ACCEPT_ALL)} variant="outline">
                Accept all
              </Button>
              <Button onClick={() => decide(DEFAULT_CONSENT)} variant="ghost">
                Reject all
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
