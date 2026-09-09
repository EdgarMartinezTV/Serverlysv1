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
 *   /brand/logo-reversed.webp  the same lockup with the wordmark and tagline
 *                              in white. DERIVED from the asset above by
 *                              recolouring every non-green pixel to white and
 *                              leaving alpha untouched, so the green circuit
 *                              detail and the anti-aliased edges survive
 *                              exactly. Regenerate it if the primary logo
 *                              changes — it is not hand-drawn, so it cannot
 *                              drift on its own, but it will go stale.
 *
 * Why a second asset rather than one everywhere: the wordmark is pure blue
 * (0,0,255) and the tagline is black. Against the dark band both are close to
 * invisible — blue on #0b0e14 measures roughly 2.4:1, well under the 4.5:1
 * floor the rest of this design system holds itself to. Shipping one logo on
 * both surfaces would mean shipping an unreadable one on half the site.
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
