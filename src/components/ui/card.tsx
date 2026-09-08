import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Card surfaces.
 *
 *   basic       flat, edge-defined. Dense grids where elevation would be noise.
 *   elevated    lifted. Content that should read as a distinct object.
 *   interactive elevated + a hover response. ONLY for cards that are a link.
 *
 * An `interactive` card must contain exactly one <CardLink>, which stretches
 * to cover the card. That keeps the accessible name on the real link and
 * avoids both nested interactive elements and a div with a click handler.
 */

export type CardVariant = "basic" | "elevated" | "interactive";

const VARIANTS: Record<CardVariant, string> = {
  basic: "bg-surface ring-1 ring-line",
  elevated: "bg-surface-elevated shadow-e3 ring-1 ring-line",
  interactive:
    "bg-surface-elevated shadow-e2 ring-1 ring-line transition-shadow duration-normal ease-hover " +
    "hover:shadow-e4 hover:ring-line-strong focus-within:ring-2 focus-within:ring-primary",
};

export function Card({
  children,
  variant = "basic",
  padding = "md",
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "article" | "li" | "section";
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "relative flex flex-col rounded-lg",
        VARIANTS[variant],
        padding === "sm" && "p-4",
        padding === "md" && "p-6",
        padding === "lg" && "p-6 sm:p-8",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * The stretched link for an `interactive` card. The ::after overlay covers the
 * whole card, so the card is clickable while the link text remains its
 * accessible name.
 */
export function CardLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const classes =
    "after:absolute after:inset-0 after:rounded-lg after:content-[''] " +
    "focus-visible:outline-none";
  if (external ?? /^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/**
 * Feature card — an icon, a title, a line of body copy, optionally a link.
 * Generic on purpose: it takes content, not a domain object.
 */
export function FeatureCard({
  icon,
  title,
  children,
  href,
  linkLabel,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  const interactive = Boolean(href);
  return (
    <Card variant={interactive ? "interactive" : "basic"} as="li" padding="md">
      {icon && (
        <span
          aria-hidden="true"
          className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary-soft text-primary"
        >
          {icon}
        </span>
      )}
      <h3 className="text-h4 text-fg">
        {href ? <CardLink href={href}>{title}</CardLink> : title}
      </h3>
      <p className="mt-2 text-small text-fg-secondary">{children}</p>
      {href && linkLabel && (
        <span className="mt-4 text-small font-medium text-primary" aria-hidden="true">
          {linkLabel} →
        </span>
      )}
    </Card>
  );
}

/**
 * Testimonial card. Uses <figure>/<blockquote>/<figcaption> so the attribution
 * is programmatically tied to the quote rather than just sitting near it.
 */
export function TestimonialCard({
  quote,
  author,
  role,
  company,
}: {
  quote: string;
  author: string;
  role?: string;
  company?: string;
}) {
  const attribution = [role, company].filter(Boolean).join(", ");
  return (
    <Card variant="basic" as="li" padding="lg">
      <figure className="flex flex-1 flex-col">
        <blockquote className="flex-1 text-body-lg text-fg">
          <p>{quote}</p>
        </blockquote>
        <figcaption className="mt-6 border-t border-line pt-4">
          <span className="block text-small font-semibold text-fg">{author}</span>
          {attribution && (
            <span className="block text-small text-fg-muted">{attribution}</span>
          )}
        </figcaption>
      </figure>
    </Card>
  );
}
