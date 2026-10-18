import { NextResponse } from "next/server";
import { TOOLS, callTool, MCP_PROTOCOL_VERSION, MCP_SERVER_VERSION } from "@/lib/agent/tools";
import { clientKey, rateLimit } from "@/lib/domains/provider";
import { company } from "@/data/company";

/**
 * POST /mcp — Serverlys' public MCP server (Model Context Protocol, Streamable
 * HTTP transport, stateless, JSON responses). Advertised by the server card at
 * /.well-known/mcp/server-card.json and by the homepage `Link` header.
 *
 * Read-only by design: the four tools in lib/agent/tools.ts look things up and
 * return links. No sessions, no auth, no writes, no orders. Rate limited per
 * client with the same limiter as the domain search.
 *
 * Supported methods: initialize, notifications/initialized, ping, tools/list,
 * tools/call. A GET answers 405 (this server never opens an SSE stream).
 */
export const dynamic = "force-dynamic";

type RpcRequest = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };

const rpcResult = (id: RpcRequest["id"], result: unknown) => ({ jsonrpc: "2.0", id: id ?? null, result });
const rpcError = (id: RpcRequest["id"], code: number, message: string) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });

async function handle(msg: RpcRequest, request: Request) {
  const { id, method, params = {} } = msg;
  switch (method) {
    case "initialize":
      return rpcResult(id, {
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "serverlys", title: company.name, version: MCP_SERVER_VERSION },
        instructions:
          "Read-only tools for Serverlys hosting plans and prices, domain availability, company and contact details, and the site's pages. Purchases happen in the Serverlys checkout, not through this server.",
      });
    case "ping":
      return rpcResult(id, {});
    case "tools/list":
      return rpcResult(id, { tools: TOOLS });
    case "tools/call": {
      const name = String(params.name ?? "");
      if (!TOOLS.some((t) => t.name === name)) return rpcError(id, -32602, `Unknown tool: ${name}`);
      const limit = rateLimit(clientKey(request, "mcp"));
      if (!limit.ok) return rpcError(id, -32000, `Rate limited. Retry in ${limit.retryAfterSeconds}s.`);
      const args = (params.arguments && typeof params.arguments === "object" ? params.arguments : {}) as Record<string, unknown>;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12_000);
      try {
        const out = await callTool(name, args, controller.signal);
        return rpcResult(id, out.ok
          ? { content: [{ type: "text", text: JSON.stringify(out.data, null, 2) }], structuredContent: out.data, isError: false }
          : { content: [{ type: "text", text: out.error }], isError: true });
      } catch {
        return rpcResult(id, { content: [{ type: "text", text: "The lookup failed. Try again shortly." }], isError: true });
      } finally {
        clearTimeout(timer);
      }
    }
    default:
      return rpcError(id, -32601, `Method not found: ${method ?? ""}`);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 64_000) return NextResponse.json(rpcError(null, -32600, "Request too large."), { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json(rpcError(null, -32700, "Parse error."), { status: 400 });
  }
  const batch = Array.isArray(body) ? body : [body];
  if (!batch.length || batch.length > 20) return NextResponse.json(rpcError(null, -32600, "Invalid request."), { status: 400 });
  const replies = [];
  for (const msg of batch as RpcRequest[]) {
    if (!msg || typeof msg !== "object" || typeof msg.method !== "string") { replies.push(rpcError(null, -32600, "Invalid request.")); continue; }
    // Notifications (no id) get no reply.
    if (msg.id === undefined) continue;
    replies.push(await handle(msg, request));
  }
  if (!replies.length) return new Response(null, { status: 202 });
  const headers = { "Cache-Control": "no-store", "MCP-Protocol-Version": MCP_PROTOCOL_VERSION };
  return NextResponse.json(Array.isArray(body) ? replies : replies[0], { headers });
}

export function GET() {
  return new Response("This MCP server speaks Streamable HTTP over POST. See /.well-known/mcp/server-card.json.", {
    status: 405,
    headers: { Allow: "POST", "Content-Type": "text/plain; charset=utf-8" },
  });
}
