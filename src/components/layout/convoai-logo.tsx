import Image from "next/image";

/**
 * The ConvoAI lockup.
 *
 * ConvoAI is a separate product with its own brand, so it gets its own mark
 * rather than being set in Serverlys' type. Two assets, and the file names say
 * which SURFACE each is for, not what colour it is:
 *
 *   white-version-logo.webp   for white/light surfaces — "Convo" in black
 *   dark-version-logo.webp    for dark surfaces        — "Convo" in white
 *
 * The teal mark and the teal "AI" are identical in both; only the wordmark's
 * lightness differs. Picking the wrong one makes "Convo" vanish into the
 * background and leaves a floating "AI", which is why the choice is made here
 * from a `tone` prop rather than at each call site.
 *
 * ⚠ These are NOT Serverlys assets and must never be used as the site logo —
 * that is `components/layout/wordmark.tsx`. They sit in the same folder, which
 * has caused exactly that mistake before.
 *
 * Decorative by default: every placement so far sits beside a heading that
 * already names the product, so an empty alt keeps a screen reader from
 * reading "ConvoAI" twice. Pass `decorative={false}` where the mark is the
 * only thing naming it.
 */
/**
 * Widest this mark is rendered anywhere: `h-9` on /convoai against the asset's
 * 1362×320 ratio (4.256), so 36 × 4.256 ≈ 153px. Every other use is smaller —
 * `h-7` is 119px, `h-6` is 102px, `h-5` is 85px.
 *
 * Without a `sizes` attribute the browser assumes `100vw` and takes the
 * largest candidate in the srcset, fetching a ~1920px variant to paint a
 * 153px-wide logo. See the matching note in wordmark.tsx.
 */
const DEFAULT_SIZES = "153px";

export function ConvoAiLogo({
  tone = "light",
  className,
  decorative = true,
  sizes = DEFAULT_SIZES,
}: {
  /** `light` = a light surface. `dark` = a dark surface. */
  tone?: "light" | "dark";
  className?: string;
  decorative?: boolean;
  /** Override only when rendering wider than ~153px. */
  sizes?: string;
}) {
  const onDark = tone === "dark";
  return (
    <Image
      src={onDark ? "/brand/dark-version-logo.webp" : "/brand/white-version-logo.webp"}
      alt={decorative ? "" : "ConvoAI"}
      aria-hidden={decorative || undefined}
      /* Intrinsic size of the light asset. The dark one is 1323×317; both are
         constrained by height here, so the small ratio difference is invisible
         and one pair of numbers keeps the layout box stable. */
      width={1362}
      height={320}
      sizes={sizes}
      className={className ?? "h-7 w-auto"}
    />
  );
}
