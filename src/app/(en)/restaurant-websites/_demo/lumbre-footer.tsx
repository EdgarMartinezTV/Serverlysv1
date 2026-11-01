"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { LuxCopy } from "./copy-lux";
import { formatTime } from "./availability";
import { HOURS } from "./menu";
import { trackDemo, useLumbre, useNow } from "./state";
import { CHAR, display } from "./theme";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SOCIAL = [
  ["Instagram", "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5h.01"],
  ["TikTok", "M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.3 4 5 4"],
  ["Facebook", "M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z"],
] as const;

/**
 * J · Footer. Brand, the section index, live hours (today highlighted), the
 * illustrative location and contact, social marks and a demo newsletter.
 *
 * `id="visit"` and its <h2> are what the assistant's "See hours and location"
 * action scrolls to and focuses (state.tsx goTo).
 *
 * Fiction is labelled at the point of use: the address is "illustrative", the
 * social buttons say their profiles are illustrative instead of linking to
 * accounts that may belong to someone real, and the newsletter says nothing
 * was saved.
 */
export function LumbreFooter({ lux }: { lux: LuxCopy }) {
  const { locale } = useLumbre();
  const f = lux.footer;
  const n = lux.nav;
  const now = useNow();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");
  const [socialNote, setSocialNote] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) return setStatus("error");
    setStatus("done");
    setEmail("");
    trackDemo("newsletter_signup", locale);
  };

  const heading = "font-display text-[11px] font-semibold tracking-[0.24em] text-[#C8A97E] uppercase";

  return (
    <footer className="lb-grain overflow-hidden pt-28 pb-10 text-[#F4EFE6]" style={{ background: CHAR }}>
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className={cn(display.className, "text-[44px] leading-none tracking-[0.3em]")}>LUMBRE</p>
            <p className={cn(display.className, "mt-4 text-[22px] text-[#F4EFE6]/70 italic")}>{f.tagline}</p>

            <form onSubmit={subscribe} noValidate className="mt-12 max-w-[380px]">
              <h2 className={heading}>{f.newsletterTitle}</h2>
              <p className="mt-3 text-[14px] leading-[1.6] text-[#9C9A90]">{f.newsletterBody}</p>
              <div className="mt-5 flex items-end gap-3 border-b border-[#F4EFE6]/25 focus-within:border-[#C8A97E]">
                <label htmlFor="lumbre-newsletter" className="sr-only">
                  {f.emailLabel}
                </label>
                <input
                  id="lumbre-newsletter"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder={f.emailLabel}
                  aria-invalid={status === "error" || undefined}
                  aria-describedby="lumbre-newsletter-status"
                  className="h-12 min-w-0 flex-1 border-0 bg-transparent px-0 text-[16px] text-[#F4EFE6] placeholder:text-[#9C9A90] focus:ring-0 focus:outline-none"
                />
                <button type="submit" className="h-12 shrink-0 font-display text-[12px] font-semibold tracking-[0.18em] text-[#C8A97E] uppercase hover:text-[#F4EFE6] focus-visible:outline-2 focus-visible:outline-[#C8A97E]">
                  {f.subscribe}
                </button>
              </div>
              <p id="lumbre-newsletter-status" role="status" className={cn("mt-3 min-h-[20px] text-[13px]", status === "error" ? "text-[#f0a58f]" : "text-[#9C9A90]")}>
                {status === "error" ? f.invalidEmail : status === "done" ? f.subscribed : ""}
              </p>
            </form>
          </div>

          <nav aria-label={f.explore} className="lg:col-span-2 lg:col-start-6">
            <h2 className={heading}>{f.explore}</h2>
            <ul className="mt-5 flex flex-col gap-3 text-[15px]">
              {(
                [
                  ["#story", n.story],
                  ["#menu", n.menu],
                  ["#fire", n.fire],
                  ["#private", n.privateDining],
                  ["#reserve", n.reserve],
                  ["#gallery", n.gallery],
                ] as const
              ).map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-[#F4EFE6]/80 transition-colors hover:text-[#C8A97E] focus-visible:outline-2 focus-visible:outline-[#C8A97E]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section id="visit" aria-labelledby="lumbre-visit-heading" className="lg:col-span-5 lg:col-start-8">
            <h2 id="lumbre-visit-heading" className={cn(display.className, "text-[40px] leading-none outline-none")}>
              {f.visitTitle}
            </h2>
            <div className="mt-8 grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className={heading}>{f.hours}</h3>
                <table className="mt-4 w-full text-[14px]">
                  <caption className="sr-only">{f.hours}</caption>
                  <tbody>
                    {[2, 3, 4, 5, 6, 0, 1].map((d) => {
                      const h = HOURS[d];
                      const isToday = now?.getDay() === d;
                      return (
                        <tr key={d} aria-current={isToday ? "date" : undefined} className="border-b border-[#F4EFE6]/8">
                          <th scope="row" className={cn("py-2 text-left font-normal", isToday ? "text-[#C8A97E]" : "text-[#F4EFE6]/75")}>
                            {f.days[d]}
                            {isToday && <span className="sr-only"> ({f.today})</span>}
                          </th>
                          <td className={cn("py-2 text-right tabular-nums", isToday ? "text-[#C8A97E]" : "text-[#F4EFE6]/90")}>
                            {h ? `${formatTime(h.open)} – ${formatTime(h.close)}` : f.closed}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className={heading}>{f.contact}</h3>
                <address className="mt-4 flex flex-col gap-2 text-[15px] not-italic">
                  <span>{f.address}</span>
                  <a href="tel:+13055550142" className="text-[#F4EFE6]/85 hover:text-[#C8A97E]">
                    {f.phone}
                  </a>
                  <a href={`mailto:${f.email}`} className="text-[#F4EFE6]/85 hover:text-[#C8A97E]">
                    {f.email}
                  </a>
                </address>
                <p className="mt-4 text-[12px] leading-[1.6] text-[#9C9A90]">{f.addressNote}</p>

                <h3 className={cn(heading, "mt-8")}>{f.follow}</h3>
                <ul className="mt-4 flex gap-2">
                  {SOCIAL.map(([name, path]) => (
                    <li key={name}>
                      <button
                        type="button"
                        onClick={() => setSocialNote(true)}
                        aria-label={`${name}: ${f.socialNote}`}
                        className="flex size-11 items-center justify-center rounded-full ring-1 ring-[#F4EFE6]/20 transition-colors hover:bg-[#F4EFE6]/10 focus-visible:outline-2 focus-visible:outline-[#C8A97E]"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d={path} />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
                <p role="status" className="mt-3 min-h-[18px] text-[12px] text-[#9C9A90]">
                  {socialNote ? f.socialNote : ""}
                </p>
              </div>
            </div>
            <div className="relative mt-10 aspect-[16/7] overflow-hidden ring-1 ring-[#F4EFE6]/10" role="img" aria-label={f.mapLabel}>
              <svg viewBox="0 0 640 280" aria-hidden="true" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
                <rect width="640" height="280" fill="#171a17" />
                <g stroke="#232723" strokeWidth="16">
                  <path d="M-10 70H650M-10 200H650M140-10v300M420-10v300" />
                </g>
                <g stroke="#2c312b" strokeWidth="5">
                  <path d="M-10 135H650M280-10v300M560-10v300M40-10l160 300" />
                </g>
                <rect x="300" y="84" width="96" height="40" fill="#696D55" opacity="0.35" />
                <rect x="452" y="212" width="120" height="52" fill="#3a3f36" opacity="0.6" />
              </svg>
              <span className="absolute top-[44%] left-[54%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
                <span className={cn(display.className, "bg-[#C8A97E] px-3 py-1 text-[14px] tracking-[0.3em] text-[#111411]")}>LUMBRE</span>
                <span className="h-5 w-px bg-[#C8A97E]" />
                <span className="size-2.5 rounded-full bg-[#C8A97E] ring-4 ring-[#C8A97E]/25" />
              </span>
            </div>
          </section>
        </div>

        <p aria-hidden="true" className={cn(display.className, "mt-24 text-center text-[clamp(72px,19vw,300px)] leading-[0.8] font-light tracking-[0.12em] text-[#F4EFE6]/[0.06] select-none")}>
          LUMBRE
        </p>
        <div className="mt-10 flex flex-col gap-3 border-t border-[#F4EFE6]/10 pt-8 text-[12px] leading-[1.6] text-[#9C9A90] lg:flex-row lg:justify-between">
          <p className="max-w-[760px]">{f.legal}</p>
          <p className="shrink-0">{f.credits}</p>
        </div>
      </div>
    </footer>
  );
}
