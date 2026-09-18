/**
 * FAQ content, taken verbatim in substance from the live pricing page.
 *
 * These answers encode real Serverlys commercial positions (renewal
 * transparency, 30-day refund, no setup fees, domains non-refundable once
 * registered). Do not soften or embellish them — they are commitments, and
 * they are also the source for the FAQPage structured data.
 */

export type Faq = {
  question: string;
  answer: string;
  /** Which pages this FAQ appears on. "/" means the homepage. */
  scopes: readonly string[];
};

export const faqs: readonly Faq[] = [
  {
    question: "How much does web hosting cost?",
    answer:
      "Cloud, WordPress and ecommerce hosting all start at $7.95/mo, against a standard rate of $12.62/mo. Starter also carries a one-off $2.95 setup fee. The figure that decides real cost is the standard rate rather than the promotional rate, so compare that before you compare anything else — we show both.",
    scopes: ["/", "/pricing"],
  },
  {
    question: "Do your prices go up when I renew?",
    answer:
      "Yes. The advertised price is a promotional rate and the plan renews at the standard rate. As it does everywhere in this industry — the difference is that we print the renewal rate next to the promotional one rather than leaving it in the terms, so you can see what it costs from year two before you buy.",
    scopes: ["/", "/pricing"],
  },
  {
    question: "Are there hidden fees or setup charges?",
    answer:
      "No. Setup is free, migration is free, SSL is free, WHOIS privacy on domains is free, and restoring a backup is free. Domain registrations renew at published rates, and premium domains are labelled as premium before checkout.",
    scopes: ["/", "/pricing"],
  },
  {
    question: "Can I get a refund if it does not work out?",
    answer:
      "Yes, 30 days on all hosting plans, no questions asked. Domain registrations are generally not refundable once registered because the registry fee is paid immediately, which is standard across registrars and set out in the refund policy.",
    scopes: ["/", "/pricing"],
  },
  {
    question: "Which hosting plan should I choose?",
    answer:
      "Match it to the workload. Brochure sites and blogs fit shared hosting; variable or growing traffic suits cloud; applications needing root access want a VPS; sustained heavy load justifies a dedicated server. If nobody in-house wants to maintain a server, choose managed hosting at whichever tier.",
    scopes: ["/", "/pricing"],
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Yes. You can upgrade or downgrade at any time, and changes are prorated to your billing cycle.",
    scopes: ["/", "/pricing"],
  },
  {
    question: "Is managed WordPress hosting different from normal hosting?",
    answer:
      "The hardware is the same. What differs is tuning and maintenance: LiteSpeed caching is configured for WordPress before you arrive, core updates are applied for you, and the stack is watched for the failure modes WordPress actually has.",
    scopes: ["/wordpress-hosting"],
  },
  {
    question: "Will my plugins keep working?",
    answer:
      "Plugin updates stay under your control — we apply core updates, not plugin updates, because a plugin update is the most common way a working site breaks. If one does break something, the nightly backup restores it for free.",
    scopes: ["/wordpress-hosting"],
  },

  {
    question: "What are the CPU, RAM and storage limits on a WordPress plan?",
    answer:
      "RAM is the number printed on every plan card — 2 GB on Starter, 4 GB on Plus, 6 GB on Turbo and 8 GB on Business. Storage is unlimited NVMe and bandwidth is unmetered, both subject to normal fair use: they are sized for websites, not for file distribution or backup archives.",
    scopes: ["/wordpress-hosting", "/pricing"],
  },
  {
    question: "How much does WordPress hosting cost?",
    answer:
      "From $7.95/mo, against a standard rate of $12.62/mo. Starter also carries a one-off $2.95 setup fee. Both figures are on every plan card, because the promotional rate on its own is not the price you end up paying.",
    scopes: ["/wordpress-hosting"],
  },
  {
    question: "How is this different from ordinary hosting?",
    answer:
      "Same infrastructure, different defaults. WordPress plans ship with WordPress already installed, LiteSpeed caching tuned for it, core and security updates applied automatically with a backup taken first, and one-click staging. On a general plan you would configure all of that yourself.",
    scopes: ["/wordpress-hosting"],
  },
  {
    question: "Do I actually need WordPress-specific hosting?",
    answer:
      "No. WordPress runs on any of our plans. The WordPress tier exists so you do not have to set up caching, updates and staging by hand — if you would rather do that yourself, cloud hosting is the same machine at the same price.",
    scopes: ["/wordpress-hosting"],
  },
  {
    question: "How do I keep a WordPress site secure?",
    answer:
      "Most of it is already on: a firewall in front of PHP, malware scanning on a schedule, free SSL issued and renewed, and automatic security patching. The part left to you is choosing plugins carefully and keeping the admin account on a password you do not reuse.",
    scopes: ["/wordpress-hosting"],
  },
  {
    question: "How do I move my WordPress site over?",
    answer:
      "Tell us where it lives now and we move it — files, database and email — onto a staging URL first. You check it properly, and DNS only changes when you say so. It is free, and there is no limit on how many sites you bring.",
    scopes: ["/wordpress-hosting", "/migrations"],
  },
  {
    question: "How many sites can I run on one plan?",
    answer:
      "One on Starter, seven on Plus, and unlimited on Turbo and Business. Each gets its own staging copy and its own backups, so an agency account does not have to share one restore point across every client.",
    scopes: ["/wordpress-hosting"],
  },
  {
    question: "Do WordPress plans support WooCommerce?",
    answer:
      "Yes, and there is a dedicated ecommerce tier if the store is the main thing the site does — same infrastructure, tuned for checkout under load rather than for reads.",
    scopes: ["/wordpress-hosting", "/ecommerce-hosting"],
  },
  {
    question: "Is there anything here for agencies running many sites?",
    answer:
      "Turbo and Business carry unlimited sites with per-site staging and per-site backups, which is the usual shape for an agency account. If you are moving a portfolio across, tell us how many and we will schedule the migrations rather than leaving you to queue them.",
    scopes: ["/wordpress-hosting"],
  },  {
    question: "Does WooCommerce need different hosting?",
    answer:
      "It needs headroom at checkout rather than raw capacity all the time. Store pages cache poorly by nature — carts and checkouts cannot be served from cache — so the tier that matters is the one that keeps the database responsive under concurrent orders.",
    scopes: ["/ecommerce-hosting"],
  },
  {
    question: "Can you migrate an existing store?",
    answer:
      "Yes, free, and to a staging URL first. Stores are the case where checking before cutover matters most: you get to place a test order on staging before anything points at us.",
    scopes: ["/ecommerce-hosting"],
  },
  {
    question: "Which hosting should I choose?",
    answer:
      "Match it to the workload rather than the price. Brochure sites and blogs fit the entry tier; variable or growing traffic suits cloud; a store needs checkout headroom. If nobody in-house wants to maintain a server, choose managed at whichever tier.",
    scopes: ["/hosting"],
  },
  {
    question: "What can an AI agent actually answer?",
    answer:
      "The routine questions that make up most of the volume: hours, location, delivery, pricing, availability, booking. It is trained on your own site and the details you give it, so it answers about your business rather than in general.",
    scopes: ["/ai-agents", "/convoai"],
  },
  {
    question: "What happens when it does not know?",
    answer:
      "It hands over rather than guesses. A refund dispute or an unusual request is passed to a person with the conversation attached, so nobody starts from scratch.",
    scopes: ["/ai-agents", "/convoai"],
  },
  {
    question: "Will callers know it is not a person?",
    answer:
      "It introduces itself as an assistant. Pretending otherwise damages trust the first time someone notices, and in several places it is not permitted.",
    scopes: ["/callflow-ai"],
  },
  {
    question: "What happens outside opening hours?",
    answer:
      "The call is answered, the caller gets the information they asked for, and anything needing a person is captured as a message with a callback number.",
    scopes: ["/callflow-ai"],
  },
  {
    question: "Do I need to know n8n to use automations?",
    answer:
      "No. The common workflows — enquiry to record, booking to calendar, form to notification — are set up for you. n8n is there if you want to build something specific.",
    scopes: ["/automations"],
  },
  {
    question: "Is WHOIS privacy included?",
    answer:
      "Yes, free and on every domain we register. Your personal details are kept out of the public WHOIS record at no extra cost — it is not an upsell.",
    scopes: ["/register-domain"],
  },
  {
    question: "Do I need hosting to register a domain?",
    answer:
      "No. You can register a domain on its own and point it wherever you like. If you add hosting later, annual plans include a free domain for the first year.",
    scopes: ["/register-domain"],
  },
  {
    question: "Can I move a domain I already own to Serverlys?",
    answer:
      "Yes. Transfers are handled through the cart — you will need the authorisation code from your current registrar and the domain must be unlocked. A transfer normally adds a year to the registration.",
    scopes: ["/register-domain"],
  },
  {
    question: "Are domain registrations refundable?",
    answer:
      "Generally no. The registry fee is paid the moment a name is registered, which is standard across registrars and set out in the refund policy. The 30-day money-back guarantee covers hosting plans, not domains.",
    scopes: ["/register-domain"],
  },
  {
    question: "What is cloud hosting, and how is it different from shared hosting?",
    answer:
      "Shared hosting puts your site on one machine with a fixed pool of resources. Cloud hosting spreads it across a network of servers, so capacity can grow with demand and a single hardware failure does not take you offline. It costs more than shared, but it removes the ceiling shared hosting has.",
    scopes: ["/cloud-hosting"],
  },
  {
    question: "What happens if my site gets a sudden traffic spike?",
    answer:
      "Auto-scaling absorbs it, and your plan includes unmetered data transfer — so there is no per-gigabyte overage and no surprise invoice at the end of the month. That is the practical difference from cloud platforms billed by consumption.",
    scopes: ["/cloud-hosting"],
  },
  {
    question: "Is cloud hosting cheaper than a VPS?",
    answer:
      "At the entry level, usually yes, because you are not paying for a fixed resource reservation you may not use. A VPS becomes better value once you need root access, a custom stack, or steady predictable load.",
    scopes: ["/cloud-hosting"],
  },
  {
    question: "Do I need technical skills to run a cloud plan?",
    answer:
      "No. It is managed the same way shared hosting is — a cPanel control panel, one-click WordPress installs, and a support team you can reach. \u201cCloud\u201d describes the infrastructure underneath, not extra work for you.",
    scopes: ["/cloud-hosting"],
  },
  {
    question: "Can I host multiple websites on one cloud plan?",
    answer:
      "Yes, from the Plus tier upward. Each site gets its own directory, database and SSL certificate, drawing from your plan's resource pool rather than a fixed per-site quota.",
    scopes: ["/cloud-hosting"],
  },
  {
    question: "Will you move my existing site for me?",
    answer:
      "Yes, and it is free. Our team moves the site, the database and the email onto a staging URL first, usually within a business day. You check it there, we fix anything that looks wrong, then we switch DNS at a time you pick — so there is no gap in service.",
    scopes: ["/", "/cloud-hosting"],
  },
];

export function faqsFor(scope: string): readonly Faq[] {
  return faqs.filter((f) => f.scopes.includes(scope));
}
