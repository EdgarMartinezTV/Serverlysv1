"use client";
import es from "./es-client.json";
import { DictContext } from "./context";

/**
 * Spanish strings for browser components. Only the /es layout renders this, so
 * the dictionary chunk is downloaded on Spanish pages only — English pages never
 * load it. es-client.json is the subset of i18n/es.json that browser components
 * (and the data they render) use; scripts/i18n/build-dicts.mjs writes both.
 */
export function SpanishProvider({ children }: { children: React.ReactNode }) {
  return <DictContext value={es as Record<string, string>}>{children}</DictContext>;
}
