import Image from "next/image";
import { Check, CtaButton, Grid, InfoCircle, ShieldCheck } from "@/components/ref/kit";
import { HERO } from "../_content";

/**
 * Hero. Same geometry as /cloud-hosting's — a 500px copy column against a
 * `flex-1 max-w-[700px]` media column inside `justify-between`, which is what
 * produces a 60px gap at 1280 and 80px at 1440 off one rule.
 *
 * The <h1> is the small line, as on the reference; the big line is a <p>. The
 * h1 carries the commercial keyword, and swapping them would change what the
 * page ranks for.
 *
 * The reference's Trustpilot + WordPress.org proof row under this is not here —
 * removed on the same grounds as on /cloud-hosting. Note that the hero artwork
 * itself carries a "Recommended by WordPress.org" strip baked into the image;
 * that is the supplied brand asset, not markup this page adds.
 */
export function Hero() {
  return (
    <section aria-labelledby="ecom-hero-heading" className="bg-canvas pt-9 pb-14 md:pb-16 xl:pb-20">
      <Grid>
        <div className="flex flex-col items-stretch gap-8 xl:flex-row xl:items-center xl:justify-between xl:gap-x-[60px]">
          <div className="xl:w-[500px] xl:max-w-[600px] xl:shrink-0">
            <h1
              id="ecom-hero-heading"
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
                  {/* The reference footnotes the first three claims only. */}
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

          <div className="xl:max-w-[700px] xl:flex-1">
            {/*
             * Three things an <img> in a hero always needs, same as the
             * WordPress and cloud heroes:
             *   · `priority` — this is the LCP element, and Next lazy-loads by
             *     default, which would put the largest paint behind the loader;
             *   · intrinsic width/height — reserves the box so the copy beside
             *     it does not jump when the file lands (CLS);
             *   · `sizes` — without it Next serves the full 1525px file to a
             *     phone. It renders at 700px from 1280 up, full width below.
             *
             * No radius or ring: the artwork carries its own rounded frame and
             * its corners are already near-white, so framing it would draw a
             * box around a picture that has no edge.
             */}
            <Image
              src="/Hosting-images/ecommerce-hosting-hero.png"
              alt="A Serverlys store being built — a domain in the address bar, web and WordPress hosting product cards ready to add to cart, and the hosting, domains, WordPress and security tools alongside"
              width={1525}
              height={1031}
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
