import Link from "next/link";
import { billing } from "@/data/company";
import { tlds } from "@/data/tlds";
import { ArrowUpRight, CtaButton, Grid } from "@/components/ref/kit";
import type { HeroCopy } from "@/components/ref/domain/hero";
import type { ReasonsCopy } from "@/components/ref/domain/reasons";
import type { StepsCopy } from "@/components/ref/domain/steps";
import { POPULAR, TABLE } from "@/components/ref/domain/copy";
import { PopularRail } from "./popular-rail";
import { TldFilter } from "./tld-filter";
import { MockPhoto } from "@/components/ui/mock-photo";

/*
 * Domain page sections — 2026-10-03, shared by /domain-name, /register-domain,
 * /transfer-domain and /whois-lookup (they import from here).
 *
 * Built in the page folders rather than by editing components/ref/domain/*,
 * which stay in place untouched. Same section ids as before (#search,
 * #tld-prices) because the tests, the in-page CTAs and Sera's navigation map
 * all point at them. Every price is read from data/tlds — nothing invented.
 */

const DOMAIN = "hearthbakery";

/* ── Icons ────────────────────────────────────────────────────────────────── */

function Lock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.25 10.5V7.75a3.75 3.75 0 0 1 7.5 0v2.75" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function Globe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function Toggle({ on = true }: { on?: boolean }) {
  return (
    <span className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 ${on ? "bg-primary" : "bg-ink-200"}`}>
      <span className={`size-4 rounded-full bg-white ${on ? "ml-auto" : ""}`} />
    </span>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */

export function DomainHero({ copy, tool }: { copy: HeroCopy; tool: React.ReactNode }) {
  const chips = tlds.slice(0, 6);
  return (
    <section
      id="search"
      aria-labelledby="dn-hero-heading"
      className="relative isolate scroll-mt-24 overflow-hidden bg-canvas-abyss pt-14 pb-16 xl:pt-20 xl:pb-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_115%,rgb(0_0_255/0.6),transparent_70%),radial-gradient(40%_40%_at_10%_0%,rgb(31_85_255/0.25),transparent_70%)]"
      />
      <Grid>
        <div className="mx-auto max-w-[760px] text-center">
          <h1 id="dn-hero-heading" className="display-xl text-white">
            {copy.title}
          </h1>
          {copy.lede && <p className="mx-auto mt-5 max-w-[560px] text-body-lg text-fg-on-dark-secondary">{copy.lede}</p>}
        </div>

        {/* The live tool on a white card: the search component is styled for
            light surfaces, and a white bar on navy is the reference's look. */}
        {/* The tool brings its own white pill and result panel. */}
        <div className="mx-auto mt-9 w-full max-w-[760px]">{tool}</div>

        <ul className="mx-auto mt-6 flex max-w-[760px] flex-wrap justify-center gap-2">
          {chips.map((t) => (
            <li key={t.tld}>
              <a
                href={billing.searchDomain(`${DOMAIN}${t.tld}`)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-small ring-1 ring-white/15 transition-colors duration-fast hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="font-semibold text-white">{t.tld}</span>
                <span className="text-fg-on-dark-secondary">${t.price.toFixed(2)}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-12 grid max-w-[1000px] gap-3 md:grid-cols-[1.6fr_1fr_1fr]">
          {/* Privacy promo */}
          <div className="relative isolate flex min-h-[260px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-6">
            <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-2/3 bg-white/[0.08] [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white text-primary shadow-e3">
              <Lock className="size-5" />
            </span>
            <div className="max-w-[360px]">
              <p className="text-[24px] leading-8 font-medium tracking-[-0.02em] text-white">{copy.promo.title}</p>
              <p className="mt-2 text-small text-fg-on-brand-muted">{copy.promo.body}</p>
            </div>
          </div>

          {/* Stats over a real photo */}
          <div className="relative isolate flex min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl p-6">
            <div className="absolute inset-0 -z-10">
              <MockPhoto src="checkout" className="h-full" sizes="260px" eager />
            </div>
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950/90 via-brand-950/40 to-transparent" />
            {copy.stats.map((s) => (
              <div key={s.label} className="mt-3 first:mt-0">
                <p className="text-[28px] leading-8 font-medium tracking-[-0.03em] text-white">{s.value}</p>
                <p className="text-small text-white/85">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Transfer card */}
          <Link
            href={copy.aside.href}
            className="group flex min-h-[260px] flex-col rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10 transition-colors duration-fast hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowUpRight className="size-5 self-end text-white transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span aria-hidden="true" className="relative mt-6 flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-e3">
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-brand-50 text-primary">⇄</span>
              <span className="text-small text-fg">{DOMAIN}<b>.com</b></span>
              <svg viewBox="0 0 24 24" className="absolute -bottom-4 left-6 size-6 drop-shadow"><path d="M5 3l14 7-6 2-2 6L5 3Z" fill="var(--color-fg)" stroke="white" strokeWidth="1.4" strokeLinejoin="round" /></svg>
            </span>
            <span className="mt-auto pt-6">
              <span className="block text-[20px] leading-7 font-medium tracking-[-0.02em] text-white">{copy.aside.label}</span>
              <span className="mt-1.5 block text-small text-fg-on-dark-secondary">{copy.aside.body}</span>
            </span>
          </Link>
        </div>
      </Grid>
    </section>
  );
}

/* ── Reasons ──────────────────────────────────────────────────────────────── */

export function Reasons({ copy }: { copy: ReasonsCopy }) {
  const [one, two, three, four] = copy.items;
  const card = "flex flex-col overflow-hidden rounded-2xl bg-brand-50";
  return (
    <section aria-labelledby="dn-reasons-heading" className="bg-canvas py-16 lg:py-24">
      <Grid>
        <h2 id="dn-reasons-heading" className="display-lg mx-auto max-w-[760px] text-center text-fg">
          {copy.title}
        </h2>

        <div className="mt-12 grid gap-3 lg:grid-cols-[1fr_2fr]">
          {/* 1 · URL pill */}
          {one && (
            <div className={card}>
              <div aria-hidden="true" className="relative h-56 overflow-hidden">
                <div className="absolute top-10 -right-6 left-6 flex items-center gap-3 rounded-full bg-white py-3 pr-6 pl-3 shadow-e3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-primary"><Globe className="size-5" /></span>
                  <span className="truncate text-body-lg text-fg">https://www.{DOMAIN}.<span className="text-primary">com</span></span>
                </div>
                <svg viewBox="0 0 24 24" className="absolute top-[88px] left-14 size-9 drop-shadow"><path d="M5 3l14 7-6 2-2 6L5 3Z" fill="var(--color-brand-900)" stroke="white" strokeWidth="1.4" strokeLinejoin="round" /></svg>
              </div>
              <div className="p-6 pt-0">
                <h3 className="text-h4 font-medium text-fg">{one.title}</h3>
                <p className="mt-2 text-small text-fg-secondary">{one.body}</p>
              </div>
            </div>
          )}

          {/* 2 · Privacy over a photo */}
          {two && (
            <div className={card}>
              <div aria-hidden="true" className="relative h-56 overflow-hidden">
                <div className="absolute inset-0"><MockPhoto src="chair" className="h-full" sizes="800px" position="center 65%" /></div>
                <div className="absolute top-5 right-5 w-64 space-y-2">
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-e3">
                    <span className="text-body font-medium text-fg">WHOIS privacy</span>
                    <Toggle />
                  </div>
                  <div className="rounded-xl bg-white px-4 py-3 shadow-e3 text-small">
                    <p className="flex items-center gap-2 text-fg-secondary"><Lock className="size-4 text-primary" />Security</p>
                    <p className="mt-2 flex items-center justify-between text-fg">SSL certificate <span className="rounded-md bg-success-soft px-2 py-0.5 text-micro font-semibold text-success">Active</span></p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-h4 font-medium text-fg">{two.title}</h3>
                <p className="mt-2 max-w-[640px] text-small text-fg-secondary">{two.body}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[2fr_1fr]">
          {/* 3 · Support: a real site with a chat bubble */}
          {three && (
            <div className={card}>
              <div aria-hidden="true" className="relative h-60 overflow-hidden">
                <div className="absolute inset-0"><MockPhoto src="restaurant" className="h-full" sizes="800px" /></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                <div className="absolute top-5 right-6 left-6 flex justify-between text-[10px] font-semibold tracking-[0.18em] text-white/85">
                  <span>HOME · MENU · CONTACT</span><span>⌕</span>
                </div>
                <div className="absolute bottom-8 left-6 text-white">
                  <p className="text-[30px] leading-none font-bold tracking-[-0.02em] uppercase">Ember<br />kitchen</p>
                  <span className="mt-3 inline-block bg-white px-4 py-1.5 text-[11px] font-semibold text-fg">Book a table</span>
                </div>
                <div className="absolute right-6 bottom-10 flex max-w-[270px] items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-e4">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-micro font-bold text-primary">M</span>
                  <span className="text-small text-fg">Hi, I&apos;d like to point my domain at my new site.</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-h4 font-medium text-fg">{three.title}</h3>
                <p className="mt-2 max-w-[640px] text-small text-fg-secondary">{three.body}</p>
              </div>
            </div>
          )}

          {/* 4 · Setup steps */}
          {four && (
            <div className={card}>
              <div aria-hidden="true" className="flex h-60 items-center justify-center">
                <ul className="relative w-48 rounded-2xl bg-white p-5 shadow-e3">
                  {[["Buy", true], ["Register", true], ["Go online", false]].map(([t, d], i) => (
                    <li key={t as string} className="relative flex items-center gap-3 pb-5 last:pb-0">
                      {i < 2 && <span className="absolute top-5 left-[9px] h-full w-0.5 bg-primary/40" />}
                      <span className={`relative z-10 inline-flex size-5 items-center justify-center rounded-full ${d ? "bg-primary text-white" : "bg-white ring-2 ring-line-strong"}`}>
                        {d && <svg viewBox="0 0 16 16" fill="none" className="size-3"><path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </span>
                      <span className="text-small text-fg">{t}</span>
                    </li>
                  ))}
                  <svg viewBox="0 0 24 24" className="absolute -right-3 -bottom-4 size-8 drop-shadow"><path d="M5 3l14 7-6 2-2 6L5 3Z" fill="var(--color-brand-900)" stroke="white" strokeWidth="1.4" strokeLinejoin="round" /></svg>
                </ul>
              </div>
              <div className="p-6 pt-0">
                <h3 className="text-h4 font-medium text-fg">{four.title}</h3>
                <p className="mt-2 text-small text-fg-secondary">{four.body}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <CtaButton href={copy.cta.href}>{copy.cta.label}</CtaButton>
        </div>
      </Grid>
    </section>
  );
}

/* ── Popular extensions (dark band, scroll rail) ──────────────────────────── */

export function Popular() {
  return (
    <section aria-labelledby="dn-popular-heading" className="relative isolate overflow-hidden bg-canvas-abyss py-16 lg:py-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_110%,rgb(0_0_255/0.5),transparent_70%)]" />
      <PopularRail title={POPULAR.title} cta={POPULAR.cta} check={POPULAR.check} />
    </section>
  );
}

/* ── Manage: coded DNS / renewal panel ────────────────────────────────────── */

export function Manage() {
  return (
    <section aria-labelledby="dn-manage-heading" className="bg-canvas py-16 lg:py-24">
      <Grid>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div aria-hidden="true" className="relative isolate overflow-hidden rounded-3xl bg-brand-50 p-5 sm:p-8">
            <div className="absolute inset-0 -z-10 grid grid-cols-4 grid-rows-3">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className={[1, 4, 6, 11].includes(i) ? "bg-brand-100" : ""} />
              ))}
            </div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-e5 ring-1 ring-black/5">
              <div className="flex items-center justify-between border-b border-line-subtle px-5 py-3.5">
                <span className="flex items-center gap-2 text-small font-semibold text-fg">
                  <Globe className="size-4 text-primary" /> {DOMAIN}.com
                </span>
                <span className="flex items-center gap-1.5 text-micro font-semibold text-success">
                  <span className="size-1.5 rounded-full bg-success-fill" /> Active
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-line-subtle p-4 text-[11px]">
                {[
                  ["Expires", "Oct 3, 2027"],
                  ["Auto-renew", "On"],
                  ["Privacy", "On"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-canvas-secondary px-3 py-2">
                    <p className="text-fg-muted">{k}</p>
                    <p className="font-semibold text-fg">{v}</p>
                  </div>
                ))}
              </div>
              <div className="p-4">
                <p className="text-small font-semibold text-fg">DNS records</p>
                <table className="mt-3 w-full text-left text-[11px]">
                  <thead className="text-fg-muted">
                    <tr>
                      <th className="pb-2 font-normal">Type</th>
                      <th className="pb-2 font-normal">Name</th>
                      <th className="pb-2 font-normal">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-subtle text-fg">
                    {[
                      ["A", "@", "203.0.113.24"],
                      ["CNAME", "www", `${DOMAIN}.com`],
                      ["MX", "@", "mail.serverlys.com"],
                      ["TXT", "@", "v=spf1 include:serverlys…"],
                    ].map(([t, n, v]) => (
                      <tr key={t + n}>
                        <td className="py-2"><span className="rounded bg-brand-50 px-1.5 py-0.5 font-semibold text-primary">{t}</span></td>
                        <td className="py-2">{n}</td>
                        <td className="max-w-[160px] truncate py-2 text-fg-secondary">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="max-w-[500px]">
            <h2 id="dn-manage-heading" className="display-md text-fg">Everything about the name, in one place</h2>
            <p className="mt-4 text-body text-fg-secondary">
              Renewals, privacy and DNS live together, so pointing the name at a website or an inbox
              takes a minute, not a support ticket.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                ["Auto-renew", "A lapsed domain can be re-registered by anyone. Keep it on."],
                ["Free WHOIS privacy", "Contact details masked wherever the registry allows it."],
                ["Editable DNS", "Point it at Serverlys hosting, your own nameservers, or another provider."],
              ].map(([t, b]) => (
                <li key={t} className="flex items-start gap-3">
                  <Toggle />
                  <span className="text-body">
                    <span className="font-medium text-fg">{t}.</span>{" "}
                    <span className="text-fg-secondary">{b}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Grid>
    </section>
  );
}

/* ── Steps (a real sequence, so the numbers stay) ─────────────────────────── */

export function Steps({ copy }: { copy: StepsCopy }) {
  return (
    <section aria-labelledby="dn-steps-heading" className="bg-canvas py-16 lg:py-24">
      <Grid>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <h2 id="dn-steps-heading" className="display-lg text-fg">
            {copy.title}
          </h2>
          <ol className="border-t border-line">
            {copy.items.map((s, i) => (
              <li key={s.title} className="border-b border-line">
                <details name="dn-steps" open={i === 0} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                    <span className="text-body-lg text-fg">{i + 1}. {s.title}</span>
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0 text-fg">
                      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M8 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="group-open:hidden" />
                    </svg>
                  </summary>
                  <div className="pb-5">
                    <p className="text-small text-fg-secondary">{s.body}</p>
                    {s.cta && (
                      <div className="mt-4">
                        <CtaButton href="#search" className="px-6">{s.cta}</CtaButton>
                      </div>
                    )}
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </Grid>
    </section>
  );
}

/* ── "Lost?" explainer band ───────────────────────────────────────────────── */

export function Explainers() {
  return (
    <section aria-labelledby="dn-explain-heading" className="relative isolate overflow-hidden bg-canvas-abyss py-16 lg:py-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_50%_at_50%_0%,rgb(0_0_255/0.35),transparent_70%)]" />
      <Grid>
        <h2 id="dn-explain-heading" className="display-lg mx-auto max-w-[760px] text-center text-white">
          Lost? Here&apos;s what you need to know about domains
        </h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          <li>
            <div aria-hidden="true" className="relative flex h-60 items-center justify-center overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
              <div className="w-[78%] space-y-2 rounded-2xl bg-white/[0.06] py-4 text-center text-small text-white/45">
                <p>www.{DOMAIN}.com</p>
                <p>www.{DOMAIN}.shop</p>
                <p className="relative z-10 -mx-8 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-left text-body text-fg shadow-e5">
                  <Globe className="size-5 text-primary" /> www.{DOMAIN}.<span className="font-semibold text-primary">store</span>
                </p>
                <p>www.{DOMAIN}.net</p>
                <p>www.{DOMAIN}.org</p>
              </div>
            </div>
            <h3 className="mt-5 text-body-lg font-medium text-white">What is a domain?</h3>
            <p className="mt-2 text-small text-fg-on-dark-secondary">
              A domain name is how people find your site. It&apos;s far easier to remember than
              the IP address it points to.
            </p>
          </li>
          <li>
            <div aria-hidden="true" className="relative flex h-60 items-center overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
              <div className="ml-8 flex w-full items-center rounded-l-full bg-white py-3 pr-3 pl-6 shadow-e5">
                <span className="flex-1 text-[34px] leading-none tracking-[-0.02em] text-fg-muted">your<span className="text-fg">.com</span></span>
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-primary text-[22px] text-white ring-8 ring-primary/30">⇄</span>
              </div>
            </div>
            <h3 className="mt-5 text-body-lg font-medium text-white">How do I transfer my domain?</h3>
            <p className="mt-2 text-small text-fg-on-dark-secondary">
              Already own a name elsewhere? Move it to Serverlys and keep the time you paid for.
            </p>
            <Link href="/transfer-domain" className="mt-3 inline-flex items-center gap-1.5 text-small font-semibold text-white hover:text-primary-on-dark">
              Domain transfer <ArrowUpRight className="size-3.5" />
            </Link>
          </li>
          <li>
            <div aria-hidden="true" className="relative flex h-60 items-center justify-center overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
              <div className="w-44 rounded-2xl bg-white py-3 text-center shadow-e5">
                <p className="text-body-lg text-fg-muted">.org</p>
                <p className="mx-3 my-1 rounded-full bg-primary py-2 text-[22px] font-semibold text-white">.com</p>
                <p className="text-body-lg text-fg-muted">.net</p>
              </div>
              <div className="absolute top-8 right-8 rounded-xl bg-primary px-3 py-2 text-small font-semibold text-white shadow-e4">+ Hosting</div>
            </div>
            <h3 className="mt-5 text-body-lg font-medium text-white">Hosting + domain</h3>
            <p className="mt-2 text-small text-fg-on-dark-secondary">
              Your domain is the address; hosting keeps the site online. Run both from one
              Serverlys account, on one bill.
            </p>
          </li>
        </ul>
      </Grid>
    </section>
  );
}

/* ── TLD price table ──────────────────────────────────────────────────────── */

export function TldTable() {
  return (
    <section id="tld-prices" aria-labelledby="dn-table-heading" className="scroll-mt-24 bg-canvas py-16 lg:py-24">
      <Grid>
        <h2 id="dn-table-heading" className="display-lg mx-auto max-w-[760px] text-center text-fg">
          {TABLE.title}
        </h2>
        <TldFilter />

        <ul className="mt-8 flex flex-col gap-3 md:hidden">
          {tlds.map((t) => (
            <li key={t.tld} data-tld={t.tld} className="rounded-2xl bg-canvas-secondary p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[22px] leading-7 font-semibold tracking-[-0.02em] text-fg">{t.tld}</p>
                <p className="text-body font-semibold text-fg">
                  ${t.price.toFixed(2)}
                  <span className="font-normal text-fg-secondary"> /1st yr</span>
                </p>
              </div>
              <p className="mt-1 text-small text-fg-secondary">
                {t.note ?? "General purpose"} · {TABLE.columns.renew}: {TABLE.renewNote}
              </p>
              <a
                href={billing.registerDomain}
                className="mt-3 inline-flex min-h-11 items-center rounded-md px-3 text-body font-semibold text-primary hover:bg-primary-soft"
              >
                Register {t.tld}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8 hidden overflow-hidden rounded-2xl ring-1 ring-line md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Domain extension prices</caption>
            <thead className="bg-canvas-secondary">
              <tr>
                {[TABLE.columns.tld, TABLE.columns.first, TABLE.columns.renew, TABLE.columns.note].map((c) => (
                  <th key={c} scope="col" className="px-6 py-4 text-small font-semibold text-fg">
                    {c}
                  </th>
                ))}
                <th scope="col" className="px-6 py-4">
                  <span className="sr-only">Register</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle">
              {tlds.map((t) => (
                <tr key={t.tld} data-tld={t.tld} className="transition-colors duration-fast hover:bg-brand-50/50">
                  <th scope="row" className="px-6 py-2 text-body-lg font-semibold text-fg">{t.tld}</th>
                  <td className="px-6 py-2 text-body font-medium text-fg">${t.price.toFixed(2)}</td>
                  <td className="px-6 py-2 text-small text-fg-muted">{TABLE.renewNote}</td>
                  <td className="px-6 py-2 text-small text-fg-secondary">{t.note ?? "—"}</td>
                  <td className="px-6 py-2 text-right">
                    <a
                      href={billing.registerDomain}
                      className="inline-flex min-h-11 items-center rounded-md px-4 text-small font-semibold text-primary ring-1 ring-inset ring-primary transition-colors duration-fast hover:bg-primary-soft"
                    >
                      Register
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Grid>
    </section>
  );
}

