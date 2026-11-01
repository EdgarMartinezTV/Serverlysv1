import { cn } from "@/lib/utils";

/**
 * /business-solutions product screens for the Features block — the whole
 * online side of one demo client, Summit Heating & Air, from one supplier:
 * every service in one account, a lead arriving from the website, and one
 * invoice for all of it. Fully populated on purpose.
 *
 * Decorative: the feature copy beside each screen carries the meaning.
 */

const CLIENT = "Summit Heating & Air";

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-xl bg-white p-4 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.45)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Dot({ tone = "ok" }: { tone?: "ok" | "info" }) {
  return (
    <span
      className={cn(
        "size-2 shrink-0 rounded-full",
        tone === "ok" ? "bg-emerald-500" : "bg-sky-500",
      )}
    />
  );
}

/* ── 1. Everything in one account ───────────────────────────────────────── */

export function AccountMock({ className }: { className?: string }) {
  const rows: [string, string, string, "ok" | "info"][] = [
    ["Website", "summitheatingair.com · 7 pages", "Live", "ok"],
    ["Hosting", "Fast LiteSpeed · daily backups", "Healthy", "ok"],
    ["Domain", "summitheatingair.com · auto-renews Mar 2027", "Active", "ok"],
    ["Business email", "4 mailboxes @summitheatingair.com", "Active", "ok"],
    ["AI chat assistant", "Answered 42 visitors this week", "On", "info"],
    ["Local SEO", "Service-area pages · Google Maps", "Active", "ok"],
  ];
  return (
    <Card className={className}>
      <div className="flex items-center justify-between border-b border-black/[0.07] pb-2.5">
        <div>
          <p className="text-[9.5px] font-semibold tracking-[0.14em] text-primary uppercase">
            Your Serverlys account
          </p>
          <p className="text-[14px] font-semibold text-[#202124]">{CLIENT}</p>
        </div>
        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-700">
          All systems normal
        </span>
      </div>
      <ul className="mt-1">
        {rows.map(([name, detail, status, tone]) => (
          <li
            key={name}
            className="flex items-center gap-3 border-b border-black/[0.04] py-2 last:border-0"
          >
            <Dot tone={tone} />
            <span className="min-w-0 flex-1">
              <span className="block text-[11.5px] font-medium text-[#202124]">
                {name}
              </span>
              <span className="block truncate text-[9.5px] text-[#80868b]">
                {detail}
              </span>
            </span>
            <span className="text-[10px] font-semibold text-[#3c4043]">{status}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 flex items-center justify-between rounded-lg bg-[#f6f7f9] p-2 text-[10.5px] text-[#3c4043]">
        <span>One login · one support team</span>
        <span className="font-semibold text-primary">Open a ticket →</span>
      </p>
    </Card>
  );
}

/* ── 2. A lead, caught and sent on ──────────────────────────────────────── */

export function LeadMock({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      <Card>
        <div className="flex items-center justify-between border-b border-black/[0.07] pb-2.5">
          <p className="text-[13px] font-semibold text-[#202124]">
            Website chat · 9:42 PM
          </p>
          <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[9.5px] font-semibold text-sky-700">
            AI assistant
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-2 text-[11px] leading-snug">
          <p className="max-w-[80%] self-end rounded-2xl rounded-br-md bg-primary px-3 py-2 text-white">
            Our AC stopped blowing cold air. Can someone come tomorrow?
          </p>
          <p className="max-w-[86%] rounded-2xl rounded-bl-md bg-[#f1f3f4] px-3 py-2 text-[#202124]">
            Sorry about that! We have a 10–12 slot tomorrow in Cedar Park. Can I book it
            under your name and number?
          </p>
          <p className="max-w-[80%] self-end rounded-2xl rounded-br-md bg-primary px-3 py-2 text-white">
            Yes, Dana Brooks, (512) 555-0193
          </p>
          <p className="max-w-[86%] rounded-2xl rounded-bl-md bg-[#f1f3f4] px-3 py-2 text-[#202124]">
            Booked: tomorrow 10–12. A technician will text you on the way. ✓
          </p>
        </div>
      </Card>
      <div className="absolute -right-3 -bottom-10 hidden w-[230px] rounded-xl bg-[#111827] p-3 text-white shadow-[0_18px_40px_-8px_rgb(0_0_0/0.45)] sm:block lg:-right-8">
        <p className="flex items-center justify-between text-[10px] text-white/60">
          <span>SMS · new lead</span>
          <span>9:44 PM</span>
        </p>
        <p className="mt-1 text-[11px] leading-snug">
          <span className="font-semibold text-emerald-300">Booked:</span> Dana Brooks,
          AC not cooling, Cedar Park. Tomorrow 10–12. Added to your lead tracker.
        </p>
      </div>
    </div>
  );
}

/* ── 3. One invoice ─────────────────────────────────────────────────────── */

export function InvoiceMock({ className }: { className?: string }) {
  const lines: [string, string][] = [
    ["Pro Contractor Plan · website, hosting, AI chat", "$249.95"],
    ["Business Plus email · 5 mailboxes", "$7.95"],
  ];
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between border-b border-black/[0.07] pb-3">
        <div>
          <p className="text-[9.5px] font-semibold tracking-[0.14em] text-primary uppercase">
            Invoice #10482
          </p>
          <p className="mt-0.5 text-[15px] font-semibold text-[#202124]">
            Serverlys, LLC → {CLIENT}
          </p>
        </div>
        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-700">
          Paid
        </span>
      </div>
      <table className="mt-3 w-full text-[11px]">
        <tbody>
          {lines.map(([d, a]) => (
            <tr key={d} className="border-b border-black/[0.05]">
              <td className="py-2 pr-3 text-[#3c4043]">{d}</td>
              <td className="tabular py-2 text-right font-medium text-[#202124]">
                {a}
              </td>
            </tr>
          ))}
          <tr>
            <td className="pt-2.5 text-[12px] font-semibold text-[#202124]">
              Total this month
            </td>
            <td className="tabular pt-2.5 text-right text-[16px] font-semibold text-[#202124]">
              $257.90
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mt-3 rounded-lg bg-[#f6f7f9] p-2 text-[10.5px] text-[#3c4043]">
        Paid Oct 1 · one supplier, one bill, one support team
      </p>
    </Card>
  );
}
