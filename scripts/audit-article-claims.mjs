/**
 * Editorial claims audit.
 *
 * data/articles/original.ts states the rules every article on this site must
 * follow: no invented statistics, customer counts, case studies or quotes; no
 * disparaging competitor comparison; no backdated publishing history.
 *
 * The 71 ported posts were written for the previous site, which did not follow
 * those rules. They open with lines like "after optimizing hundreds of
 * WordPress sites, we've distilled…" and "we tested 15 providers". Those are
 * not style problems — an unverifiable first-person claim is exactly what a
 * quality rater is told to penalise, and a fabricated result is what turns a
 * manual action into a real possibility. They are also simply untrue.
 *
 * This script finds them. It does NOT fix them: rewriting a sentence so it is
 * both true and still useful is an editorial judgement, and a regex that tried
 * would produce confident nonsense. Every hit is reviewed and edited by hand.
 *
 * Usage: node scripts/audit-article-claims.mjs [--all]
 *   (default output is a summary; --all lists every hit)
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const DIRS = ["src/data/articles/legacy", "src/data/articles"];

/**
 * Each rule is deliberately narrow. A broad pattern ("we") would flag the
 * ordinary editorial "we" that every one of these posts uses correctly, and a
 * report with 4,000 hits does not get read.
 */
const RULES = [
  {
    id: "experience-claim",
    why: "Unverifiable first-person experience — implies a track record that has not been evidenced.",
    re: /\b(?:after|having)\s+(?:optimi[sz]ing|building|migrating|managing|testing|helping|working with)\s+(?:hundreds|thousands|dozens|\d+)\b[^.]*|\bin our experience\b|\bwe(?:'ve| have)\s+(?:tested|optimi[sz]ed|migrated|built|helped|seen|found|reviewed)\b[^.]*|\bour (?:testing|tests|benchmarks|research|data)\b[^.]*|\bwe tested\b[^.]*/gi,
  },
  {
    id: "customer-count",
    /*
     * Scoped to counts of PEOPLE WE SERVE, plus the first-person verb form.
     * An earlier version also matched "hundreds of sites", which flagged
     * "shared hosting puts hundreds of sites on a single server" — a correct
     * description of the product, not a claim about Serverlys' book of
     * business. A rule that cries wolf on accurate sentences stops being read.
     */
    why: "Customer or project count presented as fact.",
    re: /\b(?:hundreds|thousands|dozens|\d[\d,]*\+?)\s+of\s+(?:our\s+)?(?:clients|customers|businesses)\b[^.]*|\b(?:we|our team)\s+(?:have\s+|'ve\s+)?(?:served|helped|hosted|audited|managed|migrated|built)\s+(?:hundreds|thousands|dozens|\d[\d,]*)\b[^.]*/gi,
  },
  {
    id: "named-anecdote",
    why: "Anecdote attributed to a named company with no citation.",
    re: /\b(?:Amazon|Google|Walmart|Pinterest|Netflix|Akamai|Facebook|Meta)\s+(?:famously\s+)?(?:calculated|found|reported|discovered|determined|says|said|estimates|estimated)\b[^.]*/gi,
  },
  {
    id: "vague-research",
    why: "Statistic with no attributable source.",
    re: /\b(?:studies|research|surveys|data)\s+(?:show|shows|suggest|suggests|found|indicate|indicates)\b[^.]*|\ba study (?:by|from|found)\b[^.]*|\baccording to (?:studies|research|industry data|most experts)\b[^.]*/gi,
  },
  {
    id: "absolute-guarantee",
    why: "Absolute security or outcome guarantee.",
    re: /\b(?:100%\s+(?:secure|safe|uptime|guaranteed)|completely\s+(?:secure|safe|immune)|never\s+be\s+hacked|guarantees?\s+(?:you|your)\s+\w+\s+will)\b[^.]*/gi,
    /*
     * The strongest writing about absolute guarantees is the writing that
     * DEBUNKS them — "nothing is 100% secure", "anyone promising 100% uptime
     * is either lying or hiding exclusions". Those sentences necessarily
     * contain the phrase the rule looks for, and flagging them would push an
     * editor toward deleting the honest paragraph. Skip a hit whose sentence
     * carries an explicit debunking marker.
     */
    unless: /\b(?:nothing|no\s+such\s+thing|not?\s+\w+\s+is|never|isn't|is\s+not|lying|meaningless|myth|impossible|exclusions?|claims?\s+to|promis\w+)\b/i,
  },
  {
    id: "testimonial",
    why: "Quote block that reads as a customer testimonial.",
    re: /\b(?:said|says|told us|puts it)\b[^.]*\b(?:customer|client|owner|CEO|founder)\b[^.]*/gi,
  },
];

/**
 * Reviewed exceptions.
 *
 * Every entry is a hit that was read and judged correct as written, with the
 * reason recorded. This exists instead of widening the rules' negative
 * lookarounds: a rule that keeps growing exclusions eventually stops matching
 * the thing it was written for, and the exclusion carries no explanation of
 * WHY a given sentence is fine. An explicit list is reviewable in a diff.
 *
 * Match on a distinctive substring of the flagged text, not the whole line.
 */
const ALLOWED = [
  {
    file: "hosting-uptime-explained.ts",
    match: "still claim 100% uptime under their SLA",
    why: "Criticising the practice, not making the claim — the sentence's point is that the SLA is hollow.",
  },
  {
    file: "hosting-uptime-explained.ts",
    match: "Can any host guarantee 100% uptime?",
    why: "A heading whose answer, in the next block, is a flat no.",
  },
];

function isAllowed(file, text) {
  return ALLOWED.some(
    (a) => file.endsWith(a.file) && (text.includes(a.match) || a.match.includes(text)),
  );
}

function collect(dir) {
  const out = [];
  for (const entry of readdirSync(resolve(dir), { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".ts")) continue;
    if (entry.name === "index.ts" || entry.name === "types.ts") continue;
    out.push(join(dir, entry.name));
  }
  return out;
}

const files = DIRS.flatMap(collect);
const showAll = process.argv.includes("--all");

const hits = [];

for (const file of files) {
  const source = readFileSync(resolve(file), "utf8");
  const lines = source.split("\n");

  lines.forEach((line, i) => {
    // Only look inside string literals — comments in these files legitimately
    // discuss the rules and would otherwise flag themselves.
    if (!/"/.test(line)) return;
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;

    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      for (let m = rule.re.exec(line); m !== null; m = rule.re.exec(line)) {
        // `unless` is evaluated against the WHOLE line, not the match: the
        // negation that makes a sentence honest usually sits outside the
        // phrase that triggered the rule.
        if (rule.unless?.test(line)) continue;
        const text = m[0].trim().slice(0, 160);
        // The allowlist is checked against the LINE too, so an entry can quote
        // the heading or sentence rather than the regex's exact capture.
        if (isAllowed(file, text) || isAllowed(file, line)) continue;
        hits.push({ file, line: i + 1, rule: rule.id, why: rule.why, text });
      }
    }
  });
}

const byRule = new Map();
for (const h of hits) byRule.set(h.rule, (byRule.get(h.rule) ?? 0) + 1);

const byFile = new Map();
for (const h of hits) byFile.set(h.file, (byFile.get(h.file) ?? 0) + 1);

console.log(`Scanned ${files.length} article file(s)\n`);

if (hits.length === 0) {
  console.log("✓ No forbidden claims found.");
  process.exit(0);
}

console.log(`${hits.length} claim(s) to review, in ${byFile.size} file(s):\n`);
for (const rule of RULES) {
  const n = byRule.get(rule.id);
  if (n) console.log(`  ${String(n).padStart(3)}  ${rule.id.padEnd(20)} ${rule.why}`);
}

console.log("\nBy file:");
for (const [file, n] of [...byFile].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(3)}  ${file.replace(/^src\/data\/articles\//, "")}`);
}

if (showAll) {
  console.log("\n─── every hit ───");
  for (const h of hits) {
    console.log(`\n${h.file}:${h.line}  [${h.rule}]`);
    console.log(`  ${h.text}`);
  }
}

// Non-zero exit so this can gate a build once the archive is clean.
process.exit(1);
