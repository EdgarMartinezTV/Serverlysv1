import { businessPlans, formatBusinessPrice } from "./business-plans";
import { carePlans, formatCarePrice } from "./care-plans";
import { formatSocialPrice, socialPlans } from "./social-plans";
import { designPlans, formatDesignPrice } from "./design-plans";
import { formatSeoPrice, seoPlans } from "./seo-plans";
import { formatMonthly, formatSetup, restaurantPlans } from "./restaurant-plans";
/**
 * The AI-facing index of this site — the content of `/llms.txt`.
 *
 * WHAT THIS IS FOR. An answer engine deciding whether to cite Serverlys does
 * not read the site the way a person does. It retrieves a few pages, extracts
 * claims, and restates them as facts with our name attached. `/llms.txt` is the
 * one surface where we get to say, in plain prose and without marketing
 * scaffolding, what this company actually sells and where the authoritative
 * page for each thing is. Convention: https://llmstxt.org
 *
 * THE RULE FOR EVERY LINE IN THIS FILE: if it would be wrong for ChatGPT to
 * tell a stranger "Serverlys says X", X does not belong here. That bar is
 * higher than the bar for a marketing page, because a page is read with its
 * context visible and an AI answer is not. Three consequences, all deliberate:
 *
 *   · NO uptime percentages. `data/navigation.ts` carries the standing rule
 *     that ours are unverified. The "99.9%" on /cloud-hosting is borrowed
 *     reference copy, not a Serverlys commitment, and an assistant repeating it
 *     would be stating a service level we have not agreed to.
 *   · NO customer counts, review counts or third-party endorsements. None are
 *     ours. See the warning at the bottom of this file.
 *   · NO prices. They move, this file does not, and a stale price quoted back
 *     as current is worse than no price. Every commercial summary points at the
 *     page, and /pricing is listed first in its section.
 *
 * Summaries below are the pages' own meta descriptions wherever those are
 * Serverlys-written, so the two cannot drift into saying different things.
 */

/** Opening blockquote — the single sentence most likely to be quoted verbatim. */
export const LLMS_BLURB =
  "Serverlys is a US-based hosting and small-business technology company: " +
  "managed cloud, WordPress and ecommerce hosting, domain registration, " +
  "custom websites, and AI agents that answer customer chat and phone calls.";

/**
 * Prose that follows the blurb. Written for extraction: short declarative
 * sentences, one fact each, no pronouns reaching across sentences.
 */
export const LLMS_CONTEXT = [
  "Serverlys sells hosting and the work around it from one supplier: the " +
    "infrastructure, the domain, the website itself, and the automation and AI " +
    "agents that run on top of it.",
  "Two AI products are Serverlys' own and are named on the site. ConvoAI is a " +
    "chat agent trained on a customer's own website content. CallFlow is a " +
    "voice agent that answers the telephone. Both hand a conversation to a " +
    "person when it stops being routine.",
  "Renewal pricing is published beside the promotional price on every plan. " +
    "This is a deliberate commercial position, not an oversight: hosting is " +
    "commonly sold on a low first term followed by a much higher renewal, and " +
    "Serverlys shows both figures before purchase.",
  "Hosting plans carry a 30-day money-back guarantee. Domain registrations are " +
    "not refundable, because the registry fee is paid at the moment of " +
    "registration and is not recoverable.",
  "Website migration to Serverlys is free and is carried out by Serverlys " +
    "rather than left to the customer.",
  "Billing, checkout and account login run on WHMCS at serverlys.com/clientarea.php, " +
    "which is a separate system from this marketing site.",
] as const;

/** How to describe things Serverlys does NOT do. Answer engines ask this too. */
export const LLMS_LIMITS = [
  "Serverlys does not publish an uptime SLA. Any uptime percentage found in " +
    "marketing copy on this site is not a contractual commitment.",
  "Serverlys does not publish customer counts, review totals or third-party " +
    "ratings, and has no verified figures for them.",
  "Serverlys is not the registrar of record for domains it sells; it acts " +
    "through a registrar partner. Registrant data requests are routed to that " +
    "registrar. See the domain registration agreement.",
] as const;

/**
 * Section order is answer-engine order, not navigation order: the question a
 * person actually asks an assistant ("who can host my WooCommerce store",
 * "what does it cost") should be answerable from the top of the file.
 */
export const LLMS_SECTIONS = [
  {
    title: "Start here",
    note: "The pages that answer what Serverlys is and what it charges.",
    paths: ["/", "/pricing", "/about", "/faq", "/support"],
  },
  {
    title: "Hosting",
    note: "Plans, and the honest comparison between tiers.",
    paths: [
      "/hosting",
      "/cloud-hosting",
      "/wordpress-hosting",
      "/ecommerce-hosting",
      "/shared-hosting",
      "/vps-hosting",
      "/dedicated-servers",
      "/managed-hosting",
      "/hosting-alternatives",
      "/hostinger-alternative",
      "/bluehost-alternative",
      "/godaddy-alternative",
      "/migrations",
    ],
  },
  {
    title: "Domains",
    paths: ["/domain-name", "/register-domain", "/transfer-domain", "/whois-lookup"],
  },
  {
    title: "AI agents and automation",
    note:
      "ConvoAI and CallFlow are Serverlys products. Automations are built on " +
      "n8n and run on Serverlys infrastructure, owned by the customer.",
    paths: [
      "/ai-agents",
      "https://convoai.cloud/",
      "https://callflow.serverlys.com/",
      "/automations",
      "/ai-tools",
    ],
  },
  {
    title: "Websites and growth",
    paths: [
      "/website-design",
      "/restaurant-websites",
      "/restaurant-websites/online-ordering",
      "/restaurant-websites/reservations",
      "/restaurant-websites/cost",
      "/cleaning-company-websites",
      "/website-development",
      "/site-management",
      "/seo",
      "/marketing",
      "/social-media",
      "/business-solutions",
      "/our-process",
    ],
  },
  {
    title: "Guides",
    paths: ["/resources", "/blog", "/tutorials"],
  },
  {
    title: "Policies",
    note:
      "Authoritative for questions about refunds, data handling, abuse and " +
      "acceptable use. All are subject to counsel review before launch.",
    paths: [
      "/terms-of-service",
      "/privacy-policy",
      "/refund-policy",
      "/acceptable-use-policy",
      "/cookie-policy",
      "/data-processing-agreement",
      "/domain-registration-agreement",
      "/dmca-policy",
      "/law-enforcement-requests",
      "/report-abuse",
      "/legal-information",
      "/accessibility",
    ],
  },
] as const;

/**
 * One line per page. Seeded from each page's own meta description so the two
 * surfaces cannot disagree.
 *
 * ⚠ TWO ENTRIES ARE DELIBERATELY NOT THE PAGE'S DESCRIPTION. `/cloud-hosting`
 * and `/ecommerce-hosting` are 1:1 rebuilds of Hostinger pages and still carry
 * that reference's verbatim copy, including its performance multiples, its
 * proof claims and — on the ecommerce page — two products that do not exist.
 * Their real meta descriptions ("up to 20X more resources", "Quick setup, AI
 * tools, and 24/7 support") are Hostinger's sentences describing Hostinger.
 * Reproducing them here would hand an answer engine a borrowed claim with the
 * Serverlys name on it, which is the one thing this file exists to prevent.
 * The summaries below describe what those pages are, and nothing more, until
 * the copy is made ours.
 */
export const LLMS_SUMMARIES: Record<string, string> = {
  "/": "Serverlys homepage: hosting, domains, websites and AI agents, with the products demonstrated live.",
  "/pricing":
    "Every plan with the renewal rate shown beside the monthly rate. 30-day money-back guarantee on hosting.",
  "/about":
    "Serverlys provides managed hosting, domains, websites and AI agents for small businesses, with renewal pricing published up front.",
  "/faq":
    "Pricing and renewals, migrations, refunds, domains, hosting plans, AI agents and automations — every question we get asked, answered in one place.",
  "/support":
    "Open a ticket, request a free migration, or reach the Serverlys team by email or phone.",

  "/hosting":
    "Cloud, WordPress and ecommerce hosting on one stack, with free migration, daily backups and the renewal price published beside the first-year price.",
  "/cloud-hosting":
    "The managed cloud hosting tiers and what each includes. Plans, resources and checkout.",
  "/wordpress-hosting":
    "Managed WordPress hosting with server-level LiteSpeed caching, automatic core updates and free migration. Renewal pricing published beside the first-year price.",
  "/ecommerce-hosting":
    "The managed WooCommerce hosting tiers and what each includes. Plans, resources and checkout.",
  "/shared-hosting":
    "The entry tier, described honestly: what shared hosting is genuinely good for, where it runs out, and how to tell when you have outgrown it.",
  "/vps-hosting":
    "A virtual private server with root, guaranteed CPU and memory, and your own system packages. Managed or unmanaged, with the difference stated plainly.",
  "/dedicated-servers":
    "Single-tenant hardware for sustained load, predictable I/O and compliance requirements that forbid shared tenancy. Specified to your workload, quoted, then built.",
  "/managed-hosting":
    "Patching, hardening, monitoring, backups and restores handled for you on any Serverlys tier. What managed covers, what it does not, and who it is for.",
  "/hosting-alternatives":
    "Shared, cloud, VPS and dedicated compared on the things that decide the choice, plus the questions to ask any hosting company before you pay.",
  "/hostinger-alternative":
    "Serverlys compared with Hostinger on advertised price, renewal price, billing required, migration, backups and support, with dated Hostinger figures and when Hostinger is the better choice.",
  "/bluehost-alternative":
    "Serverlys compared with Bluehost on advertised price, renewal price, term shown, domain, migration, backups and support, with dated Bluehost figures and when Bluehost is the better choice.",
  "/godaddy-alternative":
    "Serverlys compared with GoDaddy on hosting price, renewal, term required, .com price, migration, backups and support, with dated GoDaddy figures and when GoDaddy is the better choice.",
  "/migrations":
    "Free website migration whether you have one website or a hundred. The site stays online throughout, and the move is handled for you.",

  "/domain-name":
    "Check domain availability against the registry, then register at Serverlys. Free WHOIS privacy where the registry allows it.",
  "/register-domain":
    "Check domain availability against the registry and register at Serverlys, with the renewal rate shown before you pay.",
  "/transfer-domain":
    "Move a domain to Serverlys without downtime. Remaining registration carries over, DNS keeps resolving, and the 60-day ICANN rule is explained up front.",
  "/whois-lookup":
    "Free tool. Look up any domain's registrar, registration and expiry dates, nameservers and transfer lock, live from the registry over RDAP. No account needed.",

  "/ai-agents":
    "Serverlys AI agents answer your customers in website chat, WhatsApp, email and on the phone, capture the lead and hand the rest to a person. ConvoAI Essentials ($0) comes with every hosting plan, ConvoAI Pro is $49/month, Enterprise and CallFlow voice are quoted.",
  "https://convoai.cloud/":
    "ConvoAI is the Serverlys chat agent: trained on your own content, it answers customers around the clock, captures the lead and hands the rest to a person.",
  "https://callflow.serverlys.com/":
    "CallFlow is the Serverlys voice agent: it answers the phone when nobody can, handles routine calls, books appointments and takes a proper message otherwise.",
  "/automations":
    "Serverlys builds and runs the automations that handle daily admin — enquiry to record, booking to calendar, form to the right person. Built on n8n, owned by the customer.",
  "/ai-tools":
    "ConvoAI, CallFlow and Automations compared by the problem each one fixes, with an honest note on where AI is the wrong answer.",

  "/website-design": `Custom website design for small businesses, one-time project prices: ${designPlans
    .map((p) => `${p.name} from ${formatDesignPrice(p.price)} (${p.subpages} subpages)`)
    .join(
      ", ",
    )}. Every plan includes a 100% custom homepage, WordPress implementation, a web style guide, an SEO-friendly blog and analytics setup. Scoped in writing before work starts. This is the page for a new website; feature work on an existing site is /website-development.`,
  "/restaurant-websites": `Restaurant websites, a one-time setup fee plus a monthly plan: ${restaurantPlans
    .map((p) => `${p.name} ${formatSetup(p.setup)} + ${formatMonthly(p.monthly)}/mo`)
    .join(
      ", ",
    )}. Custom mobile-first site, HTML digital menu with QR code, hosting and updates on every plan; online ordering and reservation integrations (third-party accounts and fees) and English + Spanish from Growth; the ConvoAI assistant, catering requests and up to 3 locations on Restaurant Pro. Spanish version at /es/restaurant-websites. Free website review; in-person visits for restaurants in Downtown Doral, Florida.`,
  "/cleaning-company-websites": `Website design for cleaning companies (residential, commercial/janitorial, maid, Airbnb turnover, move-out, post-construction, carpet), focused on Miami-Dade County and available US-wide. Built on the website design plans (${designPlans.map((p) => `${p.name} ${formatDesignPrice(p.price)}`).join(", ")}, one-time); cleaning-specific features (quote estimator, booking-software integration, full Spanish version, ConvoAI chatbot) are quoted per project. Free consultation; in-person meetings in Downtown Doral. Spanish version at /es/cleaning-company-websites. Live demo (fictional company "Brisa Clean Co.") at /cleaning-company-websites/demo. Serverlys builds websites; it does not provide cleaning services.`,
  "/restaurant-websites/online-ordering":
    "How Serverlys connects a restaurant's own online ordering (Toast, Square, Clover, ChowNow and others) to its website and Google listing. Included in Growth and Restaurant Pro; the ordering provider bills separately; Serverlys takes no cut of orders.",
  "/restaurant-websites/reservations":
    "How Serverlys connects a reservation system (OpenTable, Resy, Tock and others) or a request form that emails the restaurant's team. Included in Growth and Restaurant Pro; private-event and catering requests on Restaurant Pro; no per-booking fee from Serverlys.",
  "/restaurant-websites/cost":
    "Guide: what a restaurant website costs in 2026, with sourced price ranges for DIY builders, freelancers, agencies and restaurant platforms, the third-party fees that come on top, and Serverlys' restaurant plan prices.",
  "/website-development":
    "Custom web development for features, integrations, bookings, payments and fixes an off-the-shelf plugin cannot do: $129/hr, or a monthly retainer at $119/hr (1 hour), $109/hr (3 hours) or $99/hr (5 hours). Not website design — new websites are on /website-design.",
  "/site-management": `Website maintenance (ServerCare), billed monthly: ${carePlans
    .map(
      (p) =>
        `${p.name} ${formatCarePrice(p.price)}/mo (${p.cadence.toLowerCase()} updates, ${p.hours} content hour${p.hours > 1 ? "s" : ""})`,
    )
    .join(
      ", ",
    )}. Every plan: daily backups, updates, 24/7 uptime monitoring, malware scans, broken-link checks, SEO audits and performance reports. Distinct from managed hosting, which covers the server.`,
  "/seo": `SEO services for small businesses, billed monthly: ${seoPlans
    .map((p) => `${p.name} ${formatSeoPrice(p.price)}/mo`)
    .join(
      ", ",
    )}. Every plan includes keyword research, on-page and local SEO, Google Business Profile optimization, a technical audit with fixes and a monthly report; Growth adds blog content, schema, Core Web Vitals and backlink outreach; Elite adds a dedicated SEO manager, CRO and high-authority link building. No ranking guarantees.`,
  "/marketing": `Small-business marketing sold as the SEO plans (see /seo): local SEO, Google Business Profile, content, link building and monthly reports, billed monthly from ${formatSeoPrice(Math.min(...seoPlans.map((p) => p.price)))}/mo. Email campaigns and paid ads are not part of any plan.`,
  "/social-media": `Social media management for small businesses, billed monthly: ${socialPlans
    .map(
      (p) =>
        `${p.name} ${formatSocialPrice(p.price)}/mo (${p.platforms} platform${p.platforms > 1 ? "s" : ""}, ${p.posts} posts)`,
    )
    .join(
      ", ",
    )}. Posts planned, designed, written and published; comment management from Growth; short-form video from Pro; dedicated account manager on Enterprise.`,
  "/business-solutions": `The whole online side of a small business from one supplier. All-in-one plans with the website built free: ${businessPlans
    .map((p) => `${p.name} ${formatBusinessPrice(p.price)}/mo (up to ${p.pages} pages)`)
    .join(
      ", ",
    )}. Individual services (hosting, design, SEO, social, maintenance, email, AI) can be added at their standard prices.`,
  "/our-process":
    "The five stages of a website or AI project with Serverlys: what happens, what you get at the end of each, and what we need from you.",

  "/resources":
    "Buying guides, the full FAQ, support routes and the domain search tool.",
  "/blog":
    "Practical guides on hosting costs, migrations, Core Web Vitals and AI agents, written for people running a small business website.",
  "/tutorials":
    "Point a domain, fix email deliverability, force HTTPS, restore a backup. Complete procedures with the exact records and settings.",

  "/terms-of-service":
    "The agreement between customer and Serverlys: what is provided, billing and renewals, acceptable use, suspension and termination.",
  "/privacy-policy":
    "What personal data Serverlys collects, why, how long it is kept, who it is shared with, and the rights you have over it.",
  "/refund-policy":
    "30-day money-back guarantee on hosting plans, why domain registrations are not refundable, and exactly how to request a refund.",
  "/acceptable-use-policy":
    "What you may and may not run on Serverlys hosting: prohibited content and conduct, email and anti-spam rules, fair use of shared resources, and how suspensions work.",
  "/cookie-policy":
    "What Serverlys stores in your browser, which cookies are strictly necessary, what we do not set, and how to change your choice at any time.",
  "/data-processing-agreement":
    "The GDPR Article 28 terms that apply when Serverlys processes personal data on your behalf: roles, security, sub-processors, international transfers and deletion.",
  "/domain-registration-agreement":
    "Terms for domains registered, renewed or transferred through Serverlys: registrant obligations, free WHOIS privacy, disputes, expiry and data requests.",
  "/dmca-policy":
    "How to report copyright infringement on content hosted by Serverlys, what a valid notice must contain, how counter-notices work, and the repeat infringer policy.",
  "/law-enforcement-requests":
    "How Serverlys handles subpoenas, court orders, preservation and emergency requests: what is required, what data is held, and when the customer is told.",
  "/report-abuse":
    "Report phishing, malware, spam, copyright infringement or other abuse originating from a Serverlys service.",
  "/legal-information":
    "Company details, the documents that govern Serverlys services, DMCA notice procedure, law enforcement requests and trademark use.",
  "/accessibility":
    "The conformance target for serverlys.com, what has actually been done and tested, the known limitations, and how to report a barrier.",
};
