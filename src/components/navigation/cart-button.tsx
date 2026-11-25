"use client";

import { useEffect, useSyncExternalStore } from "react";
import { billing } from "@/data/company";
import { cartStore, refreshCartCountIfStale } from "@/lib/domains/cart";
import { cn } from "@/lib/utils";
import { t as tx } from "@/i18n/t";
import { lh } from "@/i18n/href";

/**
 * Header cart, Hostinger-style: an icon with the WHMCS cart count, linking to
 * the cart. The count is what lib/domains/cart last read from WHMCS (set when a
 * name is added from the domain results). Because that number is cached in
 * localStorage, it is re-checked against the real WHMCS cart whenever a badge
 * is about to show and when the tab regains focus — otherwise a cart emptied
 * in WHMCS (checkout, item removed, session expired) left a stale "1" here.
 *
 * Renders nothing until the visitor has something in the cart — the header
 * stays exactly as it was for everyone else, and the server render (count
 * unknown) matches the first client render.
 */
export function CartButton({ onDark = false }: { onDark?: boolean }) {
  const { count } = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const hasItems = count > 0;
  useEffect(() => {
    if (!hasItems) return;
    void refreshCartCountIfStale();
    const onVisible = () => {
      if (document.visibilityState === "visible") void refreshCartCountIfStale();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [hasItems]);
  if (!hasItems) return null;
  return (
    <a
      href={lh(billing.viewCart)}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-fast",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        onDark
          ? "text-fg-on-dark-secondary ring-1 ring-inset ring-white/15 hover:bg-white/10 hover:text-white focus-visible:outline-white"
          : "text-fg-secondary ring-1 ring-inset ring-line hover:bg-canvas-inset hover:text-fg focus-visible:outline-primary",
      )}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-[1.125rem] w-[1.125rem]">
        <path d="M3.5 4.5h2l2 10h10l2-7H7" />
        <circle cx="9" cy="18.5" r="1.2" />
        <circle cx="17" cy="18.5" r="1.2" />
      </svg>
      <span
        aria-hidden="true"
        className="tabular absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-micro font-semibold text-white"
      >
        {count > 99 ? "99+" : tx(count)}
      </span>
      <span className="sr-only">{tx("Cart, ")}{tx(count)} {count === 1 ? tx("item") : tx("items")}</span>
    </a>
  );
}
