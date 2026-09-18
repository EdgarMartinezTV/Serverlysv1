import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Grid } from "../kit";

/**
 * The domain reference's hero.
 *
 * REBUILT after an earlier version got it structurally wrong — that one was a
 * white band with a small heading and a flat row of equal stat cards. The
 * reference is nothing like it. Measured at 1440:
 *
 *   band    full-bleed, 776px tall
 *   h1      56px/64, -0.28px, centred, capped at 646px
 *   search  centred pill, 52px tall, fully rounded, white
 *   below   a 3-card bento — a wide promo spanning two columns, then a stats
 *           card, then an outbound card — not three equal columns
 *
 * ONE DELIBERATE DEPARTURE: the reference's band is a deep indigo (#1e1b3a)
 * and this one is white, on request. That is not a colour swap on its own —
 * every foreground in here had to flip with it, and the third card changed
 * from a translucent white tile (invisible on white) to a light surface with
 * a hairline. The two filled cards stay filled: white on brand-600 is 8.59:1
 * and on brand-800 is 13.41:1, so they read on either ground.
 *
 * The TOOL IS A SLOT, so each page passes its own working one: the
 * availability search on /domain-name and /register-domain, the WHOIS lookup
 * on /whois-lookup.
 */
export type HeroCopy = {
  title: string;
  lede?: string;
  /** The wide promo card, spanning two of four columns. */
  promo: { title: string; body: string };
  /** The stats card — figures stacked. */
  stats: readonly { value: string; label: string }[];
  /** The third card, which links out. */
  aside: { label: string; body: string; href: string };
};

export function DomainHero({ copy, tool }: { copy: HeroCopy; tool: React.ReactNode }) {
  return (
    <section
      id="search"
      aria-labelledby="dn-hero-heading"
      className="scroll-mt-24 bg-canvas pt-16 pb-12 xl:pt-24"
    >
      <Grid>
        <h1
          id="dn-hero-heading"
          className="mx-auto max-w-[646px] text-center text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-fg lg:text-[56px] lg:leading-[64px] lg:tracking-[-0.28px]"
        >
          {copy.title}
        </h1>
        {copy.lede && (
          <p className="mx-auto mt-4 max-w-[646px] text-center text-body text-fg-secondary">
            {copy.lede}
          </p>
        )}

        {/* The tool, centred. The reference's pill is ~620px at 1440. */}
        <div className="mx-auto mt-10 w-full max-w-[720px]">{tool}</div>

        <div className="mt-12 grid gap-4 xl:grid-cols-4">
          <Card className="bg-primary xl:col-span-2">
            <span className="grid size-11 place-items-center rounded-xl bg-cyan-300 text-[20px] font-bold text-fg">
              %
            </span>
            <div className="mt-auto pt-10">
              <p className="text-[28px] leading-9 font-normal tracking-[-0.14px] text-white">
                {copy.promo.title}
              </p>
              <p className="mt-3 text-body text-fg-on-brand-muted">{copy.promo.body}</p>
            </div>
          </Card>

          <Card className="bg-brand-800">
            <div className="mt-auto flex flex-col gap-6 pt-10">
              {copy.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-[32px] leading-10 font-normal tracking-[-0.16px] text-white">
                    {s.value}
                  </p>
                  <p className="text-body text-fg-on-dark-secondary">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>

          <Link
            href={copy.aside.href}
            className="group flex min-h-[240px] flex-col rounded-2xl bg-canvas-secondary p-8 ring-1 ring-line transition-colors duration-fast hover:bg-canvas-inset"
          >
            <ArrowUpRight className="ml-auto size-6 text-fg transition-transform duration-fast group-hover:translate-x-0.5" />
            <div className="mt-auto pt-10">
              <p className="text-[24px] leading-8 font-normal tracking-[-0.12px] text-fg">
                {copy.aside.label}
              </p>
              <p className="mt-2 text-body text-fg-secondary">{copy.aside.body}</p>
            </div>
          </Link>
        </div>
      </Grid>
    </section>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-h-[240px] flex-col rounded-2xl p-8", className)}>{children}</div>
  );
}
