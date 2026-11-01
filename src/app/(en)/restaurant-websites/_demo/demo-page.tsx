import Link from "next/link";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { PATHS, type Locale } from "../_i18n";
import { HtmlLang } from "../_components/html-lang";
import { DEMO_COPY } from "./copy";
import { LUX_COPY } from "./copy-lux";
import { LumbreProvider } from "./state";
import { LumbreMotion } from "./lumbre-motion";
import { DemoBadge, LumbreHeader } from "./lumbre-header";
import { LumbreChef, LumbreFinale, LumbreFire, LumbreHero, LumbreStory } from "./lumbre-sections";
import { LumbreSignature } from "./lumbre-signature";
import { LumbreMenu } from "./lumbre-menu";
import { LumbrePrivate } from "./lumbre-private";
import { LumbreGallery } from "./lumbre-gallery";
import { LumbreReserve } from "./lumbre-reserve";
import { LumbreAssistant } from "./lumbre-assistant";
import { LumbreFooter } from "./lumbre-footer";
import { CartButton, CartDrawer } from "./lumbre-cart";
import { CHAR } from "./theme";

/**
 * /restaurant-websites/demo and /es/restaurant-websites/demo — "Lumbre".
 *
 * A cinematic restaurant site for a FICTIONAL restaurant, built to show
 * restaurant owners what Serverlys delivers. The Serverlys header and footer
 * step aside on this route (see the Lumbre block in globals.css); the demo
 * carries its own frame instead — a strip in the restaurant's header, a
 * floating "Demo by Serverlys" control, and the pitch band after the
 * restaurant's footer.
 *
 * Editorial sections are server components; the interactive ones (menu,
 * order, reservation, private-dining inquiry, gallery, concierge) are client
 * islands sharing LumbreProvider. Nothing on the page sends data anywhere.
 */
export function DemoPage({ locale }: { locale: Locale }) {
  const c = DEMO_COPY[locale];
  const lux = LUX_COPY[locale];
  const paths = PATHS[locale];

  return (
    <div lang={locale} data-lumbre="" className="font-display" style={{ background: CHAR }}>
      {locale !== "en" && <HtmlLang lang={locale} />}

      <LumbreProvider locale={locale}>
        <LumbreMotion />
        <LumbreHeader lux={lux} />
        <LumbreHero lux={lux} />
        <LumbreStory lux={lux} />
        <LumbreSignature lux={lux} />
        <LumbreMenu />
        <LumbreFire lux={lux} />
        <LumbreChef lux={lux} />
        <LumbrePrivate lux={lux} />
        <LumbreGallery lux={lux} />
        <LumbreReserve />
        <LumbreAssistant lux={lux.concierge} />
        <LumbreFinale lux={lux} />
        <LumbreFooter lux={lux} />
        <CartButton />
        <CartDrawer />
        <DemoBadge lux={lux} />
      </LumbreProvider>

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

      <div className="bg-white">
        <PageBreadcrumbs
          trail={[
            { name: c.breadcrumb.home, path: "/" },
            { name: c.breadcrumb.landing, path: paths.landing },
            { name: c.breadcrumb.page, path: paths.demo },
          ]}
        />
      </div>
    </div>
  );
}
