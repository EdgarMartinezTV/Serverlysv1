import { REVIEWS, REVIEWS_HEAD } from "../_content";
import { ArrowUpRight, Band, Grid, Headline, RatingStars } from "@/components/ref/kit";

/**
 * "Trusted by …" — three review cards.
 *
 * ⚠ The names in REVIEWS are placeholders on purpose; see _content.ts.
 *
 * The reference closes this band with "See our 72,145 reviews on Trustpilot".
 * That line was removed on request — it was Hostinger's count, not ours, and
 * the stars are brand blue rather than Trustpilot green for the same reason.
 * The heading's "5M+" is the same kind of claim and is still here.
 *
 * Cards are 400px wide with a 16px gutter, centred rather than stretched —
 * that is the reference's carousel at rest, and at three cards it never
 * scrolls on desktop.
 */
export function Reviews() {
  return (
    <Band labelledBy="cloud-reviews-heading">
      <Grid>
        <Headline id="cloud-reviews-heading" title={REVIEWS_HEAD} className="mb-8 xl:mb-12" />

        <ul className="flex flex-col justify-center gap-4 xl:flex-row">
          {REVIEWS.map((r, i) => (
            <li key={i} className="xl:w-[400px]">
              <div className="flex h-full flex-col gap-6 rounded-2xl bg-canvas-secondary p-8">
                <div className="flex flex-col gap-2">
                  <p className="flex items-start justify-between gap-2 text-body font-semibold text-fg">
                    {r.name}
                    <ArrowUpRight className="size-6 shrink-0 text-fg" />
                  </p>
                  <RatingStars />
                </div>
                <p className="text-body text-fg">{r.quote}</p>
              </div>
            </li>
          ))}
        </ul>
      </Grid>
    </Band>
  );
}
