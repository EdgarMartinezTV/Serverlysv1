/**
 * Three articles published 2026-11-12, written for owners who are not yet
 * convinced they need to invest online. Each targets one broad query cluster:
 *
 *   · why-your-business-needs-a-website
 *                         "why does a business need a website", "importance of a
 *                         website for small business", "benefits of a business
 *                         website", "do I need a website if I have social media"
 *                         — supports /website-design and /hosting
 *   · how-to-build-a-strong-online-presence
 *                         "online presence", "how to improve online presence",
 *                         "online presence management", "digital presence for
 *                         small business" — supports /seo, /social-media,
 *                         /site-management
 *   · how-ai-is-helping-small-businesses
 *                         "how AI is helping small businesses", "AI for small
 *                         business", "AI customer service", "AI chatbot for
 *                         website" — supports /ai-agents. Deliberately a
 *                         use-case piece, not a tool list: the tool list is
 *                         legacy/ai-tools-small-business, and this links to it.
 *
 * Same editorial rules as original.ts: no invented statistics, customer
 * counts, case studies or quotes. Serverlys facts come from data/pricing.ts and
 * data/ai-agent-plans.ts (ConvoAI Essentials is included with every hosting
 * plan). No cover photo yet: they fall back to the category thumbnail, and any
 * cover added later must be a real photo or real product screen, not AI art.
 */
import type { Article } from "./types";

export const batch20261112: readonly Article[] = [
  {
    slug: "why-your-business-needs-a-website",
    title: "Why does a business need a website? 10 reasons that still matter in 2026",
    seoTitle: "Why your business needs a website: 10 reasons (2026)",
    description:
      "Social media, marketplaces and AI search have not replaced the business website. Here are ten practical reasons every small business needs its own site, and what a good one includes.",
    category: "Getting started",
    published: "2026-11-12",
    body: [
      {
        type: "p",
        text: "Plenty of businesses get by for years on word of mouth, a social media page and a listing on Google Maps. So it is a fair question: in 2026, does a small business still need a website of its own? The short answer is yes, and the reasons have less to do with looking modern than with owning the place where customers decide whether to trust you.",
      },
      {
        type: "p",
        text: "This guide covers the ten reasons a business website matters, the question every owner asks about social media, and what a small business website actually needs to include to do its job.",
      },
      { type: "h2", id: "ten-reasons", text: "10 reasons your business needs a website" },
      { type: "h3", text: "1. Customers check before they call" },
      {
        type: "p",
        text: "Whether someone heard about you from a friend, a flyer or a sign on a van, the next step is almost always a search. If nothing comes up, or only a half-finished social profile does, many people simply move on to a business that looks established. A website is the proof that you are real, open and still trading.",
      },
      { type: "h3", text: "2. It works while you are closed" },
      {
        type: "p",
        text: "Your website never closes. At ten at night it can still show your prices, take a booking request, sell a product or answer a question. For a small team, that is the closest thing to a second shift that costs nothing extra per hour.",
      },
      { type: "h3", text: "3. You own it, and nobody can switch it off" },
      {
        type: "p",
        text: "A social media page lives on rented land. The platform decides who sees your posts, can change its rules overnight, and can suspend an account with little warning. A website on your own [domain name](/domain-name) is an asset the business controls. Make sure the business, not a former freelancer, owns that domain: our guide on [keeping control of your domain](/blog/keep-control-of-your-domain) shows how.",
      },
      { type: "h3", text: "4. It is how you get found on Google" },
      {
        type: "p",
        text: "Search engines rank web pages. A website with a page for each service you offer and each area you serve gives Google something to match against what people type, such as \"emergency plumber near me\" or \"wedding cake delivery\". Without one, you rely entirely on your map listing. If your site exists but does not appear, see [why a website is not showing on Google](/blog/website-not-showing-on-google).",
      },
      { type: "h3", text: "5. AI assistants read websites too" },
      {
        type: "p",
        text: "More people now ask ChatGPT, Google's AI answers or other assistants to recommend a business. Those tools build their answers from what they can read on the open web, and a clear website with your services, location and prices is one of the main things they read. We explain how to make that work for you in [how to get recommended by ChatGPT and AI search](/blog/get-recommended-by-chatgpt-and-ai-search).",
      },
      { type: "h3", text: "6. It answers the same questions so you do not have to" },
      {
        type: "p",
        text: "Opening hours, service areas, prices, how to book, what to bring, whether you take card payments: a good website answers these once, for everyone. Every question your site answers is a phone call or message your team does not need to stop for.",
      },
      { type: "h3", text: "7. It turns visitors into leads and sales" },
      {
        type: "p",
        text: "A contact form, a booking calendar, a quote request or an online store turns interest into something you can act on. Social posts create attention; a website is where that attention becomes a name, a phone number or an order.",
      },
      { type: "h3", text: "8. Professional email comes with it" },
      {
        type: "p",
        text: "An address like `hello@yourbusiness.com` looks more trustworthy than a free webmail address, and it stays with the business when staff change. It runs on the same domain as your website. Our guide to [setting up business email](/blog/setup-business-email) covers the steps, and Serverlys offers [business email](/business-email) alongside hosting.",
      },
      { type: "h3", text: "9. It makes every other channel work better" },
      {
        type: "p",
        text: "Ads, social posts, printed menus, business cards and online reviews all need somewhere to send people. Pointing them at a website you control means you can measure what works with [Google Analytics](/blog/google-analytics-4-guide) and change the message without reprinting anything.",
      },
      { type: "h3", text: "10. It costs less than most owners expect" },
      {
        type: "p",
        text: "A professional small business website no longer needs a large budget. Hosting at Serverlys starts at $7.95 a month, and a simple site can be built in days. Our [website cost guide](/blog/website-cost-guide) breaks down what you pay for, and [domain vs hosting](/blog/domain-vs-hosting) explains the two pieces every site needs.",
      },
      { type: "h2", id: "social-media-only", text: "Do I need a website if I already have social media?" },
      {
        type: "p",
        text: "Social media is excellent for staying visible and showing personality. It is a poor replacement for a website, for three reasons:",
      },
      {
        type: "table",
        head: ["", "Social media page", "Your own website"],
        rows: [
          ["Who controls it", "The platform", "Your business"],
          ["Shows up in Google searches for your services", "Rarely", "Yes, page by page"],
          ["Read by AI assistants", "Often limited by login walls", "Yes, if it is public and crawlable"],
          ["Bookings, quotes and online sales", "Basic, platform-dependent", "Fully under your control"],
          ["Reaches everyone, not only followers", "No, the feed decides", "Yes"],
        ],
      },
      {
        type: "p",
        text: "The strongest setup uses both: social media to start conversations, and a website to finish them. If you want help with the first half, see our [social media management](/social-media) service.",
      },
      { type: "h2", id: "what-to-include", text: "What a small business website needs to include" },
      {
        type: "p",
        text: "A website does not need dozens of pages to be effective. It needs to answer a visitor's questions quickly and make the next step obvious:",
      },
      {
        type: "ul",
        items: [
          "**A clear headline** that says what you do and where, in plain words.",
          "**One page per main service**, with prices or a starting price where you can share them.",
          "**Contact details on every page**: phone, email, address or service area, and hours.",
          "**One clear call to action**: call, book, request a quote or buy.",
          "**Proof**: photos of real work, your team and your premises, plus links to genuine reviews.",
          "**A fast, mobile-friendly design.** Most visitors arrive on a phone. See [Core Web Vitals for small sites](/blog/core-web-vitals-for-small-sites).",
          "**HTTPS security**, so browsers do not show a \"Not secure\" warning.",
          "**Accessibility basics**, so everyone can use it. Our [accessibility checklist](/blog/website-accessibility-checklist) covers them.",
        ],
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "Is a website still worth it for a small local business?" },
      {
        type: "p",
        text: "Yes. Local customers search before they visit, and a website supports your Google Business Profile with the detail a listing cannot hold: full service descriptions, prices, photos and booking. Our [local SEO guide](/blog/local-seo-guide) shows how the two work together.",
      },
      { type: "h3", text: "How long does it take to build a business website?" },
      {
        type: "p",
        text: "A simple brochure site with a handful of pages can go live in days once the text and photos are ready. Content is usually the slowest part, so start writing your service descriptions first.",
      },
      { type: "h3", text: "Can I build it myself?" },
      {
        type: "p",
        text: "Yes, with WordPress or a site builder, if you have the time. If you would rather focus on running the business, a [professional website design](/website-design) service builds it for you and hands over a site you own.",
      },
      {
        type: "callout",
        title: "The short version",
        text: "A website is the one online presence your business fully owns. It gets you found on Google and AI search, answers customers around the clock, and makes every other channel work harder. Start small, keep it accurate, and make the next step obvious.",
      },
      { type: "h2", id: "serverlys", text: "Get your business online with Serverlys" },
      {
        type: "p",
        text: "Serverlys [web hosting](/hosting) includes free SSL, daily backups, free migration and a 30-day money-back guarantee, and every plan renews at the price you signed up at. Every hosting plan also includes ConvoAI Essentials, an [AI agent](/ai-agents) that answers visitors in your website's chat window. Prefer to have it built for you? Our [website design](/website-design) team can take it from idea to live site. Compare plans on the [pricing page](/pricing).",
      },
    ],
  },
  {
    slug: "how-to-build-a-strong-online-presence",
    title: "How to build and keep a strong online presence for your business",
    seoTitle: "How to build a strong online presence for your business",
    description:
      "A practical guide to online presence for small businesses: the channels that matter, how to keep your details consistent, how to handle reviews, and a monthly routine that keeps you visible.",
    category: "Getting started",
    published: "2026-11-12",
    body: [
      {
        type: "p",
        text: "Your online presence is everything a customer finds when they look you up: your website, your Google Business Profile, your reviews, your social media, your listings in directories and, increasingly, what AI assistants say about you. A strong online presence makes your business easy to find, easy to trust and easy to contact.",
      },
      {
        type: "p",
        text: "The hard part is not setting it up. It is keeping it accurate month after month, so that the opening hours on Google match the website, the old phone number is gone from every directory, and new reviews get an answer. This guide covers both.",
      },
      { type: "h2", id: "what-is-online-presence", text: "What \"online presence\" actually means" },
      {
        type: "p",
        text: "Think of it as layers, with the ones you own at the centre:",
      },
      {
        type: "table",
        head: ["Layer", "Examples", "Who controls it"],
        rows: [
          ["Owned", "Your website, your domain, your business email, your newsletter list", "You"],
          ["Listings", "Google Business Profile, Apple Maps, Bing Places, industry directories", "You, on someone else's platform"],
          ["Social", "Instagram, Facebook, TikTok, LinkedIn, YouTube", "You, under the platform's rules"],
          ["Earned", "Customer reviews, press mentions, links from other websites, AI answers", "Other people"],
        ],
      },
      {
        type: "p",
        text: "Build from the centre outwards. Everything on the outer layers should point back to the website, because it is the one place you control completely.",
      },
      { type: "h2", id: "foundations", text: "Step 1: Get the foundations right" },
      { type: "h3", text: "A website on your own domain" },
      {
        type: "p",
        text: "Your website is the hub of your online presence. It should state clearly what you do, where you do it and how to get in touch, load quickly on a phone and use HTTPS. If you do not have one yet, start with [why your business needs a website](/blog/why-your-business-needs-a-website).",
      },
      { type: "h3", text: "A complete Google Business Profile" },
      {
        type: "p",
        text: "For any business that serves a local area, the Google Business Profile is often the first thing customers see. Fill in every field: categories, services, hours, holiday hours, photos, and a link to your website. Our [local SEO guide](/blog/local-seo-guide) walks through it.",
      },
      { type: "h3", text: "Consistent business details everywhere" },
      {
        type: "p",
        text: "Your business name, address and phone number (often shortened to NAP) should read exactly the same on your website, your Google profile and every directory. Search engines compare these listings, and mismatches, such as an old address or a different phone number, make it harder for them to be sure they belong to the same business. Keep one master copy of your details in a document and paste from it every time.",
      },
      { type: "h2", id: "content", text: "Step 2: Publish content that answers real questions" },
      {
        type: "p",
        text: "The simplest content strategy for a small business is to write down the answers to the questions customers already ask you. Each one can become a page, a blog post or a social post:",
      },
      {
        type: "ul",
        items: [
          "**How much does it cost?** A pricing page or a guide to what affects the price.",
          "**How does it work?** A step-by-step explanation of your process.",
          "**Is this right for me?** Comparisons between your options, written honestly.",
          "**What should I do before or after?** Preparation and aftercare guides.",
        ],
      },
      {
        type: "p",
        text: "Pages like these help you rank on Google for the questions people actually type, and they are exactly the kind of clear, factual content that AI assistants use when they recommend a business. See [how to get recommended by ChatGPT and AI search](/blog/get-recommended-by-chatgpt-and-ai-search). If you serve customers in more than one language, a [bilingual website](/blog/bilingual-website-english-spanish) widens your reach further.",
      },
      { type: "h2", id: "reviews", text: "Step 3: Earn and answer reviews" },
      {
        type: "p",
        text: "Reviews are the part of your online reputation you cannot write yourself, which is exactly why customers trust them. To earn more of them:",
      },
      {
        type: "ol",
        items: [
          "**Ask at the right moment**: just after a job is finished or an order arrives, when the customer is happiest.",
          "**Make it one tap**: send a direct link to your review page by text or email.",
          "**Reply to every review**, good or bad, politely and within a few days. Future customers read your replies as much as the reviews.",
          "**Fix what bad reviews point to.** A complaint that repeats is free feedback about your business.",
        ],
      },
      {
        type: "callout",
        title: "Never buy or fake reviews",
        text: "Buying reviews, writing your own, or offering rewards only for positive ones breaks the rules of Google and most review platforms, and can get your profile restricted. Consumer protection rules in many countries also prohibit fake reviews. Earn them honestly.",
      },
      { type: "h2", id: "social", text: "Step 4: Choose your social channels carefully" },
      {
        type: "p",
        text: "You do not need to be on every platform. Pick the one or two where your customers already spend time, and show up consistently. A café and a florist will do well on visual platforms; a B2B service may get more from LinkedIn. Post real photos of your work, your team and your customers (with permission), and always link back to your website. If you do not have the time, a [social media management](/social-media) service can run it for you.",
      },
      { type: "h2", id: "keep-it-healthy", text: "Step 5: Keep your online presence healthy" },
      {
        type: "p",
        text: "An online presence decays quietly. Plugins go out of date, an old price stays on a page, a directory still lists last year's address, and a security certificate expires. Prevent that with a routine:",
      },
      {
        type: "table",
        head: ["How often", "What to check"],
        rows: [
          ["Weekly", "Reply to new reviews and messages; post on your main social channel"],
          ["Monthly", "Update your website, plugins and theme; check that forms and booking still work; review Google Business Profile insights"],
          ["Quarterly", "Search for your business name and read what comes up, including AI answers; fix any wrong details in directories; refresh prices and photos"],
          ["Yearly", "Check domain and hosting renewal dates; review who has access to your accounts; restore a backup on purpose to prove it works"],
        ],
      },
      {
        type: "p",
        text: "Our [WordPress maintenance routine](/blog/wordpress-maintenance-routine), [website security checklist](/blog/website-security-checklist) and guide to [who has access to your website](/blog/who-has-access-to-your-website) cover the technical side in detail. If you would rather hand it over, [site management](/site-management) does it for you.",
      },
      { type: "h2", id: "measure", text: "Step 6: Measure what is working" },
      {
        type: "p",
        text: "Without numbers it is hard to tell which effort is paying off. Three free tools cover most of what a small business needs:",
      },
      {
        type: "ul",
        items: [
          "**Google Analytics** shows how many people visit your site, where they come from and what they do. See our [GA4 guide](/blog/google-analytics-4-guide).",
          "**Google Search Console** shows which searches bring people to your site and flags pages Google cannot index.",
          "**Google Business Profile insights** show how many people called, asked for directions or clicked through to your site from your listing.",
        ],
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "How long does it take to build an online presence?" },
      {
        type: "p",
        text: "The foundations, meaning a website, a Google Business Profile and consistent listings, can be in place within a few weeks. Ranking well in search and building up reviews takes months of steady work, which is why consistency matters more than any single big push.",
      },
      { type: "h3", text: "Can I build an online presence for free?" },
      {
        type: "p",
        text: "Google Business Profile, social media accounts and most directory listings are free. A website on your own domain has a small running cost, but it is the only part you fully own, and the part that makes all the free channels more effective.",
      },
      { type: "h3", text: "What is online presence management?" },
      {
        type: "p",
        text: "It is the ongoing work of keeping your information accurate, publishing new content, responding to reviews and monitoring what is said about your business across the web. Some owners do it themselves with a routine like the one above; others hire a service.",
      },
      {
        type: "callout",
        title: "The short version",
        text: "Build from the centre: your own website and domain first, then a complete Google Business Profile, consistent listings, honest reviews and one or two social channels. Then keep it all accurate with a simple weekly, monthly and yearly routine.",
      },
      { type: "h2", id: "serverlys", text: "How Serverlys can help" },
      {
        type: "p",
        text: "Serverlys gives you the owned centre of your online presence in one place: [domain names](/domain-name), [web hosting](/hosting) with free SSL and daily backups, [business email](/business-email), and an [AI agent](/ai-agents) included with every hosting plan to answer visitors in your website's chat. When you want more reach, our [SEO](/seo), [social media](/social-media) and [website design](/website-design) services can do the work with you. See plans on the [pricing page](/pricing).",
      },
    ],
  },
  {
    slug: "how-ai-is-helping-small-businesses",
    title: "How AI is helping small businesses in 2026: real uses, not hype",
    seoTitle: "How AI is helping small businesses in 2026",
    description:
      "Where AI genuinely helps a small business today, from customer service and lead capture to marketing and admin, where it still needs a human, and how to start without wasting money.",
    category: "AI",
    published: "2026-11-12",
    body: [
      {
        type: "p",
        text: "A few years ago, AI for small business mostly meant a clumsy chatbot that answered every question with a link to the FAQ page. That has changed. Today's AI can read your website, understand a customer's question in plain language and give a useful answer, draft a week of social posts in minutes, or turn a messy inbox into a list of leads.",
      },
      {
        type: "p",
        text: "It is also surrounded by hype. This guide focuses on how AI is actually helping small businesses right now, where it still needs a person, and how to start in a way that saves time instead of creating new work. If you are looking for specific products, our companion piece on [AI tools for small business websites](/blog/ai-tools-small-business) lists them.",
      },
      { type: "h2", id: "customer-service", text: "1. Answering customers, day and night" },
      {
        type: "p",
        text: "Customer service is where AI helps small businesses most visibly. An AI agent on your website can answer questions about prices, opening hours, services and policies the moment they are asked, including evenings and weekends when nobody is at the desk.",
      },
      {
        type: "p",
        text: "The quality of those answers depends on what the AI is given. A good AI agent answers from your own information, says so when it does not know, and hands the conversation to a person when it should. That last part matters: customers accept an AI assistant much more readily when a human is one step away. Our guide on [writing the answers your AI assistant gives](/blog/write-the-answers-your-ai-assistant-gives) explains how to prepare that information.",
      },
      {
        type: "ul",
        items: [
          "**Website chat**: answers visitors while they are deciding, which is when a fast reply matters most.",
          "**Messaging and email**: drafts or sends replies to common questions on WhatsApp, email and social inboxes.",
          "**Phone**: an [AI receptionist](/blog/ai-receptionist-for-small-business) can answer calls, take messages and book appointments.",
        ],
      },
      { type: "h2", id: "leads", text: "2. Capturing and qualifying leads" },
      {
        type: "p",
        text: "Many small businesses lose leads not because nobody is interested, but because nobody replied fast enough. AI closes that gap. It can greet a visitor, ask what they need, collect a name and phone number, and pass a summary to your team, so the person who calls back already knows the job.",
      },
      {
        type: "p",
        text: "Connected to a calendar, the same assistant can offer available appointment times and book them directly, which turns a late-night website visit into a confirmed booking by morning.",
      },
      { type: "h2", id: "marketing", text: "3. Marketing and content" },
      {
        type: "p",
        text: "AI writing tools are now a practical way for a small team to keep up with marketing. Used well, they help with:",
      },
      {
        type: "ul",
        items: [
          "**First drafts** of blog posts, service pages, product descriptions and emails.",
          "**Social media posts** adapted from one idea into several formats and platforms.",
          "**Translations** that let you serve customers in a second language, reviewed by someone fluent.",
          "**Ideas**: lists of the questions customers are likely to ask, to turn into content.",
        ],
      },
      {
        type: "callout",
        title: "Edit everything before it goes live",
        text: "AI drafts can sound generic and can state things that are not true. Always add your own experience, check every fact, price and claim, and make sure it sounds like your business. Search engines reward content that is genuinely helpful, not content that is merely produced quickly.",
      },
      { type: "h2", id: "ai-search", text: "4. Getting found in AI search" },
      {
        type: "p",
        text: "AI is not only a tool you use; it is also a new way customers find you. People increasingly ask AI assistants to recommend a business, and those assistants answer from what they can read on the open web. A clear website with your services, prices and location makes you easier to recommend. We cover this in [how to get recommended by ChatGPT and AI search](/blog/get-recommended-by-chatgpt-and-ai-search), and for online stores in [how to get your products into ChatGPT Shopping](/blog/get-your-products-into-chatgpt-shopping).",
      },
      { type: "h2", id: "admin", text: "5. Saving time on admin" },
      {
        type: "p",
        text: "Much of the time AI saves is invisible to customers. Small businesses use it to:",
      },
      {
        type: "ul",
        items: [
          "Summarise long email threads and meeting notes.",
          "Draft quotes, proposals and polite payment reminders.",
          "Sort incoming messages by urgency and topic.",
          "Pull figures out of documents and spreadsheets.",
          "Connect apps so that a new lead, order or booking updates everything else automatically. See our [business automations](/automations) service.",
        ],
      },
      { type: "h2", id: "limits", text: "Where AI still needs a human" },
      {
        type: "p",
        text: "AI is a capable assistant, not a replacement for judgement. Keep a person in charge of:",
      },
      {
        type: "table",
        head: ["Task", "Let AI", "Keep a human for"],
        rows: [
          ["Customer questions", "Answer common questions from your own information", "Complaints, refunds, sensitive or unusual cases"],
          ["Sales", "Collect details and book appointments", "Negotiating, custom quotes, relationships"],
          ["Content", "Draft, summarise and translate", "Facts, tone, final approval"],
          ["Decisions", "Organise information and suggest options", "Anything legal, financial or medical"],
        ],
      },
      {
        type: "p",
        text: "Be open with customers about it, too. Tell them when they are chatting with an AI assistant, and do not let it make promises your team would not make. Treat customer data with care: check where a tool stores conversations and do not paste private customer information into tools that do not need it.",
      },
      { type: "h2", id: "get-started", text: "How to start using AI in your business" },
      {
        type: "ol",
        items: [
          "**Pick one problem.** The questions you answer ten times a day, or the leads that arrive after hours, are good places to start.",
          "**Write down your information.** Prices, services, policies and common answers. AI is only as accurate as what you give it.",
          "**Start with one tool** and give it a few weeks before adding another.",
          "**Read the conversations.** Review what the AI said each week and correct the information behind any wrong answer.",
          "**Measure the result**: replies sent after hours, leads captured, time saved. Keep what helps, drop what does not.",
        ],
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "Is AI affordable for a small business?" },
      {
        type: "p",
        text: "Yes. Many AI tools have free tiers or low monthly plans, and some come included with services you already pay for. At Serverlys, ConvoAI Essentials, an AI agent for your website's chat, is included with every hosting plan.",
      },
      { type: "h3", text: "Will AI replace my staff?" },
      {
        type: "p",
        text: "For most small businesses, AI takes over repetitive tasks so the team can spend more time on the work that needs people: serving customers in person, solving problems and building relationships.",
      },
      { type: "h3", text: "Do I need technical skills to use AI?" },
      {
        type: "p",
        text: "No. Most business AI tools are set up by answering questions about your business and connecting your website. The most important skill is knowing your own business well enough to give the AI accurate information.",
      },
      {
        type: "callout",
        title: "The short version",
        text: "AI helps small businesses most with customer service, lead capture, marketing drafts, AI search visibility and admin. It works best when it answers from your own accurate information, hands off to a human when needed, and is reviewed regularly. Start with one problem and one tool.",
      },
      { type: "h2", id: "serverlys", text: "Try AI on your own website with Serverlys" },
      {
        type: "p",
        text: "Every Serverlys [hosting plan](/hosting) includes ConvoAI Essentials: an [AI agent](/ai-agents) in your website's chat that answers visitors from your information, captures contacts in a built-in CRM and hands the conversation to you instantly when a person is needed. When your business runs on conversations, ConvoAI Pro adds unlimited replies, WhatsApp and email channels, appointment booking and automation workflows. To see it in action, read [how ConvoAI answers every website visitor](/blog/answer-every-website-visitor-with-convoai).",
      },
    ],
  },
];
