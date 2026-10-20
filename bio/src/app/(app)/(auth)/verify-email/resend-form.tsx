"use client";

import { useActionState } from "react";
import { resendVerificationAction, type FormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/field";

export function ResendForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(async () => resendVerificationAction(), {});
  return (
    <form action={action} className="flex flex-col gap-3">
      {state.ok ? <Notice tone="success">{state.ok}</Notice> : null}
      {state.error ? <Notice tone="error">{state.error}</Notice> : null}
      <Button type="submit" variant="secondary" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Resend the link"}
      </Button>
    </form>
  );
}
