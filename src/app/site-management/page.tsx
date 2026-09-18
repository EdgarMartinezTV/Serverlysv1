import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { JsonLd } from "@/components/ui/json-ld";
import { DashboardMock } from "@/components/product-ui/dashboard";
import { UptimePanel } from "@/components/product-ui/panels";
import { pageMetadata, breadcrumbGraph, faqGraph, serviceGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";
import { billing } from "@/data/company";

const PATH = "/site-management";
const DESCRIPTION =
  "Updates applied and tested, backups verified, uptime watched, small changes made. The ongoing work a website needs after it launches.";

export const metadata = pageMetadata({
  title: "Site Management — someone whose job is your website",
  description: DESCRIPTION,
  path: PATH,
});

/**
 * Site management.
 *
 * Distinct from managed hosting, and the page has to make that clear in the
 * first screen or it is just a second version of /managed-hosting. Managed
 * hosting is the SERVER. Site management is the SITE — the plugin updates, the
 * broken link, the page of copy that needs changing, the thing nobody has
 * looked at in eight months.
 *
 * Architecture is a CALENDAR: what happens weekly, monthly, quarterly. That
 * shape is honest about the product being a retainer rather than a purchase.
 */
const FAQS: readonly Faq[] = [
  {
    question: "How is this different from managed hosting?",
    answer:
      "Managed hosting is the server: patching, firewall, backups, the operating system. Site management is what you built on top of it: plugin and theme updates, content changes, broken links, forms that stopped sending. You can have either without the other, though most people who want one eventually want both.",
    scopes: [PATH],
  },
  {
    question: "Do you make content changes?",
    answer:
      "Yes, within an agreed monthly allowance. Swapping a phone number, adding a team member, updating opening hours, publishing a page you have written — that is the work. A redesign or a new feature is a project, and we will quote it rather than absorb it and rush.",
    scopes: [PATH],
  },
  {
    question: "What happens when an update breaks the site?",
    answer:
      "It gets caught before you see it, because updates are applied on a staging copy and checked first. If something does break in production, restoring a backup is free and immediate, and then we work out which update caused it.",
    scopes: [PATH],
  },
  {
    question: "Is there a contract?",
    answer:
      "It is a monthly service and you can stop it. What you should not do is stop it and assume the site will look after itself — an unmaintained WordPress site is a security incident with a date on it.",
    scopes: [PATH],
  },
];

export default function SiteManagementPage() {
  return (
    <>
      <JsonLd
        data={serviceGraph({
          name: "Website maintenance and management",
          serviceType: "Website maintenance",
          description: DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Site management", path: PATH },
        ])}
      />
      <JsonLd data={faqGraph(FAQS)} />

      <ProductHero
        eyebrow="Site management"
        title="A website is not finished when it launches"
        lede="Plugins go out of date, forms quietly stop sending, and a year passes. Site management is having someone whose job is noticing — before your customers do."
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Site management" }]}
        specs={[
          { label: "Updates", value: "Staged first" },
          { label: "Backups", value: "Verified" },
          { label: "Uptime", value: "Watched" },
          { label: "Changes", value: "Included" },
        ]}
        primary={{ label: "Talk about your site", href: billing.sales }}
        secondary={{ label: "Managed hosting instead", href: "/managed-hosting" }}
        visual={<DashboardMock />}
      />

      {/* The distinction, stated immediately. */}
      <Section spacing="tight">
        <div className="grid gap-8 rounded-2xl bg-canvas-secondary p-8 ring-1 ring-inset ring-line sm:grid-cols-2 sm:p-10">
          <div>
            <h2 className="font-mono text-caption uppercase tracking-wider text-fg-muted">
              Managed hosting covers
            </h2>
            <p className="mt-3 text-body-lg text-fg">The server</p>
            <p className="mt-2 text-small text-fg-secondary">
              Operating system, web server, patching, firewall, SSL, backups of
              the machine. Everything underneath your site.
            </p>
            <Link
              href="/managed-hosting"
              className="mt-4 inline-flex min-h-6 items-center text-small font-semibold text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Managed hosting
            </Link>
          </div>
          <div className="border-t border-line pt-8 sm:border-l sm:border-t-0 sm:pl-10 sm:pt-0">
            <h2 className="font-mono text-caption uppercase tracking-wider text-primary">
              Site management covers
            </h2>
            <p className="mt-3 text-body-lg text-fg">The website</p>
            <p className="mt-2 text-small text-fg-secondary">
              Plugin and theme updates, content edits, broken links, forms,
              performance, and the small changes you keep meaning to make.
            </p>
            <span className="mt-4 inline-flex min-h-6 items-center text-small font-semibold text-fg-muted">
              You are on this page
            </span>
          </div>
        </div>
      </Section>

      {/* The calendar — the product's real shape. */}
      <Section surface="dark">
        <SectionHeader
          eyebrow="What the month looks like"
          tone="dark"
          title="Recurring work, on a schedule"
          lede="Not 'proactive monitoring'. Actual jobs, at actual intervals, that you can hold us to."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl bg-white/10 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              when: "Weekly",
              items: [
                "Core, plugin and theme updates on staging",
                "Checked, then applied to production",
                "Backup taken before anything changes",
                "Uptime and error log reviewed",
              ],
            },
            {
              when: "Monthly",
              items: [
                "A restore actually tested, not assumed",
                "Broken links and 404s swept",
                "Form submissions confirmed arriving",
                "Your content changes made",
              ],
            },
            {
              when: "Quarterly",
              items: [
                "Page speed measured and reported",
                "Unused plugins removed",
                "PHP version reviewed",
                "Search Console errors triaged",
              ],
            },
            {
              when: "When needed",
              items: [
                "Something breaks — we fix it",
                "A security advisory lands",
                "A plugin is abandoned upstream",
                "You need a change this week",
              ],
            },
          ].map((col) => (
            <div key={col.when} className="bg-canvas-dark p-7">
              <h3 className="font-mono text-caption uppercase tracking-wider text-accent-on-dark">
                {col.when}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.items.map((i) => (
                  <li key={i} className="flex gap-2.5 text-small text-fg-on-dark-secondary">
                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary-on-dark" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <ShowcaseSplit
        id="reporting"
        eyebrow="You see the work"
        title="A report you can actually read"
        body="Every month you get what was updated, what broke, what was fixed, and what we think needs attention next. Written in English, not a dashboard export with a logo on it. If a month was quiet, the report says the month was quiet."
        points={[
          { label: "What changed", detail: "Every update applied, and what it touched.", icon: "wrench" },
          { label: "What we caught", detail: "Problems found before they reached your visitors.", icon: "shield" },
          { label: "What is next", detail: "The thing we would fix if you gave us the go-ahead.", icon: "compass" },
        ]}
        cta={{ label: "See what we would find", href: billing.sales }}
        visual={<UptimePanel />}
        side="right"
        surface="subtle"
        bleed
      />

      {/* Honest cost framing — no invented prices. */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-h3 text-fg">What it costs</h2>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              Site management is quoted, not listed, because the honest price
              depends on how many sites, how complex they are and how much
              change you want each month. A five-page brochure site and a
              WooCommerce store with forty plugins are not the same job, and
              pretending otherwise means one of you is subsidising the other.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              Tell us the site and we will give you a monthly figure and what it
              includes, in writing, before you commit to anything.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={billing.sales}>Get a figure</Button>
              <Button href="/pricing" variant="secondary">
                Hosting prices
              </Button>
            </div>
          </div>
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {[
              ["Number of sites", "One, or a portfolio you manage for clients."],
              ["What it runs", "A brochure site, a store, a membership, a custom application."],
              ["Change allowance", "How much content and small-change work you expect each month."],
              ["Response expectation", "Whether an outage needs someone at the weekend."],
            ].map(([t, d]) => (
              <li key={t} className="py-5">
                <h3 className="text-body font-semibold text-fg">{t}</h3>
                <p className="mt-1 text-small text-fg-secondary">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FaqSection items={FAQS} />
      <FinalCta />
    </>
  );
}
