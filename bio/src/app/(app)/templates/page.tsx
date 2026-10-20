import type { Metadata } from "next";
import Link from "next/link";
import { activeTemplates } from "@/lib/server/templates";
import { TEMPLATE_CATEGORIES } from "@/lib/bio/templates";
import { MiniPreview } from "@/components/bio/mini-preview";
import { GalleryNav } from "@/components/bio/gallery-chrome";
import { getUser } from "@/lib/server/auth";

/**
 * Public template gallery — laid out 1:1 on linktr.ee/s/templates (Edgar,
 * 2026-10-19: "I need the template exactly like this"). Measured at 1440:
 * H1 56/59 bold −1.12 tracking, lede 20/30, sidebar 290 wide at x=72, cards
 * 298×645 (a 390×844 phone at 0.764) in three columns with a 32px gap, name
 * 18/27 under each, page #f3f3f1. Every card is a LIVE render of the real
 * template, not a screenshot.
 */
export const metadata: Metadata = {
  title: "Link in bio templates",
  description: "Free Serverlys Bio templates for creators, restaurants, salons, coaches, stores and more. Pick one and make it yours in minutes.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/templates" },
};

const SCALE = 298 / 390;

export default async function TemplatesGallery({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const [templates, user] = await Promise.all([activeTemplates(), getUser()]);
  const cats = TEMPLATE_CATEGORIES.filter((c) => templates.some((t) => t.category === c.id));
  const active = cats.some((c) => c.id === category) ? category! : "all";
  const shown = active === "all" ? templates : templates.filter((t) => t.category === active);

  return (
    <div className="min-h-dvh bg-[#f3f3f1] text-[#1e2330]">
      <GalleryNav signedIn={Boolean(user)} />
      <main id="main">
        <header className="mx-auto max-w-[840px] px-5 pt-10 pb-12 text-center sm:pt-7">
          <h1 className="font-display text-[36px] leading-[1.06] font-bold tracking-[-0.02em] text-[#1e2330] sm:text-[56px]">A Serverlys Bio template for every brand and creator</h1>
          <p className="mt-6 text-[18px] leading-[28px] tracking-[-0.02em] sm:text-[20px] sm:leading-[30px]">
            Every template is a real, working page with its own photos, fonts and button style. Pick one, swap in your details, and publish free in minutes.
          </p>
        </header>

        <div className="mx-auto flex max-w-[1296px] flex-col gap-10 px-5 pb-24 lg:flex-row lg:gap-12 lg:px-0">
          <aside className="lg:w-[290px] lg:shrink-0">
            <p className="text-[12px] leading-[18px] font-medium tracking-[0.08em] text-[#1e2330]/60 uppercase">Browse by category</p>
            <ul className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
              {[{ id: "all", label: "All templates" }, ...cats].map((c) => {
                const on = c.id === active;
                return (
                  <li key={c.id} className="shrink-0">
                    <Link
                      href={c.id === "all" ? "/templates" : `/templates?category=${c.id}`}
                      scroll={false}
                      aria-current={on ? "page" : undefined}
                      className={`block rounded-full border px-4 py-2.5 text-[16px] leading-[22px] whitespace-nowrap transition-colors ${on ? "border-[#1e2330] bg-[#1e2330] font-medium text-white" : "border-black/10 text-[#1e2330] hover:border-black/30"}`}
                    >
                      {c.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          <ul className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(260px,298px))] justify-center gap-x-8 gap-y-14 lg:justify-start">
            {shown.map((t) => (
              <li key={t.id} className="group relative">
                {/* The preview is a real page full of links, so the card's own link is
                    an overlay sibling — an <a> inside an <a> is invalid HTML. */}
                <div className="overflow-hidden rounded-[44px] transition-transform duration-300 group-hover:-translate-y-1.5">
                  <MiniPreview doc={t.doc} scale={SCALE} height={645} />
                </div>
                <p className="mt-4 text-[18px] leading-[27px] tracking-[-0.02em]">{t.name}</p>
                <Link href={`/templates/${t.id}`} aria-label={`${t.name} template`} className="absolute inset-0 rounded-[44px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1e2330]" />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
