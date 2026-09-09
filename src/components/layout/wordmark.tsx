import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { company } from "@/data/company";

/**
 * The Serverlys logo.
 *
 * TWO ASSETS, one per surface:
 *
 *   /brand/logo.webp           blue wordmark + green circuit mark + black
 *                              tagline. Drawn for LIGHT surfaces.
 *   /brand/logo-reversed.webp  the same lockup KEEPING THE BRAND COLOURS, for
 *                              dark surfaces. DERIVED from the asset above,
 *                              measured against the dark ground (#0a1030):
 *
 *                                green #4caf50  6.69:1  kept exactly as drawn
 *                                blue  #0000ff  2.16:1  fails — lightened
 *                                                       along the same hue to
 *                                                       #5c78ff, which
 *                                                       measures 4.94:1
 *                                tagline #000000        invisible — to white
 *
 *                              Alpha is left untouched, so the circuit detail
 *                              and the anti-aliased edges survive exactly; a
 *                              hard swap on exact colour matches would leave a
 *                              fringe around every glyph. Regenerate it if the
 *                              primary logo changes.
 *
 * Why a second asset rather than one everywhere: pure blue on the dark ground
 * is unreadable, well under the 4.5:1 floor the rest of this design system
 * holds itself to. Turning the whole mark white would solve legibility and
 * lose the brand — this keeps the blue and the green and only moves the blue
 * far enough up in lightness to be read.
 *
 * ⚠ The lockup includes a tagline set much smaller than the wordmark. At
 * header height the tagline is a few pixels tall and reads as texture rather
 * than words. If a horizontal mark WITHOUT the tagline is available, it would
 * be the better asset at these sizes — this component is where to swap it.
 */
export function Wordmark({
  tone = "dark",
  priority = false,
  className,
}: {
  /** `dark` = dark art for light surfaces. `light` = light art for dark surfaces. */
  tone?: "dark" | "light";
  priority?: boolean;
  /** Height utility. Defaults to the header size. */
  className?: string;
}) {
  const reversed = tone === "light";

  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      aria-label={`${company.name} — home`}
    >
      <Image
        src={reversed ? "/brand/logo-reversed.webp" : "/brand/logo.webp"}
        alt={company.name}
        /* Intrinsic dimensions of the asset. Next needs the true ratio to
           reserve the right box and avoid a layout shift as it loads. */
        width={1653}
        height={409}
        priority={priority}
        className={cn("w-auto", className ?? "h-10")}
      />
    </Link>
  );
}
