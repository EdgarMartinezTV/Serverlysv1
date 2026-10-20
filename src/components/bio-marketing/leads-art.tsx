import Image from "next/image";

/**
 * Bento art for "Grow your audience": a real template page, a filled-in
 * contact form, the weekly signup count and the Leads inbox the submission
 * lands in — the whole path from visitor to lead, with nothing left blank.
 * People are Unsplash portraits (public/bio/CREDITS.md); names are invented.
 */
const LEADS = [
  {
    photo: "nina",
    name: "Jamie Ruiz",
    note: "Private event — June 14",
    time: "2m",
    unread: true,
  },
  {
    photo: "leo",
    name: "Sam Okafor",
    note: "Joined the email list",
    time: "1h",
    unread: true,
  },
  {
    photo: "rosa",
    name: "Priya Nair",
    note: "Booking question",
    time: "3h",
    unread: false,
  },
] as const;

export function LeadsArt() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto mt-2 flex w-full max-w-[440px] flex-col gap-3 text-[#101011] sm:relative sm:block sm:h-[480px]"
    >
      {/* The page visitors see */}
      <div className="hidden overflow-hidden rounded-[24px] shadow-e5 sm:absolute sm:top-0 sm:left-0 sm:block sm:h-[230px] sm:w-[47%] sm:-rotate-3">
        <Image
          src="/bio/templates/music-dj.webp"
          alt=""
          width={585}
          height={1140}
          sizes="200px"
          className="h-auto w-full sm:h-full sm:object-cover sm:object-top"
        />
      </div>

      {/* Signups this week */}
      <div className="rounded-[20px] bg-[#ccff00] p-4 shadow-e5 sm:absolute sm:top-0 sm:right-0 sm:w-[49%] sm:rotate-2">
        <div className="flex items-center justify-between">
          <svg
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <span className="rounded-full bg-[#101011] px-2 py-0.5 text-[10px] font-semibold text-white">
            +18%
          </span>
        </div>
        <p className="mt-2 font-display text-[30px] leading-none font-bold">23</p>
        <p className="text-[12px] font-semibold">New signups this week</p>
        <div className="mt-2 flex -space-x-2">
          {["maya", "ari", "leo", "rosa"].map((p) => (
            <Image
              key={p}
              src={`/bio/people/${p}.webp`}
              alt=""
              width={160}
              height={160}
              className="size-7 rounded-full object-cover ring-2 ring-[#ccff00]"
            />
          ))}
          <span className="grid size-7 place-items-center rounded-full bg-[#101011] text-[10px] font-semibold text-white ring-2 ring-[#ccff00]">
            +19
          </span>
        </div>
      </div>

      {/* Filled-in contact form */}
      <div className="rounded-[20px] bg-white p-3.5 text-[12px] shadow-e5 sm:absolute sm:right-0 sm:bottom-0 sm:w-[49%]">
        <p className="text-[14px] font-bold">Get in touch</p>
        <p className="mt-2 text-[10px] font-semibold text-[#5b6472]">Name</p>
        <p className="mt-0.5 rounded-[8px] bg-[#f1f1f3] px-2.5 py-1.5">Jamie Ruiz</p>
        <p className="mt-1.5 text-[10px] font-semibold text-[#5b6472]">Email</p>
        <p className="mt-0.5 truncate rounded-[8px] bg-[#f1f1f3] px-2.5 py-1.5">
          jamie@example.com
        </p>
        <p className="mt-1.5 text-[10px] font-semibold text-[#5b6472]">Message</p>
        <p className="mt-0.5 rounded-[8px] bg-[#f1f1f3] px-2.5 py-1.5 leading-snug">
          Do you play private events? We&apos;re looking at June 14.
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-[10px] text-[#5b6472]">
          <span className="grid size-3.5 place-items-center rounded-[3px] bg-[#0000ff] text-[9px] text-white">
            ✓
          </span>
          I agree to be contacted about this enquiry
        </p>
        <p className="mt-2 rounded-full bg-[#101011] py-2 text-center text-[12px] font-semibold text-white">
          Send message
        </p>
      </div>

      {/* Where it lands: the Leads inbox */}
      <div className="rounded-[20px] bg-[#061433] p-3 text-white shadow-e5 sm:absolute sm:bottom-0 sm:left-0 sm:w-[47%] sm:-rotate-1">
        <div className="flex items-center justify-between px-1">
          <p className="text-[13px] font-bold">Leads</p>
          <span className="rounded-full bg-[#ccff00] px-2 py-0.5 text-[10px] font-semibold text-[#101011]">
            2 new
          </span>
        </div>
        <ul className="mt-2 flex flex-col gap-1.5">
          {LEADS.map((l) => (
            <li
              key={l.name}
              className="flex items-center gap-2.5 rounded-[12px] bg-white/8 px-2 py-1.5"
            >
              <Image
                src={`/bio/people/${l.photo}.webp`}
                alt=""
                width={160}
                height={160}
                className="size-8 shrink-0 rounded-full object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-semibold">
                  {l.name}
                </span>
                <span className="block truncate text-[11px] text-white/70">
                  {l.note}
                </span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1 text-[10px] text-white/60">
                {l.time}
                {l.unread ? (
                  <span className="size-2 rounded-full bg-[#ccff00]" />
                ) : (
                  <span className="size-2" />
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
