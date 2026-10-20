import Image from "next/image";
import { Reveal } from "@/components/animations/reveal";
import { BrandIcon, type BrandSlug } from "@/components/retell/brands";

/**
 * "Share your page anywhere" — a fanned stack of platform cards, each a
 * miniature of where a Serverlys Bio link actually lives: an Instagram or
 * TikTok profile with the link in its bio, a YouTube channel's links, a saved
 * contact card and a printed QR code (a real, scannable code for the
 * example address). People are Unsplash portraits (public/bio/CREDITS.md).
 */

type Card = { key: string; bg: string; ink: string; title: string; d: number };

const GLYPH = {
  qr: "M3 3h7v7H3V3Zm2 2v3h3V5H5Zm9-2h7v7h-7V3Zm2 2v3h3V5h-3ZM3 14h7v7H3v-7Zm2 2v3h3v-3H5Zm9-2h2v2h-2v-2Zm4 0h3v2h-3v-2Zm-4 4h2v3h-2v-3Zm4 0h3v3h-3v-3Z",
  contact:
    "M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 11h10c0-2.2-2.2-4-5-4s-5 1.8-5 4Z",
} as const;

function Header({
  icon,
  glyph,
  label,
  ink,
}: {
  icon?: BrandSlug;
  glyph?: keyof typeof GLYPH;
  label: string;
  ink: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-semibold" style={{ color: ink }}>
        {label}
      </span>
      {icon || glyph ? (
        <span
          className="grid size-8 place-items-center rounded-full"
          style={{
            color: ink,
            background:
              ink === "#ffffff" ? "rgb(255 255 255 / 0.2)" : "rgb(6 20 51 / 0.08)",
          }}
        >
          {icon ? (
            <BrandIcon slug={icon} mono className="size-4" />
          ) : (
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
              <path d={GLYPH[glyph!]} />
            </svg>
          )}
        </span>
      ) : null}
    </div>
  );
}

function Profile({
  photo,
  name,
  handle,
  ink,
}: {
  photo: string;
  name: string;
  handle: string;
  ink: string;
}) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <Image
        src={`/bio/people/${photo}.webp`}
        alt=""
        width={160}
        height={160}
        className="size-12 shrink-0 rounded-full object-cover ring-2 ring-white/60"
      />
      <span className="min-w-0">
        <span
          className="block truncate text-[15px] leading-tight font-bold"
          style={{ color: ink }}
        >
          {name}
        </span>
        <span className="block truncate text-[12px] opacity-80" style={{ color: ink }}>
          {handle}
        </span>
      </span>
    </div>
  );
}

function LinkPill({
  children,
  strong,
}: {
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <span
      className={`block truncate rounded-full px-3 py-2 text-center text-[12px] font-semibold ${strong ? "bg-[#ccff00] text-[#101011]" : "bg-white/90 text-[#101011]"}`}
    >
      {children}
    </span>
  );
}

export function ShareCards({ host }: { host: string }) {
  const cards: Card[] = [
    { key: "youtube", bg: "#ff3b30", ink: "#ffffff", title: "YouTube", d: 0 },
    { key: "qr", bg: "#ffffff", ink: "#061433", title: "QR code", d: 80 },
    { key: "contact", bg: "#5b6472", ink: "#ffffff", title: "Contact card", d: 160 },
    { key: "tiktok", bg: "#101011", ink: "#ffffff", title: "TikTok", d: 240 },
    { key: "instagram", bg: "#e1306c", ink: "#ffffff", title: "Instagram", d: 320 },
  ];
  /* Back card top-right, front card bottom-left, like the reference's fan. */
  /* Steps are a share of the CARD's size (CSS translate %): ~17% of its
     height leaves each card's header row — name + icon — visible above the next. */
  const pos = [
    { left: "36%", top: "0%" },
    { left: "27%", top: "23%" },
    { left: "18%", top: "46%" },
    { left: "9%", top: "69%" },
    { left: "0%", top: "92%" },
  ];

  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-[500px]">
      <div className="relative h-[590px] sm:h-[540px]">
        {cards.map((c, i) => (
          <Reveal key={c.key} delay={c.d} className="absolute w-[56%] sm:w-[52%]">
            <div
              className="rounded-[28px] p-4 shadow-[0_24px_50px_-24px_rgb(0_0_0/0.6)] sm:p-5"
              style={{
                background: c.bg,
                translate: `${pos[i].left} ${pos[i].top}`,
                position: "relative",
              }}
            >
              {c.key === "youtube" ? (
                <>
                  <Header icon="youtube" label="YouTube" ink={c.ink} />
                  <Profile
                    photo="leo"
                    name="Leo Marsh"
                    handle="@leocooks · 48 videos"
                    ink={c.ink}
                  />
                  <div className="mt-3 flex flex-col gap-1.5">
                    <LinkPill strong>{host}/leocooks</LinkPill>
                    <LinkPill>Weekly recipes</LinkPill>
                  </div>
                </>
              ) : c.key === "qr" ? (
                <>
                  <Header glyph="qr" label="QR code · on every table" ink={c.ink} />
                  <div className="mt-3 flex items-center gap-3">
                    <Image
                      src="/bio/qr-example.svg"
                      alt=""
                      width={96}
                      height={96}
                      className="size-[84px] shrink-0 rounded-[10px] ring-1 ring-black/10"
                    />
                    <span className="text-[13px] leading-snug font-semibold text-[#061433]">
                      Scan for our menu, specials &amp; reservations
                      <span className="mt-1 block text-[11px] font-normal text-[#5b6472]">
                        {host}/yourname
                      </span>
                    </span>
                  </div>
                </>
              ) : c.key === "contact" ? (
                <>
                  <Header glyph="contact" label="Contact card" ink={c.ink} />
                  <Profile
                    photo="rosa"
                    name="Rosa Vidal"
                    handle="Salon owner · Miami"
                    ink={c.ink}
                  />
                  <div className="mt-3 flex flex-col gap-1.5">
                    <LinkPill>📞 Call · ✉️ Email · 🔗 Bio</LinkPill>
                    <LinkPill strong>Save contact</LinkPill>
                  </div>
                </>
              ) : c.key === "tiktok" ? (
                <>
                  <Header icon="tiktok" label="TikTok" ink={c.ink} />
                  <Profile
                    photo="ari"
                    name="Ari Bloom"
                    handle="@aribloom · 210K likes"
                    ink={c.ink}
                  />
                  <div className="mt-3 flex flex-col gap-1.5">
                    <LinkPill strong>{host}/aribloom</LinkPill>
                    <LinkPill>Shop my picks</LinkPill>
                  </div>
                </>
              ) : (
                <>
                  <Header icon="instagram" label="Instagram" ink={c.ink} />
                  <Profile
                    photo="maya"
                    name="Maya Ortiz"
                    handle="@maya.studio"
                    ink={c.ink}
                  />
                  <p className="mt-3 text-[12px] leading-snug text-white/90">
                    Ceramics, workshops &amp; studio sales ✨ Booking spring classes
                  </p>
                  <div className="mt-3 flex flex-col gap-1.5">
                    <LinkPill strong>🔗 {host}/maya</LinkPill>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] text-white">
                      <span className="rounded-[10px] bg-white/15 py-1.5">
                        <b className="block text-[13px]">128</b>posts
                      </span>
                      <span className="rounded-[10px] bg-white/15 py-1.5">
                        <b className="block text-[13px]">14.2K</b>followers
                      </span>
                      <span className="rounded-[10px] bg-white/15 py-1.5">
                        <b className="block text-[13px]">312</b>following
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-4 w-fit rounded-full bg-white px-5 py-3 text-[15px] font-semibold text-[#101011] shadow-e5">
        {host}/yourname
      </div>
    </div>
  );
}
