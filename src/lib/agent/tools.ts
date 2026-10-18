import { company, billing } from "@/data/company";
import { planGroups, formatPrice, orderUrl } from "@/data/pricing";
import { routes } from "@/data/routes";
import { LLMS_SUMMARIES } from "@/data/llms";
import { canonical } from "@/lib/seo";
import { parseDomainInput } from "@/lib/domains/normalize";
import { checkDomains, resolveProvider } from "@/lib/domains/provider";
import { suggestionTlds, tldSet } from "@/data/tlds";

/**
 * The read-only tools Serverlys exposes to AI agents.
 *
 * ONE implementation, two transports: the public MCP server (`/mcp`) calls
 * these directly, and the in-browser WebMCP tools (components/agent/web-mcp)
 * reach them through that same endpoint. Nothing here writes, signs in or
 * places an order — an agent can look things up and hand the person a link;
 * buying stays in the WHMCS checkout, with a human.
 *
 * Every answer is built from the same sources the pages render (pricing.ts,
 * routes.ts, company.ts), so an agent can never be told a price or a page the
 * site itself does not show.
 */

/** MCP protocol revision /mcp speaks, and the server's own version (bump on tool changes). */
export const MCP_PROTOCOL_VERSION = "2025-06-18";
export const MCP_SERVER_VERSION = "1.0.0";

export type ToolDef = {
  name: string;
  title: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
    additionalProperties: false;
  };
};

export const TOOLS: readonly ToolDef[] = [
  {
    name: "list_hosting_plans",
    title: "List hosting plans",
    description:
      "Serverlys hosting plans with their monthly price, the price they renew at, what each includes, and the checkout link. Optionally filter by plan group.",
    inputSchema: {
      type: "object",
      properties: {
        group: {
          type: "string",
          description: "Plan group id to filter by, e.g. the cloud, WordPress or ecommerce group.",
          enum: planGroups.map((g) => g.id),
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "check_domain",
    title: "Check domain availability",
    description:
      "Check whether a domain name is available to register at Serverlys, with a few alternative extensions and a link to buy it.",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Domain or name to check, e.g. 'mybakery.com' or 'mybakery'." },
      },
      required: ["domain"],
      additionalProperties: false,
    },
  },
  {
    name: "get_company_info",
    title: "Get Serverlys company and contact info",
    description:
      "Who Serverlys is, how to contact support and sales, the client area link, and the money-back and refund terms.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_pages",
    title: "List Serverlys pages",
    description:
      "The public pages of serverlys.com with a one-line summary of each, so an agent can send someone to the right page.",
    inputSchema: {
      type: "object",
      properties: {
        topic: { type: "string", description: "Optional word to filter pages by, e.g. 'wordpress', 'domain', 'email'." },
      },
      additionalProperties: false,
    },
  },
];

type Json = Record<string, unknown>;
export type ToolResult = { ok: true; data: Json } | { ok: false; error: string };

function plans(group?: string): ToolResult {
  const groups = planGroups.filter((g) => !group || g.id === group);
  if (!groups.length) return { ok: false, error: `Unknown plan group "${group}".` };
  return {
    ok: true,
    data: {
      currency: "USD",
      note: "Prices are monthly. Each plan renews at its standard rate after the introductory period; both are listed.",
      groups: groups.map((g) => ({
        id: g.id,
        name: g.label,
        summary: g.blurb,
        plans: g.plans.map((p) => ({
          name: p.name,
          monthlyPrice: formatPrice(p.monthly),
          renewsAt: formatPrice(p.standard),
          setupFee: p.setupFee ? formatPrice(p.setupFee) : null,
          websites: p.specs.sites,
          monthlyVisits: p.specs.visits,
          memory: p.specs.memory,
          storage: p.specs.storage,
          includes: p.includes,
          orderUrl: orderUrl(g, p),
        })),
      })),
      pricingPage: canonical("/pricing"),
    },
  };
}

async function domain(input: string, signal: AbortSignal): Promise<ToolResult> {
  if (typeof input !== "string" || !input.trim() || input.length > 255) {
    return { ok: false, error: "Give a domain name to check." };
  }
  const parsed = parseDomainInput(input);
  if (!parsed.ok) return { ok: false, error: parsed.message };
  const provider = resolveProvider();
  if (!provider) return { ok: false, error: "Domain search is not available right now." };
  const tld = parsed.tld && tldSet.has(parsed.tld) ? parsed.tld : ".com";
  const primary = `${parsed.sld}${parsed.tld ?? tld}`;
  const alternates = parsed.sld.includes(".")
    ? []
    : suggestionTlds(parsed.tld ?? tld).map((t) => `${parsed.sld}${t.tld}`);
  const results = await checkDomains(provider, [primary, ...alternates].slice(0, 6), signal);
  return {
    ok: true,
    data: {
      results: results.map((r) => ({ ...r, buyUrl: billing.searchDomain(r.domain) })),
      note: "Availability is a live check; the checkout confirms it before payment.",
    },
  };
}

function info(): ToolResult {
  return {
    ok: true,
    data: {
      name: company.name,
      legalName: company.legalName,
      website: company.url,
      description: company.description,
      support: { email: company.email, phone: company.phone, ticket: billing.sales },
      clientArea: billing.clientArea,
      refunds:
        "Hosting plans have a 30-day money-back guarantee from the first payment. Domain registrations, renewals and transfers are not refundable.",
      refundPolicy: canonical("/refund-policy"),
      helpCenter: `${billing.root}/knowledgebase`,
    },
  };
}

function pages(topic?: string): ToolResult {
  const q = (topic ?? "").toLowerCase().trim();
  const list = routes
    .filter((r) => r.built && r.indexable)
    .map((r) => ({ name: r.name, url: canonical(r.path), summary: LLMS_SUMMARIES[r.path] ?? "" }))
    .filter((p) => !q || `${p.name} ${p.summary} ${p.url}`.toLowerCase().includes(q));
  return { ok: true, data: { pages: list.slice(0, 60) } };
}

export async function callTool(name: string, args: Json, signal: AbortSignal): Promise<ToolResult> {
  switch (name) {
    case "list_hosting_plans":
      return plans(typeof args.group === "string" ? args.group : undefined);
    case "check_domain":
      return domain(String(args.domain ?? ""), signal);
    case "get_company_info":
      return info();
    case "list_pages":
      return pages(typeof args.topic === "string" ? args.topic : undefined);
    default:
      return { ok: false, error: `Unknown tool "${name}".` };
  }
}
