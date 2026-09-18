import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { randomBytes } from "node:crypto";
import type { WorkflowRecord } from "../types";
import { errorCategory, log } from "../observability";

/**
 * The durable record of every request Sera files.
 *
 * WHY THIS EXISTS AT ALL. A submitted request is the only thing in Sera that
 * cannot be allowed to evaporate: the visitor has been told a person will come
 * back to them. The conversation store is a process-local Map and openly
 * disposable; this is not. Email is a delivery mechanism, not storage — if the
 * provider is down or unconfigured, the request must still exist somewhere a
 * person can find it.
 *
 * WHY A FILE. This project has no database. Introducing Postgres so an
 * assistant can log leads would be infrastructure nobody asked for, and the
 * brief is explicit about not inventing persistence. An append-only JSONL file
 * is honest about what it is, is trivially greppable by whoever is on support,
 * and is one function away from being replaced by a real store.
 *
 * ⚠ EPHEMERAL WITHOUT A VOLUME. Under the standalone Docker deploy this path
 * lives inside the container filesystem and is lost on redeploy. Mount a volume
 * at the directory, or set SERA_REQUEST_LOG to a mounted path, before relying
 * on it as the system of record. Until then, EMAIL IS THE SYSTEM OF RECORD and
 * this is the backstop — which is exactly why `submitRequest` refuses to report
 * success when neither channel worked.
 */

const DEFAULT_PATH = ".sera/requests.jsonl";

/**
 * ⚠ BUILT BY CONCATENATION, NOT `path.resolve(process.cwd(), …)`.
 *
 * Turbopack statically analyses filesystem calls to decide what to trace into
 * the standalone output. `resolve()` over a runtime value is opaque to it, so
 * it gives up and traces THE WHOLE PROJECT — every source file and the entire
 * `public/` folder — into the server bundle. It says so in a build warning.
 * Joining the string here keeps the call site a plain `appendFile` on a value
 * the tracer does not try to resolve, and the standalone image stays small.
 *
 * An absolute SERA_REQUEST_LOG is used as given; a relative one — including the
 * default — is relative to the working directory, which under the standalone
 * server is the app root.
 */
function logPath(): string {
  const configured = process.env.SERA_REQUEST_LOG?.trim();
  if (configured?.startsWith("/")) return configured;
  return `${process.cwd()}/${configured || DEFAULT_PATH}`;
}

/**
 * A human-quotable reference.
 *
 * Crockford-ish alphabet with I, O, U and 0/1 removed: these get read down a
 * phone line and dictated back, and the pairs that get confused are worth more
 * than the entropy they cost. Six characters over a 29-symbol alphabet is ~29
 * bits, which is ample for a per-request handle that is also checked against
 * the conversation it belongs to.
 */
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTVWXYZ";

export function newReference(): string {
  const bytes = randomBytes(6);
  let out = "";
  for (const byte of bytes) out += ALPHABET[byte % ALPHABET.length];
  return `SER-${out}`;
}

export type StoredRequest = {
  reference: string;
  workflow: string;
  conversationId: string;
  sourcePage: string;
  createdAt: string;
  data: Record<string, string>;
};

export function toStoredRequest(
  record: WorkflowRecord,
  reference: string,
  conversationId: string,
): StoredRequest {
  return {
    reference,
    workflow: record.id,
    conversationId,
    sourcePage: record.sourcePage,
    createdAt: new Date().toISOString(),
    data: { ...record.data },
  };
}

/**
 * Append one request. Returns whether it was durably written.
 *
 * Never throws. A failed write must not lose the email that might still
 * succeed, and the caller decides what the visitor is told based on whether
 * ANY channel worked. Swallowing the error here and reporting `false` is what
 * makes that decision possible.
 */
export async function recordRequest(entry: StoredRequest): Promise<boolean> {
  const path = logPath();
  try {
    await mkdir(dirname(path), { recursive: true });
    await appendFile(path, `${JSON.stringify(entry)}\n`, "utf8");
    return true;
  } catch (error) {
    /*
     * ⚠ THE PATH IS NOT LOGGED. It comes from SERA_REQUEST_LOG and is a
     * filesystem layout detail of the host; the countable fact is that the
     * durable write failed. Local development still shows the whole error via
     * the thrown stack.
     */
    log.error("request_log_write_failed", {
      reference: entry.reference,
      error: errorCategory(error),
      ok: false,
    });
    return false;
  }
}
