"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type FormState } from "@/lib/actions/auth";
import { Field, Input, Notice } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});
  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />
      {state.error ? <Notice tone="error">{state.error}</Notice> : null}
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" defaultValue={state.values?.email} required />
      </Field>
      <Field
        label={
          <span className="flex justify-between">
            Password
            <Link href="/forgot-password" className="font-normal text-primary hover:underline">
              Forgot password?
            </Link>
          </span>
        }
        htmlFor="password"
      >
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
