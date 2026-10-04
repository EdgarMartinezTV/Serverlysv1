"use client";

import { useState } from "react";
import { CtaButton, Grid, Headline } from "@/components/ref/kit";
import { cn } from "@/lib/utils";
import { MockPhoto } from "@/components/ui/mock-photo";

const MODES = {
  fresh: {
    tab: "Starting fresh",
    title: "Build your site your way",
    body: "WordPress in one click, WooCommerce for a store, or your own PHP and HTML. Or hand the whole build to our team and get it back on hosting that keeps it fast.",
    cta: { label: "Choose your plan", href: "#pricing" },
  },
  move: {
    tab: "Already have a website?",
    title: "We move it for you, free",
    body: "Send us the current host login or just the domain. We copy the site, database and email to staging, you check it, and DNS switches only when you say.",
    cta: { label: "See how migration works", href: "/migrations" },
  },
} as const;

type Mode = keyof typeof MODES;

/** "Launch today, or switch without the stress" — two modes, one panel. */
export function Launch() {
  const [mode, setMode] = useState<Mode>("fresh");
  const m = MODES[mode];

  return (
    <section
      id="build"
      aria-labelledby="cloud-launch-heading"
      className="scroll-mt-14 bg-canvas py-16 lg:py-24"
    >
      <Grid>
        <Headline
          id="cloud-launch-heading"
          title="Launch your website today. Or switch without the stress."
          description="Choose how you want to build, or move your existing site to Serverlys with help every step of the way."
        />

        <div
          role="tablist"
          aria-label="How are you starting?"
          className="mx-auto mt-8 flex w-fit gap-1 rounded-full bg-canvas-secondary p-1 ring-1 ring-line"
        >
          {(Object.keys(MODES) as Mode[]).map((k) => (
            <button
              key={k}
              role="tab"
              type="button"
              aria-selected={mode === k}
              onClick={() => setMode(k)}
              className={cn(
                "rounded-full px-5 py-2 text-small font-semibold transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                mode === k
                  ? "bg-white text-fg shadow-e1"
                  : "text-fg-secondary hover:text-fg",
              )}
            >
              {MODES[k].tab}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          className="mt-8 grid overflow-hidden rounded-3xl bg-canvas-secondary lg:grid-cols-2"
        >
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <h3 className="display-md text-fg">{m.title}</h3>
            <p className="mt-4 max-w-[480px] text-body text-fg-secondary">{m.body}</p>
            <div className="mt-7">
              <CtaButton href={m.cta.href}>{m.cta.label}</CtaButton>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="relative min-h-[320px] overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 p-8 sm:p-10"
          >
            <div className="absolute inset-y-0 right-0 w-1/2 bg-white/[0.07] [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%)]" />
            {mode === "fresh" ? <SiteMock /> : <MoveMock />}
          </div>
        </div>
      </Grid>
    </section>
  );
}

function SiteMock() {
  return (
    <div className="relative mx-auto max-w-[460px] overflow-hidden rounded-xl bg-white shadow-e5">
      <div className="flex items-center justify-between px-4 py-3 text-micro text-fg-secondary">
        <span className="font-semibold tracking-[0.2em] text-fg">NORTHLIGHT</span>
        <span className="flex gap-2">
          <span className="rounded-full bg-canvas-secondary px-2.5 py-0.5">Work</span>
          <span className="rounded-full bg-canvas-secondary px-2.5 py-0.5">
            Contact
          </span>
        </span>
      </div>
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0">
          <MockPhoto src="chair" className="h-full" sizes="460px" position="center 70%" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />
        <div className="absolute top-1/2 left-5 -translate-y-1/2">
          <p className="text-[38px] leading-none font-bold tracking-[-0.04em] text-fg sm:text-[46px]">Studio</p>
          <p className="mt-1 text-small text-fg-secondary">Interiors that feel lived in.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 p-1.5">
        {(
          [
            ["sofa", "Hollis loft"],
            ["house", "Cedar house"],
            ["restaurant", "Ember kitchen"],
          ] as const
        ).map(([src, name]) => (
          <div key={src}>
            <MockPhoto src={src} className="h-20 rounded-md" />
            <p className="px-1 pt-1 pb-0.5 text-[10px] font-medium text-fg">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoveMock() {
  const steps = [
    ["Copy site and database", true],
    ["Copy email", true],
    ["You check staging", true],
    ["Switch DNS", false],
  ] as const;
  return (
    <div className="relative mx-auto max-w-[400px] rounded-xl bg-white p-6 shadow-e5">
      <p className="text-small font-semibold text-fg">Moving yoursite.com</p>
      <p className="text-micro text-fg-muted">From your old host to Serverlys</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-brand-100">
        <span className="block h-full w-3/4 rounded-full bg-primary" />
      </div>
      <ul className="mt-5 space-y-3">
        {steps.map(([s, done]) => (
          <li key={s} className="flex items-center justify-between text-small">
            <span className={done ? "text-fg" : "text-fg-muted"}>{s}</span>
            {done ? (
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-success-fill text-white">
                <svg viewBox="0 0 16 16" fill="none" className="size-3">
                  <path
                    d="m3.5 8.5 3 3 6-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            ) : (
              <span className="text-micro font-semibold text-primary">
                When you say
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
