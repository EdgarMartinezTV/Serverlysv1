"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deletePageAction, duplicatePageAction, togglePublishAction } from "@/lib/actions/pages";
import { Icon } from "./icons";

export function PageCardActions({ id, name, status, username, liveUrl }: { id: string; name: string; status: string; username: string | null; liveUrl: string | null }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const run = (fn: () => Promise<{ error?: string }>) =>
    start(async () => {
      setError("");
      const r = await fn();
      if (r.error) setError(r.error);
    });
  const published = status === "PUBLISHED";
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Link href={`/editor/${id}`} className="btn h-9 bg-primary px-3 text-[13px] text-white hover:bg-primary-hover" aria-label={`Edit ${name}`}>
          <Icon name="edit" size={15} /> Edit
        </Link>
        <a href={`/preview/${id}`} target="_blank" rel="noreferrer" className="btn h-9 px-3 text-[13px] text-fg ring-1 ring-line hover:bg-canvas-secondary">
          Preview
        </a>
        {published && liveUrl ? (
          <a href={liveUrl} target="_blank" rel="noreferrer" className="btn h-9 px-3 text-[13px] text-fg ring-1 ring-line hover:bg-canvas-secondary">
            <Icon name="external" size={15} /> View live
          </a>
        ) : null}
        {status !== "SUSPENDED" && (published || username) ? (
          <button type="button" disabled={pending} onClick={() => run(() => togglePublishAction(id, !published))} className="btn h-9 px-3 text-[13px] text-fg ring-1 ring-line hover:bg-canvas-secondary">
            {published ? "Unpublish" : "Publish"}
          </button>
        ) : null}
        {username ? (
          <a href={`/api/qr/${id}?format=png`} download className="btn h-9 px-3 text-[13px] text-fg-secondary hover:bg-canvas-inset" aria-label={`Download QR code for ${name}`}>
            <Icon name="qr" size={15} /> QR
          </a>
        ) : null}
        <button type="button" disabled={pending} onClick={() => run(() => duplicatePageAction(id))} className="btn h-9 px-3 text-[13px] text-fg-secondary hover:bg-canvas-inset" aria-label={`Duplicate ${name}`}>
          <Icon name="copy" size={15} /> Duplicate
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm(`Delete “${name}” permanently? Its analytics and leads are deleted too. This can't be undone.`)) run(() => deletePageAction(id));
          }}
          className="btn h-9 px-3 text-[13px] text-error hover:bg-error-soft"
          aria-label={`Delete ${name}`}
        >
          <Icon name="trash" size={15} /> Delete
        </button>
      </div>
      {error ? (
        <p className="text-small text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
