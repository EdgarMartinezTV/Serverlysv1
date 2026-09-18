import Link from "next/link";
import { footerNav, legalNav, socialLinks } from "@/data/navigation";
import { company, billing, emailDisplay } from "@/data/company";
import { resolveNavTarget } from "@/data/routes";
import { Wordmark } from "./wordmark";
import { SocialIcon } from "./social-icon";
import { NavIcon } from "@/components/navigation/nav-icons";
import { CookieSettingsLink } from "@/components/consent/cookie-settings-link";

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
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-canvas text-fg-secondary">
      <div className="mx-auto w-full max-w-mega px-5 pt-14 sm:px-8 lg:px-20 lg:pt-16">
        {/* ── 1. Index ───────────────────────────────────────────────────── */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:flex lg:justify-between lg:gap-x-11"
        >
          {footerNav.map((col) => (
            <div key={col.heading} className="min-w-0">
              {/* 16px / 600 / 24px line box, uppercase — measured off the
                  reference footer, whose column titles are body-size headings
                  in the body face, not eyebrow captions. This was `font-mono
                  text-caption` (12px + 0.08em tracking), which rendered the
                  site's own index a third smaller than the links it heads and
                  was the single biggest type gap between the two footers. The
                  mono face comes off with it: at 16px, mono + wide tracking
                  runs ~40% wider than the reference and would push the six
                  columns apart. */}
              <h2 className="text-body font-semibold uppercase leading-6 text-fg">
                {col.heading}
              </h2>
              <ul className="mt-3 flex flex-col">
                {col.links.map((link) => {
                  const target = resolveNavTarget(link.href);
                  const label = (
                    <>
                      {link.label}
                      {link.status === "soon" && (
                        <span className="ml-2 inline-block whitespace-nowrap rounded-full bg-canvas-inset px-1.5 py-0.5 font-mono text-caption uppercase text-fg-muted">
                          By request
                        </span>
                      )}
                    </>
                  );
                  return (
                    <li key={link.label}>
                      {target.mode === "link" ? (
                        <Link
                          href={target.href}
                          className="inline-flex min-h-11 items-center rounded-sm py-1.5 text-small leading-5 text-fg-secondary transition-colors duration-fast hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-0"
                        >
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

        {/* ── 2. Brand row ───────────────────────────────────────────────── */}
        {/* One wrapping flex row. Logo + social share line one; the legal links
            and the contact block each claim a full basis so they break onto
            their own line, exactly as the reference does. */}
        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-line-subtle pt-8">
          <Wordmark tone="dark" className="h-9" />

          <ul className="ml-auto flex items-center gap-2">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md text-fg-muted transition-colors duration-fast hover:bg-canvas-inset hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-10 sm:w-10"
                >
                  <SocialIcon name={social.label} />
                  <span className="sr-only">
                    {company.name} on {social.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <ul className="flex basis-full flex-wrap items-center gap-x-4 gap-y-0">
            {legalNav.map((link) => {
              const target = resolveNavTarget(link.href);
              return (
                <li key={link.label}>
                  {target.mode === "link" ? (
                    <Link
                      href={target.href}
                      className="inline-flex min-h-11 items-center rounded-sm py-1.5 text-small text-fg-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-0"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span className="inline-block py-1.5 text-small leading-5 text-fg-muted">
                      {link.label}
                    </span>
                  )}
                </li>
              );
            })}
            {/* Reopening the panel is a legal requirement, not a nicety: consent
                must be withdrawable as easily as it was given, and the banner
                is gone once answered. */}
            <li>
              <CookieSettingsLink />
            </li>
          </ul>

          <div className="flex basis-full flex-wrap items-center gap-x-5 gap-y-2 text-small">
            <a
              href={`mailto:${company.email}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm py-1.5 text-fg-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-0"
            >
              <NavIcon name="mail" className="h-4 w-4 text-fg-muted" />
              {emailDisplay}
            </a>
            <a
              href={company.phoneHref}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm py-1.5 text-fg-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-0"
            >
              <NavIcon name="phone" className="h-4 w-4 text-fg-muted" />
              <span className="tabular">{company.phone}</span>
            </a>
            <a
              href={billing.login}
              className="inline-flex min-h-10 items-center rounded-md px-3 font-semibold text-primary transition-colors hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Client login
            </a>
          </div>
        </div>

        {/* ── 3. Copyright ───────────────────────────────────────────────── */}
        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-line-subtle py-6 lg:flex-row lg:gap-32">
          <p className="text-small text-fg-muted">
            © {year} {company.legalName}. All rights reserved. Domain registrations are
            subject to the policies of ICANN and the relevant registry.
          </p>
          <p className="shrink-0 text-small text-fg-muted">
            Renewal prices shown on every plan.
          </p>
        </div>
      </div>
    </footer>
  );
}
