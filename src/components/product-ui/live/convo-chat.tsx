"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { DemoBadge } from "./shell";
import { ConvoAiLogo } from "@/components/layout/convoai-logo";

/**
 * ConvoAI — the website agent, running for real in the page.
 *
 * This is a working chat: you type, it sends, state advances, and the lead
 * capture at the end validates its inputs and reports what it collected. What
 * it is NOT is a live model call. `respond()` below is the integration
 * boundary — a scripted intent matcher standing in for the ConvoAI endpoint,
 * which needs an account key this marketing page has no business holding.
 *
 * That boundary is deliberate rather than lazy. Wiring a public unauthenticated
 * proxy to a paid model from a landing page is an abuse endpoint; the honest
 * version is a demonstration that says so. Swapping in the real transport means
 * replacing `respond` and nothing else.
 */

type Message = {
  id: number;
  from: "visitor" | "agent";
  text: string;
};

type Lead = { name: string; email: string };

/** Opening turn. The agent speaks first, as it does on a real site. */
const GREETING =
  "Hi — I'm the Serverlys agent. Ask me about plans, migration or domains, and I can book a callback.";

/** Prompts a visitor can click instead of typing. Real input either way. */
const SUGGESTIONS = [
  "What does hosting cost?",
  "Can you move my site?",
  "Is a domain included?",
];

/**
 * Intent matcher — the stand-in for the ConvoAI endpoint.
 *
 * Answers are drawn from what the site actually claims elsewhere (pricing.ts,
 * the migration section, tlds.ts). It must never invent a commitment: the
 * fallback hands off to a human rather than guessing.
 */
function respond(input: string): { text: string; askForLead?: boolean } {
  const q = input.toLowerCase();

  if (/(price|cost|how much|plan|cheap|\$)/.test(q)) {
    return {
      text: "Plans start at $7.95/mo, against a standard rate of $12.62 — we show both up front. That includes free SSL, free migration and daily backups.",
    };
  }
  if (/(migrat|move|transfer|switch|import)/.test(q)) {
    return {
      text: "Yes — migration is free and we do it for you. We copy the site to a staging URL first, you approve it, then we cut DNS over. No downtime, and nothing changes on your old host until you're happy.",
      askForLead: true,
    };
  }
  if (/(domain|\.com|dns|name)/.test(q)) {
    return {
      text: "A domain is included free for the first year on any annual plan. A .com is $14.95 after that, and WHOIS privacy is included rather than sold separately.",
    };
  }
  if (/(backup|restore|secur|ssl|hack|malware)/.test(q)) {
    return {
      text: "Every plan gets daily off-server backups you can restore yourself, free SSL that auto-renews, and TLS 1.3 enforced. Restores don't cost extra.",
    };
  }
  if (/(support|human|call|phone|talk|speak)/.test(q)) {
    return {
      text: "I can put a person on it. Leave your name and email and support will come back to you — usually within the hour during business hours.",
      askForLead: true,
    };
  }
  if (/(wordpress|woo|store|ecommerce|shop)/.test(q)) {
    return {
      text: "WordPress and WooCommerce are both tuned for here — LiteSpeed caching, automatic core updates, and staging on every plan. Stores sit on the ecommerce tier for checkout speed under load.",
    };
  }
  return {
    text: "I'd rather hand that to someone who can answer it properly than guess. Leave your name and email and the team will pick it up.",
    askForLead: true,
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ConvoChat({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "agent", text: GREETING },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [lead, setLead] = useState<Lead>({ name: "", email: "" });
  const [leadError, setLeadError] = useState<string | null>(null);
  const [captured, setCaptured] = useState<Lead | null>(null);

  const nextId = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const formId = useId();

  // Any pending reply must be cancelled on unmount, or setState fires against a
  // torn-down tree when someone scrolls past mid-answer.
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Keep the newest turn in view without stealing the page's scroll position:
  // scrollTop on the log itself, never scrollIntoView.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, typing, leadOpen, captured]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, from: "visitor", text: trimmed },
    ]);
    setDraft("");
    setTyping(true);

    // A visible think time. Instant replies read as a lookup table, which is
    // exactly what a visitor should not conclude about the product.
    const reply = respond(trimmed);
    const timer = setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, from: "agent", text: reply.text },
      ]);
      if (reply.askForLead && !captured) setLeadOpen(true);
    }, 700);
    timers.current.push(timer);
  }

  function submitLead(event: React.FormEvent) {
    event.preventDefault();
    if (!lead.name.trim()) return setLeadError("Please add your name.");
    if (!EMAIL_RE.test(lead.email))
      return setLeadError("That email doesn't look right.");
    setLeadError(null);
    setCaptured({ name: lead.name.trim(), email: lead.email.trim() });
    setLeadOpen(false);
    setMessages((prev) => [
      ...prev,
      {
        id: nextId.current++,
        from: "agent",
        text: `Thanks ${lead.name.trim().split(" ")[0]} — that's logged. In the live product this creates the CRM record and notifies the team.`,
      },
    ]);
  }

  return (
    <section
      aria-label="ConvoAI website agent demonstration"
      className={cn(
        "flex flex-col overflow-hidden rounded-xl",
        dark
          ? "bg-surface-dark-elevated shadow-e5 ring-1 ring-inset ring-white/10"
          : "bg-surface shadow-e5 ring-1 ring-line",
        className,
      )}
    >
      {/* Header */}
      <header
        className={cn(
          "flex items-center gap-2.5 border-b px-3.5 py-3",
          dark
            ? "border-white/10 bg-white/[0.03]"
            : "border-line-subtle bg-canvas-secondary",
        )}
      >
        {/* The product's own mark, following the console's tone. This used to
            be a violet circle with a "C" in it — a placeholder standing in for
            a logo we already had. */}
        <ConvoAiLogo tone={dark ? "dark" : "light"} className="h-5 w-auto shrink-0" />
        <span className="min-w-0">
          <span className="sr-only">ConvoAI</span>
          <span className="flex items-center gap-1.5 text-ui text-fg-muted">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-success-fill"
            />
            Answering now
          </span>
        </span>
        <span className="ml-auto">
          <DemoBadge tone={tone} />
        </span>
      </header>

      {/* Transcript. A live region so a screen reader hears replies arrive. */}
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        className="flex min-h-[15rem] flex-1 flex-col gap-2.5 overflow-y-auto p-3.5"
      >
        {messages.map((message) => (
          <p
            key={message.id}
            className={cn(
              "max-w-[85%] rounded-xl px-3 py-2 text-[0.8125rem] leading-relaxed",
              message.from === "visitor"
                ? "self-end rounded-br-sm bg-primary text-white"
                : dark
                  ? "self-start rounded-bl-sm bg-white/8 text-fg-on-dark-secondary"
                  : "self-start rounded-bl-sm bg-canvas-inset text-fg-secondary",
            )}
          >
            <span className="sr-only">
              {message.from === "visitor" ? "You said: " : "Agent said: "}
            </span>
            {message.text}
          </p>
        ))}

        {typing && (
          <p
            className={cn(
              "flex w-fit items-center gap-1 self-start rounded-xl rounded-bl-sm px-3 py-2.5",
              dark ? "bg-white/8" : "bg-canvas-inset",
            )}
          >
            <span className="sr-only">Agent is typing</span>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-fg-muted motion-safe:animate-bounce"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </p>
        )}

        {/* Lead capture — a real form, validated. */}
        {leadOpen && (
          <form
            onSubmit={submitLead}
            className={cn(
              "mt-1 rounded-xl p-3",
              dark
                ? "bg-white/[0.04] ring-1 ring-inset ring-white/10"
                : "bg-canvas-secondary ring-1 ring-line-subtle",
            )}
          >
            <p
              className={cn(
                "text-ui font-semibold",
                dark ? "text-white" : "text-fg",
              )}
            >
              Where should we reply?
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              <label htmlFor={`${formId}-name`} className="sr-only">
                Your name
              </label>
              <input
                id={`${formId}-name`}
                value={lead.name}
                onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
                placeholder="Name"
                autoComplete="name"
                className={cn(
                  "h-9 rounded-md px-2.5 text-[0.8125rem] outline-none ring-1 ring-inset",
                  "focus-visible:ring-2 focus-visible:ring-primary",
                  dark
                    ? "bg-black/25 text-white ring-white/15 placeholder:text-fg-on-dark-muted"
                    : "bg-surface text-fg ring-line-input placeholder:text-fg-muted",
                )}
              />
              <label htmlFor={`${formId}-email`} className="sr-only">
                Your email
              </label>
              <input
                id={`${formId}-email`}
                type="email"
                value={lead.email}
                onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
                placeholder="Email"
                autoComplete="email"
                aria-describedby={leadError ? `${formId}-error` : undefined}
                aria-invalid={leadError ? true : undefined}
                className={cn(
                  "h-9 rounded-md px-2.5 text-[0.8125rem] outline-none ring-1 ring-inset",
                  "focus-visible:ring-2 focus-visible:ring-primary",
                  dark
                    ? "bg-black/25 text-white ring-white/15 placeholder:text-fg-on-dark-muted"
                    : "bg-surface text-fg ring-line-input placeholder:text-fg-muted",
                )}
              />
            </div>
            {leadError && (
              <p
                id={`${formId}-error`}
                role="alert"
                className="mt-1.5 text-ui text-error"
              >
                {leadError}
              </p>
            )}
            <button
              type="submit"
              className="mt-2 h-9 w-full rounded-md bg-primary text-[0.8125rem] font-medium text-white transition-colors duration-fast hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Send it through
            </button>
          </form>
        )}

        {captured && (
          <p
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-ui",
              dark
                ? "bg-success-fill/12 text-fg-on-dark-secondary"
                : "bg-success-soft text-success",
            )}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-success-fill"
            />
            Lead captured · {captured.name} · {captured.email}
          </p>
        )}
      </div>

      {/* Suggestions — only while the conversation is still opening. */}
      {messages.length === 1 && !typing && (
        <div className="flex flex-wrap gap-1.5 px-3.5 pb-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className={cn(
                /* min-h-6 = the 24px interactive floor, stated rather than
                   inherited — same reason as the console tabs in
                   product-ui/live/shell.tsx. These chips are real buttons that
                   send a message; landing exactly on 24px because of whatever
                   line-height the type step happens to carry is not a floor,
                   it is a coincidence. */
                "inline-flex min-h-6 items-center rounded-full px-2.5 py-1 text-ui transition-colors duration-fast",
                "focus-visible:outline-2 focus-visible:outline-offset-1",
                dark
                  ? "text-fg-on-dark-secondary ring-1 ring-inset ring-white/15 hover:bg-white/10 focus-visible:outline-white"
                  : "text-fg-secondary ring-1 ring-inset ring-line hover:bg-canvas-secondary focus-visible:outline-primary",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
        className={cn(
          "flex items-center gap-2 border-t p-2.5",
          dark ? "border-white/10" : "border-line-subtle",
        )}
      >
        <label htmlFor={`${formId}-draft`} className="sr-only">
          Message the agent
        </label>
        <input
          id={`${formId}-draft`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about plans, migration, domains…"
          autoComplete="off"
          className={cn(
            "h-9 min-w-0 flex-1 rounded-md px-2.5 text-[0.8125rem] outline-none ring-1 ring-inset",
            "focus-visible:ring-2 focus-visible:ring-primary",
            dark
              ? "bg-black/25 text-white ring-white/12 placeholder:text-fg-on-dark-muted"
              : "bg-canvas-secondary text-fg ring-line placeholder:text-fg-muted",
          )}
        />
        <button
          type="submit"
          disabled={!draft.trim() || typing}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-white transition-colors duration-fast hover:bg-primary-hover disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="sr-only">Send message</span>
          <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
            <path
              d="M3.5 10h11m0 0-4.2-4.2M14.5 10l-4.2 4.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </section>
  );
}
