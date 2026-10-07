import Link from "next/link";
import type { MegaPromo } from "@/data/navigation";
import { resolveNavTarget } from "@/data/routes";
import { ArrowUpRight } from "./nav-icons";
import { ConvoAiLogo } from "@/components/layout/convoai-logo";
import Image from "next/image";
import { planGroups } from "@/data/pricing";
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
    <span className="mt-5 flex h-11 w-full items-center justify-center rounded-lg bg-white px-4 text-body font-semibold text-fg transition-colors duration-fast group-hover/promo:bg-brand-50">
      {promo.cta.label}
    </span>
  );

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-[linear-gradient(165deg,#2a5bff,var(--color-primary)_55%,#0000d6)] p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_35%,rgb(255_255_255/0.22)_0%,transparent_70%)]"
      />

      <div className="relative flex items-start justify-between gap-3">
        {/* tone="dark" is not a choice here: the panel is always the abyss
            band, so the light-surface asset would put black "Convo" on
            near-black and leave a floating "AI". */}
        {promo.brand === "convoai" ? (
          <span className="inline-flex rounded-lg bg-white px-2.5 py-1.5 shadow-sm">
            <ConvoAiLogo tone="light" className="h-5 w-auto" />
          </span>
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
        <p className="text-[20px] leading-[26px] font-medium tracking-[-0.01em] text-white">{promo.title}</p>
        <p className="mt-2 text-small text-white/85">{promo.body}</p>

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
 * Code-built product mockups, one per category: real UI (a chat widget, a plan
 * card, a domain search, a migration run, an inbox…) on the brand card, each
 * with a short CSS loop. Decorative — the copy beside each carries the meaning
 * — so all are aria-hidden. Prices are the store's (data/pricing.ts); the
 * business in the scenes (Brightleaf, Jordan) is the site's demo persona.
 *
 * CSS animations, not JS: a closed panel is `hidden`, and display:none stops
 * CSS animation for free, so nine loops cost nothing until a menu is open.
 */
const TURBO = planGroups[0].plans.find((p) => p.tier === "turbo")!;

const screen =
  "rounded-xl bg-white text-fg shadow-[0_18px_40px_-12px_rgb(0_0_60/0.55)] ring-1 ring-black/5";

function Check({ className = "h-2.5 w-2.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

function Dot({ className }: { className?: string }) {
  return <span className={cn("inline-block h-1.5 w-1.5 rounded-full", className)} />;
}

function PromoVisual({ kind }: { kind: MegaPromo["visual"] }) {
  return (
    <div aria-hidden="true" className="relative my-5 flex h-[12.5rem] select-none flex-col justify-center text-[11px] leading-[1.35]">
      {VISUALS[kind]()}
    </div>
  );
}

const VISUALS: Record<MegaPromo["visual"], () => React.ReactNode> = {
  /* ConvoAI — a website chat answering at 2am and booking the table. */
  ai: () => (
    <div className={cn(screen, "relative mx-1 overflow-hidden")}>
      <div className="flex items-center gap-2 border-b border-line-subtle px-3 py-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">B</span>
        <span className="flex-1">
          <span className="block font-semibold">Brightleaf Bakery</span>
          <span className="flex items-center gap-1 text-[10px] text-fg-muted"><Dot className="bg-success-fill" />AI agent · online</span>
        </span>
        <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] tabular-nums text-fg-secondary">2:04 AM</span>
      </div>
      <div className="flex flex-col gap-1.5 bg-ink-50 p-3">
        <p className="ml-auto max-w-[78%] rounded-xl rounded-br-sm bg-primary px-2.5 py-1.5 text-white">Are you open on Sunday?</p>
        <p className="max-w-[82%] rounded-xl rounded-bl-sm bg-white px-2.5 py-1.5 shadow-sm motion-safe:animate-[promoPop_6s_ease-out_infinite]">
          Yes, 8am to 2pm. Want me to save you a table?
        </p>
        <p className="ml-auto max-w-[60%] rounded-xl rounded-br-sm bg-primary px-2.5 py-1.5 text-white motion-safe:animate-[promoPop2_6s_ease-out_infinite]">
          9am for two, please
        </p>
        <p className="flex items-center gap-1.5 self-start rounded-full bg-success-soft px-2 py-1 font-semibold text-success motion-safe:animate-[promoPop3_6s_ease-out_infinite]">
          <Check /> Table booked · Sun 9:00 AM
        </p>
      </div>
    </div>
  ),

  /* Renewal pricing — the plan card with today's AND next year's number. */
  hosting: () => (
    <>
      <div className={cn(screen, "relative mx-1 p-3.5")}>
        <div className="flex items-center justify-between">
          <span className="font-semibold">{TURBO.name}</span>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-primary">{TURBO.specs.sites}</span>
        </div>
        <p className="mt-2 flex items-baseline gap-1">
          <span className="text-[26px] font-semibold leading-none tracking-[-0.02em]">${TURBO.monthly}</span>
          <span className="text-fg-muted">/mo</span>
        </p>
        <div className="mt-3 space-y-2">
          {[
            ["Today", TURBO.monthly, "bg-primary"],
            ["Renews at", TURBO.standard, "bg-[#22d3ee]"],
          ].map(([label, v, bar]) => (
            <div key={label as string}>
              <div className="flex justify-between text-fg-secondary">
                <span>{label}</span>
                <span className="font-semibold tabular-nums text-fg">${(v as number).toFixed(2)}/mo</span>
              </div>
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-ink-100">
                <span
                  className={cn("block h-full origin-left rounded-full motion-safe:animate-[promoGrow_5s_ease-out_infinite]", bar as string)}
                  style={{ width: `${((v as number) / TURBO.standard) * 100}%` }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
      <span className="absolute -bottom-1 right-0 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 font-semibold text-fg shadow-lg motion-safe:animate-[promoFloat_4s_ease-in-out_infinite]">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success-fill text-white"><Check className="h-2 w-2" /></span>
        Both prices, up front
      </span>
    </>
  ),

  /* Domain search — typed name, live results. */
  domains: () => (
    <div className={cn(screen, "relative mx-1 p-3")}>
      <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 ring-1 ring-primary shadow-[0_0_0_3px_rgb(0_0_255/0.1)]">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <span className="flex-1 font-medium">
          <span className="inline-block overflow-hidden whitespace-nowrap align-bottom motion-safe:animate-[promoType_5s_steps(10)_infinite]">brightleaf</span>
          <span className="ml-px inline-block h-3 w-px translate-y-0.5 bg-primary motion-safe:animate-pulse" />
        </span>
        <span className="rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-white">Search</span>
      </div>
      <ul className="mt-2.5 space-y-1.5">
        {[
          [".com", true, true],
          [".co", true, false],
          [".net", false, false],
        ].map(([tld, free, added], i) => (
          <li
            key={tld as string}
            className={cn(
              "flex items-center justify-between rounded-lg px-2.5 py-1.5 motion-safe:animate-[promoRow_5s_ease-out_infinite]",
              i === 0 ? "bg-brand-50 ring-1 ring-brand-100" : "bg-ink-50",
            )}
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            <span className={cn("font-semibold", !free && "text-fg-muted line-through")}>
              brightleaf<span className={free ? "text-primary" : undefined}>{tld as string}</span>
            </span>
            {free ? (
              <span className={cn("flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold", added ? "bg-success-fill text-white" : "text-primary ring-1 ring-brand-200")}>
                {added && <Check className="h-2 w-2" />}
                {added ? "Added" : "Add"}
              </span>
            ) : (
              <span className="text-[10px] text-fg-muted">Taken</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  ),

  /* Free migration — the run in progress, site still live. */
  growth: () => (
    <>
      <div className={cn(screen, "relative mx-1 p-3")}>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Moving brightleaf.co</span>
          <span className="flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold text-success"><Dot className="bg-success-fill motion-safe:animate-pulse" />Site live</span>
        </div>
        <ul className="mt-2.5 space-y-2">
          {["Files", "Database", "Mailboxes", "Switch DNS"].map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                  i < 2 ? "bg-success-fill text-white" : i === 2 ? "bg-primary text-white" : "bg-ink-100 text-fg-muted",
                )}
              >
                {i < 2 ? <Check className="h-2 w-2" /> : <Dot className={i === 2 ? "bg-white" : "bg-current"} />}
              </span>
              <span className={cn("w-[4.6rem]", i > 2 && "text-fg-muted")}>{step}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                <span
                  className={cn(
                    "block h-full rounded-full",
                    i < 2 && "w-full bg-success-fill",
                    i === 2 && "w-full origin-left bg-primary motion-safe:animate-[promoGrow_4s_ease-in-out_infinite]",
                  )}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
      <span className="absolute -bottom-1 left-0 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 font-semibold shadow-lg motion-safe:animate-[promoFloat_4s_ease-in-out_infinite]">
        <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] text-fg-secondary">Old host</span>
        <svg viewBox="0 0 16 16" className="h-3 w-3 text-primary" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] text-primary">Serverlys</span>
      </span>
    </>
  ),

  /* Business email — the inbox at your domain, mail arriving. */
  email: () => (
    <div className={cn(screen, "relative mx-1 overflow-hidden")}>
      <div className="flex items-center justify-between border-b border-line-subtle px-3 py-2">
        <span>
          <span className="block font-semibold">Inbox</span>
          <span className="block text-[10px] text-fg-muted">jordan@brightleaf.co</span>
        </span>
        <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">3</span>
      </div>
      <ul>
        {[
          ["/email/avatars/sara.webp", "Sara Okafor", "Logo files: final versions"],
          ["/email/avatars/ethan.webp", "Alex Rivera", "Great meeting yesterday"],
          ["/email/avatars/mia.webp", "Mia Chen", "Invoice #1042 paid"],
        ].map(([src, name, subject], i) => (
          <li
            key={name}
            className={cn(
              "flex items-center gap-2 border-b border-line-subtle px-3 py-2 last:border-0 motion-safe:animate-[promoRow_6s_ease-out_infinite]",
              i === 0 && "bg-brand-50",
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-ink-100">
              <Image src={src} alt="" fill sizes="24px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn("block truncate", i === 0 ? "font-semibold" : "font-medium")}>{name}</span>
              <span className="block truncate text-[10px] text-fg-secondary">{subject}</span>
            </span>
            {i === 0 && <Dot className="bg-primary" />}
          </li>
        ))}
      </ul>
    </div>
  ),

  /* Plan finder — answer one question, get the tier and its renewal. */
  finder: () => (
    <div className={cn(screen, "relative mx-1 p-3")}>
      <p className="font-semibold">What do you run?</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {["Blog", "Online store", "Agency", "Busy site"].map((c) => (
          <span
            key={c}
            className={cn(
              "rounded-full px-2 py-1 text-[10px] font-medium",
              c === "Online store" ? "bg-primary text-white" : "bg-ink-100 text-fg-secondary",
            )}
          >
            {c}
          </span>
        ))}
      </div>
      <div className="mt-2.5 rounded-lg bg-[linear-gradient(150deg,#0f1f4d,#071230)] p-2.5 text-white motion-safe:animate-[promoPop_5s_ease-out_infinite]">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold">{TURBO.name}</span>
          <span className="text-[15px] font-semibold">${TURBO.monthly}<span className="text-[10px] font-normal text-white/60">/mo</span></span>
        </div>
        <p className="mt-0.5 text-[10px] text-[#7dd3fc]">{TURBO.specs.sites} · {TURBO.specs.visits}</p>
        <p className="mt-1.5 border-t border-white/10 pt-1.5 text-[10px] text-white/70">Renews at ${TURBO.standard}/mo</p>
      </div>
    </div>
  ),

  /* Switching — the migration request, handled by the team. */
  switch: () => (
    <div className={cn(screen, "relative mx-1 p-3")}>
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h12M12 6l6 6-6 6" /></svg>
        </span>
        <span className="flex-1">
          <span className="block font-semibold">Migration request</span>
          <span className="block text-[10px] text-fg-muted">brightleaf.co · handled by the team</span>
        </span>
      </div>
      <ol className="relative mt-3 space-y-2.5 pl-5 before:absolute before:bottom-1.5 before:left-[7px] before:top-1.5 before:w-px before:bg-line">
        {[
          ["Request received", "done"],
          ["Copied and staged", "done"],
          ["Checked with you", "now"],
          ["Switched over", "next"],
        ].map(([label, state]) => (
          <li key={label} className="relative">
            <span
              className={cn(
                "absolute -left-5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-2 ring-white",
                state === "done" ? "bg-success-fill text-white" : state === "now" ? "bg-primary motion-safe:animate-pulse" : "bg-ink-200",
              )}
            >
              {state === "done" && <Check className="h-2 w-2" />}
            </span>
            <span className={cn(state === "next" ? "text-fg-muted" : "font-medium")}>{label}</span>
          </li>
        ))}
      </ol>
    </div>
  ),

  /* Read first — the guide, with the two numbers it is about. */
  guide: () => (
    <div className={cn(screen, "relative mx-1 overflow-hidden")}>
      <span className="relative block h-[5.5rem] bg-ink-100">
        <Image src="/blog/covers/how-to-read-hosting-renewal-pricing.webp" alt="" fill sizes="280px" className="object-cover" />
        <span className="absolute left-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-primary">Guide</span>
      </span>
      <div className="p-3">
        <p className="font-semibold">How to read hosting renewal pricing</p>
        <div className="mt-2 flex items-end gap-3">
          {[
            ["Year one", TURBO.monthly, "bg-primary"],
            ["Year two", TURBO.standard, "bg-[#22d3ee]"],
          ].map(([label, v, bar]) => (
            <div key={label as string} className="flex flex-1 items-end gap-1.5">
              <span
                className={cn("w-3 origin-bottom rounded-sm motion-safe:animate-[promoRise_5s_ease-out_infinite]", bar as string)}
                style={{ height: `${((v as number) / TURBO.standard) * 26}px` }}
              />
              <span className="text-[10px] leading-tight text-fg-secondary">
                {label}
                <span className="block font-semibold tabular-nums text-fg">${(v as number).toFixed(2)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  /* Support — a real conversation with the team. */
  support: () => (
    <div className={cn(screen, "relative mx-1 overflow-hidden")}>
      <div className="flex items-center gap-2 border-b border-line-subtle px-3 py-2">
        <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[linear-gradient(140deg,var(--color-brand-400),var(--color-primary))] text-[10px] font-bold text-white">
          S<span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success-fill ring-2 ring-white" />
        </span>
        <span className="flex-1">
          <span className="block font-semibold">Serverlys support</span>
          <span className="block text-[10px] text-fg-muted">A person on the team</span>
        </span>
      </div>
      <div className="flex flex-col gap-1.5 bg-ink-50 p-3">
        <p className="ml-auto max-w-[80%] rounded-xl rounded-br-sm bg-primary px-2.5 py-1.5 text-white">My domain still shows the old site</p>
        <p className="max-w-[86%] rounded-xl rounded-bl-sm bg-white px-2.5 py-1.5 shadow-sm motion-safe:animate-[promoPop_6s_ease-out_infinite]">
          Your A record still points to the old host. I&apos;ll walk you through the change.
        </p>
        <div className="flex gap-1 motion-safe:animate-[promoPop2_6s_ease-out_infinite]">
          {["Migration", "DNS", "Billing"].map((t) => (
            <span key={t} className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-brand-100">{t}</span>
          ))}
        </div>
      </div>
    </div>
  ),
};
