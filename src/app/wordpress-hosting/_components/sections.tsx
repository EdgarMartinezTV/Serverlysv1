import Link from "next/link";
import { Check, CtaButton, Grid, Headline } from "@/components/ref/kit";
import { SeraMark } from "@/components/sera/sera-mark";
import { ConvoAiLogo } from "@/components/layout/convoai-logo";
import { MockPhoto } from "@/components/ui/mock-photo";

/*
 * WordPress page sections — 2026-10-03, in the reference's order and layout.
 *
 * ⚠ EVERY CLAIM IS ONE THE PRODUCT MAKES ELSEWHERE. The reference's "first AI
 * agent for WordPress", "AI troubleshooter fixes 70% of issues" and "AI email
 * marketing" describe products Serverlys does not have. Their slots carry the
 * real equivalents: ConvoAI on the site, one-click install / safe updates /
 * LiteSpeed, and free migration.
 */

/* ── Shared bits ──────────────────────────────────────────────────────────── */

function Tick() {
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success-fill text-white">
      <svg viewBox="0 0 16 16" fill="none" className="size-3">
        <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Accordion({ items, open = 0, dark = false }: { items: readonly { title: string; body: string }[]; open?: number; dark?: boolean }) {
  return (
    <div className={dark ? "border-t border-white/15" : "border-t border-line"}>
      {items.map((it, i) => (
        <details key={it.title} name={`acc-${items[0].title}`} open={i === open} className={`group ${dark ? "border-b border-white/15" : "border-b border-line"}`}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
            <span className={`text-body-lg ${dark ? "text-white" : "text-fg"}`}>{it.title}</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" className={`size-4 shrink-0 ${dark ? "text-white" : "text-fg"}`}>
              <path d="M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M8 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="group-open:hidden" />
            </svg>
          </summary>
          <p className={`max-w-[560px] pb-5 text-small ${dark ? "text-fg-on-dark-secondary" : "text-fg-secondary"}`}>{it.body}</p>
        </details>
      ))}
    </div>
  );
}

/* ── 1. ConvoAI on the site ───────────────────────────────────────────────── */

export function Answering() {
  return (
    <section id="agent" aria-labelledby="wp-agent-heading" className="scroll-mt-14 bg-canvas py-16 lg:py-24">
      <Grid>
        <Headline
          id="wp-agent-heading"
          title="Your WordPress site, answering visitors around the clock"
          description="ConvoAI is trained on your own pages and answers your visitors day and night. Free with every plan."
          className="mb-10 xl:mb-12"
        />
        <div className="grid overflow-hidden rounded-3xl bg-brand-50 lg:grid-cols-[1.15fr_1fr]">
          <div aria-hidden="true" className="relative min-h-[340px] overflow-hidden bg-gradient-to-br from-brand-300 via-brand-500 to-brand-700 p-6 sm:p-10">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-white/10 [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%)]" />
            <div className="relative overflow-hidden rounded-xl bg-white shadow-e5">
              <div className="flex items-center gap-1.5 border-b border-line-subtle px-3 py-2">
                <span className="size-2 rounded-full bg-ink-200" />
                <span className="size-2 rounded-full bg-ink-200" />
                <span className="size-2 rounded-full bg-ink-200" />
                <span className="ml-3 rounded bg-canvas-secondary px-2 py-0.5 text-[10px] text-fg-secondary">hearthbakery.com</span>
              </div>
              <div className="grid grid-cols-[1fr_200px]">
                <div className="space-y-2.5 p-4">
                  <p className="text-small font-semibold text-fg">Hearth Bakery</p>
                  <MockPhoto src="bread" className="h-24 rounded-lg" sizes="300px" />
                  <p className="text-[11px] font-semibold text-fg">This weekend</p>
                  <ul className="space-y-1 text-[11px] text-fg-secondary">
                    <li className="flex justify-between"><span>Country sourdough</span><span>$8</span></li>
                    <li className="flex justify-between"><span>Seeded rye</span><span>$7</span></li>
                    <li className="flex justify-between"><span>Gluten-free loaf</span><span>$9</span></li>
                  </ul>
                </div>
                <div className="flex flex-col gap-2 border-l border-line-subtle bg-canvas-secondary p-3">
                  <p className="text-micro font-semibold text-fg">Chat</p>
                  <p className="ml-auto rounded-xl rounded-br-sm bg-primary px-2.5 py-1.5 text-[11px] text-white">Do you make gluten-free bread?</p>
                  <p className="rounded-xl rounded-bl-sm bg-white px-2.5 py-1.5 text-[11px] text-fg shadow-e1">Yes, a gluten-free loaf every Friday and Saturday. Want me to reserve one?</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <ConvoAiLogo tone="light" className="h-7 w-auto self-start" />
            <h3 className="mt-6 text-h3 font-medium tracking-[-0.02em] text-fg">A chat agent that knows your site</h3>
            <p className="mt-3 text-body text-fg-secondary">
              It answers about your prices, your hours and your products from your own pages,
              captures the enquiry, and hands anything it should not attempt to a person.
            </p>
            <Link href="https://convoai.cloud/" className="mt-6 inline-flex items-center gap-1.5 text-body font-semibold text-primary hover:text-primary-hover">
              See how ConvoAI works
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            ["Answers at 2am", "Hours, prices and stock answered the moment someone asks, not the next morning."],
            ["WooCommerce aware", "It knows what your store sells and can point a buyer at the right product."],
            ["Free with your plan", "Included with every WordPress plan at no extra cost."],
          ].map(([t, b]) => (
            <li key={t}>
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-50 text-primary">
                <SeraMark className="size-4" />
              </span>
              <h3 className="mt-4 text-body-lg font-medium text-fg">{t}</h3>
              <p className="mt-1.5 text-small text-fg-secondary">{b}</p>
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  );
}

/* ── 2. Save hours managing WordPress ─────────────────────────────────────── */

export function SaveHours() {
  return (
    <section aria-labelledby="wp-hours-heading" className="bg-canvas py-16 lg:py-24">
      <Grid>
        <Headline id="wp-hours-heading" title="Save hours managing WordPress" className="mb-10 xl:mb-12" />
        <ul className="grid gap-6 md:grid-cols-3">
          <li>
            <div aria-hidden="true" className="relative h-80 overflow-hidden rounded-2xl bg-brand-100">
              <div className="absolute top-0 right-0 h-32 w-2/3 bg-brand-300 [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]" />
              <div className="absolute top-10 right-8 left-0 rounded-r-xl bg-white p-5 shadow-e4">
                <p className="text-small font-semibold text-fg">Install WordPress</p>
                <div className="mt-4 space-y-2.5 text-small">
                  {["Site title: Hearth Bakery", "Admin email set", "LiteSpeed Cache on"].map((s) => (
                    <p key={s} className="flex items-center gap-2 text-fg-secondary"><Tick />{s}</p>
                  ))}
                </div>
                <span className="mt-5 flex h-9 items-center justify-center rounded-md bg-primary text-small font-semibold text-white">Install</span>
              </div>
            </div>
            <h3 className="mt-5 text-body-lg font-medium text-fg">One-click WordPress</h3>
            <p className="mt-1.5 text-small text-fg-secondary">WordPress installed and pre-tuned for LiteSpeed in a click, ready for Elementor, the block editor or WooCommerce.</p>
          </li>
          <li>
            <div aria-hidden="true" className="relative h-80 overflow-hidden rounded-2xl bg-[#f0f0f1]">
              <div className="flex items-center gap-2 bg-[#1d2327] px-4 py-2 text-[10px] text-white/80">
                <span className="inline-flex size-4 items-center justify-center rounded-full border border-white text-[8px] font-bold text-white">W</span>
                Hearth Bakery · Updates
              </div>
              <div className="p-4">
                <p className="text-small font-semibold text-fg">WordPress Updates</p>
                <ul className="mt-3 divide-y divide-line-subtle rounded-lg bg-white text-[11px] shadow-e1">
                  {[
                    ["WordPress core", "6.7.2 → 6.8", true],
                    ["WooCommerce", "9.4 → 9.5", true],
                    ["Yoast SEO", "24.1 → 24.2", true],
                    ["Contact Form 7", "6.0.1 → 6.0.2", false],
                  ].map(([name, v, done]) => (
                    <li key={name as string} className="flex items-center justify-between px-3 py-2.5">
                      <span><span className="block font-medium text-fg">{name}</span><span className="text-fg-muted">{v}</span></span>
                      {done ? <Tick /> : <span className="text-[10px] font-semibold text-primary">Queued</span>}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-e4">
                <span className="inline-flex size-9 items-center justify-center rounded-full ring-[3px] ring-success-fill text-success">
                  <svg viewBox="0 0 16 16" fill="none" className="size-4"><path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span className="text-[11px]"><span className="block text-small font-semibold text-fg">Backup taken first</span><span className="text-fg-muted">Today, 3:02 AM · restore anytime</span></span>
              </div>
            </div>
            <h3 className="mt-5 text-body-lg font-medium text-fg">Updates without the risk</h3>
            <p className="mt-1.5 text-small text-fg-secondary">Core and security updates applied automatically, with a backup taken before each one. You keep the switch.</p>
          </li>
          <li>
            <div aria-hidden="true" className="relative h-80 overflow-hidden rounded-2xl bg-brand-100">
              <div className="absolute top-6 right-0 left-10 h-full overflow-hidden rounded-tl-2xl">
                <div className="absolute inset-0"><MockPhoto src="coffee" className="h-full" sizes="320px" /></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
                <p className="relative p-5 text-right text-[10px] font-semibold tracking-[0.18em] text-white">MENU · VISIT</p>
              </div>
              <div className="absolute bottom-10 left-6 w-36 rounded-2xl bg-white/95 p-4 text-center shadow-e4">
                <p className="text-micro text-fg">PageSpeed</p>
                <p className="mt-1 text-[34px] leading-none font-semibold text-success">99</p>
              </div>
            </div>
            <h3 className="mt-5 text-body-lg font-medium text-fg">LiteSpeed, already tuned</h3>
            <p className="mt-1.5 text-small text-fg-secondary">Server-level LiteSpeed caching on every plan, so pages stay fast without a stack of cache plugins.</p>
          </li>
        </ul>
        <div className="mt-10 flex justify-center">
          <CtaButton href="#plans">Get started</CtaButton>
        </div>
      </Grid>
    </section>
  );
}

/* ── 3. Performance ───────────────────────────────────────────────────────── */

export function Speed() {
  return (
    <section id="performance" aria-labelledby="wp-speed-heading" className="scroll-mt-14 bg-canvas-secondary py-16 lg:py-24">
      <Grid>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-micro font-semibold text-primary ring-1 ring-brand-100">
              Managed hosting for WordPress
            </span>
            <h2 id="wp-speed-heading" className="display-lg mt-5 text-fg">
              Fast pages and uptime you can trust
            </h2>
          </div>
          <Accordion
            items={[
              { title: "Quicker load times", body: "NVMe storage and LiteSpeed servers with caching built in. Pages are served from cache before PHP is even asked." },
              { title: "No lost visitors at the peak", body: "Unmetered bandwidth and room to move up a tier in a few clicks when traffic grows." },
              { title: "Search engines notice", body: "Fast pages and free SSL are part of what search engines reward, from day one." },
              { title: "More orders from the same traffic", body: "A store that loads quickly loses fewer buyers between the product page and checkout." },
            ]}
          />
        </div>
      </Grid>
    </section>
  );
}

/* ── 4. Protection (dark) ─────────────────────────────────────────────────── */

export function Protection() {
  const items = [
    ["Malware scanning", "The file system is scanned on a schedule, and anything harmful is flagged before it spreads.", "M12 3 5 6v5c0 4.4 3 7.9 7 10 4-2.1 7-5.6 7-10V6l-7-3Z M9 12l2 2 4-4.5"],
    ["Firewall in front", "Traffic is filtered before it reaches WordPress, so attacks stop at the edge.", "M4 5h16v14H4z M4 10h16M4 15h16M10 5v5M14 10v5M8 15v4"],
    ["Free SSL, always renewed", "Certificates issued and renewed automatically, so the padlock never lapses.", "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z M12 15v2"],
    ["Daily backups you control", "A snapshot every day. Restore the whole site or one file yourself, no ticket.", "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5 M12 8v4l3 2"],
  ] as const;
  return (
    <section id="features" aria-labelledby="wp-protect-heading" className="relative isolate scroll-mt-14 overflow-hidden bg-canvas-abyss py-20 lg:py-28">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgb(0_0_255/0.35),transparent_70%)]" />
      <Grid>
        <Headline id="wp-protect-heading" tone="dark" title="Maximum website protection" description="Always-on protection on every plan, with no setup on your part." className="mb-10 xl:mb-12" />
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map(([t, b, d]) => (
            <li key={t} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5"><path d={d} /></svg>
              </span>
              <h3 className="mt-5 text-body-lg font-medium text-white">{t}</h3>
              <p className="mt-1.5 text-small text-fg-on-dark-secondary">{b}</p>
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  );
}

/* ── 5. Hands-off hosting ─────────────────────────────────────────────────── */

export function HandsOff() {
  return (
    <section aria-labelledby="wp-hands-heading" className="bg-canvas py-16 lg:py-24">
      <Grid>
        <Headline id="wp-hands-heading" title="Hands-off hosting for WordPress" description="The parts of running WordPress that eat an afternoon, handled by the platform." className="mb-10 xl:mb-14" />
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Accordion
            items={[
              { title: "Safely test before you publish", body: "Clone the live site to staging in one click, try the change there, and push it back when it holds." },
              { title: "Stay secure without lifting a finger", body: "Malware scanning, a firewall and free SSL run on every plan by default." },
              { title: "Never lose your data", body: "Daily backups with self-service restore, for the whole site or a single file." },
              { title: "Full control when you want it", body: "cPanel, file access and one-click installs are all included, for when you want to do it yourself." },
            ]}
          />
          <div aria-hidden="true" className="relative isolate overflow-hidden rounded-3xl p-6 sm:p-8">
            <div className="absolute inset-0 -z-10"><MockPhoto src="restaurant" className="h-full" sizes="600px" /></div>
            <div className="absolute inset-0 -z-10 bg-black/45" />
            <div className="flex items-center justify-between">
              <span className="text-body-lg font-semibold text-white">Ember</span>
              <span className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-small font-semibold text-fg shadow-e3">
                Your website is safe <Tick />
              </span>
              <span className="text-white/80">☰</span>
            </div>
            <p className="mt-20 text-center text-[44px] leading-none font-semibold tracking-[-0.03em] text-white/95 sm:text-[56px]">Ember kitchen</p>
            <p className="mt-3 text-center text-small text-white/80 underline">Book a table</p>
            <div className="mx-auto mt-14 flex w-56 flex-col gap-2.5">
              {["LiteSpeed cache", "Daily backup"].map((t) => (
                <span key={t} className="flex items-center justify-between rounded-xl bg-white/90 px-4 py-2.5 text-small font-semibold text-fg">
                  {t}
                  <span className="inline-flex h-5 w-9 items-center rounded-full bg-primary p-0.5"><span className="ml-auto size-4 rounded-full bg-white" /></span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}

/* ── 6. Migration ──────────────────────────────────────────────────── */

export function FreeMigration() {
  return (
    <section aria-labelledby="wp-move-heading" className="relative isolate overflow-hidden bg-canvas-secondary py-20 lg:py-28">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_20%_60%,rgb(0_0_255/0.08),transparent_70%)]" />
      <Grid>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div aria-hidden="true" className="relative mx-auto w-full max-w-[520px]">
            <div className="overflow-hidden rounded-2xl bg-white shadow-e5">
              <div className="flex items-center justify-between px-4 py-3 text-micro">
                <span className="font-semibold tracking-[0.18em] text-fg">HEARTH</span>
                <span className="text-fg-muted">Shop · About · Cart</span>
              </div>
              <MockPhoto src="bread" className="h-44" sizes="520px" />
            </div>
            <div className="absolute -bottom-8 left-6 w-64 rounded-2xl bg-white p-4 shadow-e5 ring-1 ring-brand-100">
              <p className="text-small font-semibold text-fg">Migration in progress</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-100"><span className="block h-full w-2/3 rounded-full bg-primary" /></div>
              <div className="mt-3 space-y-2 text-small">
                {[["Posts and pages", true], ["Plugins and theme", true], ["Database", false]].map(([t, d]) => (
                  <p key={t as string} className="flex items-center justify-between text-fg-secondary">{t}{d ? <Tick /> : <span className="size-5 rounded-full border-2 border-brand-200 [border-top-color:var(--color-primary)]" />}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="max-w-[500px] pt-8 lg:pt-0">
            <h2 id="wp-move-heading" className="display-lg text-fg">Fast, free, unlimited migrations</h2>
            <p className="mt-5 text-body text-fg-secondary">
              Already on WordPress somewhere else? Our team moves it for you, to staging first,
              so nothing changes until you have checked it.
            </p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {["No cap on how many sites", "Tested on staging before DNS changes", "Your old host keeps serving until the switch"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-body text-fg">
                  <Check className="size-4 shrink-0 text-success-fill" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <CtaButton href="/migrations">Migrate your site</CtaButton>
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}
