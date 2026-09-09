import Link from "next/link";
import { footerNav, legalNav, socialLinks } from "@/data/navigation";
import { company, billing, sisterProducts } from "@/data/company";
import { resolveNavTarget } from "@/data/routes";
import { Wordmark } from "./wordmark";
import { SocialIcon } from "./social-icon";
import { NavIcon, ArrowUpRight } from "@/components/navigation/nav-icons";
import { LanguageSelector } from "@/components/navigation/language-selector";
import { cn } from "@/lib/utils";

/**
 * Site footer.
 *
 * Shares the header and mega menu's ground (`canvas-abyss`) and depth
 * treatment, so the top and bottom of the page read as the same system. It
 * previously sat on `canvas-dark` — a second, slightly different black that
 * made the page end on a surface used nowhere else.
 *
 * Unbuilt destinations render as text, not links, via `resolveNavTarget`, and
 * carry the same "Soon" badge language as the mega menu.
 *
 * NO mobile accordion: the columns stay open. Collapsing a footer hides the
 * site's own index behind taps for no real gain — Stripe, Vercel and Linear
 * all keep theirs expanded — and an accordion here would need JavaScript to
 * behave correctly at two breakpoints.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-canvas-abyss text-fg-on-dark-secondary">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(60%_45%_at_15%_0%,rgb(34_126_255/0.16)_0%,transparent_65%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-40" />

      <div className="relative mx-auto w-full max-w-desktop px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_2fr] lg:gap-16">
          {/* ── Brand, contact, social ─────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <Wordmark tone="light" className="h-12" />
            <p className="max-w-xs text-small text-fg-on-dark-muted">
              {company.description}
            </p>

            <div className="flex flex-col gap-1 text-small">
              <a
                href={`mailto:${company.email}`}
                className="inline-flex w-fit items-center gap-2 rounded-sm py-1 text-fg-on-dark-secondary transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <NavIcon name="mail" className="h-4 w-4 text-fg-on-dark-muted" />
                {company.email}
              </a>
              <a
                href={company.phoneHref}
                className="inline-flex w-fit items-center gap-2 rounded-sm py-1 text-fg-on-dark-secondary transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <NavIcon name="phone" className="h-4 w-4 text-fg-on-dark-muted" />
                <span className="tabular">{company.phone}</span>
              </a>
            </div>

            <ul className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-fg-on-dark-muted ring-1 ring-inset ring-white/12 transition-colors duration-fast hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <SocialIcon name={s.label} />
                    <span className="sr-only">
                      {company.name} on {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Sister products sit in the brand column: as a full-width band
                    they stretched, and the column had a void beneath the social
                    row. Real cards, not bare chips — the mega menu presents
                    these products the same way. */}
            <ul className="mt-2 flex flex-col gap-3">
              {sisterProducts.map((p) => (
                <li key={p.name}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3.5 rounded-xl bg-white/[0.035] p-4 ring-1 ring-inset ring-white/10 transition-colors duration-fast hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary-on-dark ring-1 ring-inset ring-primary/25"
                    >
                      <NavIcon name={p.name === "ConvoAI" ? "chat" : "phone"} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="text-small font-semibold text-white">
                          {p.name}
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-fg-on-dark-muted transition-transform duration-fast group-hover:translate-x-0.5"
                        >
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </span>
                      <span className="mt-1 block text-small text-fg-on-dark-muted">
                        {p.description}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Link columns ───────────────────────────────────────────── */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4"
          >
            {footerNav.map((col) => (
              <div key={col.heading}>
                <h2 className="font-mono text-caption uppercase text-fg-on-dark-muted">
                  {col.heading}
                </h2>
                <ul className="mt-4 flex flex-col gap-0.5">
                  {col.links.map((link) => {
                    const target = resolveNavTarget(link.href);
                    const label = (
                      <>
                        {link.label}
                        {link.status === "soon" && (
                          <span className="ml-2 rounded-full bg-white/10 px-1.5 py-0.5 font-mono text-[0.5625rem] uppercase text-fg-on-dark-secondary ring-1 ring-inset ring-white/15">
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
                            className="inline-block rounded-sm py-1.5 text-small text-fg-on-dark-secondary transition-colors duration-fast hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          >
                            {label}
                          </Link>
                        ) : (
                          <span className="inline-block py-1.5 text-small text-fg-on-dark-muted">
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
        </div>

        {/* ── Account + legal ────────────────────────────────────────────── */}
        <div className="mt-14 flex flex-col gap-5 border-t border-line-on-dark pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href={billing.login}
              className="inline-block rounded-sm py-1 text-small font-medium text-white transition-colors hover:text-primary-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Client login
            </a>
            <a
              href={billing.sales}
              className="inline-block rounded-sm py-1 text-small text-fg-on-dark-secondary transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Talk to sales
            </a>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {legalNav.map((link) => {
              const target = resolveNavTarget(link.href);
              return (
                <li key={link.label}>
                  {target.mode === "link" ? (
                    <Link
                      href={target.href}
                      className="inline-block rounded-sm py-1 text-small text-fg-on-dark-muted transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span className="inline-block py-1 text-small text-fg-on-dark-muted/70">
                      {link.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-fg-on-dark-muted">
            © {year} {company.legalName}. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            {/* Same control as the header, so the choice reads as one system. */}
            <LanguageSelector onDark />
            <a
              href="#main"
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-small text-fg-on-dark-muted",
                "transition-colors duration-fast hover:bg-white/[0.06] hover:text-white",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              )}
            >
              Back to top
              <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3">
                <path
                  d="M6 9.5v-7M2.5 6 6 2.5 9.5 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
