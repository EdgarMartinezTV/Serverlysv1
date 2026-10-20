import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ssoEnabled } from "@/lib/server/sso";
import { SsoButton } from "@/components/ui/sso-button";
import { getUser, safeNext } from "@/lib/server/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; sso_error?: string; deleted?: string }> }) {
  const { next, sso_error, deleted } = await searchParams;
  if (await getUser()) redirect(safeNext(next));
  return (
    <>
      <h1 className="text-h3 font-semibold">Log in</h1>
      <p className="mt-2 text-body text-fg-muted">Welcome back to Serverlys Bio.</p>
      {sso_error ? <p className="mt-4 rounded-sm bg-error-soft px-4 py-3 text-small text-error">{sso_error}</p> : null}
      {deleted ? <p className="mt-4 rounded-sm bg-success-soft px-4 py-3 text-small text-success">Your account and all its data were deleted.</p> : null}
      {ssoEnabled() ? <SsoButton next={safeNext(next)} /> : null}
      <div className="mt-8">
        <LoginForm next={safeNext(next)} />
      </div>
      <p className="mt-6 text-small text-fg-muted">
        New here?{" "}
        <Link className="font-semibold text-primary hover:underline" href="/signup">
          Create your free bio
        </Link>
      </p>
    </>
  );
}
