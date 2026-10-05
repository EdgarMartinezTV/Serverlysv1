import { track } from "./index";
import { isBillingUrl, withAttribution } from "./attribution";

/**
 * Click events, from ONE delegated listener instead of an onClick on each of
 * the ~60 CTAs. A link is classified by WHERE IT GOES, which is the stable
 * fact; component names and class lists change with every redesign.
 *
 * The same listener appends campaign attribution to every link into WHMCS
 * just before the browser follows it (see attribution.ts).
 *
 * Opting a non-link element in, or overriding the inference:
 *   <button data-analytics-event="click_get_started" data-analytics-label="…">
 */

const PLAN_PATH = /\/store\/([a-z0-9-]+)\/([a-z0-9-]+)\/?$/i;
// Plan buttons ("Choose plan") are NOT here: they already send
// select_hosting_plan + begin_checkout, and a third event would inflate CTAs.
const GET_STARTED = /\b(get started|start now|start a project|start your project)\b/i;
const WHATSAPP_HOSTS = new Set(["wa.me", "api.whatsapp.com", "web.whatsapp.com", "chat.whatsapp.com"]);

/** Where on the page the click happened — header, footer, a menu, or the body. */
function locationOf(el: Element): string {
  if (el.closest("[data-sera-root], #sera-panel")) return "assistant";
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  if (el.closest("nav")) return "nav";
  return "main";
}

function labelOf(el: HTMLElement): string {
  return (
    el.dataset.analyticsLabel ||
    el.getAttribute("aria-label") ||
    el.textContent ||
    ""
  )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function classify(anchor: HTMLAnchorElement): void {
  const raw = anchor.getAttribute("href");
  if (!raw) return;
  const link_location = locationOf(anchor);
  const link_text = labelOf(anchor);

  if (raw.startsWith("tel:")) {
    // The number itself is ours (published), but it is still a phone number,
    // and sanitize() would redact it anyway. The location is what matters.
    track("click_phone", { link_location });
    return;
  }
  if (raw.startsWith("mailto:")) {
    track("click_contact", { contact_method: "email", link_location });
    return;
  }
  if (raw.startsWith("whatsapp:")) {
    track("click_whatsapp", { link_location });
    return;
  }

  let url: URL;
  try {
    url = new URL(raw, window.location.href);
  } catch {
    return;
  }

  if (WHATSAPP_HOSTS.has(url.hostname)) {
    track("click_whatsapp", { link_location });
    return;
  }

  const sameSite = url.origin === window.location.origin;
  if (sameSite && (url.pathname === "/support" || url.pathname === "/contact")) {
    track("click_contact", { contact_method: "support_page", link_location });
  }

  if (isBillingUrl(url)) {
    const plan = url.pathname.match(PLAN_PATH);
    if (plan) {
      const [, group, slug] = plan;
      track("select_hosting_plan", { plan_group: group, plan_name: slug, link_text, link_location });
      track("begin_checkout", { item_category: "hosting", plan_group: group, plan_name: slug });
    } else if (/\/cart\.php$/.test(url.pathname) && url.searchParams.get("a") === "add") {
      const transfer = url.searchParams.get("domain") === "transfer";
      track("begin_checkout", { item_category: transfer ? "domain_transfer" : "domain" });
    } else if (/\/submitticket\.php$/.test(url.pathname)) {
      // Every "Talk to an expert" / "Start a project" CTA opens a sales ticket.
      track("click_contact", { contact_method: "sales_ticket", link_location, link_text });
    }
  }

  if (GET_STARTED.test(link_text)) {
    track("click_get_started", { link_text, link_location, link_path: url.pathname });
  }
}

function onClick(event: MouseEvent): void {
  // Left and middle clicks both navigate; right-click does not.
  if (event.button !== 0 && event.button !== 1) return;
  const target = event.target as Element | null;
  if (!target?.closest) return;

  const explicit = target.closest<HTMLElement>("[data-analytics-event]");
  const anchor = target.closest<HTMLAnchorElement>("a[href]");

  try {
    if (explicit) {
      const name = explicit.dataset.analyticsEvent;
      if (name === "click_get_started" || name === "click_contact" || name === "click_whatsapp" || name === "click_phone") {
        track(name, { link_text: labelOf(explicit), link_location: locationOf(explicit) });
      }
    } else if (anchor) {
      classify(anchor);
    }
  } catch {
    // Tracking must never block navigation.
  }

  // Attribution: rewrite the href BEFORE the browser reads it. Capture phase,
  // so this runs ahead of React's handlers and the default action.
  if (anchor) {
    const href = anchor.getAttribute("href");
    if (href) {
      const next = withAttribution(href);
      if (next !== href) anchor.setAttribute("href", next);
    }
  }
}

let installed = false;

/** Idempotent: a second call (Strict Mode, Fast Refresh) does nothing. */
export function installClickTracking(): () => void {
  if (installed) return () => {};
  installed = true;
  document.addEventListener("click", onClick, true);
  document.addEventListener("auxclick", onClick, true);
  return () => {
    installed = false;
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("auxclick", onClick, true);
  };
}
