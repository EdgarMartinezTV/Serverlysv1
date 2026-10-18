"use client";

import { useEffect } from "react";

/**
 * WebMCP: the same read-only tools as the public MCP server (/mcp), offered to
 * AI agents running INSIDE the visitor's browser through `document.modelContext`
 * (W3C WebMCP draft; older Chrome builds expose `navigator.modelContext`).
 *
 * Each tool's `execute` calls /mcp, so there is one implementation of every
 * answer (lib/agent/tools.ts). The tool list is fetched from /mcp rather than
 * bundled, which keeps this component tiny on every page. Browsers without the
 * API do nothing here. Tools are unregistered on unmount via AbortController.
 */
type ModelContext = {
  registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => unknown;
  unregisterTool?: (name: string) => void;
};

async function rpc(method: string, params: Record<string, unknown>) {
  const res = await fetch("/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

export function WebMcp() {
  useEffect(() => {
    const mc = ((document as unknown as { modelContext?: ModelContext }).modelContext ??
      (navigator as unknown as { modelContext?: ModelContext }).modelContext) as ModelContext | undefined;
    if (!mc || typeof mc.registerTool !== "function") return;
    const controller = new AbortController();
    const names: string[] = [];
    rpc("tools/list", {})
      .then(({ tools }: { tools: Array<{ name: string; title?: string; description: string; inputSchema: unknown }> }) => {
        if (controller.signal.aborted) return;
        for (const t of tools) {
          names.push(t.name);
          void Promise.resolve(
            mc.registerTool(
              {
                name: t.name,
                title: t.title,
                description: t.description,
                inputSchema: t.inputSchema,
                annotations: { readOnlyHint: true },
                execute: async (args: Record<string, unknown>) => {
                  const result = await rpc("tools/call", { name: t.name, arguments: args ?? {} });
                  return result;
                },
              },
              { signal: controller.signal },
            ),
          ).catch(() => {});
        }
      })
      .catch(() => {});
    return () => {
      for (const n of names) mc.unregisterTool?.(n);
      controller.abort();
    };
  }, []);
  return null;
}
