"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { ComposeFilm } from "./compose-film";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * "Make the right impression".
 *
 * GSAP stages the entrance: the headline assembles character by character
 * (SplitText), the brand-blue spotlight blooms, the film rises up out of
 * depth and the fact cards fly in to dock beside it. From then on the
 * section plays like a video — ComposeFilm loops the whole send, from
 * addressing the message to it landing verified in the client's inbox —
 * while motion floats the cards.
 *
 * Brand only: brand-blue scale, cyan accent on dark, success green.
 * prefers-reduced-motion: no entrance; ComposeFilm shows a finished frame.
 */

const CHIPS = [
  {
    id: "from",
    side: "left",
    top: "10%",
    icon: "M3 6h18v12H3ZM3 7l9 6 9-6",
    title: "Your own address",
    body: "jordan@brightleaf.co",
  },
  {
    id: "sig",
    side: "right",
    top: "18%",
    icon: "M4 20h4L19 9l-4-4L4 16Z",
    title: "Branded signature",
    body: "Name, title and website",
  },
  {
    id: "tls",
    side: "left",
    top: "62%",
    icon: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5Z",
    title: "Encrypted with TLS",
    body: "Webmail, IMAP, POP3, SMTP",
  },
  {
    id: "apps",
    side: "right",
    top: "70%",
    icon: "M7 3h10v18H7ZM11 18h2",
    title: "On every device",
    body: "Outlook, Apple Mail, phone",
  },
] as const;

export function ImpressionStage() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".js-headline", {
          type: "chars,words",
          mask: "chars",
        });
        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: {
            trigger: root.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });
        tl.from(
          split.chars,
          { yPercent: 115, rotate: 7, opacity: 0, stagger: 0.022, duration: 0.9 },
          0,
        )
          .from(".js-sub", { y: 24, opacity: 0, duration: 0.8 }, 0.3)
          .from(
            ".js-spot",
            { scale: 0.35, opacity: 0, duration: 1.6, ease: "power2.out" },
            0.1,
          )
          .from(".js-grid", { opacity: 0, duration: 1.4 }, 0.2)
          .from(
            ".js-film",
            {
              rotateX: 32,
              y: 160,
              scale: 0.86,
              opacity: 0,
              transformPerspective: 1600,
              transformOrigin: "50% 100%",
              duration: 1.5,
            },
            0.35,
          )
          .from(
            ".js-chip-left",
            {
              x: -120,
              opacity: 0,
              rotate: -6,
              stagger: 0.18,
              duration: 1,
              ease: "back.out(1.5)",
            },
            0.95,
          )
          .from(
            ".js-chip-right",
            {
              x: 120,
              opacity: 0,
              rotate: 6,
              stagger: 0.18,
              duration: 1,
              ease: "back.out(1.5)",
            },
            1.05,
          );
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative isolate overflow-hidden bg-canvas-abyss">
      <div
        aria-hidden="true"
        className="js-grid absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(70%_60%_at_50%_60%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="js-spot absolute left-1/2 top-[62%] -z-10 size-[min(1200px,130vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_0_255/0.55),rgb(31_85_255/0.22)_45%,transparent_72%)] blur-2xl"
      />

      <div className="mx-auto flex max-w-[1280px] flex-col items-center px-5 pb-16 pt-20 sm:px-8 lg:px-10 lg:pt-28">
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

        <div className="relative mt-12 w-full max-w-[780px] sm:mt-14">
          <div className="js-film relative">
            <ComposeFilm />
          </div>

          {CHIPS.map((c, i) => (
            <div
              key={c.id}
              aria-hidden="true"
              className={`js-chip-${c.side} absolute z-10 hidden w-[230px] xl:block ${c.side === "left" ? "right-[calc(100%+20px)]" : "left-[calc(100%+20px)]"}`}
              style={{ top: c.top }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5 + i * 0.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
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
        </div>
      </div>
    </div>
  );
}
