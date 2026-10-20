import type { Metadata } from "next";
import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { DeleteAccountForm, PasswordForm, ProfileForm } from "@/components/dashboard/settings-forms";
import { revokeOtherSessionsAction, revokeSessionAction } from "@/lib/actions/account";

export const metadata: Metadata = { title: "Account Settings" };

function device(ua: string) {
  const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac OS X/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : /Linux/.test(ua) ? "Linux" : "Unknown OS";
  const br = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  return `${br} on ${os}`;
}

export default async function SettingsPage() {
  const user = await requireUser("/dashboard/settings");
  const sessions = await db.session.findMany({ where: { userId: user.id, expiresAt: { gt: new Date() } }, orderBy: { lastSeenAt: "desc" } });
  return (
    <>
      <PageHeader title="Account Settings" />
      <Body>
        <div className="grid max-w-3xl gap-6">
          <section className="card p-6">
            <h2 className="text-h4 font-semibold">Profile</h2>
            <div className="mt-4">
              <ProfileForm name={user.name} email={user.email} marketing={user.marketingConsent} />
            </div>
          </section>
          <section className="card p-6">
            <h2 className="text-h4 font-semibold">Password</h2>
            <div className="mt-4">
              <PasswordForm />
            </div>
          </section>
          <section className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-h4 font-semibold">Signed-in devices</h2>
              {sessions.length > 1 ? (
                <form action={revokeOtherSessionsAction}>
                  <button className="text-small font-semibold text-primary hover:underline">Sign out all other devices</button>
                </form>
              ) : null}
            </div>
            <ul className="mt-4 divide-y divide-line">
              {sessions.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-3 text-small">
                  <div>
                    <p className="font-semibold text-fg">
                      {device(s.userAgent)} {s.id === user.sessionId ? <span className="ml-1 rounded-full bg-success-soft px-2 py-0.5 text-[11px] text-success">This device</span> : null}
                    </p>
                    <p className="text-fg-muted">Last active {s.lastSeenAt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p>
                  </div>
                  {s.id !== user.sessionId ? (
                    <form
                      action={async () => {
                        "use server";
                        await revokeSessionAction(s.id);
                      }}
                    >
                      <button className="text-fg-muted hover:text-error">Sign out</button>
                    </form>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
          <section className="card p-6">
            <h2 className="text-h4 font-semibold">Privacy &amp; your data</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-small text-fg-secondary">
              <li>Visitor analytics on your pages are cookieless. We store a daily-rotating hash, never IP addresses.</li>
              <li>Leads are visible only to you and are stored with the consent text the visitor agreed to.</li>
              <li>We never sell your data or your visitors&apos; data.</li>
            </ul>
            <a href="/api/account/export" download className="btn mt-4 h-10 px-4 text-small text-fg ring-1 ring-line hover:bg-canvas-secondary">
              Download my data (JSON)
            </a>
          </section>
          <section className="card p-6 ring-error/30">
            <h2 className="text-h4 font-semibold text-error">Delete account</h2>
            <div className="mt-4">
              <DeleteAccountForm />
            </div>
          </section>
        </div>
      </Body>
    </>
  );
}
