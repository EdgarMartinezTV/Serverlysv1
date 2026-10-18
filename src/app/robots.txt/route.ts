import { canonical } from "@/lib/seo";
import { routes } from "@/data/routes";
import { publicEnv } from "@/lib/env";
import { AI_ANSWER_AGENTS, AI_TRAINING_AGENTS } from "@/data/ai-agents";

/**
 * robots.txt, written by hand instead of through Next's `MetadataRoute.Robots`.
 *
 * The rules are the ones `app/robots.ts` produced (it is gone; this replaces it
 * one for one). The reason for the move is a single line Next's generator cannot
 * emit: `Content-Signal` (contentsignals.org, IETF draft-romm-aipref), which
 * tells AI systems how the content may be USED, not just whether it may be
 * fetched. AI visibility checkers score its absence.
 *
 * The signal states the policy this file already enacts — every agent group is
 * allowed, answer engines and trainers alike (see data/ai-agents.ts):
 *   search=yes    appear in search results
 *   ai-input=yes  be read to answer someone (RAG, grounding) and cited
 *   ai-train=yes  be used to train models
 * To opt out of training, flip ai-train to "no" here; nothing else changes.
 *
 * Staging is still fully disallowed unless `publicEnv.allowIndexing`.
 */
export const dynamic = "force-static";

const SIGNAL = "search=yes, ai-input=yes, ai-train=yes";

export function GET() {
  const lines: string[] = [];
  if (!publicEnv.allowIndexing) {
    lines.push("User-Agent: *", "Disallow: /", "");
  } else {
    const disallow = [
      "/api/",
      ...routes.filter((r) => r.built && !r.indexable && !r.crawlable).map((r) => r.path),
    ];
    const group = (agents: readonly string[]) => {
      for (const a of agents) lines.push(`User-Agent: ${a}`);
      lines.push(`Content-Signal: ${SIGNAL}`, "Allow: /");
      for (const d of disallow) lines.push(`Disallow: ${d}`);
      lines.push("");
    };
    group(["*"]);
    group(AI_ANSWER_AGENTS);
    group(AI_TRAINING_AGENTS);
    // XML sitemap only — see the note that lived in robots.ts: /llms.txt is
    // discovered at its well-known path, not through `Sitemap:`.
    lines.push(`Sitemap: ${canonical("/sitemap.xml")}`, "");
  }
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
