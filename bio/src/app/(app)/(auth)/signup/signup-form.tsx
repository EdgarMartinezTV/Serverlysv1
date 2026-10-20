"use client";

import { useActionState } from "react";
import { signupAction, type FormState } from "@/lib/actions/auth";
import { Field, Input, Notice } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function SignupForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(signupAction, {});
  const fe = state.fieldErrors ?? {};
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next} />
      {state.error ? <Notice tone="error">{state.error}</Notice> : null}
      <Field label="Name" htmlFor="name" error={fe.name}>
        <Input id="name" name="name" autoComplete="name" defaultValue={state.values?.name} aria-invalid={!!fe.name} required />
      </Field>
      <Field label="Email" htmlFor="email" error={fe.email}>
        <Input id="email" name="email" type="email" autoComplete="email" defaultValue={state.values?.email} aria-invalid={!!fe.email} required />
      </Field>
      <Field label="Password" htmlFor="password" error={fe.password} hint="At least 10 characters.">
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={10} aria-invalid={!!fe.password} required />
      </Field>
      <div className="flex flex-col gap-3 text-small">
        <label className="flex items-start gap-3">
          <input type="checkbox" name="terms" className="mt-1 size-4 accent-primary" required />
          <span>
            I agree to the{" "}
            <a className="text-primary underline" href="https://serverlys.com/terms-of-service" target="_blank" rel="noreferrer">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="https://serverlys.com/privacy-policy" target="_blank" rel="noreferrer">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {fe.terms ? <p className="text-error" role="alert">{fe.terms}</p> : null}
        <label className="flex items-start gap-3">
          <input type="checkbox" name="marketing" className="mt-1 size-4 accent-primary" />
          <span>Send me occasional product news from Serverlys (optional).</span>
        </label>
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
