import Image from "next/image";
import Link from "next/link";
import { company } from "@/data/company";

/**
 * The Serverlys wordmark.
 *
 * IMPORTANT — only ONE real logo asset exists: /brand/serverlys-logo.webp,
 * a blue wordmark on transparency, drawn for LIGHT surfaces. There is no
 * reversed/white version in the brand assets, and recolouring the raster
 * would destroy the green circuit detail in the mark.
 *
 * So on dark surfaces we render a typographic wordmark instead of shipping an
 * illegible logo. When a proper reversed asset is supplied, drop it in and
 * swap the `light` branch for an <Image>.
 *
 * (The file previously used for dark surfaces, dark-version-logo.webp, is a
 * ConvoAI logo — a different product. It is deliberately not used here.)
 */
export function Wordmark({
  tone = "dark",
  priority = false,
}: {
  /** `dark` = dark art for light surfaces. `light` = light art for dark surfaces. */
  tone?: "dark" | "light";
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      aria-label={`${company.name} — home`}
    >
      {tone === "dark" ? (
        <Image
          src="/brand/serverlys-logo.webp"
          alt={company.name}
          width={280}
          height={70}
          priority={priority}
          className="h-9 w-auto"
        />
      ) : (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.375rem] font-bold uppercase tracking-[0.14em] text-white">
            {company.name}
          </span>
          <span className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-fg-on-dark-muted">
            Always online, always there
          </span>
        </span>
      )}
    </Link>
  );
}
