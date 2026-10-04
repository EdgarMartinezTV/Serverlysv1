import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A real photograph inside a coded mockup (a product tile, a hero banner, a
 * dish on a restaurant site). Files live in /public/mock — see CREDITS.md
 * there for sources and the rule: products and places only, never a photo
 * of a fake interface, never a brand logo in frame.
 *
 * Positioning is the CALLER's: wrap in an absolutely positioned box if the
 * photo must fill one. This element is always `relative` (next/image `fill`
 * needs it), so passing `absolute` here would fight it.
 */
export type MockPhotoName =
  | "mug"
  | "bottle"
  | "serum"
  | "headphones"
  | "watch"
  | "sneaker"
  | "sofa"
  | "chair"
  | "bread"
  | "bread-sliced"
  | "coffee"
  | "restaurant"
  | "checkout"
  | "house";

export function MockPhoto({
  src,
  alt = "",
  className,
  sizes = "200px",
  position = "center",
  eager = false,
}: {
  src: MockPhotoName;
  alt?: string;
  className?: string;
  sizes?: string;
  position?: string;
  /** Above-the-fold hero photo: load it first (it is often the LCP image). */
  eager?: boolean;
}) {
  return (
    <span className={cn("relative block overflow-hidden", className)}>
      <Image src={`/mock/${src}.jpg`} alt={alt} fill sizes={sizes} priority={eager} className="object-cover" style={{ objectPosition: position }} />
    </span>
  );
}
