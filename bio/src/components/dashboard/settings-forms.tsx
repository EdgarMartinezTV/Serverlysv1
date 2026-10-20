"use client";

import { useActionState } from "react";
import { changePasswordAction, type FormState } from "@/lib/actions/auth";
import { deleteAccountAction, updateProfileAction } from "@/lib/actions/account";
import { Field, Input, Notice } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function ProfileForm({ name, email, marketing }: { name: string; email: string; marketing: boolean }) {
  const [s, action, pending] = useActionState<FormState, FormData>(updateProfileAction, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      {s.ok ? <Notice tone="success">{s.ok}</Notice> : null}
      <Field label="Name" htmlFor="name" error={s.fieldErrors?.name}>
        <Input id="name" name="name" defaultValue={name} autoComplete="name" />
      </Field>
      <Field label="Email" htmlFor="email" error={s.fieldErrors?.email} hint="Changing it sends a new confirmation link.">
        <Input id="email" name="email" type="email" defaultValue={email} autoComplete="email" />
      </Field>
      <label className="flex items-start gap-3 text-small">
        <input type="checkbox" name="marketing" defaultChecked={marketing} className="mt-1 size-4 accent-primary" />
        <span>Send me occasional product news from Serverlys. (Account and security emails are always sent.)</span>
      </label>
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}

export function PasswordForm() {
  const [s, action, pending] = useActionState<FormState, FormData>(changePasswordAction, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      {s.ok ? <Notice tone="success">{s.ok}</Notice> : null}
      <Field label="Current password" htmlFor="current" error={s.fieldErrors?.current}>
        <Input id="current" name="current" type="password" autoComplete="current-password" />
      </Field>
      <Field label="New password" htmlFor="next" error={s.fieldErrors?.next} hint="At least 10 characters.">
        <Input id="next" name="next" type="password" autoComplete="new-password" />
      </Field>
      <Button type="submit" variant="secondary" disabled={pending} className="w-fit">
        {pending ? "Updating…" : "Change password"}
      </Button>
    </form>
  );
}

export function DeleteAccountForm() {
  const [s, action, pending] = useActionState<FormState, FormData>(deleteAccountAction, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <p className="text-small text-fg-secondary">Deletes your account, every page (they go offline immediately), analytics, leads, domains and uploaded files. This can&apos;t be undone — export your data first if you need it.</p>
      <Field label="Password" htmlFor="del-password" error={s.fieldErrors?.password}>
        <Input id="del-password" name="password" type="password" autoComplete="current-password" />
      </Field>
      <Field label='Type "DELETE" to confirm' htmlFor="del-confirm" error={s.fieldErrors?.confirm}>
        <Input id="del-confirm" name="confirm" autoComplete="off" />
      </Field>
      <Button type="submit" variant="danger" disabled={pending} className="w-fit">
        {pending ? "Deleting…" : "Delete my account"}
      </Button>
    </form>
  );
}
