"use client";

import { billing } from "@/data/company";

/**
 * /start's one action: the business name goes to the Starter Cloud order page
 * (12 months), which searches it and shows whether it is available.
 *
 * Edgar, 2026-11-26: "this is the cart I'm talking about" —
 * serverlys.com/store/cloud-hosting/starter-cloud. That page (WHMCS orderform
 * Serverlys, js/sx-cart.js `fromLink`, live since 2026-11-26) reads
 * ?domainoption=register&sld=<name>[&tld=.x], fills its "Search for your domain
 * name" box and runs the search: an available exact match is picked into the
 * order summary (year 1 free where the TLD qualifies); a taken one shows
 * "Taken", the alternatives, and points to "I already have one" / "Transfer my
 * domain". The period picker and the plan summary are on that page.
 *
 * "Fresh Bakery & Co." → sld "freshbakeryandco"; "www.Bakery.net" → "bakery" + ".net".
 * Without JavaScript the plain form still opens the order page.
 */
const ORDER_URL = billing.order("cloud-hosting", "starter-cloud");

function toNameParts(raw: string): { sld: string; tld: string } | null {
  let v = raw.trim().toLowerCase();
  v = v.replace(/^[a-z][a-z0-9+.-]*:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0];
  v = v.normalize("NFKD").replace(/[̀-ͯ]/g, "");
  v = v.replace(/&/g, "and").replace(/['’]/g, "");
  const compact = v.replace(/\s+/g, "");
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(compact)) {
    const dot = compact.indexOf(".");
    return { sld: compact.slice(0, dot), tld: compact.slice(dot) };
  }
  const sld = v.replace(/[^a-z0-9-]+/g, "").replace(/^-+|-+$/g, "").slice(0, 63);
  return sld.length >= 2 ? { sld, tld: "" } : null;
}

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-6" fill="none">
      <path d="M4 10h11m-4-5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NameField({ id, variant }: { id: string; variant: "dark" | "light" }) {
  const dark = variant === "dark";
  return (
    <form
      action={ORDER_URL}
      method="get"
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem("sld") as HTMLInputElement;
        const parts = toNameParts(input.value);
        if (!parts) {
          input.focus();
          return;
        }
        const q = new URLSearchParams({ billingcycle: "annually", domainoption: "register", sld: parts.sld });
        if (parts.tld) q.set("tld", parts.tld);
        // WHMCS order page, served by the front-door proxy — not a Next.js route.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign(`${ORDER_URL}?${q}`);
      }}
    >
      <input type="hidden" name="billingcycle" value="annually" />
      <input type="hidden" name="domainoption" value="register" />
      <label htmlFor={id} className="sr-only">
        Your business name or domain
      </label>
      <div
        className={`flex items-center rounded-full p-1.5 pl-5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white ${
          dark ? "border border-white/25 bg-black" : "bg-white"
        }`}
      >
        <input
          id={id}
          name="sld"
          type="text"
          required
          autoComplete="organization"
          autoCapitalize="words"
          spellCheck={false}
          placeholder="Enter your business name"
          className={`min-w-0 flex-1 bg-transparent py-2.5 text-[17px] focus:outline-none ${
            dark ? "text-white placeholder:text-white/70" : "text-black placeholder:text-black/55"
          }`}
        />
        <button
          type="submit"
          aria-label="Check availability"
          className={`grid size-11 shrink-0 place-items-center rounded-full transition-transform hover:scale-105 ${
            dark ? "text-white" : "bg-black text-white"
          }`}
        >
          <Arrow />
        </button>
      </div>
    </form>
  );
}
