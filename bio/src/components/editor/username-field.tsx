"use client";

import { useEffect, useId, useRef, useState } from "react";

type Check = { available: boolean; normalized: string; reason?: string; suggestions?: string[] };

/**
 * Username input with real-time availability (debounced GET /api/username).
 * `saveMode="immediate"` saves via PATCH; `"controlled"` just reports the
 * value to the parent (publish dialog claims it in the same request).
 */
export function UsernameField({ pageId, initial, prefill, appUrl, onSaved, onValid, saveMode }: { pageId: string; initial: string; prefill?: string; appUrl: string; onSaved?: (u: string) => void; onValid?: (u: string | null) => void; saveMode: "immediate" | "controlled" }) {
  const id = useId();
  const [value, setValue] = useState(prefill || initial);
  const [lastCheck, setCheck] = useState<Check | null>(null);
  const [state, setState] = useState<"idle" | "checking" | "saving" | "saved" | "error">("idle");
  const [err, setErr] = useState("");
  const seq = useRef(0);
  const host = appUrl.replace(/^https?:\/\//, "");

  useEffect(() => {
    const v = value.trim();
    if (!v || v.toLowerCase() === initial) {
      onValid?.(v ? v.toLowerCase() : null);
      return;
    }
    const n = ++seq.current;
    const t = setTimeout(async () => {
      setState("checking");
      try {
        const res = await fetch(`/api/username?u=${encodeURIComponent(v)}&page=${pageId}`);
        const d = (await res.json()) as Check;
        if (n !== seq.current) return;
        setCheck(d);
        setState("idle");
        onValid?.(d.available ? d.normalized : null);
      } catch {
        if (n === seq.current) setState("idle");
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, pageId, initial]);

  async function save() {
    if (!check?.available) return;
    setState("saving");
    setErr("");
    const res = await fetch(`/api/pages/${pageId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ username: check.normalized }) });
    const d = await res.json();
    if (!res.ok) {
      setState("error");
      setErr(d.error ?? "Couldn't save");
      return;
    }
    setState("saved");
    onSaved?.(d.username);
  }

  // A stale result for a value the user has since reverted is ignored.
  const check = value.trim() && value.trim().toLowerCase() !== initial ? lastCheck : null;
  const status = state === "checking" ? "Checking…" : check ? (check.available ? "Available" : check.reason) : value && value.toLowerCase() === initial ? "This is your current address" : "";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-small font-medium text-fg">
        Username
      </label>
      <div className="flex items-stretch overflow-hidden rounded-sm ring-1 ring-line-input focus-within:ring-2 focus-within:ring-primary">
        <span className="flex items-center bg-canvas-inset px-2.5 text-[13px] text-fg-muted">{host}/</span>
        <input
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\s/g, ""))}
          maxLength={30}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-surface px-2.5 py-2 text-small text-fg outline-none"
          aria-describedby={`${id}-status`}
          data-username-input
        />
        {saveMode === "immediate" ? (
          <button type="button" onClick={save} disabled={!check?.available || state === "saving"} className="bg-primary px-3 text-[13px] font-semibold text-white disabled:bg-line-strong">
            {state === "saving" ? "…" : "Save"}
          </button>
        ) : null}
      </div>
      <p id={`${id}-status`} role="status" className={`text-[12px] ${check && !check.available ? "text-error" : check?.available ? "text-success" : "text-fg-muted"}`} data-username-status>
        {state === "saved" ? "Saved — your page address changed." : err || status}
      </p>
      {check?.suggestions?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {check.suggestions.map((s) => (
            <button key={s} type="button" onClick={() => setValue(s)} className="rounded-full bg-canvas-inset px-2.5 py-1 text-[12px] text-fg hover:bg-primary-soft">
              {s}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
