import type { FaqItem } from "@/components/ref/faqs";

/**
 * /free-ssl — copy.
 *
 * LAYOUT is a 1:1 rebuild of hostinger.com/free-ssl-certificate (captured at
 * 1440 and 390 on 2026-11-24, at Edgar's request: "looks exactly like that,
 * no reference of anything"). Bands in the reference's order: dark hero →
 * three plan cards → "paid vs free" split on the subtle surface → four
 * alternating "why" rows → three numbered "how it works" cards → FAQ.
 *
 * CONTENT is Serverlys' own. Nothing names, quotes or links the reference,
 * and none of its imagery is used — the art is drawn SVG in the logo blue.
 *
 * FACTS this page relies on (verified 2026-11-24, keep them true):
 *   · Hosting certificates come from cPanel AutoSSL and are issued by
 *     Let's Encrypt (checked with openssl against domains.serverlys.com:
 *     issuer "Let's Encrypt", 90-day validity).
 *   · They are Domain Validated (DV) and renewed automatically before expiry.
 *   · Issuance needs the domain's DNS to point at the hosting server first.
 *   · cPanel lets a customer install a certificate they bought elsewhere
 *     (SSL/TLS → Manage SSL sites).
 * Deliberately NOT claimed: a "256-bit" figure, a site seal, a warranty, or
 * that SSL alone makes a store PCI compliant — it covers one requirement.
 */

export const HERO = {
  title: "Get a free SSL certificate and secure your site today",
  lede: "Encrypt every visit, show the padlock your visitors look for, and give search engines one less reason to rank you lower. Free SSL comes with every Serverlys hosting plan.",
  cta: "Start now",
} as const;

export const PLANS_HEAD = {
  title: "Web hosting with free SSL included",
  description: "Every plan issues and renews SSL for all of your domains, at no extra cost.",
  cta: "Choose plan",
  upfront:
    "Plans paid for longer terms are charged upfront. The monthly rate shown is the total plan price divided by the number of months.",
} as const;

/** One line per card, in the reference's "Why this plan?" panel. */
export const WHY: Record<string, string> = {
  turbo: "The most headroom for the price. A good long-term home for a growing site.",
};

export const DIFFERENCE = {
  title: "The difference between paid and free SSL certificates",
  paragraphs: [
    "The free certificate on Serverlys hosting is a Domain Validated (DV) certificate issued by Let's Encrypt, the certificate authority behind most of the encrypted web. It is trusted by every major browser and device.",
    "On encryption there is no difference. A free DV certificate and a paid one use the same TLS protocol and the same strength of keys, so the connection between your site and its visitors is protected just as well.",
    "What a paid certificate adds is paperwork: Organization (OV) and Extended Validation (EV) certificates check the company behind the domain. Browsers show the same padlock and HTTPS either way.",
    "Certificates are renewed automatically before they expire, so there is nothing to remember and nothing to pay.",
  ],
} as const;

export const WHY_HEAD = { title: "Why does your site need an SSL/TLS certificate?" } as const;

export const REASONS = [
  {
    id: "secure",
    title: "Everything your visitors send stays private",
    body: "With SSL, logins, contact forms and payment details travel encrypted between the browser and your site, so nobody on the same Wi-Fi or along the route can read or change them.",
  },
  {
    id: "pci",
    title: "Take payments the right way",
    body: "Any site that handles card details has to follow the PCI DSS rules, and one of them is that card data is only sent over an encrypted connection. An SSL certificate is how your site meets that part.",
  },
  {
    id: "trust",
    title: "Earn your visitors' trust",
    body: "With SSL your address starts with HTTPS and the browser shows a padlock. Without it, browsers label the page \"Not secure\", which is often enough to make a visitor leave before they buy or get in touch.",
  },
  {
    id: "seo",
    title: "Help your Google ranking",
    body: "Google uses HTTPS as a ranking signal and treats it as part of a good page experience. An encrypted site gives search engines one less reason to place a competitor above you.",
  },
] as const;

export const HOW = {
  title: "How an SSL certificate works",
  steps: [
    {
      title: "Starting the connection",
      body: "A certificate gives your site a public key and a private key. When someone opens your site, their browser asks for the certificate and checks that it was issued for your domain by an authority it trusts.",
    },
    {
      title: "Encrypting the data",
      body: "Once the certificate checks out, the browser and your server use those keys to agree on a fresh session key that only the two of them know. Everything sent after that is encrypted with it.",
    },
    {
      title: "Showing it is secure",
      body: "A site with a working certificate loads over HTTPS and the browser shows a padlock in the address bar. Visitors can click it to see who issued the certificate and which domain it covers.",
    },
  ],
} as const;

export const FAQ_HEAD = {
  title: "Free SSL certificate FAQs",
  description: "Answers to the most common questions about SSL/TLS.",
} as const;

export const FAQS: readonly FaqItem[] = [
  {
    q: "What is an SSL certificate?",
    a: [
      { type: "p", runs: [{ text: "SSL (Secure Sockets Layer), now properly called TLS (Transport Layer Security), is the protocol that encrypts the connection between a website and a browser, so the data passing between them cannot be read or altered on the way." }] },
      { type: "p", runs: [{ text: "An SSL certificate is the file that makes this possible. It is issued by a certificate authority (CA) and proves to browsers that the site really belongs to the domain in the address bar." }] },
    ],
  },
  {
    q: "Why do I need an SSL certificate?",
    a: [
      { type: "p", runs: [{ text: "Without one, browsers mark your site \"Not secure\", anything a visitor types can be intercepted, you cannot take card payments properly, and search engines treat the site as a weaker result. With free SSL on every plan, there is no reason to go without." }] },
    ],
  },
  {
    q: "How can I tell if a website is using SSL?",
    a: [
      { type: "p", runs: [{ text: "Look at the address bar. A site using SSL starts with https:// and shows a padlock or similar icon. Click it to see the certificate, who issued it, and when it expires. A site without SSL starts with http:// and most browsers label it \"Not secure\"." }] },
    ],
  },
  {
    q: "What are the different types of SSL certificates?",
    a: [
      { type: "p", runs: [{ text: "By how much is checked before the certificate is issued:" }] },
      {
        type: "ul",
        items: [
          "Domain Validated (DV): confirms you control the domain. Issued in minutes, and the type included free with Serverlys hosting.",
          "Organization Validated (OV): also checks that the organization behind the domain exists.",
          "Extended Validation (EV): the most thorough check of the organization, with more paperwork and a higher price.",
        ],
      },
      { type: "p", runs: [{ text: "By how many names they cover: single-domain, multi-domain (SAN) and wildcard certificates, which cover every subdomain of a domain." }] },
    ],
  },
  {
    q: "Which SSL/TLS certificate should I choose?",
    a: [
      { type: "p", runs: [{ text: "For blogs, business sites, portfolios and most online stores, the free DV certificate is all you need: the encryption is the same as a paid one. Consider OV or EV only if a client, a contract or a regulation asks you for a certificate that verifies your organization." }] },
    ],
  },
  {
    q: "How do I get SSL for free?",
    a: [
      { type: "p", runs: [{ text: "Host your site with Serverlys. Every hosting plan includes free SSL for all of your domains and subdomains, issued automatically. If you want to check or re-run it yourself, follow " }, { text: "our free SSL setup guide", href: "/blog/free-ssl-setup" }, { text: "." }] },
    ],
  },
  {
    q: "How long does it take for a free SSL certificate to become active?",
    a: [
      { type: "p", runs: [{ text: "Usually a few minutes after your domain points at your hosting. The certificate can only be issued once the domain's DNS reaches our server, so if you have just changed nameservers it can take until that change has spread, which is normally within a few hours." }] },
    ],
  },
  {
    q: "How do I renew an SSL/TLS certificate?",
    a: [
      { type: "p", runs: [{ text: "You do not have to. Free certificates are valid for 90 days and renewed automatically well before they expire, for as long as the domain points at your hosting. There is no renewal fee." }] },
    ],
  },
  {
    q: "Does SSL help with SEO?",
    a: [
      { type: "p", runs: [{ text: "Yes. Google confirmed HTTPS as a ranking signal, and Chrome warns visitors away from pages that are not encrypted, which hurts the engagement search engines notice. SSL will not rank a page on its own, but going without it holds a site back." }] },
    ],
  },
  {
    q: "Can I install my own SSL certificate on Serverlys?",
    a: [
      { type: "p", runs: [{ text: "Yes. If you have bought an OV, EV or wildcard certificate elsewhere, you can install it from cPanel under SSL/TLS, and it takes the place of the free one for that domain. " }, { text: "Contact support", href: "/support" }, { text: " if you would like us to help." }] },
    ],
  },
];
