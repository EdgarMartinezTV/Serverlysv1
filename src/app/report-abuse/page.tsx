import Link from "next/link";
import { Grid } from "@/components/ref/kit";
import { company, emailDisplay } from "@/data/company";
import { pageMetadata } from "@/lib/seo";
import { ASIDE, HERO } from "./_content";
import { AbuseForm } from "./_components/abuse-form";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

/**
 * Report abuse.
 *
 * The form is the page: it sits directly under a short centred header, with
 * no marketing above it. Someone reporting phishing is having a bad day and is
 * usually not a customer. The aside next to it answers the two questions
 * people ask before they bother (what happens next, and what we cannot do)
 * using the same aims-not-guarantees wording as /abuse-handling-policy.
 *
 * On mobile the aside follows the form, so the form is still the first thing
 * below the header.
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

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export default function ReportAbusePage() {
  return (
    <div className="[&_h1]:text-wrap [&_h2]:text-wrap [&_p]:text-wrap">
      <section aria-labelledby="ra-heading" className="relative isolate overflow-hidden bg-canvas pt-12 pb-16 md:pt-16 md:pb-20 xl:pb-24">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_70%_at_50%_0%,rgb(0_0_255/0.08),transparent_72%)]" />
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
            <p className="mx-auto mt-4 max-w-[680px] text-body text-fg-secondary">
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
                  <Check />
                  {c}
                </li>
              ))}
            </ul>
          </header>

          <div className="mx-auto mt-10 grid max-w-[1120px] gap-8 md:mt-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:gap-10">
            <div className="min-w-0">
              <AbuseForm />
              <p className="mt-4 flex items-start gap-2 px-1 text-small text-fg-muted">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-error" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 8v4.5M12 15.5h.01" />
                </svg>
                {HERO.emergency}
              </p>
            </div>

            <aside aria-label="About abuse reports" className="flex flex-col gap-4 lg:sticky lg:top-24">
              <div className="rounded-2xl bg-canvas-secondary p-6">
                <h2 className="text-body font-semibold text-fg">{ASIDE.next.title}</h2>
                <ol className="mt-5 flex flex-col">
                  {ASIDE.next.steps.map((s, i, all) => (
                    <li key={s.t} className="relative flex gap-3.5 pb-5 last:pb-0">
                      {i < all.length - 1 && (
                        <span aria-hidden="true" className="absolute top-7 bottom-0 left-[13px] w-px bg-line-strong" />
                      )}
                      <span aria-hidden="true" className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-surface text-[12px] font-semibold text-primary ring-1 ring-inset ring-line">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">
                        <span className="block text-small font-semibold text-fg">{s.t}</span>
                        <span className="mt-0.5 block text-small leading-5 text-fg-secondary">{s.d}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl p-6 ring-1 ring-inset ring-line">
                <h2 className="text-body font-semibold text-fg">{ASIDE.limits.title}</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {ASIDE.limits.items.map((t) => (
                    <li key={t} className="flex gap-2.5 text-small leading-5 text-fg-secondary">
                      <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-fg-muted" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <nav aria-label={ASIDE.links.title} className="rounded-2xl p-6 ring-1 ring-inset ring-line">
                <h2 className="text-body font-semibold text-fg">{ASIDE.links.title}</h2>
                <ul className="mt-3 -mx-2 flex flex-col">
                  {ASIDE.links.items.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="group flex min-h-10 items-center justify-between gap-2 rounded-md px-2 text-small font-medium text-fg hover:bg-canvas-secondary hover:text-primary"
                      >
                        {l.label}
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 text-fg-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9 6 6 6-6 6" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        </Grid>
      </section>
      <PageBreadcrumbs trail={[
          { name: "Home", path: "/" },
          { name: "Report abuse", path: PATH },
        ]} />
    </div>
  );
}
