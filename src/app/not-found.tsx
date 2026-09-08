import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DomainSearch } from "@/components/domain/domain-search";
import { billing } from "@/data/company";

/**
 * 404.
 *
 * A recovery surface, not a dead end. 404s are guaranteed at cutover — the
 * legacy site has 108 indexed URLs — so this page's job is to get someone back
 * into the funnel rather than to apologise.
 *
 * `noindex` so soft-404s never enter the index.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const DESTINATIONS = [
  { name: "Cloud hosting", href: "/cloud-hosting", detail: "Auto-scaling plans" },
  // Points at the homepage plans section, not /pricing — that page does not
  // exist yet, and a 404 linking to another 404 is a dead end.
  { name: "Plans and pricing", href: "/#plans", detail: "Every plan and renewal rate" },
  { name: "Home", href: "/", detail: "Start from the beginning" },
];

export default function NotFound() {
  return (
    <Container width="reading" className="py-20 sm:py-28">
      <p className="font-mono text-caption uppercase text-primary">Error 404</p>
      <h1 className="mt-4 text-h1 text-fg">This page does not exist</h1>
      <p className="mt-5 text-body-lg text-fg-secondary">
        The link may be out of date, or the address may have a typo. Nothing is wrong
        with your site or your account.
      </p>

      <div className="mt-10">
        <p className="mb-3 text-small font-medium text-fg">Looking for a domain?</p>
        <DomainSearch tone="light" size="md" />
      </div>

      <ul className="mt-10 flex flex-col divide-y divide-line border-y border-line">
        {DESTINATIONS.map((d) => (
          <li key={d.name}>
            <Link
              href={d.href}
              className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span>
                <span className="block text-body font-medium text-fg group-hover:text-primary">
                  {d.name}
                </span>
                <span className="block text-small text-fg-muted">{d.detail}</span>
              </span>
              <span
                aria-hidden="true"
                className="text-fg-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button href={billing.sales} variant="secondary" size="lg" block>
          Contact support
        </Button>
        <Button href={billing.login} variant="ghost" size="lg" block>
          Client login
        </Button>
      </div>
    </Container>
  );
}
