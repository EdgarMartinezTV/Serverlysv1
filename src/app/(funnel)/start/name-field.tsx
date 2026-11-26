"use client";

import { billing } from "@/data/company";

/**
 * /start's one action. Sends the visitor to the plan the page advertises —
 * Starter Cloud, 12 months (WHMCS pid 1), which includes the free first-year
 * domain — with the name they typed already in its "Register a new domain"
 * box. Verified live 2026-11-25: cart.php?a=add&pid=1&billingcycle=annually
 * &domainoption=register&sld=…&tld=… redirects to
 * /store/cloud-hosting/starter-cloud with `registersld` prefilled.
 *
 * WHMCS wants the name split into sld + tld, so "bakery.com" or
 * "https://www.Bakery.co" is normalised here before submitting. Without
 * JavaScript the form still posts `sld` with a .com default.
 */
const STARTER_CLOUD_PID = 1;

function split(raw: string): { sld: string; tld: string } {
  const clean = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/\s+/g, "");
  const dot = clean.indexOf(".");
  if (dot <= 0) return { sld: clean.replace(/[^a-z0-9-]/g, ""), tld: ".com" };
  return {
    sld: clean.slice(0, dot).replace(/[^a-z0-9-]/g, ""),
    tld: clean.slice(dot),
  };
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
      action={`${billing.root}/cart.php`}
      method="get"
      className="w-full"
      onSubmit={(e) => {
        const form = e.currentTarget;
        const input = form.elements.namedItem("sld") as HTMLInputElement;
        const tld = form.elements.namedItem("tld") as HTMLInputElement;
        const parts = split(input.value);
        if (!parts.sld) {
          e.preventDefault();
          input.focus();
          return;
        }
        input.value = parts.sld;
        tld.value = parts.tld;
      }}
    >
      <input type="hidden" name="a" value="add" />
      <input type="hidden" name="pid" value={STARTER_CLOUD_PID} />
      <input type="hidden" name="billingcycle" value="annually" />
      <input type="hidden" name="domainoption" value="register" />
      <input type="hidden" name="tld" value=".com" />
      <label htmlFor={id} className="sr-only">
        Your website name
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
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="Enter your website name"
          className={`min-w-0 flex-1 bg-transparent py-2.5 text-[17px] focus:outline-none ${
            dark ? "text-white placeholder:text-white/70" : "text-black placeholder:text-black/55"
          }`}
        />
        <button
          type="submit"
          aria-label="Get started"
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
