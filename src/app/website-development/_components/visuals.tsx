import Image from "next/image";
import type { WayIcon } from "../_content";

/**
 * Page-specific art.
 *
 * ⚠ THE REFERENCE'S IMAGES ARE NOT USED, and that is not an oversight. Its
 * `card.avif` and `hero.avif` are DreamHost's licensed stock photography and
 * its icon set is DreamHost's artwork. Shipping either would be redistributing
 * another company's licensed files. Same call already made on /cloud-hosting
 * and /ecommerce-hosting: the LAYOUT is cloned, the ART is rebuilt.
 *
 * Everything here is drawn to the measured boxes — 584×359 hero, 640×426 in the
 * "ways" card, 584×479 in the chat band, all at the reference's 16px radius —
 * so the page's rhythm is identical with our own artwork in the slots.
 */

/* ── The twelve capability icons ──────────────────────────────────────────── */

const PATHS: Record<WayIcon, React.ReactNode> = {
  palette: (
    <>
      <path d="M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4-4-7.7-9-7.7Z" />
      <circle cx="7.5" cy="11.5" r="1.1" />
      <circle cx="11" cy="7.5" r="1.1" />
      <circle cx="16" cy="9" r="1.1" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5L14 3Z" />
      <path d="M13.8 3.2v4.3h4.4M8.5 12.5h7M8.5 16h7" />
    </>
  ),
  code: <path d="m9 8-4.5 4L9 16M15 8l4.5 4L15 16" />,
  speed: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="m12 12 3.6-3.6" />
      <circle cx="12" cy="12" r="1.1" />
    </>
  ),
  compress: (
    <>
      <path d="M9.5 3.5v4a2 2 0 0 1-2 2h-4M14.5 3.5v4a2 2 0 0 0 2 2h4M9.5 20.5v-4a2 2 0 0 0-2-2h-4M14.5 20.5v-4a2 2 0 0 1 2-2h4" />
    </>
  ),
  redirect: (
    <>
      <path d="m12 3.2 8.8 8.8L12 20.8 3.2 12 12 3.2Z" />
      <path d="M9.4 13.2v-1.4a1.8 1.8 0 0 1 1.8-1.8h3.4M13.2 8.2l1.8 1.8-1.8 1.8" />
    </>
  ),
  bug: (
    <>
      <path d="M8.5 9.5a3.5 3.5 0 0 1 7 0v4a3.5 3.5 0 0 1-7 0v-4Z" />
      <path d="M12 5.2V3.4M9.6 6.2 8.4 4.9M14.4 6.2l1.2-1.3M8.5 11.5H4.8M19.2 11.5h-3.7M8.5 15l-2.6 2M18.1 17l-2.6-2" />
    </>
  ),
  tools: (
    <>
      <path d="M14.8 4.6a3.6 3.6 0 0 0 4.6 4.6L9.2 19.4l-4.6-4.6L14.8 4.6Z" />
      <path d="m4.6 4.6 4 4M15.4 15.4l4 4" />
    </>
  ),
  wordpress: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M4.2 9.6h4.2l2.6 7.6 1.6-4.4-1.4-3.2h3.4l2.5 7.6 1.6-4.6c.3-.9.4-1.6.4-2.2 0-.5-.1-.9-.3-1.2" />
    </>
  ),
  theme: (
    <>
      <rect x="3.4" y="4.6" width="17.2" height="14.8" rx="2" />
      <path d="M3.4 9.2h17.2M7.4 6.9h.01M10 6.9h.01" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6.2" rx="7.4" ry="2.8" />
      <path d="M4.6 6.2v11.6c0 1.5 3.3 2.8 7.4 2.8s7.4-1.3 7.4-2.8V6.2M4.6 12c0 1.5 3.3 2.8 7.4 2.8s7.4-1.3 7.4-2.8" />
    </>
  ),
};

export function WayIconArt({ name }: { name: WayIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10"
    >
      {PATHS[name]}
    </svg>
  );
}

/* ── Media slots ──────────────────────────────────────────────────────────── */

/**
 * Hero media — the real photograph, 1603×981, in the reference's 584×359 slot.
 *
 * Aspect is 1.634 against the slot's 1.627, so it fills the column with no crop
 * and no distortion: `h-auto w-full` in a 7-column (584px) cell renders 584×357,
 * within 2px of the reference's 359.
 *
 * ⚠ FEATHERED, NOT ROUNDED, and this is a deliberate departure from the
 * reference. Its hero photo is a hard-edged rounded rectangle, which works
 * because the photo is dark and low-contrast at its edges. Ours is a bright
 * office interior, and against a pure-black band a hard edge read as a picture
 * pasted onto the section rather than part of it. The mask below dissolves all
 * four edges into the ground — and because the band is #000 and the mask fades
 * to transparent, what shows through IS the band, so the blend is exact at any
 * viewport rather than a dark gradient approximating it.
 *
 * Two linear gradients composited with `intersect` feather the horizontal and
 * vertical edges independently; a radial mask would pull the corners in far
 * harder than the sides and crop the subject. Safari still needs the
 * `-webkit-` pair, hence both spellings.
 *
 * `priority` because this is the LCP element. Explicit intrinsic width/height
 * are what let Next reserve the box and avoid a layout shift — do not swap
 * them for `fill`.
 */
/**
 * The edge feather shared by every PHOTOGRAPH on this page.
 *
 * A bright photo with a hard rectangular edge on a pure-black band reads as an
 * image pasted onto the section rather than part of it. Fading all four edges
 * to transparent lets the band itself show through, so the blend is exact at
 * any viewport instead of a dark gradient approximating it.
 *
 * Two linear gradients composited with `intersect` feather the horizontal and
 * vertical edges independently — a radial mask pulls the corners in far harder
 * than the sides and crops the subject. Safari still needs the `-webkit-` pair.
 */
export const FEATHER =
  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 7%, #000 16%, #000 86%, rgba(0,0,0,0.6) 95%, transparent 100%), " +
  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 6%, #000 15%, #000 84%, rgba(0,0,0,0.5) 95%, transparent 100%)";

export function HeroArt() {
  return (
    <Image
      src="/Hosting-images/Hero-web-development.png"
      alt="A developer at a desk working on a website, the screen split between the page's code and the finished page rendered beside it"
      width={1603}
      height={981}
      priority
      sizes="(min-width: 1024px) 584px, 100vw"
      className="h-auto w-full"
      style={{
        WebkitMaskImage: FEATHER,
        maskImage: FEATHER,
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    />
  );
}

/**
 * "The Ways We Can Help" media — the real photograph, 1672×941, in the
 * reference's 640×426 slot at its 16px radius. Placed, not feathered.
 *
 * Aspect 1.777 against the slot's 1.502, so `object-cover` trims a little width
 * rather than letterboxing.
 */
export function WaysArt() {
  return (
    <div className="relative aspect-[640/426] w-full overflow-hidden rounded-[1rem]">
      <Image
        src="/Hosting-images/help.png"
        alt="A developer at a laptop surrounded by the work a site needs: the code, the design tools, the live page and its performance scores"
        fill
        sizes="(min-width: 1024px) 640px, 100vw"
        className="object-cover"
      />
    </div>
  );
}

/**
 * "Chat with a Web Expert" media — the real photograph, 1389×1132, in the
 * reference's 584×479 slot at its 16px radius.
 *
 * Aspect 1.227 against the slot's 1.219 — within 1%, so it fills the column
 * with effectively no crop. Placed and rounded, not feathered: this band is
 * offwhite (#f4f6f9), the feather is the hero's black-band treatment, and the
 * reference runs a hard-edged rounded photo here too.
 */
export function ChatArt() {
  return (
    <div className="relative aspect-[584/479] w-full overflow-hidden rounded-[1rem]">
      <Image
        src="/Hosting-images/support-agent.png"
        alt="A support agent wearing a headset, smiling at a laptop while working through a customer's question"
        fill
        sizes="(min-width: 1024px) 584px, 100vw"
        className="object-cover"
      />
    </div>
  );
}

/** The blue opening quote mark, 32×28 in the reference. */
export function QuoteMark() {
  return (
    <svg viewBox="0 0 32 28" aria-hidden="true" className="h-7 w-8 shrink-0" fill="#0073ec">
      <path d="M0 28V15.4C0 6.9 4.4 1.4 13.1 0l1.5 4.2c-4.7 1.2-7 3.7-7 7.5h5.7V28H0Zm17.4 0V15.4c0-8.5 4.4-14 13.1-15.4L32 4.2c-4.7 1.2-7 3.7-7 7.5h5.7V28H17.4Z" />
    </svg>
  );
}

/** Check mark used in the plan rows. */
export function Check() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-[#0073ec]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 8.5 3.2 3.2L13 5" />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 11.3a7.8 7.8 0 0 1-8.4 7.8L6.6 21l1.1-3.6a7.8 7.8 0 1 1 12.8-6.1Z" />
      <path d="M9 10.5h6M9 13.8h4" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.8h17M8 3.5v3M16 3.5v3" />
    </svg>
  );
}



/* ── The three media panels in the "Expert Web Developers" band ───────────────
 *
 * All three are real photographs now, PLACED (rounded, hard-edged) rather than
 * feathered — the feather is the hero's treatment only. The `Panel` wrapper
 * that used to hold the SVG mockups went with them rather than being left
 * behind as dead code.
 *
 * Each uses `fill` + `object-cover` so the media always matches the height of
 * the text card beside it. Those cards grow with their copy, and an `h-auto`
 * image would leave a ragged gap on one side of the row.
 */

/**
 * Row 1 — the real photograph, 1950×807.
 *
 * ⚠ PLACED, NOT FEATHERED — deliberately unlike the hero. Edgar asked for this
 * one to sit as a placed image, which is also what the reference does in this
 * band: a hard-edged rounded rectangle paired with the text card beside it. The
 * `FEATHER` mask is for the hero only.
 *
 * `fill` + `object-cover` rather than intrinsic sizing, so the panel always
 * matches the height of the text card beside it. That card grows with its copy;
 * an `h-auto` image would leave a ragged gap on one side of the row. Aspect is
 * 2.416 against the slot's ~2.37, so `object-cover` trims a sliver of width
 * rather than letterboxing.
 */
export function ManagerArt() {
  return (
    <div className="relative h-full min-h-[17.75rem] w-full overflow-hidden rounded-[1rem]">
      <Image
        src="/Hosting-images/Project-Manager.png"
        alt="A project manager at a desk beside a project timeline, a task list and a team roster"
        fill
        sizes="(min-width: 1024px) 672px, 100vw"
        className="object-cover"
      />
    </div>
  );
}

/**
 * Row 2 — the real photograph, 2172×724. Placed, not feathered, to match its
 * siblings in this band. Its three panels are the same three steps the card
 * lists beside it: submit the request, work happens on a staged copy, approved
 * changes go live.
 */
export function ProcessArt() {
  return (
    <div className="relative h-full min-h-[17.75rem] w-full overflow-hidden rounded-[1rem]">
      <Image
        src="/Hosting-images/simple-development.png"
        alt="Three stages of a change: the request being written, a developer building it, and the approved page live"
        fill
        sizes="(min-width: 1024px) 672px, 100vw"
        /* CONTAIN, not cover — uniquely on this one. The source is 3:1 and this
           row is the tall one (three numbered steps), so `object-cover` scaled
           to fill the height and cropped away ~56% of the width, leaving only
           the middle of a THREE-PANEL sequence visible. The panels are the
           point of the picture, so the whole frame is kept. */
        className="object-contain"
      />
    </div>
  );
}

/**
 * Row 3 — the real photograph, 1774×887. Placed, not feathered.
 *
 * ⚠ THE SOURCE FILENAME CONTAINS A SPACE ("High-Quality-Code .png"), so the
 * src is percent-encoded. Do not "tidy" the %20 out — it must match the file on
 * disk exactly or the optimizer 404s. Renaming the asset would also work; the
 * file is left as supplied.
 */
export function CodeArt() {
  return (
    <div className="relative h-full min-h-[17.75rem] w-full overflow-hidden rounded-[1rem]">
      <Image
        src="/Hosting-images/High-Quality-Code%20.png"
        alt="A developer working across three screens, with the specialists a project draws on shown above: designers, front-end, back-end, UI/UX and QA"
        fill
        sizes="(min-width: 1024px) 672px, 100vw"
        className="object-cover"
      />
    </div>
  );
}

/** The coloured glyph that sits above each of the three card titles, 60px box. */
export function ExpertIcon({ kind }: { kind: "manager" | "process" | "code" }) {
  const common = {
    viewBox: "0 0 40 40",
    "aria-hidden": true as const,
    fill: "none",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-10 w-10",
  };
  if (kind === "manager")
    return (
      <svg {...common} stroke="#a855f7">
        <circle cx="20" cy="13" r="6" />
        <path d="M8 33a12 12 0 0 1 24 0" />
      </svg>
    );
  if (kind === "process")
    return (
      <svg {...common} stroke="#38bdf8">
        <path d="M7 33h26M11 33V21h7v12M22 33V13h7v20" />
      </svg>
    );
  return (
    <svg {...common} stroke="#4ade80">
      <path d="m14 13-8 7 8 7M26 13l8 7-8 7" />
    </svg>
  );
}
