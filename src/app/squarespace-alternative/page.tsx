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
import { designPlans, designFromPrice, formatDesignPrice } from "@/data/design-plans";
import { businessPlans, formatBusinessPrice } from "@/data/business-plans";
import { careFromPrice, formatCarePrice } from "@/data/care-plans";

const PATH = "/squarespace-alternative";

export const metadata = pageMetadata({
  title: "Squarespace Alternative: Your Site Designed, on WordPress",
  description:
    "A fair Squarespace alternative: Serverlys designs your site on WordPress and hosts it, so you own it and can move it. Dated, sourced figures.",
  path: PATH,
});

/**
 * /squarespace-alternative — commercial-investigation page for "squarespace
 * alternative(s)". Built on the /godaddy-alternative rules, framed like
 * /wix-alternative: Squarespace is a website BUILDER with hosting included,
 * not a host, so the comparison is "build it yourself on a platform" against
 * "a designed site on WordPress hosting that you own".
 *
 *   1. Every Squarespace figure was read off squarespace.com on SOURCE_DATE and
 *      is printed with that date and its URL. Each plan card carries a monthly
 *      and an annual price; which is which was confirmed from the page markup
 *      (the "monthly" and "annual" price elements), not inferred. The page's
 *      "save up to 36%" headline is not repeated: the card prices themselves
 *      show smaller savings, and we print the card prices. A figure we could
 *      not read there is left out, not estimated (for example the standard
 *      domain renewal rate, which the page refers to but does not print).
 *      Re-verify before changing a number, and change SOURCE_DATE in the same
 *      edit.
 *   2. Squarespace wins rows on this page, and the page says so: a much lower
 *      cost to start, monthly billing you can cancel any time, a free trial,
 *      its templates and commerce tools, and a free first-year domain and
 *      Google Workspace seat on qualifying plans.
 *   3. Serverlys figures come from data/pricing.ts, data/design-plans.ts,
 *      data/business-plans.ts, data/care-plans.ts and data/tld-catalog.ts and
 *      are never typed here. Design prices are one-time STARTING prices,
 *      scoped in writing; hosting is a plain MONTHLY rate.
 *   4. The export row quotes Squarespace's own help article.
 *   5. No Squarespace logo, colours or wordmark. No ratings, reviews or scores.
 */

const SOURCE_DATE = "2026-10-26";
const SOURCE_LABEL = "26 October 2026";
const SQ_PRICING = "https://www.squarespace.com/pricing";
const SQ_EXPORT = "https://support.squarespace.com/hc/en-us/articles/206566687-Exporting-your-site";

/**
 * Read off squarespace.com/pricing on SOURCE_DATE: each card's monthly price
 * and annual price per month, plus the online-store transaction fee and the
 * contributor limit from the same card.
 */
const SQ = [
  { name: "Basic", monthly: 25, annual: 19, storeFee: "2%" },
  { name: "Core", monthly: 39, annual: 29, storeFee: "0%" },
  { name: "Plus", monthly: 65, annual: 49, storeFee: "0%" },
  { name: "Advanced", monthly: 139, annual: 99, storeFee: "0%" },
] as const;
const SQ_TRIAL_DAYS = 14;

/**
 * From SQ_EXPORT on SOURCE_DATE: the export is an .xml file for WordPress;
 * only one blog page exports; store pages, product, audio and video blocks,
 * drafts, style settings and custom CSS do not.
 */
const SQ_NOT_EXPORTED = "store pages, product, audio and video blocks, drafts, style settings or custom CSS";

const wpHosting = groupById("wordpress");
const PLANS = wpHosting?.plans ?? [];
const starter = PLANS[0];
const com = tldBySlug("com");
const growth = businessPlans.find((p) => p.id === "growth");

const dollars = (values: readonly number[]) => values.map((n) => `$${n}`).join(" / ");
const starterRate = starter ? formatPrice(starter.monthly) : "";
const starterRenewal = starter ? formatPrice(starter.standard) : "";
const comRegister = com ? formatPrice(com.register) : "";
const comRenew = com ? formatPrice(com.renew) : "";
const designFrom = formatDesignPrice(designFromPrice);
const growthPrice = growth ? formatBusinessPrice(growth.price) : "";
const sqBasic = SQ[0];

const ROWS: ReadonlyArray<{ label: string; serverlys: React.ReactNode; squarespace: React.ReactNode }> = [
  {
    label: "Who builds the site",
    serverlys: <>Our designers: a custom homepage, your subpages, a web style guide and analytics, built on WordPress</>,
    squarespace: <>You, starting from Squarespace templates and its built-in AI tools; Squarespace also offers to match you with a hired expert</>,
  },
  {
    label: "What it costs",
    serverlys: (
      <>
        Design from {designFrom}, one time ({designPlans.map((p) => `${p.name} ${formatDesignPrice(p.price)}`).join(" / ")}),
        plus hosting from {starterRate}/mo, renewing at {starterRenewal}/mo.
        {growth ? ` Or ${growth.name}: ${growthPrice}/mo with a site of up to ${growth.pages} pages built for you.` : ""}
      </>
    ),
    squarespace: (
      <>
        {dollars(SQ.map((p) => p.monthly))} per month billed monthly, or {dollars(SQ.map((p) => p.annual))} per month
        on an annual plan ({SQ.map((p) => p.name).join(" / ")}). No free plan; a {SQ_TRIAL_DAYS}-day free trial.
      </>
    ),
  },
  {
    label: "Hosting",
    serverlys: <>WordPress hosting with daily backups, free restores and the renewal rate printed</>,
    squarespace: <>Included in every plan: &ldquo;fully-managed cloud hosting&rdquo;</>,
  },
  {
    label: "Your own domain",
    serverlys: (
      <>
        A .com is {comRegister} to register and {comRenew} a year to renew, or bring the one you have
      </>
    ),
    squarespace: <>One year free on annual plans, then renewing at Squarespace&rsquo;s standard rate; you can also connect a domain you own</>,
  },
  {
    label: "Selling online",
    serverlys: (
      <>
        <Link href="/ecommerce-hosting" className="underline underline-offset-2 hover:text-primary">
          WooCommerce hosting
        </Link>{" "}
        for a store you own
      </>
    ),
    squarespace: <>Built in. Online store transaction fee: {SQ.map((p) => `${p.name} ${p.storeFee}`).join(", ")}, plus card processing</>,
  },
  {
    label: "Taking the site elsewhere",
    serverlys: <>Possible. It is a standard WordPress site, and your files and database are yours to take.</>,
    squarespace: <>Partly. An .xml export for WordPress covers layout pages and one blog, but not {SQ_NOT_EXPORTED}.</>,
  },
  {
    label: "Billing and cancelling",
    serverlys: <>Hosting is billed month to month, with a 30-day money-back guarantee</>,
    squarespace: <>Monthly or annual; cancel any time, and service runs to the end of the period paid for</>,
  },
  {
    label: "After launch",
    serverlys: (
      <>
        Optional site management from {formatCarePrice(careFromPrice)}/mo, and ConvoAI website chat with every hosting plan
      </>
    ),
    squarespace: <>Self-serve: marketing, SEO and analytics tools, more of them on higher plans</>,
  },
];

const SQUARESPACE_STRENGTHS = [
  {
    title: "You want to design it yourself",
    body: "Squarespace is built around its templates and editor, with AI tools on every plan. If making the site yourself is the point, it is the better tool for that, and we design sites for you instead.",
  },
  {
    title: "You want a small monthly bill",
    body: `On ${SOURCE_LABEL} Squarespace Basic was $${sqBasic.monthly}/mo billed monthly, or $${sqBasic.annual}/mo on an annual plan, with hosting included. A custom design from us starts at ${designFrom} before hosting.`,
  },
  {
    title: "You want to try it free",
    body: `Every Squarespace site starts with a ${SQ_TRIAL_DAYS}-day free trial, and you can cancel any plan at any time. Our hosting has a 30-day money-back guarantee, but no free trial.`,
  },
  {
    title: "You sell products, memberships or courses",
    body: "Selling products and services, invoicing and paid content are part of the plans, with 0% online-store transaction fees from Core up. A WordPress store can do the same with WooCommerce, but on Squarespace it is already there.",
  },
  {
    title: "You want email set up with the site",
    body: "Core and the plans above it include one Google Workspace account free for the first year when you register or connect a domain. Ours is a separate business email plan.",
  },
] as const;

const STEPS = [
  {
    title: "Pick how you want to pay",
    body: (
      <>
        A one-time{" "}
        <Link href="/website-design" className="font-semibold text-primary hover:text-primary-hover">
          website design
        </Link>{" "}
        project from {designFrom} plus{" "}
        <Link href="/wordpress-hosting" className="font-semibold text-primary hover:text-primary-hover">
          WordPress hosting
        </Link>
        {growth ? (
          <>
            , or one monthly fee on the{" "}
            <Link href="/business-solutions" className="font-semibold text-primary hover:text-primary-hover">
              {growth.name}
            </Link>{" "}
            ({growthPrice}/mo, site built for you)
          </>
        ) : null}
        .
      </>
    ),
  },
  {
    title: "Export what Squarespace can export",
    body: <>Squarespace can save layout pages and one blog as an .xml file for WordPress. Send it to us with your Squarespace address, and we use it alongside your current pages as the brief for the new design. Anything the export leaves out, such as store pages and styles, is rebuilt in the design.</>,
  },
  {
    title: "Review the new site before it goes live",
    body: <>The scope is agreed in writing before work starts, and your Squarespace site stays online the whole time. When you are happy with the new one, we launch it.</>,
  },
  {
    title: "Point or move the domain",
    body: (
      <>
        If the domain is registered elsewhere, it only needs to point at Serverlys. To move it here, unlock it,
        get its authorisation code and start a{" "}
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
    title: "Cancel Squarespace last",
    body: <>Once the new site, email and domain are working, cancel the plan. Squarespace says service continues to the end of the period you have paid for.</>,
  },
] as const;

const FAQS: readonly Faq[] = [
  {
    question: "What is the best Squarespace alternative?",
    answer: `It depends on who you want to build the site. If you want to design it yourself, Squarespace, or another builder, is the right kind of tool. If you would rather have it designed for you and own a standard WordPress site, Serverlys designs sites from ${designFrom}, one time, and hosts them from ${starterRate}/mo, renewing at ${starterRenewal}/mo.`,
    scopes: [PATH],
  },
  {
    question: "Can I move my Squarespace site to WordPress?",
    answer: `Partly. Squarespace's own help article says it can export an .xml file for WordPress with layout pages, one blog and text and image blocks, but not ${SQ_NOT_EXPORTED}. We use that export and your current pages as the brief, and design the rest of the new site around them.`,
    scopes: [PATH],
  },
  {
    question: "Is Squarespace cheaper than Serverlys?",
    answer: `To start, yes. On ${SOURCE_LABEL} Squarespace plans ran from $${sqBasic.monthly}/mo billed monthly, or $${sqBasic.annual}/mo on an annual plan, with hosting included. A Serverlys design starts at ${designFrom} once, plus hosting from ${starterRate}/mo.${growth ? ` Our ${growth.name} is ${growthPrice}/mo with the site built for you.` : ""} You are paying for the design work, not for the hosting.`,
    scopes: [PATH],
  },
  {
    question: "Will I be able to edit a site you build?",
    answer:
      "Yes. Every site we design is built on WordPress, so you can change text, swap photos and publish blog posts yourself. The web style guide keeps anything you add consistent with the rest of the site. If you would rather not, site management covers the updates and small changes.",
    scopes: [PATH],
  },
  {
    question: "Is Squarespace a bad choice for a business website?",
    answer:
      "No. Squarespace includes managed hosting, templates, commerce and invoicing in one plan, and you can cancel any time. The trade-off is that you build the site yourself and only part of it exports. We differ on who does the design and on what you own at the end, not on whether Squarespace is legitimate.",
    scopes: [PATH],
  },
];

const linkCls = "underline underline-offset-2 hover:text-fg";

export default function SquarespaceAlternativePage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />

      {/* Hero: the answer first, then the two ways of getting a site. */}
      <section className="relative isolate overflow-hidden bg-canvas">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]" />
        <Container width="wide" className="pb-16 pt-10 sm:pb-20 lg:pb-24 lg:pt-14">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <Pill>Squarespace alternative</Pill>
              <h1 className="display-lg mt-5 text-fg">A Squarespace alternative where the site is designed for you</h1>
              <p className="mt-5 max-w-xl text-body-lg text-fg-secondary">
                Squarespace is a builder: you design the site from its templates, and it runs on Squarespace.
                Serverlys is the other route. We design your site on WordPress from {designFrom}, one time, host it
                from {starterRate}/mo, and the whole site is yours.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="#sqx-table-heading" size="lg">See the comparison</Button>
                <Button href="/website-design" variant="outline" size="lg">See website design</Button>
              </div>
            </div>
            <Stage>
              <div className="rounded-2xl bg-white p-5 sm:p-6">
                <p className="text-small font-semibold text-fg">Two ways to get a business website</p>
                <p className="mt-1 text-micro text-fg-muted">Squarespace figures as of {SOURCE_DATE}</p>
                <dl className="mt-5 flex flex-col gap-3">
                  <div className="rounded-xl bg-brand-50 p-4 ring-2 ring-primary">
                    <dt className="flex items-center justify-between gap-3 text-small font-semibold text-fg">
                      Serverlys design + hosting <Pill>Done for you</Pill>
                    </dt>
                    <dd className="mt-2 text-micro text-fg-secondary">
                      <span className="block text-body-lg font-semibold text-fg">From {designFrom} once</span>
                      Hosting from {starterRate}/mo, renews at {starterRenewal}/mo.
                      {growth ? ` Or ${growthPrice}/mo with the site built for you (${growth.name}).` : ""}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-canvas-secondary p-4">
                    <dt className="flex items-center justify-between gap-3 text-small font-semibold text-fg">
                      Squarespace {sqBasic.name} <Pill tone="neutral">You build it</Pill>
                    </dt>
                    <dd className="mt-2 text-micro text-fg-secondary">
                      <span className="block text-body-lg font-semibold text-fg">${sqBasic.monthly}/mo billed monthly</span>
                      ${sqBasic.annual}/mo on an annual plan. Hosting included; {sqBasic.storeFee} online-store
                      transaction fee. {SQ_TRIAL_DAYS}-day free trial.
                    </dd>
                  </div>
                </dl>
              </div>
            </Stage>
          </div>
        </Container>
      </section>

      {/* The comparison. */}
      <Band tone="subtle" labelledBy="sqx-table-heading">
        <Heading
          id="sqx-table-heading"
          title="Serverlys vs Squarespace, side by side"
          lede="Not hosting plan against hosting plan: a designed site you own, against a builder you run yourself. Squarespace's figures are read off its own pages on the date shown."
        />
        <div className="mt-12 overflow-x-auto rounded-3xl bg-canvas ring-1 ring-line">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">
              Serverlys and Squarespace compared on who builds the site, cost, hosting, domain, selling online, exporting, billing and what happens after launch
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-6 py-5">
                  <span className="sr-only">Compared on</span>
                </th>
                <th scope="col" className="bg-brand-50 px-6 py-5 text-body-lg font-semibold text-fg">Serverlys</th>
                <th scope="col" className="px-6 py-5 text-body-lg font-semibold text-fg">
                  Squarespace
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
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.squarespace}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-6 max-w-[760px] text-center text-micro text-fg-muted">
          Squarespace figures as of {SOURCE_DATE}, from{" "}
          <a href={SQ_PRICING} rel="nofollow noopener" className={linkCls}>squarespace.com/pricing</a> and its help
          article{" "}
          <a href={SQ_EXPORT} rel="nofollow noopener" className={linkCls}>on exporting a site</a>. Prices are in USD
          and change often; check their site before you decide. Serverlys prices are the ones on our{" "}
          <Link href="/website-design" className={linkCls}>website design</Link>,{" "}
          <Link href="/pricing" className={linkCls}>pricing</Link> and{" "}
          <Link href="/tld" className={linkCls}>domain extensions</Link> pages.
        </p>
      </Band>

      {/* How to read the numbers. */}
      <Band labelledBy="sqx-read-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="sqx-read-heading" align="left" title="You are comparing labour, not hosting" />
            <p className="mt-5 max-w-[60ch] text-body text-fg-secondary">
              A Squarespace plan includes the hosting and the tools, and you do the design work: picking a
              template, writing the pages, styling every section. Basic at {`$${sqBasic.monthly}/mo, or $${sqBasic.annual}/mo`}{" "}
              on an annual plan, pays for the platform; your time pays for the site.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              A Serverlys design is a one-time fee for that work, done by designers and agreed in a written scope.
              After that you pay for hosting, from {starterRate}/mo with the renewal rate of {starterRenewal}/mo
              printed beside it.
              {growth ? ` If you would rather spread it out, the ${growth.name} is ${growthPrice}/mo with a site of up to ${growth.pages} pages built for you.` : ""}
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              The other difference is what you hold at the end. Squarespace exports part of a site for WordPress.
              A WordPress site is standard software: all of its files and database can run with us or with any
              host that supports WordPress.
            </p>
          </div>
          <ul className="grid content-start gap-4 sm:grid-cols-2">
            {designPlans.map((plan) => (
              <li key={plan.id} className="rounded-2xl bg-canvas-secondary p-6">
                <span className="text-body-lg font-semibold text-fg">Design {plan.name}</span>
                <p className="mt-3 text-small text-fg-secondary">
                  <span className="block text-body-lg font-semibold text-fg">From {formatDesignPrice(plan.price)}</span>
                  One time. Custom homepage and {plan.subpages} subpages.
                </p>
              </li>
            ))}
            {growth ? (
              <li className="rounded-2xl bg-canvas-secondary p-6">
                <span className="text-body-lg font-semibold text-fg">{growth.name}</span>
                <p className="mt-3 text-small text-fg-secondary">
                  <span className="block text-body-lg font-semibold text-fg">{growthPrice}/mo</span>
                  Site of up to {growth.pages} pages built for you, hosting included.
                </p>
              </li>
            ) : null}
          </ul>
        </div>
      </Band>

      {/* Where Squarespace wins. */}
      <Band tone="subtle" labelledBy="sqx-better-heading">
        <Heading
          id="sqx-better-heading"
          title="When Squarespace is the better choice"
          lede="A comparison that never loses is advertising. These are the cases where we would point you to a builder."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SQUARESPACE_STRENGTHS.map((item) => (
            <li key={item.title} className="rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <h3 className="text-body-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-small text-fg-secondary">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-micro text-fg-muted">
          Plans, trial, commerce, fees and Google Workspace offer:{" "}
          <a href={SQ_PRICING} rel="nofollow noopener" className={linkCls}>squarespace.com/pricing</a>, as of{" "}
          {SOURCE_DATE}.
        </p>
      </Band>

      {/* Where Serverlys differs. */}
      <Band tone="dark" labelledBy="sqx-differ-heading">
        <Heading
          id="sqx-differ-heading"
          dark
          title="Where Serverlys is different"
          lede="We do the design, host the result and keep looking after it, if you want us to."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Designed, not assembled", `A custom homepage, a web style guide and an SEO-friendly blog, from ${designFrom} one time.`, "/website-design", "Website design"],
              ["Yours to keep", "A standard WordPress site. All of its files and database are yours, wherever you host it.", "/wordpress-hosting", "WordPress hosting"],
              ["Renewal printed", "Hosting is a monthly rate with the renewal rate beside it, before checkout.", "/pricing", "See prices and renewals"],
              ["One .com price", `A .com is ${comRegister} to register and ${comRenew} to renew, with WHOIS privacy free where the registry allows.`, "/tld/com", "The .com page"],
              ["Care after launch", `Updates, backups, monitoring and content changes from ${formatCarePrice(careFromPrice)}/mo, if you would rather not do them.`, "/site-management", "Site management"],
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
          Comparing builders? Read our{" "}
          <Link href="/wix-alternative" className="font-semibold text-white underline-offset-4 hover:underline">
            Wix alternative
          </Link>{" "}
          page, or see every comparison on the{" "}
          <Link href="/hosting-alternatives" className="font-semibold text-white underline-offset-4 hover:underline">
            hosting comparison
          </Link>{" "}
          page.
        </p>
      </Band>

      {/* Switching. */}
      <Band labelledBy="sqx-switch-heading">
        <Heading
          id="sqx-switch-heading"
          title="How to move from Squarespace"
          lede="Only part of a Squarespace site exports, so moving means a new design. We do it; you approve it."
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
          <Button href="/website-design">See the design plans</Button>
          <Button href={billing.sales} variant="outline">
            Ask us about your site
          </Button>
        </div>
      </Band>

      <FaqSection items={FAQS} />
      <FinalCta plansHref="/website-design" />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
