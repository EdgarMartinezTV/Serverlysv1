import "server-only";

/**
 * Bounded request-body reading.
 *
 * ⚠ `await request.json()` HAS NO SIZE LIMIT in an App Router route handler.
 * The `bodyParser.sizeLimit` that used to cap this belonged to Pages API
 * routes and has no equivalent here, so a handler that calls `.json()` will
 * faithfully buffer however many megabytes the caller decides to send, into
 * the heap of a container sized for a marketing site. Two or three concurrent
 * large uploads are enough to end the process, and none of the limiters
 * elsewhere in this codebase help: they run AFTER the body is read, because
 * they need the parsed body to know which conversation is calling.
 *
 * Every route here expects a small JSON object — a message, a conversation id,
 * a pathname. Nothing legitimate approaches even the low cap below, so this
 * costs real traffic nothing and removes the class of attack outright.
 *
 * WHY THE LENGTH HEADER IS NOT ENOUGH ON ITS OWN. `Content-Length` is supplied
 * by the caller and can simply be wrong, and a chunked request omits it
 * entirely. It is checked first because it rejects the obvious case without
 * reading a byte; the streaming count after it is what actually holds, because
 * it measures what arrived rather than what was promised.
 */

export type BodyOutcome<T> =
  | { ok: true; value: T }
  | { ok: false; status: 400 | 413; reason: string };

/** Comfortably above any real payload, far below anything that hurts. */
export const MAX_JSON_BODY_BYTES = 16 * 1024;

export async function readJsonObject(
  request: Request,
  maxBytes: number = MAX_JSON_BODY_BYTES,
): Promise<BodyOutcome<Record<string, unknown>>> {
  const tooLarge = {
    ok: false as const,
    status: 413 as const,
    reason: "That request is too large.",
  };

  // Cheap pre-check: a caller honest about an oversized body is refused before
  // a single byte is buffered.
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return tooLarge;

  let text: string;
  try {
    const body = request.body;
    // No stream to meter (an empty body, or a runtime that already buffered):
    // fall back to text(), still bounded by the check that follows.
    if (!body) {
      text = await request.text();
      if (text.length > maxBytes) return tooLarge;
    } else {
      const reader = body.getReader();
      const chunks: Uint8Array[] = [];
      let total = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        /*
         * Abort the moment the cap is passed rather than after the body
         * finishes. `cancel()` tells the peer to stop sending, so a caller
         * streaming a gigabyte costs us the first 16KB of it and nothing more.
         */
        if (total > maxBytes) {
          await reader.cancel().catch(() => {});
          return tooLarge;
        }
        chunks.push(value);
      }
      // Concatenated by hand rather than through Blob: `total` is already the
      // exact byte count, so one allocation of a known size does it.
      const joined = new Uint8Array(total);
      let offset = 0;
      for (const chunk of chunks) {
        joined.set(chunk, offset);
        offset += chunk.byteLength;
      }
      text = new TextDecoder().decode(joined);
    }
  } catch {
    return { ok: false, status: 400, reason: "Malformed request." };
  }

  try {
    const parsed = JSON.parse(text);
    // Arrays are objects to `typeof`, and every caller here indexes by name.
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, status: 400, reason: "Malformed request." };
    }
    return { ok: true, value: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, status: 400, reason: "Malformed request." };
  }
}
