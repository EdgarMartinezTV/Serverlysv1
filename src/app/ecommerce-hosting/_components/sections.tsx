import { MockPhoto, type MockPhotoName } from "@/components/ui/mock-photo";
import { Check, CtaButton, Grid, ShieldCheck } from "@/components/ref/kit";
import { SeraMark } from "@/components/sera/sera-mark";
import { ConvoAiLogo } from "@/components/layout/convoai-logo";
import { HERO } from "../_content";

/*
 * Ecommerce hosting sections — 2026-10-03, in the reference's order and
 * layout, every visual drawn in code.
 *
 * ⚠ CLAIMS ARE OURS. The previous copy carried the reference's figures
 * ("99.9% uptime", "up to 3x faster with Object Cache", "global CDN",
 * "IPv6 and HTTP/3", "AI-generated product descriptions") and a section for
 * an email product that does not exist. None of those are published anywhere
 * else on this site, so they are gone. What remains is what every ecommerce
 * plan carries per data/pricing.ts and the Manage stage: NVMe, LiteSpeed and
 * its store cache, SSL, daily backups, firewall and scanning, free migration,
 * and ConvoAI.
 */

function Tick({ size = 5 }: { size?: 5 | 9 }) {
  return (
    <span className={`inline-flex ${size === 9 ? "size-9" : "size-5"} shrink-0 items-center justify-center rounded-full bg-success-fill text-white`}>
      <svg viewBox="0 0 16 16" fill="none" className={size === 9 ? "size-5" : "size-3"}>
        <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Checks({ items, dark = false }: { items: readonly string[]; dark?: boolean }) {
  return (
    <ul className="mt-6 flex flex-col gap-3">
      {items.map((t) => (
        <li key={t} className={`flex items-start gap-2.5 text-body ${dark ? "text-fg-on-dark-secondary" : "text-fg"}`}>
          <Check className={`mt-1 size-4 shrink-0 ${dark ? "text-white" : "text-success-fill"}`} />
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Angled brand slabs behind a visual, the reference's framing device. */
function Slabs({ dark = false }: { dark?: boolean }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div className={`absolute top-0 right-[8%] h-[38%] w-[46%] [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)] ${dark ? "bg-primary/40" : "bg-brand-300"}`} />
      <div className={`absolute bottom-0 left-[18%] h-[22%] w-[40%] [clip-path:polygon(0_0,100%_0,82%_100%,0_100%)] ${dark ? "bg-primary/30" : "bg-brand-400"}`} />
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */

export function Hero() {
  return (
    <section aria-labelledby="ecom-hero-heading" className="overflow-hidden bg-canvas pt-12 pb-16 lg:pt-20 lg:pb-24">
      <Grid>
        <div className="grid items-center gap-14 [&>*]:min-w-0 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-body-lg font-medium text-fg">
              Up to <span className="text-primary">37%</span> off WooCommerce hosting
            </p>
            <h1 id="ecom-hero-heading" className="display-lg mt-4 text-fg">
              {HERO.title}
            </h1>
            <Checks items={["Free domain and store migration", "WooCommerce installed in one click", "Updates, backups and security handled", "Support from a real team"]} />
            <div className="mt-8">
              <CtaButton href="#pricing" className="w-full sm:w-auto">
                Start now
              </CtaButton>
            </div>
            <p className="mt-4 flex items-center gap-2 text-small text-fg-secondary">
              <ShieldCheck className="size-4 shrink-0" />
              30-day money-back guarantee
            </p>
          </div>
          <StoreMock />
        </div>
      </Grid>
    </section>
  );
}

// Rows below are literal tuples typed as strings; narrow at the call site.
const Photo = (p: Omit<React.ComponentProps<typeof MockPhoto>, "src"> & { src: string }) => (
  <MockPhoto {...p} src={p.src as MockPhotoName} />
);

const STORE = "Fern & Fold";

function StoreMock() {
  return (
    <div aria-hidden="true" className="relative isolate mx-auto w-full max-w-[600px] px-4 py-10">
      <Slabs />
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-e5 ring-1 ring-black/5">
        {/* browser chrome */}
        <div className="flex items-center gap-2 border-b border-line-subtle bg-canvas-secondary px-3 py-2">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 flex flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] text-fg-secondary ring-1 ring-line-subtle">
            <svg viewBox="0 0 16 16" fill="none" className="size-3 text-success"><path d="M5 7V5.5a3 3 0 0 1 6 0V7M4.5 7h7v6h-7z" stroke="currentColor" strokeWidth="1.5" /></svg>
            fernandfold.shop
          </span>
        </div>
        {/* store header */}
        <div className="flex items-center justify-between px-5 py-3 text-[11px]">
          <span className="text-small font-semibold tracking-tight text-fg">{STORE}</span>
          <span className="hidden gap-4 text-fg-secondary sm:flex"><span>New in</span><span>Kitchen</span><span>Bath</span></span>
          <span className="rounded-full bg-fg px-2.5 py-1 font-semibold text-white">Cart · 2</span>
        </div>
        {/* hero banner */}
        <div className="relative mx-3 h-36 overflow-hidden rounded-xl sm:h-40">
          <div className="absolute inset-0">
            <Photo src="sofa" className="h-full" sizes="560px" position="center 72%" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />
          <div className="absolute top-1/2 left-5 -translate-y-1/2 text-white">
            <p className="text-micro font-semibold tracking-[0.18em] uppercase opacity-80">Autumn edit</p>
            <p className="mt-1 text-[24px] leading-tight font-semibold tracking-[-0.02em]">Slow living,<br />made simple.</p>
            <span className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-fg">Shop now</span>
          </div>
        </div>
        {/* products */}
        <div className="grid grid-cols-3 gap-2.5 p-3">
          {[
            ["mug", "Stoneware mug", "$18.00"],
            ["bottle", "Insulated bottle", "$32.00"],
            ["serum", "Botanical oil", "$26.00"],
          ].map(([src, name, price]) => (
            <div key={src}>
              <Photo src={src} className="aspect-square rounded-lg bg-canvas-secondary" />
              <p className="mt-1.5 truncate text-[11px] font-medium text-fg">{name}</p>
              <p className="text-[11px] text-fg-secondary">{price}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-[38%] -right-1 flex items-center gap-2 rounded-xl bg-white py-2 pr-3 pl-2 shadow-e5 ring-1 ring-black/5">
        <Photo src="mug" className="size-9 rounded-md" />
        <span className="text-[11px] leading-tight"><span className="block font-semibold text-fg">Added to cart</span><span className="text-fg-secondary">Stoneware mug</span></span>
      </div>
      <div className="absolute bottom-3 left-8 flex items-center gap-2 rounded-xl bg-fg px-4 py-2.5 text-small text-white shadow-e5">
        <Tick /> New order #1042 · $50.00
      </div>
    </div>
  );
}

/* ── Launch quickly ───────────────────────────────────────────────────────── */

export function LaunchQuickly() {
  return (
    <section id="launch" aria-labelledby="ecom-launch-heading" className="scroll-mt-14 bg-canvas py-16 lg:py-24">
      <Grid>
        <div className="grid items-center gap-14 [&>*]:min-w-0 lg:grid-cols-2 lg:gap-20">
          <div aria-hidden="true" className="relative isolate mx-auto w-full max-w-[540px] py-8 pr-6">
            <Slabs />
            <div className="relative flex overflow-hidden rounded-2xl bg-white shadow-e5 ring-1 ring-black/5">
              <div className="flex w-11 flex-col items-center gap-4 bg-[#1d2327] py-4 text-white/60">
                <span className="inline-flex size-6 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white">W</span>
                {["▦", "✎", "🛍", "▤", "⚙"].map((g, i) => (
                  <span key={i} className={`text-[12px] ${i === 2 ? "rounded bg-primary px-1 text-white" : ""}`}>{g}</span>
                ))}
              </div>
              <div className="flex-1 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-body-lg font-semibold text-fg">Add new product</p>
                  <span className="rounded-md bg-primary px-3 py-1 text-[11px] font-semibold text-white">Publish</span>
                </div>
                <div className="mt-4 grid grid-cols-[96px_1fr] gap-4">
                  <Photo src="headphones" className="aspect-square rounded-lg" />
                  <div className="space-y-2 text-[11px]">
                    <p className="rounded-md px-2.5 py-1.5 font-medium text-fg ring-2 ring-primary/60">Studio wireless headphones</p>
                    <p className="rounded-md px-2.5 py-1.5 leading-snug text-fg-secondary ring-1 ring-line">
                      40-hour battery, soft memory-foam cushions and a fold-flat case.
                    </p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                  {[["Price", "$129.00"], ["Sale", "$109.00"], ["Stock", "48"]].map(([k, v]) => (
                    <div key={k} className="rounded-md bg-canvas-secondary px-2.5 py-1.5">
                      <dt className="text-fg-muted">{k}</dt>
                      <dd className="font-semibold text-fg">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                  {["Audio", "Wireless", "Gifts"].map((t) => (
                    <span key={t} className="rounded-full bg-brand-50 px-2 py-0.5 font-medium text-primary">{t}</span>
                  ))}
                </p>
              </div>
            </div>
            <div className="absolute -right-2 -bottom-6 w-36 overflow-hidden rounded-xl bg-white shadow-e5 ring-1 ring-black/5">
              <Photo src="headphones" className="h-20" />
              <div className="px-3 py-2 text-[11px]">
                <p className="font-medium text-fg">Studio headphones</p>
                <p className="flex items-center justify-between"><span><s className="text-fg-muted">$129</s> <b className="text-fg">$109</b></span><span className="flex items-center gap-1 text-success"><span className="size-1.5 rounded-full bg-success-fill" />Live</span></p>
              </div>
            </div>
          </div>
          <div className="max-w-[500px]">
            <h2 id="ecom-launch-heading" className="display-lg text-fg">Launch quickly, scale effortlessly</h2>
            <p className="mt-4 text-body text-fg-secondary">Skip the setup and get straight to selling.</p>
            <Checks
              items={[
                "A free domain for your brand",
                "WooCommerce installed in one click, ready for your first product",
                "Unlimited NVMe storage for every product photo",
                "Move up a tier in a few clicks when the store grows",
                "Your current store moved for you, free",
              ]}
            />
          </div>
        </div>
      </Grid>
    </section>
  );
}

/* ── ConvoAI on the store ─────────────────────────────────────────────────── */

export function StoreAgent() {
  return (
    <section id="agent" aria-labelledby="ecom-agent-heading" className="scroll-mt-14 bg-canvas pb-16 lg:pb-24">
      <Grid>
        <div className="grid overflow-hidden rounded-3xl bg-brand-50 lg:grid-cols-[1.15fr_1fr]">
          <div aria-hidden="true" className="relative min-h-[340px] overflow-hidden bg-gradient-to-br from-brand-300 via-brand-500 to-brand-700 p-6 sm:p-10">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-white/10 [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%)]" />
            <div className="relative ml-auto max-w-[340px] rounded-2xl bg-white p-4 shadow-e5">
              <div className="flex items-center gap-2 border-b border-line-subtle pb-3">
                <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary text-white"><SeraMark className="size-4" /></span>
                <span className="text-small font-semibold text-fg">Store assistant</span>
                <span className="ml-auto flex items-center gap-1 text-micro text-success"><span className="size-1.5 rounded-full bg-success-fill" />Online</span>
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                <p className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-primary px-3 py-2 text-small text-white">Do you ship to Canada?</p>
                <p className="max-w-[90%] rounded-xl rounded-bl-sm bg-canvas-secondary px-3 py-2 text-small text-fg">Yes, 5 to 8 business days, $12 flat. Want me to add the mug to your cart?</p>
                <p className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-primary px-3 py-2 text-small text-white">Yes please</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <ConvoAiLogo tone="light" className="h-7 w-auto self-start" />
            <h2 id="ecom-agent-heading" className="mt-6 text-h3 font-medium tracking-[-0.02em] text-fg">A chat agent trained on your own store</h2>
            <p className="mt-3 text-body text-fg-secondary">
              Shipping, returns, sizing and stock, answered from your own pages day and night.
              It captures the buyer&apos;s details and hands anything it should not attempt to a
              person.
            </p>
            <div className="mt-7">
              <CtaButton href="/convoai">Explore ConvoAI</CtaButton>
            </div>
          </div>
        </div>
        <ul className="mt-4 grid gap-8 rounded-3xl bg-brand-50 p-8 md:grid-cols-3 sm:p-10">
          {[
            ["Answers before you wake up", "Most store questions arrive after hours. They get answered then, not the next morning."],
            ["Grounded in your catalogue", "It reads the pages you publish, so answers match your store instead of guessing."],
            ["Free with your plan", "Included with every ecommerce plan at no extra cost."],
          ].map(([t, b]) => (
            <li key={t}>
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-white text-primary shadow-e1"><SeraMark className="size-4" /></span>
              <h3 className="mt-4 text-body-lg font-medium text-fg">{t}</h3>
              <p className="mt-1.5 text-small text-fg-secondary">{b}</p>
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  );
}

/* ── Speed ────────────────────────────────────────────────────────────────── */

export function StoreSpeed() {
  return (
    <section id="performance" aria-labelledby="ecom-speed-heading" className="scroll-mt-14 bg-canvas py-16 lg:py-24">
      <Grid>
        <div className="grid items-center gap-14 [&>*]:min-w-0 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-[520px]">
            <h2 id="ecom-speed-heading" className="display-lg text-fg">Maximum speed, maximum sales</h2>
            <p className="mt-4 text-body text-fg-secondary">A fast store keeps buyers moving from product page to checkout.</p>
            <Checks
              items={[
                "LiteSpeed web servers with a store-aware cache built in",
                "NVMe storage, so product pages and images load quickly",
                "Unmetered bandwidth for the day a product takes off",
                "Daily backups taken before anything changes",
              ]}
            />
          </div>
          <div aria-hidden="true" className="relative isolate mx-auto w-full max-w-[520px] py-8">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-brand-100 [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%,0_14%)]" />
            <div className="grid grid-cols-1 gap-3 px-2 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:px-6">
              <div className="rounded-2xl bg-white p-5 shadow-e4 ring-1 ring-black/5">
                <p className="text-body-lg font-semibold text-fg">Order summary</p>
                {[
                  ["sneaker", "Trail runner, black", "Size 10", "$96.00"],
                  ["watch", "Minimal watch, white", "38 mm", "$74.00"],
                ].map(([src, name, opt, price]) => (
                  <div key={src} className="mt-4 flex items-center gap-3">
                    <span className="relative">
                      <Photo src={src} className="size-12 rounded-lg bg-canvas-secondary" />
                      <span className="absolute -top-1.5 -right-1.5 inline-flex size-4 items-center justify-center rounded-full bg-fg text-[9px] font-semibold text-white">1</span>
                    </span>
                    <span className="min-w-0 flex-1 text-[11px]">
                      <span className="block truncate font-medium text-fg">{name}</span>
                      <span className="text-fg-muted">{opt}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-fg">{price}</span>
                  </div>
                ))}
                <dl className="mt-4 space-y-1 border-t border-line-subtle pt-3 text-[11px]">
                  <div className="flex justify-between text-fg-secondary"><dt>Shipping</dt><dd>Free</dd></div>
                  <div className="flex justify-between font-semibold text-fg"><dt>Total</dt><dd>$170.00</dd></div>
                </dl>
                <span className="mt-4 flex h-10 items-center justify-center rounded-lg bg-primary text-small font-semibold text-white">Place order</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="rounded-2xl bg-white p-4 shadow-e4 ring-1 ring-black/5">
                  <p className="text-micro text-fg-secondary">Sales · 7 days</p>
                  <p className="text-[22px] leading-none font-semibold text-fg">$1,688 <span className="text-micro text-success">+38%</span></p>
                  <svg viewBox="0 0 100 40" className="mt-3 h-12 w-full" preserveAspectRatio="none">
                    <path d="M0 30 L16 24 L33 27 L50 18 L66 20 L83 12 L100 4 L100 40 L0 40Z" fill="var(--color-brand-100)" />
                    <path d="M0 30 L16 24 L33 27 L50 18 L66 20 L83 12 L100 4" fill="none" stroke="var(--color-primary)" strokeWidth="1.6" />
                  </svg>
                  <p className="mt-1 flex justify-between text-[9px] text-fg-muted"><span>Mon</span><span>Sun</span></p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-center shadow-e4 ring-1 ring-black/5">
                  <p className="text-micro text-fg-secondary">PageSpeed</p>
                  <div className="relative mx-auto mt-1 size-16">
                    <svg viewBox="0 0 100 100" className="size-16 -rotate-90"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-canvas-secondary)" strokeWidth="10" /><circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-success-fill)" strokeWidth="10" strokeDasharray="249 252" strokeLinecap="round" /></svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[20px] font-semibold text-success">99</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}

/* ── Dark band: security · managed WooCommerce · migration ────────────────── */

export function DarkBand() {
  return (
    <section id="features" aria-labelledby="ecom-security-heading" className="relative isolate scroll-mt-14 overflow-hidden bg-canvas-abyss py-20 lg:py-28">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_20%_15%,rgb(0_0_255/0.35),transparent_70%),radial-gradient(45%_35%_at_80%_85%,rgb(0_0_255/0.3),transparent_70%)]" />
      <Grid>
        <div className="flex flex-col gap-24 lg:gap-32">
          {/* Security */}
          <div className="grid items-center gap-14 [&>*]:min-w-0 lg:grid-cols-2 lg:gap-20">
            <div aria-hidden="true" className="relative mx-auto h-[340px] w-full max-w-[460px]">
              <div className="absolute top-6 left-10 w-[250px] overflow-hidden rounded-2xl bg-white shadow-e5">
                <Photo src="chair" className="h-[210px]" sizes="250px" position="40% 75%" />
                <div className="flex items-center justify-between px-4 py-3 text-small">
                  <span><span className="block font-medium text-fg">Lounge chair, mustard</span><span className="text-micro text-fg-secondary">$349.00</span></span>
                  <span className="rounded-md bg-primary px-2.5 py-1 text-micro font-semibold text-white">Buy</span>
                </div>
                <p className="flex items-center gap-1.5 border-t border-line-subtle px-4 py-2 text-micro text-success">
                  <svg viewBox="0 0 16 16" fill="none" className="size-3"><path d="M5 7V5.5a3 3 0 0 1 6 0V7M4.5 7h7v6h-7z" stroke="currentColor" strokeWidth="1.5" /></svg>
                  Secure checkout · SSL
                </p>
              </div>
              <div className="absolute top-0 right-6 flex w-40 flex-col items-center rounded-2xl bg-white p-5 text-center shadow-e5">
                <Tick size={9} />
                <p className="mt-3 text-body font-semibold text-fg">Your store is safe</p>
              </div>
              <div className="absolute bottom-2 left-0 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-e5">
                <span className="text-small font-semibold text-fg">Daily backups</span>
                <span className="flex items-center gap-1.5 text-micro text-success"><Tick />Active</span>
              </div>
            </div>
            <div className="max-w-[520px]">
              <h2 id="ecom-security-heading" className="display-lg text-white">Top-notch security for your online store</h2>
              <p className="mt-4 text-body text-fg-on-dark-secondary">Build a store your customers trust with their card details.</p>
              <Checks
                dark
                items={[
                  "A free SSL certificate, issued and renewed automatically",
                  "Daily backups you can restore yourself, whole store or one file",
                  "Automatic WordPress updates, with a backup taken first",
                  "A firewall and malware scanning in front of the store",
                ]}
              />
            </div>
          </div>

          {/* Managed WooCommerce */}
          <div className="grid items-center gap-14 [&>*]:min-w-0 lg:grid-cols-2 lg:gap-20">
            <div className="max-w-[520px] lg:order-1">
              <h2 className="display-lg text-white">Managed WooCommerce hosting</h2>
              <p className="mt-5 text-body text-fg-on-dark-secondary">
                Physical goods, digital downloads or services: WooCommerce handles the store, we
                handle the server under it.
              </p>
              <p className="mt-4 text-body text-fg-on-dark-secondary">
                Add the payment and shipping options WooCommerce supports, and keep everything
                in the one WordPress dashboard you already know.
              </p>
            </div>
            <div aria-hidden="true" className="relative mx-auto h-[340px] w-full max-w-[480px] lg:order-2">
              <div className="absolute top-0 left-0 w-52 rounded-2xl bg-white p-3 shadow-e5">
                {[["Pay by card · •••• 4242", "bg-primary text-white"], ["PayPal", "bg-white text-fg ring-1 ring-line"], ["Apple Pay", "bg-white text-fg ring-1 ring-line"]].map(([t, c]) => (
                  <span key={t} className={`mb-2 flex h-10 items-center justify-center rounded-lg text-small font-semibold last:mb-0 ${c}`}>{t}</span>
                ))}
              </div>
              <div className="absolute top-8 right-0 w-64 rounded-2xl bg-white p-4 shadow-e5">
                <p className="flex items-center justify-between text-small font-semibold text-fg">Recent orders <span className="text-micro font-normal text-fg-muted">Today</span></p>
                <ul className="mt-3 space-y-2.5">
                  {[
                    ["sofa", "#1043 · Velvet sofa", "$899", "Paid"],
                    ["bottle", "#1042 · Bottle ×2", "$64", "Shipped"],
                    ["serum", "#1041 · Botanical oil", "$26", "Paid"],
                  ].map(([src, t, v, st]) => (
                    <li key={t} className="flex items-center gap-2.5 text-[11px]">
                      <Photo src={src} className="size-8 rounded-md bg-canvas-secondary" />
                      <span className="min-w-0 flex-1 truncate text-fg">{t}</span>
                      <span className="font-semibold text-fg">{v}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${st === "Paid" ? "bg-success-soft text-success" : "bg-brand-50 text-primary"}`}>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute bottom-0 left-12 w-56 rounded-2xl bg-white p-4 shadow-e5">
                <p className="text-small font-semibold text-fg">Shipping</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-micro font-semibold">
                  <span className="rounded-lg bg-brand-50 px-1 py-2 text-primary">Flat · $8</span>
                  <span className="rounded-lg bg-brand-50 px-1 py-2 text-primary">Pickup</span>
                  <span className="rounded-lg bg-brand-50 px-1 py-2 text-primary">Free $75+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Migration */}
          <div id="migration" className="grid scroll-mt-14 items-center gap-14 [&>*]:min-w-0 lg:grid-cols-2 lg:gap-20">
            <div aria-hidden="true" className="relative mx-auto h-[320px] w-full max-w-[480px]">
              <div className="absolute top-1/2 right-0 left-0 h-28 -translate-y-1/2 bg-primary/35 [clip-path:polygon(0_20%,70%_20%,70%_0,100%_50%,70%_100%,70%_80%,0_80%)]" />
              <div className="absolute top-6 left-0 w-[270px] rounded-2xl bg-white p-5 shadow-e5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-white">⇄</span>
                  <span className="text-[11px] leading-tight"><span className="block text-small font-semibold text-fg">Moving fernandfold.shop</span><span className="text-fg-muted">Old host → Serverlys staging</span></span>
                </div>
                <ul className="mt-4 space-y-2.5 text-[11px]">
                  {[["Products", "1,284"], ["Orders", "3,906"], ["Customers", "862"], ["Media", "4.1 GB"]].map(([k, v]) => (
                    <li key={k} className="flex items-center justify-between">
                      <span className="text-fg-secondary">{k}</span>
                      <span className="flex items-center gap-2 font-semibold text-fg">{v}<Tick /></span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex -space-x-2">
                  {["mug", "bottle", "serum", "sofa", "watch"].map((src) => (
                    <Photo key={src} src={src} className="size-8 rounded-full ring-2 ring-white" />
                  ))}
                </div>
              </div>
              <div className="absolute right-4 bottom-4 flex w-44 flex-col items-center rounded-2xl bg-white p-5 text-center shadow-e5">
                <Tick size={9} />
                <p className="mt-3 text-small font-semibold text-fg">Migration completed</p>
                <p className="text-[11px] text-fg-muted">No downtime · DNS when you say</p>
              </div>
            </div>
            <div className="max-w-[520px]">
              <h2 id="ecom-migration-heading" className="display-lg text-white">Free online store migration</h2>
              <p className="mt-4 text-body text-fg-on-dark-secondary">Running a WooCommerce store somewhere else? We move it for you.</p>
              <Checks
                dark
                items={[
                  "Send the current host login, or just the domain",
                  "Products, orders, customers and email copied to staging first",
                  "Your store keeps selling until you approve the switch",
                ]}
              />
              <div className="mt-8">
                <CtaButton href="/migrations" tone="light">Request a migration</CtaButton>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}

