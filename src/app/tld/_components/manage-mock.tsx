import { BrowserFrame } from "@/components/product-ui/frame";
import { Stage } from "../../hosting/_components/band";

/**
 * The domain-management view for one extension: renewal, privacy and the DNS
 * records a new domain usually needs. Same panel grammar as the coded DNS mock
 * on /domain-name (Manage), with the name and the facts swapped per extension.
 *
 * Decorative (BrowserFrame is aria-hidden): every fact shown here is also in
 * the copy beside it. The A record uses a documentation address (RFC 5737).
 */
export function ManageMock({
  slug,
  renew,
  privacy,
}: {
  slug: string;
  /** Formatted renewal price. */
  renew: string;
  /** What the privacy tile says; registry rules differ. */
  privacy: string;
}) {
  const name = `yourname.${slug}`;
  return (
    <Stage>
      <BrowserFrame url="serverlys.com/billing · My domains">
        <div className="flex items-center justify-between border-b border-line-subtle px-5 py-3.5">
          <span className="font-mono text-small font-semibold text-fg">{name}</span>
          <span className="flex items-center gap-1.5 text-micro font-semibold text-success">
            <span className="size-1.5 rounded-full bg-success-fill" /> Active
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 border-b border-line-subtle p-4 text-[11px]">
          {[
            ["Auto-renew", "On"],
            ["Renews at", `${renew}/yr`],
            ["Privacy", privacy],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-canvas-secondary px-3 py-2">
              <p className="text-fg-muted">{k}</p>
              <p className="font-semibold text-fg">{v}</p>
            </div>
          ))}
        </div>
        <div className="p-4">
          <p className="text-small font-semibold text-fg">DNS records</p>
          <table className="mt-3 w-full text-left text-[11px]">
            <thead className="text-fg-muted">
              <tr>
                <th className="pb-2 font-normal">Type</th>
                <th className="pb-2 font-normal">Name</th>
                <th className="pb-2 font-normal">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle text-fg">
              {[
                ["A", "@", "192.0.2.24"],
                ["CNAME", "www", name],
                ["MX", "@", "mail.serverlys.com"],
                ["TXT", "@", "v=spf1 include:serverlys…"],
              ].map(([t, n, v]) => (
                <tr key={t + n}>
                  <td className="py-2">
                    <span className="rounded bg-brand-50 px-1.5 py-0.5 font-semibold text-primary">{t}</span>
                  </td>
                  <td className="py-2">{n}</td>
                  <td className="max-w-[160px] truncate py-2 text-fg-secondary">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BrowserFrame>
    </Stage>
  );
}
