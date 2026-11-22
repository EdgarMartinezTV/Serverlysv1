/**
 * One article published 2026-11-22.
 *
 *   · google-november-2026-core-update
 *                         "google november 2026 core update", "google core
 *                         update november 2026", "google update traffic drop",
 *                         "lost google rankings after update" — a trending
 *                         query (rollout began 2026-11-10, still in progress
 *                         at publish). Supports /seo. Deliberately does not
 *                         repeat website-not-showing-on-google (which owns
 *                         "my site is not indexed"); this one is about ranking
 *                         changes on a site that IS indexed.
 *
 * Every Google fact is from Google's own pages (checked 2026-11-22):
 *   status.search.google.com/incidents/WLxcJyC6jMWMfryxsKMc   start 2026-11-10
 *       10:06 PT, "applies globally and to all languages", "may take up to
 *       2 weeks"
 *   status.search.google.com (ranking history)               March 27 and
 *       May 21 2026 core updates; spam updates Mar/Jun/Aug/Sep
 *   developers.google.com/search/updates/core-updates        wait a full week
 *       after completion, compare with the week before the rollout, avoid
 *       quick fixes, deleting content is a last resort, recovery can take
 *       months / the next core update, smaller unannounced core updates
 * The "regular update designed to better surface relevant, satisfying content"
 * line is Google's LinkedIn post, as quoted by Search Engine Journal.
 * Deliberately NOT stated, because they could not be confirmed on a Google
 * page: a completion date (SEJ's "around Nov. 24" is their arithmetic, so the
 * post says "up to two weeks"), any Search Console data bug, and what the
 * update targets. ⚠ When the rollout completes, add the end date and set
 * `updated`. Same editorial rules as original.ts: no invented statistics or
 * quotes. No price quoted. No cover photo yet: falls back to the category
 * thumbnail.
 */
import type { Article } from "./types";

export const batch20261122: readonly Article[] = [
  {
    slug: "google-november-2026-core-update",
    title: "Google's November 2026 core update: what it means for your website, and what to do",
    seoTitle: "Google November 2026 core update: what to do",
    description:
      "Google's November 2026 core update started on November 10. What a core update is, how to tell whether it affected your site, and what to do (and not do) if your traffic dropped.",
    category: "Getting started",
    published: "2026-11-22",
    body: [
      {
        type: "p",
        text: "On **November 10, 2026**, Google started rolling out its **November 2026 core update**. Google's [Search Status Dashboard](https://status.search.google.com/incidents/WLxcJyC6jMWMfryxsKMc) says it \"applies globally and to all languages\" and that \"the rollout may take up to 2 weeks to complete.\" If your website's Google traffic has moved up or down over the last few days, this is the most likely reason.",
      },
      {
        type: "p",
        text: "This guide explains what a core update is, how to check whether it really affected your site, and what Google itself recommends doing next. The short version: **wait, measure properly, and do not panic-edit pages that are still working.**",
      },
      {
        type: "callout",
        title: "Where things stand",
        text: "As of November 22, 2026, the update is still listed as rolling out. Google posts the completion on the [Search Status Dashboard](https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history). Rankings can keep moving until then, so anything you measure today is a snapshot of an unfinished change.",
      },
      { type: "h2", id: "what-is-a-core-update", text: "What a core update is" },
      {
        type: "p",
        text: "Google changes its search systems all the time, and most of those changes are never announced. Its guidance mentions smaller core updates that it does not announce at all. A **core update** is different: it is a broad change to how Google's main ranking systems assess pages, and Google announces it because it can noticeably shift results across many kinds of sites at once. Google described this one as \"a regular update designed to better surface relevant, satisfying content for searchers from all types of sites.\"",
      },
      {
        type: "p",
        text: "Two things follow from that, and both matter for a small business:",
      },
      {
        type: "ul",
        items: [
          "**A core update is not a penalty.** It does not single out your site for breaking a rule. If you dropped, it usually means Google now judges other pages to be a better answer for the same searches, not that something on your site is \"broken\".",
          "**There is no single thing to fix.** A core update is not about one factor such as speed or keywords. Google's guidance is explicit that there is no quick fix that undoes its effect.",
        ],
      },
      {
        type: "p",
        text: "This is Google's third core update of 2026, after the **March 2026** core update (started March 27) and the **May 2026** core update (started May 21). Google has also run several separate **spam updates** this year, which target specific spam practices rather than reassessing quality in general.",
      },
      { type: "h2", id: "was-i-affected", text: "How to tell whether the update affected your site" },
      {
        type: "p",
        text: "Traffic moves for many reasons: seasons, holidays, a site outage, a tracking problem, or a competitor's sale. Before blaming the update, check it properly. You need [Google Search Console](https://search.google.com/search-console). If you have not set it up yet, our guide on [why a website is not showing on Google](/blog/website-not-showing-on-google) walks through adding your site.",
      },
      {
        type: "ol",
        items: [
          "**Wait for the rollout to finish.** Google's [core update guidance](https://developers.google.com/search/updates/core-updates) says to confirm the update has completed first, then wait **at least a full week** after that before analysing your data.",
          "**Open Search Console → Performance → Search results.** Click the date filter, choose **Compare**, and compare a full week after the update finished with a full week **before November 10**. Comparing whole weeks matters, because most business sites get different traffic on weekdays and weekends.",
          "**Look at clicks and average position together.** A drop in clicks with a steady position usually means fewer people searched, not that you ranked lower. A drop in position is what a core update looks like.",
          "**Switch to the Pages and Queries tabs.** Sort by the difference in clicks to see which pages and which searches changed. A drop that is limited to a few pages is a very different situation from a drop across the whole site.",
          "**Rule out the boring causes.** Check that your site did not go down, that a page was not accidentally set to `noindex`, and that nothing changed in your tracking around the same dates.",
        ],
      },
      {
        type: "callout",
        title: "Google Analytics is not the right tool for this",
        text: "Analytics shows all your visitors from every source, mixed together. Search Console shows only Google Search, with your position for each query. To judge a Google update, start in Search Console and use [Google Analytics](/blog/google-analytics-4-guide) only to see what the visitors you did get went on to do.",
      },
      { type: "h2", id: "what-to-do", text: "If your traffic dropped: what Google recommends" },
      {
        type: "p",
        text: "Google's advice depends on how big the drop is.",
      },
      { type: "h3", text: "A small drop" },
      {
        type: "p",
        text: "Google says there is \"no need to take drastic action\" and recommends **avoiding changes to content that is already performing well**. Small movements after a core update are normal, and they often settle as the rollout finishes. Rewriting a page that has ranked for years because it slipped two places is a common way to make things worse.",
      },
      { type: "h3", text: "A large, site-wide drop" },
      {
        type: "p",
        text: "If most of your pages fell and stayed down, Google recommends a deeper, honest assessment of the pages that were hit hardest. Its [self-assessment questions on helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) are the best checklist. For a small business site, the questions that most often reveal the problem are:",
      },
      {
        type: "ul",
        items: [
          "**Does the page actually answer the search?** Compare your page with the pages now ranking above it, for the queries you lost. If theirs is more specific, more complete or more up to date, that is usually the whole story.",
          "**Is it clear who you are?** A real business name, location, contact details and the people behind the work help visitors and Google trust a page. Many small sites hide all of this on a thin About page.",
          "**Was the page written for people or for keywords?** Pages stuffed with city names or repeated phrases, or many near-identical service pages that each target one town, tend to lose ground in core updates.",
          "**Is it current?** Old prices, expired offers and outdated advice are a signal that nobody is looking after the page.",
          "**Is the page easy to use?** A slow page, a layout that jumps around while loading, or a pop-up that covers the content all make it a worse result. See [Core Web Vitals for small sites](/blog/core-web-vitals-for-small-sites).",
        ],
      },
      { type: "h3", text: "What not to do" },
      {
        type: "ul",
        items: [
          "**Do not make quick fixes.** Google says to avoid them. Changing titles every few days or adding keywords just makes it impossible to tell what is working.",
          "**Do not delete pages in a panic.** Google calls removing content \"a last resort\". A page that lost rankings may still bring in customers from other searches.",
          "**Do not buy links or \"recovery\" packages.** Nobody outside Google can switch a core update off for your site, and paid links can get a site hit by the separate spam systems.",
          "**Do not judge the result while the update is still rolling out.** Rankings can rise and fall several times before it completes.",
        ],
      },
      { type: "h2", id: "how-long", text: "How long recovery takes" },
      {
        type: "p",
        text: "This is the part nobody likes. Google says some improvements can take effect within days, but it can take **several months** for its systems to recognise that a site has genuinely improved. Google also says that if months have passed with no change, recovery may have to wait for the **next core update**. In 2026 they arrived in March, May and November, and Google does not publish a schedule in advance.",
      },
      {
        type: "p",
        text: "Google is also clear that improving your site does not guarantee you will return to your old rankings, because the pages you are competing against keep improving too. The goal is not to get back to where you were. It is to become the most useful result for the searches your customers make.",
      },
      { type: "h2", id: "if-you-went-up", text: "If your traffic went up" },
      {
        type: "p",
        text: "Good news, but treat it the same way: wait for the rollout to finish, then compare whole weeks. Then make sure the extra visitors can actually become customers. Check that the pages gaining traffic load fast, work on a phone, and make it obvious how to call, book or buy. Our [conversion rate guide](/blog/conversion-rate-optimization) covers the changes that matter most.",
      },
      { type: "h2", id: "serverlys", text: "How Serverlys can help" },
      {
        type: "p",
        text: "Hosting cannot make a page rank, but it can stop a good page from losing out: every Serverlys [hosting plan](/hosting) runs on NVMe storage with free SSL, which keeps pages fast and secure. If you want someone to look at a drop with you, our [SEO services](/seo) start with an audit of the pages and queries that changed, using your own Search Console data. If you are not sure where to start, [contact support](/support) and we will point you in the right direction.",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "When will the November 2026 core update finish?" },
      {
        type: "p",
        text: "Google said the rollout, which started on November 10, 2026, may take up to two weeks. It has not announced an exact end date. Google marks the update as complete on its Search Status Dashboard when it is done.",
      },
      { type: "h3", text: "Did Google penalise my site?" },
      {
        type: "p",
        text: "Almost certainly not. A core update reassesses how well pages answer searches compared with everything else on the web. A penalty for breaking Google's spam policies is a separate thing, and if a person at Google took action against your site you would see it under **Security & Manual Actions → Manual actions** in Search Console.",
      },
      { type: "h3", text: "Should I change my website now?" },
      {
        type: "p",
        text: "Not yet. Wait until the update has finished and a full week has passed, then compare your data. If the drop was small, Google recommends leaving pages that perform well alone. If it was large and site-wide, use that week to review the hardest-hit pages honestly before changing anything.",
      },
      { type: "h3", text: "Can a faster website or a new host fix a core update drop?" },
      {
        type: "p",
        text: "On its own, rarely. Page experience is one part of what Google weighs, but a core update is mainly about how relevant and useful your content is. A slow or unreliable site makes everything else harder, though, so fix speed and uptime problems if you have them. See [website speed and SEO](/blog/website-speed-seo).",
      },
      { type: "h3", text: "Does the core update affect AI Overviews and AI search?" },
      {
        type: "p",
        text: "Google has not said how this update affects AI features in Search. The same advice applies either way: clear, specific, current pages from a business people can trust. Our guide to [getting recommended by ChatGPT and AI search](/blog/get-recommended-by-chatgpt-and-ai-search) covers the AI side.",
      },
    ],
  },
];
