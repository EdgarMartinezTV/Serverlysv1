"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  pageId: string;
  blockId: string;
  kind: "newsletter" | "contact";
  askName: boolean;
  askPhone: boolean;
  askMessage: boolean;
  buttonLabel: string;
  consentText: string;
  successMessage: string;
  /** Editor / template previews render the form but never submit it. */
  disabled: boolean;
};

export function LeadForm(p: Props) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  // Bots submit instantly; humans don't. Measured from mount (autofill-safe).
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (p.disabled) {
      setState("error");
      setError("Forms start collecting once the page is published.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          pageId: p.pageId,
          blockId: p.blockId,
          name: fd.get("name") ?? "",
          email: fd.get("email") ?? "",
          phone: fd.get("phone") ?? "",
          message: fd.get("message") ?? "",
          consent: fd.get("consent") === "on",
          website: fd.get("website") ?? "",
          elapsed: Date.now() - mountedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Try again.");
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "done") {
    return (
      <p className="bio-form-note" role="status">
        {p.successMessage}
      </p>
    );
  }

  const id = (f: string) => `${p.blockId}-${f}`;
  return (
    <form className="bio-form" onSubmit={onSubmit} noValidate={false}>
      {p.askName ? (
        <label htmlFor={id("name")}>
          Name
          <input id={id("name")} name="name" autoComplete="name" required maxLength={120} />
        </label>
      ) : null}
      <label htmlFor={id("email")}>
        Email
        <input id={id("email")} name="email" type="email" autoComplete="email" required maxLength={200} />
      </label>
      {p.askPhone ? (
        <label htmlFor={id("phone")}>
          Phone
          <input id={id("phone")} name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
      ) : null}
      {p.askMessage ? (
        <label htmlFor={id("message")}>
          Message
          <textarea id={id("message")} name="message" rows={4} required maxLength={3000} />
        </label>
      ) : null}
      {/* Honeypot: invisible to people, irresistible to form bots. */}
      <div className="bio-hp" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {p.consentText ? (
        <label className="bio-consent">
          <input type="checkbox" name="consent" required />
          <span>{p.consentText}</span>
        </label>
      ) : null}
      {state === "error" ? (
        <p className="bio-form-note" data-error="" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="bio-btn" style={{ justifyContent: "center" }} disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : p.buttonLabel || "Send"}
      </button>
    </form>
  );
}
