import type { CheckError, DomainResult } from "./types";

/**
 * Browser-side client for /api/domains/check.
 *
 * Owns the network concerns the UI should not: aborting a superseded request,
 * one retry for transient failures, and turning every failure mode into a typed
 * CheckError the UI can render deliberately.
 */

export type CheckSuccess = { results: DomainResult[]; source: "whmcs" | "rdap" };

const CLIENT_TIMEOUT_MS = 15_000;

function isTransient(status: number) {
  // Retry only what is plausibly transient. Never retry 4xx — the input is
  // wrong, or we are rate-limited and retrying makes it worse.
  return status === 502 || status === 504;
}

export async function checkDomains(
  query: string,
  signal: AbortSignal,
): Promise<{ ok: true; data: CheckSuccess } | { ok: false; error: CheckError }> {
  const attempt = async (): Promise<Response> => {
    const timer = new AbortController();
    const timeout = setTimeout(() => timer.abort(), CLIENT_TIMEOUT_MS);
    const onAbort = () => timer.abort();
    signal.addEventListener("abort", onAbort, { once: true });
    try {
      return await fetch("/api/domains/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: timer.signal,
      });
    } finally {
      clearTimeout(timeout);
      signal.removeEventListener("abort", onAbort);
    }
  };

  try {
    let res = await attempt();
    if (isTransient(res.status) && !signal.aborted) {
      await new Promise((r) => setTimeout(r, 600));
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
      res = await attempt();
    }

    const body: unknown = await res.json().catch(() => null);

    if (res.ok && body && typeof body === "object" && "results" in body) {
      const data = body as { results: DomainResult[]; source: "whmcs" | "rdap" };
      return { ok: true, data: { results: data.results, source: data.source } };
    }

    if (body && typeof body === "object" && "error" in body) {
      return { ok: false, error: (body as { error: CheckError }).error };
    }

    return {
      ok: false,
      error: { kind: "provider", message: "The lookup failed. Try again." },
    };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      // Either superseded by a newer search or timed out client-side.
      return signal.aborted
        ? { ok: false, error: { kind: "network", message: "Search cancelled." } }
        : {
            ok: false,
            error: { kind: "timeout", message: "The lookup took too long. Try again." },
          };
    }
    return {
      ok: false,
      error: {
        kind: "network",
        message: "Could not reach the server. Check your connection.",
      },
    };
  }
}

// ── Local persistence ──────────────────────────────────────────────────────
// Versioned keys so a shape change cannot resurrect incompatible saved data.
const RECENT_KEY = "serverlys.domain.recent.v1";
const SHORTLIST_KEY = "serverlys.domain.shortlist.v1";
const MAX_RECENT = 6;
const MAX_SHORTLIST = 12;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    // Private mode, quota, or corrupt JSON — persistence is a convenience,
    // never a requirement for the search to work.
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export const recentSearches = {
  read: () => read<string[]>(RECENT_KEY, []),
  add(query: string) {
    const next = [query, ...read<string[]>(RECENT_KEY, []).filter((q) => q !== query)];
    write(RECENT_KEY, next.slice(0, MAX_RECENT));
    return next.slice(0, MAX_RECENT);
  },
  clear() {
    write(RECENT_KEY, []);
    return [] as string[];
  },
};

export type ShortlistItem = { domain: string; price: number | null };

export const shortlist = {
  read: () => read<ShortlistItem[]>(SHORTLIST_KEY, []),
  toggle(item: ShortlistItem) {
    const current = read<ShortlistItem[]>(SHORTLIST_KEY, []);
    const exists = current.some((i) => i.domain === item.domain);
    const next = exists
      ? current.filter((i) => i.domain !== item.domain)
      : // Full list: the newest save wins and the oldest drops off. Keeping the
        // front instead silently refused every save past the cap.
        [...current, item].slice(-MAX_SHORTLIST);
    write(SHORTLIST_KEY, next);
    return next;
  },
  remove(domain: string) {
    const next = read<ShortlistItem[]>(SHORTLIST_KEY, []).filter(
      (i) => i.domain !== domain,
    );
    write(SHORTLIST_KEY, next);
    return next;
  },
  clear() {
    write(SHORTLIST_KEY, []);
    return [] as ShortlistItem[];
  },
};

/**
 * Tiny external stores for the persisted values.
 *
 * localStorage is an external store, so `useSyncExternalStore` is the correct
 * way to read it — not a setState inside a mount effect, which causes a
 * cascading render and trips react-hooks/set-state-in-effect. Snapshots are
 * cached so the hook sees a stable reference between changes.
 */
function makeStore<T>(load: () => T, empty: T) {
  let snapshot: T = empty;
  let loaded = false;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((l) => l());

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      // First subscriber triggers the initial read, which happens on the
      // client only — the server snapshot stays `empty`, so markup matches.
      if (!loaded) {
        loaded = true;
        snapshot = load();
        queueMicrotask(emit);
      }
      return () => listeners.delete(listener);
    },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => empty,
    set(next: T) {
      snapshot = next;
      emit();
    },
  };
}

export const recentStore = makeStore<string[]>(recentSearches.read, []);
export const shortlistStore = makeStore<ShortlistItem[]>(shortlist.read, []);
