/**
 * Dictionary lookup that keeps leading/trailing whitespace of the English source.
 *
 * Exact match first. On a miss, the string's SHAPE is tried: every price, number
 * and short date ("$5.01", "37%", "1,399", "Dec 7") becomes {0}, {1}… so a
 * sentence built from live WHMCS prices ("$5.01/mo first month, then $7.95/mo")
 * matches one dictionary entry ("{0}/mo first month, then {1}/mo") whatever the
 * prices are this hour. Dates are re-ordered for Spanish ("Dec 7" → "7 dic").
 */
const TOKEN = /\$[\d,]+(?:\.\d+)?|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}\b|\d[\d,]*(?:\.\d+)?/g;
const MONTHS: Record<string, string> = {
  Jan: "ene", Feb: "feb", Mar: "mar", Apr: "abr", May: "may", Jun: "jun",
  Jul: "jul", Aug: "ago", Sep: "sept", Oct: "oct", Nov: "nov", Dec: "dic",
};

export function shapeOf(s: string): { shape: string; values: string[] } {
  const values: string[] = [];
  const shape = s.replace(TOKEN, (m) => `{${values.push(m) - 1}}`);
  return { shape, values };
}

function localiseToken(v: string): string {
  const d = v.match(/^([A-Z][a-z]{2}) (\d{1,2})$/);
  return d && MONTHS[d[1]] ? `${d[2]} ${MONTHS[d[1]]}` : v;
}

export function lookup(dict: Readonly<Record<string, string>> | null | undefined, v: string): string {
  if (!dict) return v;
  const k = v.trim();
  if (!k) return v;
  let hit = dict[k];
  if (hit === undefined) {
    const { shape, values } = shapeOf(k);
    if (!values.length) return v;
    const tpl = dict[shape];
    if (tpl === undefined) return v;
    hit = tpl.replace(/\{(\d+)\}/g, (m, i) => (values[+i] === undefined ? m : localiseToken(values[+i])));
  }
  const lead = v.slice(0, v.length - v.trimStart().length);
  const trail = v.slice(v.trimEnd().length);
  return lead + hit + trail;
}
