"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { addDays, formatTime, slotsFor } from "./availability";
import { HOURS } from "./menu";
import { fill, trackDemo, useLumbre, useNow } from "./state";
import { CHAMPAGNE, CHAR, IVORY, display } from "./theme";
import { Eyebrow } from "./lumbre-ui";
import { Stepper } from "./lumbre-menu";

/**
 * Three-step reservation: party & date → time → details → confirmation.
 * Availability comes from availability.ts, the same function the assistant
 * quotes, and nothing is sent anywhere.
 */
export function LumbreReserve() {
  const { copy, locale, prefill } = useLumbre();
  const r = copy.reserve;
  const now = useNow();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [party, setParty] = useState(2);
  const [dayOffset, setDayOffset] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [occasion, setOccasion] = useState(0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Focus follows the step only when the step actually CHANGES. A "first run"
  // flag is not enough: Strict Mode runs effects twice in development, and the
  // second run would focus the heading and scroll the page to it on load.
  const shownStep = useRef(step);

  // Apply an assistant hand-off ("Book 7:30 PM") during render, keyed on its
  // nonce — the same prop-change pattern React documents, no effect needed.
  const [appliedNonce, setAppliedNonce] = useState(0);
  if (prefill && now && prefill.nonce !== appliedNonce) {
    setAppliedNonce(prefill.nonce);
    const offset = Math.round((prefill.date.getTime() - addDays(now, 0).getTime()) / 86_400_000);
    setParty(prefill.party);
    setDayOffset(Math.max(0, Math.min(13, offset)));
    setTime(prefill.minutes ?? null);
    setStep(prefill.minutes !== undefined ? 3 : 2);
    setError("");
  }

  useEffect(() => {
    if (shownStep.current === step) return;
    shownStep.current = step;
    headingRef.current?.focus();
  }, [step]);

  const days = now ? Array.from({ length: 14 }, (_, i) => addDays(now, i)) : [];
  // A day is bookable when it has at least one open slot for this party —
  // "open today" is not enough at 9 PM, when every seating has passed.
  const bookable = days.map((d) => (now ? slotsFor(d, party, now).some((s) => s.available) : false));
  const firstOpen = bookable.indexOf(true);
  const selectedOffset = dayOffset !== null && bookable[dayOffset] ? dayOffset : firstOpen >= 0 ? firstOpen : 0;
  const date = days[selectedOffset];
  const slots = date && now ? slotsFor(date, party, now) : [];
  const dateLabel = (d: Date) =>
    d.toLocaleDateString(locale === "es" ? "es-US" : "en-US", { weekday: "short", month: "short", day: "numeric" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || contact.trim().length < 5) return setError(r.required);
    setError("");
    const alphabet = "23456789ABCDEFGHJKLMNPQRSTVWXYZ";
    setCode(`LMB-${Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("")}`);
    setStep(4);
    trackDemo("reservation_confirmed", locale);
  };

  const reset = () => {
    setStep(1);
    setTime(null);
    setName("");
    setContact("");
    setOccasion(0);
    setNotes("");
  };

  const dark = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A97E]";
  const input =
    "mt-1.5 block h-12 w-full rounded-none bg-white/[0.06] px-4 text-[16px] text-white ring-1 ring-inset ring-white/20 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C8A97E]";

  return (
    <section id="reserve" aria-labelledby="lumbre-reserve-heading" className="lb-grain py-28 text-[#F4EFE6] lg:py-40" style={{ background: CHAR }}>
      <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-12">
        <div>
          <Eyebrow dark>{r.label}</Eyebrow>
          <h2 id="lumbre-reserve-heading" className={cn(display.className, "mt-8 text-[clamp(48px,5.6vw,92px)] leading-[0.92] font-light tracking-[-0.02em] text-current outline-none")}>
            {r.title}
          </h2>
          <p className="mt-8 max-w-[420px] text-[16px] leading-[1.75] text-[#F4EFE6]/75">{r.intro}</p>
          <ol className="mt-8 flex flex-col gap-3" aria-label={r.title}>
            {r.steps.map((s, i) => {
              const n = i + 1;
              const state = step > n ? "done" : step === n ? "current" : "todo";
              return (
                <li key={s} aria-current={state === "current" ? "step" : undefined} className="flex items-center gap-3 text-[15px]">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full text-[13px] font-semibold",
                      state === "todo" && "text-white/50 ring-1 ring-white/20",
                    )}
                    style={state === "current" ? { background: CHAMPAGNE, color: CHAR } : state === "done" ? { background: IVORY, color: CHAR } : undefined}
                  >
                    {state === "done" ? "✓" : n}
                  </span>
                  <span className={state === "todo" ? "text-white/50" : "text-white"}>{s}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="min-w-0 bg-[#F4EFE6]/[0.035] p-6 ring-1 ring-[#F4EFE6]/12 sm:p-10">
          <p className="text-[13px] text-white/60" aria-live="polite">
            {step <= 3 ? fill(r.stepOf, { n: step }) : ""}
          </p>
          <h3 ref={headingRef} tabIndex={-1} className={cn(display.className, "mt-2 text-[34px] leading-[1.1] text-current outline-none")}>
            {step <= 3 ? r.steps[step - 1] : r.confirmedTitle}
          </h3>

          {!now ? (
            <div className="mt-6 h-48 animate-pulse rounded-2xl bg-white/[0.05]" />
          ) : step === 1 ? (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span id="lumbre-party" className="text-[15px] font-semibold">
                  {r.party}
                </span>
                <span className="flex items-center gap-3">
                  <Stepper value={party} onChange={setParty} min={1} max={10} labelledBy="lumbre-party" dark decreaseLabel={`${r.party} −1`} increaseLabel={`${r.party} +1`} />
                  <span className="w-16 text-[14px] text-white/70">{r.guests}</span>
                </span>
              </div>
              <p className="mt-2 text-[13px] text-white/55">{r.largeParty}</p>

              <fieldset className="mt-7 min-w-0">
                <legend className="text-[15px] font-semibold">{r.date}</legend>
                <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:thin] sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-5">
                  {days.map((d, i) => {
                    const closed = HOURS[d.getDay()] === null;
                    const full = !closed && !bookable[i];
                    return (
                      <label key={i} className="relative shrink-0">
                        <input
                          type="radio"
                          name="lumbre-date"
                          checked={selectedOffset === i}
                          disabled={closed || full}
                          onChange={() => {
                            setDayOffset(i);
                            setTime(null);
                          }}
                          className="peer sr-only"
                        />
                        <span className="flex h-16 w-[88px] cursor-pointer flex-col items-center justify-center rounded-none text-center ring-1 ring-white/15 peer-checked:bg-[#F4EFE6] peer-checked:text-[#111411] peer-disabled:cursor-not-allowed peer-disabled:opacity-35 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#C8A97E] sm:w-auto">
                          <span className="text-[13px] font-semibold">{dateLabel(d)}</span>
                          {(closed || full) && <span className="text-[11px]">{closed ? r.closed : r.unavailable}</span>}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={cn("mt-7 h-12 rounded-full px-8 font-display text-[12px] font-semibold tracking-[0.16em] uppercase", dark)}
                style={{ background: CHAMPAGNE, color: CHAR }}
              >
                {r.next}
              </button>
            </div>
          ) : step === 2 ? (
            <div className="mt-6">
              <p className="text-[14px] text-white/70">
                {party} {r.guests} · {date && dateLabel(date)}
              </p>
              {slots.length === 0 ? (
                <p className="mt-5 rounded-none bg-white/[0.06] p-4 text-[14px]">{r.noSlots}</p>
              ) : (
                <fieldset className="mt-5">
                  <legend className="text-[15px] font-semibold">{r.time}</legend>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((s) => (
                      <label key={s.minutes} className="relative">
                        <input
                          type="radio"
                          name="lumbre-time"
                          checked={time === s.minutes}
                          disabled={!s.available}
                          onChange={() => setTime(s.minutes)}
                          className="peer sr-only"
                        />
                        <span className="flex h-12 cursor-pointer flex-col items-center justify-center rounded-none text-[14px] font-semibold ring-1 ring-white/15 peer-checked:bg-[#C8A97E] peer-checked:text-[#111411] peer-disabled:cursor-not-allowed peer-disabled:text-white/30 peer-disabled:line-through peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#C8A97E]">
                          {formatTime(s.minutes)}
                          {!s.available && <span className="sr-only">, {r.unavailable}</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              <div className="mt-7 flex gap-3">
                <button type="button" onClick={() => setStep(1)} className={cn("h-12 rounded-full px-7 font-display text-[12px] font-semibold tracking-[0.16em] uppercase ring-1 ring-white/25 hover:bg-white/10", dark)}>
                  {r.back}
                </button>
                <button
                  type="button"
                  disabled={time === null}
                  onClick={() => setStep(3)}
                  className={cn("h-12 rounded-full px-8 font-display text-[12px] font-semibold tracking-[0.16em] uppercase disabled:opacity-40", dark)}
                  style={{ background: CHAMPAGNE, color: CHAR }}
                >
                  {r.next}
                </button>
              </div>
            </div>
          ) : step === 3 ? (
            <form onSubmit={submit} noValidate className="mt-6">
              <p className="text-[14px] text-white/70">
                {party} {r.guests} · {date && dateLabel(date)} · {time !== null && formatTime(time)}
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="lumbre-r-name" className="text-[14px] font-semibold">
                    {r.name}
                  </label>
                  <input id="lumbre-r-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={input} />
                </div>
                <div>
                  <label htmlFor="lumbre-r-contact" className="text-[14px] font-semibold">
                    {r.contact}
                  </label>
                  <input id="lumbre-r-contact" value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="tel" className={input} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="lumbre-r-occasion" className="text-[14px] font-semibold">
                    {r.occasion}
                  </label>
                  <select
                    id="lumbre-r-occasion"
                    value={occasion}
                    onChange={(e) => setOccasion(Number(e.target.value))}
                    className={cn(input, "[&>option]:text-[#111411]")}
                  >
                    {r.occasions.map((o, i) => (
                      <option key={o} value={i}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="lumbre-r-notes" className="text-[14px] font-semibold">
                    {r.notes}
                  </label>
                  <textarea
                    id="lumbre-r-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={r.notesPlaceholder}
                    className={cn(input, "h-auto py-3")}
                  />
                </div>
              </div>
              {error && (
                <p role="alert" className="mt-4 text-[14px] font-medium text-[#fca5a5]">
                  {error}
                </p>
              )}
              <div className="mt-7 flex flex-wrap gap-3">
                <button type="button" onClick={() => setStep(2)} className={cn("h-12 rounded-full px-7 font-display text-[12px] font-semibold tracking-[0.16em] uppercase ring-1 ring-white/25 hover:bg-white/10", dark)}>
                  {r.back}
                </button>
                <button type="submit" className={cn("h-12 rounded-full px-8 font-display text-[12px] font-semibold tracking-[0.16em] uppercase", dark)} style={{ background: CHAMPAGNE, color: CHAR }}>
                  {r.confirm}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6">
              <dl className="grid gap-3 sm:grid-cols-3">
                {[
                  [r.code, code],
                  [r.party, `${party} ${r.guests}`],
                  [r.date, `${date ? dateLabel(date) : ""}${time !== null ? ` · ${formatTime(time)}` : ""}`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-none bg-white/[0.06] p-4">
                    <dt className="text-[12px] text-white/60">{k}</dt>
                    <dd className="mt-1 text-[16px] font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 bg-[#C8A97E]/12 p-4 text-[14px] leading-[1.6] text-[#ecdcc4] ring-1 ring-[#C8A97E]/35">
                {r.confirmedBody}
              </p>
              <button type="button" onClick={reset} className={cn("mt-6 h-12 rounded-full px-7 font-display text-[12px] font-semibold tracking-[0.16em] uppercase ring-1 ring-white/25 hover:bg-white/10", dark)}>
                {r.another}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

