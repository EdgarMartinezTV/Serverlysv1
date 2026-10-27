import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { canonical, pageMetadata } from "@/lib/seo";
import { formatMonthly, formatSetup, restaurantPlans, type RestaurantPlanId } from "@/data/restaurant-plans";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { Heading, INK, Label, MUTED, Wrap } from "@/components/retell/kit";
import { PATHS } from "../_i18n";

/**
 * Shared pieces for the restaurant guide pages (online ordering,
 * reservations, cost). Each guide is a child of /restaurant-websites and
 * sends its visitor back there to ask for the free review.
 *
 * These pages are English only. They carry no hreflang alternates because
 * there is no Spanish twin to point at; add one only when a translated route
 * exists. No FAQPage schema either: the FAQ markup lives on the parent page
 * alone, so the guides do not compete with it for the same questions.
 */

export const REVIEW_HREF = `${PATHS.en.landing}#review`;
export const DEMO_HREF = PATHS.en.demo;

/** "$1,299 to set up, then $149.95 a month", from data/restaurant-plans.ts. */
export function planPrice(id: RestaurantPlanId): string {
  const plan = restaurantPlans.find((p) => p.id === id)!;
  return `${formatSetup(plan.setup)} to set up, then ${formatMonthly(plan.monthly)} a month`;
}

/** Schema props shared by the guide Service nodes: national, and part of the parent service. */
export const guideServiceProps = {
  areaServed: { "@type": "Country", name: "United States" },
  isRelatedTo: {
    "@type": "Service",
    "@id": `${canonical(PATHS.en.landing)}#service`,
    name: "Restaurant websites",
    url: canonical(PATHS.en.landing),
  },
};

export function guideMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return pageMetadata({ title, description, path });
}

export function GuideBreadcrumbs({ name, path }: { name: string; path: string }) {
  return (
    <PageBreadcrumbs
      trail={[
        { name: "Home", path: "/" },
        { name: "Restaurant websites", path: PATHS.en.landing },
        { name, path },
      ]}
    />
  );
}

/** A prose section: kit label + heading, then readable paragraphs and lists. */
export function GuideSection({
  id,
  label,
  title,
  tone = "white",
  children,
}: {
  id: string;
  label: string;
  title: string;
  tone?: "white" | "gray";
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={cn("py-20 lg:py-28", tone === "gray" ? "bg-[#f7f7f8]" : "bg-white")}>
      <Wrap className="max-w-[860px]">
        <Label className="text-center">{label}</Label>
        <Heading id={id}>{title}</Heading>
        <div className={cn("mt-10 flex flex-col gap-5 text-[17px] leading-[1.7]", MUTED)}>{children}</div>
      </Wrap>
    </section>
  );
}

export function GuideList({ items }: { items: readonly { title: string; body: React.ReactNode }[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.title} className="rounded-2xl bg-[#f4f4f7] p-5 sm:p-6">
          <h3 className={cn("text-[18px] leading-[1.3] font-semibold", INK)}>{item.title}</h3>
          <p className={cn("mt-2 text-[15px] leading-[1.6]", MUTED)}>{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  const cls = "font-semibold text-primary underline underline-offset-2 hover:no-underline";
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener">
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/**
 * A data table that scrolls sideways on a phone instead of widening the page.
 * `relative` on the scroller keeps the sr-only caption inside it (see the
 * overflow trap noted on /restaurant-websites).
 */
export function GuideTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: readonly string[];
  rows: readonly (readonly React.ReactNode[])[];
}) {
  return (
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      className="relative overflow-x-auto rounded-[20px] bg-white ring-1 ring-black/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <table className="w-full min-w-[620px] border-collapse text-left text-[15px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-black/[0.08]">
            {head.map((h) => (
              <th key={h} scope="col" className="px-5 py-4 text-[13px] font-semibold text-[#5b6472]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-black/[0.06] last:border-b-0">
              {row.map((cell, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className={cn("px-5 py-4 font-semibold", INK)}>
                    {cell}
                  </th>
                ) : (
                  <td key={j} className="px-5 py-4 text-[#2b3442]">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
