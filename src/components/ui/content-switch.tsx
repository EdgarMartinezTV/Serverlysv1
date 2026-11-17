import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The "Tutorials | Blog" segmented switch (the reference's "Tutorials |
 * Learning lab"). It sits on both sides so a reader can always switch back:
 * in the tutorials topic bar, and in its own bar above the blog's categories.
 */
export function ContentSwitch({ active, className }: { active: "tutorials" | "blog"; className?: string }) {
  const items = [
    { key: "tutorials", label: "Tutorials", href: "/tutorials" },
    { key: "blog", label: "Blog", href: "/blog" },
  ] as const;
  return (
    <div className={cn("flex w-full shrink-0 rounded-[10px] bg-[#f2f3f6] p-1 text-[14px] font-semibold text-[#18181a] md:w-auto", className)}>
      {items.map((it) =>
        it.key === active ? (
          <span key={it.key} aria-current="page" className="flex-1 rounded-lg bg-white px-4 py-2 text-center shadow-sm md:flex-none">
            {it.label}
          </span>
        ) : (
          <Link key={it.key} href={it.href} className="flex-1 rounded-lg px-4 py-2 text-center hover:text-primary md:flex-none">
            {it.label}
          </Link>
        ),
      )}
    </div>
  );
}

/** The switch on its own white bar, for pages without a topic bar of their own. */
export function ContentSwitchBar({ active }: { active: "tutorials" | "blog" }) {
  return (
    <nav aria-label="Tutorials and blog" className="border-b border-[#e3e4e8] bg-white font-display">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center px-[10px] md:px-5">
        <ContentSwitch active={active} />
      </div>
    </nav>
  );
}
