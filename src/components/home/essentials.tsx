import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/animations/reveal";
import { resolveNavTarget } from "@/data/routes";
import { cn } from "@/lib/utils";

/**
 * The four things you need to be online.
 *
 * Reproduces the target's 4-up card grid: a visual block on top, a label
 * beneath. Each visual is a distinct composition rather than the same shell
 * recoloured — a repeated frame is what makes a grid read as a template.
 *
 * No photography exists in the brand assets, so these are graphic
 * compositions rather than stock imagery. Real product screenshots would be
 * better and are tracked as an asset gap.
 */
const ITEMS = [
  {
    id: "hosting",
    label: "Hosting",
    detail: "Cloud, WordPress or ecommerce",
    href: "/cloud-hosting",
  },
  {
    id: "domains",
    label: "Domains",
    detail: "Search, register, transfer",
    href: "/register-domain",
  },
  {
    id: "email",
    label: "Business email",
    detail: "At your own domain",
    href: "/managed-hosting",
  },
  {
    id: "migration",
    label: "Free migration",
    detail: "We move it for you",
    href: "/wp-migrations",
  },
] as const;

export function Essentials() {
  return (
    <section
      aria-labelledby="essentials-heading"
      className="bg-canvas-secondary py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="essentials-heading" className="text-h1 text-fg">
            Set up the essentials to go online
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-body-lg text-fg-secondary">
            Four pieces. All included on an annual plan, all handled by the same team.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => {
            const target = resolveNavTarget(item.href);
            return (
              <Reveal as="li" key={item.id} delay={i * 70} className="flex">
                <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-surface shadow-e2 ring-1 ring-line transition-shadow duration-normal ease-hover hover:shadow-e4 focus-within:ring-2 focus-within:ring-primary">
                  <Visual id={item.id} />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-h4 text-fg">
                      <Link
                        href={target.href}
                        className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                      >
                        {item.label}
                      </Link>
                    </h3>
                    <p className="mt-1.5 text-small text-fg-secondary">{item.detail}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

function Visual({ id }: { id: string }) {
  const base = "relative h-40 overflow-hidden";

  if (id === "hosting") {
    return (
      <div aria-hidden="true" className={cn(base, "bg-canvas-abyss")}>
        <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_30%_0%,rgb(34_126_255/0.45)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-grid-dark opacity-70" />
        <div className="absolute inset-x-5 bottom-4 rounded-lg bg-white/10 p-3 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-caption uppercase text-white/70">
              Turbo Cloud
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-success-fill" />
          </div>
          <div className="mt-2 flex h-7 items-end gap-1">
            {[40, 62, 48, 74, 55, 68, 44].map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className="flex-1 rounded-sm bg-cyan-400/70"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (id === "domains") {
    return (
      <div aria-hidden="true" className={cn(base, "bg-primary-soft")}>
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_80%_10%,rgb(34_211_238/0.28)_0%,transparent_70%)]" />
        <div className="absolute inset-x-5 top-6 rounded-lg bg-surface px-3 py-2.5 shadow-e3">
          <p className="font-mono text-caption text-fg-muted">yourbusiness.com</p>
        </div>
        <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-lg bg-success-soft px-3 py-2.5 shadow-e2">
          <span className="font-mono text-caption uppercase text-success">
            Available
          </span>
          <span className="tabular text-small font-semibold text-fg">$14.95</span>
        </div>
      </div>
    );
  }

  if (id === "email") {
    return (
      <div aria-hidden="true" className={cn(base, "bg-canvas-lavender")}>
        <div className="absolute inset-x-5 top-5 flex flex-col gap-2">
          {[
            ["hello@", "Enquiry — new order"],
            ["team@", "Re: delivery window"],
            ["billing@", "Invoice 2041"],
          ].map(([addr, subject], i) => (
            <div
              key={addr}
              className={cn(
                "flex items-center gap-2.5 rounded-lg bg-surface px-3 py-2 shadow-e1",
                i === 0 && "ring-1 ring-primary/30",
              )}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft font-mono text-[0.5rem] text-primary">
                @
              </span>
              <span className="truncate font-mono text-caption text-fg-muted">
                {addr}
              </span>
              <span className="truncate text-caption text-fg-secondary">{subject}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={cn(base, "bg-canvas-tint")}>
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_20%_100%,rgb(20_160_107/0.18)_0%,transparent_70%)]" />
      <div className="absolute inset-x-5 top-6 flex flex-col gap-2">
        {["Old host", "Staging", "Live"].map((label, i) => (
          <div key={label} className="flex items-center gap-2.5">
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-white",
                i < 2 ? "bg-success-fill" : "bg-line-strong",
              )}
            >
              {i < 2 ? (
                <svg viewBox="0 0 16 16" className="h-2.5 w-2.5">
                  <path
                    d="m3.5 8.5 3 3 6-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </span>
            <span className="rounded-md bg-surface px-2.5 py-1 text-caption text-fg-secondary shadow-e1">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="absolute inset-x-5 bottom-4 text-caption text-fg-muted">
        DNS changes only when you say so.
      </p>
    </div>
  );
}
