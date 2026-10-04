/**
 * The legal document set — the single source of truth for what governs a
 * Serverlys service, what each document decides, and when its current version
 * took effect.
 *
 * WHY THIS FILE EXISTS (added 2026-09-19). The documents were previously
 * twelve independent pages. Each carried its own `EFFECTIVE` constant, its own
 * title string in `legalNav`, and no statement of how it related to any other
 * one. Three things went wrong with that and all three are structural rather
 * than cosmetic:
 *
 *   · A reader could not tell which document answered their question without
 *     opening several. A legal index is a finding aid; ours was a flat list.
 *   · The same document's title appeared in two files and its date in a third,
 *     so they could — and did — drift.
 *   · Nothing recorded the ORDER OF PRECEDENCE, which is the one thing a
 *     reader actually needs when two documents appear to say different things.
 *
 * Pages now import their own entry from here. `effective` is rendered by the
 * page AND by the index, so a date can only be wrong in one place at a time.
 *
 * ⚠ ADDING A DOCUMENT means four edits, and a miss is silent in three of them:
 *     1. this file          — the entry
 *     2. src/data/routes.ts — a RouteMeta with group "legal" (sitemap)
 *     3. src/app/<slug>/    — the page itself
 *     4. legalNav is DERIVED from this file, so the footer updates itself.
 *   A document absent from here is effectively unpublished no matter what
 *   exists under src/app.
 *
 * ⚠ EVERY DOCUMENT IN THIS SET STILL NEEDS COUNSEL REVIEW BEFORE LAUNCH.
 *   See the header of components/legal/legal-page.tsx. That is a launch task,
 *   tracked in ARCHITECTURE.md, not something to resolve in code.
 */

export type LegalCategory = "agreement" | "policy" | "company";

export type LegalDocument = {
  path: string;
  /** Title as shown in the index, the footer and the page's own <h1>. */
  title: string;
  category: LegalCategory;
  /**
   * One line stating what this document DECIDES — not what it is about.
   * "What we do with your data" is a topic; "what personal data we hold and
   * what you can ask us to do about it" is a decision. The index is only
   * useful if these answer "is this the one I want?".
   */
  summary: string;
  /** ISO date this version took effect. Rendered by the page and the index. */
  effective: string;
  /**
   * Paths of documents a reader on this page plausibly needs next. Rendered
   * as cross-links at the foot of the document.
   *
   * Kept deliberately short. A "related" block listing eleven siblings is the
   * flat list again with extra steps.
   */
  related?: readonly string[];
};

/**
 * PRECEDENCE — which document wins when two of them appear to disagree.
 *
 * Stated once, here, and rendered on the index. A document set without a
 * stated order is one where every conflict is an argument.
 */
export const PRECEDENCE: readonly string[] = [
  "ICANN and the relevant registry's own policies, for anything concerning a domain name",
  "The terms of service",
  "The specific agreement for the service in question",
  "The specific policy for the matter in question",
  "Anything written on a product or marketing page",
];

export const legalDocuments: readonly LegalDocument[] = [
  /* ---------------------------------------------------------------- agreements
     Documents you enter into with us. These bind both sides. */
  {
    path: "/terms-of-service",
    title: "Terms of service",
    category: "agreement",
    summary:
      "The agreement covering every service you buy from us, and the one the others sit under.",
    effective: "2026-09-09",
    related: ["/acceptable-use-policy", "/refund-policy", "/privacy-policy"],
  },
  {
    path: "/domain-registration-agreement",
    title: "Domain registration agreement",
    category: "agreement",
    summary:
      "Registering, renewing and transferring a domain, and which obligations sit with the registry rather than with us.",
    effective: "2026-09-14",
    related: ["/terms-of-service", "/refund-policy", "/dmca-policy"],
  },
  {
    path: "/data-processing-agreement",
    title: "Data processing agreement",
    category: "agreement",
    summary:
      "Where you are the controller and we are the processor: what we may do with the personal data your site handles, and what we must do if it is breached.",
    effective: "2026-09-14",
    related: ["/privacy-policy", "/information-security-policy"],
  },
  {
    path: "/ai-services-terms",
    title: "AI services terms",
    category: "agreement",
    summary:
      "The terms specific to ConvoAI and CallFlow: who owns the conversations, what the models are and are not trained on, and what an automated agent must never be relied on to do.",
    effective: "2026-09-19",
    related: ["/terms-of-service", "/privacy-policy", "/data-processing-agreement"],
  },

  /* ------------------------------------------------------------------ policies
     How we operate. These bind us. */
  {
    path: "/privacy-policy",
    title: "Privacy policy",
    category: "policy",
    summary:
      "What personal data we hold, why we hold it, and what you can ask us to do about it.",
    effective: "2026-09-09",
    related: ["/cookie-policy", "/data-processing-agreement", "/law-enforcement-requests"],
  },
  {
    path: "/cookie-policy",
    title: "Cookie policy",
    category: "policy",
    summary: "Every cookie this site sets, what it does, and how to refuse the optional ones.",
    effective: "2026-09-14",
    related: ["/privacy-policy"],
  },
  {
    path: "/refund-policy",
    title: "Refund policy",
    category: "policy",
    summary:
      "The 30-day hosting guarantee, why domain registrations sit outside it, and the three exceptions.",
    effective: "2026-09-09",
    related: ["/terms-of-service", "/customer-service-policy"],
  },
  {
    path: "/acceptable-use-policy",
    title: "Acceptable use policy",
    category: "policy",
    summary:
      "What you may not run on our platform, and what happens to an account that does.",
    effective: "2026-09-14",
    related: ["/abuse-handling-policy", "/terms-of-service"],
  },
  {
    path: "/abuse-handling-policy",
    title: "Abuse handling policy",
    category: "policy",
    summary:
      "What we do with an abuse report once you send it — who reads it, how fast, and what we can and cannot do about it.",
    effective: "2026-09-19",
    related: ["/acceptable-use-policy", "/report-abuse", "/dmca-policy"],
  },
  {
    path: "/dmca-policy",
    title: "Copyright and DMCA policy",
    category: "policy",
    summary:
      "How to send a takedown notice that we can act on, how a customer files a counter-notice, and what each of those obliges us to do.",
    effective: "2026-09-14",
    related: ["/abuse-handling-policy", "/legal-information"],
  },
  {
    path: "/information-security-policy",
    title: "Information security policy",
    category: "policy",
    summary:
      "The controls we operate — access, encryption, backups, logging — and what we commit to doing when one of them fails.",
    effective: "2026-09-19",
    related: ["/responsible-disclosure-policy", "/data-processing-agreement", "/privacy-policy"],
  },
  {
    path: "/responsible-disclosure-policy",
    title: "Responsible disclosure policy",
    category: "policy",
    summary:
      "How to report a vulnerability to us, what is in scope, and our undertaking not to pursue researchers who follow it.",
    effective: "2026-09-19",
    related: ["/information-security-policy", "/acceptable-use-policy"],
  },
  {
    path: "/customer-service-policy",
    title: "Customer service policy",
    category: "policy",
    summary:
      "How to reach support, what we aim to respond in, and what we will not do — including the retention scripts we do not run.",
    effective: "2026-09-19",
    related: ["/refund-policy", "/terms-of-service"],
  },
  {
    path: "/law-enforcement-requests",
    title: "Law enforcement and legal requests",
    category: "policy",
    summary:
      "What we require before disclosing customer data to an authority, and when we will tell the customer it happened.",
    effective: "2026-09-14",
    related: ["/privacy-policy", "/legal-information"],
  },
  {
    path: "/accessibility",
    title: "Accessibility statement",
    category: "policy",
    summary:
      "The conformance target for this website, what we know is not yet meeting it, and how to report a barrier.",
    effective: "2026-09-09",
    related: ["/customer-service-policy"],
  },

  /* ------------------------------------------------------------------- company
     Who we are and how to reach us formally. */
  {
    path: "/legal-information",
    title: "Legal information",
    category: "company",
    summary:
      "Company details, the index of every document below, and the order they take precedence in.",
    effective: "2026-09-19",
    related: ["/terms-of-service", "/privacy-policy"],
  },
];

const BY_PATH = new Map(legalDocuments.map((d) => [d.path, d]));

/**
 * Look a document up by path.
 *
 * THROWS on an unknown path rather than returning undefined. Every caller is a
 * page rendering its own entry at build time, so a miss is a typo in a literal
 * that would otherwise surface as a blank title or an "Invalid Date" in
 * production. Failing the build is the cheaper outcome.
 */
export function legalDoc(path: string): LegalDocument {
  const doc = BY_PATH.get(path);
  if (!doc) {
    throw new Error(
      `legalDoc("${path}") — no entry in src/data/legal.ts. ` +
        `Adding a legal page means adding it there too, or it is unpublished.`,
    );
  }
  return doc;
}

/** Resolve a `related` list to full entries, skipping anything not a document. */
export function relatedDocs(paths: readonly string[] | undefined): readonly LegalDocument[] {
  return (paths ?? []).flatMap((p) => {
    const doc = BY_PATH.get(p);
    return doc ? [doc] : [];
  });
}

export const CATEGORY_LABEL: Record<LegalCategory, string> = {
  agreement: "Agreements",
  policy: "Policies",
  company: "Company",
};

/**
 * One line per category explaining what the group is FOR. Without these the
 * index is three headed lists and the reader still has to guess which heading
 * covers their question.
 */
export const CATEGORY_BLURB: Record<LegalCategory, string> = {
  agreement: "Documents you enter into with us. These bind both sides.",
  policy: "How we operate. These bind us.",
  company: "Who we are, and how to reach us formally.",
};

export const CATEGORY_ORDER: readonly LegalCategory[] = ["agreement", "policy", "company"];

export function documentsIn(category: LegalCategory): readonly LegalDocument[] {
  return legalDocuments.filter((d) => d.category === category);
}
