"use client";

/**
 * Talk to the ConvoAI messenger from the site's own buttons.
 *
 * ConvoAI (convoai.cloud) is the assistant on every serverlys.com page — the Serverlys AI
 * Employee, synced hourly from /api/convoai/knowledge. Its embed script defines `window.ConvoAI`
 * once it has loaded (it loads lazily, after the page is interactive). A click that lands before
 * that is queued and replayed, so no "Ask ConvoAI" button is ever a dead click.
 */

type ConvoAIApi = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
  showNewMessage: (text?: string) => void;
  onShow: (cb: () => void) => void;
  onHide: (cb: () => void) => void;
  identify: (o: { user_jwt: string }) => Promise<unknown>;
};

declare global {
  interface Window {
    ConvoAI?: ConvoAIApi;
    __convoaiQueue?: ((api: ConvoAIApi) => void)[];
  }
}

export const ASSISTANT_NAME = "ConvoAI";

/** Run `fn` with the messenger, now or as soon as it loads. */
export function withAssistant(fn: (api: ConvoAIApi) => void): void {
  if (typeof window === "undefined") return;
  if (window.ConvoAI) return fn(window.ConvoAI);
  (window.__convoaiQueue ??= []).push(fn);
}

/** Open the messenger. With `text`, the composer is pre-filled so the visitor only presses send. */
export function openAssistant(text?: string): void {
  withAssistant((api) => (text ? api.showNewMessage(text) : api.open()));
}

/** Called by the embed's onload: replays clicks that happened before the script arrived. */
export function flushAssistantQueue(): void {
  const api = window.ConvoAI;
  const queue = window.__convoaiQueue;
  if (!api || !queue?.length) return;
  window.__convoaiQueue = [];
  for (const fn of queue) fn(api);
}

/**
 * Ask the messenger something on the visitor's behalf: opens it and sends `text` as their message
 * (falls back to pre-filling the composer on widget versions without `send`).
 */
export function askAssistant(text: string): void {
  withAssistant((api) => {
    const send = (api as ConvoAIApi & { send?: (t: string) => void }).send;
    if (send) send(text);
    else api.showNewMessage(text);
  });
}

/**
 * Recognise a client who is signed in to the client area (same origin, so the WHMCS session cookie
 * goes with the request): the first time the messenger opens on this page, ask the portal hook for
 * the client's signed identity token and hand it to ConvoAI, which verifies it. Visitors who never
 * open the chat cost WHMCS nothing; signed-out visitors get the login page back and stay anonymous.
 */
let recognizing = false;
export function recognizeSignedInClient(): void {
  const api = window.ConvoAI;
  if (!api || recognizing) return;
  recognizing = true;
  let asked = false;
  api.onShow(() => {
    if (asked) return;
    asked = true;
    fetch("/clientarea?sv_convoai_token=1", { credentials: "same-origin", headers: { accept: "application/json" }, cache: "no-store" })
      .then((r) => ((r.headers.get("content-type") ?? "").includes("application/json") ? r.json() : null))
      .then((d: { token?: string | null } | null) => {
        if (d && typeof d.token === "string" && d.token.split(".").length === 3) return api.identify({ user_jwt: d.token });
      })
      .catch(() => {});
  });
}
