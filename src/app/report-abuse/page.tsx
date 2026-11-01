import Link from "next/link";
import { Grid, Headline } from "@/components/ref/kit";
import { Faqs } from "@/components/ref/faqs";
import { JsonLd } from "@/components/ui/json-ld";
import { company, emailDisplay } from "@/data/company";
import { faqGraph, pageMetadata } from "@/lib/seo";
import { CATEGORIES, FAQ_HEAD, FAQS, HERO, NEXT, RELATED, TIPS } from "./_content";
import { AbuseForm } from "./_components/abuse-form";
import { AbuseIcon } from "./_components/abuse-icon";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

/**
 * Report abuse.
 *
 * The FORM is the original two-step wizard, untouched (Edgar, 2026-10-31:
 * "Keep the original form"). The PAGE around it is the upgrade:
 *
 *   1. Header + the form in a card, with "What happens next" beside it.
 *      The form stays the first thing below the header on every width.
 *   2. What you can report: the categories in plain words.
 *   3. How to send a report we can act on, plus what we cannot do.
 *   4. FAQ (with matching FAQPage schema).
 *   5. Related policies.
 *
 * The form emails the abuse inbox via /api/report-abuse. See _components/abuse-form.
 */

const PATH = "/report-abuse";

export const metadata = pageMetadata({
  title: "Report Abuse | Serverlys",
  description:
    "Report phishing, malware, spam, copyright infringement or other abuse originating from a Serverlys service. No account needed, and a person reads every report.",
  path: PATH,
});

function Tick({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} shrink-0 text-primary`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function ReportAbusePage() {
  return (
    <div className="[&_h1]:text-wrap [&_h2]:text-wrap [&_h3]:text-wrap [&_p]:text-wrap">
      <JsonLd data={faqGraph(FAQS, PATH)} />

      {/* 1 · Header + form */}
      <section aria-labelledby="ra-heading" className="relative isolate overflow-hidden bg-canvas pt-12 pb-16 md:pt-16 md:pb-20 xl:pb-24">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(60%_70%_at_50%_0%,rgb(0_0_255/0.08),transparent_72%)]" />
        <Grid>
          <header className="mx-auto max-w-[760px] text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[13px] leading-5 font-semibold text-primary">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-2.5Z" />
              </svg>
              {HERO.eyebrow}
            </p>
            <h1 id="ra-heading" className="display-lg mt-4 text-fg">
              {HERO.title}
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-body text-fg-secondary">
              {HERO.lede}{" "}
              <a
                href={`mailto:${company.email}?subject=Abuse%20report`}
                className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
              >
                {emailDisplay}
              </a>
              .
            </p>
            <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {HERO.chips.map((c) => (
                <li key={c} className="flex items-center gap-2 text-small font-medium text-fg">
                  <Tick />
                  {c}
                </li>
              ))}
            </ul>
          </header>

          <div className="mx-auto mt-10 grid max-w-[1120px] gap-8 md:mt-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:gap-10">
            <div className="min-w-0">
              {/* The original form, unchanged; its own top margin and width cap are neutralised by the card. */}
              <div className="rounded-2xl bg-surface p-6 ring-1 ring-line ring-inset md:p-10 [&>*]:mt-0 [&>*]:max-w-none">
                <AbuseForm />
              </div>
              <p className="mt-4 flex items-start gap-2 px-1 text-small text-fg-muted">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-error" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 8v4.5M12 15.5h.01" />
                </svg>
                {HERO.emergency}
              </p>
            </div>

            <aside aria-labelledby="ra-next" className="rounded-2xl bg-canvas-secondary p-6 lg:sticky lg:top-24">
              <h2 id="ra-next" className="text-body font-semibold text-fg">{NEXT.title}</h2>
              <ol className="mt-5 flex flex-col">
                {NEXT.steps.map((s, i, all) => (
                  <li key={s.t} className="relative flex gap-3.5 pb-5 last:pb-0">
                    {i < all.length - 1 && <span aria-hidden="true" className="absolute top-7 bottom-0 left-[13px] w-px bg-line-strong" />}
                    <span aria-hidden="true" className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-surface text-[12px] font-semibold text-primary ring-1 ring-line ring-inset">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">
                      <span className="block text-small font-semibold text-fg">{s.t}</span>
                      <span className="mt-0.5 block text-small leading-5 text-fg-secondary">{s.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <Link href="/abuse-handling-policy" className="group mt-6 inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:text-primary-hover">
                Read the full process
                <Arrow />
              </Link>
            </aside>
          </div>
        </Grid>
      </section>

      {/* 2 · What you can report */}
      <section aria-labelledby="ra-cats" className="bg-canvas-secondary py-16 md:py-20 xl:py-24">
        <Grid>
          <Headline id="ra-cats" title={CATEGORIES.title} description={CATEGORIES.description} />
          <ul className="mx-auto mt-10 grid max-w-[1280px] gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:mt-12">
            {CATEGORIES.items.map((c) => (
              <li key={c.t} className="flex flex-col rounded-2xl bg-surface p-6 ring-1 ring-line ring-inset">
                <span aria-hidden="true" className={`flex size-11 items-center justify-center rounded-xl ${c.icon === "shield" ? "bg-error-soft text-error" : "bg-primary-soft text-primary"}`}>
                  <AbuseIcon name={c.icon} className="size-[22px]" />
                </span>
                <h3 className="mt-4 text-[17px] leading-6 font-semibold text-fg">{c.t}</h3>
                <p className="mt-1.5 text-small leading-5 text-fg-secondary">{c.d}</p>
              </li>
            ))}
          </ul>
        </Grid>
      </section>

      {/* 3 · Tips + limits */}
      <section aria-labelledby="ra-tips" className="bg-canvas py-16 md:py-20 xl:py-24">
        <Grid>
          <Headline id="ra-tips" title={TIPS.title} description={TIPS.description} />
          <div className="mx-auto mt-10 grid max-w-[1120px] gap-6 md:mt-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            <ol className="grid gap-4 sm:grid-cols-2">
              {TIPS.items.map((t, i) => (
                <li key={t.t} className="rounded-2xl bg-canvas-secondary p-6">
                  <span aria-hidden="true" className="font-mono text-[13px] font-semibold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-[17px] leading-6 font-semibold text-fg">{t.t}</h3>
                  <p className="mt-1.5 text-small leading-5 text-fg-secondary">{t.d}</p>
                </li>
              ))}
            </ol>
            <div className="rounded-2xl p-6 ring-1 ring-line ring-inset md:p-8">
              <h3 className="text-[17px] leading-6 font-semibold text-fg">{TIPS.limits.title}</h3>
              <ul className="mt-4 flex flex-col gap-4">
                {TIPS.limits.items.map((t) => (
                  <li key={t} className="flex gap-3 text-small leading-5 text-fg-secondary">
                    <span aria-hidden="true" className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-canvas-secondary">
                      <span className="block h-px w-2 bg-fg-muted" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Grid>
      </section>

      {/* 4 · FAQ */}
      <Faqs
        idPrefix="ra"
        size="lg"
        title={FAQ_HEAD.title}
        description={FAQ_HEAD.description}
        items={FAQS.map((f) => ({ q: f.question, a: [{ type: "p" as const, runs: [{ text: f.answer }] }] }))}
      />

      {/* 5 · Related policies */}
      <section aria-labelledby="ra-related" className="bg-canvas py-16 md:py-20">
        <Grid>
          <h2 id="ra-related" className="mx-auto max-w-[1120px] text-[24px] leading-8 font-semibold tracking-[-0.2px] text-fg">
            {RELATED.title}
          </h2>
          <ul className="mx-auto mt-6 grid max-w-[1120px] gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RELATED.items.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex h-full items-start justify-between gap-4 rounded-2xl p-5 ring-1 ring-line ring-inset transition-colors hover:bg-canvas-secondary hover:ring-line-strong"
                >
                  <span>
                    <span className="block text-body font-semibold text-fg group-hover:text-primary">{l.label}</span>
                    <span className="mt-1 block text-small leading-5 text-fg-secondary">{l.d}</span>
                  </span>
                  <span className="mt-1 text-fg-muted group-hover:text-primary">
                    <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Grid>
      </section>

      <PageBreadcrumbs trail={[
          { name: "Home", path: "/" },
          { name: "Report abuse", path: PATH },
        ]} />
    </div>
  );
}
