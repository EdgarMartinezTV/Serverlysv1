import { billing } from "@/data/company";
import { HERO } from "../_content";
import { Btn, Icon, SOFT } from "./kit";

/**
 * Hero. Reference at 1440: h1 56/64 two lines centred from y≈83, lede 16/24,
 * a price row, a 48px white button, a 14/20 guarantee line, then three 386×373
 * cards (gap 24, r16, white/5) whose top 217px is product art.
 *
 * The reference's price row ("From $19.49 · $6.49/mo") becomes a status row:
 * VPS is not on sale, so the slot says so instead of quoting a number.
 * The Trustpilot row under the cards becomes the honesty line.
 */
export function Hero() {
  return (
    <section aria-labelledby="vps-hero-heading" className="relative isolate overflow-hidden bg-black px-4 pt-14 pb-10 md:px-10 xl:pt-[83px]">
      {/* The reference's side glows, in the logo blue. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(38%_42%_at_0%_52%,rgb(0_0_255/0.55),transparent_70%),radial-gradient(38%_42%_at_100%_52%,rgb(0_0_255/0.55),transparent_70%),radial-gradient(60%_30%_at_50%_0%,rgb(0_0_255/0.18),transparent_70%)]" />

      <div className="mx-auto flex max-w-[1206px] flex-col items-center text-center">
        <h1 id="vps-hero-heading" className="max-w-[660px] text-[40px] leading-[48px] font-normal tracking-[-0.03em] text-white md:text-[56px] md:leading-[64px]">
          <span className="text-brand-400">{HERO.accent}</span> {HERO.title} {HERO.titleTail}
        </h1>
        <p className={`mt-6 max-w-[680px] text-[16px] leading-6 ${SOFT}`}>{HERO.lede}</p>

        <p className="mt-6 flex items-center gap-3 text-[16px] leading-6 text-white">
          {HERO.statusNote}
          <span className="inline-flex h-10 items-center rounded-lg bg-primary px-4 font-semibold">{HERO.status}</span>
        </p>

        <Btn href={billing.sales} className="mt-8 w-full sm:w-auto">
          {HERO.cta}
        </Btn>
        <p className={`mt-4 flex items-center gap-2 text-[14px] leading-5 ${SOFT}`}>
          <Icon.shield className="size-4" />
          {HERO.guarantee}
        </p>

        <ul className="mt-10 grid w-full gap-6 text-left md:grid-cols-3">
          {HERO.cards.map((c, i) => (
            <li key={c.title} className="overflow-hidden rounded-2xl bg-white/[0.05]">
              <div aria-hidden className="h-[217px]">
                {i === 0 ? <CpuArt /> : i === 1 ? <BackupArt /> : <ShellArt />}
              </div>
              <div className="px-6 pb-6">
                <h2 className="text-[20px] leading-7 text-white">{c.title}</h2>
                <p className={`mt-2 text-[16px] leading-6 ${SOFT}`}>{c.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className={`mt-12 text-[14px] leading-6 ${SOFT}`}>{HERO.honesty}</p>
      </div>
    </section>
  );
}

const panel = "fill-[#1c1c20] stroke-white/10";

function CpuArt() {
  return (
    <svg viewBox="0 0 386 217" className="size-full">
      <defs>
        <linearGradient id="vps-cpu-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1f55ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#1f55ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="32" y="62" width="312" height="112" rx="10" className={panel} />
      <text x="48" y="86" className="fill-white/60 text-[10px]" fontFamily="inherit">CPU usage ›</text>
      <text x="48" y="108" className="fill-white text-[13px]" fontFamily="inherit">22%</text>
      <path d="M48 160 L80 152 L110 146 L140 150 L170 138 L200 142 L230 132 L260 136 L290 128 L320 134 L320 166 L48 166Z" fill="url(#vps-cpu-fill)" />
      <path d="M48 160 L80 152 L110 146 L140 150 L170 138 L200 142 L230 132 L260 136 L290 128 L320 134" fill="none" stroke="#5f8bff" strokeWidth="2" />
      <rect x="214" y="32" width="140" height="108" rx="10" fill="#0b0b0d" stroke="#1f55ff" strokeWidth="1.5" />
      <rect x="222" y="40" width="124" height="92" rx="6" fill="#141418" />
      <text x="284" y="82" textAnchor="middle" className="fill-white text-[22px] font-semibold" fontFamily="inherit">vCPU</text>
      <text x="284" y="104" textAnchor="middle" className="fill-white/60 text-[10px]" fontFamily="inherit">reserved · yours</text>
    </svg>
  );
}

function BackupArt() {
  const rows = ["2026-11-14 02:00", "2026-11-07 02:00", "2026-10-31 02:00"];
  return (
    <svg viewBox="0 0 386 217" className="size-full">
      <rect x="52" y="48" width="266" height="132" rx="10" className={panel} />
      <text x="68" y="76" className="fill-white text-[11px] font-semibold" fontFamily="inherit">Backups</text>
      <rect x="122" y="66" width="38" height="13" rx="6.5" fill="#16a34a" fillOpacity="0.25" />
      <text x="141" y="75.5" textAnchor="middle" className="fill-[#4ade80] text-[7px]" fontFamily="inherit">Weekly</text>
      {rows.map((r, i) => (
        <g key={r} opacity={1 - i * 0.3}>
          <text x="68" y={108 + i * 28} className="fill-white/50 text-[8px]" fontFamily="inherit">{r}</text>
          <text x="160" y={108 + i * 28} className="fill-white/50 text-[8px]" fontFamily="inherit">1.2 GB</text>
          <rect x="250" y={98 + i * 28} width="50" height="15" rx="4" fill="none" stroke="white" strokeOpacity="0.2" />
          <text x="275" y={108 + i * 28} textAnchor="middle" className="fill-white/50 text-[7px]" fontFamily="inherit">Restore</text>
        </g>
      ))}
      <rect x="290" y="30" width="56" height="56" rx="10" fill="#0000ff" />
      <path d="M306 58a12 12 0 1012-12 12.3 12.3 0 00-9 4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M306 46v6h6M318 52v6l4 3" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShellArt() {
  const lines: [string, string][] = [
    ["root@vps:~# free -h", "white"],
    ["        total   used   free", "#a1a1aa"],
    ["Mem:     8.0G   2.1G   5.9G", "#a1a1aa"],
    ["Swap:    2.0G     0B   2.0G", "#a1a1aa"],
  ];
  return (
    <svg viewBox="0 0 386 217" className="size-full">
      <rect x="58" y="42" width="254" height="128" rx="8" className={panel} />
      <circle cx="72" cy="54" r="3" fill="white" fillOpacity="0.3" />
      <circle cx="82" cy="54" r="3" fill="white" fillOpacity="0.3" />
      <circle cx="92" cy="54" r="3" fill="white" fillOpacity="0.3" />
      {lines.map(([l, c], i) => (
        <text key={i} x="70" y={82 + i * 20} fill={c} className="text-[10px]" fontFamily="var(--font-jetbrains-mono), monospace" xmlSpace="preserve">{l}</text>
      ))}
      <rect x="148" y="136" width="186" height="44" rx="8" fill="#0b0b0d" stroke="#1f55ff" strokeWidth="1.5" />
      <text x="162" y="162" className="fill-white text-[10px]" fontFamily="inherit">ssh root@your-server</text>
      <rect x="302" y="146" width="24" height="24" rx="6" fill="#0000ff" />
      <path d="M311 153l5 5-5 5" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
