"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/animations/reveal";
import { resolveNavTarget } from "@/data/routes";
import { cn } from "@/lib/utils";

/**
 * Tabbed product showcase.
 *
 * Reproduces the target's segmented-pill band and its 55/45 split: a large
 * product surface on the left, copy and a call to action on the right.
 *
 * A real WAI-ARIA tablist — arrow keys, Home/End, roving tabindex — matching
 * the pricing table's pattern, so the two behave identically.
 *
 * Each panel is composed DIFFERENTLY on purpose. Four variations of one shell
 * would read as a template; the target uses distinct compositions per tab.
 */

type Tab = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  meta: readonly string[];
};

const TABS: readonly Tab[] = [
  {
    id: "host",
    label: "Host",
    eyebrow: "Cloud hosting",
    title: "Pick a plan. We run the server.",
    body: "Auto-scaling infrastructure with NVMe storage and server-level caching, configured before you arrive. No stack to assemble.",
    href: "/cloud-hosting",
    cta: "Explore cloud hosting",
    meta: ["Free SSL", "Daily backups", "cPanel"],
  },
  {
    id: "domains",
    label: "Domains",
    eyebrow: "Domains",
    title: "Find the name, hold the name.",
    body: "Availability read live from the registry, with free WHOIS privacy on everything we register and DNS management included.",
    href: "/register-domain",
    cta: "Search domains",
    meta: ["Free WHOIS privacy", "DNS included", "From $9.95/yr"],
  },
  {
    id: "grow",
    label: "Grow",
    eyebrow: "ConvoAI",
    title: "Answer customers while you sleep.",
    body: "An AI agent trained on your business handles the routine questions — hours, bookings, pricing — and hands over the ones that need you.",
    href: "https://convoai.cloud/",
    cta: "See ConvoAI",
    meta: ["Trained on your site", "Handover to human", "Works 24/7"],
  },
  {
    id: "manage",
    label: "Manage",
    eyebrow: "Migration",
    title: "Move in without going offline.",
    body: "We copy the site, database and email to staging first. You check it there. DNS changes only when you say so.",
    href: "/migrations",
    cta: "How migration works",
    meta: ["Free", "Staged first", "You approve"],
  },
];

export function ToolsTabs() {
  const [active, setActive] = useState(TABS[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const index = TABS.findIndex((t) => t.id === active);
  const tab = TABS[index];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = TABS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      setActive(TABS[next].id);
      tabRefs.current[next]?.focus();
    }
  };

  const target = resolveNavTarget(tab.href);

  return (
    <section
      aria-labelledby="tools-heading"
      className="bg-canvas py-14 sm:py-24 lg:py-28"
    >
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="tools-heading" className="text-h1 text-fg">
            Everything a site needs, in one place
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-body-lg text-fg-secondary">
            Hosting, the domain, the AI that answers, and the move-in. Bought once,
            billed once, supported by the same team.
          </p>
        </Reveal>

        <Reveal delay={60} className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="What Serverlys does"
            onKeyDown={onKeyDown}
            className="flex gap-1 rounded-full bg-canvas-inset p-1"
          >
            {TABS.map((t, i) => {
              const selected = t.id === active;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`${baseId}-tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(t.id)}
                  className={cn(
                    "min-h-10 rounded-full px-5 text-small font-medium transition-colors duration-fast",
                    selected
                      ? "bg-fg text-white shadow-e2"
                      : "text-fg-secondary hover:text-fg",
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {TABS.map((t) => (
          <div
            key={t.id}
            role="tabpanel"
            id={`${baseId}-panel-${t.id}`}
            aria-labelledby={`${baseId}-tab-${t.id}`}
            hidden={t.id !== active}
            tabIndex={0}
            className="mt-12 outline-none"
          >
            <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
              <ShowcaseFor id={t.id} />

              <div>
                <span className="text-micro text-primary font-semibold">
                  {t.eyebrow}
                </span>
                <h3 className="mt-4 text-h2 text-fg">{t.title}</h3>
                <p className="mt-5 text-body-lg text-fg-secondary">{t.body}</p>

                <ul className="mt-7 flex flex-wrap gap-2">
                  {t.meta.map((m) => (
                    <li
                      key={m}
                      className="rounded-full bg-canvas-secondary px-3 py-1.5 text-micro text-fg-secondary ring-1 ring-line font-semibold"
                    >
                      {m}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {t.href.startsWith("http") ? (
                    <a
                      href={t.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-sm text-body font-medium text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                      {t.cta}
                      <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <Link
                      href={target.href}
                      className="inline-flex items-center gap-2 rounded-sm text-body font-medium text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                      {t.cta}
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

/* ── Showcase surfaces ─────────────────────────────────────────────────────
   One per tab, each composed differently. All decorative — the copy beside
   them carries the meaning — so all are aria-hidden. */

function Frame({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl bg-surface shadow-e5 ring-1 ring-line"
    >
      {label && (
        <div className="flex items-center gap-2 border-b border-line-subtle bg-canvas-secondary px-4 py-2.5">
          <span className="flex gap-1.5">
            {["bg-red-500/50", "bg-amber-500/50", "bg-green-500/50"].map((c) => (
              <span key={c} className={cn("h-2.5 w-2.5 rounded-full", c)} />
            ))}
          </span>
          <span className="ml-2 rounded bg-surface px-2.5 py-1 font-mono text-caption text-fg-muted ring-1 ring-line-subtle">
            {label}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

function ShowcaseFor({ id }: { id: string }) {
  if (id === "domains") return <DomainsShowcase />;
  if (id === "grow") return <GrowShowcase />;
  if (id === "manage") return <ManageShowcase />;
  return <HostShowcase />;
}

/** Host — a resource dashboard with a usage chart. */
function HostShowcase() {
  const bars = [38, 52, 44, 61, 47, 72, 55, 66, 49, 58, 41, 63];
  return (
    <Frame label="serverlys.com/hosting">
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-h4 text-fg">Turbo Cloud</p>
            <p className="mt-0.5 text-small text-fg-muted">3 sites · London</p>
          </div>
          <span className="rounded-full bg-success-soft px-3 py-1 text-micro text-success font-semibold">
            Operational
          </span>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-3">
          {[
            ["CPU", "18%", "of 5 GB"],
            ["Memory", "1.4 GB", "of 5 GB"],
            ["Storage", "6.2 GB", "unlimited"],
          ].map(([k, v, sub]) => (
            <div key={k} className="rounded-lg bg-canvas-secondary p-3">
              <dt className="text-micro text-fg-muted font-semibold">{k}</dt>
              <dd className="tabular mt-1 text-h4 text-fg">{v}</dd>
              <p className="mt-0.5 text-caption text-fg-muted">{sub}</p>
            </div>
          ))}
        </dl>

        <div className="mt-5 rounded-lg bg-canvas-secondary p-4">
          <p className="text-micro text-fg-muted font-semibold">
            Requests · last 12h
          </p>
          <div className="mt-3 flex h-20 items-end gap-1.5">
            {bars.map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className={cn(
                  "flex-1 rounded-t-sm",
                  i === 5 ? "bg-primary" : "bg-primary/25",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

/** Domains — search results, echoing the real tool. */
function DomainsShowcase() {
  const rows = [
    [".com", "$14.95", "available"],
    [".io", "—", "not sold"],
    [".net", "$16.95", "available"],
    [".org", "$16.95", "taken"],
    [".eu", "$9.95", "available"],
  ] as const;
  return (
    <Frame label="serverlys.com/register-domain">
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3 rounded-xl bg-canvas-secondary px-4 py-3 ring-1 ring-line">
          <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-fg-muted">
            <circle
              cx="9"
              cy="9"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="m13.5 13.5 3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-body text-fg">yourbusiness</span>
          <span className="ml-auto rounded-md bg-primary px-3 py-1.5 text-caption font-medium text-white">
            Search
          </span>
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {rows.map(([tld, price, state]) => (
            <li
              key={tld}
              className={cn(
                "flex items-center justify-between rounded-lg px-4 py-3",
                state === "available" ? "bg-success-soft" : "bg-canvas-secondary",
              )}
            >
              <span className="font-mono text-small text-fg">
                yourbusiness<span className="font-semibold">{tld}</span>
              </span>
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "text-micro font-semibold",
                    state === "available" ? "text-success" : "text-fg-muted",
                  )}
                >
                  {state}
                </span>
                <span className="tabular text-small font-semibold text-fg">
                  {price}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

/** Grow — a ConvoAI conversation with a handover. */
function GrowShowcase() {
  return (
    <Frame>
      <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-small font-bold text-white">
          C
        </span>
        <div>
          <p className="text-small font-semibold text-fg">ConvoAI</p>
          <p className="flex items-center gap-1.5 text-caption text-fg-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-success-fill" />
            Answering now
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-5 sm:p-6">
        <p className="max-w-[78%] rounded-2xl rounded-tl-md bg-canvas-secondary px-4 py-2.5 text-small text-fg-secondary">
          Hi — do you deliver to Brighton?
        </p>
        <p className="ml-auto max-w-[78%] rounded-2xl rounded-tr-md bg-primary px-4 py-2.5 text-small text-white">
          We do, next-day on orders before 4pm. Want me to check a postcode?
        </p>
        <p className="max-w-[78%] rounded-2xl rounded-tl-md bg-canvas-secondary px-4 py-2.5 text-small text-fg-secondary">
          BN1 4ZZ please
        </p>
        <div className="ml-auto flex max-w-[78%] flex-col gap-2 rounded-2xl rounded-tr-md bg-primary px-4 py-2.5">
          <p className="text-small text-white">
            Covered. Delivery is £3.95, free over £40.
          </p>
        </div>
        <p className="mt-1 flex items-center gap-2 rounded-lg bg-canvas-secondary px-3 py-2 text-caption text-fg-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-warning-fill" />
          Complex question → handed to a person
        </p>
      </div>
    </Frame>
  );
}

/** Manage — migration timeline with a staged checkpoint. */
function ManageShowcase() {
  const steps = [
    ["Files copied", "2,481 files", true],
    ["Database moved", "1 database, 84 MB", true],
    ["Email transferred", "6 mailboxes", true],
    ["Staging ready", "staging.yourbusiness.com", true],
    ["DNS switch", "Waiting for your go-ahead", false],
  ] as const;
  return (
    <Frame label="staging.yourbusiness.com">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="text-h4 text-fg">Migration</p>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-micro text-primary font-semibold">
            4 of 5
          </span>
        </div>
        <ol className="mt-5 flex flex-col">
          {steps.map(([label, detail, done], i) => (
            <li key={label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    done
                      ? "bg-success-fill text-white"
                      : "bg-canvas-inset text-fg-muted",
                  )}
                >
                  {done ? (
                    <svg viewBox="0 0 16 16" className="h-3 w-3">
                      <path
                        d="m3.5 8.5 3 3 6-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      "w-px flex-1",
                      done ? "bg-success-fill/40" : "bg-line",
                    )}
                  />
                )}
              </div>
              <div className="pb-5">
                <p
                  className={cn(
                    "text-small font-medium",
                    done ? "text-fg" : "text-fg-muted",
                  )}
                >
                  {label}
                </p>
                <p className="mt-0.5 font-mono text-caption text-fg-muted">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Frame>
  );
}
