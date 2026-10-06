import Image from "next/image";
import { COVERS } from "@/data/articles/covers";
import { cn } from "@/lib/utils";
import { ArticleThumb } from "./article-thumb";

/**
 * An article's cover: its real photo (public/blog/covers), or the coded
 * category thumbnail if it has none yet. Decorative — the title beside it
 * carries the meaning.
 */
export function ArticleCover({
  slug,
  category,
  className,
  sizes = "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw",
  priority = false,
  size,
}: {
  slug: string;
  category: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  size?: "md" | "lg";
}) {
  if (!COVERS.has(slug)) return <ArticleThumb category={category} size={size} className={className} />;
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-canvas-inset", className)}>
      <Image
        src={`/blog/covers/${slug}.jpg`}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
