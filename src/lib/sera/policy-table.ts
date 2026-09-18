/**
 * Sera's authorisation table. PURE DATA, ZERO IMPORTS.
 *
 * ⚠ SPLIT FROM `policy.ts` FOR THE SAME REASON `navigation-map.ts` IS SPLIT
 * FROM `navigation.ts`, and it is the same reason both times: the file that
 * holds the LOGIC imports `server-only`, which throws the moment a plain Node
 * process touches it — and `scripts/test-sera.mjs` is a plain Node process that
 * needs to assert things about this table.
 *
 * A security table nobody can write a test against is a security table nobody
 * checks. The test suite imports this file directly and proves three things on
 * every run: every future capability named in `tools/future.ts` has a verdict
 * here, none of them is reachable on the public surface, and nothing
 * money-spending or destructive has drifted to NO_CONFIRMATION.
 *
 * The split is not only a test convenience. This file is the POLICY; `policy.ts`
 * is the ENFORCEMENT that reads it. Those are different things with different
 * reasons to change: a new capability edits this file, a change to how verdicts
 * are computed edits that one.
 *
 * ⚠ THE DEFAULT IS DENY, AND IT LIVES IN `policy.ts`, NOT HERE. A name absent
 * from this table is refused by `decide()` as `unregistered`. Nothing needs to
 * be added to block something; things are added in order to ALLOW them.
 */

/* ── The axes ────────────────────────────────────────────────────────────── */

/**
 * What a tool does, in the terms a security review cares about.
 *
 * Ordered by consequence. Nothing in the code branches on the order — the
 * gate does the deciding — but reading the list top to bottom should make the
 * shape of the risk obvious.
 */
export type Permission =
  /** Reads published data or conversation-local state. Changes nothing outside. */
  | "READ_ONLY"
  /** Creates or changes a record: a lead, a collected field, a request. */
  | "WRITE"
  /** Touches live infrastructure a customer depends on. DNS, SSL, services. */
  | "SENSITIVE"
  /** Removes something that cannot be recovered by repeating the call. */
  | "DESTRUCTIVE"
  /** Spends money or creates an obligation to pay. */
  | "FINANCIAL"
  /** Acts across customers, or on the business's own systems. */
  | "ADMIN";

/**
 * What must hold before a tool executes. THE ENFORCEMENT AXIS.
 *
 * `CONFIRMATION_REQUIRED` deserves a note, because it means something specific
 * here and it is not "the model should ask first". A tool marked that way
 * CANNOT BE CALLED BY THE MODEL AT ALL. The model may prepare the action and
 * describe it; a person triggers it through a different entry point that has
 * its own session check. That is why `submit.ts` is a route and not a tool, and
 * why this value is a refusal rather than a prompt for the model to interpret.
 * A confirmation the model could satisfy by claiming to have asked is not a
 * confirmation.
 */
export type Gate =
  /** Runs when requested. Reading public data, moving within the site. */
  | "NO_CONFIRMATION"
  /** Not reachable from the model. A person must trigger it out-of-band. */
  | "CONFIRMATION_REQUIRED"
  /** Needs a signed-in customer identity, which this product does not yet have. */
  | "AUTHENTICATION_REQUIRED"
  /** Needs staff identity on an administrative surface. */
  | "ADMIN_ONLY"
  /** Refused unconditionally. Not "off by default" — off. */
  | "BLOCKED";

/** Which registry a tool belongs to. Sera's chat route is PUBLIC, always. */
export type Surface = "PUBLIC" | "CUSTOMER" | "ADMIN";

export type ToolPolicy = {
  permission: Permission;
  gate: Gate;
  surface: Surface;
  /**
   * Why this classification, in one line. Written for the person who changes it
   * later and needs to know what they are overruling.
   */
  because: string;
};

/* ── The table ───────────────────────────────────────────────────────────── */

/**
 * Every tool Sera can name, and every privileged operation she cannot.
 *
 * ⚠ AN UNLISTED NAME IS BLOCKED. `decide()` has no permissive default — see the
 * note there. Adding a tool to `tools/registry.ts` without adding it here makes
 * it unreachable, which is the correct direction for that mistake to fail in.
 */
export const POLICY: Record<string, ToolPolicy> = {
  /* ── Published information. Nothing here leaves the process. ──────────── */
  get_company_overview: {
    permission: "READ_ONLY",
    gate: "NO_CONFIRMATION",
    surface: "PUBLIC",
    because: "Reads static facts already published on the site.",
  },
  get_hosting_plans: {
    permission: "READ_ONLY",
    gate: "NO_CONFIRMATION",
    surface: "PUBLIC",
    because: "Reads the same price table the pricing page renders.",
  },
  get_services: {
    permission: "READ_ONLY",
    gate: "NO_CONFIRMATION",
    surface: "PUBLIC",
    because: "Reads the service catalogue and page summaries.",
  },
  search_faq: {
    permission: "READ_ONLY",
    gate: "NO_CONFIRMATION",
    surface: "PUBLIC",
    because: "Reads published FAQ answers.",
  },
  get_contact_channels: {
    permission: "READ_ONLY",
    gate: "NO_CONFIRMATION",
    surface: "PUBLIC",
    because: "Reads the published support address and phone number.",
  },

  /* ── Moving around the site the visitor is already on. ────────────────── */
  offer_to_show: {
    permission: "READ_ONLY",
    gate: "NO_CONFIRMATION",
    surface: "PUBLIC",
    because:
      "Scrolls to a page from a fixed allowlist. No confirmation because the " +
      "consent is the announcement Sera makes before it happens, and the " +
      "countdown can be stopped — see NavProposal.",
  },

  highlight_here: {
    permission: "READ_ONLY",
    gate: "NO_CONFIRMATION",
    surface: "PUBLIC",
    because:
      "Draws a ring around an element the visitor is already looking at, for " +
      "a few seconds. Changes no state and moves nothing. The target is a " +
      "name resolved against a derived allowlist — never a selector the model " +
      "wrote — so there is no path from model output to arbitrary DOM.",
  },
  offer_to_start: {
    permission: "READ_ONLY",
    gate: "NO_CONFIRMATION",
    surface: "PUBLIC",
    because:
      "READ_ONLY because it changes nothing — it renders a button. The " +
      "workflow it names is validated against the registry and the button's " +
      "own copy is composed from that workflow's spec, so the model picks " +
      "which of nine honest offers appears and writes none of it.",
  },

  /* ── Conversation-local state. Mutates this conversation and nothing else. */
  set_intent: {
    permission: "WRITE",
    gate: "NO_CONFIRMATION",
    surface: "PUBLIC",
    because:
      "WRITE because it changes stored state, but the state is one enum on " +
      "one conversation that expires with the session. Nobody is affected.",
  },
  start_workflow: {
    permission: "WRITE",
    gate: "NO_CONFIRMATION",
    surface: "PUBLIC",
    because: "Opens an empty request record in this conversation. Files nothing.",
  },
  record_details: {
    permission: "WRITE",
    gate: "NO_CONFIRMATION",
    surface: "PUBLIC",
    because:
      "Stores what the visitor themselves just said, after validation. No " +
      "confirmation gate: asking permission to remember an answer they gave " +
      "one sentence ago is the interrogation this product exists to avoid.",
  },
  get_request_status: {
    permission: "READ_ONLY",
    gate: "NO_CONFIRMATION",
    surface: "PUBLIC",
    because: "Reads back this conversation's own collected fields.",
  },
  prepare_request: {
    permission: "WRITE",
    gate: "NO_CONFIRMATION",
    surface: "PUBLIC",
    because:
      "Advances the record to AWAITING_CONFIRMATION, which puts the send " +
      "button on screen. It is the thing that ASKS for confirmation, so it " +
      "cannot itself require one.",
  },

  /* ── The submission boundary. ─────────────────────────────────────────── */
  /*
   * ⚠ NOT A TOOL, AND LISTED ANYWAY. There is no `submit_request` in
   * `TOOL_DEFINITIONS`; filing happens at `/api/sera/submit` when a person taps
   * a button. The entry exists so that a future refactor which "helpfully" adds
   * the tool finds a CONFIRMATION_REQUIRED verdict waiting for it and is
   * refused, instead of inheriting a permissive default. The name is the trap.
   */
  submit_request: {
    permission: "WRITE",
    gate: "CONFIRMATION_REQUIRED",
    surface: "PUBLIC",
    because:
      "Sends a real person an email about a real customer. Only a human tap " +
      "on /api/sera/submit files anything; the model has no path to it.",
  },

  /* ── Privileged operations. Interfaces exist; none is connected. ──────── */
  /*
   * These mirror `tools/future.ts`. Classifying them before they are built is
   * the whole point of this section: the gate is already closed, so connecting
   * one is a deliberate edit here rather than an oversight there.
   */
  provision_hosting: {
    permission: "FINANCIAL",
    gate: "BLOCKED",
    surface: "CUSTOMER",
    because: "Creates a billable service. No customer identity exists to authorise it.",
  },
  create_invoice: {
    permission: "FINANCIAL",
    gate: "BLOCKED",
    surface: "CUSTOMER",
    because: "Creates an obligation to pay.",
  },
  purchase_service: {
    permission: "FINANCIAL",
    gate: "BLOCKED",
    surface: "CUSTOMER",
    because: "Spends the visitor's money.",
  },
  check_domain: {
    permission: "READ_ONLY",
    gate: "BLOCKED",
    surface: "CUSTOMER",
    because:
      "The one future capability that already works — /api/domains/check " +
      "answers it today. Blocked from Sera anyway: the site has a real search " +
      "UI with result rows and checkout links, and a chat bubble is a worse " +
      "version of a page that exists. See tools/future.ts.",
  },
  register_domain: {
    permission: "FINANCIAL",
    gate: "BLOCKED",
    surface: "CUSTOMER",
    because: "Non-refundable purchase against a registrar.",
  },
  change_service_state: {
    permission: "SENSITIVE",
    gate: "BLOCKED",
    surface: "ADMIN",
    because: "Suspending a service takes a customer's site offline.",
  },
  create_dns_record: {
    permission: "SENSITIVE",
    gate: "BLOCKED",
    surface: "CUSTOMER",
    because: "DNS changes propagate and can break mail delivery.",
  },
  update_dns_record: {
    permission: "SENSITIVE",
    gate: "BLOCKED",
    surface: "CUSTOMER",
    because: "Same as creating one, with an existing record to get wrong.",
  },
  delete_dns_record: {
    permission: "DESTRUCTIVE",
    gate: "BLOCKED",
    surface: "CUSTOMER",
    because: "Not recoverable by repeating the call. Can take a domain dark.",
  },
  create_whmcs_client: {
    permission: "WRITE",
    gate: "BLOCKED",
    surface: "ADMIN",
    because: "Writes into the billing system of record.",
  },
  create_support_ticket: {
    permission: "WRITE",
    gate: "BLOCKED",
    surface: "CUSTOMER",
    because:
      "Needs a customer identity to file against. The public equivalent is a " +
      "HUMAN_CONTACT request, which a person confirms.",
  },
  get_invoice: {
    permission: "READ_ONLY",
    gate: "BLOCKED",
    surface: "CUSTOMER",
    because:
      "READ_ONLY and still blocked: reading one customer's invoice from an " +
      "anonymous surface is the whole problem. Permission is not authorisation.",
  },
  get_whmcs_customer: {
    permission: "READ_ONLY",
    gate: "BLOCKED",
    surface: "CUSTOMER",
    because: "Another person's account record.",
  },
  check_service_status: {
    permission: "READ_ONLY",
    gate: "BLOCKED",
    surface: "CUSTOMER",
    because: "Reveals whether a named account exists and its state.",
  },
  start_migration: {
    permission: "SENSITIVE",
    gate: "BLOCKED",
    surface: "ADMIN",
    because: "Copies a live site between hosts. Today a human does this from a request.",
  },
  upsert_lead: {
    permission: "WRITE",
    gate: "BLOCKED",
    surface: "ADMIN",
    because: "Writes to the CRM. Reachable today only through a confirmed submission.",
  },
  trigger_automation: {
    permission: "ADMIN",
    gate: "BLOCKED",
    surface: "ADMIN",
    because: "Fires an arbitrary n8n workflow. An open door to everything n8n can do.",
  },
};

