import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button, IconButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, FeatureCard, TestimonialCard } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Checkbox, Radio, ChoiceGroup } from "@/components/ui/choice";
import { Spinner } from "@/components/ui/spinner";
import { DashboardMock } from "@/components/product-ui/dashboard";
import {
  HostingMock,
  DomainMock,
  ChatMock,
  CallMock,
  AutomationMock,
  SeoMock,
  SitePreviewMock,
} from "@/components/product-ui/mocks";

/**
 * Design-system gallery.
 *
 * A working surface for reviewing every primitive in one place — and the only
 * place some of them are currently rendered, so it doubles as the proof that
 * they work. Deliberately noindex: it is an internal tool, not site content.
 */
export const metadata: Metadata = {
  title: "Design System — Serverlys",
  robots: { index: false, follow: false },
};

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-10">
      <h2 className="mb-6 font-mono text-caption uppercase text-fg-muted">{title}</h2>
      {children}
    </section>
  );
}

const SWATCHES: Array<[string, string]> = [
  ["primary", "bg-primary"],
  ["primary-hover", "bg-primary-hover"],
  ["primary-soft", "bg-primary-soft"],
  ["canvas", "bg-canvas"],
  ["canvas-secondary", "bg-canvas-secondary"],
  ["canvas-inset", "bg-canvas-inset"],
  ["canvas-dark", "bg-canvas-dark"],
  ["success", "bg-success"],
  ["warning", "bg-warning"],
  ["error", "bg-error"],
  ["line", "bg-line"],
  ["line-input", "bg-line-input"],
];

export default function DesignSystemPage() {
  return (
    <Container className="py-16">
      <header className="pb-8">
        <Badge tone="brand">Internal</Badge>
        <h1 className="mt-4 text-h1 text-fg">Serverlys Design System</h1>
        <p className="mt-3 max-w-reading text-body-lg text-fg-secondary">
          Every primitive in the system, rendered. If something looks wrong here, it is
          wrong everywhere.
        </p>
      </header>

      <Row title="Typography">
        <div className="flex flex-col gap-3">
          <p className="text-display text-fg">Display — hero only</p>
          <p className="text-h1 text-fg">H1 — page title</p>
          <p className="text-h2 text-fg">H2 — section title</p>
          <p className="text-h3 text-fg">H3 — subsection</p>
          <p className="text-h4 text-fg">H4 — card title</p>
          <p className="text-body-lg text-fg-secondary">
            Body Large — ledes and intros
          </p>
          <p className="text-body text-fg-secondary">Body — default paragraph text</p>
          <p className="text-small text-fg-secondary">Small — supporting detail</p>
          <p className="font-mono text-caption uppercase text-fg-muted">
            Caption — eyebrows and labels
          </p>
          <p className="tabular text-body text-fg">
            Tabular figures 0123456789 · $7.95 · $12.62
          </p>
        </div>
      </Row>

      <Row title="Colour">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {SWATCHES.map(([name, cls]) => (
            <li key={name} className="flex flex-col gap-2">
              <span
                className={`h-14 w-full rounded-md ring-1 ring-inset ring-line ${cls}`}
              />
              <code className="text-caption text-fg-muted">{name}</code>
            </li>
          ))}
        </ul>
      </Row>

      <Row title="Elevation">
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-5">
          {/* Class names written in full — Tailwind scans statically, so a
              template-literal class like `shadow-${e}` is never generated. */}
          {[
            ["e1", "shadow-e1"],
            ["e2", "shadow-e2"],
            ["e3", "shadow-e3"],
            ["e4", "shadow-e4"],
            ["e5", "shadow-e5"],
          ].map(([name, cls]) => (
            <li
              key={name}
              className={`flex h-24 items-center justify-center rounded-lg bg-surface ${cls}`}
            >
              <code className="text-caption text-fg-muted">{name}</code>
            </li>
          ))}
        </ul>
      </Row>

      <Row title="Radius">
        <ul className="flex flex-wrap gap-5">
          {[
            ["xs", "rounded-xs"],
            ["sm", "rounded-sm"],
            ["md", "rounded-md"],
            ["lg", "rounded-lg"],
            ["xl", "rounded-xl"],
            ["2xl", "rounded-2xl"],
          ].map(([name, cls]) => (
            <li key={name} className="flex flex-col items-center gap-2">
              <span
                className={`block h-16 w-16 bg-primary-soft ring-1 ring-inset ring-primary/20 ${cls}`}
              />
              <code className="text-caption text-fg-muted">{name}</code>
            </li>
          ))}
        </ul>
      </Row>

      <Row title="Buttons">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="text">Text link</Button>
            <IconButton label="Open menu" variant="secondary">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </IconButton>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-lg bg-canvas-dark p-5">
            <Button variant="inverse">Inverse</Button>
            <Button variant="inverseOutline">Inverse outline</Button>
            <Spinner size="md" className="text-fg-on-dark-muted" />
          </div>
        </div>
      </Row>

      <Row title="Badges">
        <div className="flex flex-wrap gap-3">
          <Badge tone="brand">Brand</Badge>
          <Badge tone="success">Operational</Badge>
          <Badge tone="warning">Coming soon</Badge>
          <Badge tone="error">Suspended</Badge>
          <Badge tone="neutral">Neutral</Badge>
        </div>
      </Row>

      <Row title="Cards">
        <div className="grid gap-5 lg:grid-cols-3">
          <Card variant="basic" padding="md">
            <h3 className="text-h4 text-fg">Basic</h3>
            <p className="mt-2 text-small text-fg-secondary">
              Flat and edge-defined. For dense grids where elevation would be noise.
            </p>
          </Card>
          <Card variant="elevated" padding="md">
            <h3 className="text-h4 text-fg">Elevated</h3>
            <p className="mt-2 text-small text-fg-secondary">
              Lifted. For content that should read as a distinct object.
            </p>
          </Card>
          <ul className="contents">
            <FeatureCard
              title="Interactive"
              href="/design-system"
              linkLabel="Explore"
              icon={
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
                  <path
                    d="M4 10h12M11 5l5 5-5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              The whole card is a link via a stretched overlay, with no nested
              interactive elements.
            </FeatureCard>
          </ul>
        </div>
        <ul className="mt-5 grid gap-5 lg:grid-cols-2">
          <TestimonialCard
            quote="They moved four sites and the mailboxes over a weekend. Nothing broke, and nobody noticed."
            author="Sample Attribution"
            role="Operations lead"
            company="Example Co"
          />
          <TestimonialCard
            quote="The renewal price was on the pricing page. That alone put them ahead of the last three hosts we used."
            author="Sample Attribution"
            role="Founder"
            company="Example Studio"
          />
        </ul>
      </Row>

      <Row title="Product interfaces">
        <div className="flex flex-col gap-8">
          <DashboardMock />
          <div className="grid gap-6 lg:grid-cols-2">
            <HostingMock />
            <DomainMock />
            <ChatMock />
            <SeoMock />
            <SitePreviewMock />
            <AutomationMock />
          </div>
          <div className="flex justify-center">
            <CallMock />
          </div>
        </div>
      </Row>

      <Row title="Forms">
        <form className="grid max-w-2xl gap-6">
          <Field
            name="domain"
            label="Domain name"
            description="Without www or https://"
            required
          >
            <Input name="domain" placeholder="yourbusiness" hasDescription required />
          </Field>

          <Field name="plan" label="Plan">
            <Select name="plan" defaultValue="turbo">
              <option value="starter">Starter Cloud</option>
              <option value="plus">Plus Cloud</option>
              <option value="turbo">Turbo Cloud</option>
            </Select>
          </Field>

          <Field name="message" label="What does the site do?">
            <Textarea
              name="message"
              placeholder="A short description helps us recommend a tier."
            />
          </Field>

          <Field
            name="email"
            label="Email"
            error="Enter a valid email address."
            required
          >
            <Input
              name="email"
              type="email"
              defaultValue="not-an-email"
              invalid
              required
            />
          </Field>

          <Field
            name="verified"
            label="Current host"
            success="Host detected automatically."
          >
            <Input name="verified" defaultValue="cpanel.example.com" readOnly />
          </Field>

          <ChoiceGroup
            legend="Migration window"
            description="We switch DNS at a time you pick."
          >
            <Radio
              name="window"
              value="business"
              label="Business hours"
              defaultChecked
            />
            <Radio
              name="window"
              value="evening"
              label="Evening"
              description="After 18:00 local time"
            />
            <Radio name="window" value="weekend" label="Weekend" />
          </ChoiceGroup>

          <Checkbox
            name="backups"
            label="Enable daily backups"
            description="Included free on every plan."
            defaultChecked
          />
          <Checkbox name="disabled" label="Unavailable option" disabled />

          <div className="flex gap-3">
            <Button type="submit">Submit</Button>
            <Button type="button" variant="secondary" loading>
              Checking
            </Button>
          </div>
        </form>
      </Row>
    </Container>
  );
}
