import { billing } from "@/data/company";
import { cn } from "@/lib/utils";

/**
 * Account control. Links to the real WHMCS client area — Serverlys does not
 * hold accounts itself, so this is a handoff, not a menu.
 */
export function AccountButton({ onDark = false }: { onDark?: boolean }) {
  return (
    <a
      href={billing.login}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-fast",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        onDark
          ? "text-fg-on-dark-secondary ring-1 ring-inset ring-white/15 hover:bg-white/10 hover:text-white focus-visible:outline-white"
          : "text-fg-secondary ring-1 ring-inset ring-line hover:bg-canvas-inset hover:text-fg focus-visible:outline-primary",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[1.125rem] w-[1.125rem]"
      >
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 19.5a7 7 0 0 1 14 0" />
      </svg>
      <span className="sr-only">Client login</span>
    </a>
  );
}
