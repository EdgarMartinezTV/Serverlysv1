import { Section, SectionHeader } from "@/components/ui/section";

/**
 * What every plan includes.
 *
 * Grouped as "in the box" versus "handled for you", because the two answer
 * different questions: what am I getting, and what will I have to do. A flat
 * feature list makes the buyer do that sorting themselves.
 *
 * Treatment: grouped checklists — distinct from the cards, spec strip and
 * datasheet already used elsewhere, so the page does not read as one repeated
 * pattern.
 *
 * Every item is a capability stated consistently across the live site. Claims
 * that appear there but are NOT carried forward: a 99.9% uptime guarantee and
 * 24/7 support (no SLA or staffing evidence available), and Cloudflare Railgun
 * (retired by Cloudflare — listing it would be inaccurate).
 */
const GROUPS = [
  {
    title: "In the box",
    items: [
      ["Free domain", "For the first year on annual terms."],
      ["Free SSL", "Issued and renewed automatically."],
      ["NVMe storage", "Unlimited, not a tiered allowance."],
      ["Unmetered transfer", "No per-gigabyte overage on a traffic spike."],
      ["cPanel", "The control panel you already know."],
      ["One-click WordPress", "Installed and ready, not a manual upload."],
    ],
  },
  {
    title: "Handled for you",
    items: [
      ["Migration", "We move site, database and email — free."],
      ["Daily backups", "Taken automatically. Restores cost nothing."],
      ["Auto-scaling", "Traffic spikes absorbed without a plan change."],
      ["LiteSpeed cache", "Configured at server level before you arrive."],
      ["Core updates", "WordPress patched for you on managed plans."],
      ["Renewal clarity", "Year-two pricing shown before you check out."],
    ],
  },
] as const;

export function Included() {
  return (
    <Section surface="subtle" labelledBy="included-heading">
      <SectionHeader
        id="included-heading"
        eyebrow="What you get"
        title="Everything, on every tier"
        lede="Tiers differ by resources — not by whether you get the working cache, the fast disks or a real backup. There is no feature paywall here."
      />

      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="border-b border-line pb-4 text-micro text-primary font-semibold">
              {group.title}
            </h3>
            <ul className="mt-6 flex flex-col gap-5">
              {group.items.map(([name, detail]) => (
                <li key={name} className="flex gap-3.5">
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-success-fill"
                  >
                    <path
                      d="m3.5 8.5 3 3 6-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    <span className="block text-body font-medium text-fg">{name}</span>
                    <span className="mt-0.5 block text-small text-fg-secondary">
                      {detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
