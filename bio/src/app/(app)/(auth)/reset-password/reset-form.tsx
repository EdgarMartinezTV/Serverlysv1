"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPasswordAction, type FormState } from "@/lib/actions/auth";
import { Field, Input, Notice } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(resetPasswordAction, {});
  const fe = state.fieldErrors ?? {};
  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />
      {state.error ? (
        <Notice tone="error">
          {state.error}{" "}
          <Link href="/forgot-password" className="underline">
            Request a new link
          </Link>
        </Notice>
      ) : null}
      <Field label="New password" htmlFor="password" error={fe.password} hint="At least 10 characters.">
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
      </Field>
      <Field label="Confirm password" htmlFor="confirm" error={fe.confirm}>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
      </Field>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : "Save and log in"}
      </Button>
    </form>
  );
}
