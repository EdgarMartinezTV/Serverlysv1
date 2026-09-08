import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/section";
import { billing } from "@/data/company";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Product-fit comparison.
 *
 * Compares Serverlys' OWN range — shared, cloud, VPS, dedicated — rather than
 * competitors. Competitor comparisons on a hosting site are unverifiable,
 * age badly, and read as marketing; helping someone pick the right product
 * (including one we do not sell yet) builds more trust than winning a table.
 *
 * A real <table> with scope-ed headers, wrapped in a focusable, labelled
 * scroll region — the WCAG pattern for content that must scroll horizontally
 * on small screens. Keyboard users can reach and scroll it.
 */
type ColumnKey = "shared" | "cloud" | "vps" | "dedicated";

const COLUMNS: ReadonlyArray<{
  key: ColumnKey;
  name: string;
  href: string;
  available: boolean;
}> = [
  { key: "shared", name: "Shared", href: "/shared-hosting", available: false },
  { key: "cloud", name: "Cloud", href: "/cloud-hosting", available: true },
  { key: "vps", name: "VPS", href: "/vps-hosting", available: false },
  { key: "dedicated", name: "Dedicated", href: "/dedicated-servers", available: false },
];

const ROWS: ReadonlyArray<{ label: string; values: Record<ColumnKey, string> }> = [
  {
    label: "Best for",
    values: {
      shared: "Brochure sites and blogs",
      cloud: "Variable or growing traffic",
      vps: "Custom stacks, root access",
      dedicated: "Sustained heavy load",
    },
  },
  {
    label: "Resources",
    values: {
      shared: "Fixed pool, shared",
      cloud: "Scales with demand",
      vps: "Fixed reservation",
      dedicated: "The whole machine",
    },
  },
  {
    label: "Traffic spikes",
    values: {
      shared: "May throttle",
      cloud: "Absorbed automatically",
      vps: "Fixed ceiling",
      dedicated: "Fixed ceiling",
    },
  },
  {
    label: "Root access",
    values: { shared: "No", cloud: "No", vps: "Yes", dedicated: "Yes" },
  },
  {
    label: "You maintain",
    values: {
      shared: "Nothing",
      cloud: "Nothing",
      vps: "The server",
      dedicated: "The server",
    },
  },
];

export function ProductFit() {
  return (
    <Section labelledBy="fit-heading">
      <SectionHeader
        id="fit-heading"
        eyebrow="Choosing"
        title="When cloud is the right answer — and when it is not"
        lede="Cloud suits sites whose traffic moves. If yours is flat and small, shared is cheaper; if you need root access, a VPS is the better fit. Here is the honest comparison."
      />

      <div
        // Focusable + labelled so keyboard users can scroll the table on
        // narrow viewports. Without tabIndex this region is unreachable.
        tabIndex={0}
        role="region"
        aria-label="Comparison of Serverlys hosting types"
        className="mt-12 -mx-5 overflow-x-auto px-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:mx-0 sm:px-0"
      >
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <caption className="sr-only">
            How Serverlys shared, cloud, VPS and dedicated hosting compare
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-40 pb-4 pr-4 align-bottom">
                <span className="font-mono text-caption uppercase text-fg-muted">
                  Compare
                </span>
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "pb-4 pl-4 pr-4 align-bottom",
                    col.available && "bg-primary-soft",
                  )}
                >
                  <span className="flex flex-col items-start gap-1.5 pt-4">
                    {/* Only link a product whose page actually exists. The
                        unreleased tiers have no page yet, and a link to a 404
                        is worse than plain text. */}
                    {col.available ? (
                      <Link
                        href={col.href}
                        className="rounded-sm text-h4 text-fg transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {col.name}
                      </Link>
                    ) : (
                      <span className="text-h4 text-fg">{col.name}</span>
                    )}
                    {col.available ? (
                      // `success`, not `brand`: the highlighted column is
                      // already primary-soft, so a brand badge's pill would
                      // disappear into it — and availability is a status.
                      <Badge tone="success">Available now</Badge>
                    ) : (
                      <Badge tone="warning">Soon</Badge>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-t border-line">
                <th
                  scope="row"
                  className="py-4 pr-4 align-top text-small font-medium text-fg-secondary"
                >
                  {row.label}
                </th>
                {COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "py-4 pl-4 pr-4 align-top text-small",
                      col.available
                        ? "bg-primary-soft font-medium text-fg"
                        : "text-fg-secondary",
                    )}
                  >
                    {row.values[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-small text-fg-muted">
        Shared, VPS and dedicated are in development and not orderable yet. If one of
        them is what you actually need,{" "}
        <a
          href={billing.sales}
          className="rounded-sm font-medium text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          tell us
        </a>{" "}
        and we will say honestly whether cloud covers it today.
      </p>
    </Section>
  );
}
