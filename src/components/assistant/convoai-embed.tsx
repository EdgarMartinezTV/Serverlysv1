"use client";

import Script from "next/script";
import { flushAssistantQueue } from "./assistant";

/**
 * The ConvoAI messenger on every page (replaces Sera, 2026-10-31).
 *
 * `lazyOnload` keeps it off the critical path: the launcher appears after the page has finished
 * loading, so LCP and TBT are untouched (see the LCP notes in DEPLOY.md). The embed key is public by
 * design — it is in every page's HTML — and identifies the Serverlys AI Employee in ConvoAI.
 */
const SRC = process.env.NEXT_PUBLIC_CONVOAI_WIDGET_SRC?.trim() || "https://convoai.cloud/widget/convoai-widget.js";
const AGENT = process.env.NEXT_PUBLIC_CONVOAI_AGENT?.trim() || "27e668d2-a2d2-4926-a1c3-e63ad787c891";

export function ConvoAIEmbed() {
  if (!AGENT) return null;
  return (
    <Script
      id="convoai-messenger"
      src={SRC}
      data-agent={AGENT}
      data-color="#1F55FF"
      strategy="lazyOnload"
      onLoad={flushAssistantQueue}
    />
  );
}
