/**
 * One article published 2026-11-23.
 *
 *   · where-is-my-domain-registered
 *                         "where is domain name registered", "where is my
 *                         domain name hosted", "how to find your domain name",
 *                         "how to check domain name", "check domain name
 *                         registration", "find domain name" — the WHOIS-
 *                         intent queries GSC shows landing on /domain-name
 *                         (2026-11-23: /domain-name 3,962 impressions, its 12
 *                         clicks all from these). Sends readers to the free
 *                         /whois-lookup tool and, where it fits, to
 *                         /transfer-domain. Does not repeat nameservers-
 *                         explained or dns-records-explained; links to them.
 *
 * RDAP facts from ICANN's own announcement (27 Jan 2025,
 * icann.org/en/announcements/details/icann-update-launching-rdap-sunsetting-whois-27-01-2025-en):
 * RDAP became the definitive source for gTLD registration data on
 * 28 January 2025; lookup.icann.org is ICANN's lookup tool. Country-code
 * TLDs are outside ICANN's requirement, hence the "most extensions" wording.
 * Deliberately NOT stated: that registrant data is always hidden (it depends
 * on the registrar, extension and privacy service). Same editorial rules as
 * original.ts: no invented statistics or quotes. No price quoted. No cover
 * photo yet: falls back to the category thumbnail.
 */
import type { Article } from "./types";

export const batch20261123: readonly Article[] = [
  {
    slug: "where-is-my-domain-registered",
    title: "Where is my domain registered? How to find your registrar, DNS and host in 2 minutes",
    seoTitle: "Where is my domain registered? Find your registrar fast",
    description:
      "How to find out where a domain name is registered, who hosts its website and email, and when it expires, using a free lookup. Plus what to do if you cannot get into the account.",
    category: "Domains",
    published: "2026-11-23",
    body: [
      {
        type: "p",
        text: "It is a surprisingly common problem. Someone set up your website years ago, you need to change something, and nobody remembers **where the domain name was bought**. Or you want to move your site and need to know who hosts it now. The good news is that every domain's registration record is public, and finding the important parts takes about two minutes.",
      },
      {
        type: "callout",
        title: "The quick answer",
        text: "Type your domain into a free [WHOIS lookup](/whois-lookup) and look for the **Registrar** line. That is the company your domain is registered with. The **Name servers** lines tell you who runs its DNS, which is usually, but not always, where the website is hosted. The **Expiry date** tells you when it must be renewed.",
      },
      { type: "h2", id: "registrar-vs-host", text: "First: the registrar and the host are often different companies" },
      {
        type: "p",
        text: "A domain name involves up to three separate services, and many businesses use a different company for each:",
      },
      {
        type: "table",
        head: ["Service", "What it does", "How to find it"],
        rows: [
          ["Registrar", "Where the domain name is registered and renewed", "The Registrar line in a WHOIS lookup"],
          ["DNS host", "Answers the internet's questions about where your site and email live", "The Name servers lines in a WHOIS lookup"],
          ["Website and email host", "The servers your website files and mailboxes are on", "Your DNS records: the A record for the website, the MX records for email"],
        ],
      },
      {
        type: "p",
        text: "If you want to change your website, you need the host. If you want to renew, transfer or protect the name itself, you need the registrar. Our guide to [domain vs hosting](/blog/domain-vs-hosting) explains the difference in more detail.",
      },
      { type: "h2", id: "find-registrar", text: "How to find where your domain is registered" },
      {
        type: "ol",
        items: [
          "**Open a WHOIS lookup.** Use the free [Serverlys WHOIS lookup](/whois-lookup) or ICANN's own tool at [lookup.icann.org](https://lookup.icann.org). Both read the official registry record.",
          "**Type the domain without `www` or `https://`**, for example `yourbusiness.com`, and run the search.",
          "**Read the Registrar line.** That is the company holding the registration. Many lookups also show a link to the registrar's website and an abuse contact.",
          "**Note the dates.** The **Created** date shows how old the domain is, and the **Expires** date shows when it must be renewed. If it expires soon, renew it before anything else.",
          "**Check the status.** A status such as `clientTransferProhibited` means the domain is locked at the registrar. That is normal and protects it, but it has to be unlocked before a transfer.",
        ],
      },
      {
        type: "p",
        text: "Since **January 28, 2025**, ICANN has used a newer system called **RDAP** as the official source of registration data for generic extensions such as .com, .net and .org, replacing the old WHOIS service. You do not need to do anything differently: most lookup tools, including ours, now read RDAP and still call it a WHOIS lookup.",
      },
      {
        type: "callout",
        title: "Why you cannot see the owner's name",
        text: "Most lookups no longer show the owner's name, email or address. Registrars hide them for privacy, and many domains also use a privacy service. The registrar is always shown, which is all you need to recover access. Our guide to [WHOIS privacy protection](/blog/whois-privacy-protection) explains what is hidden and why.",
      },
      { type: "h2", id: "find-host", text: "How to find who hosts your website and email" },
      {
        type: "p",
        text: "The registrar tells you where the name lives, not where the website does. To find the host:",
      },
      {
        type: "ul",
        items: [
          "**Look at the name servers.** Names like `ns1.somehost.com` usually point to the company that manages your DNS, and often to your web host as well. If they belong to a DNS service such as Cloudflare, the website could be hosted anywhere.",
          "**Look up the A record.** The IP address in your domain's A record belongs to the server your website is on. An IP lookup shows which company owns that address.",
          "**Look up the MX records** to see who handles your email. It is often a different company from the website host, such as Google Workspace or Microsoft 365.",
        ],
      },
      {
        type: "p",
        text: "If those terms are new to you, read [nameservers explained](/blog/nameservers-explained) and [DNS records explained](/blog/dns-records-explained) first. Both take a few minutes.",
      },
      { type: "h2", id: "forgot-domain", text: "If you are not sure what your domain name is" },
      {
        type: "p",
        text: "Your domain is the part of your website address after `www.`, and the part of your work email after the `@`. If you have several, search your inbox for **renewal** or **domain** reminders: registrars email the account owner before every renewal, and those emails name both the domain and the registrar.",
      },
      { type: "h2", id: "no-access", text: "If you cannot get into the registrar account" },
      {
        type: "p",
        text: "This is common when a former employee, web designer or agency registered the domain. Work through these in order:",
      },
      {
        type: "ol",
        items: [
          "**Use the registrar's password reset** with any email address the account might use. The renewal emails above usually show which one.",
          "**Contact the registrar's support.** Explain that the domain is yours and ask how they verify ownership. Expect to show proof such as an invoice, ID or a business document.",
          "**Ask whoever set it up** to move the domain into an account you own, or to transfer it to you. Our guide on [keeping control of your domain](/blog/keep-control-of-your-domain) explains why the domain should always be in the business's own name.",
        ],
      },
      {
        type: "p",
        text: "Once you are back in control, renew the domain for longer if it expires soon, turn on two-factor authentication, and make sure the account email is one the business will always own.",
      },
      { type: "h2", id: "serverlys", text: "Move your domain to Serverlys, or keep it where it is" },
      {
        type: "p",
        text: "You do not need to move your domain to use Serverlys hosting: you can point it at us from any registrar. If you would rather manage the domain and the website in one place, you can [transfer your domain to Serverlys](/transfer-domain) and keep the time you have already paid for, or [search for a new domain name](/domain-name). Not sure what your records say? [Contact support](/support) and we will read them with you.",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "How do I find out where a domain name is registered?" },
      {
        type: "p",
        text: "Run the domain through a free WHOIS lookup such as the [Serverlys WHOIS lookup](/whois-lookup) or lookup.icann.org. The **Registrar** line names the company the domain is registered with.",
      },
      { type: "h3", text: "Is the registrar the same as my web host?" },
      {
        type: "p",
        text: "Not always. Many businesses register the domain with one company and host the website with another. The registrar handles the name; the host stores the website. Check the name servers and the A record to find the host.",
      },
      { type: "h3", text: "Can I find out who owns a domain?" },
      {
        type: "p",
        text: "Usually not from a public lookup, because owner details are hidden for privacy. The lookup still shows the registrar, which you can contact. For domains you want to buy, the lookup also shows when they expire.",
      },
      { type: "h3", text: "Why does the lookup show a different company from the one I pay?" },
      {
        type: "p",
        text: "Some companies sell domains through a larger registrar, so the registry record names that registrar instead of the company that sends your invoice. Your account and renewals are still managed by the company you pay.",
      },
      { type: "h3", text: "Does a WHOIS lookup work for every domain extension?" },
      {
        type: "p",
        text: "It works for most. Generic extensions such as .com, .net and .org must publish registration data through RDAP. Country extensions such as .uk or .de follow their own registry's rules, so some show less information or use their own lookup tool.",
      },
    ],
  },
];
