"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/**
 * Scroll motion for the /business-email mockups, built with motion
 * (motion.dev) after the reference's treatment: spring entrances, mockups
 * that settle as they scroll into place, and floating cards on a slower
 * parallax layer than the image they sit on. All of it is off under
 * prefers-reduced-motion (motion's useReducedMotion), where everything
 * renders in its final position.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

type Variant = "rise" | "left" | "right" | "pop";
const FROM: Record<Variant, Record<string, number>> = {
  rise: { y: 48, opacity: 0 },
  left: { x: -56, opacity: 0 },
  right: { x: 56, opacity: 0 },
  pop: { scale: 0.82, opacity: 0, y: 20 },
};

/** Spring entrance on scroll into view. */
export function MotionIn({
  children,
  variant = "rise",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : FROM[variant]}
      whileInView={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 18,
        mass: 0.9,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A layer that drifts against the scroll — `speed` px of travel across the
 * element's pass through the viewport. Floating cards use it so they move
 * independently of the photo behind them.
 */
export function Parallax({
  children,
  speed = 60,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  return (
    <motion.div ref={ref} style={reduced ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Compose window: scales and lifts into place as it scrolls up the page,
 * then loops the message going out — Sending… → Message sent.
 */
export function ComposeSend() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { amount: 0.4 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [16, 0]);

  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!inView || reduced) return;
    const t = window.setInterval(() => setPhase((p) => (p + 1) % 3), 1800);
    return () => window.clearInterval(t);
  }, [inView, reduced]);

  return (
    <div ref={ref} className="relative mx-auto mt-14 max-w-[880px]">
      <motion.div
        style={reduced ? undefined : { scale, y, rotateX, transformPerspective: 1600 }}
      >
        <Image
          src="/email/compose.webp"
          alt="Composing an email from jordan@brightleaf.co with a branded signature"
          width={1415}
          height={870}
          sizes="(min-width: 1024px) 880px, 100vw"
          className="h-auto w-full drop-shadow-[0_40px_70px_rgb(0_0_0/0.5)]"
        />
      </motion.div>
      {!reduced && (
        <AnimatePresence mode="wait">
          {phase > 0 && (
            <motion.div
              key={phase}
              aria-hidden="true"
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="absolute bottom-[3%] left-1/2 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full bg-[#111827] py-2 pl-2.5 pr-4 text-[13px] font-medium text-white shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)]"
            >
              {phase === 1 ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending from jordan@brightleaf.co…
                </>
              ) : (
                <>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="flex size-5 items-center justify-center rounded-full bg-[#22c55e]"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="size-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m3.5 8.5 3 3 6-7" />
                    </svg>
                  </motion.span>
                  Message sent · signature added
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export { EASE };
