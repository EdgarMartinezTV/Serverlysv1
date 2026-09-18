/**
 * /website-development — copy.
 *
 * LAYOUT is a 1:1 rebuild of dreamhost.com/pro-services/development/ (grid,
 * type scale, section order, measurements — all in `_components/kit.tsx`).
 * TEXT IS NOT. Every sentence below is written for Serverlys.
 *
 * WHY THE REWRITE (2026-09-14): the first pass carried the reference's copy
 * verbatim on instruction. Edgar then asked for Serverlys-original text to
 * avoid trading on someone else's writing. Layout and structure are not
 * protectable and are deliberately kept; the prose is ours.
 *
 * ── THE RULES THIS FILE IS WRITTEN UNDER ─────────────────────────────────────
 *
 * 1. NOTHING FROM THE REFERENCE SURVIVES AS A SENTENCE. Not paraphrased, not
 *    reordered — replaced. Gone with it: "20+ years of development expertise"
 *    (their tenure), "most projects are done within 72 hours" (their delivery
 *    commitment), their $129/$119/$109/$99 rate card and 8/16/23% discounts,
 *    their retainer roll-over and accrual-cap policy, and "we specialize with
 *    WordPress-based websites" (their specialism).
 *
 * 2. NO INVENTED FACTS. Everything here is either verifiable from the rest of
 *    this site or is a statement of approach rather than a claim of fact. No
 *    years in business, no project counts, no turnaround promise, no uptime
 *    figure — `data/navigation.ts` carries the standing rule on that last one.
 *
 * 3. THE RATE CARD IS THE ONE EXCEPTION, and it is Serverlys' own. The prices
 *    in `PLANS` happen to match the reference's exactly; Edgar was asked
 *    directly and confirmed they are his. Every OTHER service page on this site
 *    still publishes no price. See the note on `PLANS` below before touching
 *    those figures.
 *
 * 4. THE ONE THING THAT IS ACTUALLY DIFFERENT ABOUT SERVERLYS gets said plainly
 *    instead of a generic quality claim: the team that builds the site also
 *    runs the infrastructure under it. That is true, it is checkable, and no
 *    competitor page can say it for us.
 *
 * ⚠ TESTIMONIALS ARE PLACEHOLDERS AND GATED. See REVIEWS below —
 *    `npm run check:reviews` fails while they are unreal.
 */

export const HERO = {
  badge: "SERVERLYS: WEB DEVELOPMENT",
  // Two lines and two lines only. The reference's headline sets on two at 80px
  // in a 672px column, and its lede on two at 24px — roughly 60 characters a
  // line. Longer copy here pushes both to three and the band stops matching.
  title: ["Web development", "built around how you work"],
  lede: "The parts of your business that never come in a box. Tell us what it has to do, and we build it.",
  cta: "Start a project",
} as const;

export const EXPERT = {
  title: "The people who build it also run it",
  lede: "Most web work is handed to a developer, then handed again to a host who did not write it. Here it is one team, which is why nothing gets lost at the boundary.",
  blocks: [
    {
      title: "One person who owns the answer",
      body: "You get a named contact for the whole project, not a queue. They hold the scope, the decisions already made and the reason behind each one, so you are never re-explaining your own business to whoever picked up the ticket.",
      steps: [],
    },
    {
      title: "You see it before it is live",
      body: "Work happens on a copy of your site, never on the running one. Nothing reaches your customers until you have looked at it and said yes.",
      steps: [
        "You describe the outcome you want. We come back with a written scope and a fixed price, or a range and what moves it.",
        "We build it on a staged copy, where you can click through the real thing rather than read a description of it.",
        "You approve it, we deploy it, and it lands on infrastructure we already operate.",
      ],
    },
    {
      title: "It has to survive after launch",
      body: "Backups, certificates, patching and scaling are already handled, because the servers are ours. A build that works on launch day and breaks in month four is not finished, and there is nobody to hand the blame to here.",
      steps: [],
    },
  ],
} as const;

export type WayIcon =
  | "palette"
  | "gear"
  | "document"
  | "code"
  | "speed"
  | "compress"
  | "redirect"
  | "bug"
  | "tools"
  | "wordpress"
  | "theme"
  | "database";

export const WAYS = {
  title: "What we get asked for",
  lede: "Some of it is a full build. A lot of it is the one thing standing between a site and the job it is supposed to do. Both are welcome.",
  items: [
    { label: "Custom features a plugin cannot cover", icon: "code" },
    { label: "Booking and scheduling that fits your rules", icon: "gear" },
    { label: "Payments, checkout and subscription flows", icon: "document" },
    { label: "Customer portals and logged-in areas", icon: "theme" },
    { label: "Connecting your site to tools you already use", icon: "redirect" },
    { label: "Moving data out of spreadsheets and into the site", icon: "database" },
    { label: "Making a slow site fast enough to keep people", icon: "speed" },
    { label: "Images, assets and everything that bloats a page", icon: "compress" },
    { label: "Fixing a build someone else walked away from", icon: "tools" },
    { label: "Cleaning up after a hack and closing the hole", icon: "bug" },
    { label: "WordPress work, from a small change to a rebuild", icon: "wordpress" },
    { label: "Design changes that were never in the theme", icon: "palette" },
  ] satisfies ReadonlyArray<{ label: string; icon: WayIcon }>,
} as const;

/**
 * The published rate card.
 *
 * ⚠ THESE FIGURES ARE SERVERLYS' OWN — Edgar confirmed it directly on
 * 2026-09-14 when asked, because they are numerically identical to the
 * reference's rate card and that needed settling before they could ship. They
 * are NOT borrowed. Do not strip them again on the assumption that they are.
 *
 * ⚠ This is the ONLY page on the site that publishes a price for a service.
 * Every other service page quotes per brief, and `/our-process` states that
 * posture ("a fixed price, or a range with what moves it"). That is a
 * deliberate exception here, not an inconsistency to tidy up.
 *
 * ⚠ It also now feeds the AI-discovery layer: `/llms.txt` consumers and answer
 * engines will restate "$129/hr" as a Serverlys fact. Keep it current — a
 * stale rate quoted back to a prospect by an assistant is worse than none.
 *
 * Surrounding copy (title, lede, footnote, card bodies) is Serverlys-original,
 * like the rest of this file. The rate ladder is the only part restored.
 */
export const PLANS = {
  title: "Two ways to work with us",
  lede: "Buy the hours you need for one piece of work, or keep a block of time on standby each month. The more you commit, the lower the rate.",
  footnote: "Charged in full at checkout, plus tax. Every project is scoped in writing before any of it starts.",
  cards: [
    {
      name: "Serverlys Hours",
      body: "Hire the team by the hour for a defined job — a fix, a feature, or a specific thing that has been blocking you.",
      rows: [{ label: "Just", price: "$129", unit: "/hr", off: null }],
    },
    {
      name: "Serverlys Retainer",
      body: "A standing block of development time each month, for a site that is actively worked on rather than occasionally touched.",
      rows: [
        { label: "1 Hour •", price: "$119", unit: "/hr", off: "8%" },
        { label: "3 hours •", price: "$109", unit: "/hr", off: "16%" },
        { label: "5 hours •", price: "$99", unit: "/hr", off: "23%" },
      ],
    },
  ],
} as const;

export const TACKLE = {
  title: "Tell us what it has to do",
  lede: "Describe the outcome rather than the feature list. We will come back with what it takes, what it costs and how long it runs.",
  cta: "Get a scope and a price",
} as const;

/**
 * ⚠ PLACEHOLDERS. THIS BAND MUST NOT SHIP AS-IS.
 *
 * `REVIEWS_ARE_REAL` below is a hard gate: while it is `false`,
 * `scripts/check-reviews.mjs` fails, so the page cannot quietly go live with
 * invented endorsements. Flip it to `true` in the SAME commit that puts real
 * quotes and real names in `items`.
 *
 * Why these are not just filled in with plausible-looking names: a testimonial
 * is a statement that a named person said a thing. Unlike marketing copy, there
 * is no later edit that makes an invented one true — it is a fabricated
 * endorsement the moment it is published, and it is the customer's name on it,
 * not ours.
 *
 * TO FINISH THIS BAND: paste in six real quotes with the reviewer's name (or
 * their business name) and flip the flag. Google reviews, an email, a WhatsApp
 * message — anything a real client actually wrote. Trim to two-to-four
 * sentences; the card is 410×464 and built for roughly that length. Fewer than
 * six is fine, the rail just scrolls less. If there are none yet, delete the
 * `<Reviews />` line from `page.tsx` and ship the other seven bands.
 */
export const REVIEWS_ARE_REAL = false;

export const REVIEWS = {
  title: "What clients say",
  items: [
    {
      quote:
        "Replace with a real client quote of about this length. Two to four sentences reads best at this card width, and specifics — what was built, how the process went — carry more weight than praise.",
      name: "Reviewer name needed",
    },
    {
      quote:
        "Replace with a real client quote. Something about responsiveness or communication tends to be what a prospect is actually checking for here.",
      name: "Reviewer name needed",
    },
    {
      quote:
        "Replace with a real client quote. A named business reads stronger than a first name on its own.",
      name: "Reviewer name needed",
    },
    {
      quote:
        "Replace with a real client quote. If a client described a problem they had before the work, lead with that.",
      name: "Reviewer name needed",
    },
    {
      quote:
        "Replace with a real client quote. Quotes that mention the hosting and the build together make the single-team point better than the copy above can.",
      name: "Reviewer name needed",
    },
    {
      quote:
        "Replace with a real client quote, or cut this band from page.tsx until there are real ones to show.",
      name: "Reviewer name needed",
    },
  ],
} as const;

/**
 * The band that occupies the testimonial slot until real reviews exist.
 *
 * WHY THIS IS HERE. A testimonial band does one job: give a stranger a reason
 * to believe you. Serverlys has no collected customer reviews yet — checked,
 * including the original site, where every quote turned out to be a blog
 * pull-quote in our own editorial voice. Leaving the slot empty loses the job;
 * inventing quotes fakes it. So the slot carries COMMITMENTS instead: things a
 * prospect can hold us to, every one of them verifiable elsewhere on this site.
 *
 * It reuses the reviews rail exactly — same 410×464 card, same 48px padding,
 * same scroll-snap — so putting real testimonials back is a one-line swap in
 * `page.tsx` and nothing about the layout moves.
 *
 * ⚠ Each line below must stay checkable. No uptime figure, no turnaround
 * promise, no count of anything. If a claim here stops being true, delete it.
 */
export const COMMITMENTS = {
  title: "What you can hold us to",
  items: [
    {
      title: "You see it before your customers do",
      body: "Every change is built on a staged copy and waits there for your approval. Your live site keeps running untouched until you say go.",
    },
    {
      title: "A price against a written scope",
      body: "You get a fixed price, or a range with the specific things that would move it, attached to a scope you have read. Nothing starts before you have agreed both.",
    },
    {
      title: "The renewal price, up front",
      body: "Hosting shows what it costs to renew beside what it costs to start, on every plan. No first-year rate that quietly triples in month thirteen.",
    },
    {
      title: "Migration is on us",
      body: "Moving an existing site to Serverlys is free and we do it, not you. Whether that is one site or a hundred.",
    },
    {
      title: "One team, build and infrastructure",
      body: "The people who write your site also run the servers under it. When something breaks there is no second company to coordinate with, and nobody to hand the blame to.",
    },
    {
      title: "Thirty days to change your mind",
      body: "Hosting plans carry a 30-day money-back guarantee. Domain registrations do not, because the registry fee is paid the moment you register and is not recoverable.",
    },
  ],
} as const;

export const CHAT = {
  title: ["Not sure what", "you need yet?"],
  // Two lines at 672px, like the reference's. Roughly 115 characters.
  lede: "Describe the problem in your own words. We will tell you what fixing it takes — including when the answer is nothing.",
  primary: "Talk to us",
  secondary: "Book a call",
} as const;

/**
 * ⚠ Answers describe how SERVERLYS works. The reference's operational policy —
 * its roll-over rules, its accrual cap, its turnaround commitment — is gone.
 * Nothing here promises a timeframe or a figure we have not agreed.
 */
export const FAQS = {
  title: "Questions we get asked",
  items: [
    {
      q: "Will you work directly on my live site?",
      a: "No. Development happens on a staged copy, and your live site keeps running untouched while it does. You review the change on that copy, and only once you approve it do we deploy. If a fix is urgent enough that staging would cost you more than it saves, we will say so and agree the approach with you first.",
    },
    {
      q: "How long will my project take?",
      a: "It depends entirely on what it is, so we do not publish a number we would have to caveat. You get a timeline with the written scope, before you commit to anything. If something during the build threatens that timeline, you hear it when we find out rather than on the deadline.",
    },
    {
      q: "What does it cost?",
      a: "A defined project gets a fixed price, or a range with the specific things that would move it. Ongoing capacity is a monthly arrangement. Either way the number arrives with a scope you have read, so you can see exactly what it buys. Nothing starts before you have agreed both.",
    },
    {
      q: "Do I have to host with Serverlys?",
      a: "No, and we will still take the work. It is worth knowing what you give up though: when we host it too, backups, certificates, patching and scaling are already ours to handle, and there is no second company to coordinate with when something breaks. On someone else's infrastructure we will need access, and some of that safety net is outside our reach.",
    },
    {
      q: "What can you actually build on?",
      a: "WordPress and WooCommerce are the most common, and we also build custom applications where an off-the-shelf platform is the wrong tool. If you are on something unusual, send us the details — we would rather look at it and tell you honestly whether we are the right people than guess.",
    },
    {
      q: "What happens after it launches?",
      a: "The site runs on infrastructure we operate, so monitoring, backups and updates continue whether or not you have ongoing development time with us. If you want changes after launch, that is what the monthly arrangement is for, and you can start it later rather than deciding now.",
    },
  ],
} as const;
