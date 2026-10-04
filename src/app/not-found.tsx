import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { billing } from "@/data/company";
import { formatPrice, groupById } from "@/data/pricing";

/**
 * 404.
 *
 * A recovery surface, not a dead end. 404s are guaranteed at cutover — the
 * legacy site has 108 indexed URLs — so this page's job is to get someone back
 * into the funnel rather than to apologise.
 *
 * `noindex` so soft-404s never enter the index.
 *
 * ── SHAPE ────────────────────────────────────────────────────────────────────
 *
 * Centred, one column, one primary action, then a single offer band. Edgar
 * asked for the shape Hostinger's 404 uses, and the reason it works is worth
 * naming rather than just copying: a 404 is the one page where the visitor has
 * NO intent the page can read. Giving them a menu makes them choose again
 * having just failed to find something. Giving them one obvious way back, and
 * one reason to stay, is the whole job.
 *
 * ⚠ NONE OF HOSTINGER'S ACTUAL PAGE IS HERE. Not their markup, not their
 * copy — "Oops! This page can't be found." and "Page lost. Deal found." are
 * theirs — and not their photography. What is borrowed is the ARRANGEMENT,
 * which is not ownable: centred type, generous air, single CTA, one offer band.
 * Everything inside it is Serverlys': its type scale, its tokens, its voice,
 * and its actual prices read from `data/pricing.ts`.
 *
 * ⚠ THE OFFER BAND CARRIES A PRICE, NOT A PICTURE. Theirs has a stock
 * photograph in that slot. This project has no photography at all — one logo
 * file, stated as a known gap in DESIGN_SYSTEM.md §12 — so filling the slot
 * with a decorative graphic would mean commissioning an asset to say nothing.
 * The real entry price with its renewal rate beside it is both the thing a lost
 * visitor most wants and the company's actual argument. It is a better use of
 * the space than an image would be.
 *
 * ⚠ `text-h1`, NOT `text-display`. The scale in DESIGN_SYSTEM.md §1 reserves
 * display for "Hero only. One per site." A 404 headline is not the site's hero,
 * however tempting 80px is here. The page reads large because of the air around
 * it and the narrow measure, which is what actually produces that effect.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * The quiet recovery row.
 *
 * ⚠ TEXT LINKS, NOT CARDS, AND THAT IS A REVERSAL. This used to be a stacked
 * list of three bordered rows with descriptions, directly under the headline —
 * which put a second decision immediately after the primary one and pulled the
 * eye away from it. Demoted to one line at the bottom: still there for the
 * visitor who arrived from a specific dead link and knows what they wanted,
 * invisible to the one who just needs the way out.
 *
 * Four, because at cutover the legacy paths that changed are overwhelmingly
 * hosting, domains, migrations and support.
 */
const ELSEWHERE = [
  { name: "Hosting", href: "/hosting" },
  { name: "Domains", href: "/domain-name" },
  { name: "Migrations", href: "/migrations" },
  { name: "Support", href: "/support" },
] as const;

export default function NotFound() {
  /*
   * Read from the same source the pricing pages render. A hand-typed "$7.95"
   * here would be a fifth copy of a number that changes, on the one page
   * nobody thinks to check after a price change.
   */
  const cloud = groupById("cloud");
  const starter = cloud?.plans.find((plan) => plan.tier === "starter");

  return (
    <>
      {/* ── The way out ──────────────────────────────────────────────────── */}
      {/*
        ⚠ THE BOTTOM PADDING IS SMALLER THAN THE TOP, DELIBERATELY. Symmetrical
        py-36 left roughly 200px of empty canvas between the primary button and
        the offer band — enough that the band read as a separate page rather
        than as the second half of this one. The air above the headline is what
        produces the spacious feeling; the air below it was just distance.
      */}
      <section className="bg-canvas pt-20 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
        <Container>
          <div className="mx-auto max-w-[680px] text-center">
            <p className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-small font-medium text-primary">Error 404</p>

            <h1 className="display-lg mt-5 text-fg">This page does not exist</h1>

            <p className="mx-auto mt-6 max-w-[52ch] text-body-lg text-fg-secondary">
              The link may be out of date, or the address may have a typo. Nothing is
              wrong with your site or your account.
            </p>

            {/*
              ⚠ ONE PRIMARY, ONE QUIET SECOND. "Client login" earns its place
              specifically on this page: a 404 on a hosting site is very often
              an existing customer following a stale bookmark to their account,
              and the client area is on a different origin (WHMCS) so no amount
              of site navigation gets them there.
            */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button href="/" size="lg">
                Back to home
              </Button>
              <Button href={billing.login} variant="ghost" size="lg">
                Client login
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── One reason to stay ───────────────────────────────────────────── */}
      <section
        aria-labelledby="notfound-offer-heading"
        className="bg-canvas pb-20 sm:pb-28 lg:pb-36"
      >
        <Container width="wide">
          <div className="overflow-hidden rounded-3xl bg-brand-50">
            <div className="flex flex-col gap-8 p-8 sm:p-10 lg:flex-row lg:items-center lg:gap-14 lg:p-14">
              <div className="lg:max-w-[34rem]">
                <p className="inline-flex rounded-md bg-white px-2.5 py-1 text-small font-medium text-primary">Plans</p>
                {/*
                  ⚠ NO EM DASH, AND THE MEASURE IS IN rem NOT ch. The first
                  draft read "While you are here — the renewal rate, up front"
                  inside `max-w-[46ch]`, which at 40px display type wrapped to
                  three lines and put the em dash alone at the start of the
                  second one. `ch` is measured on the BODY font, so it sizes a
                  display-type block wrongly by design.
                */}
                <h2 id="notfound-offer-heading" className="display-md mt-4 text-fg">
                  The renewal rate, shown up front
                </h2>
                {/*
                  ⚠ EVERY CLAIM HERE WAS CHECKED AGAINST `data/pricing.ts`, and
                  the first draft got two of them wrong — which is exactly why
                  the check matters on a page nobody revisits after a price
                  change:
                    · "on a 3-year term" — the term was REMOVED from the model.
                      `monthly` carries no term; the file says so explicitly.
                    · "no setup fee" — FALSE for Starter, which carries $2.95.
                      That is the plan quoted in the block beside this sentence.
                  Free migration and the 30-day guarantee are both real and both
                  published, so those two stayed.
                */}
                <p className="mt-4 text-body text-fg-secondary">
                  Every plan shows the monthly rate and the rate it renews at, side
                  by side. Free migration, and thirty days to change your mind.
                </p>
                <p className="mt-6">
                  <Button href="/pricing" size="md">
                    See all plans
                  </Button>
                </p>
              </div>

              {/*
                The price block stands in for their photograph. Both figures,
                always — the term rate alone is the pattern this company sells
                against, and printing it by itself here would contradict the
                sentence directly above it.
              */}
              {starter && (
                <dl className="shrink-0 rounded-lg bg-canvas p-6 shadow-e2 lg:ml-auto lg:min-w-[264px]">
                  <dt className="text-small text-fg-muted">Hosting from</dt>
                  <dd className="mt-1 flex items-baseline gap-1.5">
                    <span className="tabular text-h2 text-fg">
                      {formatPrice(starter.monthly)}
                    </span>
                    <span className="text-body text-fg-secondary">/mo</span>
                  </dd>
                  {/*
                    Worded the way `pricing-table.tsx` words it, because that is
                    the page this one sends people to and the two must not
                    describe the same number differently. The setup fee is
                    printed for the reason the data file gives: it is a real
                    charge on the first invoice, so omitting it understates it.
                  */}
                  <dd className="mt-2 text-small text-fg-secondary">
                    Standard rate{" "}
                    <span className="tabular font-medium text-fg">
                      {formatPrice(starter.standard)}/mo
                    </span>
                    {starter.setupFee
                      ? ` · ${formatPrice(starter.setupFee)} setup fee`
                      : null}
                  </dd>
                </dl>
              )}
            </div>
          </div>

          {/* ── For the visitor who knows what they wanted ─────────────── */}
          <nav aria-label="Other pages" className="mt-10 text-center">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {ELSEWHERE.map((item) => (
                <li key={item.name}>
                  {/*
                    ⚠ `inline-flex` + `min-h-11` IS THE TOUCH TARGET, NOT
                    DECORATION. As bare inline text these links measured 18px
                    tall and `scripts/a11y.mjs` flagged all four — WCAG 2.5.8
                    wants 24px minimum, and this project's own audit enforces
                    it. The version these replaced was a list of full-height
                    rows, so demoting them to text links quietly dropped below
                    the floor. 44px, which is the comfortable figure rather
                    than the legal one, and the underline still sits where the
                    text is.
                  */}
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center px-1 text-small text-fg-secondary underline decoration-line underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>
    </>
  );
}
