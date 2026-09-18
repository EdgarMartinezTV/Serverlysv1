import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { billing } from "@/data/company";
import { lowestRate, formatPrice } from "@/data/pricing";
import { sisterProducts } from "@/data/company";

/**
 * Split pair: a brand-gradient offer card beside a white product card.
 *
 * Mirrors the target's two-up band directly beneath the prompt section. The
 * weighting is deliberately unequal — the offer card is the commercial one and
 * takes the wider column.
 */
export function SplitCards() {
  const convo = sisterProducts.find((p) => p.name === "ConvoAI");

  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        {/* Offer card — brand gradient, as in the target's left tile. */}
        <Reveal className="h-full">
          <article className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-canvas-deep p-7 sm:p-9">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(80%_100%_at_0%_0%,rgb(34_126_255/0.55)_0%,transparent_65%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_100%,rgb(34_211_238/0.22)_0%,transparent_70%)]"
            />
            <div className="relative">
              <span className="inline-flex items-center rounded-full bg-white/12 px-3 py-1 font-mono text-caption uppercase text-white ring-1 ring-inset ring-white/20">
                Plans and prices
              </span>
              <h2 className="mt-6 max-w-md text-h2 text-white">
                Every tier shows what it renews at
              </h2>
              <p className="mt-4 max-w-sm text-body-lg text-fg-on-dark-secondary">
                Year one and year two, side by side, before checkout. From{" "}
                <span className="tabular font-semibold text-white">
                  {formatPrice(lowestRate)}
                </span>
                /mo.
              </p>
            </div>
            <div className="relative mt-10">
              <Button href="#plans" variant="inverse" size="lg">
                Explore plans
              </Button>
            </div>
          </article>
        </Reveal>

        {/* Product card — ConvoAI, a real Serverlys product. */}
        <Reveal delay={80} className="h-full">
          <article className="flex h-full flex-col justify-between rounded-2xl bg-surface p-7 shadow-e2 ring-1 ring-line sm:p-8">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-caption uppercase text-fg-muted">
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-500 text-micro font-bold text-white"
                >
                  C
                </span>
                ConvoAI
              </span>
              <h2 className="mt-5 text-h3 text-fg">An AI agent that answers for you</h2>
              <p className="mt-3 text-body text-fg-secondary">
                Handles the questions that arrive at 2am — hours, bookings, pricing — so
                they do not sit unanswered until morning.
              </p>
            </div>

            {/* Compact conversation, matching the target's chat tile. */}
            <div
              aria-hidden="true"
              className="mt-7 flex flex-col gap-2 rounded-xl bg-canvas-secondary p-4"
            >
              <p className="max-w-[80%] rounded-lg rounded-tl-sm bg-surface px-3 py-2 text-small text-fg-secondary shadow-e1">
                Are you open on the bank holiday?
              </p>
              <p className="ml-auto max-w-[80%] rounded-lg rounded-tr-sm bg-primary px-3 py-2 text-small text-white">
                We are — 9 to 5. Want me to hold a slot?
              </p>
            </div>

            {convo && (
              <Button
                href={convo.href}
                variant="secondary"
                size="md"
                className="mt-6 self-start"
              >
                See ConvoAI
              </Button>
            )}
          </article>
        </Reveal>
      </div>

      <p className="sr-only">
        Prices shown are introductory rates. Renewal rates are published on the pricing
        section below and at <a href={billing.root}>the Serverlys billing area</a>.
      </p>
    </Container>
  );
}
