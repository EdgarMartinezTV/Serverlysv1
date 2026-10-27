/**
 * Five articles published 2026-10-25, each aimed at a search the archive did
 * not answer yet: AI phone answering, domain vs hosting, "why isn't my site on
 * Google", accessibility (WCAG 2.2) and bilingual English/Spanish sites.
 *
 * Same editorial rules as original.ts: no invented statistics, customer
 * counts, case studies or quotes. Prices come from data/pricing.ts and
 * data/tlds.ts; legal facts link to their primary source. Kept in their own
 * file so original.ts stays reviewable.
 */
import type { Article } from "./types";

export const batch20261025: readonly Article[] = [
  {
    slug: "ai-receptionist-for-small-business",
    title: "AI receptionist for small business: a buyer's guide",
    description:
      "An AI receptionist answers your business phone, books appointments and sends you the transcript. How it works, its limits, and what to check before you buy.",
    category: "AI",
    published: "2026-10-25",
    body: [
      {
        type: "p",
        text: "Every small business has the same blind spot: the phone rings while you are with a customer, on a job, driving or asleep. Some of those callers leave a voicemail. Many simply call the next business on the list. An **AI receptionist** is a voice agent that picks up those calls for you, talks with the caller in natural language, takes the details or books the appointment, and sends you a summary with the full transcript.",
      },
      {
        type: "p",
        text: "This guide explains how an AI receptionist works under the hood, what it is genuinely good at, where it still needs a person, and the checklist we would use before putting one on a real business line. If you want to hear one first, there is a sample call on the [Serverlys homepage](/#grow) in the section about missed calls.",
      },
      { type: "h2", id: "what-it-is", text: "What an AI receptionist actually is" },
      {
        type: "p",
        text: "It is not a phone menu. An old-style auto-attendant plays a recording and asks the caller to \"press 2 for bookings\". An AI receptionist holds a conversation: the caller says what they want in their own words, and the agent answers, asks follow-up questions and acts on the answer.",
      },
      { type: "p", text: "Three pieces of technology make that possible, and they run in a loop many times per call:" },
      {
        type: "ol",
        items: [
          "**Speech recognition** turns what the caller says into text as they speak.",
          "**A language model** reads that text along with your business information (hours, services, prices, booking rules) and decides what to say or do next.",
          "**Speech synthesis** turns the reply back into a natural-sounding voice.",
        ],
      },
      {
        type: "p",
        text: "Around that loop sit the parts that make it useful for a business rather than a demo: a phone number, a connection to your calendar or booking system, the ability to transfer the call to a person, and a summary sent to you when the call ends.",
      },
      { type: "h2", id: "what-it-handles", text: "What it handles well" },
      {
        type: "ul",
        items: [
          "**After-hours and overflow calls.** The most common setup: your phone rings as usual, and only calls you do not answer are forwarded to the agent.",
          "**Booking and rescheduling.** Checking open slots, taking a name and number, confirming by text.",
          "**Repeat questions.** Opening hours, location, parking, whether you serve a particular area, what a service includes.",
          "**Taking a proper message.** Instead of a garbled voicemail, you get the caller's name, number, what they need and how urgent it is, in writing.",
          "**Qualifying leads.** Asking the two or three questions you would ask anyway (address, size of the job, budget range) before the call reaches you.",
        ],
      },
      { type: "h2", id: "where-it-needs-a-person", text: "Where it still needs a person" },
      {
        type: "p",
        text: "A good setup is honest about its limits. These calls should go to a human, and the agent should know how to get them there:",
      },
      {
        type: "ul",
        items: [
          "Complaints and anything emotional, where the caller needs to feel heard by a person.",
          "Quotes that depend on judgement you have not written down.",
          "Emergencies. An AI receptionist is not an emergency line, and its script should say so plainly.",
          "Payments over the phone. Card details should go through a proper payment link, not be read out to any phone agent.",
        ],
      },
      {
        type: "callout",
        title: "The transfer is the feature",
        text: "When you compare products, test the handover as hard as the answering. A caller who asks for a person should reach one, or get a clear promise of a callback, in one step.",
      },
      { type: "h2", id: "how-calls-reach-it", text: "How calls reach the agent" },
      {
        type: "p",
        text: "You usually keep your existing business number. There are two common ways to route calls to the agent:",
      },
      {
        type: "table",
        head: ["Setup", "How it works", "Best for"],
        rows: [
          [
            "Conditional forwarding",
            "Your phone rings first; unanswered or busy calls forward to the agent's number.",
            "Owners who want to answer when they can.",
          ],
          [
            "Agent answers first",
            "All calls go to the agent, which transfers to you when needed.",
            "Busy lines, or businesses with no one free to answer.",
          ],
          [
            "After-hours only",
            "Forwarding switches on outside opening hours.",
            "Shops and offices with set hours.",
          ],
        ],
      },
      {
        type: "p",
        text: "Forwarding codes differ between carriers and phone systems, so check your provider's instructions rather than copying codes from a forum.",
      },
      { type: "h2", id: "checklist", text: "The checklist before you switch one on" },
      { type: "h3", text: "1. Call it yourself, more than once" },
      {
        type: "p",
        text: "Call from a mobile in a noisy room. Interrupt it mid-sentence. Change your mind halfway through a booking. Spell an unusual surname. A good agent stops talking when you interrupt, copes with background noise and confirms details back to you.",
      },
      { type: "h3", text: "2. Listen for the pauses" },
      {
        type: "p",
        text: "Response time is what makes a call feel human or robotic. Long silences after every answer make callers say \"hello?\" and talk over the agent. Test at a busy time of day, not only at night.",
      },
      { type: "h3", text: "3. Check what it says about your business" },
      {
        type: "p",
        text: "Ask it your ten most common questions. Every answer should come from information you gave it. If it guesses a price or invents a policy, the knowledge it was given needs fixing before it goes live. We wrote a separate guide on [writing the answers your AI assistant gives](/blog/write-the-answers-your-ai-assistant-gives).",
      },
      { type: "h3", text: "4. Read the transcripts for a week" },
      {
        type: "p",
        text: "Every call should leave a written record: who called, what they wanted, what was agreed. The first week of transcripts is the best training material you will ever get, because it shows the questions real callers ask, in their words.",
      },
      { type: "h3", text: "5. Recording and disclosure" },
      {
        type: "p",
        text: "If calls are recorded, the law in your state applies. Several US states, including California and Florida, require **every party's consent** to record a call. The simple answer is a short line at the start of the call saying it may be recorded. Some businesses also tell callers they are speaking with a virtual assistant, which avoids confusion and tends to make callers more patient.",
      },
      { type: "h3", text: "6. Spam and runaway calls" },
      {
        type: "p",
        text: "Robocalls will reach the agent too, and every minute costs money on a per-minute plan. Ask how the product blocks spam, what the maximum call length is, and what happens when a caller goes silent.",
      },
      { type: "h3", text: "7. Outbound calls are a different rulebook" },
      {
        type: "p",
        text: "Answering calls is one thing; calling people is another. In February 2024 the FCC ruled that AI-generated voices count as \"artificial\" voices under the Telephone Consumer Protection Act, so automated outbound calls need the same prior consent as any robocall. If a product offers outbound campaigns, make sure you have that consent before using them.",
      },
      { type: "h2", id: "cost", text: "How AI receptionists are priced" },
      {
        type: "p",
        text: "Most products charge one of three ways: a monthly fee with a minute allowance, a pure per-minute rate, or a flat monthly fee with fair-use limits. To compare them honestly, estimate how many calls you miss in a typical week and how long they last, then price that volume on each plan. Watch for setup fees, a charge per phone number, and overage rates beyond the allowance.",
      },
      {
        type: "p",
        text: "The useful comparison is not against a human receptionist's salary. It is against the value of the calls that currently go to voicemail and never call back.",
      },
      { type: "h2", id: "phone-and-chat", text: "Phone and website: the same job on two channels" },
      {
        type: "p",
        text: "Callers and website visitors want the same things: an answer now, and a booking without waiting. Many businesses run a voice agent on the phone and a chat agent on the website, trained on the same information so both give the same answers. Our guide to [what AI agents can do for a small business](/blog/what-ai-agents-can-do-for-a-small-business) covers both, and [answering every website visitor with ConvoAI](/blog/answer-every-website-visitor-with-convoai) covers the chat side in detail.",
      },
      {
        type: "callout",
        title: "The short version",
        text: "An AI receptionist answers the calls you miss, books the slot and leaves you a transcript instead of a voicemail. Test it by calling it yourself, make sure it hands over to a person cleanly, keep its answers to facts you supplied, and check your state's call-recording rules. Serverlys offers this as [CallFlow](https://callflow.serverlys.com/); the [AI agents page](/ai-agents) shows how it fits with website chat.",
      },
    ],
  },

  {
    slug: "domain-vs-hosting",
    title: "Domain vs hosting: the difference, and do you need both?",
    description:
      "A domain is your website's address; hosting is the server that holds it. How they fit together, what each costs, and the mistakes that trip up beginners.",
    category: "Domains",
    published: "2026-10-25",
    body: [
      {
        type: "p",
        text: "If you are building your first website, two words come up immediately and are often used as if they mean the same thing: **domain** and **hosting**. They are separate products, usually bought separately, and you need both for a website to work. The difference takes one sentence: **the domain is the address, the hosting is the building.**",
      },
      { type: "h2", id: "what-is-a-domain", text: "What is a domain?" },
      {
        type: "p",
        text: "A domain name is the address people type to reach your site, like `yourbusiness.com`. You do not buy it outright; you **register** it for a period, usually one year at a time, and renew it to keep it. While it is registered to you, nobody else can use that name.",
      },
      {
        type: "p",
        text: "A domain on its own does not show anything. It is a name that points somewhere. Behind the scenes, the Domain Name System (DNS) translates the name into the numeric address of the server that actually holds your website. Our guide to [DNS records](/blog/dns-records-explained) covers that translation in detail.",
      },
      { type: "h2", id: "what-is-hosting", text: "What is web hosting?" },
      {
        type: "p",
        text: "Hosting is space on a server, a computer that is always on and connected to the internet, that stores your website's files and database and sends them to every visitor's browser. When you \"buy hosting\" you are renting part of that server, plus the work of keeping it running, secure and backed up.",
      },
      {
        type: "p",
        text: "Hosting comes in different sizes. Most small business sites start on shared or cloud hosting and only move up when traffic or software demands it. If you are unsure which size you need, read [how much hosting your website actually needs](/blog/how-much-hosting-do-you-need) and [shared, cloud, VPS or dedicated](/blog/shared-cloud-vps-or-dedicated).",
      },
      { type: "h2", id: "side-by-side", text: "Domain vs hosting, side by side" },
      {
        type: "table",
        head: ["", "Domain", "Hosting"],
        rows: [
          ["What it is", "Your address on the internet", "The server that stores and serves your site"],
          ["Example", "`yourbusiness.com`", "A cloud hosting plan"],
          ["How you pay", "Yearly registration and renewal", "Monthly or yearly plan"],
          ["Without the other", "A name that points nowhere", "A site with no memorable address"],
          ["Can you move it?", "Yes, transfer to another registrar", "Yes, migrate to another host"],
        ],
      },
      { type: "h2", id: "do-you-need-both", text: "Do you need both?" },
      {
        type: "p",
        text: "For a real business website, yes. There are only two exceptions, and both have a catch:",
      },
      {
        type: "ul",
        items: [
          "**Website builders** often bundle hosting and a domain into one subscription. That is convenient, but the domain is still a separate registration underneath. Make sure it is registered in your name, so you can take it with you if you ever leave.",
          "**Free subdomains** like `yourbusiness.somebuilder.com` work without buying a domain, but they look temporary to customers and you never own the address.",
        ],
      },
      {
        type: "p",
        text: "You can also own a domain without hosting, which is useful for reserving a name before you are ready to build, or for protecting a misspelling of your main name.",
      },
      { type: "h2", id: "email", text: "Where business email fits in" },
      {
        type: "p",
        text: "An address like `hello@yourbusiness.com` needs the domain (for the name) and an email service (for the mailbox). The domain's MX records tell the world which server receives your mail. Email can come with your hosting or from a separate provider; either way, it depends on the domain staying registered. Our [business email setup guide](/blog/setup-business-email) walks through it, and [SPF, DKIM and DMARC](/blog/email-security-spf-dkim-dmarc) keeps your mail out of spam folders.",
      },
      { type: "h2", id: "connect-them", text: "How a domain and hosting are connected" },
      {
        type: "p",
        text: "If you buy both from the same company, they are usually connected for you. If not, you connect them in one of two ways:",
      },
      {
        type: "ol",
        items: [
          "**Change the nameservers** at your registrar to the ones your host gives you. Your host then manages all of the domain's DNS records. See [nameservers explained](/blog/nameservers-explained).",
          "**Keep DNS at the registrar** and point an `A` record (and usually a `www` record) at your host's server address. Useful when other services, like email, are already set up there.",
        ],
      },
      {
        type: "p",
        text: "DNS changes can take a little while to reach every network, so a newly connected domain may work on one device before another.",
      },
      { type: "h2", id: "costs", text: "What each one costs" },
      {
        type: "p",
        text: "At Serverlys, a `.com` costs **$14.95 for the first year**; other extensions are listed on the [domain search page](/domain-name). Hosting starts at **$7.95 a month and renews at $12.62 a month**, plus a one-off $2.95 setup fee, on the entry cloud plan. We show both numbers because the renewal price is the one you will pay for longest; [how to read hosting renewal pricing](/blog/how-to-read-hosting-renewal-pricing) explains why that matters with any host.",
      },
      {
        type: "callout",
        title: "Watch the renewal price on domains too",
        text: "A very cheap first year on a domain often renews at a much higher rate. Check the renewal price before you register, especially on newer extensions.",
      },
      { type: "h2", id: "mistakes", text: "Mistakes that cause most first-website headaches" },
      {
        type: "ul",
        items: [
          "**Registering the domain in someone else's name.** A designer or agency registers it \"to save you the trouble\", then leaves. Keep the registration and the login in your own name. More in [keep control of your domain](/blog/keep-control-of-your-domain).",
          "**Letting the domain expire.** When a domain lapses, the website and every email address on it stop working. Turn on auto-renew and keep the payment card current.",
          "**Assuming the domain moves with the hosting.** Moving your website to a new host does not move the domain, and the reverse is also true. They are separate.",
          "**Transferring right after registering.** Under ICANN rules a domain generally cannot be transferred to another registrar for 60 days after registration or a previous transfer. Plan around it.",
          "**Skipping WHOIS privacy.** Without it, your name and contact details can appear in public domain records. See [WHOIS privacy protection](/blog/whois-privacy-protection).",
        ],
      },
      {
        type: "callout",
        title: "The short version",
        text: "The domain is your address; the hosting is the server that holds your site. You need both, ideally both in your own name, connected through DNS. [Search for a domain](/domain-name), compare [hosting plans](/pricing), or ask us and we will set the two up together.",
      },
    ],
  },

  {
    slug: "website-not-showing-on-google",
    title: "Website not showing up on Google? 9 causes and fixes",
    description:
      "Not on Google? It is usually one of nine causes, from a leftover noindex tag to a new site Google hasn't found yet. How to check and fix each one.",
    category: "Getting started",
    published: "2026-10-25",
    body: [
      {
        type: "p",
        text: "You launched the website, searched for your business on Google, and nothing came up. It is one of the most common worries after a launch, and the good news is that the cause is almost always findable with free tools in under an hour. This guide goes from the most common cause to the least, with a way to check each one.",
      },
      {
        type: "p",
        text: "First, separate two different problems. **Not indexed** means Google does not have your page at all. **Not ranking** means Google has it but shows other pages above it. The fixes are different, so start by finding out which one you have.",
      },
      { type: "h2", id: "step-one", text: "Step one: is the site indexed at all?" },
      {
        type: "p",
        text: "Search Google for `site:yourbusiness.com`. If results appear, Google has indexed at least part of your site, and your problem is more likely ranking. If nothing appears, it is an indexing problem, and causes 1 to 6 below are where to look.",
      },
      {
        type: "p",
        text: "The `site:` search is a rough check. For an exact answer, set up **Google Search Console**, Google's free tool for site owners. Add your site, verify that you own it (a DNS record is the most reliable method), then use the **URL Inspection** tool on your homepage. It tells you whether that page is in Google's index and, if not, why.",
      },
      { type: "h2", id: "too-new", text: "1. The site is simply too new" },
      {
        type: "p",
        text: "Google has to discover a site before it can index it, and a brand-new domain with no links pointing to it can take days or weeks to be found. Speed it up by submitting a sitemap in Search Console (most site platforms create one at `/sitemap.xml`) and using **Request indexing** in URL Inspection for your most important pages.",
      },
      { type: "h2", id: "noindex", text: "2. A noindex setting is blocking it" },
      {
        type: "p",
        text: "This is the most common cause of a site that never appears, and it is usually left over from building. A `noindex` instruction tells Google not to show a page in results. Places to check:",
      },
      {
        type: "ul",
        items: [
          "**WordPress:** Settings → Reading → \"Discourage search engines from indexing this site\". It must be unticked on a live site.",
          "**SEO plugins:** pages or whole content types set to noindex.",
          "**Website builders:** a \"hide from search engines\" or \"password protect\" option left on after launch.",
        ],
      },
      {
        type: "p",
        text: "URL Inspection will report \"Excluded by 'noindex' tag\" if this is the cause.",
      },
      { type: "h2", id: "robots", text: "3. robots.txt is telling Google to stay out" },
      {
        type: "p",
        text: "Open `yourbusiness.com/robots.txt` in a browser. A line that reads `Disallow: /` under `User-agent: *` blocks crawlers from the whole site. It is a common leftover from a staging copy. Remove it, then request indexing again.",
      },
      { type: "h2", id: "staging", text: "4. Google is looking at the wrong address" },
      {
        type: "p",
        text: "If the site was built on a temporary address and then moved, Google may have found the temporary one first, or every page may point to it through a **canonical** tag. Check that the live site's pages declare the live address as canonical, that the temporary copy is password-protected or set to noindex, and that the old address redirects to the new one. The same applies to `http` vs `https` and `www` vs non-`www`: pick one version and redirect the rest to it. Our guide to [.htaccess redirects](/blog/htaccess-redirects) shows the common patterns.",
      },
      { type: "h2", id: "server-errors", text: "5. The server is returning errors" },
      {
        type: "p",
        text: "If Google's crawler gets an error or a timeout when it visits, it cannot index the page. Search Console's **Pages** report lists server errors (5xx) and pages not found (404). Slow or unreliable hosting shows up here first. See [hosting uptime explained](/blog/hosting-uptime-explained) and [how to reduce TTFB](/blog/reduce-ttfb).",
      },
      { type: "h2", id: "javascript", text: "6. The content only appears after JavaScript runs" },
      {
        type: "p",
        text: "Google can render JavaScript, but sites that load all of their text through scripts are harder to index reliably, and other search and AI crawlers often do not run scripts at all. In URL Inspection, use **View crawled page** to see what Google actually received. If your headings and text are missing there, the site needs server-side rendering or pre-rendering.",
      },
      { type: "h2", id: "thin-content", text: "7. Pages are indexed but have little to rank on" },
      {
        type: "p",
        text: "A homepage with a logo, one sentence and a contact button gives Google very little to match against a search. Each important service deserves its own page that says, in plain words, what you do, where you do it and who it is for. A page titled \"Services\" ranks for nothing; a page titled \"Emergency plumbing repair in Doral\" can.",
      },
      { type: "h2", id: "competition", text: "8. Other sites are simply ahead for that search" },
      {
        type: "p",
        text: "If you search for a broad phrase like \"bakery\" or \"web design\", you are competing with every business in the country. Search instead for your exact business name: a new site should appear for that first. Ranking for competitive phrases takes useful content, a fast site and other sites linking to you, which is a longer project. Start with the [local SEO guide](/blog/local-seo-guide) and the [WordPress SEO guide](/blog/wordpress-seo-guide).",
      },
      { type: "h2", id: "manual-action", text: "9. A manual action or security issue" },
      {
        type: "p",
        text: "Rarely, Google removes a site from results because it was hacked or broke Google's spam policies. Search Console has a **Manual actions** report and a **Security issues** report; both should read \"No issues detected\". If your site was hacked, follow [our recovery guide](/blog/website-hacked-recovery) before requesting a review.",
      },
      { type: "h2", id: "local", text: "Local businesses: the map results are separate" },
      {
        type: "p",
        text: "The map and business listings at the top of local searches come from **Google Business Profile**, not from your website alone. If you serve customers in a specific area, create and verify your profile, choose accurate categories, and link it to your website. It is often the fastest way for a new local business to appear on Google at all.",
      },
      { type: "h2", id: "ai-search", text: "And in AI answers" },
      {
        type: "p",
        text: "More people now ask ChatGPT or Google's AI answers instead of scrolling results. Most of what helps Google helps there too, plus a few extra steps covered in [how to get recommended by ChatGPT and AI search](/blog/get-recommended-by-chatgpt-and-ai-search).",
      },
      {
        type: "callout",
        title: "The short version",
        text: "Search `site:yourdomain.com`, then set up Google Search Console and inspect your homepage. Most missing sites are new, set to noindex, blocked in robots.txt or pointing at the wrong address, and all four are quick to fix. If you would rather hand it over, our [SEO service](/seo) starts with exactly this audit.",
      },
    ],
  },

  {
    slug: "website-accessibility-checklist",
    title: "Website accessibility checklist for small businesses (WCAG 2.2)",
    seoTitle: "Small business website accessibility checklist (WCAG 2.2)",
    description:
      "A plain-English website accessibility checklist based on WCAG 2.2 AA, with quick checks a small business can run itself and what the law says today.",
    category: "Getting started",
    published: "2026-10-25",
    body: [
      {
        type: "p",
        text: "An accessible website is one that people with disabilities can use: someone who is blind and uses a screen reader, someone who cannot use a mouse, someone with low vision who zooms the page to 200%, someone who is colour-blind. Making a site accessible is also good business. The same fixes make pages clearer for everyone, work better on phones, and are easier for search engines and AI assistants to understand.",
      },
      {
        type: "p",
        text: "This checklist follows **WCAG 2.2 Level AA**, the current version of the Web Content Accessibility Guidelines published by the W3C in October 2023. It is written for business owners, not developers: each item says what to check and how to check it yourself.",
      },
      { type: "h2", id: "the-law", text: "What the law says, briefly" },
      {
        type: "p",
        text: "In the United States, the Department of Justice's position is that the Americans with Disabilities Act applies to the websites of businesses open to the public; its [guidance on web accessibility](https://www.ada.gov/resources/web-guidance/) says so directly. There is still no federal regulation that sets a specific technical standard for private businesses, so courts and settlements commonly point to WCAG as the benchmark.",
      },
      {
        type: "p",
        text: "For state and local governments, a 2024 DOJ rule adopted WCAG 2.1 Level AA as the required standard. In April 2026 the DOJ extended that rule's compliance dates by one year, to April 2027 for larger public entities and April 2028 for smaller ones. Meeting WCAG 2.2 AA also meets 2.1 AA, because 2.2 builds on it.",
      },
      {
        type: "callout",
        title: "Not legal advice",
        text: "This article explains the technical standard. If you have received a demand letter or need a compliance opinion, speak to a lawyer who handles ADA matters.",
      },
      { type: "h2", id: "five-minute-checks", text: "Five checks you can run in ten minutes" },
      {
        type: "ol",
        items: [
          "**Unplug the mouse.** Press Tab repeatedly from the top of your homepage. You should be able to reach every link, button and form field, see clearly where you are at each step, and use the menu and booking form with the keyboard alone.",
          "**Zoom to 200%.** In your browser, zoom in twice. Text should get bigger without overlapping, being cut off or forcing you to scroll sideways to read a line.",
          "**Read the images out loud.** For each meaningful image, would its description make sense to someone who cannot see it? Most site editors have an \"alt text\" field for this.",
          "**Check the contrast.** Light grey text on white is the most common failure. Use a free contrast checker on your body text and buttons.",
          "**Try the forms.** Leave a required field empty and submit. The error should say what went wrong, in words, next to the field, not only by turning it red.",
        ],
      },
      { type: "h2", id: "content", text: "Content: what everyone writes" },
      {
        type: "ul",
        items: [
          "**Alt text on informative images.** Describe what the image tells the reader. Decorative images get empty alt text so screen readers skip them.",
          "**Real headings in order.** One main heading per page, then sections and subsections, using the heading styles in your editor rather than bold text made bigger.",
          "**Descriptive links.** \"See our pricing\" instead of \"click here\". Screen reader users often jump from link to link, and \"click here\" ten times tells them nothing.",
          "**Captions and transcripts.** Videos with speech need captions; audio-only content needs a transcript.",
          "**Plain language.** Short sentences and common words help people with cognitive disabilities, and everyone else.",
          "**Do not rely on colour alone.** \"Required fields are in red\" fails for colour-blind visitors. Add an asterisk or the word \"required\".",
        ],
      },
      { type: "h2", id: "design", text: "Design: how the page looks" },
      {
        type: "table",
        head: ["Check", "WCAG 2.2 AA requirement"],
        rows: [
          ["Body text contrast", "At least 4.5:1 against its background"],
          ["Large text contrast (about 24px, or 19px bold)", "At least 3:1"],
          ["Buttons, form borders, icons", "At least 3:1 against what is next to them"],
          ["Click and tap targets", "At least 24×24 CSS pixels, or enough space around them"],
          ["Zoom and reflow", "Usable at 200% zoom and at 320px wide without sideways scrolling"],
          ["Keyboard focus", "Always visible, and not hidden behind sticky headers or banners"],
        ],
      },
      { type: "h2", id: "whats-new-in-2-2", text: "What WCAG 2.2 added" },
      {
        type: "p",
        text: "If your site was built against WCAG 2.1, these are the new Level A and AA requirements to check:",
      },
      {
        type: "ul",
        items: [
          "**Focus not obscured:** a sticky header, cookie banner or chat window must not completely cover the element that has keyboard focus.",
          "**Target size (minimum):** small tap targets, like tiny icons packed close together, need to be at least 24×24 pixels or have spacing around them.",
          "**Dragging movements:** anything done by dragging, such as a slider or a map, must also work with a simple click or tap.",
          "**Consistent help:** if you offer help (a phone number, chat, a contact link), put it in the same place on every page.",
          "**Redundant entry:** do not make people type the same information twice in one process; fill it in for them or let them select it.",
          "**Accessible authentication:** logins must not depend on remembering or transcribing something, such as a puzzle, unless there is an alternative. Allowing password managers and paste helps here.",
        ],
      },
      { type: "h2", id: "code", text: "Code: what your developer checks" },
      {
        type: "ul",
        items: [
          "The page declares its language (`lang=\"en\"`, or `lang=\"es\"` on Spanish pages).",
          "Every form field has a real label connected to it, not only placeholder text.",
          "Custom menus, tabs and pop-ups work with the keyboard and announce their state to screen readers.",
          "Pop-ups and dialogs can be closed with the Escape key and return focus to where the user was.",
          "Animation respects the \"reduce motion\" setting on the visitor's device.",
          "Nothing flashes more than three times per second.",
        ],
      },
      { type: "h2", id: "overlays", text: "A word on accessibility overlay widgets" },
      {
        type: "p",
        text: "Some products promise to make any site compliant by adding one script. They can offer useful display options, but they cannot fix missing alt text, unlabeled forms or a menu that keyboard users cannot open, because those problems live in the site itself. Treat an overlay as an extra at most, never as the fix.",
      },
      { type: "h2", id: "testing", text: "How to test properly" },
      {
        type: "p",
        text: "Automated checkers such as browser accessibility audits find a useful share of problems quickly: missing alt text, low contrast, unlabeled fields. They cannot judge whether alt text is meaningful or whether a booking flow makes sense with a screen reader. Combine an automated scan with the manual checks above, and ideally a test with the screen reader built into your phone or computer (VoiceOver on Apple devices, TalkBack on Android, Narrator on Windows).",
      },
      { type: "h2", id: "statement", text: "Publish an accessibility statement" },
      {
        type: "p",
        text: "Add a page that says which standard you aim for, known limitations you are working on, and how someone can contact you if they hit a barrier. It shows good faith and gives visitors a way to reach you before they give up. Serverlys publishes [its own](/accessibility).",
      },
      {
        type: "callout",
        title: "The short version",
        text: "Aim for WCAG 2.2 Level AA. Test with the keyboard, zoom to 200%, check contrast and alt text, and make forms explain their errors in words. Fix problems in the site itself rather than relying on an overlay, and publish an accessibility statement. If you would like help, our [website design](/website-design) team builds to this standard.",
      },
    ],
  },

  {
    slug: "bilingual-website-english-spanish",
    title: "How to build a bilingual website in English and Spanish",
    description:
      "How to build an English and Spanish website: URL structure, hreflang, translation, language switchers, and the SEO mistakes that hide one language from Google.",
    category: "Getting started",
    published: "2026-10-25",
    body: [
      {
        type: "p",
        text: "If your customers speak English and Spanish, your website should too. A properly built bilingual site does more than translate the words: each language gets its own pages that Google can index separately, so a customer who searches in Spanish finds your Spanish page, and the one who searches in English finds the English one.",
      },
      {
        type: "p",
        text: "This guide covers the decisions that matter, in the order you will face them, and the mistakes that most often make one language invisible in search.",
      },
      { type: "h2", id: "structure", text: "1. Choose a URL structure" },
      {
        type: "p",
        text: "Each language needs its own address. Google recommends against showing different languages at the same URL depending on the visitor's browser or cookies, because its crawler would only ever see one version. There are three common structures:",
      },
      {
        type: "table",
        head: ["Structure", "Example", "Notes"],
        rows: [
          [
            "Subdirectory",
            "`yourbusiness.com/es/`",
            "Simplest to run and the usual choice for a local business. Both languages share one domain's authority.",
          ],
          [
            "Subdomain",
            "`es.yourbusiness.com`",
            "Works, but is set up and tracked more like a separate site.",
          ],
          [
            "Separate domain",
            "`yourbusiness.mx`",
            "For a business that genuinely serves another country, not just another language.",
          ],
        ],
      },
      {
        type: "p",
        text: "For a US business serving English and Spanish speakers in the same city, a `/es/` subdirectory is almost always the right answer. Our guide to [subdomains vs subdirectories](/blog/subdomain-vs-subdirectory) covers the trade-offs in more depth.",
      },
      { type: "h2", id: "translation", text: "2. Translate for people, not word by word" },
      {
        type: "p",
        text: "Machine translation is a reasonable first draft and a poor final one. It misses tone, mistranslates industry terms and produces phrases no native speaker would use, and customers notice immediately. Have a fluent speaker who knows your trade review every page, and decide early on a few questions:",
      },
      {
        type: "ul",
        items: [
          "**Tú or usted?** Usted is more formal and safer for professional services; tú feels warmer for retail and food. Pick one and use it everywhere.",
          "**Which Spanish?** Write for the people you serve. A Miami audience, a Texas audience and a customer in Spain use different words for the same things.",
          "**Keep names consistent.** Decide which service and product names stay in English and which are translated, then stick to it.",
          "**Translate everything on the page,** including buttons, form labels, error messages, image alt text and the confirmation email.",
        ],
      },
      { type: "h2", id: "hreflang", text: "3. Tell Google the pages are translations of each other" },
      {
        type: "p",
        text: "The `hreflang` annotation tells search engines that two pages are the same content in different languages, so they show the right one to each searcher instead of treating them as duplicates. Each page lists every version, including itself:",
      },
      {
        type: "code",
        lang: "html",
        code: '<link rel="alternate" hreflang="en" href="https://yourbusiness.com/services/" />\n<link rel="alternate" hreflang="es" href="https://yourbusiness.com/es/servicios/" />\n<link rel="alternate" hreflang="x-default" href="https://yourbusiness.com/services/" />',
      },
      { type: "p", text: "The rules that trip people up:" },
      {
        type: "ul",
        items: [
          "**It must be reciprocal.** If the English page points to the Spanish one, the Spanish page must point back. One-way annotations are ignored.",
          "**Use full URLs**, including `https://`.",
          "**Each page is its own canonical.** The Spanish page's canonical tag points to the Spanish page, never to the English one, or Google may drop it from results.",
          "**Add an x-default entry** (`x-default`) for the version shown to everyone else, usually English.",
          "**Language codes are ISO codes:** `es` for Spanish in general, or `es-US` if you specifically target Spanish speakers in the United States.",
        ],
      },
      {
        type: "p",
        text: "Most site platforms and multilingual plugins write these tags for you. After launch, view the page source of one English and one Spanish page and check that both sets are present and point at each other.",
      },
      { type: "h2", id: "html-lang", text: "4. Set the page language" },
      {
        type: "p",
        text: "Each page should declare its language in the HTML, `lang=\"es\"` on Spanish pages. Screen readers use it to switch pronunciation; without it, a Spanish page is read aloud with English pronunciation, which is close to unusable. It is also one of the checks in our [website accessibility checklist](/blog/website-accessibility-checklist).",
      },
      { type: "h2", id: "switcher", text: "5. Add a language switcher people can find" },
      {
        type: "ul",
        items: [
          "Put it in the header, on every page, in the same place.",
          "Label each language in its own language: \"English\" and \"Español\", not \"Spanish\".",
          "Avoid flags. A flag is a country, not a language, and Spanish is spoken in more than twenty countries.",
          "Link to the **same page** in the other language, not back to the homepage.",
          "Remember the visitor's choice for the rest of their visit.",
        ],
      },
      {
        type: "callout",
        title: "Do not redirect automatically",
        text: "Sending visitors to a language based on their browser settings or location sounds helpful but backfires: bilingual visitors get the wrong one, and Google's crawler may never see the other version. Suggest a language with a small banner if you like, but let the visitor choose.",
      },
      { type: "h2", id: "local-seo", text: "6. Local search in both languages" },
      {
        type: "p",
        text: "People search differently in each language, so research keywords separately rather than translating your English ones. \"Plomero cerca de mí\" and \"plumber near me\" are different searches with different competition. On Google Business Profile, you can mention that you serve customers in Spanish, and reviews in either language help. More in the [local SEO guide](/blog/local-seo-guide).",
      },
      { type: "h2", id: "everything-else", text: "7. The parts people forget" },
      {
        type: "ul",
        items: [
          "Contact and booking forms, their error messages and the confirmation emails.",
          "Your chat widget and any AI assistant: it should answer in the language the visitor writes in.",
          "Phone answering: if Spanish-speaking customers call, someone or something should answer in Spanish. See [AI receptionists for small business](/blog/ai-receptionist-for-small-business).",
          "Legal pages, cookie banners and policies.",
          "Page titles and meta descriptions for every Spanish page, written in Spanish.",
          "The Spanish sitemap entries, so Google finds the new pages quickly.",
        ],
      },
      { type: "h2", id: "maintenance", text: "8. Keep both languages in step" },
      {
        type: "p",
        text: "The most common way bilingual sites fail is not at launch but six months later, when prices change on the English page and nobody updates the Spanish one. Make updating both versions part of the same task, and if a page cannot be translated yet, leave it out of the Spanish menu rather than linking to an English page that pretends to be Spanish.",
      },
      {
        type: "callout",
        title: "The short version",
        text: "Give each language its own URLs (a `/es/` folder is usually best), have a fluent speaker review every translation, connect the pages with reciprocal hreflang tags, set `lang` on every page, and never auto-redirect by browser language. Serverlys builds bilingual sites as part of [website design](/website-design); our [Spanish restaurant website page](/es/restaurant-websites) is one example of the structure.",
      },
    ],
  },
];
