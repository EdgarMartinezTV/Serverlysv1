import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { Card, CardLink } from "@/components/ui/card";
import { groupById, formatPrice, formatSavings } from "@/data/pricing";
import { billing, sisterProducts } from "@/data/company";
import { tlds } from "@/data/tlds";
import { ConvoAiLogo } from "@/components/layout/convoai-logo";

/**
 * Promo block — one headline offer, two adjacent ones.
 *
 * Mirrors the reference's 1-large + 2-small arrangement. The large card is the
 * plan we actually want most visitors on (Turbo: unlimited sites, the best
 * value per site), and the two small cards are the things people buy alongside
 * it rather than instead of it — a domain and an agent.
 *
 * ⚠ Both prices on the large card, always — the monthly rate AND the standard
 * rate it is discounted from. One rate alone is the exact pattern this
 * company sells against, and it also makes the saving claim unfalsifiable. The
 * setup fee is printed for the same reason: it is charged on the first invoice.
 * The domain card carries "first year" because registry renewals are not the
 * promo figure.
 *
 * The small cards are `interactive` and therefore contain exactly one CardLink
 * each — the stretched ::after makes the whole card the hit target without
 * nesting a second focusable element inside it.
 */
export function PlansPromo() {
  const cloud = groupById("cloud");
  const turbo = cloud?.plans.find((plan) => plan.tier === "turbo");
  if (!cloud || !turbo) return null;

  const com = tlds.find((tld) => tld.tld === ".com");
  const convo = sisterProducts.find((product) => product.name === "ConvoAI");

  return (
    <Section surface="subtle" spacing="base" labelledBy="promo-heading" width="wide">
      <Reveal className="mx-auto max-w-[680px] text-center">
        <span className="text-micro text-primary font-semibold">
          Plans and prices
        </span>
        <h2 id="promo-heading" className="mt-4 text-h1 text-fg">
          The offer, without the asterisk
        </h2>
        <p className="mt-5 text-body-lg text-fg-secondary">
          One monthly price, the renewal rate printed next to it, and 30 days to
          change your mind.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        {/* ── Headline offer ───────────────────────────────────────────── */}
        <Reveal className="relative isolate flex flex-col overflow-hidden rounded-2xl bg-canvas-deep p-8 shadow-e4 lg:p-10">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_90%_0%,rgb(34_126_255/0.45)_0%,transparent_70%)]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-dark" />

          <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-2.5 py-1 text-micro text-fg-on-dark-secondary ring-1 ring-inset ring-white/15 font-semibold">
            Most chosen · {cloud.label}
          </span>

          <h3 className="mt-5 text-h2 text-white">{turbo.name}</h3>
          <p className="mt-2 max-w-sm text-body text-fg-on-dark-secondary">
            {turbo.summary}. {turbo.specs.sites}, {turbo.specs.visits}.
          </p>

          <div className="mt-7 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="tabular text-display text-white">
              {formatPrice(turbo.monthly)}
            </span>
            <span className="pb-2 text-body text-fg-on-dark-secondary">
              /mo
            </span>
          </div>
          <p className="mt-2 text-small text-fg-on-dark-muted">
            Saves {formatSavings(turbo)} against the standard{" "}
            <span className="tabular text-fg-on-dark-secondary">
              {formatPrice(turbo.standard)}
            </span>
            /mo.
            {turbo.setupFee ? ` ${formatPrice(turbo.setupFee)} setup fee.` : " No setup fee."}
          </p>

          <ul className="mt-7 grid gap-2 sm:grid-cols-2">
            {turbo.includes.slice(0, 6).map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-small text-fg-on-dark-secondary"
              >
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-fill"
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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              href={billing.order(cloud.group, turbo.slug)}
              variant="inverse"
              size="lg"
            >
              Get {turbo.name}
            </Button>
            <Button href="#plans" variant="inverseOutline" size="lg">
              See all four tiers
            </Button>
          </div>
        </Reveal>

        {/* ── Adjacent offers ──────────────────────────────────────────── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <Reveal delay={80} className="h-full">
            <Card variant="interactive" padding="lg" className="h-full justify-between">
              <div>
                <span className="text-micro text-primary font-semibold">
                  Domains
                </span>
                <h3 className="mt-3 text-h3 text-fg">
                  <CardLink href="/register-domain">Claim the name first</CardLink>
                </h3>
                <p className="mt-2 text-body text-fg-secondary">
                  Free WHOIS privacy and DNS you can edit yourself. Transfers keep the
                  time already paid for.
                </p>
              </div>
              {com && (
                <p className="mt-6 text-small text-fg-muted">
                  <span className="tabular text-h4 text-fg">
                    {formatPrice(com.price)}
                  </span>{" "}
                  {com.tld} for the first year, then the registry renewal rate.
                </p>
              )}
            </Card>
          </Reveal>

          <Reveal delay={140} className="h-full">
            <Card variant="interactive" padding="lg" className="h-full justify-between">
              <div>
                <ConvoAiLogo tone="light" className="h-6 w-auto" />
                <h3 className="mt-3 text-h3 text-fg">
                  <CardLink href="/convoai">Answer visitors at 2am</CardLink>
                </h3>
                <p className="mt-2 text-body text-fg-secondary">
                  {convo?.description ??
                    "A chat agent trained on your own pages that qualifies and books, then hands you the transcript."}
                </p>
              </div>
              <p className="mt-6 text-small text-fg-muted">
                Runs on the site you already host here. Try it lower down the page.
              </p>
            </Card>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
