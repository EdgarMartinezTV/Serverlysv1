import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Band, Heading, Pill, Tick } from "../hosting/_components/band";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { SharedLimitsMock } from "@/components/product-ui/infra";
import { NavIcon } from "@/components/navigation/nav-icons";
import { billing } from "@/data/company";
import { pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";

const PATH = "/shared-hosting";

export const metadata = pageMetadata({
  /* No price in the title: the tier is not orderable yet, and a bare
     monthly rate without its renewal breaks the both-prices rule. */
  title: "Shared Hosting, coming soon | Serverlys",
  description:
    "The entry tier, described honestly: what shared hosting is genuinely good for, where it runs out, and how to tell when you have outgrown it.",
  path: PATH,
});

/**
 * Shared hosting.
 *
 * The page's architecture is a FIT TEST, not a feature list. Shared hosting is
 * the tier most often mis-sold — bought by people who needed cloud, and
 * avoided by people it would have suited fine. So the spine of the page is
 * "is this you / is this not you", and the limits are stated before the
 * inclusions rather than buried under them.
 */
const FITS = [
  "A brochure site for a local business",
  "A portfolio, a CV site or a personal blog",
  "A WordPress site with a normal amount of traffic",
  "A landing page for a campaign",
  "A first site, where the honest answer is that you do not know the traffic yet",
];

const DOES_NOT_FIT = [
  "A store taking orders through a busy season",
  "Anything that needs root access or a custom system package",
  "A site that has already been throttled somewhere else",
  "Background workers, queues or a long-running process",
  "Traffic that arrives in spikes rather than a trickle",
];

const FAQS: readonly Faq[] = [
  {
    question: "What does 'shared' actually mean?",
    answer:
      "Your site runs on a server alongside other sites, and you share its CPU and memory. That is what makes it inexpensive. It also means a neighbour having a very busy day can affect you, which is the trade you are accepting at this price.",
    scopes: [PATH],
  },
  {
    question: "How much traffic can it take?",
    answer:
      "There is no honest single number, because it depends entirely on what your pages do. A cached WordPress brochure site behaves very differently from an uncached page that queries a database on every visit. What we can tell you is that your control panel shows your resource usage, so you can see headroom rather than guess at it.",
    scopes: [PATH],
  },
  {
    question: "What happens if I outgrow it?",
    answer:
      "You upgrade, prorated to your billing cycle, and the site moves with it. Nothing is rebuilt and nothing is re-uploaded. We would rather move you up early than have you find out at your busiest hour.",
    scopes: [PATH],
  },
  {
    question: "Is the SSL certificate really free?",
    answer:
      "Yes, issued and renewed automatically, on every plan including this one. Nobody should be charged for HTTPS in 2026.",
    scopes: [PATH],
  },
];

export default function SharedHostingPage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, "/shared-hosting")} />
      <JsonLd
        data={serviceGraph({
          name: "Serverlys Shared Hosting",
          serviceType: "Shared web hosting",
          description: String(metadata.description ?? ""),
          path: PATH,
        })}
      />

      <ProductHero
        eyebrow="Shared hosting · coming soon"
        title="The entry tier, described honestly"
        lede="Shared hosting is the right answer more often than the industry admits, and the wrong answer in a few specific cases. Here are both, before the price."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Hosting", href: "/hosting" },
          { name: "Shared hosting" },
        ]}
        specs={[
          { label: "Status", value: "Coming soon" },
          { label: "SSL", value: "Free" },
          { label: "Backups", value: "Daily" },
          { label: "Migration", value: "Free" },
        ]}
        primary={{ label: "Ask about shared hosting", href: billing.sales }}
        secondary={{ label: "Compare the tiers", href: "/hosting-alternatives" }}
        visual={<SharedLimitsMock />}
      />

      {/* Fit test: a decision, two sides. */}
      <Band labelledBy="sh-fit-heading">
        <Heading
          id="sh-fit-heading"
          title="Is this the right tier for you?"
          lede="We would rather lose the sale than sell you a plan that frustrates you in four months."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl bg-canvas-secondary p-7 sm:p-9">
            <Pill tone="success">Shared hosting suits this</Pill>
            <ul className="mt-6 flex flex-col gap-3.5">
              {FITS.map((f) => (
                <li key={f} className="flex items-start gap-3 text-body text-fg">
                  <Tick />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-brand-50 p-7 sm:p-9">
            <Pill tone="brand">Choose a different tier for this</Pill>
            <ul className="mt-6 flex flex-col gap-3.5">
              {DOES_NOT_FIT.map((f) => (
                <li key={f} className="flex items-start gap-3 text-body text-fg">
                  <span aria-hidden="true" className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">→</span>
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-small text-fg-secondary">
              If you recognised yourself here,{" "}
              <Link href="/cloud-hosting" className="font-semibold text-primary hover:text-primary-hover">
                cloud hosting
              </Link>{" "}
              is usually the next step, and{" "}
              <Link href="/vps-hosting" className="font-semibold text-primary hover:text-primary-hover">
                a VPS
              </Link>{" "}
              if you need root.
            </p>
          </div>
        </div>
      </Band>

      {/* Included on every plan. */}
      <Band tone="dark" labelledBy="sh-included-heading">
        <Heading
          id="sh-included-heading"
          dark
          title="Nothing held back for a higher tier"
          lede="These are the same on every Serverlys plan. Tiers differ in resources, not in what you are allowed to have."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Free SSL", "Issued and renewed automatically.", "shield"],
              ["Daily backups", "Restores are free, whole site or one file.", "gauge"],
              ["Free migration", "Staged first, then cut over when you say.", "globe"],
              ["Email", "Mailboxes at your own domain.", "mail"],
              ["One-click WordPress", "Installed and tuned before you arrive.", "layout"],
              ["Real support", "One queue, every plan.", "chat"],
            ] as const
          ).map(([t, d, icon]) => (
            <li key={t} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <span aria-hidden="true" className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-white">
                <NavIcon name={icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-body-lg font-medium text-white">{t}</h3>
              <p className="mt-1.5 text-small text-fg-on-dark-secondary">{d}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* Upgrade path: a real sequence, so it keeps its order. */}
      <Band tone="subtle" labelledBy="sh-path-heading">
        <Heading
          id="sh-path-heading"
          title="The upgrade path, prorated"
          lede="Moving up is a billing change, not a project. Your site, database and email stay where they are."
        />
        <ol className="relative mt-12 grid gap-4 md:grid-cols-4">
          <span aria-hidden="true" className="absolute top-9 right-[12%] left-[12%] hidden h-px bg-brand-200 md:block" />
          {[
            { t: "Shared", d: "Fine until traffic stops being predictable.", href: null, status: "Soon" },
            { t: "Cloud", d: "Pooled resources absorb the spike instead of dropping it.", href: "/cloud-hosting", status: "Available now" },
            { t: "VPS", d: "Root access, a guaranteed slice, your own system packages.", href: "/vps-hosting", status: "Soon" },
            { t: "Dedicated", d: "The whole machine, for sustained heavy load.", href: "/dedicated-servers", status: "Soon" },
          ].map((step, i) => (
            <li key={step.t} className="relative flex flex-col rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <span className={`inline-flex size-7 items-center justify-center rounded-full text-micro font-semibold ${i === 0 ? "bg-primary text-white" : "bg-brand-50 text-primary"}`}>
                {i + 1}
              </span>
              <span className="mt-5 flex items-center justify-between gap-2">
                <h3 className="text-body-lg font-semibold text-fg">{step.t}</h3>
                <Pill tone={step.status === "Available now" ? "success" : "warning"}>{step.status}</Pill>
              </span>
              <p className="mt-2 flex-1 text-small text-fg-secondary">{step.d}</p>
              {step.href ? (
                <Link href={step.href} className="mt-4 inline-flex min-h-6 items-center text-small font-semibold text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  {step.t} hosting →
                </Link>
              ) : (
                <span className="mt-4 text-small font-medium text-fg-muted">This page</span>
              )}
            </li>
          ))}
        </ol>
      </Band>

      <FaqSection items={FAQS} />

      <Container className="pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[linear-gradient(90deg,var(--color-brand-950)_0%,var(--color-brand-700)_55%,var(--color-brand-500)_100%)] p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-h4 text-white">Not sure which tier you need?</h2>
            <p className="mt-2 max-w-xl text-body text-fg-on-brand-muted">
              Tell us what the site does and roughly what traffic it gets. We
              will tell you the smallest plan that will hold it.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href={billing.sales} variant="inverse">Ask us</Button>
            <Button href="/cloud-hosting#pricing" variant="onBrand">
              See cloud plans
            </Button>
          </div>
        </div>
      </Container>

      <FinalCta />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
