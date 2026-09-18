import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Inline markup for article body text.
 *
 * Renders the three markers documented on `Block` in data/articles.ts —
 * `**bold**`, `` `code` `` and `[label](/path)` — as React nodes.
 *
 * WHY NOT HTML. The obvious alternative is storing a fragment of HTML and
 * setting it with dangerouslySetInnerHTML. That would be faster to write and
 * strictly worse: it makes every article a potential injection site, it lets
 * arbitrary tags escape the design system's typography, and it makes the
 * content unreviewable in a diff. Building nodes means the worst a malformed
 * marker can do is render as literal text.
 *
 * WHY NOT A MARKDOWN LIBRARY. The archive uses exactly these three
 * constructs. A parser dependency would add a bundle cost and a CommonMark
 * surface area (raw HTML passthrough included) to support features nothing
 * writes.
 */

/**
 * One pattern, three alternatives, in priority order. Code first so that a
 * literal `**` inside backticks is not read as emphasis.
 *
 * Link hrefs deliberately exclude ")" and whitespace, so an unclosed bracket
 * fails to match and falls through to plain text rather than swallowing the
 * rest of the paragraph.
 *
 * Stored as a SOURCE STRING, not a shared /g RegExp. A global regex carries
 * `lastIndex` between calls, so a single shared instance means the second
 * component to render starts matching from wherever the first one stopped —
 * a real bug, and one that only shows up once two blocks on a page contain
 * markup. Each call builds its own.
 */
const INLINE_SOURCE = String.raw`\x60([^\x60]+)\x60|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)`;

const inlinePattern = () => new RegExp(INLINE_SOURCE, "g");

/** Internal links get next/link (prefetch, client nav); external ones do not. */
function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  const className =
    "font-medium text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  if (isInternal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
}

export function RichText({ text }: { text: string }) {
  // Fast path: the overwhelming majority of sentences carry no markup at all,
  // and this skips building an array for them.
  if (!/[`*[]/.test(text)) return <>{text}</>;

  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  const re = inlinePattern();

  for (let m = re.exec(text); m !== null; m = re.exec(text)) {
    const [match, code, bold, label, href] = m;

    if (m.index > cursor) nodes.push(text.slice(cursor, m.index));

    if (code !== undefined) {
      nodes.push(
        <code
          key={key++}
          /* `overflow-wrap: anywhere`, because inline code is the one span of
             text on the site with no spaces to break at. Eight article pages
             pushed the document wider than the viewport at 320px on a single
             token — a connection string, a GA4 property path — and two of them
             (`/blog/mysql-database-guide`, `/blog/google-analytics-4-guide`)
             still overflowed at 430px, which is every phone. `anywhere` rather
             than `break-all` so ordinary short tokens still break at their
             natural boundary and only the unbreakable ones are cut. */
          className="rounded bg-canvas-inset px-1.5 py-0.5 font-mono text-[0.875em] text-fg [overflow-wrap:anywhere]"
        >
          {code}
        </code>,
      );
    } else if (bold !== undefined) {
      nodes.push(
        <strong key={key++} className="font-semibold text-fg">
          {bold}
        </strong>,
      );
    } else if (label !== undefined && href !== undefined) {
      nodes.push(
        <InlineLink key={key++} href={href}>
          {label}
        </InlineLink>,
      );
    }

    cursor = m.index + match.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));

  return <>{nodes}</>;
}

/** Plain-text form of the same string. For metadata, JSON-LD and alt text. */
export function stripInline(text: string): string {
  return text.replace(inlinePattern(), (_m, code, bold, label) => code ?? bold ?? label ?? "");
}
