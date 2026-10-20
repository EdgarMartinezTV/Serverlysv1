import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { activeTemplates } from "@/lib/server/templates";
import { TEMPLATE_CATEGORIES } from "@/lib/bio/templates";
import { GalleryNav } from "@/components/bio/gallery-chrome";
import { getUser } from "@/lib/server/auth";

type Props = { params: Promise<{ id: string }> };

async function find(id: string) {
  return (await activeTemplates()).find((t) => t.id === id) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await find((await params).id);
  return t ? { title: `${t.name} template`, description: t.description, robots: { index: true, follow: true } } : { title: "Template not found" };
}

/** One template: the live page in a phone frame, plus "Use this template". */
export default async function TemplateDetail({ params }: Props) {
  const { id } = await params;
  const [t, user] = await Promise.all([find(id), getUser()]);
  if (!t) notFound();
  const use = user ? `/dashboard/new?template=${t.id}` : `/signup?template=${t.id}`;
  return (
    <div className="min-h-dvh bg-[#f3f3f1] text-[#1e2330]">
      <GalleryNav signedIn={Boolean(user)} />
      <main id="main" className="mx-auto grid max-w-[1100px] items-center gap-12 px-5 py-12 md:grid-cols-[390px_minmax(0,1fr)] md:py-16">
        <div className="mx-auto h-[780px] w-[360px] overflow-hidden rounded-[48px] bg-white shadow-[0_30px_80px_-30px_rgb(0_0_0/0.35)] ring-[10px] ring-[#1e2330] sm:w-[390px]">
          <iframe src={`/t/${t.id}`} title={`${t.name} live preview`} className="h-full w-full border-0" />
        </div>
        <div>
          <Link href="/templates" className="text-[15px] text-[#1e2330]/70 hover:text-[#1e2330]">
            ← All templates
          </Link>
          <p className="mt-6 text-[12px] font-medium tracking-[0.08em] text-[#1e2330]/60 uppercase">{TEMPLATE_CATEGORIES.find((c) => c.id === t.category)?.label}</p>
          <h1 className="mt-2 font-display text-[44px] leading-[1.05] font-bold tracking-[-0.02em] sm:text-[56px]">{t.name}</h1>
          <p className="mt-5 max-w-[460px] text-[18px] leading-[28px]">{t.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={use} className="rounded-full bg-[#1e2330] px-7 py-4 text-[17px] font-medium text-white hover:opacity-90" data-use-template={t.id}>
              Use this template
            </Link>
            <a href={`/t/${t.id}`} target="_blank" rel="noreferrer" className="rounded-full border border-black/15 px-7 py-4 text-[17px] font-medium hover:border-black/40">
              Open full screen
            </a>
          </div>
          <p className="mt-6 text-[15px] text-[#1e2330]/70">Free forever. Change every photo, word, colour and button after you start.</p>
        </div>
      </main>
    </div>
  );
}
