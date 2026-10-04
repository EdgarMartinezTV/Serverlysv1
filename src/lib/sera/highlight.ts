import "server-only";
import { planGroups } from "@/data/pricing";
import { NAVIGABLE } from "./navigation-map";

/**
 * What Sera is allowed to point at, and on which page.
 *
 * WHY POINTING IS A CAPABILITY AND NOT A FLOURISH. Sera recommends Starter
 * WordPress, the visitor is looking at a four-card grid of near-identical
 * prices, and the recommendation is a sentence in a panel covering part of the
 * screen. Naming the plan in words leaves them to find it; highlighting the
 * card means they have already found it. The gap between "I recommend Starter"
 * and the visitor's eye landing on the right card is the entire value here.
 *
 * ⚠ THE TARGET IS A DATA ATTRIBUTE, NOT A CSS SELECTOR, AND THE DIFFERENCE IS
 * THE WHOLE DESIGN. A selector-based version — "highlight the third card in
 * the grid" — is correct until someone reorders the grid, and then Sera points
 * confidently at the wrong price. Worse, it would mean handing a
 * model-generated string to `querySelector`, which is a model deciding what
 * part of the page to manipulate.
 *
 * Instead: the model picks a NAME from the list below, the server resolves it
 * against this allowlist, and the client looks up `[data-sera-target="<name>"]`
 * with the resolved value. A hallucinated name resolves to nothing and is
 * refused before it reaches the browser. There is no path from model output to
 * an arbitrary selector.
 *
 * ⚠ AND THE PLAN NAMES ARE DERIVED, NOT TYPED. They come from `planGroups`, the
 * same data that renders the cards and stamps their `data-sera-target`. A
 * hand-maintained copy would drift the first time a tier was renamed, and the
 * failure mode of drift here is Sera promising to show you something and
 * nothing happening — which reads as the site being broken. `scripts/test-sera.mjs`
 * additionally checks every target against the LIVE rendered HTML, the same way
 * it already checks every scroll anchor.
 *
 * ⚠ THE NAME IS `<group>-<tier>` AND NOT `plan.slug`. This was tried with the
 * slug first and the live HTML disagreed on the spot: the Starter WordPress
 * plan's store slug is "your-wordpress-journey-begins-here". Those slugs are
 * WHMCS marketing strings that exist to be order URLs, and asking a model to
 * work out which tier "your-wordpress-journey-begins-here" is guarantees the
 * wrong card gets highlighted sooner or later. `group.id` and `plan.tier` are
 * enums, so "wordpress-starter" is legible to the model, stable against a
 * re-shot store, and unambiguous to a human reading the markup.
 */

export type HighlightTarget = {
  /** The `data-sera-target` value. */
  name: string;
  /** Page it lives on. Highlighting is refused anywhere else. */
  path: string;
  /** Visitor-facing description, for the model's sentence. */
  label: string;
};

/**
 * Which pages render which plan group's cards as four markable elements.
 *
 * ⚠ EVERY ENTRY WAS READ OFF THE RENDERED HTML, NOT INFERRED FROM THE IMPORTS.
 * The first version of this file assumed each group sat on its product page
 * plus /pricing plus /hosting. Three of those were wrong, and the live-HTML
 * check found all three immediately:
 *
 *   /cloud-hosting  used to render ONE plan at a time behind a slider. Since
 *                   2026-10-03 it renders all four PlanCards, so cloud IS
 *                   markable there now (re-checked against the HTML).
 *   /pricing        renders only the ACTIVE tab's group. Cloud is the default,
 *                   so cloud is reliably present and the other two are not —
 *                   they appear only after the visitor switches tabs, which is
 *                   client state Sera cannot see or depend on.
 *   /hosting        renders no plan cards whatsoever.
 *
 * So each group is registered exactly where all four of its cards are in the
 * DOM at load.
 *
 * ⚠ DO NOT ADD A PAGE TO THIS MAP WITHOUT CHECKING THE HTML. A registered
 * target that is not in the DOM is the one failure mode that matters: Sera says
 * "I have marked the Starter card" and nothing on the page changes.
 * `scripts/test-sera.mjs` fetches each page and asserts every target is really
 * there, so a wrong entry fails the suite rather than a visitor's trust.
 */
const GROUP_PAGES: Record<string, readonly string[]> = {
  /* /cloud-hosting renders all four cloud cards since 2026-10-03 (the
     one-plan slider is gone), so the cards are markable there too. */
  cloud: ["/pricing", "/cloud-hosting", "/migrations"],
  wordpress: ["/wordpress-hosting"],
  ecommerce: ["/ecommerce-hosting"],
};

function buildTargets(): readonly HighlightTarget[] {
  const out: HighlightTarget[] = [];
  for (const group of planGroups) {
    const pages = GROUP_PAGES[group.id] ?? [];
    for (const plan of group.plans) {
      for (const path of pages) {
        out.push({
          name: `${group.id}-${plan.tier}`,
          path,
          label: `the ${plan.name} card`,
        });
      }
    }
  }
  return out;
}

const TARGETS = buildTargets();

/**
 * Resolve a model-chosen target for a given page, or null.
 *
 * Two independent conditions, and both must hold: the name is in the derived
 * allowlist, AND it is registered for THIS path. The second is not redundant —
 * "highlight starter-wordpress" is a real target and a dead one on
 * /cloud-hosting, and a highlight that silently does nothing is worse than a
 * refusal, because Sera has already said "look at this".
 */
export function resolveHighlight(name: unknown, path: string): HighlightTarget | null {
  if (typeof name !== "string" || !name) return null;

  const onPage = TARGETS.filter((t) => t.path === path);
  const exact = onPage.find((t) => t.name === name);
  if (exact) return exact;

  /*
   * ⚠ FORGIVING ON THE SPELLING, STRICT ON THE ANSWER.
   *
   * The canonical name is "<group>-<tier>", and the model reliably reaches for
   * the other order — "starter-wordpress" — because that is how the plan is
   * SPOKEN ("Starter WordPress"). Refusing it costs a round, and the round is
   * not free: observed once, the model took the refusal, did not retry, and
   * told the visitor "I have marked the Starter WordPress card on your screen"
   * about a page where nothing had been ringed. A false claim is a much worse
   * outcome than accepting a transposition.
   *
   * ⚠ THIS IS NOT A LOOSENING OF THE ALLOWLIST. Every branch below returns an
   * element of `onPage` or null. No input produces a target that is not already
   * registered for this exact page; the normalisation only changes which
   * spellings FIND a registered target. The model still cannot name anything
   * that does not exist.
   */
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const bySlug = onPage.find((t) => t.name === slug);
  if (bySlug) return bySlug;

  // "starter-wordpress" → "wordpress-starter". Two tokens, reversed.
  const parts = slug.split("-").filter(Boolean);
  if (parts.length === 2) {
    const reversed = `${parts[1]}-${parts[0]}`;
    const byReversed = onPage.find((t) => t.name === reversed);
    if (byReversed) return byReversed;
  }

  /*
   * Last resort: a tier named alone ("starter", "turbo"). Unambiguous here
   * because a page carries exactly one group's cards — which is enforced by
   * GROUP_PAGES above, and asserted by the negative case in the test suite. If
   * that ever stops being true this must stop matching, so it checks.
   */
  if (parts.length === 1) {
    const matches = onPage.filter((t) => t.name.endsWith(`-${parts[0]}`));
    if (matches.length === 1) return matches[0];
  }

  return null;
}

/** Targets available on one page, for the model's catalogue. */
export function highlightsFor(path: string): readonly HighlightTarget[] {
  return TARGETS.filter((t) => t.path === path);
}

/**
 * Compact catalogue handed to the model.
 *
 * Grouped by page so the model can see that a target belongs to a destination
 * — the common call is "take them to /wordpress-hosting#plans and point at
 * starter-wordpress", and that reads correctly only if the pairing is visible.
 */
export function highlightCatalogue(): string {
  const byPath = new Map<string, string[]>();
  for (const target of TARGETS) {
    const list = byPath.get(target.path) ?? [];
    list.push(target.name);
    byPath.set(target.path, list);
  }
  return [...byPath.entries()].map(([path, names]) => `${path}: ${names.join(", ")}`).join(" | ");
}

/** Every distinct target name. For the test suite's live-HTML check. */
export function allHighlightNames(): readonly string[] {
  return [...new Set(TARGETS.map((t) => t.name))];
}

/**
 * Sanity: every page named above must be a page Sera can actually navigate to.
 *
 * Highlighting is reached either by navigating there first or by already being
 * there, and both go through the navigation map. A target on a page Sera cannot
 * open is unreachable by construction, so it is a mistake worth failing the
 * import over rather than a dead entry nobody notices.
 */
function assertPagesNavigable(): void {
  const navigable = new Set(NAVIGABLE.map((page) => page.path));
  const orphans = [...new Set(TARGETS.map((t) => t.path))].filter((p) => !navigable.has(p));
  if (orphans.length > 0) {
    throw new Error(
      `[sera] highlight targets registered on non-navigable pages: ${orphans.join(", ")}. ` +
        `Add the page to navigation-map.ts or remove it from GROUP_PAGES.`,
    );
  }
}
assertPagesNavigable();
