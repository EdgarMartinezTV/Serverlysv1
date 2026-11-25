import "server-only";
import { BLACK_FRIDAY, blackFridayActive } from "@/data/pricing";
import { faqs } from "@/data/faqs";
import { company } from "@/data/company";
import { upcomingProducts } from "@/data/products";
import { hostingPlans, hostingProducts } from "./knowledge/hosting";
import { companyFacts, contactChannels, serviceCatalogue } from "./knowledge/services";
import { NAVIGABLE } from "./navigation-map";
import { FREE_WITH_HOSTING } from "@/data/tlds";

/**
 * The knowledge feed ConvoAI reads (GET /api/convoai/knowledge).
 *
 * ConvoAI is the assistant on serverlys.com and in the client area. It syncs this feed into its
 * knowledge base every hour, so every price, sale, policy and page it quotes is the one the site is
 * rendering right now — the same projection of `data/*` the old Sera assistant used. Nothing here is hand-written
 * fact: updating a price is still a one-file change in `data/pricing.ts`.
 *
 * `pages` is the "show me" map: the sections ConvoAI may scroll to and highlight on each page
 * (element ids read off the rendered HTML; see navigation-map.ts).
 */

export type FeedDocument = { key: string; title: string; url: string; content: string };
export type AssistantFeed = {
  version: 1;
  generatedAt: string;
  site: string;
  sale: { active: boolean; name: string; endsLabel: string; code: string; pct: number } | null;
  documents: FeedDocument[];
  pages: { path: string; label: string; sections: { id: string; label: string }[] }[];
};

const lines = (xs: (string | undefined | false | null)[]) => xs.filter(Boolean).join("\n");

function plansDoc(): FeedDocument {
  const out: string[] = [
    "Serverlys hosting plans. Every plan can be paid monthly with no commitment, or 12, 24 or 36 months up front; longer terms cost less per month and each term renews at its own same price. Never say a plan REQUIRES a long term — but do explain the up-front options, because the site's \"from $X/mo\" headlines are the per-month equivalent of paying 36 months up front.",
    `FREE DOMAIN: every Cloud, WordPress and WooCommerce plan paid 12 months or longer up front includes ${FREE_WITH_HOSTING.join(", ")} free for the first year (it then renews at the normal domain price). The monthly term does NOT include a free domain. Never say hosting plans have no free domain.`,
    "When quoting a price ALWAYS give two numbers: what they pay today (first payment, incl. any setup fee) and the regular price it renews at. Serverlys renews every plan at its own regular price.",
    "\"From $X/mo\" figures in the FAQ and page summaries are the plan price WITHOUT its setup fee. When you tell someone what they pay today, use the \"first payment ... in total\" figure below for the term they are asking about (monthly unless they say otherwise).",
    "",
  ];
  /* The page each group's plan cards are on; each card carries data-convoai-target="<group>-<tier>". */
  const PAGE: Record<string, string> = { cloud: "/cloud-hosting", wordpress: "/wordpress-hosting", ecommerce: "/ecommerce-hosting" };
  out.push("To SHOW a plan, link it: the link scrolls the visitor to that plan's card and highlights it (\"See it\" below).", "");
  for (const g of hostingPlans()) {
    out.push(`## ${g.label} (${g.id})`, g.blurb, `Store: ${g.storeUrl}`, "");
    for (const p of g.plans) {
      out.push(
        lines([
          `### ${g.label} — ${p.name}`,
          p.summary,
          `Price: ${p.monthlyPrice}. Renews at: ${p.renewsAt}. ${p.savings}.`,
          p.blackFriday,
          p.terms,
          p.setupFee,
          `Sites: ${p.sites}. Visits: ${p.visits}. Memory: ${p.memory}. Storage: ${p.storage}. Transfer: ${p.transfer}.`,
          p.includes.length ? `Includes: ${p.includes.join("; ")}.` : "",
          PAGE[g.id] ? `See it: ${company.url}${PAGE[g.id]}#${g.id}-${p.tier}` : "",
          `Order: ${p.orderUrl}`,
        ]),
        "",
      );
    }
  }
  return { key: "hosting-plans", title: "Serverlys hosting plans and prices", url: `${company.url}/pricing`, content: out.join("\n").trim() };
}

function productsDoc(): FeedDocument {
  const out = ["Serverlys products. available=false means announced but NOT purchasable yet: never offer to sell it.", ""];
  for (const p of hostingProducts()) {
    out.push(
      lines([
        `## ${p.name}${p.available ? "" : " (coming soon — not purchasable)"}`,
        p.summary,
        p.startingFrom ? `Starting from ${p.startingFrom}.` : "",
        p.highlights.length ? `Highlights: ${p.highlights.join("; ")}.` : "",
        `Page: ${company.url}${p.page}`,
      ]),
      "",
    );
  }
  return { key: "products", title: "Serverlys products and availability", url: company.url, content: out.join("\n").trim() };
}

function servicesDoc(): FeedDocument {
  const out = [
    "Serverlys services (websites, SEO, social media, maintenance, AI, automation). Published prices are in each page summary; if a price is not listed, Serverlys does not publish a fixed price for it.",
    "Which page owns what: NEW website or website design = /website-design; work on an EXISTING site and hourly rates = /website-development; SEO = /seo; social media management = /social-media; website maintenance / ServerCare = /site-management; all-in-one website + hosting plans = /business-solutions.",
    "",
  ];
  const soon = new Set<string>(upcomingProducts.map((p) => p.href));
  for (const s of serviceCatalogue()) {
    out.push(`## ${s.area}`, s.note ?? "");
    for (const p of s.pages) out.push(`- ${p.name} (${company.url}${p.path})${soon.has(p.path) ? " — COMING SOON, NOT PURCHASABLE YET (never offer it as available)" : ""}: ${p.summary}`);
    out.push("");
  }
  return { key: "services", title: "Serverlys services and published prices", url: company.url, content: out.join("\n").trim() };
}

function companyDoc(): FeedDocument {
  const c = companyFacts();
  const ch = contactChannels();
  return {
    key: "company",
    title: "About Serverlys, what it does not claim, and how to reach a person",
    url: `${company.url}/about`,
    content: lines([
      `${c.name} (${c.legalName}), ${c.site}.`,
      c.summary,
      "",
      "Facts:",
      ...c.facts.map((f) => `- ${f}`),
      "",
      "Do NOT claim (these are not Serverlys commitments):",
      ...c.limits.map((f) => `- ${f}`),
      "",
      "Serverlys' own products:",
      ...c.ownProducts.map((p) => `- ${p.name} (${p.url}): ${p.description}`),
      "",
      "Reach a person:",
      `- Email: ${ch.email}`,
      `- Phone: ${ch.phone}`,
      `- Support page: ${company.url}${ch.supportPage}`,
      `- Sales ticket (talk to an expert): ${ch.salesTicket}`,
      `- Client area login: ${ch.clientLogin}`,
    ]),
  };
}

function faqDoc(): FeedDocument {
  return {
    key: "faq",
    title: "Serverlys FAQ (exact answers — quote, do not soften)",
    url: `${company.url}/faq`,
    content: [
      "These answers are company commitments (renewal transparency, 30-day refund, setup fees, domains non-refundable once registered). Quote them; never soften or embellish.",
      "",
      ...faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}\n`),
    ].join("\n").trim(),
  };
}

function selfServiceDoc(): FeedDocument {
  const u = company.url;
  return {
    key: "self-service",
    title: "How customers do things themselves (exact steps — give these instead of handing over)",
    url: `${u}/clientarea`,
    content: lines([
      "Give the customer the exact steps and the direct link. Most account tasks are self-service in the Serverlys client area; a person is only needed when the steps below say so.",
      "Every client-area link asks them to log in first if they are not signed in. Forgotten password: " + `${u}/password/reset` + ".",
      "",
      `- See or manage a hosting plan: ${u}/clientarea?action=services → open the service. From there they can log in to cPanel with one click, see usage, and upgrade.`,
      `- Upgrade or downgrade a plan: open the service in ${u}/clientarea?action=services and choose Upgrade/Downgrade; the price difference is prorated. Their site does not move.`,
      `- Cancel a service: open the service in ${u}/clientarea?action=services and choose Request Cancellation; they pick immediate or end of billing period. Within 30 days of the first payment the money-back guarantee applies (see the FAQ for what is deducted).`,
      `- Pay an invoice or see billing history: ${u}/clientarea?action=invoices. Signed-in customers can also pay from the chat with the Pay invoice button.`,
      `- Change the saved card or payment method: ${u}/account/paymentmethods.`,
      `- Update name, address, email or company on the account: ${u}/clientarea?action=details.`,
      `- Domains (renew, auto-renew, nameservers, WHOIS contacts, lock): ${u}/clientarea?action=domains → Manage on the domain. Signed-in customers can renew from the chat with the Renew domain button.`,
      `- Transfer a domain IN: ${u}/transfer-domain (they need the auth/EPP code from the current registrar and the domain unlocked).`,
      "- Transfer a domain OUT (get the EPP code / unlock): from the domain's Manage page. Domains registered or transferred in the last 30 days cannot be unlocked or get an EPP code yet (registry rule) — say so plainly.",
      "- Email accounts, DNS records, files, databases, WordPress: inside cPanel (log in from the service page): Email Accounts, Zone Editor, File Manager, MySQL Databases. SSL certificates are issued and renewed automatically (AutoSSL); nothing to buy or install.",
      "- Restore a backup: cPanel → JetBackup (daily backups, restores are free and self-service: pick the date, then files, databases or email).",
      `- Move a site to Serverlys: migration is free. Order hosting, then open a request from ${u}/clientarea and the team moves it; you can open it for them in this chat (ticket) once they give the domain, current host and an email. Never ask for passwords in chat.`,
      "",
      "Needs a person (open the ticket yourself in this chat with every detail they gave, give them the reference, and tell them the team replies by email):",
      "- a refund, a double charge or any billing dispute (state the 30-day guarantee and what happens next first);",
      "- a service that is down or broken after they have tried the steps above, or anything only server access can fix;",
      "- account ownership or access problems the password reset cannot fix;",
      "- legal, abuse and law-enforcement requests.",
    ]),
  };
}

function saleDoc(active: boolean): FeedDocument {
  const pct = `${Math.round(BLACK_FRIDAY.pct * 100)}%`;
  return {
    key: "sale",
    title: "Current Serverlys promotion",
    url: company.url,
    content: active
      ? `Black Friday is ON until ${BLACK_FRIDAY.endsLabel}: ${pct} off the FIRST payment (plan and setup fee, every billing term) on all hosting plans, the three email plans and ConvoAI Pro. Applied automatically at checkout — no code needed (it is ${BLACK_FRIDAY.code} if they ask). The plan then renews at its regular price. Always give both the Black Friday first payment and the regular renewal price; never the sale price alone. SEO, ServerCare, social media, website design, contractor plans, restaurant plans and domains are NOT in the sale.`
      : "There is no sale running right now. Quote regular prices (what they pay today including any setup fee, and the renewal price).",
  };
}

export function buildFeed(now = new Date()): AssistantFeed {
  const active = blackFridayActive(now);
  return {
    version: 1,
    generatedAt: now.toISOString(),
    site: company.url,
    sale: active ? { active, name: "Black Friday", endsLabel: BLACK_FRIDAY.endsLabel, code: BLACK_FRIDAY.code, pct: BLACK_FRIDAY.pct } : null,
    documents: [saleDoc(active), plansDoc(), productsDoc(), servicesDoc(), companyDoc(), selfServiceDoc(), faqDoc()],
    pages: NAVIGABLE.map((p) => ({ path: p.path, label: p.label, sections: p.sections.map((s) => ({ id: s.id, label: s.label })) })),
  };
}
