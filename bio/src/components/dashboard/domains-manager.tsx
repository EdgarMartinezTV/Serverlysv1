"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Domain = { id: string; hostname: string; status: string; verificationToken: string; lastError: string | null; lastCheckedAt: string | null; pageId: string; pageName: string };
type CheckResult = { status: string; lastError: string | null; https: { ok: boolean; detail: string } | null };

export function DomainsManager({ pages, domains, targetHost, targetIp }: { pages: Array<{ id: string; name: string; username: string | null }>; domains: Domain[]; targetHost: string; targetIp: string }) {
  const router = useRouter();
  const [pageId, setPageId] = useState(pages[0]?.id ?? "");
  const [host, setHost] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, CheckResult>>({});

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy("add");
    const res = await fetch("/api/domains", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ pageId, hostname: host }) });
    const d = await res.json();
    setBusy(null);
    if (!res.ok) return setError(d.error ?? "Couldn't add domain");
    setHost("");
    router.refresh();
  }
  async function check(id: string) {
    setBusy(id);
    const res = await fetch(`/api/domains/${id}`, { method: "POST" });
    const d = await res.json();
    setBusy(null);
    if (res.ok) setResults((r) => ({ ...r, [id]: d }));
    else setResults((r) => ({ ...r, [id]: { status: "ERROR", lastError: d.error, https: null } }));
    router.refresh();
  }
  async function remove(id: string, hostname: string) {
    if (!confirm(`Disconnect ${hostname}? It will stop showing your page immediately.`)) return;
    setBusy(id);
    await fetch(`/api/domains/${id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {pages.length ? (
        <form onSubmit={add} className="card flex flex-wrap items-end gap-3 p-5">
          <label className="flex flex-col gap-1 text-small font-medium text-fg">
            Page
            <select value={pageId} onChange={(e) => setPageId(e.target.value)} className="field min-h-10 w-52 text-small">
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-small font-medium text-fg">
            Your domain
            <input value={host} onChange={(e) => setHost(e.target.value)} placeholder="links.yourbusiness.com" className="field min-h-10 text-small" required />
          </label>
          <button disabled={busy === "add"} className="btn h-10 bg-primary px-4 text-small text-white hover:bg-primary-hover">
            {busy === "add" ? "Adding…" : "Connect domain"}
          </button>
          {error ? <p className="w-full text-small text-error" role="alert">{error}</p> : null}
          <p className="w-full text-[12px] text-fg-muted">Free. You keep the domain at your registrar; we never charge to connect it. A subdomain (links.example.com) is easiest.</p>
        </form>
      ) : (
        <p className="card p-5 text-body text-fg-muted">Create a page first, then connect a domain to it.</p>
      )}

      {domains.map((d) => {
        const r = results[d.id];
        return (
          <section key={d.id} className="card p-5" aria-labelledby={`dom-${d.id}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id={`dom-${d.id}`} className="font-display text-[18px] font-semibold text-fg">
                  {d.hostname}
                </h2>
                <p className="text-small text-fg-muted">→ {d.pageName}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${d.status === "VERIFIED" ? "bg-success-soft text-success" : d.status === "FAILED" ? "bg-error-soft text-error" : "bg-warning-soft text-warning"}`}>{d.status === "VERIFIED" ? "Connected" : d.status === "FAILED" ? "DNS changed" : "Waiting for DNS"}</span>
            </div>

            {d.status !== "VERIFIED" ? (
              <div className="mt-4">
                <p className="text-small text-fg">Add these two records at your DNS provider, then click Check:</p>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full min-w-[520px] text-small">
                    <thead className="text-left text-fg-muted">
                      <tr>
                        <th className="py-1.5 pr-3 font-medium">Type</th>
                        <th className="py-1.5 pr-3 font-medium">Name / Host</th>
                        <th className="py-1.5 font-medium">Value</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[13px]">
                      <tr className="border-t border-line">
                        <td className="py-2 pr-3">TXT</td>
                        <td className="py-2 pr-3">_serverlys-bio.{d.hostname}</td>
                        <td className="break-all py-2">{d.verificationToken}</td>
                      </tr>
                      <tr className="border-t border-line">
                        <td className="py-2 pr-3">CNAME</td>
                        <td className="py-2 pr-3">{d.hostname}</td>
                        <td className="py-2">{targetHost}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-[12px] text-fg-muted">
                  Connecting a root domain (example.com) that can&apos;t use CNAME? Use an A record to <span className="font-mono">{targetIp}</span> instead.
                </p>
              </div>
            ) : null}

            {d.lastError || r?.lastError ? <p className="mt-3 rounded-sm bg-canvas-secondary px-3 py-2 text-small text-fg-secondary">Last check: {r?.lastError ?? d.lastError}</p> : null}
            {r?.https ? <p className={`mt-3 rounded-sm px-3 py-2 text-small ${r.https.ok ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>{r.https.detail}</p> : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => check(d.id)} disabled={busy === d.id} className="btn h-9 bg-fg px-3 text-[13px] text-white">
                {busy === d.id ? "Checking…" : d.status === "VERIFIED" ? "Re-check DNS & HTTPS" : "Check DNS"}
              </button>
              {d.status === "VERIFIED" ? (
                <a href={`https://${d.hostname}/`} target="_blank" rel="noreferrer" className="btn h-9 px-3 text-[13px] text-fg ring-1 ring-line hover:bg-canvas-secondary">
                  Open
                </a>
              ) : null}
              <button type="button" onClick={() => remove(d.id, d.hostname)} disabled={busy === d.id} className="btn h-9 px-3 text-[13px] text-error hover:bg-error-soft">
                Disconnect
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
