"use client";

import { useEffect, useRef, useState } from "react";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ABUSE_TYPES, CSAM_TYPE, FORM, IP_TYPE } from "../_content";
import { AbuseIcon } from "./abuse-icon";

type Status =
  | { kind: "idle" | "sending" }
  | { kind: "sent"; reference: string | null }
  | { kind: "failed"; message: string };

const MAX_FILES = 5;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const FILE_TYPES = /\.(pdf|jpe?g|png|webp|txt|eml)$/i;

function size(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * The two-step abuse wizard.
 *
 * STEP 1 is the abuse type alone; STEP 2 is the details. The split is
 * load-bearing: the type decides which fields are required, because an
 * intellectual-property notice needs statutory elements (the work, the
 * infringing material, capacity, a signature) that a phishing report does not.
 *
 * Step 1 is a native radio group styled as cards, so arrow keys, form
 * semantics and screen readers all work without ARIA re-implementation.
 *
 * Evidence files are held in state and written back to the <input> with a
 * DataTransfer, so people can add files in several goes and remove one, and
 * the limits the API enforces (5 × 2 MB, fixed types) are checked before the
 * upload instead of after it.
 *
 * It POSTs to /api/report-abuse, which emails the report (files attached) to
 * the abuse inbox with Reply-To set to the reporter.
 */
export function AbuseForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState("");
  const isIp = type === IP_TYPE;
  const isCsam = type === CSAM_TYPE;
  const chosen = ABUSE_TYPES.find((t) => t.value === type);

  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  /* Measured from when the form appeared, for the server's minimum fill time. */
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  /* Move focus to the new step's heading so keyboard and screen-reader users
     land at the top of what just changed, not on a vanished button. */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
    heading.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step, status.kind]);

  /* Keep the real <input type=file> in sync with the list, so FormData sends exactly what is shown. */
  useEffect(() => {
    if (!fileInput.current) return;
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    fileInput.current.files = dt.files;
  }, [files, step]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const bad = incoming.filter((f) => f.size > MAX_FILE_BYTES || !FILE_TYPES.test(f.name));
    const good = incoming.filter((f) => !bad.includes(f));
    const merged = [...files];
    for (const f of good) if (!merged.some((m) => m.name === f.name && m.size === f.size)) merged.push(f);
    const over = merged.length > MAX_FILES;
    setFiles(merged.slice(0, MAX_FILES));
    setFileError(
      bad.length || over
        ? `${bad.length ? `Not added: ${bad.map((f) => f.name).join(", ")}. ` : ""}${FORM.errors.files}`
        : "",
    );
  }

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    setStatus({ kind: "sending" });
    const data = new FormData(e.currentTarget);
    data.set("abuseType", type);
    data.set("elapsed", String(Date.now() - startedAt.current));
    data.delete("attachments[]");
    files.forEach((f) => data.append("attachments[]", f));
    try {
      const res = await fetch("/api/report-abuse", { method: "POST", body: data });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string | null; reason?: string };
      if (res.ok && json.ok) return setStatus({ kind: "sent", reference: json.reference ?? null });
      const reason = json.reason ?? "";
      setStatus({
        kind: "failed",
        message:
          reason === "rate_limited" ? FORM.errors.rateLimited
          : reason === "too_large" || reason === "bad_file" || reason === "too_many_files" ? FORM.errors.files
          : reason === "invalid" ? FORM.errors.invalid
          : FORM.errors.failed,
      });
    } catch {
      setStatus({ kind: "failed", message: FORM.errors.failed });
    }
  }

  function reset() {
    setType("");
    setFiles([]);
    setFileError("");
    setStep(1);
    setStatus({ kind: "idle" });
    startedAt.current = Date.now();
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-2xl bg-surface p-8 text-center ring-1 ring-inset ring-line md:p-12">
        <span aria-hidden="true" className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h2 ref={heading} tabIndex={-1} className="mt-5 text-[24px] leading-8 font-semibold tracking-[-0.2px] text-fg outline-none">
          {FORM.success.title}
        </h2>
        <p className="mx-auto mt-2 max-w-[480px] text-body text-fg-secondary">{FORM.success.body}</p>
        {status.reference && (
          <div className="mx-auto mt-6 inline-flex flex-col items-center gap-1 rounded-xl bg-canvas-secondary px-6 py-4">
            <span className="text-[13px] leading-5 text-fg-muted">{FORM.success.reference}</span>
            <strong className="font-mono text-[18px] tracking-wide text-fg">{status.reference}</strong>
            <span className="text-[13px] leading-5 text-fg-muted">{FORM.success.keep}</span>
          </div>
        )}
        <div className="mt-8">
          <Button type="button" variant="secondary" onClick={reset}>
            {FORM.success.another}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-surface ring-1 ring-inset ring-line">
      {/* Progress */}
      <ol className="flex border-b border-line" aria-label="Progress">
        {FORM.steps.map((label, i) => {
          const n = (i + 1) as 1 | 2;
          const done = step > n;
          const current = step === n;
          return (
            <li
              key={label}
              aria-current={current ? "step" : undefined}
              className={`relative flex flex-1 items-center gap-3 px-5 py-4 md:px-8 ${current ? "text-fg" : "text-fg-muted"}`}
            >
              <span
                aria-hidden="true"
                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
                  current || done ? "bg-primary text-white" : "bg-canvas-secondary text-fg-muted"
                }`}
              >
                {done ? (
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                ) : (
                  n
                )}
              </span>
              <span className="text-small font-semibold">
                <span className="sr-only">Step {n} of 2: </span>
                {label}
              </span>
              {current && <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
            </li>
          );
        })}
      </ol>

      <form onSubmit={send} className="flex flex-col gap-8 p-5 md:p-8">
        {/* Honeypot: invisible to people and assistive tech. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Fax number
            <input name="fax_number" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        {step === 1 ? (
          <>
            <fieldset>
              <legend className="contents">
                <h2 ref={heading} tabIndex={-1} className="text-[22px] leading-8 font-semibold tracking-[-0.2px] text-fg outline-none">
                  {FORM.step1.title}
                </h2>
              </legend>
              <p className="mt-1 text-small text-fg-secondary">{FORM.step1.lede}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {ABUSE_TYPES.map((t) => {
                  const on = type === t.value;
                  return (
                    <label
                      key={t.value}
                      className={`group relative flex min-h-[76px] cursor-pointer items-start gap-3.5 rounded-xl p-4 ring-1 ring-inset transition-[box-shadow,background-color] duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                        on ? "bg-primary-soft ring-2 ring-primary" : "bg-surface ring-line hover:ring-line-strong hover:bg-canvas-secondary"
                      }`}
                    >
                      <input
                        type="radio"
                        name="abuseType"
                        value={t.value}
                        checked={on}
                        onChange={() => setType(t.value)}
                        required
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          on ? "bg-primary text-white" : "bg-canvas-secondary text-fg-secondary group-hover:text-fg"
                        }`}
                      >
                        <AbuseIcon name={t.icon} className="size-5" />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-[15px] leading-6 font-semibold text-fg">{t.short}</span>
                        <span className="text-small leading-5 text-fg-muted">{t.hint}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
              <p className="text-small text-fg-muted" aria-live="polite">
                {chosen ? (
                  <>
                    Selected: <span className="font-semibold text-fg">{chosen.short}</span>
                  </>
                ) : (
                  "Pick one to continue."
                )}
              </p>
              <Button type="button" size="lg" disabled={!type} onClick={() => setStep(2)}>
                {FORM.step1.next}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <h2 ref={heading} tabIndex={-1} className="text-[22px] leading-8 font-semibold tracking-[-0.2px] text-fg outline-none">
                {FORM.step2.title}
              </h2>
              <p className="mt-1 text-small text-fg-secondary">{FORM.step2.lede}</p>

              {/* The chosen type stays visible: it drives what is required below. */}
              {chosen && (
                <div className="mt-5 flex items-center gap-3 rounded-xl bg-canvas-secondary p-3 pr-4">
                  <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                    <AbuseIcon name={chosen.icon} className="size-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1 text-small">
                    <span className="block text-fg-muted">Reporting</span>
                    <span className="block font-semibold text-fg">{chosen.short}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="min-h-11 rounded-md px-2 text-small font-semibold text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {FORM.step2.change}
                    <span className="sr-only"> abuse type</span>
                  </button>
                </div>
              )}
            </div>

            {isCsam && (
              <div role="note" className="rounded-xl border-l-4 border-error bg-error-soft p-5">
                <p className="text-body font-semibold text-fg">{FORM.csam.title}</p>
                <p className="mt-1.5 text-small text-fg-secondary">
                  {FORM.csam.body}{" "}
                  <a
                    href={FORM.csam.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline underline-offset-4 hover:text-primary-hover"
                  >
                    {FORM.csam.link.label}
                  </a>
                </p>
              </div>
            )}

            <fieldset className="flex flex-col gap-5">
              <legend className="mb-4 text-caption font-semibold tracking-[0.06em] text-fg-muted uppercase">{FORM.sections.abuse}</legend>
              <Field name="target" label={FORM.fields.target} description={FORM.fields.targetHint} required>
                <Textarea name="target" rows={2} placeholder={FORM.fields.targetPlaceholder} hasDescription required />
              </Field>
              <Field name="description" label={FORM.fields.description} description={FORM.fields.descriptionHint} required>
                <Textarea name="description" rows={6} hasDescription required />
              </Field>

              {/* Evidence */}
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <span id="evidence-label" className="text-small font-medium text-fg">{FORM.upload.title}</span>
                  <span className="text-[13px] leading-5 text-fg-muted">{FORM.upload.optional}</span>
                </div>
                <label
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    addFiles(e.dataTransfer.files);
                  }}
                  className="mt-1.5 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line-strong bg-canvas-secondary px-6 py-7 text-center transition-colors hover:border-primary hover:bg-primary-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 text-primary" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 15.5v-10M8 9.5l4-4 4 4M4.5 15v2.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V15" />
                  </svg>
                  <span className="text-small font-semibold text-primary">
                    {FORM.upload.browse}
                    <span className="font-normal text-fg-secondary"> or drag them here</span>
                  </span>
                  <span className="max-w-[420px] text-[13px] leading-5 text-fg-muted">{FORM.upload.hint}</span>
                  <input
                    ref={fileInput}
                    type="file"
                    name="attachments[]"
                    multiple
                    aria-labelledby="evidence-label"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.txt,.eml"
                    onChange={(e) => {
                      addFiles(e.target.files);
                    }}
                    className="sr-only"
                  />
                </label>
                {fileError && (
                  <p role="alert" className="mt-2 text-small text-error">{fileError}</p>
                )}
                {files.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-2">
                    {files.map((f) => (
                      <li key={f.name + f.size} className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2 ring-1 ring-inset ring-line">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13.5 3.5h-6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-10l-5-5Z" />
                          <path d="M13.5 3.5v5h5" />
                        </svg>
                        <span className="min-w-0 flex-1 truncate text-small text-fg">{f.name}</span>
                        <span className="shrink-0 text-[13px] leading-5 text-fg-muted">{size(f.size)}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFiles(files.filter((x) => x !== f));
                            setFileError("");
                          }}
                          className="flex size-9 shrink-0 items-center justify-center rounded-md text-fg-muted hover:bg-canvas-secondary hover:text-fg focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          <span className="sr-only">{FORM.upload.remove} {f.name}</span>
                          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="m6 6 12 12M18 6 6 18" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </fieldset>

            {/* Statutory fields, shown only for an IP notice. A phishing report does not need a signature. */}
            {isIp && (
              <fieldset className="flex flex-col gap-5 rounded-xl bg-canvas-secondary p-5 md:p-6">
                <legend className="sr-only">{FORM.sections.dmca}</legend>
                <div aria-hidden="true" className="text-caption font-semibold tracking-[0.06em] text-fg-muted uppercase">
                  {FORM.sections.dmca}
                </div>
                <p className="-mt-2 text-small text-fg-secondary">{FORM.dmca.note}</p>
                <Field name="work" label={FORM.dmca.work} required>
                  <Textarea name="work" rows={3} required />
                </Field>
                <Field name="infringing" label={FORM.dmca.infringing} required>
                  <Textarea name="infringing" rows={3} required />
                </Field>

                <fieldset>
                  <legend className="text-small font-medium text-fg">
                    {FORM.dmca.capacity}
                    <span aria-hidden="true" className="ml-0.5 text-error">*</span>
                  </legend>
                  <div className="mt-2 flex flex-col gap-2">
                    {[FORM.dmca.owner, FORM.dmca.agent].map((label) => (
                      <label key={label} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg bg-surface p-3 text-small text-fg ring-1 ring-inset ring-line has-[:checked]:ring-2 has-[:checked]:ring-primary">
                        <input type="radio" name="capacity" value={label} required className="mt-0.5 size-4 shrink-0 accent-primary" />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <Field name="signature" label={FORM.dmca.signature} description={FORM.dmca.signatureHint} required>
                  <Input name="signature" autoComplete="name" hasDescription required />
                </Field>
              </fieldset>
            )}

            <fieldset className="flex flex-col gap-5">
              <legend className="mb-4 text-caption font-semibold tracking-[0.06em] text-fg-muted uppercase">{FORM.sections.you}</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="reporterName" label={FORM.fields.name} required>
                  <Input name="reporterName" autoComplete="name" required />
                </Field>
                <Field name="reporterEmail" label={FORM.fields.email} description={FORM.fields.emailHint} required>
                  <Input name="reporterEmail" type="email" autoComplete="email" hasDescription required />
                </Field>
                <Field name="org" label={FORM.fields.org}>
                  <Input name="org" autoComplete="organization" />
                </Field>
                <Field name="country" label={FORM.fields.country}>
                  <Input name="country" autoComplete="country-name" />
                </Field>
              </div>
            </fieldset>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-canvas-secondary p-4 text-small leading-6 text-fg">
              <input type="checkbox" name="declaration" required className="mt-1 size-4 shrink-0 accent-primary" />
              {FORM.declaration}
            </label>

            {status.kind === "failed" && (
              <p role="alert" className="rounded-xl bg-error-soft p-4 text-small text-error">
                {status.message}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)}>
                {FORM.back}
              </Button>
              <Button type="submit" size="lg" disabled={status.kind === "sending"}>
                {status.kind === "sending" ? FORM.sending : FORM.send}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
