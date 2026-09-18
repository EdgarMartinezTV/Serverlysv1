/**
 * Privileged operations Sera does NOT perform today.
 *
 * ⚠ NOTHING IN THIS FILE IS IMPLEMENTED, AND NOTHING IS REGISTERED. These are
 * interfaces, not stubs — there is no function body to accidentally call and no
 * fake success to return. That is deliberate and it is the most important thing
 * about the file: a mock `provisionHosting()` that resolves happily is
 * indistinguishable from a real one at the call site, and the first time it
 * matters, a customer is told their hosting is ready when it is not.
 *
 * WHY THEY ARE WRITTEN DOWN AT ALL. The shape of a request is a design
 * decision worth making before the credentials arrive. Fixing these signatures
 * now is what lets `tools/registry.ts` stay a closed set of read-only,
 * conversation-local operations: there is no pressure to slip a half-built
 * provisioning call in beside `search_faq` because there is an obvious, empty
 * place for it to live instead.
 *
 * WHAT MUST BE TRUE BEFORE ANY OF THESE IS CONNECTED:
 *
 *  · AUTHORISATION. Every one of these acts on a specific customer's account.
 *    Sera's callers are anonymous visitors on a marketing site, so no signed-in
 *    identity exists to authorise against. Until one does, none of these can be
 *    exposed to the model at all — not even read-only.
 *  · SEPARATION. Administrative tools must live in their own registry with its
 *    own gate. Adding them to `TOOL_DEFINITIONS` puts them one prompt-injection
 *    away from an anonymous visitor.
 *  · CONFIRMATION. Anything that spends money, changes DNS or touches live
 *    infrastructure needs the same explicit user confirmation that filing a
 *    request already has, and for the same reason.
 *
 * The credentials for most of these already exist somewhere in the business —
 * WHMCS has an admin API and this project already reads its variables for
 * domain search (see `lib/env.ts`). Existing credentials are not the bar.
 * Authorisation is.
 */

export type CustomerRef = { whmcsClientId: number };

/**
 * The policy name each future operation will be registered under.
 *
 * ⚠ THE POINT OF THIS ARRAY IS THAT IT IS CHECKABLE. `policy.ts` classifies
 * every one of these today, as BLOCKED, on a non-public surface — and
 * `scripts/test-sera.mjs` asserts that none of them is exposed and that none is
 * missing a verdict. Without the list, "these are governed" is a claim in a
 * comment; with it, deleting a policy entry fails a test.
 *
 * ⚠ AND THE NAMES ARE NOT FREE. An interface renamed here without renaming the
 * policy entry makes a real capability arrive unclassified — which
 * `assertPolicyCoverage()` in the registry catches only once it is REGISTERED,
 * i.e. after someone has already wired it up. The coverage test catches it now.
 */
export const FUTURE_TOOL_NAMES = [
  "provision_hosting",
  "change_service_state",
  "create_whmcs_client",
  "create_invoice",
  "create_support_ticket",
  "check_domain",
  "register_domain",
  "create_dns_record",
  "update_dns_record",
  "delete_dns_record",
  "upsert_lead",
  "trigger_automation",
  "purchase_service",
  "get_invoice",
  "get_whmcs_customer",
  "check_service_status",
  "start_migration",
] as const;

export interface HostingOperations {
  /** Order and provision a plan for an existing WHMCS client. */
  provisionHosting(customer: CustomerRef, planSlug: string): Promise<never>;
  /** Suspend, unsuspend or terminate a service. */
  changeServiceState(serviceId: number, state: "suspend" | "unsuspend"): Promise<never>;
}

export interface BillingOperations {
  /** Create a WHMCS client from a lead Sera has already qualified. */
  createWhmcsClient(details: { name: string; email: string }): Promise<never>;
  /** Raise an invoice. Never without explicit confirmation. */
  createInvoice(customer: CustomerRef, items: unknown[]): Promise<never>;
  /** Open a ticket in a named department on the customer's behalf. */
  createSupportTicket(customer: CustomerRef, departmentId: number, body: string): Promise<never>;
}

export interface DomainOperations {
  /**
   * Availability is the ONE capability here that already exists and works:
   * `/api/domains/check` answers it against RDAP or WHMCS today. It is absent
   * from Sera's registry for a different reason — the site has a purpose-built
   * search UI with real result rows and checkout links, and routing that
   * through a chat bubble would be a worse version of a page that already
   * exists. Sera links to it instead.
   */
  checkDomain(domain: string): Promise<never>;
  registerDomain(customer: CustomerRef, domain: string, years: number): Promise<never>;
  createDnsRecord(domain: string, record: unknown): Promise<never>;
}

export interface CrmOperations {
  /** Push a qualified lead into whichever CRM the business settles on. */
  upsertLead(lead: unknown): Promise<never>;
  /** Fire an n8n workflow. Today's equivalent is SERA_WEBHOOK_URL. */
  triggerAutomation(workflowId: string, payload: unknown): Promise<never>;
}
