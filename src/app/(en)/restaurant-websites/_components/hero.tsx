import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "../_demo/menu";
import { PATHS, type LandingCopy, type Locale } from "../_i18n";
import { LaptopMock, PhoneMock, lumbreSerif } from "./device-mocks";

/**
 * Cinematic hero: a darkened kitchen-fire photograph, the headline on the
 * left, and the Lumbre demo on a desktop browser and a phone on the right.
 *
 * LCP: the headline. Nothing above the fold fades in — the device stage only
 * TRANSLATES into place (`rw-rise`, opacity untouched), so its images paint on
 * the first frame and are never held back by an animation (the LCP/reveal
 * trap in globals.css).
 */
export function RestaurantHero({ copy, locale }: { copy: LandingCopy; locale: Locale }) {
  const h = copy.hero;
  const other: Locale = locale === "en" ? "es" : "en";
  return (
    <section
      aria-labelledby="rw-hero-heading"
      className="relative isolate overflow-hidden bg-[#0a0b0e] text-white"
    >
      {/* Decorative and blurred: desktop only. On a phone it was the LCP element
          (5.9s on slow 4G) while adding nothing the gradient does not. */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 hidden lg:block">
        <Image
          src="/restaurant/room-industrial.jpg"
          alt=""
          fill
          sizes="(min-width: 1024px) 100vw, 16px"
          loading="eager"
          className="object-cover opacity-35 blur-[2px]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_78%_45%,rgb(226_100_43/0.28),transparent_70%),linear-gradient(90deg,#0a0b0e_0%,rgb(10_11_14/0.92)_38%,rgb(10_11_14/0.55)_70%,rgb(10_11_14/0.8)_100%),linear-gradient(180deg,transparent_60%,#0a0b0e_100%)]"
      />

      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-14 px-5 pt-12 pb-16 sm:px-8 sm:pt-16 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-10 lg:pt-16 lg:pb-20">
        <div className="max-w-[620px]">
          <div className="flex flex-wrap items-center gap-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3.5 py-1.5 text-[13px] font-medium text-white/90 ring-1 ring-white/15">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#e2642b]" />
              {h.kicker}
            </p>
            <Link
              href={PATHS[other].landing}
              hrefLang={other}
              lang={other}
              aria-label={copy.switchTo.aria}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-white/75 underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
              </svg>
              {copy.switchTo.label}
            </Link>
          </div>

          <h1
            id="rw-hero-heading"
            className={cn(
              lumbreSerif.className,
              "mt-7 text-[52px] leading-[0.98] font-normal tracking-[-0.03em] text-white sm:text-[72px] xl:text-[88px]",
            )}
          >
            {h.title}
          </h1>
          <p className="mt-6 max-w-[540px] text-[17px] leading-[1.6] text-white/80 sm:text-[19px]">
            {h.lede}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#review"
              className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-white px-7 text-center text-body font-semibold text-[#0b1530] transition-colors duration-fast hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {h.ctaReview}
            </a>
            <Link
              href={PATHS[locale].demo}
              className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full px-7 text-body font-semibold text-white ring-1 ring-inset ring-white/35 transition-colors duration-fast hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {h.ctaDemo}
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 transition-transform duration-normal group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10h12m-5-5 5 5-5 5" />
              </svg>
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-5 gap-y-2.5 text-[14px] text-white/75">
            {h.points.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 text-[#34d399]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 10.5 3 3 7-7" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Device stage */}
        <div aria-hidden="true" className="relative mx-auto w-full max-w-[680px] lg:max-w-none">
          <div className="rw-rise relative pr-[14%] pb-[16%]">
            <LaptopMock mock={h.mock} eager />
          </div>
          <div className="rw-rise rw-delay-1 absolute right-0 bottom-0 w-[31%]">
            <div className="animate-float-slow">
              <PhoneMock mock={h.mock} categories={CATEGORIES.map((c) => c.label[locale])} />
            </div>
          </div>

          <Chip
            className="rw-pop rw-delay-2 top-[-4%] right-[2%] sm:top-[-2%]"
            tone="green"
            title={h.chips.order}
            detail={h.chips.orderDetail}
            icon="M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2"
          />
          <Chip
            className="rw-pop rw-delay-3 bottom-[4%] left-[-2%] sm:left-[2%]"
            tone="ember"
            title={h.chips.booking}
            detail={h.chips.bookingDetail}
            icon="M4 6h16v14H4zM4 10h16M8 3v4m8-4v4"
          />
          <div className="rw-pop rw-delay-4 absolute top-[-7%] left-[3%] hidden max-w-[260px] items-start gap-2.5 rounded-2xl bg-white/95 px-3.5 py-3 text-[#0b1530] shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)] sm:flex">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
              AI
            </span>
            <span className="text-[13px] leading-snug font-medium">{h.chips.ai}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({
  className,
  tone,
  title,
  detail,
  icon,
}: {
  className: string;
  tone: "green" | "ember";
  title: string;
  detail: string;
  icon: string;
}) {
  return (
    <div
      className={cn(
        "absolute flex items-center gap-3 rounded-2xl bg-white px-3.5 py-2.5 text-[#0b1530] shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)]",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          tone === "green" ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#ffedd5] text-[#c2410c]",
        )}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </span>
      <span>
        <span className="block text-[12px] leading-tight font-semibold sm:text-[13px]">{title}</span>
        <span className="block text-[11px] leading-tight text-[#5b6472] sm:text-[12px]">{detail}</span>
      </span>
    </div>
  );
}
