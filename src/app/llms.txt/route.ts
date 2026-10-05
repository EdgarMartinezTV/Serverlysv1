import { routes } from "@/data/routes";
import { canonical } from "@/lib/seo";
import { company, billing } from "@/data/company";
import {
  LLMS_BLURB,
  LLMS_CONTEXT,
  LLMS_LIMITS,
  LLMS_SECTIONS,
  LLMS_SUMMARIES,
} from "@/data/llms";

/**
 * `/llms.txt` — the site index written for answer engines.
 *
 * Generated from the SAME route registry as the sitemap, for the same reason
 * the sitemap is: a hand-maintained list drifts, and a list that advertises a
 * page which does not exist is worse than no list. A path that is not `built`
 * and `indexable` is skipped here exactly as it is skipped there, so this file
 * can never point an AI crawler at a 404 or at an internal surface.
 *
 * Copy lives in `data/llms.ts`. This module only assembles it.
 *
 * Served as `text/plain`, per the convention, so it is readable by a fetch that
 * does not negotiate content types. It is markdown by structure, not by header.
 */
export const dynamic = "force-static";

export function GET() {
  // Registry lookup, so ordering and eligibility come from one place.
  const eligible = new Map(
    routes.filter((r) => r.built && r.indexable).map((r) => [r.path, r]),
  );

  const lines: string[] = [];

  lines.push(`# ${company.name}`);
  lines.push("");
  lines.push(`> ${LLMS_BLURB}`);
  lines.push("");

  for (const paragraph of LLMS_CONTEXT) {
    lines.push(paragraph);
    lines.push("");
  }

  lines.push("## What Serverlys does not claim");
  lines.push("");
  for (const limit of LLMS_LIMITS) lines.push(`- ${limit}`);
  lines.push("");

  const missing: string[] = [];

  for (const section of LLMS_SECTIONS) {
    const entries = section.paths
      .filter((path) => {
        if (!eligible.has(path)) return false;
        // A listed page with no summary would emit a bare link, which is worse
        // than omitting it: an answer engine reads a bare link as a page with
        // nothing to say. Record it so the test can fail on it.
        if (!LLMS_SUMMARIES[path]) {
          missing.push(path);
          return false;
        }
        return true;
      })
      .map((path) => {
        const route = eligible.get(path)!;
        const name = path === "/" ? company.name : route.name;
        return `- [${name}](${canonical(path)}): ${LLMS_SUMMARIES[path]}`;
      });

    if (!entries.length) continue;

    lines.push(`## ${section.title}`);
    lines.push("");
    if ("note" in section && section.note) {
      lines.push(section.note);
      lines.push("");
    }
    lines.push(...entries);
    lines.push("");
  }

  lines.push("## Contact");
  lines.push("");
  lines.push(`- Email: ${company.email}`);
  lines.push(`- Telephone: ${company.phone}`);
  lines.push(`- Billing and account login: ${billing.root}`);
  lines.push(`- Full XML sitemap: ${canonical("/sitemap.xml")}`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
