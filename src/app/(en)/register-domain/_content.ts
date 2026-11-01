import type { HeroCopy } from "@/components/ref/domain/hero";
import type { ReasonsCopy } from "@/components/ref/domain/reasons";
import type { StepsCopy } from "@/components/ref/domain/steps";

/**
 * Register a domain — built from hostinger.com/domain-name-search, the same
 * reference as /domain-name, at the owner's instruction.
 *
 * ⚠ FOUR PAGES NOW SHARE THIS REFERENCE (/domain-name, here, /transfer-domain,
 * /whois-lookup). The layout is deliberately shared via
 * components/ref/domain/*, but the COPY here is written for registration
 * specifically so the four are not duplicates of each other — near-identical
 * pages compete with each other in search and read as filler. If any two of
 * them ever start saying the same thing, merge them.
 *
 * No prices here: every figure comes from `data/tlds.ts`.
 */

export const HERO: HeroCopy = {
  title: "Register a domain name",
  lede: "Check the registry, then register at Serverlys. The first-year price is the price.",
  promo: {
    title: "The renewal rate is on the page, not buried in checkout",
    body: "Every extension below lists what it costs now and where the renewal comes from.",
  },
  stats: [
    { value: "500+", label: "domain extensions at checkout" },
    { value: "Free", label: "WHOIS privacy where the registry allows it" },
  ],
  aside: {
    label: "Already own it?",
    body: "A name that comes back registered is a transfer candidate, not a dead end.",
    href: "/transfer-domain",
  },
};

export const REASONS: ReasonsCopy = {
  title: "What you get when you register with Serverlys",
  cta: { label: "Find your domain", href: "#search" },
  items: [
    {
      icon: "shield",
      title: "The price you see",
      body: "First-year registration is listed per extension below. Renewal is charged at the published renewal rate, and checkout shows it before you pay.",
    },
    {
      icon: "lock",
      title: "Privacy included",
      body: "Registration puts your contact details into public RDAP records unless they are masked. Where the registry permits it, we mask them at no charge.",
    },
    {
      icon: "chat",
      title: "A person when you need one",
      body: "Registration is usually instant. When it is not — a registry hold, a verification email — you get someone who can read the whole ticket.",
    },
    {
      icon: "gear",
      title: "DNS in one place",
      body: "Point the name at Serverlys hosting, at your own nameservers, or at another provider entirely. Records stay editable either way.",
    },
  ],
};

export const STEPS: StepsCopy = {
  title: "How to register a domain name",
  items: [
    {
      title: "Search the name",
      body: "Type the name you want. We ask the registry directly rather than guessing from a list.",
      cta: "Start search",
    },
    {
      title: "Read the answer honestly",
      body: "The registry answers available, registered, or unknown. Unknown means it did not answer — never that the name is free.",
    },
    {
      title: "Pick the extension",
      body: "If .com is gone, an alternate may be the better name anyway. Prices per extension are below.",
    },
    {
      title: "Check the trademark",
      body: "Availability at the registry is not permission to trade under a name. Check before you build a brand on it.",
    },
    {
      title: "Register at checkout",
      body: "Our search hands off to the Serverlys cart with the name prefilled. The cart is the authority on premium pricing and what is sellable.",
    },
    {
      title: "Turn on auto-renewal",
      body: "A lapsed domain can be re-registered by anyone. Auto-renewal is the cheapest insurance there is.",
    },
  ],
};

export const FAQ_HEAD = {
  title: "Domain registration FAQs",
  description: "Find answers to frequently asked questions about registering a domain with Serverlys.",
};
