import { billing } from "@/data/company";
import { cn } from "@/lib/utils";

/**
 * Domain search.
 *
 * A REAL, working search — a plain GET form submitting straight to the WHMCS
 * cart, which performs the actual availability lookup. No API, no credentials,
 * and no JavaScript required.
 *
 * This is deliberately NOT the previous build's approach, which derived
 * availability from a hash of the query and displayed invented results. The
 * hidden fields below are the WHMCS contract (verified against the live site):
 * changing `a` or `domain` breaks the lookup.
 */
export function DomainSearch({
  tone = "dark",
  size = "lg",
}: {
  tone?: "dark" | "light";
  size?: "md" | "lg";
}) {
  const dark = tone === "dark";

  return (
    <form
      action={`${billing.root}/cart.php`}
      method="GET"
      role="search"
      aria-label="Search for a domain name"
      className="w-full"
    >
      <input type="hidden" name="a" value="add" />
      <input type="hidden" name="domain" value="register" />

      <div
        className={cn(
          "flex flex-col gap-2 rounded-xl p-2 sm:flex-row sm:items-center sm:gap-2",
          dark
            ? "bg-white/[0.06] ring-1 ring-inset ring-white/15 backdrop-blur-sm"
            : "bg-surface shadow-e3 ring-1 ring-line",
        )}
      >
        <label htmlFor="domain-query" className="sr-only">
          Find a domain name
        </label>
        <div className="flex flex-1 items-center gap-2.5 px-3">
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className={cn(
              "h-4.5 w-4.5 shrink-0",
              dark ? "text-fg-on-dark-muted" : "text-fg-muted",
            )}
          >
            <circle
              cx="9"
              cy="9"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="m13.5 13.5 3.5 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <input
            id="domain-query"
            name="query"
            type="text"
            required
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Find your domain name"
            className={cn(
              "w-full bg-transparent text-body outline-none",
              size === "lg" ? "h-12" : "h-11",
              dark
                ? "text-white placeholder:text-fg-on-dark-muted"
                : "text-fg placeholder:text-fg-muted",
            )}
          />
        </div>
        <button
          type="submit"
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-md px-6 font-medium transition-colors duration-fast",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
            size === "lg" ? "h-12 text-body" : "h-11 text-small",
            dark
              ? "bg-white text-fg hover:bg-ink-100 focus-visible:outline-white"
              : "bg-primary text-white hover:bg-primary-hover focus-visible:outline-primary",
          )}
        >
          Search
        </button>
      </div>
    </form>
  );
}
