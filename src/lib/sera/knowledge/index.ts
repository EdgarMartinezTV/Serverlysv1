/**
 * Sera's knowledge layer.
 *
 * ONE RULE GOVERNS THIS DIRECTORY: it contains no facts of its own. Every
 * module here is a projection of a file the website already renders from —
 * `data/pricing.ts`, `data/products.ts`, `data/llms.ts`, `data/faqs.ts`,
 * `data/routes.ts`, `data/company.ts`. Updating a price or a policy is
 * therefore a one-file change, as it was before Sera existed, and Sera cannot
 * quote a figure the site is not also showing.
 *
 * The alternative — a hand-written brief pasted into the system prompt — is
 * how assistants end up confidently quoting last quarter's pricing. It is also
 * unreviewable: a stale sentence in a prompt looks exactly like a fresh one.
 */

export { hostingPlans, hostingProducts, type PlanFact, type PlanGroupFact } from "./hosting";
export {
  companyFacts,
  contactChannels,
  pageSummary,
  serviceCatalogue,
  type ServiceFact,
} from "./services";
export { faqsForPage, searchFaq, type FaqHit } from "./faq";
