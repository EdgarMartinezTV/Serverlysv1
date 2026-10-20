import Link from "next/link";
import type { ReactNode } from "react";

export function Flash({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p role="status" className="mb-5 rounded-sm bg-primary-soft px-4 py-3 text-small text-fg" data-admin-flash>
      {msg}
    </p>
  );
}

export function Stat({ label, value, sub, testId }: { label: string; value: ReactNode; sub?: ReactNode; testId?: string }) {
  return (
    <div className="card p-5">
      <p className="text-small text-fg-muted">{label}</p>
      <p className="mt-1 font-display text-[28px] font-semibold text-fg tabular-nums" data-testid={testId}>
        {value}
      </p>
      {sub ? <p className="text-[12px] text-fg-muted">{sub}</p> : null}
    </div>
  );
}

export function Pager({ page, per, total, base }: { page: number; per: number; total: number; base: Record<string, string | undefined> }) {
  if (total <= per) return null;
  const href = (p: number) => `?${new URLSearchParams({ ...(Object.fromEntries(Object.entries(base).filter(([, v]) => v)) as Record<string, string>), p: String(p) })}`;
  return (
    <nav className="mt-4 flex items-center justify-between text-small" aria-label="Pagination">
      <span className="text-fg-muted">
        {(page - 1) * per + 1}–{Math.min(total, page * per)} of {total}
      </span>
      <span className="flex gap-4">
        {page > 1 ? (
          <Link className="font-semibold text-primary hover:underline" href={href(page - 1)}>
            Previous
          </Link>
        ) : null}
        {page * per < total ? (
          <Link className="font-semibold text-primary hover:underline" href={href(page + 1)}>
            Next
          </Link>
        ) : null}
      </span>
    </nav>
  );
}

export function Pill({ tone, children }: { tone: "ok" | "warn" | "bad" | "muted" | "info"; children: ReactNode }) {
  const t = { ok: "bg-success-soft text-success", warn: "bg-warning-soft text-warning", bad: "bg-error-soft text-error", muted: "bg-canvas-inset text-fg-secondary", info: "bg-primary-soft text-primary" }[tone];
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[12px] font-semibold ${t}`}>{children}</span>;
}

export const fmtDate = (d: Date | null | undefined) => (d ? d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—");

/** Small inline form button for server actions; hidden fields carry ids. */
export function ActionButton({ action, fields, label, tone = "default" }: { action: (fd: FormData) => Promise<void>; fields: Record<string, string>; label: string; tone?: "default" | "danger" | "primary" }) {
  const cls = tone === "danger" ? "text-error hover:bg-error-soft" : tone === "primary" ? "bg-primary text-white hover:bg-primary-hover" : "text-fg ring-1 ring-line hover:bg-canvas-secondary";
  return (
    <form action={action} className="inline">
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button className={`btn h-8 px-2.5 text-[12px] ${cls}`}>{label}</button>
    </form>
  );
}
