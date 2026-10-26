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
    slug: "wordpress-7-1-3-update-and-wordpress-7-2",
    title: "WordPress 7.1.3 is out: update now, then get ready for 7.2",
    description:
      "WordPress 7.1.3 fixes seven security issues. How to check your site took it, and what to test before WordPress 7.2 lands on December 8.",
    category: "WordPress",
    published: "2026-10-15",
    body: [
      {
        type: "p",
        text: "On October 6, WordPress released version 7.1.3, a maintenance and security release with **seven security fixes and four bug fixes**. The WordPress team's advice in the [release announcement](https://wordpress.org/news/2026/10/wordpress-7-1-3-maintenance-and-security-release/) is short: update your sites immediately. It was the third security release in about a month, after 7.1.1 and 7.1.2.",
      },
      {
        type: "p",
        text: "At the same time, WordPress 7.2, the last major release planned for 2026, is about to enter beta. This guide covers both: how to make sure the security update actually reached your site, and what to check before 7.2 arrives so the upgrade is uneventful.",
      },
      { type: "h2", id: "whats-fixed", text: "What WordPress 7.1.3 fixes" },
      {
        type: "p",
        text: "The release notes list seven security issues, reported by independent researchers, security firms and the WordPress security team itself:",
      },
      {
        type: "ul",
        items: [
          "**Stored cross-site scripting (XSS) on the Comments admin screen**, which could be triggered through a pending comment.",
          "**A second-order SQL injection** in the WordPress export (WXR) feature.",
          "**Disclosure of comments on private and unpublished posts** to visitors who were not logged in.",
          "**XSS in Imgur embeds.**",
          "**A denial-of-service issue** in the function WordPress uses to turn relative links into full URLs.",
          "**Users with the Author role could make posts sticky**, which should be an Editor's decision.",
          "**Forgeable hook parameters** that could cause one action to be mistaken for another.",
        ],
      },
      {
        type: "p",
        text: "None of these needs a dramatic response, but the first three are the kind attackers look for: a comment form is open to the whole internet, and private posts are private for a reason. The fix is to be on 7.1.3, nothing more.",
      },
      {
        type: "callout",
        title: "On an older major version?",
        text: "WordPress is backporting these fixes to every older branch that still receives security updates, currently back to 4.7, and says those backports will ship as they are ready. Only the latest version is actively supported, though. If your site is stuck on an old major version because a plugin or theme breaks on newer ones, that is the problem to solve, not something to live with.",
      },
      { type: "h2", id: "check-your-site", text: "How to check your site is updated" },
      {
        type: "p",
        text: "Most WordPress sites install minor security releases automatically in the background. Most is not all. Hosts, security plugins and a single line in `wp-config.php` can switch automatic updates off, so check rather than assume:",
      },
      {
        type: "ol",
        items: [
          "Log in to your dashboard and open **Dashboard → Updates**. The top of the page tells you which version you are running. If it says anything below 7.1.3, click **Update Now**.",
          "Look for `AUTOMATIC_UPDATER_DISABLED` or `WP_AUTO_UPDATE_CORE` set to `false` in `wp-config.php`. Either one stops security releases installing on their own.",
          "If you look after several sites, the WP-CLI command `wp core version` answers the question in seconds, and `wp core update` applies the update.",
          "**Take a backup first** if your site has not been backed up in the last day. A minor release rarely breaks anything, but a backup makes rarely a non-event. Our [backup tutorial](/blog/website-backup-tutorial) covers the options.",
        ],
      },
      {
        type: "p",
        text: "Updating WordPress itself is half the job. Most WordPress compromises start with an out-of-date **plugin**, not core. While you are on the Updates screen, update plugins and themes too, and delete any you no longer use. Our [WordPress security guide](/blog/wordpress-security-guide) covers the rest of the list.",
      },
      { type: "h2", id: "wordpress-7-2", text: "WordPress 7.2: the dates" },
      {
        type: "p",
        text: "According to the [WordPress developer blog](https://developer.wordpress.org/news/2026/10/whats-new-for-developers-october-2026/), the 7.2 release runs to this schedule:",
      },
      {
        type: "table",
        head: ["Milestone", "Date", "What it means for you"],
        rows: [
          ["Beta 1", "October 20, 2026", "Test your plugins and theme on a copy of your site"],
          ["Release candidate 1", "November 17, 2026", "Features are frozen; last chance to report breakage"],
          ["Final release", "December 8, 2026", "Update your live site once your staging copy passes"],
        ],
      },
      { type: "h2", id: "whats-coming", text: "What is coming in WordPress 7.2" },
      {
        type: "p",
        text: "A roadmap is a plan, not a promise, and the WordPress team says plainly that not every item will make the final release. These are the changes that matter most to site owners:",
      },
      {
        type: "ul",
        items: [
          "**A new default theme, Ipsum.** It is also the end of year-named default themes. Future defaults will be named, so they can change when the design needs it rather than every year.",
          "**Safer Application Passwords** (planned): an email when a new one is added to your account and detection of non-HTTPS use. Application Passwords let apps and services log in to your site, so being told when one appears is a real security gain.",
          "**Editor additions**, including text shadow as a block style, a grid variation of the Gallery block with columns per screen size, and redrawn icons.",
          "**A Secrets API** (tentative), available only through WP-CLI in 7.2, with an interface planned later.",
        ],
      },
      {
        type: "p",
        text: "Two changes under the hood are worth knowing about if you have a developer, because they are the most likely to surprise an older site:",
      },
      {
        type: "ul",
        items: [
          "**`NO_BACKSLASH_ESCAPES` is off by default.** This is a database setting. Sites that depend on it can turn it back on with a `db.php` drop-in, not a plugin.",
          "**`wp_kses()` is being rebuilt on the HTML API** (targeting 7.2 or 7.3). This is the function that cleans HTML in posts and comments. The new version normalises output and rejects some malformed markup, and a `wp_kses_force_legacy_parser` filter restores the old behaviour while code is updated.",
        ],
      },
      {
        type: "p",
        text: "Themes that style the Gallery block or WordPress's built-in icons with custom CSS should be checked too, because both are changing shape.",
      },
      { type: "h2", id: "test-safely", text: "How to test 7.2 without risking your live site" },
      {
        type: "p",
        text: "Never run a beta on the site that takes your bookings or orders. Make a copy and test there:",
      },
      {
        type: "ol",
        items: [
          "**Create a staging site**, an exact private copy of your live one. Our guide to [setting up a WordPress staging site](/blog/wordpress-staging-site) walks through it.",
          "Install the **WordPress Beta Tester** plugin on the staging copy and choose the beta or release candidate channel.",
          "Click through the pages that earn you money: the home page, a service or product page, the contact form, the basket and checkout if you sell online.",
          "Open the editor and change something. Editor changes are where 7.2 is busiest, so check the blocks you actually use.",
          "If something breaks, tell the plugin or theme author with the version and steps. During the beta there is still time for them, or WordPress, to fix it.",
        ],
      },
      {
        type: "quote",
        text: "The WordPress sites that break on update day are the ones nobody looked at during the beta.",
      },
      { type: "h2", id: "how-we-help", text: "Where Serverlys can help" },
      {
        type: "p",
        text: "If you would rather not track release schedules at all, this is what our WordPress plans are built around:",
      },
      {
        type: "table",
        head: ["If you need…", "Start with", "From"],
        rows: [
          [
            "Hosting where WordPress updates, daily backups and free SSL are handled for you",
            "[WordPress hosting](/wordpress-hosting)",
            "$7.95/mo, renews at $12.62/mo",
          ],
          [
            "Someone to apply WordPress, plugin and theme updates for you every month, with daily backups and uptime alerts",
            "[ServerCare Essential](/site-management)",
            "$149.95/mo",
          ],
          [
            "A site stuck on an old version moved to a current, supported setup",
            "[Free migration](/migrations)",
            "Free with hosting",
          ],
        ],
      },
      {
        type: "callout",
        title: "The short version",
        text: "Check you are on WordPress 7.1.3 today. Update plugins while you are there. Then, between October 20 and November 17, try WordPress 7.2 on a staging copy so that December 8 is a non-event.",
      },
    ],
  },
  {
    slug: "get-your-products-into-chatgpt-shopping",
    title: "How to get your products into ChatGPT Shopping",
    description:
      "Shoppers now ask ChatGPT what to buy, and it links to the stores that sell it. How ChatGPT Shopping works and what your store needs to show up.",
    category: "Ecommerce",
    published: "2026-10-15",
    body: [
      {
        type: "p",
        text: 'Ask ChatGPT "what is a good waterproof hiking boot under $150?" and it no longer just describes boots. It shows products, with images, prices and the shops that sell them, and links you to buy. Google does the same in AI Mode, and Perplexity and Microsoft Copilot have their own versions. The industry has a name for it, **agentic commerce**, and a small store owner has a simpler question: how do my products get into those answers?',
      },
      {
        type: "p",
        text: "The good news is that the route in is mostly the work a well-run store should already be doing. This guide sticks to what OpenAI and the platforms have published, because this is a fast-moving area full of confident vendor claims.",
      },
      { type: "h2", id: "how-it-works", text: "How ChatGPT finds the products it shows" },
      {
        type: "p",
        text: "ChatGPT gets product information in two ways, and a store can use either or both:",
      },
      {
        type: "ol",
        items: [
          "**By reading your website.** ChatGPT search uses OpenAI's crawler, `OAI-SearchBot`, to read public pages. If your product pages are readable, they can be found and cited, like any other page.",
          "**From a product feed.** OpenAI publishes a [commerce specification](https://developers.openai.com/commerce/guides/key-concepts) for merchants to send a structured, regularly refreshed feed (CSV or JSON) with identifiers, descriptions, prices, stock levels, images and delivery options. Its documentation says the required fields are what make price and availability display correctly, and that extras like reviews and rich media improve ranking and relevance.",
        ],
      },
      {
        type: "p",
        text: "If you sell on **Shopify**, OpenAI's help centre says your product data already reaches ChatGPT through the Shopify Catalog, with no extra work for individual merchants. Everyone else, including stores on WooCommerce, relies on the crawler or applies to OpenAI for direct feed access.",
      },
      {
        type: "callout",
        title: "What happened to buying inside ChatGPT?",
        text: "OpenAI launched Instant Checkout in 2025 so shoppers could pay without leaving the chat. In March 2026 it changed course, saying it would let merchants use their own checkout while it concentrates on product discovery. For most stores, that means a ChatGPT shopper now arrives on your own product page to pay, so your site, not the chat, closes the sale.",
      },
      { type: "h2", id: "checklist", text: "The checklist for a small online store" },
      { type: "h3", text: "1. Let the AI crawlers in" },
      {
        type: "p",
        text: "Open `yourstore.com/robots.txt`. If `OAI-SearchBot` is blocked, or everything is blocked under `User-agent: *`, ChatGPT search cannot read your shop. Security plugins and CDN \"bot protection\" settings sometimes block AI crawlers without asking. `GPTBot`, OpenAI's training crawler, is separate, so you can allow search and refuse training. Our post on [getting recommended by ChatGPT](/blog/get-recommended-by-chatgpt-and-ai-search) explains the difference.",
      },
      { type: "h3", text: "2. Make every product page answer the obvious questions" },
      {
        type: "p",
        text: "An assistant matching a product to a question needs facts it can read as text: what it is, what it is made of, sizes, compatibility, price, delivery time and return policy. A product page that is a photo and a \"Buy now\" button gives it nothing to work with. Write the descriptions as if a careful shopper asked you the questions in person, because that is roughly what is happening.",
      },
      { type: "h3", text: "3. Add product structured data" },
      {
        type: "p",
        text: "Schema.org `Product` markup states the name, price, currency, availability, brand and reviews in a format machines cannot misread. WooCommerce outputs basic product markup by default, and SEO plugins extend it. Check a product page with Google's Rich Results Test and fix anything it flags. It also powers rich results in ordinary Google search, so it pays twice.",
      },
      { type: "h3", text: "4. Keep price and stock accurate" },
      {
        type: "p",
        text: "If ChatGPT quotes $49 and your page says $59, or shows a product you sold out of last week, the shopper leaves annoyed and the platform learns your data is unreliable. Whatever feeds you publish, to Google Merchant Center, Shopify or OpenAI, should update automatically from the store, not by hand.",
      },
      { type: "h3", text: "5. Be in Google Merchant Center too" },
      {
        type: "p",
        text: "Google's AI Mode shopping results draw on its Shopping Graph, which is fed by Merchant Center. Free product listings cost nothing, and the product data you prepare there (identifiers, images, prices, shipping) is the same work an OpenAI feed needs. If you only do one feed this year, start with Google's.",
      },
      { type: "h3", text: "6. Make the landing fast and the checkout simple" },
      {
        type: "p",
        text: "A shopper who arrives from ChatGPT has already decided they are interested. Lose them to a slow page or a nine-step checkout and you did all the work for nothing. Test the product page, basket and checkout on a phone. Our [pre-launch checklist for online stores](/blog/online-store-pre-launch-checklist) covers what to check.",
      },
      { type: "h2", id: "reviews", text: "Why reviews matter more than ever" },
      {
        type: "p",
        text: "When an assistant chooses between two similar products, it leans on what others have said: reviews on your site, on marketplaces and on independent sites. OpenAI's own documentation lists reviews among the attributes that improve ranking. Ask every customer for one, reply to the critical ones, and display them as text on the product page, not only inside an image or a widget a crawler cannot read.",
      },
      { type: "h2", id: "measure", text: "How to tell if it is working" },
      {
        type: "ul",
        items: [
          "**Search for your own products.** Ask ChatGPT, Google AI Mode and Perplexity the questions your customers would ask, and note which stores appear.",
          "**Look for AI referrals.** Visits from `chatgpt.com` and `perplexity.ai` show up as referral traffic in Google Analytics 4. Our [GA4 guide](/blog/google-analytics-4-guide) shows where to find them.",
          "**Watch for UTM tags.** Links from ChatGPT often carry `utm_source=chatgpt.com`, so these sales can be attributed in your store's reports.",
        ],
      },
      { type: "h2", id: "be-wary", text: "What to be wary of" },
      {
        type: "p",
        text: "Nobody outside OpenAI or Google controls which products their assistants pick. Be careful with anyone promising guaranteed placement, selling a secret \"AI feed\" format, or generating hundreds of near-identical product pages to game the results. The real levers are the boring ones above, and they also make your store better for the shoppers who arrive from everywhere else.",
      },
      { type: "h2", id: "how-we-help", text: "Where Serverlys can help" },
      {
        type: "table",
        head: ["If you need…", "Start with", "From"],
        rows: [
          [
            "A WooCommerce store that stays fast when AI traffic sends shoppers your way",
            "[Ecommerce hosting](/ecommerce-hosting)",
            "$7.95/mo, renews at $12.62/mo",
          ],
          [
            "Product schema, on-page fixes and a new optimised article every month",
            "[SEO Growth](/seo)",
            "$499/mo",
          ],
          [
            "A store moved from another host without losing orders",
            "[Free migration](/migrations)",
            "Free with hosting",
          ],
        ],
      },
      {
        type: "p",
        text: "And when shoppers land with questions the product page does not answer, [ConvoAI](https://convoai.cloud/) puts an AI agent on your site that answers from your own catalogue and policies, day and night. We explain [how it works here](/blog/answer-every-website-visitor-with-convoai).",
      },
      {
        type: "callout",
        title: "The short version",
        text: "Let OAI-SearchBot in, write product pages a careful shopper would trust, add Product schema, keep prices and stock in sync, list in Google Merchant Center, and make the checkout quick. Shopify stores are already connected; everyone else can apply for an OpenAI feed.",
      },
    ],
  },
  {
    slug: "get-recommended-by-chatgpt-and-ai-search",
    title: "How to get recommended by ChatGPT and Google's AI answers",
    description:
      "Customers now ask AI assistants instead of scrolling results. What decides whether your business is the one they name, and what to fix first.",
    category: "AI",
    published: "2026-10-15",
    body: [
      {
        type: "p",
        text: 'A customer used to type "plumber near me" into Google and scroll ten blue links. More and more of them now ask a question instead: "who is a good plumber in my area that can come today?" They ask ChatGPT, Gemini, Perplexity, Copilot, or Google itself, which now answers many searches with an AI Overview before any links. The assistant names two or three businesses, and that is often where the decision gets made.',
      },
      {
        type: "p",
        text: "So the question every small business is asking this year is a fair one: how do you become one of the names? There is a whole industry forming around that question, with new acronyms (GEO, AEO, LLMO) and a lot of confident promises. This guide sticks to what the platforms themselves have said and what you can check, and it is shorter than you might expect.",
      },
      {
        type: "h2",
        id: "how-ai-picks",
        text: "How an AI assistant decides who to mention",
      },
      {
        type: "p",
        text: "When an assistant answers a question about businesses, it usually **searches the web first**, reads a handful of pages, and writes its answer from what it found. That is why it can name a café that opened last month. It also means the assistant can only recommend you if three things are true:",
      },
      {
        type: "ol",
        items: [
          "**It is allowed to read your website.** If your site blocks its crawler, you are invisible to it, however good the site is.",
          "**It can find you when it searches.** The assistants lean on search indexes, so the basics of being findable in ordinary search still decide whether you are in the pile it reads.",
          "**What it reads makes you an obvious answer.** Clear facts on your own site, backed up by what other sites, reviews and listings say about you.",
        ],
      },
      {
        type: "quote",
        text: "AI search does not replace SEO. It rewards the businesses that already did the basics, and it punishes vagueness harder than Google ever did.",
      },
      {
        type: "h2",
        id: "what-google-says",
        text: "What Google and OpenAI actually say",
      },
      {
        type: "p",
        text: "Google is unusually direct about its AI features. Its [guidance for site owners](https://developers.google.com/search/docs/appearance/ai-features) says there are no additional requirements to appear in AI Overviews or AI Mode, no special schema to add and no new AI text files to create. A page that is indexed and eligible to show a snippet in normal search is eligible to appear. In other words: the way into Google's AI answers is the way into Google.",
      },
      {
        type: "p",
        text: "OpenAI's [crawler documentation](https://developers.openai.com/api/docs/bots) is just as clear about ChatGPT search. Its search crawler is called `OAI-SearchBot`, and sites that block it are not shown in ChatGPT search answers. OpenAI recommends allowing it in your `robots.txt`. That crawler is separate from `GPTBot`, which collects training data, so you can say yes to appearing in answers and no to training if you prefer.",
      },
      {
        type: "callout",
        title: "Check your robots.txt today",
        text: "Open yourdomain.com/robots.txt in a browser. If you see `Disallow: /` under `User-agent: *`, or under `OAI-SearchBot`, `PerplexityBot` or `Claude-SearchBot`, you are blocking AI search. Some security plugins and CDN settings add these rules without asking, so check even if you never touched the file.",
      },
      { type: "h2", id: "checklist", text: "The checklist, in the order that matters" },
      { type: "h3", text: "1. Make your site readable by machines, not just people" },
      {
        type: "p",
        text: "Assistants read text. If your opening hours are in an image, your prices are in a PDF and your services only appear inside a slider that loads with JavaScript, a crawler may see a page that says almost nothing. Put the important facts in plain text on the page: what you do, where you do it, who it is for, what it costs (if you are happy to say), and how to get in touch.",
      },
      {
        type: "p",
        text: "Speed and reliability count too. A crawler that times out or hits an error moves on to the next source. That is a hosting question as much as a content one, and our guide to [Core Web Vitals for small sites](/blog/core-web-vitals-for-small-sites) covers the parts worth fixing.",
      },
      { type: "h3", text: "2. Answer the questions people actually ask" },
      {
        type: "p",
        text: 'People ask assistants complete questions: "do you do emergency call-outs on Sundays?", "how much does a deep clean of a three-bedroom house cost?" A page that answers those questions in its own words, near the top, is far easier to quote than a page of slogans. A short FAQ on each service page is one of the cheapest wins available. If you already run a chat assistant, its conversation log is a list of these questions written by your customers.',
      },
      { type: "h3", text: "3. Be the same business everywhere" },
      {
        type: "p",
        text: "Assistants cross-check. If your website, Google Business Profile, Facebook page and directory listings disagree on your name, phone number, address or hours, you look less certain, and an assistant that is unsure tends to recommend someone else. Pick one exact version of each fact and make every listing match. Our [local SEO guide](/blog/local-seo-guide) walks through the listings that matter most.",
      },
      { type: "h3", text: "4. Earn mentions on other people's sites" },
      {
        type: "p",
        text: 'When an assistant recommends a business, it is often summarising what other sources say: reviews, local news, "best of" lists, industry directories, a supplier\'s case studies. You cannot write those yourself, but you can make them likelier. Ask happy customers for reviews, join the associations in your trade, and say yes when a local publication asks for a quote.',
      },
      { type: "h3", text: "5. Use structured data, but for the right reason" },
      {
        type: "p",
        text: "Structured data (schema.org markup such as `LocalBusiness`, `Product` and `FAQPage`) will not by itself get you into an AI answer, and Google says so. What it does is state your facts in a format machines cannot misread, and it powers the rich results in ordinary search that still drive clicks. It is worth having; it is not a shortcut.",
      },
      { type: "h3", text: "6. Consider an llms.txt file, without expecting miracles" },
      {
        type: "p",
        text: "`llms.txt` is a proposed convention: a plain-text file at the root of your site that summarises what you do and links to your most important pages. Google has said it does not need one. Some AI tools do read it, it takes an hour to write, and it forces you to describe your business in a few honest paragraphs, which is a useful exercise anyway. We publish [our own](/llms.txt) for exactly that reason.",
      },
      { type: "h2", id: "measure", text: "How to tell if it is working" },
      {
        type: "ul",
        items: [
          "**Ask the assistants yourself.** Each month, ask ChatGPT, Gemini and Perplexity the three questions your best customers would ask. Note who gets named, and which pages they cite.",
          "**Check Google Search Console.** Google counts AI Overview and AI Mode traffic inside the normal Performance report, under the Web search type.",
          "**Look for AI referrals in analytics.** Visits from chatgpt.com, perplexity.ai and similar domains show up as referral traffic in Google Analytics 4. Our [GA4 guide](/blog/google-analytics-4-guide) shows where to look.",
          '**Ask new customers how they found you.** "ChatGPT told me" is an answer more owners are hearing, and it rarely shows up in any dashboard.',
        ],
      },
      { type: "h2", id: "what-to-avoid", text: "What to be wary of" },
      {
        type: "p",
        text: 'Nobody can guarantee you a place in an AI answer, because nobody outside the AI companies controls what the assistant writes. Be careful with anyone selling a secret prompt, a special file or a network of AI-generated pages that will "train" ChatGPT to recommend you. Mass-produced pages written to game the system are exactly what search engines spend their time demoting, and the assistants rely on those same engines.',
      },
      { type: "h2", id: "how-we-help", text: "Where Serverlys can help" },
      {
        type: "p",
        text: "Most of this checklist you can do yourself in a few afternoons. If you would rather hand it to someone, this is the work our teams do every day:",
      },
      {
        type: "table",
        head: ["If you need…", "Start with", "From"],
        rows: [
          [
            "A fast, reliable site that crawlers never time out on",
            "[Cloud hosting](/cloud-hosting) with free SSL and daily backups",
            "$7.95/mo, renews at $12.62/mo",
          ],
          [
            "Your Google Business Profile, local listings and on-page basics fixed",
            "[SEO Starter](/seo)",
            "$249/mo",
          ],
          [
            "Schema markup, competitor analysis and a new optimised article every month",
            "[SEO Growth](/seo)",
            "$499/mo",
          ],
          [
            "A website built from the start with clear, quotable answers",
            "[Website design](/website-design)",
            "$1,399",
          ],
        ],
      },
      {
        type: "p",
        text: "And once AI search starts sending people to your site, make sure someone answers them. [ConvoAI](https://convoai.cloud/) puts an AI agent on your website that answers visitors from your own information, day and night, and hands the real conversations to you. It has a free plan, and we wrote about [how it works here](/blog/answer-every-website-visitor-with-convoai).",
      },
      {
        type: "callout",
        title: "The short version",
        text: "Let the AI crawlers in, write your facts in plain text, answer real questions, keep every listing consistent and earn genuine mentions elsewhere. It is not a new discipline. It is good SEO, held to a higher standard.",
      },
    ],
  },
  {
    slug: "put-your-ai-built-website-online",
    title: "Built a website with AI? How to put it online properly",
    description:
      "Lovable, Bolt, ChatGPT and Claude build a site in an afternoon. Putting it on your own domain, secure, backed up and on Google is the part they skip.",
    category: "Getting started",
    published: "2026-10-15",
    body: [
      {
        type: "p",
        text: '"Vibe coding" went from a joke to a job description remarkably fast. You describe the website you want to Lovable, Bolt, v0, ChatGPT or Claude, it writes the code, and an hour later you have something that looks and works like a real site. For a small business, a portfolio or a side project, that is genuinely remarkable.',
      },
      {
        type: "p",
        text: 'Then comes the less exciting question: now what? The preview link on the builder\'s own domain is not where you want customers to find you. You want `yourbusiness.com`, a padlock in the address bar, a contact form that actually delivers, backups, and a site Google can read. This guide covers the steps between "it works on my screen" and "it is live and I can rely on it".',
      },
      {
        type: "h2",
        id: "what-you-built",
        text: "Step 1: Work out what kind of site you actually have",
      },
      {
        type: "p",
        text: 'This decides everything else, and the AI tool will happily tell you if you ask it. Paste this into the builder\'s chat: "Is this project a static site, or does it need a server or a database to run?" You will get one of three answers.',
      },
      {
        type: "table",
        head: ["What you have", "What it means", "Where it can live"],
        rows: [
          [
            "A static site (plain HTML, or React/Vite that builds to static files)",
            "Every page is a file. No server code runs when someone visits.",
            "Any ordinary web hosting plan, uploaded through the control panel",
          ],
          [
            "An app with server code (Node.js, Next.js, TanStack Start)",
            "Code runs on the server for each visit or form submission.",
            "Hosting that runs Node.js, or a VPS for heavier apps",
          ],
          [
            "An app with a database, logins and file uploads",
            "Users sign in and save data, usually in Supabase or a similar backend.",
            "Your front end on your hosting, the backend kept where it is or moved deliberately",
          ],
        ],
      },
      {
        type: "p",
        text: "Lovable's own [self-hosting guide](https://docs.lovable.dev/tips-tricks/self-hosting) is a good example of why this matters: its older projects are React and Vite, which build to static files any host can serve, while projects created since May 2026 use TanStack Start, which runs server code. Same tool, two different hosting needs.",
      },
      {
        type: "h2",
        id: "get-the-code",
        text: "Step 2: Get your code out of the builder",
      },
      {
        type: "p",
        text: "Most builders let you sync the project to GitHub or download it as a zip. Do this even if you plan to keep using the builder: a copy you control is your backup if the tool changes its pricing, its plans or its terms. Lovable, for example, offers GitHub sync on every plan and the zip download on paid plans.",
      },
      {
        type: "p",
        text: "For a React or Vite project, the files you upload are not the project itself but its **build**. Running the build command produces a folder (usually `dist`) containing plain HTML, CSS, JavaScript and images. If you have never run a command in a terminal, ask the AI to walk you through it step by step, or ask it to produce the build for you.",
      },
      {
        type: "code",
        lang: "bash",
        code: "npm install\nnpm run build\n# upload the contents of the dist folder, not the folder itself",
      },
      { type: "h2", id: "domain", text: "Step 3: Register the domain you want" },
      {
        type: "p",
        text: "Your domain is the one part of your website you should never let anyone else own. Register it in your own name, with an email address you will still have in five years, and turn on auto-renew. You can [search and register a domain here](/register-domain), and our guide on [keeping control of your domain](/blog/keep-control-of-your-domain) explains the mistakes that cost people theirs.",
      },
      { type: "h2", id: "hosting", text: "Step 4: Put it on proper hosting" },
      {
        type: "p",
        text: "For a static build, the steps on any cPanel hosting account are the same:",
      },
      {
        type: "ol",
        items: [
          "Open **File Manager** in your control panel and go to `public_html` (the folder your domain points at).",
          "Upload the **contents** of your `dist` folder, so `index.html` sits directly inside `public_html`.",
          "Visit your domain. If the home page loads but other pages show a 404 when you refresh them, add the rule below.",
          "Turn on the free SSL certificate and force HTTPS, so every visit gets the padlock. Our [free SSL guide](/blog/free-ssl-setup) shows how.",
        ],
      },
      {
        type: "p",
        text: "AI builders usually create a **single-page app**, where one `index.html` handles every address. The browser knows how to move between pages, but when someone opens `/about` directly, the server goes looking for an `about` file that does not exist. This `.htaccess` file, placed in `public_html`, sends those requests back to `index.html`:",
      },
      {
        type: "code",
        lang: "apache",
        code: "<IfModule mod_rewrite.c>\n  RewriteEngine On\n  RewriteBase /\n  RewriteRule ^index\\.html$ - [L]\n  RewriteCond %{REQUEST_FILENAME} !-f\n  RewriteCond %{REQUEST_FILENAME} !-d\n  RewriteRule . /index.html [L]\n</IfModule>",
      },
      {
        type: "p",
        text: "If your project runs server code, choose a plan that runs it. Our [Cloud hosting](/cloud-hosting) plans support Node.js applications from the same control panel, and a [VPS](/vps-hosting) gives you full server access when an app outgrows that.",
      },
      { type: "h2", id: "the-gaps", text: "Step 5: Fix what the AI quietly left out" },
      {
        type: "p",
        text: "AI builders are optimised to show you something impressive quickly. The things that only matter after launch are the things they most often skip. Go through this list before you share the link:",
      },
      { type: "h3", text: "Secrets in the wrong place" },
      {
        type: "p",
        text: 'Anything in a static site\'s JavaScript can be read by every visitor. If the AI put an API key for OpenAI, Stripe, an email service or a database admin account into the front-end code, assume it is public. Ask the builder: "Are there any secret keys in the code that runs in the browser?" Keys that must stay private belong in server code or environment variables, never in the build you upload.',
      },
      { type: "h3", text: "Forms that go nowhere" },
      {
        type: "p",
        text: "A contact form that looks finished often has no working destination. Submit it yourself from the live site and confirm the message arrives. Our [contact form guide](/blog/contact-form-guide) covers the reliable ways to wire one up.",
      },
      { type: "h3", text: "Pages Google cannot read" },
      {
        type: "p",
        text: "A single-page app can arrive at the browser as an almost empty page that JavaScript fills in. Google can usually render that, but many other crawlers, including several AI search crawlers, read only the raw HTML. Ask the AI to give every page its own title and meta description, add a sitemap, and if the site matters for search, ask whether it can pre-render pages to static HTML. Our piece on [getting recommended by ChatGPT and Google's AI answers](/blog/get-recommended-by-chatgpt-and-ai-search) explains why this matters more every month.",
      },
      { type: "h3", text: "Speed, privacy and the boring legal bits" },
      {
        type: "ul",
        items: [
          "Compress the images. AI tools love full-size stock photos, and they are usually the main reason a page is slow.",
          "Add a privacy policy, and a cookie banner if you use analytics or ads. See our [GDPR checklist](/blog/gdpr-website-compliance).",
          "Run the live site through PageSpeed Insights on mobile, not just desktop.",
        ],
      },
      { type: "h2", id: "after-launch", text: "Step 6: Keep it alive after launch" },
      {
        type: "p",
        text: "A site built in an afternoon still needs looking after for years. Keep the code in GitHub so every change is saved, make sure your host takes daily backups, and before you ask the AI for a big change, test it on a copy rather than the live site. Our guide to [staging sites](/blog/wordpress-staging-site) explains the habit, and it applies to any site, not just WordPress.",
      },
      {
        type: "quote",
        text: "The AI can write the website. It cannot renew your domain, notice that your form stopped sending, or restore last Tuesday's backup.",
      },
      { type: "h2", id: "how-we-help", text: "Where Serverlys fits in" },
      {
        type: "p",
        text: "If you built the site yourself and want it somewhere dependable, our [hosting plans](/pricing) start at $7.95/mo, renewing at $12.62/mo, with free SSL, daily backups and the cPanel tools above. Domains are [registered here](/register-domain) in your own name.",
      },
      {
        type: "p",
        text: "If you would rather not do any of this, we can take it from where the AI stopped:",
      },
      {
        type: "ul",
        items: [
          "**Moving it for you.** Our [migration team](/migrations) can move your project off the builder's preview link and onto your own domain and hosting.",
          "**Finishing it properly.** [Website development](/website-development) takes an AI-built prototype and makes it production-ready: secrets moved out of the browser, forms wired up, pages that search engines can read.",
          "**Looking after it.** [ServerCare Essential](/site-management) ($149.95/mo) covers daily backups, monthly updates, uptime monitoring with alerts, malware scans and an hour of content changes each month.",
          "**Starting from a professional design.** If the AI version was a sketch of what you want, our [website design](/website-design) plans start at $1,399 and include the build, hosting and analytics setup.",
        ],
      },
      {
        type: "p",
        text: "And when visitors start arriving, give them somewhere to ask questions. [ConvoAI](https://convoai.cloud/) adds an AI agent to your site with one line of code, on a free plan, so the site you built in an afternoon can also answer your customers at midnight.",
      },
    ],
  },
  {
    slug: "how-much-hosting-do-you-need",
    title: "How much hosting does your website actually need?",
    description:
      "A plain way to size a hosting plan from your sites, your visitors and what your pages do, so you neither overpay nor outgrow it in a month.",
    category: "Hosting",
    published: "2026-10-12",
    body: [
      {
        type: "p",
        text: "Most people pick a hosting plan the way they pick a phone contract: they look at the middle option, assume it is the sensible one, and hope. Sometimes that works. Often it means paying for headroom a five-page brochure site will never use, or squeezing a busy online store onto a plan built for one small blog.",
      },
      {
        type: "p",
        text: "You do not need to understand servers to size a plan properly. You need answers to four questions, and you can answer all of them in about ten minutes.",
      },
      { type: "h2", id: "four-questions", text: "The four questions that decide it" },
      { type: "h3", text: "1. How many websites will live on it?" },
      {
        type: "p",
        text: "This is the easiest limit to hit by accident. A business site, a separate landing page for a campaign and a staging copy for testing are three sites, not one. Count every domain or subdomain that will have its own install, and add one for whatever you will launch next year.",
      },
      { type: "h3", text: "2. How many people visit each month?" },
      {
        type: "p",
        text: "If the site already exists, your analytics will tell you: look at monthly users over the last three months and take the highest month, not the average. If the site is new, be honest. A new local business site rarely has thousands of visitors in its first months, and that is fine; you can move up a plan when it does.",
      },
      { type: "h3", text: "3. What do your pages do?" },
      {
        type: "p",
        text: "A page that is the same for every visitor (an about page, a blog post, a service page) can be cached and served almost for free. A page that is built fresh for each person (a basket, a checkout, a member area, a search) has to run code and query the database every time. Ten thousand visits to a brochure site and ten thousand visits to a busy store are very different workloads, which is why the store needs more memory for the same traffic.",
      },
      { type: "h3", text: "4. Does your traffic arrive in spikes?" },
      {
        type: "p",
        text: "A newsletter send, a TV mention or a seasonal sale can put a month's worth of visitors on the site in an afternoon. If that describes your business, size for the spike rather than the average, or choose infrastructure that can absorb one. That is the main reason to prefer [cloud hosting](/cloud-hosting) over a fixed shared server.",
      },
      { type: "h2", id: "matching", text: "Matching the answers to a plan" },
      {
        type: "p",
        text: "Here is how those answers map onto our own plans. The visit figures are guides for a typical, cached site rather than hard caps, and every plan includes unlimited NVMe storage and unmetered bandwidth, so storage and transfer are rarely what decides it.",
      },
      {
        type: "table",
        head: ["Plan", "Websites", "Guide monthly visits", "Memory", "Price / renewal"],
        rows: [
          [
            "Starter",
            "1",
            "~10,000",
            "2 GB",
            "$7.95/mo, renews at $12.62/mo (+$2.95 setup)",
          ],
          ["Plus", "7", "~25,000", "4 GB", "$11.95/mo, renews at $15.93/mo"],
          ["Turbo", "Unlimited", "~50,000", "6 GB", "$17.95/mo, renews at $21.37/mo"],
          [
            "Business",
            "Unlimited",
            "~100,000",
            "8 GB",
            "$23.95/mo, renews at $27.22/mo",
          ],
        ],
      },
      {
        type: "ul",
        items: [
          "**One brochure site or blog, modest traffic:** Starter is enough. Do not let anyone talk you out of it.",
          "**A few sites, or one site that is growing:** Plus gives you room for a second project and twice the memory.",
          "**A store, a membership site, or traffic that spikes:** start at Turbo. Dynamic pages are where extra memory earns its keep.",
          "**Several busy sites, or one store that is your whole business:** Business, and consider [managed hosting](/managed-hosting) so someone else watches it.",
        ],
      },
      {
        type: "callout",
        title: "Pick the type before the size",
        text: "If the site runs on WordPress, a [WordPress plan](/wordpress-hosting) comes tuned for it. If it sells through WooCommerce, an [ecommerce plan](/ecommerce-hosting) caches the store safely around the basket and checkout. The tiers and prices are the same; the tuning is what differs. Our guide to [shared, cloud, VPS or dedicated](/blog/shared-cloud-vps-or-dedicated) covers the bigger choice.",
      },
      { type: "h2", id: "signs", text: "Signs you have outgrown your plan" },
      {
        type: "p",
        text: "Plans are not a lifetime decision. Watch for these, and move up when you see two of them together:",
      },
      {
        type: "ul",
        items: [
          "Pages that are fast at night and slow in the middle of the day.",
          "The admin area becoming sluggish while the public pages still feel fine.",
          "Resource or memory warnings in your control panel.",
          "Errors or timeouts during a sale, a launch or a newsletter send.",
          "Your monthly visits sitting at or above the guide figure for your plan for several months in a row.",
        ],
      },
      {
        type: "p",
        text: "Before upgrading, rule out the cheap fixes: oversized images, a plugin doing far more than it should, and caching that is switched off. Our guides to [website caching](/blog/website-caching-guide) and [reducing server response time](/blog/reduce-ttfb) are the place to start. If the site is still struggling after that, it genuinely needs more room.",
      },
      { type: "h2", id: "dont-overbuy", text: "Do not overbuy on day one" },
      {
        type: "p",
        text: "The most common mistake is not buying too little. It is buying the top plan for a site that has not launched yet, then paying for unused capacity for a year. Start where your honest answers put you. Moving up a tier does not mean rebuilding anything, and every plan has a 30-day money-back guarantee if it turns out to be the wrong fit.",
      },
      {
        type: "p",
        text: "If you are still unsure, [compare every plan side by side](/pricing) with the renewal price next to each one, or [ask our team](/support) with your answers to the four questions above. We would rather sell you the smaller plan that fits than the bigger one you resent.",
      },
    ],
  },
  {
    slug: "wordpress-maintenance-routine",
    title: "A WordPress maintenance routine you can actually keep",
    description:
      "What to check on a WordPress site every week, every month and every year, in the order that prevents the most problems for the least time.",
    category: "WordPress",
    published: "2026-10-12",
    body: [
      {
        type: "p",
        text: "WordPress sites rarely break all at once. They drift. A plugin nobody uses stays installed, an update gets postponed, a backup quietly stops running, and one day a routine change takes the site down at the worst possible time. Nearly every WordPress emergency is a maintenance task that was skipped months earlier.",
      },
      {
        type: "p",
        text: "The fix is a routine small enough that you will actually do it. Here is one, split into weekly, monthly and yearly jobs, with the reasoning behind each so you can adapt it to your own site.",
      },
      { type: "h2", id: "weekly", text: "Every week: ten minutes" },
      {
        type: "ol",
        items: [
          "**Open the site as a visitor.** Load the home page, a key service or product page and the contact page on your phone. You are looking for anything obviously wrong: broken layout, missing images, error messages.",
          "**Send yourself a test message through your contact form.** Forms fail silently. If the email does not arrive, you are losing enquiries and nobody will tell you. Our [contact form guide](/blog/contact-form-guide) covers the usual causes.",
          "**Check the updates screen.** Note what is waiting. Security releases for WordPress core and for any plugin you rely on should not wait for the monthly session.",
          "**Glance at comments and form submissions for spam.** A sudden flood is often the first sign a form or comment section needs protecting.",
        ],
      },
      { type: "h2", id: "monthly", text: "Every month: half an hour" },
      {
        type: "ol",
        items: [
          "**Confirm a recent backup exists, then restore one somewhere safe.** A backup you have never restored is a hope rather than a plan. Restoring to a staging copy proves it works without touching the live site. See our [backup strategy guide](/blog/website-backup-strategy) for what a good set of restore points looks like.",
          "**Apply plugin and theme updates, on staging first if you can.** Update, click through the important pages, then repeat on the live site. Our guide to [setting up a WordPress staging site](/blog/wordpress-staging-site) shows how.",
          "**Remove what you do not use.** A deactivated plugin still sits on the server and can still carry a vulnerability. If you have not used it in three months, delete it. The same goes for themes other than your active theme and one default fallback.",
          "**Review user accounts.** Every administrator account is a way in. Remove people who have left, downgrade anyone who does not need admin rights, and make sure every remaining admin has [two-factor authentication](/blog/two-factor-authentication) switched on.",
          "**Check speed on a phone.** Run your home page through PageSpeed Insights and compare with last month. A sudden drop usually points at a new plugin, a new embed or an image someone uploaded at full camera size.",
        ],
      },
      { type: "h2", id: "yearly", text: "Every year: an afternoon" },
      {
        type: "ul",
        items: [
          "**Check your PHP version** in the control panel. Older PHP versions stop receiving security fixes, and newer ones are generally faster. Test the upgrade on staging first.",
          "**Audit your plugins as a whole.** For each one, ask whether it is still maintained, whether you still need it, and whether two plugins overlap. Fewer, well-maintained plugins is the single biggest reliability improvement most sites can make. Our list of [must-have WordPress plugins](/blog/must-have-wordpress-plugins) is a useful baseline.",
          "**Renew and check your domain and SSL.** Make sure the domain is on auto-renew with a payment card that has not expired, and that the certificate covers every address the site uses.",
          "**Read your own site.** Opening hours, prices, team members and policies change. Out-of-date information costs more trust than a slow page.",
        ],
      },
      {
        type: "callout",
        title: "Keep a one-line log",
        text: "Write down the date and what you did each time, even if it was 'nothing to update'. When something breaks, the first question is always 'what changed?', and a log answers it in seconds instead of hours.",
      },
      {
        type: "h2",
        id: "what-hosting-handles",
        text: "What your hosting should be doing for you",
      },
      {
        type: "p",
        text: "Some of this list should not be your job at all. On our [WordPress hosting](/wordpress-hosting), daily backups, automatic WordPress updates, free SSL renewal and LiteSpeed caching are included on every plan, so the weekly and monthly sessions shrink to checking that they ran and testing what matters to you.",
      },
      {
        type: "p",
        text: "If you would rather hand the whole server side over, [managed hosting](/managed-hosting) adds patching, hardening and monitoring by our team, with restores done for you. Your content and your plugin choices stay yours; keeping the platform underneath them healthy becomes ours.",
      },
      {
        type: "p",
        text: "And if something has already gone wrong, start with our guide to the [WordPress white screen of death](/blog/wordpress-white-screen-death), then come back here so it does not happen twice.",
      },
    ],
  },
  {
    slug: "fonts-scripts-and-embeds-slowing-your-site",
    title: "The hidden weight on your pages: fonts, scripts and embeds",
    description:
      "Chat widgets, video embeds, tracking tags and web fonts are often what really slows a small site. How to find them, and what to keep, delay or remove.",
    category: "Performance",
    published: "2026-10-12",
    body: [
      {
        type: "p",
        text: "When a site feels slow, the usual suspects are the server and the images. Both matter, and both are well covered elsewhere on this blog. But on a lot of small business sites, the biggest cost is something else: the things that were added one at a time over the years. A video embed on the home page. A booking widget. Three analytics tags. A map. A font family loaded in six weights when the design uses two.",
      },
      {
        type: "p",
        text: "Each one seemed harmless when it was added. Together, they often outweigh everything else on the page, and because they load from other companies' servers, no amount of hosting can make them faster. The good news is that they are usually the cheapest thing to fix.",
      },
      {
        type: "h2",
        id: "find-them",
        text: "Step one: see what your page is actually loading",
      },
      {
        type: "ol",
        items: [
          "Open your home page in Chrome, right-click and choose **Inspect**, then open the **Network** tab.",
          "Tick **Disable cache** and reload the page.",
          "Sort by the **Domain** column (right-click a column header to add it). Everything that is not your own domain is a third party.",
          "Look at the totals at the bottom: the number of requests and the amount transferred. Then add up roughly how much of that came from other domains.",
        ],
      },
      {
        type: "p",
        text: "Write the list down. For each third party, you should be able to say what it does and who asked for it. If nobody can, that is your first candidate for removal.",
      },
      {
        type: "h2",
        id: "usual-suspects",
        text: "The usual suspects, and what to do with each",
      },
      { type: "h3", text: "Video embeds" },
      {
        type: "p",
        text: "A standard video embed loads the full player and its scripts before anyone presses play, which most visitors never do. Replace it with a 'facade': a still image with a play button that only loads the real player when clicked. Many page builders and plugins offer this as a setting called lazy-loading or click-to-load.",
      },
      { type: "h3", text: "Maps" },
      {
        type: "p",
        text: "An embedded map is heavy and often sits on every page through the footer. Keep it on the contact page only, or replace it with a static map image that links to directions.",
      },
      { type: "h3", text: "Web fonts" },
      {
        type: "p",
        text: "Check how many font files load. Two families in two or three weights each is plenty for most designs. Host the fonts on your own domain rather than fetching them from another service, use the WOFF2 format, and set `font-display: swap` so text appears immediately in a fallback font instead of staying invisible while the font downloads.",
      },
      { type: "h3", text: "Tracking and marketing tags" },
      {
        type: "p",
        text: "Sites collect tags: an analytics tag, an old analytics tag nobody removed, an ad pixel from a campaign that ended, a heatmap tool from a trial. Remove anything you are no longer actively using. Put the rest in a single tag manager so they can be reviewed in one place, and load them after the page content rather than before it.",
      },
      { type: "h3", text: "Chat, booking and review widgets" },
      {
        type: "p",
        text: "These earn their place, because they turn visitors into customers. The question is how they load. A well-built widget loads a small launcher first and the rest only when someone opens it. If a widget is pulling in a large amount of script before anyone interacts with it, ask the vendor whether it has a lighter or deferred loading option.",
      },
      {
        type: "callout",
        title: "A good test for any script",
        text: "Ask: does this need to run before the visitor can see and use the page? If the answer is no, it should load after the page, on interaction, or not at all. Almost nothing on a small business site needs to run first.",
      },
      { type: "h2", id: "measure", text: "Measure before and after" },
      {
        type: "p",
        text: "Run your page through PageSpeed Insights before you change anything and save the result. Make one change at a time, then test again. The scores to watch are the Core Web Vitals: Largest Contentful Paint should be under 2.5 seconds, Interaction to Next Paint under 200 milliseconds, and Cumulative Layout Shift under 0.1. Third-party scripts tend to hurt the second one most, because they keep the browser busy when the visitor tries to tap something. Our guide to [Core Web Vitals for small sites](/blog/core-web-vitals-for-small-sites) explains each one in plain language.",
      },
      { type: "h2", id: "your-share", text: "Then make sure your own share is fast" },
      {
        type: "p",
        text: "Once the third parties are under control, what is left is your own server, your own images and your own code. That part is what hosting decides. Every Serverlys plan, from [cloud hosting](/cloud-hosting) to [WordPress hosting](/wordpress-hosting), runs on NVMe storage with LiteSpeed caching included, so the pages you control are served quickly and the time you saved on scripts is not lost waiting for the server.",
      },
      {
        type: "p",
        text: "For the rest of the job, see our guides to [image optimisation](/blog/image-optimization-web) and [mobile speed](/blog/mobile-speed-optimization).",
      },
    ],
  },
  {
    slug: "who-has-access-to-your-website",
    title: "Who still has the keys to your website?",
    description:
      "A practical access audit for small businesses: every login that controls your website, domain and email, and what to do when someone leaves.",
    category: "Security",
    published: "2026-10-12",
    body: [
      {
        type: "p",
        text: "Ask a small business owner who can log in to their website and the answer is usually 'me, and maybe the designer'. Ask them to list every account and the list grows: the old web designer, a marketing freelancer from two years ago, a former employee who updated the blog, the agency that set up the ads, a shared password on a sticky note.",
      },
      {
        type: "p",
        text: "Every one of those is a way in. Plenty of break-ins on small sites involve no clever hacking at all, just a valid login that should have been removed, or a password that was reused somewhere else and leaked. An access audit closes that door, takes an afternoon, and costs nothing.",
      },
      { type: "h2", id: "map", text: "Step one: map every account that matters" },
      {
        type: "p",
        text: "Write a list with one line per system. For each, note the login email, who has access, and whether two-factor authentication is on. These are the systems that matter most, in order:",
      },
      {
        type: "ol",
        items: [
          "**Your domain registrar.** Whoever controls the domain controls your website and your email. This is the most important account you own. Our guide to [keeping control of your domain](/blog/keep-control-of-your-domain) covers it in detail.",
          "**Your email accounts**, especially the address that password resets go to. Access to that inbox is access to everything else.",
          "**Your hosting account and control panel**, including FTP and database users created over the years.",
          "**Your website's admin area**, such as WordPress administrators, editors and shop managers.",
          "**Everything connected:** analytics, ad accounts, payment providers, the booking system, social profiles linked to the site.",
        ],
      },
      { type: "h2", id: "clean-up", text: "Step two: clean up what you find" },
      {
        type: "ul",
        items: [
          "**One person, one account.** Shared logins make it impossible to remove one person without changing the password for everyone, so nobody ever does it. Give each person their own account.",
          "**Least privilege.** Someone who writes blog posts needs an editor role, not an administrator one. Downgrade anyone who has more access than their job needs.",
          "**Remove the departed.** Delete or disable accounts for anyone who no longer works with you, including agencies and freelancers. In WordPress, reassign their content to another user when you delete them.",
          "**Delete stale technical users.** Old FTP accounts and database users from a past project are easy to forget and easy to abuse.",
          "**Turn on two-factor everywhere it is offered**, starting with the registrar, email and hosting. See our [two-factor authentication guide](/blog/two-factor-authentication).",
          "**Use a password manager.** Unique, long passwords for every account, stored somewhere better than a spreadsheet, and shareable with a teammate without being visible to them.",
        ],
      },
      {
        type: "callout",
        title: "Make sure the business owns the accounts",
        text: "If a designer registered your domain or hosting in their own name, with their own email, you do not own it in any practical sense. Have it moved into an account that uses a business email address you control, before you need it.",
      },
      {
        type: "h2",
        id: "offboarding",
        text: "Step three: an offboarding checklist for next time",
      },
      {
        type: "p",
        text: "The audit fixes today. A checklist keeps it fixed. When an employee, freelancer or agency stops working with you, go through this the same day:",
      },
      {
        type: "ol",
        items: [
          "Remove or disable their website admin account and reassign their content.",
          "Remove them from the hosting account, control panel, FTP and any database users they created.",
          "Remove them from the registrar, analytics, ad accounts and social profiles.",
          "Change any shared password they knew. If you followed step two, there should be none.",
          "Forward or convert their business mailbox so customer messages are not lost, then close it.",
          "Check that payment details and recovery emails on every account point to you, not to them.",
        ],
      },
      { type: "h2", id: "after", text: "Keep it short, keep it current" },
      {
        type: "p",
        text: "Repeat the audit once a year, or whenever you change web designer or agency. It is also worth working through our wider [website security checklist](/blog/website-security-checklist) once the access is clean, because a tidy set of accounts is the foundation everything else rests on.",
      },
      {
        type: "p",
        text: "Two things make this easier on our side. [Business email](/business-email) at your own domain means accounts and password resets use addresses the business owns, rather than personal ones that walk out of the door. And with [managed hosting](/managed-hosting), our team handles server patching, firewall hardening and daily backups, so even if an account slips through, a clean restore point is there.",
      },
    ],
  },
  {
    slug: "keep-control-of-your-domain",
    title: "How to make sure your domain really belongs to you",
    description:
      "Who the registrant is, which email controls it, and how auto-renew and transfer locks work, so your domain never lapses or ends up in someone else's hands.",
    category: "Domains",
    published: "2026-10-12",
    body: [
      {
        type: "p",
        text: "Your domain name is the address of your website and the second half of every email address your business uses. If it expires, both stop working. If someone else controls it, they control both. And yet it is the asset small businesses check least, often registered years ago by whoever happened to set up the website.",
      },
      {
        type: "p",
        text: "Making sure it is genuinely yours takes about twenty minutes. Here is what to check, and what to fix.",
      },
      { type: "h2", id: "find-it", text: "Step one: find out where it is registered" },
      {
        type: "p",
        text: "Run your domain through a [WHOIS lookup](/whois-lookup). Even with privacy protection on, it will show which registrar the domain is with, when it was registered and when it expires. If the registrar is not one you recognise, someone else probably set it up, and that is the first thing to resolve.",
      },
      {
        type: "h2",
        id: "three-things",
        text: "Step two: check the three things that define ownership",
      },
      { type: "h3", text: "The account it sits in" },
      {
        type: "p",
        text: "The domain lives inside an account at the registrar. Whoever can log in to that account can change where the domain points, transfer it away or let it lapse. Make sure that account belongs to the business, uses a strong unique password and has two-factor authentication on.",
      },
      { type: "h3", text: "The registrant" },
      {
        type: "p",
        text: "The registrant is the legal holder of the domain. It should be your business (or you, as its owner), not a designer, an agency or a former employee. If it is someone else, ask them to update it now, while you are on good terms. Note that changing the registrant can trigger a 60-day transfer lock at many registrars; that is a standard safety measure, and a good reason to fix it before you need to move the domain.",
      },
      { type: "h3", text: "The contact email" },
      {
        type: "p",
        text: "Renewal reminders, transfer approvals and security notices go to the email on the account. If that address is a former employee's, a free mailbox nobody reads, or an address at the domain itself, you can miss the very message that would have saved it. Use an address you check, ideally one that does not depend on the domain it is protecting.",
      },
      {
        type: "callout",
        title: "The quiet trap: email at the same domain",
        text: "If the only contact address is you@yourbusiness.com and the domain expires, your email stops with it, and so do the reminder emails telling you how to renew. Add a second, independent recovery address to the registrar account.",
      },
      { type: "h2", id: "expiry", text: "Step three: make expiry impossible" },
      {
        type: "ul",
        items: [
          "**Turn on auto-renew**, and check that the card on file has not expired. Most lapses are not decisions; they are declined payments nobody noticed.",
          "**Consider renewing for several years.** It removes a yearly point of failure, and the cost is the same per year.",
          "**Put the expiry date in your calendar** a month ahead, as a backstop to the registrar's own reminders.",
          "**Know the safety net, but do not rely on it.** After expiry, most domains enter a grace and redemption period during which the old owner can still recover them, often at extra cost. Once that ends, the name is released and anyone can register it. Our guide to [expired domains](/blog/expired-domains-guide) explains the stages.",
        ],
      },
      { type: "h2", id: "locks", text: "Step four: lock it and protect it" },
      {
        type: "ul",
        items: [
          "**Registrar lock (transfer lock) on.** It blocks transfers to another registrar until you deliberately switch it off. Leave it on unless you are moving the domain yourself.",
          "**WHOIS privacy on, where the extension allows it.** It keeps your personal details out of public lookups and cuts down the spam and scam letters that follow a new registration. See our [WHOIS privacy guide](/blog/whois-privacy-protection).",
          "**Write down your nameservers.** If the website or email ever stops working, knowing where the domain is meant to point is half the diagnosis. Our [nameservers explainer](/blog/nameservers-explained) shows where to find them.",
        ],
      },
      { type: "h2", id: "consolidate", text: "Bringing it all under one roof" },
      {
        type: "p",
        text: "Many businesses end up with domains scattered across several registrars, each with its own login and renewal date. Consolidating them makes all of the above easier to keep up. You can [transfer a domain to Serverlys](/transfer-domain) and manage it alongside your hosting and email, or [register a new one](/register-domain) with WHOIS privacy included where the registry allows and the renewal price shown before you pay. Our [domain transfer guide](/blog/domain-transfer-guide) walks through the steps, including the authorisation code and the timing.",
      },
      {
        type: "p",
        text: "Whichever registrar you use, the rule is the same: the business owns the domain, the business controls the account, and nothing about renewal depends on someone remembering.",
      },
    ],
  },
  {
    slug: "online-store-pre-launch-checklist",
    title: "Before you open your online store: a pre-launch checklist",
    description:
      "Payments, shipping, tax, emails, policies, speed and backups: what to test before your store takes its first real order, and how to test it.",
    category: "Ecommerce",
    published: "2026-10-12",
    body: [
      {
        type: "p",
        text: "The first real order is the worst time to discover that the confirmation email goes to spam, shipping is free to the whole world by accident, or the checkout breaks on a phone. Yet that is how a lot of stores find out, because launch day arrives and the testing was 'add something to the basket, looks fine'.",
      },
      {
        type: "p",
        text: "This checklist is the test a customer would run without meaning to. Work through it on a staging copy or before you announce the store, and you will launch knowing the whole journey works, not just the home page.",
      },
      { type: "h2", id: "orders", text: "Place real test orders" },
      {
        type: "ol",
        items: [
          "**Switch your payment provider to test mode** and place an order with each payment method you offer, on a desktop and on a phone.",
          "**Place one real order** with a real card for a low-priced item, then refund it. Test mode does not catch everything; a real transaction does.",
          "**Try to fail.** Use a declined test card, abandon the checkout halfway, enter an address in a country you do not ship to. The store should handle each one clearly.",
          "**Check the order in your admin**: correct items, correct totals, correct customer details, correct status.",
        ],
      },
      { type: "h2", id: "money", text: "Check the numbers" },
      {
        type: "ul",
        items: [
          "**Shipping:** test an order to each shipping zone, including a heavy and a light basket. Make sure there is no zone that ships everywhere for free unless you meant it.",
          "**Tax:** confirm tax is calculated the way your accountant expects for the places you sell to, and shown the way your customers expect to see it.",
          "**Discounts:** test a coupon, an expired coupon and a coupon combined with a sale price.",
          "**Stock:** buy the last unit of something and check that it shows as out of stock afterwards.",
        ],
      },
      { type: "h2", id: "emails", text: "Make sure your emails arrive" },
      {
        type: "p",
        text: "Order confirmations are the emails customers care about most, and the ones most likely to land in spam if the domain is not set up properly. Place a test order to a Gmail address and an Outlook address and check both inboxes, including spam.",
      },
      {
        type: "ul",
        items: [
          "Send from an address at your own domain, not a free mailbox. A [business email](/business-email) address tells the customer the message genuinely comes from your shop.",
          "Set up SPF, DKIM and DMARC for the domain. Our guide to [email authentication](/blog/email-security-spf-dkim-dmarc) explains each record.",
          "Read every automated email: order received, shipped, refunded, password reset. Replace the default wording with your own.",
        ],
      },
      { type: "h2", id: "trust", text: "Publish the pages customers look for" },
      {
        type: "p",
        text: "Shoppers check these before buying from a store they do not know, and payment providers often expect them too:",
      },
      {
        type: "ul",
        items: [
          "Shipping information: costs, regions and realistic delivery times.",
          "Returns and refunds: how long, who pays postage, how to start one.",
          "A privacy policy that reflects what you actually collect. See our note on [GDPR and website compliance](/blog/gdpr-website-compliance).",
          "Contact details that reach a person, and an answer to the questions you already know you will be asked.",
        ],
      },
      {
        type: "callout",
        title: "Answer questions before they become abandoned baskets",
        text: "Many lost sales are one unanswered question: does it fit, when will it arrive, can I return it? A chat assistant that answers from your own shipping and returns policies, such as [ConvoAI](https://convoai.cloud/), keeps those shoppers in the checkout instead of on a competitor's site.",
      },
      { type: "h2", id: "speed", text: "Test speed where it matters: the checkout" },
      {
        type: "p",
        text: "Most speed tests measure the home page. Measure the product page, the basket and the checkout on a phone, because that is where a slow page costs money. Basket and checkout pages cannot be cached the way product pages can, so they depend on the server itself. That is why our [ecommerce hosting](/ecommerce-hosting) is tuned for WooCommerce, with LiteSpeed store caching that speeds up the catalogue while keeping baskets and checkout correct for each shopper.",
      },
      { type: "h2", id: "safety", text: "Set up your safety net" },
      {
        type: "ul",
        items: [
          "**Daily backups that include the database**, because that is where orders live. Restore one to staging before launch to prove it works.",
          "**SSL on every page**, not just the checkout. Every Serverlys plan includes a free, auto-renewing certificate.",
          "**Two-factor authentication** for every account that can see orders or refund money.",
          "**A plan for launch-day traffic.** If you are announcing to a big list, size for the spike. Our guide to [how much hosting you need](/blog/how-much-hosting-do-you-need) helps.",
        ],
      },
      { type: "h2", id: "launch", text: "Then launch, and watch the first week" },
      {
        type: "p",
        text: "For the first week, check every order by hand: payment received, email sent, stock updated, shipped on time. Small problems show up in the first ten orders, not the first thousand.",
      },
      {
        type: "p",
        text: "If you have not chosen a platform yet, start with [WooCommerce vs Shopify](/blog/woocommerce-vs-shopify) and our [online store setup guide](/blog/online-store-setup-guide). If you already run a store elsewhere, our free store migration moves it to [ecommerce hosting](/ecommerce-hosting) for you, so you can run this checklist on the new platform before switching over.",
      },
    ],
  },
  {
    slug: "write-the-answers-your-ai-assistant-gives",
    title: "How to write the answers your AI chat assistant gives",
    description:
      "An AI assistant is only as good as what you give it. What to write, how to structure it, and how to test it so customers get answers you stand behind.",
    category: "AI",
    published: "2026-10-12",
    body: [
      {
        type: "p",
        text: "When an AI chat assistant gives a customer a vague or wrong answer, the instinct is to blame the AI. Most of the time the real cause is simpler: it was never told the answer. It was given a home page, an about page and a few lines of description, then asked about parking, deposits and whether you can do Saturdays.",
      },
      {
        type: "p",
        text: "The assistant cannot know what you have not written down. The good news is that writing it down well is not a technical job. It is the same knowledge you would give a new employee on their first day, organised so it can be found.",
      },
      {
        type: "h2",
        id: "gather",
        text: "Start with the questions you are actually asked",
      },
      {
        type: "p",
        text: "Before writing anything, collect real questions. Go through your inbox, your messages and your phone notes from the last few months, and ask anyone who answers customers what comes up every week. You will usually find the same twenty or thirty questions account for most of what people ask. Those are what your assistant must answer perfectly.",
      },
      { type: "h2", id: "what-to-write", text: "What to write down" },
      {
        type: "p",
        text: "Organise your information under clear headings. For most small businesses, these cover nearly everything:",
      },
      {
        type: "ul",
        items: [
          "**The basics:** what you do, who you serve, where you are, opening hours including holidays, and how to reach a person.",
          "**Services or products:** what each one is, who it suits, what is included, and what it is not.",
          "**Prices:** the prices you are happy to state publicly, starting prices where a quote is needed, and what changes the price.",
          "**Booking and process:** how to book, how far ahead, what happens next, deposits, cancellations.",
          "**Policies:** refunds, returns, guarantees, payment methods, areas you cover.",
          "**The awkward ones:** what you do not do, and where you would send someone instead.",
        ],
      },
      {
        type: "h2",
        id: "how-to-write",
        text: "How to write it so the assistant answers well",
      },
      { type: "h3", text: "Be specific" },
      {
        type: "p",
        text: "'We offer flexible scheduling' gives the assistant nothing to say. 'We take bookings Monday to Saturday, 8am to 6pm, and Sunday by arrangement for jobs over $500' gives it a precise answer it can repeat with confidence.",
      },
      { type: "h3", text: "One fact, one place" },
      {
        type: "p",
        text: "If your opening hours appear in three documents and one is out of date, the assistant may quote the wrong one. Keep each fact in a single place, and when it changes, change it there.",
      },
      { type: "h3", text: "Write the question as well as the answer" },
      {
        type: "p",
        text: "A simple question-and-answer format works well. 'Do you deliver outside the city? Yes, within 30 miles for a $15 fee; further than that, call us for a quote.' Write the question the way customers phrase it, not the way your brochure does.",
      },
      { type: "h3", text: "Say what it should not answer" },
      {
        type: "p",
        text: "Tell the assistant where its job ends: medical, legal or financial advice, complaints, refunds above a certain amount, anything that needs a judgement call. A good assistant hands those to a person with the context written up, rather than guessing.",
      },
      {
        type: "callout",
        title: "Fix the information, not the wording",
        text: "When an answer comes out wrong, resist the urge to add a rule like 'always say X'. Find the missing or contradictory fact and correct it at the source. One fix to the information improves every future answer that depends on it.",
      },
      { type: "h2", id: "test", text: "Test it like a difficult customer" },
      {
        type: "ol",
        items: [
          "Ask your top twenty questions in your own words, then again in the clumsiest phrasing you can imagine.",
          "Ask things you do not do, and check it says so plainly instead of improvising.",
          "Ask for a person, and check the handover actually reaches you.",
          "Read the real conversations every week for the first month. They will show you the questions you forgot to write down.",
        ],
      },
      { type: "h2", id: "where", text: "Putting it to work" },
      {
        type: "p",
        text: "[ConvoAI](https://convoai.cloud/) is built around exactly this process. You describe your business when you create the agent, and on the Pro plan you can upload your own documents (price lists, policies, FAQs) for it to answer from. When it does not know something, it brings in your team instead of guessing, and every conversation lands in one inbox where you can see what customers really ask. You can start on the free plan with no credit card.",
      },
      {
        type: "p",
        text: "If you would rather have it set up for you, including a phone agent as well as chat, our [AI agents service](/ai-agents) can set it up for you, on chat and on the phone. And for a broader view of where AI fits a small business, see [what an AI agent can genuinely do](/blog/what-ai-agents-can-do-for-a-small-business).",
      },
    ],
  },
  {
    slug: "first-week-after-launching-a-website",
    title: "Your website is live. Here is what to do in the first week.",
    description:
      "A day-by-day checklist for the week after launch: get found on Google, make sure forms and email work, set up measurement and protect what you built.",
    category: "Getting started",
    published: "2026-10-12",
    body: [
      {
        type: "p",
        text: "Launching a website feels like the finish line. It is closer to the start. The site exists, but Google may not know about it yet, the contact form has never received a real message, and nobody has checked whether the backups work. The first week is when those gaps are cheapest to close.",
      },
      {
        type: "p",
        text: "Here is a simple plan, one focus a day. None of it needs a developer, and each step takes less than an hour.",
      },
      { type: "h2", id: "day-1", text: "Day 1: check it like a stranger" },
      {
        type: "ul",
        items: [
          "Open every page on your phone and on a computer. Look for broken links, placeholder text and images that do not load.",
          "Make sure the address bar shows the padlock on every page, and that both `www` and the plain domain go to the same place.",
          "Ask someone who has never seen the site to find your phone number and send you a message. Watch where they get stuck.",
        ],
      },
      { type: "h2", id: "day-2", text: "Day 2: make sure messages reach you" },
      {
        type: "ul",
        items: [
          "Submit every form on the site and confirm each message arrives, including in your spam folder. Our [contact form guide](/blog/contact-form-guide) covers the usual fixes.",
          "Use an email address at your own domain for the site and for replies. [Business email](/business-email) from Serverlys starts at $5.95/mo for two mailboxes, plus a one-time $2.95 setup.",
          "Set up SPF, DKIM and DMARC so your messages are trusted. See our guide to [email authentication](/blog/email-security-spf-dkim-dmarc).",
        ],
      },
      { type: "h2", id: "day-3", text: "Day 3: tell Google you exist" },
      {
        type: "ul",
        items: [
          "Add your site to **Google Search Console** and verify it. This is free and shows you how Google sees your site.",
          "Submit your sitemap (often at `/sitemap.xml`) in Search Console, and request indexing for your home page.",
          "If you serve customers locally, create or update your **Google Business Profile** with the same name, phone number and website address as the site. Our [local SEO guide](/blog/local-seo-guide) explains why consistency matters.",
        ],
      },
      { type: "h2", id: "day-4", text: "Day 4: start measuring" },
      {
        type: "ul",
        items: [
          "Install analytics so you can see how many people visit and where they come from. Our [Google Analytics 4 guide](/blog/google-analytics-4-guide) walks through it.",
          "Decide what a successful visit looks like for you (a form sent, a call, a booking) and track that, not just page views.",
          "If you collect data from visitors in regions with privacy laws, add a cookie notice that matches what you actually use. See our note on [GDPR compliance](/blog/gdpr-website-compliance).",
        ],
      },
      { type: "h2", id: "day-5", text: "Day 5: check your speed" },
      {
        type: "p",
        text: "Run your home page and your most important service page through PageSpeed Insights on mobile. If a page is slow, the usual causes on a new site are oversized images and embeds added at the last minute. Our guides to [image optimisation](/blog/image-optimization-web) and the [hidden weight of scripts and embeds](/blog/fonts-scripts-and-embeds-slowing-your-site) cover the fixes.",
      },
      { type: "h2", id: "day-6", text: "Day 6: protect what you built" },
      {
        type: "ul",
        items: [
          "Confirm backups are running, and find out how to restore one. Every Serverlys hosting plan includes free daily backups.",
          "Turn on two-factor authentication for your hosting, your domain registrar and your website admin.",
          "Write down where everything lives: registrar, hosting, email, analytics, and which email address each account uses. Our article on [who has access to your website](/blog/who-has-access-to-your-website) has a template for this.",
          "Check your domain is on auto-renew with a valid card. See [how to make sure your domain belongs to you](/blog/keep-control-of-your-domain).",
        ],
      },
      {
        type: "h2",
        id: "day-7",
        text: "Day 7: tell people, and make it easy to reply",
      },
      {
        type: "ul",
        items: [
          "Add the website to your email signature, social profiles, invoices and printed materials.",
          "Tell existing customers. They are the people most likely to visit, share and leave a review.",
          "Think about what happens when someone visits at 10pm with a question. A chat assistant like [ConvoAI](https://convoai.cloud/) can answer from your own information and pass the conversation to you in the morning, and it has a free plan to try it.",
        ],
      },
      {
        type: "callout",
        title: "Then set a monthly reminder",
        text: "Most of this week is a one-off. Three things are not: check that forms still deliver, check that backups still run, and read your analytics. Fifteen minutes once a month keeps a new site from quietly decaying.",
      },
      { type: "h2", id: "next", text: "If you have not launched yet" },
      {
        type: "p",
        text: "Start with [how much a website costs](/blog/website-cost-guide) and [how much hosting you actually need](/blog/how-much-hosting-do-you-need). Our plans start at $7.95/mo, renewing at $12.62/mo, with SSL, daily backups and free migration included; [compare them here](/pricing). And if you would rather have the site built for you, our [website design](/website-design) team builds it, hosts it and wires in analytics from day one.",
      },
    ],
  },
  {
    slug: "answer-every-website-visitor-with-convoai",
    title: "Your website never closes. Now it can answer, too.",
    description:
      "ConvoAI puts an AI agent on your website that answers questions, books appointments and hands real conversations to your team. Start free today.",
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
          [
            "Channels",
            "Website messenger, WhatsApp and email",
            "Website messenger, WhatsApp and email",
          ],
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
      {
        type: "h2",
        id: "term-length",
        text: "If a provider sells you a term, price the whole term",
      },
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
      {
        type: "h2",
        id: "stage-first",
        text: "Build it on the new host before you point anything at it",
      },
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
      {
        type: "h2",
        id: "signals",
        text: "The signals that you have outgrown your plan",
      },
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
