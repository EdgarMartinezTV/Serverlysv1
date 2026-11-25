import type { FaqItem } from "@/components/ref/faqs";

/**
 * Copy for /dns-propagation-checker.
 *
 * Layout and on-screen wording follow hostinger.com/dns-propagation-checker at
 * the owner's instruction (2026-11-24). The FAQ answers are Serverlys' own and
 * describe what OUR checker actually does — the servers we ask and how "live"
 * is decided are in lib/dns/propagation.ts; keep the two in step.
 */

export const FAQ_HEAD = {
  title: "Questions about DNS propagation",
  description: "",
};

export const FAQS: readonly FaqItem[] = [
  {
    q: "What is DNS propagation?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "When you change a DNS record, your domain's own nameservers start giving out the new value at once. The DNS servers that internet providers run around the world don't ask them every time, though: each keeps a copy of the last answer it got and reuses it until that copy expires. Propagation is the time it takes for every one of those copies to expire and be replaced with your new record.",
          },
        ],
      },
    ],
  },
  {
    q: "How long does it take?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Usually from a few minutes to a few hours. Every cached copy expires after its TTL (time to live), which we show for each server, so the longest TTL still out there is the longest you'll wait. Changing your domain's nameservers is slower, up to 24–48 hours, because the registry's own records are cached for longer.",
          },
        ],
      },
    ],
  },
  {
    q: "Why do servers show different answers?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Each server saved your record at a different moment, so some still hold the earlier version. They each switch to the current records as soon as their saved copy expires, within the TTL shown next to them. Large sites and CDNs are different again: they deliberately give each region its own answer, and for those we count any server that returns records of the type as live.",
          },
        ],
      },
    ],
  },
  {
    q: 'What do "Timed out" and "Failed" mean?',
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Timed out means the server in that location didn't reply within 4 seconds, usually because it was busy or the network was slow. It rarely has anything to do with your domain. Failed means the server did reply, but with an error saying it couldn't look your domain up. One failed location means little; if every location fails, check that your domain's nameservers are working. Both are asked again on the next check.",
          },
        ],
      },
    ],
  },
  {
    q: "Can I make it faster?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "Not for servers that already hold the old answer: they keep it until it expires. What you can do is plan ahead. A day before your next change, lower the record's TTL (to 5 minutes, for example), so that once you switch, every copy expires within minutes. Raise it again once the change is live everywhere.",
          },
        ],
      },
    ],
  },
  {
    q: "How does this checker work?",
    a: [
      {
        type: "p",
        runs: [
          {
            text: "First we ask your domain's own nameservers directly, skipping every cache, to get your current records. Then we ask 28 DNS servers in 24 countries, run by internet providers and public DNS services, what they return for the same name, and compare. A server is live when its answer matches your current records. Nothing is stored, and you can share a check by copying the page address. Need your DNS hosted somewhere reliable? ",
          },
          { text: "See our hosting plans", href: "/hosting" },
          { text: "." },
        ],
      },
    ],
  },
];
