import { isSpanish, t } from "@/i18n/t";

/**
 * Renders a structured-data block.
 *
 * JSON.stringify output is escaped for `<` so a string in the data cannot
 * close the script tag early. Data here is authored by us, never user input,
 * but the escape is cheap and removes the class of bug entirely.
 *
 * On /es pages the text values (names, descriptions, FAQ answers) go through
 * the Spanish dictionary; identifiers, types and URLs are left exactly as they
 * are, so the @id-linked entity graph stays one graph across both languages.
 */
function translate(v: unknown, key = ""): unknown {
  if (typeof v === "string") return key.startsWith("@") || /^https?:\/\//.test(v) ? v : t(v);
  if (Array.isArray(v)) return v.map((x) => translate(x, key));
  if (v && typeof v === "object")
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === "inLanguage" ? x : translate(x, k)]));
  return v;
}

export function JsonLd({ data }: { data: object }) {
  const out = isSpanish() ? translate(data) : data;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(out).replace(/</g, "\\u003c"),
      }}
    />
  );
}
