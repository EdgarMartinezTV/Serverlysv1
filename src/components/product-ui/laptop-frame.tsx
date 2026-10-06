import { cn } from "@/lib/utils";
import { ScaleToFit } from "./scale-to-fit";

/**
 * A laptop: black glass lid with a camera, a browser on the screen, and the
 * aluminium base with its opening notch — so a product surface reads as
 * software someone is using rather than a card floating on the page.
 *
 * Only the HARDWARE is decorative (aria-hidden). `children` is the screen
 * content and stays fully exposed: the homepage puts an interactive console
 * in here, and hiding it would strand keyboard users inside it.
 *
 * Laid out at a fixed 620px design width and scaled down below it (see
 * ScaleToFit), so a phone shows the same laptop, smaller — never a laptop
 * with a portrait screen. Sizes are therefore plain px. Content inside should
 * respond to its CONTAINER, not the viewport, for the same reason. The base
 * is wider than the lid, as on the real thing; callers must leave ~5% of
 * horizontal room for it (the StageRow media panel's padding does).
 */
const DESIGN_WIDTH = 620;

export function LaptopFrame({
  url,
  children,
  className,
}: {
  /** Shown in the browser bar. Keep it an address that really exists. */
  url: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ScaleToFit designWidth={DESIGN_WIDTH} className={cn("relative mx-auto w-full", className)}>
      {/* ── Lid ─────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "relative rounded-[18px] bg-[#141416] p-[9px] pt-[20px]",
          // Aluminium edge around the glass, then the drop onto the base.
          "shadow-[0_0_0_1px_#3d3e43,0_0_0_2px_#0b0b0c,0_40px_70px_-30px_rgb(15_23_42/0.55)]",
        )}
      >
        {/* Camera */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[7px] h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-[#23262e] ring-1 ring-[#050506]"
        >
          <span className="absolute left-[25%] top-[25%] h-[30%] w-[30%] rounded-full bg-[#4b5a78]" />
        </span>

        {/* Screen */}
        <div className="relative overflow-hidden rounded-[5px] bg-surface">
          <BrowserBar url={url} />
          {children}
          {/* Glass: a faint diagonal sheen. Never intercepts the pointer. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgb(255_255_255/0.10)_0%,rgb(255_255_255/0)_38%)]"
          />
        </div>
      </div>

      {/* ── Hinge + base ───────────────────────────────────────────────── */}
      <div aria-hidden="true">
        <div className="mx-[2.5%] h-[5px] rounded-b-[3px] bg-gradient-to-b from-[#0d0d0f] to-[#45464b]" />
        <div
          className={cn(
            "relative -mx-[4.5%] h-[13px] rounded-b-[18px] rounded-t-[2px]",
            "bg-[linear-gradient(180deg,#f5f6f8_0%,#dcdee3_30%,#b4b7be_100%)]",
            "shadow-[inset_0_1px_0_#ffffff,0_1px_0_#8f9299]",
          )}
        >
          {/* The thumb notch for opening the lid. */}
          <span className="absolute left-1/2 top-0 h-[45%] w-[15%] -translate-x-1/2 rounded-b-[6px] bg-gradient-to-b from-[#a9acb3] to-[#cfd1d6]" />
        </div>
        {/* Contact shadow on the surface it sits on. */}
        <div className="mx-auto -mt-1 h-4 w-[92%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(15_23_42/0.28),transparent)] blur-[2px]" />
      </div>
    </ScaleToFit>
  );
}

/** macOS-style browser toolbar: window controls, history arrows, address. */
function BrowserBar({ url }: { url: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-3 border-b border-line-subtle bg-[#eef0f3] px-3 py-1.5"
    >
      <span className="flex shrink-0 gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] ring-1 ring-inset ring-black/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] ring-1 ring-inset ring-black/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] ring-1 ring-inset ring-black/10" />
      </span>
      <span className="flex shrink-0 items-center gap-1 text-fg-muted">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 3.5 5.5 8l4.5 4.5" />
        </svg>
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3.5 10.5 8 6 12.5" />
        </svg>
      </span>
      <span className="mx-auto flex min-w-0 max-w-[22rem] flex-1 items-center justify-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] leading-4 tracking-normal text-fg-secondary shadow-[0_0_0_1px_rgb(15_23_42/0.06)]">
        <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
          <path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" />
        </svg>
        <span className="truncate">{url}</span>
      </span>
      {/* Balances the controls so the address sits optically centred. */}
      <span className="w-[52px] shrink-0" />
    </div>
  );
}
