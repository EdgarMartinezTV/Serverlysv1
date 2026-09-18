import { cn } from "@/lib/utils";
import { billing } from "@/data/company";
import { Band, Grid, Heading, Lede, Body, CtaButton } from "./kit";
import {
  HeroArt,
  WaysArt,
  ChatArt,
  WayIconArt,
  QuoteMark,
  Check,
  ChatIcon,
  CalendarIcon,
  ManagerArt,
  ProcessArt,
  CodeArt,
  ExpertIcon,
} from "./visuals";
import { HERO, EXPERT, WAYS, PLANS, TACKLE, REVIEWS, COMMITMENTS, CHAT } from "../_content";

/**
 * The reference's nine bands, in its order and at its measurements.
 * Section heights at 1440px, for checking a rebuild against the original:
 * 647 · 1740 · 1278 · 763 · 396 · 752 · 744 · 790.
 */

/* ── 1. Hero — black, 96px vertical padding ──────────────────────────────── */
export function Hero() {
  return (
    <Band tone="black" labelledBy="wd-hero" className="py-16 lg:py-24">
      <Grid className="items-center gap-y-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-8">
          {/* The reference's pill: purple on a near-black chip, uppercase and
              tracked out. Its own violet — deliberately NOT our brand ramp,
              because this page is a clone and a Serverlys blue chip here would
              be the one thing that reads as "not the reference". */}
          <span className="inline-flex rounded-full bg-[#2a0a4a] px-4 py-2 text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-[#c084fc]">
            {HERO.badge}
          </span>

          <Heading level={1} step="h1" id="wd-hero" className="mt-6">
            {HERO.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </Heading>

          {/* 672px, the full 8-column measure — their lede sets on TWO lines.
              Capping it at 34rem broke it onto three. */}
          <Lede className="mt-8 text-white/90">{HERO.lede}</Lede>

          <div className="mt-10">
            <CtaButton href={billing.sales}>{HERO.cta}</CtaButton>
          </div>
        </div>

        {/* 7 columns = 584px, their measured media width, starting at col 10. */}
        <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-10">
          <HeroArt />
        </div>
      </Grid>
    </Band>
  );
}

/* ── 2. Expert Web Developers — black ────────────────────────────────────── */
/**
 * NOT three stacked rows. Measured off the reference: a CENTRED header, then
 * three alternating pairs — text card left / media right, media left / text
 * card right, text card left / media right. Each text card is a #1a1a1a plate
 * with 32px padding and a 40px COLOURED glyph above its title, and the numbered
 * steps run blue numerals. Rebuilding it as stacked full-width rows lost ~500px
 * of the reference's height and all of its rhythm.
 */
const EXPERT_MEDIA = [ManagerArt, ProcessArt, CodeArt] as const;
const EXPERT_ICONS = ["manager", "process", "code"] as const;

export function Expert() {
  return (
    <Band tone="black" labelledBy="wd-expert" className="pb-16 lg:pb-24">
      <Grid className="gap-y-8">
        <div className="col-span-4 text-center md:col-span-8 lg:col-span-14 lg:col-start-2">
          <Heading level={2} id="wd-expert">
            {EXPERT.title}
          </Heading>
          <Lede className="mx-auto mt-8 max-w-[52rem] text-white/90">{EXPERT.lede}</Lede>
        </div>

        {EXPERT.blocks.map((block, i) => {
          const Media = EXPERT_MEDIA[i];
          /* Odd rows put the media first. On a single column the text always
             leads, so the reading order never depends on the zigzag. */
          const mediaFirst = i % 2 === 1;
          return (
            <div
              key={block.title}
              className="col-span-4 mt-6 grid grid-cols-1 gap-8 md:col-span-8 lg:col-span-16 lg:grid-cols-2 lg:gap-8"
            >
              <div
                className={cn(
                  "flex flex-col rounded-[1rem] bg-[#1a1a1a] p-8",
                  mediaFirst && "lg:order-2",
                )}
              >
                <ExpertIcon kind={EXPERT_ICONS[i]} />
                <Heading level={3} step="h3" className="mt-4">
                  {block.title}
                </Heading>
                <Body className="mt-4 text-white/80">{block.body}</Body>

                {block.steps.length > 0 && (
                  <ol className="mt-7 flex flex-col gap-5">
                    {block.steps.map((step, n) => (
                      <li key={step} className="flex gap-2">
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-[1rem] leading-[1.5] text-[#38bdf8] lg:text-[1.25rem]"
                        >
                          {n + 1}.
                        </span>
                        <Body className="text-white/80">{step}</Body>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <div className={cn(mediaFirst && "lg:order-1")}>
                <Media />
              </div>
            </div>
          );
        })}
      </Grid>
    </Band>
  );
}

/* ── 3. The Ways We Can Help — black, inside one large rounded card ──────── */
export function Ways() {
  return (
    <Band tone="black" labelledBy="wd-ways" className="pt-4 pb-16 lg:pt-8 lg:pb-24">
      <Grid>
        <div className="col-span-4 md:col-span-8 lg:col-span-16">
          {/* One #1a1a1a plate holding the whole band — the reference's own
              container, and the reason this section reads as a single object
              rather than a stack of rows. */}
          <div className="rounded-[1.5rem] bg-[#1a1a1a] p-6 sm:p-8">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <WaysArt />
              <div>
                <Heading level={2} id="wd-ways">
                  {WAYS.title}
                </Heading>
                <Lede className="mt-8 text-white/80">{WAYS.lede}</Lede>
              </div>
            </div>

            <ul className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
              {WAYS.items.map((item) => (
                <li key={item.label} className="flex flex-col gap-7">
                  <span className="text-white">
                    <WayIconArt name={item.icon} />
                  </span>
                  <h3 className="mb-4 text-[1.125rem] font-bold leading-[1.5] text-current [text-wrap:initial] lg:text-[1.5rem]">
                    {item.label}
                  </h3>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Grid>
    </Band>
  );
}

/* ── 4. Web Development Plans — white ────────────────────────────────────── */
export function Plans() {
  return (
    <Band tone="white" labelledBy="wd-plans" className="py-16">
      <Grid className="gap-y-12">
        <div className="col-span-4 text-center md:col-span-8 lg:col-span-12 lg:col-start-3">
          <Heading level={2} id="wd-plans">
            {PLANS.title}
          </Heading>
          <Lede className="mx-auto mt-8 max-w-[64rem]">{PLANS.lede}</Lede>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-12 lg:col-start-3">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {PLANS.cards.map((card) => (
              /* The reference's card edge is a faint blue-to-violet gradient
                 hairline, not a flat border. A 1px gradient wrapper around an
                 inset white panel is how you get that and still keep the corner
                 radius, which a gradient applied to the border itself cannot. */
              <div
                key={card.name}
                className="rounded-[1.5rem] bg-gradient-to-br from-[#93c5fd] via-[#c4b5fd] to-[#f0abfc] p-px"
              >
                <div className="flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-white p-8 lg:p-10">
                  <h3 className="text-[1.5rem] font-bold leading-[1.5] text-current">
                    {card.name}
                  </h3>
                  {/* min-h holds the rule at the SAME height in both cards.
                      The reference aligns them; anchoring the rule to the rows
                      instead (mt-auto) put a 1-row card's rule below a 3-row
                      card's. The shorter card keeps its empty lower half, which
                      is also what the reference does. */}
                  <p className="mt-4 min-h-[4.5rem] text-[1rem] font-medium leading-[1.5] [text-wrap:initial]">
                    {card.body}
                  </p>

                  <hr className="mt-10 border-t border-black/10" />

                  {/* The rate ladder, back to the reference's row shape:
                      label, bold price, unit, then the green discount pill.
                      Figures are Serverlys' own — confirmed by Edgar. */}
                  <ul className="mt-7 flex flex-col gap-4">
                    {card.rows.map((row) => (
                      <li key={row.label + row.price} className="flex items-center gap-3">
                        <Check />
                        <span className="text-[1rem] leading-[1.5]">
                          {row.label} <strong className="font-bold">{row.price}</strong>
                          {row.unit}
                        </span>
                        {row.off && (
                          <span className="rounded-full bg-[#b9f5e1] px-3 py-1 text-[0.9375rem] font-medium leading-none text-black">
                            {row.off} OFF
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-[1rem] leading-[1.5]">{PLANS.footnote}</p>
        </div>
      </Grid>
    </Band>
  );
}

/* ── 5. What can we tackle for you? — the blue band ──────────────────────── */
export function Tackle() {
  return (
    <Band tone="blue" labelledBy="wd-tackle" className="py-16">
      <Grid>
        <div className="col-span-4 text-center md:col-span-8 lg:col-span-12 lg:col-start-3">
          <Heading level={2} id="wd-tackle">
            {TACKLE.title}
          </Heading>
          <Lede className="mx-auto mt-8 max-w-[44rem]">{TACKLE.lede}</Lede>
          <div className="mt-10">
            <CtaButton href={billing.sales} tone="white">
              {TACKLE.cta}
            </CtaButton>
          </div>
        </div>
      </Grid>
    </Band>
  );
}

/* ── 6. Testimonials — NOT CURRENTLY MOUNTED ─────────────────────────────── */
/**
 * Kept deliberately, not dead code: `<Commitments />` stands in this slot until
 * Serverlys has real reviews, and this is what gets swapped back in. The card
 * metrics here are the reference's measured ones (410×464, 48px padding), so
 * real quotes drop in with no redesign. `npm run check:reviews` gates it.
 */
export function Reviews() {
  return (
    <Band tone="white" labelledBy="wd-reviews" className="py-16">
      <Grid className="gap-y-12">
        {/* Left-aligned across all 16 (measured x=32, w=1376) — not centred. */}
        <div className="col-span-4 md:col-span-8 lg:col-span-16">
          <Heading level={2} id="wd-reviews">
            {REVIEWS.title}
          </Heading>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-16">
          {/* A real scroll container with snapping, matching the reference's
              carousel behaviour without a transform carousel — it keeps
              trackpad, touch, scrollbar and keyboard working for free. */}
          <ul
            aria-label="Customer reviews"
            className="-mx-8 flex snap-x snap-mandatory scroll-pl-8 gap-14 overflow-x-auto px-8 pb-4"
          >
            {REVIEWS.items.map((item, i) => (
              <li
                key={i}
                className="w-[min(25.625rem,82vw)] shrink-0 snap-start"
              >
                <figure className="flex h-full min-h-[29rem] flex-col rounded-md p-12">
                  <QuoteMark />
                  {/* 20/32 quote, then a 24px name on leading-none with 16px
                      above it — their measured card internals, not ours. */}
                  <blockquote className="mt-4 text-[1rem] leading-[1.6] lg:text-[1.25rem] [text-wrap:initial]">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-auto pt-4 text-[1.125rem] font-semibold leading-none lg:text-[1.5rem]">
                    {item.name}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </Grid>
    </Band>
  );
}

/* ── 6b. Commitments — stands in the testimonial slot ────────────────────── */
/**
 * Same rail, same 410×464 card, same 48px padding as `Reviews`, because it
 * occupies the same slot until real testimonials exist. Swapping back is one
 * line in `page.tsx`.
 *
 * No quote mark here: these are OUR commitments, not somebody's words about us,
 * and borrowing the quotation mark would blur exactly the line this band exists
 * to respect.
 */
export function Commitments() {
  return (
    <Band tone="white" labelledBy="wd-commitments" className="py-16">
      <Grid className="gap-y-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-16">
          <Heading level={2} id="wd-commitments">
            {COMMITMENTS.title}
          </Heading>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-16">
          <ul
            aria-label="What Serverlys commits to"
            className="-mx-8 flex snap-x snap-mandatory scroll-pl-8 gap-14 overflow-x-auto px-8 pb-4"
          >
            {COMMITMENTS.items.map((item) => (
              <li
                key={item.title}
                className="w-[min(25.625rem,82vw)] shrink-0 snap-start"
              >
                <div className="flex h-full min-h-[29rem] flex-col rounded-md p-12">
                  <span aria-hidden="true" className="mb-6 block h-1 w-12 bg-[#0073ec]" />
                  <h3 className="text-[1.25rem] font-bold leading-[1.5] text-current lg:text-[1.5rem]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[1rem] leading-[1.6] [text-wrap:initial] lg:text-[1.25rem]">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Grid>
    </Band>
  );
}

/* ── 7. Chat with a Web Expert — offwhite ────────────────────────────────── */
export function Chat() {
  return (
    <Band tone="offwhite" labelledBy="wd-chat" className="py-16 lg:py-24">
      <Grid className="items-center gap-y-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-7">
          <ChatArt />
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-9">
          <Heading level={2} step="h2xl" id="wd-chat">
            {CHAT.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </Heading>
          <Lede className="mt-8 max-w-[42rem]">{CHAT.lede}</Lede>

          <div className="mt-10 flex flex-col items-start gap-5">
            <CtaButton href={billing.sales}>
              <ChatIcon />
              {CHAT.primary}
            </CtaButton>
            <CtaButton href={billing.sales} tone="outline">
              <CalendarIcon />
              {CHAT.secondary}
            </CtaButton>
          </div>
        </div>
      </Grid>
    </Band>
  );
}
