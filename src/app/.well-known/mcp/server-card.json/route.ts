import { canonical } from "@/lib/seo";
import { company } from "@/data/company";
import { TOOLS, MCP_PROTOCOL_VERSION, MCP_SERVER_VERSION } from "@/lib/agent/tools";

/**
 * MCP Server Card (SEP-1649 / SEP-2127): how an agent discovers the public MCP
 * server at /mcp without connecting first. Built from the same tool list the
 * server answers `tools/list` with, so the card can never advertise a tool the
 * server does not have.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
      version: "1.0",
      protocolVersion: MCP_PROTOCOL_VERSION,
      serverInfo: { name: "serverlys", title: company.name, version: MCP_SERVER_VERSION },
      description:
        "Read-only Serverlys tools: hosting plans and prices, domain availability, company and contact details, and the site's pages.",
      documentationUrl: canonical("/llms.txt"),
      iconUrl: canonical("/icon.png"),
      transport: { type: "streamable-http", endpoint: canonical("/mcp") },
      endpoint: canonical("/mcp"),
      capabilities: { tools: { listChanged: false } },
      authentication: { required: false },
      tools: TOOLS.map((t) => ({ name: t.name, title: t.title, description: t.description })),
    },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
