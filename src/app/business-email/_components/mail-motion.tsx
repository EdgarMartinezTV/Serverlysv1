"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Motion for the /business-email mockups. The mockups themselves are the
 * real high-fidelity UI images; this layer only moves them and adds live
 * events on top (a new email arriving, a message sending), drawn in the same
 * visual language so the overlays read as part of the product.
 *
 * Everything starts when the mockup scrolls into view, loops only while it is
 * on screen, and is off entirely under prefers-reduced-motion (the CSS for
 * every keyframe used here is guarded in globals.css, and the loops below
 * check the media query before starting).
 */

function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, seen, visible };
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    const raf = requestAnimationFrame(sync);
    mq.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", sync);
    };
  }, []);
  return reduced;
}

/** Steps through `count` states every `ms` while `active`. */
function useCycle(count: number, ms: number, active: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % count), ms);
    return () => window.clearInterval(t);
  }, [count, ms, active]);
  return i;
}

type Variant = "rise" | "left" | "right" | "pop" | "tilt";

const START: Record<Variant, string> = {
  rise: "translate-y-10 opacity-0",
  left: "-translate-x-12 opacity-0",
  right: "translate-x-12 opacity-0",
  pop: "scale-[0.85] opacity-0",
  tilt: "[transform:perspective(1400px)_rotateX(14deg)_translateY(40px)] opacity-0",
};

/**
 * Enters once when scrolled into view; `float` then bobs it gently forever
 * (on screen only). Wrap any mockup image.
 */
export function MotionIn({
  children,
  variant = "rise",
  delay = 0,
  float = false,
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  float?: boolean;
  className?: string;
}) {
  const { ref, seen, visible } = useInView<HTMLDivElement>(0.2);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        seen ? "[transform:none] opacity-100" : START[variant],
        "motion-reduce:[transform:none] motion-reduce:opacity-100",
        className,
      )}
    >
      <div className={cn(float && seen && visible && "animate-[mailFloat_7s_ease-in-out_infinite]")} style={{ animationDelay: `${delay + 900}ms` }}>
        {children}
      </div>
    </div>
  );
}

/* ── Live overlays ─────────────────────────────────────────────────────── */

const ARRIVALS = [
  { initials: "LT", tone: "bg-[#2563eb]", name: "Lucas Taylor", subject: "Re: revised quote for phase 2" },
  { initials: "AP", tone: "bg-[#7c5cff]", name: "Avery Patel", subject: "Next steps for the Q3 campaign" },
  { initials: "DS", tone: "bg-[#0d9488]", name: "Daniel Smith", subject: "Onboarding documents attached" },
];

/** A notification card sliding in over the inbox, cycling senders. */
function ArrivalToast({ active }: { active: boolean }) {
  const i = useCycle(ARRIVALS.length, 4200, active);
  const a = ARRIVALS[i];
  return (
    <div
      key={i}
      aria-hidden="true"
      className="absolute -right-3 top-[14%] w-[46%] min-w-[230px] animate-[mailToast_4200ms_cubic-bezier(0.16,1,0.3,1)_both] rounded-2xl bg-white/95 p-3.5 shadow-[0_24px_50px_-18px_rgb(15_23_42/0.45),0_0_0_1px_rgb(15_23_42/0.06)] backdrop-blur sm:-right-8"
    >
      <div className="flex items-start gap-3">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white", a.tone)}>
          {a.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-[13px] font-semibold text-[#111827]">{a.name}</span>
            <span className="shrink-0 text-[11px] text-[#9aa1ad]">now</span>
          </span>
          <span className="mt-0.5 block truncate text-[12.5px] text-[#4b5563]">{a.subject}</span>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
            <span className="size-1.5 rounded-full bg-primary" /> New email · jordan@brightleaf.co
          </span>
        </span>
      </div>
    </div>
  );
}

/** Hero: the inbox tilts up into place, then new mail keeps arriving. */
export function HeroInbox() {
  const { ref, seen, visible } = useInView<HTMLDivElement>(0.2);
  const reduced = useReducedMotion();
  return (
    <div ref={ref} className="relative">
      <div
        className={cn(
          "transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          seen ? "[transform:none] opacity-100" : START.tilt,
          "motion-reduce:[transform:none] motion-reduce:opacity-100",
        )}
      >
        <Image
          src="/email/inbox.webp"
          alt="The Serverlys webmail inbox, showing an email to jordan@brightleaf.co"
          width={1440}
          height={919}
          priority
          sizes="(min-width: 1024px) 680px, 100vw"
          className="relative h-auto w-full drop-shadow-[0_40px_60px_rgb(0_0_255/0.18)]"
        />
      </div>
      {seen && !reduced && <ArrivalToast active={visible} />}
    </div>
  );
}

/** Compose: rises in, then shows the message going out, on a loop. */
export function ComposeSend() {
  const { ref, seen, visible } = useInView<HTMLDivElement>(0.25);
  const reduced = useReducedMotion();
  const phase = useCycle(3, 1700, seen && visible && !reduced);
  return (
    <div ref={ref} className="relative mx-auto mt-14 max-w-[880px]">
      <div
        className={cn(
          "transition-[transform,opacity] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          seen ? "[transform:none] opacity-100" : START.rise,
          "motion-reduce:[transform:none] motion-reduce:opacity-100",
        )}
      >
        <Image
          src="/email/compose.webp"
          alt="Composing an email from jordan@brightleaf.co with a branded signature"
          width={1415}
          height={870}
          sizes="(min-width: 1024px) 880px, 100vw"
          className="h-auto w-full drop-shadow-[0_40px_70px_rgb(0_0_0/0.5)]"
        />
      </div>
      {seen && !reduced && (
        <div
          aria-hidden="true"
          className={cn(
            "absolute bottom-[3%] left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[#111827] py-2 pl-2.5 pr-4 text-[13px] font-medium text-white shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)] transition-[opacity,transform] duration-500",
            phase === 0 ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100",
          )}
        >
          {phase === 1 ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sending from jordan@brightleaf.co…
            </>
          ) : (
            <>
              <span className="flex size-5 items-center justify-center rounded-full bg-[#22c55e]">
                <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
              </span>
              Message sent · signature added
            </>
          )}
        </div>
      )}
    </div>
  );
}
