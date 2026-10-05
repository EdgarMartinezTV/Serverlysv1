import { CtaButton, Grid, ShieldCheck } from "@/components/ref/kit";
import { MockPhoto } from "@/components/ui/mock-photo";

/**
 * WordPress hero — 2026-10-03 rebuild. Copy left; right, a coded block
 * editor (dark admin rail, editor toolbar, a page being edited, a product
 * card) in place of the supplied PNG.
 */
export function Hero() {
  return (
    <section aria-labelledby="wp-hero-heading" className="overflow-hidden bg-canvas pt-12 pb-16 lg:pt-20 lg:pb-24">
      <Grid>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-body-lg font-medium text-fg">
              Up to <span className="text-primary">37%</span> off managed hosting for WordPress
            </p>
            <h1 id="wp-hero-heading" className="display-lg mt-4 text-fg">
              Manage your WordPress website the easy way
            </h1>
            <p className="mt-5 max-w-[520px] text-body text-fg-secondary">
              WordPress installed, LiteSpeed tuned for it, updates applied with a backup taken
              first, and free migration. No server work on your side.
            </p>
            <div className="mt-8">
              <CtaButton href="#plans" className="w-full sm:w-auto">
                Start now
              </CtaButton>
            </div>
            <p className="mt-4 flex items-center gap-2 text-small text-fg-secondary">
              <ShieldCheck className="size-4 shrink-0" />
              30-day money-back guarantee
            </p>
          </div>
          <EditorMock />
        </div>
      </Grid>
    </section>
  );
}

function EditorMock() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[600px] py-8 pl-8">
      {/* Page canvas */}
      <div className="relative h-[330px] overflow-hidden rounded-2xl shadow-e4 sm:h-[360px]">
        <div className="absolute inset-0">
          <MockPhoto src="bread-sliced" className="h-full" sizes="560px" position="center 60%" eager />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/0" />
        <div className="relative flex justify-end gap-6 px-8 pt-5 text-[10px] font-semibold tracking-[0.18em] text-fg">
          <span>ABOUT</span>
          <span>MENU</span>
          <span>CONTACT</span>
        </div>
        <div className="absolute top-24 left-16 rounded-md px-4 py-2 ring-2 ring-primary/70">
          <p className="font-serif text-[40px] leading-[1.05] text-fg sm:text-[48px]">
            Bake something
            <span className="block">good today</span>
          </p>
        </div>
        <div className="absolute top-[72px] left-16 flex items-center gap-3 rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-fg shadow-e2">
          <span>¶</span>
          <span className="text-fg-muted">B</span>
          <span className="text-fg-muted italic">I</span>
          <span className="text-fg-muted">⋯</span>
        </div>
        <div className="absolute bottom-8 left-16 flex gap-2">
          <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-fg shadow-e1">→ Order online</span>
          <span className="rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-medium text-fg">See the menu</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="absolute top-2 left-[22%] flex items-center gap-3 rounded-lg bg-white px-3 py-2 shadow-e3">
        <span className="inline-flex size-5 items-center justify-center rounded bg-primary text-[12px] font-bold text-white">+</span>
        <span className="text-[11px] text-fg-muted">✎ ↶ ↷ ☰</span>
        <span className="hidden rounded bg-canvas-secondary px-6 py-0.5 text-[10px] text-fg-secondary sm:block">Home · Page</span>
        <span className="rounded bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-white">Save</span>
      </div>

      {/* WP admin rail */}
      <div className="absolute top-14 left-0 flex w-12 flex-col items-center gap-4 rounded-xl bg-[#1d2327] py-4 shadow-e4">
        <span className="inline-flex size-7 items-center justify-center rounded-full border-2 border-white text-[13px] font-bold text-white">W</span>
        {["▦", "✎", "▤", "🛍", "◐", "⚙"].map((g, i) => (
          <span key={i} className={`text-[12px] ${i === 3 ? "rounded bg-primary px-1 text-white" : "text-white/60"}`}>{g}</span>
        ))}
      </div>

      {/* Product card */}
      <div className="absolute right-0 bottom-0 w-44 rounded-xl bg-white p-3 shadow-e5">
        <p className="font-serif text-small text-fg">Weekend box</p>
        <p className="text-[10px] text-fg-muted">Sourdough, rye and six pastries</p>
        <div className="relative mt-2 h-24 overflow-hidden rounded-lg">
          <div className="absolute inset-0"><MockPhoto src="bread" className="h-full" /></div>
          <span className="absolute top-2 right-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-fg">$28</span>
        </div>
      </div>
    </div>
  );
}
