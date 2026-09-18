import type { HeroCopy } from "@/components/ref/domain/hero";
import type { ReasonsCopy } from "@/components/ref/domain/reasons";
import type { StepsCopy } from "@/components/ref/domain/steps";

/**
 * WHOIS lookup — built from hostinger.com/domain-name-search at the owner's
 * instruction, sharing that reference's bands.
 *
 * ⚠ See the note in /register-domain/_content.ts: four pages share this
 * layout, so the copy here is lookup-specific on purpose.
 *
 * This page's subject is RDAP, which replaced WHOIS as the registry protocol.
 * The copy says so rather than pretending the old name is still accurate —
 * the tool itself queries RDAP.
 */

export const HERO: HeroCopy = {
  title: "WHOIS lookup",
  lede: "Look up who holds a domain, when it expires, and where its nameservers point.",
  promo: {
    title: "Straight from the registry over RDAP",
    body: "Where a registry answers slowly or not at all, you get told — not a blank.",
  },
  stats: [
    { value: "Free", label: "no account, and nothing asked of you" },
    { value: "RDAP", label: "the protocol that replaced WHOIS" },
  ],
  aside: {
    label: "Name looks free?",
    body: "A lookup that finds no record usually means it is unregistered.",
    href: "/register-domain",
  },
};

export const REASONS: ReasonsCopy = {
  title: "What a lookup can and cannot tell you",
  cta: { label: "Look up a domain", href: "#search" },
  items: [
    {
      icon: "shield",
      title: "Straight from the registry",
      body: "We query RDAP and show what it returns. Where a registry answers slowly or not at all, you get told that rather than a blank.",
    },
    {
      icon: "lock",
      title: "Most contacts are masked",
      body: "Privacy services and GDPR mean registrant names and emails are usually redacted. That is the registrar protecting the owner, not a gap in the data.",
    },
    {
      icon: "chat",
      title: "Dates are the useful part",
      body: "Creation, expiry and last-changed dates are almost always public — and they tell you whether a name is about to lapse.",
    },
    {
      icon: "gear",
      title: "Nameservers show the host",
      body: "The nameservers reveal who is serving DNS for the domain, which is often what you actually wanted to know.",
    },
  ],
};

export const STEPS: StepsCopy = {
  title: "How to read a WHOIS record",
  items: [
    {
      title: "Enter the domain",
      body: "Just the name and extension — no http://, no www.",
      cta: "Start a lookup",
    },
    {
      title: "Check the status",
      body: "Statuses like clientTransferProhibited mean a registrar lock is on. That is normal, and it is what blocks a transfer.",
    },
    {
      title: "Read the expiry date",
      body: "A name close to expiry may become available, but registries add grace and redemption periods before that happens.",
    },
    {
      title: "Note the registrar",
      body: "This is who to contact for an auth code if you are the owner, or who the name is managed through if you are not.",
    },
    {
      title: "Expect redactions",
      body: "Blank contact fields are the norm now. If you need to reach an owner, registrars usually forward a message.",
    },
    {
      title: "No record found",
      body: "That usually means unregistered. Check availability and register it before someone else reads the same record.",
    },
  ],
};

export const FAQ_HEAD = {
  title: "WHOIS lookup FAQs",
  description: "Find answers to frequently asked questions about domain records and RDAP.",
};
