import type { Metadata } from "next";
import { PageHeader, Body } from "@/components/dashboard/page-header";

export const metadata: Metadata = { title: "Help" };

const FAQ: Array<[string, string]> = [
  ["Is Serverlys Bio really free?", "Yes — completely. There is no Pro plan, no trial, no upgrade and no card, ever. Every feature — every template, unlimited links, all 30 block types, full analytics with CSV export, lead forms, QR codes, removing the Serverlys branding and connecting domains you own — is free for everyone. There are no paid tiers and no card is ever asked for."],
  ["How do I publish?", "Open a page in the editor and click Publish. Choose a username; your page goes live at bio.serverlys.com/username instantly. You need a confirmed email address to publish."],
  ["Why don't my edits show on the live page?", "Edits save to a draft automatically. Visitors see the last published version until you click Republish. Use Preview to see the draft."],
  ["How do I reorder links?", "Drag the handle (⋮⋮) in the Links list, or focus the handle and press Space, the arrow keys, then Space again. You can also use the ↑ ↓ buttons on a selected block in the preview."],
  ["Can I schedule a link?", "Yes. Select the block and set “Show from” and/or “Hide after” under Visibility. Times use your device's time zone."],
  ["How is a click counted?", "Every tap on a link, button or social icon on your live page is recorded once. Known bots are excluded. Unique clicks count each visitor once per link per day."],
  ["Do you take payments?", "Not yet. Product and service blocks link to your own checkout (Shopify, Gumroad, Stripe Payment Links, Square…). We show the price you enter; the sale happens on your provider."],
  ["How do I connect my own domain?", "Go to Domains, add the domain, and create the TXT and CNAME records shown at your DNS provider. Once verified, HTTPS is set up automatically."],
  ["I changed my username — what happens to the old link?", "It keeps redirecting to your page for 90 days and nobody else can claim it during that time."],
  ["What files can I upload?", "Images (JPG, PNG, WebP, GIF, AVIF, up to 8 MB — resized and stripped of location data) and downloads (PDF, ZIP, MP3, MP4, EPUB, up to 20 MB). Storage is free; a 2 GB anti-abuse safeguard applies, and we raise it on request."],
  ["How do I report a page?", "Every public page has a “Report this page” link in its footer. You can also email support@serverlys.com."],
];

export default function HelpPage() {
  return (
    <>
      <PageHeader title="Help" description="Answers to common questions. Still stuck? We're a real team." />
      <Body>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="card divide-y divide-line">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-fg">
                  {q}
                  <span aria-hidden="true" className="text-fg-muted transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-body text-fg-secondary">{a}</p>
              </details>
            ))}
          </div>
          <aside className="card h-fit p-5">
            <h2 className="text-h4 font-semibold">Contact support</h2>
            <p className="mt-2 text-small text-fg-secondary">Email us and include your page username.</p>
            <a href="mailto:support@serverlys.com?subject=Serverlys%20Bio%20help" className="btn mt-4 h-10 w-full bg-primary text-small text-white hover:bg-primary-hover">
              support@serverlys.com
            </a>
            <p className="mt-4 text-small text-fg-secondary">
              Abuse or impersonation: <a className="text-primary underline" href="mailto:support@serverlys.com">support@serverlys.com</a>
            </p>
          </aside>
        </div>
      </Body>
    </>
  );
}
