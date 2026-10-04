import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SeraMark } from "@/components/sera/sera-mark";
import { MockPhoto } from "@/components/ui/mock-photo";

/**
 * Homepage hero — 2026-10-03 re-composition.
 *
 * The domain search was removed from the hero on Edgar's request (same day).
 * Domain search lives on /domain-name and /register-domain.
 *
 * Order, top to bottom: one centred headline, one line of support, ONE button, the
 * guarantee, and a row of four product cards that the band's bottom edge
 * crops — so the page visibly continues below the fold.
 *
 * ⚠ BRAND BLUE, NOT VIOLET. The light pools are the logo blue at different
 * alphas over the abyss navy; violet was removed from this band once already.
 *
 * ⚠ THE CARDS ARE CODE. Same rule as the Launch row: no stock photography,
 * no fake screenshots with garbled text. Each card is one honest product
 * moment (a Sera prompt, a domain, a store, Sera's greeting) drawn in the
 * site's own components and type, so it is sharp at every width.
 *
 * TrustBar used to overlap this band from below; it was removed from the
 * homepage in the same pass (its four facts are in the hero's guarantee line,
 * the promo card and the pricing strip), so the bottom padding is no longer
 * paired with anything.
 */
export function Hero() {
  return (
    <section className="relative isolate -mt-18 overflow-hidden bg-canvas-abyss">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_100%,rgb(0_0_255/0.75)_0%,transparent_70%),radial-gradient(45%_40%_at_85%_70%,rgb(31_85_255/0.45)_0%,transparent_70%),radial-gradient(40%_35%_at_10%_20%,rgb(34_126_255/0.18)_0%,transparent_70%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-dark opacity-60" />

      <Container width="wide" className="relative pt-36 sm:pt-44">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="display-xl text-white">
            Everything online.
            <span className="block">One honest price.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[520px] text-body-lg text-fg-on-dark-secondary">
            Hosting, domains and AI that answers your customers, all in one place. The
            renewal price is shown before you buy.
          </p>

          <div className="mt-8">
            <Button href="/pricing" variant="inverse" size="lg">
              Choose a plan
            </Button>
          </div>

          <p className="mt-5 flex items-center gap-2 text-small text-fg-on-dark-secondary">
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 shrink-0">
              <path
                d="M8 1.5 2.75 3.5v4c0 3.2 2.2 5.6 5.25 7 3.05-1.4 5.25-3.8 5.25-7v-4L8 1.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="m5.75 8.1 1.6 1.6 2.9-3.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            30-day money-back guarantee · Free migration
          </p>
        </div>

        <HeroCollage />
      </Container>
    </section>
  );
}

/* ── The collage ──────────────────────────────────────────────────────────── */

function HeroCollage() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto mt-12 grid h-[230px] max-w-[1160px] grid-cols-[1fr] gap-4 overflow-hidden sm:mt-20 sm:h-[260px] sm:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_2.1fr_1fr_1fr]"
    >
      {/* 1 · A Sera prompt */}
      <div className="relative hidden overflow-hidden rounded-t-2xl bg-brand-100 lg:block">
        <div className="absolute inset-0">
          <MockPhoto src="bread" className="h-full" sizes="280px" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 to-transparent" />
        <div className="absolute top-[40%] left-5 -right-6 flex items-center gap-2 rounded-xl bg-white py-3 pr-3 pl-4 shadow-e3 ring-1 ring-brand-300">
          <span className="truncate text-small text-fg">Create a website for my bakery</span>
        </div>
      </div>

      {/* 2 · A domain being chosen */}
      <div className="relative overflow-hidden rounded-t-2xl bg-[linear-gradient(160deg,var(--color-brand-300),var(--color-brand-100)_60%,white)] p-4 ring-4 ring-white/10 sm:col-start-2 lg:col-start-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-micro font-semibold text-fg backdrop-blur">
          <SeraMark className="h-3.5 w-3.5" /> Launch
        </span>
        <div className="mt-6 flex items-stretch gap-2 sm:mt-8">
          <div className="flex flex-1 items-center rounded-l-xl bg-white px-5 py-4 shadow-e3">
            <span className="truncate text-[26px] leading-none tracking-[-0.02em] text-fg sm:text-[34px]">
              hearthbakery
            </span>
          </div>
          <div className="w-[38%] rounded-t-xl bg-white shadow-e3">
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-[24px] leading-none tracking-[-0.02em] text-fg sm:text-[30px]">.com</span>
              <svg viewBox="0 0 16 16" className="h-4 w-4 text-fg">
                <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <p className="px-4 pb-4 text-[24px] leading-none tracking-[-0.02em] text-fg-secondary sm:text-[30px]">.online</p>
          </div>
        </div>
      </div>

      {/* 3 · A store, already selling */}
      <div className="relative hidden overflow-hidden rounded-t-2xl bg-[linear-gradient(180deg,var(--color-brand-200),var(--color-brand-50))] p-4 lg:block">
        <ul className="mt-2 space-y-3">
          {(
            [
              ["Sourdough loaf", "$8", "bread"],
              ["Rye, sliced", "$7", "bread-sliced"],
              ["Flat white", "$4", "coffee"],
            ] as const
          ).map(([name, price, photo]) => (
            <li key={name} className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-e2">
              <MockPhoto src={photo} className="size-10 shrink-0 rounded-lg" />
              <span className="min-w-0 flex-1 truncate text-small font-medium text-fg">{name}</span>
              <span className="text-small text-fg-secondary">{price}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4 · Sera, ready */}
      <div className="relative hidden overflow-hidden rounded-t-2xl bg-[linear-gradient(180deg,var(--color-brand-100),white)] p-4 lg:block">
        <div className="flex flex-col items-center pt-3 text-center">
          <SeraMark className="h-9 w-9 text-primary" />
          <p className="mt-3 text-h4 text-fg">Hello</p>
          <p className="text-small text-fg-secondary">How can I help today?</p>
        </div>
        <ul className="mt-5 space-y-2">
          {["I want to move my site", "I need a store"].map((s) => (
            <li key={s} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-micro text-fg shadow-e1 ring-1 ring-line-subtle">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-fg-muted">
                <path d="M5 11 11 5M6.5 5H11v4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="truncate">{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
