import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { company, billing } from "@/data/company";
import { formatMonthly, formatSetup, restaurantPlans } from "@/data/restaurant-plans";
import { Reveal } from "@/components/animations/reveal";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import {
  Faqs,
  Heading,
  HowItWorks,
  INK,
  Label,
  MUTED,
  PanelCard,
  PricingPanel,
  Related,
  Tick,
  Wrap,
} from "@/components/retell/kit";
import { PATHS, type CompareValue, type LandingCopy, type Locale } from "../_i18n";
import { RestaurantHero } from "./hero";
import { ExplorerTabs } from "./explorer";
import { ReviewForm } from "./review-form";
import { PhoneMock, EMBER } from "./device-mocks";
import { HtmlLang } from "./html-lang";
import { CATEGORIES } from "../_demo/menu";

/**
 * /restaurant-websites and /es/restaurant-websites — one layout, two locales.
 *
 * Section order is a sales funnel for an owner standing at the counter with
 * their phone: what it is (hero, both CTAs) → what guests check → what we build
 * (interactive) → try the demo → how it works → price → compare → "we'll come
 * to you" (Downtown Doral) → the free review form → FAQ.
 *
 * Built on the shared Retell-style kit (components/retell/kit.tsx) for the
 * site's type, spacing and pricing cards, with page-specific sections around
 * it. Plans: data/restaurant-plans.ts. Copy: ../_content/{en,es}.ts.
 */
export function RestaurantLanding({ copy, locale }: { copy: LandingCopy; locale: Locale }) {
  const paths = PATHS[locale];
  return (
    <div lang={locale}>
      {locale !== "en" && <HtmlLang lang={locale} />}
      <RestaurantHero copy={copy} locale={locale} />
      <GuestChecks copy={copy} />

      <section id="features" aria-labelledby="rw-explorer-heading" className="scroll-mt-20 bg-white pb-20 lg:pb-28">
        <Wrap className="max-w-[1200px]">
          <Label className="text-center">{copy.explorer.label}</Label>
          <Heading id="rw-explorer-heading">{copy.explorer.title}</Heading>
          <p className={cn("mx-auto mt-5 max-w-[620px] text-center text-[16px] leading-[1.6]", MUTED)}>
            {copy.explorer.intro}
          </p>
          <ExplorerTabs copy={copy} locale={locale} />
        </Wrap>
      </section>

      <DemoBand copy={copy} locale={locale} href={paths.demo} />

      <HowItWorks id="rw-steps-heading" label={copy.steps.label} title={copy.steps.title} steps={copy.steps.items} />

      <Pricing copy={copy} />
      <Compare copy={copy} />
      <Doral copy={copy} />
      <ReviewSection copy={copy} locale={locale} />

      <Faqs id="rw-faq-heading" label={copy.faq.label} title={copy.faq.title} items={copy.faq.items} />
      <Related id="rw-related-heading" label={copy.related.label} items={copy.related.items} />

      <PageBreadcrumbs
        trail={[
          { name: copy.breadcrumb.home, path: "/" },
          { name: copy.breadcrumb.page, path: paths.landing },
        ]}
      />
    </div>
  );
}

/* ── Five things guests check ─────────────────────────────────────────────── */

const CHECK_ICONS = [
  "M6 3h12v18H6zM9 8h6m-6 4h6m-6 4h4",
  "M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  "M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2",
  "M4 6h16v14H4zM4 10h16M8 3v4m8-4v4",
  "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4",
];

function GuestChecks({ copy }: { copy: LandingCopy }) {
  return (
    <section aria-labelledby="rw-checks-heading" className="bg-white py-20 lg:py-28">
      <Wrap className="max-w-[1200px]">
        <Label className="text-center">{copy.checks.label}</Label>
        <Heading id="rw-checks-heading" className="max-w-[720px]">
          {copy.checks.title}
        </Heading>
        <ol className="mt-12 grid grid-cols-2 gap-3 lg:mt-14 lg:grid-cols-5">
          {copy.checks.items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 70}
              className="flex flex-col rounded-2xl bg-[#f4f4f7] p-5 last:col-span-2 sm:p-6 lg:min-h-[220px] lg:last:col-span-1"
            >
              <span className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d={CHECK_ICONS[i]} />
                  </svg>
                </span>
                <span aria-hidden="true" className="font-display text-[13px] text-[#9aa1ab] tabular-nums">
                  0{i + 1}
                </span>
              </span>
              <h3 className={cn("mt-5 text-[18px] leading-[1.2] sm:text-[20px] lg:mt-8 font-normal tracking-[-0.01em]", INK)}>{item.title}</h3>
              <p className={cn("mt-2 text-[13px] leading-[1.5] sm:text-[14px]", MUTED)}>{item.body}</p>
            </Reveal>
          ))}
        </ol>
      </Wrap>
    </section>
  );
}

/* ── Live demo band ──────────────────────────────────────────────────────── */

function DemoBand({ copy, locale, href }: { copy: LandingCopy; locale: Locale; href: string }) {
  const d = copy.demoBand;
  return (
    <section aria-labelledby="rw-demo-heading" className="px-2 pb-20 lg:pb-28">
      <div className="relative isolate overflow-hidden rounded-[20px] bg-[#14100d] text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(50%_80%_at_85%_30%,rgb(226_100_43/0.28),transparent_70%)]"
        />
        <Wrap className="grid items-center gap-12 py-16 lg:max-w-[1200px] lg:grid-cols-[1fr_1fr] lg:py-24">
          <div>
            <p className="text-[13px] font-medium" style={{ color: EMBER }}>
              {d.label}
            </p>
            <h2
              id="rw-demo-heading"
              className="mt-5 max-w-[520px] font-display text-[32px] leading-[1.12] font-normal tracking-[-0.025em] text-current lg:text-[44px]"
            >
              {d.title}
            </h2>
            <p className="mt-6 max-w-[520px] text-[16px] leading-[1.65] text-white/75">{d.body}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {d.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-[15px] leading-[1.45] text-white/90">
                  <Tick onBlue />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href={href}
                className="inline-flex h-[52px] items-center gap-2 rounded-full bg-white px-7 text-body font-semibold text-[#14100d] transition-colors duration-fast hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {d.cta}
                <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 10h12m-5-5 5 5-5 5" />
                </svg>
              </Link>
              <p className="text-[13px] text-white/55">{d.disclaimer}</p>
            </div>
          </div>

          <div aria-hidden="true" className="relative mx-auto w-full max-w-[520px]">
            <div className="relative aspect-[4/3.4] overflow-hidden rounded-[18px]">
              <Image src="/restaurant/fine-table.jpg" alt="" fill sizes="(min-width: 1024px) 520px, 90vw" className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgb(20_16_13/0.7))]" />
            </div>
            <div className="absolute -bottom-8 left-[6%] w-[36%] rotate-[-4deg]">
              <PhoneMock mock={copy.hero.mock} categories={CATEGORIES.map((c) => c.label[locale])} />
            </div>
          </div>
        </Wrap>
      </div>
    </section>
  );
}

/* ── Pricing ─────────────────────────────────────────────────────────────── */

const PLAN_ICON = { starter: "layout", growth: "growth", pro: "rocket" } as const;

function Pricing({ copy }: { copy: LandingCopy }) {
  const p = copy.pricing;
  return (
    <PricingPanel id="rw-plans-heading" label={p.label} title={p.title} footnote={p.footnote}>
      {restaurantPlans.map((plan, i) => {
        const blue = plan.id === "growth";
        return (
          <PanelCard
            key={plan.id}
            delay={i * 80}
            blue={blue}
            icon={PLAN_ICON[plan.id]}
            name={plan.name}
            badge={blue ? p.recommended : undefined}
            summary={p.summaries[plan.id]}
            price={
              <div>
                <p className="flex items-baseline gap-2">
                  <span className={cn("tabular text-[40px] leading-none font-semibold tracking-[-0.03em]", blue ? "text-white" : INK)}>
                    {formatSetup(plan.setup)}
                  </span>
                  <span className={cn("text-[13px] font-medium", blue ? "text-white/85" : MUTED)}>{p.setup}</span>
                </p>
                <p className={cn("mt-2 text-[16px]", blue ? "text-white" : INK)}>
                  <span className={blue ? "text-white/85" : MUTED}>{p.then} </span>
                  <strong className="font-semibold tabular-nums">{formatMonthly(plan.monthly)}</strong>
                  <span className={blue ? "text-white/85" : MUTED}>{p.perMonth}</span>
                </p>
              </div>
            }
            cta={{ label: `${p.cta} ${plan.name}`, href: `#review-${plan.id}` }}
            listTitle={p.listTitle}
            list={p.highlights[plan.id]}
          />
        );
      })}
    </PricingPanel>
  );
}

/* ── Comparison table ────────────────────────────────────────────────────── */

function Cell({ value, copy }: { value: CompareValue; copy: LandingCopy["compare"] }) {
  if (value === true)
    return (
      <>
        <svg viewBox="0 0 20 20" aria-hidden="true" className="mx-auto size-5 text-[#15803d]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 10.5 3 3 7-7" />
        </svg>
        <span className="sr-only">{copy.included}</span>
      </>
    );
  if (value === false)
    return (
      <>
        <span aria-hidden="true" className="text-[#b6bcc6]">—</span>
        <span className="sr-only">{copy.notIncluded}</span>
      </>
    );
  return <span className="text-[13px] font-medium text-[#2b3442] sm:text-[14px]">{value}</span>;
}

function Compare({ copy }: { copy: LandingCopy }) {
  const c = copy.compare;
  return (
    <section aria-labelledby="rw-compare-heading" className="bg-[#f7f7f8] pb-20 lg:pb-28">
      <Wrap className="max-w-[1080px]">
        <h2 id="rw-compare-heading" className={cn("text-center font-display text-[26px] leading-tight font-normal tracking-[-0.02em] sm:text-[32px]", INK)}>
          {c.title}
        </h2>
        <div
          role="region"
          aria-label={c.caption}
          tabIndex={0}
          className="relative mt-10 overflow-x-auto rounded-[20px] bg-white ring-1 ring-black/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">{c.caption}</caption>
            <thead>
              <tr className="border-b border-black/[0.08]">
                <th scope="col" className="sticky left-0 z-10 bg-white px-5 py-5 text-[13px] font-semibold text-[#5b6472]">
                  {c.feature}
                </th>
                {restaurantPlans.map((plan) => (
                  <th key={plan.id} scope="col" className={cn("w-[22%] px-3 py-5 text-center", plan.id === "growth" && "bg-brand-50")}>
                    <span className={cn("block text-[15px] font-semibold", INK)}>{plan.name}</span>
                    <span className={cn("mt-1 block text-[12px] font-normal tabular-nums", MUTED)}>
                      {formatSetup(plan.setup)} + {formatMonthly(plan.monthly)}
                      {copy.pricing.perMonth}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {c.groups.map((g) => (
              <tbody key={g.title}>
                <tr>
                  <th colSpan={4} scope="colgroup" className="bg-[#f7f7f8] px-5 py-3 text-[12px] font-semibold tracking-[0.06em] text-[#5b6472] uppercase">
                    {g.title}
                  </th>
                </tr>
                {g.rows.map((row) => (
                  <tr key={row.label} className="border-t border-black/[0.05]">
                    <th scope="row" className="sticky left-0 z-10 bg-white px-5 py-4 text-[14px] font-normal text-[#2b3442]">
                      {row.label}
                      {row.external && <span className="ml-1 font-semibold text-[#c2410c]">*</span>}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className={cn("px-3 py-4 text-center", i === 1 && "bg-brand-50/60")}>
                        <Cell value={v} copy={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
        <p className={cn("mt-5 text-center text-[13px]", MUTED)}>{c.externalLegend}</p>
      </Wrap>
    </section>
  );
}

/* ── Downtown Doral ──────────────────────────────────────────────────────── */

function Highlight({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        part.startsWith("[") ? (
          <span key={i} className="text-[#f5a524]">
            {part.slice(1, -1)}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Doral({ copy }: { copy: LandingCopy }) {
  const d = copy.doral;
  return (
    <section aria-labelledby="rw-doral-heading" className="bg-[#f7f7f8] px-2 pb-20 lg:pb-28">
      <div className="overflow-hidden rounded-[20px] bg-[#0b1530] text-white lg:grid lg:grid-cols-[1.15fr_1fr]">
        <div className="px-6 py-16 sm:px-12 lg:px-16 lg:py-20">
          <p className="inline-flex items-center gap-2 text-[13px] font-medium text-[#f5a524]">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
            </svg>
            {d.kicker}
          </p>
          <h2 id="rw-doral-heading" className="mt-5 max-w-[560px] font-display text-[30px] leading-[1.15] font-normal tracking-[-0.025em] text-current lg:text-[40px]">
            {d.title}
          </h2>
          <p className="mt-6 max-w-[560px] text-[16px] leading-[1.65] text-white/80">{d.body}</p>
          <ul className="mt-8 grid max-w-[560px] gap-3 sm:grid-cols-2">
            {d.points.map((pt) => (
              <li key={pt} className="flex gap-3 text-[15px] text-white/90">
                <Tick onBlue />
                {pt}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[440px] text-[15px] leading-[1.55] text-white/85">
            <Highlight text={d.aside} />
          </p>
          <a
            href="#review"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-center text-[15px] font-semibold text-[#0b1530] transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {d.cta}
          </a>
        </div>
        <div className="relative min-h-[300px] lg:min-h-full">
          <Image
            src="/restaurant/diners.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-[40%_50%]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,#0b1530,transparent_35%)] max-lg:bg-[linear-gradient(180deg,#0b1530,transparent_35%)]" />
        </div>
      </div>
    </section>
  );
}

/* ── Free review ─────────────────────────────────────────────────────────── */

function ReviewSection({ copy, locale }: { copy: LandingCopy; locale: Locale }) {
  const f = copy.form;
  return (
    <section id="review" aria-labelledby="rw-review-heading" className="relative scroll-mt-20 bg-[#f7f7f8] pb-20 lg:pb-28">
      {/* Targets for the plan cards' "Choose …" links; the form reads the hash. */}
      {restaurantPlans.map((p) => (
        <span key={p.id} id={`review-${p.id}`} className="absolute top-0 scroll-mt-20" />
      ))}
      <Wrap className="grid gap-12 lg:max-w-[1200px] lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="min-w-0 lg:pt-4">
          <Label>{f.label}</Label>
          <h2 id="rw-review-heading" className={cn("mt-4 font-display text-[32px] leading-[1.12] font-normal tracking-[-0.025em] lg:text-[42px]", INK)}>
            {f.title}
          </h2>
          <p className={cn("mt-5 text-[16px] leading-[1.65]", MUTED)}>{f.intro}</p>
          <h3 className={cn("mt-9 text-[14px] font-semibold", INK)}>{f.reviewTitle}</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {f.reviewItems.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] leading-[1.5] text-[#2b3442]">
                <Tick />
                {item}
              </li>
            ))}
          </ul>
          <div className="relative mt-10 hidden aspect-[16/10] overflow-hidden rounded-2xl lg:block">
            <Image src="/restaurant/reserved.jpg" alt="" fill sizes="440px" className="object-cover" />
          </div>
          <p className={cn("mt-8 text-[15px]", MUTED)}>
            {f.contactLine}{" "}
            <a href={company.phoneHref} className="font-semibold text-primary underline-offset-4 hover:underline">
              {company.phone}
            </a>
          </p>
        </div>
        <div className="min-w-0">
          <ReviewForm copy={f} locale={locale} phone={company.phone} phoneHref={company.phoneHref} salesHref={billing.sales} />
        </div>
      </Wrap>
    </section>
  );
}
