import { faqs } from "@/data/faqs";

/**
 * Answers to the questions Serverlys actually gets asked.
 *
 * Straight out of `data/faqs.ts`, verbatim. That file's header calls its
 * answers commitments — renewal transparency, the 30-day refund, no setup
 * fees, domains non-refundable once registered — and warns against softening
 * or embellishing them. An assistant paraphrasing a refund policy is an
 * assistant changing it, so Sera is handed the exact sentence and told to
 * quote rather than restate.
 *
 * The scoring below is deliberately simple. Sera already knows what the
 * visitor asked; this only has to surface the right handful of candidates for
 * it to choose from, and a term-overlap score does that at zero cost and zero
 * dependencies. Embeddings here would be a second model call, a second bill,
 * and a cache to invalidate, for a corpus of a few dozen questions.
 */

/** Words carrying no discriminating power in a hosting FAQ. */
const STOPWORDS = new Set([
  "a", "an", "and", "any", "are", "at", "be", "can", "do", "does", "for",
  "from", "get", "has", "have", "how", "i", "if", "in", "is", "it", "me", "much",
  "my", "of", "on", "or", "that", "the", "there", "they", "this", "to", "up",
  "was", "what", "when", "where", "which", "will", "with", "you", "your",
]);

function terms(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

export type FaqHit = { question: string; answer: string; score: number };

/**
 * The best-matching FAQ entries for a query.
 *
 * Returns an empty array rather than a weak guess when nothing scores. That is
 * the point of the threshold: a confidently-delivered irrelevant answer is the
 * failure mode that makes an assistant untrustworthy, and "I do not have that
 * one — the team can confirm" is a better answer than a near miss.
 */
export function searchFaq(query: string, limit = 3): FaqHit[] {
  const wanted = terms(query);
  if (wanted.length === 0) return [];

  return faqs
    .map((faq) => {
      const haystack = terms(`${faq.question} ${faq.answer}`);
      const set = new Set(haystack);
      let score = 0;
      for (const word of wanted) {
        if (set.has(word)) score += 2;
        // Partial credit for stems: "migration" against "migrate".
        else if (haystack.some((h) => h.startsWith(word.slice(0, 5)))) score += 1;
      }
      return { question: faq.question, answer: faq.answer, score };
    })
    .filter((hit) => hit.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Every FAQ shown on a given page, for page-aware answers. */
export function faqsForPage(path: string) {
  return faqs
    .filter((faq) => faq.scopes.includes(path))
    .map((faq) => ({ question: faq.question, answer: faq.answer }));
}
