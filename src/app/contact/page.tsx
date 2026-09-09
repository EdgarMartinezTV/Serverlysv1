import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Field } from "@/components/ui/field";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { NavIcon } from "@/components/navigation/nav-icons";
import { company, billing } from "@/data/company";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";

const PATH = "/contact";

export const metadata = pageMetadata({
  title: "Contact Serverlys — talk to a person | Serverlys",
  description:
    "Reach the Serverlys team by ticket, email or phone. Sales, migrations and technical questions all reach the same people.",
  path: PATH,
});

/**
 * Contact.
 *
 * The form POSTs DIRECTLY to WHMCS — no API route, no server action. WHMCS
 * owns tickets, and proxying through our server would break its CSRF and
 * session handling while making us responsible for data we should not hold.
 * It also means the form works with JavaScript disabled.
 */
export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Home", path: "/" }, { name: "Contact", path: PATH }])} />

      <section className="relative isolate overflow-hidden bg-canvas-abyss">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_20%_-5%,rgb(34_126_255/0.3)_0%,transparent_68%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />
        <Container className="relative pb-16 pt-8 sm:pb-20 sm:pt-10">
          <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Contact" }]} tone="dark" />
          <div className="mt-10 max-w-2xl">
            <span className="font-mono text-caption uppercase text-accent-on-dark">Contact</span>
            <h1 className="mt-4 text-h1 text-white">Talk to a person</h1>
            <p className="mt-5 text-body-lg text-fg-on-dark-secondary">
              Sales, migrations and technical questions all reach the same team.
              There is no tier of support you have to buy into.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <h2 className="text-h3 text-fg">Send us a message</h2>
            <p className="mt-3 text-body text-fg-secondary">
              This opens a ticket in your Serverlys account so the reply is
              tracked rather than lost in a mailbox.
            </p>

            <form
              action={`${billing.root}/submitticket.php`}
              method="POST"
              className="mt-8 flex flex-col gap-6"
            >
              {/* Sales department. The field name is the WHMCS contract. */}
              <input type="hidden" name="step" value="3" />
              <input type="hidden" name="deptid" value="1" />

              <div className="grid gap-6 sm:grid-cols-2">
                <Field name="name" label="Your name" required>
                  <Input name="name" autoComplete="name" required />
                </Field>
                <Field name="email" label="Email" required>
                  <Input name="email" type="email" autoComplete="email" required />
                </Field>
              </div>

              <Field name="subject" label="What is it about?" required>
                <Select name="subject" required defaultValue="">
                  <option value="" disabled>
                    Choose one
                  </option>
                  <option>Choosing a plan</option>
                  <option>Migrating an existing site</option>
                  <option>Domains</option>
                  <option>AI agents and automations</option>
                  <option>Websites and design</option>
                  <option>Something else</option>
                </Select>
              </Field>

              <Field
                name="message"
                label="Tell us what you need"
                description="What the site does and roughly how much traffic it gets helps us answer properly."
                required
              >
                <Textarea name="message" hasDescription required rows={6} />
              </Field>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit" size="lg">
                  Send message
                </Button>
                <p className="text-small text-fg-muted">
                  Goes to your Serverlys ticket queue.
                </p>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { icon: "mail" as const, label: "Email", value: company.email, href: `mailto:${company.email}` },
              { icon: "phone" as const, label: "Phone", value: company.phone, href: company.phoneHref },
              { icon: "shield" as const, label: "Client login", value: "Billing and services", href: billing.login },
              { icon: "lifebuoy" as const, label: "Open a ticket", value: "Existing customers", href: billing.sales },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="group flex items-start gap-4 rounded-xl bg-canvas-secondary p-5 ring-1 ring-inset ring-line transition-colors hover:bg-canvas-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span aria-hidden="true" className="mt-0.5 shrink-0 text-primary">
                  <NavIcon name={c.icon} />
                </span>
                <span>
                  <span className="block text-body font-semibold text-fg">{c.label}</span>
                  <span className="mt-0.5 block text-small text-fg-secondary">{c.value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </Container>

      <FinalCta />
    </>
  );
}
