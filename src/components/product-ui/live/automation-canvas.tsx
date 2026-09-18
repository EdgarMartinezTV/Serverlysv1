"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { DemoBadge } from "./shell";

/**
 * Serverlys automations — a workflow you can actually run.
 *
 * Two independent interactions, because they answer two different questions.
 * Selecting a node answers "what does this step do"; running the flow answers
 * "what does it do to a real enquiry". Running does not clear the selection,
 * so you can watch one step while the rest executes around it.
 *
 * Node state is derived from a single `cursor` rather than stored per node —
 * one source of truth means a node can never be left stuck "running" after a
 * reset.
 */

type NodeKind = "trigger" | "ai" | "action" | "crm" | "result";

type FlowNode = {
  id: NodeKind;
  label: string;
  service: string;
  /** What this step does, in the detail panel. */
  detail: string;
  /** The payload as it stands after this step. */
  output: readonly string[];
  ms: number;
};

const NODES: readonly FlowNode[] = [
  {
    id: "trigger",
    label: "Trigger",
    service: "Contact form",
    detail:
      "A submission on any Serverlys-hosted site starts the run. No polling — the form posts straight into the workflow.",
    output: [
      "name: Dana Whitfield",
      "email: dana@…",
      "message: “Do you take new patients?”",
    ],
    ms: 500,
  },
  {
    id: "ai",
    label: "Classify",
    service: "ConvoAI",
    detail:
      "The agent reads the message and decides what it is: an enquiry, a booking, a complaint or spam. Spam stops here.",
    output: ["intent: new_patient", "urgency: normal", "spam: false"],
    ms: 900,
  },
  {
    id: "action",
    label: "Respond",
    service: "Email",
    detail:
      "An answer goes out immediately in your wording, not a generic autoresponder — so nobody waits until morning.",
    output: ["sent: dana@…", "template: new_patient_reply"],
    ms: 700,
  },
  {
    id: "crm",
    label: "Record",
    service: "CRM",
    detail:
      "The contact is created or matched, and the whole exchange is attached to it. Nothing gets re-keyed by hand.",
    output: ["contact: created", "source: website", "owner: front desk"],
    ms: 700,
  },
  {
    id: "result",
    label: "Notify",
    service: "Slack",
    detail:
      "The team sees it where they already work, with the classification attached so triage is already done.",
    output: ["channel: #front-desk", "status: delivered"],
    ms: 500,
  },
];

export function AutomationCanvas({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const [selected, setSelected] = useState<NodeKind>("ai");
  /** -1 idle; 0..n-1 the running node; n complete. */
  const [cursor, setCursor] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  useEffect(() => {
    if (cursor < 0 || cursor >= NODES.length) return;
    timer.current = setTimeout(() => setCursor((c) => c + 1), NODES[cursor].ms);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [cursor]);

  const running = cursor >= 0 && cursor < NODES.length;
  const complete = cursor >= NODES.length;
  const node = NODES.find((n) => n.id === selected) ?? NODES[0];

  function stateOf(index: number): "idle" | "running" | "done" {
    if (cursor < 0) return "idle";
    if (index < cursor) return "done";
    if (index === cursor) return "running";
    return "idle";
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const index = NODES.findIndex((n) => n.id === selected);
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = NODES.length - 1;
    else return;
    event.preventDefault();
    setSelected(NODES[(next + NODES.length) % NODES.length].id);
  }

  return (
    <section
      aria-label="Serverlys automation workflow demonstration"
      className={cn(
        "overflow-hidden rounded-xl",
        dark
          ? "bg-surface-dark-elevated shadow-e5 ring-1 ring-inset ring-white/10"
          : "bg-surface shadow-e5 ring-1 ring-line",
        className,
      )}
    >
      <header
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-2 border-b px-3.5 py-2.5",
          dark
            ? "border-white/10 bg-white/[0.03]"
            : "border-line-subtle bg-canvas-secondary",
        )}
      >
        <span
          className={cn("text-small font-semibold", dark ? "text-white" : "text-fg")}
        >
          Enquiry → booked
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-mono text-ui uppercase tracking-[0.1em]",
            dark
              ? "bg-white/8 text-fg-on-dark-secondary"
              : "bg-canvas-inset text-fg-muted",
          )}
        >
          n8n
        </span>
        <span className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCursor(running ? -1 : 0)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-ui font-medium transition-colors duration-fast",
              "focus-visible:outline-2 focus-visible:outline-offset-2",
              dark
                ? "bg-white text-fg hover:bg-ink-100 focus-visible:outline-white"
                : "bg-primary text-white hover:bg-primary-hover focus-visible:outline-primary",
            )}
          >
            {running ? (
              <>
                <svg viewBox="0 0 12 12" aria-hidden="true" className="h-2.5 w-2.5">
                  <rect x="2" y="2" width="3" height="8" fill="currentColor" />
                  <rect x="7" y="2" width="3" height="8" fill="currentColor" />
                </svg>
                Stop
              </>
            ) : (
              <>
                <svg viewBox="0 0 12 12" aria-hidden="true" className="h-2.5 w-2.5">
                  <path d="M3 2l7 4-7 4z" fill="currentColor" />
                </svg>
                {complete ? "Run again" : "Run workflow"}
              </>
            )}
          </button>
          <DemoBadge tone={tone} />
        </span>
      </header>

      {/* ── Canvas ──────────────────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Workflow steps"
        onKeyDown={onKeyDown}
        className="flex items-stretch gap-1 overflow-x-auto p-3.5 sm:gap-1.5"
      >
        {NODES.map((n, index) => {
          const state = stateOf(index);
          const active = n.id === selected;
          return (
            <div key={n.id} className="flex min-w-0 items-center gap-1 sm:gap-1.5">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px w-3 shrink-0 transition-colors duration-normal sm:w-5",
                    state === "idle"
                      ? dark
                        ? "bg-white/15"
                        : "bg-line"
                      : "bg-primary",
                  )}
                />
              )}
              <button
                type="button"
                role="tab"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                onClick={() => setSelected(n.id)}
                className={cn(
                  "min-w-[6.5rem] shrink-0 rounded-lg px-2.5 py-2 text-left transition-all duration-normal ease-hover",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                  dark
                    ? "focus-visible:outline-white"
                    : "focus-visible:outline-primary",
                  dark && active && "bg-white/12 ring-1 ring-inset ring-white/25",
                  dark &&
                    !active &&
                    "bg-white/[0.04] ring-1 ring-inset ring-white/8 hover:bg-white/8",
                  !dark &&
                    active &&
                    "bg-primary-soft ring-1 ring-inset ring-primary/30",
                  !dark &&
                    !active &&
                    "bg-canvas-secondary ring-1 ring-inset ring-line-subtle hover:bg-canvas-inset",
                  state === "running" && "ring-2 ring-primary",
                )}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-normal",
                      state === "done"
                        ? "bg-success-fill"
                        : state === "running"
                          ? "bg-primary motion-safe:animate-pulse"
                          : dark
                            ? "bg-ink-700"
                            : "bg-line-strong",
                    )}
                  />
                  <span
                    className={cn(
                      "truncate font-mono text-ui uppercase tracking-[0.1em]",
                      dark ? "text-fg-on-dark-muted" : "text-fg-muted",
                    )}
                  >
                    {n.label}
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-0.5 block truncate text-micro font-medium",
                    dark ? "text-white" : "text-fg",
                  )}
                >
                  {n.service}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Selected step ───────────────────────────────────────────────── */}
      <div
        role="tabpanel"
        aria-label={`${node.label}: ${node.service}`}
        className={cn(
          "border-t p-3.5",
          dark
            ? "border-white/8 bg-black/20"
            : "border-line-subtle bg-canvas-secondary",
        )}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <p
            className={cn(
              "text-[0.8125rem] leading-relaxed",
              dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
            )}
          >
            {node.detail}
          </p>
          <ul
            className={cn(
              "flex flex-col gap-1 rounded-lg p-2.5 font-mono text-ui",
              dark
                ? "bg-black/40 text-fg-on-dark-muted ring-1 ring-inset ring-white/8"
                : "bg-surface text-fg-muted ring-1 ring-inset ring-line-subtle",
            )}
          >
            {node.output.map((line) => (
              <li key={line} className="truncate">
                <span aria-hidden="true" className="mr-1.5 text-primary">
                  ›
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        {complete && (
          <p
            className={cn(
              "mt-2.5 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-ui",
              dark ? "bg-success-fill/12 text-white" : "bg-success-soft text-success",
            )}
            role="status"
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-success-fill"
            />
            Run complete · 5 steps · answered, recorded and notified in 3.3s
          </p>
        )}
      </div>
    </section>
  );
}
