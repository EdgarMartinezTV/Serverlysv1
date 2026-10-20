"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { UsernameField } from "./username-field";
import { qrSvg } from "@/lib/bio/qr";

type Issue = { blockId?: string; field: string; message: string };

/**
 * Step 3 of onboarding, and the editor's Publish button. Claims the username
 * (if not set) and publishes in one request; on success shows the live URL,
 * copy/share and a downloadable QR code.
 */
export function PublishDialog({ pageId, username, suggested, appUrl, verified, onClose, onPublished, onFix, beforePublish }: { pageId: string; username: string | null; suggested?: string; appUrl: string; verified: boolean; onClose: () => void; onPublished: (u: string) => void; onFix: (blockId?: string) => void; beforePublish: () => Promise<boolean> }) {
  const [chosen, setChosen] = useState<string | null>(username);
  const [state, setState] = useState<"form" | "publishing" | "done">("form");
  const [error, setError] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [live, setLive] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>("input,button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function publish() {
    setState("publishing");
    setError("");
    setIssues([]);
    if (!(await beforePublish())) {
      setState("form");
      setError("Your latest changes couldn't be saved. Check your connection and try again.");
      return;
    }
    const res = await fetch(`/api/pages/${pageId}/publish`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(chosen && chosen !== username ? { username: chosen } : {}) });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState("form");
      setError(d.error ?? "Publishing failed.");
      setIssues(d.issues ?? []);
      return;
    }
    setLive(`${appUrl}/${d.username}`);
    setState("done");
    onPublished(d.username);
  }

  const qr = live ? qrSvg(live, { margin: 2 }) : "";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="publish-title">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div ref={ref} className="relative w-full max-w-md rounded-t-xl bg-surface p-6 shadow-e5 sm:rounded-xl">
        {state !== "done" ? (
          <>
            <h2 id="publish-title" className="text-h4 font-semibold">
              Publish your page
            </h2>
            {!verified ? (
              <p className="mt-4 rounded-sm bg-warning-soft px-4 py-3 text-small text-warning">
                Confirm your email first — we sent you a link.{" "}
                <Link className="font-semibold underline" href="/verify-email">
                  Resend it
                </Link>
              </p>
            ) : (
              <>
                <p className="mt-1 text-small text-fg-muted">Pick the address people will visit. You can change it later.</p>
                <div className="mt-5">
                  <UsernameField pageId={pageId} initial={username ?? ""} prefill={username ? undefined : suggested} appUrl={appUrl} saveMode="controlled" onValid={(u) => setChosen(u ?? (username || null))} />
                </div>
                {error ? (
                  <div className="mt-4 rounded-sm bg-error-soft px-4 py-3 text-small text-error" role="alert">
                    <p className="font-semibold">{error}</p>
                    {issues.length ? (
                      <ul className="mt-2 flex flex-col gap-1">
                        {issues.slice(0, 8).map((i, n) => (
                          <li key={n}>
                            <button type="button" className="text-left underline" onClick={() => onFix(i.blockId)}>
                              {i.message}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
                <button type="button" onClick={publish} disabled={!chosen || state === "publishing"} className="btn mt-6 h-12 w-full bg-primary text-white hover:bg-primary-hover" data-publish-confirm>
                  {state === "publishing" ? "Publishing…" : "Publish now"}
                </button>
              </>
            )}
            <button type="button" onClick={onClose} className="btn mt-2 h-10 w-full text-small text-fg-muted hover:bg-canvas-inset">
              Not yet
            </button>
          </>
        ) : (
          <>
            <p className="text-caption uppercase text-success">Published</p>
            <h2 id="publish-title" className="mt-1 text-h4 font-semibold">
              Your page is live 🎉
            </h2>
            <div className="mt-4 flex items-center gap-2 rounded-sm bg-canvas-secondary p-2 pl-3">
              <a href={live!} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-small font-semibold text-primary" data-live-url>
                {live!.replace(/^https?:\/\//, "")}
              </a>
              <button
                type="button"
                className="btn h-9 bg-fg px-3 text-[13px] text-white"
                onClick={async () => {
                  await navigator.clipboard.writeText(live!);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                }}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <div className="size-28 shrink-0 rounded-sm ring-1 ring-line" dangerouslySetInnerHTML={{ __html: qr }} />
              <div className="flex flex-col gap-2 text-small">
                <p className="text-fg-muted">Print it on menus, cards and packaging.</p>
                <a className="font-semibold text-primary hover:underline" href={`/api/qr/${pageId}?format=png`} download>
                  Download PNG
                </a>
                <a className="font-semibold text-primary hover:underline" href={`/api/qr/${pageId}?format=svg`} download>
                  Download SVG
                </a>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <a href={live!} target="_blank" rel="noreferrer" className="btn h-11 flex-1 bg-primary text-small text-white hover:bg-primary-hover">
                View page
              </a>
              <button type="button" onClick={onClose} className="btn h-11 flex-1 text-small text-fg ring-1 ring-line hover:bg-canvas-secondary">
                Keep editing
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
