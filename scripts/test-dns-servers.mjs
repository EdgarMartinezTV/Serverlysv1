/**
 * Which DNS servers in src/lib/dns/servers.ts still answer?
 *
 * Runs a few propagation checks against a running site (dev or prod) and
 * counts, per server, how often it timed out or failed. A server that misses
 * most checks should be replaced in servers.ts.
 *
 * Usage: node scripts/test-dns-servers.mjs [baseUrl] [checks]
 *   node scripts/test-dns-servers.mjs http://localhost:3000 5
 */
const base = process.argv[2] ?? "http://localhost:3000";
const runs = Number(process.argv[3] ?? 5);
const domains = ["example.com", "wikipedia.org", "serverlys.com", "github.com", "cloudflare.com"];

const misses = new Map();
let done = 0;
for (let i = 0; i < runs; i++) {
  const domain = domains[i % domains.length];
  const res = await fetch(`${base}/api/dns/propagation?domain=${domain}&type=A`);
  const body = await res.json();
  if (!body.ok) {
    console.log(`check ${i + 1} (${domain}): ${body.error}`);
    continue;
  }
  done++;
  for (const r of body.result.rows) {
    if (r.status === "timedOut" || r.status === "failed") {
      misses.set(r.id, (misses.get(r.id) ?? 0) + 1);
    }
  }
  // Stay well inside the per-client rate limit.
  await new Promise((r) => setTimeout(r, 3500));
}

console.log(`${done} checks completed`);
const sorted = [...misses].sort((a, b) => b[1] - a[1]);
if (!sorted.length) console.log("every server answered every check");
for (const [id, n] of sorted) console.log(`${id.padEnd(18)} missed ${n}/${done}${n / done > 0.5 ? "  ← replace" : ""}`);
