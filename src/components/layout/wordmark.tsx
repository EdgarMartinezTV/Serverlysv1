import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { company } from "@/data/company";

/**
 * The Serverlys logo.
 *
 * TWO ASSETS, one lockup. `/brand/logo.webp` is the original, used unmodified
 * on every light surface. `/brand/logo-on-dark.webp` is the reversed lockup for
 * the dark header, footer and mobile drawer.
 *
 * The reversed file is GENERATED FROM THE ORIGINAL, pixel for pixel — same
 * artwork, same 1653×409 box, same alpha. Only lightness moves, and only where
 * the dark ground requires it:
 *
 *   · the blue wordmark and drum go to brand-400 (#5ea3fa), the palette's
 *     vetted on-dark blue. Pure blue measures 2.16:1 on the abyss ground and
 *     is effectively invisible there;
 *   · the black tagline becomes white — black has no legible form on a dark
 *     background at any lightness;
 *   · the circuit mark's green is lifted slightly and keeps its hue, because
 *     green already carries on dark and recolouring it would lose the one part
 *     of the mark that is not blue.
 *
 * ⚠ This REPLACES an earlier white plate behind the logo. The plate kept the
 * artwork exact but put a white card in the top-left corner of every dark
 * band, which is the first thing you see on the homepage and reads as a bug.
 *
 * ⚠ DO NOT use `/brand/white-version-logo.webp` or `/brand/dark-version-logo.webp`.
 * Both are ConvoAI's logo, not Serverlys' — they are a different company's mark
 * that happens to sit in the same folder, and shipping one puts the wrong brand
 * in the header. Checked 2026-09-10.
 *
 * ⚠ The lockup carries a tagline set far smaller than the wordmark. At header
 * height it is a few pixels tall and reads as texture rather than words. A
 * horizontal mark WITHOUT the tagline would be the better asset at these
 * sizes — this component is where to swap it.
 */
/**
 * Widest this mark is rendered anywhere: the header's `h-10` against the
 * asset's 1653×409 ratio (4.042), so 40 × 4.042 ≈ 162px. The footer's `h-9` is
 * 145px and the default `h-8` is 129px, both comfortably under it.
 *
 * This number exists because WITHOUT a `sizes` attribute the browser assumes
 * `100vw` and picks the largest candidate in the srcset — it was fetching the
 * 1920px variant, 19KB of AVIF, to paint a 162px-wide logo. With `sizes` set
 * the correct small variant is chosen instead. The header copy carries
 * `priority`, so this sat in the critical path on every page.
 *
 * If you ever render the mark larger than this, pass `sizes` — do not leave it
 * to scale up from a 162px source and go soft.
 */
const DEFAULT_SIZES = "162px";

export function Wordmark({
  tone = "dark",
  priority = false,
  className,
  sizes = DEFAULT_SIZES,
}: {
  /** `dark` = a light surface. `light` = a dark surface, reversed lockup. */
  tone?: "dark" | "light";
  priority?: boolean;
  /** Height utility for the image. Defaults to the header size. */
  className?: string;
  /** Override only when rendering wider than the header's ~162px. */
  sizes?: string;
}) {
  const onDark = tone === "light";

  return (
    <Link
      href="/"
      className="inline-flex w-fit shrink-0 items-center self-start rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      aria-label={`${company.name} — home`}
    >
      <Image
        src={onDark ? "/brand/logo-on-dark.webp" : "/brand/logo.webp"}
        alt={company.name}
        /* Intrinsic dimensions. Next needs the true ratio to reserve the right
           box and avoid a layout shift as it loads. Both files share them. */
        width={1653}
        height={409}
        sizes={sizes}
        priority={priority}
        className={cn("w-auto", className ?? "h-8")}
      />
    </Link>
  );
}
