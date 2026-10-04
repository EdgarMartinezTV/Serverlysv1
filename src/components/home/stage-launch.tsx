import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { stageById } from "./stages";
import { MockPhoto } from "@/components/ui/mock-photo";

const stage = stageById("launch");

/**
 * Stage 2 — Launch.
 *
 * Built to measurements taken off Hostinger's own `#launch` row (2026-09-14,
 * 1440px), because "match it exactly" means the numbers, not the impression:
 *
 *   card      305 × 450, an anchor, no background of its own
 *   media     305 × 360, 16px radius, overflow hidden
 *   arrow     24 × 24, inset 16px from the top right
 *   label     20px below the media, column, 4px gap
 *   title     18px / 400 / 26px line-height / -0.09px tracking
 *   desc      14px / 400 / 20px line-height
 *   row       flex, 20px gap, cards at `flex: 1 1 0`
 *
 * 16px is written as a literal rather than `rounded-2xl`, which is 20px in this
 * system. Hostinger sets DM Sans too, so the type matches with nothing done to
 * it. Near-black is Serverlys' `--color-fg` (#0b0e14) rather than their
 * rgb(24,24,26) — indistinguishable at that value, and it keeps the card
 * consistent with the rest of the page.
 *
 * The expansion on hover lives in globals.css; the ratio it depends on is
 * documented there.
 *
 * ⚠ 2026-10-03: THE CARD ART IS CODE, NOT PHOTOGRAPHY. The AI-generated
 * PNGs that were here carried fake UI with garbled text ("ERVERLYS") and read
 * as stock. Each card is now a pale brand-blue tile field with one real-looking
 * UI object on it (a browser, a domain pill, a compose window, a migration
 * card), so it renders sharp at any width the hover expansion produces and
 * never claims a screen the product does not have. The header was cut to one
 * centred line at the same time: no eyebrow, lede or buttons.
 */
type LaunchTool = {
  title: string;
  href: string;
  art: React.ReactNode;
};

/* ── Card art ────────────────────────────────────────────────────────────── */

/** Pale tiles behind every card. `variant` shifts which tiles carry colour so
    the four cards rhyme without being copies. */
function Tiles({ variant }: { variant: 0 | 1 | 2 | 3 }) {
  const strong = [
    [0, 5, 10],
    [2, 4, 9],
    [1, 6, 8],
    [3, 5, 11],
  ][variant];
  return (
    <div aria-hidden="true" className="absolute inset-0 grid grid-cols-3 grid-rows-4 bg-brand-100">
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className={strong.includes(i) ? "bg-brand-200" : i % 2 ? "bg-brand-50/60" : ""}
        />
      ))}
    </div>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function HostingArt() {
  return (
    <>
      <Tiles variant={0} />
      <div className="absolute top-12 left-8 right-0 bottom-0 overflow-hidden rounded-tl-2xl bg-white shadow-e3 ring-1 ring-brand-200">
        <div className="flex items-center gap-1.5 border-b border-line-subtle px-4 py-3">
          <span className="size-2 rounded-full bg-brand-200" />
          <span className="size-2 rounded-full bg-brand-200" />
          <span className="size-2 rounded-full bg-brand-200" />
          <span className="ml-3 rounded bg-canvas-secondary px-2 py-0.5 text-[10px] text-fg-secondary">hearthbakery.com</span>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-small font-semibold text-fg">hearthbakery.com</span>
            <span className="flex items-center gap-1.5 text-micro font-semibold text-success">
              <span className="size-1.5 rounded-full bg-success-fill" />
              Online
            </span>
          </div>
          <div className="mt-5 flex h-20 items-end gap-1.5">
            {[38, 52, 44, 63, 58, 72, 66, 81, 77, 90].map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className={i === 9 ? "flex-1 rounded-sm bg-primary" : "flex-1 rounded-sm bg-brand-200"}
              />
            ))}
          </div>
          <div className="mt-5 space-y-3 border-t border-line-subtle pt-4 text-micro">
            <div className="flex items-center justify-between">
              <span className="text-fg-secondary">LiteSpeed cache</span>
              <span className="inline-flex h-4 w-7 items-center rounded-full bg-primary p-0.5">
                <span className="ml-auto size-3 rounded-full bg-white" />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-fg-secondary">Daily backup</span>
              <span className="font-semibold text-fg">Done</span>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-fg-secondary">NVMe storage</span>
                <span className="font-semibold text-fg">24%</span>
              </div>
              <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-brand-100">
                <span className="block h-full w-[24%] rounded-full bg-primary" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DomainArt() {
  return (
    <>
      <Tiles variant={1} />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_30%_40%,rgb(255_255_255/0.7),transparent)]" />
      <div className="absolute top-1/2 left-6 right-0 -translate-y-1/2">
        <div className="flex items-center gap-3 rounded-l-2xl bg-white/95 py-3 pr-4 pl-3 shadow-e3 ring-1 ring-brand-200">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <GlobeIcon className="size-6" />
          </span>
          <span className="whitespace-nowrap text-[22px] leading-none tracking-[-0.02em] text-fg">
            hearthbakery<span className="font-semibold">.com</span>
          </span>
        </div>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="absolute top-14 left-10 size-9 drop-shadow-md">
          <path d="M5 3l14 7-6 2-2 6L5 3Z" fill="var(--color-fg)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
}

function EmailArt() {
  return (
    <>
      <Tiles variant={2} />
      <div className="absolute top-14 left-6 right-0 bottom-10 overflow-hidden rounded-l-2xl bg-white/95 shadow-e3 ring-1 ring-brand-200">
        <p className="border-b border-line-subtle px-5 py-3.5 text-small font-semibold text-fg">New message</p>
        <div className="px-4 pt-4">
          <span className="flex w-fit items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 shadow-e2 ring-1 ring-line">
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary text-micro font-semibold text-white">
              H
            </span>
            <span className="text-small text-fg">hello@hearthbakery.com</span>
          </span>
        </div>
        <dl className="mt-3 divide-y divide-line-subtle px-5 text-micro">
          <div className="flex items-center gap-4 py-2.5">
            <dt className="w-14 text-fg-muted">To</dt>
            <dd className="rounded-full bg-brand-50 px-2 py-0.5 text-primary">Regular customers</dd>
          </div>
          <div className="flex items-center gap-4 py-2.5">
            <dt className="w-14 text-fg-muted">Subject</dt>
            <dd className="text-fg-secondary">Fresh this weekend</dd>
          </div>
        </dl>
        <div className="mx-5 mt-2 space-y-2">
          <p className="text-[11px] leading-relaxed text-fg-secondary">
            Hi Maria, the sourdough is back this Saturday, and our first croissant
            box goes out at 8am. Reply to reserve yours.
          </p>
          <MockPhoto src="bread" className="h-16 rounded-lg" sizes="260px" />
        </div>
      </div>
    </>
  );
}

function MigrationArt() {
  const steps = [
    ["Files", true],
    ["Database", true],
    ["Email", false],
  ] as const;
  return (
    <>
      <Tiles variant={3} />
      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 rounded-2xl bg-white/95 p-5 shadow-e3 ring-1 ring-brand-200">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
              <path d="M4 8h13l-3-3M20 16H7l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-small font-semibold text-fg">Moving your site</span>
            <span className="block text-micro text-fg-muted">To staging first</span>
          </span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-brand-100">
          <span className="block h-full w-[68%] rounded-full bg-primary" />
        </div>
        <ul className="mt-4 space-y-2.5">
          {steps.map(([label, done]) => (
            <li key={label} className="flex items-center justify-between text-small">
              <span className="text-fg-secondary">{label}</span>
              {done ? (
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-success-fill text-white">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3">
                    <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : (
                <span className="size-5 rounded-full border-2 border-brand-200 [border-top-color:var(--color-primary)]" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/**
 * The four Launch cards. Every one is a product Serverlys actually sells and
 * every href resolves to a real page — a card here that led nowhere would be
 * worse than a card that is missing.
 */
const TOOLS: readonly LaunchTool[] = [
  { title: "Hosting", href: "/hosting", art: <HostingArt /> },
  { title: "Domains", href: "/register-domain", art: <DomainArt /> },
  { title: "Business email", href: "/domain-name", art: <EmailArt /> },
  { title: "Free website migration", href: "/migrations", art: <MigrationArt /> },
] as const;

export function StageLaunch() {
  return (
    <Section
      id={stage.id}
      surface="light"
      spacing="tight"
      width="wide"
      labelledBy="launch-heading"
      className="scroll-mt-16"
    >
      <Reveal>
        <h2
          id="launch-heading"
          className="display-md mx-auto max-w-[900px] text-center text-fg"
        >
          {stage.heading}
        </h2>
      </Reveal>

      <Reveal delay={80} className="mt-12 sm:mt-14">
        {/* Below lg this is a plain scroller holding the card at its real
            305px — there is no pointer to hover and four cards will not fit.
            At lg the cards become `flex: 1 1 0` and share the track, which is
            the layout the expansion needs to have something to redistribute. */}
        <ul
          aria-label="Launch tools"
          className="tools-row -mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:scroll-pl-8 sm:px-8 lg:mx-0 lg:snap-none lg:overflow-visible lg:px-0"
        >
          {TOOLS.map((tool) => (
            <li
              key={tool.title}
              className="tools-card w-[min(305px,78vw)] shrink-0 snap-start lg:w-auto lg:min-w-0 lg:shrink lg:grow lg:basis-0"
            >
              <a
                href={tool.href}
                className="group block rounded-[16px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <div className="relative aspect-[305/400] w-full overflow-hidden rounded-[16px] bg-brand-100 lg:aspect-auto lg:h-[400px]">
                  <div aria-hidden="true" className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                    {tool.art}
                  </div>
                  {/* Hidden until the card is hovered or focused. Focus is
                      included so the affordance exists for the keyboard, not
                      just the mouse. */}
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full bg-white text-fg opacity-0 shadow-e2 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                      <path
                        d="M7 17 17 7M9 7h8v8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <span className="mt-5 block text-[20px] leading-7 tracking-[-0.01em] text-fg">
                  {tool.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
