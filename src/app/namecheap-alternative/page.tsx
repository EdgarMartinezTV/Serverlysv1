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

const PATH = "/namecheap-alternative";

export const metadata = pageMetadata({
  title: "Namecheap Alternative: Daily Backups, Flat .com Renewal",
  description:
    "A fair Namecheap alternative: Serverlys backs up daily, keeps .com at one yearly price and does the migration for you. Dated, sourced figures.",
  path: PATH,
});

/**
 * /namecheap-alternative — commercial-investigation page for "namecheap
 * alternative(s)". Built on the /godaddy-alternative pattern and bound by the
 * same rules (see /hosting-alternatives for why the site otherwise names no
 * competitor):
 *
 *   1. Every Namecheap figure was read off namecheap.com on SOURCE_DATE and is
 *      printed with that date and its URL. namecheap.com refuses plain HTTP
 *      clients, so the pages were read in a real browser (US data center
 *      selected, USD). A figure we could not read there is left out, not
 *      estimated. Namecheap's hosting cards print no renewal figure, only a
 *      discount and the line "This discount offer does not apply to
 *      renewals", so this page quotes exactly that and never states a renewal
 *      rate for its hosting. Re-verify before changing a number, and change
 *      SOURCE_DATE in the same edit.
 *   2. Namecheap wins rows on this page, and the page says so: lower hosting
 *      prices on every billing period (monthly included), a 30-day free trial,
 *      mailboxes included, a cheaper first-year .com and .com transfer, and
 *      free lifetime domain privacy.
 *   3. Serverlys figures come from data/pricing.ts and data/tld-catalog.ts and
 *      are never typed here. Hosting is a plain MONTHLY rate; this page never
 *      ties a Serverlys price to any multi-year commitment.
 *   4. No Namecheap logo, colours or wordmark. No ratings, reviews or scores.
 *      (Namecheap's page also carries its own price table of other hosts; none
 *      of it is repeated here.)
 */

const SOURCE_DATE = "2026-10-26";
const SOURCE_LABEL = "26 October 2026";
const NC_SHARED = "https://www.namecheap.com/hosting/shared/";
const NC_COM = "https://www.namecheap.com/domains/registration/gtld/com/";

/**
 * Read off namecheap.com/hosting/shared on SOURCE_DATE, US data center, with
 * each billing toggle selected in turn. Yearly is the default view. Each card
 * read "Free trial $0.00 for 30 days, Then $X/mo".
 */
const NC_HOSTING = [
  { name: "Stellar", monthly: 5.88, yearly: 2.28, biyearly: 1.88, sites: "3 websites", mail: "30 mailboxes", backups: "twice a week" },
  { name: "Stellar Plus", monthly: 7.88, yearly: 2.98, biyearly: 2.28, sites: "Unlimited websites", mail: "unlimited mailboxes", backups: "twice a week plus AutoBackup" },
  { name: "Stellar Business", monthly: 11.88, yearly: 4.98, biyearly: 4.48, sites: "Unlimited websites", mail: "unlimited mailboxes", backups: "twice a week plus AutoBackup" },
] as const;
const NC_TRIAL_DAYS = 30;
const NC_RENEWAL_NOTE =
  "Our advertised discount offer only applies to purchases of annual and biennial plans. This discount offer does not apply to renewals.";

/**
 * Read off namecheap.com/domains/registration/gtld/com on SOURCE_DATE: 1-year
 * registration "$11.28 … 25% off 1st year $14.98", 1-year renewal "$18.48",
 * transfer "$11.48", "New customer special: $6.48" (promo code, first-year
 * registration, one per household), "Free lifetime privacy protection".
 */
const NC_COM_PRICE = { firstYear: 11.28, renew: 18.48, transfer: 11.48, newCustomer: 6.48 } as const;

const cloud = groupById("cloud");
const PLANS = cloud?.plans ?? [];
const starter = PLANS[0];
const com = tldBySlug("com");

const firstInvoice = starter ? starter.monthly + (starter.setupFee ?? 0) : 0;
const priceList = (values: readonly number[]) => values.map(formatPrice).join(" / ");
const starterRate = starter ? formatPrice(starter.monthly) : "";
const starterRenewal = starter ? formatPrice(starter.standard) : "";
const comRegister = com ? formatPrice(com.register) : "";
const comRenew = com ? formatPrice(com.renew) : "";
const comTransfer = com ? formatPrice(com.transfer) : "";
const stellar = NC_HOSTING[0];

const ROWS: ReadonlyArray<{ label: string; serverlys: React.ReactNode; namecheap: React.ReactNode }> = [
  {
    label: "Advertised hosting price",
    serverlys: (
      <>
        {priceList(PLANS.map((p) => p.monthly))} per month
        {starter?.setupFee ? ` (Starter adds a one-off ${formatPrice(starter.setupFee)} setup fee)` : ""}
      </>
    ),
    namecheap: (
      <>
        {priceList(NC_HOSTING.map((p) => p.yearly))} per month billed yearly; {priceList(NC_HOSTING.map((p) => p.biyearly))}{" "}
        bi-yearly; {priceList(NC_HOSTING.map((p) => p.monthly))} billed monthly ({NC_HOSTING.map((p) => p.name).join(" / ")})
      </>
    ),
  },
  {
    label: "Renewal price",
    serverlys: <>{priceList(PLANS.map((p) => p.standard))} per month, printed beside the advertised rate</>,
    namecheap: (
      <>
        No renewal figure on the plan cards. The disclaimer says: &ldquo;{NC_RENEWAL_NOTE}&rdquo;
      </>
    ),
  },
  {
    label: "Free trial",
    serverlys: <>None. A 30-day money-back guarantee instead.</>,
    namecheap: <>{NC_TRIAL_DAYS} days free, one per account</>,
  },
  {
    label: "Websites and mailboxes",
    serverlys: (
      <>
        {PLANS.map((p) => `${p.name}: ${p.specs.sites.toLowerCase()}`).join("; ")}. Email is a separate{" "}
        <Link href="/business-email" className="underline underline-offset-2 hover:text-primary">
          business email plan
        </Link>
        .
      </>
    ),
    namecheap: <>{NC_HOSTING.map((p) => `${p.name}: ${p.sites.toLowerCase()}, ${p.mail}`).join("; ")}</>,
  },
  {
    label: "Backups",
    serverlys: <>Daily on every plan. Restores are free and we run them for you.</>,
    namecheap: <>{NC_HOSTING.map((p) => `${p.name}: ${p.backups}`).join("; ")}</>,
  },
  {
    label: ".com domain",
    serverlys: (
      <>
        {comRegister} to register, {comRenew} a year to renew, {comTransfer} to transfer in
      </>
    ),
    namecheap: (
      <>
        {formatPrice(NC_COM_PRICE.firstYear)} for the first year ({formatPrice(NC_COM_PRICE.newCustomer)} for new
        customers with a promo code), {formatPrice(NC_COM_PRICE.renew)} a year to renew,{" "}
        {formatPrice(NC_COM_PRICE.transfer)} to transfer in
      </>
    ),
  },
  {
    label: "WHOIS privacy",
    serverlys: <>Free, where the registry allows it</>,
    namecheap: <>Free for life on eligible domains</>,
  },
  {
    label: "Free migration",
    serverlys: <>Yes. We do it, staged first, and switch DNS only when you approve.</>,
    namecheap: <>Free website migration listed on every shared hosting plan</>,
  },
  {
    label: "Support",
    serverlys: <>24/7 support. One queue and one team on every plan, with no priority tier to buy.</>,
    namecheap: <>24/7 support from &ldquo;real people&rdquo;</>,
  },
  {
    label: "Money-back guarantee",
    serverlys: <>30 days</>,
    namecheap: <>30 days, for first-time shared hosting customers who start without the free trial</>,
  },
  {
    label: "Done-for-you services",
    serverlys: <>Website design, site management, an AI website chatbot (ConvoAI) and an AI phone receptionist (CallFlow)</>,
    namecheap: <>Self-serve building tools listed on the plans: AI for WordPress and an AI website builder</>,
  },
];

const NAMECHEAP_STRENGTHS = [
  {
    title: "The lowest hosting bill is what matters",
    body: `On ${SOURCE_LABEL} Namecheap's Stellar plan was ${formatPrice(stellar.yearly)}/mo billed yearly and ${formatPrice(stellar.monthly)}/mo billed monthly. Both are below our Starter at ${starterRate}/mo, and we will not pretend otherwise.`,
  },
  {
    title: "You want to try before you pay",
    body: `Every Stellar plan offers ${NC_TRIAL_DAYS} days free. We do not offer a free trial; we offer a 30-day money-back guarantee instead, which means paying first.`,
  },
  {
    title: "You want mailboxes inside the hosting",
    body: "Stellar includes 30 mailboxes and the two plans above it unlimited mailboxes. Our business email is its own plan, so if bundled mail matters most, theirs is the simpler bill.",
  },
  {
    title: "You are registering or transferring a .com",
    body: `Namecheap's first-year .com is ${formatPrice(NC_COM_PRICE.firstYear)}, or ${formatPrice(NC_COM_PRICE.newCustomer)} for a new customer with a promo code, and a transfer in is ${formatPrice(NC_COM_PRICE.transfer)}. Ours is ${comRegister} for either. Check the renewal before you decide: theirs is ${formatPrice(NC_COM_PRICE.renew)}, ours ${comRenew}.`,
  },
  {
    title: "You want privacy guaranteed for life",
    body: "Namecheap gives free lifetime domain privacy on every eligible domain. Ours is free too, where the registry allows it; theirs is written as a lifetime promise.",
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
        . You do not need to export anything from your Namecheap account first.
      </>
    ),
  },
  {
    title: "Check the staged copy, then approve the DNS switch",
    body: <>We copy your files and database to a staging address. When you are happy, we point the domain at Serverlys. Your Namecheap site keeps serving until the change has spread, so there is no gap.</>,
  },
  {
    title: "Keep the domain at Namecheap, or move it",
    body: (
      <>
        Hosting and domain can move separately, and with Namecheap&rsquo;s .com transfer price lower than ours,
        leaving the domain there is a reasonable choice. To bring it anyway, unlock it, get its authorisation
        code and start a{" "}
        <Link href="/transfer-domain" className="font-semibold text-primary hover:text-primary-hover">
          domain transfer
        </Link>
        . A{" "}
        <Link href="/tld/com" className="font-semibold text-primary hover:text-primary-hover">
          .com
        </Link>{" "}
        transfer costs {comTransfer} and adds a year; ICANN rules block transfers within 60 days of a
        registration or a previous transfer.
      </>
    ),
  },
  {
    title: "Move email, then cancel Namecheap last",
    body: (
      <>
        If your mailboxes live on Namecheap hosting, set up{" "}
        <Link href="/business-email" className="font-semibold text-primary hover:text-primary-hover">
          business email
        </Link>{" "}
        first. Once the site, email and SSL are confirmed on Serverlys, cancel the old plan.
      </>
    ),
  },
] as const;

const FAQS: readonly Faq[] = [
  {
    question: "What is the best Namecheap alternative?",
    answer: `It depends on what you are buying. For the cheapest hosting bill, a free trial and a cheap first-year domain, Namecheap is hard to beat. If you want daily backups on every plan, a .com that renews at ${comRenew}, and the migration and upkeep done for you, Serverlys starts at ${starterRate}/mo and renews at ${starterRenewal}/mo.`,
    scopes: [PATH],
  },
  {
    question: "Is Namecheap hosting cheaper than Serverlys?",
    answer: `Yes. On ${SOURCE_LABEL} Namecheap's Stellar plan was ${formatPrice(stellar.yearly)}/mo billed yearly and ${formatPrice(stellar.monthly)}/mo billed monthly; our Starter is ${starterRate}/mo and renews at ${starterRenewal}/mo. Namecheap's page says its advertised discount does not apply to renewals, and printed no renewal figure, so we do not state one.`,
    scopes: [PATH],
  },
  {
    question: "How does a Namecheap .com compare with a Serverlys .com?",
    answer: `Namecheap is cheaper to register and transfer: ${formatPrice(NC_COM_PRICE.firstYear)} for the first year (${formatPrice(NC_COM_PRICE.newCustomer)} for a new customer with a promo code) and ${formatPrice(NC_COM_PRICE.transfer)} to transfer. It renews at ${formatPrice(NC_COM_PRICE.renew)} a year. A Serverlys .com is ${comRegister} to register, transfer or renew, every year.`,
    scopes: [PATH],
  },
  {
    question: "How often does Namecheap back up a site?",
    answer: `Its shared hosting comparison table lists backups twice a week on Stellar, and twice a week plus AutoBackup on Stellar Plus and Stellar Business. Every Serverlys plan is backed up daily, and we run restores for you at no charge.`,
    scopes: [PATH],
  },
  {
    question: "Does Serverlys require a prepaid term?",
    answer: `No. The advertised price is a plain monthly rate. Starter is ${starterRate}/mo with a one-off ${starter?.setupFee ? formatPrice(starter.setupFee) : ""} setup fee, so the first invoice is ${formatPrice(firstInvoice)}, and the renewal rate is shown beside it on every plan.`,
    scopes: [PATH],
  },
  {
    question: "Is Namecheap a bad host?",
    answer:
      "No. Namecheap is an ICANN-accredited registrar with low prices, a free hosting trial, free lifetime domain privacy, free migration and 24/7 support. We differ on backups, on how much we do for you and on what a .com costs after year one, not on whether they are legitimate. Choose on the terms that suit you.",
    scopes: [PATH],
  },
];

const linkCls = "underline underline-offset-2 hover:text-fg";

export default function NamecheapAlternativePage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />

      {/* Hero: the answer first, then the checkout comparison. */}
      <section className="relative isolate overflow-hidden bg-canvas">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]" />
        <Container width="wide" className="pb-16 pt-10 sm:pb-20 lg:pb-24 lg:pt-14">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <Pill>Namecheap alternative</Pill>
              <h1 className="display-lg mt-5 text-fg">A Namecheap alternative for when cheapest is not the point</h1>
              <p className="mt-5 max-w-xl text-body-lg text-fg-secondary">
                The best Namecheap alternative depends on what you want from the bill. For the lowest price,
                Namecheap fits. If you would rather have daily backups, a .com that renews at {comRenew} and the
                migration done for you, Serverlys starts at {starterRate}/mo and renews at {starterRenewal}/mo.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="#ncx-table-heading" size="lg">See the comparison</Button>
                <Button href="/migrations" variant="outline" size="lg">Move my site for free</Button>
              </div>
            </div>
            <Stage>
              <div className="rounded-2xl bg-white p-5 sm:p-6">
                <p className="text-small font-semibold text-fg">Entry hosting and a .com, side by side</p>
                <p className="mt-1 text-micro text-fg-muted">Namecheap figures as of {SOURCE_DATE}</p>
                <dl className="mt-5 flex flex-col gap-3">
                  <div className="rounded-xl bg-brand-50 p-4 ring-2 ring-primary">
                    <dt className="flex items-center justify-between gap-3 text-small font-semibold text-fg">
                      Serverlys Starter <Pill>Daily backups</Pill>
                    </dt>
                    <dd className="mt-2 text-micro text-fg-secondary">
                      <span className="block text-body-lg font-semibold text-fg">{formatPrice(firstInvoice)} first invoice</span>
                      {starter ? `${starterRate}/mo + ${formatPrice(starter.setupFee ?? 0)} setup. Renews at ${starterRenewal}/mo.` : ""}{" "}
                      .com: {comRegister}, renews at {comRenew}/yr.
                    </dd>
                  </div>
                  <div className="rounded-xl bg-canvas-secondary p-4">
                    <dt className="flex items-center justify-between gap-3 text-small font-semibold text-fg">
                      Namecheap Stellar <Pill tone="neutral">{NC_TRIAL_DAYS}-day free trial</Pill>
                    </dt>
                    <dd className="mt-2 text-micro text-fg-secondary">
                      <span className="block text-body-lg font-semibold text-fg">{formatPrice(stellar.yearly)}/mo billed yearly</span>
                      {formatPrice(stellar.monthly)}/mo billed monthly; no renewal figure printed. Backups twice a week.
                      .com: {formatPrice(NC_COM_PRICE.firstYear)} first year, renews at {formatPrice(NC_COM_PRICE.renew)}/yr.
                    </dd>
                  </div>
                </dl>
              </div>
            </Stage>
          </div>
        </Container>
      </section>

      {/* The comparison. */}
      <Band tone="subtle" labelledBy="ncx-table-heading">
        <Heading
          id="ncx-table-heading"
          title="Serverlys vs Namecheap, side by side"
          lede="The figures that decide what hosting and a domain really cost, with Namecheap's read off its own pages on the date shown."
        />
        <div className="mt-12 overflow-x-auto rounded-3xl bg-canvas ring-1 ring-line">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">
              Serverlys and Namecheap compared on hosting price, renewal, trial, websites, backups, .com price, privacy, migration, support and services
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-6 py-5">
                  <span className="sr-only">Compared on</span>
                </th>
                <th scope="col" className="bg-brand-50 px-6 py-5 text-body-lg font-semibold text-fg">Serverlys</th>
                <th scope="col" className="px-6 py-5 text-body-lg font-semibold text-fg">
                  Namecheap
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
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.namecheap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-6 max-w-[760px] text-center text-micro text-fg-muted">
          Namecheap figures as of {SOURCE_DATE}, US data center, from{" "}
          <a href={NC_SHARED} rel="nofollow noopener" className={linkCls}>namecheap.com/hosting/shared</a> and{" "}
          <a href={NC_COM} rel="nofollow noopener" className={linkCls}>namecheap.com&rsquo;s .com page</a>. Some
          domains also carry a $0.20 ICANN fee at checkout. Prices are in USD and change often; check their site
          before you decide. Serverlys rates are the ones on our{" "}
          <Link href="/pricing" className={linkCls}>pricing page</Link> and our{" "}
          <Link href="/tld" className={linkCls}>domain extensions</Link> list.
        </p>
      </Band>

      {/* How to read the numbers. */}
      <Band labelledBy="ncx-read-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="ncx-read-heading" align="left" title="What the lower price does and does not include" />
            <p className="mt-5 max-w-[60ch] text-body text-fg-secondary">
              Namecheap is cheaper. Stellar at {formatPrice(stellar.monthly)}/mo billed monthly costs less than
              our Starter at {starterRate}/mo, and its yearly and bi-yearly prices are lower still. Its page says
              the advertised discount does not apply to renewals, without printing the renewal rate.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              The difference is in what sits around the hosting. Stellar is backed up twice a week; every
              Serverlys plan is backed up daily, and restores are free and run by us. Migration, patching and
              monitoring are done for you, and our renewal rate of {starterRenewal}/mo is printed before checkout.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              Domains split the other way by year. Namecheap&rsquo;s .com is {formatPrice(NC_COM_PRICE.firstYear)}{" "}
              in year one and {formatPrice(NC_COM_PRICE.renew)} at renewal. Ours is {comRegister} in year one and{" "}
              {comRenew} in every year after.
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

      {/* Where Namecheap wins. */}
      <Band tone="subtle" labelledBy="ncx-better-heading">
        <Heading
          id="ncx-better-heading"
          title="When Namecheap is the better choice"
          lede="A comparison that never loses is advertising. These are the cases where we would point you to them."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {NAMECHEAP_STRENGTHS.map((item) => (
            <li key={item.title} className="rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <h3 className="text-body-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-small text-fg-secondary">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-micro text-fg-muted">
          Hosting prices, trial, mailboxes and backups:{" "}
          <a href={NC_SHARED} rel="nofollow noopener" className={linkCls}>namecheap.com/hosting/shared</a>. Domain
          prices and privacy:{" "}
          <a href={NC_COM} rel="nofollow noopener" className={linkCls}>namecheap.com&rsquo;s .com page</a>, as of{" "}
          {SOURCE_DATE}.
        </p>
      </Band>

      {/* Where Serverlys differs. */}
      <Band tone="dark" labelledBy="ncx-differ-heading">
        <Heading
          id="ncx-differ-heading"
          dark
          title="Where Serverlys is different"
          lede="Hosting is half of it. The other half is the work around the site that we will do for you."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Daily backups, free restores", "Every plan is backed up daily, and we run the restore for you at no charge.", "/managed-hosting", "What managed covers"],
              ["One .com price", `A .com is ${comRegister} to register and ${comRenew} to renew, with WHOIS privacy free where the registry allows.`, "/tld/com", "The .com page"],
              ["Renewal printed", "The advertised price is a monthly rate with the renewal rate beside it, before checkout.", "/pricing", "See prices and renewals"],
              ["Migration we do", "Staged first, checked by you, DNS switched only when you say so.", "/migrations", "How migration works"],
              ["Website design and care", `Custom design for small businesses from ${formatDesignPrice(designFromPrice)}, plus site management for the updates and small changes.`, "/website-design", "Website design"],
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
          . Weighing a different host? See every comparison on the{" "}
          <Link href="/hosting-alternatives" className="font-semibold text-white underline-offset-4 hover:underline">
            hosting comparison
          </Link>{" "}
          page, written on the same rules.
        </p>
      </Band>

      {/* Switching. */}
      <Band labelledBy="ncx-switch-heading">
        <Heading
          id="ncx-switch-heading"
          title="How to move from Namecheap"
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
