import Link from "next/link";
import { billing } from "@/data/company";
import { BANNER } from "../_content";
import { Btn, SOFT, Wrap } from "./kit";

/**
 * Closing banner, reference at 1440: a 1280-wide r24 plate ~348 tall with the
 * brand glow pooled at both sides, 36/44 heading, 16/24 lede (736 cap), a
 * primary 48px button beside a 40px outlined one.
 */
export function Banner() {
  return (
    <section aria-labelledby="vps-banner-heading" className="bg-black py-12">
      <Wrap>
        <div className="flex flex-col items-center rounded-3xl bg-[radial-gradient(45%_90%_at_0%_50%,rgb(0_0_255/0.75),transparent_75%),radial-gradient(45%_90%_at_100%_50%,rgb(0_0_255/0.75),transparent_75%),linear-gradient(#0b0f2a,#0b0f2a)] px-6 py-16 text-center md:px-16 md:py-[72px]">
          <h2 id="vps-banner-heading" className="text-[28px] leading-9 font-normal tracking-[-0.02em] text-white md:text-[36px] md:leading-[44px]">
            {BANNER.title}
          </h2>
          <p className={`mt-6 max-w-[736px] text-[16px] leading-6 ${SOFT}`}>{BANNER.body}</p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <Btn href={billing.sales} tone="primary">
              {BANNER.primary}
            </Btn>
            <Link
              href="/cloud-hosting"
              className="inline-flex h-10 items-center rounded-xl border border-white/90 px-4 text-[16px] leading-6 text-white transition-colors hover:bg-white/10"
            >
              {BANNER.secondary}
            </Link>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
