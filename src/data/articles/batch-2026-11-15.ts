/**
 * One article published 2026-11-15.
 *
 *   · wordpress-hosting-vs-web-hosting
 *                         "wordpress hosting vs web hosting", "what is
 *                         wordpress hosting", "do I need wordpress hosting",
 *                         "wordpress hosting vs shared hosting", "managed
 *                         wordpress hosting" — supports /wordpress-hosting and
 *                         /cloud-hosting. Written to be honest that the two
 *                         Serverlys groups share the same resources and price
 *                         list; the difference is setup and upkeep.
 *
 * Same editorial rules as original.ts: no invented statistics, customer
 * counts, case studies or quotes. Every Serverlys figure comes from
 * data/pricing.ts (RATES, SITES, VISITS, MEMORY, INCLUDES — identical across
 * the Cloud and WordPress groups). No Black Friday price is quoted, so nothing
 * here needs revising when the sale ends. ConvoAI Essentials is described as
 * "included", never "free" (Edgar's rule for its name). No cover photo yet:
 * falls back to the category thumbnail.
 */
import type { Article } from "./types";

export const batch20261115: readonly Article[] = [
  {
    slug: "wordpress-hosting-vs-web-hosting",
    title: "WordPress hosting vs web hosting: what is actually different?",
    seoTitle: "WordPress hosting vs web hosting: the real difference",
    description:
      "WordPress hosting and regular web hosting often run on the same servers. Here is what the WordPress label really changes, and how to tell which one your site needs.",
    category: "WordPress",
    published: "2026-11-15",
    body: [
      {
        type: "p",
        text: "Open almost any hosting company's menu and you will find \"Web hosting\" and \"WordPress hosting\" sold side by side, often at similar prices. It is a fair question whether the second one is a different product or the same product with a different name. The honest answer is: sometimes it is genuinely different, and sometimes it is mostly packaging.",
      },
      {
        type: "p",
        text: "This guide explains what WordPress hosting usually includes, where it overlaps with ordinary hosting, and how to decide which one fits your website, without paying for a label.",
      },
      { type: "h2", id: "short-answer", text: "The short answer" },
      {
        type: "p",
        text: "WordPress hosting is web hosting that has been set up and maintained specifically for WordPress. The server, the storage and the bandwidth can be exactly the same as a regular plan. What changes is what happens around WordPress: who installs it, how the server caches it, who applies updates, and who you can ask when a plugin breaks the site.",
      },
      {
        type: "table",
        head: ["", "Regular web hosting", "WordPress hosting"],
        rows: [
          ["What you can run", "Any site: WordPress, other CMSs, plain HTML, custom PHP apps", "WordPress first; other sites may or may not be allowed"],
          ["Installing WordPress", "You install it, usually with a one-click installer", "Installed for you, often already configured"],
          ["Caching", "Generic, or set up by you with a plugin", "Usually tuned for WordPress at the server level"],
          ["Updates", "Your job: core, themes and plugins", "Core updates (and sometimes plugins) applied for you"],
          ["Support", "Server and account questions", "Server questions plus WordPress-specific help"],
          ["Price", "Varies", "Ranges from identical to several times more"],
        ],
      },
      { type: "h2", id: "what-wordpress-hosting-includes", text: "What \"WordPress hosting\" usually includes" },
      {
        type: "p",
        text: "There is no industry standard for the term, so two hosts can mean quite different things by it. These are the features that most often justify the label, and the ones worth checking for on the plan page.",
      },
      { type: "h3", text: "WordPress installed and configured for you" },
      {
        type: "p",
        text: "Instead of running an installer, choosing a database name and setting permalinks yourself, you log in to a WordPress dashboard that is already working. It saves half an hour for an experienced user and removes a real barrier for a first-time site owner. If you would rather do it yourself, our [WordPress installation guide](/blog/install-wordpress-guide) walks through it on any host.",
      },
      { type: "h3", text: "Server-level caching built for WordPress" },
      {
        type: "p",
        text: "WordPress builds each page with PHP and database queries, which is slow if it happens on every visit. Caching stores the finished page so the next visitor gets it instantly. On a generic plan you add a caching plugin and configure it; on a good WordPress plan the web server itself caches pages and knows when to clear them, for example when you publish a post. LiteSpeed's cache is one common example; our comparison of [LiteSpeed, Apache and Nginx](/blog/litespeed-vs-apache-nginx) explains why the server matters.",
      },
      { type: "h3", text: "Automatic updates, done carefully" },
      {
        type: "p",
        text: "Out-of-date WordPress core and plugins are among the most common ways small sites get hacked. Many WordPress plans apply core updates automatically, and the better ones take a backup first so an update that breaks something can be rolled back. Check whether plugins and themes are included, or only WordPress itself, and whether you are told when an update has run.",
      },
      { type: "h3", text: "Backups you can actually restore" },
      {
        type: "p",
        text: "Daily backups are common on both kinds of plan. What matters is how long they are kept, whether you can restore one yourself without opening a ticket, and whether the backup includes the database as well as the files. Our [website backup strategy](/blog/website-backup-strategy) guide covers what a complete backup should contain.",
      },
      { type: "h3", text: "WordPress-aware support" },
      {
        type: "p",
        text: "On regular hosting, support will confirm the server is up and stop there. On WordPress hosting you should expect help with the problems WordPress owners actually hit: a plugin conflict, a [white screen](/blog/wordpress-white-screen-death), a login that stopped working, or a site that slowed down after an update.",
      },
      { type: "h3", text: "Extras on premium plans" },
      {
        type: "p",
        text: "Higher-priced managed WordPress plans sometimes add one-click [staging sites](/blog/wordpress-staging-site), malware scanning and clean-up, a web application firewall tuned for WordPress, and developer tools such as WP-CLI and Git. These are useful, but they are also where prices climb quickly, so it is worth knowing whether you will use them.",
      },
      { type: "h2", id: "what-is-the-same", text: "What is usually exactly the same" },
      {
        type: "p",
        text: "Underneath the label, both products are a share of a server. The resources that decide how fast and how big your site can be are the same kind of thing on both, and you should compare them the same way:",
      },
      {
        type: "ul",
        items: [
          "**Memory (RAM) and CPU**, which decide how many visitors the site can handle at once.",
          "**Storage type**: NVMe drives are faster than older SSDs, whichever plan they come with. See [NVMe vs SSD hosting](/blog/nvme-vs-ssd-hosting).",
          "**Number of websites** the plan allows.",
          "**Bandwidth** and any fair-use limits.",
          "**Free SSL**, which every reputable host now includes on every plan.",
          "**Data centre location**, uptime record and the control panel you get.",
        ],
      },
      {
        type: "p",
        text: "If a WordPress plan costs much more than a regular plan with the same RAM, storage and site count, the difference is paying for setup, maintenance and support. That can be worth it, but it should be a conscious choice, not an assumption that \"WordPress\" servers are faster by default.",
      },
      { type: "h2", id: "managed-vs-wordpress", text: "WordPress hosting vs managed WordPress hosting" },
      {
        type: "p",
        text: "The two terms are often used interchangeably, but \"managed\" is a promise about who does the work, not about the software. A plan can be WordPress hosting because WordPress comes pre-installed, without anyone actively looking after the site. Managed WordPress hosting means the host takes responsibility for updates, performance, security and backups on an ongoing basis. Our guides to [managed hosting](/blog/managed-hosting-guide) and [what fully managed hosting includes](/blog/what-fully-managed-hosting-includes) go into what that responsibility should cover.",
      },
      { type: "h2", id: "which-do-you-need", text: "Which one does your site need?" },
      { type: "h3", text: "Choose WordPress hosting if…" },
      {
        type: "ul",
        items: [
          "Your site is, or will be, built on WordPress or WooCommerce.",
          "You would rather not set up caching, updates and backups yourself.",
          "You want support that can help with WordPress problems, not just server problems.",
          "You are building your first site and want to start writing content on day one.",
        ],
      },
      { type: "h3", text: "Choose regular web hosting if…" },
      {
        type: "ul",
        items: [
          "Your site is not WordPress: a static site, another CMS, or a custom PHP application.",
          "You run several kinds of sites on one account and want the freedom to mix them.",
          "You are comfortable maintaining WordPress yourself and the regular plan is meaningfully cheaper for the same resources.",
        ],
      },
      {
        type: "p",
        text: "Whichever you pick, size the plan by traffic and number of sites rather than by name. Our guide to [how much hosting you need](/blog/how-much-hosting-do-you-need) shows how, and [shared, cloud, VPS or dedicated](/blog/shared-cloud-vps-or-dedicated) explains the plan types themselves.",
      },
      { type: "h2", id: "checklist", text: "Questions to ask before you buy a WordPress plan" },
      {
        type: "ol",
        items: [
          "Is WordPress installed for me, and can I still install it myself on a second site?",
          "Which updates are automatic: core only, or plugins and themes too? Is a backup taken first?",
          "Is caching handled by the server, or do I need a plugin?",
          "How many days of backups are kept, and can I restore one myself?",
          "Can I host non-WordPress sites on the same plan if I need to later?",
          "What do RAM, storage and the site limit look like compared with the host's regular plan?",
          "What is the renewal price? See [how to read hosting renewal pricing](/blog/how-to-read-hosting-renewal-pricing).",
          "Is migration of my existing site included?",
        ],
      },
      { type: "h2", id: "serverlys", text: "How it works at Serverlys" },
      {
        type: "p",
        text: "We would rather be plain about this: Serverlys [WordPress hosting](/wordpress-hosting) and [cloud hosting](/cloud-hosting) share the same resources and the same price list. Each tier has the same RAM, site limit, unlimited NVMe storage and unmetered bandwidth in both groups. You do not pay extra for the WordPress name.",
      },
      {
        type: "p",
        text: "What the WordPress plans add is the work around WordPress: it is installed and the server's LiteSpeed cache is tuned for it, core updates are applied automatically, daily backups and free SSL are included, and we migrate your existing site at no cost. Every plan also includes a ConvoAI Essentials [AI website chat](/ai-agents) trained on your own pages, and a 30-day money-back guarantee set out in the [refund policy](/refund-policy).",
      },
      {
        type: "table",
        head: ["Plan", "Websites", "Monthly visits", "RAM", "Monthly price"],
        rows: [
          ["Starter", "1", "~10,000", "2 GB", "$7.95 (+ $2.95 setup)"],
          ["Plus", "7", "~25,000", "4 GB", "$11.95"],
          ["Turbo", "Unlimited", "~50,000", "6 GB", "$17.95"],
          ["Business", "Unlimited", "~100,000", "8 GB", "$23.95"],
        ],
      },
      {
        type: "p",
        text: "Prices are for the monthly term; 12, 24 and 36-month terms are lower per month and are shown on the [pricing page](/pricing). Every term renews at the same price as the term you chose. If your site is not WordPress, the cloud plans give you the same server with no WordPress setup. If you are moving from another host, we can [handle the migration](/migrations).",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "Can I run WordPress on regular web hosting?" },
      {
        type: "p",
        text: "Yes. WordPress needs PHP and a MySQL or MariaDB database, which almost every web hosting plan provides. The difference is that you install, cache, update and back it up yourself, or with plugins.",
      },
      { type: "h3", text: "Is WordPress hosting faster?" },
      {
        type: "p",
        text: "Only if something about it is actually different, usually server-level caching tuned for WordPress or more resources. A WordPress plan with the same RAM and storage as a regular plan, and the same caching, will perform the same. For speed fixes that work on any host, see [how to speed up WordPress](/blog/speed-up-wordpress).",
      },
      { type: "h3", text: "Is WordPress hosting more secure?" },
      {
        type: "p",
        text: "It can be, mainly because automatic updates close the gaps attackers use most. A host's firewall and malware scanning help too. But most WordPress compromises come from weak passwords and abandoned plugins, which no plan fixes for you; our [WordPress security guide](/blog/wordpress-security-guide) covers the habits that matter.",
      },
      { type: "h3", text: "Can I switch from regular hosting to WordPress hosting later?" },
      {
        type: "p",
        text: "Yes. Moving a WordPress site between plans or hosts is routine: the files and database are copied across, then the domain is pointed at the new server. Our guide to [migrating a website to a new host](/blog/migrate-website-new-host) explains the steps, and many hosts, including Serverlys, will do it for you.",
      },
      { type: "h3", text: "Do I need WordPress hosting for WooCommerce?" },
      {
        type: "p",
        text: "WooCommerce runs on WordPress, so anything that runs WordPress well will run it. Stores do need more care with caching, because cart and checkout pages must never be cached, so a host that tunes for WooCommerce specifically is worth considering. See [ecommerce hosting](/ecommerce-hosting) and our [WooCommerce vs Shopify](/blog/woocommerce-vs-shopify) comparison.",
      },
    ],
  },
];
