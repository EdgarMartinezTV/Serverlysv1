import Link from "next/link";
import { Check, CtaButton, Grid, Headline, ShieldCheck } from "@/components/ref/kit";
import { MockPhoto } from "@/components/ui/mock-photo";
import { NavIcon } from "@/components/navigation/nav-icons";
import type { NavIconName } from "@/data/navigation";
import { billing } from "@/data/company";
import { CHAT, COMMITMENTS, EXPERT, FAQS, HERO, PLANS, TACKLE, WAYS, type WayIcon } from "../_copy";
import { AskSeraButton } from "./ask-sera";

/*
 * /website-development — rebuilt 2026-10-03 in the site's Hostinger-layout
 * language: light hero with a coded product shot, alternating rows, a numbered
 * process (it IS a sequence), plans, a dark commitments band, FAQ. Copy comes
 * from _copy.ts unchanged except where noted there. Every visual is code plus
 * real photography from /public/mock; no stock screenshots.
 */

function Tick() {
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success-fill text-white">
      <svg viewBox="0 0 16 16" fill="none" className="size-3">
        <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Stage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative isolate overflow-hidden rounded-3xl bg-brand-50 p-5 sm:p-8 ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 grid grid-cols-4 grid-rows-3">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={[1, 4, 6, 11].includes(i) ? "bg-brand-100" : ""} />
        ))}
      </div>
      <div aria-hidden="true" className="absolute top-0 right-[8%] -z-10 h-[28%] w-[40%] bg-brand-300/70 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]" />
      {children}
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */

export function Hero() {
  return (
    <section aria-labelledby="wd-hero" className="overflow-hidden bg-canvas pt-12 pb-16 lg:pt-20 lg:pb-24">
      <Grid>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-small font-medium text-primary">
              {HERO.badge}
            </span>
            <h1 id="wd-hero" className="display-lg mt-5 text-fg">
              {HERO.title[0]} {HERO.title[1]}
            </h1>
            <p className="mt-5 max-w-[520px] text-body-lg text-fg-secondary">{HERO.lede}</p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {["A written scope and price before anything starts", "Built on a staged copy you approve", "Runs on infrastructure we already operate"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-body text-fg">
                  <Check className="size-4 shrink-0 text-success-fill" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaButton href={billing.sales} className="w-full sm:w-auto">
                {HERO.cta}
              </CtaButton>
              <Link
                href="#plans"
                className="inline-flex h-12 items-center justify-center rounded-md px-8 text-body font-semibold text-primary ring-1 ring-inset ring-primary transition-colors duration-fast hover:bg-primary-soft"
              >
                See rates
              </Link>
            </div>
          </div>
          <Stage>
            <HeroShot />
          </Stage>
        </div>
      </Grid>
    </section>
  );
}

/** A booking feature being built: the staged site on top, the diff behind it. */
function HeroShot() {
  return (
    <div aria-hidden="true" className="relative pb-10 sm:pr-10">
      <div className="overflow-hidden rounded-xl bg-[#0f1117] shadow-e4 ring-1 ring-black/10">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-[11px] text-white/60">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2">booking/availability.ts</span>
          <span className="ml-auto rounded bg-success-fill/20 px-1.5 py-0.5 text-[#4ade80]">+42 −6</span>
        </div>
        <pre className="overflow-hidden px-4 py-3 font-mono text-[11px] leading-5 text-white/80">
{`export function openSlots(day: Date, partySize: number) {
  const rules = hoursFor(day);          // closed Mondays
  return rules.slots
    .filter((s) => s.covers >= partySize)
    .filter((s) => !isBlackout(day, s)); // private events
}`}
        </pre>
      </div>
      <div className="absolute right-0 bottom-0 w-[72%] overflow-hidden rounded-xl bg-white shadow-e5 ring-1 ring-black/5">
        <div className="flex items-center gap-2 border-b border-line-subtle bg-canvas-secondary px-3 py-1.5 text-[10px] text-fg-secondary">
          <span className="rounded bg-brand-50 px-1.5 py-0.5 font-semibold text-primary">Staging</span>
          staging.emberkitchen.com
        </div>
        <div className="grid grid-cols-[0.9fr_1fr]">
          <MockPhoto src="restaurant" className="h-40" sizes="220px" />
          <div className="p-3">
            <p className="text-small font-semibold text-fg">Book a table</p>
            <p className="text-[10px] text-fg-muted">Fri, Oct 10 · 4 guests</p>
            <div className="mt-2 grid grid-cols-3 gap-1.5 text-[10px] font-semibold">
              {["6:00", "6:30", "7:15", "8:00", "8:45", "9:30"].map((t, i) => (
                <span key={t} className={`rounded-md py-1 text-center ${i === 2 ? "bg-primary text-white" : i === 4 ? "bg-canvas-secondary text-fg-muted line-through" : "bg-brand-50 text-primary"}`}>
                  {t}
                </span>
              ))}
            </div>
            <span className="mt-2 flex h-7 items-center justify-center rounded-md bg-fg text-[10px] font-semibold text-white">Reserve 7:15</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-0 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[11px] shadow-e4 ring-1 ring-black/5">
        <Tick />
        <span><span className="block font-semibold text-fg">Approved by you</span><span className="text-fg-muted">Ready to deploy</span></span>
      </div>
    </div>
  );
}

/* ── One team ─────────────────────────────────────────────────────────────── */

export function Expert() {
  const [owner, staged, survive] = EXPERT.blocks;
  return (
    <section aria-labelledby="wd-expert" className="bg-canvas-secondary py-16 lg:py-24">
      <Grid>
        <Headline id="wd-expert" title={EXPERT.title} description={EXPERT.lede} className="mb-12" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title={owner.title} body={owner.body}>
            <div className="w-full rounded-xl bg-white p-4 shadow-e2">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-small font-semibold text-white">DM</span>
                <span className="text-[11px] leading-tight">
                  <span className="block text-small font-semibold text-fg">Your project lead</span>
                  <span className="text-fg-muted">Booking feature · Ember Kitchen</span>
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-[11px] text-fg-secondary">
                <li className="flex justify-between"><span>Scope agreed</span><span className="font-medium text-fg">Oct 2</span></li>
                <li className="flex justify-between"><span>Staging review</span><span className="font-medium text-fg">Oct 8</span></li>
                <li className="flex justify-between"><span>Go-live</span><span className="font-medium text-primary">Oct 10</span></li>
              </ul>
            </div>
          </Card>
          <Card title={staged.title} body={staged.body}>
            <div className="w-full overflow-hidden rounded-xl bg-white shadow-e2">
              <div className="flex text-[10px] font-semibold">
                <span className="flex-1 bg-canvas-secondary py-1.5 text-center text-fg-muted">Live</span>
                <span className="flex-1 bg-brand-50 py-1.5 text-center text-primary">Staging · new</span>
              </div>
              <div className="grid grid-cols-2 gap-1 p-1">
                <MockPhoto src="coffee" className="h-20 rounded-md opacity-70 grayscale" />
                <MockPhoto src="coffee" className="h-20 rounded-md ring-2 ring-primary" />
              </div>
            </div>
          </Card>
          <Card title={survive.title} body={survive.body}>
            <ul className="w-full space-y-2 rounded-xl bg-white p-4 text-[11px] shadow-e2">
              {[["Daily backup", "3:00 AM"], ["SSL renewed", "Auto"], ["Security patches", "Applied"], ["Uptime · 30 days", "Monitored"]].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between">
                  <span className="text-fg-secondary">{k}</span>
                  <span className="flex items-center gap-1.5 font-medium text-fg">{v}<Tick /></span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Grid>
    </section>
  );
}

function Card({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-canvas ring-1 ring-line">
      <div aria-hidden="true" className="flex h-56 items-center justify-center bg-brand-50 p-6">{children}</div>
      <div className="p-6">
        <h3 className="text-body-lg font-medium text-fg">{title}</h3>
        <p className="mt-2 text-small text-fg-secondary">{body}</p>
      </div>
    </article>
  );
}

/* ── What we get asked for ───────────────────────────────────────────────── */

const WAY_ICON: Record<WayIcon, NavIconName> = {
  palette: "layout",
  gear: "wrench",
  document: "cart",
  code: "bolt",
  speed: "gauge",
  compress: "chart",
  redirect: "compass",
  bug: "shield",
  tools: "wrench",
  wordpress: "globe",
  theme: "layout",
  database: "server",
};

export function Ways() {
  return (
    <section aria-labelledby="wd-ways" className="bg-canvas py-16 lg:py-24">
      <Grid>
        <Headline id="wd-ways" title={WAYS.title} description={WAYS.lede} className="mb-12" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WAYS.items.map((w) => (
            <li key={w.label} className="rounded-2xl bg-canvas-secondary p-6">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-white">
                <NavIcon name={WAY_ICON[w.icon]} className="size-5" />
              </span>
              <p className="mt-6 text-body font-medium text-fg">{w.label}</p>
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  );
}

/* ── Process (a real sequence, so it is numbered) ────────────────────────── */

export function Process() {
  const steps = [
    { title: "You describe the outcome", body: EXPERT.blocks[1].steps[0] },
    { title: "We build it on staging", body: EXPERT.blocks[1].steps[1] },
    { title: "You approve, we deploy", body: EXPERT.blocks[1].steps[2] },
  ];
  return (
    <section aria-labelledby="wd-process" className="bg-canvas-secondary py-16 lg:py-24">
      <Grid>
        <Headline id="wd-process" title="How a project runs" className="mb-12" />
        <ol className="relative grid gap-4 md:grid-cols-3">
          <span aria-hidden="true" className="absolute top-8 right-[16%] left-[16%] hidden h-px bg-brand-200 md:block" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl bg-canvas p-6 ring-1 ring-line">
              <span className="relative inline-flex size-10 items-center justify-center rounded-full bg-primary text-small font-semibold text-white">{i + 1}</span>
              <h3 className="mt-5 text-body-lg font-medium text-fg">{s.title}</h3>
              <p className="mt-2 text-small text-fg-secondary">{s.body}</p>
            </li>
          ))}
        </ol>
      </Grid>
    </section>
  );
}

/* ── Plans ───────────────────────────────────────────────────────────────── */

export function Plans() {
  return (
    <section id="plans" aria-labelledby="wd-plans" className="scroll-mt-24 bg-canvas py-16 lg:py-24">
      <Grid>
        <Headline id="wd-plans" title={PLANS.title} description={PLANS.lede} className="mb-12" />
        <div className="mx-auto grid max-w-[920px] gap-4 md:grid-cols-2">
          {PLANS.cards.map((c, i) => {
            const featured = i === 1;
            return (
              <article
                key={c.name}
                className={`relative flex flex-col overflow-hidden rounded-2xl p-7 ${featured ? "bg-[linear-gradient(180deg,var(--color-brand-950)_0%,#040a1c_100%)] text-white shadow-e5" : "bg-canvas ring-1 ring-line"}`}
              >
                {featured && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(80%_100%_at_50%_0%,rgb(0_0_255/0.5)_0%,transparent_70%)]" />}
                <h3 className={`relative text-[20px] font-semibold ${featured ? "text-white" : "text-fg"}`}>{c.name}</h3>
                <p className={`relative mt-2 text-small ${featured ? "text-fg-on-dark-secondary" : "text-fg-secondary"}`}>{c.body}</p>
                <ul className="relative mt-6 flex flex-col gap-3">
                  {c.rows.map((r) => (
                    <li key={r.label} className={`flex items-baseline justify-between gap-3 border-t pt-3 ${featured ? "border-white/10" : "border-line"}`}>
                      <span className={`text-small ${featured ? "text-fg-on-dark-secondary" : "text-fg-secondary"}`}>{r.label.replace(" •", "").replace("Just", "Per hour")}</span>
                      <span className="flex items-baseline gap-2">
                        {r.off && <span className={`rounded-md px-1.5 py-0.5 text-micro font-semibold ${featured ? "bg-white/15 text-white" : "bg-brand-50 text-primary"}`}>{r.off} off</span>}
                        <span className={`text-[28px] font-semibold tracking-[-0.02em] ${featured ? "text-white" : "text-fg"}`}>{r.price}</span>
                        <span className={featured ? "text-fg-on-dark-muted" : "text-fg-muted"}>{r.unit}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href={billing.sales}
                  className={`relative mt-7 flex h-12 items-center justify-center rounded-md text-body font-semibold transition-colors duration-fast ${featured ? "bg-primary text-white hover:bg-primary-hover" : "text-primary ring-1 ring-inset ring-primary hover:bg-primary-soft"}`}
                >
                  {featured ? "Set up a retainer" : "Book hours"}
                </a>
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-center text-micro text-fg-muted">{PLANS.footnote}</p>
      </Grid>
    </section>
  );
}

/* ── Tell us what it has to do ───────────────────────────────────────────── */

export function Tackle() {
  return (
    <section aria-labelledby="wd-tackle" className="bg-canvas pb-16 lg:pb-24">
      <Grid>
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-8 sm:p-12">
          <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-white/[0.07] [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
          <div className="max-w-[560px]">
            <h2 id="wd-tackle" className="display-md text-white">{TACKLE.title}</h2>
            <p className="mt-4 text-body-lg text-fg-on-brand-muted">{TACKLE.lede}</p>
            <div className="mt-8">
              <CtaButton href={billing.sales} tone="light">{TACKLE.cta}</CtaButton>
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}

/* ── Commitments (dark) ──────────────────────────────────────────────────── */

export function Commitments() {
  return (
    <section aria-labelledby="wd-commit" className="relative isolate overflow-hidden bg-canvas-abyss py-20 lg:py-28">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgb(0_0_255/0.35),transparent_70%)]" />
      <Grid>
        <Headline id="wd-commit" tone="dark" title={COMMITMENTS.title} className="mb-12" />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COMMITMENTS.items.map((c) => (
            <li key={c.title} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-white">
                <ShieldCheck className="size-5" />
              </span>
              <h3 className="mt-5 text-body-lg font-medium text-white">{c.title}</h3>
              <p className="mt-1.5 text-small text-fg-on-dark-secondary">{c.body}</p>
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  );
}

/* ── Not sure yet? ───────────────────────────────────────────────────────── */

export function Chat() {
  return (
    <section aria-labelledby="wd-chat" className="bg-canvas py-16 lg:py-24">
      <Grid>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Stage>
            <div aria-hidden="true" className="mx-auto max-w-[380px] rounded-2xl bg-white p-4 shadow-e4">
              <p className="ml-auto w-fit max-w-[85%] rounded-xl rounded-br-sm bg-primary px-3 py-2 text-small text-white">
                Our contact form stopped sending emails last week.
              </p>
              <p className="mt-2 w-fit max-w-[90%] rounded-xl rounded-bl-sm bg-canvas-secondary px-3 py-2 text-small text-fg">
                That is usually the mail settings, not the form. Send me the site address and I will open a request for the team to check it.
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-[11px] text-primary">
                <Tick /> Request opened · a person replies by email
              </div>
            </div>
          </Stage>
          <div className="max-w-[500px]">
            <h2 id="wd-chat" className="display-lg text-fg">
              {CHAT.title[0]} {CHAT.title[1]}
            </h2>
            <p className="mt-5 text-body-lg text-fg-secondary">{CHAT.lede}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AskSeraButton label={CHAT.primary} />
              <a
                href={billing.sales}
                className="inline-flex h-12 items-center justify-center rounded-md px-8 text-body font-semibold text-primary ring-1 ring-inset ring-primary transition-colors duration-fast hover:bg-primary-soft"
              >
                {CHAT.secondary}
              </a>
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────────────────── */

export function Faq() {
  return (
    <section aria-labelledby="wd-faq" className="bg-canvas-secondary py-16 lg:py-24">
      <Grid>
        <div className="mx-auto max-w-[760px]">
          <h2 id="wd-faq" className="display-md text-center text-fg">{FAQS.title}</h2>
          <ul className="mt-12 divide-y divide-line border-y border-line">
            {FAQS.items.map((f) => (
              <li key={f.q}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                    <span className="text-body-lg text-fg">{f.q}</span>
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="mt-1 size-4 shrink-0 text-fg transition-transform group-open:rotate-45">
                      <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                  </summary>
                  <p className="max-w-2xl pb-5 text-body text-fg-secondary">{f.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </Grid>
    </section>
  );
}
