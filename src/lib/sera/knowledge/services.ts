import { LLMS_BLURB, LLMS_CONTEXT, LLMS_LIMITS, LLMS_SECTIONS, LLMS_SUMMARIES } from "@/data/llms";
import { routeFor } from "@/data/routes";
import { billing, company, sisterProducts } from "@/data/company";

/**
 * What Serverlys does, and where the authoritative page for each thing is.
 *
 * SOURCED FROM `/llms.txt`, ON PURPOSE. `data/llms.ts` is already the file
 * this company wrote for machines to read: it carries a standing rule that
 * nothing belongs in it unless it would be correct for an assistant to tell a
 * stranger "Serverlys says X". Sera is exactly that assistant, so it reads the
 * same file rather than growing a second description of the company that would
 * eventually disagree with the first.
 *
 * ⚠ UNBUILT PAGES ARE FILTERED OUT. `data/routes.ts` marks routes the header
 * links to that do not have a page yet; they 404 today. Sera sending someone to
 * a 404 is worse than Sera not linking at all, so `built` is checked here and
 * the service is still described — only the link is withheld.
 */

export type ServicePage = { name: string; path: string; summary: string };

export type ServiceFact = {
  area: string;
  note?: string;
  pages: readonly ServicePage[];
};

/** The service catalogue, grouped the way an assistant gets asked about it. */
export function serviceCatalogue(): ServiceFact[] {
  return LLMS_SECTIONS.map((section) => {
    const pages: ServicePage[] = [];
    for (const path of section.paths) {
      const route = routeFor(path);
      if (!route?.built) continue;
      pages.push({ name: route.name, path, summary: LLMS_SUMMARIES[path] ?? route.name });
    }
    return {
      area: section.title as string,
      note: "note" in section ? section.note : undefined,
      pages,
    };
  }).filter((section) => section.pages.length > 0);
}

/** One page's summary, when the visitor is asking about a specific service. */
export function pageSummary(path: string): { name: string; path: string; summary: string } | null {
  const route = routeFor(path);
  if (!route?.built) return null;
  return { name: route.name, path, summary: LLMS_SUMMARIES[path] ?? route.name };
}

/**
 * Who Serverlys is, what it commits to, and — just as importantly — what it
 * does NOT claim.
 *
 * `limits` is not padding. `data/llms.ts` records that the uptime percentages
 * in some marketing copy are borrowed reference text rather than a Serverlys
 * commitment, and that there are no verified customer or review counts. An
 * assistant that repeats those as facts is inventing a service level, which is
 * the single most damaging thing Sera could do. Shipping the limits alongside
 * the facts is what stops it.
 */
export function companyFacts() {
  return {
    name: company.name,
    legalName: company.legalName,
    site: company.url,
    summary: LLMS_BLURB,
    facts: LLMS_CONTEXT,
    limits: LLMS_LIMITS,
    ownProducts: sisterProducts.map((p) => ({
      name: p.name,
      url: p.href,
      description: p.description,
    })),
  };
}

/**
 * Real, working ways to reach a human.
 *
 * Every one of these is a route that exists today — the published support
 * address and phone number, and the WHMCS sales ticket queue the site's own
 * "talk to an expert" buttons already point at. Nothing here is aspirational,
 * because this is what Sera falls back to when it cannot help, and a fallback
 * that does not work is worse than admitting there is none.
 */
export function contactChannels() {
  return {
    email: company.email,
    phone: company.phone,
    supportPage: "/support",
    /** WHMCS sales queue. Same destination as the site's existing CTAs. */
    salesTicket: billing.sales,
    clientLogin: billing.login,
  };
}
