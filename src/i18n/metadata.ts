import type { Metadata } from "next";
import { canonical, languagesFor } from "@/lib/seo";
import { esPath } from "./paths";
import { tr } from "./rsc";

/**
 * The Spanish twin of an English page's metadata: translated title and
 * description, its own /es canonical, the same reciprocal hreflang set, and
 * es_US Open Graph locale. The social card image is shared.
 */
export function esMetadata(en: Metadata, path: string): Metadata {
  const s = (v: unknown) => (typeof v === "string" ? tr(v, "es") : v);
  const title = typeof en.title === "object" && en.title && "absolute" in en.title
    ? { absolute: tr(en.title.absolute, "es") }
    : s(en.title);
  const url = canonical(esPath(path));
  const og = (en.openGraph ?? {}) as Record<string, unknown>;
  const tw = (en.twitter ?? {}) as Record<string, unknown>;
  return {
    ...en,
    title: title as Metadata["title"],
    description: s(en.description) as string,
    alternates: { canonical: url, languages: languagesFor(path) },
    openGraph: { ...og, title: s(og.title), description: s(og.description), url, locale: "es_US", alternateLocale: ["en_US"] } as Metadata["openGraph"],
    twitter: { ...tw, title: s(tw.title), description: s(tw.description) } as Metadata["twitter"],
  };
}
