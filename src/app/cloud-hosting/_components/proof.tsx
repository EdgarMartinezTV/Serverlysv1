import { Grid } from "@/components/ref/kit";
import { SeraMark } from "@/components/sera/sera-mark";
import { Check } from "@/components/ref/kit";

/**
 * Dark band: the reference's "Trusted by 5M+" testimonials row, then its
 * agent spotlight.
 *
 * ⚠ NO TESTIMONIALS, NO USER COUNT. The previous version carried three
 * placeholder reviewers quoting Hostinger's Trustpilot reviews under a
 * "5M+ website owners" heading — fabricated proof (check-reviews.mjs flags
 * it). The cards now state three commitments the company can be held to.
 * Swap in real Serverlys reviews here when they exist, never before.
 */
const PROMISES = [
  {
    title: "The renewal price, up front",
    body: "Every plan shows the rate it renews at next to the rate you start on. Year two is never a surprise.",
  },
  {
    title: "Thirty days to change your mind",
    body: "If it is not right, ask within 30 days for a full refund. No forms, no retention call.",
  },
  {
    title: "We move your site for you",
    body: "Free migration by our team, tested on staging before anything points at us.",
  },
] as const;

export function Proof() {
  return (
    <section
      aria-labelledby="cloud-proof-heading"
      className="relative isolate overflow-hidden bg-canvas-abyss py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_100%,rgb(0_0_255/0.45),transparent_70%)]"
      />
      <Grid>
        <h2
          id="cloud-proof-heading"
          className="display-lg mx-auto max-w-[760px] text-center text-white"
        >
          Hosting you can hold us to
        </h2>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {PROMISES.map((p) => (
            <li key={p.title} className="rounded-2xl bg-white p-7">
              <h3 className="text-body-lg font-semibold text-fg">{p.title}</h3>
              <p className="mt-3 text-small text-fg-secondary">{p.body}</p>
            </li>
          ))}
        </ul>

        {/* ── Sera spotlight ──────────────────────────────────────────── */}
        <div
          id="ai-agent"
          className="mt-24 grid scroll-mt-14 items-center gap-14 lg:grid-cols-2"
        >
          <div
            aria-hidden="true"
            className="relative mx-auto h-[360px] w-full max-w-[520px] overflow-hidden rounded-3xl bg-gradient-to-br from-brand-300 to-brand-600"
          >
            <div className="absolute inset-y-0 right-0 w-1/2 bg-white/10 [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%)]" />
            <div className="absolute top-8 left-8 w-[62%] rounded-2xl bg-white/95 p-5 text-center shadow-e5">
              <SeraMark className="mx-auto h-9 w-9 text-primary" />
              <p className="mt-3 text-h4 text-fg">Hello</p>
              <p className="text-small text-fg-secondary">How can I help today?</p>
            </div>
            <ul className="absolute right-6 bottom-8 left-14 flex flex-col gap-2">
              {[
                "I want to move my site to Serverlys",
                "I want to create a website",
                "Help me choose the right plan",
              ].map((s, i) => (
                <li
                  key={s}
                  style={{ marginLeft: `${(i % 2) * -24}px` }}
                  className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 text-small text-fg shadow-e3"
                >
                  <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-fg">
                    <path
                      d="M5 11 11 5M6.5 5H11v4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-[500px]">
            <h2 className="display-lg text-white">
              Meet Sera, your assistant for hosting and websites
            </h2>
            <ul className="mt-7 flex flex-col gap-3">
              {[
                "Recommends a plan from the real prices, renewal rate included",
                "Starts a migration or a project request for you",
                "Answers setup questions in plain language",
                "Hands you to a person, with the conversation, when that is the better answer",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2.5 text-body text-fg-on-dark-secondary"
                >
                  <Check className="mt-1 size-4 shrink-0 text-white" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Grid>
    </section>
  );
}
