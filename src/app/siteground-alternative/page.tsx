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

const PATH = "/siteground-alternative";

export const metadata = pageMetadata({
  title: "SiteGround Alternative: No Prepayment, Lower Renewal",
  description:
    "A fair SiteGround alternative: Serverlys bills hosting month to month, renews lower and keeps .com at one yearly price. Dated, sourced figures.",
  path: PATH,
});

/**
 * /siteground-alternative — commercial-investigation page for "siteground
 * alternative(s)". Built on the /godaddy-alternative pattern and bound by the
 * same rules (see /hosting-alternatives for why the site otherwise names no
 * competitor):
 *
 *   1. Every SiteGround figure was read off siteground.com on SOURCE_DATE and
 *      is printed with that date and its URL. A figure we could not read there
 *      is left out, not estimated. (Not printed, because not found on
 *      SOURCE_DATE: a monthly-billing price for the hosting plans, the price of
 *      domain privacy after its free 12 months.) Re-verify before changing a
 *      number, and change SOURCE_DATE in the same edit.
 *   2. SiteGround wins rows on this page, and the page says so: a lower
 *      first-year price when prepaid, unlimited email accounts included, a
 *      free first-year domain, staging and on-demand backups on the upper
 *      plans, and published phone support.
 *   3. Serverlys figures come from data/pricing.ts and data/tld-catalog.ts and
 *      are never typed here. Hosting is a plain MONTHLY rate; this page never
 *      ties a Serverlys price to any multi-year commitment.
 *   4. No SiteGround logo, colours or wordmark. No ratings, reviews or scores
 *      (SiteGround's pages show a star rating and customer quotes; neither is
 *      repeated).
 */

const SOURCE_DATE = "2026-10-26";
const SOURCE_LABEL = "26 October 2026";
const SG_WEB = "https://www.siteground.com/web-hosting.htm";
const SG_WP = "https://www.siteground.com/wordpress-hosting.htm";
const SG_DOMAINS = "https://www.siteground.com/domain_names";

/**
 * Read off siteground.com/web-hosting.htm on SOURCE_DATE (the WordPress
 * hosting page showed the same three prices). Each card read e.g. "$2.99 /mo.
 * … Renews at $17.99 /mo. Prepaid for 12 months."
 */
const SG_HOSTING = [
  { name: "StartUp", intro: 2.99, renews: 17.99, sites: "1 website", storage: "10 GB" },
  { name: "GrowBig", intro: 4.99, renews: 29.99, sites: "Unlimited websites", storage: "50 GB" },
  { name: "GoGeek", intro: 7.99, renews: 44.99, sites: "Unlimited websites", storage: "100 GB" },
] as const;
const SG_TERM_MONTHS = 12;

/**
 * Read off siteground.com/domain_names on SOURCE_DATE: ".com -48% $22.99 /yr
 * $11.99/yr", with "Discounted prices apply to the first invoice only. Regular
 * prices apply for all consecutive renewals unless explicitly stated
 * otherwise." The same page: "Get 12 months free domain privacy."
 */
const SG_COM = { firstYear: 11.99, regular: 22.99 } as const;

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
const sgStartUp = SG_HOSTING[0];

const ROWS: ReadonlyArray<{ label: string; serverlys: React.ReactNode; siteground: React.ReactNode }> = [
  {
    label: "Advertised hosting price",
    serverlys: (
      <>
        {priceList(PLANS.map((p) => p.monthly))} per month
        {starter?.setupFee ? ` (Starter adds a one-off ${formatPrice(starter.setupFee)} setup fee)` : ""}
      </>
    ),
    siteground: (
      <>
        {priceList(SG_HOSTING.map((p) => p.intro))} per month ({SG_HOSTING.map((p) => p.name).join(" / ")})
      </>
    ),
  },
  {
    label: "Renewal price",
    serverlys: <>{priceList(PLANS.map((p) => p.standard))} per month, printed beside the advertised rate</>,
    siteground: <>{priceList(SG_HOSTING.map((p) => p.renews))} per month, printed on each plan card</>,
  },
  {
    label: "Billing needed for the advertised price",
    serverlys: <>None. The advertised price is the month-to-month rate.</>,
    siteground: <>&ldquo;Prepaid for {SG_TERM_MONTHS} months&rdquo;</>,
  },
  {
    label: "Websites and storage",
    serverlys: (
      <>
        {PLANS.map((p) => `${p.name}: ${p.specs.sites.toLowerCase()}`).join("; ")}. {starter?.specs.storage} storage.
      </>
    ),
    siteground: <>{SG_HOSTING.map((p) => `${p.name}: ${p.sites.toLowerCase()}, ${p.storage}`).join("; ")}</>,
  },
  {
    label: ".com domain",
    serverlys: (
      <>
        {comRegister} to register, {comRenew} a year to renew
      </>
    ),
    siteground: (
      <>
        {formatPrice(SG_COM.firstYear)} for the first year, {formatPrice(SG_COM.regular)} a year after that. Free
        for the first year with a hosting plan (.com, .org or .net).
      </>
    ),
  },
  {
    label: "WHOIS privacy",
    serverlys: <>Free, where the registry allows it</>,
    siteground: <>12 months free</>,
  },
  {
    label: "Free migration",
    serverlys: <>Yes. We do it, staged first, and switch DNS only when you approve.</>,
    siteground: <>Yes. Their experts transfer the site, or you use their automatic migrator for WordPress.</>,
  },
  {
    label: "Backups",
    serverlys: <>Daily on every plan. Restores are free and we run them for you.</>,
    siteground: <>Free daily backups with up to 30 days of restore points; on-demand backups on GrowBig and GoGeek</>,
  },
  {
    label: "Business email",
    serverlys: (
      <>
        Separate{" "}
        <Link href="/business-email" className="underline underline-offset-2 hover:text-primary">
          business email plans
        </Link>
      </>
    ),
    siteground: <>Unlimited email accounts at your domain, included in every web hosting plan</>,
  },
  {
    label: "Support",
    serverlys: <>24/7 support. One queue and one team on every plan, with no priority tier to buy.</>,
    siteground: <>24/7 live chat and a published phone line; &ldquo;Priority support&rdquo; listed on GoGeek</>,
  },
  {
    label: "Money-back guarantee",
    serverlys: <>30 days</>,
    siteground: <>30 days</>,
  },
  {
    label: "Done-for-you services",
    serverlys: <>Website design, site management, an AI website chatbot (ConvoAI) and an AI phone receptionist (CallFlow)</>,
    siteground: <>Self-serve tools listed on the plans: a drag-and-drop website builder and an AI agent for WordPress</>,
  },
];

const SITEGROUND_STRENGTHS = [
  {
    title: "You are happy to prepay a year",
    body: `On ${SOURCE_LABEL} SiteGround's StartUp plan was ${formatPrice(sgStartUp.intro)}/mo, prepaid for ${SG_TERM_MONTHS} months. For that first year it costs less than our Starter at ${starterRate}/mo, and we will not pretend otherwise.`,
  },
  {
    title: "You want email included in the hosting",
    body: "Every SiteGround web hosting plan includes unlimited email accounts at your domain. Our business email is its own plan, so if mailboxes bundled into hosting matter most, theirs is the simpler bill.",
  },
  {
    title: "You want a free first-year domain",
    body: "SiteGround adds a .com, .org or .net free for the first year with a hosting plan. Ours is charged from year one, at the same price as every renewal.",
  },
  {
    title: "You want staging and on-demand backups",
    body: "GrowBig and GoGeek list a staging copy of your site and on-demand backups, alongside the daily ones. If you test every change on a copy first, that is built in.",
  },
  {
    title: "You want to phone someone",
    body: "SiteGround publishes a phone number next to its 24/7 live chat. Our support is 24/7 too, but if a phone line is the deciding factor, theirs is on the page.",
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
        . You do not need to export anything from your SiteGround account first.
      </>
    ),
  },
  {
    title: "Check the staged copy, then approve the DNS switch",
    body: <>We copy your files and database to a staging address. When you are happy, we point the domain at Serverlys. Your SiteGround site keeps serving until the change has spread, so there is no gap.</>,
  },
  {
    title: "Move the email and the domain, if you want to",
    body: (
      <>
        If your mailboxes live on SiteGround hosting, set up{" "}
        <Link href="/business-email" className="font-semibold text-primary hover:text-primary-hover">
          business email
        </Link>{" "}
        before you cancel. To bring the domain too, unlock it, get its authorisation code and start a{" "}
        <Link href="/transfer-domain" className="font-semibold text-primary hover:text-primary-hover">
          domain transfer
        </Link>
        . A{" "}
        <Link href="/tld/com" className="font-semibold text-primary hover:text-primary-hover">
          .com
        </Link>{" "}
        transfer costs {com ? formatPrice(com.transfer) : ""} and adds a year; ICANN rules block transfers within
        60 days of a registration or a previous transfer.
      </>
    ),
  },
  {
    title: "Cancel SiteGround last",
    body: <>Once the site, email and SSL are confirmed on Serverlys, cancel the old plan. If you are still inside SiteGround&rsquo;s 30-day money-back window, check its terms first.</>,
  },
] as const;

const FAQS: readonly Faq[] = [
  {
    question: "What is the best SiteGround alternative?",
    answer: `It depends on how you want to pay. If you will prepay a year and want email bundled into hosting, SiteGround's first-year price is hard to beat. If you want to pay month to month, keep a lower renewal rate and have the migration done for you, Serverlys starts at ${starterRate}/mo and renews at ${starterRenewal}/mo.`,
    scopes: [PATH],
  },
  {
    question: "How much does SiteGround cost after the first year?",
    answer: `SiteGround prints it on each card. On ${SOURCE_LABEL} StartUp was ${formatPrice(sgStartUp.intro)}/mo prepaid for ${SG_TERM_MONTHS} months and renewed at ${formatPrice(sgStartUp.renews)}/mo; GrowBig renewed at ${formatPrice(SG_HOSTING[1].renews)}/mo and GoGeek at ${formatPrice(SG_HOSTING[2].renews)}/mo. Our Starter goes from ${starterRate} to ${starterRenewal}/mo, shown before checkout.`,
    scopes: [PATH],
  },
  {
    question: "Is a .com cheaper at SiteGround or at Serverlys?",
    answer: `In the first year, SiteGround: ${formatPrice(SG_COM.firstYear)}, or free with a hosting plan. From the second year a SiteGround .com is ${formatPrice(SG_COM.regular)} a year, as its domain page states that discounts apply to the first invoice only. A Serverlys .com is ${comRegister} to register and ${comRenew} every year after.`,
    scopes: [PATH],
  },
  {
    question: "Does Serverlys require a prepaid term?",
    answer: `No. The advertised price is a plain monthly rate. Starter is ${starterRate}/mo with a one-off ${starter?.setupFee ? formatPrice(starter.setupFee) : ""} setup fee, so the first invoice is ${formatPrice(firstInvoice)}, and the renewal rate is shown beside it on every plan.`,
    scopes: [PATH],
  },
  {
    question: "Can I move my WordPress site from SiteGround to Serverlys?",
    answer:
      "Yes. Site migration is free on every plan and we do it for you: staged first, checked by you, DNS switched only when you approve, with the SiteGround site online until then. Email and the domain are separate moves, and you can leave the domain where it is if you prefer.",
    scopes: [PATH],
  },
  {
    question: "Is SiteGround a bad host?",
    answer:
      "No. SiteGround runs on Google Cloud, includes free daily backups, unlimited email accounts and free migration, and offers 24/7 chat and phone support. We differ on how we bill, on what renewal costs and on how much we do for you, not on whether they are legitimate. Choose on the terms that suit you.",
    scopes: [PATH],
  },
];

const linkCls = "underline underline-offset-2 hover:text-fg";

export default function SiteGroundAlternativePage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />

      {/* Hero: the answer first, then the checkout comparison. */}
      <section className="relative isolate overflow-hidden bg-canvas">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]" />
        <Container width="wide" className="pb-16 pt-10 sm:pb-20 lg:pb-24 lg:pt-14">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <Pill>SiteGround alternative</Pill>
              <h1 className="display-lg mt-5 text-fg">A SiteGround alternative with no year to prepay</h1>
              <p className="mt-5 max-w-xl text-body-lg text-fg-secondary">
                The best SiteGround alternative depends on how you pay. Prepay a year and SiteGround starts lower.
                Pay month to month and keep the renewal down, and Serverlys starts at {starterRate}/mo, renews at{" "}
                {starterRenewal}/mo, and moves your site free.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="#sgx-table-heading" size="lg">See the comparison</Button>
                <Button href="/migrations" variant="outline" size="lg">Move my site for free</Button>
              </div>
            </div>
            <Stage>
              <div className="rounded-2xl bg-white p-5 sm:p-6">
                <p className="text-small font-semibold text-fg">Entry hosting, year one and year two</p>
                <p className="mt-1 text-micro text-fg-muted">SiteGround figures as of {SOURCE_DATE}</p>
                <dl className="mt-5 flex flex-col gap-3">
                  <div className="rounded-xl bg-brand-50 p-4 ring-2 ring-primary">
                    <dt className="flex items-center justify-between gap-3 text-small font-semibold text-fg">
                      Serverlys Starter <Pill>Month to month</Pill>
                    </dt>
                    <dd className="mt-2 text-micro text-fg-secondary">
                      <span className="block text-body-lg font-semibold text-fg">{formatPrice(firstInvoice)} first invoice</span>
                      {starter ? `${starterRate}/mo + ${formatPrice(starter.setupFee ?? 0)} setup. Renews at ${starterRenewal}/mo.` : ""}{" "}
                      .com: {comRegister}, renews at {comRenew}/yr.
                    </dd>
                  </div>
                  <div className="rounded-xl bg-canvas-secondary p-4">
                    <dt className="flex items-center justify-between gap-3 text-small font-semibold text-fg">
                      SiteGround StartUp <Pill tone="neutral">Prepaid {SG_TERM_MONTHS} months</Pill>
                    </dt>
                    <dd className="mt-2 text-micro text-fg-secondary">
                      <span className="block text-body-lg font-semibold text-fg">{formatPrice(sgStartUp.intro)}/mo</span>
                      Renews at {formatPrice(sgStartUp.renews)}/mo. .com: free with hosting for year one, or{" "}
                      {formatPrice(SG_COM.firstYear)}; then {formatPrice(SG_COM.regular)}/yr.
                    </dd>
                  </div>
                </dl>
              </div>
            </Stage>
          </div>
        </Container>
      </section>

      {/* The comparison. */}
      <Band tone="subtle" labelledBy="sgx-table-heading">
        <Heading
          id="sgx-table-heading"
          title="Serverlys vs SiteGround, side by side"
          lede="The figures that decide what hosting and a domain really cost, with SiteGround's read off its own pages on the date shown."
        />
        <div className="mt-12 overflow-x-auto rounded-3xl bg-canvas ring-1 ring-line">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">
              Serverlys and SiteGround compared on hosting price, renewal, billing, websites, .com price, privacy, migration, backups, email, support and services
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-6 py-5">
                  <span className="sr-only">Compared on</span>
                </th>
                <th scope="col" className="bg-brand-50 px-6 py-5 text-body-lg font-semibold text-fg">Serverlys</th>
                <th scope="col" className="px-6 py-5 text-body-lg font-semibold text-fg">
                  SiteGround
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
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.siteground}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-6 max-w-[760px] text-center text-micro text-fg-muted">
          SiteGround figures as of {SOURCE_DATE}, from{" "}
          <a href={SG_WEB} rel="nofollow noopener" className={linkCls}>siteground.com/web-hosting.htm</a>,{" "}
          <a href={SG_WP} rel="nofollow noopener" className={linkCls}>siteground.com/wordpress-hosting.htm</a> and{" "}
          <a href={SG_DOMAINS} rel="nofollow noopener" className={linkCls}>siteground.com/domain_names</a>. Prices are
          in USD and change often; check their site before you decide. Serverlys rates are the ones on our{" "}
          <Link href="/pricing" className={linkCls}>pricing page</Link> and our{" "}
          <Link href="/tld" className={linkCls}>domain extensions</Link> list.
        </p>
      </Band>

      {/* How to read the numbers. */}
      <Band labelledBy="sgx-read-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="sgx-read-heading" align="left" title="Year one and year two are different comparisons" />
            <p className="mt-5 max-w-[60ch] text-body text-fg-secondary">
              SiteGround prints both numbers plainly: StartUp is {formatPrice(sgStartUp.intro)}/mo for a prepaid
              first year, then {formatPrice(sgStartUp.renews)}/mo. That is a fair way to sell hosting, and in
              year one it is cheaper than ours.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              Our {starterRate}/mo is what a single month costs, with no year to prepay, and it renews at{" "}
              {starterRenewal}/mo. From the second year our entry plan costs less each month than theirs, and
              the same holds on every tier: compare {priceList(PLANS.map((p) => p.standard))} with{" "}
              {priceList(SG_HOSTING.map((p) => p.renews))}.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              Domains follow the same pattern. SiteGround&rsquo;s .com is free or {formatPrice(SG_COM.firstYear)} in
              year one and {formatPrice(SG_COM.regular)} after. A Serverlys .com costs {comRegister} in year one
              and {comRenew} in every year after, so there is no jump to plan for.
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

      {/* Where SiteGround wins. */}
      <Band tone="subtle" labelledBy="sgx-better-heading">
        <Heading
          id="sgx-better-heading"
          title="When SiteGround is the better choice"
          lede="A comparison that never loses is advertising. These are the cases where we would point you to them."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SITEGROUND_STRENGTHS.map((item) => (
            <li key={item.title} className="rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <h3 className="text-body-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-small text-fg-secondary">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-micro text-fg-muted">
          Plans, email, backups, staging and support:{" "}
          <a href={SG_WEB} rel="nofollow noopener" className={linkCls}>siteground.com/web-hosting.htm</a>. Domains:{" "}
          <a href={SG_DOMAINS} rel="nofollow noopener" className={linkCls}>siteground.com/domain_names</a>, as of{" "}
          {SOURCE_DATE}.
        </p>
      </Band>

      {/* Where Serverlys differs. */}
      <Band tone="dark" labelledBy="sgx-differ-heading">
        <Heading
          id="sgx-differ-heading"
          dark
          title="Where Serverlys is different"
          lede="Hosting is half of it. The other half is the work around the site that we will do for you."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Monthly, plainly", "The advertised price is a monthly rate with the renewal rate beside it. No year to prepay to get it.", "/pricing", "See prices and renewals"],
              ["One .com price", `A .com is ${comRegister} to register and ${comRenew} to renew, with WHOIS privacy free where the registry allows.`, "/tld/com", "The .com page"],
              ["Managed for you", "Patching, hardening, monitoring and free restores on every tier, without buying a bigger plan.", "/managed-hosting", "What managed covers"],
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
      <Band labelledBy="sgx-switch-heading">
        <Heading
          id="sgx-switch-heading"
          title="How to move from SiteGround"
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
