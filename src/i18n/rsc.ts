import es from "./es.json";
import { rscStore } from "./t";
import { lookup } from "./lookup";

/** Server-only: mark the current render as Spanish (call in every /es layout AND page). */
export type Locale = "en" | "es";
export function setLocale(locale: Locale) {
  if (rscStore) rscStore().dict = locale === "es" ? (es as Record<string, string>) : null;
}
/** Locale-explicit lookup, for metadata and JSON-LD built outside the render tree. */
export function tr(v: string, locale: Locale): string {
  return locale === "es" ? lookup(es as Record<string, string>, v) : v;
}
