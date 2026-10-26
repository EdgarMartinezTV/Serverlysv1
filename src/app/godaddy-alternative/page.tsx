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

const PATH = "/godaddy-alternative";

export const metadata = pageMetadata({
  title: "GoDaddy Alternative: Monthly Hosting, Flat .com Renewal",
  description:
    "A fair GoDaddy alternative: Serverlys bills hosting month to month, keeps .com at one price every year and migrates sites free. Dated, sourced figures.",
  path: PATH,
});

/**
 * /godaddy-alternative — commercial-investigation page for "godaddy
 * alternative(s)". Built on the same rules as /hostinger-alternative:
 *
 *   1. Every GoDaddy figure was read off godaddy.com on SOURCE_DATE and is
 *      printed with that date and its URL. A figure we could not read there is
 *      left out, not estimated. GoDaddy's hosting cards print no renewal
 *      figure, only a struck-through price and a disclaimer, so this page
 *      quotes exactly that and never calls the struck-through price a renewal
 *      rate. Re-verify before changing a number, and change SOURCE_DATE in the
 *      same edit.
 *   2. GoDaddy wins rows on this page, and the page says so: its prepaid entry
 *      price, 24/7 phone support, registrar scale and domain aftermarket.
 *   3. Serverlys figures come from data/pricing.ts and data/tld-catalog.ts and
 *      are never typed here. Hosting is a plain MONTHLY rate; this page never
 *      ties a Serverlys price to any multi-year commitment.
 *   4. No GoDaddy logo, colours or wordmark. No ratings, reviews or scores
 *      (GoDaddy's own pages show a star rating; it is deliberately not
 *      repeated).
 */

const SOURCE_DATE = "2026-10-26";
const SOURCE_LABEL = "26 October 2026";
const GD_WEB = "https://www.godaddy.com/hosting/web-hosting";
const GD_WP = "https://www.godaddy.com/hosting/wordpress-hosting";
const GD_COM = "https://www.godaddy.com/tlds/com-domain";
const GD_DOMAINS = "https://www.godaddy.com/domains";
const GD_REFUNDS = "https://www.godaddy.com/legal/agreements/refund-policy";

/**
 * Read off godaddy.com/hosting/web-hosting on SOURCE_DATE. Each card showed a
 * struck-through price, the price, "/mo" and "For first 3-yr term". The page's
 * disclaimer: "Special introductory pricing valid for the initial purchase
 * term only. Product renewal pricing subject to change." No renewal figure was
 * printed, so none is stated here.
 */
const GD_HOSTING = [
  { name: "Economy", price: 5.99, struck: 11.99, sites: "1 website" },
  { name: "Deluxe", price: 7.99, struck: 16.99, sites: "10 websites" },
  { name: "Ultimate", price: 12.99, struck: 21.99, sites: "25 websites" },
] as const;
const GD_HOSTING_TERM = "first 3-yr term";

/** Read off godaddy.com/hosting/wordpress-hosting on SOURCE_DATE ("For first 1-yr term"). */
const GD_WORDPRESS = [
  { name: "Basic", price: 6.99, struck: 14.99 },
  { name: "Deluxe", price: 10.99, struck: 19.99 },
  { name: "Ultimate", price: 14.99, struck: 26.99 },
] as const;
const GD_WORDPRESS_TERM = "first 1-yr term";

/**
 * Read off godaddy.com/tlds/com-domain on SOURCE_DATE: "$0.01 /1st yr —
 * 3-year purchase required. Additional year(s) $22.99", with "All prices
 * exclude applicable taxes and fees (including ICANN fees)."
 */
const GD_COM_PRICE = { firstYear: 0.01, minYears: 3, additionalYear: 22.99 } as const;

/** godaddy.com/domains on SOURCE_DATE: "GoDaddy manages over 82+ million domains." */
const GD_DOMAINS_MANAGED = "82+ million";

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

const ROWS: ReadonlyArray<{ label: string; serverlys: React.ReactNode; godaddy: React.ReactNode }> = [
  {
    label: "Advertised hosting price",
    serverlys: (
      <>
        {priceList(PLANS.map((p) => p.monthly))} per month
        {starter?.setupFee ? ` (Starter adds a one-off ${formatPrice(starter.setupFee)} setup fee)` : ""}
      </>
    ),
    godaddy: (
      <>
        {priceList(GD_HOSTING.map((p) => p.price))} per month, &ldquo;For {GD_HOSTING_TERM}&rdquo; (
        {GD_HOSTING.map((p) => p.name).join(" / ")})
      </>
    ),
  },
  {
    label: "Renewal price",
    serverlys: <>{priceList(PLANS.map((p) => p.standard))} per month, printed beside the advertised rate</>,
    godaddy: (
      <>
        No renewal figure on the plan cards. They show {priceList(GD_HOSTING.map((p) => p.struck))} struck
        through, and say &ldquo;Special introductory pricing valid for the initial purchase term only.
        Product renewal pricing subject to change.&rdquo;
      </>
    ),
  },
  {
    label: "Term needed for the advertised price",
    serverlys: <>None. The advertised price is the month-to-month rate.</>,
    godaddy: (
      <>
        Web Hosting: the {GD_HOSTING_TERM}. WordPress plans ({priceList(GD_WORDPRESS.map((p) => p.price))}/mo):
        the {GD_WORDPRESS_TERM}.
      </>
    ),
  },
  {
    label: ".com domain",
    serverlys: (
      <>
        {comRegister} to register, {comRenew} a year to renew
      </>
    ),
    godaddy: (
      <>
        {formatPrice(GD_COM_PRICE.firstYear)} for the first year, {GD_COM_PRICE.minYears}-year purchase required,
        additional years {formatPrice(GD_COM_PRICE.additionalYear)}; prices exclude taxes and ICANN fees
      </>
    ),
  },
  {
    label: "WHOIS privacy",
    serverlys: <>Free, where the registry allows it</>,
    godaddy: <>Free domain privacy listed with every registration</>,
  },
  {
    label: "Free migration",
    serverlys: <>Yes. We do it, staged first, and switch DNS only when you approve.</>,
    godaddy: <>Yes. A free Site Auto Migration Tool during onboarding: &ldquo;answer a few simple questions and we&rsquo;ll move your site.&rdquo;</>,
  },
  {
    label: "Backups",
    serverlys: <>Daily on every plan. Restores are free and we run them for you.</>,
    godaddy: <>Web Hosting: automatic daily backups to recover the account from the previous day. WordPress: daily plus on-demand, kept 30 days.</>,
  },
  {
    label: "Support",
    serverlys: <>24/7 support. One queue and one team on every plan, with no priority tier to buy.</>,
    godaddy: <>Free 24/7 support by phone and chat, including SMS</>,
  },
  {
    label: "Money-back guarantee",
    serverlys: <>30 days</>,
    godaddy: <>30 days on annual hosting plans, 48 hours on monthly plans; 5 days on a new domain registration</>,
  },
  {
    label: "Done-for-you services",
    serverlys: <>Website design, site management, an AI website chatbot (ConvoAI) and an AI phone receptionist (CallFlow)</>,
    godaddy: <>Building tools and AI, or &ldquo;let our experts do it for you&rdquo;</>,
  },
];

const GODADDY_STRENGTHS = [
  {
    title: "You want the biggest registrar",
    body: `GoDaddy calls itself the world's largest domain registrar and says it manages ${GD_DOMAINS_MANAGED} domains across more than 500 endings. If one huge account for many names matters most, that scale is real.`,
  },
  {
    title: "You want to phone someone at 3 a.m.",
    body: "GoDaddy advertises free 24/7 support by phone and chat, including SMS. Our support is 24/7 too, but if a phone line is the deciding factor, theirs is published plainly.",
  },
  {
    title: "You are buying or selling a domain",
    body: "GoDaddy runs domain auctions and a Domain Broker Service that negotiates with a current owner for you. We register and transfer domains; we do not run an aftermarket.",
  },
  {
    title: "You are happy to commit three years",
    body: `Economy is ${formatPrice(GD_HOSTING[0].price)}/mo for the ${GD_HOSTING_TERM}. That is below our Starter's ${starterRate}/mo, and we will not pretend otherwise. Check what it renews at before you buy.`,
  },
  {
    title: "You want backups you trigger yourself",
    body: "GoDaddy's WordPress plans list on-demand backups alongside daily ones, kept for 30 days. If you like taking your own snapshot before every plugin update, that is built in.",
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
        . You do not need to export anything from your GoDaddy account first.
      </>
    ),
  },
  {
    title: "Check the staged copy, then approve the DNS switch",
    body: <>We copy your files and database to a staging address. When you are happy, we point the domain at Serverlys. Your GoDaddy site keeps serving until the change has spread, so there is no gap.</>,
  },
  {
    title: "Move the domain, if you want to",
    body: (
      <>
        Hosting and domain can move separately. To bring the domain too, unlock it at GoDaddy, get its
        authorisation code and start a{" "}
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
    title: "Cancel GoDaddy last",
    body: <>Once the site, email and SSL are confirmed on Serverlys, cancel the old plan. If you are still inside GoDaddy&rsquo;s refund window, check its refund policy first.</>,
  },
] as const;

const FAQS: readonly Faq[] = [
  {
    question: "What is the best GoDaddy alternative?",
    answer: `It depends on what you are buying. For the biggest registrar, a domain aftermarket and 24/7 phone support, GoDaddy itself is hard to replace. If you want hosting billed month to month with the renewal rate printed, a .com at one price every year and the migration done for you, Serverlys starts at ${starterRate}/mo and renews at ${starterRenewal}/mo.`,
    scopes: [PATH],
  },
  {
    question: "Does GoDaddy's hosting price go up at renewal?",
    answer: `GoDaddy's cards show Economy at ${formatPrice(GD_HOSTING[0].price)}/mo for the ${GD_HOSTING_TERM}, with ${formatPrice(GD_HOSTING[0].struck)} struck through, and its disclaimer says introductory pricing is valid for the initial purchase term only and renewal pricing is subject to change. It printed no renewal figure on ${SOURCE_LABEL}, so we do not state one. Our Starter goes from ${starterRate} to ${starterRenewal}/mo, shown before checkout.`,
    scopes: [PATH],
  },
  {
    question: "Is GoDaddy's one-cent .com cheaper than a Serverlys .com?",
    answer: `For the first year, yes. On ${SOURCE_LABEL} GoDaddy offered a .com at ${formatPrice(GD_COM_PRICE.firstYear)} for the first year with a ${GD_COM_PRICE.minYears}-year purchase required and additional years at ${formatPrice(GD_COM_PRICE.additionalYear)}, before taxes and ICANN fees. A .com at Serverlys is ${comRegister} to register and ${comRenew} every year after.`,
    scopes: [PATH],
  },
  {
    question: "Does Serverlys require a multi-year term?",
    answer: `No. The advertised price is a plain monthly rate. Starter is ${starterRate}/mo with a one-off ${starter?.setupFee ? formatPrice(starter.setupFee) : ""} setup fee, so the first invoice is ${formatPrice(firstInvoice)}, and the renewal rate is shown beside it on every plan.`,
    scopes: [PATH],
  },
  {
    question: "Can I move my site and domain from GoDaddy to Serverlys?",
    answer:
      "Yes. Site migration is free on every plan and we do it for you: staged first, checked by you, DNS switched only when you approve, with the GoDaddy site online until then. The domain is a separate transfer you start with its authorisation code, and you can leave it at GoDaddy if you prefer.",
    scopes: [PATH],
  },
  {
    question: "Is GoDaddy a bad host?",
    answer:
      "No. GoDaddy says it is the world's largest domain registrar, and it offers 24/7 phone support, free migrations, daily backups and a domain aftermarket. We differ on how we bill and on how much we do for you, not on whether they are legitimate. Choose on the terms that suit you.",
    scopes: [PATH],
  },
];

const linkCls = "underline underline-offset-2 hover:text-fg";

export default function GoDaddyAlternativePage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />

      {/* Hero: the answer first, then the checkout comparison. */}
      <section className="relative isolate overflow-hidden bg-canvas">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]" />
        <Container width="wide" className="pb-16 pt-10 sm:pb-20 lg:pb-24 lg:pt-14">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <Pill>GoDaddy alternative</Pill>
              <h1 className="display-lg mt-5 text-fg">A GoDaddy alternative that bills month to month</h1>
              <p className="mt-5 max-w-xl text-body-lg text-fg-secondary">
                The best GoDaddy alternative depends on what you need. For the biggest registrar and phone
                support, GoDaddy fits. If you would rather pay monthly, see the renewal rate before checkout
                and keep a .com at one yearly price, Serverlys starts at {starterRate}/mo, renews at{" "}
                {starterRenewal}/mo, and moves your site free.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="#gx-table-heading" size="lg">See the comparison</Button>
                <Button href="/migrations" variant="outline" size="lg">Move my site for free</Button>
              </div>
            </div>
            <Stage>
              <div className="rounded-2xl bg-white p-5 sm:p-6">
                <p className="text-small font-semibold text-fg">Entry hosting and a .com, side by side</p>
                <p className="mt-1 text-micro text-fg-muted">GoDaddy figures as of {SOURCE_DATE}</p>
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
                      GoDaddy Economy <Pill tone="neutral">For {GD_HOSTING_TERM}</Pill>
                    </dt>
                    <dd className="mt-2 text-micro text-fg-secondary">
                      <span className="block text-body-lg font-semibold text-fg">{formatPrice(GD_HOSTING[0].price)}/mo</span>
                      {formatPrice(GD_HOSTING[0].struck)} struck through; no renewal figure printed. .com:{" "}
                      {formatPrice(GD_COM_PRICE.firstYear)} first year, {GD_COM_PRICE.minYears}-year purchase required,
                      then {formatPrice(GD_COM_PRICE.additionalYear)}/yr.
                    </dd>
                  </div>
                </dl>
              </div>
            </Stage>
          </div>
        </Container>
      </section>

      {/* The comparison. */}
      <Band tone="subtle" labelledBy="gx-table-heading">
        <Heading
          id="gx-table-heading"
          title="Serverlys vs GoDaddy, side by side"
          lede="The figures that decide what hosting and a domain really cost, with GoDaddy's read off its own pages on the date shown."
        />
        <div className="mt-12 overflow-x-auto rounded-3xl bg-canvas ring-1 ring-line">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">
              Serverlys and GoDaddy compared on hosting price, renewal, term, .com price, privacy, migration, backups, support and services
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-6 py-5">
                  <span className="sr-only">Compared on</span>
                </th>
                <th scope="col" className="bg-brand-50 px-6 py-5 text-body-lg font-semibold text-fg">Serverlys</th>
                <th scope="col" className="px-6 py-5 text-body-lg font-semibold text-fg">
                  GoDaddy
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
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.godaddy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-6 max-w-[760px] text-center text-micro text-fg-muted">
          GoDaddy figures as of {SOURCE_DATE}, from{" "}
          <a href={GD_WEB} rel="nofollow noopener" className={linkCls}>godaddy.com/hosting/web-hosting</a>,{" "}
          <a href={GD_WP} rel="nofollow noopener" className={linkCls}>godaddy.com/hosting/wordpress-hosting</a>,{" "}
          <a href={GD_COM} rel="nofollow noopener" className={linkCls}>godaddy.com/tlds/com-domain</a>,{" "}
          <a href={GD_DOMAINS} rel="nofollow noopener" className={linkCls}>godaddy.com/domains</a> and{" "}
          <a href={GD_REFUNDS} rel="nofollow noopener" className={linkCls}>its refund policy</a>. Prices are in USD
          and change often; check their site before you decide. Serverlys rates are the ones on our{" "}
          <Link href="/pricing" className={linkCls}>pricing page</Link> and our{" "}
          <Link href="/tld" className={linkCls}>domain extensions</Link> list.
        </p>
      </Band>

      {/* How to read the numbers. */}
      <Band labelledBy="gx-read-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="gx-read-heading" align="left" title="How to read the two price tags" />
            <p className="mt-5 max-w-[60ch] text-body text-fg-secondary">
              GoDaddy&rsquo;s {formatPrice(GD_HOSTING[0].price)}/mo applies to the {GD_HOSTING_TERM}. The
              same plan cards print a struck-through price, but not a renewal rate, and the small print says
              renewal pricing is subject to change. That is not a hidden fee; it is simply a number you have
              to find before you can budget for year four.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              Our {starterRate}/mo is what a single month costs, and the renewal rate of {starterRenewal}/mo
              sits beside it. That makes GoDaddy cheaper to start if you commit three years, and Serverlys
              easier to test, to budget and to leave.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              Domains follow the same pattern. A one-cent first year is a real saving, but it comes with a{" "}
              {GD_COM_PRICE.minYears}-year purchase and {formatPrice(GD_COM_PRICE.additionalYear)} for each
              further year. A Serverlys .com costs {comRegister} in year one and {comRenew} in every year
              after, so there is no jump to plan for.
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

      {/* Where GoDaddy wins. */}
      <Band tone="subtle" labelledBy="gx-better-heading">
        <Heading
          id="gx-better-heading"
          title="When GoDaddy is the better choice"
          lede="A comparison that never loses is advertising. These are the cases where we would point you to them."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GODADDY_STRENGTHS.map((item) => (
            <li key={item.title} className="rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <h3 className="text-body-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-small text-fg-secondary">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-micro text-fg-muted">
          Registrar scale, auctions and broker service:{" "}
          <a href={GD_DOMAINS} rel="nofollow noopener" className={linkCls}>godaddy.com/domains</a>. Support,
          pricing and backups:{" "}
          <a href={GD_WEB} rel="nofollow noopener" className={linkCls}>godaddy.com/hosting/web-hosting</a> and{" "}
          <a href={GD_WP} rel="nofollow noopener" className={linkCls}>godaddy.com/hosting/wordpress-hosting</a>,
          as of {SOURCE_DATE}.
        </p>
      </Band>

      {/* Where Serverlys differs. */}
      <Band tone="dark" labelledBy="gx-differ-heading">
        <Heading
          id="gx-differ-heading"
          dark
          title="Where Serverlys is different"
          lede="Hosting is half of it. The other half is the work around the site that we will do for you."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Monthly, plainly", "The advertised price is a monthly rate with the renewal rate beside it. No multi-year commitment is needed to get it.", "/pricing", "See prices and renewals"],
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
          . Weighing a different host? Read our{" "}
          <Link href="/hostinger-alternative" className="font-semibold text-white underline-offset-4 hover:underline">
            Hostinger alternative
          </Link>{" "}
          comparison, written on the same rules.
        </p>
      </Band>

      {/* Switching. */}
      <Band labelledBy="gx-switch-heading">
        <Heading
          id="gx-switch-heading"
          title="How to move from GoDaddy"
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
