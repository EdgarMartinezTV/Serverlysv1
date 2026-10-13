import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";
import { INK, Label, MUTED, Wrap } from "@/components/retell/kit";

/**
 * "How zero downtime works" — the one section on /migrations that explains
 * the mechanism rather than the promise. Edgar, 2026-10-13: users must
 * understand how Serverlys moves their site and why it never goes offline.
 *
 * The idea a visitor needs is simple: there are TWO copies of the site, the
 * old one keeps serving until the new one is proven, and the only thing that
 * changes at the switch is where the domain points. Each phase shows which
 * server is answering visitors, so the "no gap" is visible, not asserted.
 *
 * ⚠ Steps 4 and 5 (lowering the DNS TTL ahead of time, and a final sync of
 * orders and changes made during the move) are standard zero-downtime
 * practice and are stated here as what Serverlys does. Confirm the team does
 * both on every move; if not, change the copy, not the claim's strength.
 */

type Phase = {
  n: string;
  title: string;
  body: string;
  /** Which server answers visitors during this phase. */
  serving: "old" | "both" | "new";
  you?: boolean;
};

const PHASES: Phase[] = [
  {
    n: "01",
    title: "You send us the details",
    body: "Your site’s address and a login for your current host or WordPress. This is the only part you do. Don’t cancel your old hosting yet.",
    serving: "old",
    you: true,
  },
  {
    n: "02",
    title: "We copy everything across",
    body: "Our team copies your files, database and settings onto your new Serverlys cloud plan. Your live site isn’t touched: visitors keep browsing and buying on your old host.",
    serving: "old",
  },
  {
    n: "03",
    title: "We test it on a private address",
    body: "The copy runs on a temporary staging address only you and we can see. We check pages, forms, logins and checkout, then you click through it too. Anything wrong is fixed here, not in front of customers.",
    serving: "old",
  },
  {
    n: "04",
    title: "We prepare the switch",
    body: "Ahead of the switch we shorten how long the internet caches your domain’s address (its DNS TTL), so when it changes, visitors pick up the new server in minutes instead of hours.",
    serving: "old",
  },
  {
    n: "05",
    title: "Final sync, then we switch",
    body: "At a quiet time you pick, we copy across anything that changed since the first copy, like new orders, posts or form entries, and point your domain at Serverlys.",
    serving: "both",
  },
  {
    n: "06",
    title: "Both servers answer while it spreads",
    body: "DNS changes reach visitors gradually. Because your old host still has the full site, anyone not yet switched lands on a working site there, and everyone else lands on Serverlys. Nobody hits an error page.",
    serving: "both",
  },
  {
    n: "07",
    title: "Live on Serverlys, then you cancel",
    body: "Your SSL certificate is issued on the new server, we confirm every visitor is arriving at Serverlys, and we tell you it’s safe to cancel your old hosting.",
    serving: "new",
  },
];

function ServingBar({ serving }: { serving: Phase["serving"] }) {
  return (
    <div
      aria-hidden="true"
      className="mt-4 grid grid-cols-2 gap-1.5 text-[11px] font-semibold"
    >
      <span
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2.5 py-1.5",
          serving === "new"
            ? "bg-[#eceef2] text-[#9aa0a6]"
            : "bg-amber-100 text-amber-900",
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            serving === "new" ? "bg-[#c4c7cc]" : "bg-amber-500",
          )}
        />
        Old host {serving === "new" ? "· retired" : "· serving"}
      </span>
      <span
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2.5 py-1.5",
          serving === "old"
            ? "bg-[#eceef2] text-[#9aa0a6]"
            : "bg-emerald-100 text-emerald-900",
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            serving === "old" ? "bg-[#c4c7cc]" : "bg-emerald-500",
          )}
        />
        Serverlys {serving === "old" ? "· being prepared" : "· serving"}
      </span>
    </div>
  );
}

export function ZeroDowntime() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="zero-downtime-heading"
      className="scroll-mt-20 bg-[#f7f7f8] py-20 lg:py-28"
    >
      <Wrap>
        <Label className="text-center">Zero downtime, explained</Label>
        <h2
          id="zero-downtime-heading"
          className={cn(
            "mx-auto mt-4 max-w-[760px] text-center font-display text-[32px] leading-[1.15] font-normal tracking-[-0.025em] sm:text-[40px] lg:text-[46px]",
            INK,
          )}
        >
          How we move your site without it ever going offline
        </h2>
        <p
          className={cn(
            "mx-auto mt-5 max-w-[720px] text-center text-[17px] leading-[1.6]",
            MUTED,
          )}
        >
          The trick is simple: for the whole move there are two copies of your site.
          Your old host keeps serving customers until the new copy on Serverlys is
          built, tested and ready. The only thing that changes at the end is where your
          domain points.
        </p>

        {/* At-a-glance: who is serving, start to finish. */}
        <div
          aria-hidden="true"
          className="mx-auto mt-12 max-w-[880px] rounded-2xl bg-white p-5 ring-1 ring-black/[0.06] sm:p-6"
        >
          <div className="grid grid-cols-[92px_1fr] items-center gap-x-4 gap-y-2 text-[12px]">
            <span className="font-semibold text-[#3c4043]">Old host</span>
            <div className="relative h-7 overflow-hidden rounded-md bg-[#eceef2]">
              <div className="absolute inset-y-0 left-0 w-[86%] rounded-md bg-amber-400" />
              <span className="absolute inset-y-0 left-3 flex items-center font-semibold text-amber-950">
                Serving your customers
              </span>
            </div>
            <span className="font-semibold text-[#3c4043]">Serverlys</span>
            <div className="relative h-7 overflow-hidden rounded-md bg-[#eceef2]">
              <div className="absolute inset-y-0 left-0 w-[62%] bg-[repeating-linear-gradient(135deg,#dbeafe_0_8px,#eff6ff_8px_16px)]" />
              <span className="absolute inset-y-0 left-3 flex items-center font-semibold text-sky-900">
                Copied, tested in private
              </span>
              <div className="absolute inset-y-0 right-0 left-[62%] rounded-md bg-emerald-500" />
              <span className="absolute inset-y-0 right-3 flex items-center font-semibold text-white">
                Serving
              </span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-[92px_1fr] gap-x-4 text-[11px] text-[#5f6368]">
            <span />
            <div className="relative h-5">
              <span className="absolute left-[62%] -translate-x-1/2 font-semibold text-primary">
                ↑ Domain switched
              </span>
              <span className="absolute left-[86%] -translate-x-1/2 whitespace-nowrap">
                ↑ Old host retired
              </span>
            </div>
          </div>
          <p className="mt-2 text-center text-[13px] font-semibold text-[#0b1530]">
            At every moment, at least one server has your full site. That is why there
            is no downtime.
          </p>
        </div>

        <ol className="mx-auto mt-14 grid max-w-[1040px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PHASES.map((p, i) => (
            <Reveal
              as="li"
              key={p.n}
              delay={(i % 3) * 80}
              className={cn(
                "flex flex-col rounded-2xl bg-white p-6 ring-1 ring-black/[0.06]",
                i === PHASES.length - 1 && "sm:col-span-2 lg:col-span-3",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[13px] font-semibold text-primary">
                  {p.n}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    p.you ? "bg-brand-50 text-primary" : "bg-[#f1f2f5] text-[#5b6472]",
                  )}
                >
                  {p.you ? "You" : "Serverlys"}
                </span>
              </div>
              <h3
                className={cn(
                  "mt-3 text-[20px] leading-snug font-normal tracking-[-0.01em]",
                  INK,
                )}
              >
                {p.title}
              </h3>
              <p className={cn("mt-2 flex-1 text-[14px] leading-[1.6]", MUTED)}>
                {p.body}
              </p>
              <ServingBar serving={p.serving} />
            </Reveal>
          ))}
        </ol>

        <div className="mx-auto mt-10 grid max-w-[1040px] gap-4 md:grid-cols-3">
          {[
            [
              "Your email keeps arriving",
              "Email is a separate service from the website. We move it only when you ask, and plan it so messages keep arriving throughout.",
            ],
            [
              "Your domain stays yours",
              "If your domain is registered elsewhere, it stays there. We tell you exactly which records to change and when, or change them for you with your login.",
            ],
            [
              "One rule for you",
              "Don’t cancel your old hosting until we tell you the move is finished. It is the safety net that makes zero downtime possible.",
            ],
          ].map(([t, b]) => (
            <div key={t} className="rounded-2xl bg-[#0b1530] p-6 text-white">
              <h3 className="text-[17px] font-semibold text-white">{t}</h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-white/80">{b}</p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
