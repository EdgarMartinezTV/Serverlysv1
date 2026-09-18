/**
 * Article content model.
 *
 * Split out from the data so that a generated post file can import the type
 * without importing the whole 76-article archive — which would be a require
 * cycle, since the archive's barrel is itself assembled in index.ts.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  /**
   * A sub-heading. Deliberately carries NO id: only h2s appear in the contents
   * nav, and giving h3s anchors invites a two-level nav that this layout has
   * no room for. They are still real headings for outline and accessibility.
   */
  | { type: "h3"; text: string }
  | { type: "ul"; items: readonly string[] }
  | { type: "ol"; items: readonly string[] }
  | { type: "callout"; title: string; text: string }
  /**
   * A comparison table. `head` may be empty for a plain two-column layout.
   * Rows are ragged-safe: the renderer pads short rows rather than throwing.
   */
  | { type: "table"; head: readonly string[]; rows: readonly (readonly string[])[] }
  /** A code block. `lang` is a label only — no syntax highlighter is shipped. */
  | { type: "code"; code: string; lang?: string }
  /** A pulled-out statement. Not a testimonial — see the editorial rules above. */
  | { type: "quote"; text: string };

export type ArticleCategory =
  | "Hosting"
  | "Domains"
  | "Performance"
  | "AI"
  | "Getting started"
  | "Security"
  | "WordPress"
  | "Ecommerce";

export type Article = {
  slug: string;
  title: string;
  /** Meta description and the card summary. One sentence. */
  description: string;
  category: ArticleCategory;
  /** ISO date. The day it was published on serverlys.com. */
  published: string;
  body: readonly Block[];
};
