import Link from "next/link";
import type { MegaPromo } from "@/data/navigation";
import { resolveNavTarget } from "@/data/routes";
import { ArrowUpRight } from "./nav-icons";
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
    <span className="mt-4 flex h-11 w-full items-center justify-center rounded-lg bg-white px-4 text-small font-medium text-fg transition-colors duration-fast group-hover/promo:bg-ink-100">
      {promo.cta.label}
    </span>
  );

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl bg-white/[0.045] p-5 ring-1 ring-inset ring-white/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_0%,rgb(34_126_255/0.28)_0%,transparent_70%)]"
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className="font-mono text-caption uppercase text-fg-on-dark-muted">
          {promo.eyebrow}
        </span>
        <span aria-hidden="true" className="text-fg-on-dark-muted">
          <ArrowUpRight />
        </span>
      </div>

      <PromoVisual kind={promo.visual} />

      <div className="relative">
        <p className="text-h4 text-white">{promo.title}</p>
        <p className="mt-2 text-small text-fg-on-dark-muted">{promo.body}</p>

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
    "relative my-4 flex h-24 items-center justify-center overflow-hidden rounded-lg bg-black/25 ring-1 ring-inset ring-white/8";

  if (kind === "ai") {
    return (
      <div aria-hidden="true" className={frame}>
        {/* Stacked glow plates, echoing the target's layered card visual. */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ transform: `scale(${1 - i * 0.16}) translateY(${i * 4}px)` }}
            className={cn(
              "absolute h-20 w-20 rounded-xl ring-1 ring-inset",
              i === 0 && "bg-primary/10 ring-primary/20",
              i === 1 && "bg-primary/15 ring-primary/30",
              i === 2 && "bg-primary/25 ring-primary/50",
            )}
          />
        ))}
        <svg viewBox="0 0 24 24" className="relative h-7 w-7 text-white">
          <path
            d="M12 3.5 13.6 8 18 9.6 13.6 11.2 12 15.7 10.4 11.2 6 9.6 10.4 8 12 3.5Z"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }

  if (kind === "hosting") {
    return (
      <div aria-hidden="true" className={cn(frame, "flex-col gap-2 px-4")}>
        {[
          ["Year one", "$5.84", "bg-primary"],
          ["Year two", "$25.94", "bg-white/25"],
        ].map(([label, price, bar], i) => (
          <div key={label} className="w-full">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[0.5625rem] uppercase text-fg-on-dark-muted">
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
      <div aria-hidden="true" className={cn(frame, "flex-col gap-1.5 px-4")}>
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
            <span className="font-mono text-[0.625rem] text-white">serverlys{tld}</span>
            <span
              className={cn(
                "font-mono text-[0.5rem] uppercase",
                free ? "text-success-fill" : "text-fg-on-dark-muted",
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
    <div aria-hidden="true" className={cn(frame, "flex-col gap-2 px-5")}>
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
          <span className="flex-1 rounded-md bg-white/[0.06] px-2 py-1 text-[0.625rem] text-fg-on-dark-secondary">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
