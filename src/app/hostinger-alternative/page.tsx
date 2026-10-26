import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Band, Heading, Pill, Stage, Tick } from "../hosting/_components/band";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { pageMetadata, faqGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";
import { billing } from "@/data/company";
import { breadcrumbTrail } from "@/data/routes";
import { groupById, formatPrice } from "@/data/pricing";
import { designFromPrice, formatDesignPrice } from "@/data/design-plans";

const PATH = "/hostinger-alternative";

export const metadata = pageMetadata({
  title: "Hostinger Alternative: Monthly Pricing, No Prepay",
  description:
    "A fair Hostinger alternative: Serverlys bills month to month, prints the renewal rate beside the price and migrates sites free. Dated, sourced figures.",
  path: PATH,
});

/**
 * /hostinger-alternative — commercial-investigation page for "hostinger
 * alternative(s)".
 *
 * This is the one place the site names a competitor, and /hosting-alternatives
 * explains why it otherwise does not: the author picks the criteria and the
 * author always wins. The rules that make THIS page acceptable anyway:
 *
 *   1. Every Hostinger figure was read off hostinger.com on SOURCE_DATE and is
 *      printed with that date and its URL. A figure we could not read there is
 *      left out, not estimated. Re-verify before changing a number, and change
 *      SOURCE_DATE in the same edit.
 *   2. Hostinger wins rows on this page, and the page says so. Their prepaid
 *      entry price is lower than ours and their entry renewal rate is too.
 *   3. Serverlys figures come from data/pricing.ts and are never typed here.
 *      They are a plain MONTHLY rate (the store's 1-month period is $7.95 for
 *      Starter, checked 2026-10-26). This page never describes a Serverlys
 *      price as tied to any multi-year commitment — see the header of
 *      data/pricing.ts.
 *   4. No Hostinger logo, colours or wordmark. No ratings, reviews or scores.
 */

const SOURCE_DATE = "2026-10-26";
const SOURCE_LABEL = "26 October 2026";
const HOSTINGER_WEB = "https://www.hostinger.com/web-hosting";
const HOSTINGER_WP = "https://www.hostinger.com/wordpress-hosting";
const HOSTINGER_MIGRATION = "https://www.hostinger.com/website-migration";
const HOSTINGER_TUTORIALS = "https://www.hostinger.com/tutorials/";

/**
 * Read off hostinger.com/web-hosting and /wordpress-hosting on SOURCE_DATE.
 * Both pages showed the same three plans with identical text, e.g.
 * "$2.49 /mo … Get 48 months for $119.52 (regular price $585.12). Renews at
 * $10.99/mo." and "All plans are paid upfront."
 */
const HOSTINGER = [
  { name: "Premium", intro: 2.49, renews: 10.99, months: 48, upfront: 119.52, backups: "Free weekly backups" },
  { name: "Unlimited", intro: 3.49, renews: 16.99, months: 48, upfront: 167.52, backups: "Daily backups + easy data restore" },
  { name: "Cloud Startup", intro: 7.99, renews: 25.99, months: 48, upfront: 383.52, backups: "Daily and on demand backups" },
] as const;

const cloud = groupById("cloud");
const PLANS = cloud?.plans ?? [];
const starter = PLANS[0];

const jump = (from: number, to: number) => `${Math.round(((to - from) / from) * 100)}%`;

const firstInvoice = starter ? starter.monthly + (starter.setupFee ?? 0) : 0;

const priceList = (values: readonly number[]) => values.map(formatPrice).join(" / ");

/** One row per decision the comparison actually turns on. */
const ROWS: ReadonlyArray<{ label: string; serverlys: React.ReactNode; hostinger: React.ReactNode }> = [
  {
    label: "Advertised price",
    serverlys: (
      <>
        {priceList(PLANS.map((p) => p.monthly))} per month
        {starter?.setupFee ? ` (Starter adds a one-off ${formatPrice(starter.setupFee)} setup fee)` : ""}
      </>
    ),
    hostinger: <>{priceList(HOSTINGER.map((p) => p.intro))} per month (Premium / Unlimited / Cloud Startup)</>,
  },
  {
    label: "Renewal price",
    serverlys: <>{priceList(PLANS.map((p) => p.standard))} per month, printed beside the advertised rate</>,
    hostinger: <>{priceList(HOSTINGER.map((p) => p.renews))} per month, printed on each plan card</>,
  },
  {
    label: "Billing needed for the advertised price",
    serverlys: <>None. The advertised price is the month-to-month rate.</>,
    hostinger: (
      <>
        A {HOSTINGER[0].months}-month plan paid upfront: {priceList(HOSTINGER.map((p) => p.upfront))} at checkout
      </>
    ),
  },
  {
    label: "Free migration",
    serverlys: <>Yes. We do it, staged first, and switch DNS only when you approve.</>,
    hostinger: <>Yes. Unlimited free migrations with a hosting plan; you submit a form and their team moves the site.</>,
  },
  {
    label: "Backups",
    serverlys: <>Daily on every plan. Restores are free and we run them for you.</>,
    hostinger: <>{HOSTINGER.map((p) => `${p.name}: ${p.backups.toLowerCase()}`).join("; ")}</>,
  },
  {
    label: "Support",
    serverlys: <>24/7 support. One queue and one team on every plan, with no priority tier to buy.</>,
    hostinger: <>&ldquo;Priority 24/7 expert support&rdquo; listed on every plan</>,
  },
  {
    label: "Money-back guarantee",
    serverlys: <>30 days</>,
    hostinger: <>30 days</>,
  },
  {
    label: "Done-for-you services",
    serverlys: <>Website design, site management, an AI website chatbot (ConvoAI) and an AI phone receptionist (CallFlow)</>,
    hostinger: <>Self-serve building tools listed on the plans: AI Builder and a WordPress AI assistant</>,
  },
];

const HOSTINGER_STRENGTHS = [
  {
    title: "You are happy to prepay four years",
    body: `On ${SOURCE_LABEL} Hostinger's Premium plan was ${formatPrice(HOSTINGER[0].intro)}/mo on a ${HOSTINGER[0].months}-month plan, ${formatPrice(HOSTINGER[0].upfront)} at checkout. Spread over those months, that is less than any Serverlys plan costs, and we will not pretend otherwise.`,
  },
  {
    title: "You want the lowest renewal on an entry plan",
    body: `Premium renews at ${formatPrice(HOSTINGER[0].renews)}/mo. Our Starter renews at ${starter ? formatPrice(starter.standard) : ""}/mo. If the cheapest long-run rate is the only thing that matters, theirs is lower.`,
  },
  {
    title: "You prefer to learn and do it yourself",
    body: "Hostinger publishes a large public tutorials library and self-serve AI building tools. If you enjoy running your own site, that ecosystem is genuinely useful.",
  },
  {
    title: "You need a specific server location",
    body: "Hostinger says it has server locations around the world and lets you pick one during setup. If you need hosting in a particular region, check their list against your audience.",
  },
] as const;

const STEPS = [
  {
    title: "Pick a plan by monthly rate and renewal rate",
    body: (
      <>
        Compare the{" "}
        <Link href="/pricing" className="font-semibold text-primary hover:text-primary-hover">
          plans and renewal rates
        </Link>{" "}
        and choose the tier that fits your traffic. Most single sites start on{" "}
        <Link href="/cloud-hosting" className="font-semibold text-primary hover:text-primary-hover">
          cloud hosting
        </Link>{" "}
        or{" "}
        <Link href="/wordpress-hosting" className="font-semibold text-primary hover:text-primary-hover">
          WordPress hosting
        </Link>
        .
      </>
    ),
  },
  {
    title: "Request the free migration",
    body: (
      <>
        Send us your site address and access details through the{" "}
        <Link href="/migrations" className="font-semibold text-primary hover:text-primary-hover">
          migration request
        </Link>
        . You do not need to download anything from your Hostinger account first.
      </>
    ),
  },
  {
    title: "Check the staged copy",
    body: <>We copy your files and database to a staging address so you can click through the site before anything changes for visitors.</>,
  },
  {
    title: "Approve the DNS switch",
    body: <>When you are happy, we point the domain at Serverlys. Your Hostinger site keeps serving until the change has spread, so there is no gap.</>,
  },
  {
    title: "Cancel Hostinger last",
    body: <>Once the site, email and SSL are confirmed on Serverlys, cancel the old plan. Check Hostinger&rsquo;s refund terms first if you are still inside their 30 days.</>,
  },
] as const;

const FAQS: readonly Faq[] = [
  {
    question: "What is the best Hostinger alternative?",
    answer: `It depends on how you want to pay. If you will prepay a ${HOSTINGER[0].months}-month plan, Hostinger's entry price is hard to beat. If you want to pay month to month, see the renewal rate before checkout and have the migration done for you, Serverlys starts at ${starter ? formatPrice(starter.monthly) : ""}/mo and renews at ${starter ? formatPrice(starter.standard) : ""}/mo.`,
    scopes: [PATH],
  },
  {
    question: "Is Hostinger's renewal price higher than its advertised price?",
    answer: `Yes, and Hostinger prints both. On ${SOURCE_LABEL} its Premium plan was advertised at ${formatPrice(HOSTINGER[0].intro)}/mo and renewed at ${formatPrice(HOSTINGER[0].renews)}/mo, a ${jump(HOSTINGER[0].intro, HOSTINGER[0].renews)} increase. Our Starter plan goes from ${starter ? formatPrice(starter.monthly) : ""} to ${starter ? formatPrice(starter.standard) : ""}/mo, a ${starter ? jump(starter.monthly, starter.standard) : ""} increase. Their renewal rate on that plan is still lower than ours.`,
    scopes: [PATH],
  },
  {
    question: "Does Serverlys require a multi-year term?",
    answer: `No. The advertised price is a plain monthly rate. Starter is ${starter ? formatPrice(starter.monthly) : ""}/mo with a one-off ${starter?.setupFee ? formatPrice(starter.setupFee) : ""} setup fee, so the first invoice is ${formatPrice(firstInvoice)}, and the renewal rate is shown beside it on every plan.`,
    scopes: [PATH],
  },
  {
    question: "Can I move from Hostinger to Serverlys for free?",
    answer:
      "Yes. Migration is free on every plan and we do it for you: we copy the site to a staging address, you check it, and we switch DNS only when you approve. Your Hostinger site stays online until the move is finished.",
    scopes: [PATH],
  },
  {
    question: "Will my site go offline while it moves?",
    answer:
      "No. The site keeps serving from Hostinger while we build and test the copy on Serverlys. Visitors only reach the new server after the DNS change, and both copies are identical at that point.",
    scopes: [PATH],
  },
  {
    question: "Is Hostinger a bad host?",
    answer:
      "No. It is a well-known host with low prepaid prices, free migrations, a big tutorials library and server locations around the world. We differ on how we bill, not on whether they are legitimate. Choose on the terms that suit how you want to pay and how much you want done for you.",
    scopes: [PATH],
  },
];

export default function HostingerAlternativePage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />

      {/* Hero: the answer first, then the first-invoice comparison. */}
      <section className="relative isolate overflow-hidden bg-canvas">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]" />
        <Container width="wide" className="pb-16 pt-10 sm:pb-20 lg:pb-24 lg:pt-14">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <Pill>Hostinger alternative</Pill>
              <h1 className="display-lg mt-5 text-fg">A Hostinger alternative with a plain monthly price</h1>
              <p className="mt-5 max-w-xl text-body-lg text-fg-secondary">
                The best Hostinger alternative depends on how you want to pay. If you will prepay four
                years, Hostinger&rsquo;s entry price is hard to beat. If you would rather pay month to
                month and see the renewal rate up front, Serverlys starts at{" "}
                {starter ? formatPrice(starter.monthly) : ""}/mo, renews at{" "}
                {starter ? formatPrice(starter.standard) : ""}/mo, and moves your site for free.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="#hx-table-heading" size="lg">See the comparison</Button>
                <Button href="/migrations" variant="outline" size="lg">Move my site for free</Button>
              </div>
            </div>
            <Stage>
              <div className="rounded-2xl bg-white p-5 sm:p-6">
                <p className="text-small font-semibold text-fg">What you pay at checkout, entry plans</p>
                <p className="mt-1 text-micro text-fg-muted">Hostinger figures as of {SOURCE_DATE}</p>
                <dl className="mt-5 flex flex-col gap-3">
                  <div className="rounded-xl bg-brand-50 p-4 ring-2 ring-primary">
                    <dt className="flex items-center justify-between gap-3 text-small font-semibold text-fg">
                      Serverlys Starter <Pill>Month to month</Pill>
                    </dt>
                    <dd className="mt-2 text-micro text-fg-secondary">
                      <span className="block text-body-lg font-semibold text-fg">{formatPrice(firstInvoice)} first invoice</span>
                      {starter ? `${formatPrice(starter.monthly)}/mo + ${formatPrice(starter.setupFee ?? 0)} setup. Renews at ${formatPrice(starter.standard)}/mo.` : ""}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-canvas-secondary p-4">
                    <dt className="flex items-center justify-between gap-3 text-small font-semibold text-fg">
                      Hostinger Premium <Pill tone="neutral">{HOSTINGER[0].months} months upfront</Pill>
                    </dt>
                    <dd className="mt-2 text-micro text-fg-secondary">
                      <span className="block text-body-lg font-semibold text-fg">{formatPrice(HOSTINGER[0].upfront)} at checkout</span>
                      {formatPrice(HOSTINGER[0].intro)}/mo over {HOSTINGER[0].months} months. Renews at {formatPrice(HOSTINGER[0].renews)}/mo.
                    </dd>
                  </div>
                </dl>
              </div>
            </Stage>
          </div>
        </Container>
      </section>

      {/* The comparison. */}
      <Band tone="subtle" labelledBy="hx-table-heading">
        <Heading
          id="hx-table-heading"
          title="Serverlys vs Hostinger, side by side"
          lede="The figures that decide what hosting really costs, with Hostinger's read off its own pages on the date shown."
        />
        <div className="mt-12 overflow-x-auto rounded-3xl bg-canvas ring-1 ring-line">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">
              Serverlys and Hostinger compared on price, renewal, billing, migration, backups, support and services
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-6 py-5">
                  <span className="sr-only">Compared on</span>
                </th>
                <th scope="col" className="bg-brand-50 px-6 py-5 text-body-lg font-semibold text-fg">Serverlys</th>
                <th scope="col" className="px-6 py-5 text-body-lg font-semibold text-fg">
                  Hostinger
                  <span className="mt-1 block text-micro font-normal text-fg-muted">as of {SOURCE_DATE}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle">
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="px-6 py-4 align-top text-small font-semibold text-fg">
                    {row.label}
                  </th>
                  <td className="bg-brand-50/60 px-6 py-4 align-top text-small text-fg">{row.serverlys}</td>
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.hostinger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-6 max-w-[760px] text-center text-micro text-fg-muted">
          Hostinger figures as of {SOURCE_DATE}, from{" "}
          <a href={HOSTINGER_WEB} rel="nofollow noopener" className="underline underline-offset-2 hover:text-fg">
            hostinger.com/web-hosting
          </a>
          ,{" "}
          <a href={HOSTINGER_WP} rel="nofollow noopener" className="underline underline-offset-2 hover:text-fg">
            hostinger.com/wordpress-hosting
          </a>{" "}
          and{" "}
          <a href={HOSTINGER_MIGRATION} rel="nofollow noopener" className="underline underline-offset-2 hover:text-fg">
            hostinger.com/website-migration
          </a>
          . Prices are in USD and change often; check their site before you decide. Serverlys rates are
          the ones on our{" "}
          <Link href="/pricing" className="underline underline-offset-2 hover:text-fg">
            pricing page
          </Link>
          .
        </p>
      </Band>

      {/* How to read the numbers. */}
      <Band labelledBy="hx-read-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="hx-read-heading" align="left" title="How to read the two price tags" />
            <p className="mt-5 max-w-[60ch] text-body text-fg-secondary">
              Both companies print a renewal rate, so the honest difference is not who hides it. It
              is what you have to commit to before the advertised price applies, and how far the
              price moves afterwards.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              Hostinger&rsquo;s {formatPrice(HOSTINGER[0].intro)}/mo is the total of a{" "}
              {HOSTINGER[0].months}-month plan divided by {HOSTINGER[0].months}; its pages say all
              plans are paid upfront. Our {starter ? formatPrice(starter.monthly) : ""}/mo is what a
              single month costs. That makes Hostinger cheaper over a long prepaid stretch, and
              Serverlys cheaper to start, to test, and to leave.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              The jump is the other half. Hostinger Premium moves{" "}
              {jump(HOSTINGER[0].intro, HOSTINGER[0].renews)} at renewal; our Starter moves{" "}
              {starter ? jump(starter.monthly, starter.standard) : ""}. A smaller jump is easier to
              budget for, even when the end number is similar.
            </p>
          </div>
          <ul className="grid content-start gap-4 sm:grid-cols-2">
            {PLANS.map((plan) => (
              <li key={plan.tier} className="rounded-2xl bg-canvas-secondary p-6">
                <span className="text-body-lg font-semibold text-fg">{plan.name}</span>
                <p className="mt-3 text-small text-fg-secondary">
                  <span className="block text-body-lg font-semibold text-fg">{formatPrice(plan.monthly)}/mo</span>
                  Renews at {formatPrice(plan.standard)}/mo. {plan.specs.sites}, {plan.specs.memory} RAM.
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Band>

      {/* Where Hostinger wins. */}
      <Band tone="subtle" labelledBy="hx-better-heading">
        <Heading
          id="hx-better-heading"
          title="When Hostinger is the better choice"
          lede="A comparison that never loses is advertising. These are the cases where we would point you to them."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {HOSTINGER_STRENGTHS.map((item) => (
            <li key={item.title} className="rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <h3 className="text-body-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-small text-fg-secondary">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-micro text-fg-muted">
          Tutorials:{" "}
          <a href={HOSTINGER_TUTORIALS} rel="nofollow noopener" className="underline underline-offset-2 hover:text-fg">
            hostinger.com/tutorials
          </a>
          . Server locations and pricing:{" "}
          <a href={HOSTINGER_WEB} rel="nofollow noopener" className="underline underline-offset-2 hover:text-fg">
            hostinger.com/web-hosting
          </a>
          , as of {SOURCE_DATE}.
        </p>
      </Band>

      {/* Where Serverlys differs. */}
      <Band tone="dark" labelledBy="hx-differ-heading">
        <Heading
          id="hx-differ-heading"
          dark
          title="Where Serverlys is different"
          lede="Hosting is half of it. The other half is the work around the site that we will do for you."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Monthly, plainly", "The advertised price is a monthly rate with the renewal rate beside it. No prepayment is needed to get it.", "/pricing", "See prices and renewals"],
              ["Managed for you", "Patching, hardening, monitoring and free restores on every tier, without buying a bigger plan.", "/managed-hosting", "What managed covers"],
              ["Migration we do", "Staged first, checked by you, DNS switched only when you say so.", "/migrations", "How migration works"],
              ["Website design", `Custom design for small businesses, one-time projects from ${formatDesignPrice(designFromPrice)}, scoped in writing first.`, "/website-design", "Website design"],
              ["Site management", "Updates, backups, uptime and the small changes, handled by our team.", "/site-management", "Site management"],
              ["AI chat and phone", "ConvoAI answers website visitors; CallFlow answers the phone. Both are Serverlys products.", "/ai-agents", "AI agents"],
            ] as const
          ).map(([title, body, href, cta]) => (
            <li key={title} className="flex flex-col rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <span className="flex items-center gap-2.5">
                <Tick />
                <span className="text-body-lg font-medium text-white">{title}</span>
              </span>
              <p className="mt-3 flex-1 text-small text-fg-on-dark-secondary">{body}</p>
              <Link href={href} className="mt-4 text-small font-semibold text-white underline-offset-4 hover:underline">
                {cta}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-small text-fg-on-dark-secondary">
          All hosting tiers are on the{" "}
          <Link href="/hosting" className="font-semibold text-white underline-offset-4 hover:underline">
            hosting overview
          </Link>
          .
        </p>
      </Band>

      {/* Switching. */}
      <Band labelledBy="hx-switch-heading">
        <Heading
          id="hx-switch-heading"
          title="How to switch from Hostinger"
          lede="You choose a plan, send the details and approve the switch. We do the moving."
        />
        <ol className="mx-auto mt-12 grid max-w-[880px] gap-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-5 rounded-2xl bg-canvas-secondary p-6">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-small font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-body-lg font-semibold text-fg">{step.title}</h3>
                <p className="mt-2 text-small text-fg-secondary">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/migrations">Start a free migration</Button>
          <Button href={billing.sales} variant="outline">
            Ask us about your site
          </Button>
        </div>
      </Band>

      <FaqSection items={FAQS} />
      <FinalCta plansHref="/pricing" />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
