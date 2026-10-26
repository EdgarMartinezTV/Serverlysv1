import Link from "next/link";
import type { Metadata } from "next";
import { Band, Heading, Tick } from "../../hosting/_components/band";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { HtmlLang } from "@/app/restaurant-websites/_components/html-lang";
import { breadcrumbGraph, canonical, faqGraph, pageMetadata, serviceGraph } from "@/lib/seo";
import { breadcrumbTrail } from "@/data/routes";
import { billing } from "@/data/company";
import { designFeatures, designOrderUrl, designPlans, formatDesignPrice } from "@/data/design-plans";
import { industryBySlug, industryPath } from "@/data/industries";
import type { Industry, Locale } from "@/data/industries/types";

/**
 * Shared renderer for /website-design/<slug> and /es/website-design/<slug>.
 *
 * Everything trade-specific comes from data/industries/<slug>.ts; this file
 * only holds the section headings, in both languages. Prices are the real
 * design plans. Schema: Service with the plans as an OfferCatalog (no
 * LocalBusiness, address or ratings — same rules as the cleaning page),
 * FAQPage mirroring the visible FAQ, BreadcrumbList.
 */
const UI = {
  en: {
    needs: (n: string) => `What a website for ${n.toLowerCase()} needs`,
    needsLede: "Built into every site we design for your trade.",
    pages: "Pages we usually build",
    integrations: "Tools we connect",
    plans: "Plans and prices",
    plansLede: "One-time project prices, scoped in writing before you commit. Hosting is billed separately.",
    choose: "Choose",
    talk: "Talk to us first",
    start: "Start your website",
    related: "Websites for other trades",
    allIndustries: "All industries",
    lang: "Ver en español",
  },
  es: {
    needs: (n: string) => `Lo que necesita un sitio web para ${n.toLowerCase()}`,
    needsLede: "Incluido en cada sitio que diseñamos para su sector.",
    pages: "Páginas que solemos construir",
    integrations: "Herramientas que conectamos",
    plans: "Planes y precios",
    plansLede: "Precios únicos de proyecto, acordados por escrito antes de comprometerse. El hosting se cobra aparte.",
    choose: "Elegir",
    talk: "Hablar con nosotros primero",
    start: "Empezar su sitio web",
    related: "Sitios web para otros sectores",
    allIndustries: "Todos los sectores",
    lang: "View in English",
  },
} as const;

export function industryMetadata(industry: Industry, locale: Locale): Metadata {
  const copy = industry[locale];
  const meta = pageMetadata({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: industryPath(industry.slug, locale),
  });
  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      languages: {
        "en-US": canonical(industryPath(industry.slug, "en")),
        "es-US": canonical(industryPath(industry.slug, "es")),
        "x-default": canonical(industryPath(industry.slug, "en")),
      },
    },
    openGraph: { ...meta.openGraph, locale: locale === "es" ? "es_US" : "en_US" },
  };
}

export function IndustryPage({ industry, locale }: { industry: Industry; locale: Locale }) {
  const copy = industry[locale];
  const ui = UI[locale];
  const path = industryPath(industry.slug, locale);
  const other: Locale = locale === "en" ? "es" : "en";
  const faqs = copy.faq.map((f) => ({ ...f, scopes: [path] }));
  const related = industry.related
    .map((s) => industryBySlug(s))
    .filter((r): r is Industry => Boolean(r));

  const service = {
    ...serviceGraph({
      name: copy.h1,
      serviceType: copy.name,
      description: copy.metaDescription,
      path,
    }),
    inLanguage: locale,
    audience: { "@type": "BusinessAudience", audienceType: copy.name },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: ui.plans,
      itemListElement: designPlans.map((p) => ({
        "@type": "Offer",
        name: `Website design — ${p.name}`,
        url: designOrderUrl(p),
        price: p.price.toFixed(2),
        priceCurrency: "USD",
      })),
    },
  };

  return (
    <>
      {locale !== "en" && <HtmlLang lang={locale} />}
      <JsonLd data={service} />
      <JsonLd data={faqGraph(faqs, path)} />
      <JsonLd data={breadcrumbGraph(breadcrumbTrail(path))} />

      <Band tone="dark" labelledBy="ind-heading">
        <div className="mx-auto max-w-[800px] text-center">
          <p className="text-small font-semibold text-fg-on-dark-secondary">{copy.name}</p>
          <h1 id="ind-heading" className="display-lg mt-4 text-white">
            {copy.h1}
          </h1>
          <p className="mx-auto mt-5 max-w-[62ch] text-body-lg text-fg-on-dark-secondary">{copy.lede}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="#plans">{ui.start}</Button>
            <Button href={billing.sales} variant="inverseOutline">
              {ui.talk}
            </Button>
          </div>
          <p className="mt-6 text-small">
            <Link href={industryPath(industry.slug, other)} hrefLang={other} className="text-fg-on-dark-secondary underline underline-offset-4">
              {ui.lang}
            </Link>
          </p>
        </div>
      </Band>

      <Band labelledBy="ind-needs">
        <Heading id="ind-needs" title={ui.needs(copy.name)} lede={ui.needsLede} />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {copy.needs.map((n) => (
            <li key={n.title} className="rounded-2xl bg-canvas-secondary p-6">
              <h3 className="text-body-lg font-semibold text-fg">{n.title}</h3>
              <p className="mt-3 text-small text-fg-secondary">{n.text}</p>
            </li>
          ))}
        </ul>
      </Band>

      <Band tone="subtle" labelledBy="ind-pages">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="ind-pages" align="left" title={ui.pages} />
            <ul className="mt-8 flex flex-col gap-3">
              {copy.pages.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-body text-fg">
                  <Tick />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Heading id="ind-integrations" align="left" title={ui.integrations} />
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {copy.integrations.map((i) => (
                <li key={i} className="rounded-full bg-canvas px-4 py-2 text-small text-fg ring-1 ring-line">
                  {i}
                </li>
              ))}
            </ul>
            {copy.rules && (
              <div className="mt-10 rounded-2xl bg-brand-50 p-6">
                <h3 className="text-body-lg font-semibold text-fg">{copy.rules.title}</h3>
                <p className="mt-3 text-small text-fg-secondary">{copy.rules.text}</p>
              </div>
            )}
          </div>
        </div>
      </Band>

      <Band id="plans" labelledBy="ind-plans">
        <Heading id="ind-plans" title={ui.plans} lede={ui.plansLede} />
        <ul className="mx-auto mt-12 grid max-w-[1080px] gap-4 md:grid-cols-3">
          {designPlans.map((p) => (
            <li key={p.id} className="flex flex-col rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <h3 className="text-body-lg font-semibold text-fg">{p.name}</h3>
              <p className="mt-3 text-[2rem] font-semibold leading-none text-fg">{formatDesignPrice(p.price)}</p>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {designFeatures(p).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-small text-fg">
                    <Tick />
                    {f}
                  </li>
                ))}
              </ul>
              <Button href={designOrderUrl(p)} className="mt-6">
                {ui.choose} {p.name}
              </Button>
            </li>
          ))}
        </ul>
      </Band>

      <FaqSection items={faqs} />

      {related.length > 0 && (
        <Band tone="subtle" labelledBy="ind-related">
          <Heading id="ind-related" title={ui.related} />
          <ul className="mx-auto mt-10 grid max-w-[960px] gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={industryPath(r.slug, locale)}
                  className="flex h-full rounded-2xl bg-canvas p-5 text-body font-semibold text-fg ring-1 ring-line transition-colors duration-fast hover:bg-brand-50"
                >
                  {r[locale].name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-small">
            <Link href={locale === "es" ? "/es/website-design/industries" : "/website-design/industries"} className="text-primary underline underline-offset-4">
              {ui.allIndustries}
            </Link>
          </p>
        </Band>
      )}

      <PageBreadcrumbs trail={breadcrumbTrail(path)} />
    </>
  );
}
