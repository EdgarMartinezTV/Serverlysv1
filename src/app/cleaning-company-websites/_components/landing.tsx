import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { billing, company } from "@/data/company";
import { designFeatures, designOrderUrl, designPlans, formatDesignPrice } from "@/data/design-plans";
import { careFromPrice, carePlans } from "@/data/care-plans";
import { Reveal } from "@/components/animations/reveal";
import { Faqs, Heading, INK, Label, MUTED, Related, Tick, Wrap } from "@/components/retell/kit";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { HtmlLang } from "@/app/restaurant-websites/_components/html-lang";
import { DEMO_PATH, PATHS, type CleaningCopy, type Locale } from "../_i18n";
import { HeroShowcase } from "./hero-showcase";
import { Features } from "./features";
import { ConsultationForm } from "./consultation-form";
import { Track } from "./track";

/**
 * /cleaning-company-websites (+ /es) — the page for cleaning-company owners.
 *
 * Server-rendered top to bottom: the headline, every section's copy and the
 * FAQ are in the HTML. Client islands are the hero showcase (decorative), the
 * feature filter, the consultation form and click tracking.
 */
export function CleaningLanding({ copy, locale }: { copy: CleaningCopy; locale: Locale }) {
  const paths = PATHS[locale];
  return (
    <div lang={locale}>
      {locale !== "en" && <HtmlLang lang={locale} />}
      <Hero copy={copy} locale={locale} />
      <Why copy={copy} />
      <section aria-labelledby="cl-features-heading" className="bg-[#f7f7f8] py-20 lg:py-28">
        <Wrap className="max-w-[1200px]">
          <Label className="text-center">{copy.features.label}</Label>
          <Heading id="cl-features-heading">{copy.features.title}</Heading>
          <p className={cn("mx-auto mt-5 max-w-[620px] text-center text-[17px] leading-[1.6]", MUTED)}>{copy.features.intro}</p>
          <Features copy={copy.features} />
        </Wrap>
      </section>
      <DemoBand copy={copy} />
      <Industries copy={copy} />
      <Local copy={copy} />
      <Pricing copy={copy} />
      <Process copy={copy} />
      <Portfolio copy={copy} />
      {/* The kit's FAQ block has no top padding of its own (it follows a grey
          section elsewhere); here it follows a white one. */}
      <div className="bg-[#f7f7f8] pt-20 lg:pt-28">
        <Faqs id="cl-faq-heading" label={copy.faq.label} title={copy.faq.title} items={copy.faq.items} />
      </div>
      <FinalCta copy={copy} locale={locale} />
      <Related id="cl-related-heading" label={copy.related.label} items={copy.related.items} />
      <PageBreadcrumbs
        trail={[
          { name: copy.breadcrumb.home, path: "/" },
          { name: copy.breadcrumb.page, path: paths.landing },
        ]}
      />
      <MobileBar copy={copy} />
    </div>
  );
}

const BTN_PRIMARY =
  "inline-flex min-h-[54px] items-center justify-center rounded-full bg-primary px-7 text-center text-[16px] font-semibold text-white transition-colors duration-fast hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const BTN_GHOST =
  "group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-white px-7 text-[16px] font-semibold text-[#0b1530] ring-1 ring-inset ring-black/15 transition-colors duration-fast hover:ring-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const Arrow = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 transition-transform duration-normal group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10h12m-5-5 5 5-5 5" />
  </svg>
);

/* ── Hero ───────────────────────────────────────────────────────────────── */

function Hero({ copy, locale }: { copy: CleaningCopy; locale: Locale }) {
  const h = copy.hero;
  const other: Locale = locale === "en" ? "es" : "en";
  return (
    <section aria-labelledby="cl-hero-heading" className="relative isolate overflow-hidden bg-[#f6f8fc]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_85%_20%,rgb(0_0_255/0.13),transparent_70%),radial-gradient(45%_55%_at_5%_90%,rgb(52_211_153/0.16),transparent_70%),radial-gradient(30%_40%_at_60%_100%,rgb(56_189_248/0.12),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.5] [background-image:linear-gradient(rgb(11_21_48/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(11_21_48/0.05)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]"
      />
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 pt-10 pb-20 sm:px-8 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-10 lg:pt-16 lg:pb-24">
        <div className="max-w-[620px]">
          <div className="cl-in flex flex-wrap items-center gap-3 [--d:0ms]">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#2b3442] ring-1 ring-black/[0.07]">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#34d399]" />
              {h.kicker}
            </p>
            <Link
              href={PATHS[other].landing}
              hrefLang={other}
              lang={other}
              aria-label={copy.switchTo.aria}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-[#2b3442] underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
              </svg>
              {copy.switchTo.label}
            </Link>
          </div>
          <h1
            id="cl-hero-heading"
            className="cl-in mt-6 font-display text-[38px] leading-[1.06] font-semibold tracking-[-0.03em] text-[#0b1530] [--d:80ms] sm:text-[52px] xl:text-[60px]"
          >
            {h.title}
          </h1>
          <p className="cl-in mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#3b4452] [--d:160ms] sm:text-[19px]">{h.lede}</p>
          <div className="cl-in mt-9 flex flex-col gap-3 [--d:240ms] sm:flex-row sm:flex-wrap">
            <a href="#consultation" className={BTN_PRIMARY}>
              {h.ctaPrimary}
            </a>
            <Track event="demo_view" params={{ from: "hero", locale }}>
              <Link href={DEMO_PATH} className={BTN_GHOST}>
                {h.ctaDemo}
                <Arrow />
              </Link>
            </Track>
          </div>
          <ul className="cl-in mt-9 flex flex-wrap gap-x-5 gap-y-2.5 text-[14px] text-[#3b4452] [--d:320ms]">
            {h.points.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 text-[#059669]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 10.5 3 3 7-7" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <HeroShowcase mock={h.mock} />
      </div>
    </section>
  );
}

/* ── Why ────────────────────────────────────────────────────────────────── */

function Why({ copy }: { copy: CleaningCopy }) {
  const w = copy.why;
  return (
    <section aria-labelledby="cl-why-heading" className="bg-white py-20 lg:py-28">
      <Wrap className="max-w-[1200px]">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>{w.label}</Label>
            <h2 id="cl-why-heading" className={cn("mt-4 font-display text-[32px] leading-[1.12] font-normal tracking-[-0.025em] sm:text-[42px]", INK)}>
              {w.title}
            </h2>
            <p className={cn("mt-5 max-w-[480px] text-[17px] leading-[1.65]", MUTED)}>{w.intro}</p>
            <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[24px] lg:block">
              <Image src="/cleaning/window-cleaner.jpg" alt="A cleaner wiping a window in a home" fill sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
            </div>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {w.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 70} className="flex flex-col rounded-[20px] bg-[#f4f4f7] p-6 sm:min-h-[240px]">
                <span aria-hidden="true" className="font-display text-[13px] text-[#5b6472] tabular-nums">
                  0{i + 1}
                </span>
                <h3 className={cn("mt-6 text-[20px] leading-[1.2] font-semibold", INK)}>{item.title}</h3>
                <p className={cn("mt-3 text-[15px] leading-[1.6]", MUTED)}>{item.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Wrap>
    </section>
  );
}

/* ── Demo band ──────────────────────────────────────────────────────────── */

function DemoBand({ copy }: { copy: CleaningCopy }) {
  const d = copy.demo;
  return (
    <section aria-labelledby="cl-demo-heading" className="px-2 py-2">
      <div className="relative isolate overflow-hidden rounded-[20px] bg-[#0b1530] text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_80%_at_85%_30%,rgb(52_211_153/0.25),transparent_70%),radial-gradient(40%_60%_at_10%_100%,rgb(0_0_255/0.4),transparent_70%)]" />
        <Wrap className="grid items-center gap-12 py-16 lg:max-w-[1200px] lg:grid-cols-[1fr_1fr] lg:py-24">
          <div>
            <p className="text-[13px] font-medium text-white/70">{d.label}</p>
            <h2 id="cl-demo-heading" className="mt-4 font-display text-[32px] leading-[1.12] font-normal tracking-[-0.025em] text-current sm:text-[42px]">
              {d.title}
            </h2>
            <p className="mt-5 max-w-[500px] text-[17px] leading-[1.65] text-white/80">{d.body}</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {d.points.map((p) => (
                <li key={p} className="flex gap-3 text-[15px]">
                  <Tick onBlue />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <Track event="demo_view" params={{ from: "demo_band" }}>
                <Link href={DEMO_PATH} className="group inline-flex min-h-[54px] items-center gap-2 rounded-full bg-white px-7 text-[16px] font-semibold text-[#0b1530] hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  {d.cta}
                  <Arrow />
                </Link>
              </Track>
              <p className="mt-3 text-[13px] text-white/60">{d.note}</p>
            </div>
          </div>
          <Reveal className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] ring-1 ring-white/10">
              <Image src="/cleaning/pool-house.jpg" alt="" fill sizes="(min-width: 1024px) 560px, 90vw" className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgb(11_21_48/0.75)_100%)]" />
            </div>
            <div aria-hidden="true" className="absolute -bottom-6 left-6 w-[62%] rounded-[18px] bg-white p-5 text-[#0b1530] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.5)] sm:left-10">
              <p className="text-[12px] font-semibold tracking-[0.08em] text-[#0f766e] uppercase">Brisa Clean Co.</p>
              <p className="mt-1 text-[18px] font-semibold">{copy.hero.mock.quoteTitle}</p>
              <div className="mt-3 flex items-baseline justify-between border-t border-black/[0.08] pt-3">
                <span className="text-[13px] text-[#5b6472]">{copy.hero.mock.estimateLabel}</span>
                <span className="text-[22px] font-bold text-[#0f766e]">{copy.hero.mock.estimate}</span>
              </div>
            </div>
          </Reveal>
        </Wrap>
      </div>
    </section>
  );
}

/* ── Industries ─────────────────────────────────────────────────────────── */

function Industries({ copy }: { copy: CleaningCopy }) {
  const ind = copy.industries;
  return (
    <section aria-labelledby="cl-industries-heading" className="bg-white py-20 lg:py-28">
      <Wrap className="max-w-[1200px]">
        <Label className="text-center">{ind.label}</Label>
        <Heading id="cl-industries-heading">{ind.title}</Heading>
        <p className={cn("mx-auto mt-5 max-w-[620px] text-center text-[17px] leading-[1.6]", MUTED)}>{ind.intro}</p>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ind.items.map((item, i) => (
            <Reveal as="li" key={item.id} delay={(i % 4) * 60} className="group overflow-hidden rounded-[20px] bg-[#f4f4f7]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={item.photo} alt={item.alt} fill sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.7,0.1,1)] group-hover:scale-[1.06]" />
              </div>
              <div className="p-5">
                <h3 className={cn("text-[18px] leading-[1.25] font-semibold", INK)}>{item.title}</h3>
                <p className={cn("mt-2 text-[14px] leading-[1.6]", MUTED)}>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-[680px] rounded-xl bg-[#f4f4f7] px-5 py-4 text-center text-[14px] leading-[1.55] text-[#3b4452]">{ind.note}</p>
      </Wrap>
    </section>
  );
}

/* ── Miami-Dade local SEO ───────────────────────────────────────────────── */

function Local({ copy }: { copy: CleaningCopy }) {
  const l = copy.local;
  return (
    <section aria-labelledby="cl-local-heading" className="bg-[#f6f8fc] py-20 lg:py-28">
      <Wrap className="max-w-[1200px]">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Label>{l.label}</Label>
            <h2 id="cl-local-heading" className={cn("mt-4 font-display text-[32px] leading-[1.12] font-normal tracking-[-0.025em] sm:text-[42px]", INK)}>
              {l.title}
            </h2>
            <p className={cn("mt-5 max-w-[520px] text-[17px] leading-[1.65]", MUTED)}>{l.intro}</p>
            <ol className="mt-10 flex flex-col gap-5">
              {l.pillars.map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 60} className="grid grid-cols-[40px_1fr] gap-x-4">
                  <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-primary ring-1 ring-black/[0.07]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className={cn("text-[17px] font-semibold", INK)}>{p.title}</h3>
                    <p className={cn("mt-1 text-[15px] leading-[1.6]", MUTED)}>{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
          <div>
            <div className="rounded-[24px] bg-white p-6 ring-1 ring-black/[0.06] sm:p-8">
              <h3 className={cn("text-[20px] font-semibold", INK)}>{l.areasTitle}</h3>
              <p className={cn("mt-2 text-[15px] leading-[1.6]", MUTED)}>{l.areasIntro}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {l.areas.map((a) => (
                  <li key={a} className="rounded-full bg-[#f1f2f5] px-3 py-1.5 text-[13px] font-medium text-[#2b3442]">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <h3 className={cn("mt-10 text-[20px] font-semibold", INK)}>{l.insightsTitle}</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {l.insights.map((insight) => (
                <li key={insight.title} className="rounded-[18px] bg-white p-5 ring-1 ring-black/[0.06]">
                  <p className={cn("text-[16px] font-semibold", INK)}>{insight.title}</p>
                  <p className={cn("mt-1.5 text-[14px] leading-[1.6]", MUTED)}>{insight.body}</p>
                  {"source" in insight && insight.source && (
                    <a href={insight.source.href} target="_blank" rel="noopener" className="mt-1 inline-flex min-h-6 items-center text-[13px] font-medium text-primary underline underline-offset-2">
                      {insight.source.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-4 rounded-[18px] bg-[#0b1530] p-6 text-white">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-[#34d399]" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              </svg>
              <div>
                <p className="text-[16px] font-semibold">{l.visitTitle}</p>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-white/75">{l.visitBody}</p>
              </div>
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

/* ── Pricing ────────────────────────────────────────────────────────────── */

function Pricing({ copy }: { copy: CleaningCopy }) {
  const p = copy.pricing;
  return (
    <section id="pricing" aria-labelledby="cl-pricing-heading" className="scroll-mt-20 bg-white py-20 lg:py-28">
      <Wrap className="max-w-[1200px]">
        <Label className="text-center">{p.label}</Label>
        <Heading id="cl-pricing-heading">{p.title}</Heading>
        <p className={cn("mx-auto mt-5 max-w-[680px] text-center text-[17px] leading-[1.6]", MUTED)}>{p.intro}</p>
        <ul className="mt-14 grid gap-4 lg:grid-cols-3">
          {designPlans.map((plan, i) => {
            const featured = plan.id === "plus";
            return (
              <Reveal
                as="li"
                key={plan.id}
                delay={i * 80}
                className={cn("flex flex-col rounded-[24px] p-7 sm:p-8", featured ? "bg-primary text-white" : "bg-[#f4f4f7] text-[#0b1530]")}
              >
                <h3 className="text-[22px] font-semibold text-current">{plan.name}</h3>
                <p className={cn("mt-2 text-[14px] leading-[1.55]", featured ? "text-white/85" : "text-[#5b6472]")}>{p.fit[plan.id]}</p>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className={cn("text-[13px] font-medium", featured ? "text-white/85" : "text-[#5b6472]")}>{p.from}</span>
                  <span className="tabular text-[42px] leading-none font-semibold tracking-[-0.03em]">{formatDesignPrice(plan.price)}</span>
                  <span className={cn("text-[13px] font-medium", featured ? "text-white/85" : "text-[#5b6472]")}>{p.oneTime}</span>
                </p>
                <p className={cn("mt-6 text-[13px] font-semibold", featured ? "text-white/85" : "text-[#5b6472]")}>{p.includesTitle}</p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {designFeatures(plan).map((feat) => (
                    <li key={feat} className="flex gap-2.5 text-[15px]">
                      <Tick onBlue={featured} />
                      {p.includeLabels[feat] ?? feat.replace(/^(\d+) subpages$/, (_m, n) => p.subpages.replace("{n}", n))}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-col gap-2 pt-8">
                  <Track event="pricing_interaction" params={{ action: "order", plan_name: plan.id }}>
                    <a
                      href={designOrderUrl(plan)}
                      className={cn(
                        "inline-flex min-h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2",
                        featured ? "bg-white text-primary hover:bg-white/90 focus-visible:outline-white" : "bg-[#0b1530] text-white hover:bg-[#1a2647] focus-visible:outline-primary",
                      )}
                    >
                      {p.order.replace("{plan}", plan.name)}
                    </a>
                  </Track>
                  <Track event="pricing_interaction" params={{ action: "consult", plan_name: plan.id }}>
                    <a
                      href="#consultation"
                      className={cn(
                        "inline-flex min-h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold ring-1 ring-inset focus-visible:outline-2 focus-visible:outline-offset-2",
                        featured ? "ring-white/40 hover:bg-white/10 focus-visible:outline-white" : "ring-black/15 hover:ring-black/30 focus-visible:outline-primary",
                      )}
                    >
                      {p.consult.replace("{plan}", plan.name)}
                    </a>
                  </Track>
                </div>
              </Reveal>
            );
          })}
        </ul>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[24px] bg-[#f6f8fc] p-7 ring-1 ring-black/[0.05] sm:p-8">
            <h3 className={cn("text-[20px] font-semibold", INK)}>{p.addonsTitle}</h3>
            <p className={cn("mt-2 text-[15px] leading-[1.6]", MUTED)}>{p.addonsIntro}</p>
            <table className="mt-5 w-full text-left text-[15px]">
              <caption className="sr-only">{p.addonsTitle}</caption>
              <tbody>
                {p.addons.map((a) => (
                  <tr key={a.name} className="border-t border-black/[0.07]">
                    <th scope="row" className="py-3 pr-4 align-top font-semibold text-[#0b1530]">
                      {a.name}
                      <span className="block text-[13px] font-normal text-[#5b6472]">{a.detail}</span>
                    </th>
                    <td className="py-3 text-right align-top text-[14px] font-semibold whitespace-nowrap text-primary">{p.quote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Track event="pricing_interaction" params={{ action: "request_quote" }}>
              <a href="#consultation" className={cn(BTN_PRIMARY, "mt-6")}>
                {p.quote}
              </a>
            </Track>
          </div>
          <div className="flex flex-col rounded-[24px] bg-[#0b1530] p-7 text-white sm:p-8">
            <h3 className="text-[20px] font-semibold text-current">{p.careTitle}</h3>
            <p className="mt-2 text-[15px] leading-[1.6] text-white/80">{p.careBody.replace("{price}", `$${careFromPrice.toFixed(2)}`)}</p>
            <ul className="mt-6 flex flex-col divide-y divide-white/10 border-y border-white/10">
              {carePlans.map((plan) => (
                <li key={plan.id} className="flex items-baseline justify-between gap-4 py-3.5 text-[15px]">
                  <span className="font-medium">{plan.name}</span>
                  <span className="tabular-nums text-white/85">
                    ${plan.price.toFixed(2)}
                    {p.perMonth}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <Track event="pricing_interaction" params={{ action: "maintenance" }}>
                <Link href="/site-management" className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#0b1530] hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  {p.careCta}
                  <Arrow />
                </Link>
              </Track>
            </div>
          </div>
        </div>
        <p className={cn("mt-6 text-center text-[13px]", MUTED)}>{p.footnote}</p>
      </Wrap>
    </section>
  );
}

/* ── Process ────────────────────────────────────────────────────────────── */

function Process({ copy }: { copy: CleaningCopy }) {
  const pr = copy.process;
  return (
    <section aria-labelledby="cl-process-heading" className="bg-[#f7f7f8] py-20 lg:py-28">
      <Wrap className="max-w-[1200px]">
        <Label className="text-center">{pr.label}</Label>
        <Heading id="cl-process-heading">{pr.title}</Heading>
        <ol className="relative mt-16 grid gap-8 lg:grid-cols-5 lg:gap-5">
          <span aria-hidden="true" className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-[linear-gradient(90deg,#0000ff,#34d399)] opacity-40 lg:block" />
          {pr.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 110} className="relative grid grid-cols-[48px_1fr] gap-x-4 lg:block lg:text-center">
              <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-white text-[16px] font-semibold text-primary shadow-[0_10px_24px_-12px_rgb(0_0_255/0.5)] ring-1 ring-primary/20 lg:mx-auto">
                {i + 1}
              </span>
              <div>
                <h3 className={cn("text-[18px] font-semibold lg:mt-5", INK)}>{s.title}</h3>
                <p className={cn("mt-2 text-[14px] leading-[1.6]", MUTED)}>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Wrap>
    </section>
  );
}

/* ── Portfolio ──────────────────────────────────────────────────────────── */

function Portfolio({ copy }: { copy: CleaningCopy }) {
  const po = copy.portfolio;
  return (
    <section aria-labelledby="cl-portfolio-heading" className="bg-white py-20 lg:py-28">
      <Wrap className="max-w-[1200px]">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Label>{po.label}</Label>
            <h2 id="cl-portfolio-heading" className={cn("mt-4 font-display text-[32px] leading-[1.12] font-normal tracking-[-0.025em] sm:text-[42px]", INK)}>
              {po.title}
            </h2>
            <p className={cn("mt-5 max-w-[500px] text-[17px] leading-[1.65]", MUTED)}>{po.intro}</p>
            <Link href={po.moreHref} className="mt-6 inline-flex text-[15px] font-semibold text-primary underline-offset-4 hover:underline">
              {po.more} →
            </Link>
          </div>
          <Track event="demo_view" params={{ from: "portfolio" }}>
            <Link href={DEMO_PATH} className="group block overflow-hidden rounded-[24px] bg-[#f4f4f7] ring-1 ring-black/[0.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <span className="relative block aspect-[16/9] overflow-hidden">
                <Image src="/cleaning/home-exterior.jpg" alt="" fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
                <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-[#0b1530]">Demo</span>
              </span>
              <span className="block p-6">
                <span className={cn("block text-[20px] font-semibold", INK)}>{po.demoTitle}</span>
                <span className={cn("mt-2 block text-[15px] leading-[1.6]", MUTED)}>{po.demoBody}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-primary">
                  {po.demoCta}
                  <Arrow />
                </span>
              </span>
            </Link>
          </Track>
        </div>
      </Wrap>
    </section>
  );
}

/* ── Final CTA + form ───────────────────────────────────────────────────── */

function FinalCta({ copy, locale }: { copy: CleaningCopy; locale: Locale }) {
  const c = copy.cta;
  return (
    <section id="consultation" aria-labelledby="cl-cta-heading" className="scroll-mt-20 px-2 py-2">
      <div className="relative isolate overflow-hidden rounded-[20px] bg-[#0b1530] text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(45%_60%_at_15%_10%,rgb(0_0_255/0.45),transparent_70%),radial-gradient(40%_50%_at_90%_90%,rgb(52_211_153/0.22),transparent_70%)]" />
        <Wrap className="grid gap-12 py-16 lg:max-w-[1200px] lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-24">
          <div>
            <p className="text-[13px] font-medium text-white/70">{c.label}</p>
            <h2 id="cl-cta-heading" className="mt-4 font-display text-[36px] leading-[1.08] font-semibold tracking-[-0.03em] text-current sm:text-[48px]">
              {c.title}
            </h2>
            <p className="mt-5 max-w-[420px] text-[17px] leading-[1.65] text-white/80">{c.body}</p>
            <ul className="mt-8 flex flex-col gap-3">
              {c.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-[15px]">
                  <Tick onBlue />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-10 text-[15px] text-white/75">
              {c.call}{" "}
              <a href={company.phoneHref} className="font-semibold text-white underline underline-offset-4">
                {company.phone}
              </a>
            </p>
          </div>
          <ConsultationForm copy={copy.form} locale={locale} phone={company.phone} phoneHref={company.phoneHref} salesHref={billing.sales} />
        </Wrap>
      </div>
    </section>
  );
}

/* ── Mobile action bar ──────────────────────────────────────────────────── */

function MobileBar({ copy }: { copy: CleaningCopy }) {
  return (
    <div className="fixed bottom-3 left-3 right-[84px] z-30 flex gap-2 md:hidden">
      <a href="#consultation" className="flex h-12 flex-1 items-center justify-center rounded-full bg-primary text-[15px] font-semibold text-white shadow-[0_14px_30px_-10px_rgb(0_0_255/0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        {copy.mobileBar.consult}
      </a>
      <a href={company.phoneHref} className="flex h-12 items-center justify-center gap-1.5 rounded-full bg-[#0b1530] px-4 text-[15px] font-semibold text-white shadow-[0_14px_30px_-10px_rgb(11_21_48/0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
        {copy.mobileBar.call}
      </a>
    </div>
  );
}
