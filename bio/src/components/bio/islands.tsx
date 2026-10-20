"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Counts a page view once per load and clicks on non-http links
 * (mailto/tel/wa.me/vCard/socials) which can't go through the /go redirect.
 * Cookieless: the server derives a daily-salted visitor hash.
 */
/** Views already sent in this document (StrictMode runs effects twice in dev). */
const sentViews = new Set<string>();

export function PageTracker({ pageId }: { pageId: string }) {
  useEffect(() => {
    const send = (body: Record<string, string>) => {
      const payload = JSON.stringify({ pageId, ...body });
      if (!navigator.sendBeacon?.("/api/track", new Blob([payload], { type: "application/json" }))) {
        fetch("/api/track", { method: "POST", body: payload, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
      }
    };
    if (!sentViews.has(pageId)) {
      sentViews.add(pageId);
      send({ type: "view", referrer: document.referrer });
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[data-track]");
      if (a) send({ type: "click", blockId: a.getAttribute("data-track") ?? "" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pageId]);
  return null;
}

/** Top-right share button: opens the share sheet for the whole page. */
export function ShareButton({ url, title }: { url: string; title: string }) {
  return (
    <button
      type="button"
      className="bio-round"
      aria-label="Share this page"
      aria-haspopup="dialog"
      onClick={() => window.dispatchEvent(new CustomEvent("sbio:share", { detail: { url, title } }))}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14" />
      </svg>
    </button>
  );
}

type Target = { url: string; title: string; isPage: boolean };

const enc = encodeURIComponent;
const TARGETS: Array<{ name: string; href: (u: string, t: string) => string; path: string }> = [
  { name: "WhatsApp", href: (u, t) => `https://wa.me/?text=${enc(`${t} ${u}`)}`, path: "M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm5.1 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4Z" },
  { name: "X", href: (u, t) => `https://x.com/intent/post?url=${enc(u)}&text=${enc(t)}`, path: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" },
  { name: "Facebook", href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}`, path: "M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z" },
  { name: "LinkedIn", href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(u)}`, path: "M6.5 8.5H3V21h3.5V8.5ZM4.8 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM21 13.6c0-3.2-1.7-5.3-4.5-5.3-1.6 0-2.7.9-3.1 1.6V8.5H10V21h3.5v-6.5c0-1.6.8-2.6 2-2.6 1.3 0 1.9 1 1.9 2.6V21H21v-7.4Z" },
  { name: "Email", href: (u, t) => `mailto:?subject=${enc(t)}&body=${enc(u)}`, path: "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.4V17h16V7.4l-8 5.1-8-5.1ZM5.3 7 12 11.2 18.7 7H5.3Z" },
];

/**
 * The share sheet (page or a single link): QR code, copy, native share and
 * the common share targets. One instance per page; opened by the top share
 * button (event) or any "⋮" button carrying data-share-link.
 */
export function ShareSheet({ pageUrl, pageTitle, avatar }: { pageUrl: string; pageTitle: string; avatar: string }) {
  const [target, setTarget] = useState<Target | null>(null);
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState<{ size: number; d: string } | null>(null);

  useEffect(() => {
    const onEvent = (e: Event) => {
      const d = (e as CustomEvent<{ url: string; title: string }>).detail;
      setTarget({ url: d.url, title: d.title || pageTitle, isPage: true });
    };
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as Element | null)?.closest?.("[data-share-link]");
      if (!btn) return;
      e.preventDefault();
      setTarget({ url: btn.getAttribute("data-share-link") ?? pageUrl, title: btn.getAttribute("data-share-title") ?? pageTitle, isPage: false });
    };
    window.addEventListener("sbio:share", onEvent);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("sbio:share", onEvent);
      document.removeEventListener("click", onClick);
    };
  }, [pageUrl, pageTitle]);

  useEffect(() => {
    if (!target) return;
    let live = true;
    import("@/lib/bio/qr").then((m) => live && setQr(m.qrPath(target.url)));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTarget(null);
    window.addEventListener("keydown", onKey);
    return () => {
      live = false;
      window.removeEventListener("keydown", onKey);
    };
  }, [target]);

  if (!target) return null;
  const close = () => {
    setTarget(null);
    setCopied(false);
    setQr(null);
  };
  return (
    <div className="bio-sheet" role="dialog" aria-modal="true" aria-labelledby="bio-sheet-title">
      <button type="button" className="bio-sheet-scrim" aria-label="Close" onClick={close} />
      <div className="bio-sheet-panel">
        <div className="bio-sheet-head">
          <strong id="bio-sheet-title">{target.isPage ? "Share this page" : "Share link"}</strong>
          <button type="button" className="bio-sheet-x" onClick={close} aria-label="Close" autoFocus>
            ×
          </button>
        </div>
        <div className="bio-sheet-card">
          {target.isPage && avatar ? <img src={avatar} alt="" className="bio-sheet-avatar" /> : null}
          <p className="bio-sheet-name">{target.title}</p>
          {qr ? (
            <svg viewBox={`-2 -2 ${qr.size + 4} ${qr.size + 4}`} shapeRendering="crispEdges" role="img" aria-label={`QR code for ${target.url}`} className="bio-sheet-qr">
              <rect x="-2" y="-2" width={qr.size + 4} height={qr.size + 4} fill="#fff" />
              <path d={qr.d} fill="#101011" />
            </svg>
          ) : (
            <div className="bio-sheet-qr" />
          )}
          <p className="bio-sheet-url">{target.url.replace(/^https?:\/\//, "")}</p>
        </div>
        <div className="bio-sheet-targets">
          {TARGETS.map((t) => (
            <a key={t.name} href={t.href(target.url, target.title)} target="_blank" rel="noopener noreferrer" className="bio-sheet-target">
              <span aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d={t.path} />
                </svg>
              </span>
              {t.name}
            </a>
          ))}
        </div>
        <div className="bio-sheet-actions">
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(target.url);
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              } catch {}
            }}
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
          {typeof navigator !== "undefined" && "share" in navigator ? (
            <button type="button" onClick={() => navigator.share({ url: target.url, title: target.title }).catch(() => {})}>
              More options
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const GATE_KEY = "sbio.sensitive.ok";

function acceptedBefore(): boolean {
  try {
    return sessionStorage.getItem(GATE_KEY) === "1";
  } catch {
    return false; // storage blocked: keep the gate
  }
}
const noSubscribe = () => () => {};

export function SensitiveGate() {
  // Server render always shows the gate; the client checks this tab's answer.
  const accepted = useSyncExternalStore(noSubscribe, acceptedBefore, () => false);
  const [dismissed, setDismissed] = useState(false);
  const setOpen = (v: boolean) => setDismissed(!v);
  if (accepted || dismissed) return null;
  return (
    <div className="bio-gate" role="dialog" aria-modal="true" aria-labelledby="bio-gate-title">
      <div>
        <strong id="bio-gate-title">Sensitive content</strong>
        <p>This page may contain content that isn&apos;t suitable for everyone. Continue only if you are 18 or older.</p>
        <button
          type="button"
          autoFocus
          onClick={() => {
            try {
              sessionStorage.setItem(GATE_KEY, "1");
            } catch {}
            setOpen(false);
          }}
        >
          Continue
        </button>
        <button type="button" onClick={() => history.back()} style={{ background: "transparent", color: "#fff" }}>
          Go back
        </button>
      </div>
    </div>
  );
}
