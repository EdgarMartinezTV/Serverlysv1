import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DomainSearch } from "@/components/domain/domain-search";
import { Reveal } from "@/components/animations/reveal";
import { billing } from "@/data/company";
import {
  HostingPanel,
  DomainPanel,
  ConvoPanel,
  UptimePanel,
  MigrationPanel,
} from "@/components/product-ui/panels";

/**
 * Homepage hero.
 *
 * Composition follows the target: the header sits ON this band (transparent
 * until scrolled), then a centred domain search, a two-line display heading,
 * supporting copy, a single primary CTA, a guarantee line, and a strip of
 * product panels cropped by the fold.
 *
 * The strip is real Serverlys product UI built in code — hosting resources,
 * domain search, ConvoAI, status, migration — not photography or placeholder
 * rectangles. The outer panels sit lower and are dimmed so the eye lands on
 * the centre three.
 *
 * Background is three stacked layers: a deep base, a brand light source, and a
 * fine grid, all CSS. Nothing here is an image request.
 */
export function Hero() {
  return (
    <section
      className="
        relative isolate overflow-hidden bg-canvas-abyss
        -mt-16
      "
    >
      {/* Layer 1 — brand light source from above. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_-8%,rgb(34_126_255/0.42)_0%,transparent_68%)]"
      />
      {/* Layer 2 — cyan counter-light, keeps the blue from reading flat. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(45%_40%_at_82%_18%,rgb(34_211_238/0.16)_0%,transparent_70%)]"
      />
      {/* Layer 3 — technical grid, masked so it never competes with the type. */}
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />

      <Container className="relative pb-0 pt-36 sm:pt-40 lg:pt-44">
        {/*
          NOT wrapped in <Reveal>. Everything above the fold paints immediately.

          Reveal is a client component driven by an IntersectionObserver, so it
          cannot un-hide anything until hydration has run. Wrapping the hero put
          the LCP element — the paragraph below — behind a fade that started
          after hydration: cold-cache LCP was 2.88s against a 2.50s budget,
          while every other page measured 0.85s. The animation was the entire
          difference. Never animate the largest element in the first viewport.
        */}
        <div className="mx-auto w-full max-w-xl">
          <DomainSearch tone="dark" />
        </div>

        <div className="mx-auto mt-12 max-w-3xl text-center sm:mt-14">
          <h1 className="text-display text-white">
            Everything online. <span className="block">One honest price.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-body-lg text-fg-on-dark-secondary">
            Managed cloud hosting, domains and AI tools — with free migration and the
            renewal price shown before you buy, not after.
          </p>

          <div className="mt-9 flex flex-col items-center gap-4">
            <Button href={billing.store("cloud-hosting")} variant="inverse" size="lg">
              Get started
            </Button>
            <p className="flex items-center gap-2 text-small text-fg-on-dark-muted">
              <svg
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="h-4 w-4 text-success-fill"
              >
                <path
                  d="M8 1.5 3 3.5v4c0 3 2.1 5.6 5 6.5 2.9-.9 5-3.5 5-6.5v-4L8 1.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path
                  d="m6 8 1.5 1.5L10.5 6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              30-day money-back guarantee
            </p>
          </div>
        </div>

        {/* Product strip. Cropped by the fold — the next section overlaps it. */}
        <Reveal delay={140} className="mt-16 sm:mt-20">
          <ul
            className="
              -mx-5 flex items-end gap-4 overflow-x-auto px-5 pb-0
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              sm:mx-0 sm:px-0
              lg:grid lg:grid-cols-5 lg:overflow-visible
            "
          >
            {[
              { Panel: MigrationPanel, offset: "lg:translate-y-8", dim: true },
              { Panel: DomainPanel, offset: "lg:translate-y-3" },
              { Panel: HostingPanel, offset: "" },
              { Panel: ConvoPanel, offset: "lg:translate-y-3" },
              { Panel: UptimePanel, offset: "lg:translate-y-8", dim: true },
            ].map(({ Panel, offset, dim }, i) => (
              <li
                key={i}
                className={`w-[248px] shrink-0 lg:w-auto ${offset} ${
                  dim ? "opacity-85 lg:opacity-75" : ""
                }`}
              >
                <Panel className="min-h-[13.5rem]" />
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
