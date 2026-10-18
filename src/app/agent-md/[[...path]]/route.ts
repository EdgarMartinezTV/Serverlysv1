import { NodeHtmlMarkdown } from "node-html-markdown";
import { parse } from "node-html-parser";
import { canonical } from "@/lib/seo";

/**
 * The Markdown representation of any page, for agents that ask for one.
 *
 * Reached only through the rewrite in src/proxy.ts when a request carries
 * `Accept: text/markdown`; the HTML page stays the default for everyone else.
 * It renders the real page (one internal request to this same server), keeps
 * the <main> content plus the page title and description, and converts that to
 * Markdown — so it says exactly what the HTML says, at a fraction of the tokens.
 */
export const dynamic = "force-dynamic";

const nhm = new NodeHtmlMarkdown({ ignore: ["script", "style", "svg", "noscript", "button", "form", "nav", "dialog", "img", "picture", "figure"] });

function pick(html: string, re: RegExp) {
  const m = re.exec(html);
  return m ? m[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").trim() : "";
}

export async function GET(_request: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await ctx.params;
  const pagePath = "/" + path.map(encodeURIComponent).join("/");
  const origin = `http://127.0.0.1:${process.env.PORT || 3000}`;
  let res: Response;
  try {
    res = await fetch(origin + pagePath, { headers: { Accept: "text/html" }, redirect: "manual", cache: "no-store" });
  } catch {
    return new Response("# Unavailable\n\nThis page could not be rendered as Markdown right now.\n", { status: 503, headers: { "Content-Type": "text/markdown; charset=utf-8" } });
  }
  if (res.status >= 300 && res.status < 400) {
    const loc = res.headers.get("location") ?? "/";
    return new Response(null, { status: res.status, headers: { Location: loc, Vary: "Accept" } });
  }
  const html = await res.text();
  const title = pick(html, /<title[^>]*>([^<]*)<\/title>/i);
  const description = pick(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
  // Content only: <main>, minus decorative mockups (everything aria-hidden) and
  // images, with site-relative links made absolute so they work out of context.
  const root = parse(html);
  const main = root.querySelector("main") ?? root;
  for (const el of main.querySelectorAll('[aria-hidden="true"]')) el.remove();
  for (const a of main.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href") ?? "";
    if (href.startsWith("/")) a.setAttribute("href", canonical(href));
  }
  const body = nhm.translate(main.innerHTML).replace(/\n{3,}/g, "\n\n").trim();
  const md = [`# ${title}`, description ? `> ${description}` : "", `Source: ${canonical(pagePath)}`, "", body, ""].join("\n");
  return new Response(md, {
    status: res.status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(Math.ceil(md.length / 4)),
      Vary: "Accept",
      Link: `<${canonical(pagePath)}>; rel="canonical"; type="text/html"`,
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=300",
    },
  });
}
