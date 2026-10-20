import type { Metadata } from "next";
import { serviceHealth } from "@/lib/server/admin";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { Pill, fmtDate } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Service health" };
export const dynamic = "force-dynamic";

function uptime(s: number) {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d ? `${d}d ` : ""}${h}h ${m}m`;
}

export default async function AdminHealth() {
  const h = await serviceHealth();
  const rows: Array<[string, React.ReactNode, React.ReactNode]> = [
    ["Database (Postgres)", h.db.ok ? <Pill tone="ok">OK</Pill> : <Pill tone="bad">Down</Pill>, h.db.ok ? `SELECT 1 in ${h.db.ms} ms` : h.db.error],
    ["Object storage", h.storage.ok ? <Pill tone="ok">OK</Pill> : <Pill tone="bad">Failing</Pill>, `${h.storage.driver === "s3" ? "S3-compatible" : "Local disk"} (${h.storage.location}) · write/read/delete probe ${h.storage.ms} ms${h.storage.error ? ` · ${h.storage.error}` : ""}`],
    ["Redis (rate limits)", h.redis.configured ? <Pill tone="ok">Configured</Pill> : <Pill tone="warn">Not configured</Pill>, h.redis.configured ? "Shared limits across replicas" : "In-process limits — correct only for a single replica"],
    ["Email (Resend)", h.email.resendConfigured ? <Pill tone="ok">Configured</Pill> : <Pill tone="warn">Not configured</Pill>, h.email.resendConfigured ? `From ${h.email.from}` : "Emails are LOGGED to the database, not delivered"],
    ["Events, last hour", <span key="e" className="tabular-nums">{h.eventsHour}</span>, "Views + clicks recorded"],
    ["Runtime", <span key="n">{h.node}</span>, `${h.env} · process uptime ${uptime(h.uptimeSec)}`],
  ];
  return (
    <>
      <PageHeader title="Service health" description={`Checked live at ${fmtDate(new Date())}. Reload to re-run the probes.`} />
      <Body>
        <div className="card overflow-x-auto">
          <table className="w-full text-small" aria-label="Service health">
            <tbody className="divide-y divide-line">
              {rows.map(([name, status, detail]) => (
                <tr key={name}>
                  <th scope="row" className="px-4 py-3 text-left font-semibold text-fg">
                    {name}
                  </th>
                  <td className="px-4 py-3" data-health={name}>
                    {status}
                  </td>
                  <td className="px-4 py-3 text-fg-secondary">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <section className="card mt-6 p-5">
          <h2 className="text-h4 font-semibold">Recent failed emails</h2>
          {h.failedEmails.length ? (
            <ul className="mt-3 divide-y divide-line text-small">
              {h.failedEmails.map((e) => (
                <li key={e.id} className="py-2">
                  <p className="font-semibold text-fg">
                    {e.subject} → {e.to}
                  </p>
                  <p className="text-error">{e.error}</p>
                  <p className="text-[12px] text-fg-muted">{fmtDate(e.createdAt)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-small text-fg-muted">None.</p>
          )}
        </section>
      </Body>
    </>
  );
}
