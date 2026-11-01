"use client";
import { useEffect } from "react";
import es from "./es-client.json";
import { DictContext } from "./context";
import { syncWhmcsLanguage } from "@/components/navigation/language-selector";

/**
 * Spanish strings for browser components. Only the /es layout renders this, so
 * the dictionary chunk is downloaded on Spanish pages only — English pages never
 * load it. es-client.json is the subset of i18n/es.json that browser components
 * (and the data they render) use; scripts/i18n/build-dicts.mjs writes both.
 *
 * Opening a Spanish page is choosing Spanish, so the client area and checkout
 * (WHMCS, same origin) are switched to Spanish once per browser session.
 */
export function SpanishProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("sv-whmcs-lang") === "spanish") return;
      sessionStorage.setItem("sv-whmcs-lang", "spanish");
    } catch {
      /* storage blocked — sync anyway */
    }
    syncWhmcsLanguage("spanish");
  }, []);
  return <DictContext value={es as Record<string, string>}>{children}</DictContext>;
}
