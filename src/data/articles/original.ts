/**
 * Editorial content.
 *
 * These are real articles, written for this site. Rules that apply to every
 * one of them, and to any added later:
 *
 *   - No invented statistics, customer counts, case studies or quotes. Where a
 *     number appears it is either a published standard (Core Web Vitals
 *     thresholds, ICANN transfer locks) or a Serverlys price from data/pricing.
 *   - No competitor named in a disparaging comparison.
 *   - `published` is the date the article went live on this site. Do not
 *     backdate to fake a publishing history.
 *
 * Body content is a small block union rather than markdown: it keeps the
 * dependency count at zero, and it means every article renders with the
 * design system's typography instead of a generic prose stylesheet.
 */

/**
 * Inline markup inside a block's text.
 *
 * Block text is a plain string carrying three markers, not HTML and not a
 * markdown dependency:
 *
 *   **bold**            emphasis
 *   `code`              inline code / literal values
 *   [label](/path)      a link
 *
 * Three markers rather than a parser because that is all the writing uses, and
 * because a string stays greppable, diffable and impossible to inject HTML
 * through — `RichText` builds React nodes, so nothing here is ever passed to
 * dangerouslySetInnerHTML. Text with none of these characters renders exactly
 * as written, which is why the articles written before this existed needed no
 * changes.
 *
 * Links matter beyond styling: the ported archive carries hundreds of internal
 * links between posts and product pages, and dropping them to plain text would
 * throw away the internal link graph that makes a 76-article archive rank as a
 * topic cluster instead of 76 unrelated pages.
 */

import type { Article } from "./types";

export const originalArticles: readonly Article[] = [
  {
    slug: "answer-every-website-visitor-with-convoai",
    title: "Your website never closes. Now it can answer, too.",
    description:
      "How ConvoAI puts an AI agent on your website that answers questions, books appointments and hands real conversations to your team, and how to start for free this afternoon.",
    category: "AI",
    published: "2026-10-11",
    body: [
      {
        type: "p",
        text: "It is 10:40 on a Tuesday night. Someone has found your website, likes what they see, and has one question before they buy, book or call: do you deliver to my area, are you open on Sunday, can you fit me in this week? There is nobody to ask. So they close the tab and ask the next business on the list, and in the morning you never know they were there.",
      },
      {
        type: "p",
        text: "That is the quiet cost of a website that only talks. It is open every hour of every day, and it cannot answer a single question. [ConvoAI](https://convoai.cloud/) exists to fix exactly that, and it is the reason we built it alongside Serverlys hosting: a site that loads fast is only half the job if the visitor still leaves with their question unanswered.",
      },
      { type: "h2", id: "what-it-is", text: "What ConvoAI actually is" },
      {
        type: "p",
        text: "ConvoAI is an **AI agent trained on your business**, living in a messenger on your website. A visitor opens the chat bubble in the corner, asks a question in their own words, and gets an answer from your information: your hours, your services, your prices, your policies. Not a menu of buttons, not a form that promises a reply in two business days. An answer, in the moment they asked.",
      },
      {
        type: "p",
        text: "The website comes first, because that is where people look for you. The same agent also answers **WhatsApp and email** (with Instagram, Messenger and SMS in private beta), and every conversation from every channel lands in **one shared inbox** where you and your team can read it, reply to it or take it over.",
      },
      {
        type: "quote",
        text: "The goal is not a cleverer chatbot. It is that nobody who wanted to become your customer leaves without an answer.",
      },
      { type: "h2", id: "a-day", text: "What a day looks like with it" },
      {
        type: "p",
        text: "Picture a small café that also does catering. This is an illustration rather than a customer story, but every step in it is something ConvoAI does today.",
      },
      {
        type: "ul",
        items: [
          "**7:02 am.** Before the doors open, a visitor asks whether there is oat milk and what the Sunday hours are. The agent answers both from the café's own information. Nobody had to be awake for it.",
          "**9:15 am.** The morning rush. Three questions arrive at once on the website and WhatsApp. The agent handles all three while the owner is behind the counter.",
          "**11:40 am.** Someone wants a table for eight on Saturday. The agent checks the agenda and books it, and the booking appears in the calendar with the customer's name and number.",
          "**1:25 pm.** A local office asks about catering for forty people. The agent asks the questions the owner would ask (date, headcount, budget) and saves the answers to that contact in the built-in CRM, so the lead is qualified before anyone picks up the phone.",
          "**3:10 pm.** A wholesale enquiry needs a real decision. The agent hands it to the owner with a short summary, and steps back as soon as she replies, so the customer never has to repeat themselves.",
        ],
      },
      {
        type: "p",
        text: "None of that is magic, and none of it replaces the owner. It means the questions that used to be lost after closing time, or ignored during the busiest hour, become conversations, bookings and leads instead.",
      },
      { type: "h2", id: "what-it-does", text: "What it does for your business" },
      { type: "h3", text: "Answers like your best employee" },
      {
        type: "p",
        text: "You describe your business once, and the agent answers from it. On the Pro plan you can also upload your own documents (menus, price lists, policies, FAQs) and the agent answers from those, so you stay in control of every answer. Safety checks run on every reply, and when the agent does not know something, it says so and brings in your team rather than guessing.",
      },
      { type: "h3", text: "Turns conversations into customers" },
      {
        type: "p",
        text: "Every conversation is linked to a contact in a built-in CRM, and on Pro the agent qualifies leads with scoring and tags as it talks. It remembers returning customers and accepts photos, voice notes and documents, and on Pro it can follow up later with proactive messages, so an interested visitor does not go cold.",
      },
      { type: "h3", text: "Fills your calendar" },
      {
        type: "p",
        text: "With the smart agenda on Pro, the agent offers real availability and books appointments straight into your calendar: consultations, viewings, tables, service calls. The visitor gets a confirmed time in the chat instead of a request you have to chase.",
      },
      { type: "h3", text: "Knows when to bring in a person" },
      {
        type: "p",
        text: "Some conversations should not be handled by software, and ConvoAI is built around that. The handoff to your team arrives with the context already written up, routing can send it to the right department, and the moment a teammate replies, the AI pauses on that conversation. Your customer gets a person when they need one, without starting again.",
      },
      {
        type: "callout",
        title: "Be honest about what it is",
        text: "ConvoAI tells visitors they are talking to an AI assistant and that a person can step in. That is not a weakness. People are happy to get an instant answer from an assistant; what erodes trust is finding out later. Our earlier piece on [what an AI agent can genuinely do](/blog/what-ai-agents-can-do-for-a-small-business) covers where to draw the line.",
      },
      { type: "h2", id: "start", text: "How to start this afternoon" },
      {
        type: "ol",
        items: [
          "**Create a free account** at [convoai.cloud](https://convoai.cloud/). No credit card is needed.",
          "**Tell your agent about your business.** Hours, services, prices you are happy to state, the questions you are asked most, and when it should hand over to you.",
          "**Add the messenger to your website** with one line of code. If your site is hosted with Serverlys, it goes in the same place you would add any other snippet, on WordPress or a hand-built site alike.",
          "**Try to break it.** Ask the awkward questions your customers ask. Wherever the answer is not right, fix the information rather than the wording.",
          "**Read the first week of conversations.** They will show you what visitors actually want to know, which is often not what the website says first.",
        ],
      },
      {
        type: "table",
        head: ["", "Free", "Pro"],
        rows: [
          ["Price", "$0, free forever", "$49/month, or $39/month billed yearly"],
          ["AI agent", "1", "1"],
          ["AI replies", "65 every 2 weeks", "Unlimited"],
          ["Channels", "Website messenger, WhatsApp and email", "Website messenger, WhatsApp and email"],
          ["Answers from your own documents", "Not included", "Included"],
          ["Appointment booking", "Not included", "Included"],
          ["Team seats", "1", "10"],
        ],
      },
      {
        type: "p",
        text: "The Free plan is enough to find out whether visitors use it, and they usually ask more than you expect. If the free replies run out, the AI pauses until they reset two weeks later, while new messages keep arriving in your inbox for you to answer and you get a notification, so no lead is lost. Prices and plan details are as published on [ConvoAI's pricing page](https://convoai.cloud/pricing) on the day this was written.",
      },
      { type: "h2", id: "small-claim", text: "A small promise you can check" },
      {
        type: "p",
        text: "We are not going to tell you an AI agent will transform your business. The promise is smaller, and you can check it within a week: the questions people ask your website at night, at the weekend and during your busiest hour will get answered, and the ones that matter will reach you with everything you need to close them.",
      },
      {
        type: "p",
        text: "Your website is already open around the clock. [Start free with ConvoAI](https://convoai.cloud/) and let it answer, too.",
      },
    ],
  },
  {
    slug: "how-to-read-hosting-renewal-pricing",
    title: "How to read hosting renewal pricing before you buy",
    description:
      "The advertised price is the introductory price. Here is how to work out what hosting will actually cost you once it ends.",
    category: "Hosting",
    published: "2026-09-09",
    body: [
      {
        type: "p",
        text: "Almost every hosting company advertises an introductory rate. You pay it once, for the first term, and then you pay the renewal rate for as long as you stay. That is not a trick in itself — it is how the industry prices. The problem is that the renewal rate is usually two clicks away in the terms, so the number you compare between providers is not the number you end up paying.",
      },
      {
        type: "p",
        text: "There is a simple fix. Stop comparing advertised prices and start comparing what a year actually costs, at the introductory rate and at the rate that follows it.",
      },
      { type: "h2", id: "the-arithmetic", text: "The arithmetic that matters" },
      {
        type: "p",
        text: "Multiply the advertised rate by twelve, add any setup fee, then do it again at the renewal rate. Our own entry plan is $7.95/mo and renews at $12.62/mo, so a first year is 12 × $7.95 = $95.40 plus a $2.95 setup fee, or $98.35 — and every year after it is 12 × $12.62 = $151.44. Both numbers are on the plan card. The gap between them is the whole decision, and it is the number most providers make you hunt for.",
      },
      {
        type: "p",
        text: "Do that for each provider on your shortlist and the ranking often reverses. The cheapest first year is frequently the most expensive third year, because a deep introductory discount has to be paid for somewhere.",
      },
      { type: "h2", id: "term-length", text: "If a provider sells you a term, price the whole term" },
      {
        type: "p",
        text: "Many hosts quote their lowest number against a multi-year commitment, billed upfront. That is a genuine discount, and it has a genuine cost: you have prepaid, so leaving early means asking for a refund rather than simply not renewing. If you go that route, buy the longest term you are confident about rather than the longest term offered — and check what the rate becomes when it ends, because that is when the discount stops.",
      },
      {
        type: "callout",
        title: "Check the refund window before you commit",
        text: "A 30-day money-back guarantee makes any commitment much safer, because you have a month to find out whether the platform actually suits your site. Domain registrations are the exception — the registry fee is paid immediately, so they are generally non-refundable everywhere.",
      },
      { type: "h2", id: "the-add-ons", text: "Price the add-ons, not just the plan" },
      {
        type: "p",
        text: "The plan price is rarely the whole bill. Before you compare anything, find out whether each of these is included or charged:",
      },
      {
        type: "ul",
        items: [
          "SSL certificates, and whether the free one covers subdomains",
          "Daily backups — and separately, whether restoring one costs money",
          "Migration of your existing site",
          "WHOIS privacy on domains, which is free at some registrars and a line item at others",
          "Email mailboxes, and how many",
          "Staging environments, if you will ever need to test a change safely",
        ],
      },
      {
        type: "p",
        text: "A restore fee is the one to watch. A backup you have to pay to use is not really a backup — it is an insurance policy with an excess, sold to you at the worst possible moment.",
      },
      { type: "h2", id: "questions", text: "Three questions to ask before checkout" },
      {
        type: "ol",
        items: [
          "What is the renewal rate for this exact plan, in writing, before I pay?",
          "What does it cost to restore a backup, and how far back do the restore points go?",
          "If I want to leave, do I get my files and database, and is there a fee to hand them over?",
        ],
      },
      {
        type: "p",
        text: "Any provider worth buying from can answer all three in one reply. We publish the renewal rate next to the introductory rate on [every plan](/pricing) for exactly this reason: it costs us some sign-ups, and it saves the conversation that would otherwise happen twelve months later.",
      },
    ],
  },
  {
    slug: "move-a-website-without-downtime",
    title: "How to move a website to a new host without downtime",
    description:
      "Stage first, lower your TTL, cut over deliberately. The migration order that keeps a live site online.",
    category: "Getting started",
    published: "2026-09-09",
    body: [
      {
        type: "p",
        text: "Site migrations go wrong in a predictable way: someone points the domain at the new server before the new server is ready, and the site is broken in public while they fix it. The whole job is a sequencing problem, and the sequence is not complicated.",
      },
      { type: "h2", id: "stage-first", text: "Build it on the new host before you point anything at it" },
      {
        type: "p",
        text: "Copy the files, import the database, and get the site running on the new server under a temporary hostname while the old one is still serving your visitors. Nothing you do at this stage is visible to anyone. Work through the site properly: log in to the admin, load a page that hits the database, submit a form, complete a test checkout if you sell anything.",
      },
      {
        type: "ul",
        items: [
          "Match the PHP version to what the site currently runs on, then upgrade afterwards — one change at a time",
          "Check file permissions and ownership, the usual cause of a white screen after a copy",
          "Update database credentials in the site config; they will not match the old ones",
          "Take a fresh copy of the database as close to cutover as you can, so you do not lose orders or comments written in between",
        ],
      },
      { type: "h2", id: "ttl", text: "Lower your DNS TTL a day ahead" },
      {
        type: "p",
        text: "TTL is how long resolvers around the world are allowed to cache your DNS record. If it is set to 86400 seconds, some visitors will keep going to the old server for up to 24 hours after you change it. Drop it to 300 seconds at least one full TTL before the migration, and the switch propagates in minutes rather than a day.",
      },
      {
        type: "callout",
        title: "Leave the old host running",
        text: "Do not cancel the old account on cutover day. While DNS propagates, some visitors are still being served by it, and if anything is wrong on the new server it is your rollback. Keep it for a week after the last request arrives.",
      },
      { type: "h2", id: "cutover", text: "Cut over, then verify from outside" },
      {
        type: "ol",
        items: [
          "Put the old site into a read-only state if it accepts orders or comments, so nothing is written to a database you are about to replace",
          "Sync the database one final time",
          "Change the A record — or the nameservers, if you are moving DNS as well",
          "Issue the SSL certificate on the new host once the record resolves there",
          "Test the live domain from a device that has never visited the new server: a phone on mobile data works",
          "Raise the TTL back to something sensible once you are happy",
        ],
      },
      { type: "h2", id: "afterwards", text: "The week after" },
      {
        type: "p",
        text: "Watch the server error log rather than the homepage. Most migration problems surface on a page nobody thought to test — a contact form that cannot send mail because SPF was never updated, a cron job that was set up on the old host and quietly stopped, an image path that was absolute. Check that mail is being delivered and that scheduled tasks are running.",
      },
      {
        type: "p",
        text: "If this sounds like a job you would rather hand over: [migration is free](/migrations) on every Serverlys hosting plan, and we do it in this order — staging first, your approval, then DNS.",
      },
    ],
  },
  {
    slug: "shared-cloud-vps-or-dedicated",
    title: "Shared, cloud, VPS or dedicated: which one do you need?",
    description:
      "A plain comparison of the four hosting types, what each is genuinely for, and the signals that tell you it is time to move up.",
    category: "Hosting",
    published: "2026-09-09",
    body: [
      {
        type: "p",
        text: "[The four categories](/hosting-alternatives) are not four quality tiers. They are four ways of dividing up a physical machine, and each one trades cost against isolation and control. Picking well means being honest about which of those you need.",
      },
      { type: "h2", id: "shared", text: "Shared hosting" },
      {
        type: "p",
        text: "Many sites on one server, sharing its CPU and memory. It is the cheapest option and it is entirely adequate for brochure sites, portfolios, small blogs and most local business websites. The limitation is that you are affected by your neighbours and you cannot install software at the system level.",
      },
      {
        type: "p",
        text: "Choose it when your traffic is modest and predictable and your site is built on something standard.",
      },
      { type: "h2", id: "cloud", text: "Cloud hosting" },
      {
        type: "p",
        text: "Your resources are allocated from a pool rather than pinned to one machine, which means a traffic spike does not immediately become an outage and a hardware failure does not take you offline with it. This is the right default for a site that makes money — an ecommerce store, a booking site, anything where an hour down has a cost.",
      },
      {
        type: "p",
        text: "Choose it when traffic is variable, growing, or when downtime is expensive.",
      },
      { type: "h2", id: "vps", text: "VPS" },
      {
        type: "p",
        text: "A guaranteed slice of a server with root access. You get isolation and you can install whatever you like — a specific Node version, a background worker, a database tuned your way. You are also responsible for it. An unmanaged VPS is a server administration job, not a hosting plan.",
      },
      {
        type: "p",
        text: "Choose it when the application genuinely needs system-level control, and someone is going to maintain it.",
      },
      { type: "h2", id: "dedicated", text: "Dedicated" },
      {
        type: "p",
        text: "The whole physical machine. You take it for sustained heavy load, for compliance requirements that forbid shared tenancy, or for workloads that need consistent I/O. It is the most expensive option and the least elastic — scaling means provisioning another box.",
      },
      { type: "h2", id: "signals", text: "The signals that you have outgrown your plan" },
      {
        type: "ul",
        items: [
          "Response times climb at the same time every day, when your traffic peaks",
          "You are hitting the plan's resource limits often enough that you have started checking",
          "The site slows down during backups or during someone else's activity",
          "You need software the host will not install",
          "An hour of downtime now costs more than a year of the upgrade",
        ],
      },
      {
        type: "p",
        text: "The last one is the honest test. Everything above it is a symptom; that one is the business case. Until an outage costs real money, the cheaper tier is usually the right answer, and upgrading later is prorated anyway.",
      },
      {
        type: "callout",
        title: "Managed is a separate axis",
        text: "Managed and unmanaged is not the same question as shared and dedicated. You can have a managed VPS or an unmanaged one. If nobody in your organisation wants to patch a server at 2am, [choose managed](/managed-hosting) at whichever tier fits the workload.",
      },
    ],
  },
  {
    slug: "core-web-vitals-for-small-sites",
    title: "Core Web Vitals for small sites, without the jargon",
    description:
      "What LCP, INP and CLS measure, the thresholds Google publishes, and the fixes that move them on an ordinary business website.",
    category: "Performance",
    published: "2026-09-09",
    body: [
      {
        type: "p",
        text: "Core Web Vitals are three measurements of how a page feels to the person loading it: how quickly the main content appears, how quickly it responds when they interact, and how much it moves around while it loads. Google publishes a threshold for each, measured at the 75th percentile of real visits. This is the short version; the [full Core Web Vitals guide](/blog/core-web-vitals-guide) walks through every fix in depth.",
      },
      { type: "h2", id: "lcp", text: "LCP — Largest Contentful Paint" },
      {
        type: "p",
        text: "The time until the biggest element in the viewport has rendered. On most business sites that is the hero image or the headline. Good is 2.5 seconds or less.",
      },
      {
        type: "p",
        text: "What usually fixes it, in the order worth trying:",
      },
      {
        type: "ul",
        items: [
          "Serve the hero image in a modern format at the size it is actually displayed — an oversized JPEG is the single most common cause",
          "Stop lazy-loading the hero; it is above the fold, so lazy-loading it delays exactly the thing being measured",
          "Cut render-blocking CSS and fonts in the head",
          "Turn on server-side caching so the HTML is not rebuilt on every request",
        ],
      },
      { type: "h2", id: "inp", text: "INP — Interaction to Next Paint" },
      {
        type: "p",
        text: "How long the page takes to visibly respond after a tap or click, across the whole visit. Good is 200 milliseconds or less. INP replaced First Input Delay in March 2024, and it is stricter: it looks at every interaction, not just the first.",
      },
      {
        type: "p",
        text: "Poor INP is almost always JavaScript. On a typical WordPress site the culprits are a stack of plugins each adding their own scripts, a heavy slider, and third-party tags — chat widgets, analytics, ad and heatmap scripts — competing for the main thread. Audit what you load before you optimise what you wrote.",
      },
      { type: "h2", id: "cls", text: "CLS — Cumulative Layout Shift" },
      {
        type: "p",
        text: "How much the page jumps around as it loads. Good is 0.1 or less. This one is usually cheap to fix and very noticeable to visitors.",
      },
      {
        type: "ul",
        items: [
          "Set width and height on every image so the browser reserves the space",
          "Reserve space for anything injected after load: banners, cookie notices, embedded video",
          "Use font-display: swap with a fallback that is close in metrics, so the swap does not reflow the text",
        ],
      },
      { type: "h2", id: "measuring", text: "Measure the field, not the lab" },
      {
        type: "callout",
        title: "Lab scores and real scores are different numbers",
        text: "A synthetic test runs once, on one connection, from one location. Search Console reports field data from real visits on real devices. When the two disagree, the field data is the one that counts — and it is the one that takes 28 days to reflect your fix.",
      },
      {
        type: "p",
        text: "For a small site, the honest priority order is: get the [hosting response time](/blog/reduce-ttfb) down, then fix the images, then remove the JavaScript you are not using. Those three account for most of the gap on most sites, and none of them require a rebuild.",
      },
    ],
  },
  {
    slug: "what-ai-agents-can-do-for-a-small-business",
    title: "What an AI agent can genuinely do for a small business",
    description:
      "Where AI phone and chat agents work well, where they fail, and how to scope one so it helps rather than annoys.",
    category: "AI",
    published: "2026-09-09",
    body: [
      {
        type: "p",
        text: "An [AI agent](/ai-agents) is worth having when the alternative is nobody answering. That is the whole case, and it is a strong one: a missed call at a trades business or a clinic is usually a lost customer who calls the next name on the list. It is a much weaker case when it replaces a person who was answering well.",
      },
      { type: "h2", id: "works", text: "Where it works" },
      {
        type: "ul",
        items: [
          "Out of hours, weekends and holidays, when the phone would otherwise [ring out](https://callflow.serverlys.com/)",
          "Overflow, when your team is already on another call",
          "Repetitive questions with stable answers — opening times, service areas, what you charge for a standard job, where to park",
          "Qualifying and capturing: name, number, what they need, and when — written into your inbox or CRM before the caller hangs up",
          "Booking into a calendar with real availability",
        ],
      },
      {
        type: "p",
        text: "The common thread is that these are bounded tasks with a defined success condition. The agent is not being asked to be clever; it is being asked to not lose the lead.",
      },
      { type: "h2", id: "fails", text: "Where it fails" },
      {
        type: "ul",
        items: [
          "Complaints and anything emotional — escalate immediately, do not attempt to handle it",
          "Anything with legal, medical or financial consequences if it is wrong",
          "Negotiating price, or quoting on a job with real variables",
          "Situations where the caller has already asked for a human",
        ],
      },
      {
        type: "p",
        text: "Every one of those needs a hand-off path that works, and a caller who says 'let me speak to someone' should get to someone without repeating themselves.",
      },
      { type: "h2", id: "scoping", text: "How to scope one so it helps" },
      {
        type: "ol",
        items: [
          "Write down the ten questions you are actually asked most often. Not the ones you wish people asked — pull them from your call log or inbox.",
          "Decide what a successful call looks like. Usually it is a captured lead or a booked appointment, not a long conversation.",
          "Define the escalation rule explicitly, and test it by trying to break it.",
          "Give it your real information — hours, service area, prices you are willing to state. An agent that says 'I'll have someone get back to you' to everything is a worse voicemail.",
          "Listen to the first fifty calls. You will find gaps you did not predict, and they are cheap to fix.",
        ],
      },
      {
        type: "callout",
        title: "Tell people what they are talking to",
        text: "Agents that pretend to be human erode trust the moment the caller works it out, and disclosure requirements are tightening in several jurisdictions. Saying so in the first sentence costs nothing and settles the caller.",
      },
      {
        type: "p",
        text: "Scoped this way, the measurable result is not 'AI transformation'. It is that calls outside business hours turn into leads on Monday morning instead of into nothing. That is a small claim, and it is one you can check.",
      },
    ],
  },
];
