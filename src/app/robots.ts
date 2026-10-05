import type { MetadataRoute } from "next";
import { canonical } from "@/lib/seo";
import { routes } from "@/data/routes";
import { publicEnv } from "@/lib/env";
import { AI_ANSWER_AGENTS, AI_TRAINING_AGENTS } from "@/data/ai-agents";

/**
 * robots.txt.
 *
 * Staging must never be indexed: unless `publicEnv.allowIndexing` (true by
 * default only on the production origin — see lib/env.ts), everything is
 * disallowed. A staging site competing with
 * production in the index is a real and common SEO incident, and it is
 * cheapest to prevent here.
 *
 * AI CRAWLERS ARE NAMED EXPLICITLY, in two groups, and the split is the point.
 * A wildcard `Allow: /` already permits every one of them — naming them adds no
 * access. What it adds is a decision surface: `ai-agents.ts` separates the bots
 * that fetch a page in order to ANSWER someone and cite the source from the
 * bots that fetch it to TRAIN on it. Those are different trades, and the day
 * Edgar wants out of one he should not have to touch the other, or risk
 * disappearing from AI answers while trying to opt out of training.
 *
 * Both are allowed today. See `data/ai-agents.ts` for what that means.
 */
export default function robots(): MetadataRoute.Robots {
  if (!publicEnv.allowIndexing) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  // Internal surfaces, sourced from the registry rather than hand-listed.
  const disallow = [
    "/api/",
    ...routes.filter((r) => r.built && !r.indexable).map((r) => r.path),
  ];

  // Every named agent gets the SAME disallow list as everyone else. An AI
  // crawler that indexes /design-system or an unbuilt route produces confident
  // answers about surfaces that are not products.
  const agentRule = (userAgent: string[]) => ({
    userAgent,
    allow: "/",
    disallow,
  });

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      agentRule([...AI_ANSWER_AGENTS]),
      agentRule([...AI_TRAINING_AGENTS]),
    ],
    // XML sitemap ONLY. /llms.txt is discovered at its well-known path, and the
    // `Sitemap:` directive means one specific thing — a crawler that fetches a
    // markdown file expecting sitemap XML has been given a broken instruction.
    sitemap: canonical("/sitemap.xml"),
    host: canonical("/"),
  };
}
