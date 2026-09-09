"use client";

import { useId, useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { billing } from "@/data/company";
import { cn } from "@/lib/utils";

/**
 * Scale stepper.
 *
 * The target shows this section three times in slightly different states —
 * that is one section being stepped through, not three sections. Reproducing
 * it as three near-identical blocks would be padding; it is built here as a
 * real stepper with the selector as a toolbar along the bottom, matching the
 * target's icon row.
 *
 * The chart is illustrative of BEHAVIOUR — demand rising, capacity following —
 * not a measurement. It carries no axis values, because putting numbers on it
 * would imply telemetry we are not showing.
 */

type Step = {
  id: string;
  label: string;
  title: string;
  body: string;
  /** Demand curve, 0–100 across 12 points. */
  demand: readonly number[];
  /** Provisioned capacity at each point. */
  capacity: readonly number[];
  note: string;
};

const STEPS: readonly Step[] = [
  {
    id: "steady",
    label: "Steady",
    title: "Most requests never reach your server",
    body: "LiteSpeed answers from cache at the edge of the stack, so ordinary traffic costs you almost nothing and the app stays idle for it.",
    demand: [22, 26, 24, 28, 25, 30, 27, 26, 29, 25, 28, 26],
    capacity: [55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55],
    note: "Cache hit rate does the work",
  },
  {
    id: "spike",
    label: "A spike",
    title: "Capacity follows demand, not a support ticket",
    body: "A campaign lands or a post takes off. Capacity is added while it happens — you are not throttled, and there is no per-gigabyte overage waiting at the end of the month.",
    demand: [26, 30, 44, 68, 86, 92, 84, 71, 58, 44, 34, 29],
    capacity: [55, 55, 60, 78, 95, 98, 95, 82, 68, 58, 55, 55],
    note: "Absorbed automatically",
  },
  {
    id: "growth",
    label: "Sustained",
    title: "Move up a tier without moving house",
    body: "When the new level of traffic is the normal level, change tier from the panel. Same stack, same data, no migration and no downtime.",
    demand: [30, 38, 46, 52, 58, 62, 66, 64, 68, 70, 69, 72],
    capacity: [60, 60, 70, 70, 85, 85, 95, 95, 95, 95, 95, 95],
    note: "Upgrade in place",
  },
];

export function ScaleSteps() {
  const [active, setActive] = useState(STEPS[0].id);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const index = STEPS.findIndex((s) => s.id === active);
  const step = STEPS[index];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = STEPS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      setActive(STEPS[next].id);
      refs.current[next]?.focus();
    }
  };

  return (
    <section
      aria-labelledby="scale-heading"
      className="relative isolate overflow-hidden bg-canvas-deep py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(55%_60%_at_75%_0%,rgb(141_89_255/0.20)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(50%_50%_at_15%_100%,rgb(34_211_238/0.14)_0%,transparent_70%)]"
      />

      <Container className="relative">
        <Reveal className="max-w-2xl">
          <span className="font-mono text-caption uppercase text-accent-on-dark">
            Headroom
          </span>
          <h2 id="scale-heading" className="mt-5 text-h1 text-white">
            More power when you need it
          </h2>
          <p className="mt-5 max-w-xl text-body-lg text-fg-on-dark-secondary">
            The same plan behaves differently on a quiet Tuesday and on the day a
            campaign lands. Step through what actually happens.
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-12">
          <div className="overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-inset ring-white/10 backdrop-blur-sm">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:p-10">
              <LoadChart step={step} />

              <div
                role="tabpanel"
                id={`${baseId}-panel-${step.id}`}
                aria-labelledby={`${baseId}-tab-${step.id}`}
                className="flex flex-col justify-center"
              >
                <span className="font-mono text-caption uppercase text-fg-on-dark-muted">
                  Step {index + 1} of {STEPS.length}
                </span>
                <h3 className="mt-4 text-h3 text-white">{step.title}</h3>
                <p className="mt-4 text-body text-fg-on-dark-secondary">{step.body}</p>
                <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/8 px-3.5 py-1.5 font-mono text-caption uppercase text-accent-on-dark ring-1 ring-inset ring-white/12">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  {step.note}
                </p>
              </div>
            </div>

            {/* Selector, positioned as the target's bottom toolbar. */}
            <div
              role="tablist"
              aria-label="Traffic scenarios"
              onKeyDown={onKeyDown}
              className="flex gap-1 border-t border-white/10 bg-black/20 p-2 sm:p-3"
            >
              {STEPS.map((s, i) => {
                const selected = s.id === active;
                return (
                  <button
                    key={s.id}
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    role="tab"
                    type="button"
                    id={`${baseId}-tab-${s.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel-${s.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(s.id)}
                    className={cn(
                      "flex min-h-11 flex-1 items-center justify-center gap-2.5 rounded-xl px-4 text-small font-medium transition-colors duration-fast",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                      selected
                        ? "bg-white/12 text-white"
                        : "text-fg-on-dark-muted hover:bg-white/[0.06] hover:text-white",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md font-mono text-[0.5625rem]",
                        selected ? "bg-cyan-400 text-canvas-abyss" : "bg-white/10",
                      )}
                    >
                      {i + 1}
                    </span>
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={140} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="#plans" variant="inverse" size="lg">
            Compare plans
          </Button>
          <Button href={billing.sales} variant="inverseOutline" size="lg">
            Ask what your traffic needs
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}

/** Demand vs provisioned capacity. Shape only — deliberately unlabelled. */
function LoadChart({ step }: { step: Step }) {
  const W = 320;
  const H = 150;
  const toPath = (points: readonly number[]) =>
    points
      .map((v, i) => {
        const x = (i / (points.length - 1)) * W;
        const y = H - (v / 100) * H;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");

  const demandPath = toPath(step.demand);
  const capacityPath = toPath(step.capacity);

  return (
    <figure aria-hidden="true" className="flex flex-col">
      <figcaption className="mb-4 flex items-center gap-5">
        {[
          ["Demand", "bg-cyan-400"],
          ["Capacity", "bg-white/40"],
        ].map(([label, dot]) => (
          <span key={label} className="flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full", dot)} />
            <span className="font-mono text-caption uppercase text-fg-on-dark-muted">
              {label}
            </span>
          </span>
        ))}
      </figcaption>

      <div className="rounded-xl bg-black/25 p-4 ring-1 ring-inset ring-white/8">
        <svg
          viewBox={`0 -6 ${W} ${H + 12}`}
          className="h-44 w-full sm:h-56"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="demandFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-cyan-400)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-cyan-400)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1="0"
              x2={W}
              y1={H * f}
              y2={H * f}
              stroke="rgb(255 255 255 / 0.07)"
              strokeWidth="1"
            />
          ))}

          {/* Capacity — a stepped ceiling that follows demand. */}
          <path
            d={capacityPath}
            fill="none"
            stroke="rgb(255 255 255 / 0.45)"
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeLinejoin="round"
            className="transition-[d] duration-slow ease-entrance"
          />

          <path
            d={`${demandPath} L${W} ${H} L0 ${H} Z`}
            fill="url(#demandFill)"
            className="transition-[d] duration-slow ease-entrance"
          />
          <path
            d={demandPath}
            fill="none"
            stroke="var(--color-cyan-400)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="transition-[d] duration-slow ease-entrance"
          />
        </svg>
      </div>
    </figure>
  );
}
