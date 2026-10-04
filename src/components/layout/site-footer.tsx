import Link from "next/link";
import { footerNav, legalNav, socialLinks } from "@/data/navigation";
import { company, billing, emailDisplay } from "@/data/company";
import { resolveNavTarget } from "@/data/routes";
import { Wordmark } from "./wordmark";
import { SocialIcon } from "./social-icon";
import { NavIcon } from "@/components/navigation/nav-icons";
import { CookieSettingsLink } from "@/components/consent/cookie-settings-link";
import { SeraOpenButton } from "@/components/sera/sera-open-button";

/**
 * Site footer.
 *
 * Rebuilt to the reference footer's anatomy, which is three bands and nothing
 * else:
 *
 *   1. INDEX — six link columns spread edge to edge, uppercase titles at full
 *      text strength rather than muted. This is the site's own sitemap and on a
 *      hosting site it is genuinely navigated, not decoration.
 *   2. BRAND ROW — logo hard left, social icons hard right, then legal links
 *      and contact wrapping onto their own rows beneath. One flex container
 *      with wrap does all three rows; the reference does the same thing with
 *      flex-basis rather than a grid.
 *   3. COPYRIGHT — two lines pushed to opposite ends.
 *
 * ⚠ LIGHT, not dark. The footer used to share the header's abyss ground. The
 * reference footer is a light surface and the closing CTA above it is brand
 * blue, so the page now ends blue → white instead of blue → near-black. If this
 * is ever reverted to dark, every `text-fg-*` token here has to change with it:
 * fg-secondary (ink-600) fails on a dark ground, and fg-on-dark-muted (ink-400)
 * fails on this one. The surface and the text tokens are a pair.
 *
 * Container is 1600px with 80px gutters, matching the reference and the mega
 * menu panel — the footer and the open menu are the two widest surfaces on the
 * site and they line up.
 *
 * WHAT THE REFERENCE HAS THAT THIS DOES NOT: a row of accepted payment-card
 * icons. Which cards Serverlys accepts is a fact held by WHMCS, not by this
 * repo, and drawing six card logos on a guess is a claim about the business.
 * The contact block occupies that slot until someone confirms the real list.
 *
 * NO mobile accordion: the columns stay open. Collapsing a footer hides the
 * site's own index behind taps for no real gain.
 *
 * Unbuilt destinations render as text, not links, via `resolveNavTarget`.
 */
/* Link styling shared by every footer link: near-black, blue on hover with a
   growing underline (2026-10-03 footer, after the reference's type: DM Sans,
   16/600 uppercase titles, 14/400 links, #f5f5f6 ground). */
const LINK =
  "group/fl relative inline-flex min-h-11 items-center rounded-sm py-1.5 text-small leading-5 text-fg transition-colors duration-fast hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-0";
const UNDERLINE =
  "pointer-events-none absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-primary transition-transform duration-200 group-hover/fl:scale-x-100";

const TRUST = [
  { label: "Secure checkout", sub: "SSL on every page", icon: "lock" },
  { label: "30-day money-back", sub: "On every hosting plan", icon: "shield" },
  { label: "Free migration", sub: "Done by our team", icon: "move" },
] as const;

function TrustIcon({ name }: { name: (typeof TRUST)[number]["icon"] }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      {name === "lock" && <path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" {...p} />}
      {name === "shield" && (
        <path
          d="M12 3 5 6v5c0 4.4 3 7.9 7 10 4-2.1 7-5.6 7-10V6l-7-3Zm-3 9 2 2 4-4.5"
          {...p}
        />
      )}
      {name === "move" && <path d="M4 8h13l-3-3M20 16H7l3 3" {...p} />}
    </svg>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#f5f5f6] font-display text-fg">
      <div className="mx-auto w-full max-w-mega px-5 sm:px-8 lg:px-20">
        {/* ── Help strip ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5 border-b border-line py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[22px] leading-7 font-semibold tracking-[-0.02em] text-fg">
              Not sure what you need?
            </p>
            <p className="mt-1 text-small text-fg-secondary">
              Ask Sera for a recommendation, or talk to the team. A person reads every
              message.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SeraOpenButton />
            <a
              href={company.phoneHref}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-body font-semibold text-fg ring-1 ring-line transition-colors hover:ring-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <NavIcon name="phone" className="size-4 text-primary" />
              <span className="tabular">{company.phone}</span>
            </a>
            <a
              href={`mailto:${company.email}`}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-body font-semibold text-fg ring-1 ring-line transition-colors hover:ring-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <NavIcon name="mail" className="size-4 text-primary" />
              {emailDisplay}
            </a>
          </div>
        </div>

        {/* ── Index ───────────────────────────────────────────────────── */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-6 gap-y-10 pt-12 sm:grid-cols-3 lg:flex lg:justify-between lg:gap-x-11 lg:pt-14"
        >
          {footerNav.map((col) => (
            <div key={col.heading} className="min-w-0">
              <h2 className="text-body font-semibold uppercase leading-6 text-fg">
                {col.heading}
              </h2>
              <ul className="mt-3 flex flex-col">
                {col.links.map((link) => {
                  const target = resolveNavTarget(link.href);
                  const label = (
                    <>
                      <span className="relative">
                        {link.label}
                        <span aria-hidden="true" className={UNDERLINE} />
                      </span>
                      {link.status === "soon" && (
                        <span className="ml-2 inline-block whitespace-nowrap rounded-md bg-white px-1.5 py-0.5 text-micro font-medium text-fg-secondary ring-1 ring-line">
                          By request
                        </span>
                      )}
                    </>
                  );
                  return (
                    <li key={link.label}>
                      {target.mode === "link" ? (
                        <Link href={target.href} className={LINK}>
                          {label}
                        </Link>
                      ) : (
                        <span className="inline-block py-1.5 text-small leading-5 text-fg-muted">
                          {label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ── Brand row: logo + line + social, then trust + legal ─────── */}
        <div className="mt-14 flex flex-col gap-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Wordmark tone="dark" className="h-9" />
              <p className="max-w-[360px] text-small text-fg-secondary">
                Hosting, domains and AI for small businesses, with the renewal price
                shown before you buy.
              </p>
            </div>
            <ul className="flex items-center gap-2 lg:justify-end">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex size-11 items-center justify-center rounded-full bg-white text-fg ring-1 ring-line transition-colors duration-fast hover:bg-primary hover:text-white hover:ring-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-10"
                  >
                    <SocialIcon name={social.label} />
                    <span className="sr-only">
                      {company.name} on {social.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Trust badges in the reference's payment-logo slot: claims the
              site makes elsewhere, not card brands we have not confirmed. */}
            <ul className="flex flex-wrap gap-2 lg:flex-nowrap">
              {TRUST.map((t) => (
                <li
                  key={t.label}
                  className="flex shrink-0 items-center gap-2.5 rounded-xl bg-white px-3 py-2 ring-1 ring-line"
                >
                  <span className="inline-flex size-7 items-center justify-center rounded-lg bg-brand-50 text-primary">
                    <TrustIcon name={t.icon} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-small font-semibold text-fg">
                      {t.label}
                    </span>
                    <span className="block text-micro text-fg-secondary">{t.sub}</span>
                  </span>
                </li>
              ))}
            </ul>

            <ul className="flex flex-wrap items-center gap-x-5 gap-y-0 lg:justify-end">
              {legalNav.map((link) => {
                const target = resolveNavTarget(link.href);
                return (
                  <li key={link.label}>
                    {target.mode === "link" ? (
                      <Link href={target.href} className={LINK}>
                        <span className="relative">
                          {link.label}
                          <span aria-hidden="true" className={UNDERLINE} />
                        </span>
                      </Link>
                    ) : (
                      <span className="inline-block py-1.5 text-small leading-5 text-fg-muted">
                        {link.label}
                      </span>
                    )}
                  </li>
                );
              })}
              {/* Consent must be withdrawable as easily as it was given. */}
              <li>
                <CookieSettingsLink />
              </li>
              <li>
                <Link
                  href="/legal-information"
                  className="inline-flex min-h-11 items-center gap-1 rounded-sm py-1.5 text-small font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-0"
                >
                  All legal documents
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom line ─────────────────────────────────────────────── */}
        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-line py-6 lg:flex-row lg:items-center">
          <p className="text-small text-fg-secondary">
            © {year} {company.legalName}. All rights reserved. Domain registrations are
            subject to the policies of ICANN and the relevant registry.
          </p>
          <div className="flex items-center justify-between gap-4 text-small lg:shrink-0 lg:justify-end">
            <span className="text-fg-secondary">
              Renewal prices shown on every plan.
            </span>
            <a
              href={billing.login}
              className="inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full bg-fg px-4 font-semibold text-white transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Client login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
