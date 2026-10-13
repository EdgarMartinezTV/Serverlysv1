import Link from "next/link";
import { footerNav, legalNav, socialLinks } from "@/data/navigation";
import { company, emailDisplay } from "@/data/company";
import { resolveNavTarget } from "@/data/routes";
import { Wordmark } from "./wordmark";
import { CurrentYear } from "./current-year";
import { SocialIcon } from "./social-icon";
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
 * Trust tiles occupy that slot until someone confirms the real list.
 *
 * 2026-10-13, Edgar: stripped back to the reference's restraint — no help
 * strip (Sera lives in the header), plain social glyphs instead of circles,
 * no tagline, no Client login pill (the header's account icon covers it),
 * tighter ~30px link rhythm. Phone and email moved to the bottom line.
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
  "group/fl relative inline-flex min-h-11 items-center rounded-sm py-[5px] text-small leading-5 text-fg transition-colors duration-fast hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-0";
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
        {/* ── Index ───────────────────────────────────────────────────── */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-6 gap-y-10 pt-12 sm:grid-cols-3 lg:flex lg:justify-between lg:gap-x-11 lg:pt-16"
        >
          {footerNav.map((col) => (
            <div key={col.heading} className="min-w-0">
              <h2 className="text-body font-semibold uppercase leading-6 text-fg">
                {col.heading}
              </h2>
              <ul className="mt-2 flex flex-col">
                {col.links.map((link) => {
                  const target = resolveNavTarget(link.href);
                  const label = (
                    <span>
                      <span className="relative">
                        {link.label}
                        <span aria-hidden="true" className={UNDERLINE} />
                      </span>
                      {link.status === "soon" && (
                        <span className="ml-1.5 whitespace-nowrap text-micro text-fg-muted">
                          · by request
                        </span>
                      )}
                    </span>
                  );
                  return (
                    <li key={link.label}>
                      {target.mode === "link" ? (
                        <Link href={target.href} className={LINK}>
                          {label}
                        </Link>
                      ) : (
                        <span className="inline-block py-[5px] text-small leading-5 text-fg-muted">
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

        {/* ── Brand row: logo + social, then trust + legal ───────────── */}
        <div className="mt-16 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-6">
            <Wordmark tone="dark" className="h-9" />
            <ul className="flex items-center gap-1">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex size-11 items-center justify-center rounded-md text-fg transition-colors duration-fast hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-10 [&_svg]:size-6"
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
            {/* Trust tiles in the reference's payment-logo slot: claims the
              site makes elsewhere, not card brands we have not confirmed. */}
            <ul className="flex flex-wrap gap-2">
              {TRUST.map((t) => (
                <li
                  key={t.label}
                  className="flex h-12 shrink-0 items-center gap-2 rounded-md bg-white px-3 text-small font-semibold text-fg ring-1 ring-line"
                >
                  <span className="text-primary">
                    <TrustIcon name={t.icon} />
                  </span>
                  {t.label}
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
                      <span className="inline-block py-[5px] text-small leading-5 text-fg-muted">
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
            </ul>
          </div>
        </div>

        {/* ── Bottom line ─────────────────────────────────────────────── */}
        <div className="flex flex-col justify-between gap-3 py-8 text-small text-fg-secondary lg:flex-row lg:items-center">
          <p>
            © <CurrentYear buildYear={year} /> {company.legalName}. All rights reserved. Domain registrations are
            subject to the policies of ICANN and the relevant registry.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 lg:shrink-0">
            <a href={company.phoneHref} className="tabular transition-colors hover:text-primary">
              {company.phone}
            </a>
            <a href={`mailto:${company.email}`} className="transition-colors hover:text-primary">
              {emailDisplay}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
