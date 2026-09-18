/**
 * In-code media for the ecommerce hosting page.
 *
 * The reference fills these slots with proprietary photography, raster art and
 * screen-capture video. Those files are Hostinger's, so each slot is rebuilt
 * here in HTML/SVG at the same composition — which also matches how the rest
 * of this site does product imagery (see components/product-ui) and keeps a
 * very long page free of files that can 404 or blur.
 *
 * All decorative: each is aria-hidden and the surrounding copy carries the
 * meaning. Figures are illustrative.
 */
import { cn } from "@/lib/utils";
import { Check } from "@/components/ref/kit";

/** The brand field every panel floats on. */
function Field({
  children,
  className,
  tone = "brand",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "brand" | "pale";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-2xl",
        tone === "brand"
          ? "bg-gradient-to-br from-brand-500 to-brand-800"
          : "bg-canvas-secondary",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── email marketing ────────────────────────────────────────────────────── */

/** Subscriber import, with the new-subscriber counter floating above it. */
export function ImportContactsPanel({ className }: { className?: string }) {
  return (
    <Field tone="pale" className={className}>
      <div className="absolute top-[6%] right-[6%] flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-e4">
        <span className="size-6 rounded-full bg-fg" />
        <span className="text-ui text-fg">
          <b className="font-semibold">+124</b> new subscribers
        </span>
        <span className="rounded-full bg-success-fill px-1.5 py-0.5 text-ui font-semibold text-white">
          17,5%
        </span>
      </div>

      <div className="absolute top-[22%] left-[8%] w-[84%] rounded-xl bg-white/80 p-4">
        <p className="text-[15px] font-semibold text-fg">Import contacts</p>
        <span className="mt-2 block h-8 rounded-lg border border-line bg-white" />
        <div className="mt-3 flex flex-col gap-2">
          {["Sofia Russ", "Carmen Rodríguez", "Rafael Moreira", "Jonas Lindgren"].map((n) => (
            <span key={n} className="flex items-center justify-between text-ui text-fg">
              <span className="flex items-center gap-2">
                <span className="grid size-4 place-items-center rounded bg-primary text-white">
                  <Check className="size-3" />
                </span>
                {n}
              </span>
              <span className="rounded bg-success-soft px-1.5 py-0.5 text-ui font-medium text-success">
                Subscribed
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="absolute top-[46%] left-[4%] flex items-center gap-2 rounded-lg bg-fg px-3 py-2 shadow-e4">
        <span className="text-[12px] font-semibold text-white">Connect WordPress</span>
      </div>
    </Field>
  );
}

/* ── support ────────────────────────────────────────────────────────────── */

/** The support chat, with its suggested prompts. */
export function ChatPanel({ className }: { className?: string }) {
  return (
    <Field tone="pale" className={className}>
      <div className="absolute inset-[10%] rounded-xl bg-white/80 p-4">
        <p className="text-[15px] font-semibold text-fg">Hello 👋</p>
        <p className="text-ui text-fg-secondary">How can I help you today?</p>
        <div className="mt-4 flex flex-col gap-2">
          {[
            "I want to migrate to Serverlys",
            "I want to create a website",
            "Help me choosing the right hosting plan",
          ].map((p) => (
            <span
              key={p}
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-ui text-fg shadow-e2"
            >
              <svg viewBox="0 0 20 20" fill="none" className="size-3 shrink-0 text-fg">
                <path
                  d="M6.5 13.5l7-7m0 0H7.75m5.75 0v5.75"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {p}
            </span>
          ))}
        </div>
      </div>
    </Field>
  );
}

/* ── shared chip ────────────────────────────────────────────────────────── */

/** Icon chip used by the three agent cards. */
export function IconChip({ icon: Icon }: { icon: (p: { className?: string }) => React.ReactNode }) {
  return (
    <span className="grid size-10 place-items-center rounded-md bg-primary-soft text-fg">
      <Icon className="size-6" />
    </span>
  );
}
