/**
 * One article published 2026-11-25.
 *
 *   · what-happens-if-you-stop-paying-for-web-hosting
 *                         "what happens if you stop paying for web hosting",
 *                         "hosting account suspended", "web hosting expired",
 *                         "website suspended unpaid invoice", "how to get my
 *                         website back after hosting expired". No existing post
 *                         covers it: is-my-website-down (batch-2026-10-29)
 *                         names the "Account suspended" page in a table only,
 *                         and keep-control-of-your-domain covers the domain
 *                         side. Links out to both instead of repeating them,
 *                         and to the renewal-pricing guide, /migrations and
 *                         /terms-of-service.
 *
 * Serverlys facts are quoted from /terms-of-service as published 2026-11-25
 * (billing + suspension sections): invoice more than 5 days overdue MAY be
 * suspended; unpaid 30 days after suspension MAY be terminated and data
 * removed; within 14 days of termination we provide a copy of files and
 * databases still held, no fee. Always "may", never "will": the terms say may.
 * Domain facts are the standard gTLD lifecycle (redemption grace period ~30
 * days, pending delete 5 days); exact renewal grace depends on the registrar
 * and the extension, hence "usually". Same editorial rules as original.ts: no
 * invented statistics or quotes, no named competitor. No price quoted. No
 * cover photo yet: falls back to the category thumbnail.
 */
import type { Article } from "./types";

export const batch20261125: readonly Article[] = [
  {
    slug: "what-happens-if-you-stop-paying-for-web-hosting",
    title: "What happens if you stop paying for web hosting (and how to get your site back)",
    seoTitle: "What happens if you stop paying for web hosting?",
    description:
      "A missed hosting payment rarely deletes your website overnight. Here is the usual timeline from overdue invoice to suspension to deletion, what visitors and email see at each step, and how to get your site back or leave cleanly.",
    category: "Hosting",
    published: "2026-11-25",
    body: [
      {
        type: "p",
        text: "A card expires, a renewal email lands in a folder nobody reads, or you simply decide you do not need the website any more. Whatever the reason, the hosting invoice goes unpaid. What happens next is the same at almost every host: **nothing disappears on day one**, but the website, and often your email, goes offline well before the files are actually deleted.",
      },
      {
        type: "p",
        text: "This guide walks through that timeline step by step, explains what your visitors and customers see at each stage, and shows how to get the site back, or how to leave on purpose without losing anything.",
      },
      {
        type: "callout",
        title: "The short version",
        text: "Unpaid hosting is usually **suspended** a few days after the due date (the site goes offline but the files are kept), then **terminated** some weeks later (the files are deleted). Pay before termination and the site normally comes back as it was. Your **domain is billed separately** and has its own deadlines, so check both.",
      },
      { type: "h2", id: "timeline", text: "The usual timeline, step by step" },
      {
        type: "p",
        text: "Exact numbers differ from host to host and are written in the terms of service, but the stages are nearly always the same:",
      },
      {
        type: "table",
        head: ["Stage", "What happens", "Your website and files"],
        rows: [
          ["Invoice issued", "The renewal invoice is created, usually a week or more before the due date, and emailed to the account address.", "Online, nothing changes."],
          ["Due date passes", "If you have a saved card, the host tries to charge it. If that fails, you get overdue reminders.", "Still online for now."],
          ["Suspended", "After a set number of days overdue, the account is switched off.", "Offline. Visitors see an \"account suspended\" page. Files and databases are still on the server."],
          ["Terminated", "If the invoice is still unpaid after a further period, the account is closed.", "Files, databases and email boxes are removed from the server."],
          ["After termination", "Some hosts can still hand over a copy for a short time. Then it is gone.", "Recovery depends entirely on backups, yours or the host's."],
        ],
      },
      {
        type: "p",
        text: "The gap between **suspended** and **terminated** is the most important number to know. While an account is suspended, paying the invoice usually brings everything back within minutes. After termination, you may be rebuilding from whatever backup you have.",
      },
      { type: "h2", id: "what-visitors-see", text: "What visitors and customers see" },
      {
        type: "ul",
        items: [
          "**Your website shows a suspension page** instead of your home page, or a generic error. To a customer it looks like the business has closed. Our guide to [checking whether a website is down](/blog/is-my-website-down) shows how to tell a suspension apart from other outages.",
          "**Email on your domain may stop working too.** If your mailboxes are on the same hosting account (as they are with most cPanel plans), suspension usually stops new mail from arriving. Senders may get bounce messages, and you may not be able to log in to read old mail.",
          "**Online orders, bookings and contact forms stop.** Anything that runs on the site stops with it, including payment pages and booking tools hosted on your domain.",
          "**Search engines notice.** A day or two offline is unlikely to hurt your rankings, but a site that stays unreachable for a long time can start dropping out of Google's results. See [why a website stops showing on Google](/blog/website-not-showing-on-google).",
        ],
      },
      { type: "h2", id: "domain", text: "Your domain is a separate bill with separate deadlines" },
      {
        type: "p",
        text: "This catches a lot of people out. Your **hosting** is where the website files live. Your **domain** is the address. They are often bought together, but they renew on their own dates, and letting one lapse does not cancel the other. If you need a refresher, read [domain vs hosting](/blog/domain-vs-hosting).",
      },
      {
        type: "p",
        text: "When a domain expires, it does not become available to someone else right away. For most common extensions such as .com, there is usually a short period after expiry when you can still renew at the normal price, followed by a **redemption period** (typically around 30 days) when the domain can still be recovered, but for a much higher fee. After that comes a few days of **pending delete**, and then anyone can register it, including people who buy expired domains to resell them.",
      },
      {
        type: "p",
        text: "Losing hosting is an inconvenience. Losing the domain can be permanent. If money is tight and you can only pay one bill, **renew the domain first**: you can always move the website to a new host, but you cannot always buy your address back. Our guide on [keeping control of your domain](/blog/keep-control-of-your-domain) explains how to protect it, and you can check any domain's expiry date with our free [WHOIS lookup](/whois-lookup).",
      },
      { type: "h2", id: "get-it-back", text: "How to get your website back" },
      {
        type: "ol",
        items: [
          "**Log in to your hosting account's billing area** and find the unpaid invoice. If you cannot log in, use the password reset with the email address you signed up with. If you no longer have that inbox, contact the host's support and be ready to prove the account is yours.",
          "**Pay the overdue invoice.** On most hosts, a suspension for non-payment lifts automatically once the invoice is paid, usually within minutes. If the site is still showing the suspension page an hour later, open a support ticket.",
          "**Check the site and your email.** Load a few pages, submit your contact form, and send a test email to and from your domain address. If you use caching, clear it.",
          "**Fix what caused it.** Update the saved card, turn on automatic payment, and make sure billing emails go to an inbox someone reads every week. A shared address such as billing@ your business, forwarded to two people, is safer than one person's personal inbox.",
          "**If the account was already terminated,** ask the host straight away whether they still hold a copy. Some keep one for a short time after termination. If not, restore from your own most recent backup on a new account.",
        ],
      },
      {
        type: "callout",
        title: "Read the renewal price before you pay it",
        text: "If the reason you stopped paying is that the renewal price was much higher than what you paid the first year, you are not alone. Our guide on [how to read hosting renewal pricing](/blog/how-to-read-hosting-renewal-pricing) explains how to compare real long-term costs before you renew or switch.",
      },
      { type: "h2", id: "leave-on-purpose", text: "Leaving on purpose? Do it in this order" },
      {
        type: "p",
        text: "Sometimes not paying is the plan: you are closing the business, merging two websites, or moving to a different host. Letting the invoice go unpaid is the worst way to leave, because the site goes dark on the host's schedule instead of yours. Do this instead:",
      },
      {
        type: "ol",
        items: [
          "**Take a full backup and download it**: website files, every database, and any email you want to keep. Our [website backup tutorial](/blog/website-backup-tutorial) shows how in cPanel. Store the copy somewhere that is not the hosting account.",
          "**Move your domain or point it at the new home** before the old hosting ends. If you are moving hosts, set up the new account first so there is no gap. [Moving a website without downtime](/blog/move-a-website-without-downtime) covers the order of steps.",
          "**Move email separately.** Mailboxes are easy to forget. Set them up on the new service and copy old mail over before the old account closes.",
          "**Cancel the hosting service through the billing area**, rather than just not paying. A proper cancellation stops new invoices, avoids late reminders and makes it clear the account can be closed.",
          "**Keep the domain renewed** if you might ever use the address again. A lapsed business domain can be bought by someone else and pointed at anything.",
        ],
      },
      { type: "h2", id: "serverlys", text: "How it works at Serverlys" },
      {
        type: "p",
        text: "We would much rather send you a reminder than switch off your site, so this is how our [terms of service](/terms-of-service) handle it:",
      },
      {
        type: "ul",
        items: [
          "**If a payment fails, we retry and contact you.** Invoices and reminders go to the email address on your account.",
          "**A service with an invoice more than 5 days overdue may be suspended.** Your files stay on the server while it is suspended, and paying the invoice brings the service back.",
          "**A service that is still unpaid 30 days after suspension may be terminated** and its data removed.",
          "**If you ask within 14 days of termination,** we provide a copy of the files and databases we still hold for you, with no fee for handing over your own data.",
        ],
      },
      {
        type: "p",
        text: "Daily backups are included on our hosting plans, but they are a service, not a replacement for your own copy. Keep one of your own as well. And if you are thinking of leaving a host where renewals have become hard to justify, our team moves your website for you as part of free [website migration](/migrations).",
      },
      { type: "h2", id: "faq", text: "Common questions" },
      { type: "h3", text: "Will my website be deleted as soon as the payment is late?" },
      {
        type: "p",
        text: "Almost never. Hosts normally suspend first and only delete after a further waiting period. The exact number of days is in your host's terms of service, usually in the billing or suspension section.",
      },
      { type: "h3", text: "Do I lose my email if my hosting is suspended?" },
      {
        type: "p",
        text: "If your mailboxes are on the hosting account, they usually stop receiving mail during the suspension and are deleted with the account at termination. If your email is on a separate service, such as Google Workspace or Microsoft 365, it keeps working as long as your domain is renewed.",
      },
      { type: "h3", text: "Can someone else take my domain if my hosting expires?" },
      {
        type: "p",
        text: "Not because of the hosting alone. The domain stays yours as long as the domain itself is renewed. The risk comes when the domain registration also lapses and runs through its grace and redemption periods.",
      },
      { type: "h3", text: "Will my Google rankings come back after the site is restored?" },
      {
        type: "p",
        text: "A short outage usually has no lasting effect: once Google can reach the pages again, they are crawled as normal. The longer a site stays down, the more pages may drop out of the index and the longer recovery can take.",
      },
    ],
  },
];
