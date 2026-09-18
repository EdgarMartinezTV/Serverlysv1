/**
 * Fails while any testimonial on the site is still a placeholder.
 *
 * WHY THIS EXISTS. A testimonial is a statement that a named person said a
 * thing. Every other kind of copy on this site can be wrong and then corrected;
 * an invented endorsement is false the moment it is published, and it is the
 * customer's name carrying it. The risk is not that someone writes a fake one
 * on purpose — it is that placeholder text quietly survives to launch because
 * nothing was watching. This watches.
 *
 * Each gated band exports a `<NAME>_ARE_REAL` boolean beside its content. The
 * rule is simple: flip the flag in the SAME commit that puts real quotes in.
 * Flipping it without real quotes defeats the whole thing, so don't.
 *
 * Usage: node scripts/check-reviews.mjs
 */
import { readFileSync, existsSync } from "node:fs";

/** Every band that publishes third-party words, and its gate. */
const GATED = [
  {
    label: "/website-development — “What clients say”",
    file: "src/app/website-development/_content.ts",
    flag: "REVIEWS_ARE_REAL",
  },
];

/** Text that gives a placeholder away even if someone flips the flag early. */
const TELLS = [
  /replace with a real/i,
  /reviewer name needed/i,
  /placeholder/i,
  /lorem ipsum/i,
  /\bTODO\b/,
];

let failed = 0;

for (const { label, file, flag } of GATED) {
  if (!existsSync(file)) {
    console.log(`  ! ${label} — ${file} not found, band may have been removed`);
    continue;
  }
  const src = readFileSync(file, "utf8");

  const match = src.match(new RegExp(`${flag}\\s*=\\s*(true|false)`));
  if (!match) {
    console.log(`  ✗ ${label}\n      no \`${flag}\` gate found in ${file}`);
    failed++;
    continue;
  }
  const isReal = match[1] === "true";
  const tells = TELLS.filter((re) => re.test(src)).map(String);

  if (!isReal) {
    console.log(
      `  ✗ ${label}\n` +
        `      ${flag} is false — these are placeholders and must not ship.\n` +
        `      Put real quotes and real names in, then flip the flag.\n` +
        `      No real reviews yet? Remove <Reviews /> from page.tsx instead.`,
    );
    failed++;
  } else if (tells.length) {
    // The flag says real but the file still reads like a template. That is the
    // dangerous combination, so it is a louder failure than the honest one.
    console.log(
      `  ✗ ${label}\n` +
        `      ${flag} is TRUE but placeholder text is still present: ${tells.join(", ")}\n` +
        `      Either the quotes were not actually replaced, or the flag was flipped early.`,
    );
    failed++;
  } else {
    console.log(`  ✓ ${label} — real reviews`);
  }
}

console.log(
  failed
    ? `\n✗ ${failed} testimonial band(s) not ready to publish`
    : `\n✓ every testimonial band carries real reviews`,
);
process.exit(failed ? 1 : 0);
