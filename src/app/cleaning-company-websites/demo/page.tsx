import Link from "next/link";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { DEMO_PATH, PATHS } from "../_i18n";
import { demoMetadata } from "../_seo";
import { BrisaSite } from "../_demo/brisa-site";

/**
 * /cleaning-company-websites/demo — Brisa Clean Co., a fictional cleaning
 * company website. Noindex (routes.ts + metadata); crawlable so the noindex is
 * seen. Framed by Serverlys above and below; the site between is the client's
 * brand. No bookings, payments or messages leave the browser.
 */
export const metadata = demoMetadata();

export default function CleaningDemoPage() {
  return (
    <div>
      <aside aria-label="Live demo" className="bg-primary text-white">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-5 py-3 text-[13px] sm:px-8 lg:flex-row lg:items-center lg:gap-6">
          <p className="flex items-start gap-2.5 lg:items-center">
            <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold tracking-[0.04em] text-primary uppercase">Demo by Serverlys</span>
            <span className="text-white/90">Brisa Clean Co. is a fictional company. Nothing here books, charges or sends a message.</span>
          </p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2 font-semibold lg:ml-auto lg:shrink-0">
            <Link href={PATHS.en.landing} className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              ← Cleaning company websites
            </Link>
            <Link href={`${PATHS.en.landing}#consultation`} className="rounded-full bg-white px-3.5 py-1.5 text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Get a free consultation
            </Link>
          </p>
        </div>
      </aside>

      <BrisaSite />

      <section aria-labelledby="cl-demo-pitch" className="bg-white px-2 py-2">
        <div className="relative isolate overflow-hidden rounded-[20px] bg-[#0b1530] px-6 py-16 text-center text-white sm:py-20">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(40%_70%_at_50%_0%,rgb(0_0_255/0.45),transparent_70%)]" />
          <p className="text-[13px] font-medium text-white/70">Built by Serverlys</p>
          <h2 id="cl-demo-pitch" className="mx-auto mt-4 max-w-[680px] font-display text-[32px] leading-[1.12] font-normal tracking-[-0.025em] text-current sm:text-[44px]">
            Want a website like this for your cleaning company?
          </h2>
          <p className="mx-auto mt-5 max-w-[520px] text-[16px] leading-[1.6] text-white/75">
            Quote requests, booking, service pages and English/Spanish, designed around your business and your service area.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={`${PATHS.en.landing}#consultation`} className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-[#0b1530] hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Get a Free Consultation
            </Link>
            <Link href={`${PATHS.en.landing}#pricing`} className="inline-flex min-h-[52px] items-center justify-center rounded-full px-7 text-[15px] font-semibold text-white ring-1 ring-inset ring-white/35 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              See pricing
            </Link>
          </div>
        </div>
      </section>

      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Cleaning company websites", path: PATHS.en.landing },
          { name: "Live demo", path: DEMO_PATH },
        ]}
      />
    </div>
  );
}
