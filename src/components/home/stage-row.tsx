import Link from "next/link";
import { cn } from "@/lib/utils";

export type StageRowLink = { label: string; href: string; external?: boolean };

type Icon = "server" | "chat" | "phone" | "shield";

/**
 * One open row: a product surface on a pale tiled stage, and the argument
 * beside it — heading, one paragraph, link rows with a trailing arrow.
 *
 * Replaced OverlapCard on the homepage (2026-10-03). The overlap card put
 * every stage inside a rounded panel, so the page read as a stack of boxes;
 * this sits directly on the section surface and lets the media frame be the
 * only container. `mediaSide` alternates down the page for rhythm.
 *
 * `tone="dark"` is for rows inside a dark band: the stage becomes a faint
 * glass plate and the text tokens switch with it, chosen together here so a
 * call site cannot pair the wrong foreground with the wrong surface.
 */
export function StageRow({
  id,
  icon,
  brandSlot,
  title,
  body,
  links,
  proof,
  media,
  mediaSide = "left",
  tone = "light",
  bareMedia = false,
}: {
  id?: string;
  icon?: Icon;
  /** Replaces the icon tile, for a product with its own mark (ConvoAI). */
  brandSlot?: React.ReactNode;
  title: string;
  body: string;
  links?: readonly StageRowLink[];
  proof?: readonly string[];
  media: React.ReactNode;
  mediaSide?: "left" | "right";
  tone?: "light" | "dark";
  /**
   * Media that brings its own depth (the Build deck of sites) sits straight
   * on the section — no tinted tile plate, which would box it back in.
   */
  bareMedia?: boolean;
}) {
  const dark = tone === "dark";

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
      <div
        className={cn(
          "relative isolate min-w-0",
          !bareMedia && "overflow-hidden rounded-3xl p-4 sm:p-8 lg:p-10",
          !bareMedia && (dark ? "bg-white/[0.04] ring-1 ring-white/10" : "bg-brand-50"),
          mediaSide === "right" && "lg:order-2",
        )}
      >
        {!dark && !bareMedia && (
          <div aria-hidden="true" className="absolute inset-0 -z-10 grid grid-cols-4 grid-rows-3">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className={[1, 4, 6, 11].includes(i) ? "bg-brand-100" : ""} />
            ))}
          </div>
        )}
        {dark && !bareMedia && (
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_30%_20%,rgb(0_0_255/0.35),transparent_70%)]"
          />
        )}
        {media}
      </div>

      <div className={cn("min-w-0 lg:max-w-[460px]", mediaSide === "right" && "lg:order-1 lg:justify-self-end")}>
        {brandSlot ??
          (icon && (
            <span
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-xl",
                dark ? "bg-white/10 text-white" : "bg-brand-50 text-primary",
              )}
            >
              <StageIcon name={icon} />
            </span>
          ))}

        <h2
          id={id}
          className={cn("display-md mt-6", dark ? "text-white" : "text-fg")}
        >
          {title}
        </h2>
        <p className={cn("mt-4 text-body", dark ? "text-fg-on-dark-secondary" : "text-fg-secondary")}>
          {body}
        </p>

        {links && links.length > 0 && (
          <ul className={cn("mt-7 border-t", dark ? "border-line-on-dark" : "border-line")}>
            {links.map((link) => (
              <li key={link.href} className={cn("border-b", dark ? "border-line-on-dark" : "border-line")}>
                <Link
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener" } : {})}
                  className={cn(
                    "group/row flex items-center justify-between gap-4 py-4 text-body-lg transition-colors duration-fast ease-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                    dark
                      ? "text-white hover:text-primary-on-dark focus-visible:outline-white"
                      : "text-fg hover:text-primary focus-visible:outline-primary",
                  )}
                >
                  {link.label}
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 transition-transform duration-fast ease-hover group-hover/row:translate-x-1"
                  >
                    <path
                      d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {proof && proof.length > 0 && (
          <ul className="mt-6 flex flex-col gap-2">
            {proof.map((item) => (
              <li
                key={item}
                className={cn(
                  "flex items-center gap-2 text-small",
                  dark ? "text-fg-on-dark-secondary" : "text-fg-secondary",
                )}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 shrink-0 text-success-fill">
                  <path
                    d="m3.5 8.5 3 3 6-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StageIcon({ name }: { name: Icon }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      {name === "server" && (
        <>
          <rect x="4" y="4" width="16" height="7" rx="1.5" {...common} />
          <rect x="4" y="13" width="16" height="7" rx="1.5" {...common} />
          <path d="M8 7.5h.01M8 16.5h.01" {...common} strokeWidth={2.4} />
        </>
      )}
      {name === "chat" && <path d="M5 6h14v9H9l-4 3V6Z" {...common} />}
      {name === "phone" && (
        <path d="M6.6 4h3l1.5 4-2 1.3a10 10 0 0 0 5.6 5.6l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.6 6.2 2 2 0 0 1 6.6 4Z" {...common} />
      )}
      {name === "shield" && (
        <>
          <path d="M12 3 5 6v5c0 4.4 3 7.9 7 10 4-2.1 7-5.6 7-10V6l-7-3Z" {...common} />
          <path d="m9 12 2 2 4-4.5" {...common} />
        </>
      )}
    </svg>
  );
}
