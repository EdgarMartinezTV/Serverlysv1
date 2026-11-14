/**
 * One article published 2026-11-14, timed for the Black Friday buying window.
 *
 *   · black-friday-web-hosting-deals-checklist
 *                         "black friday web hosting deals", "black friday
 *                         hosting", "is black friday hosting worth it",
 *                         "hosting renewal price black friday" — supports
 *                         /pricing and the hosting product pages. Written to
 *                         stay useful every November: the Serverlys sale is
 *                         one dated callout plus one worked example, both
 *                         with the end date spelled out.
 *
 * Same editorial rules as original.ts: no invented statistics, customer
 * counts, case studies or quotes. Every Serverlys figure comes from
 * data/pricing.ts (BLACK_FRIDAY, TERM_PRICES; Starter 36 mo $178.20 → $112.27
 * was verified on the live cart) and the refund / migration facts from
 * data/faqs.ts and data/company.ts.
 */
import type { Article } from "./types";

export const batch20261114: readonly Article[] = [
  {
    slug: "black-friday-web-hosting-deals-checklist",
    title: "Black Friday web hosting deals: 9 things to check before you buy",
    seoTitle: "Black Friday web hosting deals: what to check (2026)",
    description:
      "Black Friday is the cheapest time of year to buy hosting, if you read past the headline price. Here are nine checks that separate a real deal from a renewal trap.",
    category: "Hosting",
    published: "2026-11-14",
    body: [
      {
        type: "p",
        text: "Black Friday is the one week a year when almost every web host cuts its prices at the same time. For a small business that needs a website, or one that is unhappy with its current host, that makes it a genuinely good moment to buy. It is also the week when the biggest number on the page tells you the least about what you will actually pay.",
      },
      {
        type: "p",
        text: "A hosting deal is only a deal if it still makes sense on the second invoice. This checklist covers the nine things worth checking before you pay, a worked example of how to compare two offers, and when it is smarter to wait.",
      },
      { type: "h2", id: "checklist", text: "The 9-point Black Friday hosting checklist" },
      { type: "h3", text: "1. Find the renewal price before anything else" },
      {
        type: "p",
        text: "Most hosting discounts apply to the first term only. After that the plan renews at a different, often much higher, rate. Some hosts print it in small grey text under the offer, others only show it in the terms of service. If you cannot find the renewal price in under a minute, treat that as an answer in itself. Our guide to [reading hosting renewal pricing](/blog/how-to-read-hosting-renewal-pricing) shows exactly where to look.",
      },
      { type: "h3", text: "2. Check how long you are committing for" },
      {
        type: "p",
        text: "The lowest advertised monthly price is usually the 36- or 48-month price, paid up front. That can be good value if you are certain about the host, but it is a long time to be locked in with one you have never used. Compare the price for the term you would actually choose, not the term the banner is built around.",
      },
      { type: "h3", text: "3. Add up what you pay on day one" },
      {
        type: "p",
        text: "A \"per month\" price on a multi-year plan is billed as one lump sum at checkout. Add any setup fee, paid add-ons that are pre-ticked in the cart, and tax. The checkout total is the real number to compare, not the monthly figure on the sales page.",
      },
      { type: "h3", text: "4. See exactly what the discount covers" },
      {
        type: "p",
        text: "Read whether the percentage applies to the plan only, or to setup fees and add-ons too, and whether it covers every billing term or only the longest one. A \"70% off\" headline that applies to one plan on one term is a very different offer from a smaller discount that applies to everything.",
      },
      { type: "h3", text: "5. Look at the free extras, and what they cost later" },
      {
        type: "p",
        text: "SSL certificates, daily backups, website migration and a domain name are common sweeteners. Check which ones are free for as long as you host there and which are free for the first year only. A domain that renews at full price, or backups that become a paid add-on after twelve months, change the maths of the deal.",
      },
      { type: "h3", text: "6. Make sure the plan fits your site" },
      {
        type: "p",
        text: "A cheap plan that cannot handle your traffic or your number of websites is not cheap once you have to upgrade mid-term. Check the limits that matter: number of websites, storage, and how many monthly visits the plan is sized for. If you are unsure, our guide on [how much hosting you need](/blog/how-much-hosting-do-you-need) walks through it, and [shared, cloud, VPS or dedicated](/blog/shared-cloud-vps-or-dedicated) explains the difference between plan types.",
      },
      { type: "h3", text: "7. Confirm the money-back guarantee" },
      {
        type: "p",
        text: "A refund window lets you test the host with a real website before you are committed. Look for how many days it lasts, whether it covers the whole first payment or only part of it, and what is excluded. Domain registrations are almost never refundable anywhere, because the registry fee is paid the moment the name is registered.",
      },
      { type: "h3", text: "8. Ask who moves your existing website" },
      {
        type: "p",
        text: "If you already have a site, switching hosts is part of the purchase. Some hosts migrate it for you at no cost; others charge per site or leave it to you. Before you buy, read [how to move a website without downtime](/blog/move-a-website-without-downtime) so you know what a good migration looks like, and keep your old hosting active until the new site is confirmed working.",
      },
      { type: "h3", text: "9. Check the host, not just the deal" },
      {
        type: "p",
        text: "Uptime, support response times, server speed and how easy it is to cancel matter more over three years than a few dollars at checkout. Read recent independent reviews, test the support chat with a real question before you buy, and look out for the warning signs in our list of [hosting red flags](/blog/hosting-red-flags).",
      },
      { type: "h2", id: "worked-example", text: "Worked example: comparing two offers properly" },
      {
        type: "p",
        text: "Imagine two hosts advertising the same headline price for a three-year plan. On the sales page they look identical. Over six years they are not:",
      },
      {
        type: "table",
        head: ["", "Host A", "Host B"],
        rows: [
          ["Advertised price", "$3.00/mo for 36 months", "$3.00/mo for 36 months"],
          ["Paid at checkout (years 1–3)", "$108", "$108"],
          ["Renewal price", "$3.00/mo (same as the term price)", "$10.99/mo"],
          ["Paid at renewal (years 4–6)", "$108", "$395.64"],
          ["Total over 6 years", "$216", "$503.64"],
        ],
      },
      {
        type: "p",
        text: "The figures are illustrative, but the pattern is real and common. Host B's \"deal\" costs more than twice as much over six years, and none of that difference is visible on the day you buy. Do this sum for any offer you are considering: first payment, plus renewal price times the number of renewals you expect.",
      },
      { type: "h2", id: "serverlys-black-friday", text: "Serverlys Black Friday 2026: the numbers, checked against this list" },
      {
        type: "callout",
        title: "37% off your first payment, until December 7, 2026",
        text: "The discount applies automatically at checkout on every Serverlys hosting plan, business email plan and ConvoAI Pro, on every billing term, including the setup fee. It covers the first payment; renewals are at the normal price for the term you chose. The offer ends on December 7, 2026.",
      },
      {
        type: "p",
        text: "Here is how the Starter plan works out on two terms, using the same method as above:",
      },
      {
        type: "table",
        head: ["Starter plan", "12 months", "36 months"],
        rows: [
          ["Normal price for the term", "$83.40", "$178.20"],
          ["Black Friday first payment", "$52.54", "$112.27"],
          ["Renews at", "$83.40 a year", "$178.20 every 3 years"],
        ],
      },
      {
        type: "p",
        text: "Going through the checklist: the renewal price is shown on the [pricing page](/pricing) beside the plan price; you can choose a 1, 12, 24 or 36-month term; free SSL, daily backups and free migration are part of the plan, not a first-year extra; and every hosting plan has a 30-day money-back guarantee, set out in the [refund policy](/refund-policy). Compare plans for [cloud hosting](/cloud-hosting), [WordPress hosting](/wordpress-hosting) or [ecommerce hosting](/ecommerce-hosting), or ask us to [move your existing site](/migrations).",
      },
      { type: "h2", id: "when-to-wait", text: "When it is better not to buy on Black Friday" },
      {
        type: "ul",
        items: [
          "**You are happy with your current host** and your renewal is fairly priced. Switching for a small saving rarely pays for the effort.",
          "**You are months away from building a site.** A long prepaid term starts the day you buy, whether the site is live or not.",
          "**The deal only exists on the longest term** and you have never used the host before. A shorter term at a slightly higher price is cheaper insurance.",
          "**You cannot find the renewal price.** A host that hides it now will not be more transparent at renewal time.",
        ],
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "Is Black Friday the cheapest time to buy web hosting?" },
      {
        type: "p",
        text: "Usually, yes. Most hosts run their deepest discounts of the year between late November and Cyber Monday. The important part is that the discount normally covers the first term only, so the cheapest first payment is not always the cheapest host over several years.",
      },
      { type: "h3", text: "Should I choose the longest term to get the biggest discount?" },
      {
        type: "p",
        text: "Only if you already trust the host, or the refund window is long enough to test it properly. A longer term gives the lowest monthly figure but locks in more money up front. If the renewal price is the same as the term price, the risk is lower because the deal does not end with a price jump.",
      },
      { type: "h3", text: "Can I use a Black Friday deal to switch from my current host?" },
      {
        type: "p",
        text: "Yes, and it is one of the best reasons to buy in November. Check whether migration is included, do not cancel the old host until the new site is live and tested, and remember that moving your domain registration is a separate step from moving the website. Our [domain transfer guide](/blog/domain-transfer-guide) covers that part.",
      },
      { type: "h3", text: "What happens when the Black Friday price ends?" },
      {
        type: "p",
        text: "Your plan renews at the host's renewal price for your billing term. That is why the renewal price, not the sale price, is the most important number to check before you buy. For a broader view of what hosting should cost, see [web hosting cost in 2026](/blog/web-hosting-cost-2026).",
      },
    ],
  },
];
