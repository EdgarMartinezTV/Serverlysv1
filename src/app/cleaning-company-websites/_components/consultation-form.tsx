"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import type { CleaningCopy, Locale } from "../_i18n";

/**
 * The free-consultation form. Posts JSON to /api/cleaning-consultation, which
 * files the lead through the site's existing lead pipeline (store + notifier).
 *
 * Accessibility: visible labels, "required"/"optional" in text, errors tied to
 * fields with aria-describedby and summarised in a focused alert linking back
 * to each field; the result is announced and focused. The success message only
 * says "with the team" when the server confirms the notification was sent.
 */

type Copy = CleaningCopy["form"];
type TextField = "name" | "company" | "email" | "phone" | "city" | "website" | "notes";
type Field = TextField | "type" | "services" | "budget";
type Errors = Partial<Record<Field, string>>;
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; reference: string | null; notified: boolean }
  | { kind: "failure"; message: string };

const ORDER: Field[] = ["name", "company", "email", "phone", "city", "website", "type", "services", "budget", "notes"];
const EMPTY = { name: "", company: "", email: "", phone: "", city: "", website: "", notes: "", fax_number: "" };

export function ConsultationForm({
  copy,
  locale,
  phone,
  phoneHref,
  salesHref,
}: {
  copy: Copy;
  locale: Locale;
  phone: string;
  phoneHref: string;
  salesHref: string;
}) {
  const id = (f: string) => `cl-form-${f}`;
  const f = copy.fields;
  const [values, setValues] = useState(EMPTY);
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // When the form appeared, for the server's minimum-fill-time check. Not the
  // first keystroke: autofill fills everything in one event.
  const startedAt = useRef(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status.kind === "success" || status.kind === "failure") resultRef.current?.focus();
  }, [status.kind]);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key as Field]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    for (const k of ["name", "company", "email", "phone", "city"] as const) if (!values[k].trim()) e[k] = copy.errors.required;
    if (!e.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) e.email = copy.errors.email;
    if (!e.phone && values.phone.replace(/\D/g, "").length < 7) e.phone = copy.errors.phone;
    const w = values.website.trim();
    if (w && !/^(https?:\/\/)?[^\s/]+\.[^\s]{2,}/i.test(w)) e.website = copy.errors.url;
    if (!type) e.type = copy.errors.choose;
    if (!budget) e.budget = copy.errors.choose;
    if (services.length === 0) e.services = copy.errors.services;
    return e;
  };

  const fromServer = (codes: Record<string, string>): Errors => {
    const e: Errors = {};
    for (const [k, code] of Object.entries(codes)) {
      const field = k as Field;
      if (!ORDER.includes(field)) continue;
      if (field === "services") e.services = copy.errors.services;
      else if (field === "type" || field === "budget") e[field] = copy.errors.choose;
      else if (code === "required") e[field] = copy.errors.required;
      else if (field === "email") e.email = copy.errors.email;
      else if (field === "phone") e.phone = copy.errors.phone;
      else if (field === "website") e.website = copy.errors.url;
      else e[field] = copy.errors.required;
    }
    return e;
  };

  const showErrors = (e: Errors) => {
    setErrors(e);
    requestAnimationFrame(() => summaryRef.current?.focus());
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status.kind === "sending") return;
    const e = validate();
    if (Object.keys(e).length > 0) return showErrors(e);
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/cleaning-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, type, budget, services, locale, elapsed: Date.now() - startedAt.current }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; reference: string | null; notified: boolean }
        | { ok: false; reason: string; errors?: Record<string, string> }
        | null;
      if (data?.ok) {
        track("generate_lead", { form: "cleaning_consultation", business_type: type, budget, locale });
        track("consultation_request", { form: "cleaning_consultation", locale });
        setStatus({ kind: "success", reference: data.reference, notified: data.notified });
        return;
      }
      if (res.status === 429) return setStatus({ kind: "failure", message: copy.errors.rateLimited });
      if (data && !data.ok && data.errors) {
        setStatus({ kind: "idle" });
        return showErrors(fromServer(data.errors));
      }
      setStatus({ kind: "failure", message: copy.failure.body });
    } catch {
      setStatus({ kind: "failure", message: copy.errors.network });
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setType("");
    setBudget("");
    setServices([]);
    setErrors({});
    startedAt.current = Date.now();
    setStatus({ kind: "idle" });
  };

  if (status.kind === "success") {
    return (
      <div className="rounded-[24px] bg-white p-7 text-[#0b1530] shadow-[0_24px_60px_-24px_rgb(11_21_48/0.35)] sm:p-10" role="status">
        <span className="flex size-12 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 ref={resultRef} tabIndex={-1} className="mt-5 text-[26px] leading-tight font-semibold outline-none">
          {copy.success.title}
        </h3>
        <p className="mt-3 text-[16px] leading-[1.6] text-[#5b6472]">{status.notified ? copy.success.notified : copy.success.saved}</p>
        {status.reference && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#f1f2f5] px-3.5 py-2 text-[14px] text-[#2b3442]">
            {copy.success.reference}: <strong className="font-mono font-semibold tracking-wide">{status.reference}</strong>
          </p>
        )}
        <div className="mt-7">
          <button type="button" onClick={reset} className="text-[14px] font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {copy.success.again}
          </button>
        </div>
      </div>
    );
  }

  const errorList = ORDER.filter((k) => errors[k]);
  const describedBy = (k: Field, hint?: boolean) =>
    [hint ? id(`${k}-hint`) : null, errors[k] ? id(`${k}-error`) : null].filter(Boolean).join(" ") || undefined;
  const input =
    "mt-2 block h-12 w-full rounded-xl bg-white px-4 text-[16px] text-[#0b1530] ring-1 ring-inset ring-black/15 transition-shadow placeholder:text-[#8a919c] hover:ring-black/25 focus:outline-none focus:ring-2 focus:ring-primary aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#dc2626]";
  const labelCls = "text-[14px] font-semibold text-[#0b1530]";
  const req = (optional?: boolean) => <span className="font-normal text-[#5b6472]">({optional ? copy.optional : copy.required})</span>;

  const text = (
    key: Exclude<TextField, "notes">,
    opts: { type?: string; autoComplete?: string; hint?: string; optional?: boolean; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; wide?: boolean } = {},
  ) => (
    <div className={opts.wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={id(key)} className={labelCls}>
        {f[key]} {req(opts.optional)}
      </label>
      {opts.hint && (
        <p id={id(`${key}-hint`)} className="mt-1 text-[13px] text-[#5b6472]">
          {opts.hint}
        </p>
      )}
      <input
        id={id(key)}
        name={key}
        type={opts.type ?? "text"}
        inputMode={opts.inputMode}
        autoComplete={opts.autoComplete}
        value={values[key]}
        onChange={set(key)}
        required={!opts.optional}
        aria-required={!opts.optional}
        aria-invalid={errors[key] ? true : undefined}
        aria-describedby={describedBy(key, Boolean(opts.hint))}
        className={input}
      />
      {errors[key] && <FieldError id={id(`${key}-error`)}>{errors[key]}</FieldError>}
    </div>
  );

  const select = (key: "type" | "budget", options: Record<string, string>, value: string, onChange: (v: string) => void) => (
    <div>
      <label htmlFor={id(key)} className={labelCls}>
        {f[key]} {req()}
      </label>
      <div className="relative">
        <select
          id={id(key)}
          name={key}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
          }}
          required
          aria-required
          aria-invalid={errors[key] ? true : undefined}
          aria-describedby={describedBy(key)}
          className={cn(input, "appearance-none pr-10")}
        >
          <option value="">{copy.choose}</option>
          {Object.entries(options).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
        <svg viewBox="0 0 20 20" aria-hidden="true" className="pointer-events-none absolute right-4 bottom-4 size-5 text-[#5b6472]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 8 4 4 4-4" />
        </svg>
      </div>
      {errors[key] && <FieldError id={id(`${key}-error`)}>{errors[key]}</FieldError>}
    </div>
  );

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby={id("title")} className="relative rounded-[24px] bg-white p-6 text-[#0b1530] shadow-[0_24px_60px_-24px_rgb(11_21_48/0.35)] sm:p-9">
      <h3 id={id("title")} className="text-[22px] font-semibold">
        {copy.title}
      </h3>

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-6 rounded-xl bg-[#fef2f2] p-4 text-[14px] text-[#991b1b] ring-1 ring-[#fecaca] outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]">
          <p className="font-semibold">{copy.errors.summary}</p>
          <ul className="mt-2 list-disc pl-5">
            {errorList.map((k) => (
              <li key={k}>
                <a href={`#${k === "services" ? id("services-legend") : id(k)}`} className="underline underline-offset-2">
                  {f[k as keyof typeof f] ?? k}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status.kind === "failure" && (
        <div className="mt-6 rounded-xl bg-[#fff7ed] p-4 text-[14px] text-[#7c2d12] ring-1 ring-[#fed7aa]">
          <h4 ref={resultRef} tabIndex={-1} className="font-semibold outline-none">
            {copy.failure.title}
          </h4>
          <p className="mt-1">{status.message}</p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-semibold">
            <a href={phoneHref} className="underline underline-offset-2">
              {phone}
            </a>
            <a href={salesHref} className="underline underline-offset-2">
              {copy.failure.ticket}
            </a>
          </p>
        </div>
      )}

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {text("name", { autoComplete: "name" })}
        {text("company", { autoComplete: "organization" })}
        {text("email", { type: "email", autoComplete: "email", inputMode: "email" })}
        {text("phone", { type: "tel", autoComplete: "tel", inputMode: "tel" })}
        {text("city", { autoComplete: "address-level2", hint: f.cityHint })}
        {text("website", { type: "url", autoComplete: "url", inputMode: "url", hint: f.websiteHint, optional: true })}
        {select("type", copy.types, type, setType)}
        {select("budget", copy.budgets, budget, setBudget)}
      </div>

      <fieldset className="mt-7 min-w-0" aria-describedby={describedBy("services", true)}>
        <legend id={id("services-legend")} tabIndex={-1} className={cn(labelCls, "outline-none")}>
          {f.services} {req()}
        </legend>
        <p id={id("services-hint")} className="mt-1 text-[13px] text-[#5b6472]">
          {f.servicesHint}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {Object.entries(copy.services).map(([k, label]) => {
            const on = services.includes(k);
            return (
              <label
                key={k}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] ring-1 ring-inset transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
                  on ? "bg-brand-50 text-[#0b1530] ring-primary" : "bg-white text-[#2b3442] ring-black/15 hover:ring-black/25",
                )}
              >
                <input
                  type="checkbox"
                  name="services"
                  value={k}
                  checked={on}
                  onChange={() => {
                    setServices((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));
                    if (errors.services) setErrors((er) => ({ ...er, services: undefined }));
                  }}
                  className="size-[18px] shrink-0 accent-[#0000ff]"
                />
                {label}
              </label>
            );
          })}
        </div>
        {errors.services && <FieldError id={id("services-error")}>{errors.services}</FieldError>}
      </fieldset>

      <div className="mt-7">
        <label htmlFor={id("notes")} className={labelCls}>
          {f.notes} {req(true)}
        </label>
        <p id={id("notes-hint")} className="mt-1 text-[13px] text-[#5b6472]">
          {f.notesHint}
        </p>
        <textarea id={id("notes")} name="notes" rows={4} maxLength={1500} value={values.notes} onChange={set("notes")} aria-describedby={id("notes-hint")} className={cn(input, "h-auto py-3")} />
      </div>

      {/* Honeypot: invisible to people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("fax_number")}>Fax number</label>
        <input id={id("fax_number")} name="fax_number" tabIndex={-1} autoComplete="off" value={values.fax_number} onChange={set("fax_number")} />
      </div>

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 text-[16px] font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-80"
      >
        {status.kind === "sending" && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
        {status.kind === "sending" ? copy.sending : copy.submit}
      </button>
      <p aria-live="polite" className="sr-only">
        {status.kind === "sending" ? copy.sending : ""}
      </p>
      <p className="mt-4 text-center text-[13px] leading-[1.5] text-[#5b6472]">
        {copy.privacy}{" "}
        <a href="/privacy-policy" className="font-medium text-primary underline underline-offset-2">
          {copy.privacyLink}
        </a>
        .
      </p>
    </form>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-[#b91c1c]">
      <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 shrink-0" fill="currentColor">
        <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-.9 4h1.8v5.2H9.1V6Zm0 6.6h1.8v1.8H9.1v-1.8Z" />
      </svg>
      {children}
    </p>
  );
}
