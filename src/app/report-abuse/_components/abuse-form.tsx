"use client";

import { useEffect, useRef, useState } from "react";
import { Field } from "@/components/ui/field";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ABUSE_TYPES, FORM, IP_TYPE } from "../_content";

type Status =
  | { kind: "idle" | "sending" }
  | { kind: "sent"; reference: string | null }
  | { kind: "failed"; message: string };

/**
 * The reference's two-step abuse wizard, rebuilt.
 *
 * STEP 1 is the abuse type alone; STEP 2 is the details. That split is the
 * reference's and it is load-bearing rather than cosmetic: the type decides
 * which fields are required, because an intellectual-property notice needs
 * statutory elements (the work, the infringing material, capacity, a
 * signature) that a phishing report does not. Asking everyone for those would
 * be wrong, and asking nobody would make DMCA notices unactionable.
 *
 * It POSTs to /api/report-abuse, which emails the report (and the evidence
 * files as attachments) to the abuse inbox with Reply-To set to the reporter.
 * It used to post to WHMCS submitticket.php, which rejects anyone not logged
 * in because WHMCS requires login for tickets; reporters are rarely clients.
 */
export function AbuseForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState("");
  const isIp = type === IP_TYPE;

  const [status, setStatus] = useState<Status>({ kind: "idle" });
  /* Measured from when the form appeared, for the server's minimum fill time. */
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    setStatus({ kind: "sending" });
    const data = new FormData(e.currentTarget);
    data.set("abuseType", type);
    data.set("elapsed", String(Date.now() - startedAt.current));
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

  if (status.kind === "sent") {
    return (
      <div role="status" className="mx-auto mt-10 w-full max-w-[700px] rounded-2xl bg-canvas-secondary p-8 text-center">
        <h2 className="text-[20px] leading-7 font-semibold text-fg">{FORM.success.title}</h2>
        <p className="mt-2 text-body text-fg-secondary">{FORM.success.body}</p>
        {status.reference && (
          <p className="mt-4 text-small text-fg-muted">
            {FORM.success.reference}: <strong className="font-mono text-fg">{status.reference}</strong>
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={send}
      noValidate={false}
      className="mx-auto mt-10 flex w-full max-w-[700px] flex-col gap-6"
    >
      {/* Honeypot: invisible to people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Fax number
          <input name="fax_number" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {step === 1 ? (
        <>
          <Field name="abuseType" label={FORM.step1.label} required>
            <Select
              name="abuseType"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="" disabled>
                {FORM.step1.placeholder}
              </option>
              {ABUSE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </Field>

          <div>
            <Button type="button" size="lg" disabled={!type} onClick={() => setStep(2)}>
              {FORM.step1.next}
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* The chosen type stays visible — it drives what is required below. */}
          <p className="text-small text-fg-muted">
            {FORM.step1.label}: <span className="font-semibold text-fg">{type}</span>
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field name="reporterName" label={FORM.fields.name} required>
              <Input name="reporterName" autoComplete="name" required />
            </Field>
            <Field name="org" label={FORM.fields.org}>
              <Input name="org" autoComplete="organization" />
            </Field>
            <Field name="reporterEmail" label={FORM.fields.email} required>
              <Input name="reporterEmail" type="email" autoComplete="email" required />
            </Field>
            <Field name="country" label={FORM.fields.country}>
              <Input name="country" autoComplete="country-name" />
            </Field>
          </div>

          <Field
            name="target"
            label={FORM.fields.target}
            description={FORM.fields.targetPlaceholder}
            required
          >
            <Textarea name="target" rows={3} hasDescription required />
          </Field>

          <Field name="description" label={FORM.fields.description} required>
            <Textarea name="description" rows={6} required />
          </Field>

          <div className="rounded-2xl bg-canvas-secondary p-6">
            <h2 className="text-[20px] leading-7 font-semibold tracking-[-0.1px] text-fg">
              {FORM.upload.title}
            </h2>
            <p className="mt-1 text-small text-fg-muted">{FORM.upload.hint}</p>
            <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-md border border-primary px-4 text-[16px] font-semibold text-primary hover:bg-primary-soft">
              {FORM.upload.browse}
              <input
                type="file"
                name="attachments[]"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.webp,.txt,.eml"
                className="sr-only"
              />
            </label>
          </div>

          {/* Statutory fields, shown only for an IP notice — as on the
              reference. A phishing report does not need a signature. */}
          {isIp && (
            <div className="flex flex-col gap-6 rounded-2xl bg-canvas-secondary p-6">
              <Field name="work" label={FORM.dmca.work} required>
                <Textarea name="work" rows={3} required />
              </Field>
              <Field name="infringing" label={FORM.dmca.infringing} required>
                <Textarea name="infringing" rows={3} required />
              </Field>

              <fieldset>
                <legend className="text-small font-semibold text-fg">
                  {FORM.dmca.capacity}
                </legend>
                <div className="mt-3 flex flex-col gap-3">
                  {[FORM.dmca.owner, FORM.dmca.agent].map((label) => (
                    <label key={label} className="flex items-start gap-3 text-small text-fg">
                      <input
                        type="radio"
                        name="capacity"
                        value={label}
                        required
                        className="mt-0.5 size-4 shrink-0 accent-primary"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field name="signature" label={FORM.dmca.signature} required>
                <Input name="signature" required />
              </Field>
            </div>
          )}

          <label className="flex items-start gap-3 text-small text-fg">
            <input
              type="checkbox"
              name="declaration"
              required
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />
            {FORM.declaration}
          </label>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)}>
              {FORM.back}
            </Button>
            <Button type="submit" size="lg" disabled={status.kind === "sending"}>
              {status.kind === "sending" ? FORM.sending : FORM.send}
            </Button>
          </div>

          {status.kind === "failed" && (
            <p role="alert" className="rounded-xl bg-error-soft p-4 text-small text-error">
              {status.message}
            </p>
          )}
        </>
      )}
    </form>
  );
}
