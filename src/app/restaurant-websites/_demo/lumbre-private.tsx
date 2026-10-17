"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { LuxCopy } from "./copy-lux";
import { trackDemo, useLumbre, useNow } from "./state";
import { CHAR, MUTED_LIGHT, display } from "./theme";
import { Eyebrow, Lines } from "./lumbre-ui";

type Field = "name" | "email" | "date";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * F · Private dining, with a demonstration inquiry form.
 *
 * ⚠ NOTHING IS SENT. The form validates (name, email, a date from tomorrow),
 * then shows a confirmation that says plainly it was a demo. On a client's
 * site this posts to their events inbox or CRM.
 */
export function LumbrePrivate({ lux }: { lux: LuxCopy }) {
  const { locale } = useLumbre();
  const p = lux.privateDining;
  const f = p.form;
  const now = useNow();
  const [values, setValues] = useState({ name: "", email: "", date: "", guests: f.guestOptions[0], occasion: f.occasions[0], message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [done, setDone] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const tomorrow = now ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) : null;
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const minDate = tomorrow ? iso(tomorrow) : undefined;

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k as Field]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) er.name = f.errors.name;
    if (!EMAIL.test(values.email.trim())) er.email = f.errors.email;
    if (!values.date || (minDate && values.date < minDate)) er.date = f.errors.date;
    setErrors(er);
    if (Object.keys(er).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setDone(true);
    trackDemo("private_inquiry", locale);
  };

  const id = (k: string) => `lumbre-pd-${k}`;
  const input =
    "mt-2 block h-12 w-full border-0 border-b border-[#111411]/25 bg-transparent px-0 text-[16px] text-[#111411] transition-colors placeholder:text-[#111411]/40 focus:border-[#111411] focus:ring-0 focus:outline-none aria-[invalid=true]:border-[#a3402a]";
  const label = "font-display text-[11px] font-semibold tracking-[0.18em] uppercase";

  return (
    <section id="private" aria-labelledby="lumbre-private-heading" className="lb-grain overflow-hidden py-28 text-[#F4EFE6] lg:py-40" style={{ background: CHAR }}>
      <div className="mx-auto grid w-full max-w-[1440px] gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-6">
          <Eyebrow dark>{p.label}</Eyebrow>
          <h2
            id="lumbre-private-heading"
            data-reveal="mask"
            className={cn(display.className, "mt-8 text-[clamp(48px,5.6vw,92px)] leading-[0.92] font-light tracking-[-0.02em] outline-none")}
          >
            <Lines lines={[p.title]} />
          </h2>
          <p data-reveal className="mt-8 max-w-[500px] text-[16px] leading-[1.8] text-[#F4EFE6]/75">
            {p.body}
          </p>
          <ul className="mt-12 border-t border-[#F4EFE6]/12">
            {p.rooms.map((r) => (
              <li key={r.name} data-reveal className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[#F4EFE6]/12 py-5">
                <span className={cn(display.className, "text-[28px] leading-tight")}>{r.name}</span>
                <span className="font-display text-[12px] tracking-[0.12em] text-[#9C9A90] uppercase">{r.detail}</span>
              </li>
            ))}
          </ul>
          <div data-reveal="image" className="relative mt-14 hidden aspect-[16/10] overflow-hidden lg:block">
            <Image src="/restaurant/still-fireside-pour.jpg" alt={p.photoAlt} fill sizes="46vw" className="object-cover" />
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <div className="bg-[#FAF8F3] p-7 text-[#111411] sm:p-10 lg:sticky lg:top-28">
            {done ? (
              <div role="status">
                <h3 ref={doneRef} tabIndex={-1} className={cn(display.className, "text-[38px] leading-[1.05] outline-none")}>
                  {f.doneTitle}
                </h3>
                <p className="mt-5 text-[15px] leading-[1.7]" style={{ color: MUTED_LIGHT }}>
                  {f.doneBody}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDone(false);
                    setValues({ name: "", email: "", date: "", guests: f.guestOptions[0], occasion: f.occasions[0], message: "" });
                  }}
                  className="mt-8 font-display text-[12px] font-semibold tracking-[0.16em] text-[#696D55] uppercase underline underline-offset-4"
                >
                  {f.again}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate aria-labelledby={id("title")}>
                <h3 id={id("title")} className={cn(display.className, "text-[34px] leading-[1.05]")}>
                  {f.title}
                </h3>
                {Object.values(errors).some(Boolean) && (
                  <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-6 border-l-2 border-[#a3402a] bg-[#a3402a]/[0.06] px-4 py-3 text-[14px] text-[#7a2e1d] outline-none">
                    <p className="font-semibold">{f.summary}</p>
                    <ul className="mt-1 list-disc pl-5">
                      {(["name", "email", "date"] as const)
                        .filter((k) => errors[k])
                        .map((k) => (
                          <li key={k}>
                            <a href={`#${id(k)}`} className="underline underline-offset-2">
                              {errors[k]}
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                <div className="mt-8 grid gap-7 sm:grid-cols-2">
                  {(["name", "email"] as const).map((k) => (
                    <div key={k} className={k === "name" ? "sm:col-span-2" : undefined}>
                      <label htmlFor={id(k)} className={label}>
                        {f[k]}
                      </label>
                      <input
                        id={id(k)}
                        type={k === "email" ? "email" : "text"}
                        autoComplete={k === "email" ? "email" : "name"}
                        value={values[k]}
                        onChange={set(k)}
                        required
                        aria-invalid={errors[k] ? true : undefined}
                        aria-describedby={errors[k] ? id(`${k}-err`) : undefined}
                        className={input}
                      />
                      {errors[k] && (
                        <p id={id(`${k}-err`)} className="mt-2 text-[13px] text-[#a3402a]">
                          {errors[k]}
                        </p>
                      )}
                    </div>
                  ))}
                  <div>
                    <label htmlFor={id("date")} className={label}>
                      {f.date}
                    </label>
                    <input
                      id={id("date")}
                      type="date"
                      min={minDate}
                      value={values.date}
                      onChange={set("date")}
                      required
                      aria-invalid={errors.date ? true : undefined}
                      aria-describedby={errors.date ? id("date-err") : undefined}
                      className={input}
                    />
                    {errors.date && (
                      <p id={id("date-err")} className="mt-2 text-[13px] text-[#a3402a]">
                        {errors.date}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={id("guests")} className={label}>
                      {f.guests}
                    </label>
                    <select id={id("guests")} value={values.guests} onChange={set("guests")} className={input}>
                      {f.guestOptions.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={id("occasion")} className={label}>
                      {f.occasion}
                    </label>
                    <select id={id("occasion")} value={values.occasion} onChange={set("occasion")} className={input}>
                      {f.occasions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={id("message")} className={label}>
                      {f.message}
                    </label>
                    <textarea
                      id={id("message")}
                      rows={3}
                      maxLength={800}
                      value={values.message}
                      onChange={set("message")}
                      placeholder={f.messagePlaceholder}
                      className={cn(input, "h-auto resize-none py-3")}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-10 h-14 w-full rounded-full bg-[#111411] font-display text-[12px] font-semibold tracking-[0.18em] text-[#F4EFE6] uppercase transition-colors hover:bg-[#2a2e28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#696D55]"
                >
                  {f.submit}
                </button>
                <p className="mt-4 text-center text-[12px] leading-[1.5]" style={{ color: MUTED_LIGHT }}>
                  {f.note}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
