import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/utils";

/**
 * Light hero for the company and resource pages (about, our-process, blog,
 * tutorials, resources, support, faq) — 2026-10-03, in the same grammar as
 * the shared ProductHero: pill label, display heading, one lede, actions,
 * and an optional coded visual on a pale tiled brand stage.
 *
 * Lives in /resources because these pages are the only users; it is not a
 * site-wide primitive.
 */
export function PageHero({
  trail,
  label,
  title,
  lede,
  children,
  visual,
  center = false,
}: {
  trail: ReadonlyArray<{ name: string; href?: string }>;
  label: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  children?: React.ReactNode;
  visual?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-canvas">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_10%,rgb(0_0_255/0.06)_0%,transparent_70%)]"
      />
      <Container className="pb-16 pt-6 sm:pb-20 lg:pb-24 lg:pt-10">
        <Breadcrumbs trail={trail} tone="light" />
        <div
          className={cn(
            "mt-10 grid gap-12",
            Boolean(visual) && "lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16",
          )}
        >
          <div className={cn(!visual && "max-w-3xl", center && !visual && "mx-auto text-center")}>
            <span className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-small font-medium text-primary">
              {label}
            </span>
            <h1 className="display-lg mt-5 text-fg">{title}</h1>
            <div className={cn("mt-5 max-w-xl text-body-lg text-fg-secondary", center && !visual && "mx-auto")}>
              {lede}
            </div>
            {children}
          </div>
          {visual && (
            <div className="relative isolate overflow-hidden rounded-3xl bg-brand-50 p-5 sm:p-8">
              <div aria-hidden="true" className="absolute inset-0 -z-10 grid grid-cols-4 grid-rows-3">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} className={[1, 4, 6, 11].includes(i) ? "bg-brand-100" : ""} />
                ))}
              </div>
              <div
                aria-hidden="true"
                className="absolute top-0 right-[8%] -z-10 h-[30%] w-[40%] bg-brand-300/70 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]"
              />
              <div className="drop-shadow-[0_24px_40px_rgb(0_0_60/0.18)]">{visual}</div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
