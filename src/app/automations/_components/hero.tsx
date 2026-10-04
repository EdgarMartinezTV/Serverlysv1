import { Check, CtaButton, Grid, ShieldCheck } from "@/components/ref/kit";
import { HERO } from "../_content";
import { HeroCanvas } from "./hero-canvas";

/**
 * Hero.
 *
 * Same geometry as the other two reference pages — a 500px copy column against
 * a `flex-1 max-w-[700px]` media column inside `justify-between`, which is what
 * produces the reference's 80px gutter at 1440 off one rule. Measured on the
 * reference at 1440: overline 20/28 semibold, h1 48/56 regular at -0.24px,
 * bullets 16/24 on a 32px pitch, a 48px button, guarantee 16/24.
 *
 * Unlike /cloud-hosting and /ecommerce-hosting, the h1 here IS the big line —
 * the reference marks the discount overline as a plain heading and the product
 * line as the h1, and that is also the line carrying the commercial keyword.
 *
 * The reference's Trustpilot proof row sat under the art and is gone: we have
 * no Trustpilot profile, so it was a claim about someone else's reputation.
 *
 * The h1 is the big line. It carries the proposition — the daily work happening
 * without anyone remembering — rather than a product name, because that is what
 * someone searching for this is actually describing to themselves.
 */
export function Hero() {
  return (
    <section aria-labelledby="n8n-hero-heading" className="relative isolate overflow-hidden bg-canvas-dark pt-9 pb-14 md:pb-16 xl:pb-20">
      {/* Brand light behind the workflow, the reference's purple glow in our blue. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(45%_70%_at_78%_55%,rgb(0_0_255/0.35),transparent_70%)]" />
      <Grid>
        <div className="flex flex-col items-stretch gap-8 xl:flex-row xl:items-center xl:justify-between xl:gap-x-20">
          <div className="xl:w-[580px] xl:shrink-0">
            <p className="mb-2 text-[18px] leading-[26px] font-semibold tracking-[-0.09px] text-fg-on-dark lg:text-[20px] lg:leading-7 lg:tracking-[-0.1px]">
              {HERO.eyebrowPrefix}
              <span className="text-primary-on-dark">{HERO.eyebrowAccent}</span>
              {HERO.eyebrowSuffix}
            </p>

            <h1
              id="n8n-hero-heading"
              className="display-lg mb-6 text-fg-on-dark"
            >
              {HERO.title}
            </h1>

            <ul className="mb-[22px] flex flex-col gap-2">
              {HERO.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-body text-fg-on-dark">
                  <Check className="size-5 shrink-0 text-success-fill" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <CtaButton href="#how-it-works" tone="on-dark" className="w-full xl:w-auto">
              {HERO.cta}
            </CtaButton>

            <p className="mt-3 flex items-center gap-2 text-body text-fg-on-dark">
              <ShieldCheck className="size-5 shrink-0" />
              {HERO.guarantee}
            </p>
          </div>

          {/*
           * Inline SVG rather than <Image>: the reference's hero file is
           * Hostinger's, so this is redrawn (see visuals.tsx). Being inline it
           * is also part of the document, which means no LCP image request to
           * prioritise and no layout shift to reserve against.
           */}
          <div className="xl:max-w-[700px] xl:flex-1">
            <HeroCanvas />
          </div>
        </div>
      </Grid>
    </section>
  );
}
