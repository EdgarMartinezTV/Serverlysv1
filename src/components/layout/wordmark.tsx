import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { company } from "@/data/company";

/**
 * The Serverlys logo.
 *
 * ONE ASSET: /brand/logo.webp, used everywhere, unmodified. The blue wordmark,
 * the green circuit mark and the black tagline appear exactly as drawn — no
 * recolouring, no reversed variant, no derived file that can drift from the
 * original.
 *
 * The logo is drawn for light surfaces, so on the dark header, footer and
 * mobile drawer it sits on a WHITE PLATE rather than being recoloured to suit
 * the background. That is the trade this component makes deliberately:
 *
 *   · Recolouring keeps the surface clean and changes the brand. Pure blue
 *     (0,0,255) measures 2.16:1 on the dark ground, so it has to move a long
 *     way in lightness to be legible, and the mark stops being the mark.
 *   · A plate keeps the brand exact and adds a shape to the layout.
 *
 * The plate wins because the logo is the one element on the page that must not
 * be approximated. It is also what the asset supports: black tagline text has
 * no legible form on a dark background at any lightness.
 *
 * ⚠ The lockup carries a tagline set far smaller than the wordmark. At header
 * height it is a few pixels tall and reads as texture rather than words. A
 * horizontal mark WITHOUT the tagline would be the better asset at these
 * sizes — this component is where to swap it.
 */
export function Wordmark({
  tone = "dark",
  priority = false,
  className,
}: {
  /** `dark` = a light surface, logo bare. `light` = a dark surface, logo plated. */
  tone?: "dark" | "light";
  priority?: boolean;
  /** Height utility for the image. Defaults to the header size. */
  className?: string;
}) {
  const onDark = tone === "light";

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex w-fit shrink-0 items-center self-start rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
        /* The plate. Pure white so the artwork renders on the background it
           was drawn for, with enough padding that the circuit mark's legs are
           not clipped by the corner radius. */
        onDark && "bg-white px-3 py-2 shadow-e2 ring-1 ring-inset ring-white",
      )}
      aria-label={`${company.name} — home`}
    >
      <Image
        src="/brand/logo.webp"
        alt={company.name}
        /* Intrinsic dimensions. Next needs the true ratio to reserve the right
           box and avoid a layout shift as it loads. */
        width={1653}
        height={409}
        priority={priority}
        className={cn("w-auto", className ?? "h-8")}
      />
    </Link>
  );
}
