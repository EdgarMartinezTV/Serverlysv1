import Link from "next/link";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { PATHS, type Locale } from "../_i18n";
import { HtmlLang } from "../_components/html-lang";
import { DEMO_COPY } from "./copy";
import { LumbreApp } from "./lumbre-app";

/**
 * /restaurant-websites/demo and /es/restaurant-websites/demo.
 *
 * Framed by Serverlys on both ends — a demo bar on top that says plainly the
 * restaurant is fictional, and a pitch band underneath — with the Lumbre site
 * between them in its own brand. The site header and footer stay Serverlys'.
 */
export function DemoPage({ locale }: { locale: Locale }) {
  const c = DEMO_COPY[locale];
  const paths = PATHS[locale];
  const other: Locale = locale === "en" ? "es" : "en";
  return (
    <div lang={locale}>
      {locale !== "en" && <HtmlLang lang={locale} />}

      <aside aria-label={c.bar.badge} className="bg-primary text-white">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-5 py-3 text-[13px] sm:px-8 lg:flex-row lg:items-center lg:gap-6">
          <p className="flex items-start gap-2.5 lg:items-center">
            <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold tracking-[0.04em] text-primary uppercase">
              {c.bar.badge}
            </span>
            <span className="text-white/90">{c.bar.text}</span>
          </p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2 font-semibold lg:ml-auto lg:shrink-0">
            <Link href={paths.landing} className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              ← {c.bar.back}
            </Link>
            <Link
              href={PATHS[other].demo}
              hrefLang={other}
              lang={other}
              aria-label={c.bar.switchAria}
              className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {c.bar.switchLabel}
            </Link>
            <Link
              href={`${paths.landing}#review`}
              className="rounded-full bg-white px-3.5 py-1.5 text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {c.bar.cta}
            </Link>
          </p>
        </div>
      </aside>

      <LumbreApp locale={locale} />

      <section aria-labelledby="rw-pitch-heading" className="bg-white px-2 py-2">
        <div className="relative isolate overflow-hidden rounded-[20px] bg-[#0b1530] px-6 py-16 text-center text-white sm:py-20">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(40%_70%_at_50%_0%,rgb(0_0_255/0.45),transparent_70%)]" />
          <p className="text-[13px] font-medium text-white/70">{c.pitch.label}</p>
          <h2 id="rw-pitch-heading" className="mx-auto mt-4 max-w-[640px] font-display text-[32px] leading-[1.12] font-normal tracking-[-0.025em] text-current sm:text-[44px]">
            {c.pitch.title}
          </h2>
          <p className="mx-auto mt-5 max-w-[520px] text-[16px] leading-[1.6] text-white/75">{c.pitch.body}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`${paths.landing}#review`}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-7 text-center text-[15px] font-semibold text-[#0b1530] hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {c.pitch.review}
            </Link>
            <Link
              href={`${paths.landing}#plans`}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full px-7 text-[15px] font-semibold text-white ring-1 ring-inset ring-white/35 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {c.pitch.plans}
            </Link>
          </div>
        </div>
      </section>

      <PageBreadcrumbs
        trail={[
          { name: c.breadcrumb.home, path: "/" },
          { name: c.breadcrumb.landing, path: paths.landing },
          { name: c.breadcrumb.page, path: paths.demo },
        ]}
      />
    </div>
  );
}
