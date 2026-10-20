"use client";

import { useActionState } from "react";
import { forgotPasswordAction, type FormState } from "@/lib/actions/auth";
import { Field, Input, Notice } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function ForgotForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(forgotPasswordAction, {});
  if (state.ok) return <Notice tone="success">{state.ok}</Notice>;
  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Email" htmlFor="email" error={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" defaultValue={state.values?.email} required />
      </Field>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
