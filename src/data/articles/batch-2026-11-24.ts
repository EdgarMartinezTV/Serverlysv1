/**
 * Article published 2026-11-24, three days before Black Friday.
 *
 *   · prepare-online-store-for-holiday-traffic
 *                         "prepare online store for black friday", "black
 *                         friday website checklist", "woocommerce black friday
 *                         preparation", "website crash during sale", "handle
 *                         traffic spike online store". The Ecommerce cluster
 *                         holds only three posts. online-store-pre-launch-
 *                         checklist covers the FIRST order; this one covers the
 *                         BUSIEST days, so the two do not compete: it links to
 *                         the pre-launch list for the basics instead of
 *                         repeating them. Hands readers to /ecommerce-hosting
 *                         with a non-exact anchor.
 *
 * Same editorial rules as original.ts: no invented statistics, no "studies
 * show", no uptime figure, no named competitor. Product facts used here
 * (LiteSpeed, LiteSpeed Cache, CDN, daily backups on the Managed WooCommerce
 * plans) are the ones already stated on /ecommerce-hosting. WooCommerce
 * screen names (Scheduled Actions, sale price "Schedule", coupon usage limits)
 * are real core features. No price quoted. No cover photo yet: falls back to
 * the category thumbnail.
 */
import type { Article } from "./types";

export const batch20261124: readonly Article[] = [
  {
    slug: "prepare-online-store-for-holiday-traffic",
    title: "Black Friday is coming: how to get your online store ready for a traffic spike",
    seoTitle: "Get your online store ready for Black Friday traffic",
    description:
      "A practical checklist for small online stores before Black Friday, Cyber Monday and the holidays: what to freeze, what to test, how to keep checkout fast under load, and what to do if the site goes down mid-sale.",
    category: "Ecommerce",
    published: "2026-11-24",
    body: [
      {
        type: "p",
        text: "For a small online store, the busiest days of the year are also the riskiest. The same promotion that brings in your best week of sales sends more visitors to the site at the same moment than it ever sees, and anything that was slightly slow or slightly broken in October becomes a lost order in November.",
      },
      {
        type: "p",
        text: "The good news is that most holiday outages are not caused by the server running out of power. They are caused by a plugin update the night before, a checkout that was never tested on a phone, a cache that was switched off, or a confirmation email that quietly stopped sending. Those are all things you can check this week, without a developer.",
      },
      {
        type: "callout",
        title: "If you only have one hour",
        text: "Take a full backup and download a copy. Place a real test order on your phone, from the sale page all the way to the confirmation email. Then stop changing the site until the sale is over. Those three steps prevent more holiday disasters than everything else on this page combined.",
      },
      {
        type: "p",
        text: "Opening a store for the first time? Start with our [online store pre-launch checklist](/blog/online-store-pre-launch-checklist), which covers payments, tax, shipping and policies. This guide assumes the store already works and focuses on keeping it working on the busy days.",
      },
      { type: "h2", id: "freeze", text: "One week before: pick a change freeze date" },
      {
        type: "p",
        text: "Choose a date, ideally a few days before the sale starts, after which nothing on the site changes: no plugin or theme updates, no new apps, no redesigned product pages, no \"quick tweak\" to the checkout. Write the date down and tell everyone who can log in to the store.",
      },
      {
        type: "ul",
        items: [
          "**Do your updates before the freeze, not during it.** Update WordPress, WooCommerce, your theme and plugins now, then test. If something breaks, you still have days to fix it. Security patches are the one exception: if a critical fix is released mid-sale, apply it, test checkout straight away, and keep the backup ready.",
          "**Turn off automatic plugin updates until the sale ends**, or at least for the plugins that touch the cart, checkout and payments. An update that arrives at 2 a.m. on Black Friday is the worst kind of surprise.",
          "**Try big changes on a copy first.** A [staging site](/blog/wordpress-staging-site) lets you test a new theme or payment plugin without risking the live store.",
          "**Remove what you no longer use.** Every inactive plugin, abandoned pop-up tool and old tracking script is one more thing that can slow down or break a page. Our guide to [fonts, scripts and embeds that slow your site](/blog/fonts-scripts-and-embeds-slowing-your-site) shows how to find them.",
        ],
      },
      { type: "h2", id: "backup", text: "Take a backup you can actually restore" },
      {
        type: "p",
        text: "Right after your last update, take a full backup of the files and the database, and download a copy to your own computer or cloud storage. A backup that only lives on the same server as the store does not help if that account is the thing that has a problem.",
      },
      {
        type: "ul",
        items: [
          "**Write down how to restore it**, step by step, while you are calm. In the middle of a sale is the wrong time to read the instructions for the first time.",
          "**Remember that orders keep arriving.** Restoring yesterday's database also removes today's orders. If you ever need to roll back during the sale, export the latest orders first, so nothing is lost.",
          "**Keep daily backups running** through the whole holiday period, not just before it. See our [website backup strategy](/blog/website-backup-strategy) for how many copies to keep and where.",
        ],
      },
      { type: "h2", id: "test-checkout", text: "Test the full path to a paid order" },
      {
        type: "p",
        text: "Many of your holiday visitors will arrive on a phone, from an email, a social post or an ad. So test that exact journey, on a real phone, on mobile data rather than your office Wi-Fi.",
      },
      {
        type: "ol",
        items: [
          "**Open the link from your actual promotion email or post**, not by typing your address. Make sure it lands on the right page and the sale price shows.",
          "**Add a product to the cart, apply the discount code and check the total**, including shipping and tax. A code that applies twice, or not at all, is easy to miss until a customer complains.",
          "**Pay with a real card** for a low-priced item, then refund it. Try each payment method you offer, including wallets like Apple Pay or Google Pay if you show them.",
          "**Check that the confirmation email arrives**, and that it does not land in spam. If it does, our guide on [why emails go to spam](/blog/why-are-my-emails-going-to-spam) explains the fix.",
          "**Check that the order shows up where you fulfil it**: the store dashboard, your shipping tool, your stock count.",
        ],
      },
      { type: "h2", id: "sale-setup", text: "Set up the sale so it runs itself" },
      {
        type: "p",
        text: "The less you have to do by hand at midnight, the fewer mistakes happen. Most store platforms let you schedule a sale in advance. In WooCommerce, for example, each product's sale price has a **Schedule** link where you set a start and end date, so the price changes on its own.",
      },
      {
        type: "ul",
        items: [
          "**Schedule sale prices and test one early.** Set a single product to start its sale a few minutes from now, confirm it switches correctly, then set it back.",
          "**Put limits on discount codes.** Set an expiry date and, where it makes sense, a usage limit per code and per customer. Codes from a holiday promotion get shared on deal sites, and a code with no end date keeps working long after you meant it to.",
          "**Check your stock numbers.** Selling something you do not have means refunds, apologies and unhappy customers in your busiest week. Turn on stock management for anything with limited quantity.",
          "**Update your shipping cut-off dates** on the site so customers know the last day to order for delivery before the holidays.",
          "**Make sure the sale banner and the actual prices agree.** \"30% off everything\" on the home page and 20% off in the cart is the quickest way to lose trust.",
        ],
      },
      { type: "h2", id: "speed", text: "Keep pages fast when everyone arrives at once" },
      {
        type: "p",
        text: "A store that loads in two seconds for one visitor can slow to a crawl when hundreds of people open the sale page in the same minute, because every one of those visits asks the server to build the page again. Caching is what stops that from happening: the server builds a page once and hands the saved copy to everyone who asks for it.",
      },
      {
        type: "ul",
        items: [
          "**Make sure page caching is switched on** for your product and category pages. On a WordPress store this is usually a caching plugin or a feature built into your host. The cart, checkout and account pages must stay uncached, and good caching tools leave them out automatically. Check that they do.",
          "**Use a CDN** (content delivery network) so images, styles and scripts are served from a location close to each visitor rather than all from your server.",
          "**Compress your product images.** Large photos are the most common reason a product page is heavy. See our [image optimization guide](/blog/image-optimization-web).",
          "**Keep pop-ups and chat tools light.** A countdown timer, a spin-to-win wheel, a live chat widget and three tracking scripts all load on every page. Keep the ones that earn their place.",
          "**Run a speed test on the sale page and the checkout**, not just the home page. Our guide to [Core Web Vitals for small sites](/blog/core-web-vitals-for-small-sites) explains which numbers matter.",
        ],
      },
      {
        type: "callout",
        title: "Should I load-test my store?",
        text: "A load test sends a flood of fake visitors to see where the site slows down. It can be useful, but on shared hosting it can look exactly like an attack and may break your host's terms of service. Ask your host first. For most small stores, switching on caching, a CDN and removing heavy scripts does more good than a load test would tell you.",
      },
      { type: "h3", text: "WooCommerce stores: two extra checks" },
      {
        type: "ul",
        items: [
          "**Look at WooCommerce → Status → Scheduled Actions.** A long list of failed or pending actions means background jobs (order emails, stock updates, subscription renewals) are falling behind. Find out why before the sale, while traffic is still normal.",
          "**Clear out old data.** Thousands of expired sessions, abandoned carts and old revisions make the database slower. Many maintenance plugins can clean these up safely. Take a backup first.",
        ],
      },
      { type: "h2", id: "protect", text: "Protect the store while it is busy" },
      {
        type: "p",
        text: "Busy sale days also bring unwanted traffic: bots trying stolen card numbers on your checkout, login attempts on your admin account, and fake orders. A few settings help.",
      },
      {
        type: "ul",
        items: [
          "**Turn on fraud protection in your payment provider.** Most providers offer fraud screening and let you block repeated failed payments. Card-testing attacks show up as lots of small failed orders in a short time.",
          "**Add a CAPTCHA or bot check to checkout and login** if your store has been hit by fake orders before.",
          "**Turn on [two-factor authentication](/blog/two-factor-authentication)** for every account that can log in to the store, and remove accounts that no longer need access. Our guide on [who has access to your website](/blog/who-has-access-to-your-website) walks through the review.",
          "**Be suspicious of urgent emails during the sale.** \"Your payment account is suspended\" or \"your domain expires today\" messages are common in busy periods. See [how to spot a fake domain invoice](/blog/domain-renewal-scams).",
        ],
      },
      { type: "h2", id: "team", text: "Get the people side ready too" },
      {
        type: "ul",
        items: [
          "**Decide who is watching the store** during the sale, including evenings and the weekend. Have their phone numbers and your host's support contact in one place.",
          "**Prepare answers to the questions you will get**: shipping dates, returns over the holidays, how to use the code, where an order is. If you use a chat assistant on the site, update it with these answers before the sale.",
          "**Check that your support inbox works.** Send a test message through your contact form and make sure someone receives it.",
          "**Tell your host if you expect much more traffic than usual.** A heads-up costs nothing, and a good host will tell you whether your plan is likely to cope.",
        ],
      },
      { type: "h2", id: "during", text: "During the sale: what to watch" },
      {
        type: "table",
        head: ["What to check", "How often", "What it tells you"],
        rows: [
          ["Place a test order on your phone", "Morning and evening", "That the full path to a paid order still works"],
          ["New orders in the dashboard", "Every few hours", "A sudden stop in orders during busy hours often means checkout is broken"],
          ["Order confirmation emails", "Once a day", "That customers are actually getting their receipts"],
          ["Failed payments", "Once a day", "A spike in small failed payments is a sign of card testing"],
          ["Stock levels on best sellers", "Every few hours", "Whether to pause a product before it oversells"],
        ],
      },
      {
        type: "p",
        text: "A free uptime monitor that checks your home page every few minutes and alerts you by email or text is worth setting up now. It will not catch a broken checkout, which is why the test order matters, but it will tell you quickly if the whole site goes down.",
      },
      { type: "h2", id: "if-it-goes-down", text: "If the site goes down mid-sale" },
      {
        type: "ol",
        items: [
          "**Confirm it is really down**, and not just slow for you. Our guide on [how to tell if your website is down](/blog/is-my-website-down) shows how to check from outside your own network.",
          "**Think about what changed last.** A plugin update, a new code or a settings change in the last few hours is the most likely cause. Undo that first.",
          "**Contact your host's support** with the exact time it started, the error message or a screenshot, and what you changed recently. The more specific you are, the faster they can help.",
          "**Tell your customers.** A short post or email saying \"we're fixing a problem, the sale will be extended\" keeps people from giving up on you.",
          "**Extend the sale** by the time you were down. It costs you little and keeps the goodwill.",
        ],
      },
      { type: "h2", id: "after", text: "After the sale" },
      {
        type: "ul",
        items: [
          "**End every discount code and sale price** you do not want running into December. Check that scheduled sales actually ended.",
          "**Lift the change freeze** and catch up on updates, one at a time, testing checkout after each one.",
          "**Write down what went wrong and what went well** while you still remember. Next year's sale starts with that list.",
          "**Look at where your orders came from** in your analytics, so you know which promotion was worth the effort.",
        ],
      },
      { type: "h2", id: "serverlys", text: "Hosting that is built for busy days" },
      {
        type: "p",
        text: "If your store keeps slowing down whenever you run a promotion, the hosting may be part of the problem. Serverlys [Managed WooCommerce hosting](/ecommerce-hosting) runs on LiteSpeed servers with LiteSpeed Cache, a CDN and daily backups included, and we move your store over for you at no cost. If you are comparing plans this week, our [Black Friday hosting deals checklist](/blog/black-friday-web-hosting-deals-checklist) shows how to read the renewal price before you commit. And if your store is already with us and you are expecting a busy week, [contact support](/support) and tell us your sale dates.",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "How far in advance should I prepare my store for Black Friday?" },
      {
        type: "p",
        text: "Ideally a few weeks, so updates and changes have time to settle. But even a few days is enough for the essentials on this page: a backup, a real test order on a phone, caching switched on and a change freeze.",
      },
      { type: "h3", text: "Should I update my plugins right before a sale?" },
      {
        type: "p",
        text: "Update them before your freeze date, then leave them alone until the sale is over. The only exception is a critical security fix; if you apply one, test checkout straight away.",
      },
      { type: "h3", text: "Why does my store slow down when traffic spikes?" },
      {
        type: "p",
        text: "Usually because each visit makes the server build the page from scratch. Page caching, a CDN, smaller images and fewer third-party scripts reduce that work. If the store is still slow with all of those in place, the plan may simply be too small for the traffic.",
      },
      { type: "h3", text: "Do I need to upgrade my hosting for the holidays?" },
      {
        type: "p",
        text: "Not always. Fix caching, images and heavy scripts first, because those help on any plan. If your store has slowed down or gone offline during past promotions even with those in place, ask your host whether a larger plan would help. See [how much hosting you need](/blog/how-much-hosting-do-you-need).",
      },
      { type: "h3", text: "What is a change freeze?" },
      {
        type: "p",
        text: "A change freeze is a period when nobody changes anything on the live site: no updates, no new plugins, no design changes. Stores use one around their busiest days so that nothing new can break while the most money is at stake.",
      },
    ],
  },
];
