import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/server/auth";
import { ResendForm } from "./resend-form";
import { logoutAction } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "Confirm your email" };

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser("/verify-email");
  if (user.emailVerifiedAt) redirect("/dashboard");
  const { error } = await searchParams;
  return (
    <>
      <div aria-hidden="true" className="mb-6 grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      </div>
      <h1 className="text-h3 font-semibold">Check your inbox</h1>
      <p className="mt-3 text-body">
        We sent a confirmation link to <strong className="text-fg">{user.email}</strong>. Click it to confirm your email — you can start building right away, and you&apos;ll need a confirmed email to publish.
      </p>
      {error ? <p className="mt-4 rounded-sm bg-error-soft px-4 py-3 text-small text-error">That link is invalid or has expired. Send a new one below.</p> : null}
      <div className="mt-8 flex flex-col gap-3">
        <ResendForm />
        <Link href="/dashboard" className="text-center text-small font-semibold text-primary hover:underline">
          Continue to the dashboard
        </Link>
        <form action={logoutAction} className="text-center">
          <button className="text-small text-fg-muted hover:underline">Use a different account</button>
        </form>
      </div>
    </>
  );
}
