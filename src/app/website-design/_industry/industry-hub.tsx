import Link from "next/link";
import type { Metadata } from "next";
import { Band } from "../../hosting/_components/band";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { HtmlLang } from "@/app/restaurant-websites/_components/html-lang";
import { breadcrumbGraph, canonical, pageMetadata } from "@/lib/seo";
import { breadcrumbTrail } from "@/data/routes";
import { INDUSTRY_HUB, industries, industryPath } from "@/data/industries";
import type { Locale } from "@/data/industries/types";

/**
 * Index of every industry website page, in each language. Also lists the two
 * industries built before this template existed (restaurants, cleaning), which
 * have their own richer pages and URLs.
 */
const COPY = {
  en: {
    title: "Website Design by Industry | Serverlys",
    description: "Websites designed for your trade: salons, law firms, contractors, dentists, accountants and more, each built around what that business needs.",
    h1: "Website design for your industry",
    lede: "Every trade needs different things from a website. Pick yours to see what we build for it and what it costs.",
    extra: [
      { href: "/restaurant-websites", name: "Restaurants" },
      { href: "/cleaning-company-websites", name: "Cleaning companies" },
    ],
  },
  es: {
    title: "Diseño web por sector | Serverlys",
    description: "Sitios web diseñados para su sector: salones, bufetes, contratistas, dentistas, contadores y más, cada uno construido según lo que necesita ese negocio.",
    h1: "Diseño web para su sector",
    lede: "Cada sector necesita cosas distintas de un sitio web. Elija el suyo para ver qué construimos y cuánto cuesta.",
    extra: [
      { href: "/es/restaurant-websites", name: "Restaurantes" },
      { href: "/es/cleaning-company-websites", name: "Empresas de limpieza" },
    ],
  },
} as const;

export function hubMetadata(locale: Locale): Metadata {
  const c = COPY[locale];
  const meta = pageMetadata({ title: c.title, description: c.description, path: INDUSTRY_HUB[locale] });
  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      languages: {
        "en-US": canonical(INDUSTRY_HUB.en),
        "es-US": canonical(INDUSTRY_HUB.es),
        "x-default": canonical(INDUSTRY_HUB.en),
      },
    },
  };
}

export function IndustryHub({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const items = [
    ...industries.map((i) => ({ href: industryPath(i.slug, locale), name: i[locale].name })),
    ...c.extra,
  ].sort((a, b) => a.name.localeCompare(b.name, locale));
  return (
    <>
      {locale !== "en" && <HtmlLang lang={locale} />}
      <JsonLd data={breadcrumbGraph(breadcrumbTrail(INDUSTRY_HUB[locale]))} />
      <Band tone="dark" labelledBy="hub-heading">
        <div className="mx-auto max-w-[760px] text-center">
          <h1 id="hub-heading" className="display-lg text-white">{c.h1}</h1>
          <p className="mx-auto mt-5 max-w-[60ch] text-body-lg text-fg-on-dark-secondary">{c.lede}</p>
        </div>
      </Band>
      <Band labelledBy="hub-list">
        <h2 id="hub-list" className="sr-only">{c.h1}</h2>
        <ul className="mx-auto grid max-w-[1080px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                className="flex h-full rounded-2xl bg-canvas-secondary p-5 text-body font-semibold text-fg transition-colors duration-fast hover:bg-brand-50"
              >
                {i.name}
              </Link>
            </li>
          ))}
        </ul>
      </Band>
      <PageBreadcrumbs trail={breadcrumbTrail(INDUSTRY_HUB[locale])} />
    </>
  );
}
