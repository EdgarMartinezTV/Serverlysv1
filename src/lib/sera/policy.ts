import "server-only";

/**
 * What Sera is allowed to do, decided by the application and never by the model.
 *
 * ⚠ THIS FILE IS THE AUTHORISATION BOUNDARY, AND IT KNOWS NOTHING ABOUT THE
 * MODEL. No prompt text, no tool description, no conversation content reaches
 * it. `decide()` takes a tool name and a caller and returns a verdict, and the
 * only way to change that verdict is to edit this file. A conversation that
 * talks its way into `{"name": "provision_hosting"}` gets the same BLOCKED as
 * one that asks politely, because the decision was made before the request
 * existed.
 *
 * WHY A TABLE IN ITS OWN FILE RATHER THAN A FIELD ON EACH TOOL. Two reasons,
 * and the second is the real one:
 *
 *  1. `policy-table.ts` is readable as a table. "Which of these can spend
 *     money" is a question somebody will ask during a security review, and the
 *     answer should be one screen, not thirty scattered object literals.
 *
 *  2. THE POLICY MUST COVER TOOLS THAT DO NOT EXIST YET. `tools/future.ts`
 *     names the privileged operations Serverlys will eventually connect —
 *     provisioning, invoicing, DNS. They are classified today, as BLOCKED on a
 *     non-public surface. The day one is implemented, it arrives already
 *     governed: the author has to go and change a verdict deliberately, rather
 *     than adding a handler and discovering later that nothing was stopping an
 *     anonymous visitor from calling it.
 *
 * THE THREE AXES ARE INDEPENDENT ON PURPOSE.
 *
 *   `Permission` says what KIND of thing a tool does. It is descriptive, and
 *   it is what a reviewer reads.
 *
 *   `Gate` says what must be TRUE before it runs. It is the enforcement, and
 *   `runTool` never sees a call the gate rejected.
 *
 *   `Surface` says WHOSE registry it belongs to. Sera on a marketing page is
 *   the PUBLIC surface and only ever sees PUBLIC tools — not filtered in the
 *   prompt, but absent from the definitions the model is given AND rejected
 *   again at execution, because defence in depth means the second check assumes
 *   the first one failed.
 *
 * ⚠ AND THE VERDICTS ARE TESTED. `scripts/test-sera.mjs` imports the table
 * directly and asserts that every future capability is classified, that none is
 * reachable from PUBLIC, and that nothing FINANCIAL or DESTRUCTIVE has drifted
 * to NO_CONFIRMATION. A policy whose correctness rests on somebody re-reading
 * it is a policy that is correct on the day it is written.
 */

/*
 * ⚠ THE TABLE ITSELF LIVES IN `policy-table.ts`, which has no imports at all.
 * This module is `server-only` and therefore unreachable from a plain Node
 * process; the test suite has to be able to read the classifications. Same
 * split, same reasoning as `navigation.ts` / `navigation-map.ts`.
 */
export type { Gate, Permission, Surface, ToolPolicy } from "./policy-table";
import { POLICY, type Surface, type ToolPolicy } from "./policy-table";

/* ── The decision ────────────────────────────────────────────────────────── */

export type Verdict =
  | { allowed: true; policy: ToolPolicy }
  | {
      allowed: false;
      /** Machine-readable, for logs and telemetry. */
      code: "unregistered" | "blocked" | "wrong_surface" | "needs_confirmation" | "needs_auth";
      /** Handed back to the model as a tool result. Visitor-safe, no internals. */
      note: string;
      policy: ToolPolicy | null;
    };

/**
 * May this caller run this tool?
 *
 * ⚠ DENY BY DEFAULT, AND THE DEFAULT IS THE UNLISTED CASE. A name with no
 * entry is `unregistered`, not "probably fine". That is what makes the table
 * above exhaustive in the only sense that matters: anything it does not mention
 * cannot run.
 *
 * The notes returned on refusal are written FOR THE MODEL, so it can say
 * something true to the visitor instead of retrying. They describe the
 * situation ("I cannot do that from here; the team can") and never the
 * mechanism ("policy.ts gate BLOCKED"), because the model repeats what it is
 * told and the visitor should not receive a tour of the authorisation layer.
 */
export function decide(name: string, surface: Surface): Verdict {
  const policy = POLICY[name];

  if (!policy) {
    return {
      allowed: false,
      code: "unregistered",
      note: "That is not something I can do. Use one of the tools you have.",
      policy: null,
    };
  }

  if (policy.gate === "BLOCKED") {
    return {
      allowed: false,
      code: "blocked",
      note:
        "I cannot do that from this conversation — it is not something I am " +
        "able to act on. Offer to pass it to the Serverlys team instead.",
      policy,
    };
  }

  if (policy.surface !== surface) {
    /*
     * Same copy as `blocked` on purpose. "That tool exists but not on this
     * surface" tells a probing conversation which capabilities are one
     * privilege escalation away.
     */
    return {
      allowed: false,
      code: "wrong_surface",
      note:
        "I cannot do that from this conversation — it is not something I am " +
        "able to act on. Offer to pass it to the Serverlys team instead.",
      policy,
    };
  }

  if (policy.gate === "AUTHENTICATION_REQUIRED") {
    return {
      allowed: false,
      code: "needs_auth",
      note:
        "That needs the visitor to be signed in to their Serverlys account, " +
        "which is not possible here. Point them at the client area or offer " +
        "to have the team handle it.",
      policy,
    };
  }

  if (policy.gate === "ADMIN_ONLY") {
    return {
      allowed: false,
      code: "wrong_surface",
      note:
        "I cannot do that from this conversation — it is not something I am " +
        "able to act on. Offer to pass it to the Serverlys team instead.",
      policy,
    };
  }

  if (policy.gate === "CONFIRMATION_REQUIRED") {
    return {
      allowed: false,
      code: "needs_confirmation",
      note:
        "You cannot perform this yourself — it needs the visitor to press the " +
        "button on screen. Prepare it, read the summary back, and ask them to " +
        "confirm. Do not claim it is done.",
      policy,
    };
  }

  return { allowed: true, policy };
}

/** Whether a tool may be OFFERED to the model on this surface at all. */
export function isExposed(name: string, surface: Surface): boolean {
  return decide(name, surface).allowed;
}

/** The policy for a name, or null. Read-only view, for diagnostics and tests. */
export function policyFor(name: string): ToolPolicy | null {
  return POLICY[name] ?? null;
}

/** Every classified name. Used by the test suite to prove the table is complete. */
export function classifiedNames(): readonly string[] {
  return Object.keys(POLICY);
}
