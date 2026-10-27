import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { billing } from "@/data/company";

/**
 * 404 — 2026-10-26 redesign, on Edgar's instruction: the page IS his artwork
 * (public/404/robot-404.png, the robot with the pixel "404" screen), "exactly
 * like that, no reference or inspiration". So the art is used as supplied, not
 * redrawn, and the page around it is built to disappear into it:
 *
 *  · The scene behind the art is the art's own background, measured off the
 *    image's edge pixels: an eased vertical gradient from #f2d466 to #8db7c3.
 *    GRADIENT below reproduces it with the measured stops. From `lg` it is
 *    painted at the bottom of the scene at exactly the art's rendered height
 *    (min(752px, 50vw)), with the art's top yellow above it; on phones it
 *    belongs to the art's own strip. Either way the seam is invisible.
 *  · The art is cut off at its bottom edge and its orange shelf runs off its
 *    right edge, so the image sits flush with the bottom of the scene and, from
 *    `lg`, flush with the right edge of the window — the shelf runs off-screen
 *    the way it runs off the artwork.
 *  · Ink and buttons take the art's colours: near-black outlines (#1b1408) and
 *    the screen's dark glass with its yellow pixels (#e9e35a).
 *
 * The plans panel that used to sit here is gone: it printed the derived
 * "standard" rate as a renewal price, which WHMCS does not charge.
 *
 * `noindex` so soft-404s never enter the index.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** The artwork's background, measured at 0, 25, 38, 50, 63, 75, 88 and 100% of its height. */
const GRADIENT =
  "linear-gradient(180deg, #f2d466 0%, #ead26d 25%, #e2cf75 38%, #d5cc80 50%, #c8c88d 63%, #b7c39b 75%, #a3bdad 88%, #8db7c3 100%)";

const INK = "#1b1408";
const SCREEN = "#e9e35a";

/** For the visitor who followed a specific dead link and knows what they wanted. */
const ELSEWHERE = [
  { name: "Hosting", href: "/hosting" },
  { name: "Domains", href: "/domain-name" },
  { name: "Migrations", href: "/migrations" },
  { name: "Support", href: "/support" },
] as const;

export default function NotFound() {
  return (
    <section
      aria-labelledby="notfound-heading"
      className="relative isolate overflow-hidden"
      style={{ backgroundColor: "#f2d466", color: INK }}
    >
      <style>{`
        .nf-art { background: ${GRADIENT}; }
        @media (min-width: 1024px) {
          .nf-row { background: ${GRADIENT} bottom / 100% min(752px, 50vw) no-repeat, #f2d466; }
          .nf-art { background: none; }
        }
      `}</style>
      <div className="nf-row relative">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="relative z-10 px-4 pt-14 pb-8 sm:px-8 lg:self-center lg:px-10 lg:py-16">
            <p
              className="inline-flex items-center gap-2 rounded-md px-2.5 py-1 font-mono text-small font-semibold tracking-[0.08em] uppercase"
              style={{ backgroundColor: INK, color: SCREEN }}
            >
              Error 404
            </p>

            <h1 id="notfound-heading" className="display-lg mt-5 max-w-[14ch]" style={{ color: INK }}>
              This page does not exist
            </h1>

            <p className="mt-5 max-w-[46ch] text-body-lg" style={{ color: "rgb(27 20 8 / 0.78)" }}>
              The link may be out of date, or the address may have a typo. Nothing is wrong with
              your site or your account.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex h-12 items-center rounded-xl px-6 text-body font-semibold shadow-[0_6px_0_0_rgb(27_20_8_/_0.25)] transition-transform duration-fast hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: INK, color: SCREEN, outlineColor: INK }}
              >
                Back to home
              </Link>
              <a
                href={billing.login}
                className="inline-flex h-12 items-center rounded-xl border-2 px-6 text-body font-semibold transition-colors duration-fast hover:bg-[rgb(27_20_8_/_0.08)] focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ borderColor: INK, color: INK, outlineColor: INK }}
              >
                Client login
              </a>
            </div>

            <nav aria-label="Popular pages" className="mt-8">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-small font-semibold">
                {ELSEWHERE.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="underline decoration-2 underline-offset-4 hover:opacity-70" style={{ color: INK }}>
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Flush with the bottom of the scene; from lg, flush with the window's right edge. */}
          <div className="nf-art relative flex items-end justify-center lg:justify-end lg:-mr-[max(0px,calc((100vw-1280px)/2))]">
            <Image
              src="/404/robot-404.png"
              alt=""
              width={752}
              height={752}
              priority
              sizes="(min-width: 1024px) 752px, 100vw"
              className="block h-auto w-full max-w-[752px] select-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
