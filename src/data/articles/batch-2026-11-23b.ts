/**
 * Second article published 2026-11-23.
 *
 *   · domain-renewal-scams
 *                         "domain renewal scam", "domain name renewal letter
 *                         scam", "is this domain renewal email legit",
 *                         "fake domain invoice", "domain slamming", "SEO
 *                         listing invoice scam". No existing post covers it:
 *                         scams appear only as passing mentions in
 *                         whois-privacy-protection and original.ts. Builds the
 *                         Security cluster and sends readers to /whois-lookup
 *                         (check the real registrar and expiry date),
 *                         where-is-my-domain-registered and
 *                         keep-control-of-your-domain.
 *
 * Same editorial rules as original.ts: no invented statistics, no quotes, no
 * named scam companies (we cannot verify them and naming them is a legal
 * risk). The only external links are official: reportfraud.ftc.gov and
 * lookup.icann.org. No price quoted. No cover photo yet: falls back to the
 * category thumbnail.
 */
import type { Article } from "./types";

export const batch20261123b: readonly Article[] = [
  {
    slug: "domain-renewal-scams",
    title: "Domain renewal scams: how to spot a fake domain invoice before you pay it",
    seoTitle: "Domain renewal scams: how to spot a fake invoice",
    description:
      "Fake domain renewal letters, \"SEO listing\" invoices and urgent expiry emails explained: how they work, the warning signs, and the two-minute check that tells you whether a renewal notice is real.",
    category: "Security",
    published: "2026-11-23",
    body: [
      {
        type: "p",
        text: "If you own a domain name, sooner or later a letter or email will arrive that looks like a bill: your domain is about to expire, act now, pay here. Some of these are real reminders from your registrar. Many are not. They come from companies hoping you will pay without checking, and the money either buys a service you never needed or moves your domain to a company you never chose.",
      },
      {
        type: "callout",
        title: "The two-minute check",
        text: "Before you pay any domain notice, run your domain through a free [WHOIS lookup](/whois-lookup). If the **Registrar** shown is not the company asking for money, or the **Expires** date is months away, the notice is not your renewal. Then renew, if you need to, by logging in to your registrar's website yourself, never through a link in the message.",
      },
      { type: "h2", id: "how-they-work", text: "How domain renewal scams work" },
      {
        type: "p",
        text: "Every domain's registrar and expiry date can be read by anyone in a public lookup. That is what makes these scams possible: the sender knows your domain name, roughly when it was registered, and sometimes when it expires, so the notice sounds informed. There are four common versions.",
      },
      {
        type: "table",
        head: ["Type", "What it looks like", "What actually happens if you pay"],
        rows: [
          [
            "Transfer-bait renewal",
            "A \"renewal notice\" or \"expiration notice\" from a company you have never used, often by post",
            "The small print authorises a transfer: your domain moves to their registrar, usually at a much higher price",
          ],
          [
            "\"SEO\" or \"search engine listing\" invoice",
            "An invoice for \"domain listing\" or \"search engine submission\" that names your domain",
            "You pay for a listing nobody needs. Your domain is not renewed and nothing changes on Google",
          ],
          [
            "Phishing email",
            "An urgent email in your registrar's or host's style: payment failed, domain suspended, click to fix",
            "The link opens a copy of a login or payment page that steals your password or card details",
          ],
          [
            "\"Someone wants your name\" email",
            "A warning that another company is about to register your brand in another country or extension",
            "Pressure to buy a bundle of extra domains you do not need, at an inflated price",
          ],
        ],
      },
      {
        type: "p",
        text: "The transfer-bait version is the most damaging, because you do not just lose the payment. You can end up with your domain at a company that is hard to reach, with your website and email depending on it.",
      },
      { type: "h2", id: "warning-signs", text: "Warning signs a domain notice is fake" },
      {
        type: "ul",
        items: [
          "**You do not recognise the company.** Your real registrar is the company you bought the domain from, or the one your web designer used. A notice from anyone else is not a renewal.",
          "**It says \"this is not a bill\" or \"solicitation\" in small print.** Some senders add that line to stay legal while designing the page to look exactly like a bill.",
          "**The words \"transfer\" or \"switch\" appear anywhere**, especially near the payment box or the signature line.",
          "**The price is much higher than you normally pay** for a year, or it offers several years at once \"to avoid losing your domain\".",
          "**It pushes urgency:** expires today, final notice, suspension in 24 hours. Real registrars send reminders weeks ahead and give you a grace period.",
          "**The link does not go to your registrar's real website.** Hover over it, or on a phone press and hold, and read the address before you tap. A look-alike address with extra words or odd spelling is a phishing page.",
          "**It asks for payment by bank transfer, gift card or crypto.** Registrars take card payments through your account, not wire transfers to a stranger.",
          "**It arrives as a paper letter.** Most registrars remind you by email. A paper renewal notice from a company you do not use is a strong warning sign.",
        ],
      },
      { type: "h2", id: "check-a-notice", text: "How to check whether a renewal notice is real" },
      {
        type: "ol",
        items: [
          "**Do not click anything in the message, and do not call the number on it.** Use only contact details you find yourself.",
          "**Look up your domain.** Type it into the [Serverlys WHOIS lookup](/whois-lookup) or ICANN's tool at [lookup.icann.org](https://lookup.icann.org). Note the **Registrar** and the **Expires** date. Our guide on [finding where your domain is registered](/blog/where-is-my-domain-registered) explains each line.",
          "**Compare.** If the sender is not the registrar shown, the notice is not your renewal. If the expiry date is far away, any \"expires today\" message is false.",
          "**Log in to your registrar directly**, by typing its address into your browser or using a bookmark. If the domain really is close to expiry, the renewal will be waiting in your account.",
          "**Check your past invoices.** A real renewal costs about what you paid last year, from the same company.",
        ],
      },
      {
        type: "callout",
        title: "What a real Serverlys renewal looks like",
        text: "If your domain or hosting is with Serverlys, every invoice is in your client area at `serverlys.com/billing`, and you can pay it there after logging in. We never ask for payment by gift card, crypto or bank transfer to a personal account. If a message claims to be from us and you are not sure, log in yourself or [contact support](/support) and we will tell you whether it is real.",
      },
      { type: "h2", id: "already-paid", text: "If you already paid a fake invoice" },
      {
        type: "p",
        text: "Act quickly. The sooner you move, the more you can undo.",
      },
      {
        type: "ol",
        items: [
          "**Call your card provider or bank** and explain that the payment was for a misleading invoice. Ask whether they can dispute or stop it.",
          "**Check whether your domain moved.** Run a new [WHOIS lookup](/whois-lookup). If the registrar has changed, contact your original registrar straight away. Transfers can sometimes be disputed, especially if you act soon.",
          "**If you entered a password, change it now** on the real registrar or hosting account, and on any other account that uses the same password. Then turn on [two-factor authentication](/blog/two-factor-authentication).",
          "**Report it.** In the US, report the scam to the Federal Trade Commission at [reportfraud.ftc.gov](https://reportfraud.ftc.gov). Forward phishing emails to the company being impersonated, too, so they can warn other customers.",
        ],
      },
      { type: "h2", id: "protect-yourself", text: "How to stop it happening again" },
      {
        type: "ul",
        items: [
          "**Know your registrar and your expiry date.** Write them down where the business keeps its passwords. Most scams only work on owners who are not sure.",
          "**Turn on auto-renew** with your real registrar, so a domain never gets close to expiring and an \"expires today\" message never sounds plausible.",
          "**Keep the domain locked.** The transfer lock (`clientTransferProhibited` in a lookup) stops a transfer until you unlock it yourself.",
          "**Use WHOIS privacy where the extension allows it.** It keeps your name, address and phone number out of public lookups, which cuts down the letters and calls. See [WHOIS privacy protection](/blog/whois-privacy-protection).",
          "**Use a business email that you will always own** as the account email, and turn on two-factor authentication on the registrar account.",
          "**Tell whoever opens the post or pays the bills.** Many fake renewals are paid by a bookkeeper or an assistant who has never heard of the domain. A simple rule helps: domain invoices only get paid after checking the registrar.",
        ],
      },
      {
        type: "p",
        text: "If the domain was registered by a former designer or agency and you are not sure who controls it, sort that out first. Our guide on [keeping control of your domain](/blog/keep-control-of-your-domain) walks through it.",
      },
      { type: "h2", id: "serverlys", text: "Keep your domain and hosting in one place" },
      {
        type: "p",
        text: "One way to make fake notices easier to spot is to have fewer real ones. If your domain is at one company, your hosting at another and your email at a third, it is hard to know which bill is genuine. You can [transfer your domain to Serverlys](/transfer-domain) and keep the time you have already paid for, so your domain and hosting renewals arrive from one company and sit in one account.",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "Is a domain renewal letter in the post a scam?" },
      {
        type: "p",
        text: "Often, yes, if it comes from a company you have never used. Check the registrar in a [WHOIS lookup](/whois-lookup). If the sender is not your registrar, the letter is not your renewal, however official it looks.",
      },
      { type: "h3", text: "How do scammers know when my domain expires?" },
      {
        type: "p",
        text: "Registration and expiry dates are part of the public domain record, so anyone can look them up. Even when the owner's details are hidden, the dates and the registrar are still shown.",
      },
      { type: "h3", text: "What is domain slamming?" },
      {
        type: "p",
        text: "Domain slamming is the practice of sending a notice that looks like a renewal but actually authorises a transfer to a different registrar. If you pay it, your domain moves, usually to a more expensive company.",
      },
      { type: "h3", text: "Do I need to pay for search engine listing for my domain?" },
      {
        type: "p",
        text: "No. Google and other search engines find websites for free. You can tell Google about your site yourself in Google Search Console. Our guide on [why a website is not showing on Google](/blog/website-not-showing-on-google) explains how.",
      },
      { type: "h3", text: "What happens if I ignore a real renewal notice?" },
      {
        type: "p",
        text: "Your domain expires and your website and email stop working. Most registrars give you a grace period to renew at the normal price, then a period where it costs more to recover, before the domain is released. That is why auto-renew with your real registrar is the safest setting.",
      },
    ],
  },
];
