"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { restaurantPlans, type RestaurantPlanId } from "@/data/restaurant-plans";
import { SERVICE_IDS, type LandingCopy, type Locale, type ServiceId } from "../_i18n";
import { INK, MUTED } from "./ui";

/**
 * The free-review consultation form. Posts to /api/restaurant-review, which
 * files the lead through the site's existing lead pipeline.
 *
 * Accessibility: every control has a visible label; required fields say so in
 * text, not only with an asterisk; errors are tied to their field with
 * aria-describedby and summarised in a focused alert with links back to each
 * field; the result is announced and focused.
 *
 * A plan card's CTA links to `#review-<plan>`, an anchor at the top of this
 * section; the hash preselects that plan here.
 */

type Field = "restaurant" | "contact" | "website" | "phone" | "email" | "location" | "services" | "message";
type Errors = Partial<Record<Field, string>>;
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; reference: string | null; notified: boolean }
  | { kind: "failure"; message: string };

/** First interaction time, for the server's minimum-fill-time check. */
function stamp(ref: { current: number }) {
  if (!ref.current) ref.current = Date.now();
}

const ORDER: Field[] = ["restaurant", "contact", "website", "phone", "email", "location", "services", "message"];

export function ReviewForm({
  copy,
  locale,
  phone,
  phoneHref,
  salesHref,
}: {
  copy: LandingCopy["form"];
  locale: Locale;
  phone: string;
  phoneHref: string;
  salesHref: string;
}) {
  // Fixed prefix, not useId(): these ids are also URL fragments in the error
  // summary's links, and there is only ever one form on the page.
  const id = (f: string) => `rw-form-${f}`;
  const f = copy.fields;

  const [values, setValues] = useState({
    restaurant: "",
    contact: "",
    website: "",
    phone: "",
    email: "",
    location: "",
    message: "",
    company_site: "",
  });
  const [noWebsite, setNoWebsite] = useState(false);
  const [services, setServices] = useState<ServiceId[]>([]);
  const [plan, setPlan] = useState<RestaurantPlanId | "">("");
  const [language, setLanguage] = useState<Locale>(locale);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const startedAt = useRef<number>(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  // Plan preselection from a plan card (#review-growth etc.).
  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#review-(starter|growth|pro)$/);
      if (m) setPlan(m[1] as RestaurantPlanId);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  useEffect(() => {
    if (status.kind === "success" || status.kind === "failure") resultRef.current?.focus();
  }, [status.kind]);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    stamp(startedAt);
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key as Field]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const toggleService = (s: ServiceId) => {
    stamp(startedAt);
    setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
    if (errors.services) setErrors((er) => ({ ...er, services: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    const req = (k: Field, v: string) => {
      if (!v.trim()) e[k] = copy.errors.required;
    };
    req("restaurant", values.restaurant);
    req("contact", values.contact);
    req("phone", values.phone);
    req("email", values.email);
    req("location", values.location);
    if (!e.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) e.email = copy.errors.email;
    if (!e.phone && values.phone.replace(/\D/g, "").length < 7) e.phone = copy.errors.phone;
    if (!noWebsite) {
      const w = values.website.trim();
      if (!w || !/^(https?:\/\/)?[^\s/]+\.[^\s]{2,}/i.test(w)) e.website = copy.errors.url;
    }
    if (services.length === 0) e.services = copy.errors.services;
    return e;
  };

  const fromServer = (codes: Record<string, string>): Errors => {
    const e: Errors = {};
    for (const [k, code] of Object.entries(codes)) {
      const field = k as Field;
      if (!ORDER.includes(field)) continue;
      if (code === "required") e[field] = field === "services" ? copy.errors.services : copy.errors.required;
      else if (field === "email") e[field] = copy.errors.email;
      else if (field === "phone") e[field] = copy.errors.phone;
      else if (field === "website") e[field] = copy.errors.url;
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
      const res = await fetch("/api/restaurant-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: noWebsite ? "" : values.website,
          noWebsite,
          services,
          plan,
          language,
          locale,
          elapsed: startedAt.current ? Date.now() - startedAt.current : 0,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; reference: string | null; notified: boolean }
        | { ok: false; reason: string; errors?: Record<string, string> }
        | null;

      if (data?.ok) {
        track("generate_lead", { form: "restaurant_review", plan_name: plan || "none", locale });
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
    setValues({ restaurant: "", contact: "", website: "", phone: "", email: "", location: "", message: "", company_site: "" });
    setServices([]);
    setNoWebsite(false);
    setErrors({});
    startedAt.current = 0;
    setStatus({ kind: "idle" });
  };

  if (status.kind === "success") {
    return (
      <div className="rounded-[24px] bg-white p-7 shadow-[0_24px_60px_-24px_rgb(11_21_48/0.25)] ring-1 ring-black/[0.06] sm:p-10" role="status">
        <span className="flex size-12 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 ref={resultRef} tabIndex={-1} className={cn("mt-5 font-display text-[28px] leading-tight font-normal tracking-[-0.02em] outline-none", INK)}>
          {copy.success.title}
        </h3>
        <p className={cn("mt-3 text-[16px] leading-[1.6]", MUTED)}>
          {status.notified ? copy.success.notified : copy.success.saved}
        </p>
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

  const text = (key: Exclude<Field, "services">, label: string, opts: { type?: string; autoComplete?: string; hint?: string; optional?: boolean; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; disabled?: boolean } = {}) => (
    <div>
      <label htmlFor={id(key)} className={cn("text-[14px] font-semibold", INK)}>
        {label}{" "}
        <span className="font-normal text-[#5b6472]">({opts.optional ? f.optional : f.required})</span>
      </label>
      {opts.hint && (
        <p id={id(`${key}-hint`)} className={cn("mt-1 text-[13px]", MUTED)}>
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
        disabled={opts.disabled}
        required={!opts.optional}
        aria-required={!opts.optional}
        aria-invalid={errors[key] ? true : undefined}
        aria-describedby={describedBy(key, Boolean(opts.hint))}
        className={cn(input, opts.disabled && "cursor-not-allowed bg-[#f4f4f7] text-[#8a919c]")}
      />
      {errors[key] && <FieldError id={id(`${key}-error`)}>{errors[key]}</FieldError>}
    </div>
  );

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="relative rounded-[24px] bg-white p-6 shadow-[0_24px_60px_-24px_rgb(11_21_48/0.25)] ring-1 ring-black/[0.06] sm:p-9"
      aria-labelledby="rw-review-heading"
    >
      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-7 rounded-xl bg-[#fef2f2] p-4 text-[14px] text-[#991b1b] ring-1 ring-[#fecaca] outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]">
          <p className="font-semibold">{copy.errors.summary}</p>
          <ul className="mt-2 list-disc pl-5">
            {errorList.map((k) => (
              <li key={k}>
                <a href={`#${k === "services" ? id("services-legend") : id(k)}`} className="underline underline-offset-2">
                  {k === "services" ? f.services : f[k as Exclude<Field, "services">] ?? k}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status.kind === "failure" && (
        <div className="mb-7 rounded-xl bg-[#fff7ed] p-4 text-[14px] text-[#7c2d12] ring-1 ring-[#fed7aa]">
          <h3 ref={resultRef} tabIndex={-1} className="font-semibold outline-none">
            {copy.failure.title}
          </h3>
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

      <div className="grid gap-5 sm:grid-cols-2">
        {text("restaurant", f.restaurant, { autoComplete: "organization" })}
        {text("contact", f.contact, { autoComplete: "name" })}
        {text("phone", f.phone, { type: "tel", autoComplete: "tel", inputMode: "tel" })}
        {text("email", f.email, { type: "email", autoComplete: "email", inputMode: "email" })}
        <div className="sm:col-span-2">
          {text("website", f.website, { type: "url", autoComplete: "url", inputMode: "url", hint: f.websiteHint, optional: noWebsite, disabled: noWebsite })}
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2.5 text-[14px] text-[#2b3442]">
            <input
              type="checkbox"
              checked={noWebsite}
              onChange={(e) => {
                setNoWebsite(e.target.checked);
                if (errors.website) setErrors((er) => ({ ...er, website: undefined }));
              }}
              className="size-[18px] accent-[#0000ff]"
            />
            {f.noWebsite}
          </label>
        </div>
        <div className="sm:col-span-2">
          {text("location", f.location, { autoComplete: "address-level2", hint: f.locationHint })}
        </div>
      </div>

      <fieldset className="mt-7" aria-describedby={describedBy("services", true)} aria-invalid={errors.services ? true : undefined}>
        <legend id={id("services-legend")} tabIndex={-1} className={cn("text-[14px] font-semibold outline-none", INK)}>
          {f.services} <span className="font-normal text-[#5b6472]">({f.required})</span>
        </legend>
        <p id={id("services-hint")} className={cn("mt-1 text-[13px]", MUTED)}>
          {f.servicesHint}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {SERVICE_IDS.map((s) => {
            const on = services.includes(s);
            return (
              <label
                key={s}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] ring-1 ring-inset transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
                  on ? "bg-brand-50 text-[#0b1530] ring-primary" : "bg-white text-[#2b3442] ring-black/15 hover:ring-black/25",
                )}
              >
                <input type="checkbox" name="services" value={s} checked={on} onChange={() => toggleService(s)} className="size-[18px] shrink-0 accent-[#0000ff]" />
                {copy.services[s]}
              </label>
            );
          })}
        </div>
        {errors.services && <FieldError id={id("services-error")}>{errors.services}</FieldError>}
      </fieldset>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id("plan")} className={cn("text-[14px] font-semibold", INK)}>
            {f.plan} <span className="font-normal text-[#5b6472]">({f.optional})</span>
          </label>
          <div className="relative">
          <select
              id={id("plan")}
              name="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value as RestaurantPlanId | "")}
              className={cn(input, "appearance-none pr-10")}
            >
              <option value="">{f.planNone}</option>
              {restaurantPlans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <svg viewBox="0 0 20 20" aria-hidden="true" className="pointer-events-none absolute right-4 bottom-4 size-5 text-[#5b6472]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 8 4 4 4-4" />
            </svg>
          </div>
        </div>
        <fieldset>
          <legend className={cn("text-[14px] font-semibold", INK)}>{f.language}</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["en", "es"] as const).map((l) => (
              <label
                key={l}
                className={cn(
                  "flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl text-[14px] font-semibold ring-1 ring-inset has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
                  language === l ? "bg-[#0b1530] text-white ring-[#0b1530]" : "bg-white text-[#2b3442] ring-black/15",
                )}
              >
                <input type="radio" name="language" value={l} checked={language === l} onChange={() => setLanguage(l)} className="sr-only" />
                {copy.languages[l]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-7">
        <label htmlFor={id("message")} className={cn("text-[14px] font-semibold", INK)}>
          {f.message} <span className="font-normal text-[#5b6472]">({f.optional})</span>
        </label>
        <p id={id("message-hint")} className={cn("mt-1 text-[13px]", MUTED)}>
          {f.messageHint}
        </p>
        <textarea
          id={id("message")}
          name="message"
          rows={4}
          maxLength={1500}
          value={values.message}
          onChange={set("message")}
          aria-describedby={id("message-hint")}
          className={cn(input, "h-auto py-3")}
        />
      </div>

      {/* Honeypot: invisible to people and assistive tech, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("company_site")}>Company website</label>
        <input id={id("company_site")} name="company_site" tabIndex={-1} autoComplete="off" value={values.company_site} onChange={set("company_site")} />
      </div>

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 text-body font-semibold text-white transition-colors duration-fast hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-80"
      >
        {status.kind === "sending" && (
          <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-[#ffffff66] border-t-[#fff]" />
        )}
        {status.kind === "sending" ? copy.sending : copy.submit}
      </button>
      <p aria-live="polite" className="sr-only">
        {status.kind === "sending" ? copy.sending : ""}
      </p>
      <p className={cn("mt-4 text-center text-[13px] leading-[1.5]", MUTED)}>
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
