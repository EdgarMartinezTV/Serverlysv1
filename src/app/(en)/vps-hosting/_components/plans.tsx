import { billing } from "@/data/company";
import { cn } from "@/lib/utils";
import { PLANS, PLANS_HEAD } from "../_content";
import { Btn, CenterHead, Icon, SOFT } from "./kit";

/**
 * Plan cards. Reference at 1440: 4 × 328 cards, 16 gap, 40px gutters, 24px
 * padding, badge top-right, name 18/26 semibold, blurb 14/20, a 72px price
 * block, a 48px button, 12/16 fine print, a hairline, four 14/20 spec rows on
 * a 32px pitch and two chips.
 *
 * NOT ON SALE: the price block says "Coming soon" and every button goes to the
 * sales desk. The sizes are PLANNED and labelled so. Do not add a price or a
 * cart link until a WHMCS product exists.
 */
export function Plans() {
  return (
    <section id="plans" aria-labelledby="vps-plans-heading" className="scroll-mt-24 bg-black py-12">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        <CenterHead id="vps-plans-heading" title={PLANS_HEAD.title} />
        <ul className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {PLANS_HEAD.perks.map((p) => (
            <li key={p} className={cn("flex items-center gap-2 text-[16px] leading-6", SOFT)}>
              <Icon.check className="size-4" />
              {p}
            </li>
          ))}
        </ul>

        <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p) => (
            <li
              key={p.name}
              className={cn("flex flex-col rounded-2xl p-6", p.featured ? "bg-[#26262b] ring-1 ring-primary/60" : "bg-[#18181b]")}
            >
              <div className="flex justify-end">
                <span className="rounded-lg bg-primary px-2 py-0.5 text-[12px] leading-4 font-semibold text-white">
                  {p.featured ? PLANS_HEAD.featuredBadge : PLANS_HEAD.badge}
                </span>
              </div>
              <h3 className="mt-2 text-[18px] leading-[26px] font-semibold text-white">{p.name}</h3>
              <p className="mt-1 min-h-10 text-[14px] leading-5 text-white">{p.blurb}</p>

              <div className="mt-4 h-[72px]">
                <p className="pt-2 text-[14px] leading-6 text-[#9d9ea4]">{PLANS_HEAD.priceNote}</p>
                <p className="text-[32px] leading-10 font-semibold text-white">{PLANS_HEAD.price}</p>
              </div>

              <Btn href={billing.sales} tone={p.featured ? "primary" : "outline"} className="mt-6 w-full">
                {PLANS_HEAD.cta}
              </Btn>
              <p className="mt-4 text-[12px] leading-4 text-[#dedee2]">{PLANS_HEAD.fine}</p>

              <hr className="my-6 border-white/10" />
              <ul className="flex flex-col gap-3 text-[14px] leading-5 text-white">
                {(
                  [
                    [Icon.cpu, p.vcpu],
                    [Icon.ram, p.ram],
                    [Icon.disk, p.disk],
                    [Icon.ip, p.extra],
                  ] as const
                ).map(([Ico, label]) => (
                  <li key={label} className="flex items-center gap-2">
                    <Ico className="size-4 text-white/70" />
                    {label}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-2">
                {PLANS_HEAD.chips.map((c) => (
                  <li key={c} className="rounded-md bg-white/10 px-2 py-0.5 text-[14px] leading-5 text-white">
                    {c}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-6 max-w-[883px] border-b border-white/10 pb-8">
          <h3 className={cn("flex items-center gap-4 text-[14px] leading-5", SOFT)}>
            <span className="h-px flex-1 bg-white/10" />
            {PLANS_HEAD.includedTitle}
            <span className="h-px flex-1 bg-white/10" />
          </h3>
          <ul className="mt-8 grid gap-x-6 gap-y-3 px-6 sm:grid-cols-2 md:grid-cols-3">
            {PLANS_HEAD.included.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[14px] leading-5 text-white">
                <Icon.check className="size-4 text-[#4ade80]" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-center text-[14px] leading-5 text-white/60">{PLANS_HEAD.footnote}</p>
      </div>
    </section>
  );
}
