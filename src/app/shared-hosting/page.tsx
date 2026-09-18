import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { SharedLimitsMock } from "@/components/product-ui/infra";
import { NavIcon } from "@/components/navigation/nav-icons";
import { billing } from "@/data/company";
import { lowestRate, formatPrice } from "@/data/pricing";
import { pageMetadata, breadcrumbGraph, faqGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";

const PATH = "/shared-hosting";


export const metadata = pageMetadata({
  title: `Shared Hosting from ${formatPrice(lowestRate)}/mo | Serverlys`,
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
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Hosting", path: "/hosting" },
          { name: "Shared hosting", path: PATH },
        ])}
      />
      <JsonLd data={faqGraph(FAQS)} />

      <ProductHero
        eyebrow="Shared hosting"
        title="The entry tier, described honestly"
        lede="Shared hosting is the right answer more often than the industry admits, and the wrong answer in a few specific cases. Here are both, before the price."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Hosting", href: "/hosting" },
          { name: "Shared hosting" },
        ]}
        specs={[
          { label: "From", value: `${formatPrice(lowestRate)}/mo` },
          { label: "SSL", value: "Free" },
          { label: "Backups", value: "Daily" },
          { label: "Migration", value: "Free" },
        ]}
        primary={{ label: "Ask about shared hosting", href: billing.sales }}
        secondary={{ label: "Compare the tiers", href: "/hosting-alternatives" }}
        visual={<SharedLimitsMock />}
      />

      {/* Fit test. Two columns, deliberately not cards — this is a decision,
          not a feature grid, and it reads as a decision. */}
      <Section>
        <SectionHeader
          eyebrow="Before you buy"
          title="Is this the right tier for you?"
          lede="We would rather lose the sale than sell you a plan that will frustrate you in four months."
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="flex items-center gap-2.5 text-body-lg font-semibold text-fg">
              <span aria-hidden="true" className="text-success">
                <NavIcon name="shield" />
              </span>
              Shared hosting suits this
            </h3>
            <ul className="mt-5 flex flex-col divide-y divide-line border-y border-line">
              {FITS.map((f) => (
                <li key={f} className="py-3.5 text-body text-fg-secondary">
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="flex items-center gap-2.5 text-body-lg font-semibold text-fg">
              <span aria-hidden="true" className="text-warning">
                <NavIcon name="bolt" />
              </span>
              Choose a different tier for this
            </h3>
            <ul className="mt-5 flex flex-col divide-y divide-line border-y border-line">
              {DOES_NOT_FIT.map((f) => (
                <li key={f} className="py-3.5 text-body text-fg-secondary">
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-small text-fg-muted">
              If you recognised yourself on this side,{" "}
              <Link href="/cloud-hosting" className="font-medium text-primary hover:text-primary-hover">
                cloud hosting
              </Link>{" "}
              is usually the next step, and{" "}
              <Link href="/vps-hosting" className="font-medium text-primary hover:text-primary-hover">
                a VPS
              </Link>{" "}
              if you need root.
            </p>
          </div>
        </div>
      </Section>

      {/* What you get, as a dense spec strip rather than another card grid. */}
      <Section surface="dark" spacing="tight">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-center lg:gap-16">
          <SectionHeader
            eyebrow="Included"
            tone="dark"
            title="Nothing held back for a higher tier"
            lede="These are the same on every Serverlys plan. The tiers differ in resources, not in what we will let you have."
          />
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-3">
            {[
              ["Free SSL", "Issued and renewed"],
              ["Daily backups", "Restores are free"],
              ["Free migration", "Staged, then cut over"],
              ["Email", "At your own domain"],
              ["One-click WordPress", "Tuned before you arrive"],
              ["Real support", "One queue, every plan"],
            ].map(([t, d]) => (
              <div key={t} className="bg-canvas-dark p-5">
                <dt className="text-body font-semibold text-white">{t}</dt>
                <dd className="mt-1 text-small text-fg-on-dark-secondary">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Upgrade path as a horizontal ladder — the tier's exit, made explicit. */}
      <Section surface="subtle">
        <SectionHeader
          eyebrow="Where it goes next"
          title="The upgrade path, prorated"
          lede="Moving up is a billing change, not a project. Your site, database and email stay where they are."
        />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl bg-line md:grid-cols-4">
          {[
            { n: "01", t: "Shared", d: "You are here. Fine until traffic stops being predictable.", href: null },
            { n: "02", t: "Cloud", d: "Pooled resources absorb the spike instead of dropping it.", href: "/cloud-hosting" },
            { n: "03", t: "VPS", d: "Root access, guaranteed slice, your own system packages.", href: "/vps-hosting" },
            { n: "04", t: "Dedicated", d: "The whole machine, for sustained heavy load.", href: "/dedicated-servers" },
          ].map((s) => (
            <li key={s.t} className="flex flex-col gap-2 bg-canvas p-6">
              <span className="font-mono text-caption text-fg-muted">{s.n}</span>
              <h3 className="text-body-lg font-semibold text-fg">{s.t}</h3>
              <p className="flex-1 text-small text-fg-secondary">{s.d}</p>
              {s.href ? (
                <Link
                  href={s.href}
                  className="mt-2 inline-flex min-h-6 items-center text-small font-semibold text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {s.t} hosting
                </Link>
              ) : (
                <span className="mt-2 text-small font-medium text-fg-muted">This plan</span>
              )}
            </li>
          ))}
        </ol>
      </Section>

      <FaqSection items={FAQS} />

      <Container className="pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-canvas-secondary p-8 ring-1 ring-inset ring-line sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-h4 text-fg">Not sure which tier you need?</h2>
            <p className="mt-2 max-w-xl text-body text-fg-secondary">
              Tell us what the site does and roughly what traffic it gets. We
              will tell you the smallest plan that will hold it.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href={billing.sales}>Ask us</Button>
            <Button href={billing.store("cloud-hosting")} variant="secondary">
              See plans
            </Button>
          </div>
        </div>
      </Container>

      <FinalCta />
    </>
  );
}
