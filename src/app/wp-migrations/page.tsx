import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Field } from "@/components/ui/field";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { MigrationPanel } from "@/components/product-ui/panels";
import { billing } from "@/data/company";
import { pageMetadata, breadcrumbGraph, faqGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";

const PATH = "/wp-migrations";

export const metadata = pageMetadata({
  title: "WordPress Migration — free, staged, no downtime",
  description:
    "We move your WordPress site, database and email to Serverlys, test it on staging, and only change DNS when you say so. Free on every hosting plan.",
  path: PATH,
});

/**
 * WordPress migrations.
 *
 * Architecture is a RUNBOOK plus a request form. The differentiator is not
 * "free migration" — everyone says that — it is the ORDER: staged first, DNS
 * last, customer approves the cutover. So the page shows the order, then the
 * specific things that break in a WordPress move, then asks for the details
 * we actually need.
 *
 * The form POSTs straight to WHMCS. No API route, no server action: WHMCS owns
 * tickets, and it keeps working with JavaScript disabled.
 */
const FAQS: readonly Faq[] = [
  {
    question: "How much does a migration cost?",
    answer:
      "Nothing, on every hosting plan. There is no per-site fee and no cap that quietly turns into one. If a site is genuinely unusual — a multisite network, a custom stack, thousands of products — we will tell you before we start rather than after.",
    scopes: [PATH],
  },
  {
    question: "Will my site go down?",
    answer:
      "No. The copy runs on staging while your live site keeps serving visitors from the old host. Nothing changes for anyone until you approve the DNS switch, and even then the old host keeps answering until propagation finishes.",
    scopes: [PATH],
  },
  {
    question: "What about orders and comments placed during the move?",
    answer:
      "That is why the database is synced again immediately before cutover rather than only at the start. For a store, we agree a quiet window and put the old site into a read-only state for the few minutes in between, so nothing is written to a database we are about to replace.",
    scopes: [PATH],
  },
  {
    question: "Do you move email as well?",
    answer:
      "Yes, mailboxes and their contents, if your email lives with your current host. If you use a separate provider such as Google Workspace or Microsoft 365, nothing needs to move — we just make sure the MX records survive the DNS change, which is the step people forget.",
    scopes: [PATH],
  },
  {
    question: "How long does it take?",
    answer:
      "Most single WordPress sites are staged within a working day, and cutover is minutes once you approve it. Large stores and multisite networks take longer because they deserve more testing, not because they are queued.",
    scopes: [PATH],
  },
];

export default function WpMigrationsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "WordPress hosting", path: "/wordpress-hosting" },
          { name: "Migrations", path: PATH },
        ])}
      />
      <JsonLd data={faqGraph(FAQS)} />

      <ProductHero
        eyebrow="WordPress migration"
        title="We move it. You approve the moment it goes live."
        lede="Files, database and email copied to staging on our platform, tested properly, and switched over only when you say so. Free on every hosting plan."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "WordPress hosting", href: "/wordpress-hosting" },
          { name: "Migrations" },
        ]}
        specs={[
          { label: "Cost", value: "Free" },
          { label: "Downtime", value: "None" },
          { label: "Staging", value: "First" },
          { label: "DNS", value: "Your call" },
        ]}
        primary={{ label: "Request a migration", href: "#request" }}
        secondary={{ label: "See WordPress hosting", href: "/wordpress-hosting" }}
        visual={<MigrationPanel />}
      />

      {/* The runbook, in order. The order IS the product. */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <SectionHeader
            eyebrow="The runbook"
            title="Staging first. DNS last. Always."
            lede="Most migration horror stories are one mistake: pointing the domain at a server that was not ready. We do it in the only order that cannot produce that outcome."
          />
          <ol className="flex flex-col divide-y divide-line border-t border-line">
            {[
              ["We take a full copy", "Files, the database and mailboxes, from your current host. Nothing on your side is changed or deleted."],
              ["It is rebuilt on staging", "Running on our platform under a temporary hostname, with PHP matched to what the site runs today."],
              ["We test it properly", "Admin login, a page that hits the database, a form submission, and a test order if you sell anything."],
              ["You look at it", "You get the staging link. This is the approval gate — nothing proceeds until you are happy."],
              ["Final database sync", "Taken immediately before cutover so orders and comments written in the meantime are not lost."],
              ["DNS switches", "TTL lowered in advance so propagation is minutes, not a day. Your old host stays up as the rollback."],
              ["We watch the logs", "For the first week, on the error log rather than the homepage — that is where migration problems actually appear."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-5 py-6">
                <span aria-hidden="true" className="font-mono text-small text-fg-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-body font-semibold text-fg">{t}</h3>
                  <p className="mt-1.5 max-w-[60ch] text-small text-fg-secondary">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* WordPress-specific breakage. Specific, not generic reassurance. */}
      <Section surface="dark">
        <SectionHeader
          eyebrow="What we check"
          tone="dark"
          title="The things that actually break in a WordPress move"
          lede="Every item here is something we have had to fix. They are checked on staging, before anyone sees the site."
        />
        <ul className="mt-12 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Hardcoded URLs in the database", "Serialised option values break if you search-and-replace them naively. They are rewritten properly."],
            ["Absolute paths in wp-config", "Upload paths and cache directories that pointed at the old server's filesystem."],
            ["Mail from the site", "Contact forms stop sending when SPF and DKIM are not carried over. We set the records."],
            ["Scheduled tasks", "Real cron on the old host, silently doing something important. It stops on the day of the move."],
            ["File permissions", "The most common cause of a white screen after a copy, and invisible until you look."],
            ["Caching plugin config", "Rules written for the old stack. Reconfigured for LiteSpeed rather than left to fight it."],
            ["SSL and mixed content", "A new certificate, and any resource still requested over http:// found before your visitors find it."],
            ["Redirect rules", "Rewrite rules in .htaccess that the old host had, and SEO depends on."],
            ["Media library integrity", "Large uploads directories truncate quietly. File counts are compared, not assumed."],
          ].map(([t, d]) => (
            <li key={t} className="border-t border-white/15 pt-5">
              <h3 className="text-body font-semibold text-white">{t}</h3>
              <p className="mt-1.5 text-small text-fg-on-dark-secondary">{d}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Request form — real, posts to WHMCS. */}
      <Section surface="subtle" id="request">
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,24rem)] lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Request it"
              title="Tell us where the site lives now"
              lede="This opens a ticket in your Serverlys account. We will confirm what we need before touching anything."
            />
            <form
              action={`${billing.root}/submitticket.php`}
              method="POST"
              className="mt-10 flex flex-col gap-6"
            >
              <input type="hidden" name="step" value="3" />
              <input type="hidden" name="deptid" value="1" />
              <input type="hidden" name="subject" value="WordPress migration request" />

              <div className="grid gap-6 sm:grid-cols-2">
                <Field name="name" label="Your name" required>
                  <Input name="name" autoComplete="name" required />
                </Field>
                <Field name="email" label="Email" required>
                  <Input name="email" type="email" autoComplete="email" required />
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field name="site" label="Website address" required>
                  <Input name="site" type="url" placeholder="https://example.com" required />
                </Field>
                <Field name="currenthost" label="Current host">
                  <Input name="currenthost" placeholder="If you know it" autoComplete="off" />
                </Field>
              </div>

              <Field
                name="platform"
                label="What is the site built with?"
                required
              >
                <Select name="platform" required defaultValue="">
                  <option value="" disabled>
                    Choose one
                  </option>
                  <option>WordPress</option>
                  <option>WooCommerce</option>
                  <option>WordPress multisite</option>
                  <option>Another CMS</option>
                  <option>Custom code</option>
                  <option>I am not sure</option>
                </Select>
              </Field>

              <Field
                name="message"
                label="Anything we should know?"
                description="Store, membership site, a plugin you depend on, a date you cannot move on — all useful."
              >
                <Textarea name="message" hasDescription rows={5} />
              </Field>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit" size="lg">
                  Request the migration
                </Button>
                <p className="text-small text-fg-muted">
                  No credentials in this form — we ask for access securely once
                  the ticket is open.
                </p>
              </div>
            </form>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-xl bg-canvas p-6 ring-1 ring-inset ring-line">
              <h3 className="text-body-lg font-semibold text-fg">Before you send it</h3>
              <ul className="mt-4 flex flex-col gap-3 text-small text-fg-secondary">
                {[
                  "Do not cancel your current hosting yet — it is the rollback.",
                  "Check who controls the domain's DNS. Sometimes it is not the host.",
                  "If the site takes orders, tell us and we will agree a quiet window.",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-canvas p-6 ring-1 ring-inset ring-line">
              <h3 className="text-body-lg font-semibold text-fg">Not on WordPress?</h3>
              <p className="mt-2 text-small text-fg-secondary">
                We move other stacks too. Tell us what it is and we will say
                honestly whether it is routine or a project.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex min-h-6 items-center text-small font-semibold text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Ask about your stack
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      <FaqSection items={FAQS} />
      <FinalCta />
    </>
  );
}
