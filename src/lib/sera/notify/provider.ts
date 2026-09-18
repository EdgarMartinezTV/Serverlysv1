import "server-only";
import { emailFrom, teamEmail } from "../config";
import type { NotificationBody } from "./templates";
import { errorCategory, log } from "../observability";

/**
 * How a request reaches the Serverlys team.
 *
 * THE ABSTRACTION IS THE POINT. Sera's workflows call `notify()` and are told
 * only whether delivery succeeded and by which channel. Swapping Resend for
 * SES, or routing through n8n instead of email, is a change to this file and
 * nothing else.
 *
 * ⚠ NO PROVIDER IS CONFIGURED BY DEFAULT, AND THAT IS REPORTED HONESTLY. When
 * nothing is set up, `notify()` returns `{ delivered: false, channel: "none" }`
 * — it does not log a message and claim success. The submit route turns that
 * into a different thing said to the visitor: the request is still recorded and
 * they are given the support address and the ticket link, rather than being
 * told a team member has been notified when nobody has.
 *
 * This project had no email integration before Sera. Nothing was reused because
 * there was nothing to reuse: the site's existing forms POST straight from the
 * browser to WHMCS `submitticket.php`, which is a client-side navigation and
 * not a server-side send. That path is still the human fallback; it is not a
 * transport this module can call.
 */

export type DeliveryChannel = "resend" | "webhook" | "none";

export type DeliveryResult = {
  delivered: boolean;
  channel: DeliveryChannel;
  /** Server-side detail for logs. Never shown to a visitor. */
  detail?: string;
};

export interface NotificationProvider {
  readonly channel: DeliveryChannel;
  send(body: NotificationBody, meta: Record<string, string>): Promise<DeliveryResult>;
}

/* ── Resend ──────────────────────────────────────────────────────────────── */

/**
 * Resend over plain `fetch`, not the SDK.
 *
 * One HTTP POST with a JSON body does not justify a dependency, a version to
 * keep current, or another package in the server bundle. If the API ever grows
 * past this, swap the implementation here — the interface does not change.
 *
 * ⚠ `emailFrom()` must be on a domain verified in the Resend account, or every
 * send is rejected. That failure is logged with the provider's own message and
 * surfaces as `delivered: false`, never as a silent drop.
 */
function resendProvider(apiKey: string): NotificationProvider {
  return {
    channel: "resend",
    async send(body) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom(),
          to: [teamEmail()],
          subject: body.subject,
          text: body.text,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        return {
          delivered: false,
          channel: "resend",
          detail: `${response.status} ${detail.slice(0, 300)}`,
        };
      }
      return { delivered: true, channel: "resend" };
    },
  };
}

/* ── Generic webhook ─────────────────────────────────────────────────────── */

/**
 * POST the request as JSON to an arbitrary endpoint.
 *
 * This is the n8n door, and it is the most likely production route for
 * Serverlys: an n8n workflow can send the mail, open a WHMCS ticket and write
 * the row to a CRM from one payload, which is more than an email provider can
 * do. It carries a shared secret in a header rather than being open, because an
 * unauthenticated endpoint that emails the support team is a spam relay.
 */
function webhookProvider(url: string, secret?: string): NotificationProvider {
  return {
    channel: "webhook",
    async send(body, meta) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(secret ? { "X-Sera-Secret": secret } : {}),
        },
        body: JSON.stringify({ ...meta, subject: body.subject, text: body.text }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        return {
          delivered: false,
          channel: "webhook",
          detail: `${response.status}`,
        };
      }
      return { delivered: true, channel: "webhook" };
    },
  };
}

/* ── Resolution ──────────────────────────────────────────────────────────── */

/**
 * The configured provider, or null.
 *
 * Webhook wins when both are set: if someone has wired n8n, that workflow is
 * the thing that decides what happens to a request, and sending a second copy
 * by email behind its back produces duplicate tickets.
 */
export function resolveProvider(): NotificationProvider | null {
  const webhook = process.env.SERA_WEBHOOK_URL?.trim();
  if (webhook) {
    return webhookProvider(webhook, process.env.SERA_WEBHOOK_SECRET?.trim());
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) return resendProvider(resendKey);

  return null;
}

/** True when this deployment can actually notify anyone. */
export function notificationsConfigured(): boolean {
  return resolveProvider() !== null;
}

/**
 * Deliver a notification.
 *
 * Never throws: a transport failure is a `delivered: false` result the caller
 * must handle, not an exception that turns a filed request into a 500 and
 * leaves the visitor thinking nothing happened.
 */
export async function notify(
  body: NotificationBody,
  meta: Record<string, string>,
): Promise<DeliveryResult> {
  const provider = resolveProvider();
  if (!provider) {
    return {
      delivered: false,
      channel: "none",
      detail: "no SERA_WEBHOOK_URL or RESEND_API_KEY configured",
    };
  }

  try {
    const result = await provider.send(body, meta);
    if (!result.delivered) {
      /*
       * ⚠ `result.detail` IS NOT LOGGED HERE, and it is the interesting case
       * for why. It holds the provider's own response body — which for Resend
       * is the rejected `from` address, and for a webhook could be anything the
       * endpoint chose to return. It stays on the result object, where the
       * caller can act on it, and out of a line that may be shipped off-host.
       */
      log.error("notification_rejected", {
        channel: result.channel,
        reference: meta.reference,
        error: "provider_rejected",
        ok: false,
      });
    }
    return result;
  } catch (error) {
    log.error("notification_threw", {
      channel: provider.channel,
      reference: meta.reference,
      error: errorCategory(error),
      ok: false,
    });
    return {
      delivered: false,
      channel: provider.channel,
      detail: error instanceof Error ? error.message : "unknown",
    };
  }
}

/* ── Named entry points ──────────────────────────────────────────────────── */

/**
 * Semantic wrappers over `notify`.
 *
 * They exist so call sites read as intent ("notify the team about a
 * migration") and so that per-type routing — a different queue for support than
 * for sales — can be added here without touching a single workflow.
 */
export const sendMigrationNotification = (b: NotificationBody, m: Record<string, string>) =>
  notify(b, { ...m, kind: "migration" });

export const sendLeadNotification = (b: NotificationBody, m: Record<string, string>) =>
  notify(b, { ...m, kind: "lead" });

export const sendHumanSupportNotification = (b: NotificationBody, m: Record<string, string>) =>
  notify(b, { ...m, kind: "human_support" });
