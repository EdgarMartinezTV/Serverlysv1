import "server-only";

export const RANGES = { "7d": 7, "30d": 30, "90d": 90 } as const;
export type RangeKey = keyof typeof RANGES | "custom";

/** Parse ?range=7d|30d|90d or ?from=YYYY-MM-DD&to=YYYY-MM-DD (UTC days, `to` inclusive). */
export function parseRange(sp: { range?: string; from?: string; to?: string }) {
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (sp.from && sp.to && iso.test(sp.from) && iso.test(sp.to)) {
    const from = new Date(`${sp.from}T00:00:00Z`);
    const to = new Date(new Date(`${sp.to}T00:00:00Z`).getTime() + 864e5);
    if (to > from && to.getTime() - from.getTime() <= 400 * 864e5) return { key: "custom" as RangeKey, from, to };
  }
  const key = (sp.range && sp.range in RANGES ? sp.range : "30d") as keyof typeof RANGES;
  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) + 864e5);
  return { key: key as RangeKey, from: new Date(end.getTime() - RANGES[key] * 864e5), to: end };
}
