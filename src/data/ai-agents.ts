/**
 * The AI crawlers this site names in robots.txt, split by WHAT THEY DO WITH
 * THE PAGE — because those are two different bargains and they should be
 * decidable separately.
 *
 * ⚠ Naming an agent here does not grant it anything. `User-agent: *` with
 * `Allow: /` already permits all of them. These lists exist so that opting out
 * of one bargain cannot silently opt you out of the other.
 *
 * Agent names are matched by robots.txt as case-insensitive substrings of the
 * crawler's User-Agent token, so the exact spelling below is what each vendor
 * documents. Wrong spelling = a rule that silently never matches, which is why
 * these are written once, here, rather than inline in robots.ts.
 */

/**
 * ANSWER ENGINES. These fetch a page to answer a question someone is asking
 * right now, and they cite what they used. This is the group that puts
 * "Serverlys" in a ChatGPT, Claude, Perplexity or Copilot answer with a link
 * back. Blocking these removes the site from AI search results.
 *
 * Two sub-kinds are deliberately both here:
 *   · index bots (OAI-SearchBot, Claude-SearchBot, PerplexityBot) build the
 *     retrieval index the assistant searches;
 *   · user bots (ChatGPT-User, Claude-User, Perplexity-User, MistralAI-User)
 *     fetch a page live because a person pasted a link or asked to open it.
 * Blocking the user bots is the quiet failure mode: a prospect explicitly asks
 * their assistant to read serverlys.com and it reports that it cannot.
 */
export const AI_ANSWER_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "DuckAssistBot",
  "MistralAI-User",
  "YouBot",
] as const;

/**
 * TRAINING AND GROUNDING CORPORA. These fetch a page to train on it, or to
 * feed a vendor's grounding corpus. The payoff is slower and unattributed —
 * the brand becomes part of what a model knows rather than something it looks
 * up — and the content is retained rather than read once.
 *
 * ALLOWED TODAY, deliberately: Serverlys is a young brand with no name
 * recognition to protect, and being known to the models is worth more than
 * withholding marketing copy from them. This is the list to empty if that
 * calculus ever changes. Emptying it does NOT affect AI search — that is
 * AI_ANSWER_AGENTS above.
 *
 * Notes on three that behave unlike the rest:
 *   · `Google-Extended` is not a crawler. It is a policy token: Googlebot does
 *     the fetching, and this controls whether Gemini may use the result. Google
 *     Search ranking is unaffected either way.
 *   · `Applebot-Extended` is the same pattern for Apple Intelligence, gated on
 *     Applebot's normal crawl.
 *   · `CCBot` is Common Crawl — a public archive, not a vendor. Most open
 *     training sets derive from it, so it has the widest downstream reach and
 *     the least control once fetched.
 */
export const AI_TRAINING_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "CCBot",
  "cohere-ai",
] as const;
