"use client";

import { useState } from "react";

/** Rounded dark accordion rows (reference's "Questions? Answered" band). */
export function FaqRows({
  items,
}: {
  items: ReadonlyArray<{ question: string; answer: string }>;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mx-auto flex max-w-[786px] flex-col gap-3">
      {items.map((f, i) => {
        const on = open === i;
        return (
          <div key={f.question} className="rounded-[24px] bg-[#0a2a6e]">
            <h3>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`bfaq-${i}`}
                id={`bfaq-q-${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left text-[18px] leading-[26px] font-medium text-[#dbe6ff] sm:px-8"
              >
                {f.question}
                <svg
                  viewBox="0 0 24 24"
                  className={`size-5 shrink-0 transition-transform duration-300 ${on ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            <div
              id={`bfaq-${i}`}
              role="region"
              aria-labelledby={`bfaq-q-${i}`}
              hidden={!on}
              className="px-6 pb-6 text-[16px] leading-[26px] text-[#c3d3f5] sm:px-8"
            >
              {f.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
