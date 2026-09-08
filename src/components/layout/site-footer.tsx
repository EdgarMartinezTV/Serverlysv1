import Link from "next/link";
import { footerNav, legalNav, socialLinks } from "@/data/navigation";
import { company, billing, sisterProducts } from "@/data/company";
import { Wordmark } from "./wordmark";
import { SocialIcon } from "./social-icon";

/**
 * Site footer.
 *
 * Uses the dark band deliberately: it terminates the page and carries the full
 * information architecture, both for people who scrolled looking for something
 * the header did not surface and for crawlers.
 *
 * Every text colour here comes from the on-dark foreground set. The light set
 * (fg-muted, 3.65:1 here) would fail contrast — see DESIGN_SYSTEM.md §4.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-canvas-dark text-fg-on-dark-secondary">
      <div className="mx-auto w-full max-w-desktop px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_2fr]">
          {/* Identity, contact, social */}
          <div className="flex flex-col gap-5">
            <Wordmark tone="light" />
            <p className="max-w-xs text-small text-fg-on-dark-muted">
              {company.description}
            </p>

            <div className="flex flex-col gap-1 text-small">
              <a
                href={`mailto:${company.email}`}
                className="inline-block py-1 text-fg-on-dark-secondary transition-colors hover:text-white"
              >
                {company.email}
              </a>
              <a
                href={company.phoneHref}
                className="tabular inline-block py-1 text-fg-on-dark-secondary transition-colors hover:text-white"
              >
                {company.phone}
              </a>
            </div>

            <ul className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-fg-on-dark-muted ring-1 ring-line-on-dark transition-colors duration-fast hover:text-white hover:ring-line-on-dark-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <SocialIcon name={s.label} />
                    <span className="sr-only">
                      {company.name} on {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <ul className="flex flex-wrap gap-2 pt-1">
              {sisterProducts.map((p) => (
                <li key={p.name}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center rounded-md px-2.5 text-small text-fg-on-dark-muted ring-1 ring-line-on-dark transition-colors hover:text-white hover:ring-line-on-dark-hover"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((col) => (
              <div key={col.heading}>
                <h2 className="font-mono text-caption uppercase text-fg-on-dark-muted">
                  {col.heading}
                </h2>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-block py-1 text-small text-fg-on-dark-muted transition-colors hover:text-white"
                      >
                        {link.label}
                        {link.status === "soon" && (
                          <span className="ml-2 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-fg-on-dark-muted">
                            Soon
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Account + legal */}
        <div className="mt-14 flex flex-col gap-4 border-t border-line-on-dark pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6">
            <a
              href={billing.login}
              className="inline-block py-1 text-small font-medium text-white transition-colors hover:text-primary-on-dark"
            >
              Client login
            </a>
            <a
              href={billing.sales}
              className="inline-block py-1 text-small text-fg-on-dark-muted transition-colors hover:text-white"
            >
              Talk to sales
            </a>
          </div>
          <ul className="flex flex-wrap gap-x-5">
            {legalNav.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="inline-block py-1 text-small text-fg-on-dark-muted transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-fg-on-dark-muted">
            © {year} {company.legalName}. All rights reserved.
          </p>
          {/* Plain anchor to the skip-link target: works without JS and
              respects scroll-behavior from the base layer. */}
          <a
            href="#main"
            className="inline-flex min-h-9 items-center gap-1.5 self-start text-small text-fg-on-dark-muted transition-colors hover:text-white sm:self-auto"
          >
            Back to top
            <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3">
              <path
                d="M6 9.5v-7M2.5 6 6 2.5 9.5 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
