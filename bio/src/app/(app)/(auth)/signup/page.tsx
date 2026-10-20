import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ssoEnabled } from "@/lib/server/sso";
import { SsoButton } from "@/components/ui/sso-button";
import { getUser } from "@/lib/server/auth";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Create your free bio" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string; template?: string; username?: string }> }) {
  const { next, template, username } = await searchParams;
  const claim = username ? `username=${encodeURIComponent(username.toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 30))}` : "";
  if (await getUser()) redirect(template ? `/dashboard/new?template=${encodeURIComponent(template)}${claim ? `&${claim}` : ""}` : claim ? `/dashboard/new?${claim}` : "/dashboard");
  const after = template ? `/dashboard/new?template=${encodeURIComponent(template)}${claim ? `&${claim}` : ""}` : claim ? `/dashboard/new?${claim}` : (next ?? "/dashboard/new");
  return (
    <>
      <h1 className="text-h3 font-semibold">Create your free bio</h1>
      <p className="mt-2 text-body text-fg-muted">{username ? <>Let&apos;s claim <strong className="text-fg">{claim.slice(9) || username}</strong> — free forever, no credit card.</> : "Free forever. No credit card."}</p>
      {ssoEnabled() ? <SsoButton next={after} /> : null}
      <div className="mt-8">
        <SignupForm next={after} />
      </div>
      <p className="mt-6 text-small text-fg-muted">
        Already have an account?{" "}
        <Link className="font-semibold text-primary hover:underline" href={`/login?next=${encodeURIComponent(after)}`}>
          Log in
        </Link>
      </p>
    </>
  );
}
