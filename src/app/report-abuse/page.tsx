import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/section";
import { Field } from "@/components/ui/field";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { billing, company } from "@/data/company";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";

const PATH = "/report-abuse";

export const metadata = pageMetadata({
  title: "Report Abuse | Serverlys",
  description:
    "Report phishing, malware, spam or other abuse originating from a site hosted by Serverlys. What we need, what we do, and what to expect.",
  path: PATH,
  // Not a page we want ranking for commercial queries, but it must be
  // reachable and indexable — abuse contacts are expected to be findable.
});

/**
 * Abuse reporting.
 *
 * This page exists for people who are NOT customers and are having a bad day.
 * So: no marketing, no hero visual, no upsell. The form is near the top, the
 * requirements are explicit, and the expectations are honest — including the
 * things we will not do, which is the part most abuse pages omit and then
 * disappoint people with.
 *
 * Routes to the WHMCS abuse department (deptid 3) rather than sales, so it
 * lands in the queue that handles it rather than being triaged twice.
 */
const CATEGORIES = [
  "Phishing or a fake login page",
  "Malware or a malicious download",
  "Spam sent from a hosted account",
  "Copyright infringement (DMCA)",
  "Child sexual abuse material",
  "Network abuse or scanning",
  "Something else",
];

export default function ReportAbusePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Report abuse", path: PATH }])}
      />

      <section className="bg-canvas-abyss">
        <Container className="pb-12 pt-8 sm:pb-14 sm:pt-10">
          <Breadcrumbs
            trail={[{ name: "Home", href: "/" }, { name: "Report abuse" }]}
            tone="dark"
          />
          <div className="mt-8 max-w-2xl">
            <h1 className="text-h2 text-white">Report abuse</h1>
            <p className="mt-4 text-body-lg text-fg-on-dark-secondary">
              If a website or service hosted by Serverlys is being used for
              phishing, malware, spam or anything else abusive, tell us here.
              You do not need an account and you do not need to be a customer.
            </p>
          </div>
        </Container>
      </section>

      {/* Emergency routing, above everything else. */}
      <Container className="pt-10">
        <div className="rounded-xl border-l-2 border-error bg-error-soft p-6">
          <h2 className="text-body-lg font-semibold text-fg">
            If someone is in immediate danger
          </h2>
          <p className="mt-2 max-w-[68ch] text-body text-fg-secondary">
            Contact your local emergency services first. For child sexual abuse
            material, report it to your national authority as well as to us — in
            the United States that is the NCMEC CyberTipline. We act on these
            reports immediately and preserve evidence, but we are not a law
            enforcement agency and we cannot investigate on their behalf.
          </p>
        </div>
      </Container>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Report it"
              title="What we need from you"
              lede="A report without a URL cannot be actioned. Everything else is optional but speeds things up."
            />

            <form
              action={`${billing.root}/submitticket.php`}
              method="POST"
              className="mt-10 flex flex-col gap-6"
            >
              {/* Abuse department, not sales. */}
              <input type="hidden" name="step" value="3" />
              <input type="hidden" name="deptid" value="3" />

              <div className="grid gap-6 sm:grid-cols-2">
                <Field name="name" label="Your name" required>
                  <Input name="name" autoComplete="name" required />
                </Field>
                <Field
                  name="email"
                  label="Your email"
                  description="So we can ask for detail and tell you the outcome."
                  required
                >
                  <Input name="email" type="email" autoComplete="email" hasDescription required />
                </Field>
              </div>

              <Field name="subject" label="Type of abuse" required>
                <Select name="subject" required defaultValue="">
                  <option value="" disabled>
                    Choose one
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </Field>

              <Field
                name="url"
                label="The exact URL"
                description="The specific page, not just the domain. This is the one field we cannot work without."
                required
              >
                <Input
                  name="url"
                  type="url"
                  placeholder="https://example.com/the-page"
                  hasDescription
                  required
                />
              </Field>

              <Field
                name="message"
                label="What is happening"
                description="What you saw, when you saw it, and anything that shows it — headers from a spam message, a screenshot, the URL you were redirected from."
                required
              >
                <Textarea name="message" hasDescription rows={7} required />
              </Field>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit" size="lg">
                  Submit the report
                </Button>
                <p className="text-small text-fg-muted">
                  Goes to the abuse queue, not sales.
                </p>
              </div>
            </form>

            <p className="mt-6 max-w-[68ch] text-small text-fg-muted">
              Prefer email? Write to{" "}
              <a
                href={`mailto:${company.email}?subject=Abuse%20report`}
                className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
              >
                {company.email}
              </a>{" "}
              with &quot;Abuse report&quot; in the subject and the URL in the
              first line. For DMCA notices, include the statements required by
              17 U.S.C. § 512(c)(3) or we will have to come back and ask for
              them.
            </p>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-xl bg-canvas-secondary p-6 ring-1 ring-inset ring-line">
              <h2 className="text-body-lg font-semibold text-fg">What happens next</h2>
              <ol className="mt-4 flex flex-col gap-3">
                {[
                  "We confirm the content is actually hosted by us. A lot of reports name sites that are not.",
                  "We assess it against our acceptable use terms.",
                  "Where it is clear-cut — phishing, malware — the content comes down and the account is suspended.",
                  "Where it is contested, the customer is given notice and an opportunity to respond.",
                  "We tell you the outcome.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-3 text-small text-fg-secondary">
                    <span aria-hidden="true" className="font-mono text-caption text-fg-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl bg-canvas-secondary p-6 ring-1 ring-inset ring-line">
              <h2 className="text-body-lg font-semibold text-fg">What we will not do</h2>
              <ul className="mt-4 flex flex-col gap-3 text-small text-fg-secondary">
                {[
                  "Disclose a customer's identity or contact details to you. That requires legal process.",
                  "Remove content because it is disagreeable rather than abusive.",
                  "Act on a report with no URL in it.",
                  "Adjudicate a private dispute between two parties.",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-fg-muted" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-canvas-secondary p-6 ring-1 ring-inset ring-line">
              <h2 className="text-body-lg font-semibold text-fg">Not hosted by us?</h2>
              <p className="mt-2 text-small text-fg-secondary">
                A WHOIS lookup shows which registrar and, often, which host is
                responsible. Report it to them — they are the only ones who can
                take it down.
              </p>
              <Button href="/whois-lookup" variant="secondary" size="sm" className="mt-4">
                Look up the domain
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
