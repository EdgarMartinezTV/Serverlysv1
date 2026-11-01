import { NextResponse } from "next/server";
import { parseDomainInput } from "@/lib/domains/normalize";
import { clientKey, rateLimit } from "@/lib/domains/provider";
import { readJsonObject } from "@/lib/request";

/**
 * POST /api/domains/describe  { domain: "bluefern.studio" } → { line: string | null }
 *
 * One short sentence on what kind of brand or project a name suits — the line
 * Hostinger prints under its exact-match result ("This domain is suited to a
 * moss and fern nursery or gardening brand."). Decorative, so it fails SILENT:
 * no key, a slow model, a refusal or a rate limit all return `line: null` and
 * the card renders without it. It never speaks to availability, price,
 * trademarks or ownership — the prompt forbids it and the output is clipped.
 *
 * Cost control: per-visitor rate limit (shared limiter, own "describe"
 * budget), a 24h in-memory cache per name, a 4s timeout, ~40 output tokens.
 */
export const dynamic = "force-dynamic";

const MODEL = "gpt-4.1-mini";
const TIMEOUT_MS = 4_000;
const TTL_MS = 24 * 60 * 60_000;
const MAX_CACHE = 2_000;

const cache = new Map<string, { line: string | null; at: number }>();

const SYSTEM = [
  "You write one short sentence (max 16 words) saying what kind of business, brand or project a domain name would suit.",
  'Start with "This domain". Be concrete and positive. Plain text, no quotes, no emoji.',
  "Never mention availability, price, registration, trademarks, ownership or other websites.",
  "If the name is meaningless or random characters, reply exactly: NONE",
].join(" ");

function clean(text: string): string | null {
  const line = text.replace(/\s+/g, " ").replace(/^["']|["']$/g, "").trim();
  if (!line || /^NONE\b/i.test(line) || !/^This domain\b/i.test(line)) return null;
  return line.length > 140 ? null : line;
}

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  const domain = body.ok && typeof body.value.domain === "string" ? body.value.domain : "";
  const parsed = parseDomainInput(domain);
  if (!parsed.ok || !parsed.tld || domain.length > 100) {
    return NextResponse.json({ line: null }, { status: 400 });
  }
  const name = `${parsed.sld}${parsed.tld}`;

  const hit = cache.get(name);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return NextResponse.json({ line: hit.line }, { headers: { "Cache-Control": "no-store" } });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key || !rateLimit(clientKey(request, "describe")).ok) {
    return NextResponse.json({ line: null });
  }

  let line: string | null = null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 40,
        temperature: 0.5,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: name },
        ],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      line = clean(data.choices?.[0]?.message?.content ?? "");
    }
  } catch {
    line = null;
  }

  if (cache.size >= MAX_CACHE) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(name, { line, at: Date.now() });
  return NextResponse.json({ line }, { headers: { "Cache-Control": "no-store" } });
}
