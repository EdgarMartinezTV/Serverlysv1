import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HeroDomainSearch } from "@/components/domain/hero-domain-search";
import { billing } from "@/data/company";
import { lowestRate } from "@/data/pricing";

/**
 * Homepage hero.
 *
 * Centred: the argument, the domain search, the price, the guarantees. The
 * four Build/Launch/Grow/Manage stage cards that used to sit below the
 * fold-line were removed on request, and stage-rail.tsx went with them —
 * nothing else imported it.
 *
 * Those cards were also the hero's table of contents, each linking to the band
 * that covered it. The sticky <StageNav> further down the page still does that
 * job, so the wayfinding is not lost, only moved below the fold.
 *
 * Depth is three stacked radial planes plus a masked grid. All CSS — the hero
 * makes no media request, so nothing here is on the critical path.
 *
 * NOTHING here is wrapped in <Reveal>. Reveal runs off an IntersectionObserver
 * in a client component, so it cannot un-hide anything until hydration; putting
 * the hero behind it previously cost 2.03s of LCP against a 2.50s budget.
 */
export function Hero() {
  return (
    <section className="relative isolate -mt-18 overflow-hidden bg-canvas-abyss">
      {/* Plane 0 — background. Three stacked layers, all CSS. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(64%_58%_at_50%_-10%,rgb(34_126_255/0.42)_0%,transparent_66%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(42%_40%_at_88%_10%,rgb(34_211_238/0.16)_0%,transparent_70%)]"
      />
      {/*
        ⚠ BRAND BLUE, NOT VIOLET. This third light source was
        `rgb(141 89 255 / 0.16)` — `violet-500` — and it was the most visible
        violet on the site, a purple bloom in the bottom-left of the hero.

        Recoloured rather than deleted: the composition is three-point, and
        removing one point leaves that corner flat navy against two lit
        corners. It reuses the same blue as the dominant glow above but at a
        lower alpha and a different size, so it still reads as a separate
        source rather than a duplicate of it.

        globals.css reserves violet for AI surfaces (ConvoAI) and indigo for
        automation, so neither was ever a free choice here anyway.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(38%_36%_at_10%_88%,rgb(34_126_255/0.14)_0%,transparent_72%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />

      {/*
        ⚠ THE BOTTOM PADDING INCLUDES THE TRUST PANEL'S OVERLAP. `TrustBar`
        pulls itself up over this band by 56/64/80px (see its header), so the
        padding here is the old breathing room PLUS that amount. Set it back to
        pb-16/pb-20 and the panel lands on top of the check row below — which
        is exactly what happened on the first attempt, and the screenshot showed
        "30-day money-back · Free migration" sliced in half.

        The two values are a pair: the extra padding here equals TrustBar's
        `--overlap` (3.5rem / 4rem / 5rem). Changing one without the other is a
        visual regression that no test catches.
      */}
      <Container
        width="wide"
        className="relative pb-28 pt-32 sm:pb-32 sm:pt-36 lg:pb-40 lg:pt-40"
      >
        {/* ── Argument ─────────────────────────────────────────────────── */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-2.5 py-1 font-mono text-caption uppercase text-fg-on-dark-secondary ring-1 ring-inset ring-white/15">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-success-fill" />
              Hosting · Domains · AI
            </span>
          </p>

          {/*
           * Sized to the reference homepage rather than to --text-hero:
           * measured 72/80 at -0.36px, capped to 560px. The token maxes at
           * 64/70.4 with -1.152px of tracking, which is both smaller and far
           * tighter — the reference's looser tracking is most of why its hero
           * reads as open rather than compressed. Page-scoped on purpose; the
           * token still serves every other hero.
           *
           * The cap is 624px, not the reference's 560: Google's DM Sans is
           * ~11% wider than the cut they self-host, so at 560 each of our two
           * lines wrapped again — four lines instead of two. 560 x 1.11
           * reproduces the reference's actual two-line break. Same adjustment,
           * same reason, as components/ref/kit.tsx documents.
           *
           * The same wrap bug existed below 420px and went unfixed because the
           * cap only governs the wide end: at 44px "Everything online." needs
           * ~410px of text inside the ~350px column a 390px phone gives it, so
           * the hero opened on FOUR lines there — exactly the failure the
           * 624px cap exists to prevent at the other end.
           *
           * Two steps, not one, because the phone range is not one width. The
           * column is the viewport less 40px of gutter, and the longer line
           * ("Everything online.") needs roughly 9.4× the font size to set:
           *   320px phone → 280px column → 28px
           *   380–419px   → 340–379px    → 36px
           *   420px+      → 380px+       → 44px, the original
           * 320 is in the project's own responsive matrix as "the narrowest
           * phone still in use", so it is a supported width, not a courtesy.
           */}
          <h1 className="mx-auto mt-5 max-w-[624px] text-[28px] leading-[34px] font-normal tracking-[-0.14px] text-white min-[380px]:text-[36px] min-[380px]:leading-[43px] min-[380px]:tracking-[-0.18px] min-[420px]:text-[44px] min-[420px]:leading-[52px] min-[420px]:tracking-[-0.22px] sm:text-[56px] sm:leading-[64px] sm:tracking-[-0.28px] lg:text-[72px] lg:leading-[80px] lg:tracking-[-0.36px]">
            Everything online.
            <span className="block">One honest price.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[480px] text-body-lg text-fg-on-dark-secondary">
            Managed cloud hosting, domains, and AI that answers your customers — with free
            migration and the renewal price shown before you buy, not after.
          </p>

          <div className="mt-8 w-full max-w-2xl">
            <HeroDomainSearch />
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {/* Term wording removed on request (2026-09-16): the store sells
                on a monthly rate, so the button carries the rate alone. The
                renewal/standard rate is still shown beside every plan price
                further down the page. */}
            <Button href={billing.store("cloud-hosting")} variant="inverse" size="lg">
              From ${lowestRate.toFixed(2)}/mo
            </Button>
            <Button href="/pricing" variant="inverseOutline" size="lg">
              Compare plans
            </Button>
          </div>

          <ul className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {[
              "30-day money-back",
              "Free migration",
              "Free domain & SSL",
              "Daily backups",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-small text-fg-on-dark-muted"
              >
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-success-fill"
                >
                  <path
                    d="m3.5 8.5 3 3 6-6.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
