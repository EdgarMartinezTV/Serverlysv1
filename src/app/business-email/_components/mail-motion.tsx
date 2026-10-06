"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedAfterMount } from "./use-reduced";

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
  const reduced = useReducedAfterMount();
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
  const reduced = useReducedAfterMount();
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

export { EASE };
