/**
 * Three articles published 2026-11-09, picked from Search Console: each one
 * answers a query cluster serverlys.com already gets impressions for but has
 * no page that answers it directly.
 *
 *   · website-migration-cost      "website migration service (cost)",
 *                                  "free website migration" — supports /migrations
 *   · what-fully-managed-hosting-includes
 *                                  "fully managed hosting", "managed server
 *                                  hosting", "managed shared hosting" — supports
 *                                  /managed-hosting and the managed-hosting guide
 *   · hosting-for-bootstrapped-startups
 *                                  "bootstrapped saas hosting", "cloud hosting
 *                                  providers for startups" — supports /startup-hosting
 *
 * Same editorial rules as original.ts: no invented statistics, customer
 * counts, case studies or quotes, and no third-party price ranges presented as
 * fact. Serverlys features come from data/pricing.ts and the product pages
 * (/migrations, /managed-hosting, /startup-hosting). VPS and dedicated servers
 * are NOT sold yet ("coming" on /startup-hosting), so nothing here sells them.
 */
import type { Article } from "./types";

export const batch20261109: readonly Article[] = [
  {
    slug: "website-migration-cost",
    title: "How much does a website migration service cost? And when is it free?",
    seoTitle: "Website migration service cost: when is it free?",
    description:
      "What a website migration service actually does, what drives the price, why many hosts move sites for free, and what to check before you accept a free migration.",
    category: "Hosting",
    published: "2026-11-09",
    body: [
      {
        type: "p",
        text: "Moving a website to a new host sounds like a weekend of work, which is why most people put it off for years. Ask around and the price of having someone else do it ranges from nothing at all to a project quote. Both can be fair. The difference is how much of the move is a straight copy and how much is fixing things along the way.",
      },
      {
        type: "p",
        text: "This guide explains what a migration service actually does, what makes one cost more than another, and when \"free migration\" is a real offer rather than a sales line.",
      },
      { type: "h2", id: "what-is-included", text: "What a website migration service does" },
      {
        type: "p",
        text: "A proper migration is more than copying files. Whether you pay for it or not, these are the steps that should happen:",
      },
      {
        type: "ol",
        items: [
          "**Copy the files**: the site's code, theme, plugins and uploaded media.",
          "**Copy the database**: posts, pages, products, orders and users all live there on WordPress, WooCommerce and most CMS sites.",
          "**Move email** if your mailboxes are hosted with your website: the accounts, and ideally the messages already in them.",
          "**Stage and test**: load the copied site on the new server *before* your domain points there, so problems are found while the old site is still serving visitors.",
          "**Sync the last changes**: orders, form entries or comments that arrived on the old site during the copy.",
          "**Switch DNS** at a quiet time, then check SSL, forms, email and checkout on the live domain.",
          "**Leave the old host running** until the new one is proven. Cancelling first is how sites end up offline.",
        ],
      },
      {
        type: "p",
        text: "If you are doing it yourself, our [step-by-step migration guide](/blog/migrate-website-new-host) walks through each of these, and [moving a website without downtime](/blog/move-a-website-without-downtime) covers the order of operations that keeps the site live.",
      },
      { type: "h2", id: "what-drives-cost", text: "What makes a migration cost more" },
      {
        type: "p",
        text: "Most of the price of a paid migration is time, and time depends on the site, not on the hosting company. These are the things that turn a simple copy into a project:",
      },
      {
        type: "table",
        head: ["Factor", "Simple move", "Takes longer"],
        rows: [
          ["Platform", "WordPress or another site with standard files and a database", "A website builder with no export, or a custom app with its own runtime"],
          ["Access", "Control panel login or a full backup file", "No access to the old host, or only an FTP login"],
          ["Size", "A few gigabytes of files and a normal database", "Very large media libraries or databases"],
          ["Live activity", "A brochure site that rarely changes", "A store taking orders during the move"],
          ["Email", "Mail hosted elsewhere, or a few mailboxes", "Many mailboxes with years of stored messages"],
          ["Condition", "Up to date software", "Outdated PHP, abandoned plugins or signs of a past hack"],
        ],
      },
      {
        type: "p",
        text: "The last row matters most. A site on an old PHP version or with an infected plugin cannot be copied as is: it has to be cleaned or upgraded first, and that is development work, not migration. A good service will tell you that before it starts, rather than after something breaks.",
      },
      {
        type: "callout",
        title: "Builders are a different job",
        text: "Sites built on hosted builders usually cannot be exported as files. Moving one means rebuilding the pages on the new platform, which is priced as design work. Our comparison of [WordPress, Webflow and Squarespace](/blog/wordpress-vs-webflow-squarespace) explains why.",
      },
      { type: "h2", id: "why-free", text: "Why many hosts migrate sites for free" },
      {
        type: "p",
        text: "For a hosting company, the hardest part of winning a customer is the move itself. If the site can be copied with standard tools, doing it for the customer costs the host far less than losing them to inertia. So free migration has become a normal part of a hosting plan rather than a special offer.",
      },
      {
        type: "p",
        text: "That is also why free migrations are usually limited to what can be copied cleanly: files, database and email, from a host that gives access to them. Rebuilding a builder site, cleaning up malware or rewriting a broken theme is outside the deal at almost every host. That is fair, as long as it is stated up front.",
      },
      { type: "h2", id: "checklist", text: "Questions to ask before accepting a free migration" },
      {
        type: "ul",
        items: [
          "**How many sites are included?** One per plan, a fixed number, or unlimited?",
          "**Is email included?** Some services move the website but leave you to recreate every mailbox.",
          "**Will I be able to test it first?** You should see the copied site before your domain points at it.",
          "**Who switches DNS, and when?** A move timed for a quiet hour is very different from one done whenever it happens to finish.",
          "**What happens if something is missing?** There should be a way to report it and have it fixed, not a closed ticket.",
          "**What is the plan's renewal price?** A free move onto a plan that doubles in price next year is not free. See [how to read hosting renewal pricing](/blog/how-to-read-hosting-renewal-pricing).",
        ],
      },
      { type: "h2", id: "diy", text: "When doing it yourself makes sense" },
      {
        type: "p",
        text: "If you are comfortable with a control panel and your site is a single WordPress install, a self-migration is a few hours of careful work: a migration plugin or a full backup, a test on the new server, then the DNS switch. If the site takes payments, has years of email, or you simply cannot afford a mistake, hand it to someone who does it every day.",
      },
      {
        type: "p",
        text: "Either way, take a full backup you can restore before you touch anything. Our [backup strategy guide](/blog/website-backup-strategy) explains what a restorable backup includes. And if your domain is moving registrars at the same time, do that as a separate step: see the [domain transfer guide](/blog/domain-transfer-guide).",
      },
      { type: "h2", id: "serverlys", text: "How migration works at Serverlys" },
      {
        type: "p",
        text: "[Migration is free](/migrations) with every Serverlys cloud hosting plan, with no limit on the number of sites you move within your plan. Our team copies the site, its database and email, stages it so you can check it privately, syncs the last changes and switches your domain at a time you choose. Your old host keeps serving visitors until the new site is proven, so it never goes offline.",
      },
      {
        type: "p",
        text: "Every plan renews at the same price you signed up at, and comes with daily backups, free SSL and a 30-day money-back guarantee. Plans and prices are on the [pricing page](/pricing).",
      },
    ],
  },
  {
    slug: "what-fully-managed-hosting-includes",
    title: "What \"fully managed\" hosting actually includes, job by job",
    seoTitle: "What fully managed hosting includes, job by job",
    description:
      "Fully managed hosting means the provider runs the server. Here is every job that covers, how often it happens, what stays your responsibility, and how to spot a plan that is managed in name only.",
    category: "Hosting",
    published: "2026-11-09",
    body: [
      {
        type: "p",
        text: "\"Fully managed\" is printed on a lot of hosting plans, and it means very different things from one company to the next. On one plan it means a person patches your server and restores your backups for you. On another it means a one-click installer and a support ticket form.",
      },
      {
        type: "p",
        text: "The term is easier to judge when you break it into the jobs that keep a server healthy, and ask who does each one. This guide lists them. If you are still deciding whether you need managed hosting at all, start with [what managed hosting is and who needs it](/blog/managed-hosting-guide).",
      },
      { type: "h2", id: "the-jobs", text: "The jobs that make hosting \"managed\"" },
      {
        type: "p",
        text: "Running a web server is a set of recurring tasks. On unmanaged hosting each of these is yours. On fully managed hosting the provider does all of them:",
      },
      {
        type: "table",
        head: ["Job", "What it involves", "How often"],
        rows: [
          ["Security patching", "Updating the operating system, web server, PHP and database software when fixes are released", "As patches are released"],
          ["Hardening and firewall", "Closing unused services, firewall rules, blocking brute-force logins", "Set up once, adjusted as threats change"],
          ["Monitoring", "Watching uptime and services, and restarting and investigating anything that fails", "Continuously"],
          ["Backups", "Taking backups, keeping them off the server, and checking they actually restore", "Daily"],
          ["Restores", "Putting a site back after a bad update, a hack or an accidental delete", "When you need it"],
          ["SSL certificates", "Issuing certificates and renewing them before they expire", "Automatically"],
          ["Server configuration", "PHP versions, resource limits, caching and firewall changes", "On request"],
          ["Diagnosis", "Finding out why a site is slow or erroring from the server side, and explaining it in plain language", "On request"],
        ],
      },
      {
        type: "p",
        text: "A plan that skips the first five is not fully managed, whatever the label says. Patching, monitoring and tested restores are the jobs that prevent the expensive emergencies.",
      },
      { type: "h2", id: "not-included", text: "What stays your responsibility" },
      {
        type: "p",
        text: "Fully managed hosting manages the **server**, not your **website**. Even on the best plans, these usually stay with you or your developer:",
      },
      {
        type: "ul",
        items: [
          "**Your content**: pages, products, images and copy.",
          "**Your application code**: a custom theme, a bespoke plugin or your own app.",
          "**Bugs in third-party plugins or themes**: the host can tell you which plugin is failing from the server logs, but fixing someone else's code is development work.",
          "**Your accounts**: strong passwords, two-factor login and who has admin access. See [who has access to your website](/blog/who-has-access-to-your-website).",
        ],
      },
      {
        type: "p",
        text: "Some hosts also update WordPress core and plugins for you. That is useful, but it is a website service layered on top of server management, not a substitute for it. Check whether automatic updates come with a backup taken just before they run, so a bad update can be undone.",
      },
      { type: "h2", id: "size-vs-management", text: "Managed is about who does the work, not how big the server is" },
      {
        type: "p",
        text: "A common mix-up is to treat \"managed\" as a tier above shared hosting. It is not. Management describes *who administers the server*; the hosting type describes *how much of it you get*. A small shared plan can be fully managed, and a large VPS can be completely unmanaged.",
      },
      {
        type: "table",
        head: ["", "Managed", "Unmanaged"],
        rows: [
          ["Shared or cloud plan", "The usual small business setup: the host runs everything, you run the site", "Rare. Shared servers are almost always run by the host"],
          ["VPS", "You get your own resources, the host still patches and monitors", "You get root access and every admin job that comes with it"],
          ["Dedicated server", "A whole machine, administered by the host", "A whole machine, and a full-time job if it is business-critical"],
        ],
      },
      {
        type: "p",
        text: "So choose the size for the workload, and the management for your team. Our guide to [shared, cloud, VPS and dedicated hosting](/blog/shared-cloud-vps-or-dedicated) covers the size half of that decision.",
      },
      { type: "h2", id: "red-flags", text: "Signs a plan is managed in name only" },
      {
        type: "ul",
        items: [
          "**Restores cost extra**, or you can only restore by downloading a backup and uploading it yourself.",
          "**Backups are \"your responsibility\"** in the terms of service, even though the plan page lists them.",
          "**Server security is an add-on**: malware scanning, firewall or monitoring sold separately.",
          "**Support answers with links** to documentation for server-side problems you cannot fix without server access.",
          "**PHP stays outdated**: the plan still defaults to a PHP version that no longer receives security fixes.",
          "**The renewal price is hidden.** Management is a recurring cost, and it should be priced like one. See [how to read hosting renewal pricing](/blog/how-to-read-hosting-renewal-pricing).",
        ],
      },
      { type: "h2", id: "is-it-worth-it", text: "Is fully managed hosting worth it?" },
      {
        type: "p",
        text: "For most small businesses, yes, because the alternative is not \"free\". It is someone's time, usually the owner's, spent on server updates, or no one's time at all, which is how unpatched sites get hacked. Unmanaged hosting makes sense when you already have someone who enjoys administering Linux and has time for it.",
      },
      {
        type: "p",
        text: "The useful comparison is not plan price against plan price, but plan price against the hours it replaces and the cost of a day offline. Our [web hosting cost guide](/blog/web-hosting-cost-2026) breaks down the full bill.",
      },
      { type: "h2", id: "serverlys", text: "How Serverlys manages your hosting" },
      {
        type: "p",
        text: "Every Serverlys plan is [fully managed](/managed-hosting). We apply security patches as they are released, harden and monitor the server, take daily backups and verify them, do restores for free, and issue and renew SSL automatically. PHP, caching and firewall changes are a request, not a project. Your website, content and code stay yours, with full control panel access, and if something we manage breaks, fixing it is our job.",
      },
      {
        type: "p",
        text: "Plans run on NVMe storage with LiteSpeed caching, include free migration, and renew at the same price you signed up at. Compare them on the [pricing page](/pricing).",
      },
    ],
  },
  {
    slug: "hosting-for-bootstrapped-startups",
    title: "Hosting for a bootstrapped startup: what to pay for at each stage",
    seoTitle: "Hosting for bootstrapped startups, stage by stage",
    description:
      "A practical hosting plan for founders paying out of their own pocket: what to host where from pre-launch to traction, what to avoid paying for early, and the costs that catch small teams out.",
    category: "Hosting",
    published: "2026-11-09",
    body: [
      {
        type: "p",
        text: "Startup hosting advice is usually written for companies with cloud credits and an operations engineer. A bootstrapped team has neither. Every monthly bill comes out of revenue or savings, and every hour spent on servers is an hour not spent on the product or on customers.",
      },
      {
        type: "p",
        text: "That changes the question. It is not \"which platform scales to millions of users?\" but \"what is the least we can run, at a price we can predict, without having to rebuild it in a year?\" This guide answers that one stage at a time. For a wider comparison of hosting types, see our [startup hosting guide](/blog/best-hosting-startups).",
      },
      { type: "h2", id: "split", text: "First, split the website from the product" },
      {
        type: "p",
        text: "Most startups run two very different things and host them as one. Separating them early saves money and stress:",
      },
      {
        type: "ul",
        items: [
          "**The website**: landing page, pricing, blog, docs, legal pages and the waitlist form. It needs to be fast, secure and always up, because it is where customers and investors find you. It rarely needs custom infrastructure.",
          "**The product**: your app, its API, background jobs and database. This is where your specific technical needs live.",
        ],
      },
      {
        type: "p",
        text: "Putting the marketing site on simple managed hosting means a product deploy can never take your homepage down, and a non-technical co-founder can update the website without touching the app. It also means the site most people see is the cheapest part to run.",
      },
      { type: "h2", id: "stages", text: "What to run at each stage" },
      {
        type: "table",
        head: ["Stage", "What you are running", "What to pay for"],
        rows: [
          ["Pre-launch", "A landing page and a waitlist", "A domain, entry-level managed hosting, business email. Nothing more."],
          ["Launch / MVP", "Website plus a first version of the product", "Keep the site on managed hosting. Host the product wherever its stack is simplest to deploy."],
          ["First paying customers", "Website, docs, blog, the product, a status page", "Backups you have tested, monitoring, a support channel that does not depend on a founder being awake."],
          ["Traction", "Several sites, steady traffic, spikes from launches or press", "More memory and headroom on the same platform. Move up a tier, not to a new host."],
        ],
      },
      {
        type: "p",
        text: "The theme is to pay for the stage you are at, on a platform that lets you move up without moving out. A [migration](/blog/migrate-website-new-host) in the middle of your busiest month is a cost most teams never budget for.",
      },
      { type: "h2", id: "dont-pay-early", text: "What not to pay for yet" },
      {
        type: "ul",
        items: [
          "**Infrastructure built for scale you do not have.** Load balancers, multi-region setups and orchestration add cost and admin long before they add anything for customers.",
          "**Several years of hosting up front for a product you might pivot.** Longer terms cost less per month, but only commit for longer once you know what you are running.",
          "**Premium add-ons sold at checkout** that your plan already covers, such as SSL certificates or basic backups. Check what is included before you add anything to the cart.",
          "**A separate tool for every job.** Each one is another login, another bill and another renewal date to track.",
        ],
      },
      { type: "h2", id: "hidden-costs", text: "The costs that catch small teams out" },
      {
        type: "p",
        text: "Bootstrapped budgets rarely break on the advertised price. They break on the lines nobody mentioned:",
      },
      {
        type: "ul",
        items: [
          "**Renewal prices.** An introductory rate that jumps at renewal can double a line in your budget overnight. Read [how hosting renewal pricing works](/blog/how-to-read-hosting-renewal-pricing) before you sign.",
          "**Metered usage.** Bandwidth, storage or request charges on usage-based platforms grow with your traffic, and a launch day can produce the largest invoice of the year.",
          "**Paid restores.** You find out a host charges for restores at the worst possible moment.",
          "**Engineering time.** Self-managed servers are cheap on the invoice and expensive in hours. For a two-person team, a day spent on server updates is a day without product work.",
          "**Domain and email renewals.** Keep the domain in an account the company controls, not a former freelancer's. See [keep control of your domain](/blog/keep-control-of-your-domain).",
        ],
      },
      { type: "h2", id: "checklist", text: "A one-page hosting checklist for founders" },
      {
        type: "ol",
        items: [
          "Register the domain in a company-owned account, with two-factor login turned on.",
          "Put the marketing website on managed hosting with daily backups and free SSL.",
          "Set up email on your own domain, with SPF, DKIM and DMARC records. Our [email security guide](/blog/email-security-spf-dkim-dmarc) explains them.",
          "Write down every renewal date and renewal price in one place.",
          "Restore a backup once, on purpose, so you know it works.",
          "Check [Core Web Vitals](/blog/core-web-vitals-for-small-sites) on your landing page before you spend on ads or a launch.",
        ],
      },
      { type: "h2", id: "serverlys", text: "Where Serverlys fits" },
      {
        type: "p",
        text: "Serverlys [cloud hosting for startups](/startup-hosting) is built for the website half of the split: landing page, marketing site, docs, blog and PHP or WordPress-based products. Every plan is fully managed, with unmetered bandwidth, unlimited NVMe storage, daily backups with free restores, and free migration if you are moving off a free tier, a builder or another host. Plans start with one site and go up to unlimited sites, and upgrading happens in your client area on the same platform, so growing never means moving.",
      },
      {
        type: "p",
        text: "Each plan renews at the price you signed up at, and the price is shown before you pay. There is no startup credits programme; the price you budget is the price you keep. If your product needs its own runtime, containers or root access, talk to us first and we will tell you honestly which platform suits it. Compare plans on the [pricing page](/pricing).",
      },
    ],
  },
];
