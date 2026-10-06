"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, MotionPathPlugin);

/**
 * "Make the right impression" — a pinned, scroll-scrubbed scene.
 *
 * GSAP owns the scroll: ScrollTrigger pins the stage and scrubs one
 * timeline — the headline assembles character by character (SplitText),
 * the compose window rotates up out of depth into a brand-blue spotlight,
 * four product facts dock around it, then the message is sent and a paper
 * plane leaves along a curve (MotionPathPlugin).
 * motion (motion.dev) owns the micro-interactions the timeline hands off
 * to: the "Message sent" confirmation and the chips' idle float.
 *
 * Brand only: brand-blue scale, cyan accent on dark, green for success.
 * Desktop and tablet (≥768px) with motion allowed get the pinned scene;
 * phones and prefers-reduced-motion get the final composition, still.
 */

const CHIPS = [
  {
    id: "from",
    pos: "left-[-36%] top-[8%]",
    from: { x: -140, y: 0 },
    icon: "M3 6h18v12H3ZM3 7l9 6 9-6",
    title: "Your own address",
    body: "jordan@brightleaf.co",
  },
  {
    id: "sig",
    pos: "right-[-36%] top-[26%]",
    from: { x: 160, y: 0 },
    icon: "M4 20h4L19 9l-4-4L4 16Z",
    title: "Signature added",
    body: "Name, title and website",
  },
  {
    id: "tls",
    pos: "left-[-36%] bottom-[22%]",
    from: { x: -120, y: 80 },
    icon: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5Z",
    title: "Encrypted with TLS",
    body: "Webmail, IMAP, POP3, SMTP",
  },
  {
    id: "apps",
    pos: "right-[-36%] bottom-[4%]",
    from: { x: 140, y: 80 },
    icon: "M7 3h10v18H7ZM11 18h2",
    title: "On every device",
    body: "Outlook, Apple Mail, phone",
  },
] as const;

export function ImpressionStage() {
  const root = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".js-headline", {
          type: "chars,words",
          mask: "chars",
        });

        gsap.from(split.chars, {
          yPercent: 110,
          rotate: 8,
          opacity: 0,
          stagger: 0.022,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from(".js-sub", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          delay: 0.35,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=2200",
            pin: true,
            scrub: 0.9,
            onUpdate: (self) => setSent(self.progress > 0.86),
          },
        });

        tl.from(
          ".js-spot",
          { scale: 0.3, opacity: 0, duration: 1.2, ease: "power2.out" },
          0.2,
        )
          .from(
            ".js-compose",
            {
              rotateX: 48,
              y: 260,
              scale: 0.72,
              opacity: 0,
              transformPerspective: 1600,
              transformOrigin: "50% 100%",
              duration: 1.4,
            },
            0.3,
          )
          .from(".js-grid", { opacity: 0, duration: 1 }, 0.3);

        CHIPS.forEach((c, i) => {
          tl.from(
            `.js-chip-${c.id}`,
            {
              ...c.from,
              opacity: 0,
              scale: 0.86,
              rotate: c.from.x < 0 ? -6 : 6,
              duration: 0.7,
              ease: "back.out(1.6)",
            },
            1.25 + i * 0.22,
          );
        });

        tl.to(
          ".js-compose",
          { y: -18, scale: 1.02, duration: 0.6, ease: "power2.inOut" },
          2.4,
        )
          .fromTo(
            ".js-sweep",
            { xPercent: -120, opacity: 0 },
            { xPercent: 120, opacity: 1, duration: 0.8, ease: "none" },
            2.45,
          )
          .fromTo(
            ".js-plane",
            { scale: 0.6 },
            {
              scale: 1.15,
              duration: 1.1,
              ease: "power2.in",
              motionPath: {
                path: [
                  { x: 0, y: 0 },
                  { x: 120, y: -90 },
                  { x: 340, y: -150 },
                  { x: 620, y: -380 },
                ],
                curviness: 1.4,
                autoRotate: 45,
              },
            },
            2.7,
          )
          .fromTo(
            ".js-plane",
            { opacity: 0 },
            { opacity: 1, duration: 0.12, ease: "none" },
            2.7,
          )
          .to(".js-plane", { opacity: 0, duration: 0.2 }, 3.65);

        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="relative isolate min-h-[100svh] overflow-hidden bg-canvas-abyss"
    >
      {/* Grid + spotlight */}
      <div
        aria-hidden="true"
        className="js-grid absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(70%_60%_at_50%_55%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="js-spot absolute left-1/2 top-[58%] -z-10 size-[min(1100px,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_0_255/0.55),rgb(31_85_255/0.22)_45%,transparent_72%)] blur-2xl"
      />

      <div className="mx-auto flex min-h-[100svh] max-w-[1280px] flex-col items-center justify-center px-5 py-14 sm:px-8 lg:px-10">
        <h2
          id="impression"
          className="js-headline text-center font-display text-[40px] font-normal leading-[1.05] tracking-[-0.03em] text-white sm:text-[56px] lg:text-[64px]"
        >
          Make the right <span className="text-brand-300">impression</span>
        </h2>
        <p className="js-sub mx-auto mt-5 max-w-[580px] text-center text-body-lg text-white/70">
          Every email you send says something about your business. Stand out with your
          own domain and a signature that reflects your brand.
        </p>

        {/* Stage */}
        <div className="relative mt-10 w-full max-w-[min(680px,calc((100svh-260px)*1.626))]">
          <div className="js-compose relative">
            <div className="relative overflow-hidden rounded-[18px]">
              <Image
                src="/email/compose.webp"
                alt="Composing an email from jordan@brightleaf.co with a branded signature"
                width={1415}
                height={870}
                sizes="(min-width: 1024px) 680px, 100vw"
                className="h-auto w-full"
              />
              {/* Light sweep at send */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 [mask-image:url(/email/compose.webp)] [mask-size:100%_100%]"
              >
                <span
                  aria-hidden="true"
                  className="js-sweep pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(100deg,transparent,rgb(255_255_255/0.45),transparent)] opacity-0"
                />
              </span>
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 translate-y-6 scale-95 rounded-[18px] bg-primary/50 blur-3xl"
            />
          </div>

          {/* Docking chips */}
          {CHIPS.map((c, i) => (
            <div
              key={c.id}
              className={`js-chip-${c.id} absolute z-10 hidden w-[230px] lg:block ${c.pos}`}
              aria-hidden="true"
            >
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{
                  duration: 5 + i * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
                className="flex items-center gap-3 rounded-2xl bg-white/[0.08] p-3 pr-4 text-left shadow-[0_24px_50px_-20px_rgb(0_0_0/0.7)] ring-1 ring-white/15 backdrop-blur-xl"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-primary text-white shadow-[0_8px_20px_-6px_rgb(0_0_255/0.8)]">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={c.icon} />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-small font-semibold text-white">
                    {c.title}
                  </span>
                  <span className="block truncate text-caption text-white/65">
                    {c.body}
                  </span>
                </span>
              </motion.div>
            </div>
          ))}

          {/* Paper plane, launched from the Send button */}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="js-plane absolute bottom-[12%] left-[14%] z-20 size-9 opacity-0 drop-shadow-[0_0_14px_rgb(95_139_255/0.9)]"
          >
            <path d="m3 11 18-8-6 18-3-7Z" fill="white" />
            <path d="m12 14 9-11" stroke="var(--color-brand-300)" strokeWidth="1.4" />
          </svg>

          {/* Confirmation (motion) */}
          <AnimatePresence>
            {sent && (
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, y: 18, scale: 0.9, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="absolute -bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-white py-2.5 pl-2.5 pr-5 text-small font-semibold text-fg shadow-[0_24px_60px_-16px_rgb(0_0_255/0.6)]"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 16,
                    delay: 0.08,
                  }}
                  className="flex size-7 items-center justify-center rounded-full bg-success-fill text-white"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3.5 8.5 3 3 6-7" />
                  </svg>
                </motion.span>
                Delivered from jordan@brightleaf.co
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
