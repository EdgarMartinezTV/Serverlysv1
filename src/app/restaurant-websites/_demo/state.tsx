"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { track } from "@/lib/analytics";
import type { Locale } from "../_i18n";
import { DEMO_COPY, type DemoCopy } from "./copy";
import { MENU, type MenuItem, type Tag } from "./menu";

/**
 * Shared state for the Lumbre demo: the cart, the menu filter, and the
 * cross-section hand-offs the assistant uses ("show gluten-free", "book 7:30",
 * "add the churrasco"). Everything lives in this tab's memory; nothing is
 * persisted or sent anywhere.
 */

export type CartLine = { key: string; itemId: string; option: number | null; qty: number };

export type ReservePrefill = { party: number; date: Date; minutes?: number; nonce: number };

type Ctx = {
  locale: Locale;
  copy: DemoCopy;
  lines: CartLine[];
  add: (item: MenuItem, option: number | null, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  filter: Tag | null;
  setFilter: (t: Tag | null) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  prefill: ReservePrefill | null;
  prefillReservation: (p: Omit<ReservePrefill, "nonce">) => void;
  announce: (msg: string) => void;
  goTo: (id: "menu" | "reserve" | "assistant" | "visit") => void;
};

const LumbreContext = createContext<Ctx | null>(null);

export function useLumbre(): Ctx {
  const ctx = useContext(LumbreContext);
  if (!ctx) throw new Error("useLumbre outside <LumbreProvider>");
  return ctx;
}

/**
 * Demo engagement for analytics: what a restaurant owner actually tried.
 * One event name with an `action` so the funnel reads as a single report.
 */
export type DemoAction = "add_to_cart" | "order_placed" | "reservation_confirmed" | "assistant_question";
export const trackDemo = (action: DemoAction, locale: Locale) => track("restaurant_demo", { action, locale });

export function LumbreProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [filter, setFilter] = useState<Tag | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [prefill, setPrefill] = useState<ReservePrefill | null>(null);
  const [message, setMessage] = useState("");
  const nonce = useRef(0);

  const add = useCallback((item: MenuItem, option: number | null, qty = 1) => {
    const key = `${item.id}:${option ?? "-"}`;
    trackDemo("add_to_cart", locale);
    setLines((cur) => {
      const found = cur.find((l) => l.key === key);
      if (found) return cur.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      return [...cur, { key, itemId: item.id, option, qty }];
    });
  }, [locale]);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((cur) => (qty <= 0 ? cur.filter((l) => l.key !== key) : cur.map((l) => (l.key === key ? { ...l, qty } : l))));
  }, []);

  const goTo = useCallback((id: "menu" | "reserve" | "assistant" | "visit") => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    // Move focus with the view so keyboard and screen-reader users land there too.
    const heading = el.querySelector<HTMLElement>("h2");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
  }, []);

  const value = useMemo<Ctx>(() => {
    const priced = lines.map((l) => ({ l, item: MENU.find((m) => m.id === l.itemId)! }));
    return {
      locale,
      copy: DEMO_COPY[locale],
      lines,
      add,
      setQty,
      clear: () => setLines([]),
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: priced.reduce((s, { l, item }) => s + item.price * l.qty, 0),
      filter,
      setFilter,
      cartOpen,
      setCartOpen,
      prefill,
      prefillReservation: (p) => {
        nonce.current += 1;
        setPrefill({ ...p, nonce: nonce.current });
      },
      announce: (msg) => {
        // Clear first so the same message twice is announced twice.
        setMessage("");
        window.setTimeout(() => setMessage(msg), 30);
      },
      goTo,
    };
  }, [locale, lines, add, setQty, filter, cartOpen, prefill, goTo]);

  return (
    <LumbreContext.Provider value={value}>
      {children}
      <p role="status" aria-live="polite" className="sr-only">
        {message}
      </p>
    </LumbreContext.Provider>
  );
}

/**
 * The current time, client-only. Null during SSR and hydration, so nothing
 * date-dependent (today's hours, which dates are bookable) can mismatch the
 * server render; it resolves on the first client render after hydration.
 * Snapshotted once per minute so the reference is stable between renders.
 */
let snapshot: Date | null = null;
let snapshotMinute = -1;
function getNow(): Date {
  const minute = Math.floor(Date.now() / 60_000);
  if (minute !== snapshotMinute || !snapshot) {
    snapshotMinute = minute;
    snapshot = new Date();
  }
  return snapshot;
}
const noop = () => () => {};
export function useNow(): Date | null {
  return useSyncExternalStore(noop, getNow, () => null);
}

export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));
