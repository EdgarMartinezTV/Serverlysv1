"use client";

import { useState } from "react";
import { SeraMark } from "@/components/sera/sera-mark";
import { cn } from "@/lib/utils";

/**
 * The co-worker bento as an accordion (2026-10-03).
 *
 * Five plates in one row. ONE is open at a time: wide, lit brand blue, with a
 * small demo of that capability. Hovering, focusing or tapping another plate
 * opens it and closes the previous one. "Answer" is open at rest, so the
 * resting state is exactly the layout that shipped before this was
 * interactive; the last plate opened stays open when the pointer leaves, so
 * the row never snaps back under someone reading it.
 *
 * Width is `flex-grow` (2.2 open, 1 closed), the same mechanism as the Launch
 * row. Closed plates keep their staggered heights; the open one is full
 * height. Below `lg` the plates stack and the open one simply shows its demo.
 *
 * The body copy is always in the DOM. Only the demo is hidden when closed,
 * and it is decorative (aria-hidden), so nothing is lost to a screen reader.
 */

type Id = "capture" | "escalate" | "honest" | "trigger" | "answer";

const CARDS: ReadonlyArray<{ id: Id; title: string; body: string }> = [
  {
    id: "capture",
    title: "Capture",
    body: "It writes down the name and the intent, so an enquiry is never just a missed message.",
  },
  {
    id: "escalate",
    title: "Escalate",
    body: "When it should not attempt something, a person gets the whole conversation, not a summary.",
  },
  {
    id: "honest",
    title: "Stay honest",
    body: "It says when it does not know, and tells customers they are talking to an assistant.",
  },
  {
    id: "trigger",
    title: "Trigger work",
    body: "A conversation can start a booking, a ticket or a follow-up without you wiring it up.",
  },
  {
    id: "answer",
    title: "Answer",
    body: "Hours, prices, stock and delivery: the questions that make up most of a site's volume, answered from your own pages.",
  },
];

export function CoworkerBento() {
  const [open, setOpen] = useState<Id>("answer");

  return (
    <ul className="mt-14 flex flex-col gap-3 lg:h-[440px] lg:flex-row lg:items-end">
      {CARDS.map((card, i) => {
        const isOpen = open === card.id;
        return (
          <li
            key={card.id}
            tabIndex={0}
            onMouseEnter={() => setOpen(card.id)}
            onFocus={() => setOpen(card.id)}
            onClick={() => setOpen(card.id)}
            className={cn(
              "group relative flex min-h-48 cursor-pointer flex-col overflow-hidden rounded-2xl p-6 outline-none ring-1 focus-visible:ring-2 focus-visible:ring-white",
              "lg:min-w-0 lg:basis-0 motion-safe:transition-[flex-grow,height,background-color] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
              isOpen
                ? "bg-gradient-to-br from-brand-500 to-brand-700 ring-white/15 lg:h-full lg:grow-[2.2]"
                : cn(
                    "bg-[linear-gradient(180deg,#0a1a3e_0%,#040c22_100%)] ring-white/10 hover:ring-white/25 lg:grow",
                    i % 2 === 0 ? "lg:h-full" : "lg:h-[78%]",
                  ),
            )}
          >
            {isOpen && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-white/[0.06] [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%)]"
              />
            )}

            <h3 className="relative text-body-lg font-medium whitespace-nowrap text-white">
              {card.title}
            </h3>
            <p
              className={cn(
                "relative text-small",
                isOpen
                  ? "mt-2 max-w-[380px] text-fg-on-brand-muted"
                  : "mt-6 text-fg-on-dark-muted lg:mt-auto",
              )}
            >
              {card.body}
            </p>

            {isOpen && (
              <div
                aria-hidden="true"
                className="relative mt-8 motion-safe:animate-[coworker-in_400ms_cubic-bezier(0.22,1,0.36,1)_both]"
              >
                <Demo id={card.id} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ── Demos: one honest moment per capability ──────────────────────────────── */

function Bubble({ children, from }: { children: React.ReactNode; from: "visitor" | "agent" }) {
  if (from === "visitor") {
    return (
      <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white/90 px-4 py-3 text-small text-fg">
        {children}
      </p>
    );
  }
  return (
    <div className="flex w-fit max-w-[92%] items-start gap-2.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-e3">
      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-white">
        <SeraMark className="h-3.5 w-3.5" />
      </span>
      <p className="text-small text-fg">{children}</p>
    </div>
  );
}

function Check() {
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success-fill text-white">
      <svg viewBox="0 0 16 16" fill="none" className="size-3">
        <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Demo({ id }: { id: Id }) {
  switch (id) {
    case "answer":
      return (
        <div className="flex flex-col gap-3">
          <Bubble from="visitor">Do you deliver on Sundays?</Bubble>
          <Bubble from="agent">Yes, from 9am to 1pm. Want me to book a slot this Sunday?</Bubble>
        </div>
      );

    case "capture":
      return (
        <div className="max-w-[340px] rounded-2xl bg-white p-5 shadow-e3">
          <div className="flex items-center justify-between">
            <span className="text-small font-semibold text-fg">New enquiry</span>
            <span className="flex items-center gap-1.5 text-micro font-semibold text-success">
              <Check /> Saved
            </span>
          </div>
          <dl className="mt-4 divide-y divide-line-subtle text-small">
            {[
              ["Name", "Maria L."],
              ["Wants", "Deep clean, 3 bedrooms"],
              ["When", "Friday morning"],
              ["Contact", "Text, not email"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <dt className="text-fg-muted">{k}</dt>
                <dd className="text-right font-medium text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      );

    case "escalate":
      return (
        <div className="flex flex-col gap-3">
          <Bubble from="visitor">My site is down and I have orders waiting.</Bubble>
          <Bubble from="agent">I am passing this to the team now, with this whole conversation.</Bubble>
          <div className="flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-micro font-semibold text-white">
            <span className="size-1.5 rounded-full bg-success-fill" />
            Handed to a person · transcript attached
          </div>
        </div>
      );

    case "honest":
      return (
        <div className="flex flex-col gap-3">
          <Bubble from="visitor">Can you do the whole job for $50?</Bubble>
          <Bubble from="agent">
            I cannot confirm a custom price. I am an assistant, so I will ask the team and text
            you back today.
          </Bubble>
        </div>
      );

    case "trigger":
      return (
        <ul className="flex max-w-[340px] flex-col gap-2.5">
          {[
            ["Booking created", "Friday, 9:00am"],
            ["Confirmation sent", "By text"],
            ["Follow-up scheduled", "Monday"],
          ].map(([what, detail]) => (
            <li key={what} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-e2">
              <Check />
              <span className="flex-1 text-small font-medium text-fg">{what}</span>
              <span className="text-micro text-fg-muted">{detail}</span>
            </li>
          ))}
        </ul>
      );
  }
}
