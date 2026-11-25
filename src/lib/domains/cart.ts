import { billing } from "@/data/company";

/**
 * The WHMCS cart, from the marketing site — Hostinger's "Make it yours" /
 * "Get it" behaviour: the name goes into the cart WITHOUT leaving the results,
 * the button turns into "View cart", and the header shows the cart count.
 *
 * WHY THIS WORKS. WHMCS is served at the site root by the front-door proxy, so
 * serverlys.com/cart.php is SAME-ORIGIN with this app: a credentialed fetch to
 * the cart link sets/uses the visitor's real WHMCS session cookie, exactly as
 * clicking the link would. The response is the cart page, whose header carries
 * `<span id="cartItemCount">N</span>` — that is the count we show.
 *
 * WHERE IT CANNOT. On any origin that is not the billing origin (localhost,
 * a staging host) a fetch would be cross-site and the cookie would not stick.
 * `canAddInPlace()` is false there and callers fall back to navigating to the
 * same cart link — the pre-2026-11-01 behaviour, still correct, just not
 * in place.
 *
 * STATE. `count` comes from the `sv_cart` cookie, which a WHMCS hook
 * (includes/hooks/serverlys_cart_cookie.php) sets on every client-area page —
 * so a hosting plan added inside WHMCS shows here too, not only domains added
 * from this site, and an emptied cart deletes it. `added` (names put in the
 * cart this browser session) is sessionStorage. Both are UI hints only — WHMCS
 * is the cart, and `refreshCartCount()` re-reads it. Everything is wrapped:
 * storage can be unavailable (private mode).
 */

type CartState = { count: number; added: readonly string[] };

const COOKIE = "sv_cart";
/** The old localStorage count (before 2026-11-25). Removed on first read: it went stale. */
const LEGACY_COUNT_KEY = "sv-cart-count";
const ADDED_KEY = "sv-cart-added";
const EMPTY: CartState = { count: 0, added: [] };

let state: CartState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): CartState {
  try {
    const m = /(?:^|;\s*)sv_cart=(\d+)/.exec(document.cookie);
    const count = m ? Number(m[1]) : 0;
    try {
      localStorage.removeItem(LEGACY_COUNT_KEY);
    } catch {}
    const added = JSON.parse(sessionStorage.getItem(ADDED_KEY) ?? "[]") as unknown;
    return {
      count: Number.isFinite(count) && count > 0 ? Math.floor(count) : 0,
      added: Array.isArray(added) ? added.filter((d): d is string => typeof d === "string") : [],
    };
  } catch {
    return EMPTY;
  }
}

function write(next: CartState) {
  state = next;
  try {
    // WHMCS sets the cookie on the same response that changed the cart; this
    // keeps it in step when the count came from a re-read.
    document.cookie =
      next.count > 0
        ? `${COOKIE}=${next.count}; path=/; secure; samesite=lax`
        : `${COOKIE}=; path=/; max-age=0; secure; samesite=lax`;
    sessionStorage.setItem(ADDED_KEY, JSON.stringify(next.added));
  } catch {}
  for (const l of listeners) l();
}

export const cartStore = {
  subscribe(listener: () => void) {
    if (!loaded) {
      loaded = true;
      state = read();
    }
    listeners.add(listener);
    // Another tab (e.g. the WHMCS cart) may have changed the cookie.
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      const next = read();
      if (next.count !== state.count) {
        state = next;
        listener();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      listeners.delete(listener);
      document.removeEventListener("visibilitychange", onVisible);
    };
  },
  getSnapshot: () => state,
  getServerSnapshot: () => EMPTY,
};

export function canAddInPlace(): boolean {
  try {
    return new URL(billing.root, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

function countFrom(html: string): number | null {
  const m = /id="cartItemCount"[^>]*>\s*(\d+)/.exec(html);
  return m ? Number(m[1]) : null;
}

/**
 * Put names in the WHMCS cart. Returns true when done in place; false means
 * the caller should navigate to `billing.addDomains(domains)` instead.
 */
export async function addToCart(domains: readonly string[]): Promise<boolean> {
  if (!domains.length || !canAddInPlace()) return false;
  try {
    const res = await fetch(billing.addDomains(domains), { credentials: "include", cache: "no-store" });
    if (!res.ok) return false;
    const count = countFrom(await res.text());
    if (count === null) return false;
    lastRefresh = Date.now();
    write({ count, added: [...new Set([...state.added, ...domains])] });
    return true;
  } catch {
    return false;
  }
}

let lastRefresh = 0;
let inFlight: Promise<void> | null = null;

/**
 * Re-read the count unless it was read in the last `maxAgeMs`. The header
 * calls this whenever it is about to show a badge, so a count left in
 * localStorage after the WHMCS cart was emptied (checkout, an item removed in
 * the cart, an expired WHMCS session) is corrected instead of showing forever.
 */
export function refreshCartCountIfStale(maxAgeMs = 30_000): Promise<void> {
  if (inFlight) return inFlight;
  if (Date.now() - lastRefresh < maxAgeMs) return Promise.resolve();
  inFlight = refreshCartCount().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

/** Re-read the real count from WHMCS (e.g. after the visitor edited the cart). */
export async function refreshCartCount(): Promise<void> {
  if (!canAddInPlace()) return;
  lastRefresh = Date.now();
  try {
    const res = await fetch(billing.viewCart, { credentials: "include", cache: "no-store" });
    const count = res.ok ? countFrom(await res.text()) : null;
    if (count !== null && count !== state.count) {
      // An emptied cart means nothing we "added" is still in it.
      write({ count, added: count === 0 ? [] : state.added });
    }
  } catch {}
}
