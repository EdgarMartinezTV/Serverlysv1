"use client";

import { useState } from "react";

/**
 * Under the article cover, as on Hostinger's blog: "Summarize with" links that
 * open an AI assistant with a request to summarise this page, and "Share"
 * buttons (copy link, X, Facebook, LinkedIn). Plain links — no third-party
 * script loads, and nothing is sent anywhere until the reader clicks.
 */
export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const ask = encodeURIComponent(`Summarize this article and list its key takeaways: ${url}`);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const summarize = [
    { label: "ChatGPT", href: `https://chatgpt.com/?q=${ask}` },
    { label: "Claude", href: `https://claude.ai/new?q=${ask}` },
    { label: "Perplexity", href: `https://www.perplexity.ai/search?q=${ask}` },
  ];

  const pill =
    "inline-flex h-8 items-center gap-1.5 rounded-full bg-canvas-secondary px-3 text-caption font-medium text-fg ring-1 ring-line transition-colors hover:bg-brand-50 hover:text-primary hover:ring-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
  const round =
    "flex size-8 items-center justify-center rounded-full text-fg ring-1 ring-line transition-colors hover:bg-brand-50 hover:text-primary hover:ring-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div>
        <p className="text-caption text-fg-muted">Summarize with:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {summarize.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={pill}>
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 1.5 9.4 6.6 14.5 8 9.4 9.4 8 14.5 6.6 9.4 1.5 8 6.6 6.6Z" />
              </svg>
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="sm:text-right">
        <p className="text-caption text-fg-muted">Share:</p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            className={round}
            aria-label={copied ? "Link copied" : "Copy link"}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1800);
              } catch {
                /* clipboard blocked — the address bar still has it */
              }
            }}
          >
            {copied ? (
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m3.5 8.5 3 3 6-7" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6.5 9.5a3 3 0 0 0 4.2 0l2.3-2.3a3 3 0 0 0-4.2-4.2l-.8.8" />
                <path d="M9.5 6.5a3 3 0 0 0-4.2 0L3 8.8A3 3 0 0 0 7.2 13l.8-.8" />
              </svg>
            )}
          </button>
          <a className={round} aria-label="Share on X" target="_blank" rel="noopener noreferrer" href={`https://x.com/intent/post?url=${u}&text=${t}`}>
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
              <path d="M12.2 1.5h2.2L9.6 7l5.6 7.5h-4.4L7.3 9.9l-4 4.6H1.1l5.1-5.9L.8 1.5h4.5l3.1 4.2Zm-.8 11.7h1.2L4.7 2.7H3.4Z" />
            </svg>
          </a>
          <a className={round} aria-label="Share on Facebook" target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}>
            <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden="true">
              <path d="M9.2 15v-6h2l.3-2.4H9.2V5.1c0-.7.2-1.2 1.2-1.2h1.2V1.8a16 16 0 0 0-1.8-.1C8 1.7 6.8 2.8 6.8 4.8v1.8h-2V9h2v6Z" />
            </svg>
          </a>
          <a className={round} aria-label="Share on LinkedIn" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}>
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
              <path d="M3.6 5.4H.9V15h2.7ZM2.3 1a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM15 9.6c0-2.6-.6-4.5-3.6-4.5-1.5 0-2.4.8-2.8 1.6V5.4H6V15h2.7v-4.8c0-1.3.2-2.5 1.8-2.5s1.6 1.5 1.6 2.6V15H15Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
