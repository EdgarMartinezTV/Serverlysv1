import Image from "next/image";
import { cn } from "@/lib/utils";
import { BrandIcon } from "@/components/retell/brands";

/**
 * /social-media product screens for the Features block — the month planned
 * on a content calendar, a post as it appears in the feed, comments being
 * answered, and the monthly report. All for one demo client, Ember & Oak
 * Coffee, so they read as one account. The photos in the posts are real
 * (public/mock/CREDITS.md); the UI around them is drawn in code and is
 * deliberately not a pixel copy of any network's app.
 *
 * Decorative: the feature copy beside each screen carries the meaning.
 */

const HANDLE = "emberandoak.coffee";

function Avatar({ size = "size-7" }: { size?: string }) {
  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full ring-2 ring-[#f59e0b]",
        size,
      )}
    >
      <Image
        src="/mock/social-post1.jpg"
        alt=""
        fill
        sizes="40px"
        className="object-cover"
      />
    </span>
  );
}

/* ── 1. Content calendar ────────────────────────────────────────────────── */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const POSTS: Record<
  number,
  {
    src: string;
    net: "instagram" | "facebook";
    state: "Published" | "Scheduled" | "Awaiting you";
  }
> = {
  2: { src: "/mock/social-post1.jpg", net: "instagram", state: "Published" },
  4: { src: "/mock/social-latte.jpg", net: "facebook", state: "Published" },
  9: { src: "/mock/social-post3.jpg", net: "instagram", state: "Published" },
  11: { src: "/mock/social-post4.jpg", net: "instagram", state: "Scheduled" },
  13: { src: "/mock/social-post2.jpg", net: "facebook", state: "Scheduled" },
  16: { src: "/mock/social-food.jpg", net: "instagram", state: "Scheduled" },
  18: { src: "/mock/social-post1.jpg", net: "facebook", state: "Awaiting you" },
  20: { src: "/mock/social-latte.jpg", net: "instagram", state: "Awaiting you" },
};

export function CalendarMock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-xl bg-white p-4 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.45)]",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9.5px] font-semibold tracking-[0.14em] text-primary uppercase">
            Content plan
          </p>
          <p className="text-[14px] font-semibold text-[#202124]">
            November · Ember &amp; Oak
          </p>
        </div>
        <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
          2 to approve
        </span>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[9px] font-semibold text-[#80868b]">
        {DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: 21 }, (_, i) => {
          const p = POSTS[i];
          return (
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-md bg-[#f6f7f9] ring-1 ring-black/[0.04]"
            >
              <span className="absolute top-0.5 left-1 z-10 text-[8px] font-semibold text-[#5f6368] mix-blend-normal">
                {i + 1}
              </span>
              {p && (
                <>
                  <Image
                    src={p.src}
                    alt=""
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                  <span className="absolute right-0.5 bottom-0.5 flex size-3.5 items-center justify-center rounded-full bg-white">
                    <BrandIcon slug={p.net} className="size-2.5" />
                  </span>
                  <span
                    className={cn(
                      "absolute top-0.5 right-0.5 size-1.5 rounded-full ring-1 ring-white",
                      p.state === "Published"
                        ? "bg-emerald-500"
                        : p.state === "Scheduled"
                          ? "bg-sky-500"
                          : "bg-amber-500",
                    )}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex gap-3 text-[9.5px] text-[#5f6368]">
        {[
          ["bg-emerald-500", "Published"],
          ["bg-sky-500", "Scheduled"],
          ["bg-amber-500", "Awaiting you"],
        ].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1">
            <span className={cn("size-1.5 rounded-full", c)} />
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── 2. A post in the feed, on a phone ──────────────────────────────────── */

export function PostMock({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative flex justify-center", className)}>
      <div className="w-[248px] overflow-hidden rounded-[30px] bg-black p-2 shadow-[0_30px_60px_-12px_rgb(0_0_0/0.6)]">
        <div className="overflow-hidden rounded-[23px] bg-white">
          <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5 text-[9px] font-semibold text-[#111]">
            <span>9:41</span>
            <span className="h-3.5 w-14 rounded-full bg-black" />
            <span>5G</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5">
            <Avatar />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[10.5px] font-semibold text-[#111]">
                {HANDLE}
              </span>
              <span className="block text-[9px] text-[#737373]">Austin, Texas</span>
            </span>
            <span className="ml-auto text-[14px] leading-none text-[#111]">···</span>
          </div>
          <div className="relative aspect-[4/5]">
            <Image
              src="/mock/social-latte.jpg"
              alt=""
              fill
              sizes="240px"
              className="object-cover"
            />
            <span className="absolute top-2 right-2 rounded-full bg-black/60 px-1.5 py-0.5 text-[8.5px] font-semibold text-white">
              1/4
            </span>
          </div>
          <div className="px-3 pt-2 pb-3">
            <div className="flex items-center gap-3 text-[#111]">
              {[
                "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z",
                "M4 5h16v11H9l-5 4V5Z",
                "m21 3-9 18-2-8-8-2 19-8Z",
              ].map((d) => (
                <svg
                  key={d}
                  viewBox="0 0 24 24"
                  className="size-[17px]"
                  fill={d.startsWith("M12 20") ? "#ef4444" : "none"}
                  stroke={d.startsWith("M12 20") ? "#ef4444" : "currentColor"}
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                >
                  <path d={d} />
                </svg>
              ))}
              <svg
                viewBox="0 0 24 24"
                className="ml-auto size-[17px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              >
                <path d="M6 3h12v18l-6-4-6 4V3Z" />
              </svg>
            </div>
            <p className="mt-1.5 text-[10px] font-semibold text-[#111]">1,284 likes</p>
            <p className="mt-0.5 text-[10px] leading-snug text-[#111]">
              <span className="font-semibold">{HANDLE}</span> Saturday mornings, sorted.
              Our new maple oat latte is here until the leaves are gone 🍁{" "}
              <span className="text-[#00376b]">#austincoffee #eastaustin</span>
            </p>
            <p className="mt-1 text-[9.5px] text-[#737373]">View all 86 comments</p>
          </div>
        </div>
      </div>
      <div className="absolute top-10 -right-1 hidden w-[150px] rounded-xl bg-white p-2.5 shadow-[0_18px_40px_-8px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.06] sm:block lg:-right-4">
        <p className="text-[9px] font-semibold tracking-[0.08em] text-[#80868b] uppercase">
          This post
        </p>
        {[
          ["Reach", "9,412"],
          ["Saves", "214"],
          ["Profile visits", "388"],
        ].map(([k, v]) => (
          <p key={k} className="mt-1 flex justify-between text-[10.5px]">
            <span className="text-[#5f6368]">{k}</span>
            <span className="tabular font-semibold text-[#202124]">{v}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

/* ── 3. Comments and messages, answered ─────────────────────────────────── */

export function InboxMock({ className }: { className?: string }) {
  const thread = [
    {
      who: "jess.reads",
      c: "#db2777",
      net: "instagram" as const,
      text: "Is the maple latte dairy free? 😍",
      reply: "It is with oat milk, and that’s our default for it! See you Saturday ☕",
      time: "2m",
    },
    {
      who: "Marco Ruiz",
      c: "#2563eb",
      net: "facebook" as const,
      text: "Do you take large orders for an office meeting?",
      reply:
        "We do: up to 40 drinks with 24 hours’ notice. Sending you the order form now.",
      time: "18m",
    },
    {
      who: "dani.atx",
      c: "#16a34a",
      net: "instagram" as const,
      text: "Best cortado on the east side, no contest",
      reply: "That made our whole morning, thank you Dani 🧡",
      time: "1h",
    },
  ];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-xl bg-white p-4 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.45)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-black/[0.07] pb-2.5">
        <p className="text-[13px] font-semibold text-[#202124]">
          Comments &amp; messages
        </p>
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          All answered
        </span>
      </div>
      <ul className="mt-2 flex flex-col gap-3">
        {thread.map((t) => (
          <li key={t.who}>
            <div className="flex gap-2">
              <span
                className="relative flex size-6 shrink-0 items-center justify-center rounded-full text-[9.5px] font-semibold text-white"
                style={{ background: t.c }}
              >
                {t.who[0].toUpperCase()}
                <span className="absolute -right-1 -bottom-1 flex size-3.5 items-center justify-center rounded-full bg-white">
                  <BrandIcon slug={t.net} className="size-2.5" />
                </span>
              </span>
              <p className="text-[10.5px] leading-snug text-[#3c4043]">
                <span className="font-semibold text-[#202124]">{t.who}</span>{" "}
                <span className="text-[#80868b]">· {t.time}</span>
                <br />
                {t.text}
              </p>
            </div>
            <div className="mt-1.5 ml-8 flex gap-2 rounded-lg bg-[#f6f7f9] p-2">
              <Avatar size="size-5" />
              <p className="text-[10.5px] leading-snug text-[#3c4043]">{t.reply}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── 4. Monthly report ──────────────────────────────────────────────────── */

export function SocialReportMock({ className }: { className?: string }) {
  const bars = [31, 38, 35, 44, 52, 49, 61, 66];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-xl bg-white p-5 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.45)]",
        className,
      )}
    >
      <div className="flex items-start justify-between border-b border-black/[0.07] pb-3">
        <div>
          <p className="text-[9.5px] font-semibold tracking-[0.14em] text-primary uppercase">
            Monthly social report
          </p>
          <p className="mt-0.5 text-[15px] font-semibold text-[#202124]">
            Ember &amp; Oak · October
          </p>
        </div>
        <span className="flex gap-1">
          <BrandIcon slug="instagram" className="size-4" />
          <BrandIcon slug="facebook" className="size-4" />
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["Followers", "4,812", "+312"],
          ["Reach", "58.3K", "+24%"],
          ["Link clicks", "1,106", "+19%"],
        ].map(([k, v, d]) => (
          <div key={k} className="rounded-lg bg-[#f8f9fa] p-2">
            <p className="text-[9.5px] text-[#5f6368]">{k}</p>
            <p className="tabular text-[16px] font-semibold text-[#202124]">{v}</p>
            <span className="rounded bg-emerald-50 px-1 py-0.5 text-[9.5px] font-semibold text-emerald-700">
              {d}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-14 items-end gap-1.5">
        {bars.map((b, i) => (
          <span
            key={i}
            className={cn(
              "flex-1 rounded-t",
              i === bars.length - 1 ? "bg-primary" : "bg-brand-100",
            )}
            style={{ height: `${(b / 66) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2.5 rounded-lg bg-[#f8f9fa] p-2">
        <span className="relative size-10 shrink-0 overflow-hidden rounded-md">
          <Image
            src="/mock/social-latte.jpg"
            alt=""
            fill
            sizes="40px"
            className="object-cover"
          />
        </span>
        <p className="text-[10.5px] leading-snug text-[#3c4043]">
          <span className="font-semibold text-[#202124]">Top post:</span> maple oat
          latte carousel, 9.4K reach and 214 saves. Next month: two more seasonal
          carousels.
        </p>
      </div>
    </div>
  );
}
