import type { Metadata } from "next";
import Link from "next/link";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-h3 font-semibold">Reset your password</h1>
      <p className="mt-2 text-body text-fg-muted">We&apos;ll email you a link to choose a new one.</p>
      <div className="mt-8">
        <ForgotForm />
      </div>
      <p className="mt-6 text-small">
        <Link className="font-semibold text-primary hover:underline" href="/login">
          Back to log in
        </Link>
      </p>
    </>
  );
}
