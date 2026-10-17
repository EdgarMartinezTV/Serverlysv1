"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "../_i18n";
import { reply, type AssistantAction } from "./assistant";
import { MENU } from "./menu";
import { fill, trackDemo, useLumbre, useNow } from "./state";
import { CHAR, CREAM, EMBER, RUST, serif } from "./theme";

/**
 * The sample assistant. Scripted (see assistant.ts) and labelled as such in
 * its header and under the input; its action buttons drive the real demo —
 * they filter the menu, add to the cart and prefill the reservation form.
 */

type Message = { id: number; from: "guest" | "bot"; text: string; lang: Locale; actions?: AssistantAction[] };

export function LumbreAssistant() {
  const { copy, locale, setFilter, add, prefillReservation, goTo, announce } = useLumbre();
  const a = copy.assistant;
  const now = useNow();
  const [log, setLog] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const nextId = useRef(1);
  const timer = useRef<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log, typing]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setLog((l) => [...l, { id: nextId.current++, from: "guest", text: q, lang: locale }]);
    setDraft("");
    setTyping(true);
    trackDemo("assistant_question", locale);
    const answer = reply(q, locale, now ?? new Date());
    timer.current = window.setTimeout(() => {
      setLog((l) => [...l, { id: nextId.current++, from: "bot", text: answer.text, lang: answer.lang, actions: answer.actions }]);
      setTyping(false);
    }, 650 + Math.min(900, answer.text.length * 6));
  };

  const run = (action: AssistantAction) => {
    switch (action.kind) {
      case "filter":
        setFilter(action.tag);
        goTo("menu");
        break;
      case "add": {
        const item = MENU.find((m) => m.id === action.itemId);
        if (!item) return;
        add(item, item.options ? 1 : null);
        announce(fill(copy.cart.added, { item: item.name[locale] }));
        break;
      }
      case "reserve":
        prefillReservation({ party: action.party, date: action.date, minutes: action.minutes });
        goTo("reserve");
        break;
      case "go":
        goTo(action.target);
        break;
    }
  };

  return (
    <section id="assistant" aria-labelledby="lumbre-assistant-heading" className="scroll-mt-32 py-20 lg:py-28" style={{ background: CREAM, color: CHAR }}>
      <div className="mx-auto grid w-full max-w-[1200px] items-start gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: RUST }}>
            {a.label}
          </p>
          <h2 id="lumbre-assistant-heading" className={cn(serif.className, "mt-3 text-[44px] leading-none text-current outline-none sm:text-[60px]")}>
            {a.title}
          </h2>
          <p className="mt-4 max-w-[420px] text-[16px] leading-[1.6] text-[#4a3f36]">{a.intro}</p>
          <p className="mt-6 max-w-[420px] rounded-xl bg-white p-4 text-[13px] leading-[1.55] text-[#5c5047] ring-1 ring-[#14100d]/10">
            {a.disclaimer}
          </p>
        </div>

        <div className="min-w-0 overflow-hidden rounded-[24px] bg-white shadow-[0_30px_70px_-30px_rgb(20_16_13/0.45)] ring-1 ring-[#14100d]/10">
          <div className="flex items-center gap-3 px-5 py-4" style={{ background: CHAR, color: CREAM }}>
            <span className={cn(serif.className, "flex size-10 items-center justify-center rounded-full text-[20px]")} style={{ background: EMBER, color: CHAR }}>
              L
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold">{a.name}</span>
              <span className="flex items-center gap-1.5 text-[12px] text-white/65">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-[#34d399]" />
                {a.status}
              </span>
            </span>
            <span className="hidden rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold sm:inline">{a.badge}</span>
          </div>

          <div
            ref={scroller}
            role="log"
            aria-label={a.logLabel}
            aria-live="polite"
            className="flex h-[380px] flex-col gap-3 overflow-y-auto bg-[#faf7f2] p-5"
          >
            {log.length === 0 && (
              <div className="m-auto max-w-[300px] text-center text-[14px] text-[#5c5047]">
                <p className="sm:hidden">{a.badge}</p>
                <p className="mt-1">{a.intro}</p>
              </div>
            )}
            {log.map((m) => (
              <div key={m.id} className={cn("flex max-w-[88%] flex-col gap-2", m.from === "guest" ? "self-end items-end" : "self-start")}>
                <p
                  lang={m.lang}
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-[15px] leading-[1.5]",
                    m.from === "guest" ? "rounded-br-md text-[#f6efe6]" : "rounded-bl-md bg-white text-[#14100d] ring-1 ring-[#14100d]/10",
                  )}
                  style={m.from === "guest" ? { background: CHAR } : undefined}
                >
                  <span className="sr-only">{m.from === "guest" ? a.you : a.name}: </span>
                  {m.text}
                </p>
                {m.actions && m.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {m.actions.map((act) => (
                      <button
                        key={act.label}
                        type="button"
                        onClick={() => run(act)}
                        lang={m.lang}
                        className="rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold ring-1 ring-[#a4431a]/40 hover:bg-[#fff4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a4431a]"
                        style={{ color: RUST }}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <span role="status" aria-label={a.typing} className="flex gap-1 self-start rounded-2xl bg-white px-4 py-3.5 ring-1 ring-[#14100d]/10">
                <i className="size-1.5 animate-pulse rounded-full bg-[#a39488]" />
                <i className="size-1.5 animate-pulse rounded-full bg-[#a39488] [animation-delay:150ms]" />
                <i className="size-1.5 animate-pulse rounded-full bg-[#a39488] [animation-delay:300ms]" />
              </span>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-[#14100d]/10 px-4 py-3 [scrollbar-width:none]">
            {a.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                disabled={typing}
                className="shrink-0 rounded-full bg-[#f6efe6] px-3.5 py-2 text-[13px] font-medium whitespace-nowrap text-[#3b322b] hover:bg-[#efe4d6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a4431a] disabled:opacity-60"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="flex gap-2 border-t border-[#14100d]/10 p-3"
          >
            <label htmlFor="lumbre-chat-input" className="sr-only">
              {a.placeholder}
            </label>
            <input
              id="lumbre-chat-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={a.placeholder}
              autoComplete="off"
              maxLength={300}
              className="h-12 min-w-0 flex-1 rounded-full bg-[#faf7f2] px-4 text-[16px] ring-1 ring-inset ring-[#14100d]/15 focus:outline-none focus:ring-2 focus:ring-[#a4431a]"
            />
            <button
              type="submit"
              disabled={!draft.trim() || typing}
              className="flex h-12 items-center gap-2 rounded-full px-5 text-[14px] font-semibold disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a4431a]"
              style={{ background: CHAR, color: CREAM }}
            >
              <span className="max-sm:sr-only">{a.send}</span>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10h13m-5-5 5 5-5 5" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
