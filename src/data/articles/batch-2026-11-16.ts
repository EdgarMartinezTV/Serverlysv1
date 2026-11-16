/**
 * One article published 2026-11-16.
 *
 *   · what-is-web-hosting
 *                         "what is web hosting", "how does web hosting work",
 *                         "web hosting explained", "do I need web hosting",
 *                         "types of web hosting" — the beginner head term the
 *                         archive was missing. Supports /hosting,
 *                         /shared-hosting and /cloud-hosting. Deliberately does
 *                         not repeat domain-vs-hosting (which owns the
 *                         address-vs-server comparison); it links to it.
 *
 * Same editorial rules as original.ts: no invented statistics, customer
 * counts, case studies or quotes. Every Serverlys figure comes from
 * data/pricing.ts (RATES, SITES, VISITS, MEMORY, INCLUDES). No Black Friday
 * price is quoted, so nothing here needs revising when the sale ends.
 * ConvoAI Essentials is "included", never "free". No cover photo yet: falls
 * back to the category thumbnail.
 */
import type { Article } from "./types";

export const batch20261116: readonly Article[] = [
  {
    slug: "what-is-web-hosting",
    title: "What is web hosting? How it works, explained in plain English",
    seoTitle: "What is web hosting? How it works, in plain English",
    description:
      "Web hosting is the rented server space that keeps your website online. Here is how it works, what you are actually paying for, and how to choose a plan.",
    category: "Getting started",
    published: "2026-11-16",
    body: [
      {
        type: "p",
        text: "Every website you have ever visited lives on a computer somewhere. When you type an address into your browser, that computer sends back the pages, images and code that make up the site. **Web hosting** is the service of renting space and power on one of those computers, so your website is available to anyone, at any hour, without you running a server yourself.",
      },
      {
        type: "p",
        text: "This guide explains what happens when someone visits a website, what a hosting plan actually gives you, the main types of hosting, and how to pick one without paying for things you do not need.",
      },
      { type: "h2", id: "short-answer", text: "The short answer" },
      {
        type: "p",
        text: "Web hosting is a server, a computer built to stay switched on and connected to the internet, that stores your website's files and sends them to visitors. A hosting company owns the servers, keeps them running, secured and backed up, and rents you a portion. You pay monthly or yearly; they handle the hardware, the power and the network.",
      },
      {
        type: "callout",
        title: "Hosting is not the same as a domain",
        text: "The domain (yourbusiness.com) is the address; hosting is where the site actually lives. You need both, and they are often bought separately. Our guide to [domain vs hosting](/blog/domain-vs-hosting) explains how they fit together.",
      },
      { type: "h2", id: "how-it-works", text: "How web hosting works, step by step" },
      {
        type: "p",
        text: "It helps to follow a single visit from start to finish. Here is what happens in the second or so after someone types your address:",
      },
      {
        type: "ol",
        items: [
          "**The visitor types your domain** into a browser or clicks a link to it.",
          "**DNS looks up the address.** The domain's DNS records point to your hosting server's IP address, much like a phone book turns a name into a number. See [DNS records explained](/blog/dns-records-explained).",
          "**The browser contacts your server** and asks for the page, over a secure HTTPS connection if the site has an [SSL certificate](/blog/ssl-certificate-explained).",
          "**The server builds or fetches the page.** A plain HTML page is sent as it is; a WordPress page is assembled from PHP and the database, unless a cached copy is ready.",
          "**The files travel back to the visitor,** and the browser draws the page on screen.",
        ],
      },
      {
        type: "p",
        text: "Hosting is everything on the server side of that exchange: the machine, the storage your files sit on, the software that answers requests, and the connection to the internet. When people say a host is \"fast\" or \"reliable\", they mean how quickly and how consistently it does step four and five.",
      },
      { type: "h2", id: "what-you-pay-for", text: "What a hosting plan actually gives you" },
      {
        type: "p",
        text: "Plan pages are full of technical terms. These are the ones that matter, and what each means in practice:",
      },
      {
        type: "table",
        head: ["Term", "What it is", "Why it matters"],
        rows: [
          ["Storage", "Disk space for your files, images and database", "NVMe drives read data much faster than older SSDs or hard drives"],
          ["Bandwidth", "The data sent to visitors each month", "Limits or fair-use rules can slow or suspend a busy site"],
          ["RAM and CPU", "The server's working memory and processing power", "Decide how many visitors the site can serve at the same time"],
          ["Websites allowed", "How many separate sites one plan can host", "Matters if you run more than one business or project"],
          ["SSL certificate", "Encrypts the connection and shows the padlock", "Without it, browsers warn visitors the site is not secure"],
          ["Backups", "Saved copies of the site you can restore", "The difference between a bad day and losing everything"],
          ["Control panel", "The dashboard for files, email, databases and settings", "cPanel is the most widely used; see our [cPanel beginner's guide](/blog/cpanel-beginners-guide)"],
          ["Uptime", "The share of time the site is reachable", "Explained in [hosting uptime explained](/blog/hosting-uptime-explained)"],
          ["Support", "Who you can ask when something breaks", "Check how to reach them and what they will actually help with"],
        ],
      },
      {
        type: "p",
        text: "Many plans also include email accounts on your domain, a one-click installer for WordPress and other software, and caching that makes pages load faster. Those are worth having, but they come after the basics above.",
      },
      { type: "h2", id: "types-of-hosting", text: "The main types of web hosting" },
      {
        type: "p",
        text: "All hosting is a server you rent. The types differ in how much of that server is yours, and how much of the upkeep is your job.",
      },
      { type: "h3", text: "Shared hosting" },
      {
        type: "p",
        text: "Your site shares one server with other customers' sites. It is the least expensive option and the right starting point for most small business sites, blogs and portfolios. The trade-off is that resources are shared, so the host's limits and how well it isolates each account matter. See [shared hosting](/shared-hosting).",
      },
      { type: "h3", text: "Cloud hosting" },
      {
        type: "p",
        text: "Your site runs on resources drawn from a group of servers rather than one machine, which usually means more consistent performance and room to grow. For many sites it costs about the same as shared hosting. Our comparison of [cloud vs shared hosting](/blog/cloud-vs-shared-hosting) goes into the differences.",
      },
      { type: "h3", text: "WordPress hosting" },
      {
        type: "p",
        text: "Hosting set up specifically for WordPress: installed for you, cached for WordPress and kept updated. Often the same resources as a regular plan with the setup and upkeep handled. See [WordPress hosting vs web hosting](/blog/wordpress-hosting-vs-web-hosting).",
      },
      { type: "h3", text: "VPS hosting" },
      {
        type: "p",
        text: "A virtual private server is a guaranteed slice of a server that behaves like your own machine, with root access. It suits developers, custom applications and sites that have outgrown shared plans, but you, or a managed provider, are responsible for the software on it. See [VPS hosting](/vps-hosting).",
      },
      { type: "h3", text: "Dedicated servers" },
      {
        type: "p",
        text: "An entire physical server for one customer. Maximum power and control, at the highest price, and usually only needed for very busy sites or specific compliance requirements. See [dedicated servers](/dedicated-servers).",
      },
      {
        type: "p",
        text: "For a side-by-side view of all four, read [shared, cloud, VPS or dedicated](/blog/shared-cloud-vps-or-dedicated). On any of them, **managed** hosting means the provider also looks after updates, security and performance for you; our [managed hosting guide](/blog/managed-hosting-guide) explains what that should include.",
      },
      { type: "h2", id: "do-you-need-it", text: "Do you need web hosting?" },
      {
        type: "p",
        text: "If you want a website at your own domain that you control, yes. The only question is whether you buy hosting directly or get it bundled inside another product:",
      },
      {
        type: "ul",
        items: [
          "**Website builders** such as Wix and Squarespace include hosting in their subscription. Simple to start, but the site can only live on their platform. Our [WordPress vs Webflow and Squarespace](/blog/wordpress-vs-webflow-squarespace) comparison covers the trade-offs.",
          "**Online store platforms** such as Shopify bundle hosting the same way. See [WooCommerce vs Shopify](/blog/woocommerce-vs-shopify).",
          "**Your own hosting plan** gives you full control: any software, your own files, and the freedom to move hosts whenever you like.",
          "**Sites built with AI tools** still need somewhere to live once they leave the tool. See [how to put your AI-built website online](/blog/put-your-ai-built-website-online).",
        ],
      },
      {
        type: "p",
        text: "You can technically host a website on a computer at home, but it would need to stay on all the time, have a fixed address, and be secured against the whole internet. For a business, the few dollars a month a host charges is almost always the cheaper option.",
      },
      { type: "h2", id: "how-to-choose", text: "How to choose a hosting plan" },
      {
        type: "ol",
        items: [
          "**Start from your site, not the plan names.** How many websites, roughly how many visitors a month, and is it WordPress, a store, or something else? Our guide to [how much hosting you need](/blog/how-much-hosting-do-you-need) helps with the numbers.",
          "**Compare the resources,** RAM, storage type and site limit, rather than labels such as \"Pro\" or \"Ultimate\".",
          "**Check the renewal price,** not only the first-term price. See [how to read hosting renewal pricing](/blog/how-to-read-hosting-renewal-pricing).",
          "**Confirm the essentials are included:** free SSL, daily backups you can restore yourself, and email on your domain if you need it.",
          "**Look at support** and how you reach it before you need it.",
          "**Check the refund window,** so you can leave if the host is not a good fit.",
          "**Watch for warning signs** such as \"unlimited\" claims with hidden limits; our list of [hosting red flags](/blog/hosting-red-flags) covers the common ones.",
        ],
      },
      {
        type: "p",
        text: "For a sense of the typical price range, see [how much web hosting costs in 2026](/blog/web-hosting-cost-2026).",
      },
      { type: "h2", id: "serverlys", text: "Web hosting at Serverlys" },
      {
        type: "p",
        text: "Every Serverlys [hosting plan](/hosting) includes unlimited NVMe storage, unmetered bandwidth, cPanel, a free SSL certificate, LiteSpeed caching, daily backups, free website migration and a ConvoAI Essentials [AI website chat](/ai-agents) trained on your own pages. The plans differ in how many sites they host and how much memory they have:",
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
        text: "Prices are for the monthly term; 12, 24 and 36-month terms cost less per month and are listed on the [pricing page](/pricing). Every plan comes with a 30-day money-back guarantee, set out in the [refund policy](/refund-policy). If you already have a site elsewhere, we can [move it for you](/migrations), and you can [register a domain](/domain-name) in the same account.",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "Is web hosting the same as a domain?" },
      {
        type: "p",
        text: "No. The domain is the name people type; hosting is the server the name points to. You can buy them from the same company or from different ones, and connect them with DNS or [nameservers](/blog/nameservers-explained).",
      },
      { type: "h3", text: "Can I get web hosting for free?" },
      {
        type: "p",
        text: "Free hosting exists, but it usually comes with ads on your site, no custom domain, tight limits and little or no support. It is fine for experiments. For a business, a low-cost paid plan is more reliable and looks more professional.",
      },
      { type: "h3", text: "Can I change hosting companies later?" },
      {
        type: "p",
        text: "Yes. Your files and database are copied to the new host and the domain is pointed at the new server. Done carefully, visitors never notice. See [how to migrate a website to a new host](/blog/migrate-website-new-host) and [moving a website without downtime](/blog/move-a-website-without-downtime).",
      },
      { type: "h3", text: "Does web hosting include email?" },
      {
        type: "p",
        text: "Often, but not always. Many plans let you create addresses such as you@yourbusiness.com. Some businesses prefer a dedicated email service instead; our guide to [setting up business email](/blog/setup-business-email) compares the options.",
      },
      { type: "h3", text: "Does hosting affect SEO?" },
      {
        type: "p",
        text: "Indirectly, yes. A slow or frequently unavailable server makes pages load slowly or not at all, which hurts both visitors and rankings. Our guide to [website speed and SEO](/blog/website-speed-seo) explains the connection.",
      },
    ],
  },
];
