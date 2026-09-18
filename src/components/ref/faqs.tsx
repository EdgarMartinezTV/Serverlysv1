"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Grid, Headline, Minus, Plus } from "./kit";

/**
 * Answer blocks. Stored as structure rather than an HTML string so the panel
 * renders real elements — a string would need dangerouslySetInnerHTML, and a
 * list inside a <p> is invalid markup.
 */
export type FaqBlock =
  | { type: "p"; runs: ({ text: string } | { text: string; href: string })[] }
  | { type: "ul"; items: string[] };

export type FaqItem = { q: string; a: FaqBlock[] };

/**
 * The reference's FAQ band, shared by every page built from one.
 *
 * A 936px column centred in the 1280px grid, rows separated by a hairline with
 * 20px of breathing room beneath each. The reference allows several panels open
 * at once, so this is a set of independent disclosures rather than an
 * accordion that closes its siblings.
 *
 * Built on <button aria-expanded> + a labelled region rather than <details> so
 * the +/− swap, the hairline and the panel padding are all styleable without
 * fighting the shadow root.
 */
export function Faqs({
  idPrefix,
  title,
  description,
  items,
  id,
  tone = "light",
  size = "md",
}: {
  /** Namespaces the button/panel ids so two FAQ bands can coexist. */
  idPrefix: string;
  title: string;
  description: string;
  items: readonly FaqItem[];
  /** Anchor target, for pages whose in-page rail points at this band. */
  id?: string;
  /** `dark` is for /automations, whose every band sits on the dark canvas. */
  tone?: "light" | "dark";
  /**
   * The reference changed this component between the pages we mirror. The
   * older one (/cloud-hosting, /ecommerce-hosting) sets questions at 16/26 and
   * butts the rows together; the newer one (/self-hosted-n8n) sets them at
   * 18/26 and puts 20px between rows, with no rule under the last. `md` keeps
   * the older shape so those two pages are untouched.
   */
  size?: "md" | "lg";
}) {
  const dark = tone === "dark";
  const lg = size === "lg";
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section
      id={id}
      aria-labelledby={`${idPrefix}-faq-heading`}
      className={cn(
        "scroll-mt-24",
        dark ? "bg-canvas-dark py-14 xl:py-20" : "bg-canvas py-8 xl:py-12",
      )}
    >
      <Grid>
        <Headline
          id={`${idPrefix}-faq-heading`}
          title={title}
          description={description}
          tone={tone}
          className="mb-10 xl:mb-16"
        />

        <div className="mx-auto w-full max-w-[936px]">
          {items.map((f, i) => {
            const isOpen = open.has(i);
            /* No margin between rows: the reference's pitch is 47px — 26px of
               header, 20px of padding, 1px of rule — with the rows adjacent. */
            return (
              <div
                key={f.q}
                className={cn(
                  "pb-5",
                  lg
                    ? "[&:not(:last-child)]:border-b [&:not(:first-child)]:mt-5"
                    : "border-b",
                  dark ? "border-line-on-dark" : "border-line",
                )}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${idPrefix}-faq-panel-${i}`}
                    id={`${idPrefix}-faq-button-${i}`}
                    onClick={() => toggle(i)}
                    className={cn(
                      "flex w-full items-start justify-between gap-4 text-left leading-[26px]",
                      lg ? "text-[18px] tracking-[-0.09px]" : "text-[16px]",
                      dark ? "text-fg-on-dark" : "text-fg",
                    )}
                  >
                    <span>{f.q}</span>
                    <span
                      aria-hidden
                      className={cn("mt-1 shrink-0", dark ? "text-fg-on-dark" : "text-fg")}
                    >
                      {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={`${idPrefix}-faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`${idPrefix}-faq-button-${i}`}
                    className={cn(
                      "flex flex-col gap-4 pt-4 text-body",
                      dark ? "text-fg-on-dark-secondary" : "text-fg",
                    )}
                  >
                    {f.a.map((block, j) => (
                      <Block key={j} block={block} dark={dark} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Grid>
    </section>
  );
}

function Block({ block, dark = false }: { block: FaqBlock; dark?: boolean }) {
  if (block.type === "ul") {
    return (
      <ul className="ml-[18px] list-disc">
        {block.items.map((item) => (
          <li key={item} className="mb-1">
            <b className="font-semibold">{item}</b>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p>
      {block.runs.map((run, i) =>
        "href" in run ? (
          <Link
            key={i}
            href={run.href}
            className={cn(
              "font-medium underline decoration-from-font",
              dark
                ? "text-primary-on-dark hover:text-white"
                : "text-primary hover:text-primary-hover",
            )}
          >
            {run.text}
          </Link>
        ) : (
          <span key={i}>{run.text}</span>
        ),
      )}
    </p>
  );
}
