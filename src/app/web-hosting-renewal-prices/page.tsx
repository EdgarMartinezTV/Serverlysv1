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
import { breadcrumbTrail } from "@/data/routes";
import {
  BLACK_FRIDAY,
  blackFridayActive,
  formatPrice,
  groupById,
  quote,
  TERMS,
  type Plan,
  type TermKey,
} from "@/data/pricing";
import {
  BLUEHOST,
  BLUEHOST_SHARED,
  BLUEHOST_TERM,
  COMPETITOR_SOURCE_DATE,
  COMPETITOR_SOURCE_LABEL,
  GD_HOSTING,
  GD_HOSTING_TERM,
  GD_WEB,
  HOSTINGER,
  HOSTINGER_WEB,
  NC_HOSTING,
  NC_RENEWAL_NOTE,
  NC_SHARED,
  SG_HOSTING,
  SG_TERM_MONTHS,
  SG_WEB,
} from "@/data/competitor-pricing";

const PATH = "/web-hosting-renewal-prices";

export const metadata = pageMetadata({
  title: "Web Hosting Renewal Prices Compared: Intro vs Renewal",
  description:
    "Web hosting renewal prices side by side: the advertised price, the term it needs and what the plan renews at, for Serverlys and five big hosts. Dated figures.",
  path: PATH,
});

/**
 * /web-hosting-renewal-prices — the flagship explanation of what Serverlys
 * sells on: the renewal price shown before you buy (2026-10-31, from Search
 * Console: "web hosting renewal prices" pos 16.7, "hosting pricing" 15.8,
 * "managed hosting pricing" 22, plus "web hosting cost/prices/fees").
 *
 * Rules, same as the /*-alternative pages:
 *   1. Competitor figures come ONLY from data/competitor-pricing.ts, read off
 *      their own pages on COMPETITOR_SOURCE_DATE and printed with that date and
 *      the source URL. A figure they did not print (GoDaddy's and Namecheap's
 *      renewal rates) is reported as not printed, never estimated.
 *   2. Serverlys figures come from data/pricing.ts (quote(), TERMS) and are
 *      never typed here. WHMCS renews every term at that term's own price.
 *   3. Black Friday (WHMCS code BLACKFRIDAY) is shown SEPARATELY as a
 *      first-payment discount, never mixed into the renewal comparison.
 *   4. Competitors win rows here and the page says so. No ratings or scores.
 */

const PLANS: readonly Plan[] = groupById("cloud")?.plans ?? [];
const STARTER = PLANS[0];
const BF_ON = blackFridayActive();
const PCT = `${Math.round(BLACK_FRIDAY.pct * 100)}%`;

const jump = (from: number, to: number) => `+${Math.round(((to - from) / from) * 100)}%`;
const money = (n: number) => formatPrice(Math.round(n * 100) / 100);

const sMonthly = STARTER ? quote(STARTER, "monthly") : null;
const s36 = STARTER ? quote(STARTER, "triennially") : null;

/** One row per host: the entry plan's advertised price, what it requires, and what it renews at. */
type Row = {
  host: string;
  plan: string;
  advertised: string;
  needs: string;
  renews: string;
  change: string;
  ours?: boolean;
};

const ROWS: readonly Row[] = [
  ...(STARTER && sMonthly && s36
    ? [
        {
          host: "Serverlys",
          plan: `${STARTER.name}, monthly`,
          advertised: `${formatPrice(sMonthly.total)}/mo${sMonthly.setup ? ` + ${formatPrice(sMonthly.setup)} one-off setup` : ""}`,
          needs: "Nothing: month to month",
          renews: `${formatPrice(sMonthly.total)}/mo`,
          change: "No change",
          ours: true,
        },
        {
          host: "Serverlys",
          plan: `${STARTER.name}, 36 months`,
          advertised: `${formatPrice(s36.perMonth)}/mo`,
          needs: `36 months paid upfront: ${formatPrice(s36.total)}`,
          renews: `${formatPrice(s36.total)} per 36 months (same price)`,
          change: "No change",
          ours: true,
        },
      ]
    : []),
  {
    host: "Hostinger",
    plan: HOSTINGER[0].name,
    advertised: `${formatPrice(HOSTINGER[0].intro)}/mo`,
    needs: `${HOSTINGER[0].months} months paid upfront: ${formatPrice(HOSTINGER[0].upfront)}`,
    renews: `${formatPrice(HOSTINGER[0].renews)}/mo`,
    change: jump(HOSTINGER[0].intro, HOSTINGER[0].renews),
  },
  {
    host: "Bluehost",
    plan: BLUEHOST[0].name,
    advertised: `${formatPrice(BLUEHOST[0].intro)}/mo`,
    needs: `A ${BLUEHOST_TERM}`,
    renews: `${formatPrice(BLUEHOST[0].renews)}/mo`,
    change: jump(BLUEHOST[0].intro, BLUEHOST[0].renews),
  },
  {
    host: "SiteGround",
    plan: SG_HOSTING[0].name,
    advertised: `${formatPrice(SG_HOSTING[0].intro)}/mo`,
    needs: `${SG_TERM_MONTHS} months prepaid`,
    renews: `${formatPrice(SG_HOSTING[0].renews)}/mo`,
    change: jump(SG_HOSTING[0].intro, SG_HOSTING[0].renews),
  },
  {
    host: "GoDaddy",
    plan: GD_HOSTING[0].name,
    advertised: `${formatPrice(GD_HOSTING[0].price)}/mo`,
    needs: `The ${GD_HOSTING_TERM}`,
    renews: "Not printed on the plan card",
    change: "Not stated",
  },
  {
    host: "Namecheap",
    plan: NC_HOSTING[0].name,
    advertised: `${formatPrice(NC_HOSTING[0].yearly)}/mo billed yearly, ${formatPrice(NC_HOSTING[0].monthly)}/mo billed monthly`,
    needs: "Annual billing for the lower price",
    renews: "Not printed; the discount does not apply to renewals",
    change: "Not stated",
  },
];

/** What a plan costs over 1 and 3 years on each Serverlys term, setup fee included, at regular prices. */
function costOver(plan: Plan, key: TermKey, years: 1 | 3): number {
  const q = quote(plan, key);
  const months = years * 12;
  const terms = Math.ceil(months / q.months);
  return q.setup + q.total * terms;
}

/** Competitor 3-year cost from their printed figures only, with the arithmetic shown. */
const COMPETITOR_3Y: ReadonlyArray<{ label: string; total: number; how: string }> = [
  {
    label: `Hostinger ${HOSTINGER[0].name}`,
    total: HOSTINGER[0].upfront,
    how: `${formatPrice(HOSTINGER[0].upfront)} upfront covers ${HOSTINGER[0].months} months, so 3 years is already paid for`,
  },
  {
    label: `Bluehost ${BLUEHOST[0].name}`,
    total: BLUEHOST[0].intro * 36,
    how: `${formatPrice(BLUEHOST[0].intro)}/mo × 36 months on the ${BLUEHOST_TERM}`,
  },
  {
    label: `SiteGround ${SG_HOSTING[0].name}`,
    total: SG_HOSTING[0].intro * SG_TERM_MONTHS + SG_HOSTING[0].renews * (36 - SG_TERM_MONTHS),
    how: `${formatPrice(SG_HOSTING[0].intro)}/mo × ${SG_TERM_MONTHS} months, then ${formatPrice(SG_HOSTING[0].renews)}/mo × ${36 - SG_TERM_MONTHS} months at the printed renewal rate`,
  },
];

const FAQS: readonly Faq[] = [
  {
    question: "What is a web hosting renewal price?",
    answer:
      "It is what you pay after your first billing term ends. Most hosts advertise a lower introductory price that applies only to the first term, and print the higher renewal price in smaller type on the plan card or in the checkout.",
    scopes: [PATH],
  },
  {
    question: "Why do hosting prices go up at renewal?",
    answer: `Introductory prices are a discount for signing up, usually tied to prepaying a long term. When the term ends, the plan moves to its regular price. On ${COMPETITOR_SOURCE_LABEL}, Hostinger's ${HOSTINGER[0].name} plan went from ${formatPrice(HOSTINGER[0].intro)}/mo to ${formatPrice(HOSTINGER[0].renews)}/mo and Bluehost's ${BLUEHOST[0].name} from ${formatPrice(BLUEHOST[0].intro)}/mo to ${formatPrice(BLUEHOST[0].renews)}/mo.`,
    scopes: [PATH],
  },
  {
    question: "Does Serverlys hosting go up at renewal?",
    answer: `No. Every Serverlys plan renews at the same price for the term you chose: ${STARTER && sMonthly ? `${STARTER.name} is ${formatPrice(sMonthly.total)}/mo on the monthly term and renews at ${formatPrice(sMonthly.total)}/mo` : "the monthly term renews at the monthly price"}, and 12, 24 or 36-month terms renew at that term's price.${BF_ON ? ` During Black Friday (until ${BLACK_FRIDAY.endsLabel}) your first payment is ${PCT} off; renewals are at the regular price.` : ""}`,
    scopes: [PATH],
  },
  {
    question: "How much does web hosting cost per year?",
    answer: STARTER
      ? `With Serverlys, ${STARTER.name} costs ${money(costOver(STARTER, "monthly", 1))} for the first year paid monthly (setup fee included) or ${money(costOver(STARTER, "annually", 1))} on a 12-month term, and the same again each year after. Larger plans are on the pricing page. Across the industry, what you really pay depends on the renewal price, not the advertised one.`
      : "It depends on the plan and, above all, on the renewal price rather than the advertised one.",
    scopes: [PATH],
  },
  {
    question: "Which host is cheapest over three years?",
    answer: `Of the figures on this page, Hostinger's ${HOSTINGER[0].name} is cheapest over three years if you prepay its ${HOSTINGER[0].months}-month plan (${formatPrice(HOSTINGER[0].upfront)} upfront). Serverlys is cheaper to start month to month, never changes price at renewal and needs no long prepayment. Check each host's current figures before you decide; prices change often.`,
    scopes: [PATH],
  },
  {
    question: "Are there hidden fees in web hosting?",
    answer: `The common ones are the renewal increase, paid add-ons (backups, SSL, migration, email) and domain renewals. On Serverlys, daily backups, SSL and migration are included; ${STARTER?.setupFee ? `the entry plan has a one-off ${formatPrice(STARTER.setupFee)} setup fee on the monthly term, shown before checkout` : "any setup fee is shown before checkout"}.`,
    scopes: [PATH],
  },
  {
    question: "What does managed hosting cost?",
    answer: PLANS.length
      ? `Serverlys managed cloud hosting runs from ${formatPrice(PLANS[0].monthly)} to ${formatPrice(PLANS[PLANS.length - 1].monthly)} a month on the monthly term, with patching, security, daily backups, free restores and free migration included rather than sold as add-ons.`
      : "Management, backups, restores and migration are included in the plan price.",
    scopes: [PATH],
  },
];

const linkClass = "font-semibold text-primary hover:text-primary-hover";

export default function RenewalPricesPage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />

      {/* Hero: the answer first, then the entry-plan jump at a glance. */}
      <section className="relative isolate overflow-hidden bg-canvas">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]" />
        <Container width="wide" className="pb-16 pt-10 sm:pb-20 lg:pb-24 lg:pt-14">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <Pill>Hosting prices</Pill>
              <h1 className="display-lg mt-5 text-fg">Web hosting renewal prices, compared</h1>
              <p className="mt-5 max-w-xl text-body-lg text-fg-secondary">
                The price on a hosting plan card is rarely the price you keep paying. Here is the
                advertised price, what you must commit to get it, and what the plan renews at, for
                Serverlys and five of the biggest hosts, with every competitor figure dated and sourced.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="#rp-table-heading" size="lg">See the comparison</Button>
                <Button href="/pricing" variant="outline" size="lg">Serverlys pricing</Button>
              </div>
            </div>
            <Stage>
              <div className="rounded-2xl bg-white p-5 sm:p-6">
                <p className="text-small font-semibold text-fg">Entry plans: advertised price → renewal price</p>
                <p className="mt-1 text-micro text-fg-muted">Competitor figures as of {COMPETITOR_SOURCE_DATE}</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {ROWS.filter((r) => r.change !== "Not stated" && !(r.ours && r.plan.includes("36"))).map((r) => (
                    <li
                      key={r.host + r.plan}
                      className={r.ours ? "rounded-xl bg-brand-50 p-3.5 ring-2 ring-primary" : "rounded-xl bg-canvas-secondary p-3.5"}
                    >
                      <span className="flex items-center justify-between gap-3 text-small font-semibold text-fg">
                        {r.host} {r.plan}
                        <span className="shrink-0 whitespace-nowrap">
                          <Pill tone={r.ours ? "success" : "warning"}>{r.change}</Pill>
                        </span>
                      </span>
                      <span className="mt-1 block text-micro text-fg-secondary">
                        {r.advertised.split(" + ")[0]} → renews at {r.renews}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Stage>
          </div>
        </Container>
      </section>

      {/* What a renewal price is. */}
      <Band labelledBy="rp-what-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="rp-what-heading" align="left" title="What a renewal price is, and why intro prices jump" />
            <p className="mt-5 max-w-[60ch] text-body text-fg-secondary">
              Hosting companies advertise an introductory price: a discount for signing up, almost
              always tied to paying one, three or four years upfront. When that first term ends, the
              plan renews at its regular price. That second number is the one you live with.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              Nothing about that is hidden; the renewal rate is usually printed on the plan card. It
              is just smaller, and the advertised figure is a monthly average of a long prepayment,
              not what one month costs.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              Serverlys works differently on purpose: every plan renews at the same price for the term
              you choose, and the monthly price is what a single month costs. That is what our{" "}
              <Link href="/pricing" className={linkClass}>pricing page</Link> shows on every card.
            </p>
          </div>
          <ul className="grid content-start gap-4">
            {[
              ["Read the term", "Is the advertised price per month of a 12, 36 or 48-month plan paid upfront? Then it is not what a month costs."],
              ["Find the renewal rate", "It is on the plan card or in the checkout summary. Compare hosts on this number, not the advertised one."],
              ["Add the extras", "Setup fees, backups, SSL, migration and email. Some hosts charge for these; some include them."],
              ["Price the domain separately", "A cheap or free first-year domain often renews at a much higher yearly price."],
            ].map(([title, body]) => (
              <li key={title} className="rounded-2xl bg-canvas-secondary p-6">
                <span className="flex items-center gap-2.5">
                  <Tick />
                  <span className="text-body-lg font-semibold text-fg">{title}</span>
                </span>
                <p className="mt-2 text-small text-fg-secondary">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Band>

      {/* The comparison. */}
      <Band tone="subtle" labelledBy="rp-table-heading">
        <Heading
          id="rp-table-heading"
          title="Entry plan renewal prices, side by side"
          lede="The cheapest plan each host sells, read off their own pages on the date shown."
        />
        <div className="mt-12 overflow-x-auto rounded-3xl bg-canvas ring-1 ring-line">
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <caption className="sr-only">
              Advertised price, required term and renewal price of the entry hosting plan at Serverlys, Hostinger, Bluehost, SiteGround, GoDaddy and Namecheap
            </caption>
            <thead>
              <tr className="border-b border-line text-small text-fg">
                <th scope="col" className="px-5 py-4 font-semibold">Host and plan</th>
                <th scope="col" className="px-5 py-4 font-semibold">Advertised price</th>
                <th scope="col" className="px-5 py-4 font-semibold">What it requires</th>
                <th scope="col" className="px-5 py-4 font-semibold">Renews at</th>
                <th scope="col" className="px-5 py-4 font-semibold">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle">
              {ROWS.map((r) => (
                <tr key={r.host + r.plan} className={r.ours ? "bg-brand-50/60" : undefined}>
                  <th scope="row" className="px-5 py-4 align-top text-small font-semibold text-fg">
                    {r.host}
                    <span className="block font-normal text-fg-secondary">{r.plan}</span>
                  </th>
                  <td className="px-5 py-4 align-top text-small text-fg">{r.advertised}</td>
                  <td className="px-5 py-4 align-top text-small text-fg-secondary">{r.needs}</td>
                  <td className="px-5 py-4 align-top text-small text-fg">{r.renews}</td>
                  <td className="px-5 py-4 align-top text-small">
                    <Pill tone={r.ours ? "success" : r.change === "Not stated" ? "neutral" : "warning"}>{r.change}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {BF_ON && sMonthly?.bf && s36?.bf && STARTER && (
          <div className="mx-auto mt-6 max-w-[880px] rounded-2xl bg-canvas p-5 ring-1 ring-error-fill/40">
            <p className="text-small text-fg">
              <span className="mr-2 inline-flex rounded-md bg-error-fill px-2 py-0.5 text-micro font-semibold text-white">Black Friday</span>
              Until {BLACK_FRIDAY.endsLabel}, your first Serverlys payment is {PCT} off, applied automatically at checkout:{" "}
              {STARTER.name} monthly is {formatPrice(sMonthly.bf.today)} for the first month (setup included, regular{" "}
              {formatPrice(sMonthly.today)}), and 36 months is {formatPrice(s36.bf.today)} (regular {formatPrice(s36.today)}).
              The table above shows regular prices, which is what every plan renews at.
            </p>
          </div>
        )}
        <p className="mx-auto mt-6 max-w-[820px] text-center text-micro text-fg-muted">
          Competitor figures as of {COMPETITOR_SOURCE_DATE}, from{" "}
          {(
            [
              [HOSTINGER_WEB, "hostinger.com/web-hosting"],
              [BLUEHOST_SHARED, "bluehost.com/hosting/shared"],
              [SG_WEB, "siteground.com/web-hosting.htm"],
              [GD_WEB, "godaddy.com/hosting/web-hosting"],
              [NC_SHARED, "namecheap.com/hosting/shared"],
            ] as const
          ).map(([href, label], i, all) => (
            <span key={href}>
              <a href={href} rel="nofollow noopener" className="underline underline-offset-2 hover:text-fg">
                {label}
              </a>
              {i < all.length - 1 ? ", " : ". "}
            </span>
          ))}
          GoDaddy&rsquo;s page says &ldquo;Product renewal pricing subject to change&rdquo; and printed no renewal
          figure; Namecheap&rsquo;s says: &ldquo;{NC_RENEWAL_NOTE}&rdquo; Prices are in USD and change often;
          check each host before you decide. Head-to-head pages:{" "}
          <Link href="/hostinger-alternative" className="underline underline-offset-2 hover:text-fg">Hostinger</Link>,{" "}
          <Link href="/bluehost-alternative" className="underline underline-offset-2 hover:text-fg">Bluehost</Link>,{" "}
          <Link href="/siteground-alternative" className="underline underline-offset-2 hover:text-fg">SiteGround</Link>,{" "}
          <Link href="/godaddy-alternative" className="underline underline-offset-2 hover:text-fg">GoDaddy</Link>,{" "}
          <Link href="/namecheap-alternative" className="underline underline-offset-2 hover:text-fg">Namecheap</Link>.
        </p>
      </Band>

      {/* Real cost over time. */}
      <Band labelledBy="rp-cost-heading">
        <Heading
          id="rp-cost-heading"
          title="How to compare the real cost of hosting"
          lede="Add the first term, every renewal until the date you care about, and any setup fee. Here is that sum for every Serverlys cloud plan, at regular prices."
        />
        <div className="mx-auto mt-12 max-w-[960px] overflow-x-auto rounded-2xl ring-1 ring-line">
          <table className="w-full min-w-[40rem] border-collapse text-left text-small">
            <caption className="sr-only">Serverlys cloud plans: total cost over one and three years on each billing term, setup fee included</caption>
            <thead className="bg-canvas-secondary text-fg">
              <tr>
                <th scope="col" className="p-4 font-semibold">Plan</th>
                {TERMS.filter((t) => t.key !== "biennially").map((t) => (
                  <th key={t.key} scope="col" className="p-4 font-semibold">
                    {t.label}
                    <span className="block font-normal text-fg-muted">1 year / 3 years</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLANS.map((plan) => (
                <tr key={plan.tier} className="border-t border-line">
                  <th scope="row" className="p-4 font-medium text-fg">{plan.name}</th>
                  {TERMS.filter((t) => t.key !== "biennially").map((t) => (
                    <td key={t.key} className="p-4 text-fg">
                      {t.months > 12 ? "Prepaid" : money(costOver(plan, t.key, 1))} / {money(costOver(plan, t.key, 3))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mx-auto mt-10 max-w-[960px]">
          <h3 className="text-body-lg font-semibold text-fg">The same three-year sum for other entry plans</h3>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {COMPETITOR_3Y.map((c) => (
              <li key={c.label} className="rounded-2xl bg-canvas-secondary p-5">
                <span className="text-small font-semibold text-fg">{c.label}</span>
                <span className="mt-1 block text-body-lg font-semibold text-fg">{money(c.total)}</span>
                <span className="mt-1 block text-micro text-fg-secondary">{c.how}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-micro text-fg-muted">
            Competitor sums use only their printed figures as of {COMPETITOR_SOURCE_DATE}, before tax and add-ons.
            Over three years Hostinger&rsquo;s prepaid plan is the cheapest of these, and we will not pretend
            otherwise; Serverlys is cheaper to start, needs no long prepayment and never changes price at renewal.
            For a fuller breakdown see{" "}
            <Link href="/blog/web-hosting-cost-2026" className="underline underline-offset-2 hover:text-fg">
              what web hosting costs in 2026
            </Link>
            .
          </p>
        </div>
      </Band>

      {/* Managed hosting pricing. */}
      <Band tone="subtle" labelledBy="rp-managed-heading">
        <Heading
          id="rp-managed-heading"
          title="Managed hosting pricing: what the price includes"
          lede="Every Serverlys cloud plan is managed: we patch, secure, monitor and back up the server. These are the plans and what each one comes with."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan) => {
            const q = quote(plan, "monthly");
            return (
              <li key={plan.tier} className="flex flex-col rounded-2xl bg-canvas p-6 ring-1 ring-line">
                <span className="text-body-lg font-semibold text-fg">{plan.name}</span>
                <span className="mt-3 text-[28px] leading-none font-semibold tracking-[-0.02em] text-fg">
                  {formatPrice(q.total)}
                  <span className="text-body font-normal text-fg-secondary">/mo</span>
                </span>
                <span className="mt-2 text-micro text-fg-secondary">
                  Renews at {formatPrice(q.total)}/mo{q.setup ? `, ${formatPrice(q.setup)} one-off setup` : ""}
                  {q.bf ? `. Black Friday first month ${formatPrice(q.bf.today)}` : ""}
                </span>
                <ul className="mt-5 flex flex-col gap-2 text-small text-fg">
                  {[plan.specs.sites, plan.specs.visits, `${plan.specs.memory} RAM`, `${plan.specs.storage} storage`].map((s) => (
                    <li key={s} className="flex items-start gap-2"><Tick />{s}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <p className="mx-auto mt-8 max-w-[70ch] text-center text-small text-fg-secondary">
          Included on every plan: {PLANS[0]?.includes.slice(0, 6).join(", ")}. What management covers is on{" "}
          <Link href="/managed-hosting" className={linkClass}>managed hosting</Link>; plans by workload are on{" "}
          <Link href="/cloud-hosting" className={linkClass}>cloud hosting</Link>, and for a new company see{" "}
          <Link href="/startup-hosting" className={linkClass}>hosting for startups</Link>.
        </p>
      </Band>

      <FaqSection items={FAQS} />
      <FinalCta plansHref="/pricing" />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
