"use client";

import { useActionState } from "react";
import { reportPageAction } from "@/lib/actions/report";
import { REPORT_REASONS } from "@/lib/bio/report-reasons";
import type { FormState } from "@/lib/actions/auth";
import { Field, Input, Notice, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function ReportForm({ pageId }: { pageId: string }) {
  const [s, action, pending] = useActionState<FormState, FormData>(reportPageAction, {});
  if (s.ok) return <Notice tone="success">{s.ok}</Notice>;
  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="pageId" value={pageId} />
      {s.error ? <Notice tone="error">{s.error}</Notice> : null}
      <Field label="Reason" htmlFor="reason">
        <Select id="reason" name="reason" required defaultValue="">
          <option value="" disabled>
            Choose a reason
          </option>
          {REPORT_REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </Select>
      </Field>
      <Field label="Details (optional)" htmlFor="details">
        <Textarea id="details" name="details" maxLength={3000} placeholder="What's wrong, and where on the page?" />
      </Field>
      <Field label="Your email (optional)" htmlFor="email" error={s.fieldErrors?.email} hint="Only if you'd like us to follow up.">
        <Input id="email" name="email" type="email" autoComplete="email" />
      </Field>
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Sending…" : "Send report"}
      </Button>
    </form>
  );
}
