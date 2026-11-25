import type { FaqItem } from "@/components/ref/faqs";

/**
 * Copy for /whois-lookup.
 *
 * Layout rebuilt from hostinger.com/whois at the owner's instruction
 * (2026-11-24): lavender hero with the pill search, the results block
 * (accordion record + "Want similar domain name?" + transfer card), three
 * feature columns, the "What is the Whois lookup tool?" split and "Whois
 * FAQs". The headings follow the reference; the body copy is ours and says
 * what OUR tool does — in particular it never promises an owner's personal
 * details, because since GDPR the registries do not publish them for most
 * domains, and a lookup page that claims otherwise is misleading.
 */

export const HERO = {
  title: "WHOIS Domain Lookup",
  lede: "Find out everything you need to know about a domain name.",
  placeholder: "Enter a domain name",
  links: [
    { label: "Buy a domain", href: "/domain-name" },
    { label: "Domain transfer", href: "/transfer-domain" },
  ],
};

export const FEATURES = [
  {
    icon: "globe",
    title: "Check domain name availability",
    runs: [
      {
        text: "Our WHOIS search tells you straight away whether a domain is taken. If it's free, our ",
      },
      { text: "domain checker", href: "/domain-name" },
      {
        text: " shows every extension and its price, so you can register it for your site.",
      },
    ],
  },
  {
    icon: "globe-search",
    title: "Find a domain name owner",
    runs: [
      {
        text: "If the name you want is taken, see its public record: the registrar it's held with, its nameservers and whatever contact details the registry publishes. Most owners' personal details are hidden for privacy.",
      },
    ],
  },
  {
    icon: "history",
    title: "See the domain expiration date",
    runs: [
      {
        text: "Find out when a domain is due to expire, so you can renew yours in time, or be ready to register a name you want if its current owner lets it go.",
      },
    ],
  },
] as const;

export const WHAT_IS = {
  title: "What is the Whois lookup tool?",
  body: "Our Whois lookup tool shows the latest data published in the official domain registration databases, read live from the registry. Use it as many times as you want, for free.",
  howTitle: "How does it work?",
  how: "Whenever someone registers a domain name, their registrar records it with the registry that runs that extension, under ICANN's rules. Part of that record is made public, and our lookup reads it straight from the source over RDAP, the modern replacement for WHOIS.",
};

export const FAQ_HEAD = {
  title: "Whois FAQs",
  description:
    "Find answers to frequently asked questions about the Whois lookup database.",
};

const p = (text: string): FaqItem["a"][number] => ({ type: "p", runs: [{ text }] });

export const FAQS: readonly FaqItem[] = [
  {
    q: "What is the whois database?",
    a: [
      p(
        "It isn't one single database. Each registry keeps the records for its own extensions (Verisign for .com, for example), under rules set by ICANN for generic domains. Today those records are published over RDAP, the structured successor to WHOIS.",
      ),
      p(
        "A record shows when a domain was registered and when it expires, which registrar manages it, its nameservers and status codes, and any contact details the registry or registrar chooses to publish.",
      ),
    ],
  },
  {
    q: "What is whois privacy?",
    a: [
      p(
        "Whois privacy keeps your name, address, email and phone number out of the public record. In their place, the record shows the registrar's or a privacy service's details, and messages are forwarded to you. Serverlys includes it free with every domain.",
      ),
    ],
  },
  {
    q: "Is the whois checker tool free to use?",
    a: [
      p(
        "Yes. There's no account to create and nothing to pay. You can look up as many domains as you like; there is only a short per-minute limit, so the lookup stays fast for everyone.",
      ),
    ],
  },
  {
    q: "How to use the whois data search tool?",
    a: [
      p(
        "Type a domain name, like example.com, in the search box at the top of this page and press the arrow. You'll see its registration record: the dates, registrar, status and nameservers first, then the registrar details, any published contacts and the raw registry data. Each section opens and closes with a click.",
      ),
    ],
  },
  {
    q: "How to update your whois information?",
    a: [
      p(
        "Your contact details are kept by your registrar, so you change them there, not at the registry. If your domain is with Serverlys, sign in to the client area, open the domain and edit its contact information. The public record updates once the registry receives the change, usually within minutes.",
      ),
    ],
  },
  {
    q: "Why are some whois entries hidden?",
    a: [
      p(
        "Since 2018, data protection laws such as the GDPR and ICANN's own policy have required registries and registrars to hide personal data from public records. Many owners also turn on a privacy service. Where details are hidden, you'll see text such as \"REDACTED FOR PRIVACY\" or the registrar's contact instead, and you can usually reach the owner through the registrar.",
      ),
    ],
  },
  {
    q: "What is the process for hiding whois information?",
    a: [
      p(
        "Turn on whois privacy (also called domain privacy or ID protection) at your registrar. With Serverlys it's included free: open the domain in the client area and check that privacy protection is switched on. Personal details for most domains are also redacted by the registry automatically.",
      ),
    ],
  },
  {
    q: "Can the whois search tool be used to register domains?",
    a: [
      p(
        "Not by itself, as it only reads public records. When a lookup shows a domain is available, use the Buy domain link in the result, or the suggestions next to it, to add it to your cart and register it.",
      ),
    ],
  },
];
