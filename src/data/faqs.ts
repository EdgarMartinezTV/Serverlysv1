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
      "Cloud, WordPress and ecommerce hosting all start at $2.19/mo on an annual term. The figure that decides real cost is the renewal rate rather than the introductory rate, so compare year two before you compare anything else — we show both.",
    scopes: ["/", "/pricing"],
  },
  {
    question: "Do your prices go up when I renew?",
    answer:
      "Introductory pricing applies to the first term, as it does everywhere in this industry. The difference is that we show the renewal rate next to it rather than in the terms, so you can see the real multi-year cost before you commit.",
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
