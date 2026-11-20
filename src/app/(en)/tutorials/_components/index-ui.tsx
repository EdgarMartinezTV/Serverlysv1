import Link from "next/link";
import type { Tutorial } from "@/data/tutorials";
import { tutorialPath } from "@/data/tutorials";
import { categoryAnchor } from "./tutorial-ui";

/**
 * Building blocks of the /tutorials index, laid out on hostinger.com/tutorials
 * (measured at 1440 on 2026-11-16): a 1120px column, section heads at 56/67
 * light, 18/27 grey subtitles, three 359px cards per row with a 210px
 * thumbnail, a pill on the image, an uppercase meta row, a 24px light title,
 * "N min Read · date" and the summary.
 *
 * Content rules (same as the rest of the site): the dates are the real first
 * publication dates from the repo history, the byline is the company (there
 * is no invented author), and the thumbnails are drawn interface motifs, not
 * stock or generated pictures.
 */

export const COL = "mx-auto w-full max-w-[1152px] px-[10px] sm:px-4 md:px-6 xl:px-4";

const DOT: Record<Tutorial["category"], string> = {
  "Getting started": "bg-[#f5b400]",
  "Domains & DNS": "bg-[#f26b1d]",
  Email: "bg-[#1f55ff]",
  WordPress: "bg-[#00b090]",
  Security: "bg-[#d63163]",
  Recovery: "bg-[#8c5cff]",
};

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const mon = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${day} ${mon}, ${d.getUTCFullYear()}`;
}

function shortDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function SectionHead({
  id,
  title,
  sub,
  viewAll,
  viewAllBelow = false,
}: {
  id: string;
  title: string;
  sub: string;
  viewAll?: string;
  /** The reference sets the button under the subtitle on its last curated band. */
  viewAllBelow?: boolean;
}) {
  const btn = viewAll ? (
    <Link
      href={viewAll}
      className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg border-2 border-brand-900 px-12 text-[16px] font-bold text-brand-900 transition-colors hover:bg-brand-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      View all
    </Link>
  ) : null;
  return (
    <div className="text-center md:text-left">
      <div className="md:flex md:items-end md:justify-between md:gap-6">
        <h2 id={id} className="text-[56px] leading-[67px] font-light text-[#18181a]">
          {title}
        </h2>
        {!viewAllBelow && btn && <div className="hidden pb-2 md:block">{btn}</div>}
      </div>
      <p className="mx-auto mt-7 max-w-[1060px] text-[18px] md:mx-0 leading-[27px] text-[#797980]">{sub}</p>
      {viewAllBelow && btn && <div className="mt-8 md:mt-[72px]">{btn}</div>}
      {!viewAllBelow && btn && <div className="mt-6 md:hidden">{btn}</div>}
    </div>
  );
}

export function CardGrid({ items, byline = false }: { items: readonly Tutorial[]; byline?: boolean }) {
  return (
    <ul className="grid gap-x-[21px] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((t) => (
        <li key={t.slug}>
          <TutorialCard t={t} byline={byline} />
        </li>
      ))}
    </ul>
  );
}

export function TutorialCard({ t, byline = false }: { t: Tutorial; byline?: boolean }) {
  const href = tutorialPath(t);
  return (
    <article className="flex flex-col text-center md:text-left">
      <div className="relative">
        <Link href={href} aria-label={t.title} tabIndex={-1} className="block">
          <Thumb t={t} />
        </Link>
        <a
          href={`#all/${categoryAnchor(t.category)}`}
          className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-lg bg-white px-2 py-0.5 text-[12px] leading-[18px] font-semibold text-[#222225]"
        >
          <span aria-hidden className={`size-2 rounded-full ${DOT[t.category]}`} />
          {t.category}
        </a>
      </div>
      <div className="flex flex-col pt-7 pb-6 md:pt-4">
        <div className="mb-2 flex flex-wrap justify-center gap-x-2 text-[14px] leading-[21px] font-light text-brand-950 md:flex-nowrap md:justify-between md:gap-4 md:text-[16px] md:leading-[33.6px]">
          <a href={`#all/${categoryAnchor(t.category)}`} className="uppercase hover:text-primary">
            {t.category}
          </a>
          <p className="md:text-right">
            <span className="uppercase">Published</span> <time dateTime={t.published}>{formatDate(t.published)}</time>
          </p>
        </div>
        <h3 className="pb-2.5 text-[24px] leading-[28.8px] font-light text-[#18181a]">
          <Link href={href} className="hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {t.title}
          </Link>
        </h3>
        <p className="mb-2.5 text-[14px] leading-[21px] text-[#797980]">
          {t.minutes} min Read · {t.steps.length} steps · {shortDate(t.published)}
        </p>
        <p className="line-clamp-3 text-[16px] leading-6 text-[#797980]">{t.summary}</p>
        {byline && <p className="mt-4 text-[14px] leading-[21px] font-bold text-[#18181a]">By the Serverlys team</p>}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Thumbnails: line-drawn interface motifs on the brand blue, one     */
/* motif per category and a label naming what the tutorial touches.   */
/* ------------------------------------------------------------------ */

const LABEL: Record<string, string> = {
  "log-in-to-cpanel": "Open cPanel →",
  "point-your-domain": "A  @  192.0.2.10",
  "email-deliverability": "SPF · DKIM · DMARC",
  "wordpress-fast-on-day-one": "Cache: on",
  "force-https": "301 → https://",
  "restore-a-backup": "Restore point",
  "lower-ttl-before-migration": "TTL 300",
  "change-nameservers": "ns1 · ns2",
  "add-a-or-cname-record": "CNAME  www",
  "set-up-dmarc": "v=DMARC1; p=none",
  "set-up-dkim": "v=DKIM1; k=rsa",
  "connect-google-workspace-or-microsoft-365": "MX  @  priority 1",
  "install-ssl-certificate-wordpress": "SSL: active",
  "move-wordpress-to-a-new-host": "export → import",
  "change-wordpress-site-url": "siteurl · home",
  "reset-wordpress-password-phpmyadmin": "wp_users",
  "wordpress-automatic-backups": "Daily backup",
  "harden-wordpress-login": "2FA · limit logins",
  "fix-error-establishing-database-connection": "DB_HOST",
  "set-up-subdomain": "shop.yourbrand.com",
  "set-up-email-forwarding": "you@ → inbox",
  "transfer-a-domain": "EPP code",
};

const BG: Record<Tutorial["category"], string> = {
  "Getting started": "bg-brand-950",
  "Domains & DNS": "bg-[#1f3dff]",
  Email: "bg-brand-900",
  WordPress: "bg-brand-950",
  Security: "bg-[#1f3dff]",
  Recovery: "bg-brand-900",
};

function Thumb({ t }: { t: Tutorial }) {
  const label = LABEL[t.slug] ?? t.category;
  return (
    <div className={`relative h-[210px] overflow-hidden rounded-[10px] bg-[linear-gradient(rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.07)_1px,transparent_1px)] bg-[size:24px_24px] ${BG[t.category]}`}>
      <svg aria-hidden viewBox="0 0 360 210" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <g fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="1.2">
          <path d="M30 170h60l12-12h40" />
          <path d="M330 40h-50l-10 10h-30" />
          <circle cx="44" cy="52" r="10" />
          <rect x="286" y="140" width="44" height="28" rx="4" />
          <path d="M292 150h32M292 158h20" />
        </g>
        <Motif category={t.category} />
      </svg>
      <span className="absolute bottom-[34px] left-1/2 max-w-[80%] -translate-x-1/2 truncate rounded-md bg-white/95 px-2.5 py-1 font-mono text-[12px] leading-4 font-medium text-brand-950 shadow-sm">
        {label}
      </span>
    </div>
  );
}

function Motif({ category }: { category: Tutorial["category"] }) {
  const s = { fill: "none", stroke: "white", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (category) {
    case "Getting started":
      return (
        <g {...s}>
          <rect x="128" y="44" width="104" height="84" rx="8" />
          <path d="M128 62h104" />
          <rect x="142" y="74" width="20" height="16" rx="3" />
          <rect x="170" y="74" width="20" height="16" rx="3" />
          <rect x="198" y="74" width="20" height="16" rx="3" />
          <rect x="142" y="98" width="20" height="16" rx="3" />
          <rect x="170" y="98" width="20" height="16" rx="3" />
          <path d="M206 118l6 14 3-6 6-3z" />
        </g>
      );
    case "Domains & DNS":
      return (
        <g {...s}>
          <circle cx="180" cy="88" r="44" />
          <ellipse cx="180" cy="88" rx="18" ry="44" />
          <path d="M136 88h88M142 66h76M142 110h76" />
          <circle cx="226" cy="50" r="5" fill="white" />
        </g>
      );
    case "Email":
      return (
        <g {...s}>
          <rect x="128" y="50" width="104" height="72" rx="8" />
          <path d="M130 56l50 38 50-38" />
          <circle cx="232" cy="52" r="13" fill="#00b090" stroke="none" />
          <path d="M226 52l4 4 8-8" />
        </g>
      );
    case "WordPress":
      return (
        <g {...s}>
          <rect x="112" y="40" width="136" height="90" rx="8" />
          <path d="M112 58h136" />
          <circle cx="124" cy="49" r="2" fill="white" />
          <circle cx="132" cy="49" r="2" fill="white" />
          <path d="M128 76h60M128 90h96M128 104h80" />
          <rect x="200" y="70" width="34" height="14" rx="3" fill="white" fillOpacity="0.25" />
        </g>
      );
    case "Security":
      return (
        <g {...s}>
          <path d="M180 36l42 16v30c0 26-18 42-42 50-24-8-42-24-42-50V52z" />
          <rect x="164" y="78" width="32" height="26" rx="4" />
          <path d="M170 78v-8a10 10 0 0 1 20 0v8" />
        </g>
      );
    case "Recovery":
      return (
        <g {...s}>
          <circle cx="180" cy="86" r="44" />
          <path d="M180 60v26l18 12" />
          <path d="M128 64l8 14 14-8" />
          <path d="M136 78a48 48 0 0 1 8-18" />
        </g>
      );
  }
}
