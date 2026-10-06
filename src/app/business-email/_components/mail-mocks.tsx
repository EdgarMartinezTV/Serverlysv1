import { cn } from "@/lib/utils";

/**
 * Coded product mockups for /business-email. Decorative (aria-hidden): the
 * copy beside them carries every claim. Addresses use a placeholder business
 * domain, never a real company.
 */

const DOMAIN = "brightleaf.co";

const MAILS = [
  { from: "Sara Okafor", subject: "Logo project: final files delivered", time: "10:42", unread: true, tag: "Clients" },
  { from: "Lucas Taylor", subject: "Re: revised quote for phase 2", time: "09:18", unread: true },
  { from: "Ethan Williams", subject: "Contract signed", time: "Yesterday", star: true },
  { from: "Sophia Johnson", subject: "Landing page feedback", time: "Yesterday" },
  { from: "Liam Davis", subject: "Invoice #1042 paid, thank you", time: "Mon" },
  { from: "Mia Chen", subject: "Can we move Thursday's call?", time: "Mon" },
];

const FOLDERS = [
  { label: "Inbox", count: 2, active: true, d: "M3 13h4l1.5 2h7L17 13h4M3 13l2.5-7h13L21 13v6H3Z" },
  { label: "Drafts", d: "M4 20h4L19 9l-4-4L4 16Z" },
  { label: "Sent", d: "m4 12 16-8-6 16-2.5-6.5Z" },
  { label: "Spam", d: "M12 3 3 20h18ZM12 10v4M12 17h.01" },
  { label: "Trash", d: "M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13" },
];

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-[1.15em]", className)} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/** The hero's webmail window. Scales with its container (cqw units). */
export function InboxMock() {
  return (
    <div aria-hidden="true" className="@container w-full">
      <div className="overflow-hidden rounded-[1.6cqw] bg-white text-[1.55cqw] text-[#1f2430] shadow-[0_40px_80px_-40px_rgb(0_0_255/0.45),0_0_0_1px_rgb(15_23_42/0.06)]">
        {/* Top bar */}
        <div className="flex items-center gap-[1.6cqw] border-b border-[#eef0f4] px-[2cqw] py-[1.4cqw]">
          <span className="flex items-center gap-[0.8cqw] font-semibold">
            <span className="flex size-[3cqw] items-center justify-center rounded-[0.7cqw] bg-primary text-white">
              <Icon d="M3 6h18v12H3ZM3 7l9 6 9-6" />
            </span>
            Mail
          </span>
          <span className="ml-[3cqw] flex flex-1 items-center gap-[0.8cqw] rounded-full bg-[#f3f5f9] px-[1.6cqw] py-[0.8cqw] text-[#8a90a0]">
            <Icon d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14ZM20 20l-4-4" />
            Search mail
          </span>
          <span className="flex size-[3.2cqw] items-center justify-center rounded-full bg-brand-100 text-[1.3cqw] font-semibold text-primary">
            JM
          </span>
        </div>

        <div className="grid grid-cols-[20%_1fr_32%]">
          {/* Folders */}
          <div className="border-r border-[#eef0f4] p-[1.4cqw]">
            <span className="flex items-center justify-center gap-[0.6cqw] rounded-[0.8cqw] bg-primary py-[1cqw] font-semibold text-white">
              <Icon d="M12 5v14M5 12h14" /> New mail
            </span>
            <ul className="mt-[1.4cqw] flex flex-col gap-[0.4cqw]">
              {FOLDERS.map((f) => (
                <li
                  key={f.label}
                  className={cn(
                    "flex items-center gap-[0.8cqw] rounded-[0.7cqw] px-[0.9cqw] py-[0.8cqw]",
                    f.active ? "bg-brand-50 font-semibold text-primary" : "text-[#4b5260]",
                  )}
                >
                  <Icon d={f.d} />
                  <span className="flex-1">{f.label}</span>
                  {f.count && <span className="rounded-full bg-primary px-[0.7cqw] text-[1.2cqw] text-white">{f.count}</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* List */}
          <div className="min-w-0 border-r border-[#eef0f4]">
            <div className="flex items-center gap-[1cqw] px-[1.6cqw] py-[1.2cqw] font-semibold">
              Inbox
              <span className="rounded-full bg-[#f3f5f9] px-[1cqw] py-[0.2cqw] text-[1.25cqw] font-medium text-[#6b7280]">All mail</span>
              <span className="text-[1.25cqw] font-medium text-[#9aa1ad]">Unread</span>
            </div>
            {MAILS.map((m, i) => (
              <div
                key={m.subject}
                className={cn(
                  "border-t border-[#f2f3f6] px-[1.6cqw] py-[1.1cqw]",
                  i === 0 && "bg-brand-50/70 shadow-[inset_3px_0_0_var(--color-primary)]",
                )}
              >
                <div className="flex items-center justify-between gap-[1cqw]">
                  <span className={cn("truncate", m.unread ? "font-semibold" : "text-[#4b5260]")}>{m.from}</span>
                  <span className="shrink-0 text-[1.2cqw] text-[#9aa1ad]">{m.time}</span>
                </div>
                <p className={cn("mt-[0.3cqw] truncate text-[1.35cqw]", m.unread ? "text-[#1f2430]" : "text-[#6b7280]")}>{m.subject}</p>
              </div>
            ))}
          </div>

          {/* Reading pane */}
          <div className="p-[1.6cqw]">
            <p className="font-semibold leading-snug">Logo project: final files delivered</p>
            <div className="mt-[1.2cqw] flex items-center gap-[0.8cqw]">
              <span className="flex size-[2.8cqw] items-center justify-center rounded-full bg-[#fde7d6] text-[1.2cqw] font-semibold text-[#9a4d12]">SO</span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate font-medium">Sara Okafor</span>
                <span className="block truncate text-[1.2cqw] text-[#8a90a0]">to: jordan@{DOMAIN}</span>
              </span>
            </div>
            <div className="mt-[1.4cqw] space-y-[0.7cqw] text-[1.35cqw] leading-relaxed text-[#4b5260]">
              <p>Hi Jordan,</p>
              <p>The final logo files are ready in every format you asked for. Let me know if anything needs a tweak.</p>
              <p>Best, Sara</p>
            </div>
            <div className="mt-[1.4cqw] flex gap-[0.8cqw]">
              <span className="rounded-full bg-primary px-[1.4cqw] py-[0.6cqw] text-[1.25cqw] font-semibold text-white">Reply</span>
              <span className="rounded-full bg-[#f3f5f9] px-[1.4cqw] py-[0.6cqw] text-[1.25cqw] font-semibold text-[#4b5260]">Forward</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Compose window with a branded signature, for the dark "impression" band. */
export function ComposeMock() {
  return (
    <div aria-hidden="true" className="@container relative mx-auto w-full max-w-[760px]">
      <div className="ml-[14%] overflow-hidden rounded-[1.8cqw] bg-white text-[1.7cqw] text-[#1f2430] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.6)]">
        <div className="flex items-center justify-between bg-[#f5f6f9] px-[2.4cqw] py-[1.4cqw] font-semibold">
          New message
          <span className="flex gap-[1.2cqw] text-[#8a90a0]">
            <Icon d="M5 12h14" />
            <Icon d="M6 6l12 12M18 6 6 18" />
          </span>
        </div>
        <div className="divide-y divide-[#f0f1f4] px-[2.4cqw]">
          <p className="flex gap-[1.4cqw] py-[1.2cqw]">
            <span className="w-[9cqw] text-[#8a90a0]">From</span>
            <span className="rounded-full bg-brand-50 px-[1.2cqw] font-medium text-primary">jordan@{DOMAIN}</span>
          </p>
          <p className="flex gap-[1.4cqw] py-[1.2cqw]">
            <span className="w-[9cqw] text-[#8a90a0]">To</span>
            <span>hello@clientstudio.com</span>
          </p>
          <p className="flex gap-[1.4cqw] py-[1.2cqw]">
            <span className="w-[9cqw] text-[#8a90a0]">Subject</span>
            <span className="font-medium">Following up on our proposal</span>
          </p>
        </div>
        <div className="space-y-[1cqw] px-[2.4cqw] py-[2cqw] text-[#4b5260]">
          <p>Hi Alex,</p>
          <p>Thanks for your time yesterday. I have attached the proposal we discussed, with the timeline and pricing for phase one.</p>
          <span className="block h-[1cqw] w-[70%] rounded-full bg-[#eef0f4]" />
          <span className="block h-[1cqw] w-[54%] rounded-full bg-[#eef0f4]" />
        </div>
        <div className="flex items-center gap-[1.6cqw] border-t border-[#f0f1f4] px-[2.4cqw] py-[1.4cqw]">
          <span className="rounded-full bg-primary px-[2.4cqw] py-[0.8cqw] font-semibold text-white">Send</span>
          {["M4 7h16M4 12h10M4 17h7", "M8 12l3 3 5-6", "M21 12a9 9 0 1 1-6.2-8.6M21 4v5h-5"].map((d) => (
            <Icon key={d} d={d} className="text-[#8a90a0]" />
          ))}
        </div>
      </div>

      {/* Signature card, overlapping */}
      <div className="absolute -bottom-[6%] right-[2%] w-[42%] rounded-[1.6cqw] bg-white p-[2cqw] text-[1.5cqw] text-[#1f2430] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.55)]">
        <p className="text-[1.3cqw] font-semibold uppercase tracking-[0.08em] text-[#8a90a0]">Signature</p>
        <div className="mt-[1.2cqw] flex items-center gap-[1.4cqw]">
          <span className="flex size-[6cqw] shrink-0 items-center justify-center rounded-[1.2cqw] bg-gradient-to-br from-[#38b26d] to-[#1f7a4a] text-[2cqw] font-bold text-white">B</span>
          <span className="leading-tight">
            <span className="block font-semibold">Jordan Miles</span>
            <span className="block text-[1.3cqw] text-[#6b7280]">Founder, Brightleaf</span>
            <span className="mt-[0.4cqw] block text-[1.3cqw] font-medium text-primary">{DOMAIN}</span>
          </span>
        </div>
      </div>

      {/* Writing-style chip, overlapping left */}
      <div className="absolute left-0 top-[16%] w-[30%] rounded-[1.6cqw] bg-white p-[1.6cqw] text-[1.4cqw] text-[#1f2430] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.55)]">
        <p className="font-semibold">Your address</p>
        <p className="mt-[0.6cqw] text-[#6b7280]">Every email shows your own domain, not a free provider&apos;s.</p>
        <p className="mt-[1cqw] truncate rounded-[0.8cqw] bg-brand-50 px-[1cqw] py-[0.6cqw] font-medium text-primary">you@{DOMAIN}</p>
      </div>
    </div>
  );
}

/** Three small "where it works" scenes for the apps band. */
export function AppScene({ kind }: { kind: "webmail" | "desktop" | "phone" }) {
  if (kind === "phone") {
    return (
      <div aria-hidden="true" className="mx-auto w-[46%] rounded-[22px] bg-[#0d0d0f] p-[5px]">
        <div className="overflow-hidden rounded-[18px] bg-white pb-3 text-[10px] text-[#1f2430]">
          <div className="flex justify-center py-1.5"><span className="h-3 w-14 rounded-full bg-black" /></div>
          <p className="px-3 text-[13px] font-semibold">Inbox</p>
          {MAILS.slice(0, 4).map((m) => (
            <div key={m.subject} className="mx-2 mt-1.5 rounded-lg bg-[#f5f6f9] px-2 py-1.5">
              <p className="truncate font-semibold">{m.from}</p>
              <p className="truncate text-[#6b7280]">{m.subject}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "desktop") {
    return (
      <div aria-hidden="true" className="mx-auto w-[88%] overflow-hidden rounded-lg bg-white text-[10px] text-[#1f2430] ring-1 ring-black/10">
        <div className="flex gap-1 bg-[#e9ebf0] px-2 py-1.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} className="size-2 rounded-full" style={{ background: c }} />)}
        </div>
        <div className="grid grid-cols-[34%_1fr]">
          <div className="space-y-1 bg-[#f5f6f9] p-2 text-[#4b5260]">
            <p className="font-semibold text-[#1f2430]">jordan@{DOMAIN}</p>
            {["Inbox", "Sent", "Drafts", "Archive"].map((f, i) => (
              <p key={f} className={cn("rounded px-1.5 py-0.5", i === 0 && "bg-brand-100 font-semibold text-primary")}>{f}</p>
            ))}
          </div>
          <div className="divide-y divide-[#f0f1f4]">
            {MAILS.slice(0, 4).map((m) => (
              <div key={m.subject} className="px-2 py-1.5">
                <p className="truncate font-semibold">{m.from}</p>
                <p className="truncate text-[#6b7280]">{m.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div aria-hidden="true" className="mx-auto w-[88%] overflow-hidden rounded-lg bg-white text-[10px] text-[#1f2430] ring-1 ring-black/10">
      <div className="flex items-center gap-2 bg-[#eef0f3] px-2 py-1.5">
        <span className="flex gap-1">{["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} className="size-2 rounded-full" style={{ background: c }} />)}</span>
        <span className="flex-1 truncate rounded bg-white px-2 py-0.5 text-center text-[#6b7280]">mail.{DOMAIN}</span>
      </div>
      <div className="p-2">
        <p className="font-semibold">Webmail</p>
        {MAILS.slice(0, 3).map((m) => (
          <div key={m.subject} className="mt-1.5 flex items-center gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[8px] font-semibold text-primary">{m.from[0]}</span>
            <span className="min-w-0"><span className="block truncate font-semibold">{m.from}</span><span className="block truncate text-[#6b7280]">{m.subject}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}
