"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Cursor,
  Gift,
  Grid,
  Headline,
  Megaphone,
  Minus,
  Plus,
  ShieldCheck,
  Spark,
  Store,
  Trend,
} from "./kit";

const ICONS = {
  cursor: Cursor,
  spark: Spark,
  megaphone: Megaphone,
  trend: Trend,
  gift: Gift,
  shield: ShieldCheck,
  store: Store,
} as const;

export type SwitchCopy = {
  title: string;
  description?: string;
  cta: string;
  ctaHref?: string;
  items: readonly { icon: keyof typeof ICONS; title: string; body: string }[];
};

/**
 * The reference's `h-content-switch`: a centred headline over a 600/600 split,
 * with a single-open accordion on the left and its media on the right.
 *
 * Shared — /ecommerce-hosting uses it for AI email marketing and
 * /migrations for "Why migrate to Serverlys?". The MEDIA IS A SLOT so each
 * page supplies its own.
 *
 * Single-open, not multi-open, because the right column shows the open item's
 * media; two open rows would leave the pairing ambiguous. That is also why the
 * first row starts open rather than the list starting collapsed.
 */
export function ContentSwitch({
  id,
  copy: EMAIL,
  media,
}: {
  id: string;
  copy: SwitchCopy;
  media: React.ReactNode;
}) {
  const [open, setOpen] = useState(0);

  return (
    <section aria-labelledby={`${id}-heading`} className="bg-canvas py-14 md:py-16 xl:py-20">
      <Grid>
        <Headline
          id={`${id}-heading`}
          title={EMAIL.title}
          description={EMAIL.description}
          className="mb-10 xl:mb-12"
        />

        <div className="grid gap-10 xl:grid-cols-2 xl:items-center xl:gap-x-20">
          <div>
            {EMAIL.items.map((item, i) => {
              const Icon = ICONS[item.icon];
              const isOpen = i === open;
              return (
                <div key={item.title} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${id}-panel-${i}`}
                      id={`${id}-button-${i}`}
                      onClick={() => setOpen(i)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="size-5 shrink-0 text-fg" />
                        <span
                          className={cn(
                            "text-[20px] leading-7 tracking-[-0.1px]",
                            isOpen ? "font-semibold text-fg" : "text-fg",
                          )}
                        >
                          {item.title}
                        </span>
                      </span>
                      <span aria-hidden className="shrink-0 text-fg">
                        {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                      </span>
                    </button>
                  </h3>

                  {isOpen && (
                    <div
                      id={`${id}-panel-${i}`}
                      role="region"
                      aria-labelledby={`${id}-button-${i}`}
                      className="pb-6"
                    >
                      <p className="text-body text-fg">{item.body}</p>
                      <a
                        href={EMAIL.ctaHref ?? "#pricing"}
                        className="mt-4 inline-flex items-center gap-1.5 text-body font-semibold text-primary hover:text-primary-hover"
                      >
                        {EMAIL.cta}
                        <ArrowRight className="size-4" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div>{media}</div>
        </div>
      </Grid>
    </section>
  );
}
