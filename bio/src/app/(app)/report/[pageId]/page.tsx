import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/server/db";
import { env } from "@/lib/server/env";
import { Logo } from "@/components/ui/logo";
import { ReportForm } from "./report-form";

export const metadata: Metadata = { title: "Report a page", robots: { index: false } };

export default async function ReportPage({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params;
  const page = await db.bioPage.findUnique({ where: { id: pageId }, select: { id: true, username: true, name: true } });
  if (!page) notFound();
  return (
    <main id="main" className="mx-auto max-w-lg px-5 py-12">
      <Logo href={env.marketingUrl} />
      <h1 className="mt-8 text-h3 font-semibold">Report a page</h1>
      <p className="mt-2 text-body text-fg-muted">
        You&apos;re reporting <strong className="text-fg">{env.appUrl.replace(/^https?:\/\//, "")}/{page.username ?? "(unpublished)"}</strong>. Reports are confidential; the page owner isn&apos;t told who reported them.
      </p>
      <div className="mt-8">
        <ReportForm pageId={page.id} />
      </div>
    </main>
  );
}
