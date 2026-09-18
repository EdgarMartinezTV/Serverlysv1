import Image from "next/image";
import { HERO } from "../_content";
import { Check, CtaButton, Grid, InfoCircle, ShieldCheck } from "@/components/ref/kit";

/**
 * Hero + proof row.
 *
 * Two details are the reference's and look wrong until you check them:
 *
 *  1. The <h1> is the SMALL line ("Up to 71% off managed cloud hosting"), not
 *     the big one. The big line is an <h2>. Kept as-is — the h1 carries the
 *     commercial keyword, and swapping them would change what the page ranks
 *     for, which is the sort of thing a "make it match" brief does not license.
 *  2. The right column is `flex-1 max-w-[700px]` inside `justify-between`, not
 *     a fixed pair. That is what produces a 60px gap at 1280 and an 80px gap at
 *     1440 off one rule.
 *
 * The reference also runs a Trustpilot rating + "Recommended by WordPress.org"
 * row under the hero. It was removed on request: both are third-party
 * endorsements of Hostinger, not of us.
 */
export function Hero() {
  return (
    <section aria-labelledby="cloud-hero-heading" className="bg-canvas pt-9 pb-14 md:pb-16 xl:pb-12">
      <Grid>
        <div className="flex flex-col items-stretch gap-8 xl:flex-row xl:items-center xl:justify-between xl:gap-x-[60px]">
          {/* Copy column — 500px fixed from 1280 up. */}
          <div className="xl:w-[500px] xl:max-w-[600px] xl:shrink-0">
            <h1
              id="cloud-hero-heading"
              className="mb-2 text-[20px] leading-7 font-semibold tracking-[-0.1px] text-fg"
            >
              {HERO.eyebrowPrefix}
              <span className="text-primary">{HERO.eyebrowAccent}</span>
              {HERO.eyebrowSuffix}
            </h1>

            <p className="mb-6 text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-fg lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.24px]">
              {HERO.title}
            </p>

            <ul className="mb-[22px] flex flex-col gap-2">
              {HERO.bullets.map((b, i) => (
                <li key={b} className="flex items-center gap-2.5 text-body text-fg">
                  <Check className="size-5 shrink-0 text-success-fill" />
                  <span>{b}</span>
                  {/* The reference hangs an info affordance off the first three
                      claims only — the fourth needs no footnote. */}
                  {i < 3 && <InfoCircle className="size-5 shrink-0 text-ink-400" />}
                </li>
              ))}
            </ul>

            <CtaButton href="#pricing" className="w-full xl:w-auto">
              {HERO.cta}
            </CtaButton>

            <p className="mt-3 flex items-center gap-2 text-body text-fg">
              <ShieldCheck className="size-5 shrink-0" />
              {HERO.guarantee}
            </p>
          </div>

          {/* Media column. */}
          <div className="xl:max-w-[700px] xl:flex-1">
            <Image
              src="/Hosting-images/cloud-hosting-hero.png"
              alt="The Serverlys panel listing four live sites beside a website overview showing disk, CPU, inode and memory use"
              width={1597}
              height={985}
              priority
              sizes="(min-width: 1280px) 700px, (min-width: 768px) 688px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </Grid>

    </section>
  );
}

