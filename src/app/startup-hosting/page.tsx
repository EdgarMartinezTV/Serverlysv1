import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { BlackFridayProductHero } from "@/components/sections/black-friday-product-hero";
import { Band, Heading, Pill, Tick } from "../hosting/_components/band";
import { Grid, Headline } from "@/components/ref/kit";
import { PLAN_CARD_ITEM, PlanCard } from "@/components/ref/plan-card";
import { TermProvider, TermSelect } from "@/components/ref/term";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";
import { pageMetadata, faqGraph, productGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";
import { billing } from "@/data/company";
import {
  BLACK_FRIDAY,
  blackFridayActive,
  formatPrice,
  groupById,
  monthlyLine,
  quote,
  type Plan,
} from "@/data/pricing";

/**
 * Cloud hosting for startups — 2026-10-31.
 *
 * Built for a Search Console cluster the site already shows up for without a
 * page that answers it: "cloud hosting providers for startups" (pos ~9),
 * "best web hosting for startups", "web hosting for startups", "startup
 * hosting deals", "managed hosting discount offers for startups",
 * "bootstrapped saas hosting recommendations", "cloud hosting platform with
 * low monthly costs for an early stage product ... simple pricing and no
 * surprise overages".
 *
 * ⚠ HONESTY: every price comes from data/pricing.ts (quote / monthlyLine /
 * BLACK_FRIDAY). There is NO startup programme, no credits, no ratings and no
 * uptime figure on this page — none exist. "No overage" is stated only for
 * what the plan data says: bandwidth is "Unmetered" and NVMe storage
 * "Unlimited" on every cloud plan. The visit counts are the plans' sizing
 * guidance, not a cap we bill against, and are described that way.
 */

const PATH = "/startup-hosting";
const GROUP = groupById("cloud");
const PLANS: readonly Plan[] = GROUP?.plans ?? [];
const BY_TIER = Object.fromEntries(PLANS.map((p) => [p.tier, p])) as Record<string, Plan | undefined>;
const STARTER = BY_TIER.starter;
const BF = blackFridayActive();
const PCT = `${Math.round(BLACK_FRIDAY.pct * 100)}%`;

/* Lowest per-month figure, today: Starter on 36 months (sale price while it runs). */
const LONG = STARTER ? quote(STARTER, "triennially") : null;
const FROM = LONG ? formatPrice(LONG.bf?.perMonth ?? LONG.perMonth) : "";
const MONTHLY = STARTER ? quote(STARTER, "monthly") : null;

export const metadata = pageMetadata({
  title: BF ? `Cloud Hosting for Startups, Black Friday ${PCT} Off | Serverlys` : "Cloud Hosting for Startups, Managed and Simple | Serverlys",
  description: BF
    ? `Managed cloud hosting for startups from ${FROM}/mo this Black Friday, ${PCT} off your first payment until ${BLACK_FRIDAY.endsLabel}. Renewal price shown, free migration.`
    : `Managed cloud hosting for startups from ${FROM}/mo: no DevOps hire, unmetered bandwidth, free migration and the renewal price shown before you pay.`,
  path: PATH,
});

/** Card notes on the plan grid, framed by company stage. */
const WHY: Record<string, string> = {
  starter: "Landing page or MVP: one site, enough for launch traffic, free domain on 12 months or longer.",
  plus: "Product plus marketing site and docs, up to seven sites, with room for your first real traction.",
  turbo: "Growing product with unlimited sites and more memory. The tier most projects settle on.",
  business: "Launch days, press and seasonal spikes: the most memory and headroom in the range.",
};

/** Plan by stage. Specs come from the plan data so the card cannot drift from the store. */
const STAGES: ReadonlyArray<readonly [string, string, string]> = [
  ["Pre-launch / MVP", "starter", "A landing page, waitlist or first version of the product. You need it fast, secure and cheap, not a cluster."],
  ["First customers", "plus", "Marketing site, app front end, docs and a blog on one account, while traffic is still predictable."],
  ["Growing product", "turbo", "Several sites or environments and steady traffic. More memory means caches stay warm and pages stay fast."],
  ["Traffic spikes", "business", "Launches, press mentions and peak seasons, where the extra headroom is the difference between a sale and a timeout."],
];

const WHY_MANAGED: ReadonlyArray<readonly [string, string]> = [
  ["No DevOps hire on day one", "We patch, harden, monitor and back up the server. Your engineers ship product instead of maintaining Linux, and nobody has to own the pager for the web server."],
  ["Predictable pricing", "One plan price per term, the renewal price printed beside it, and bandwidth that is unmetered. You can put hosting in the budget and leave it there."],
  ["Fast by default", "NVMe storage, LiteSpeed and server-level caching come configured, so a small team gets a fast site without tuning a stack."],
  ["Backups you can actually restore", "Daily backups, and restores are free. Rolling back a bad deploy or plugin update is a request, not a weekend."],
  ["Free migration", "Moving off a free tier, a builder or another host? We copy the site, database and email, stage it for you to check, and switch when you say."],
  ["An AI chat agent included", "ConvoAI Essentials, an AI agent that answers visitors in your website chat, comes with every hosting plan. Useful when the whole support team is the founders."],
];

const FAQS: readonly Faq[] = [
  {
    question: "What is the best cloud hosting for a startup?",
    answer:
      "The one that lets a small team ship without hiring for operations, prices predictably and grows with you without a migration. For most early-stage websites, product front ends and marketing sites, that is managed cloud hosting: the provider runs the server, you deploy the product. If you need custom system packages, containers or root access today, a VPS or a platform like a hyperscaler is the better fit.",
    scopes: [PATH],
  },
  {
    question: "How much does startup hosting cost?",
    answer: STARTER
      ? `Serverlys cloud hosting starts at ${monthlyLine(STARTER)}.${LONG ? ` On a 36-month term Starter Cloud works out to ${FROM} a month (${formatPrice(LONG.bf?.today ?? LONG.today)} today${LONG.bf ? `, regular ${formatPrice(LONG.today)}` : ""}), renewing at ${formatPrice(LONG.total)}.` : ""} Every plan shows its renewal price before you pay.`
      : "See the plan grid on this page for current prices; every plan shows its renewal price before you pay.",
    scopes: [PATH],
  },
  {
    question: "Are there overage charges if my traffic grows?",
    answer:
      "Bandwidth is unmetered and NVMe storage is unlimited on every cloud plan, so there is no per-gigabyte bill. Each plan lists the monthly visits it is sized for; if you consistently outgrow it, we tell you and you move up a tier. We do not quietly add charges to your invoice.",
    scopes: [PATH],
  },
  {
    question: `Is there a startup discount${BF ? " right now" : ""}?`,
    answer: BF
      ? `Yes: the Black Friday sale takes ${PCT} off your first payment on every cloud, WordPress, WooCommerce and email plan, and ConvoAI Pro, until ${BLACK_FRIDAY.endsLabel}. It is applied automatically at checkout. There is no separate startup programme or credits scheme.`
      : "There is no separate startup programme or credits scheme. Longer terms cost less per month, and every plan shows the renewal price before you pay, so the price you budget is the price you keep.",
    scopes: [PATH],
  },
  {
    question: "Can I start small and upgrade later?",
    answer:
      "Yes. Start on Starter for a landing page or MVP and upgrade to Plus, Turbo or Business from your client area as traffic grows. It is the same platform at every tier, so upgrading does not mean moving your site.",
    scopes: [PATH],
  },
  {
    question: "Do you migrate my site for free?",
    answer:
      "Yes. Migration is free with every cloud plan: we copy the site, database and email, stage it so you can check it, and switch when you say, without taking the old site down first.",
    scopes: [PATH],
  },
  {
    question: "Is this a good fit for a SaaS application?",
    answer:
      "For the marketing site, docs, blog and a PHP or WordPress-based product, yes. For an application that needs its own runtime, background workers, containers or root access, talk to us first: a VPS or dedicated server is coming, and we will tell you honestly if another platform suits you better today.",
    scopes: [PATH],
  },
];

export default function StartupHostingPage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />
      {PLANS.length > 0 && (
        <JsonLd
          data={productGraph({
            name: "Serverlys Cloud Hosting for Startups",
            description: String(metadata.description ?? ""),
            path: PATH,
            lowPrice: Math.min(...PLANS.map((p) => p.monthly)),
            highPrice: Math.max(...PLANS.map((p) => p.monthly)),
            offerCount: PLANS.length,
          })}
        />
      )}

      {BF ? (
        <BlackFridayProductHero
          id="startup-bf-hero"
          groupId="cloud"
          headline="Cloud hosting for startups this Black Friday"
          bullets={["No DevOps hire: we run the server", "Unmetered bandwidth, renewal price shown up front", "Free migration from any host"]}
          ctaHref="#plans"
        />
      ) : (
        <ProductHero
          eyebrow="Startup hosting"
          title="Cloud hosting for startups, without a DevOps hire"
          lede={`Managed cloud hosting that a small team can launch on and grow on: we patch, secure and back up the server, bandwidth is unmetered and the renewal price is shown up front. From ${FROM}/mo, with free migration.`}
          breadcrumb={[
            { name: "Home", href: "/" },
            { name: "Hosting", href: "/hosting" },
            { name: "Startup hosting" },
          ]}
          specs={[
            { label: "Plans from", value: `${FROM}/mo` },
            { label: "Bandwidth", value: "Unmetered" },
            { label: "Server admin", value: "Ours" },
            { label: "Migration", value: "Free" },
          ]}
          primary={{ label: "See plans", href: "#plans" }}
          secondary={{ label: "Ask what you need", href: billing.sales }}
        />
      )}

      {/* Plans, priced for the term picked (same card as /pricing and /cloud-hosting). */}
      {GROUP && (
        <section id="plans" aria-labelledby="startup-plans-heading" className="scroll-mt-14 bg-canvas-secondary py-16 lg:py-24">
          <Grid>
            <Headline
              id="startup-plans-heading"
              title="Cloud hosting plans for every stage"
              description="Pick the plan for where you are now and upgrade in your client area when you grow. Same platform at every tier, so upgrading never means moving."
              className="mb-10 xl:mb-12"
            />
            <TermProvider>
              <div className="mb-6 flex justify-end">
                <TermSelect />
              </div>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {GROUP.plans.map((plan) => (
                  <li key={plan.tier} className={PLAN_CARD_ITEM}>
                    <PlanCard plan={plan} group={GROUP} why={WHY[plan.tier]} cta="Choose plan" />
                  </li>
                ))}
              </ul>
            </TermProvider>
            <p className="mx-auto mt-8 max-w-[720px] text-center text-small text-fg-secondary">
              Every plan shows what you pay today and what it renews at. Want the full breakdown? Read{" "}
              <Link href="/web-hosting-renewal-prices" className="text-primary underline underline-offset-4">
                how hosting renewal prices work
              </Link>{" "}
              or compare everything on{" "}
              <Link href="/pricing" className="text-primary underline underline-offset-4">
                the pricing page
              </Link>
              .
            </p>
          </Grid>
        </section>
      )}

      {/* Plan by stage. */}
      <Band labelledBy="startup-stage-heading">
        <Heading
          id="startup-stage-heading"
          title="Which plan fits your stage"
          lede="Hosting should match the company you are now, not the one in the pitch deck. Here is where most startups land."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STAGES.map(([stage, tier, text]) => {
            const plan = BY_TIER[tier];
            if (!plan) return null;
            return (
              <li key={tier} className="flex flex-col rounded-2xl bg-canvas-secondary p-6">
                <Pill tone="brand">{stage}</Pill>
                <h3 className="mt-4 text-body-lg font-semibold text-fg">{plan.name}</h3>
                <p className="mt-2 text-small text-fg-secondary">{text}</p>
                <ul className="mt-5 flex flex-col gap-2 text-small text-fg">
                  {[plan.specs.sites, plan.specs.visits, `${plan.specs.memory} RAM`, `${plan.specs.storage} storage`].map((s) => (
                    <li key={s} className="flex items-center gap-2.5">
                      <Tick />
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-5 text-small font-semibold text-fg">{monthlyLine(plan)}</p>
              </li>
            );
          })}
        </ul>
        <p className="mx-auto mt-6 max-w-[70ch] text-center text-micro text-fg-muted">
          Monthly visits are sizing guidance for each plan, not a cap you are billed against.
        </p>
      </Band>

      {/* Why managed cloud suits a small team. */}
      <Band tone="subtle" labelledBy="startup-why-heading">
        <Heading
          id="startup-why-heading"
          title="Why startups choose managed cloud hosting"
          lede="A small team's scarcest resource is engineering time. Managed hosting spends ours instead of yours."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {WHY_MANAGED.map(([title, text]) => (
            <li key={title} className="rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <h3 className="text-body-lg font-semibold text-fg">{title}</h3>
              <p className="mt-3 text-small text-fg-secondary">{text}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* The bill, plainly: what you pay, what it renews at, what is not billed. */}
      <Band tone="dark" labelledBy="startup-bill-heading">
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,30rem)] lg:items-center lg:gap-20">
          <div>
            <Heading
              id="startup-bill-heading"
              dark
              align="left"
              title="Simple pricing, no surprise overages"
              lede="Early-stage budgets break on the line items nobody mentioned. Here is the whole bill."
            />
            <ul className="mt-8 flex flex-col gap-3">
              {[
                "One price per plan and term, with the renewal price printed beside it",
                "Unmetered bandwidth and unlimited NVMe storage on every cloud plan",
                "Free SSL, daily backups and free restores included",
                "Free migration, staged and switched when you say",
                "A free domain for the first year on 12 months or longer",
                "Cancel anytime, with a 30-day money-back guarantee",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-body text-white">
                  <Tick />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          {MONTHLY && LONG && STARTER && (
            <div className="rounded-3xl bg-white/[0.05] p-6 ring-1 ring-white/10 sm:p-8">
              <p className="text-small font-semibold text-fg-on-dark-secondary">{STARTER.name}, what you actually pay</p>
              <dl className="mt-5 divide-y divide-white/10 text-small">
                {[
                  ["Monthly, first payment", formatPrice(MONTHLY.bf?.today ?? MONTHLY.today), MONTHLY.setup ? `incl. ${formatPrice(MONTHLY.bf?.setup ?? MONTHLY.setup)} setup` : ""],
                  ["Monthly, after that", `${formatPrice(MONTHLY.total)}/mo`, ""],
                  ["36 months, first payment", formatPrice(LONG.bf?.today ?? LONG.today), `${formatPrice(LONG.bf?.perMonth ?? LONG.perMonth)}/mo`],
                  ["36 months, renewal", formatPrice(LONG.total), `${formatPrice(LONG.perMonth)}/mo`],
                ].map(([label, value, note]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-fg-on-dark-secondary">{label}</dt>
                    <dd className="text-right">
                      <span className="tabular font-semibold text-white">{value}</span>
                      {note && <span className="block text-micro text-fg-on-dark-muted">{note}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
              {BF && (
                <p className="mt-4 text-micro text-fg-on-dark-muted">
                  First-payment figures include the Black Friday {PCT} off, applied automatically at checkout until {BLACK_FRIDAY.endsLabel}.
                </p>
              )}
            </div>
          )}
        </div>
      </Band>

      {/* Scaling path. */}
      <Band labelledBy="startup-scale-heading">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="startup-scale-heading" align="left" title="Grow without migrating" />
            <p className="mt-5 max-w-[60ch] text-body text-fg-secondary">
              Every cloud plan runs on the same managed platform, so moving from Starter to Business is an upgrade
              in your client area, not a weekend of DNS changes. Your files, database, email and SSL stay where they are.
            </p>
            <p className="mt-4 max-w-[60ch] text-body text-fg-secondary">
              When you need things managed cloud cannot give you, like root access or your own system packages, we will
              say so plainly and help you plan the move rather than keep you on the wrong plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cloud-hosting"
                className="inline-flex h-12 items-center rounded-md bg-primary px-6 text-body font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Explore cloud hosting
              </Link>
              <Link
                href="/migrations"
                className="inline-flex h-12 items-center rounded-md px-6 text-body font-semibold text-primary ring-1 ring-inset ring-primary/35 hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Free migration
              </Link>
            </div>
          </div>
          <ol className="grid gap-3">
            {PLANS.map((plan, i) => (
              <li key={plan.tier} className="flex items-center gap-4 rounded-2xl bg-canvas-secondary p-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-small font-semibold text-white">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-body font-semibold text-fg">{plan.name}</span>
                  <span className="block text-small text-fg-secondary">
                    {plan.specs.sites} · {plan.specs.visits} · {plan.specs.memory} RAM
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <p className="mx-auto mt-12 max-w-[70ch] text-center text-small text-fg-secondary">
          Comparing providers? Read our guide to{" "}
          <Link href="/blog/best-hosting-startups" className="text-primary underline underline-offset-4">
            the best hosting for startups
          </Link>{" "}
          or see{" "}
          <Link href="/blog/cloud-vs-shared-hosting" className="text-primary underline underline-offset-4">
            cloud vs shared hosting
          </Link>
          .
        </p>
      </Band>

      <FaqSection items={FAQS} />
      <FinalCta />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
