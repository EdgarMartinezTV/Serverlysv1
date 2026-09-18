import type { HeroCopy } from "@/components/ref/domain/hero";
import type { ReasonsCopy } from "@/components/ref/domain/reasons";
import type { StepsCopy } from "@/components/ref/domain/steps";
import { billing } from "@/data/company";

/**
 * Transfer a domain — built from hostinger.com/domain-name-search at the
 * owner's instruction, sharing that reference's bands.
 *
 * ⚠ See the note in /register-domain/_content.ts: four pages now share this
 * layout, so the copy here is transfer-specific on purpose.
 *
 * The transfer facts below (60-day lock, auth code, registration carried over)
 * are ICANN rules, not marketing — they are the same wherever you transfer to,
 * and getting them wrong costs someone a domain.
 */

export const HERO: HeroCopy = {
  title: "Transfer a domain to Serverlys",
  lede: "Check the name, then move it. Your remaining registration comes with it.",
  promo: {
    title: "Your remaining registration comes with the domain",
    body: "A transfer adds to the term. Most registries add a further year at transfer.",
  },
  stats: [
    { value: "60 days", label: "the ICANN lock after a registration or transfer" },
    { value: "No downtime", label: "DNS keeps resolving while the transfer runs" },
  ],
  aside: {
    label: "Need a new name?",
    body: "If the name you want is still free, register it rather than transferring.",
    href: "/register-domain",
  },
};

export const REASONS: ReasonsCopy = {
  title: "What a transfer to Serverlys involves",
  cta: { label: "Start a transfer", href: billing.transferDomain },
  items: [
    {
      icon: "shield",
      title: "You keep the time you paid for",
      body: "A transfer moves the registration; it does not restart it. Remaining years carry over, and most registries add a year at transfer.",
    },
    {
      icon: "lock",
      title: "Two things from your old registrar",
      body: "Unlock the domain and get the auth code (sometimes called EPP). Without both, no registrar can move it — including us.",
    },
    {
      icon: "chat",
      title: "The 60-day rule",
      body: "ICANN blocks transfers for 60 days after a registration or a previous transfer. If yours is inside that window, nothing can be done but wait.",
    },
    {
      icon: "gear",
      title: "Your DNS stays up",
      body: "Records keep resolving throughout. Copy them to Serverlys before the transfer completes and nothing goes dark.",
    },
  ],
};

export const STEPS: StepsCopy = {
  title: "How to transfer a domain",
  items: [
    {
      title: "Check the name",
      body: "Look it up first. Registered at another registrar is exactly what a transfer candidate looks like.",
      cta: "Look it up",
    },
    {
      title: "Unlock it",
      body: "Turn off the registrar lock in your current provider's panel. Transfers silently fail while it is on.",
    },
    {
      title: "Get the auth code",
      body: "Your current registrar must give you this on request. It usually arrives by email to the registrant address.",
    },
    {
      title: "Check the 60-day window",
      body: "Registered or transferred in the last 60 days? The registry will refuse. Wait it out.",
    },
    {
      title: "Start the transfer",
      body: "Enter the name and the auth code in the Serverlys cart. You will get an approval email at the registrant address.",
    },
    {
      title: "Approve it",
      body: "Click the link in that email. Unapproved transfers time out after five days and you start again.",
    },
  ],
};

export const FAQ_HEAD = {
  title: "Domain transfer FAQs",
  description: "Find answers to frequently asked questions about moving a domain to Serverlys.",
};
