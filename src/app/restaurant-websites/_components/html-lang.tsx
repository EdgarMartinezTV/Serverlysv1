"use client";

import { useEffect } from "react";

/**
 * Sets <html lang> for a page whose language differs from the root layout's
 * "en". The root layout cannot know the route without making every page
 * dynamic, so the Spanish pages also wrap their content in an element with
 * lang="es" — that is what assistive tech reads during SSR and before
 * hydration; this keeps the document-level attribute truthful once the page
 * is live, and restores it on the way out.
 */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.lang;
    root.lang = lang;
    return () => {
      root.lang = previous;
    };
  }, [lang]);
  return null;
}
