import { Check, CtaButton, Grid, ShieldCheck } from "@/components/ref/kit";
import { formatPrice, lowestRate } from "@/data/pricing";
import { HERO } from "../_content";
import { MockPhoto } from "@/components/ui/mock-photo";

/**
 * Cloud hosting hero — 2026-10-03 rebuild.
 *
 * Text left (pill, headline, three checks, starting price, one button, the
 * guarantee); a coded product moment right: a browser with the site's domain,
 * a security chip, a cursor and a PageSpeed gauge. The photograph that used
 * to sit here (an AI image with fake UI) is gone, same rule as the homepage.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="cloud-hero-heading"
      className="overflow-hidden bg-canvas pt-12 pb-16 lg:pt-20 lg:pb-24"
    >
      <Grid>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <span className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-small font-medium text-primary">
              Up to 37% off managed cloud hosting
            </span>
            <h1 id="cloud-hero-heading" className="display-lg mt-5 text-fg">
              {HERO.title}
            </h1>
            <ul className="mt-6 flex flex-col gap-2.5">
              {HERO.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-body text-fg">
                  <Check className="size-4 shrink-0 text-success-fill" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-body text-fg">
              Starting at{" "}
              <span className="text-[22px] font-semibold tracking-[-0.02em]">
                {formatPrice(lowestRate)}
              </span>
              /mo
            </p>
            <div className="mt-5">
              <CtaButton href="#pricing">View plans</CtaButton>
            </div>
            <p className="mt-4 flex items-center gap-2 text-small text-fg-secondary">
              <ShieldCheck className="size-4 shrink-0" />
              {HERO.guarantee}
            </p>
          </div>

          <HeroVisual />
        </div>
      </Grid>
    </section>
  );
}

function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[560px] py-6">
      {/* The browser */}
      <div className="overflow-hidden rounded-2xl bg-brand-50 p-2.5 shadow-e4 ring-1 ring-brand-100">
        <div className="flex gap-1.5 px-2 pb-2.5 pt-1">
          <span className="size-2 rounded-full bg-brand-200" />
          <span className="size-2 rounded-full bg-brand-200" />
          <span className="size-2 rounded-full bg-brand-200" />
        </div>
        <div className="relative h-[300px] overflow-hidden rounded-xl sm:h-[340px]">
          <div className="absolute inset-0">
            <MockPhoto src="house" className="h-full" sizes="540px" position="center 60%" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-4 text-[11px] text-white/90">
            <span className="font-semibold tracking-[0.2em]">NORTHLIGHT</span>
            <span className="hidden gap-4 sm:flex"><span>Projects</span><span>Studio</span><span>Contact</span></span>
          </div>
          <div className="absolute inset-x-6 bottom-6 text-white">
            <p className="text-micro font-semibold tracking-[0.18em] uppercase opacity-80">Architecture · Austin, TX</p>
            <p className="mt-1 text-[30px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[38px]">Homes built<br />around light.</p>
            <span className="mt-3 inline-block rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold text-fg">View projects</span>
          </div>
        </div>
      </div>

      {/* Domain bar + security chip */}
      <div className="absolute top-14 -left-3 flex items-center gap-2 sm:-left-8">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white text-primary shadow-e3 ring-1 ring-brand-100">
          <ShieldCheck className="size-5" />
        </span>
        <span className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-2.5 shadow-e3 ring-1 ring-brand-100">
          <svg viewBox="0 0 24 24" fill="none" className="size-5 text-primary">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
          <span className="text-body-lg text-fg">northlight.studio</span>
        </span>
      </div>
      <svg
        viewBox="0 0 24 24"
        className="absolute top-[118px] left-[42%] size-10 drop-shadow-lg"
      >
        <path
          d="M5 3l14 7-6 2-2 6L5 3Z"
          fill="var(--color-fg)"
          stroke="white"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>

      {/* PageSpeed gauge */}
      <div className="absolute -right-2 bottom-0 w-36 rounded-2xl bg-white/95 p-4 text-center shadow-e4 ring-1 ring-brand-100 backdrop-blur sm:-right-6">
        <p className="text-small text-fg">PageSpeed</p>
        <div className="relative mx-auto mt-2 size-24">
          <svg viewBox="0 0 100 100" className="size-24 -rotate-[225deg]">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--color-canvas-secondary)"
              strokeWidth="9"
              strokeDasharray="188 252"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--color-success-fill)"
              strokeWidth="9"
              strokeDasharray="186 252"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[30px] font-semibold text-success">
            99
          </span>
        </div>
      </div>
    </div>
  );
}
