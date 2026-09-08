import Link from "next/link";
import { footerNav, legalNav } from "@/data/navigation";
import { company, billing, sisterProducts } from "@/data/company";
import { Wordmark } from "./wordmark";

/**
 * Site footer. Uses the dark band deliberately — it terminates the page and
 * carries the full IA for crawlers and for users who scrolled looking for
 * something the nav did not surface.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-canvas-dark text-fg-on-dark-secondary">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_2fr]">
          {/* Identity + contact */}
          <div className="flex flex-col gap-5">
            <Wordmark tone="light" />
            <p className="max-w-xs text-small text-fg-on-dark-muted">
              {company.description}
            </p>
            <div className="flex flex-col gap-1.5 text-small">
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
            <div className="flex flex-wrap gap-2 pt-1">
              {sisterProducts.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md px-2.5 py-1 text-small text-fg-on-dark-muted ring-1 ring-line-on-dark transition-colors hover:text-white hover:ring-line-on-dark-hover"
                >
                  {p.name}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((col) => (
              <div key={col.heading}>
                <h2 className="text-caption font-mono uppercase text-fg-on-dark-muted">
                  {col.heading}
                </h2>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {/* Inline (not flex) so the "Soon" marker flows with the
                          label instead of forcing it onto its own line, and
                          muted rather than a light pill, which reads as a
                          foreign object on the dark band. */}
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

        {/* Account row */}
        <div className="mt-14 flex flex-col gap-4 border-t border-line-on-dark pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
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
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
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

        <p className="mt-8 text-small text-fg-on-dark-muted">
          © {year} {company.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
