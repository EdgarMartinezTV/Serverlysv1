"use client";

import { useState } from "react";
import { Field } from "@/components/ui/field";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { billing } from "@/data/company";
import { ABUSE_TYPES, FORM, IP_TYPE } from "../_content";

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
 * It still POSTs to WHMCS `submitticket.php` with `deptid=3`, so reports land
 * in the abuse queue rather than sales — the part of the old page that had to
 * keep working. WHMCS wants one `subject` and one `message`, so `onSubmit`
 * composes the body from the fields just before the native POST goes out.
 * Everything the reporter typed is preserved in that body, labelled.
 *
 * ⚠ The file input is named `attachments[]` and the form is multipart, which
 * is what WHMCS expects — but whether attachments are accepted depends on the
 * install's ticket settings. Verify against the real queue before relying on
 * evidence upload; the text fields work regardless.
 */
export function AbuseForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState("");
  const isIp = type === IP_TYPE;

  /** WHMCS takes one message body, so build it from the fields on submit. */
  function compose(e: React.FormEvent<HTMLFormElement>) {
    const f = e.currentTarget;
    const get = (n: string) =>
      (f.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement | null)?.value?.trim() ?? "";
    const lines = [
      `Abuse type: ${type}`,
      `Reporter: ${get("reporterName")}`,
      get("org") ? `Organisation or role: ${get("org")}` : "",
      `Email: ${get("reporterEmail")}`,
      get("country") ? `Country of residence: ${get("country")}` : "",
      "",
      "Abuser website or service:",
      get("target"),
      "",
      "Description of the issue:",
      get("description"),
    ];
    if (isIp) {
      lines.push(
        "",
        "— Intellectual property notice —",
        `Capacity: ${get("capacity") || "(not stated)"}`,
        "Copyrighted work:",
        get("work"),
        "Infringing material:",
        get("infringing"),
        `Electronic signature: ${get("signature")}`,
      );
    }
    lines.push("", "Declaration accepted: yes");
    const body = f.elements.namedItem("message") as HTMLTextAreaElement;
    /* Drop the empty optionals so the body has no blank label lines. */
    if (body) body.value = lines.filter((l, i) => l !== "" || lines[i - 1] !== "").join("\n");
  }

  return (
    <form
      action={`${billing.root}/submitticket.php`}
      method="POST"
      encType="multipart/form-data"
      onSubmit={compose}
      className="mx-auto mt-10 flex w-full max-w-[700px] flex-col gap-6"
    >
      {/* Abuse department, not sales. Do not change these. */}
      <input type="hidden" name="step" value="3" />
      <input type="hidden" name="deptid" value="3" />
      {/* WHMCS reads these two; `message` is filled by compose() on submit. */}
      <input type="hidden" name="subject" value={`Abuse report: ${type}`} />
      <textarea name="message" defaultValue="" hidden readOnly />

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
            <Button type="submit" size="lg">
              {FORM.send}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
