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
import { tldBySlug } from "@/data/tld-catalog";
import { designFromPrice, formatDesignPrice } from "@/data/design-plans";

const PATH = "/bluehost-alternative";

export const metadata = pageMetadata({
  title: "Bluehost Alternative: Monthly Pricing, Free Migration",
  description:
    "A fair Bluehost alternative: Serverlys bills month to month, prints the renewal rate beside the price and migrates sites free. Dated, sourced figures.",
  path: PATH,
});

/**
 * /bluehost-alternative — commercial-investigation page for "bluehost
 * alternative(s)". Built on the /hostinger-alternative pattern and bound by
 * the same rules (see /hosting-alternatives for why the site otherwise names
 * no competitor):
 *
 *   1. Every Bluehost figure was read off bluehost.com on SOURCE_DATE and is
 *      printed with that date and its URL. A figure we could not read there is
 *      left out, not estimated. (Not found on SOURCE_DATE, so NOT printed: the
 *      price of any paid migration service, whether the 36-month price is paid
 *      upfront, monthly-term prices.) Re-verify before changing a number, and
 *      change SOURCE_DATE in the same edit.
 *   2. Bluehost wins rows on this page, and the page says so: lower entry
 *      price on a 36-month term, lower entry renewal, more sites on the entry
 *      plan, a free first-year domain, and a WordPress.org recommendation.
 *   3. Serverlys figures come from data/pricing.ts and data/tld-catalog.ts and
 *      are never typed here. They are a plain MONTHLY rate. This page never
 *      describes a Serverlys price as tied to a multi-year commitment — see the
 *      header of data/pricing.ts.
 *   4. No Bluehost logo, colours or wordmark. No ratings, reviews or scores.
 */

const SOURCE_DATE = "2026-10-26";
const SOURCE_LABEL = "26 October 2026";
const BLUEHOST_SHARED = "https://www.bluehost.com/hosting/shared";
const BLUEHOST_WP = "https://www.bluehost.com/wordpress/wordpress-hosting";

/**
 * Read off bluehost.com/hosting/shared and /wordpress/wordpress-hosting on
 * SOURCE_DATE. Both pages showed the same three priced plans, each card
 * reading e.g. "$3.99/mo … For 36 month term … Renews at $9.99/mo".
 */
const BLUEHOST = [
  { name: "Starter", intro: 3.99, renews: 9.99, sites: "10 websites", storage: "10 GB NVMe SSD storage", phone: false },
  { name: "Business", intro: 6.99, renews: 13.99, sites: "50 websites", storage: "50 GB NVMe SSD storage", phone: true },
  { name: "eCommerce Essentials", intro: 14.99, renews: 21.99, sites: "100 websites", storage: "100 GB NVMe SSD storage", phone: true },
] as const;
const BLUEHOST_TERM = "36 month term";

const cloud = groupById("cloud");
const PLANS = cloud?.plans ?? [];
const starter = PLANS[0];
const wpStarter = groupById("wordpress")?.plans[0];
const dotCom = tldBySlug("com");

const jump = (from: number, to: number) => `${Math.round(((to - from) / from) * 100)}%`;

const firstInvoice = starter ? starter.monthly + (starter.setupFee ?? 0) : 0;

const priceList = (values: readonly number[]) => values.map(formatPrice).join(" / ");

const SourceLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} rel="nofollow noopener" className="underline underline-offset-2 hover:text-fg">
    {children}
  </a>
);

/** One row per decision the comparison actually turns on. */
const ROWS: ReadonlyArray<{ label: string; serverlys: React.ReactNode; bluehost: React.ReactNode }> = [
  {
    label: "Advertised price",
    serverlys: (
      <>
        {priceList(PLANS.map((p) => p.monthly))} per month
        {starter?.setupFee ? ` (Starter adds a one-off ${formatPrice(starter.setupFee)} setup fee)` : ""}
      </>
    ),
    bluehost: <>{priceList(BLUEHOST.map((p) => p.intro))} per month (Starter / Business / eCommerce Essentials)</>,
  },
  {
    label: "Renewal price",
    serverlys: <>{priceList(PLANS.map((p) => p.standard))} per month, printed beside the advertised rate</>,
    bluehost: <>{priceList(BLUEHOST.map((p) => p.renews))} per month, printed on each plan card</>,
  },
  {
    label: "Term shown with the advertised price",
    serverlys: <>None. The advertised price is the month-to-month rate.</>,
    bluehost: <>&ldquo;For {BLUEHOST_TERM}&rdquo; on every priced plan</>,
  },
  {
    label: "Websites and storage",
    serverlys: <>{PLANS.map((p) => `${p.name}: ${p.specs.sites}, ${p.specs.storage} storage`).join("; ")}</>,
    bluehost: <>{BLUEHOST.map((p) => `${p.name}: ${p.sites}, ${p.storage}`).join("; ")}</>,
  },
  {
    label: "Domain",
    serverlys: (
      <>
        {dotCom ? `.com ${formatPrice(dotCom.register)}/yr to register, ${formatPrice(dotCom.renew)}/yr to renew. ` : ""}
        WHOIS privacy free where the registry allows.
      </>
    ),
    bluehost: (
      <>
        Free domain for the first year with a 12- or 36-month hosting term, then &ldquo;the then current
        rate&rdquo;. Domain privacy free for the first year on Business and eCommerce Essentials.
      </>
    ),
  },
  {
    label: "Free migration",
    serverlys: <>Yes. We do it, staged first, and switch DNS only when you approve.</>,
    bluehost: (
      <>
        &ldquo;Free Site Migration Tool&rdquo; on every plan. Their WordPress page adds: &ldquo;up to 5 sites
        for free within your first 30 days&rdquo;.
      </>
    ),
  },
  {
    label: "Backups",
    serverlys: <>Daily on every plan. Restores are free and we run them for you.</>,
    bluehost: (
      <>
        &ldquo;Weekly Website Backups&rdquo; on every plan card. Their WordPress page FAQ also says
        &ldquo;daily off-site automatic backups with multiple restore points&rdquo;.
      </>
    ),
  },
  {
    label: "Support",
    serverlys: <>24/7 support. One queue and one team on every plan, with no priority tier to buy.</>,
    bluehost: <>&ldquo;24/7 Chat Support&rdquo; on every plan. Phone support not included on Starter; included on Business and eCommerce Essentials.</>,
  },
  {
    label: "Money-back guarantee",
    serverlys: <>30 days</>,
    bluehost: <>30 days. &ldquo;Does not apply to most add-on products, such as domains&rdquo;.</>,
  },
  {
    label: "Done-for-you services",
    serverlys: <>Website design, site management, an AI website chatbot (ConvoAI) and an AI phone receptionist (CallFlow)</>,
    bluehost: <>Not compared here: we only list what we read on the two plan pages above.</>,
  },
];

const BLUEHOST_STRENGTHS = [
  {
    title: "You will commit to a 36-month term",
    body: `On ${SOURCE_LABEL} Bluehost's Starter plan was ${formatPrice(BLUEHOST[0].intro)}/mo "for ${BLUEHOST_TERM}". That is less than any Serverlys plan costs per month, and we will not pretend otherwise.`,
  },
  {
    title: "You want the lowest renewal on an entry plan",
    body: `Bluehost Starter renews at ${formatPrice(BLUEHOST[0].renews)}/mo. Our Starter renews at ${starter ? formatPrice(starter.standard) : ""}/mo. If the cheapest long-run rate is what matters most, theirs is lower.`,
  },
  {
    title: "You want a free domain bundled in",
    body: "Bluehost includes one free domain for the first year with a 12- or 36-month hosting term. We charge for domains from day one, at the same price every year, so in year one theirs is cheaper.",
  },
  {
    title: "You run several small sites on one entry plan",
    body: `Bluehost Starter lists ${BLUEHOST[0].sites}. Our Starter is ${starter?.specs.sites ?? ""}; you need a higher tier for more.`,
  },
  {
    title: "A WordPress.org recommendation matters to you",
    body: "Bluehost's WordPress page says it has been \"officially recommended by WordPress.org since 2005\". That is a long track record, and it is theirs, not ours.",
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
        <Link href="/wordpress-hosting" className="font-semibold text-primary hover:text-primary-hover">
          WordPress hosting
        </Link>{" "}
        or{" "}
        <Link href="/cloud-hosting" className="font-semibold text-primary hover:text-primary-hover">
          cloud hosting
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
        . You do not need to run a migration plugin or download a backup from Bluehost first.
      </>
    ),
  },
  {
    title: "Check the staged copy",
    body: <>We copy your files and database to a staging address so you can click through the site before anything changes for visitors.</>,
  },
  {
    title: "Approve the DNS switch",
    body: <>When you are happy, we point the domain at Serverlys. Your Bluehost site keeps serving until the change has spread, so there is no gap.</>,
  },
  {
    title: "Move the domain, if you want to",
    body: (
      <>
        Hosting and domain are separate. You can keep the domain where it is, or{" "}
        <Link href="/transfer-domain" className="font-semibold text-primary hover:text-primary-hover">
          transfer it to Serverlys
        </Link>{" "}
        and see every extension&rsquo;s renewal price on our{" "}
        <Link href="/tld" className="font-semibold text-primary hover:text-primary-hover">
          domain extensions
        </Link>{" "}
        page. If your domain was Bluehost&rsquo;s free first-year domain, check their domain-fee terms before you cancel.
      </>
    ),
  },
  {
    title: "Cancel Bluehost last",
    body: <>Once the site, email and SSL are confirmed on Serverlys, cancel the old plan. Bluehost says it gives no refunds for cancellations after 30 days, so check where you are in that window.</>,
  },
] as const;

const FAQS: readonly Faq[] = [
  {
    question: "What is the best Bluehost alternative?",
    answer: `It depends on how you want to pay. If you will take a 36-month term, Bluehost's entry price is lower than ours. If you want to pay month to month, see the renewal rate before checkout and have the migration done for you, Serverlys starts at ${starter ? formatPrice(starter.monthly) : ""}/mo and renews at ${starter ? formatPrice(starter.standard) : ""}/mo.`,
    scopes: [PATH],
  },
  {
    question: "Is Bluehost's renewal price higher than its advertised price?",
    answer: `Yes, and Bluehost prints both. On ${SOURCE_LABEL} its Starter plan was ${formatPrice(BLUEHOST[0].intro)}/mo for a 36-month term and renewed at ${formatPrice(BLUEHOST[0].renews)}/mo, a ${jump(BLUEHOST[0].intro, BLUEHOST[0].renews)} increase. Our Starter goes from ${starter ? formatPrice(starter.monthly) : ""} to ${starter ? formatPrice(starter.standard) : ""}/mo, a ${starter ? jump(starter.monthly, starter.standard) : ""} increase. Their renewal rate on that plan is still lower than ours.`,
    scopes: [PATH],
  },
  {
    question: "Does Serverlys require a multi-year term?",
    answer: `No. The advertised price is a plain monthly rate. Starter is ${starter ? formatPrice(starter.monthly) : ""}/mo with a one-off ${starter?.setupFee ? formatPrice(starter.setupFee) : ""} setup fee, so the first invoice is ${formatPrice(firstInvoice)}, and the renewal rate is shown beside it on every plan.`,
    scopes: [PATH],
  },
  {
    question: "Can I move from Bluehost to Serverlys for free?",
    answer:
      "Yes. Migration is free on every plan and we do it for you: we copy the site to a staging address, you check it, and we switch DNS only when you approve. Your Bluehost site stays online until the move is finished.",
    scopes: [PATH],
  },
  {
    question: "What happens to the free domain I got with Bluehost?",
    answer: `It is your domain, and you can keep it at Bluehost or transfer it. Bluehost's terms say the free domain renews "at the then current rate" after the first year, and that domains cancelled within the first year carry a non-refundable domain fee. At Serverlys a .com is ${dotCom ? formatPrice(dotCom.register) : ""}/yr and renews at ${dotCom ? formatPrice(dotCom.renew) : ""}/yr.`,
    scopes: [PATH],
  },
  {
    question: "Is Bluehost a bad host?",
    answer:
      "No. It is a long-established host that WordPress.org has recommended since 2005, with low prices on a 36-month term, a free first-year domain and a free migration tool. We differ on how we bill and how much we do for you, not on whether they are legitimate.",
    scopes: [PATH],
  },
];

export default function BluehostAlternativePage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />

      {/* Hero: the answer first, then the entry-plan comparison. */}
      <section className="relative isolate overflow-hidden bg-canvas">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]" />
        <Container width="wide" className="pb-16 pt-10 sm:pb-20 lg:pb-24 lg:pt-14">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <Pill>Bluehost alternative</Pill>
              <h1 className="display-lg mt-5 text-fg">A Bluehost alternative you pay month to month</h1>
              <p className="mt-5 max-w-xl text-body-lg text-fg-secondary">
                The best Bluehost alternative depends on how you want to pay. If you will commit to a
                36-month term, Bluehost&rsquo;s entry price is lower. If you would rather pay month to
                month and see the renewal rate up front, Serverlys starts at{" "}
                {starter ? formatPrice(starter.monthly) : ""}/mo, renews at{" "}
                {starter ? formatPrice(starter.standard) : ""}/mo, and moves your site for free.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="#bx-table-heading" size="lg">See the comparison</Button>
                <Button href="/migrations" variant="outline" size="lg">Move my site for free</Button>
              </div>
            </div>
            <Stage>
              <div className="rounded-2xl bg-white p-5 sm:p-6">
                <p className="text-small font-semibold text-fg">Entry plans, advertised and renewal</p>
                <p className="mt-1 text-micro text-fg-muted">Bluehost figures as of {SOURCE_DATE}</p>
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
                      Bluehost Starter <Pill tone="neutral">For {BLUEHOST_TERM}</Pill>
                    </dt>
                    <dd className="mt-2 text-micro text-fg-secondary">
                      <span className="block text-body-lg font-semibold text-fg">{formatPrice(BLUEHOST[0].intro)}/mo</span>
                      Renews at {formatPrice(BLUEHOST[0].renews)}/mo. Free domain for the first year.
                    </dd>
                  </div>
                </dl>
              </div>
            </Stage>
          </div>
        </Container>
      </section>

      {/* The comparison. */}
      <Band tone="subtle" labelledBy="bx-table-heading">
        <Heading
          id="bx-table-heading"
          title="Serverlys vs Bluehost, side by side"
          lede="The figures that decide what hosting really costs, with Bluehost's read off its own pages on the date shown."
        />
        <div className="mt-12 overflow-x-auto rounded-3xl bg-canvas ring-1 ring-line">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">
              Serverlys and Bluehost compared on price, renewal, term, sites, domain, migration, backups, support and services
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-6 py-5">
                  <span className="sr-only">Compared on</span>
                </th>
                <th scope="col" className="bg-brand-50 px-6 py-5 text-body-lg font-semibold text-fg">Serverlys</th>
                <th scope="col" className="px-6 py-5 text-body-lg font-semibold text-fg">
                  Bluehost
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
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.bluehost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-6 max-w-[760px] text-center text-micro text-fg-muted">
          Bluehost figures as of {SOURCE_DATE}, from <SourceLink href={BLUEHOST_SHARED}>bluehost.com/hosting/shared</SourceLink>{" "}
          and <SourceLink href={BLUEHOST_WP}>bluehost.com/wordpress/wordpress-hosting</SourceLink>, including their
          free-domain and money-back terms. Bluehost marks its prices &ldquo;VAT not included&rdquo;. Prices are in USD
          and change often; check their site before you decide. Serverlys rates are the ones on our{" "}
          <Link href="/pricing" className="underline underline-offset-2 hover:text-fg">
            pricing page
          </Link>
          {dotCom ? (
            <>
              {" "}and{" "}
              <Link href="/tld/com" className="underline underline-offset-2 hover:text-fg">
                .com page
              </Link>
            </>
          ) : null}
          .
        </p>
      </Band>

      {/* How to read the numbers. */}
      <Band labelledBy="bx-read-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="bx-read-heading" align="left" title="How to read the two price tags" />
            <p className="mt-5 max-w-[60ch] text-body text-fg-secondary">
              Both companies print a renewal rate, so the honest difference is not who hides it. It
              is what you commit to before the advertised price applies, and how far the price moves
              afterwards.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              Bluehost shows {formatPrice(BLUEHOST[0].intro)}/mo &ldquo;for {BLUEHOST_TERM}&rdquo;. Our{" "}
              {starter ? formatPrice(starter.monthly) : ""}/mo is what a single month costs, with no
              term attached. That makes Bluehost cheaper if you stay the full term, and Serverlys easier
              to start, to test, and to leave.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              The jump is the other half. Bluehost Starter moves{" "}
              {jump(BLUEHOST[0].intro, BLUEHOST[0].renews)} at renewal; our Starter moves{" "}
              {starter ? jump(starter.monthly, starter.standard) : ""}. A smaller jump is easier to
              budget for, even when the end number is close. Our{" "}
              <Link href="/wordpress-hosting" className="font-semibold text-primary hover:text-primary-hover">
                WordPress plans
              </Link>{" "}
              {wpStarter ? `start at ${formatPrice(wpStarter.monthly)}/mo and renew at ${formatPrice(wpStarter.standard)}/mo, ` : ""}
              with LiteSpeed caching and NVMe storage.
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

      {/* Where Bluehost wins. */}
      <Band tone="subtle" labelledBy="bx-better-heading">
        <Heading
          id="bx-better-heading"
          title="When Bluehost is the better choice"
          lede="A comparison that never loses is advertising. These are the cases where we would point you to them."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {BLUEHOST_STRENGTHS.map((item) => (
            <li key={item.title} className="rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <h3 className="text-body-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-small text-fg-secondary">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-micro text-fg-muted">
          Prices, sites and domain terms: <SourceLink href={BLUEHOST_SHARED}>bluehost.com/hosting/shared</SourceLink>.
          WordPress.org recommendation: <SourceLink href={BLUEHOST_WP}>bluehost.com/wordpress/wordpress-hosting</SourceLink>,
          as of {SOURCE_DATE}.
        </p>
      </Band>

      {/* Where Serverlys differs. */}
      <Band tone="dark" labelledBy="bx-differ-heading">
        <Heading
          id="bx-differ-heading"
          dark
          title="Where Serverlys is different"
          lede="Hosting is half of it. The other half is the work around the site that we will do for you."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Monthly, plainly", "The advertised price is a monthly rate with the renewal rate beside it. No term is needed to get it.", "/pricing", "See prices and renewals"],
              ["Managed for you", "Patching, hardening, monitoring and free restores on every tier, without buying a bigger plan.", "/managed-hosting", "What managed covers"],
              ["Migration we do", "Not a plugin you run: we stage the copy, you check it, and DNS switches only when you say so.", "/migrations", "How migration works"],
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
          . Comparing more than one host? See the{" "}
          <Link href="/hostinger-alternative" className="font-semibold text-white underline-offset-4 hover:underline">
            Hostinger alternative
          </Link>{" "}
          page too.
        </p>
      </Band>

      {/* Switching. */}
      <Band labelledBy="bx-switch-heading">
        <Heading
          id="bx-switch-heading"
          title="How to move from Bluehost"
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
