/** Dictionary lookup that keeps leading/trailing whitespace of the English source. */
export function lookup(dict: Readonly<Record<string, string>> | null | undefined, v: string): string {
  if (!dict) return v;
  const k = v.trim();
  if (!k) return v;
  const hit = dict[k];
  if (hit === undefined) return v;
  const lead = v.slice(0, v.length - v.trimStart().length);
  const trail = v.slice(v.trimEnd().length);
  return lead + hit + trail;
}
