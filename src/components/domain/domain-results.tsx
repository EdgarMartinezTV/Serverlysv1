"use client";

/**
 * Domain search results — 2026-11-01, matched to hostinger.com/domain-name-results.
 *
 * Hostinger's results, top to bottom, and what each became here:
 *
 *   Exact match card        → ExactMatch: price, "/1st yr", "Make it yours",
 *                             the extension's note and a one-line AI read of
 *                             what the name suits (/api/domains/describe).
 *   "X is already taken.    → Taken/unsupported/unknown verdict row, then a
 *    We found a great         "Great alternative" card for the first available
 *    alternative"             Popular extension.
 *   Bundle & save           → Bundle: name.com + .org + .info, one click. NO
 *                             "save": WHMCS sells every TLD at one price, so
 *                             there is no discount to claim. The sum is real.
 *   Black Friday strip      → FreeDomainStrip: the free-domain-with-annual-
 *                             hosting offer WHMCS actually applies (verified
 *                             with a real cart 2026-11-01).
 *   More options + tabs     → MoreOptions: WHMCS's own TLD categories as tabs
 *                             (Popular first, All last); a tab checks the
 *                             extensions it has not checked yet. Taken names
 *                             are left out, like Hostinger, but counted.
 *   Get it → View cart,     → In-place add through lib/domains/cart (same-origin
 *    header cart count        WHMCS cart), header badge, HostingUpsell after the
 *    + hosting upsell         first add.
 *
 * Deliberately NOT copied: struck-through "regular" prices. Hostinger's are
 * promos; ours are flat, and the site's rule is that a price is shown with the
 * rate it renews at — so every price carries "renews at" instead.
 *
 * Test contracts kept (scripts/test-domain-search.mjs): every verdict is an
 * <li>; a taken or unsold name has no `domain=register` link; available names
 * link to the WHMCS cart (the link IS the fallback when in-place add is not
 * possible); "Transfer it here"; Available/Taken badges; aria-pressed save.
 */

import { useEffect, useState, useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/badge";
import { billing } from "@/data/company";
import { FREE_WITH_HOSTING, type Tld } from "@/data/tlds";
import { groupById, quote, formatPrice, type Plan } from "@/data/pricing";
import { addToCart, cartStore } from "@/lib/domains/cart";
import type { DomainResult } from "@/lib/domains/types";
import { cn } from "@/lib/utils";

/* ── Shared bits ─────────────────────────────────────────────────────────── */

function Name({ domain, size = "md" }: { domain: string; size?: "md" | "lg" }) {
  const dot = domain.indexOf(".");
  return (
    <span
      className={cn(
        "break-all font-semibold text-fg",
        size === "lg" ? "text-[26px] leading-8 tracking-[-0.02em]" : "text-body-lg",
      )}
    >
      {dot > 0 ? domain.slice(0, dot) : domain}
      {dot > 0 && <span className="text-primary">{domain.slice(dot)}</span>}
    </span>
  );
}

function SaveButton({ domain, saved, onToggle }: { domain: string; saved: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={saved}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        saved ? "bg-brand-50 text-primary ring-brand-200" : "bg-white text-fg-muted ring-line hover:text-primary",
      )}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
        <path
          d="M8 13.5S2.5 10.3 2.5 6.4A2.9 2.9 0 0 1 8 5a2.9 2.9 0 0 1 5.5 1.4C13.5 10.3 8 13.5 8 13.5Z"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">{saved ? `Remove ${domain} from saved names` : `Save ${domain}`}</span>
    </button>
  );
}

/**
 * The add-to-cart control. Always a real link to the WHMCS cart (works with no
 * JS, and is the fallback off the billing origin); with JS on the billing
 * origin it adds in place and turns into "View cart".
 */
function AddButton({
  domains,
  label,
  primary = false,
  onAdded,
  srName,
}: {
  domains: readonly string[];
  label: string;
  primary?: boolean;
  onAdded?: (domains: readonly string[]) => void;
  srName: string;
}) {
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const [busy, setBusy] = useState(false);
  const added = domains.every((d) => cart.added.includes(d));
  const base =
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  if (added) {
    return (
      <a
        href={billing.viewCart}
        className={cn(base, "h-11 bg-success-soft px-5 text-small text-success ring-1 ring-inset ring-success/30 hover:bg-success/15")}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        View cart
        <span className="sr-only"> ({srName} added)</span>
      </a>
    );
  }

  const href = domains.length === 1 ? billing.addDomain(domains[0]) : billing.addDomains(domains);
  return (
    <a
      href={href}
      aria-busy={busy || undefined}
      onClick={async (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        const ok = await addToCart(domains);
        setBusy(false);
        if (ok) onAdded?.(domains);
        else window.location.assign(href);
      }}
      className={cn(
        base,
        primary
          ? "h-12 bg-primary px-6 text-body text-white shadow-e2 hover:bg-primary-hover"
          : "h-11 px-5 text-small text-primary ring-1 ring-inset ring-primary hover:bg-primary hover:text-white",
        busy && "opacity-70",
      )}
    >
      {busy ? "Adding…" : label}
      <span className="sr-only"> {srName}</span>
    </a>
  );
}

function PriceBlock({ price, renew, large = false }: { price: number; renew: number | null; large?: boolean }) {
  return (
    <p className="mr-auto text-left sm:mr-0 sm:text-right">
      <span className={cn("tabular font-semibold text-fg", large ? "text-[26px] leading-none tracking-[-0.02em]" : "text-body-lg")}>
        ${price.toFixed(2)}
      </span>
      <span className="text-small text-fg-muted">/1st yr</span>
      {renew !== null && (
        <span className="block text-micro text-fg-muted">Renews at ${renew.toFixed(2)}/yr</span>
      )}
    </p>
  );
}

/* ── Exact match / great alternative ─────────────────────────────────────── */

function useDescription(domain: string | null) {
  const [line, setLine] = useState<{ domain: string; text: string | null } | null>(null);
  useEffect(() => {
    if (!domain) return;
    const ctrl = new AbortController();
    fetch("/api/domains/describe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : { line: null }))
      .then((d: { line?: string | null }) => setLine({ domain, text: d.line ?? null }))
      .catch(() => {});
    return () => ctrl.abort();
  }, [domain]);
  return line && line.domain === domain ? line.text : null;
}

function OfferCard({
  label,
  result,
  tld,
  saved,
  onToggleSave,
  onAdded,
}: {
  label: string;
  result: DomainResult;
  tld: Tld | undefined;
  saved: boolean;
  onToggleSave: () => void;
  onAdded: (d: readonly string[]) => void;
}) {
  const describe = useDescription(result.source === "whmcs" ? result.domain : null);
  const price = result.price ?? tld?.price ?? null;
  return (
    <li className="flex flex-col gap-5 rounded-2xl bg-success-soft p-5 ring-1 ring-inset ring-success/25 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-micro font-semibold tracking-wide text-success uppercase">{label}</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Name domain={result.domain} size="lg" />
            <Badge tone="success">Available</Badge>
          </p>
        </div>
        {price !== null && (
          <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-3 sm:w-auto sm:flex-nowrap">
            <PriceBlock price={price} renew={tld?.renew ?? null} large />
            <SaveButton domain={result.domain} saved={saved} onToggle={onToggleSave} />
            {result.source === "whmcs" ? (
              <AddButton domains={[result.domain]} label="Make it yours" primary onAdded={onAdded} srName={result.domain} />
            ) : (
              /* RDAP fallback: WHMCS has not confirmed it, so its own search re-checks. */
              <a
                href={billing.searchDomain(result.domain)}
                className="inline-flex h-12 shrink-0 items-center rounded-full bg-primary px-6 text-body font-semibold text-white shadow-e2 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Make it yours<span className="sr-only"> {result.domain}</span>
              </a>
            )}
          </div>
        )}
      </div>
      {(tld?.note || describe) && (
        <ul className="flex flex-col gap-1.5 border-t border-success/20 pt-4 text-small text-fg-secondary">
          {tld?.note && (
            <li className="flex gap-2">
              <Tick />
              <span>
                <span className="font-semibold text-fg">{tld.tld}</span> — {tld.note}.
              </span>
            </li>
          )}
          {describe && (
            <li className="flex gap-2">
              <Tick />
              <span>{describe}</span>
            </li>
          )}
        </ul>
      )}
    </li>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success-fill">
      <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The exact name when it is NOT available: what happened, and what to do. */
function Verdict({ result }: { result: DomainResult }) {
  const { domain, status } = result;
  return (
    <li className="flex flex-col gap-2 rounded-2xl bg-canvas-secondary p-5 ring-1 ring-inset ring-line sm:p-6">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Name domain={domain} size="lg" />
        {status === "registered" && <Badge tone="neutral">Taken</Badge>}
        {(status === "unsupported" || (status === "available" && result.price === null)) && (
          <Badge tone="neutral">Not offered</Badge>
        )}
        {status === "unknown" && <Badge tone="warning">No answer</Badge>}
      </p>
      <p className="text-small text-fg-secondary">
        {status === "registered" && (
          <>
            Already registered.{" "}
            <a href={billing.transferDomainSearch(domain)} className="rounded-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-hover">
              Transfer it here
            </a>{" "}
            if it is yours, or{" "}
            <a href={`/whois-lookup?domain=${encodeURIComponent(domain)}`} className="rounded-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-hover">
              see who owns it
            </a>
            .
          </>
        )}
        {(status === "unsupported" || (status === "available" && result.price === null)) && (
          <>
            We do not sell this extension{result.tld ? ` (${result.tld})` : ""} yet.{" "}
            <a href="/domain-name#tld-prices" className="rounded-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-hover">
              See the extensions we offer
            </a>
            .
          </>
        )}
        {status === "unknown" && (
          <>
            {result.reason ?? "The registry did not answer in time."}{" "}
            <a href={billing.searchDomain(domain)} className="rounded-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-hover">
              Search in the cart
            </a>
            .
          </>
        )}
      </p>
    </li>
  );
}

/* ── Bundle ──────────────────────────────────────────────────────────────── */

const BUNDLE = [".com", ".org", ".info"] as const;

function Bundle({ sld, results, catalog, onAdded }: { sld: string; results: Map<string, DomainResult>; catalog: readonly Tld[]; onAdded: (d: readonly string[]) => void }) {
  const rows = BUNDLE.map((t) => results.get(`${sld}${t}`));
  if (rows.some((r) => !r || r.status !== "available" || r.source !== "whmcs" || r.price === null)) return null;
  const domains = rows.map((r) => r!.domain);
  const total = rows.reduce((sum, r) => sum + (r!.price ?? 0), 0);
  const renew = BUNDLE.reduce((sum, t) => sum + (catalog.find((c) => c.tld === t)?.renew ?? 0), 0);
  return (
    <li className="flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-inset ring-line sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="min-w-0">
        <p className="text-micro font-semibold tracking-wide text-primary uppercase">Bundle</p>
        <p className="mt-1.5 text-body-lg font-semibold break-all text-fg">
          {sld}
          <span className="text-primary">.com</span> + <span className="text-primary">.org</span> +{" "}
          <span className="text-primary">.info</span>
        </p>
        <p className="mt-1 text-small text-fg-secondary">Keep the name yours on all three, managed from one account.</p>
      </div>
      <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-3 sm:w-auto sm:flex-nowrap">
        <PriceBlock price={total} renew={renew || null} />
        <AddButton domains={domains} label="Get all three" onAdded={onAdded} srName={domains.join(", ")} />
      </div>
    </li>
  );
}

/* ── Free domain with hosting ────────────────────────────────────────────── */

function FreeDomainStrip() {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-brand-50 px-5 py-4 text-small sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <p className="text-fg">
        <span className="font-semibold">Free domain for the first year with hosting.</span>{" "}
        <span className="text-fg-secondary">
          {FREE_WITH_HOSTING.join(", ")} on any Cloud, WordPress or WooCommerce plan billed yearly or longer.
        </span>
      </p>
      <a href="/pricing" className="shrink-0 rounded-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-hover">
        See hosting plans
      </a>
    </div>
  );
}

/* ── More options (category tabs) ────────────────────────────────────────── */

function OptionRow({
  result,
  tld,
  best,
  saved,
  onToggleSave,
  onAdded,
}: {
  result: DomainResult;
  tld: Tld | undefined;
  best: boolean;
  saved: boolean;
  onToggleSave: () => void;
  onAdded: (d: readonly string[]) => void;
}) {
  const sellable = result.status === "available" && result.price !== null;
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Name domain={result.domain} />
          {best && sellable && (
            <span className="rounded-md bg-success-soft px-2 py-0.5 text-micro font-semibold text-success">Best value</span>
          )}
          {result.status === "available" && <Badge tone="success">Available</Badge>}
          {result.status === "unknown" && <Badge tone="warning">No answer</Badge>}
        </p>
        {result.status === "unknown" && (
          <p className="mt-1 text-small text-fg-muted">
            {result.reason ?? "The registry did not answer in time."}{" "}
            <a href={billing.searchDomain(result.domain)} className="font-medium text-primary underline underline-offset-4">
              Check in the cart
            </a>
          </p>
        )}
      </div>
      {sellable && (
        <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-3 sm:w-auto sm:flex-nowrap">
          <PriceBlock price={result.price!} renew={tld?.renew ?? null} />
          <SaveButton domain={result.domain} saved={saved} onToggle={onToggleSave} />
          {result.source === "whmcs" ? (
            <AddButton domains={[result.domain]} label="Get it" onAdded={onAdded} srName={result.domain} />
          ) : (
            <a
              href={billing.searchDomain(result.domain)}
              className="inline-flex h-11 shrink-0 items-center rounded-full px-5 text-small font-semibold text-primary ring-1 ring-inset ring-primary hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Get it<span className="sr-only"> {result.domain}</span>
            </a>
          )}
        </div>
      )}
    </li>
  );
}

/* ── Hosting upsell (after the first add) ────────────────────────────────── */

function PlanOffer({ plan, groupSlug, recommended, domain }: { plan: Plan; groupSlug: string; recommended: boolean; domain: string }) {
  const q = quote(plan, "annually");
  const free = q.freeDomain && FREE_WITH_HOSTING.some((t) => domain.endsWith(t));
  const first = q.bf ? q.bf.perMonth : q.perMonth;
  return (
    <li className={cn("flex flex-col gap-3 rounded-2xl p-5 ring-1 ring-inset", recommended ? "bg-brand-50 ring-brand-200" : "bg-white ring-line")}>
      <p className="flex flex-wrap items-center gap-2">
        <span className="text-body-lg font-semibold text-fg">{plan.name}</span>
        {recommended && <Badge tone="brand">Recommended</Badge>}
      </p>
      <p className="text-small text-fg-secondary">
        {free ? (
          <>
            Launch <span className="font-semibold text-fg">{domain}</span> and get the domain free for the first year.{" "}
          </>
        ) : (
          <>
            Host <span className="font-semibold text-fg">{domain}</span>.{" "}
          </>
        )}
        {plan.summary}
      </p>
      <p>
        <span className="tabular text-h4 font-semibold text-fg">{formatPrice(first)}</span>
        <span className="text-small text-fg-muted">/mo billed yearly</span>
        <span className="block text-micro text-fg-muted">
          {q.bf ? `Black Friday first year; renews at ${formatPrice(q.perMonth)}/mo` : "Renews at the same price"}
          {q.setup ? ` · ${formatPrice(q.bf ? q.bf.setup : q.setup)} one-off setup` : ""}
        </span>
      </p>
      <a
        href={`${billing.order(groupSlug, plan.slug)}?billingcycle=annually`}
        className={cn(
          "mt-auto inline-flex h-11 items-center justify-center rounded-full px-5 text-small font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          recommended ? "bg-primary text-white hover:bg-primary-hover" : "text-primary ring-1 ring-inset ring-primary hover:bg-primary hover:text-white",
        )}
      >
        Choose {plan.name}
      </a>
    </li>
  );
}

function HostingUpsell({ domain }: { domain: string }) {
  const cloud = groupById("cloud");
  const turbo = cloud?.plans.find((p) => p.tier === "turbo");
  const plus = cloud?.plans.find((p) => p.tier === "plus");
  if (!cloud || !turbo || !plus) return null;
  return (
    <section aria-labelledby="upsell-heading" className="rounded-2xl bg-canvas-secondary p-5 sm:p-6">
      <h3 id="upsell-heading" className="text-body-lg font-semibold text-fg">
        Put {domain} online
      </h3>
      <p className="mt-1 text-small text-fg-secondary">
        In the cart, choose <span className="font-medium text-fg">Use a domain already in my shopping cart</span> and pick {domain}.
      </p>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        <PlanOffer plan={turbo} groupSlug={cloud.group} recommended domain={domain} />
        <PlanOffer plan={plus} groupSlug={cloud.group} recommended={false} domain={domain} />
      </ul>
    </section>
  );
}

/* ── The whole results panel ─────────────────────────────────────────────── */

export function DomainResults({
  query,
  results,
  catalog,
  categories,
  category,
  onCategory,
  loadingCategory,
  source,
  isSaved,
  onToggleSave,
  similar,
}: {
  /** The exact name searched, e.g. "bluefern.com". */
  query: string;
  results: Map<string, DomainResult>;
  catalog: readonly Tld[];
  categories: readonly string[];
  category: string;
  onCategory: (c: string) => void;
  loadingCategory: string | null;
  source: string;
  isSaved: (domain: string) => boolean;
  onToggleSave: (r: DomainResult) => void;
  similar: React.ReactNode;
}) {
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const exact = results.get(query);
  const sld = exact?.sld ?? query.split(".")[0];
  const tldOf = (t: string) => catalog.find((c) => c.tld === t);

  const popularOrder = catalog.filter((t) => t.categories?.includes("Popular")).map((t) => t.tld);
  const alternative =
    exact && (exact.status !== "available" || exact.price === null)
      ? [...popularOrder, ...catalog.map((t) => t.tld)]
          .map((t) => results.get(`${sld}${t}`))
          .find((r) => r && r.domain !== query && r.status === "available" && r.price !== null)
      : undefined;

  const inTab = (category === "All" ? catalog : catalog.filter((t) => t.categories?.includes(category)))
    .map((t) => results.get(`${sld}${t.tld}`))
    .filter((r): r is DomainResult => !!r && r.domain !== query);
  const shown = inTab.filter((r) => r.status === "available" || r.status === "unknown");
  const hidden = inTab.length - shown.length;
  const cheapest = shown
    .filter((r) => r.status === "available" && r.price !== null)
    .reduce<DomainResult | null>((a, b) => (a && (a.price ?? 0) <= (b.price ?? 0) ? a : b), null);

  const onAdded = (d: readonly string[]) => setJustAdded(d[0]);

  return (
    <div className="flex flex-col gap-6">
      {exact && exact.status !== "available" && exact.status === "registered" && alternative && (
        <p role="status" className="text-body text-fg">
          <span className="font-semibold">{exact.domain}</span> is already taken. We found a great alternative just for you!
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {exact && exact.status === "available" && exact.price !== null ? (
          <OfferCard
            label="Exact match"
            result={exact}
            tld={tldOf(exact.tld)}
            saved={isSaved(exact.domain)}
            onToggleSave={() => onToggleSave(exact)}
            onAdded={onAdded}
          />
        ) : (
          exact && <Verdict result={exact} />
        )}
        {alternative && (
          <OfferCard
            label="Great alternative"
            result={alternative}
            tld={tldOf(alternative.tld)}
            saved={isSaved(alternative.domain)}
            onToggleSave={() => onToggleSave(alternative)}
            onAdded={onAdded}
          />
        )}
        {exact?.status === "available" && exact.tld === ".com" && (
          <Bundle sld={sld} results={results} catalog={catalog} onAdded={onAdded} />
        )}
      </ul>

      {justAdded && <HostingUpsell domain={justAdded} />}

      {similar}

      <FreeDomainStrip />

      <div>
        <h3 className="text-body-lg font-semibold text-fg">More options</h3>
        <div role="tablist" aria-label="Extension categories" className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {[...categories, "All"].map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => onCategory(c)}
              className={cn(
                "inline-flex min-h-9 shrink-0 items-center rounded-full px-3.5 text-small whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                category === c ? "bg-fg font-semibold text-white" : "bg-white text-fg ring-1 ring-line hover:bg-canvas-secondary",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <ul role="tabpanel" aria-label={`${category} extensions`} aria-busy={loadingCategory === category || undefined} className="mt-2 flex flex-col divide-y divide-line-subtle">
          {shown.map((r) => (
            <OptionRow
              key={r.domain}
              result={r}
              tld={tldOf(r.tld)}
              best={cheapest?.domain === r.domain}
              saved={isSaved(r.domain)}
              onToggleSave={() => onToggleSave(r)}
              onAdded={onAdded}
            />
          ))}
          {loadingCategory === category &&
            Array.from({ length: 3 }, (_, i) => <li key={`sk${i}`} aria-hidden="true" className="my-2 h-14 animate-pulse rounded-xl bg-canvas-inset" />)}
          {loadingCategory !== category && shown.length === 0 && (
            <li className="py-6 text-center text-small text-fg-muted">No available names in this group.</li>
          )}
        </ul>
        {hidden > 0 && loadingCategory !== category && (
          <p className="mt-2 text-small text-fg-muted">
            {hidden} more {hidden === 1 ? "extension is" : "extensions are"} already taken for {sld}.
          </p>
        )}
      </div>

      <p className="text-small text-fg-muted">
        Prices are first-year registration, with the yearly renewal shown beside each. Premium names are priced by the
        registry and labelled before checkout.
        {source === "rdap" && <> Availability is read live from the domain registry.</>}
      </p>
    </div>
  );
}
