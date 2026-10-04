import Link from "next/link";
import type { MegaPromo } from "@/data/navigation";
import { resolveNavTarget } from "@/data/routes";
import { ArrowUpRight } from "./nav-icons";
import { ConvoAiLogo } from "@/components/layout/convoai-logo";
import { cn } from "@/lib/utils";

/**
 * Promotional panel — the mega menu's right-hand zone.
 *
 * Each category gets its own. The visual is a code-built composition rather
 * than an image: it stays crisp at any density, adds no request to a menu that
 * must open instantly, and cannot 404.
 */
export function MegaMenuPromo({ promo }: { promo: MegaPromo }) {
  const target = resolveNavTarget(promo.cta.href);
  const isExternal = promo.cta.external;

  const cta = (
    <span className="mt-5 flex h-12 w-full items-center justify-center rounded-md bg-white px-4 text-body font-semibold text-fg transition-colors duration-fast group-hover/promo:bg-ink-100">
      {promo.cta.label}
    </span>
  );

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white/[0.05] p-6 ring-1 ring-inset ring-white/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_35%,rgb(0_0_255/0.35)_0%,transparent_70%)]"
      />

      <div className="relative flex items-start justify-between gap-3">
        {/* tone="dark" is not a choice here: the panel is always the abyss
            band, so the light-surface asset would put black "Convo" on
            near-black and leave a floating "AI". */}
        {promo.brand === "convoai" ? (
          <ConvoAiLogo tone="dark" className="h-6 w-auto" />
        ) : (
          <span className="text-caption uppercase font-semibold tracking-[0.04em] text-white">
            {promo.eyebrow}
          </span>
        )}
        <span aria-hidden="true" className="text-white">
          <ArrowUpRight />
        </span>
      </div>

      <PromoVisual kind={promo.visual} />

      <div className="relative mt-auto">
        <p className="text-[22px] leading-7 font-medium tracking-[-0.02em] text-white">{promo.title}</p>
        <p className="mt-2 text-small text-white/75">{promo.body}</p>

        {isExternal ? (
          <a
            href={promo.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/promo block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {cta}
          </a>
        ) : (
          <Link
            href={target.href}
            className="group/promo block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * Code-built product visuals, one per category. Decorative — the copy beside
 * each carries the meaning — so all are aria-hidden.
 */
function PromoVisual({ kind }: { kind: MegaPromo["visual"] }) {
  const frame =
    "relative my-6 flex h-44 items-center justify-center overflow-hidden rounded-xl";

  if (kind === "ai") {
    return (
      <div aria-hidden="true" className={frame}>
        {/* Nested glowing tiles with a sparkle key and a cursor: one object,
            lit from inside, instead of three faint outlines. */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ width: `${168 - i * 36}px`, height: `${168 - i * 36}px` }}
            className={cn(
              "absolute rounded-[28px] ring-1 ring-inset",
              i === 0 && "bg-primary/[0.08] ring-primary/25",
              i === 1 && "bg-primary/[0.14] ring-primary/35",
              i === 2 && "bg-primary/25 shadow-[0_0_40px_rgb(0_0_255/0.45)] ring-primary/55",
            )}
          />
        ))}
        <span className="relative inline-flex size-[4.5rem] items-center justify-center rounded-2xl bg-[linear-gradient(160deg,#2a2a33,#121216)] shadow-[0_10px_30px_rgb(0_0_0/0.5)] ring-1 ring-white/15">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-white">
            <path d="M10 3.5 11.6 8 16 9.6 11.6 11.2 10 15.7 8.4 11.2 4 9.6 8.4 8 10 3.5Z" fill="currentColor" />
            <path d="M17.5 13.5 18.3 15.7 20.5 16.5 18.3 17.3 17.5 19.5 16.7 17.3 14.5 16.5 16.7 15.7Z" fill="currentColor" opacity="0.8" />
          </svg>
        </span>
        <svg viewBox="0 0 24 24" className="absolute top-[58%] left-[60%] h-9 w-9 drop-shadow-lg">
          <path d="M5 3l14 7-6 2-2 6L5 3Z" fill="white" stroke="#121214" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  if (kind === "hosting") {
    return (
      <div aria-hidden="true" className={cn(frame, "flex-col gap-2 bg-black/25 px-4 ring-1 ring-inset ring-white/10")}>
        {[
          ["Monthly rate", "$17.95", "bg-primary"],
          ["Standard rate", "$21.37", "bg-white/25"],
        ].map(([label, price, bar], i) => (
          <div key={label} className="w-full">
            <div className="flex items-baseline justify-between">
              <span className="text-micro text-white/70">
                {label}
              </span>
              <span className="tabular text-small font-semibold text-white">
                {price}
              </span>
            </div>
            <span
              className={cn("mt-1 block h-1.5 rounded-full", bar)}
              style={{ width: i === 0 ? "28%" : "100%" }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (kind === "domains") {
    return (
      <div aria-hidden="true" className={cn(frame, "flex-col gap-1.5 bg-black/25 px-4 ring-1 ring-inset ring-white/10")}>
        {[
          [".com", "Available", true],
          [".net", "Available", true],
          [".org", "Taken", false],
        ].map(([tld, state, free]) => (
          <div
            key={tld as string}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-2.5 py-1.5",
              free ? "bg-success-fill/15" : "bg-white/[0.06]",
            )}
          >
            <span className="text-small text-white">serverlys{tld}</span>
            <span
              className={cn(
                "text-micro font-semibold",
                free ? "text-success-fill" : "text-white/60",
              )}
            >
              {state}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={cn(frame, "flex-col gap-2 bg-black/25 px-5 ring-1 ring-inset ring-white/10")}>
      {["Old host", "Staging", "Live"].map((label, i) => (
        <div key={label} className="flex w-full items-center gap-2.5">
          <span
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
              i < 2 ? "bg-success-fill text-canvas-abyss" : "bg-white/20 text-white",
            )}
          >
            {i < 2 ? (
              <svg viewBox="0 0 16 16" className="h-2 w-2">
                <path
                  d="m3.5 8.5 3 3 6-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <span className="h-1 w-1 rounded-full bg-current" />
            )}
          </span>
          <span className="flex-1 rounded-md bg-white/[0.06] px-2 py-1 text-micro text-fg-on-dark-secondary">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
