"use client";

import { usePathname } from "next/navigation";
import { t as tx } from "@/i18n/t";

/**
 * Black Friday promo strip above the header — 2026-10-31, part of the
 * Hostinger-style campaign hero (components/home/black-friday-hero.tsx).
 * Homepage only. Delete the <PromoTicker /> line in app/layout.tsx after the
 * campaign.
 *
 * ⚠ EVERY ITEM IS TRUE TODAY. No "24/7 support" or other claim we have not
 * verified; the sale lines match WHMCS promotion BLACKFRIDAY (BLACK_FRIDAY in
 * data/pricing.ts).
 *
 * Surface is red-600 (#be1025): white on it is 6.38:1. red-500, the badge red,
 * is 3.9:1 and fails for 14px text.
 *
 * The track holds two identical copies and moves one copy's width; under
 * reduced motion it simply stands still (the first copy fills the bar).
 */
const ITEMS = [
  "Black Friday: 37% off",
  "Hosting, email and ConvoAI Pro",
  "Ends Dec 7",
  "30-day money-back guarantee",
  "Free migration",
  "Renewal price shown before you buy",
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span aria-hidden="true" className="px-8 text-[15px] font-bold leading-none text-white/90">
            {i % 2 === 0 ? "%" : "✦"}
          </span>
          <span>{tx(item)}</span>
        </li>
      ))}
    </ul>
  );
}

export function PromoTicker() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return (
    <div className="relative overflow-hidden bg-error text-small font-semibold text-white">
      <p className="sr-only">{tx("Black Friday: 37% off your first payment on hosting, email and ConvoAI Pro, until December 7. 30-day money-back guarantee, free migration.")}</p>
      <div className="animate-ticker flex w-max py-1.5">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
