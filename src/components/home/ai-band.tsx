import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { sisterProducts, billing } from "@/data/company";
import { cn } from "@/lib/utils";

/**
 * The AI band.
 *
 * Reproduces the target's dark section: heading left / copy + CTA right, then
 * an asymmetric tile grid with a large product panel LAYERED OVER it, followed
 * by a second block whose right side is a stack of floating cards.
 *
 * Content is Serverlys' real AI products — ConvoAI (chat) and CallFlow
 * (voice) — not an invented assistant.
 *
 * Depth is built with three devices, matching the target: tinted tiles on a
 * darker ground, a panel that overlaps the grid with a heavy shadow, and cards
 * offset on a slow float. All CSS.
 */

type Tile = {
  title: string;
  body: string;
  span: string;
  /** The lead tile gets a lighter ground so the grid is not four equal boxes. */
  accent?: boolean;
};

const TILES: readonly Tile[] = [
  {
    title: "Answer chats",
    body: "Questions about hours, stock and bookings, handled the moment they arrive.",
    // Tall left tile; the floating panel never reaches this column.
    span: "lg:col-span-5 lg:row-span-2 lg:min-h-[24rem]",
    accent: true,
  },
  {
    title: "Take calls",
    body: "CallFlow picks up when nobody can.",
    span: "lg:col-span-7",
  },
] as const;

export function AiBand() {
  const convo = sisterProducts.find((p) => p.name === "ConvoAI");
  const callflow = sisterProducts.find((p) => p.name === "CallFlow");

  return (
    <section
      aria-labelledby="ai-heading"
      className="relative isolate overflow-hidden bg-canvas-abyss py-20 sm:py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(65%_55%_at_20%_0%,rgb(34_126_255/0.32)_0%,transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(50%_45%_at_85%_35%,rgb(141_89_255/0.20)_0%,transparent_70%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-60" />

      <Container className="relative">
        {/* ── Head: split heading / copy + CTA ─────────────────────────── */}
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 font-mono text-caption uppercase text-accent-on-dark ring-1 ring-inset ring-white/15">
              Included
            </span>
            <h2 id="ai-heading" className="mt-6 text-h1 text-white">
              Your AI co-worker.{" "}
              <span className="block text-fg-on-dark-secondary">On every plan.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start justify-end gap-6">
            <p className="max-w-md text-body-lg text-fg-on-dark-secondary">
              ConvoAI answers your customers in chat and CallFlow answers the phone, so
              the enquiries that arrive out of hours do not wait until morning.
            </p>
            {convo && (
              <Button href={convo.href} variant="inverse" size="lg">
                Start with ConvoAI
              </Button>
            )}
          </div>
        </Reveal>

        {/* ── Tiles with an overlapping product panel ──────────────────── */}
        <div className="relative mt-14 lg:mt-20">
          <Reveal delay={60}>
            <ul className="grid gap-4 lg:grid-cols-12">
              {TILES.map((tile) => (
                <li
                  key={tile.title}
                  className={cn(
                    "flex flex-col justify-between rounded-2xl p-6 ring-1 ring-inset backdrop-blur-sm sm:p-7",
                    tile.span,
                    tile.accent
                      ? "bg-white/[0.07] ring-white/15"
                      : "bg-white/[0.04] ring-white/10",
                  )}
                >
                  <h3 className="text-h4 text-white">{tile.title}</h3>
                  {tile.accent && (
                    /* The tall tile needs something in its middle third or it
                       reads as an empty box at 24rem. */
                    <ul aria-hidden="true" className="my-7 flex flex-col gap-2.5">
                      {[
                        "What are your opening hours?",
                        "Do you deliver to SW4?",
                        "Can I change my booking?",
                      ].map((q, i) => (
                        <li
                          key={q}
                          className={cn(
                            "rounded-xl px-3.5 py-2.5 text-small",
                            i === 1
                              ? "bg-primary/25 text-white ring-1 ring-inset ring-primary/40"
                              : "bg-white/[0.05] text-fg-on-dark-muted",
                          )}
                        >
                          {q}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 max-w-xs text-small text-fg-on-dark-muted">
                    {tile.body}
                  </p>
                </li>
              ))}
              {/* Reserved cell. The floating panel sits INSIDE this area, so it
                  overlaps the grid's chrome without ever covering tile copy —
                  which is what happened when it was free-positioned. */}
              <li
                aria-hidden="true"
                className="hidden rounded-2xl bg-white/[0.03] ring-1 ring-inset ring-white/10 lg:col-span-7 lg:block lg:min-h-[17rem]"
              />
            </ul>
          </Reveal>

          {/* Layered panel — the target's floating UI over the tile grid. */}
          <Reveal
            delay={140}
            className="mt-6 lg:absolute lg:bottom-7 lg:right-7 lg:mt-0 lg:w-[24rem]"
          >
            <div className="animate-float-slow overflow-hidden rounded-2xl bg-surface shadow-e5 ring-1 ring-line">
              <div className="flex items-center gap-3 border-b border-line-subtle px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 text-small font-bold text-white">
                  C
                </span>
                <div className="min-w-0">
                  <p className="text-small font-semibold text-fg">ConvoAI</p>
                  <p className="flex items-center gap-1.5 text-caption text-fg-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-success-fill" />
                    Answering
                  </p>
                </div>
                <span className="ml-auto rounded-full bg-primary-soft px-2.5 py-1 font-mono text-caption uppercase text-primary">
                  Live
                </span>
              </div>
              <div className="flex flex-col gap-2.5 p-4">
                <p className="max-w-[80%] rounded-2xl rounded-tl-md bg-canvas-secondary px-3.5 py-2 text-small text-fg-secondary">
                  Can I move my booking to Friday?
                </p>
                <p className="ml-auto max-w-[80%] rounded-2xl rounded-tr-md bg-primary px-3.5 py-2 text-small text-white">
                  Friday 2pm is free — shall I move it?
                </p>
                <div className="mt-1 flex items-center gap-2 rounded-lg bg-canvas-secondary px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning-fill" />
                  <span className="text-caption text-fg-muted">
                    Refund request → handed to a person
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Second block: copy left, floating card stack right ───────── */}
        <div className="mt-20 grid items-center gap-12 lg:mt-28 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h3 className="text-h2 text-white">One agent. More ways to use it.</h3>
            <p className="mt-5 max-w-md text-body-lg text-fg-on-dark-secondary">
              The same agent that answers chat can take the call, qualify the enquiry
              and pass the ones that need a person straight to you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {callflow && (
                <Button href={callflow.href} variant="inverseOutline" size="lg">
                  See CallFlow
                </Button>
              )}
              <Button href={billing.sales} variant="inverseGhost" size="lg">
                Ask what it can do
              </Button>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <ul className="relative flex flex-col gap-3">
              {[
                ["Answer a product question", "chat", "0ms"],
                ["Qualify an enquiry", "voice", "120ms"],
                ["Book into the calendar", "chat", "0ms"],
                ["Hand over to a human", "both", "—"],
              ].map(([label, channel], i) => (
                <li
                  key={label}
                  style={{ marginLeft: `${i * 14}px` }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl bg-surface px-4 py-3.5 shadow-e4 ring-1 ring-line",
                    i === 1 && "animate-float",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      channel === "voice"
                        ? "bg-primary-soft text-primary"
                        : "bg-violet-500/12 text-violet-600",
                    )}
                  >
                    {channel === "voice" ? (
                      <svg viewBox="0 0 16 16" className="h-4 w-4">
                        <path
                          d="M5 2.5h2l1 3-1.5 1a7 7 0 0 0 3 3l1-1.5 3 1v2a1.5 1.5 0 0 1-1.7 1.5A11 11 0 0 1 3.5 4.2 1.5 1.5 0 0 1 5 2.5Z"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 16 16" className="h-4 w-4">
                        <path d="M3 3h10v7H6.5L3 12.5V3Z" fill="currentColor" />
                      </svg>
                    )}
                  </span>
                  <span className="text-small font-medium text-fg">{label}</span>
                  <span className="ml-auto font-mono text-caption uppercase text-fg-muted">
                    {channel}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
