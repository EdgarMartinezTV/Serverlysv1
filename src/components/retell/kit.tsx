import Image from "next/image";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import { cn } from "@/lib/utils";
import { Grid } from "@/components/ref/kit";
import { Reveal } from "@/components/animations/reveal";
import { BRANDS, BrandIcon, type BrandSlug } from "./brands";
import { ChatButton } from "./chat-button";
import { FeaturesScroller, type FeatureGroup } from "./features-scroller";
import { Icon, type IconName } from "./icons";

/**
 * Service-page kit, built to the Retell AI receptionists page (2026-10-13)
 * and shared by every page rebuilt in that style (/seo,
 * /website-development). Each section is data-in, layout-fixed: a page passes
 * its own copy, photos and mockups, and the measurements stay identical
 * across pages so they read as one family.
 *
 * Section order on the reference:
 *
 *   Hero → How it works → Use cases → NavyBand → Promises → Features →
 *   ToolsMarquee → PricingPanel → Faqs → Related → PhotoCta
 *
 * WHAT THE KIT DELIBERATELY HAS NO SLOT FOR: the reference's client-logo bar,
 * customer counts, testimonial stack and compliance badges. Serverlys has
 * none of those to show yet, and scripts/check-reviews.mjs forbids
 * placeholders. Add real ones as new sections when they exist.
 *
 * Hero LCP: the photo is the largest element and loads eagerly; nothing in
 * the hero animates in (see the reveal/LCP note in globals.css).
 */

export const INK = "text-[#0b1530]";
export const MUTED = "text-[#5b6472]";
const PANEL = "bg-[#f4f4f7]";

/* The hero headline's display serif — loaded by these pages only. */
const serif = Instrument_Serif({ weight: "400", subsets: ["latin"], display: "swap" });

export function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-[13px] font-medium text-primary", className)}>{children}</p>
  );
}

export function Heading({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "mx-auto mt-4 max-w-[760px] text-center font-display text-[32px] leading-[1.15] font-normal tracking-[-0.025em] sm:text-[40px] lg:text-[46px]",
        INK,
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Wrap({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1120px] px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

export type Photo = { src: string; alt: string; position?: string };

/* ── Hero ────────────────────────────────────────────────────────────────── */

export type HeroBadge = { label: string; icon: IconName };

function ShieldBadge({ caption, label, icon }: HeroBadge & { caption: string }) {
  return (
    <li className="relative w-[86px] shrink-0">
      <svg
        viewBox="0 0 64 72"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 size-full drop-shadow-[0_6px_14px_rgb(0_0_0/0.35)]"
      >
        <path d="M4 4h56v44L32 68 4 48Z" fill="#fff" />
        <path d="M4 44 32 60l28-16v6L32 66 4 50Z" fill="var(--color-brand-600)" />
        <path d="M4 50l28 16 28-16v-2L32 64 4 48Z" fill="#34d399" />
      </svg>
      <span className="relative flex h-[96px] flex-col items-center pt-2.5 text-center">
        <span className="text-[6.5px] font-bold tracking-[0.08em] text-fg-muted uppercase">
          {caption}
        </span>
        <Icon name={icon} className="mt-0.5 size-4 text-primary" />
        <span className="mt-1 px-1 text-[9.5px] leading-[1.1] font-bold whitespace-nowrap text-fg">
          {label}
        </span>
      </span>
    </li>
  );
}

/**
 * Full-bleed, dimmed photograph of a real person at work; a very large,
 * tight serif headline top left; and a block bottom right with a caps line,
 * one paragraph, a white pill button and shield badges. Where the reference
 * shows a G2 rating and G2 awards, pages pass plain facts (a price, what is
 * included) and the badges carry a caption so they never read as awards.
 */
export function Hero({
  id,
  title,
  photo,
  photoClassName,
  kicker,
  lede,
  cta,
  badges,
  badgeCaption,
}: {
  id: string;
  title: string;
  photo: Photo;
  /** object-position utilities, e.g. "object-[58%_30%] lg:object-[40%_30%]".
      On lg+ the photo sits in the right three quarters, so it usually needs a
      different focus there. Written as literal classes so Tailwind sees them. */
  photoClassName?: string;
  kicker: readonly string[];
  lede: string;
  cta: { label: string; href: string };
  badges: readonly HeroBadge[];
  badgeCaption: string;
}) {
  return (
    <section
      aria-labelledby={id}
      className="relative isolate flex min-h-[680px] overflow-hidden bg-[#0b0d10] text-white sm:min-h-[760px] lg:min-h-[calc(100svh-72px)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 left-0 -z-20 lg:left-[24%]"
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          quality={80}
          className={cn("object-cover", photoClassName ?? "object-center")}
        />
      </div>
      {/* Desktop: the photo sits in the right three quarters and fades into the
          ground on its left edge, so the headline sets on shadow, not a face. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[24%] -z-10 hidden w-[26%] bg-[linear-gradient(90deg,#0b0d10,transparent)] lg:block"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/45" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(0_0_0/0.35)_0%,transparent_32%,transparent_55%,rgb(0_0_0/0.55)_100%),linear-gradient(90deg,rgb(0_0_0/0.35)_0%,transparent_55%)]"
      />

      <Grid className="flex flex-col justify-between gap-16 pt-16 pb-14 sm:pt-20 lg:pt-24 lg:pb-20">
        <h1
          id={id}
          className={cn(
            serif.className,
            "max-w-[11ch] text-[56px] leading-[0.98] font-normal tracking-[-0.035em] text-white sm:text-[80px] lg:max-w-[980px] lg:text-[96px] xl:text-[110px]",
          )}
        >
          {title}
        </h1>

        <div className="max-w-[560px] lg:ml-[50%] lg:max-w-[600px]">
          <p className="flex flex-wrap items-center gap-2 text-small font-medium tracking-[0.02em] text-white/90 uppercase">
            {kicker.map((k, i) => (
              <span key={k} className="contents">
                {i > 0 && (
                  <span aria-hidden="true" className="text-white/50">
                    ·
                  </span>
                )}
                {k}
              </span>
            ))}
          </p>
          <p className="mt-4 text-[19px] leading-[1.45] text-white/95 lg:text-[21px]">
            {lede}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-5">
            <a
              href={cta.href}
              className="inline-flex h-[54px] items-center justify-center rounded-full bg-white px-8 text-body font-semibold text-[#0b0d10] transition-colors duration-fast hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {cta.label}
            </a>
            <ul className="flex flex-wrap gap-2" aria-label={badgeCaption}>
              {badges.map((b) => (
                <ShieldBadge key={b.label} {...b} caption={badgeCaption} />
              ))}
            </ul>
          </div>
        </div>
      </Grid>
    </section>
  );
}

/* ── How it works ────────────────────────────────────────────────────────── */

export function HowItWorks({
  id,
  label = "How it works",
  title,
  steps,
}: {
  id: string;
  label?: string;
  title: string;
  steps: readonly { title: string; body: string }[];
}) {
  return (
    <section aria-labelledby={id} className="bg-white py-20 lg:py-28">
      <Wrap>
        <Label className="text-center">{label}</Label>
        <Heading
          id={id}
          className="max-w-[560px] text-[24px] sm:text-[28px] lg:text-[30px]"
        >
          {title}
        </Heading>
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={i * 80}
              className={cn(
                "flex min-h-[300px] flex-col justify-between rounded-2xl p-6 lg:min-h-[400px]",
                PANEL,
              )}
            >
              <h3
                className={cn(
                  "text-[24px] leading-[1.2] font-normal tracking-[-0.02em]",
                  INK,
                )}
              >
                {s.title}
              </h3>
              <p className={cn("mt-10 text-[14px] leading-[1.6]", MUTED)}>{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </Wrap>
    </section>
  );
}

/* ── Use cases: alternating photo rows ───────────────────────────────────── */

export function UseCases({
  id,
  label,
  title,
  items,
}: {
  id: string;
  label: string;
  title: string;
  items: readonly ({ title: string; body: string } & Photo)[];
}) {
  return (
    <section aria-labelledby={id} className="bg-white pb-20 lg:pb-28">
      <Wrap>
        <Label className="text-center">{label}</Label>
        <Heading id={id}>{title}</Heading>
        <div className="mt-14 flex flex-col gap-14 lg:mt-20 lg:gap-20">
          {items.map((u, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal
                key={u.title}
                className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <div
                  className={cn(
                    "relative aspect-[3/2] overflow-hidden rounded-xl",
                    flip && "lg:order-2",
                  )}
                >
                  <Image
                    src={u.src}
                    alt={u.alt}
                    fill
                    sizes="(min-width: 1024px) 540px, 100vw"
                    className="object-cover"
                    style={{ objectPosition: u.position ?? "center" }}
                  />
                </div>
                <div className={cn("lg:pt-2", flip && "lg:order-1")}>
                  <h3
                    className={cn(
                      "max-w-[420px] text-[28px] leading-[1.18] font-normal tracking-[-0.02em] lg:text-[32px]",
                      INK,
                    )}
                  >
                    {u.title}
                  </h3>
                  <hr className="my-7 border-black/[0.08] lg:my-9" />
                  <p className={cn("text-[15px] leading-[1.65]", MUTED)}>{u.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}

/* ── Navy band ───────────────────────────────────────────────────────────── */

/** `aside` is plain text; wrap phrases in [brackets] to set them in amber. */
function Amber({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        part.startsWith("[") ? (
          <span key={i} className="text-[#f5a524]">
            {part.slice(1, -1)}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function NavyBand({
  id,
  kicker,
  title,
  body,
  aside,
  cta,
}: {
  id: string;
  kicker: string;
  title: string;
  body: string;
  aside: string;
  cta: { label: string; href: string };
}) {
  return (
    <section aria-labelledby={id} className="px-2">
      <div className="rounded-[20px] bg-[#0b1530] py-16 text-white lg:py-20">
        <Wrap className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="text-[13px] font-medium text-[#f5a524]">{kicker}</p>
            <h2
              id={id}
              className="mt-5 max-w-[560px] font-display text-[32px] leading-[1.15] font-normal tracking-[-0.025em] text-white lg:text-[40px]"
            >
              {title}
            </h2>
            <p className="mt-8 max-w-[520px] text-[16px] leading-[1.6] text-white/80">
              {body}
            </p>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-[300px] text-[15px] leading-[1.55] text-white/85">
              <Amber text={aside} />
            </p>
            <a
              href={cta.href}
              className="mt-6 inline-flex h-10 items-center rounded-md bg-white px-5 text-[14px] font-semibold text-[#0b1530] transition-colors hover:bg-white/85"
            >
              {cta.label}
            </a>
          </div>
        </Wrap>
      </div>
    </section>
  );
}

/* ── Promises: the reference's compliance cards ──────────────────────────── */

export function Promises({
  id,
  label = "Our commitments",
  intro,
  items,
}: {
  id: string;
  label?: string;
  intro: string;
  items: readonly { title: string; body: string }[];
}) {
  return (
    <section aria-labelledby={id} className="bg-white py-20 lg:py-28">
      <Wrap>
        <Label className="text-center">{label}</Label>
        <p
          id={id}
          className={cn(
            "mx-auto mt-6 max-w-[880px] text-center text-[18px] leading-snug lg:text-[20px]",
            INK,
          )}
        >
          {intro}
        </p>
        <ul
          className={cn(
            "mt-12 grid gap-3",
            items.length % 3 === 0 ? "lg:grid-cols-3" : "sm:grid-cols-2",
          )}
        >
          {items.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={(i % 3) * 80}
              className={cn(
                "flex min-h-[260px] flex-col justify-between rounded-2xl p-6 lg:min-h-[300px]",
                PANEL,
              )}
            >
              <h3
                className={cn(
                  "text-[24px] leading-[1.2] font-normal tracking-[-0.02em]",
                  INK,
                )}
              >
                {p.title}
              </h3>
              <p className="mt-10 max-w-[340px] text-[15px] leading-[1.6] text-[#2b3442]">
                {p.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* ── Features: pinned tabs + visual, scrolling feature groups ────────────── */

export function Features({
  id,
  label = "Features",
  title,
  groups,
  tabPrefix,
}: {
  id: string;
  label?: string;
  title: string;
  groups: readonly FeatureGroup[];
  /** Prefix for the mobile group pill, e.g. "SEO" → "SEO Starter". */
  tabPrefix?: string;
}) {
  return (
    <section aria-labelledby={id} className="bg-white pb-20 lg:pb-16">
      <Wrap>
        <Label className="text-center">{label}</Label>
        <Heading id={id}>{title}</Heading>
        <div className="mt-14 lg:mt-12">
          <FeaturesScroller groups={groups} tabPrefix={tabPrefix} />
        </div>
      </Wrap>
    </section>
  );
}

/* ── Tools marquee: the reference's integrations ─────────────────────────── */

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: readonly BrandSlug[];
  reverse?: boolean;
}) {
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <ul
        className={cn(
          "seo-ticker flex w-max gap-4",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {[0, 1].flatMap((copy) =>
          items.map((t, i) => (
            <li
              key={`${copy}-${i}-${t}`}
              className="flex shrink-0 items-center gap-3 px-7 py-2 text-[16px] font-medium whitespace-nowrap text-[#374151]"
            >
              <BrandIcon slug={t} className="size-7 shrink-0" />
              {BRANDS[t].label}
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

export function ToolsMarquee({
  id,
  label = "Platforms",
  title,
  cta,
  rows,
}: {
  id: string;
  label?: string;
  title: string;
  cta: { label: string; href: string };
  rows: readonly [readonly BrandSlug[], readonly BrandSlug[]];
}) {
  return (
    <section aria-labelledby={id} className="bg-white pb-20 lg:pb-28">
      <Wrap>
        <Label className="text-center">{label}</Label>
        <Heading id={id} className="max-w-[560px]">
          {title}
        </Heading>
        <div className="mt-8 flex justify-center">
          <a
            href={cta.href}
            className="inline-flex h-10 items-center rounded-md bg-[#0b1530] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#1b2750]"
          >
            {cta.label}
          </a>
        </div>
      </Wrap>
      {/* The names are also in plain text elsewhere on each page; the moving
          copy is decoration and doubled for the loop. */}
      <div aria-hidden="true" className="mt-14 flex flex-col gap-4">
        <MarqueeRow items={rows[0]} />
        <MarqueeRow items={rows[1]} reverse />
      </div>
    </section>
  );
}

/* ── Pricing panel ───────────────────────────────────────────────────────── */

export function Tick({ onBlue }: { onBlue?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 size-[18px] shrink-0">
      <circle cx="10" cy="10" r="9" fill={onBlue ? "#fff" : "#0b1530"} />
      <path
        d="m6 10.2 2.6 2.6L14 7.4"
        fill="none"
        stroke={onBlue ? "var(--color-primary)" : "#fff"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** One card in the grey pricing panel. `blue` is the reference's highlighted tier. */
export function PanelCard({
  blue = false,
  icon,
  name,
  badge,
  summary,
  price,
  cta,
  listTitle,
  list,
  delay = 0,
  children,
}: {
  blue?: boolean;
  icon: IconName;
  name: string;
  badge?: string;
  summary: string;
  /** Rendered under the summary — a price line, or a rate table. */
  price: React.ReactNode;
  cta: { label: string; href: string };
  listTitle?: string;
  list?: readonly string[];
  delay?: number;
  children?: React.ReactNode;
}) {
  return (
    <Reveal
      as="article"
      delay={delay}
      className={cn(
        "flex flex-col rounded-[18px] p-7",
        blue ? "bg-primary text-white" : "bg-transparent",
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
        <Icon name={icon} className="size-5" />
      </span>
      <h3
        className={cn(
          "mt-7 flex flex-wrap items-center gap-2 text-[22px] font-semibold tracking-[-0.01em]",
          blue ? "text-white" : INK,
        )}
      >
        {name}
        {badge && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">
            {badge}
          </span>
        )}
      </h3>
      <p
        className={cn(
          "mt-2 min-h-12 text-[14px] leading-[1.55]",
          blue ? "text-white/80" : MUTED,
        )}
      >
        {summary}
      </p>
      <div className="mt-6">{price}</div>
      <a
        href={cta.href}
        className={cn(
          "mt-6 flex h-11 items-center justify-center rounded-md text-[14px] font-semibold transition-colors",
          blue
            ? "bg-white text-[#0b1530] hover:bg-white/90"
            : "bg-white text-[#0b1530] ring-1 ring-black/[0.08] hover:bg-[#f7f7f8]",
        )}
      >
        {cta.label}
      </a>
      {list && (
        <>
          {listTitle && (
            <p
              className={cn(
                "mt-7 text-[13px] font-semibold",
                blue ? "text-white" : INK,
              )}
            >
              {listTitle}
            </p>
          )}
          <ul className="mt-4 flex flex-col gap-3.5">
            {list.map((f) => (
              <li
                key={f}
                className={cn(
                  "flex gap-3 text-[14px] leading-[1.5]",
                  blue ? "text-white" : "text-[#2b3442]",
                )}
              >
                <Tick onBlue={blue} />
                {f}
              </li>
            ))}
          </ul>
        </>
      )}
      {children}
    </Reveal>
  );
}

export function PricingPanel({
  id,
  label = "Pricing",
  title,
  columns = 3,
  footnote,
  children,
}: {
  id: string;
  label?: string;
  title: string;
  columns?: 2 | 3 | 4;
  footnote?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id="plans"
      aria-labelledby={id}
      className="scroll-mt-20 bg-[#f7f7f8] py-20 lg:py-28"
    >
      <Wrap>
        <Label className="text-center">{label}</Label>
        <Heading id={id}>{title}</Heading>
        <div
          className={cn(
            "mt-14 grid gap-3 rounded-[24px] bg-[#ececef] p-3",
            columns === 3 && "lg:grid-cols-3",
            columns === 2 && "mx-auto max-w-[900px] md:grid-cols-2",
            columns === 4 && "md:grid-cols-2 xl:-mx-24 xl:grid-cols-4",
          )}
        >
          {children}
        </div>
        {footnote && (
          <p className={cn("mt-8 text-center text-[14px]", MUTED)}>{footnote}</p>
        )}
      </Wrap>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────────────────── */

export function Faqs({
  id,
  items,
  label = "FAQ",
  title = "Frequently asked questions.",
}: {
  id: string;
  items: readonly { question: string; answer: string }[];
  /** Overridable for the Spanish restaurant pages; defaults unchanged. */
  label?: string;
  title?: string;
}) {
  return (
    <section aria-labelledby={id} className="bg-[#f7f7f8] pb-20 lg:pb-28">
      <Wrap>
        <Label className="text-center">{label}</Label>
        <Heading id={id}>{title}</Heading>
        <div className="mt-14 border-t border-black/[0.08]">
          {items.map((f) => (
            <details key={f.question} className="group border-b border-black/[0.08]">
              <summary
                className={cn(
                  "flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[18px] leading-snug font-normal tracking-[-0.01em] sm:text-[20px] [&::-webkit-details-marker]:hidden",
                  INK,
                )}
              >
                {f.question}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eceef2] transition-colors group-open:bg-primary group-open:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 group-open:rotate-45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className={cn("max-w-[820px] pb-7 text-[15px] leading-[1.7]", MUTED)}>
                {f.answer}
              </p>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

/* ── Related solutions ───────────────────────────────────────────────────── */

export function Related({
  id,
  items,
  label = "Related solutions",
}: {
  id: string;
  items: readonly (readonly [string, string])[];
  label?: string;
}) {
  return (
    <section aria-labelledby={id} className="bg-white py-14">
      <Wrap>
        <Label className="text-center">
          <span id={id}>{label}</span>
        </Label>
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {items.map(([label, href]) => (
            <li key={href}>
              <Link
                href={href}
                className="inline-flex rounded-md bg-[#f1f2f5] px-3.5 py-2 text-[14px] font-medium text-[#0b1530] transition-colors hover:bg-brand-50 hover:text-primary"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* ── Full-bleed photo CTA ────────────────────────────────────────────────── */

export function PhotoCta({
  id,
  photo,
  thumb,
  title,
  body,
  primary,
}: {
  id: string;
  photo: Photo;
  thumb: string;
  title: string;
  body: string;
  primary: { label: string; href: string };
}) {
  return (
    <section aria-labelledby={id} className="bg-white px-2 pb-2">
      <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden rounded-[20px] px-5 py-16 lg:min-h-[640px]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: photo.position ?? "center" }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/10" />
        <div className="relative flex min-h-[340px] w-full max-w-[360px] flex-col justify-between bg-[#f7f7f9] p-5 shadow-[0_20px_60px_-10px_rgb(0_0_0/0.35)]">
          <div className="flex items-start justify-between gap-4">
            <h2
              id={id}
              className={cn(
                "text-[22px] leading-[1.2] font-normal tracking-[-0.02em]",
                INK,
              )}
            >
              {title}
            </h2>
            <div className="relative size-[76px] shrink-0 overflow-hidden rounded-md">
              <Image src={thumb} alt="" fill sizes="80px" className="object-cover" />
            </div>
          </div>
          <div>
            <p className={cn("text-[14px] leading-snug", INK)}>{body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={primary.href}
                className="inline-flex h-9 items-center rounded-[4px] bg-[#0b1530] px-3.5 text-[13px] font-semibold text-white hover:bg-[#1b2750]"
              >
                {primary.label}
              </a>
              <ChatButton size="sm">Ask Sera</ChatButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
