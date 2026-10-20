import type { Metadata } from "next";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <>
      <h1 className="text-h3 font-semibold">Choose a new password</h1>
      <div className="mt-8">{token ? <ResetForm token={token} /> : <p>This link is missing its token. Request a new reset email.</p>}</div>
    </>
  );
}
