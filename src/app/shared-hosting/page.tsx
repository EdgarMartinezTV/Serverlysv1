import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Band, Heading, Pill, Tick } from "../hosting/_components/band";
import { ComingSoonNotice, CloudPlansToday } from "../hosting/_components/coming-soon";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { JsonLd } from "@/components/ui/json-ld";
import { SharedLimitsMock, SharedAccountMock } from "@/components/product-ui/infra";
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
    "Serverlys shared hosting is coming soon. What shared hosting is good for, where it runs out, what the plan will include, and what to use today instead.",
  path: PATH,
});

/**
 * Shared hosting — COMING SOON. Not orderable: no price, no launch date, and
 * no Offer in the structured data (the Service graph carries none).
 * Inclusions are worded as planned.
 *
 * The page's architecture is a FIT TEST, not a feature list. Shared hosting is
 * the tier most often mis-sold — bought by people who needed cloud, and
 * avoided by people it would have suited fine. So the spine of the page is
 * "is this you / is this not you", and the limits are stated before the
 * inclusions rather than buried under them. The cloud plans, which ARE on
 * sale, are shown with real prices as the thing to use today.
 */
const FITS = [
  "A brochure site for a small business",
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

/** Typical workloads, each with the setting that matters most for it. */
const WORKLOADS: ReadonlyArray<[title: string, body: string, tip: string]> = [
  [
    "A WordPress brochure site",
    "Five to twenty pages, a contact form and a blog. This is the workload shared hosting was designed around, and it runs it well.",
    "Use a page cache. A cached page is served without running PHP, which is most of your headroom.",
  ],
  [
    "A portfolio or personal blog",
    "Mostly images and text, updated a few times a month, read far more often than it is written.",
    "Resize images before upload. Image weight, not the server, is what makes these sites slow.",
  ],
  [
    "A static HTML site",
    "Hand-written or exported from a site builder or static generator: no database, no PHP, almost no load.",
    "Static files are the cheapest thing to serve. This will run comfortably on the smallest plan.",
  ],
  [
    "A campaign landing page",
    "One page and a form, live for weeks or months, often on its own subdomain.",
    "If the campaign is a big launch or a TV spot, plan for the spike rather than the average.",
  ],
  [
    "Email at your own domain",
    "hello@ and sales@ at your business name instead of a free webmail address, alongside the site.",
    "Set SPF, DKIM and DMARC records so your mail lands in inboxes rather than spam.",
  ],
  [
    "A small catalogue or booking site",
    "A few products, a booking form or a donation page with modest, steady orders.",
    "Checkout pages cannot be cached. If orders grow or arrive in bursts, move up to cloud.",
  ],
];

/** Shared is managed by nature; the line is still worth drawing. */
const DUTIES: ReadonlyArray<[task: string, owner: string]> = [
  ["Server hardware, operating system and security patches", "Serverlys"],
  ["Web server, PHP and database server", "Serverlys"],
  ["Isolation between accounts on the server", "Serverlys"],
  ["SSL certificates issued and renewed", "Serverlys"],
  ["Daily backups taken", "Serverlys"],
  ["Choosing your PHP version from the supported list", "You"],
  ["WordPress plugins and themes, and keeping them updated", "You"],
  ["Strong passwords and who has access to the site", "You"],
  ["Your content, and what you upload", "You"],
];

const OUTGROWN = [
  ["Slow at your busiest hour, fine at 3am", "That is contention for CPU or PHP processes, not your code. More reserved resources fix it."],
  ["Usage warnings in your panel", "Hitting a process or CPU limit regularly means the plan is too small, not that you did something wrong."],
  ["You started taking real orders", "Checkout traffic is uncached by design. Revenue pages deserve headroom."],
  ["You need something installed", "A system package, a Node or Python process, a background worker: that is a VPS question."],
] as const;

const FAQS: readonly Faq[] = [
  {
    question: "Can I buy Serverlys shared hosting today?",
    answer:
      "Not yet. Shared hosting is coming soon, and we are not publishing a price or a launch date until both are real. Our cloud hosting is available now, is fully managed and runs the same kinds of sites. If you would rather wait for shared, open a ticket with our sales team and we will tell you when it opens.",
    scopes: [PATH],
  },
  {
    question: "What does 'shared' actually mean?",
    answer:
      "Your site runs on a server alongside other sites, and you share its CPU and memory. That is what makes it inexpensive. It also means a neighbour having a very busy day can affect you, which is the trade you are accepting at this tier.",
    scopes: [PATH],
  },
  {
    question: "Is my site safe from the other sites on the server?",
    answer:
      "Each account is kept separate: your files, databases and mailboxes belong to your account and other customers cannot read them. What you share is capacity, not access. Most compromises on any host come from an outdated plugin or a reused password, which is why keeping WordPress and its plugins updated matters more than the tier.",
    scopes: [PATH],
  },
  {
    question: "How much traffic can it take?",
    answer:
      "There is no honest single number, because it depends entirely on what your pages do. A cached WordPress brochure site behaves very differently from an uncached page that queries a database on every visit. What we plan is that your control panel shows your resource usage, so you can see headroom rather than guess at it.",
    scopes: [PATH],
  },
  {
    question: "Can I run WordPress and WooCommerce on shared hosting?",
    answer:
      "WordPress, yes: it is the most common thing shared hosting runs, and one-click installation is planned. A small WooCommerce shop with steady, modest orders can work too. A store with a busy season or a large catalogue is better on cloud hosting, because checkout pages cannot be cached and every order uses server resources.",
    scopes: [PATH],
  },
  {
    question: "Can I run Node.js or Python on shared hosting?",
    answer:
      "Plan on no. Shared hosting is built for PHP and static sites served by the web server, and it does not suit long-running processes, background workers or custom system packages. If your application needs any of those, it belongs on a VPS.",
    scopes: [PATH],
  },
  {
    question: "Will email at my own domain be included?",
    answer:
      "Mailboxes at your own domain are planned for shared hosting, as they are part of the hosting we sell today. Whichever host you use, publish SPF, DKIM and DMARC records for your domain: without them, mail from a small business domain is far more likely to land in spam.",
    scopes: [PATH],
  },
  {
    question: "What happens if I outgrow it?",
    answer:
      "The plan is that you upgrade and the site moves with it. Nothing is rebuilt and nothing is re-uploaded. We would rather move you up early than have you find out at your busiest hour.",
    scopes: [PATH],
  },
  {
    question: "Is the SSL certificate really free?",
    answer:
      "Yes. Free SSL, issued and renewed automatically, is included on every Serverlys plan available today and is planned for this one too. Nobody should be charged for HTTPS in 2026.",
    scopes: [PATH],
  },
  {
    question: "Should I wait for shared hosting or start on cloud?",
    answer:
      "If you need a site live now, start on cloud hosting: it is available today, fully managed, and comfortably runs everything shared hosting would. If your site is small and price is the deciding factor, ask us to tell you when shared plans open. Either way, moving between Serverlys plans is not a rebuild.",
    scopes: [PATH],
  },
];

export default function SharedHostingPage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />
      {/* Service only — no Offer, no price: the product is not on sale. */}
      <JsonLd
        data={serviceGraph({
          name: "Serverlys Shared Hosting (coming soon)",
          serviceType: "Shared web hosting",
          description: String(metadata.description ?? ""),
          path: PATH,
        })}
      />

      <ProductHero
        eyebrow="Shared hosting · coming soon"
        title="The entry tier, described honestly"
        lede="Shared hosting is the right answer more often than the industry admits, and the wrong answer in a few specific cases. It is not on sale yet: here are both cases, what the plan will include, and what to use in the meantime."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Hosting", href: "/hosting" },
          { name: "Shared hosting" },
        ]}
        specs={[
          { label: "Status", value: "Coming soon" },
          { label: "SSL", value: "Free" },
          { label: "Backups", value: "Daily" },
          { label: "Admin", value: "Fully managed" },
        ]}
        primary={{ label: "Ask to be told at launch", href: billing.sales }}
        secondary={{ label: "Cloud hosting, available now", href: "/cloud-hosting" }}
        visual={<SharedLimitsMock />}
      />

      <section aria-labelledby="sh-status-heading" className="bg-canvas pt-16 lg:pt-24">
        <Container width="wide">
          <h2 id="sh-status-heading" className="sr-only">Availability</h2>
          <ComingSoonNotice product="Serverlys shared hosting" />
        </Container>
      </section>

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

      {/* How it works. */}
      <ShowcaseSplit
        id="how-it-works"
        eyebrow="How shared hosting works"
        title="One server, many accounts, everything run for you"
        body="A shared server hosts many customer accounts at once. Each account is walled off from the others, with its own files, databases and mailboxes, but they all draw on the same pool of CPU and memory. Per-account limits on CPU, memory and concurrent processes stop any one site from taking the whole machine. In return for sharing, you never touch the server: the operating system, web server, PHP and security patching are ours."
        points={[
          { label: "Your account, walled off", detail: "Other customers share capacity with you, not access to your files.", icon: "shield" },
          { label: "A control panel, not a shell", detail: "Sites, email, databases and backups from one place.", icon: "layout" },
          { label: "Limits you can see", detail: "Usage is shown in the panel, so headroom is never a guess.", icon: "gauge" },
        ]}
        visual={<SharedAccountMock />}
        side="right"
        surface="subtle"
        bleed
      />

      {/* Typical workloads. */}
      <Band labelledBy="sh-work-heading">
        <Heading
          id="sh-work-heading"
          title="What runs well on shared hosting"
          lede="Sites that are read far more often than they change, with traffic that arrives as a steady trickle. Each comes with the one setting that matters most."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {WORKLOADS.map(([t, d, tip]) => (
            <li key={t} className="flex flex-col rounded-2xl bg-canvas-secondary p-6">
              <h3 className="text-body-lg font-medium text-fg">{t}</h3>
              <p className="mt-2 flex-1 text-small text-fg-secondary">{d}</p>
              <p className="mt-4 rounded-lg bg-canvas px-3 py-2 text-small text-fg ring-1 ring-line">
                <span className="font-semibold">Tip: </span>
                {tip}
              </p>
            </li>
          ))}
        </ul>
      </Band>

      {/* Planned inclusions. */}
      <Band tone="dark" labelledBy="sh-included-heading">
        <Heading
          id="sh-included-heading"
          dark
          title="Nothing held back for a higher tier"
          lede="Planned for launch. These are what every Serverlys plan includes today, and shared hosting is being built to the same list. Tiers differ in resources, not in what you are allowed to have."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Free SSL", "Issued and renewed automatically.", "shield"],
              ["Daily backups", "Restore a whole site or a single file.", "gauge"],
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

      {/* Responsibilities. */}
      <Band labelledBy="sh-duty-heading">
        <Heading
          id="sh-duty-heading"
          title="Fully managed, with one honest exception"
          lede="On shared hosting the server is entirely ours to run. What stays yours is the website itself, and that is where most problems on any host begin."
        />
        <div className="mx-auto mt-10 max-w-[760px] overflow-x-auto rounded-2xl bg-canvas ring-1 ring-line">
          <table className="w-full min-w-[440px] text-left text-small">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-5 py-3.5 font-semibold text-fg">Task</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-fg">Who does it</th>
              </tr>
            </thead>
            <tbody>
              {DUTIES.map(([task, owner]) => (
                <tr key={task} className="border-b border-line-subtle last:border-0">
                  <th scope="row" className="px-5 py-3 font-normal text-fg">{task}</th>
                  <td className={`px-5 py-3 ${owner === "You" ? "font-semibold text-fg" : "text-fg-secondary"}`}>{owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Band>

      {/* Signs you have outgrown it. */}
      <Band tone="subtle" labelledBy="sh-outgrown-heading">
        <Heading
          id="sh-outgrown-heading"
          title="Four signs a site has outgrown shared hosting"
          lede="On any provider. None of them means you chose wrong at the start; they mean the site did well."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {OUTGROWN.map(([t, d]) => (
            <li key={t} className="rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <h3 className="text-body-lg font-medium text-fg">{t}</h3>
              <p className="mt-2 text-small text-fg-secondary">{d}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* Shared vs cloud, and the plans that exist today. */}
      <Band labelledBy="sh-cloud-heading">
        <Heading
          id="sh-cloud-heading"
          title="Shared or cloud hosting: what you can use today"
          lede="Cloud hosting is on sale now. It runs the same sites with more memory and more room for traffic, and you manage it the same way, from a panel."
        />
        <div className="mx-auto mt-10 max-w-[960px] overflow-x-auto rounded-2xl bg-canvas ring-1 ring-line">
          <table className="w-full min-w-[600px] text-left text-small">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-5 py-3.5 font-semibold text-fg"><span className="sr-only">Feature</span></th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-fg">
                  Shared hosting <Pill tone="warning">Coming soon</Pill>
                </th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-fg">
                  Cloud hosting <Pill tone="success">Available now</Pill>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Resources", "Drawn from a shared pool", "More memory per plan, more room for spikes"],
                ["Best at", "Brochure sites, blogs, portfolios", "Growing sites, stores, agencies"],
                ["Server administration", "Done for you", "Done for you"],
                ["Managed from", "A control panel", "A control panel"],
                ["Busy-day behaviour", "Can slow when neighbours are busy", "Built to absorb the spike"],
                ["Price", "Not published yet", "Published below"],
              ].map(([k, s, c]) => (
                <tr key={k} className="border-b border-line-subtle last:border-0">
                  <th scope="row" className="px-5 py-3 font-medium text-fg">{k}</th>
                  <td className="px-5 py-3 text-fg-secondary">{s}</td>
                  <td className="px-5 py-3 text-fg-secondary">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CloudPlansToday />
      </Band>

      {/* Upgrade path: a real sequence, so it keeps its order. */}
      <Band tone="subtle" labelledBy="sh-path-heading">
        <Heading
          id="sh-path-heading"
          title="The upgrade path"
          lede="Moving up should be a plan change, not a project. Your site, database and email come with you."
        />
        <ol className="relative mt-12 grid gap-4 md:grid-cols-4">
          <span aria-hidden="true" className="absolute top-9 right-[12%] left-[12%] hidden h-px bg-brand-200 md:block" />
          {[
            { t: "Shared", d: "Fine until traffic stops being predictable.", href: null, status: "Soon" },
            { t: "Cloud", d: "Pooled resources absorb the spike instead of dropping it.", href: "/cloud-hosting", status: "Available now" },
            { t: "VPS", d: "Root access, a reserved slice, your own system packages.", href: "/vps-hosting", status: "Soon" },
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
            <h2 className="text-h4 text-white">Waiting for shared, or not sure which tier you need?</h2>
            <p className="mt-2 max-w-xl text-body text-fg-on-brand-muted">
              Tell us what the site does and roughly what traffic it gets. We will tell you the
              smallest plan that holds it today, and let you know when shared hosting opens.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href={billing.sales} variant="inverse" external>Ask us</Button>
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
