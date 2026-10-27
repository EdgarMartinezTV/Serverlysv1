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

const PATH = "/wix-alternative";

export const metadata = pageMetadata({
  title: "Wix Alternative: A Site Designed for You, on WordPress",
  description:
    "A fair Wix alternative: instead of building it yourself, Serverlys designs your site on WordPress and hosts it, with renewal rates shown. Dated, sourced figures.",
  path: PATH,
});

/**
 * /wix-alternative — commercial-investigation page for "wix alternative(s)".
 * Built on the /godaddy-alternative rules, with one difference of framing:
 * Wix is a website BUILDER, not a host. The honest comparison is not hosting
 * plan against hosting plan, it is "build it yourself on a platform" against
 * "a designed site on WordPress hosting that you own". The page says so.
 *
 *   1. Every Wix figure was read off wix.com on SOURCE_DATE and is printed
 *      with that date and its URL. wix.com localises prices by visitor, so the
 *      plans page was read in a browser with a US locale; it showed USD and
 *      the note "Displayed prices are for yearly subscriptions, paid in full
 *      at the time of purchase." Monthly-billing prices were not shown, so none
 *      are printed. A figure we could not read there is left out, not
 *      estimated. Re-verify before changing a number, and change SOURCE_DATE
 *      in the same edit.
 *   2. Wix wins rows on this page, and the page says so: a free plan, a much
 *      lower cost to start, building and editing it yourself, built-in
 *      business apps, and a free first-year domain voucher.
 *   3. Serverlys figures come from data/pricing.ts, data/design-plans.ts,
 *      data/business-plans.ts, data/care-plans.ts and data/tld-catalog.ts and
 *      are never typed here. Design prices are one-time STARTING prices,
 *      scoped in writing; hosting is a plain MONTHLY rate.
 *   4. The "cannot move to another host" row quotes Wix's own help article.
 *   5. No Wix logo, colours or wordmark. No ratings, reviews or scores.
 */

const SOURCE_DATE = "2026-10-26";
const SOURCE_LABEL = "26 October 2026";
const WIX_PLANS = "https://www.wix.com/plans";
const WIX_EXPORT = "https://support.wix.com/en/article/exporting-or-embedding-your-wix-site-elsewhere";

/**
 * Read off wix.com/plans on SOURCE_DATE (US locale, USD). Each card read e.g.
 * "Light … $17/mo … Free domain for 1 year · 2 GB storage space". Below the
 * cards: "Displayed prices are for yearly subscriptions, paid in full at the
 * time of purchase. … Prices do not include applicable taxes".
 */
const WIX = [
  { name: "Light", price: 17, storage: "2 GB" },
  { name: "Core", price: 29, storage: "50 GB" },
  { name: "Business", price: 39, storage: "100 GB" },
  { name: "Business Elite", price: 159, storage: "Unlimited" },
] as const;
const WIX_REFUND_DAYS = 14;

/** Quoted from WIX_EXPORT on SOURCE_DATE. */
const WIX_EXPORT_QUOTE = "Since Wix is a SaaS solution, your site must run on Wix's servers.";

const wpHosting = groupById("wordpress");
const PLANS = wpHosting?.plans ?? [];
const starter = PLANS[0];
const com = tldBySlug("com");
const growth = businessPlans.find((p) => p.id === "growth");

const wholeDollars = (n: number) => `$${n.toLocaleString("en-US")}`;
const starterRate = starter ? formatPrice(starter.monthly) : "";
const starterRenewal = starter ? formatPrice(starter.standard) : "";
const comRegister = com ? formatPrice(com.register) : "";
const comRenew = com ? formatPrice(com.renew) : "";
const designFrom = formatDesignPrice(designFromPrice);
const growthPrice = growth ? formatBusinessPrice(growth.price) : "";
const wixLight = WIX[0];

const ROWS: ReadonlyArray<{ label: string; serverlys: React.ReactNode; wix: React.ReactNode }> = [
  {
    label: "Who builds the site",
    serverlys: <>Our designers: a custom homepage, your subpages, a web style guide and analytics, built on WordPress</>,
    wix: <>You, with a drag-and-drop editor, an AI website builder and 2,000+ templates; Wix also lists professionals you can hire</>,
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
    wix: (
      <>
        A free plan, or Premium at {WIX.map((p) => wholeDollars(p.price)).join(" / ")} per month (
        {WIX.map((p) => p.name).join(" / ")}), for yearly subscriptions paid in full; taxes extra
      </>
    ),
  },
  {
    label: "Your own domain",
    serverlys: (
      <>
        A .com is {comRegister} to register and {comRenew} a year to renew, or bring the one you have
      </>
    ),
    wix: <>Needs a Premium plan. Most yearly Premium plans include a voucher for one free year on a new domain bought from Wix.</>,
  },
  {
    label: "Storage",
    serverlys: <>{starter?.specs.storage} on every hosting plan</>,
    wix: <>{WIX.map((p) => `${p.name}: ${p.storage}`).join("; ")}</>,
  },
  {
    label: "Editing it yourself",
    serverlys: <>Yes. It is WordPress: change text, swap photos and publish posts yourself, or have us do it.</>,
    wix: <>Yes, in the Wix editor</>,
  },
  {
    label: "Moving to another host later",
    serverlys: <>Possible. It is a standard WordPress site, and your files and database are yours to take.</>,
    wix: <>Not possible. Wix&rsquo;s help centre: &ldquo;{WIX_EXPORT_QUOTE}&rdquo;</>,
  },
  {
    label: "Money-back guarantee",
    serverlys: <>30 days on hosting</>,
    wix: <>{WIX_REFUND_DAYS} days, on the first upgrade to a Premium plan</>,
  },
  {
    label: "Support",
    serverlys: <>24/7 support. One queue and one team on every plan.</>,
    wix: <>24/7 customer care on every plan</>,
  },
  {
    label: "After launch",
    serverlys: (
      <>
        Optional site management from {formatCarePrice(careFromPrice)}/mo, and ConvoAI website chat with every hosting plan
      </>
    ),
    wix: <>Self-serve: built-in marketing, SEO and business tools, more of them on higher plans</>,
  },
];

const WIX_STRENGTHS = [
  {
    title: "You want to build it yourself",
    body: "Wix is made for it: a drag-and-drop editor, an AI website builder and thousands of templates. We design sites for you; if doing it yourself is the point, Wix is the better tool.",
  },
  {
    title: "You want to start for nothing",
    body: "Wix has a free plan, with Premium needed for your own domain and to remove Wix branding. We have no free plan, and a designed site has a one-time fee.",
  },
  {
    title: "The budget is a few hundred a year",
    body: `On ${SOURCE_LABEL} Wix Light was ${wholeDollars(wixLight.price)}/mo on a yearly subscription paid in full. A custom design from us starts at ${designFrom} before hosting. If that is out of reach today, a builder is the sensible start.`,
  },
  {
    title: "You need bookings, events or a restaurant menu today",
    body: "Wix lists built-in apps for scheduling, ticketed events, restaurant orders, hotel reservations and online courses. A WordPress site can do these with plugins, but on Wix they are part of the plan.",
  },
  {
    title: "You change the site every day",
    body: "If you edit constantly and want every change live the moment you make it, without asking anyone, a builder you control suits that way of working.",
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
    title: "Send us your content and your Wix address",
    body: <>A Wix site cannot be exported to another host, so there are no files to migrate. We design the new site on WordPress, using your current pages, text and photos as the brief, and agree the scope in writing before work starts.</>,
  },
  {
    title: "Review the new site before it goes live",
    body: <>Your Wix site stays online the whole time. When you are happy with the new one, we launch it.</>,
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
    title: "Cancel the Wix plan last",
    body: <>Once the new site, email and domain are working, cancel the Premium plan. If you are still inside Wix&rsquo;s refund window, check its terms first.</>,
  },
] as const;

const FAQS: readonly Faq[] = [
  {
    question: "What is the best Wix alternative?",
    answer: `It depends on who you want to build the site. If you want to build and edit it yourself, Wix, or another builder, is the right kind of tool. If you would rather have it designed for you and own a standard WordPress site, Serverlys designs sites from ${designFrom}, one time, and hosts them from ${starterRate}/mo, renewing at ${starterRenewal}/mo.`,
    scopes: [PATH],
  },
  {
    question: "Can I move my Wix site to Serverlys?",
    answer: `Not as files. Wix's own help centre says a Wix site must run on Wix's servers and cannot be hosted elsewhere. What moves is your content: we design a new WordPress site using your pages, text and photos as the brief, and launch it when you approve. Your domain can be pointed at it or transferred.`,
    scopes: [PATH],
  },
  {
    question: "Is Wix cheaper than Serverlys?",
    answer: `To start, yes. On ${SOURCE_LABEL} Wix had a free plan, and Premium started at ${wholeDollars(wixLight.price)}/mo on a yearly subscription paid in full. A Serverlys design starts at ${designFrom} once, plus hosting from ${starterRate}/mo.${growth ? ` Our ${growth.name} is ${growthPrice}/mo with the site built for you.` : ""} You are paying for the design work, not for the hosting.`,
    scopes: [PATH],
  },
  {
    question: "Will I be able to edit a site you build?",
    answer:
      "Yes. Every site we design is built on WordPress, so you can change text, swap photos and publish blog posts yourself. The web style guide keeps anything you add consistent with the rest of the site. If you would rather not, site management covers the updates and small changes.",
    scopes: [PATH],
  },
  {
    question: "Is Wix a bad choice for a business website?",
    answer:
      "No. Wix gives you hosting, templates, 24/7 customer care and built-in business tools in one plan, and plenty of businesses run well on it. The trade-off is that the site lives on Wix and you build it yourself. We differ on who does the design and on what you own at the end, not on whether Wix is legitimate.",
    scopes: [PATH],
  },
];

const linkCls = "underline underline-offset-2 hover:text-fg";

export default function WixAlternativePage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />

      {/* Hero: the answer first, then the two ways of getting a site. */}
      <section className="relative isolate overflow-hidden bg-canvas">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]" />
        <Container width="wide" className="pb-16 pt-10 sm:pb-20 lg:pb-24 lg:pt-14">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <Pill>Wix alternative</Pill>
              <h1 className="display-lg mt-5 text-fg">A Wix alternative where the site is designed for you</h1>
              <p className="mt-5 max-w-xl text-body-lg text-fg-secondary">
                Wix is a builder: you make the site, and it runs on Wix. Serverlys is the other route. We design
                your site on WordPress from {designFrom}, one time, host it from {starterRate}/mo, and the site is
                yours to keep or move.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="#wx-table-heading" size="lg">See the comparison</Button>
                <Button href="/website-design" variant="outline" size="lg">See website design</Button>
              </div>
            </div>
            <Stage>
              <div className="rounded-2xl bg-white p-5 sm:p-6">
                <p className="text-small font-semibold text-fg">Two ways to get a business website</p>
                <p className="mt-1 text-micro text-fg-muted">Wix figures as of {SOURCE_DATE}</p>
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
                      Wix {wixLight.name} <Pill tone="neutral">You build it</Pill>
                    </dt>
                    <dd className="mt-2 text-micro text-fg-secondary">
                      <span className="block text-body-lg font-semibold text-fg">{wholeDollars(wixLight.price)}/mo</span>
                      Yearly subscription, paid in full; taxes extra. {wixLight.storage} storage. A free plan exists,
                      with Premium needed for your own domain.
                    </dd>
                  </div>
                </dl>
              </div>
            </Stage>
          </div>
        </Container>
      </section>

      {/* The comparison. */}
      <Band tone="subtle" labelledBy="wx-table-heading">
        <Heading
          id="wx-table-heading"
          title="Serverlys vs Wix, side by side"
          lede="Not hosting plan against hosting plan: a designed site you own, against a builder you run yourself. Wix's figures are read off its own pages on the date shown."
        />
        <div className="mt-12 overflow-x-auto rounded-3xl bg-canvas ring-1 ring-line">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">
              Serverlys and Wix compared on who builds the site, cost, domain, storage, editing, moving hosts, refunds, support and what happens after launch
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-6 py-5">
                  <span className="sr-only">Compared on</span>
                </th>
                <th scope="col" className="bg-brand-50 px-6 py-5 text-body-lg font-semibold text-fg">Serverlys</th>
                <th scope="col" className="px-6 py-5 text-body-lg font-semibold text-fg">
                  Wix
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
                  <td className="px-6 py-4 align-top text-small text-fg-secondary">{row.wix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-6 max-w-[760px] text-center text-micro text-fg-muted">
          Wix figures as of {SOURCE_DATE}, from{" "}
          <a href={WIX_PLANS} rel="nofollow noopener" className={linkCls}>wix.com/plans</a> (US prices in USD; Wix
          says prices and currency vary by location) and its help article{" "}
          <a href={WIX_EXPORT} rel="nofollow noopener" className={linkCls}>on exporting a Wix site</a>. Check their
          site before you decide. Serverlys prices are the ones on our{" "}
          <Link href="/website-design" className={linkCls}>website design</Link>,{" "}
          <Link href="/pricing" className={linkCls}>pricing</Link> and{" "}
          <Link href="/tld" className={linkCls}>domain extensions</Link> pages.
        </p>
      </Band>

      {/* How to read the numbers. */}
      <Band labelledBy="wx-read-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="wx-read-heading" align="left" title="You are comparing labour, not hosting" />
            <p className="mt-5 max-w-[60ch] text-body text-fg-secondary">
              A Wix plan is cheap because you do the work: choosing a template, writing the pages, arranging
              every block. {wholeDollars(wixLight.price)}/mo pays for the platform and hosting; your time pays for
              the site.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              A Serverlys design is a one-time fee for that work, done by designers and agreed in a written scope.
              After that you pay for hosting, from {starterRate}/mo with the renewal rate of {starterRenewal}/mo
              printed beside it.
              {growth ? ` If you would rather spread it out, the ${growth.name} is ${growthPrice}/mo with a site of up to ${growth.pages} pages built for you.` : ""}
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              The other difference is what you hold at the end. Wix says a Wix site must run on Wix&rsquo;s
              servers. A WordPress site is standard software: its files and database can run with us or with any
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

      {/* Where Wix wins. */}
      <Band tone="subtle" labelledBy="wx-better-heading">
        <Heading
          id="wx-better-heading"
          title="When Wix is the better choice"
          lede="A comparison that never loses is advertising. These are the cases where we would point you to a builder."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {WIX_STRENGTHS.map((item) => (
            <li key={item.title} className="rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <h3 className="text-body-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-small text-fg-secondary">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-micro text-fg-muted">
          Plans, free plan, editor, templates and business apps:{" "}
          <a href={WIX_PLANS} rel="nofollow noopener" className={linkCls}>wix.com/plans</a>, as of {SOURCE_DATE}.
        </p>
      </Band>

      {/* Where Serverlys differs. */}
      <Band tone="dark" labelledBy="wx-differ-heading">
        <Heading
          id="wx-differ-heading"
          dark
          title="Where Serverlys is different"
          lede="We do the design, host the result and keep looking after it, if you want us to."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Designed, not assembled", `A custom homepage, a web style guide and an SEO-friendly blog, from ${designFrom} one time.`, "/website-design", "Website design"],
              ["Yours to keep", "A standard WordPress site. Its files and database are yours, wherever you host it.", "/wordpress-hosting", "WordPress hosting"],
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
          <Link href="/squarespace-alternative" className="font-semibold text-white underline-offset-4 hover:underline">
            Squarespace alternative
          </Link>{" "}
          page, or see every comparison on the{" "}
          <Link href="/hosting-alternatives" className="font-semibold text-white underline-offset-4 hover:underline">
            hosting comparison
          </Link>{" "}
          page.
        </p>
      </Band>

      {/* Switching. */}
      <Band labelledBy="wx-switch-heading">
        <Heading
          id="wx-switch-heading"
          title="How to move from Wix"
          lede="A Wix site cannot be exported, so moving means a new site. We design it; you approve it."
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
