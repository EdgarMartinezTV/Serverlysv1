import type { Metadata } from "next";
import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { env } from "@/lib/server/env";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { DomainsManager } from "@/components/dashboard/domains-manager";

export const metadata: Metadata = { title: "Domains" };

export default async function DomainsPage() {
  const user = await requireUser("/dashboard/domains");
  const pages = await db.bioPage.findMany({ where: { ownerId: user.id }, select: { id: true, name: true, username: true }, orderBy: { updatedAt: "desc" } });
  const domains = await db.domain.findMany({ where: { page: { ownerId: user.id } }, include: { page: { select: { name: true } } }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageHeader title="Domains" description={`Every page is live at ${env.appUrl.replace(/^https?:\/\//, "")}/username for free. You can also show it on a domain you already own — also free.`} />
      <Body>
        <DomainsManager
          pages={pages}
          targetHost={env.domainTargetHost}
          targetIp={env.domainTargetIp}
          domains={domains.map((d) => ({ id: d.id, hostname: d.hostname, status: d.status, verificationToken: d.verificationToken, lastError: d.lastError, lastCheckedAt: d.lastCheckedAt?.toISOString() ?? null, pageId: d.pageId, pageName: d.page.name }))}
        />
        <section className="card mt-6 p-5 text-small">
          <h2 className="text-h4 font-semibold">How it works</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-fg-secondary">
            <li>Add the domain and the two DNS records shown. The TXT record proves you own it; the CNAME sends visitors to us.</li>
            <li>Click Check. DNS changes usually take minutes, sometimes up to 48 hours. We also re-check automatically.</li>
            <li>Once connected, HTTPS is set up automatically and the domain shows your published page. Your bio.serverlys.com address keeps working and points search engines to your domain.</li>
            <li>Disconnecting stops serving the page on that domain right away. Remove the DNS records at your provider afterwards.</li>
          </ol>
        </section>
      </Body>
    </>
  );
}
