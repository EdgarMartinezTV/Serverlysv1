"use client";
import { usePathname } from "next/navigation";
import { enPathOf } from "./paths";

/**
 * The current path with the language prefix removed ("/es/hosting" → "/hosting",
 * "/es" → "/"). Chrome that styles itself by route (overlay header on the home
 * page, the home-only promo ticker, active nav items) must use this, so a
 * Spanish page looks exactly like its English twin.
 */
export function useSitePathname(): string {
  const p = usePathname() || "/";
  return enPathOf(p) ?? p;
}
